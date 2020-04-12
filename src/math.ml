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
    let moveX =
      if adx <> 0.0 then
        diffX /. adx
      else
        0.0
    in
    let ady = abs diffY in
    let moveY =
      if ady <> 0.0 then
        diffY /. ady
      else
        0.0
    in
    ( atX +. (incT *. moveX *. moveRate)
    , atY +. (incT *. moveY *. moveRate)
    )

let rec shuffle n arr =
  let l = Array.length arr in
  if n <= 0 then
    arr
  else if l == 0 then
    arr
  else
    let newArr = Array.init l (Array.get arr) in
    let _ =
      for i = 0 to l - 1 do
        let j = int_of_float ((float_of_int l) *. (random ())) in
        let t = Array.get newArr i in
        let s = Array.get newArr j in
        let _ = Array.set newArr j t in
        Array.set newArr i s
      done
    in
    shuffle (n - 1) newArr

let rec range s e =
  if s >= e then
    []
  else
    s :: (range (s+1) e)

let lineOfSight (sx,sy) (ex,ey) blocked =
  let dist = distance (sx,sy) (ex,ey) in
  let (dx,dy) = (ex -. sx, ey -. sy) in
  let steps = int_of_float @@ 4.0 *. dist in
  let (ix,iy) = (dx /. (float_of_int steps), dy /. (float_of_int steps)) in
  let rec lineOfSight n =
    let ax = int_of_float @@ sx +. (ix *. (float_of_int steps)) in
    let ay = int_of_float @@ sy +. (iy *. (float_of_int steps)) in
    if n >= steps then
      true
    else if blocked (ax,ay) then
      false
    else
      lineOfSight (n+1)
  in
  lineOfSight 0

let clamp i a v = max i (min a v)

let rotateCoords dir (px,py) =
  let x = (px *. (cos dir)) -. (py *. (sin dir)) in
  let y = (py *. (cos dir)) +. (px *. (sin dir)) in
  (x,y)
