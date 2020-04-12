open Contypes
open Rooms
open Allstate
open Walkpath
open FirstPerson

module FirstPersonAStar = struct
  type t = minigame
  let blocked (x,y) minigame = Array.get minigame.values ((y * boardSize) + x) <> None
end

module FirstPersonAStarRouter = AStarSpacial(FirstPersonAStar)

let emptyMinigame realTime =
  { values = Array.make (boardSize * boardSize) None
  ; actors = []
  ; objects = []
  ; roomMap = IPointMap.empty
  ; playerX = 7.5
  ; playerY = 15.5
  ; playerDir = 0.0
  ; score = 0.0
  ; outcome = None
  ; realTime = realTime
  ; worldTime = 0.0
  }

let indexOf x y = ((y mod boardSize) * boardSize) + (x mod boardSize)

let badMinigameDef =
  [| "rrrrrrrxrrrrrr"
   ; "rpppp    ppppr"
   ; "r p   t   pppr"
   ; "r pp      pp r"
   ; "r  ppp   pp  r"
   ; "r   pppp  p  r"
   ; "rp   pp  pp  r"
   ; "rpp   p  pp  r"
   ; "rppp     pp  r"
   ; "r pp pp      r"
   ; "r  pppppppp  r"
   ; "rp     pp   pr"
   ; "rpppp     pppr"
   ; "rpppppp pppppr"
   ; "rrrrrrrerrrrrr"
  |]

let coordOf i =
  let y = i / boardSize in
  let x = i mod boardSize in
  (x,y)

let rec chooseRandomEmpty minigame =
  let squareChoice =
    int_of_float @@ (float_of_int (boardSize * boardSize)) *. (Math.random ())
  in
  let choiceAtN = Array.get minigame.values squareChoice in
  if choiceAtN <> None then
    chooseRandomEmpty minigame
  else
    let x = (float_of_int (squareChoice mod boardSize)) +. 0.5 in
    let y = (float_of_int (squareChoice / boardSize)) +. 0.5 in
    (x,y)

let stalkTime = 1.0
let scaredTime = 0.7

let beginStalking minigame animal =
  let (x,y) = chooseRandomEmpty minigame in
  (* Walk around our room trying to get line of sight to player *)
  let pathToPoint =
    FirstPersonAStarRouter.makePath
      minigame
      (int_of_float animal.x,int_of_float animal.y)
      (int_of_float x,int_of_float y)
  in
  let attitude =
    match pathToPoint with
    | Some path ->
      WolfStalk (List.rev (Array.to_list path), minigame.worldTime +. stalkTime)
    | _ -> WolfIdle
  in
  { animal with kind = Wolf { time = 0.0 ; attitude = attitude } }

let rec generateAnimals n minigame =
  if n <= 0 then
    minigame
  else
    let (sx,sy) = chooseRandomEmpty minigame in
    let animal =
      beginStalking minigame
        { kind = Wolf { time = 0.0 ; attitude = WolfIdle }
        ; x = sx
        ; y = sy
        }
    in
    generateAnimals (n-1) { minigame with actors = animal :: minigame.actors }

let isEntrance = function
  | Some (Entrance _) -> true
  | _ -> false

let findEntrance minigame =
  let candidates =
    Array.mapi (fun i v -> if isEntrance v then Some i else None) minigame.values
    |> Array.to_list
    |> catOptions
  in
  match candidates with
  | [] -> None
  | hd::_ -> Some (coordOf hd)

(* Find locations where things can be put *)
let getFreeLocations minigame =
  let res = ref IPointSet.empty in
  let _ =
    Array.iteri
      (fun i s ->
         let at = (i mod boardSize, i / boardSize) in
         if s = None then
           res := IPointSet.add at (!res)
         else
           ()
      ) minigame.values
  in
  !res

let numRoomCenters = 11

