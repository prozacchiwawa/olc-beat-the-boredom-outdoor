external random : unit -> float = "Math.random" [@@bs.val]
external floor : float -> float = "Math.floor" [@@bs.val]
external ceil : float -> float = "Math.ceil" [@@bs.val]
external sqrt : float -> float = "Math.sqrt" [@@bs.val]
external abs : float -> float = "Math.abs" [@@bs.val]

let distance (p1x,p1y) (p2x,p2y) =
  let dx = (p2x -. p1x) in
  let dy = (p2y -. p1y) in
  sqrt ((dx *. dx) +. (dy *. dy))

let rec randomlyChooseInOrder factor lst =
  match lst with
  | [] -> None
  | [a] -> Some a
  | hd :: tl ->
    if (random ()) < factor then
      Some hd
    else
      randomlyChooseInOrder factor tl

let toFloatPoint (px,py) = (float_of_int px, float_of_int py)
let toIntPoint (px,py) = (int_of_float px, int_of_float py)
