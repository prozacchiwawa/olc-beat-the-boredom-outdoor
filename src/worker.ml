type workerTarget
  = TargetEntity of string
  | TargetCoords of (float * float)

type worker =
  { id : string
  ; x : float
  ; y : float
  ; health : float
  ; minerals : float
  ; food : float
  ; home : string
  ; target : workerTarget
  }
