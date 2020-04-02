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

let workerSpriteDef =
  [| { color = ( 6,5) ; row = "   x   " }
   ; { color = ( 6,4) ; row = " xxx   " }
   ; { color = ( 6,3) ; row = " xxx   " }
   ; { color = ( 6,2) ; row = "   xx  " }
   ; { color = ( 6,1) ; row = "  x x  " }
  |]

let deadWorkerSpriteDef =
  [| { color = ( 4,3) ; row = "       " }
   ; { color = ( 4,3) ; row = "       " }
   ; { color = ( 4,2) ; row = "x  xxx " }
   ; { color = ( 4,1) ; row = " xxxxxx" }
   ; { color = ( 4,0) ; row = "xx     " }
   |]

let targetDef =
  [| { color = ( 3,5) ; row = "x x" }
   ; { color = ( 3,5) ; row = " x " }
   ; { color = ( 3,5) ; row = "x x" }
  |]

let plantDef =
  [| { color = (10,6) ; row = "  x  " }
   ; { color = (10,5) ; row = "x x x" }
   ; { color = (10,4) ; row = " xxx " }
   ; { color = (10,3) ; row = " xxx " }
  |]

let playerSprite = compileSprite playerSpriteDef
let citySprite = compileSprite citySpriteDef
let ruinSprite = compileSprite ruinSpriteDef
let workerSprite = compileSprite workerSpriteDef
let deadWorkerSprite = compileSprite deadWorkerSpriteDef
let targetSprite = compileSprite targetDef
let plantSprite = compileSprite plantDef
