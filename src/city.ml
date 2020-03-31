open Worker

type runCityEffect
  = CityDestroyed of string
  | SpawnWorker of worker

type city =
  { x : int
  ; y : int
  ; ruin : float
  ; name : string
  ; population : float
  ; minerals : float
  ; food : float
  }
