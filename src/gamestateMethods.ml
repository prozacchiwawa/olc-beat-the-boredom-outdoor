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
  }
  |> Plants.startPlants 50
  |> Plants.runPlants
  |> Plants.runPlants

let startingCities = 4

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

let oneFrame game ts =
  let realTime = game.realTime +. ts in
  let lastWorldTime = game.worldTime in
  let worldTime = realTime /. (game.gameSpeed *. 1000.0) in
  let timeOfDay = timeOfDayFromWorldTime worldTime in
  let timeInc = worldTime -. game.worldTime in
  let newWeek =
    (int_of_float (worldTime /. Plants.plantGrowth)) !=
    (int_of_float (lastWorldTime /. Plants.plantGrowth))
  in
  let game =
    { game with
      worldTime = worldTime
    ; realTime = realTime
    ; timeOfDay = timeOfDay
    }
  in
  let game = if newWeek then Plants.runPlants game else game in
  (* Run player *)
  let playerRes = PlayerMethods.moveCloserToTarget game timeInc game.player in
  let game = { game with player = playerRes } in
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
  | GameOverScreen endGameOver ->
    let realTime = game.realTime +. (ts -. lastTs) in
    if realTime > endGameOver then
      { game with mode = HomeScreen ; realTime = realTime }
    else
      game
  | MapScreen (PauseMenu choice) ->
    if spacePressed then
      match choice with
      | Resume -> { game with mode = MapScreen Running }
      | ChooseLocation ->
        { game with
          mode =
            MapScreen
              (ChoosingLocation (int_of_float game.player.x, int_of_float game.player.y))
        }
      | Encounter -> { game with mode = FirstPerson }
      | Camp -> { game with mode = CampScreen }
    else if downPressed then
      { game with mode = MapScreen (PauseMenu (Math.nextOf choice menuChoices)) }
    else if upPressed then
      { game with mode = MapScreen (PauseMenu (Math.prevOf choice menuChoices)) }
    else
      game
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
  | CampScreen ->
    if spacePressed then
      { game with mode = MapScreen Running }
    else
      game
  | FirstPerson ->
    if spacePressed then
      { game with mode = MapScreen Running}
    else
      game
