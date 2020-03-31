open Constants
open Contypes
open Player

let newPlayer () =
  { x = (float_of_int worldSide) /. 2.0
  ; y = (float_of_int worldSide) /. 2.0

  ; food = 1.0
  ; gold = 0.0

  ; knowledge = []

  ; health = 1.0
  }
