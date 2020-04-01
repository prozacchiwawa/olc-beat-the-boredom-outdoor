open Contypes
open Constants
open Gamestate
open Weather
open Tod
open Gamestate
open City
open CityMethods
open Player
open PlayerMethods

let newGame world =
  let startT = Time.newTime () in
  let startInstant = Time.getTime startT in
  let player = newPlayer () in
  { startTime = startInstant
  ; realTime = startInstant
  ; worldTime = 0.0
  ; timeOfDay = 0.0
  ; gameSpeed = 12.0 (* Days per second *)
  ; player = player
  ; mode = HomeScreen
  ; weather = Clear
  ; world = world
  ; paused = true
  ; keys = StringSet.empty
  ; cities = StringMap.empty
  ; workers = StringMap.empty
  ; known = IPointMap.empty
  ; plants = IPointSet.empty
  }

let startingCities = 4

let generateStartCities game =
  let cities =
    Array.init
      startingCities
      (fun _ ->
         let cx = (Math.random ()) *. (float_of_int worldSide) in
         let cy = (Math.random ()) *. (float_of_int worldSide) in
         { x = int_of_float cx
         ; y = int_of_float cy
         ; ruin = 0.0
         ; name = Namegen.generateRandomName 3
         ; population = 80.0 +. ((Math.random ()) *. 40.0)
         ; minerals = 10.0
         ; food = 100.0
         }
      )
  in
  { game with
    cities =
      Array.fold_left (fun m c -> StringMap.add c.name c m) StringMap.empty cities
  }

let startGame game =
  { game with mode = MapScreen }
  |> generateStartCities

let gameOverTime = 5000.0

let addWorkerProduct game w =
  try
    let city = StringMap.find w.Worker.home game.cities in
    { game with
      cities =
        StringMap.add
          city.name
          { city with
            food = city.food +. w.food
          ; minerals = city.minerals +. w.minerals
          }
          game.cities
    ; workers = StringMap.remove w.name game.workers
    }
  with _ ->
    { game with workers = StringMap.remove w.name game.workers }

let takeWorkerResults game = function
  | Worker.WorkerSucceed w -> addWorkerProduct game w
  | Worker.WorkerMove w ->
    { game with workers = StringUpdateMap.go w.name (fun _ -> Some w) game.workers }
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
  let realTime = ts -. game.startTime in
  let worldTime = realTime /. (game.gameSpeed *. 1000.0) in
  let timeOfDay = timeOfDayFromWorldTime worldTime in
  let timeInc = worldTime -. game.worldTime in
  let game =
    { game with
      worldTime = worldTime
    ; realTime = realTime
    ; timeOfDay = timeOfDay
    }
  in
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
  let game'' = { game' with keys = keys } in
  match game''.mode with
  | HomeScreen ->
    if spacePressed then
      startGame game''
    else
      game''
  | GameOverScreen endGameOver ->
    let realTime = ts -. game''.startTime in
    if realTime > endGameOver then
      { game'' with mode = HomeScreen }
    else
      game''
  | _ ->
    let paused = if spacePressed then not game''.paused else game''.paused in
    let gameWithPause = { game'' with paused = paused } in
    if paused then
      gameWithPause
    else
      oneFrame gameWithPause ts
