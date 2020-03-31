open Image

external newImage : int -> int -> image = "Image" [@@bs.new]
external setAttribute : image -> string -> string -> unit = "setAttribute" [@@bs.send]
