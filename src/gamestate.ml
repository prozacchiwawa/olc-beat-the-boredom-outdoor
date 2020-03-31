open Contypes
open Constants
open Weather
open Tod

type know
  = Mineral of (float * float)
  | Plants of (float * float)
  | Herd of string
  | WolfPack of string
  | Den of (float * float)
  | Bandits of string
  | BanditHome of (float * float)

type player =
  { x : float
  ; y : float

  ; food : float
  ; gold : float

  ; knowledge : know list

  ; health : float
  }

let newPlayer () =
  { x = (float_of_int worldSide) /. 2.0
  ; y = (float_of_int worldSide) /. 2.0

  ; food = 1.0
  ; gold = 0.0

  ; knowledge = []

  ; health = 1.0
  }

type gameMode
  = HomeScreen
  | GameOverScreen of float
  | MapScreen
  | CampScreen
  | FirstPerson

type city =
  { x : int
  ; y : int
  ; ruin : float
  ; name : string
  ; population : float
  ; minerals : float
  ; food : float
  }

type workerTarget
  = TargetEntity of string
  | TargetCoords of (float * float)

type worker =
  { id : string
  ; x : float
  ; y : float
  ; health : float
  ; minerals : float
  ; food : float
  ; homeX : int
  ; homeY : int
  ; target : workerTarget
  }

type gamestate =
  { startTime : float
  ; worldTime : float
  ; realTime : float
  ; timeOfDay : float
  ; gameSpeed : float
  ; player : player
  ; mode : gameMode
  ; weather : weather
  ; world : Perlin.ground
  ; paused : bool
  ; keys : StringSet.t
  ; cities : city list
  ; workers : worker list
  }

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

type runCityEffect
  = CityDestroyed of string
  | SpawnWorker of worker

let cityRuinTime = 1.0
let eatingRate = 0.33

(* Advance a city by the time increment, possibly producing an effect. *)
let runCity (_ : gamestate) incT (city : city) =
  if city.ruin > 0.0 then
    let ruined = city.ruin -. incT in
    if ruined <= 0.0 then
      let _ = Js.log @@ Printf.sprintf "destroy city %s" city.name in
      ({ city with ruin = -1.0 }, Some (CityDestroyed city.name))
    else
      ({ city with ruin = ruined }, None)
  else if city.ruin == 0.0 then
    let updatedFood = city.food -. (city.population *. eatingRate) *. incT in
    let cityWithFood = { city with food = updatedFood } in
    if updatedFood < 0.0 then
      let _ = Js.log @@ Printf.sprintf "ruin city %s" city.name in
      ({ cityWithFood with ruin = cityRuinTime }, None)
    else
      (cityWithFood, None)
  else
    (city, None)

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
