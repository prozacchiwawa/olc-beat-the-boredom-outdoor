type window
open Time

let getWindow : unit -> window = [%bs.raw {| function() { return window; } |} ]
let window = getWindow ()

external requestAnimationFrame : window -> (unit -> unit) -> unit = "requestAnimationFrame" [@@bs.send]

type 'a animation =
  { continuing : bool ref
  }

let newAnimation () = { continuing = ref true }
let stopAnimation animation = animation.continuing := false

let rec runAnimation animation (state : 'a) perFrame =
  let t = newTime () in
  let ts = getTime t in
  let ns = perFrame state ts in
  if !(animation.continuing) then
    requestAnimationFrame window (fun _ -> runAnimation animation ns perFrame)
  else
    ()

let startAnimation animation (state : 'a) perFrame =
  requestAnimationFrame window (fun _ -> runAnimation animation state perFrame)
