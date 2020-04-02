open Constants
open Contypes
open Worker
open City
open Gamestate

let plantGrowth = 1.0

let temperate game (px',py') =
  let px = (px' + worldSide) mod worldSide in
  let py = (py' + worldSide) mod worldSide in
  let height = Array.get game.world.groundData (py * game.world.groundX + px) in
  Math.abs ((Math.random ()) -. height) < 0.2

let rec startPlants n game =
  if n <= 0 then
    game
  else
    let chooseLocationX = (Math.random ()) *. (float_of_int worldSide) in
    let chooseLocationY = (Math.random ()) *. (float_of_int worldSide) in
    let locations =
      if Math.random () > 0.5 then
        let nextLocationX = if (Math.random ()) > 0.5 then 1.0 else -1.0 in
        [ (chooseLocationX, chooseLocationY) ; (nextLocationX, chooseLocationY) ]
      else
        let nextLocationY = if (Math.random ()) > 0.5 then 1.0 else -1.0 in
        [ (chooseLocationX, chooseLocationY) ; (chooseLocationX, nextLocationY) ]
    in
    startPlants (n-1)
      { game with
        plants =
          List.fold_left
            (fun s (px,py) -> IPointSet.add (int_of_float px, int_of_float py) s)
            game.plants locations
      }

let noPlants game pt =
  let cities =
    StringMap.fold (fun _ c s -> IPointSet.add (c.x,c.y) s) game.cities IPointSet.empty
  in
  let workers =
    game.workers
    |> StringMap.bindings
    |> List.map (fun (_,(w : Worker.worker)) -> (int_of_float w.x, int_of_float w.y))
    |> List.fold_left (fun s p -> IPointSet.add p s) IPointSet.empty
  in
  let nc = Life.pointsAndNeighbors (IPointSet.union cities workers) in
  let conditions = temperate game pt in
  not (IPointSet.mem pt nc) && conditions

let runPlants game =
  { game with
    plants = Life.run game.plants |> IPointSet.filter (noPlants game)
  }
