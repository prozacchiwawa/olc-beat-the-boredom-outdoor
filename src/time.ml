type date

external newTime : unit -> date = "Date" [@@bs.new]
external getTime : date -> float = "getTime" [@@bs.send]
