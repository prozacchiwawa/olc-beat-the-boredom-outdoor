open Allstate
open Sprite

let draw state x y str =
  let xInc = 12 in
  for i = 0 to (String.length str) - 1 do
    let sprite = SpriteDefs.spriteForLetter (String.get str i) in
    drawSpriteCenter
      state.spec
      sprite
      (x + (xInc * i))
      y
      (sprite.width * 2)
      (sprite.height * 2)
  done
