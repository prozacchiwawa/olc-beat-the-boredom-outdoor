open Astar

module type AStarSpacialState = sig
  type t
  val blocked : (int * int) -> t -> bool
end

module AStarSpacial(O : AStarSpacialState) = struct
  type aStarState =
    { x : int
    ; y : int
    ; parent : O.t
    }

  module AStarOrd = struct
    type t = aStarState
    let compare a b = Pervasives.compare (a.x,a.y) (b.x,b.y)
    let win a b = (a.x,a.y) = (b.x,b.y)
    let infinity = 1000000.0
    let neighbors (t : t) =
      let (x,y) = (t.x,t.y) in
      [(x,y+1);(x,y-1);(x+1,y);(x-1,y);(x-1,y-1);(x+1,y-1);(x-1,y+1);(x+1,y+1)]
      |> List.filter (fun (x,y) -> not @@ O.blocked (x,y) t.parent)
      |> List.map (fun (x,y) -> { t with x = x ; y = y })
  end

  module AStar = Astar.Make(AStarOrd)

  let makePath (context : O.t) (sx,sy) (ex,ey) =
    let df s e =
      Math.distance (Math.toFloatPoint (s.x,s.y)) (Math.toFloatPoint (e.x,e.y))
    in
    let goalPoint = { x = ex ; y = ey ; parent = context } in
    let path =
      AStar.route
        { x = sx ; y = sy ; parent = context }
        goalPoint
        (df goalPoint) df
    in
    match path with
    | None -> None
    | Some p ->
      let path =
        p
        |> List.map (fun (t : aStarState) -> (t.x,t.y))
        |> Array.of_list
      in
      Some path
end
