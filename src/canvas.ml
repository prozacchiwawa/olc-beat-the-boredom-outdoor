open Image

type canvas
type context2d
type fillStyle
type imageData
type textMetrics

module type CanvasUser = sig
  type t
end

module WithCanvas(C : CanvasUser) = struct
  let withNewCanvas : string -> int -> int -> (canvas -> C.t) -> C.t = [%bs.raw {| function(name,x,y,f) { var parent = document.getElementById(name); var canvas = document.createElement('canvas'); canvas.setAttribute('width', x); canvas.setAttribute('height', y); parent.appendChild(canvas); var res = f(canvas); parent.removeChild(canvas); return res; } |}]
end

let getCanvas : string -> canvas Js.Nullable.t = [%bs.raw {| function(name) { var canvasElt = document.getElementById(name); return canvasElt; } |} ]
let canvasToImage : canvas -> image = [%bs.raw {| function(c) { return c; } |}]
let getContext2D : canvas -> context2d = [%bs.raw {| function(canvas) { return canvas.getContext('2d'); } |}]

let setFocus : string -> unit = [%bs.raw {| function(name) { var elt = document.getElementById(name); elt.focus(); } |}]

external createImageData : context2d -> int -> int -> imageData = "" [@@bs.send]
external putImageData : context2d -> imageData -> int -> int -> unit = "" [@@bs.send]
external imageDataArray : imageData -> int array = "data" [@@bs.get]
external setImageSmoothingEnabled : context2d -> bool -> unit = "imageSmoothingEnabled" [@@bs.set]
external getImageSmoothingEnabled : context2d -> bool = "imageSmoothingEnabled" [@@bs.get]
external toDataURL : canvas -> string = "" [@@bs.send]

external fillRect : context2d -> int -> int -> int -> int -> unit = "" [@@bs.send]
external getFillStyle : context2d -> fillStyle = "fillStyle" [@@bs.get]
external setFillStyle : context2d -> fillStyle -> unit = "fillStyle" [@@bs.set]
external fillText : context2d -> string -> int -> int -> unit = "" [@@bs.send]
external measureText : context2d -> string -> textMetrics = "" [@@bs.send]
external getMeasureWidth : textMetrics -> float = "width" [@@bs.get]
external getFontBBAscent : textMetrics -> float = "actualBoundingBoxAscent" [@@bs.get]
external getFontBBDescent : textMetrics -> float = "actualBoundingBoxDescent" [@@bs.get]
external drawImage : context2d -> image -> int -> int -> int -> int -> int -> int -> int -> int -> unit = "drawImage" [@@bs.send]

let fillStyleOfString : string -> fillStyle = [%bs.raw {| function(s) { return s; } |}]

module ImageFromCanvasUser = struct
  type t = image
end

module ImageFromCanvas = WithCanvas(ImageFromCanvasUser)
