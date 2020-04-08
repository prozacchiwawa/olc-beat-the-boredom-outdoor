open Contypes
open Rooms
open Allstate
open FirstPerson

let emptyMinigame =
  { values = Array.make (boardSize * boardSize) None
  ; actors = []
  ; objects = []
  ; roomMap = IPointMap.empty
  ; playerX = 7.5
  ; playerY = 15.5
  ; playerDir = 0.0
  ; score = 0.0
  ; outcome = None
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

let rec generateAnimals n minigame =
  let squareChoice =
    int_of_float @@ (float_of_int (boardSize * boardSize)) *. (Math.random ())
  in
  let choiceAtN = Array.get minigame.values squareChoice in
  if n <= 0 then
    minigame
  else if choiceAtN <> None then
    generateAnimals n minigame
  else
    let x = (float_of_int (squareChoice mod boardSize)) +. 0.5 in
    let y = (float_of_int (squareChoice / boardSize)) +. 0.5 in
    let animal = { kind = Wolf { time = 0.0 ; attitude = WolfStalk } ; x = x ; y = y } in
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

let makeMazeDef biome =
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
  let minigame =
    { emptyMinigame with
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

(* Choose a path starting at ax,ay that maximizes distance from the player in n blocks *)
let pathAwayFromPlayer n (px,py) (ax,ay) =
  []

(* For now, wolves try to achieve a certain distance range from the player, then rush in and
 * attack.
*)
let oneFrameWolf minigame animal wolf =
  match wolf.attitude with
  | WolfScared ->
    (* Try to run from player *)
    animal
  | WolfStalk ->
    (* Walk around our room trying to get line of sight to player *)
    animal
  | WolfAttack ->
    (* Run toward the player at an accelerated rate and deal damage on adjacent tile *)
    animal

let oneFrameAnimal minigame animal =
  match animal.kind with
  | Wolf wolfState -> oneFrameWolf minigame animal wolfState

let oneFrame moveAmt rotAmt minigame =
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
  minigame
