open Contypes

type game
  = Wolf
  | Deer

type item
  = Spear

type boardSquare
  = Plant
  | Tree
  | Rock
  | Entrance
  | Exit

type minigame =
  { values : boardSquare option array
  ; actors : game list
  ; objects : item list
  ; playerX : float
  ; playerY : float
  ; playerDir : float
  }

let boardSize = 15
