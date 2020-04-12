open Contypes
open Constants
open Gamestate
open Weather
open Tod
open City
open CityMethods
open PlayerMethods

let newGame world =
  let startT = Time.newTime () in
  let startInstant = Time.getTime startT in
  let player = newPlayer () in
  { startTime = startInstant
  ; realTime = 0.0
  ; lastTs = startInstant
  ; worldTime = 0.0
  ; timeOfDay = 0.0
  ; gameSpeed = 12.0 (* Days per second *)
  ; player = player
  ; mode = HomeScreen
  ; weather = Clear
  ; world = world
  ; keys = StringSet.empty
  ; cities = StringMap.empty
  ; workers = StringMap.empty
  ; plants = IPointSet.empty
  ; score = 0
  }
  |> Plants.startPlants 50
  |> Plants.runPlants
  |> Plants.runPlants

let startingCities = 4
let hardTravelDistance = 7.0
let travelFoodGained = 30.0
let foodTransferRate = 100.0
let injuryTime = 0.75

let addCity city game =
  { game with cities = StringMap.add city.name city game.cities }

let rec raiseCity n game =
  if n >= 5 then
    game
  else
    let cx = int_of_float @@ (Math.random ()) *. (float_of_int worldSide) in
    let cy = int_of_float @@ (Math.random ()) *. (float_of_int worldSide) in
    let alreadyHaveCities =
      StringMap.fold (fun _ c s -> IPointSet.add (c.x,c.y) s) game.cities IPointSet.empty
      |> Life.pointsAndNeighbors
    in
    if Plants.temperate game (cx,cy) || IPointSet.mem (cx,cy) alreadyHaveCities then
      let nc = CityMethods.newCity cx cy in
      game |> addCity
        { nc with
          population = 80.0 +. ((Math.random ()) *. 40.0)
        }
    else
      raiseCity (n+1) game

let generateStartCities game =
  let citiesDummy = Array.make startingCities () in
  Array.fold_left (fun game _ -> raiseCity 0 game) game citiesDummy

let startGame game =
  { game with mode = MapScreen Running }
  |> generateStartCities

let gameOverTime = 5000.0

let addWorkerProduct game w =
  try
    let city = StringMap.find w.Worker.home game.cities in
    { game with
      cities = StringMap.add city.name (CityMethods.addWorkerProduct w city) game.cities
    ; workers = StringMap.remove w.name game.workers
    }
  with _ ->
    { game with workers = StringMap.remove w.name game.workers }

let takeWorkerResults game = function
  | Worker.WorkerSucceed w -> addWorkerProduct game w
  | Worker.WorkerMove w ->
    { game with
      workers = StringUpdateMap.go w.name (fun _ -> Some w) game.workers
    }
  | Worker.WorkerDie name ->
    { game with workers = StringMap.remove name game.workers }

let takeCityUpdate game (city,eff) =
  match eff with
  | Some (CityDestroyed name) ->
    { game with cities = StringMap.remove name game.cities }
  | Some (SpawnWorker w) ->
    { game with
      cities = StringUpdateMap.go city.name (fun _ -> Some city) game.cities
    ; workers = StringMap.add w.name w game.workers
    }
  | _ ->
    { game with
      cities = StringUpdateMap.go city.name (fun _ -> Some city) game.cities
    }

let runWeather game =
  let (px,py) = (int_of_float game.player.x,int_of_float game.player.y) in
  let altitude = Array.get game.world.groundData (py * game.world.groundX + px) in
  let altitudeBlock = int_of_float (altitude *. 7.0) in
  let prob = 1.0 -. altitude in
  let stepDownProb = prob *. prob in
  if stepDownProb < (Math.random ()) then
    { game with weather = Weather.stepDownWeather altitudeBlock game.weather }
  else
    { game with weather = Weather.stepUpWeather altitudeBlock game.weather }