let makeMazeDef biome realTime =
  let blockObject () =
    let o =
      match biome with
      | 0 -> Math.randomlyChooseInOrder 0.5 [Lilypad; Plant]
      | 1 -> Math.randomlyChooseInOrder 0.5 [Plant; Plant; Tree; Lilypad]
      | 2 -> Math.randomlyChooseInOrder 0.5 [Plant; Rock; Tree]
      | 3 -> Math.randomlyChooseInOrder 0.5 [Tree; Plant; Plant; Rock]
      | 4 -> Math.randomlyChooseInOrder 0.5 [Tree; Tree; Plant; Rock]
      | 5 -> Math.randomlyChooseInOrder 0.5 [Rock; Tree; Tree; Plant]
      | 6 -> Math.randomlyChooseInOrder 0.5 [Rock; Tree; Rock; Plant]
      | _ -> None
    in
    o |> optionElse (fun _ -> Plant)
  in
  let roomSeeds = emptyRoomDesign numRoomCenters in
  let rs = Rooms.makeRandomBoard boardSize roomSeeds in
  let emptyGame = emptyMinigame realTime in
  let minigame =
    { emptyGame with
      values =
        Array.init (boardSize * boardSize)
          (fun i ->
             let pt = (i mod boardSize, i / boardSize) in
             if rs.entrance = pt then
               Some Entrance
             else if rs.exit = pt then
               Some Exit
             else if IPointSet.mem pt rs.wallSet then
               Some (blockObject ())
             else
               None
          )
    }
  in
  let minigame = generateAnimals numAnimals minigame in
  match findEntrance minigame with
  | Some (ex,ey) ->
    { minigame with
      playerX = (float_of_int ex) +. 0.5
    ; playerY = (float_of_int ey) +. 0.5
    ; playerDir = Math.pi
    }
  | _ -> minigame

let generateWithDef minigameDef biome minigame =
  let _ =
    Array.iteri
      (fun i s ->
         let sl = String.length s in
         for j = 0 to sl - 1 do
           let ch = String.get s j in
           let boardAt =
             match ch with
             | 'r' -> Some Rock
             | 'p' -> Some Plant
             | 't' -> Some Tree
             | 'e' -> Some Entrance
             | 'x' -> Some Exit
             | _ -> None
           in
           Array.set minigame.values (indexOf j i) boardAt
         done
      ) minigameDef
  in
  let minigame = generateAnimals numAnimals minigame in
  match findEntrance minigame with
  | Some (x,y) ->
    { minigame with playerX = (float_of_int x) +. 0.5 ; playerY = (float_of_int y) +. 0.5 }
  | _ -> minigame

(*
   Treasure of tarmin / robot tank style:
   +-------------------------------------------------+
   |@/     \@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@|
   |@/     \@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@|
   |//     \/////////////////////////////////////////|
   |---| |-------------------------------------------|
   |...| |...........................................|
   |===| |===========================================|
   |   | |                                           |
   |  /   \                                          |
   |/^^^---..                                        |
   |         \                                       |
   |________-/                                       |
   +-------------------------------------------------+
 *)

let viewDirection playerDir = (Math.cos playerDir, (-1.0 *. (Math.sin playerDir)))

let rotateCoords dir (px,py) =
  let x = (px *. (Math.cos dir)) -. (py *. (Math.sin dir)) in
  let y = (py *. (Math.cos dir)) +. (px *. (Math.sin dir)) in
  (x,y)

let chooseDecoSprite = function
  | Board Lilypad -> SpriteDefs.lilypadSprite
  | Board Plant -> SpriteDefs.plantSprite
  | Board Rock -> SpriteDefs.rockSprite
  | Board Tree -> SpriteDefs.treeSprite
  | Board Entrance -> SpriteDefs.entranceSprite
  | Board Exit -> SpriteDefs.exitSprite
  | Board Water -> SpriteDefs.waterSprite
  | Board Path -> SpriteDefs.pathSprite
  | Actor (Wolf _) -> SpriteDefs.wolfSprite

let spriteWidth = 8.0

