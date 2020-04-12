open Contypes
open Constants
open DisplaySpec
open Canvas
open Allstate

let keysPressed = ref StringSet.empty

let runGame state ts =
  let pressed = !keysPressed in
  let newGame = GamestateMethods.runGame state.game pressed ts in
  let newState = { state with game = newGame } in
  let _ = Gamedisplay.displayScreen newState in
  { state with game = newGame ; keys = pressed }

let main _ =
  match getCanvas "demo" |> Js.Nullable.toOption with
  | None -> Js.log "no such canvas"
  | Some canvas ->
    let ctx = getContext2D canvas in
    let spec =
      { context2d = ctx
      ; width = 512
      ; height = 250
      }
    in
    let noise = Perlin.noiseArray (worldSide * worldSide) in
    let world = Perlin.noiseField noise 64 64 in
    let anim = Animate.newAnimation () in
    let _ =
      Window.onKeyDown
        (fun k -> keysPressed := StringSet.add (String.uppercase_ascii k) !keysPressed)
    in
    let _ =
      Window.onKeyUp
        (fun k -> keysPressed := StringSet.remove (String.uppercase_ascii k) !keysPressed)
    in
    let state =
      { game = GamestateMethods.newGame world
      ; noise = noise
      ; spec = spec
      ; anim = anim
      ; keys = StringSet.empty
      ; mapcache = ref StringMap.empty
      }
    in
    Animate.startAnimation anim state runGame
