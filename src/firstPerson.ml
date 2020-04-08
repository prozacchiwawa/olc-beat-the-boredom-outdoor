open Contypes

type wolfAttitude
  = WolfScared
  | WolfStalk
  | WolfAttack

type fpDirection = NW | N | NE | E | SE | S | SW | W

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
  ; towardExit : fpDirection option array
  ; roomMap : int IPointMap.t
  ; towardRoom : path IPointMap.t
  ; actors : activeGame list
  ; objects : item list
  ; playerX : float
  ; playerY : float
  ; playerDir : float
  ; score : float
  ; outcome : gameOutcome option
  }

let numAnimals = 6