let draw state minigame =
  let (px,py) = (int_of_float state.game.player.x, int_of_float state.game.player.y) in
  let idx = (py * state.game.world.groundX) + px in
  let altitude = Array.get state.game.world.groundData idx in
  let biome = int_of_float @@ altitude *. 7.0 in
  let objectsOnGrid =
    minigame.values
    |> Array.mapi
      (fun i v ->
         let (atX,atY) = coordOf i in
         let (ax,ay) = ((float_of_int atX) +. 0.5, (float_of_int atY) +. 0.5) in
         match v with
         | Some obj -> ((ax, ay), Board obj)
         | _ -> ((ax, ay), if biome < 1 then Board Water else Board Path)
      )
  in
  let animals =
    minigame.actors
    |> List.map (fun a -> ((a.x,a.y), Actor a.kind))
    |> Array.of_list
  in
  let zz = (0.0,0.0) in
  Array.concat [ animals ; objectsOnGrid ]
  |> Array.map
    (fun ((atX,atY),obj) ->
       let (ax,ay) =
         ( (atX *. 10.0) -. (minigame.playerX *. 10.0)
         , (atY *. 10.0) -. (minigame.playerY *. 10.0)
         )
       in
      (rotateCoords minigame.playerDir (ax,ay), obj)
    )
  |> Array.to_list
  |> List.filter (fun ((_,ty),_) -> ty < -0.01)
  |> List.sort
    (fun (t1p,t1) (t2p,t2) ->
       let d1 = Math.distance t1p zz in
       let d2 = Math.distance t2p zz in
       (-1) * (Pervasives.compare d1 d2)
    )
  |> List.iter
    (fun ((px,py'),t) ->
       let py = py' /. 150.0 in
       let sprite = chooseDecoSprite t in
       let scale = spriteWidth /. (float_of_int sprite.width) in
       let aspect = (float_of_int sprite.height) /. (float_of_int sprite.width) in
       let pz = scale *. (float_of_int ((sprite.height / 2) - (sprite.width / 2))) in
       Sprite.drawSpriteCenter
         state.spec
         sprite
         (int_of_float ((float_of_int (state.spec.width / 2)) +. (px /. py)))
         (int_of_float ((float_of_int (state.spec.height / 2)) +. (pz /. py)))
         (int_of_float (spriteWidth /. py))
         (int_of_float (aspect *. spriteWidth /. py))
    )

let moveDist = 10.0
let rotDist = 5.0
let animalWantDistance = [7.0;6.0;5.0;4.0;3.0;2.0;1.0]

let walkPointOut minigame (ax,ay) (px,py) distanceToPlayer =
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
          (int_of_float scaledMoveTargetX,int_of_float scaledMoveTargetY)
      in
      match pathTo with
      | None -> checkScaledMove tl
      | Some p -> Some p
  in
  checkScaledMove animalWantDistance

let scaredRate = 12.0
let stalkRate = 6.0

let walkToward incT moveRate (px,py) animal =
  Math.moveToward incT moveRate (px,py) (animal.x,animal.y)

let becomeScared minigame animal wolf =
  (* Try to run from player *)
  let playerVsWolfX = animal.x -. minigame.playerX in
  let playerVsWolfY = animal.y -. minigame.playerY in
  let distanceToPlayer = Math.distance (0.0,0.0) (playerVsWolfX,playerVsWolfY) in
  let pathToPoint =
    walkPointOut minigame (animal.x,animal.y) (playerVsWolfX,playerVsWolfY) distanceToPlayer
  in
  match pathToPoint with
  | Some arr ->
    let pts = List.rev @@ Array.to_list arr in
    { animal with
      kind =
        Wolf { time = 0.0 ; attitude = WolfScared (pts, minigame.worldTime +. scaredTime) }
    }
  | _ -> { animal with kind = Wolf { time = 0.0 ; attitude = WolfIdle } }

let attackDist = 6.0
let attackSpeed = 12.0
let attackTime = 1.2

let beginAttacking minigame animal wolf =
  { animal with kind = Wolf { time = 0.0 ; attitude = WolfAttack (minigame.worldTime +. attackTime) } }

(* For now, wolves try to achieve a certain distance range from the player, then rush in and
 * attack.
*)
let rec oneFrameWolf incT minigame animal wolf =
  match wolf.attitude with
  | WolfIdle -> Some animal
  | WolfScared (pts,t) ->
    begin
      let (ax,ay) = (int_of_float animal.x, int_of_float animal.y) in
      match pts with
      | [] ->
        Some
          (beginStalking minigame
             { animal with kind = Wolf { time = 0.0; attitude = WolfIdle } }
          )
      | hd::tl ->
        if hd = (ax,ay) then
          oneFrameWolf incT minigame animal { wolf with attitude = WolfStalk (tl,t) }
        else
          let (nx,ny) = walkToward incT stalkRate hd animal in
          Some { animal with x = nx ; y = ny ; kind = Wolf wolf }
    end
  | WolfStalk (pts,t) ->
    begin
      let (ax,ay) = (int_of_float animal.x, int_of_float animal.y) in
      match pts with
      | [] ->
        Some
          (beginStalking minigame
             { animal with
               kind =
                 Wolf { time = 0.0 ; attitude = WolfIdle }
             }
          )
      | hd::tl ->
        if hd = (ax,ay) then
          oneFrameWolf incT minigame animal { wolf with attitude = WolfStalk (tl,t) }
        else
          let (nx,ny) = walkToward incT stalkRate hd animal in
          (* From stalk to attak *)
          let playerDist = Math.distance (nx,ny) (minigame.playerX,minigame.playerY) in
          let lineOfSight =
            Math.lineOfSight
              (nx,ny)
              (minigame.playerX,minigame.playerY)
              (fun (x',y') ->
                 let (x,y) = (int_of_float x', int_of_float y') in
                 if x < 0 || x >= boardSize || y < 0 || y >= boardSize then
                   true
                 else
                   let idx = ((boardSize * y) + x) in
                   Array.get minigame.values idx <> None
              )
          in
          if playerDist <= attackDist && lineOfSight then
            Some (beginAttacking minigame animal wolf)
          else
            Some { animal with x = nx ; y = ny ; kind = Wolf wolf }
    end
  | WolfAttack t ->
    if t <= minigame.worldTime then
      Some (becomeScared minigame animal wolf)
    else if (int_of_float animal.x, int_of_float animal.y) = (int_of_float minigame.playerX,int_of_float minigame.playerY) then
      None
    else
      (* Run toward the player at an accelerated rate and deal damage on adjacent tile *)
      let (nx,ny) =
        walkToward incT attackSpeed
          (int_of_float minigame.playerX,int_of_float minigame.playerY) animal
      in
      Some { animal with x = nx ; y = ny }

let oneFrameAnimal incT minigame animal =
  match animal.kind with
  | Wolf wolfState -> oneFrameWolf incT minigame animal wolfState

let oneFrame ts moveAmt' rotAmt' minigame =
  let lastTs = minigame.realTime in
  let lastWorldTime = minigame.worldTime in
  let worldTime = minigame.worldTime +. ((ts -. lastTs) /. 6000.0) in
  let incT = worldTime -. lastWorldTime in
  let minigame =
    { minigame with
      realTime = ts
    ; worldTime = worldTime
    }
  in
  let moveAmt = moveAmt' *. incT in
  let rotAmt = rotAmt' *. incT in
  let handleMove amt minigame =
    let (vx,vy) = viewDirection (minigame.playerDir +. (Math.pi /. 2.0)) in
    let px =
      max 0.0 (min (float_of_int boardSize) (minigame.playerX +. (vx *. amt *. moveDist)))
    in
    let py =
      max 0.0 (min (float_of_int boardSize) (minigame.playerY +. (vy *. amt *. moveDist)))
    in
    let idx = indexOf (int_of_float px) (int_of_float py) in
    let whatsThere = Array.get minigame.values idx in
    let updated =
      { minigame with
        playerX = px
      ; playerY = py
      }
    in
    match whatsThere with
    | Some Exit -> { updated with outcome = Some { foodAdj = minigame.score ; win = true } }
    | Some Entrance -> updated
    | Some _ -> minigame
    | _ -> updated
  in
  let handleRot amt minigame =
    { minigame with
      playerDir = minigame.playerDir +. (amt *. rotDist)
    }
  in
  let minigame = handleRot rotAmt @@ handleMove moveAmt minigame in
  let updatedAnimals = List.map (oneFrameAnimal incT minigame) minigame.actors in
  let replacedAnimals = catOptions updatedAnimals in
  (* A wolf ended the game if true *)
  if List.length replacedAnimals <> List.length minigame.actors then
    { minigame with
      outcome = Some { foodAdj = -50.0 ; win = false }
    }
  else
    { minigame with
      actors = replacedAnimals
    }
