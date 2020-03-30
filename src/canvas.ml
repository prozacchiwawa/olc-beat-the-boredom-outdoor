type context2d
type fillStyle
type imageData
type textMetrics

let get_context_2d : string -> context2d Js.Nullable.t = [%bs.raw {| function(name) { var canvasElt = document.getElementById(name); if (!canvasElt) { return null; } return canvasElt.getContext('2d'); } |} ]

let setFocus : string -> unit = [%bs.raw {| function(name) { var elt = document.getElementById(name); elt.focus(); } |}]

external createImageData : context2d -> int -> int -> imageData = "" [@@bs.send]
external putImageData : context2d -> imageData -> int -> int -> unit = "" [@@bs.send]
external imageDataArray : imageData -> int array = "data" [@@bs.get]
external setImageSmoothingEnabled : context2d -> bool -> unit = "imageSmoothingEnabled" [@@bs.set]
external getImageSmoothingEnabled : context2d -> bool = "imageSmoothingEnabled" [@@bs.get]

external fillRect : context2d -> int -> int -> int -> int -> unit = "" [@@bs.send]
external getFillStyle : context2d -> fillStyle = "fillStyle" [@@bs.get]
external setFillStyle : context2d -> fillStyle -> unit = "fillStyle" [@@bs.set]
external fillText : context2d -> string -> int -> int -> unit = "" [@@bs.send]
external measureText : context2d -> string -> textMetrics = "" [@@bs.send]
external getMeasureWidth : textMetrics -> float = "width" [@@bs.get]
external getFontBBAscent : textMetrics -> float = "actualBoundingBoxAscent" [@@bs.get]
external getFontBBDescent : textMetrics -> float = "actualBoundingBoxDescent" [@@bs.get]

let fillStyleOfString : string -> fillStyle = [%bs.raw {| function(s) { return s; } |}]
