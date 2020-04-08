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
  let df s e =
    Math.distance (Math.toFloatPoint (s.x,s.y)) (Math.toFloatPoint (e.x,e.y))
  in
  let goalPoint = { x = ex ; y = ey ; parent = filledRooms } in
  let path =
    RoomAStar.route
      { x = sx ; y = sy ; parent = filledRooms }
      goalPoint
      (df goalPoint) df
  in
  match path with
  | None -> print_endline "route failed"
  | Some p ->
    let path =
      p
      |> List.map (fun (t : roomAStarState) -> (t.x,t.y))
      |> Array.of_list
    in
    Js.log path

let _ = main ()
