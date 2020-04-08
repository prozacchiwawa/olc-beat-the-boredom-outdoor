open Contypes

type wolfAttitude
  = WolfScared of float
  | WolfStalk of ((int * int) list * float)
  | WolfAttack

type wolfState =
  { time : float
  ; attitude : wolfAttitude
  }

type game
  = Wolf of wolfState

type activeGame =
  { kind : game
  ; x : float
  ; y : float
  }

type item
  = Spear

type boardSquare
  = Lilypad
  | Plant
  | Tree
  | Rock
  | Entrance
  | Exit
  | Path
  | Water

type displayable
  = Board of boardSquare
  | Actor of game

type gameOutcome =
  { foodAdj : float
  ; win : bool
  }

type path = (int * int) list

type minigame =
  { values : boardSquare option array
  ; roomMap : int IPointMap.t
  ; actors : activeGame list
  ; objects : item list
  ; playerX : float
  ; playerY : float
  ; playerDir : float
  ; score : float
  ; outcome : gameOutcome option
  ; realTime : float
  }

let numAnimals = 6
