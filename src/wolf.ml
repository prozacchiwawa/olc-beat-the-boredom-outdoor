open Rooms
open FirstPerson
open FpAstar
open Animal

let stalkTime = 1.0
let scaredTime = 0.7
let scaredRate = 12.0
let stalkRate = 6.0

let attackDist = 5.0
let attackSpeed = 8.0
let attackTime = 0.9

let animalWantDistance = [7.0;6.0;5.0;4.0;3.0;2.0;1.0]

let beginStalking minigame animal =
  let pathToPoint = AnimalMethods.beginStalking minigame animal in
  let attitude =
    match pathToPoint with
    | Some path ->
      WolfStalk (List.rev (Array.to_list path), minigame.worldTime +. stalkTime)
    | _ -> WolfIdle
  in
  { animal with kind = Wolf { attitude = attitude } }

let becomeScared minigame animal =
  let pathToPoint = AnimalMethods.becomeScared minigame animalWantDistance animal in
  match pathToPoint with
  | Some arr ->
    let pts = List.rev @@ Array.to_list arr in
    { animal with
      kind =
        Wolf { attitude = WolfScared (pts, minigame.worldTime +. scaredTime) }
    }
  | _ -> { animal with kind = Wolf { attitude = WolfIdle } }

let beginAttacking minigame animal =
  { animal with kind = Wolf { attitude = WolfAttack (minigame.worldTime +. attackTime) } }

(* For now, wolves try to achieve a certain distance range from the player, then rush in and
 * attack.
*)
let rec oneFrame incT minigame animal (wolf : wolfState) =
  match wolf.attitude with
  | WolfIdle -> AnimalMoved animal
  | WolfScared (pts,t) ->
    begin
      let (ax,ay) = (int_of_float animal.x, int_of_float animal.y) in
      match pts with
      | [] ->
        AnimalMoved
          (beginStalking minigame
             { animal with kind = Wolf { attitude = WolfIdle } }
          )
      | hd::tl ->
        if hd = (ax,ay) then
          oneFrame incT minigame animal { wolf with attitude = WolfStalk (tl,t) }
        else
          let (nx,ny) = AnimalMethods.walkToward incT stalkRate hd animal in
          AnimalMoved { animal with x = nx ; y = ny ; kind = Wolf wolf }
    end
  | WolfStalk (pts,t) ->
    begin
      let (ax,ay) = (int_of_float animal.x, int_of_float animal.y) in
      match pts with
      | [] ->
        AnimalMoved
          (beginStalking minigame
             { animal with
               kind =
                 Wolf { attitude = WolfIdle }
             }
          )
      | hd::tl ->
        if hd = (ax,ay) then
          oneFrame incT minigame animal { wolf with attitude = WolfStalk (tl,t) }
        else
          let (nx,ny) = AnimalMethods.walkToward incT stalkRate hd animal in
          (* From stalk to attak *)
          let playerDist = Math.distance (nx,ny) (minigame.playerX,minigame.playerY) in
          let moved = { animal with x = nx ; y = ny ; kind = Wolf wolf } in
          if playerDist <= attackDist then
            let lineOfSight = AnimalMethods.lineOfSightToPlayer minigame animal in
            if lineOfSight then
              AnimalMoved (beginAttacking minigame animal)
            else
              AnimalMoved moved
          else
            AnimalMoved moved
    end
  | WolfAttack t ->
    if t <= minigame.worldTime then
      AnimalMoved (becomeScared minigame animal)
    else if (int_of_float animal.x, int_of_float animal.y) = (int_of_float minigame.playerX,int_of_float minigame.playerY) then
      AnimalAtePlayer
    else
      (* Run toward the player at an accelerated rate and deal damage on adjacent tile *)
      let (nx,ny) =
        AnimalMethods.walkToward incT attackSpeed
          (int_of_float minigame.playerX,int_of_float minigame.playerY) animal
      in
      AnimalMoved { animal with x = nx ; y = ny }
