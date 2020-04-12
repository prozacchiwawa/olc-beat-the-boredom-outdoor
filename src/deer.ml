open Animal
open FirstPerson

let eatTime = 3.0
let stalkTime = 1.0
let scaredTime = 0.7

let stalkRate = 3.0
let frightDistance = 3.0

let foodScore = 10.0

let animalWantDistance = [4.0;3.0;2.0;1.0]

let beginStalking minigame animal =
  let pathToPoint = AnimalMethods.beginStalking minigame animal in
  let attitude =
    match pathToPoint with
    | Some path ->
      DeerStalk (List.rev (Array.to_list path), minigame.worldTime +. stalkTime)
    | _ -> DeerEat (minigame.worldTime +. eatTime)
  in
  { animal with kind = Deer { attitude = attitude } }

let becomeScared minigame animal =
  let pathToPoint = AnimalMethods.becomeScared minigame animalWantDistance animal in
  match pathToPoint with
  | Some arr ->
    let pts = List.rev @@ Array.to_list arr in
    { animal with
      kind =
        Deer { attitude = DeerScared (pts, minigame.worldTime +. scaredTime) }
    }
  | _ -> { animal with kind = Deer { attitude = DeerEat (minigame.worldTime +. eatTime) } }

let rec oneFrameUpdate incT minigame animal (deer : deerState) =
  match deer.attitude with
  | DeerEat t ->
    if minigame.worldTime > t then
      (beginStalking minigame animal)
    else
      animal
  | DeerScared (pts,t) ->
      begin
        let (ax,ay) = (int_of_float animal.x, int_of_float animal.y) in
        match pts with
        | [] -> { animal with kind = Deer { attitude = DeerEat (minigame.worldTime +. eatTime) } }
        | hd::tl ->
          if hd = (ax,ay) then
            oneFrameUpdate incT minigame animal { deer with attitude = DeerStalk (tl,t) }
          else
            let (nx,ny) = AnimalMethods.walkToward incT stalkRate hd animal in
            { animal with x = nx ; y = ny ; kind = Deer deer }
      end
  | DeerStalk (pts,t) ->
    begin
      let (ax,ay) = (int_of_float animal.x, int_of_float animal.y) in
      match pts with
      | [] -> { animal with kind = Deer { attitude = DeerEat (minigame.worldTime +. eatTime) } }
      | hd::tl ->
        if hd = (ax,ay) then
          oneFrameUpdate incT minigame animal { deer with attitude = DeerStalk (tl,t) }
        else
          let (nx,ny) = AnimalMethods.walkToward incT stalkRate hd animal in
          let playerDist = Math.distance (nx,ny) (minigame.playerX, minigame.playerY) in
          let moved = { animal with x = nx ; y = ny ; kind = Deer deer } in
          if playerDist < frightDistance then
            let lineOfSight = AnimalMethods.lineOfSightToPlayer minigame animal in
            if lineOfSight then
              (becomeScared minigame animal)
            else
              moved
          else
            moved
    end

let oneFrame incT minigame animal deer =
  if
    (int_of_float animal.x, int_of_float animal.y) =
    (int_of_float minigame.playerX, int_of_float minigame.playerY) then
    AnimalDied foodScore
  else
    AnimalMoved (oneFrameUpdate incT minigame animal deer)
