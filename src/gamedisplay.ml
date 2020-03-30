open Color
open Canvas

let clearSkyPalette =
  [|
    [| (7,5) (* Dawn *)
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
    [| (8,2)
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

type displaySpec =
  { context2d : context2d
  ; width : int
  ; height : int
  }

let skyPaletteByWeather = function
  | _ -> clearSkyPalette

let groundPaletteByWeather = function
  | _ -> clearGroundPalette

let backgroundPaletteByTimeOfDay weather timeOfDay =
  let palette = skyPaletteByWeather weather in
  let slices = Array.length palette in
  Array.get palette (Util.floor (timeOfDay *. (float_of_int slices)))

let groundPaletteByTimeOfDay weather timeOfDay =
  let palette = groundPaletteByWeather weather in
  let slices = Array.length palette in
  Array.get palette (Util.floor (timeOfDay *. (float_of_int slices)))

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

let drawFirstPersonBackdrop disp weather timeOfDay =
  let ctx = disp.context2d in
  let bgcolor = backgroundColor weather timeOfDay in
  let skyPalette = backgroundPaletteByTimeOfDay weather timeOfDay in
  let groundPalette = groundPaletteByTimeOfDay weather timeOfDay in
  let skySteps = Array.length skyPalette in
  let groundSteps = Array.length groundPalette in
  (* Final sky color *)
  let _ = setFillStyle ctx @@ fillStyleOfString @@ stringOfColor @@ colorOfCoord bgcolor in
  let _ = fillRect ctx 0 0 disp.width disp.height in
  (* Draw sky gradient *)
  let _ = drawSkyGradient disp skySteps skyPalette in
  drawGroundGradient disp groundSteps groundPalette

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

let drawMapScreen spec weather tod (ground : Perlin.ground) =
  let ctx = spec.context2d in
  let palette = Array.get mapPalette 0 in
  let bgColor = Array.get palette ((Array.length palette) - 1) in
  let _ = setFillStyle ctx @@ fillStyleOfString @@ stringOfColor @@ colorOfCoord bgColor in
  for i = 0 to ground.groundY - 1 do
    let yTop = (i * spec.height) / ground.groundY in
    let yBot = ((i + 1) * spec.height) / ground.groundY in
    for j = 0 to ground.groundX - 1 do
      let xLeft = (j * spec.width) / ground.groundX in
      let xRight = ((j + 1) * spec.width) / ground.groundX in
      let level = Array.get ground.groundData ((i * ground.groundX) + j) in
      let color = colorOfCoord @@ colorFromPalette palette level in
      let _ = setFillStyle ctx @@ fillStyleOfString @@ stringOfColor color in
      fillRect ctx xLeft yTop (xRight - xLeft) (yBot - yTop)
    done
  done

let displayScreen spec weather tod ground = function
  | Gamestate.HomeScreen ->
    let _ = drawFirstPersonBackdrop spec weather tod in
    drawMenu spec
      [ { color = "white" ; str = "Start" } ]
  | Gamestate.MapScreen ->
    drawMapScreen spec weather tod ground
  | Gamestate.CampScreen ->
    let _ = drawFirstPersonBackdrop spec weather tod in
    drawMenu spec
      [ { color = "yellow" ; str = "CampScreen" } ]
  | Gamestate.FirstPerson ->
    drawFirstPersonBackdrop spec weather tod
  | _ ->
    drawMenu spec
      [ { color = "Red" ; str = "Unimplemented" } ]
