open Sprite

let playerSpriteDef =
  [| { color = ( 1,7) ; row = "  x  " }
   ; { color = ( 1,7) ; row = " xxx " }
   ; { color = ( 1,7) ; row = "  x  " }
   ; { color = ( 1,7) ; row = "  x  " }
   ; { color = ( 1,7) ; row = " x x " }
  |]

let citySpriteDef =
  [| { color = ( 3,7) ; row = "    x  " }
   ; { color = ( 3,5) ; row = " x  x  " }
   ; { color = ( 3,3) ; row = " xxxxx " }
   ; { color = ( 3,1) ; row = "xxxxxxx" }
   ; { color = ( 3,0) ; row = " x x x " }
  |]

let ruinSpriteDef =
  [| { color = ( 3,3) ; row = "       " }
   ; { color = ( 3,3) ; row = "       " }
   ; { color = ( 3,2) ; row = "  x x  " }
   ; { color = ( 3,1) ; row = " xxxxxx" }
   ; { color = ( 3,0) ; row = "xxxxxxx" }
  |]

let workerSpriteDef =
  [| { color = ( 6,5) ; row = "   x   " }
   ; { color = ( 6,4) ; row = " xxx   " }
   ; { color = ( 6,3) ; row = " xxx   " }
   ; { color = ( 6,2) ; row = "   xx  " }
   ; { color = ( 6,1) ; row = "  x x  " }
  |]

let deadWorkerSpriteDef =
  [| { color = ( 4,3) ; row = "       " }
   ; { color = ( 4,3) ; row = "       " }
   ; { color = ( 4,2) ; row = "x  xxx " }
   ; { color = ( 4,1) ; row = " xxxxxx" }
   ; { color = ( 4,0) ; row = "xx     " }
   |]

let targetDef =
  [| { color = ( 3,5) ; row = "x x" }
   ; { color = ( 3,5) ; row = " x " }
   ; { color = ( 3,5) ; row = "x x" }
  |]

let plantDef =
  [| { color = (10,6) ; row = "  x  " }
   ; { color = (10,5) ; row = "x x x" }
   ; { color = (10,4) ; row = " xxx " }
   ; { color = (10,3) ; row = " xxx " }
  |]

let rockDef =
  [| { color = ( 0,3) ; row = "  xxx  " }
   ; { color = ( 0,2) ; row = " xxxxx " }
   ; { color = ( 0,1) ; row = "  xxxx " }
  |]

let treeDef =
  [| { color = (10,3) ; row = "   x   " }
   ; { color = (10,3) ; row = "   x   " }
   ; { color = (10,4) ; row = "  xxx  " }
   ; { color = (10,4) ; row = "  xxx  " }
   ; { color = (10,5) ; row = " xxxxx " }
   ; { color = (10,5) ; row = " xxxxx " }
   ; { color = (10,6) ; row = "xxxxxxx" }
   ; { color = (10,3) ; row = "  xxx  " }
   ; { color = (10,3) ; row = "  xxx  " }
   ; { color = (10,5) ; row = " xxxxx " }
   ; { color = (10,5) ; row = " xxxxx " }
   ; { color = (10,6) ; row = "xxxxxxx" }
   ; { color = ( 2,0) ; row = "  xxx  " }
   ; { color = ( 2,0) ; row = "  xxx  " }
   ; { color = ( 2,0) ; row = "  xxx  " }
   ; { color = ( 2,0) ; row = "  xxx  " }
   ; { color = ( 2,0) ; row = "  xxx  " }
   ; { color = ( 2,0) ; row = "  xxx  " }
  |]

let pathDef =
  [| { color = ( 0,4) ; row = "                     " }
   ; { color = ( 0,4) ; row = "                     " }
   ; { color = ( 0,4) ; row = "                     " }
   ; { color = ( 0,4) ; row = "                     " }
   ; { color = ( 0,4) ; row = "                     " }
   ; { color = ( 0,4) ; row = "                     " }
   ; { color = ( 0,4) ; row = "                     " }
   ; { color = ( 0,4) ; row = "                     " }
   ; { color = ( 0,4) ; row = "                     " }
   ; { color = ( 0,3) ; row = "      xxxxxxxxx      " }
   ; { color = ( 0,2) ; row = "     xxxxxxxxxxx     " }
  |]

