let weatherTime = 0.25
let weatherChangePct = 0.3

type weather
  = Clear
  | Pokkari
  | Fog
  | Overcast
  | Rain
  | Storm
  | Snow

let weatherToString = function
  | Clear -> "Clear"
  | Pokkari -> "Pokkari"
  | Fog -> "Fog"
  | Overcast -> "Overcast"
  | Rain -> "Rain"
  | Storm -> "Storm"
  | Snow -> "Snow"

let weatherCycle =
  [ Clear ; Pokkari ; Fog ; Overcast ; Rain ; Storm ]

let stepUpWeather biome current =
  if biome > 4 && current == Storm then
    Snow
  else
    Math.nextOf current weatherCycle

let stepDownWeather biome current =
  if current == Snow then
    Storm
  else
    Math.prevOf current weatherCycle
