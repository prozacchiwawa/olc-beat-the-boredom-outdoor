open Constants
open Contypes

(* RIP John Conway *)
let neighbors (px,py) =
  [ (px+1,py) ; (px-1,py) ; (px,py+1) ; (px,py-1)
  ; (px+1,py+1) ; (px-1,py+1) ; (px+1,py-1) ; (px-1,py-1)
  ]
  |> List.filter (fun (x,y) -> x >= 0 && x < worldSide && y >= 0 && y < worldSide)
  |> List.fold_left (fun s p -> IPointSet.add p s) IPointSet.empty

let pointsAndNeighbors ps =
  IPointSet.elements ps
  |> List.fold_left (fun s p -> IPointSet.union (neighbors p) s) ps

let run set =
  pointsAndNeighbors set
  |> IPointSet.filter
    (fun (x,y) ->
       let activeNeighbors = IPointSet.inter (neighbors (x,y)) set in
       let cardinal = IPointSet.cardinal activeNeighbors in
       (IPointSet.mem (x,y) set && cardinal == 2) || cardinal == 3
    )
