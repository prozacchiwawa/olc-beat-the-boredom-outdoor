open Walkpath
open FpAstar
open Rooms
open Animal
open FirstPerson

let walkToward incT moveRate (px,py) animal =
  Math.moveToward incT moveRate (px,py) (animal.x,animal.y)

let walkPointOut minigame animalWantDistance (ax,ay) (px,py) distanceToPlayer =
  let rec checkScaledMove awds =
    match awds with
    | [] -> None
    | awd::tl ->
      let scaledMoveTargetX =
        ax +. (px /. distanceToPlayer *. awd)
      in
      let scaledMoveTargetY =
        ay +. (py /. distanceToPlayer *. awd)
      in
      let pathTo =
        FirstPersonAStarRouter.makePath
          minigame
          (int_of_float px,int_of_float py)
          ( Math.clamp 0 (boardSize - 1) @@ int_of_float scaledMoveTargetX
          , Math.clamp 0 (boardSize - 1) @@ int_of_float scaledMoveTargetY
          )
      in
      match pathTo with
      | None -> checkScaledMove tl
      | Some p -> Some p
  in
  checkScaledMove animalWantDistance

let lineOfSightToPlayer minigame animal =
  Math.lineOfSight
    (animal.x,animal.y)
    (minigame.playerX,minigame.playerY)
    (fun (x,y) ->
       if x < 0 || x >= boardSize || y < 0 || y >= boardSize then
         true
       else
         let idx = ((boardSize * y) + x) in
         Array.get minigame.values idx <> None
    )

let beginStalking minigame animal =
  let (x,y) = chooseRandomEmpty minigame in
  (* Walk around our room trying to get line of sight to player *)
  FirstPersonAStarRouter.makePath
    minigame
    (int_of_float animal.x,int_of_float animal.y)
    (int_of_float x,int_of_float y)

let becomeScared minigame animalWantDistance animal =
  (* Try to run from player *)
  let playerVsWolfX = animal.x -. minigame.playerX in
  let playerVsWolfY = animal.y -. minigame.playerY in
  let distanceToPlayer = Math.distance (0.0,0.0) (playerVsWolfX,playerVsWolfY) in
  walkPointOut minigame animalWantDistance (animal.x,animal.y) (playerVsWolfX,playerVsWolfY) distanceToPlayer

let atePlayer =
  List.filter
    (function
      | AnimalAtePlayer -> true
      | _ -> false
    )

let killedByPlayer =
  List.map
    (function
      | AnimalDied x -> Some x
      | _ -> None
    )

let movedAnimals =
  List.map
    (function
      | AnimalMoved a -> Some a
      | _ -> None
    )
