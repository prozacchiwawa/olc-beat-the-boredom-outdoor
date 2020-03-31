open Contypes
open Image
open Canvas

type displaySpec =
  { context2d : context2d
  ; width : int
  ; height : int
  }

type allState =
  { game : Gamestate.gamestate
  ; noise : float array
  ; spec : displaySpec
  ; anim : allState Animate.animation
  ; mapcache : image StringMap.t ref
  ; keys : StringSet.t
  }
