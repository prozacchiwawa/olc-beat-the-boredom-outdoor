type window
type key

let getWindow : unit -> window = [%bs.raw {| function() { return window; } |}]
let window = getWindow ()

external getKey : key -> string = "key" [@@bs.get]
external preventDefault : key -> unit = "preventDefault" [@@bs.send]
external stopPropagation : key -> unit = "stopPropagation" [@@bs.send]
external onKey_ : window -> string -> (key -> unit) -> unit = "addEventListener" [@@bs.send]

let onKeyDown f =
  onKey_ window "keydown"
    (fun k ->
       preventDefault k ;
       stopPropagation k ;
       f (getKey k)
    )
let onKeyUp f =
  onKey_ window "keyup"
    (fun k ->
       preventDefault k ;
       stopPropagation k ;
       f (getKey k)
    )
