let midnight = 0.0
let dawn = 0.25
let noon = 0.5
let dusk = 0.75

let timeOfDayFromWorldTime t =
  let currentDay = Util.floor t in
  t -. (float_of_int currentDay)

let todToString t =
  if t < dawn then "Dawn"
  else if t < noon then "Noon"
  else if t < dusk then "Dusk"
  else "Night"
