open Color
open Canvas
open Allstate
open Gamepalette

let drawSkyGradient disp steps palette =
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

let worldPositionToScreen state x y =
  let xx = (int_of_float x) * state.spec.width / state.game.world.groundX in
  let yy = (int_of_float y) * state.spec.height / state.game.world.groundY in
  (xx,yy)

let drawMapScreen state =
  let ctx = state.spec.context2d in
  (* Draw map *)
  let mapImage = Worldmap.cacheMapScreen state in
  let _ =
    drawImage
      ctx mapImage
      0 0 state.spec.width state.spec.height
      0 0 state.spec.width state.spec.height
  in
  (* Draw player *)
  let (px,py) = worldPositionToScreen state state.game.player.x state.game.player.y in
  let _ =
    Sprite.drawSpriteCenter
      state.spec
      SpriteDefs.playerSprite
      px
      py
      (SpriteDefs.playerSprite.width * 2)
      (SpriteDefs.playerSprite.height * 2)
  in
  (* Draw cities *)
  state.game.cities |> List.iter
    (fun (c : City.city) ->
       let (cx,cy) = worldPositionToScreen state (float_of_int c.x) (float_of_int c.y) in
       Sprite.drawSpriteCenter
         state.spec
         (if c.ruin != 0.0 then SpriteDefs.ruinSprite else SpriteDefs.citySprite)
         cx
         cy
         (SpriteDefs.citySprite.width * 2)
         (SpriteDefs.citySprite.height * 2)
    )

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
    let sunnyGame = { theGame with weather = Weather.Clear ; timeOfDay = 0.5 } in
    let _ = drawFirstPersonBackdrop { state with game = sunnyGame } in
    Menu.drawMenu state.spec
      [ { color = "white" ; str = "Start" } ]
  | Gamestate.GameOverScreen _ ->
    Menu.drawMenu state.spec
      [ { color = "red" ; str = "Game Over" } ]
  | Gamestate.MapScreen ->
    let _ = drawMapScreen state in
    drawHud state
  | Gamestate.CampScreen ->
    let _ = drawFirstPersonBackdrop state in
    let _ = drawHud state in
    Menu.drawMenu state.spec
      [ { color = "yellow" ; str = "CampScreen" } ]
  | Gamestate.FirstPerson ->
    let _ = drawFirstPersonBackdrop state in
    drawHud state
