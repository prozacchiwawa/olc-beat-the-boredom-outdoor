open Contypes
open Image
open Canvas
open DisplaySpec

type allState =
  { game : Gamestate.gamestate
  ; noise : float array
  ; spec : displaySpec
  ; anim : allState Animate.animation
  ; mapcache : image StringMap.t ref
  ; keys : StringSet.t
  }
