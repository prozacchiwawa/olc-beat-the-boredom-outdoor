open Constants
open Contypes
open DisplaySpec
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
  let xx =
    ((Math.floor x) +. 0.5) *. (float_of_int state.spec.width) /. (float_of_int state.game.world.groundX)
  in
  let yy =
    ((Math.floor y) +. 0.5) *. (float_of_int state.spec.height) /. (float_of_int state.game.world.groundY)
  in
  (int_of_float xx,int_of_float yy)

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
  (* Draw cities *)
  let _ =
    state.game.cities |> StringMap.bindings |> List.iter
      (fun (_, (c : City.city)) ->
         let (cx,cy) = worldPositionToScreen state (float_of_int c.x) (float_of_int c.y) in
         Sprite.drawSpriteCenter
           state.spec
           (if c.ruin != 0.0 then SpriteDefs.ruinSprite else SpriteDefs.citySprite)
           cx
           cy
           (SpriteDefs.citySprite.width * 2)
           (SpriteDefs.citySprite.height * 2)
      )
  in
  (* Draw plants *)
  let _ =
    state.game.plants |> IPointSet.elements |> List.iter
      (fun (px,py) ->
         let (px,py) = worldPositionToScreen state (float_of_int px) (float_of_int py) in
         Sprite.drawSpriteCenter
           state.spec
           SpriteDefs.plantSprite
           px
           py
           (SpriteDefs.plantSprite.width * 2)
           (SpriteDefs.plantSprite.height * 2)
      )
  in
  (* Draw workers *)
  let _ =
    state.game.workers |> StringMap.bindings |> List.iter
      (fun (_, (w : Worker.worker)) ->
         let (wx,wy) = worldPositionToScreen state w.x w.y in
         Sprite.drawSpriteCenter
           state.spec
           (if w.death > 0.0 then SpriteDefs.deadWorkerSprite else SpriteDefs.workerSprite)
           wx
           wy
           (SpriteDefs.workerSprite.width * 2)
           (SpriteDefs.workerSprite.height * 2)
      )
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
  ()

let drawUpperRightStatus state str =
  let metrics = measureText state.spec.context2d str in
  let width = getMeasureWidth metrics |> int_of_float in
  let ascent = getFontBBAscent metrics |> int_of_float in
  let xAt = state.spec.width - width in
  let _ = setFillStyle state.spec.context2d @@ fillStyleOfString "white" in
  fillText state.spec.context2d str (xAt - 10) (ascent + 10)

let cityStatusHeight = 45
let cityStatusLeft = 30

(* If a city is near enough to a city, display its status at the bottom or top of the screen,
 * depending on player location
 *)
let drawCityStatus state (city : City.city) =
  let ystart =
    if state.game.player.y < float_of_int (worldSide / 2) then
      state.spec.height - cityStatusHeight
    else
      0
  in
  let yend = ystart + cityStatusHeight in
  let _ =
    setFillStyle state.spec.context2d @@
    fillStyleOfString @@ stringOfColor @@ colorOfCoord (2,1)
  in
  let _ = fillRect state.spec.context2d 0 ystart state.spec.width yend in
  (* Icon *)
  let _ =
    Sprite.drawSpriteCenter
      state.spec
      (if city.ruin != 0.0 then SpriteDefs.ruinSprite else SpriteDefs.citySprite)
      (cityStatusLeft / 2)
      ((ystart + yend) / 2)
      (SpriteDefs.citySprite.width * 2)
      (SpriteDefs.citySprite.height * 2)
  in
  let tagline = Printf.sprintf "Name: %s" city.name in
  let metrics = measureText state.spec.context2d tagline in
  let ascent = getFontBBAscent metrics |> int_of_float in
  let descent = getFontBBDescent metrics |> int_of_float in
  let maxView = max 200.0 (max city.population city.food) in
  let oneUnit = ascent + descent + 5 in
  let foodWidth = city.food /. maxView *. (float_of_int state.spec.width) *. 0.75 in
  let popWidth = city.population /. maxView *. (float_of_int state.spec.width) *. 0.75 in
  (* render name *)
  let _ =
    setFillStyle state.spec.context2d @@ fillStyleOfString @@ "white"
  in
  let _ =
    fillText state.spec.context2d tagline cityStatusLeft (ystart + 5 + ascent)
  in
  (* Render food *)
  let _ =
    setFillStyle state.spec.context2d @@
    fillStyleOfString @@ stringOfColor @@ colorOfCoord (11,4)
  in
  let foodBarY = ystart + 5 + oneUnit in
  let _ =
    fillRect state.spec.context2d cityStatusLeft foodBarY (int_of_float foodWidth) ascent
  in
  (* Render population *)
  let _ =
    setFillStyle state.spec.context2d @@
    fillStyleOfString @@ stringOfColor @@ colorOfCoord (3,4)
  in
  let popBarY = ystart + 5 + (oneUnit * 2) in
  fillRect state.spec.context2d cityStatusLeft popBarY (int_of_float popWidth) ascent

