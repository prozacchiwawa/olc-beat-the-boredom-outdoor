open Constants
open Weather
open Player
open Gamestate

let playerMoveRate = 10.0

let getCurrentPlayerMoveRate player =
  let pmr = playerMoveRate *. (if player.injured > 0.0 then 0.5 else 1.0) in
  function
  | Rain -> pmr *. 0.75
  | Snow -> pmr *. 0.3
  | Storm -> pmr *. 0.1
  | Fog -> pmr *. 0.5
  | _ -> pmr

let newPlayer () =
  { x = ((float_of_int worldSide) /. 2.0) +. 0.5
  ; y = ((float_of_int worldSide) /. 2.0) +. 0.5

  ; target = None

  ; food = 1.0
  ; injured = 0.0
  }

let setTargetLocation tgt player = { player with target = Some tgt }

let moveCloserToTarget game incT player =
  match player.target with
  | Some (tx,ty) ->
    let moveRate = getCurrentPlayerMoveRate player game.weather in
    let (newX,newY) = Math.moveToward incT moveRate (tx,ty) (player.x,player.y) in
    let newTarget = 
      if (int_of_float newX, int_of_float newY) = (tx,ty) then
        None
      else
        Some (tx,ty)
    in
    { player with
      x = newX
    ; y = newY
    ; target = newTarget
    ; injured = if game.realTime >= player.injured then 0.0 else player.injured
    }
  | _ -> player
