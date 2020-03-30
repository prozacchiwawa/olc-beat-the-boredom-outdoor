open Contypes
open Canvas
open Color
open Time
open Window

let worldSide = 64
let keysPressed = ref StringSet.empty

type allState =
  { game : Gamestate.gamestate
  ; noise : float array
  ; world : Perlin.ground
  ; spec : Gamedisplay.displaySpec
  ; anim : allState Animate.animation
  ; keys : StringSet.t
  }

let runGame state ts =
  let pressed = !keysPressed in
  let newGame = Gamestate.runGame state.game pressed ts in
  let tod = Gamestate.timeOfDayFromWorldTime newGame.worldTime in
  let _ = Gamedisplay.displayScreen state.spec newGame.weather tod state.world newGame.mode in
  let keys = String.concat "," @@ StringSet.elements !keysPressed in
  let _ = setFillStyle state.spec.context2d @@ fillStyleOfString "white" in
  let _ = fillText state.spec.context2d keys 10 10 in
  { state with game = newGame ; keys = pressed }

let main _ =
  match get_context_2d "demo" |> Js.Nullable.toOption with
  | None -> Js.log "no such canvas"
  | Some ctx ->
    let spec =
      { Gamedisplay.context2d = ctx
      ; Gamedisplay.width = 512
      ; Gamedisplay.height = 250
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
      { game = Gamestate.newGame ()
      ; noise = noise
      ; world = world
      ; spec = spec
      ; anim = anim
      ; keys = StringSet.empty
      }
    in
    Animate.startAnimation anim state runGame
