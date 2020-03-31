
type ground =
  { groundX : int
  ; groundY : int
  ; groundData : float array
  }

let noiseArray n = Array.init n (fun _ -> Math.random ())

let neighbors xx yy = [| (xx,yy) ; (xx+1,yy) ; (xx,yy+1) ; (xx+1,yy+1) |]

let neighborWeights pctX pctY rs =
  let invX = 1.0 -. pctX in
  let invY = 1.0 -. pctY in
  [| (Array.get rs 0) *. invX *. invY
   ; (Array.get rs 1) *. pctX *. invY
   ; (Array.get rs 2) *. invX *. pctY
   ; (Array.get rs 3) *. pctX *. pctY
  |]

let noiseField noise x y =
  let maxScale = max x y in
  let isample xx yy = Array.get noise ((xx mod x) + ((yy mod y) * x)) in
  let sample (scale : int) (xx : int) (yy : int) =
    let rs = Array.map (fun (xx,yy) -> isample (xx mod x) (yy mod y)) @@ neighbors (xx / scale) (yy / scale) in
    let pctX = (float_of_int (xx mod scale)) /. (float_of_int scale) in
    let pctY = (float_of_int (yy mod scale)) /. (float_of_int scale) in
    (Array.fold_left (+.) 0.0 @@ neighborWeights pctX pctY rs) *. (float_of_int scale)
  in
  let heightAt (xx : int) (yy : int) =
    let scale = ref maxScale in
    let result = ref 0.0 in
    while !scale >= 1 do
      result := !result +. (sample !scale xx yy) ;
      scale := !scale / 2
    done ;
    !result
  in
  let groundData =
    Array.init (x * y)
      (fun i ->
         let yy = i / x in
         let xx = i mod x in
         heightAt xx yy
      )
  in
  let minSample' = Array.fold_left min (Array.get groundData 0) groundData in
  let maxSample' = Array.fold_left max (Array.get groundData 0) groundData in
  let minSample = ((maxSample' -. minSample') /. 4.5) +. minSample' in
  let maxSample = (0.8 *. (maxSample' -. minSample')) +. minSample' in
  let normalizedGround =
    Array.map (fun g -> min 1.0 (max 0.0 ((g -. minSample) /. (maxSample -. minSample)))) groundData
  in
  let _ = Js.log normalizedGround in
  { groundX = x
  ; groundY = y
  ; groundData = normalizedGround
  }
