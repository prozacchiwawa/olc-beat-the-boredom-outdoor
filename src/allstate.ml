open Contypes
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
  ; keys : StringSet.t
  }