let entranceDef =
  [| { color = ( 2,7) ; row = "             " }
   ; { color = ( 2,7) ; row = "             " }
   ; { color = ( 2,7) ; row = "      x      " }
   ; { color = ( 2,6) ; row = "     xx      " }
   ; { color = ( 3,6) ; row = "    xx x     " }
   ; { color = ( 3,5) ; row = "     xx      " }
   ; { color = ( 0,0) ; row = "     xxx     " }
   ; { color = ( 0,0) ; row = "    xx xx    " }
  |]

let exitDef =
  [| { color = ( 0,7) ; row = "xxxxxxxxx" }
   ; { color = ( 0,7) ; row = "xx     xx" }
   ; { color = ( 0,7) ; row = "xx     xx" }
   ; { color = ( 0,7) ; row = "xx     xx" }
   ; { color = ( 0,7) ; row = "xx     xx" }
   ; { color = ( 0,7) ; row = "xx     xx" }
  |]

let digit0 =
  [| { color = ( 0,7) ; row = " 000 " }
   ; { color = ( 0,6) ; row = "00 00" }
   ; { color = ( 0,5) ; row = "00 00" }
   ; { color = ( 0,5) ; row = "00 00" }
   ; { color = ( 0,6) ; row = " 000 " }
  |]

let digit1 =
  [| { color = ( 0,7) ; row = "  11 " }
   ; { color = ( 0,6) ; row = " 111 " }
   ; { color = ( 0,5) ; row = "  11 " }
   ; { color = ( 0,5) ; row = "  11 " }
   ; { color = ( 0,5) ; row = "  11 " }
   ; { color = ( 0,6) ; row = "  11 " }
  |]

let digit2 =
  [| { color = ( 0,7) ; row = " 222 " }
   ; { color = ( 0,6) ; row = "22 22" }
   ; { color = ( 0,5) ; row = "   22" }
   ; { color = ( 0,5) ; row = "  22 " }
   ; { color = ( 0,5) ; row = " 22  " }
   ; { color = ( 0,6) ; row = "22222" }
  |]

let digit3 =
  [| { color = ( 0,7) ; row = "3333 " }
   ; { color = ( 0,6) ; row = "   33" }
   ; { color = ( 0,5) ; row = "3333 " }
   ; { color = ( 0,5) ; row = "   33" }
   ; { color = ( 0,5) ; row = "   33" }
   ; { color = ( 0,6) ; row = "3333 " }
  |]

let digit4 =
  [| { color = ( 0,7) ; row = "   44" }
   ; { color = ( 0,6) ; row = "44 44" }
   ; { color = ( 0,5) ; row = "44444" }
   ; { color = ( 0,5) ; row = "   44" }
   ; { color = ( 0,5) ; row = "   44" }
   ; { color = ( 0,6) ; row = "   44" }
  |]

let digit5 =
  [| { color = ( 0,7) ; row = "55555" }
   ; { color = ( 0,6) ; row = "55   " }
   ; { color = ( 0,5) ; row = "5555 " }
   ; { color = ( 0,5) ; row = "   55" }
   ; { color = ( 0,5) ; row = "   55" }
   ; { color = ( 0,6) ; row = "5555 " }
  |]

let digit6 =
  [| { color = ( 0,7) ; row = " 666 " }
   ; { color = ( 0,6) ; row = "66   " }
   ; { color = ( 0,5) ; row = "6666 " }
   ; { color = ( 0,5) ; row = "66 66" }
   ; { color = ( 0,5) ; row = "66 66" }
   ; { color = ( 0,6) ; row = " 666 " }
  |]

let digit7 =
  [| { color = ( 0,7) ; row = "77777" }
   ; { color = ( 0,6) ; row = "   77" }
   ; { color = ( 0,5) ; row = "  77 " }
   ; { color = ( 0,5) ; row = " 77  " }
   ; { color = ( 0,5) ; row = " 77  " }
   ; { color = ( 0,6) ; row = " 77  " }
  |]

let digit8 =
  [| { color = ( 0,7) ; row = " 888 " }
   ; { color = ( 0,6) ; row = "88 88" }
   ; { color = ( 0,5) ; row = " 888 " }
   ; { color = ( 0,5) ; row = "88 88" }
   ; { color = ( 0,5) ; row = "88 88" }
   ; { color = ( 0,6) ; row = " 888 " }
  |]

