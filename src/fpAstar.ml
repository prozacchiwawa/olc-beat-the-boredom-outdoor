open Rooms
open FirstPerson
open Walkpath

module FirstPersonAStar = struct
  type t = minigame
  let blocked (x,y) minigame =
    if x < 0 || x >= boardSize || y < 0 || y >= boardSize then
      true
    else
      Array.get minigame.values ((y * boardSize) + x) <> None
end

module FirstPersonAStarRouter = AStarSpacial(FirstPersonAStar)