let runDayCycle game ts =
  let realTime = game.realTime +. ts in
  let lastWorldTime = game.worldTime in
  let worldTime = realTime /. (game.gameSpeed *. 1000.0) in
  let timeOfDay = timeOfDayFromWorldTime worldTime in
  let newWeatherBlock =
    (int_of_float (worldTime /. Weather.weatherTime)) !=
    (int_of_float (lastWorldTime /. Weather.weatherTime))
  in
  let game =
    if newWeatherBlock && Weather.weatherChangePct < (Math.random ()) then
      runWeather game
    else
      game
  in
  { game with
    worldTime = worldTime
  ; realTime = realTime
  ; timeOfDay = timeOfDay
  }

let offloadFood timeInc game =
  let pt = (int_of_float game.player.x, int_of_float game.player.y) in
  let neighbors = Life.neighbors pt |> Life.pointsAndNeighbors in
  let nearbyCities =
    StringMap.bindings game.cities
    |> List.filter (fun (_,c) -> IPointSet.mem (c.x,c.y) neighbors)
  in
  match nearbyCities with
  | (_,c)::_ ->
    let amountOfFoodToGive = min game.player.food (timeInc *. foodTransferRate) in
    let updatedPlayer =
      { game.player with food = game.player.food -. amountOfFoodToGive }
    in
    let updatedCity = { c with food = c.food +. amountOfFoodToGive } in
    { game with
      player = updatedPlayer
    ; cities = StringUpdateMap.go c.name (fun _ -> Some updatedCity) game.cities
    }
  | _ -> game

let oneFrame game ts =
  let lastWorldTime = game.worldTime in
  let game = runDayCycle game ts in
  let worldTime = game.worldTime in
  let timeInc = worldTime -. lastWorldTime in
  let newWeek =
    (int_of_float (worldTime /. Plants.plantGrowth)) !=
    (int_of_float (lastWorldTime /. Plants.plantGrowth))
  in
  let game = if newWeek then Plants.runPlants game else game in
  (* Run player *)
  let amountOfFoodToGain = timeInc *. travelFoodGained in
  let playerRes =
    PlayerMethods.moveCloserToTarget game timeInc
      { game.player with food = amountOfFoodToGain +. game.player.food }
  in
  (* If player is close enough to city, discharge food *)
  let game = (offloadFood timeInc) { game with player = playerRes } in
  (* Run workers *)
  let workerRes =
    game.workers
    |> StringMap.bindings
    |> List.map (fun (_,w) -> w)
    |> List.map (WorkerMethods.runWorker game timeInc)
  in
  let game = List.fold_left takeWorkerResults game workerRes in
  (* Run cities *)
  let cityRes =
    game.cities
    |> StringMap.bindings
    |> List.map (fun (_,c) -> c)
    |> List.map (runCity game timeInc)
  in
  let game = List.fold_left takeCityUpdate game cityRes in
  if StringMap.cardinal game.cities == 0 then
    { game with mode = GameOverScreen (game.realTime +. gameOverTime) }
  else
    game

