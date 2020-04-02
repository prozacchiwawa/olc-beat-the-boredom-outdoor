open DisplaySpec
open Color
open Allstate
open Canvas
open Image

type spriteRow =
  { color : int * int
  ; row : string
  }

type compiledSprite =
  { definition : spriteRow array
  ; width : int
  ; height : int
  ; compiled : image
  }

let getSpriteDefDimensions def =
  let widths = Array.map (fun r -> String.length r.row) def in
  let height = Array.length def in
  let width = Array.fold_left max 0 widths in
  (width, height)

module CompiledSpriteCanvasUser = struct
  type t = compiledSprite
end

module CompileSprite = WithCanvas(CompiledSpriteCanvasUser)

let rowOpaque r j =
  if j >= String.length r.row then
    false
  else
    String.get r.row j != ' '

let squareness = 16

let compileSprite (def : spriteRow array) =
  let (dx,dy) = getSpriteDefDimensions def in
  CompileSprite.withNewCanvas "hidden" (squareness * dx) (squareness * dy)
    (fun canvas ->
       let ctx = getContext2D canvas in
       let _ =
         def
         |> Array.mapi
           (fun i r ->
              let _ =
                setFillStyle ctx @@ fillStyleOfString @@ stringOfColor @@ colorOfCoord r.color
              in
              for j = 0 to (dx - 1) do
                if rowOpaque r j then
                  fillRect ctx (j * squareness) (i * squareness) squareness squareness
                else
                  ()
              done
           )
       in
       { definition = def
       ; width = dx
       ; height = dy
       ; compiled = canvasToImage canvas
       }
    )

let drawSpriteCenter spec sprite x y w h =
  let ctx = spec.context2d in
  let cx = (w / 2) in
  let cy = (h / 2) in
  drawImage ctx sprite.compiled 0 0 (sprite.width * squareness) (sprite.height * squareness) (x - cx) (y - cy) w h
