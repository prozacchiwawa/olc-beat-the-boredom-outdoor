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
  ; gameSpeed : float
  ; player : player
  ; mode : gameMode
  ; weather : weather
  }

let midnight = 0.0
let dawn = 0.25
let noon = 0.5
let dusk = 0.75

let timeOfDayFromWorldTime t =
  let currentDay = Util.floor t in
  t -. (float_of_int currentDay)

let newGame () =
  let startT = Time.newTime () in
  let startInstant = Time.getTime startT in
  { startTime = startInstant
  ; realTime = startInstant
  ; worldTime = 0.0
  ; gameSpeed = 3.0 (* Days per second *)
  ; player = newPlayer ()
  ; mode = HomeScreen
  ; weather = Clear
  }

let runGame game keys ts =
  let realTime = ts -. game.startTime in
  { game with
    worldTime = realTime /. (game.gameSpeed *. 1000.0)
  ; realTime = realTime
  }
