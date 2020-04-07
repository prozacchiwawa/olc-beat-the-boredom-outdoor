open Contypes

type game
  = Wolf
  | Deer

type activeGame =
  { kind : game
  ; x : float
  ; y : float
  }

type item
  = Spear

type boardSquare
  = Plant
  | Tree
  | Rock
  | Entrance
  | Exit
  | Path

type gameOutcome =
  { foodAdj : float
  }

type minigame =
  { values : boardSquare option array
  ; actors : activeGame list
  ; objects : item list
  ; playerX : float
  ; playerY : float
  ; playerDir : float
  ; score : float
  ; outcome : gameOutcome option
  }
