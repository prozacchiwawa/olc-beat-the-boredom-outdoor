open Contypes
open Allstate
open Color
open Canvas
open Gamestate
open Gamepalette

(* Get the map screen id for the current conditions *)
let getMapScreenId state =
  Printf.sprintf "world-map-%s-%s"
    (Weather.weatherToString state.game.weather)
    (Tod.todToString state.game.timeOfDay)

(* For the given map state, create a cached image *)
let cacheMapScreen state =
  let cacheid = getMapScreenId state in
  try
    StringMap.find cacheid !(state.mapcache)
  with _ ->
    ImageFromCanvas.withNewCanvas "hidden" state.spec.width state.spec.height
      (fun canvas ->
         let ctx = getContext2D canvas in
         let palette =
           getPaletteByTimeOfDay (mapPaletteByWeather state.game.weather) state.game.timeOfDay
         in
         let bgColor = Array.get palette ((Array.length palette) - 1) in
         let _ =
           setFillStyle ctx @@ fillStyleOfString @@ stringOfColor @@ colorOfCoord bgColor
         in
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
         let img = canvasToImage canvas in
         state.mapcache := StringMap.add cacheid img !(state.mapcache) ;
         img
      )
