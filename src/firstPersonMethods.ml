open Contypes
open Rooms
open Animal
open Allstate
open Walkpath
open FirstPerson
open FpAstar

let emptyMinigame realTime =
  { values = Array.make (boardSize * boardSize) None
  ; actors = []
  ; arrow = None
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

let rec generateAnimals wolves deer minigame =
  if wolves <= 0 && deer <= 0 then
    minigame
  else if wolves > 0 then
    let (sx,sy) = chooseRandomEmpty minigame in
    let animal =
      Wolf.beginStalking minigame
        { kind = Wolf { attitude = WolfIdle }
        ; x = sx
        ; y = sy
        }
    in
    generateAnimals (wolves-1) deer { minigame with actors = animal :: minigame.actors }
  else
    let (sx,sy) = chooseRandomEmpty minigame in
    let animal =
      Deer.beginStalking minigame
        { kind = Deer { attitude = DeerEat 0.0 }
        ; x = sx
        ; y = sy
        }
    in
    generateAnimals wolves (deer-1) { minigame with actors = animal :: minigame.actors }

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
  let minigame = generateAnimals numWolves numDeer minigame in
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
  let minigame = generateAnimals numWolves numDeer minigame in
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

let chooseDecoSprite = function
  | Board Lilypad -> SpriteDefs.lilypadSprite
  | Board Plant -> SpriteDefs.plantSprite
  | Board Rock -> SpriteDefs.rockSprite
  | Board Tree -> SpriteDefs.treeSprite
  | Board Entrance -> SpriteDefs.entranceSprite
  | Board Exit -> SpriteDefs.exitSprite
  | Board Water -> SpriteDefs.waterSprite
  | Board Path -> SpriteDefs.pathSprite
  | Missile -> SpriteDefs.arrowSprite
  | Actor (Wolf _) -> SpriteDefs.wolfSprite
  | Actor (Deer st) ->
    match st.attitude with
    | DeerEat _ -> SpriteDefs.deerEatSprite
    | _ -> SpriteDefs.deerWalkSprite

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
  let arrows =
    match minigame.arrow with
    | Some arrow -> [| ((arrow.arrowX,arrow.arrowY), Missile) |]
    | _ -> [| |]
  in
  let zz = (0.0,0.0) in
  Array.concat [ arrows ; animals ; objectsOnGrid ]
  |> Array.map
    (fun ((atX,atY),obj) ->
       let (ax,ay) =
         ( (atX *. 10.0) -. (minigame.playerX *. 10.0)
         , (atY *. 10.0) -. (minigame.playerY *. 10.0)
         )
       in
      (Math.rotateCoords minigame.playerDir (ax,ay), obj)
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

let oneFrameAnimal incT minigame animal =
  match animal.kind with
  | Wolf wolfState -> Wolf.oneFrame incT minigame animal wolfState
  | Deer deerState -> Deer.oneFrame incT minigame animal deerState

let oneFrame ts moveAmt' rotAmt' space minigame =
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
  let spawnArrow minigame =
    let (vx,vy) = viewDirection (minigame.playerDir +. (Math.pi /. 2.0)) in
    Some
      { arrowX = minigame.playerX
      ; arrowY = minigame.playerY
      ; endTime = minigame.worldTime +. arrowTime
      ; xi = vx *. arrowSpeed
      ; yi = vy *. arrowSpeed
      }
  in
  let minigame = handleRot rotAmt @@ handleMove moveAmt minigame in
  let updatedAnimals = List.map (oneFrameAnimal incT minigame) minigame.actors in
  let atePlayer =
    AnimalMethods.atePlayer updatedAnimals
  in
  let replacedAnimals =
    AnimalMethods.movedAnimals updatedAnimals
    |> catOptions
  in
  let (hitAnimals,missedAnimals) =
    match minigame.arrow with
    | None -> ([], replacedAnimals)
    | Some arrow ->
      List.fold_left
        (fun (hit,miss) a ->
           let distance = Math.distance (arrow.arrowX,arrow.arrowY) (a.x,a.y) in
           if distance < 0.3 then
             (((AnimalDied 3.0)::hit), miss)
           else
             (hit, a::miss)
        )
        ([],[])
        replacedAnimals
  in
  let killedByPlayer =
    AnimalMethods.killedByPlayer (List.concat [ updatedAnimals ; hitAnimals ])
    |> catOptions
    |> List.fold_left (+.) 0.0
  in
  (* A wolf ended the game if true *)
  if atePlayer <> [] then
    { minigame with
      outcome = Some { foodAdj = -50.0 ; win = false }
    }
  else
    { minigame with
      actors = missedAnimals
    ; score = killedByPlayer +. minigame.score
    ; arrow =
        if minigame.arrow = None && space then
          let a = spawnArrow minigame in
          let _ = Js.log a in
          a
        else
          match minigame.arrow with
          | Some arrow ->
            if arrow.endTime < minigame.worldTime then
              None
            else
              Some
                { arrow with
                  arrowX = arrow.arrowX +. (arrow.xi *. incT)
                ; arrowY = arrow.arrowY +. (arrow.yi *. incT)
                }
          | _ -> None
    }
