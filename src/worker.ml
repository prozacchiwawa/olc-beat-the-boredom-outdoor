type workerTarget
  = TargetEntity of string
  | TargetCoords of (int * int)

type worker =
  { name : string
  ; x : float
  ; y : float
  ; food : float
  ; home : string
  ; target : workerTarget
  ; death : float
  }

type workerMoveEff
  = WorkerMove of worker
  | WorkerSucceed of worker
  | WorkerDie of string
