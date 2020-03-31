open Sprite

let playerSpriteDef =
  [| { color = ( 1,7) ; row = "  x  " }
   ; { color = ( 1,7) ; row = " xxx " }
   ; { color = ( 1,7) ; row = "  x  " }
   ; { color = ( 1,7) ; row = "  x  " }
   ; { color = ( 1,7) ; row = " x x " }
  |]

let citySpriteDef =
  [| { color = ( 3,7) ; row = "    x  " }
   ; { color = ( 3,5) ; row = " x  x  " }
   ; { color = ( 3,3) ; row = " xxxxx " }
   ; { color = ( 3,1) ; row = "xxxxxxx" }
   ; { color = ( 3,0) ; row = " x x x " }
  |]

let ruinSpriteDef =
  [| { color = ( 3,3) ; row = "       " }
   ; { color = ( 3,3) ; row = "       " }
   ; { color = ( 3,2) ; row = "  x x  " }
   ; { color = ( 3,1) ; row = " xxxxxx" }
   ; { color = ( 3,0) ; row = "xxxxxxx" }
  |]

let playerSprite = compileSprite playerSpriteDef
let citySprite = compileSprite citySpriteDef
let ruinSprite = compileSprite ruinSpriteDef
