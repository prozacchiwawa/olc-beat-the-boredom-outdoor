open Constants
open Contypes
open Weather
open Player
open Gamestate

let playerMoveRate = 10.0

let getCurrentPlayerMoveRate = function
  | Rain -> playerMoveRate *. 0.75
  | Snow -> playerMoveRate *. 0.3
  | Storm -> playerMoveRate *. 0.1
  | Fog -> playerMoveRate *. 0.5
  | _ -> playerMoveRate

let newPlayer () =
  { x = ((float_of_int worldSide) /. 2.0) +. 0.5
  ; y = ((float_of_int worldSide) /. 2.0) +. 0.5

  ; target = (worldSide / 2, worldSide / 2)

  ; food = 1.0
  ; gold = 0.0

  ; knowledge = []

  ; health = 1.0
  }

let setTargetLocation tgt player = { player with target = tgt }

let moveCloserToTarget game incT player =
  let moveRate = getCurrentPlayerMoveRate game.weather in
  let (newX,newY) = Math.moveToward incT moveRate player.target (player.x,player.y) in
  { player with x = newX ; y = newY }
