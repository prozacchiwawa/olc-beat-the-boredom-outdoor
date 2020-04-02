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

let clearMapPalette =
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

let overcastMapPalette =
  [|
    [| (8,0) (* Night *)
     ; (14,3)
     ; (13,3)
     ; (13,2)
     ; (12,1)
     ; (12,0)
     ; (14,2)
     ; (0,4)
    |]
  ; [| (8,1) (* Dawn *)
     ; (14,4)
     ; (13,4)
     ; (13,3)
     ; (12,2)
     ; (12,1)
     ; (14,2)
     ; (0,5)
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
  ; [| (8,1) (* Dawn *)
     ; (14,4)
     ; (13,4)
     ; (13,3)
     ; (12,2)
     ; (12,1)
     ; (14,2)
     ; (0,5)
    |]
  |]

let darkMapPalette =
  [|
    [| (8,0) (* Night *)
     ; (12,3)
     ; (11,3)
     ; (11,2)
     ; (10,1)
     ; (10,0)
     ; (12,2)
     ; (0,4)
    |]
  ; [| (8,1) (* Dawn *)
     ; (12,4)
     ; (11,4)
     ; (11,3)
     ; (10,2)
     ; (10,1)
     ; (12,2)
     ; (0,5)
    |]
  ; [| (8,2) (* Dusk *)
     ; (12,5)
     ; (11,5)
     ; (11,4)
     ; (10,3)
     ; (10,2)
     ; (12,3)
     ; (0,6)
    |]
  ; [| (8,1) (* Dawn *)
     ; (12,4)
     ; (11,4)
     ; (11,3)
     ; (10,2)
     ; (10,1)
     ; (12,2)
     ; (0,5)
    |]
  |]

let snowMapPalette =
  [|
    [| (8,0) (* Night *)
     ; (12,3)
     ; (11,3)
     ; (11,2)
     ; (10,1)
     ; (10,0)
     ; (12,2)
     ; (0,4)
    |]
  ; [| (8,1) (* Dawn *)
     ; (12,4)
     ; (11,4)
     ; (11,3)
     ; (10,2)
     ; (10,1)
     ; (12,2)
     ; (0,5)
    |]
  ; [| (8,2) (* Dusk *)
     ; (12,5)
     ; (11,5)
     ; (11,4)
     ; (10,3)
     ; (10,2)
     ; (12,3)
     ; (0,6)
    |]
  ; [| (8,1) (* Dawn *)
     ; (12,4)
     ; (11,4)
     ; (11,3)
     ; (10,2)
     ; (10,1)
     ; (12,2)
     ; (0,5)
    |]
  |]

let skyPaletteByWeather = function
  | _ -> clearSkyPalette

let groundPaletteByWeather = function
  | _ -> clearGroundPalette

let mapPaletteByWeather = function
  | Weather.Clear -> clearMapPalette
  | Weather.Pokkari -> clearMapPalette
  | Weather.Fog -> overcastMapPalette
  | Weather.Overcast -> overcastMapPalette
  | Weather.Rain -> darkMapPalette
  | Weather.Storm -> darkMapPalette
  | Weather.Snow -> snowMapPalette

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
