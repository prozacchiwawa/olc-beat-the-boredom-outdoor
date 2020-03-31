open Contypes
open City
open Worker
open Gamestate

let cityRuinTime = 1.0
let eatingRate = 0.33

(* Advance a city by the time increment, possibly producing an effect. *)
let runCity (_ : gamestate) incT (city : city) =
  if city.ruin > 0.0 then
    let ruined = city.ruin -. incT in
    if ruined <= 0.0 then
      let _ = Js.log @@ Printf.sprintf "destroy city %s" city.name in
      ({ city with ruin = -1.0 }, Some (CityDestroyed city.name))
    else
      ({ city with ruin = ruined }, None)
  else if city.ruin == 0.0 then
    let updatedFood = city.food -. (city.population *. eatingRate) *. incT in
    let cityWithFood = { city with food = updatedFood } in
    if updatedFood < 0.0 then
      let _ = Js.log @@ Printf.sprintf "ruin city %s" city.name in
      ({ cityWithFood with ruin = cityRuinTime }, None)
    else
      (cityWithFood, None)
  else
    (city, None)
