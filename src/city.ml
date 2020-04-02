open Worker

let workerPop = 10.0

type runCityEffect
  = CityDestroyed of string
  | SpawnWorker of worker

type city =
  { x : int
  ; y : int
  ; ruin : float
  ; name : string
  ; population : float
  ; food : float
  }