let drawMiscHud state =
  match state.game.mode with
  | MapScreen Running ->
    drawUpperRightStatus state @@ Printf.sprintf "Running: %s" @@ Weather.weatherToString state.game.weather
  | MapScreen (ChoosingLocation (x,y)) ->
    let _ =
      let (cx,cy) =
        worldPositionToScreen state (float_of_int x) (float_of_int y)
      in
      Sprite.drawSpriteCenter
        state.spec
        SpriteDefs.targetSprite
        cx
        cy
        (SpriteDefs.targetSprite.width * 2)
        (SpriteDefs.targetSprite.height * 2)
    in
    drawUpperRightStatus state @@ Printf.sprintf "Choose location (%d,%d)" x y
  | MapScreen (PauseMenu choice) ->
    let choiceColor ch = if ch = choice then "yellow" else "white" in
    let _ =
      Menu.drawMenu state.spec
        [ { color = choiceColor Resume         ; str = "Resume" }
        ; { color = choiceColor ChooseLocation ; str = "Change Target" }
        ; { color = choiceColor Encounter      ; str = "Hard Travel" }
        ; { color = choiceColor Camp           ; str = "Camp" }
        ]
    in
    drawUpperRightStatus state "Select..."
  | MapScreen (MiniVictory _) ->
    Menu.drawMenu state.spec
      [ { color = "white" ; str = "Travel Success!" }
      ; { color = "white" ; str = "You got resources!" }
      ]
  | HomeScreen -> ()
  | GameOverScreen _ -> ()
  | CampScreen ->
    drawUpperRightStatus state "Camp"
  | FirstPerson mg ->
    drawUpperRightStatus state @@
    Printf.sprintf "First Person %f:%f v %f" mg.playerX mg.playerY mg.playerDir

let drawCityHud state =
  match state.game.mode with
  | MapScreen _ ->
    begin
      let cities =
        state.game.cities
        |> StringMap.bindings
        |> List.map
          (fun (_,(c : City.city)) ->
             let cityAt = ((float_of_int c.x) +. 0.5, (float_of_int c.y) +. 0.5) in
             let dist = Math.distance cityAt (state.game.player.x, state.game.player.y) in
             (dist, c)
          )
        |> List.filter (fun (d,_) -> d < 3.5)
        |> List.sort Pervasives.compare
      in
      match cities with
      | [] -> ()
      | (_,hd)::_ -> drawCityStatus state hd
    end
  | _ -> ()

let drawHud state =
  drawMiscHud state ;
  drawCityHud state

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
  | Gamestate.MapScreen _ ->
    let _ = drawMapScreen state in
    drawHud state
  | Gamestate.CampScreen ->
    let _ = drawFirstPersonBackdrop state in
    let _ = drawHud state in
    Menu.drawMenu state.spec
      [ { color = "yellow" ; str = "CampScreen" } ]
  | Gamestate.FirstPerson mg ->
    let _ = drawFirstPersonBackdrop state in
    let _ = FirstPersonMethods.draw state mg in
    drawHud state
