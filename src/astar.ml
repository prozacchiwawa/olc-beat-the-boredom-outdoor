module type AstarOrd = sig
  type t
  val compare : t -> t -> int
  val win : t -> t -> bool
  val infinity : float
  val neighbors : t -> t list
end

module Make(L : AstarOrd) = struct
  module Set = Set.Make(L)
  module Map = Map.Make(L)
  module Update = Contypes.UpdateMap(L)

  type t =
    { openSet : Set.t
    ; closeSet : Set.t
    ; cameFrom : L.t Map.t
    ; gScore : float Map.t
    ; fScore : float Map.t
    }

  let lookupCameFrom state at =
    try
      Some (Map.find at state.cameFrom)
    with _ -> None

  let rec reconstructPath_ state at =
    match lookupCameFrom state at with
    | None -> []
    | Some from -> from::(reconstructPath_ state from)

  let reconstructPath state at = at::(reconstructPath_ state at)

  let emptyState start h =
    { openSet = Set.add start Set.empty
    ; closeSet = Set.empty
    ; cameFrom = Map.empty
    ; gScore = Map.add start 0.0 Map.empty
    ; fScore = Map.add start (h start) Map.empty
    }

  let lookupFScore state at =
    try
      Map.find at state.fScore
    with _ -> L.infinity

  let lookupGScore state at =
    try
      Map.find at state.gScore
    with _ -> L.infinity

  let rec route_ state start goal h d =
    if Set.cardinal state.openSet == 0 then
      None
    else
      let fValues =
        Map.bindings state.fScore
        |> List.filter (fun (l,_) -> Set.mem l state.openSet)
        |> List.sort (fun (_,a) (_,b) -> Pervasives.compare a b)
      in
      match fValues with
      | [] -> None
      | (current,_)::_ ->
        if L.win current goal then
          Some (reconstructPath state current)
        else
          let state =
            { state with
              closeSet = Set.add current state.closeSet
            ; openSet = Set.remove current state.openSet
            }
          in
          let state =
            L.neighbors current
            |> List.fold_left
              (fun state neigh ->
                 let tentativeGScore = (lookupGScore state current) +. (d current neigh) in
                 let currentGScore = lookupGScore state neigh in
                 if tentativeGScore < currentGScore then
                   { state with
                     cameFrom = Update.go neigh (fun _ -> Some current) state.cameFrom
                   ; gScore =
                       Update.go neigh (fun _ -> Some tentativeGScore) state.gScore
                   ; fScore =
                       Update.go neigh
                         (fun _ -> Some (tentativeGScore +. (h neigh)))
                         state.fScore
                   ; openSet =
                       if not @@ Set.mem neigh state.closeSet then
                         Set.add neigh state.openSet
                       else
                         state.openSet
                   }
                 else
                   state
              )
              state
          in
          route_ state start goal h d

  let route start goal h d = route_ (emptyState start h) start goal h d
end
