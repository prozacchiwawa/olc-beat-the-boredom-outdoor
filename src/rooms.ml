open Constants
open Contypes

let boardSize = 31

type roomDesign =
  { seedSets : IPointSet.t array
  ; wallSet : IPointSet.t
  ; entrance : int * int
  ; exit : int * int
  }

let stringOfRoomIdx x y rooms =
  let ptl =
    rooms.seedSets
    |> Array.to_list
    |> List.mapi
      (fun i s ->
         if IPointSet.mem (x,y) s then
           Some i
         else if IPointSet.mem (x,y) rooms.wallSet then
           Some 99
         else
           None
      )
    |> catOptions
  in
  match ptl with
  | t::_ -> Printf.sprintf "%02d" t
  | _ -> "@@"

let stringOfRooms rooms =
  Math.range 0 boardSize
  |> List.map
    (fun i ->
       Math.range 0 boardSize
       |> List.map (fun x -> stringOfRoomIdx x i rooms)
       |> String.concat ""
    )
  |> String.concat "\n"

let emptyRoomDesign n =
  { seedSets =
      Array.init n
        (fun _ ->
           let i = int_of_float ((Math.random ()) *. (float_of_int (boardSize * boardSize))) in
           IPointSet.add (i mod boardSize, i / boardSize) IPointSet.empty
        )
  ; wallSet = IPointSet.empty
  ; entrance = (0,0)
  ; exit = (0,0)
  }

let cardinalNeighbors px py =
  [ (px-1,py) ; (px+1,py) ; (px,py-1) ; (px,py+1) ]
  |> List.fold_left (fun s p -> IPointSet.add p s) IPointSet.empty

let expandWithNeighbors s =
  IPointSet.fold
    (fun (px,py) -> IPointSet.union (cardinalNeighbors px py)) s s

let limitInsideSquare (boardSize : int) (s : IPointSet.t) : IPointSet.t =
  IPointSet.filter
    (fun (x,y) -> x > 0 && x < boardSize - 1 && y > 0 && y < boardSize - 1)
    s

(* Generate expansions of two point sets with no overlaps. *)
let expandAreas boardSize choice rooms =
  let (r1 : IPointSet.t) = Array.get rooms.seedSets choice in
  let others =
    rooms.seedSets
    |> Array.mapi (fun i v -> if i == choice then None else Some v)
    |> Array.to_list
    |> catOptions
    |> List.fold_left IPointSet.union IPointSet.empty
  in
  let expandedR1 = IPointSet.diff (expandWithNeighbors r1) rooms.wallSet in
  let limitedR1 = limitInsideSquare boardSize expandedR1 in
  let overlap = IPointSet.inter limitedR1 others in
  { rooms with
    seedSets =
      Array.init (Array.length rooms.seedSets)
        (fun n ->
           if n == choice then
             IPointSet.diff limitedR1 overlap
           else
             Array.get rooms.seedSets n
        )
  ; wallSet = IPointSet.union rooms.wallSet overlap
  }

let isBoardFinished boardSize rooms =
  let roomCells =
    Array.fold_left (+) 0 @@
    Array.map IPointSet.cardinal rooms.seedSets
  in
  let wallCells = IPointSet.cardinal rooms.wallSet in
  roomCells + wallCells >= ((boardSize - 2) * (boardSize - 2))

let centerOfRoom room =
  let arrayOfPoints = IPointSet.elements room |> Array.of_list in
  let centerChoice = Array.length arrayOfPoints / 2 in
  if Array.length arrayOfPoints > 0 then
    Some (Array.get arrayOfPoints centerChoice)
  else
    None

let rec emptyCorridor (r1x,r1y) (r2x,r2y) rooms =
  let ws = IPointSet.remove (r1x,r1y) rooms.wallSet in
  if r1x > r2x then
    emptyCorridor (r1x-1,r1y) (r2x,r2y) { rooms with wallSet = ws }
  else if r1x < r2x then
    emptyCorridor (r1x+1,r1y) (r2x,r2y) { rooms with wallSet = ws }
  else if r1y > r2y then
    emptyCorridor (r1x,r1y-1) (r2x,r2y) { rooms with wallSet = ws }
  else if r1y < r2y then
    emptyCorridor (r1x,r1y+1) (r2x,r2y) { rooms with wallSet = ws }
  else
    rooms

let performRoomJoin r1 r2 rooms =
  let r1center = centerOfRoom r1 in
  let r2center = centerOfRoom r2 in
  match (r1center, r2center) with
  | (Some r1center, Some r2center) ->
    emptyCorridor r1center r2center rooms
  | _ -> rooms

let rec joinUpRoomPairs rooms = function
  | [] -> rooms
  | [_] -> rooms
  | r1::r2::tl -> joinUpRoomPairs (performRoomJoin r1 r2 rooms) (r2::tl)

let joinUpRooms rooms =
  let roomList =
    rooms.seedSets
    |> Math.shuffle 2
    |> Array.to_list
  in
  joinUpRoomPairs rooms roomList

let makeBoundarySet boardSize rooms =
  let wallX = Math.range 0 boardSize in
  { rooms with
    wallSet =
      wallX
      |> List.fold_left
        (fun s x ->
           s
           |> IPointSet.add (x,0)
           |> IPointSet.add (x,boardSize - 1)
           |> IPointSet.add (0,x)
           |> IPointSet.add (boardSize - 1,x)
        ) rooms.wallSet
  }

let rec chooseEntranceOrExit x y adj rooms =
  let chosenX = int_of_float @@ (float_of_int boardSize) *. (Math.random ()) in
  let whereToLook = (chosenX,y+adj) in
  let isBlocked = IPointSet.mem whereToLook rooms.wallSet in
  if isBlocked then
    chooseEntranceOrExit ((x+1) mod boardSize) y adj rooms
  else
    (chosenX,y)

(* Make the outer wall and the entrance and exit *)
let surroundRoom boardSize rooms =
  let rooms = makeBoundarySet boardSize rooms in
  (* Find an entrance that isn't next to a wall *)
  let entrance = chooseEntranceOrExit (3 * boardSize / 4) 0 1 rooms in
  (* Find an exit that isn't next to a wall *)
  let exit = chooseEntranceOrExit 1 (boardSize - 1) (-1) rooms in
  (* Cover the boundaries in walls where != entrance and != exit *)
  { rooms with
    entrance = entrance
  ; exit = exit
  }

let rec makeRandomBoard boardSize rooms =
  if not @@ isBoardFinished boardSize rooms then
    let choice =
      int_of_float @@
      (float_of_int (Array.length rooms.seedSets)) *. (Math.random ())
    in
    makeRandomBoard boardSize @@ expandAreas boardSize choice rooms
  else
    surroundRoom boardSize @@ joinUpRooms rooms
