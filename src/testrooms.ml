open Contypes
open Rooms
open Astar

let rec chooseRandomUnblockedPoint rooms =
  let idx = int_of_float ((float_of_int (boardSize * boardSize)) *. (Math.random ())) in
  let (x,y) = (idx mod boardSize, idx / boardSize) in
  if IPointSet.mem (x,y) rooms.wallSet then
    chooseRandomUnblockedPoint rooms
  else
    (x,y)

let main _ =
  let emptyRooms = emptyRoomDesign 5 in
  let filledRooms = makeRandomBoard boardSize emptyRooms in
  let _ = Js.log @@ stringOfRooms filledRooms in
  let (sx,sy) = chooseRandomUnblockedPoint filledRooms in
  let (ex,ey) = chooseRandomUnblockedPoint filledRooms in
  let path = makeRoomPath filledRooms (sx,sy) (ex,ey) in
  Js.log path

let _ = main ()
