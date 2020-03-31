type weather
  = Clear
  | Pokkari
  | Overcast
  | Rain
  | Snow
  | Storm
  | Fog

let weatherToString = function
  | Clear -> "Clear"
  | Pokkari -> "Pokkari"
  | Overcast -> "Overcast"
  | Rain -> "Rain"
  | Snow -> "Snow"
  | Storm -> "Storm"
  | Fog -> "Fog"

