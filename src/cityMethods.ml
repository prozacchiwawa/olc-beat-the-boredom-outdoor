open Contypes
open City
open Worker
open Gamestate

let cityRuinTime = 1.0
let eatingRate = 0.33
let workerProbFactor = 0.7

let addWorkerProduct w city =
  { city with
    population = city.population +. City.workerPop
  ; food = city.food +. w.food
  ; minerals = city.minerals +. w.minerals
  }

(* Probability that a given city will try to spawn a new worker at a given hour *)
let workerProb (city : city) = max 0.01 (workerProbFactor *. (city.population /. city.food))

let rankResource (city : city) ((aw : (int * int)),ak) ((bw : (int * int)),bk) =
  let here = ((float_of_int city.x) +. 0.5, (float_of_int city.y) +. 0.5) in
  let ad = Math.distance here (Math.toFloatPoint aw) in
  let bd = Math.distance here (Math.toFloatPoint bw) in
  Pervasives.compare ad bd

let sortByBenefit (city : city) ((aw : (int * int)),ak) ((bw : (int * int)),bk) =
  rankResource city (aw,ak) (bw,bk)

let randomPatrolLocation (city : city) =
  let coords = [| -5 ; -4 ; -3 ; 3 ; 4 ; 5 |] in
  let clen = Array.length coords in
  let cx = int_of_float ((Math.random ()) *. (float_of_int clen)) in
  let cy = int_of_float ((Math.random ()) *. (float_of_int clen)) in
  let targetX = city.x + (Array.get coords cx) in
  let targetY = city.y + (Array.get coords cy) in
  ((targetX, targetY), Knowledge.Patrol (targetX, targetY))

let whatWeKnowToTarget v =
  match v with
  | Knowledge.Patrol (px,py) ->
    ( WorkerMethods.addWorkerFood 5.0
    , TargetCoords (px, py)
    )
  | Knowledge.Plants (px,py) ->
    ( WorkerMethods.addWorkerFood 15.0
    , TargetCoords (px, py)
    )

let getAdvantageousOutings gamestate (city : city) =
  let (randomPatrol : (int * int) * Knowledge.know) =
    randomPatrolLocation city
  in
  let (knowAbout : ((int * int) * Knowledge.know) list) =
    IPointMap.bindings gamestate.known
  in
  let knownResources =
    List.map (fun (_,v) -> v) @@
    List.sort (sortByBenefit city) @@
    randomPatrol :: knowAbout
  in
  List.map whatWeKnowToTarget knownResources

let spawnWorker gamestate city : (city * worker option) =
  match Math.randomlyChooseInOrder 0.5 @@ getAdvantageousOutings gamestate city with
  | Some (f, tgt) ->
    let updated =
      { city with population = city.population -. City.workerPop }
    in
    let worker = f (WorkerMethods.newWorker city tgt) in
    let _ = Js.log worker in
    (updated, Some worker)
  | _ -> (city, None)

(* Advance a city by the time increment, possibly producing an effect. *)
let runCity gamestate incT (city : city) =
  if city.ruin > 0.0 then
    let ruined = city.ruin -. incT in
    if ruined <= 0.0 then
      let _ = Js.log @@ Printf.sprintf "destroy city %s" city.name in
      ({ city with ruin = -1.0 }, Some (CityDestroyed city.name))
    else
      ({ city with ruin = ruined }, None)
  else if city.ruin == 0.0 then
    let updatedFood = city.food -. (city.population *. eatingRate) *. incT in
    let updatedPop =
      if updatedFood > city.population +. 1.25 then
        city.population +. city.population *. 0.1
      else
        city.population
    in
    let cityWithFood = { city with food = updatedFood ; population = updatedPop } in
    let prob = workerProb city in
    let rnd = (Math.random ()) /. incT in
    let trySpawnWorker = prob > rnd in
    let canSpawnWorker = city.population >= 20.0 && city.food >= 5.0 in
    if updatedFood < 0.0 then
      let _ = Js.log @@ Printf.sprintf "ruin city %s" city.name in
      ({ cityWithFood with ruin = cityRuinTime }, None)
    else
    if trySpawnWorker && canSpawnWorker then
      let (city, worker) = spawnWorker gamestate cityWithFood in
      let _ = Js.log @@ Printf.sprintf "Spawn worker prob %f rnd %f pop %f food %f" prob rnd city.population city.food in
      let _ = Js.log city in
      let _ = Js.log worker in
      match worker with
      | Some w -> (city, Some (SpawnWorker w))
      | _ -> (city, None)
    else
      (cityWithFood, None)
  else
    (city, None)
