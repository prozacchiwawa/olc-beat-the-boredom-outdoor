open Contypes
open Allstate
open FirstPerson

let emptyMinigame =
  { values = Array.make (boardSize * boardSize) None
  ; actors = []
  ; objects = []
  ; playerX = 7.5
  ; playerY = 15.5
  ; playerDir = 0.0
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

let generate biome minigame =
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
      ) badMinigameDef
  in
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
  | Plant -> SpriteDefs.plantSprite
  | Rock -> SpriteDefs.rockSprite
  | Tree -> SpriteDefs.treeSprite
  | Entrance -> SpriteDefs.entranceSprite
  | Exit -> SpriteDefs.exitSprite

let draw state minigame =
  let antiR = minigame.playerDir *. (-1.0) in
  let pp = (minigame.playerX, minigame.playerY) in
  let objectsOnGrid =
    minigame.values |> Array.mapi
      (fun i v ->
         match v with
         | Some obj ->
           let (atX,atY) = coordOf i in
           let (ax,ay) =
             ( (float_of_int (atX * 10)) +. 5.0 -. (minigame.playerX *. 10.0)
             , (float_of_int (atY * 10)) +. 5.0 -. (minigame.playerY *. 10.0)
             )
           in
           Some (rotateCoords minigame.playerDir (ax,ay), obj)
         | _ -> None
      )
  in
  let zz = (0.0,0.0) in
  objectsOnGrid
  |> Array.to_list
  |> catOptions
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
       let centerOfScaledSpriteY = (float_of_int ((sprite.height / 2) - 3)) /. py in
       Sprite.drawSpriteCenter
         state.spec
         sprite
         (int_of_float ((float_of_int (state.spec.width / 2)) +. (px /. py)))
         (int_of_float ((float_of_int (state.spec.height / 2)) +. centerOfScaledSpriteY))
         (int_of_float ((float_of_int (3 * sprite.width / 2)) /. py))
         (int_of_float ((float_of_int (3 * sprite.height / 2)) /. py))
    )

let moveDist = 10.0
let rotDist = 5.0

let handleMove amt minigame =
  let (vx,vy) = viewDirection (minigame.playerDir +. (Math.pi /. 2.0)) in
  { minigame with
    playerX = minigame.playerX +. (vx *. amt *. moveDist)
  ; playerY = minigame.playerY +. (vy *. amt *. moveDist)
  }

let handleRot amt minigame =
  { minigame with
    playerDir = minigame.playerDir +. (amt *. rotDist)
  }
