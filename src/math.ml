open Contypes

let pi = 3.1415926
external random : unit -> float = "Math.random" [@@bs.val]
external floor : float -> float = "Math.floor" [@@bs.val]
external ceil : float -> float = "Math.ceil" [@@bs.val]
external sqrt : float -> float = "Math.sqrt" [@@bs.val]
external abs : float -> float = "Math.abs" [@@bs.val]
external sin : float -> float = "Math.sin" [@@bs.val]
external cos : float -> float = "Math.cos" [@@bs.val]

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

let rotationOf inc ch lst =
  let which = lst |> List.mapi (fun i x -> if (Pervasives.compare x ch) = 0 then Some i else None) |> catOptions in
  match which with
  | [] -> ch
  | a::_ -> List.nth lst ((a + inc) mod (List.length lst))

let nextOf ch lst = rotationOf 1 ch lst
let prevOf ch lst =
  let len = List.length lst in
  rotationOf (len - 1) ch lst

let moveToward incT moveRate (tx,ty) (atX,atY) =
  let diffX = ((float_of_int tx) +. 0.5) -. atX in
  let diffY = ((float_of_int ty) +. 0.5) -. atY in
  if diffX = 0.0 && diffY = 0.0 then
    (atX, atY)
  else
    let adx = abs diffX in
    let moveX = diffX /. adx in
    let ady = abs diffY in
    let moveY = diffY /. ady in
    ( atX +. (incT *. moveX *. moveRate)
    , atY +. (incT *. moveY *. moveRate)
    )
