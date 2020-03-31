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
  ; cities = []
  ; workers = []
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
    cities = Array.to_list cities
  }

let startGame game =
  { game with mode = MapScreen }
  |> generateStartCities

let gameOverTime = 5000.0

let takeCityEffect game = function
  | CityDestroyed name ->
    { game with cities = game.cities |> List.filter (fun c -> c.name <> name) }
  | SpawnWorker w -> { game with workers = w :: game.workers }

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
  let cityRes = game.cities |> List.map (runCity game timeInc) in
  let updCities = cityRes |> List.map (fun (c,_) -> c) in
  let cityEffects = cityRes |> List.map (fun (_,e) -> e) |> catOptions in
  let game = cityEffects |> List.fold_left takeCityEffect { game with cities = updCities } in
  if List.length game.cities == 0 then
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
