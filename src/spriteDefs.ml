open Sprite

let playerSpriteDef =
  [| { color = ( 0,7) ; row = "  x  " }
   ; { color = ( 0,7) ; row = " xxx " }
   ; { color = ( 0,7) ; row = "  x  " }
   ; { color = ( 0,7) ; row = "  x  " }
   ; { color = ( 0,7) ; row = " x x " }
  |]

let playerSprite = compileSprite playerSpriteDef
