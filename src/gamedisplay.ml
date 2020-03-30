open Color
open Canvas
open Allstate

let clearSkyPalette =
  [|
    [| (0,0) (* Night *)
     ; (0,0)
     ; (0,0)
     ; (0,0)
     ; (0,0)
     ; (0,0)
     ; (0,0)
     ; (0,0)
     ; (0,0)
     ; (0,0)
     ; (0,0)
     ; (6,5)
     ; (6,5)
     ; (6,5)
     ; (5,6)
     ; (5,6)
     ; (5,6)
     ; (5,6)
     ; (5,6)
     ; (5,6)
     ; (4,7)
     ; (2,7)
    |]
  ; [| (7,5) (* Dawn *)
     ; (7,5)
     ; (7,5)
     ; (7,5)
     ; (7,5)
     ; (7,5)
     ; (7,5)
     ; (7,5)
     ; (7,5)
     ; (7,5)
     ; (7,5)
     ; (7,5)
     ; (7,5)
     ; (6,5)
     ; (5,6)
     ; (4,7)
     ; (3,6)
     ; (2,5)
     ; (2,4)
     ; (3,4)
     ; (3,3)
     ; (3,2)
    |]
  ; [| (7,5) (* Noon *)
     ; (7,5)
     ; (7,5)
     ; (7,5)
     ; (7,5)
     ; (7,5)
     ; (7,5)
     ; (7,5)
     ; (7,5)
     ; (7,5)
     ; (7,5)
     ; (6,5)
     ; (6,5)
     ; (6,5)
     ; (5,6)
     ; (5,6)
     ; (5,6)
     ; (5,6)
     ; (5,6)
     ; (5,6)
     ; (4,7)
     ; (3,6)
    |]
  ; [| (7,5) (* Dusk *)
     ; (7,5)
     ; (7,5)
     ; (7,5)
     ; (7,5)
     ; (7,5)
     ; (7,5)
     ; (7,5)
     ; (7,5)
     ; (7,5)
     ; (7,5)
     ; (6,5)
     ; (6,5)
     ; (6,5)
     ; (5,6)
     ; (5,6)
     ; (5,6)
     ; (5,6)
     ; (5,6)
     ; (5,6)
     ; (4,7)
     ; (2,7)
    |]
  |]

let clearGroundPalette =
  [|
    [| (14,1)
     ; (14,2)
     ; (14,3)
     ; (14,4)
     ; (14,5)
     ; (13,5)
     ; (13,4)
     ; (12,3)
     ; (12,3)
     ; (12,3)
     ; (12,3)
     ; (12,3)
     ; (12,3)
     ; (12,3)
     ; (12,3)
     ; (12,3)
     ; (12,3)
     ; (12,3)
     ; (12,3)
     ; (12,3)
     ; (12,3)
     ; (12,3)
     ; (12,3)
     ; (12,3)
     ; (12,3)
    |]
  |]

let mapPalette =
  [|
    [| (8,1) (* Night *)
     ; (14,4)
     ; (13,4)
     ; (13,3)
     ; (12,2)
     ; (14,3)
     ; (14,2)
     ; (14,1)
     ; (14,0)
    |]
  ; [| (8,2) (* Dawn *)
     ; (14,5)
     ; (13,5)
     ; (13,4)
     ; (12,3)
     ; (14,4)
     ; (14,3)
     ; (14,2)
     ; (14,1)
    |]
  ; [| (8,2) (* Noon *)
     ; (14,5)
     ; (13,5)
     ; (13,4)
     ; (12,3)
     ; (14,4)
     ; (14,3)
     ; (14,2)
     ; (14,1)
    |]
  ; [| (8,2) (* Dusk *)
     ; (14,5)
     ; (13,5)
     ; (13,4)
     ; (12,3)
     ; (14,4)
     ; (14,3)
     ; (14,2)
     ; (14,1)
    |]
  |]

let skyPaletteByWeather = function
  | _ -> clearSkyPalette

let groundPaletteByWeather = function
  | _ -> clearGroundPalette

let getPaletteByTimeOfDay palettes timeOfDay =
  let slices = Array.length palettes in
  Array.get palettes (Util.floor (timeOfDay *. (float_of_int slices)))

let backgroundPaletteByTimeOfDay weather timeOfDay =
  getPaletteByTimeOfDay (skyPaletteByWeather weather) timeOfDay

let groundPaletteByTimeOfDay weather timeOfDay =
  getPaletteByTimeOfDay (groundPaletteByWeather weather) timeOfDay

let backgroundColor weather timeOfDay =
  let palette = backgroundPaletteByTimeOfDay weather timeOfDay in
  Array.get palette 0