let digit9 =
  [| { color = ( 0,7) ; row = " 999 " }
   ; { color = ( 0,6) ; row = "99 99" }
   ; { color = ( 0,5) ; row = "99 99" }
   ; { color = ( 0,5) ; row = " 9999" }
   ; { color = ( 0,5) ; row = "   99" }
   ; { color = ( 0,6) ; row = " 999 " }
  |]

let letterA =
  [| { color = ( 0,7) ; row = " AAA " }
   ; { color = ( 0,6) ; row = "AA AA" }
   ; { color = ( 0,5) ; row = "AA AA" }
   ; { color = ( 0,5) ; row = "AAAAA" }
   ; { color = ( 0,5) ; row = "AA AA" }
   ; { color = ( 0,6) ; row = "AA AA" }
  |]

let letterB =
  [| { color = ( 0,7) ; row = "BBBB " }
   ; { color = ( 0,6) ; row = "BB BB" }
   ; { color = ( 0,5) ; row = "BBBB " }
   ; { color = ( 0,5) ; row = "BB BB" }
   ; { color = ( 0,5) ; row = "BB BB" }
   ; { color = ( 0,5) ; row = "BBBB " }
  |]

let letterC =
  [| { color = ( 0,7) ; row = " CCC " }
   ; { color = ( 0,6) ; row = "CC CC" }
   ; { color = ( 0,5) ; row = "CC   " }
   ; { color = ( 0,5) ; row = "CC   " }
   ; { color = ( 0,5) ; row = "CC CC" }
   ; { color = ( 0,5) ; row = " CCC " }
  |]

let letterD =
  [| { color = ( 0,7) ; row = "DDDD " }
   ; { color = ( 0,6) ; row = "DD DD" }
   ; { color = ( 0,5) ; row = "DD DD" }
   ; { color = ( 0,5) ; row = "DD DD" }
   ; { color = ( 0,5) ; row = "DD DD" }
   ; { color = ( 0,5) ; row = "DDDD " }
  |]

let letterE =
  [| { color = ( 0,7) ; row = "EEEEE" }
   ; { color = ( 0,6) ; row = "EE   " }
   ; { color = ( 0,5) ; row = "EEEE " }
   ; { color = ( 0,5) ; row = "EE   " }
   ; { color = ( 0,5) ; row = "EE   " }
   ; { color = ( 0,5) ; row = "EEEEE" }
  |]

let letterF =
  [| { color = ( 0,7) ; row = "FFFFF" }
   ; { color = ( 0,6) ; row = "FF   " }
   ; { color = ( 0,5) ; row = "FFFF " }
   ; { color = ( 0,5) ; row = "FF   " }
   ; { color = ( 0,5) ; row = "FF   " }
   ; { color = ( 0,5) ; row = "FF   " }
  |]

let letterG =
  [| { color = ( 0,7) ; row = " GGGG" }
   ; { color = ( 0,6) ; row = "GG   " }
   ; { color = ( 0,5) ; row = "GG   " }
   ; { color = ( 0,5) ; row = "GG GG" }
   ; { color = ( 0,5) ; row = "GG GG" }
   ; { color = ( 0,5) ; row = " GGG " }
  |]

let letterH =
  [| { color = ( 0,7) ; row = "HH HH" }
   ; { color = ( 0,6) ; row = "HH HH" }
   ; { color = ( 0,5) ; row = "HHHHH" }
   ; { color = ( 0,5) ; row = "HH HH" }
   ; { color = ( 0,5) ; row = "HH HH" }
   ; { color = ( 0,5) ; row = "HH HH" }
  |]

let letterI =
  [| { color = ( 0,7) ; row = "IIII " }
   ; { color = ( 0,6) ; row = " II  " }
   ; { color = ( 0,5) ; row = " II  " }
   ; { color = ( 0,5) ; row = " II  " }
   ; { color = ( 0,5) ; row = " II  " }
   ; { color = ( 0,5) ; row = "IIII " }
  |]

let letterJ =
  [| { color = ( 0,7) ; row = "   JJ" }
   ; { color = ( 0,6) ; row = "   JJ" }
   ; { color = ( 0,5) ; row = "   JJ" }
   ; { color = ( 0,5) ; row = "   JJ" }
   ; { color = ( 0,5) ; row = "JJ JJ" }
   ; { color = ( 0,5) ; row = " JJJ " }
  |]

