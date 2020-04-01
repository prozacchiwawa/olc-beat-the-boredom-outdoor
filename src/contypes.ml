let rec fold_left f s l =
  match l with
  | hd :: tl -> fold_left f (f s hd) tl
  | _ -> s

let rec foldls =
  function
  | [] -> fun v -> v
  | (f,l) :: tl -> fun v -> foldls tl (fold_left f v l)

module type Ord = sig
  type t
  val compare : t -> t -> int
end

module ListToMap(OrdType : Ord) = struct
  module MapT = Map.Make(OrdType)
  let go (l : (OrdType.t * 'a) list) : 'a MapT.t =
    fold_left
      (fun m (k,v) -> MapT.add k v m)
      MapT.empty
      l
end

module FindMap (O : Ord) = struct
  module MapT = Map.Make(O)
  let go (key : MapT.key) (map : 'a MapT.t) : 'a option =
    try
      Some (MapT.find key map)
    with _ -> None
end

module UpdateMap (O : Ord) = struct
  module MapT = Map.Make(O)
  module Find = FindMap(O)
  let go (key : MapT.key) (f : 'a option -> 'a option) (map : 'a MapT.t) =
    let res = Find.go key map in
    match f res with
    | Some a -> MapT.remove key map |> MapT.add key a
    | None -> MapT.remove key map
end

let optionMap f o =
  match o with
  | Some v -> Some (f v)
  | None -> None

let optionThen f o =
  match o with
  | Some v -> f v
  | _ -> None

let optionOrElse f o =
  match o with
  | Some v -> Some v
  | _ -> f ()

let optionElse f o =
  match o with
  | Some v -> v
  | _ -> f ()

let rec catOptions =
  function
  | [] -> []
  | (Some a) :: tl -> a :: (catOptions tl)
  | None :: tl -> catOptions tl

let (>>) f g = fun a -> g (f a)

let list_init n f = Array.to_list (Array.init n f)

module StringOrd = struct
  type t = string
  let compare a b = Pervasives.compare a b
end

module IPointOrd = struct
  type t = int * int
  let compare a b = Pervasives.compare a b
end

module StringSet = Set.Make(StringOrd)
module StringMap = Map.Make(StringOrd)
module StringUpdateMap = UpdateMap(StringOrd)
module IPointSet = Set.Make(IPointOrd)
module IPointMap = Map.Make(IPointOrd)
