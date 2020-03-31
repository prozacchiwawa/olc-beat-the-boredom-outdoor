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
     ; (12,1)
     ; (14,2)
     ; (0,5)
    |]
  ; [| (8,2) (* Dawn *)
     ; (14,5)
     ; (13,5)
     ; (13,4)
     ; (12,3)
     ; (12,2)
     ; (14,3)
     ; (0,6)
    |]
  ; [| (8,2) (* Noon *)
     ; (14,5)
     ; (13,5)
     ; (13,4)
     ; (12,3)
     ; (12,2)
     ; (14,3)
     ; (0,7)
    |]
  ; [| (8,2) (* Dusk *)
     ; (14,5)
     ; (13,5)
     ; (13,4)
     ; (12,3)
     ; (12,2)
     ; (14,3)
     ; (0,6)
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