let letterK =
  [| { color = ( 0,7) ; row = "KK KK" }
   ; { color = ( 0,6) ; row = "KK KK" }
   ; { color = ( 0,5) ; row = "KKKK " }
   ; { color = ( 0,5) ; row = "KK KK" }
   ; { color = ( 0,5) ; row = "KK KK" }
   ; { color = ( 0,5) ; row = "KK KK" }
  |]

let letterL =
  [| { color = ( 0,7) ; row = "LL   " }
   ; { color = ( 0,6) ; row = "LL   " }
   ; { color = ( 0,5) ; row = "LL   " }
   ; { color = ( 0,5) ; row = "LL   " }
   ; { color = ( 0,5) ; row = "LL   " }
   ; { color = ( 0,5) ; row = "LLLLL" }
  |]

let letterM =
  [| { color = ( 0,7) ; row = "MM MM" }
   ; { color = ( 0,6) ; row = "MMMMM" }
   ; { color = ( 0,5) ; row = "MMMMM" }
   ; { color = ( 0,5) ; row = "MM MM" }
   ; { color = ( 0,5) ; row = "MM MM" }
   ; { color = ( 0,5) ; row = "MM MM" }
  |]

let letterN =
  [| { color = ( 0,7) ; row = "MMNMM" }
   ; { color = ( 0,6) ; row = "MMNMM" }
   ; { color = ( 0,5) ; row = "MM MM" }
   ; { color = ( 0,5) ; row = "MM MM" }
   ; { color = ( 0,5) ; row = "MM MM" }
   ; { color = ( 0,5) ; row = "MM MM" }
  |]

let letterO =
  [| { color = ( 0,7) ; row = " OOO " }
   ; { color = ( 0,6) ; row = "OO OO" }
   ; { color = ( 0,5) ; row = "OO OO" }
   ; { color = ( 0,5) ; row = "OO OO" }
   ; { color = ( 0,5) ; row = "OO OO" }
   ; { color = ( 0,5) ; row = " OOO " }
  |]

let letterP =
  [| { color = ( 0,7) ; row = "PPPP " }
   ; { color = ( 0,6) ; row = "PP PP" }
   ; { color = ( 0,5) ; row = "PPPP " }
   ; { color = ( 0,5) ; row = "PP   " }
   ; { color = ( 0,5) ; row = "PP   " }
   ; { color = ( 0,5) ; row = "PP   " }
  |]

let letterQ =
  [| { color = ( 0,7) ; row = " QQQ " }
   ; { color = ( 0,6) ; row = "QQ QQ" }
   ; { color = ( 0,5) ; row = "QQ QQ" }
   ; { color = ( 0,5) ; row = "QQ QQ" }
   ; { color = ( 0,5) ; row = " QQQ " }
   ; { color = ( 0,5) ; row = "   QQ" }
  |]

let letterR =
  [| { color = ( 0,7) ; row = "RRRR " }
   ; { color = ( 0,6) ; row = "RR RR" }
   ; { color = ( 0,5) ; row = "RRRR " }
   ; { color = ( 0,5) ; row = "RR RR" }
   ; { color = ( 0,5) ; row = "RR RR" }
   ; { color = ( 0,5) ; row = "RR RR" }
  |]

let letterS =
  [| { color = ( 0,7) ; row = " SSSS" }
   ; { color = ( 0,6) ; row = "SS   " }
   ; { color = ( 0,5) ; row = " SSS " }
   ; { color = ( 0,5) ; row = "   SS" }
   ; { color = ( 0,5) ; row = "SS SS" }
   ; { color = ( 0,5) ; row = " SSS " }
  |]

let letterT =
  [| { color = ( 0,7) ; row = "TTTT " }
   ; { color = ( 0,6) ; row = " TT  " }
   ; { color = ( 0,5) ; row = " TT  " }
   ; { color = ( 0,5) ; row = " TT  " }
   ; { color = ( 0,5) ; row = " TT  " }
   ; { color = ( 0,5) ; row = " TT  " }
  |]

let letterU =
  [| { color = ( 0,7) ; row = "UU UU" }
   ; { color = ( 0,6) ; row = "UU UU" }
   ; { color = ( 0,5) ; row = "UU UU" }
   ; { color = ( 0,5) ; row = "UU UU" }
   ; { color = ( 0,5) ; row = "UU UU" }
   ; { color = ( 0,5) ; row = " UUU " }
  |]

