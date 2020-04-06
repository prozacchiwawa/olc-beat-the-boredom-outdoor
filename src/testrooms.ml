open Contypes
open Rooms

let main _ =
  let emptyRooms = emptyRoomDesign 5 in
  let filledRooms = makeRandomBoard boardSize emptyRooms in
  Js.log @@ stringOfRooms filledRooms

let _ = main ()