let runGame game' keys ts =
  let newlyPressed = StringSet.diff keys game'.keys in
  let spacePressed = StringSet.mem " " newlyPressed in
  let downPressed = StringSet.mem "ARROWDOWN" newlyPressed in
  let upPressed = StringSet.mem "ARROWUP" newlyPressed in
  let leftPressed = StringSet.mem "ARROWLEFT" newlyPressed in
  let rightPressed = StringSet.mem "ARROWRIGHT" newlyPressed in
  let lastTs = game'.lastTs in
  let game = { game' with keys = keys ; lastTs = ts } in
  match game.mode with
  | HomeScreen ->
    if spacePressed then
      startGame game
    else
      game
  | GameOverScreen _ ->
    if spacePressed then
      startGame game
    else
      game
  | MapScreen (MiniVictory t) ->
    let realTime = game.realTime +. (ts -. lastTs) in
    if realTime > t then
      { game with mode = MapScreen Running }
    else
      { game with realTime = realTime }
  | MapScreen (MiniDefeat t) ->
    let realTime = game.realTime +. (ts -. lastTs) in
    if realTime > t then
      { game with mode = MapScreen Running }
    else
      { game with realTime = realTime }
  | MapScreen (PauseMenu choice) ->
    if spacePressed then
      match choice with
      | Resume -> { game with mode = MapScreen Running }
      | ChooseLocation ->
        let pt =
          match game.player.target with
          | Some pt -> pt
          | None -> (int_of_float game.player.x, int_of_float game.player.y)
        in
        { game with mode = MapScreen (ChoosingLocation pt) }
      | Encounter ->
        let px = int_of_float game.player.x in
        let py = int_of_float game.player.y in
        let altitude = Array.get game.world.groundData (py * game.world.groundX + px) in
        let altitudeBlock = int_of_float (altitude *. 7.0) in
        { game with
          mode = FirstPerson (FirstPersonMethods.makeMazeDef altitudeBlock ts)
        }
    else
      let f =
        if downPressed then Math.nextOf else if upPressed then Math.prevOf else (fun a _ -> a)
      in
      let newMode = f choice menuChoices in
      let newMode =
        if newMode == Encounter && game.player.target == None then
          f newMode menuChoices
        else
          newMode
      in
      { game with mode = MapScreen (PauseMenu newMode) }

  | MapScreen (ChoosingLocation (lx,ly)) ->
    if spacePressed then
      { game with
        player = PlayerMethods.setTargetLocation (lx,ly) game.player ;
        mode = MapScreen Running
      }
    else
      let diffY = if upPressed then -1 else if downPressed then 1 else 0 in
      let diffX = if leftPressed then -1 else if rightPressed then 1 else 0 in
      let newLX = min (worldSide - 1) (max (lx + diffX) 0) in
      let newLY = min (worldSide - 1) (max (ly + diffY) 0) in
      { game with mode = MapScreen (ChoosingLocation (newLX,newLY)) }
  | MapScreen Running ->
    if spacePressed then
      { game with mode = MapScreen (PauseMenu Resume) }
    else
      oneFrame game (ts -. lastTs)
  | FirstPerson mg ->
    let downPressed = if StringSet.mem "ARROWDOWN" keys then -1.0 else 0.0 in
    let upPressed = if StringSet.mem "ARROWUP" keys then 1.0 else 0.0 in
    let leftPressed = if StringSet.mem "ARROWLEFT" keys then -1.0 else 0.0 in
    let rightPressed = if StringSet.mem "ARROWRIGHT" keys then 1.0 else 0.0 in
    let moveAmt = downPressed +. upPressed in
    let rotAmt = leftPressed +. rightPressed in
    match (mg.outcome, game.player.target) with
    | (Some o, Some (tx,ty)) ->
      let (dtx,dty) = ((float_of_int tx) +. 0.5, (float_of_int ty) +. 0.5) in
      let distance = Math.distance (dtx,dty) (game.player.x,game.player.y) in
      let (tx,ty) =
        if distance <= hardTravelDistance then
          (dtx,dty)
        else
          let (dx,dy) = (dtx -. game.player.x, dty -. game.player.y) in
          let (nx,ny) =
            (dx *. hardTravelDistance /. distance, dy *. hardTravelDistance /. distance)
          in
          (game.player.x +. nx,game.player.y +. ny)
      in
      let newPlayer =
        { game.player with
          food = max 0.0 (game.player.food +. o.foodAdj)
        ; injured = if o.win then 0.0 else game.realTime +. injuryTime
        ; x = if o.win then tx else game.player.x
        ; y = if o.win then ty else game.player.y
        }
      in
      let gt = (game.realTime +. 500.0) in
      { game with
        mode =
          if o.win then
            MapScreen (MiniVictory gt)
          else
            MapScreen (MiniDefeat gt)
      ; player = newPlayer
      }
    | _ ->
      let minigame = FirstPersonMethods.oneFrame ts moveAmt rotAmt spacePressed mg in
      { game with mode = FirstPerson minigame }
