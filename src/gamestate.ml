open Contypes
open Constants
open Knowledge
open Weather
open Tod
open City
open Worker
open Player

type gameMode
  = HomeScreen
  | GameOverScreen of float
  | MapScreen
  | CampScreen
  | FirstPerson

type gamestate =
  { startTime : float
  ; worldTime : float
  ; realTime : float
  ; timeOfDay : float
  ; gameSpeed : float
  ; player : player
  ; mode : gameMode
  ; weather : weather
  ; world : Perlin.ground
  ; paused : bool
  ; keys : StringSet.t
  ; cities : city StringMap.t
  ; workers : worker StringMap.t
  ; known : know IPointMap.t
  ; plants : IPointSet.t
  }

let locateCityNamed gamestate name =
  try
    let city = StringMap.find name gamestate.cities in
    Some (city.x, city.y)
  with _ ->
    None

let locationOfWorkerTarget gamestate = function
  | Worker.TargetCoords pt -> Some pt
  | Worker.TargetEntity name -> locateCityNamed gamestate name
