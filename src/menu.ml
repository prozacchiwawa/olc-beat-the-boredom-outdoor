open Canvas
open Allstate

type textLine =
  { color : string
  ; str : string
  }

let drawMenu spec textLines =
  let ctx = spec.context2d in
  let withMetrics = List.map (fun tl -> (measureText ctx tl.str, tl)) textLines in
  let ascents = List.map (fun (m,_) -> getFontBBAscent m) withMetrics in
  let descents = List.map (fun (m,_) -> getFontBBDescent m) withMetrics in
  let fullHeight = (List.fold_left (+.) 0.0 ascents) +. (List.fold_left (+.) 0.0 descents) in
  let top = ((float_of_int spec.height) -. fullHeight) /. 2.0 in
  withMetrics
  |> List.fold_left
    (fun y (m,tl) ->
       let ascent = getFontBBAscent m |> int_of_float in
       let descent = getFontBBDescent m |> int_of_float in
       let width = getMeasureWidth m in
       let x = ((float_of_int spec.width) -. width) /. 2.0 in
       let _ = setFillStyle ctx @@ fillStyleOfString tl.color in
       let _ = fillText ctx tl.str (int_of_float x) (y + ascent) in
       (y + ascent + descent)
    )
    (int_of_float top)
  |> ignore
