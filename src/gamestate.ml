open Contypes

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
  { x = 0.0
  ; y = 0.0

  ; food = 1.0
  ; gold = 0.0

  ; knowledge = []

  ; health = 1.0
  }

type gameMode
  = HomeScreen
  | MapScreen
  | CampScreen
  | FirstPerson

type weather
  = Clear
  | Pokkari
  | Overcast
  | Rain
  | Hail
  | Snow
  | Storm
  | Fog

type city =
  { x : float
  ; y : float
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

let midnight = 0.0
let dawn = 0.25
let noon = 0.5
let dusk = 0.75

let timeOfDayFromWorldTime t =
  let currentDay = Util.floor t in
  t -. (float_of_int currentDay)

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

let startGame game =
  { game with mode = MapScreen }

let oneFrame game ts =
  let realTime = ts -. game.startTime in
  let worldTime = realTime /. (game.gameSpeed *. 1000.0) in
  let timeOfDay = timeOfDayFromWorldTime worldTime in
  { game with
    worldTime = worldTime
  ; realTime = realTime
  ; timeOfDay = timeOfDay
  }

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
  | _ ->
    let paused = if spacePressed then not game''.paused else game''.paused in
    let gameWithPause = { game'' with paused = paused } in
    if paused then
      gameWithPause
    else
      oneFrame gameWithPause ts