let letterV =
  [| { color = ( 0,7) ; row = "VV VV" }
   ; { color = ( 0,6) ; row = "VV VV" }
   ; { color = ( 0,5) ; row = "VV VV" }
   ; { color = ( 0,5) ; row = "VV VV" }
   ; { color = ( 0,5) ; row = " VVV " }
   ; { color = ( 0,5) ; row = "  V  " }
  |]

let letterW =
  [| { color = ( 0,7) ; row = "WW WW" }
   ; { color = ( 0,6) ; row = "WW WW" }
   ; { color = ( 0,5) ; row = "WW WW" }
   ; { color = ( 0,5) ; row = "WW WW" }
   ; { color = ( 0,5) ; row = "WWWWW" }
   ; { color = ( 0,5) ; row = "WW WW" }
  |]

let letterX =
  [| { color = ( 0,7) ; row = "XX XX" }
   ; { color = ( 0,6) ; row = "XX XX" }
   ; { color = ( 0,5) ; row = " XXX " }
   ; { color = ( 0,5) ; row = "XX XX" }
   ; { color = ( 0,5) ; row = "XX XX" }
   ; { color = ( 0,5) ; row = "XX XX" }
  |]

let letterY =
  [| { color = ( 0,7) ; row = "YY YY" }
   ; { color = ( 0,6) ; row = "YY YY" }
   ; { color = ( 0,5) ; row = " YYY " }
   ; { color = ( 0,5) ; row = " YY  " }
   ; { color = ( 0,5) ; row = " YY  " }
   ; { color = ( 0,5) ; row = " YY  " }
  |]

let letterZ =
  [| { color = ( 0,7) ; row = "ZZZZZ" }
   ; { color = ( 0,6) ; row = "  ZZ " }
   ; { color = ( 0,5) ; row = " ZZ  " }
   ; { color = ( 0,5) ; row = "ZZ   " }
   ; { color = ( 0,5) ; row = "ZZ   " }
   ; { color = ( 0,5) ; row = "ZZZZZ" }
  |]

let symbolColon =
  [| { color = ( 0,7) ; row = "     " }
   ; { color = ( 0,6) ; row = "  :: " }
   ; { color = ( 0,5) ; row = "     " }
   ; { color = ( 0,5) ; row = "     " }
   ; { color = ( 0,5) ; row = "  :: " }
   ; { color = ( 0,5) ; row = "     " }
  |]

let emptySprite = compileSprite [| { color = (0,0) ; row = " " } |]
let colonSprite = compileSprite symbolColon

let digitSprites =
  Array.map compileSprite
    [| digit0
     ; digit1
     ; digit2
     ; digit3
     ; digit4
     ; digit5
     ; digit6
     ; digit7
     ; digit8
     ; digit9
    |]

let letterSprites =
  Array.map compileSprite
    [| letterA
     ; letterB
     ; letterC
     ; letterD
     ; letterE
     ; letterF
     ; letterG
     ; letterH
     ; letterI
     ; letterJ
     ; letterK
     ; letterL
     ; letterM
     ; letterN
     ; letterO
     ; letterP
     ; letterQ
     ; letterR
     ; letterS
     ; letterT
     ; letterU
     ; letterV
     ; letterW
     ; letterX
     ; letterY
     ; letterZ
    |]

let playerSprite = compileSprite playerSpriteDef
let citySprite = compileSprite citySpriteDef
let ruinSprite = compileSprite ruinSpriteDef
let workerSprite = compileSprite workerSpriteDef
let deadWorkerSprite = compileSprite deadWorkerSpriteDef
let targetSprite = compileSprite targetDef
let plantSprite = compileSprite plantDef
let rockSprite = compileSprite rockDef
let treeSprite = compileSprite treeDef
let entranceSprite = compileSprite entranceDef
let exitSprite = compileSprite exitDef
let pathSprite = compileSprite pathDef

let spriteForLetter ch =
  let code = Char.code ch in
  if ch >= '0' && ch <= '9' then
    Array.get digitSprites (code - 0x30)
  else if ch >= 'A' && ch <= 'Z' then
    Array.get letterSprites (code - 0x41)
  else if ch >= 'a' && ch <= 'z' then
    Array.get letterSprites (code - 0x61)
  else if ch == ' ' then
    emptySprite
  else
    colonSprite
