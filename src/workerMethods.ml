open Contypes
open City
open Worker

let workerDeathTime = 0.3
let workerMoveRate = 4.0

let addWorkerFood amt worker = { worker with food = worker.food +. amt }

let newWorker (city : city) tgt =
  { name = Namegen.generateRandomName 3
  ; x = (float_of_int city.x) +. 0.5
  ; y = (float_of_int city.y) +. 0.5
  ; minerals = 0.0
  ; food = 0.0
  ; home = city.name
  ; target = tgt
  ; death = 0.0
  }

let moveToward incT (tx,ty) worker =
  let (newX,newY) = Math.moveToward incT workerMoveRate (tx,ty) (worker.x, worker.y) in
  { worker with x = newX ; y = newY }

let runWorker gamestate incT (worker : worker) =
  if worker.death > 0.0 then
    let newDeathTimer = worker.death -. incT in
    if newDeathTimer <= 0.0 then
      WorkerDie worker.name
    else
      WorkerMove { worker with death = newDeathTimer }
  else
    let whereAt = (int_of_float worker.x, int_of_float worker.y) in
    let target = Gamestate.locationOfWorkerTarget gamestate worker.target in
    let home = Gamestate.locationOfWorkerTarget gamestate (TargetEntity worker.home) in
    match (home, target) with
    | (Some home, Some tgt) ->
      if whereAt = home && worker.target = TargetEntity worker.home then
        WorkerSucceed worker
      else if whereAt = tgt then
        WorkerMove
          { worker with
            target = TargetEntity worker.home
          }
      else
        WorkerMove (moveToward incT tgt worker)
    | _ -> WorkerMove { worker with death = workerDeathTime }
