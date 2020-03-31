open Contypes
open Constants
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
  ; cities : city list
  ; workers : worker list
  }
