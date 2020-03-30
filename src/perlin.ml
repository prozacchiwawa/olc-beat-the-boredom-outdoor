open Contypes

type ground =
  { groundX : int
  ; groundY : int
  ; groundData : float array
  }

let noiseArray n = Array.init n (fun _ -> Math.random ())

let noiseField noise x y =
  let isample xx yy = Array.get noise ((xx mod x) + ((yy mod y) * x)) in
  let sample (scale : int) (xx : int) (yy : int) =
    let xSample = (xx * scale) mod x in
    let ySample = (yy * scale) mod y in
    (isample xSample ySample) /. (float_of_int scale)
  in
  let heightAt (xx : int) (yy : int) =
    let scale = ref (max x y) in
    let result = ref 0.0 in
    while !scale >= 1 do
      let _ = result := !result +. (sample !scale xx yy) in
      scale := !scale / 2
    done ;
    !result
  in
  { groundX = x
  ; groundY = y
  ; groundData =
      Array.init (x * y)
        (fun i ->
           let yy = i / x in
           let xx = i mod x in
           heightAt xx yy
        )
  }