let rec drawSkyGradient disp steps palette =
  let ctx = disp.context2d in
  for thisStep = 0 to (Array.length palette) - 1 do
    let nextColor = Array.get palette thisStep in
    let nextStep = thisStep + 1 in
    let yTop = thisStep * (disp.height / 2) / steps in
    let yBot = nextStep * (disp.height / 2) / steps in
    let _ = setFillStyle ctx @@ fillStyleOfString @@ stringOfColor @@ colorOfCoord nextColor in
    fillRect ctx 0 yTop disp.width (yBot - yTop)
  done

let drawGroundGradient disp steps palette =
  let ctx = disp.context2d in
  for thisStep = 0 to (Array.length palette) - 1 do
    let nextColor = Array.get palette thisStep in
    let nextStep = thisStep + 1 in
    let yTop = thisStep * (disp.height / 2) / steps in
    let yBot = nextStep * (disp.height / 2) / steps in
    let _ = setFillStyle ctx @@ fillStyleOfString @@ stringOfColor @@ colorOfCoord nextColor in
    fillRect ctx 0 ((disp.height / 2) + yTop) disp.width ((disp.height / 2) + (yBot - yTop))
  done

let drawFirstPersonBackdrop state =
  let ctx = state.spec.context2d in
  let _ = Js.log state.spec in
  let bgcolor = backgroundColor state.game.weather state.game.timeOfDay in
  let skyPalette = backgroundPaletteByTimeOfDay state.game.weather state.game.timeOfDay in
  let groundPalette = groundPaletteByTimeOfDay state.game.weather state.game.timeOfDay in
  let skySteps = Array.length skyPalette in
  let groundSteps = Array.length groundPalette in
  (* Final sky color *)
  let _ = setFillStyle ctx @@ fillStyleOfString @@ stringOfColor @@ colorOfCoord bgcolor in
  let _ = fillRect ctx 0 0 state.spec.width state.spec.height in
  (* Draw sky gradient *)
  let _ = drawSkyGradient state.spec skySteps skyPalette in
  drawGroundGradient state.spec groundSteps groundPalette

let unimplementedStr = "Unimplemented"

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

let playerSprite =
  [ "  x  "
  ; " xxx "
  ; "  x  "
  ; " x x "
  ]

type compiledSprite =
  { definition : string list
  ; compiled : image
  }

let drawSprite spec sprite x y =
  ()

let drawMapScreen state =
  let ctx = state.spec.context2d in
  let palette = getPaletteByTimeOfDay mapPalette state.game.timeOfDay in
  let bgColor = Array.get palette ((Array.length palette) - 1) in
  let _ = setFillStyle ctx @@ fillStyleOfString @@ stringOfColor @@ colorOfCoord bgColor in
  for i = 0 to state.game.world.groundY - 1 do
    let yTop = (i * state.spec.height) / state.game.world.groundY in
    let yBot = ((i + 1) * state.spec.height) / state.game.world.groundY in
    for j = 0 to state.game.world.groundX - 1 do
      let xLeft = (j * state.spec.width) / state.game.world.groundX in
      let xRight = ((j + 1) * state.spec.width) / state.game.world.groundX in
      let level = Array.get state.game.world.groundData ((i * state.game.world.groundX) + j) in
      let color = colorOfCoord @@ colorFromPalette palette level in
      let _ = setFillStyle ctx @@ fillStyleOfString @@ stringOfColor color in
      fillRect ctx xLeft yTop (xRight - xLeft) (yBot - yTop)
    done
  done ;
  drawSprite state.spec playerSprite state.game.player.x state.game.player.y

let drawHud state =
  let str =
    if state.game.paused then
      Printf.sprintf "[PAUSE] TOD %f" state.game.timeOfDay
    else
      Printf.sprintf "[~RUN~] TOD %f" state.game.timeOfDay
  in
  let metrics = measureText state.spec.context2d str in
  let width = getMeasureWidth metrics |> int_of_float in
  let ascent = getFontBBAscent metrics |> int_of_float in
  let xAt = state.spec.width - width in
  let _ = setFillStyle state.spec.context2d @@ fillStyleOfString "white" in
  fillText state.spec.context2d str (xAt - 10) (ascent + 10)

let displayScreen state =
  match state.game.mode with
  | Gamestate.HomeScreen ->
    let theGame = state.game in
    let sunnyGame = { theGame with weather = Gamestate.Clear ; timeOfDay = 0.5 } in
    let _ = drawFirstPersonBackdrop { state with game = sunnyGame } in
    drawMenu state.spec
      [ { color = "white" ; str = "Start" } ]
  | Gamestate.MapScreen ->
    let _ = drawMapScreen state in
    drawHud state
  | Gamestate.CampScreen ->
    let _ = drawFirstPersonBackdrop state in
    let _ = drawHud state in
    drawMenu state.spec
      [ { color = "yellow" ; str = "CampScreen" } ]
  | Gamestate.FirstPerson ->
    let _ = drawFirstPersonBackdrop state in
    drawHud state
