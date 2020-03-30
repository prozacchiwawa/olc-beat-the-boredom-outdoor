open Contypes

type animalBase
  = PoisonSnake
  | SafeSnake
  | Rodent
  | Bird
  | Dog
  | Cat
  | Predator

type animal =
  { base : animalBase
  ; name : string
  ; aggression : float
  ; tame : float
  }

type fruitData =
  { citrus : bool
  ; pulpRatio : float
  ; juiceRatio : float
  ; name : string
  }

type foodItemBase
  = Meat of animal
  | WildGreens of string
  | Legumes of string
  | Berries of string
  | Fruit of fruitData

type foodItem =
  { base : foodItemBase
  ; age : float
  ; spoilage : float
  ; amount : float
  }

type drinkBase
  = Water of float
  | Juice of fruitData
  | Blood of animal

type basicDrinkable =
  { base : drinkBase
  ; amount : float
  }

type drinkMix =
  { mixedAmount : float
  ; mixedWith : basicDrinkable
  }

type drinkable
  = Single of basicDrinkable
  | Mixture of drinkMix list

type item
  = Pick
  | Knife
  | Lantern
  | Bag of item list
  | Drink of drinkable
  | Food of foodItem
  | MortarAndPestle
  | ClosedVessel of drinkable option
  | OpenVessel

type microbe =
  { name : string
  ; pain : float
  ; slowdown : float
  ; lungs : float
  ; stomach : float
  ; fatigue : float
  }

type playerHealth =
  { sleep : float
  ; thirst : float
  ; hunger : float
  ; microbe : microbe option
  }

type player =
  { x : float
  ; y : float

  ; inventory : item list

  ; health : playerHealth
  }

let newPlayer () =
  { x = 0.0
  ; y = 0.0
  ; inventory = []
  ; health = { sleep = 1.0 ; thirst = 0.0 ; hunger = 0.0 ; microbe = None }
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
  }

let startGame game =
  { game with mode = MapScreen }

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
      let realTime = ts -. game''.startTime in
      let worldTime = realTime /. (game''.gameSpeed *. 1000.0) in
      let timeOfDay = timeOfDayFromWorldTime worldTime in
      { gameWithPause with
        worldTime = worldTime
      ; realTime = realTime
      ; timeOfDay = timeOfDay
      ; paused = paused
      }
