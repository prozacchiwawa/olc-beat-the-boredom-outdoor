open DisplaySpec
open Canvas
open Allstate

type textLine =
  { color : string
  ; str : string
  }

let drawMenu state textLines =
  let ctx = state.spec.context2d in
  let ascents = List.map (fun _ -> 12.0) textLines in
  let descents = List.map (fun _ -> 1.0) textLines in
  let fullHeight = (List.fold_left (+.) 0.0 ascents) +. (List.fold_left (+.) 0.0 descents) in
  let top = ((float_of_int state.spec.height) -. fullHeight) /. 2.0 in
  textLines
  |> List.fold_left
    (fun y tl ->
       let ascent = 12 in
       let descent = 1 in
       let width = float_of_int (12 * (String.length tl)) in
       let x = ((float_of_int state.spec.width) -. width) /. 2.0 in
       let _ = SpriteString.draw state (int_of_float x) y tl in
       (y + ascent + descent)
    )
    (int_of_float top)
  |> ignore
