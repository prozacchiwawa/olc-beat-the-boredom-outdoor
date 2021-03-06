open Contypes
open Rooms
open Animal

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

type arrowState =
  { xi : float
  ; yi : float
  ; arrowX : float
  ; arrowY : float
  ; endTime : float
  }

type displayable
  = Board of boardSquare
  | Missile
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
  ; worldTime : float
  ; arrow : arrowState option
  }

let numWolves = 3
let numDeer = 10

let arrowSpeed = 15.0
let arrowTime = 0.6

let rec chooseRandomEmpty minigame =
  let squareChoice =
    int_of_float @@ (float_of_int (boardSize * boardSize)) *. (Math.random ())
  in
  let choiceAtN = Array.get minigame.values squareChoice in
  if choiceAtN <> None then
    chooseRandomEmpty minigame
  else
    let x = (float_of_int (squareChoice mod boardSize)) +. 0.5 in
    let y = (float_of_int (squareChoice / boardSize)) +. 0.5 in
    (x,y)
