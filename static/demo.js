(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

var Curry = require("./curry.js");
var Caml_obj = require("./caml_obj.js");
var Caml_array = require("./caml_array.js");
var Caml_exceptions = require("./caml_exceptions.js");
var Caml_js_exceptions = require("./caml_js_exceptions.js");
var Caml_builtin_exceptions = require("./caml_builtin_exceptions.js");

var make_float = Caml_array.caml_make_float_vect;

var Floatarray = { };

function init(l, f) {
  if (l === 0) {
    return /* array */[];
  } else {
    if (l < 0) {
      throw [
            Caml_builtin_exceptions.invalid_argument,
            "Array.init"
          ];
    }
    var res = Caml_array.caml_make_vect(l, Curry._1(f, 0));
    for(var i = 1 ,i_finish = l - 1 | 0; i <= i_finish; ++i){
      res[i] = Curry._1(f, i);
    }
    return res;
  }
}

function make_matrix(sx, sy, init) {
  var res = Caml_array.caml_make_vect(sx, /* array */[]);
  for(var x = 0 ,x_finish = sx - 1 | 0; x <= x_finish; ++x){
    res[x] = Caml_array.caml_make_vect(sy, init);
  }
  return res;
}

function copy(a) {
  var l = a.length;
  if (l === 0) {
    return /* array */[];
  } else {
    return Caml_array.caml_array_sub(a, 0, l);
  }
}

function append(a1, a2) {
  var l1 = a1.length;
  if (l1 === 0) {
    return copy(a2);
  } else if (a2.length === 0) {
    return Caml_array.caml_array_sub(a1, 0, l1);
  } else {
    return a1.concat(a2);
  }
}

function sub(a, ofs, len) {
  if (ofs < 0 || len < 0 || ofs > (a.length - len | 0)) {
    throw [
          Caml_builtin_exceptions.invalid_argument,
          "Array.sub"
        ];
  }
  return Caml_array.caml_array_sub(a, ofs, len);
}

function fill(a, ofs, len, v) {
  if (ofs < 0 || len < 0 || ofs > (a.length - len | 0)) {
    throw [
          Caml_builtin_exceptions.invalid_argument,
          "Array.fill"
        ];
  }
  for(var i = ofs ,i_finish = (ofs + len | 0) - 1 | 0; i <= i_finish; ++i){
    a[i] = v;
  }
  return /* () */0;
}

function blit(a1, ofs1, a2, ofs2, len) {
  if (len < 0 || ofs1 < 0 || ofs1 > (a1.length - len | 0) || ofs2 < 0 || ofs2 > (a2.length - len | 0)) {
    throw [
          Caml_builtin_exceptions.invalid_argument,
          "Array.blit"
        ];
  }
  return Caml_array.caml_array_blit(a1, ofs1, a2, ofs2, len);
}

function iter(f, a) {
  for(var i = 0 ,i_finish = a.length - 1 | 0; i <= i_finish; ++i){
    Curry._1(f, a[i]);
  }
  return /* () */0;
}

function iter2(f, a, b) {
  if (a.length !== b.length) {
    throw [
          Caml_builtin_exceptions.invalid_argument,
          "Array.iter2: arrays must have the same length"
        ];
  }
  for(var i = 0 ,i_finish = a.length - 1 | 0; i <= i_finish; ++i){
    Curry._2(f, a[i], b[i]);
  }
  return /* () */0;
}

function map(f, a) {
  var l = a.length;
  if (l === 0) {
    return /* array */[];
  } else {
    var r = Caml_array.caml_make_vect(l, Curry._1(f, a[0]));
    for(var i = 1 ,i_finish = l - 1 | 0; i <= i_finish; ++i){
      r[i] = Curry._1(f, a[i]);
    }
    return r;
  }
}

function map2(f, a, b) {
  var la = a.length;
  var lb = b.length;
  if (la !== lb) {
    throw [
          Caml_builtin_exceptions.invalid_argument,
          "Array.map2: arrays must have the same length"
        ];
  }
  if (la === 0) {
    return /* array */[];
  } else {
    var r = Caml_array.caml_make_vect(la, Curry._2(f, a[0], b[0]));
    for(var i = 1 ,i_finish = la - 1 | 0; i <= i_finish; ++i){
      r[i] = Curry._2(f, a[i], b[i]);
    }
    return r;
  }
}

function iteri(f, a) {
  for(var i = 0 ,i_finish = a.length - 1 | 0; i <= i_finish; ++i){
    Curry._2(f, i, a[i]);
  }
  return /* () */0;
}

function mapi(f, a) {
  var l = a.length;
  if (l === 0) {
    return /* array */[];
  } else {
    var r = Caml_array.caml_make_vect(l, Curry._2(f, 0, a[0]));
    for(var i = 1 ,i_finish = l - 1 | 0; i <= i_finish; ++i){
      r[i] = Curry._2(f, i, a[i]);
    }
    return r;
  }
}

function to_list(a) {
  var _i = a.length - 1 | 0;
  var _res = /* [] */0;
  while(true) {
    var res = _res;
    var i = _i;
    if (i < 0) {
      return res;
    } else {
      _res = /* :: */[
        a[i],
        res
      ];
      _i = i - 1 | 0;
      continue ;
    }
  };
}

function list_length(_accu, _param) {
  while(true) {
    var param = _param;
    var accu = _accu;
    if (param) {
      _param = param[1];
      _accu = accu + 1 | 0;
      continue ;
    } else {
      return accu;
    }
  };
}

function of_list(l) {
  if (l) {
    var a = Caml_array.caml_make_vect(list_length(0, l), l[0]);
    var _i = 1;
    var _param = l[1];
    while(true) {
      var param = _param;
      var i = _i;
      if (param) {
        a[i] = param[0];
        _param = param[1];
        _i = i + 1 | 0;
        continue ;
      } else {
        return a;
      }
    };
  } else {
    return /* array */[];
  }
}

function fold_left(f, x, a) {
  var r = x;
  for(var i = 0 ,i_finish = a.length - 1 | 0; i <= i_finish; ++i){
    r = Curry._2(f, r, a[i]);
  }
  return r;
}

function fold_right(f, a, x) {
  var r = x;
  for(var i = a.length - 1 | 0; i >= 0; --i){
    r = Curry._2(f, a[i], r);
  }
  return r;
}

function exists(p, a) {
  var n = a.length;
  var _i = 0;
  while(true) {
    var i = _i;
    if (i === n) {
      return false;
    } else if (Curry._1(p, a[i])) {
      return true;
    } else {
      _i = i + 1 | 0;
      continue ;
    }
  };
}

function for_all(p, a) {
  var n = a.length;
  var _i = 0;
  while(true) {
    var i = _i;
    if (i === n) {
      return true;
    } else if (Curry._1(p, a[i])) {
      _i = i + 1 | 0;
      continue ;
    } else {
      return false;
    }
  };
}

function mem(x, a) {
  var n = a.length;
  var _i = 0;
  while(true) {
    var i = _i;
    if (i === n) {
      return false;
    } else if (Caml_obj.caml_equal(a[i], x)) {
      return true;
    } else {
      _i = i + 1 | 0;
      continue ;
    }
  };
}

function memq(x, a) {
  var n = a.length;
  var _i = 0;
  while(true) {
    var i = _i;
    if (i === n) {
      return false;
    } else if (x === a[i]) {
      return true;
    } else {
      _i = i + 1 | 0;
      continue ;
    }
  };
}

var Bottom = Caml_exceptions.create("Array.Bottom");

function sort(cmp, a) {
  var maxson = function (l, i) {
    var i31 = ((i + i | 0) + i | 0) + 1 | 0;
    var x = i31;
    if ((i31 + 2 | 0) < l) {
      if (Curry._2(cmp, Caml_array.caml_array_get(a, i31), Caml_array.caml_array_get(a, i31 + 1 | 0)) < 0) {
        x = i31 + 1 | 0;
      }
      if (Curry._2(cmp, Caml_array.caml_array_get(a, x), Caml_array.caml_array_get(a, i31 + 2 | 0)) < 0) {
        x = i31 + 2 | 0;
      }
      return x;
    } else if ((i31 + 1 | 0) < l && Curry._2(cmp, Caml_array.caml_array_get(a, i31), Caml_array.caml_array_get(a, i31 + 1 | 0)) < 0) {
      return i31 + 1 | 0;
    } else if (i31 < l) {
      return i31;
    } else {
      throw [
            Bottom,
            i
          ];
    }
  };
  var trickle = function (l, i, e) {
    try {
      var l$1 = l;
      var _i = i;
      var e$1 = e;
      while(true) {
        var i$1 = _i;
        var j = maxson(l$1, i$1);
        if (Curry._2(cmp, Caml_array.caml_array_get(a, j), e$1) > 0) {
          Caml_array.caml_array_set(a, i$1, Caml_array.caml_array_get(a, j));
          _i = j;
          continue ;
        } else {
          return Caml_array.caml_array_set(a, i$1, e$1);
        }
      };
    }
    catch (raw_exn){
      var exn = Caml_js_exceptions.internalToOCamlException(raw_exn);
      if (exn[0] === Bottom) {
        return Caml_array.caml_array_set(a, exn[1], e);
      } else {
        throw exn;
      }
    }
  };
  var bubble = function (l, i) {
    try {
      var l$1 = l;
      var _i = i;
      while(true) {
        var i$1 = _i;
        var j = maxson(l$1, i$1);
        Caml_array.caml_array_set(a, i$1, Caml_array.caml_array_get(a, j));
        _i = j;
        continue ;
      };
    }
    catch (raw_exn){
      var exn = Caml_js_exceptions.internalToOCamlException(raw_exn);
      if (exn[0] === Bottom) {
        return exn[1];
      } else {
        throw exn;
      }
    }
  };
  var trickleup = function (_i, e) {
    while(true) {
      var i = _i;
      var father = (i - 1 | 0) / 3 | 0;
      if (i === father) {
        throw [
              Caml_builtin_exceptions.assert_failure,
              /* tuple */[
                "array.ml",
                238,
                4
              ]
            ];
      }
      if (Curry._2(cmp, Caml_array.caml_array_get(a, father), e) < 0) {
        Caml_array.caml_array_set(a, i, Caml_array.caml_array_get(a, father));
        if (father > 0) {
          _i = father;
          continue ;
        } else {
          return Caml_array.caml_array_set(a, 0, e);
        }
      } else {
        return Caml_array.caml_array_set(a, i, e);
      }
    };
  };
  var l = a.length;
  for(var i = ((l + 1 | 0) / 3 | 0) - 1 | 0; i >= 0; --i){
    trickle(l, i, Caml_array.caml_array_get(a, i));
  }
  for(var i$1 = l - 1 | 0; i$1 >= 2; --i$1){
    var e = Caml_array.caml_array_get(a, i$1);
    Caml_array.caml_array_set(a, i$1, Caml_array.caml_array_get(a, 0));
    trickleup(bubble(i$1, 0), e);
  }
  if (l > 1) {
    var e$1 = Caml_array.caml_array_get(a, 1);
    Caml_array.caml_array_set(a, 1, Caml_array.caml_array_get(a, 0));
    return Caml_array.caml_array_set(a, 0, e$1);
  } else {
    return 0;
  }
}

function stable_sort(cmp, a) {
  var merge = function (src1ofs, src1len, src2, src2ofs, src2len, dst, dstofs) {
    var src1r = src1ofs + src1len | 0;
    var src2r = src2ofs + src2len | 0;
    var _i1 = src1ofs;
    var _s1 = Caml_array.caml_array_get(a, src1ofs);
    var _i2 = src2ofs;
    var _s2 = Caml_array.caml_array_get(src2, src2ofs);
    var _d = dstofs;
    while(true) {
      var d = _d;
      var s2 = _s2;
      var i2 = _i2;
      var s1 = _s1;
      var i1 = _i1;
      if (Curry._2(cmp, s1, s2) <= 0) {
        Caml_array.caml_array_set(dst, d, s1);
        var i1$1 = i1 + 1 | 0;
        if (i1$1 < src1r) {
          _d = d + 1 | 0;
          _s1 = Caml_array.caml_array_get(a, i1$1);
          _i1 = i1$1;
          continue ;
        } else {
          return blit(src2, i2, dst, d + 1 | 0, src2r - i2 | 0);
        }
      } else {
        Caml_array.caml_array_set(dst, d, s2);
        var i2$1 = i2 + 1 | 0;
        if (i2$1 < src2r) {
          _d = d + 1 | 0;
          _s2 = Caml_array.caml_array_get(src2, i2$1);
          _i2 = i2$1;
          continue ;
        } else {
          return blit(a, i1, dst, d + 1 | 0, src1r - i1 | 0);
        }
      }
    };
  };
  var isortto = function (srcofs, dst, dstofs, len) {
    for(var i = 0 ,i_finish = len - 1 | 0; i <= i_finish; ++i){
      var e = Caml_array.caml_array_get(a, srcofs + i | 0);
      var j = (dstofs + i | 0) - 1 | 0;
      while(j >= dstofs && Curry._2(cmp, Caml_array.caml_array_get(dst, j), e) > 0) {
        Caml_array.caml_array_set(dst, j + 1 | 0, Caml_array.caml_array_get(dst, j));
        j = j - 1 | 0;
      };
      Caml_array.caml_array_set(dst, j + 1 | 0, e);
    }
    return /* () */0;
  };
  var sortto = function (srcofs, dst, dstofs, len) {
    if (len <= 5) {
      return isortto(srcofs, dst, dstofs, len);
    } else {
      var l1 = len / 2 | 0;
      var l2 = len - l1 | 0;
      sortto(srcofs + l1 | 0, dst, dstofs + l1 | 0, l2);
      sortto(srcofs, a, srcofs + l2 | 0, l1);
      return merge(srcofs + l2 | 0, l1, dst, dstofs + l1 | 0, l2, dst, dstofs);
    }
  };
  var l = a.length;
  if (l <= 5) {
    return isortto(0, a, 0, l);
  } else {
    var l1 = l / 2 | 0;
    var l2 = l - l1 | 0;
    var t = Caml_array.caml_make_vect(l2, Caml_array.caml_array_get(a, 0));
    sortto(l1, t, 0, l2);
    sortto(0, a, l2, l1);
    return merge(l2, l1, t, 0, l2, a, 0);
  }
}

var create_matrix = make_matrix;

var concat = Caml_array.caml_array_concat;

var fast_sort = stable_sort;

exports.make_float = make_float;
exports.init = init;
exports.make_matrix = make_matrix;
exports.create_matrix = create_matrix;
exports.append = append;
exports.concat = concat;
exports.sub = sub;
exports.copy = copy;
exports.fill = fill;
exports.blit = blit;
exports.to_list = to_list;
exports.of_list = of_list;
exports.iter = iter;
exports.iteri = iteri;
exports.map = map;
exports.mapi = mapi;
exports.fold_left = fold_left;
exports.fold_right = fold_right;
exports.iter2 = iter2;
exports.map2 = map2;
exports.for_all = for_all;
exports.exists = exists;
exports.mem = mem;
exports.memq = memq;
exports.sort = sort;
exports.stable_sort = stable_sort;
exports.fast_sort = fast_sort;
exports.Floatarray = Floatarray;
/* No side effect */

},{"./caml_array.js":5,"./caml_builtin_exceptions.js":6,"./caml_exceptions.js":8,"./caml_js_exceptions.js":14,"./caml_obj.js":15,"./curry.js":24}],2:[function(require,module,exports){
'use strict';


function __(tag, block) {
  block.tag = tag;
  return block;
}

exports.__ = __;
/* No side effect */

},{}],3:[function(require,module,exports){
'use strict';

var Bytes = require("./bytes.js");
var Curry = require("./curry.js");
var $$String = require("./string.js");
var Caml_bytes = require("./caml_bytes.js");
var Pervasives = require("./pervasives.js");
var Caml_string = require("./caml_string.js");
var Caml_builtin_exceptions = require("./caml_builtin_exceptions.js");

function create(n) {
  var n$1 = n < 1 ? 1 : n;
  var s = Caml_bytes.caml_create_bytes(n$1);
  return {
          buffer: s,
          position: 0,
          length: n$1,
          initial_buffer: s
        };
}

function contents(b) {
  return Bytes.sub_string(b.buffer, 0, b.position);
}

function to_bytes(b) {
  return Bytes.sub(b.buffer, 0, b.position);
}

function sub(b, ofs, len) {
  if (ofs < 0 || len < 0 || ofs > (b.position - len | 0)) {
    throw [
          Caml_builtin_exceptions.invalid_argument,
          "Buffer.sub"
        ];
  }
  return Bytes.sub_string(b.buffer, ofs, len);
}

function blit(src, srcoff, dst, dstoff, len) {
  if (len < 0 || srcoff < 0 || srcoff > (src.position - len | 0) || dstoff < 0 || dstoff > (dst.length - len | 0)) {
    throw [
          Caml_builtin_exceptions.invalid_argument,
          "Buffer.blit"
        ];
  }
  return Caml_bytes.caml_blit_bytes(src.buffer, srcoff, dst, dstoff, len);
}

function nth(b, ofs) {
  if (ofs < 0 || ofs >= b.position) {
    throw [
          Caml_builtin_exceptions.invalid_argument,
          "Buffer.nth"
        ];
  }
  return b.buffer[ofs];
}

function length(b) {
  return b.position;
}

function clear(b) {
  b.position = 0;
  return /* () */0;
}

function reset(b) {
  b.position = 0;
  b.buffer = b.initial_buffer;
  b.length = b.buffer.length;
  return /* () */0;
}

function resize(b, more) {
  var len = b.length;
  var new_len = len;
  while((b.position + more | 0) > new_len) {
    new_len = (new_len << 1);
  };
  var new_buffer = Caml_bytes.caml_create_bytes(new_len);
  Bytes.blit(b.buffer, 0, new_buffer, 0, b.position);
  b.buffer = new_buffer;
  b.length = new_len;
  return /* () */0;
}

function add_char(b, c) {
  var pos = b.position;
  if (pos >= b.length) {
    resize(b, 1);
  }
  b.buffer[pos] = c;
  b.position = pos + 1 | 0;
  return /* () */0;
}

function add_utf_8_uchar(b, u) {
  var u$1 = u;
  if (u$1 < 0) {
    throw [
          Caml_builtin_exceptions.assert_failure,
          /* tuple */[
            "buffer.ml",
            90,
            19
          ]
        ];
  }
  if (u$1 <= 127) {
    return add_char(b, u$1);
  } else if (u$1 <= 2047) {
    var pos = b.position;
    if ((pos + 2 | 0) > b.length) {
      resize(b, 2);
    }
    b.buffer[pos] = 192 | (u$1 >>> 6);
    b.buffer[pos + 1 | 0] = 128 | u$1 & 63;
    b.position = pos + 2 | 0;
    return /* () */0;
  } else if (u$1 <= 65535) {
    var pos$1 = b.position;
    if ((pos$1 + 3 | 0) > b.length) {
      resize(b, 3);
    }
    b.buffer[pos$1] = 224 | (u$1 >>> 12);
    b.buffer[pos$1 + 1 | 0] = 128 | (u$1 >>> 6) & 63;
    b.buffer[pos$1 + 2 | 0] = 128 | u$1 & 63;
    b.position = pos$1 + 3 | 0;
    return /* () */0;
  } else if (u$1 <= 1114111) {
    var pos$2 = b.position;
    if ((pos$2 + 4 | 0) > b.length) {
      resize(b, 4);
    }
    b.buffer[pos$2] = 240 | (u$1 >>> 18);
    b.buffer[pos$2 + 1 | 0] = 128 | (u$1 >>> 12) & 63;
    b.buffer[pos$2 + 2 | 0] = 128 | (u$1 >>> 6) & 63;
    b.buffer[pos$2 + 3 | 0] = 128 | u$1 & 63;
    b.position = pos$2 + 4 | 0;
    return /* () */0;
  } else {
    throw [
          Caml_builtin_exceptions.assert_failure,
          /* tuple */[
            "buffer.ml",
            123,
            8
          ]
        ];
  }
}

function add_utf_16be_uchar(b, u) {
  var u$1 = u;
  if (u$1 < 0) {
    throw [
          Caml_builtin_exceptions.assert_failure,
          /* tuple */[
            "buffer.ml",
            126,
            19
          ]
        ];
  }
  if (u$1 <= 65535) {
    var pos = b.position;
    if ((pos + 2 | 0) > b.length) {
      resize(b, 2);
    }
    b.buffer[pos] = (u$1 >>> 8);
    b.buffer[pos + 1 | 0] = u$1 & 255;
    b.position = pos + 2 | 0;
    return /* () */0;
  } else if (u$1 <= 1114111) {
    var u$prime = u$1 - 65536 | 0;
    var hi = 55296 | (u$prime >>> 10);
    var lo = 56320 | u$prime & 1023;
    var pos$1 = b.position;
    if ((pos$1 + 4 | 0) > b.length) {
      resize(b, 4);
    }
    b.buffer[pos$1] = (hi >>> 8);
    b.buffer[pos$1 + 1 | 0] = hi & 255;
    b.buffer[pos$1 + 2 | 0] = (lo >>> 8);
    b.buffer[pos$1 + 3 | 0] = lo & 255;
    b.position = pos$1 + 4 | 0;
    return /* () */0;
  } else {
    throw [
          Caml_builtin_exceptions.assert_failure,
          /* tuple */[
            "buffer.ml",
            144,
            8
          ]
        ];
  }
}

function add_utf_16le_uchar(b, u) {
  var u$1 = u;
  if (u$1 < 0) {
    throw [
          Caml_builtin_exceptions.assert_failure,
          /* tuple */[
            "buffer.ml",
            147,
            19
          ]
        ];
  }
  if (u$1 <= 65535) {
    var pos = b.position;
    if ((pos + 2 | 0) > b.length) {
      resize(b, 2);
    }
    b.buffer[pos] = u$1 & 255;
    b.buffer[pos + 1 | 0] = (u$1 >>> 8);
    b.position = pos + 2 | 0;
    return /* () */0;
  } else if (u$1 <= 1114111) {
    var u$prime = u$1 - 65536 | 0;
    var hi = 55296 | (u$prime >>> 10);
    var lo = 56320 | u$prime & 1023;
    var pos$1 = b.position;
    if ((pos$1 + 4 | 0) > b.length) {
      resize(b, 4);
    }
    b.buffer[pos$1] = hi & 255;
    b.buffer[pos$1 + 1 | 0] = (hi >>> 8);
    b.buffer[pos$1 + 2 | 0] = lo & 255;
    b.buffer[pos$1 + 3 | 0] = (lo >>> 8);
    b.position = pos$1 + 4 | 0;
    return /* () */0;
  } else {
    throw [
          Caml_builtin_exceptions.assert_failure,
          /* tuple */[
            "buffer.ml",
            165,
            8
          ]
        ];
  }
}

function add_substring(b, s, offset, len) {
  if (offset < 0 || len < 0 || offset > (s.length - len | 0)) {
    throw [
          Caml_builtin_exceptions.invalid_argument,
          "Buffer.add_substring/add_subbytes"
        ];
  }
  var new_position = b.position + len | 0;
  if (new_position > b.length) {
    resize(b, len);
  }
  Bytes.blit_string(s, offset, b.buffer, b.position, len);
  b.position = new_position;
  return /* () */0;
}

function add_subbytes(b, s, offset, len) {
  return add_substring(b, Caml_bytes.bytes_to_string(s), offset, len);
}

function add_string(b, s) {
  var len = s.length;
  var new_position = b.position + len | 0;
  if (new_position > b.length) {
    resize(b, len);
  }
  Bytes.blit_string(s, 0, b.buffer, b.position, len);
  b.position = new_position;
  return /* () */0;
}

function add_bytes(b, s) {
  return add_string(b, Caml_bytes.bytes_to_string(s));
}

function add_buffer(b, bs) {
  return add_subbytes(b, bs.buffer, 0, bs.position);
}

function add_channel(b, ic, len) {
  if (len < 0) {
    throw [
          Caml_builtin_exceptions.invalid_argument,
          "Buffer.add_channel"
        ];
  }
  if ((b.position + len | 0) > b.length) {
    resize(b, len);
  }
  var b$1 = b;
  var ic$1 = ic;
  var _len = len;
  while(true) {
    var len$1 = _len;
    if (len$1 > 0) {
      var n = Pervasives.input(ic$1, b$1.buffer, b$1.position, len$1);
      b$1.position = b$1.position + n | 0;
      if (n === 0) {
        throw Caml_builtin_exceptions.end_of_file;
      }
      _len = len$1 - n | 0;
      continue ;
    } else {
      return 0;
    }
  };
}

function output_buffer(oc, b) {
  return Pervasives.output(oc, b.buffer, 0, b.position);
}

function closing(param) {
  if (param !== 40) {
    if (param !== 123) {
      throw [
            Caml_builtin_exceptions.assert_failure,
            /* tuple */[
              "buffer.ml",
              216,
              9
            ]
          ];
    } else {
      return /* "}" */125;
    }
  } else {
    return /* ")" */41;
  }
}

function advance_to_closing(opening, closing, k, s, start) {
  var _k = k;
  var _i = start;
  var lim = s.length;
  while(true) {
    var i = _i;
    var k$1 = _k;
    if (i >= lim) {
      throw Caml_builtin_exceptions.not_found;
    }
    if (Caml_string.get(s, i) === opening) {
      _i = i + 1 | 0;
      _k = k$1 + 1 | 0;
      continue ;
    } else if (Caml_string.get(s, i) === closing) {
      if (k$1 === 0) {
        return i;
      } else {
        _i = i + 1 | 0;
        _k = k$1 - 1 | 0;
        continue ;
      }
    } else {
      _i = i + 1 | 0;
      continue ;
    }
  };
}

function advance_to_non_alpha(s, start) {
  var _i = start;
  var lim = s.length;
  while(true) {
    var i = _i;
    if (i >= lim) {
      return lim;
    } else {
      var match = Caml_string.get(s, i);
      if (match >= 91) {
        if (match >= 97) {
          if (match >= 123) {
            return i;
          }
          
        } else if (match !== 95) {
          return i;
        }
        
      } else if (match >= 58) {
        if (match < 65) {
          return i;
        }
        
      } else if (match < 48) {
        return i;
      }
      _i = i + 1 | 0;
      continue ;
    }
  };
}

function find_ident(s, start, lim) {
  if (start >= lim) {
    throw Caml_builtin_exceptions.not_found;
  }
  var c = Caml_string.get(s, start);
  if (c !== 40 && c !== 123) {
    var stop = advance_to_non_alpha(s, start + 1 | 0);
    return /* tuple */[
            $$String.sub(s, start, stop - start | 0),
            stop
          ];
  }
  var new_start = start + 1 | 0;
  var stop$1 = advance_to_closing(c, closing(c), 0, s, new_start);
  return /* tuple */[
          $$String.sub(s, new_start, (stop$1 - start | 0) - 1 | 0),
          stop$1 + 1 | 0
        ];
}

function add_substitute(b, f, s) {
  var lim = s.length;
  var _previous = /* " " */32;
  var _i = 0;
  while(true) {
    var i = _i;
    var previous = _previous;
    if (i < lim) {
      var current = Caml_string.get(s, i);
      if (current !== 36) {
        if (previous === /* "\\" */92) {
          add_char(b, /* "\\" */92);
          add_char(b, current);
          _i = i + 1 | 0;
          _previous = /* " " */32;
          continue ;
        } else if (current !== 92) {
          add_char(b, current);
          _i = i + 1 | 0;
          _previous = current;
          continue ;
        } else {
          _i = i + 1 | 0;
          _previous = current;
          continue ;
        }
      } else if (previous === /* "\\" */92) {
        add_char(b, current);
        _i = i + 1 | 0;
        _previous = /* " " */32;
        continue ;
      } else {
        var j = i + 1 | 0;
        var match = find_ident(s, j, lim);
        add_string(b, Curry._1(f, match[0]));
        _i = match[1];
        _previous = /* " " */32;
        continue ;
      }
    } else if (previous === /* "\\" */92) {
      return add_char(b, previous);
    } else {
      return 0;
    }
  };
}

function truncate(b, len) {
  if (len < 0 || len > b.position) {
    throw [
          Caml_builtin_exceptions.invalid_argument,
          "Buffer.truncate"
        ];
  }
  b.position = len;
  return /* () */0;
}

exports.create = create;
exports.contents = contents;
exports.to_bytes = to_bytes;
exports.sub = sub;
exports.blit = blit;
exports.nth = nth;
exports.length = length;
exports.clear = clear;
exports.reset = reset;
exports.add_char = add_char;
exports.add_utf_8_uchar = add_utf_8_uchar;
exports.add_utf_16le_uchar = add_utf_16le_uchar;
exports.add_utf_16be_uchar = add_utf_16be_uchar;
exports.add_string = add_string;
exports.add_bytes = add_bytes;
exports.add_substring = add_substring;
exports.add_subbytes = add_subbytes;
exports.add_substitute = add_substitute;
exports.add_buffer = add_buffer;
exports.add_channel = add_channel;
exports.output_buffer = output_buffer;
exports.truncate = truncate;
/* No side effect */

},{"./bytes.js":4,"./caml_builtin_exceptions.js":6,"./caml_bytes.js":7,"./caml_string.js":18,"./curry.js":24,"./pervasives.js":27,"./string.js":30}],4:[function(require,module,exports){
'use strict';

var Char = require("./char.js");
var Curry = require("./curry.js");
var Caml_bytes = require("./caml_bytes.js");
var Caml_primitive = require("./caml_primitive.js");
var Caml_builtin_exceptions = require("./caml_builtin_exceptions.js");

function make(n, c) {
  var s = Caml_bytes.caml_create_bytes(n);
  Caml_bytes.caml_fill_bytes(s, 0, n, c);
  return s;
}

function init(n, f) {
  var s = Caml_bytes.caml_create_bytes(n);
  for(var i = 0 ,i_finish = n - 1 | 0; i <= i_finish; ++i){
    s[i] = Curry._1(f, i);
  }
  return s;
}

var empty = [];

function copy(s) {
  var len = s.length;
  var r = Caml_bytes.caml_create_bytes(len);
  Caml_bytes.caml_blit_bytes(s, 0, r, 0, len);
  return r;
}

function to_string(b) {
  return Caml_bytes.bytes_to_string(copy(b));
}

function of_string(s) {
  return copy(Caml_bytes.bytes_of_string(s));
}

function sub(s, ofs, len) {
  if (ofs < 0 || len < 0 || ofs > (s.length - len | 0)) {
    throw [
          Caml_builtin_exceptions.invalid_argument,
          "String.sub / Bytes.sub"
        ];
  }
  var r = Caml_bytes.caml_create_bytes(len);
  Caml_bytes.caml_blit_bytes(s, ofs, r, 0, len);
  return r;
}

function sub_string(b, ofs, len) {
  return Caml_bytes.bytes_to_string(sub(b, ofs, len));
}

function $plus$plus(a, b) {
  var c = a + b | 0;
  var match = a < 0;
  var match$1 = b < 0;
  var match$2 = c < 0;
  if (match) {
    if (match$1 && !match$2) {
      throw [
            Caml_builtin_exceptions.invalid_argument,
            "Bytes.extend"
          ];
    } else {
      return c;
    }
  } else if (match$1) {
    return c;
  } else {
    if (match$2) {
      throw [
            Caml_builtin_exceptions.invalid_argument,
            "Bytes.extend"
          ];
    }
    return c;
  }
}

function extend(s, left, right) {
  var len = $plus$plus($plus$plus(s.length, left), right);
  var r = Caml_bytes.caml_create_bytes(len);
  var match = left < 0 ? /* tuple */[
      -left | 0,
      0
    ] : /* tuple */[
      0,
      left
    ];
  var dstoff = match[1];
  var srcoff = match[0];
  var cpylen = Caml_primitive.caml_int_min(s.length - srcoff | 0, len - dstoff | 0);
  if (cpylen > 0) {
    Caml_bytes.caml_blit_bytes(s, srcoff, r, dstoff, cpylen);
  }
  return r;
}

function fill(s, ofs, len, c) {
  if (ofs < 0 || len < 0 || ofs > (s.length - len | 0)) {
    throw [
          Caml_builtin_exceptions.invalid_argument,
          "String.fill / Bytes.fill"
        ];
  }
  return Caml_bytes.caml_fill_bytes(s, ofs, len, c);
}

function blit(s1, ofs1, s2, ofs2, len) {
  if (len < 0 || ofs1 < 0 || ofs1 > (s1.length - len | 0) || ofs2 < 0 || ofs2 > (s2.length - len | 0)) {
    throw [
          Caml_builtin_exceptions.invalid_argument,
          "Bytes.blit"
        ];
  }
  return Caml_bytes.caml_blit_bytes(s1, ofs1, s2, ofs2, len);
}

function blit_string(s1, ofs1, s2, ofs2, len) {
  if (len < 0 || ofs1 < 0 || ofs1 > (s1.length - len | 0) || ofs2 < 0 || ofs2 > (s2.length - len | 0)) {
    throw [
          Caml_builtin_exceptions.invalid_argument,
          "String.blit / Bytes.blit_string"
        ];
  }
  return Caml_bytes.caml_blit_string(s1, ofs1, s2, ofs2, len);
}

function iter(f, a) {
  for(var i = 0 ,i_finish = a.length - 1 | 0; i <= i_finish; ++i){
    Curry._1(f, a[i]);
  }
  return /* () */0;
}

function iteri(f, a) {
  for(var i = 0 ,i_finish = a.length - 1 | 0; i <= i_finish; ++i){
    Curry._2(f, i, a[i]);
  }
  return /* () */0;
}

function ensure_ge(x, y) {
  if (x >= y) {
    return x;
  } else {
    throw [
          Caml_builtin_exceptions.invalid_argument,
          "Bytes.concat"
        ];
  }
}

function sum_lengths(_acc, seplen, _param) {
  while(true) {
    var param = _param;
    var acc = _acc;
    if (param) {
      var tl = param[1];
      var hd = param[0];
      if (tl) {
        _param = tl;
        _acc = ensure_ge((hd.length + seplen | 0) + acc | 0, acc);
        continue ;
      } else {
        return hd.length + acc | 0;
      }
    } else {
      return acc;
    }
  };
}

function concat(sep, l) {
  if (l) {
    var seplen = sep.length;
    var dst = Caml_bytes.caml_create_bytes(sum_lengths(0, seplen, l));
    var _pos = 0;
    var sep$1 = sep;
    var seplen$1 = seplen;
    var _param = l;
    while(true) {
      var param = _param;
      var pos = _pos;
      if (param) {
        var tl = param[1];
        var hd = param[0];
        if (tl) {
          Caml_bytes.caml_blit_bytes(hd, 0, dst, pos, hd.length);
          Caml_bytes.caml_blit_bytes(sep$1, 0, dst, pos + hd.length | 0, seplen$1);
          _param = tl;
          _pos = (pos + hd.length | 0) + seplen$1 | 0;
          continue ;
        } else {
          Caml_bytes.caml_blit_bytes(hd, 0, dst, pos, hd.length);
          return dst;
        }
      } else {
        return dst;
      }
    };
  } else {
    return empty;
  }
}

function cat(s1, s2) {
  var l1 = s1.length;
  var l2 = s2.length;
  var r = Caml_bytes.caml_create_bytes(l1 + l2 | 0);
  Caml_bytes.caml_blit_bytes(s1, 0, r, 0, l1);
  Caml_bytes.caml_blit_bytes(s2, 0, r, l1, l2);
  return r;
}

function is_space(param) {
  var switcher = param - 9 | 0;
  if (switcher > 4 || switcher < 0) {
    return switcher === 23;
  } else {
    return switcher !== 2;
  }
}

function trim(s) {
  var len = s.length;
  var i = 0;
  while(i < len && is_space(s[i])) {
    i = i + 1 | 0;
  };
  var j = len - 1 | 0;
  while(j >= i && is_space(s[j])) {
    j = j - 1 | 0;
  };
  if (j >= i) {
    return sub(s, i, (j - i | 0) + 1 | 0);
  } else {
    return empty;
  }
}

function escaped(s) {
  var n = 0;
  for(var i = 0 ,i_finish = s.length - 1 | 0; i <= i_finish; ++i){
    var match = s[i];
    var tmp;
    if (match >= 32) {
      var switcher = match - 34 | 0;
      tmp = switcher > 58 || switcher < 0 ? (
          switcher >= 93 ? 4 : 1
        ) : (
          switcher > 57 || switcher < 1 ? 2 : 1
        );
    } else {
      tmp = match >= 11 ? (
          match !== 13 ? 4 : 2
        ) : (
          match >= 8 ? 2 : 4
        );
    }
    n = n + tmp | 0;
  }
  if (n === s.length) {
    return copy(s);
  } else {
    var s$prime = Caml_bytes.caml_create_bytes(n);
    n = 0;
    for(var i$1 = 0 ,i_finish$1 = s.length - 1 | 0; i$1 <= i_finish$1; ++i$1){
      var c = s[i$1];
      var exit = 0;
      if (c >= 35) {
        if (c !== 92) {
          if (c >= 127) {
            exit = 1;
          } else {
            s$prime[n] = c;
          }
        } else {
          exit = 2;
        }
      } else if (c >= 32) {
        if (c >= 34) {
          exit = 2;
        } else {
          s$prime[n] = c;
        }
      } else if (c >= 14) {
        exit = 1;
      } else {
        switch (c) {
          case 8 :
              s$prime[n] = /* "\\" */92;
              n = n + 1 | 0;
              s$prime[n] = /* "b" */98;
              break;
          case 9 :
              s$prime[n] = /* "\\" */92;
              n = n + 1 | 0;
              s$prime[n] = /* "t" */116;
              break;
          case 10 :
              s$prime[n] = /* "\\" */92;
              n = n + 1 | 0;
              s$prime[n] = /* "n" */110;
              break;
          case 0 :
          case 1 :
          case 2 :
          case 3 :
          case 4 :
          case 5 :
          case 6 :
          case 7 :
          case 11 :
          case 12 :
              exit = 1;
              break;
          case 13 :
              s$prime[n] = /* "\\" */92;
              n = n + 1 | 0;
              s$prime[n] = /* "r" */114;
              break;
          
        }
      }
      switch (exit) {
        case 1 :
            s$prime[n] = /* "\\" */92;
            n = n + 1 | 0;
            s$prime[n] = 48 + (c / 100 | 0) | 0;
            n = n + 1 | 0;
            s$prime[n] = 48 + (c / 10 | 0) % 10 | 0;
            n = n + 1 | 0;
            s$prime[n] = 48 + c % 10 | 0;
            break;
        case 2 :
            s$prime[n] = /* "\\" */92;
            n = n + 1 | 0;
            s$prime[n] = c;
            break;
        
      }
      n = n + 1 | 0;
    }
    return s$prime;
  }
}

function map(f, s) {
  var l = s.length;
  if (l === 0) {
    return s;
  } else {
    var r = Caml_bytes.caml_create_bytes(l);
    for(var i = 0 ,i_finish = l - 1 | 0; i <= i_finish; ++i){
      r[i] = Curry._1(f, s[i]);
    }
    return r;
  }
}

function mapi(f, s) {
  var l = s.length;
  if (l === 0) {
    return s;
  } else {
    var r = Caml_bytes.caml_create_bytes(l);
    for(var i = 0 ,i_finish = l - 1 | 0; i <= i_finish; ++i){
      r[i] = Curry._2(f, i, s[i]);
    }
    return r;
  }
}

function uppercase_ascii(s) {
  return map(Char.uppercase_ascii, s);
}

function lowercase_ascii(s) {
  return map(Char.lowercase_ascii, s);
}

function apply1(f, s) {
  if (s.length === 0) {
    return s;
  } else {
    var r = copy(s);
    r[0] = Curry._1(f, s[0]);
    return r;
  }
}

function capitalize_ascii(s) {
  return apply1(Char.uppercase_ascii, s);
}

function uncapitalize_ascii(s) {
  return apply1(Char.lowercase_ascii, s);
}

function index_rec(s, lim, _i, c) {
  while(true) {
    var i = _i;
    if (i >= lim) {
      throw Caml_builtin_exceptions.not_found;
    }
    if (s[i] === c) {
      return i;
    } else {
      _i = i + 1 | 0;
      continue ;
    }
  };
}

function index(s, c) {
  return index_rec(s, s.length, 0, c);
}

function index_rec_opt(s, lim, _i, c) {
  while(true) {
    var i = _i;
    if (i >= lim) {
      return ;
    } else if (s[i] === c) {
      return i;
    } else {
      _i = i + 1 | 0;
      continue ;
    }
  };
}

function index_opt(s, c) {
  return index_rec_opt(s, s.length, 0, c);
}

function index_from(s, i, c) {
  var l = s.length;
  if (i < 0 || i > l) {
    throw [
          Caml_builtin_exceptions.invalid_argument,
          "String.index_from / Bytes.index_from"
        ];
  }
  return index_rec(s, l, i, c);
}

function index_from_opt(s, i, c) {
  var l = s.length;
  if (i < 0 || i > l) {
    throw [
          Caml_builtin_exceptions.invalid_argument,
          "String.index_from_opt / Bytes.index_from_opt"
        ];
  }
  return index_rec_opt(s, l, i, c);
}

function rindex_rec(s, _i, c) {
  while(true) {
    var i = _i;
    if (i < 0) {
      throw Caml_builtin_exceptions.not_found;
    }
    if (s[i] === c) {
      return i;
    } else {
      _i = i - 1 | 0;
      continue ;
    }
  };
}

function rindex(s, c) {
  return rindex_rec(s, s.length - 1 | 0, c);
}

function rindex_from(s, i, c) {
  if (i < -1 || i >= s.length) {
    throw [
          Caml_builtin_exceptions.invalid_argument,
          "String.rindex_from / Bytes.rindex_from"
        ];
  }
  return rindex_rec(s, i, c);
}

function rindex_rec_opt(s, _i, c) {
  while(true) {
    var i = _i;
    if (i < 0) {
      return ;
    } else if (s[i] === c) {
      return i;
    } else {
      _i = i - 1 | 0;
      continue ;
    }
  };
}

function rindex_opt(s, c) {
  return rindex_rec_opt(s, s.length - 1 | 0, c);
}

function rindex_from_opt(s, i, c) {
  if (i < -1 || i >= s.length) {
    throw [
          Caml_builtin_exceptions.invalid_argument,
          "String.rindex_from_opt / Bytes.rindex_from_opt"
        ];
  }
  return rindex_rec_opt(s, i, c);
}

function contains_from(s, i, c) {
  var l = s.length;
  if (i < 0 || i > l) {
    throw [
          Caml_builtin_exceptions.invalid_argument,
          "String.contains_from / Bytes.contains_from"
        ];
  }
  try {
    index_rec(s, l, i, c);
    return true;
  }
  catch (exn){
    if (exn === Caml_builtin_exceptions.not_found) {
      return false;
    } else {
      throw exn;
    }
  }
}

function contains(s, c) {
  return contains_from(s, 0, c);
}

function rcontains_from(s, i, c) {
  if (i < 0 || i >= s.length) {
    throw [
          Caml_builtin_exceptions.invalid_argument,
          "String.rcontains_from / Bytes.rcontains_from"
        ];
  }
  try {
    rindex_rec(s, i, c);
    return true;
  }
  catch (exn){
    if (exn === Caml_builtin_exceptions.not_found) {
      return false;
    } else {
      throw exn;
    }
  }
}

var compare = Caml_primitive.caml_bytes_compare;

function uppercase(s) {
  return map(Char.uppercase, s);
}

function lowercase(s) {
  return map(Char.lowercase, s);
}

function capitalize(s) {
  return apply1(Char.uppercase, s);
}

function uncapitalize(s) {
  return apply1(Char.lowercase, s);
}

var equal = Caml_primitive.caml_bytes_equal;

var unsafe_to_string = Caml_bytes.bytes_to_string;

var unsafe_of_string = Caml_bytes.bytes_of_string;

exports.make = make;
exports.init = init;
exports.empty = empty;
exports.copy = copy;
exports.of_string = of_string;
exports.to_string = to_string;
exports.sub = sub;
exports.sub_string = sub_string;
exports.extend = extend;
exports.fill = fill;
exports.blit = blit;
exports.blit_string = blit_string;
exports.concat = concat;
exports.cat = cat;
exports.iter = iter;
exports.iteri = iteri;
exports.map = map;
exports.mapi = mapi;
exports.trim = trim;
exports.escaped = escaped;
exports.index = index;
exports.index_opt = index_opt;
exports.rindex = rindex;
exports.rindex_opt = rindex_opt;
exports.index_from = index_from;
exports.index_from_opt = index_from_opt;
exports.rindex_from = rindex_from;
exports.rindex_from_opt = rindex_from_opt;
exports.contains = contains;
exports.contains_from = contains_from;
exports.rcontains_from = rcontains_from;
exports.uppercase = uppercase;
exports.lowercase = lowercase;
exports.capitalize = capitalize;
exports.uncapitalize = uncapitalize;
exports.uppercase_ascii = uppercase_ascii;
exports.lowercase_ascii = lowercase_ascii;
exports.capitalize_ascii = capitalize_ascii;
exports.uncapitalize_ascii = uncapitalize_ascii;
exports.compare = compare;
exports.equal = equal;
exports.unsafe_to_string = unsafe_to_string;
exports.unsafe_of_string = unsafe_of_string;
/* No side effect */

},{"./caml_builtin_exceptions.js":6,"./caml_bytes.js":7,"./caml_primitive.js":17,"./char.js":23,"./curry.js":24}],5:[function(require,module,exports){
'use strict';

var Caml_builtin_exceptions = require("./caml_builtin_exceptions.js");

function caml_array_sub(x, offset, len) {
  var result = new Array(len);
  var j = 0;
  var i = offset;
  while(j < len) {
    result[j] = x[i];
    j = j + 1 | 0;
    i = i + 1 | 0;
  };
  return result;
}

function len(_acc, _l) {
  while(true) {
    var l = _l;
    var acc = _acc;
    if (l) {
      _l = l[1];
      _acc = l[0].length + acc | 0;
      continue ;
    } else {
      return acc;
    }
  };
}

function fill(arr, _i, _l) {
  while(true) {
    var l = _l;
    var i = _i;
    if (l) {
      var x = l[0];
      var l$1 = x.length;
      var k = i;
      var j = 0;
      while(j < l$1) {
        arr[k] = x[j];
        k = k + 1 | 0;
        j = j + 1 | 0;
      };
      _l = l[1];
      _i = k;
      continue ;
    } else {
      return /* () */0;
    }
  };
}

function caml_array_concat(l) {
  var v = len(0, l);
  var result = new Array(v);
  fill(result, 0, l);
  return result;
}

function caml_array_set(xs, index, newval) {
  if (index < 0 || index >= xs.length) {
    throw [
          Caml_builtin_exceptions.invalid_argument,
          "index out of bounds"
        ];
  }
  xs[index] = newval;
  return /* () */0;
}

function caml_array_get(xs, index) {
  if (index < 0 || index >= xs.length) {
    throw [
          Caml_builtin_exceptions.invalid_argument,
          "index out of bounds"
        ];
  }
  return xs[index];
}

function caml_make_vect(len, init) {
  var b = new Array(len);
  for(var i = 0 ,i_finish = len - 1 | 0; i <= i_finish; ++i){
    b[i] = init;
  }
  return b;
}

function caml_make_float_vect(len) {
  var b = new Array(len);
  for(var i = 0 ,i_finish = len - 1 | 0; i <= i_finish; ++i){
    b[i] = 0;
  }
  return b;
}

function caml_array_blit(a1, i1, a2, i2, len) {
  if (i2 <= i1) {
    for(var j = 0 ,j_finish = len - 1 | 0; j <= j_finish; ++j){
      a2[j + i2 | 0] = a1[j + i1 | 0];
    }
    return /* () */0;
  } else {
    for(var j$1 = len - 1 | 0; j$1 >= 0; --j$1){
      a2[j$1 + i2 | 0] = a1[j$1 + i1 | 0];
    }
    return /* () */0;
  }
}

function caml_array_dup(prim) {
  return prim.slice(0);
}

exports.caml_array_dup = caml_array_dup;
exports.caml_array_sub = caml_array_sub;
exports.caml_array_concat = caml_array_concat;
exports.caml_make_vect = caml_make_vect;
exports.caml_make_float_vect = caml_make_float_vect;
exports.caml_array_blit = caml_array_blit;
exports.caml_array_get = caml_array_get;
exports.caml_array_set = caml_array_set;
/* No side effect */

},{"./caml_builtin_exceptions.js":6}],6:[function(require,module,exports){
'use strict';


var out_of_memory = /* tuple */[
  "Out_of_memory",
  0
];

var sys_error = /* tuple */[
  "Sys_error",
  -1
];

var failure = /* tuple */[
  "Failure",
  -2
];

var invalid_argument = /* tuple */[
  "Invalid_argument",
  -3
];

var end_of_file = /* tuple */[
  "End_of_file",
  -4
];

var division_by_zero = /* tuple */[
  "Division_by_zero",
  -5
];

var not_found = /* tuple */[
  "Not_found",
  -6
];

var match_failure = /* tuple */[
  "Match_failure",
  -7
];

var stack_overflow = /* tuple */[
  "Stack_overflow",
  -8
];

var sys_blocked_io = /* tuple */[
  "Sys_blocked_io",
  -9
];

var assert_failure = /* tuple */[
  "Assert_failure",
  -10
];

var undefined_recursive_module = /* tuple */[
  "Undefined_recursive_module",
  -11
];

out_of_memory.tag = 248;

sys_error.tag = 248;

failure.tag = 248;

invalid_argument.tag = 248;

end_of_file.tag = 248;

division_by_zero.tag = 248;

not_found.tag = 248;

match_failure.tag = 248;

stack_overflow.tag = 248;

sys_blocked_io.tag = 248;

assert_failure.tag = 248;

undefined_recursive_module.tag = 248;

exports.out_of_memory = out_of_memory;
exports.sys_error = sys_error;
exports.failure = failure;
exports.invalid_argument = invalid_argument;
exports.end_of_file = end_of_file;
exports.division_by_zero = division_by_zero;
exports.not_found = not_found;
exports.match_failure = match_failure;
exports.stack_overflow = stack_overflow;
exports.sys_blocked_io = sys_blocked_io;
exports.assert_failure = assert_failure;
exports.undefined_recursive_module = undefined_recursive_module;
/*  Not a pure module */

},{}],7:[function(require,module,exports){
'use strict';

var Caml_builtin_exceptions = require("./caml_builtin_exceptions.js");

function get(s, i) {
  if (i < 0 || i >= s.length) {
    throw [
          Caml_builtin_exceptions.invalid_argument,
          "index out of bounds"
        ];
  }
  return s[i];
}

function caml_fill_bytes(s, i, l, c) {
  if (l > 0) {
    for(var k = i ,k_finish = (l + i | 0) - 1 | 0; k <= k_finish; ++k){
      s[k] = c;
    }
    return /* () */0;
  } else {
    return 0;
  }
}

function caml_create_bytes(len) {
  if (len < 0) {
    throw [
          Caml_builtin_exceptions.invalid_argument,
          "String.create"
        ];
  }
  var result = new Array(len);
  for(var i = 0 ,i_finish = len - 1 | 0; i <= i_finish; ++i){
    result[i] = /* "\000" */0;
  }
  return result;
}

function caml_blit_bytes(s1, i1, s2, i2, len) {
  if (len > 0) {
    if (s1 === s2) {
      var s1$1 = s1;
      var i1$1 = i1;
      var i2$1 = i2;
      var len$1 = len;
      if (i1$1 < i2$1) {
        var range_a = (s1$1.length - i2$1 | 0) - 1 | 0;
        var range_b = len$1 - 1 | 0;
        var range = range_a > range_b ? range_b : range_a;
        for(var j = range; j >= 0; --j){
          s1$1[i2$1 + j | 0] = s1$1[i1$1 + j | 0];
        }
        return /* () */0;
      } else if (i1$1 > i2$1) {
        var range_a$1 = (s1$1.length - i1$1 | 0) - 1 | 0;
        var range_b$1 = len$1 - 1 | 0;
        var range$1 = range_a$1 > range_b$1 ? range_b$1 : range_a$1;
        for(var k = 0; k <= range$1; ++k){
          s1$1[i2$1 + k | 0] = s1$1[i1$1 + k | 0];
        }
        return /* () */0;
      } else {
        return 0;
      }
    } else {
      var off1 = s1.length - i1 | 0;
      if (len <= off1) {
        for(var i = 0 ,i_finish = len - 1 | 0; i <= i_finish; ++i){
          s2[i2 + i | 0] = s1[i1 + i | 0];
        }
        return /* () */0;
      } else {
        for(var i$1 = 0 ,i_finish$1 = off1 - 1 | 0; i$1 <= i_finish$1; ++i$1){
          s2[i2 + i$1 | 0] = s1[i1 + i$1 | 0];
        }
        for(var i$2 = off1 ,i_finish$2 = len - 1 | 0; i$2 <= i_finish$2; ++i$2){
          s2[i2 + i$2 | 0] = /* "\000" */0;
        }
        return /* () */0;
      }
    }
  } else {
    return 0;
  }
}

function bytes_to_string(a) {
  var bytes = a;
  var i = 0;
  var len = a.length;
  var s = "";
  var s_len = len;
  if (i === 0 && len <= 4096 && len === bytes.length) {
    return String.fromCharCode.apply(null, bytes);
  } else {
    var offset = 0;
    while(s_len > 0) {
      var next = s_len < 1024 ? s_len : 1024;
      var tmp_bytes = new Array(next);
      caml_blit_bytes(bytes, offset, tmp_bytes, 0, next);
      s = s + String.fromCharCode.apply(null, tmp_bytes);
      s_len = s_len - next | 0;
      offset = offset + next | 0;
    };
    return s;
  }
}

function caml_blit_string(s1, i1, s2, i2, len) {
  if (len > 0) {
    var off1 = s1.length - i1 | 0;
    if (len <= off1) {
      for(var i = 0 ,i_finish = len - 1 | 0; i <= i_finish; ++i){
        s2[i2 + i | 0] = s1.charCodeAt(i1 + i | 0);
      }
      return /* () */0;
    } else {
      for(var i$1 = 0 ,i_finish$1 = off1 - 1 | 0; i$1 <= i_finish$1; ++i$1){
        s2[i2 + i$1 | 0] = s1.charCodeAt(i1 + i$1 | 0);
      }
      for(var i$2 = off1 ,i_finish$2 = len - 1 | 0; i$2 <= i_finish$2; ++i$2){
        s2[i2 + i$2 | 0] = /* "\000" */0;
      }
      return /* () */0;
    }
  } else {
    return 0;
  }
}

function bytes_of_string(s) {
  var len = s.length;
  var res = new Array(len);
  for(var i = 0 ,i_finish = len - 1 | 0; i <= i_finish; ++i){
    res[i] = s.charCodeAt(i);
  }
  return res;
}

exports.caml_create_bytes = caml_create_bytes;
exports.caml_fill_bytes = caml_fill_bytes;
exports.get = get;
exports.bytes_to_string = bytes_to_string;
exports.caml_blit_bytes = caml_blit_bytes;
exports.caml_blit_string = caml_blit_string;
exports.bytes_of_string = bytes_of_string;
/* No side effect */

},{"./caml_builtin_exceptions.js":6}],8:[function(require,module,exports){
'use strict';


var id = {
  contents: 0
};

function caml_set_oo_id(b) {
  b[1] = id.contents;
  id.contents = id.contents + 1;
  return b;
}

function caml_fresh_oo_id(param) {
  id.contents = id.contents + 1;
  return id.contents;
}

function create(str) {
  var v_001 = caml_fresh_oo_id(/* () */0);
  var v = /* tuple */[
    str,
    v_001
  ];
  v.tag = 248;
  return v;
}

function caml_is_extension(e) {
  if (e === undefined) {
    return false;
  } else if (e.tag === 248) {
    return true;
  } else {
    var slot = e[0];
    if (slot !== undefined) {
      return slot.tag === 248;
    } else {
      return false;
    }
  }
}

exports.caml_set_oo_id = caml_set_oo_id;
exports.caml_fresh_oo_id = caml_fresh_oo_id;
exports.create = create;
exports.caml_is_extension = caml_is_extension;
/* No side effect */

},{}],9:[function(require,module,exports){
(function (global){
'use strict';


function getGlobalThis (){
  if (typeof globalThis !== 'undefined') return globalThis;
	if (typeof self !== 'undefined') return self;
	if (typeof window !== 'undefined') return window;
	if (typeof global !== 'undefined') return global;
	if (typeof this !== 'undefined') return this;
	throw new Error('Unable to locate global `this`');
};

function resolve (s){
  var myGlobal = getGlobalThis();
  if (myGlobal[s] === undefined){
    throw new Error(s + " not polyfilled by BuckleScript yet\n")
  }
  return myGlobal[s]
};

function register (s,fn){
  var myGlobal = getGlobalThis();
  myGlobal[s] = fn 
  return 0
};

exports.getGlobalThis = getGlobalThis;
exports.resolve = resolve;
exports.register = register;
/* No side effect */

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],10:[function(require,module,exports){
'use strict';

var Caml_int32 = require("./caml_int32.js");
var Caml_int64 = require("./caml_int64.js");
var Caml_utils = require("./caml_utils.js");
var Caml_builtin_exceptions = require("./caml_builtin_exceptions.js");

function parse_digit(c) {
  if (c >= 65) {
    if (c >= 97) {
      if (c >= 123) {
        return -1;
      } else {
        return c - 87 | 0;
      }
    } else if (c >= 91) {
      return -1;
    } else {
      return c - 55 | 0;
    }
  } else if (c > 57 || c < 48) {
    return -1;
  } else {
    return c - /* "0" */48 | 0;
  }
}

function int_of_string_base(param) {
  switch (param) {
    case /* Oct */0 :
        return 8;
    case /* Hex */1 :
        return 16;
    case /* Dec */2 :
        return 10;
    case /* Bin */3 :
        return 2;
    
  }
}

function parse_sign_and_base(s) {
  var sign = 1;
  var base = /* Dec */2;
  var i = 0;
  var match = s.charCodeAt(i);
  switch (match) {
    case 43 :
        i = i + 1 | 0;
        break;
    case 44 :
        break;
    case 45 :
        sign = -1;
        i = i + 1 | 0;
        break;
    default:
      
  }
  if (s[i] === "0") {
    var match$1 = s.charCodeAt(i + 1 | 0);
    if (match$1 >= 89) {
      if (match$1 >= 111) {
        if (match$1 < 121) {
          switch (match$1 - 111 | 0) {
            case 0 :
                base = /* Oct */0;
                i = i + 2 | 0;
                break;
            case 6 :
                i = i + 2 | 0;
                break;
            case 1 :
            case 2 :
            case 3 :
            case 4 :
            case 5 :
            case 7 :
            case 8 :
                break;
            case 9 :
                base = /* Hex */1;
                i = i + 2 | 0;
                break;
            
          }
        }
        
      } else if (match$1 === 98) {
        base = /* Bin */3;
        i = i + 2 | 0;
      }
      
    } else if (match$1 !== 66) {
      if (match$1 >= 79) {
        switch (match$1 - 79 | 0) {
          case 0 :
              base = /* Oct */0;
              i = i + 2 | 0;
              break;
          case 6 :
              i = i + 2 | 0;
              break;
          case 1 :
          case 2 :
          case 3 :
          case 4 :
          case 5 :
          case 7 :
          case 8 :
              break;
          case 9 :
              base = /* Hex */1;
              i = i + 2 | 0;
              break;
          
        }
      }
      
    } else {
      base = /* Bin */3;
      i = i + 2 | 0;
    }
  }
  return /* tuple */[
          i,
          sign,
          base
        ];
}

function caml_int_of_string(s) {
  var match = parse_sign_and_base(s);
  var i = match[0];
  var base = int_of_string_base(match[2]);
  var threshold = 4294967295;
  var len = s.length;
  var c = i < len ? s.charCodeAt(i) : /* "\000" */0;
  var d = parse_digit(c);
  if (d < 0 || d >= base) {
    throw [
          Caml_builtin_exceptions.failure,
          "int_of_string"
        ];
  }
  var aux = function (_acc, _k) {
    while(true) {
      var k = _k;
      var acc = _acc;
      if (k === len) {
        return acc;
      } else {
        var a = s.charCodeAt(k);
        if (a === /* "_" */95) {
          _k = k + 1 | 0;
          continue ;
        } else {
          var v = parse_digit(a);
          if (v < 0 || v >= base) {
            throw [
                  Caml_builtin_exceptions.failure,
                  "int_of_string"
                ];
          }
          var acc$1 = base * acc + v;
          if (acc$1 > threshold) {
            throw [
                  Caml_builtin_exceptions.failure,
                  "int_of_string"
                ];
          }
          _k = k + 1 | 0;
          _acc = acc$1;
          continue ;
        }
      }
    };
  };
  var res = match[1] * aux(d, i + 1 | 0);
  var or_res = res | 0;
  if (base === 10 && res !== or_res) {
    throw [
          Caml_builtin_exceptions.failure,
          "int_of_string"
        ];
  }
  return or_res;
}

function caml_int64_of_string(s) {
  var match = parse_sign_and_base(s);
  var hbase = match[2];
  var i = match[0];
  var base = Caml_int64.of_int32(int_of_string_base(hbase));
  var sign = Caml_int64.of_int32(match[1]);
  var threshold;
  switch (hbase) {
    case /* Oct */0 :
        threshold = /* int64 */{
          hi: 536870911,
          lo: 4294967295
        };
        break;
    case /* Hex */1 :
        threshold = /* int64 */{
          hi: 268435455,
          lo: 4294967295
        };
        break;
    case /* Dec */2 :
        threshold = /* int64 */{
          hi: 429496729,
          lo: 2576980377
        };
        break;
    case /* Bin */3 :
        threshold = /* int64 */{
          hi: 2147483647,
          lo: 4294967295
        };
        break;
    
  }
  var len = s.length;
  var c = i < len ? s.charCodeAt(i) : /* "\000" */0;
  var d = Caml_int64.of_int32(parse_digit(c));
  if (Caml_int64.lt(d, /* int64 */{
          hi: 0,
          lo: 0
        }) || Caml_int64.ge(d, base)) {
    throw [
          Caml_builtin_exceptions.failure,
          "int64_of_string"
        ];
  }
  var aux = function (_acc, _k) {
    while(true) {
      var k = _k;
      var acc = _acc;
      if (k === len) {
        return acc;
      } else {
        var a = s.charCodeAt(k);
        if (a === /* "_" */95) {
          _k = k + 1 | 0;
          continue ;
        } else {
          var v = Caml_int64.of_int32(parse_digit(a));
          if (Caml_int64.lt(v, /* int64 */{
                  hi: 0,
                  lo: 0
                }) || Caml_int64.ge(v, base) || Caml_int64.gt(acc, threshold)) {
            throw [
                  Caml_builtin_exceptions.failure,
                  "int64_of_string"
                ];
          }
          var acc$1 = Caml_int64.add(Caml_int64.mul(base, acc), v);
          _k = k + 1 | 0;
          _acc = acc$1;
          continue ;
        }
      }
    };
  };
  var res = Caml_int64.mul(sign, aux(d, i + 1 | 0));
  var or_res = Caml_int64.or_(res, /* int64 */{
        hi: 0,
        lo: 0
      });
  if (Caml_int64.eq(base, /* int64 */{
          hi: 0,
          lo: 10
        }) && Caml_int64.neq(res, or_res)) {
    throw [
          Caml_builtin_exceptions.failure,
          "int64_of_string"
        ];
  }
  return or_res;
}

function int_of_base(param) {
  switch (param) {
    case /* Oct */0 :
        return 8;
    case /* Hex */1 :
        return 16;
    case /* Dec */2 :
        return 10;
    
  }
}

function lowercase(c) {
  if (c >= /* "A" */65 && c <= /* "Z" */90 || c >= /* "\192" */192 && c <= /* "\214" */214 || c >= /* "\216" */216 && c <= /* "\222" */222) {
    return c + 32 | 0;
  } else {
    return c;
  }
}

function parse_format(fmt) {
  var len = fmt.length;
  if (len > 31) {
    throw [
          Caml_builtin_exceptions.invalid_argument,
          "format_int: format too long"
        ];
  }
  var f = {
    justify: "+",
    signstyle: "-",
    filter: " ",
    alternate: false,
    base: /* Dec */2,
    signedconv: false,
    width: 0,
    uppercase: false,
    sign: 1,
    prec: -1,
    conv: "f"
  };
  var _i = 0;
  while(true) {
    var i = _i;
    if (i >= len) {
      return f;
    } else {
      var c = fmt.charCodeAt(i);
      var exit = 0;
      if (c >= 69) {
        if (c >= 88) {
          if (c >= 121) {
            exit = 1;
          } else {
            switch (c - 88 | 0) {
              case 0 :
                  f.base = /* Hex */1;
                  f.uppercase = true;
                  _i = i + 1 | 0;
                  continue ;
              case 13 :
              case 14 :
              case 15 :
                  exit = 5;
                  break;
              case 12 :
              case 17 :
                  exit = 4;
                  break;
              case 23 :
                  f.base = /* Oct */0;
                  _i = i + 1 | 0;
                  continue ;
              case 29 :
                  f.base = /* Dec */2;
                  _i = i + 1 | 0;
                  continue ;
              case 1 :
              case 2 :
              case 3 :
              case 4 :
              case 5 :
              case 6 :
              case 7 :
              case 8 :
              case 9 :
              case 10 :
              case 11 :
              case 16 :
              case 18 :
              case 19 :
              case 20 :
              case 21 :
              case 22 :
              case 24 :
              case 25 :
              case 26 :
              case 27 :
              case 28 :
              case 30 :
              case 31 :
                  exit = 1;
                  break;
              case 32 :
                  f.base = /* Hex */1;
                  _i = i + 1 | 0;
                  continue ;
              
            }
          }
        } else if (c >= 72) {
          exit = 1;
        } else {
          f.signedconv = true;
          f.uppercase = true;
          f.conv = String.fromCharCode(lowercase(c));
          _i = i + 1 | 0;
          continue ;
        }
      } else {
        switch (c) {
          case 35 :
              f.alternate = true;
              _i = i + 1 | 0;
              continue ;
          case 32 :
          case 43 :
              exit = 2;
              break;
          case 45 :
              f.justify = "-";
              _i = i + 1 | 0;
              continue ;
          case 46 :
              f.prec = 0;
              var j = i + 1 | 0;
              while((function(j){
                  return function () {
                    var w = fmt.charCodeAt(j) - /* "0" */48 | 0;
                    return w >= 0 && w <= 9;
                  }
                  }(j))()) {
                f.prec = (Caml_int32.imul(f.prec, 10) + fmt.charCodeAt(j) | 0) - /* "0" */48 | 0;
                j = j + 1 | 0;
              };
              _i = j;
              continue ;
          case 33 :
          case 34 :
          case 36 :
          case 37 :
          case 38 :
          case 39 :
          case 40 :
          case 41 :
          case 42 :
          case 44 :
          case 47 :
              exit = 1;
              break;
          case 48 :
              f.filter = "0";
              _i = i + 1 | 0;
              continue ;
          case 49 :
          case 50 :
          case 51 :
          case 52 :
          case 53 :
          case 54 :
          case 55 :
          case 56 :
          case 57 :
              exit = 3;
              break;
          default:
            exit = 1;
        }
      }
      switch (exit) {
        case 1 :
            _i = i + 1 | 0;
            continue ;
        case 2 :
            f.signstyle = String.fromCharCode(c);
            _i = i + 1 | 0;
            continue ;
        case 3 :
            f.width = 0;
            var j$1 = i;
            while((function(j$1){
                return function () {
                  var w = fmt.charCodeAt(j$1) - /* "0" */48 | 0;
                  return w >= 0 && w <= 9;
                }
                }(j$1))()) {
              f.width = (Caml_int32.imul(f.width, 10) + fmt.charCodeAt(j$1) | 0) - /* "0" */48 | 0;
              j$1 = j$1 + 1 | 0;
            };
            _i = j$1;
            continue ;
        case 4 :
            f.signedconv = true;
            f.base = /* Dec */2;
            _i = i + 1 | 0;
            continue ;
        case 5 :
            f.signedconv = true;
            f.conv = String.fromCharCode(c);
            _i = i + 1 | 0;
            continue ;
        
      }
    }
  };
}

function finish_formatting(config, rawbuffer) {
  var justify = config.justify;
  var signstyle = config.signstyle;
  var filter = config.filter;
  var alternate = config.alternate;
  var base = config.base;
  var signedconv = config.signedconv;
  var width = config.width;
  var uppercase = config.uppercase;
  var sign = config.sign;
  var len = rawbuffer.length;
  if (signedconv && (sign < 0 || signstyle !== "-")) {
    len = len + 1 | 0;
  }
  if (alternate) {
    if (base === /* Oct */0) {
      len = len + 1 | 0;
    } else if (base === /* Hex */1) {
      len = len + 2 | 0;
    }
    
  }
  var buffer = "";
  if (justify === "+" && filter === " ") {
    for(var i = len ,i_finish = width - 1 | 0; i <= i_finish; ++i){
      buffer = buffer + filter;
    }
  }
  if (signedconv) {
    if (sign < 0) {
      buffer = buffer + "-";
    } else if (signstyle !== "-") {
      buffer = buffer + signstyle;
    }
    
  }
  if (alternate && base === /* Oct */0) {
    buffer = buffer + "0";
  }
  if (alternate && base === /* Hex */1) {
    buffer = buffer + "0x";
  }
  if (justify === "+" && filter === "0") {
    for(var i$1 = len ,i_finish$1 = width - 1 | 0; i$1 <= i_finish$1; ++i$1){
      buffer = buffer + filter;
    }
  }
  buffer = uppercase ? buffer + rawbuffer.toUpperCase() : buffer + rawbuffer;
  if (justify === "-") {
    for(var i$2 = len ,i_finish$2 = width - 1 | 0; i$2 <= i_finish$2; ++i$2){
      buffer = buffer + " ";
    }
  }
  return buffer;
}

function caml_format_int(fmt, i) {
  if (fmt === "%d") {
    return String(i);
  } else {
    var f = parse_format(fmt);
    var f$1 = f;
    var i$1 = i;
    var i$2 = i$1 < 0 ? (
        f$1.signedconv ? (f$1.sign = -1, -i$1) : (i$1 >>> 0)
      ) : i$1;
    var s = i$2.toString(int_of_base(f$1.base));
    if (f$1.prec >= 0) {
      f$1.filter = " ";
      var n = f$1.prec - s.length | 0;
      if (n > 0) {
        s = Caml_utils.repeat(n, "0") + s;
      }
      
    }
    return finish_formatting(f$1, s);
  }
}

function caml_int64_format(fmt, x) {
  var f = parse_format(fmt);
  var x$1 = f.signedconv && Caml_int64.lt(x, /* int64 */{
        hi: 0,
        lo: 0
      }) ? (f.sign = -1, Caml_int64.neg(x)) : x;
  var s = "";
  var match = f.base;
  switch (match) {
    case /* Oct */0 :
        var wbase = /* int64 */{
          hi: 0,
          lo: 8
        };
        var cvtbl = "01234567";
        if (Caml_int64.lt(x$1, /* int64 */{
                hi: 0,
                lo: 0
              })) {
          var y = Caml_int64.discard_sign(x$1);
          var match$1 = Caml_int64.div_mod(y, wbase);
          var quotient = Caml_int64.add(/* int64 */{
                hi: 268435456,
                lo: 0
              }, match$1[0]);
          var modulus = match$1[1];
          s = String.fromCharCode(cvtbl.charCodeAt(Caml_int64.to_int32(modulus))) + s;
          while(Caml_int64.neq(quotient, /* int64 */{
                  hi: 0,
                  lo: 0
                })) {
            var match$2 = Caml_int64.div_mod(quotient, wbase);
            quotient = match$2[0];
            modulus = match$2[1];
            s = String.fromCharCode(cvtbl.charCodeAt(Caml_int64.to_int32(modulus))) + s;
          };
        } else {
          var match$3 = Caml_int64.div_mod(x$1, wbase);
          var quotient$1 = match$3[0];
          var modulus$1 = match$3[1];
          s = String.fromCharCode(cvtbl.charCodeAt(Caml_int64.to_int32(modulus$1))) + s;
          while(Caml_int64.neq(quotient$1, /* int64 */{
                  hi: 0,
                  lo: 0
                })) {
            var match$4 = Caml_int64.div_mod(quotient$1, wbase);
            quotient$1 = match$4[0];
            modulus$1 = match$4[1];
            s = String.fromCharCode(cvtbl.charCodeAt(Caml_int64.to_int32(modulus$1))) + s;
          };
        }
        break;
    case /* Hex */1 :
        s = Caml_int64.to_hex(x$1) + s;
        break;
    case /* Dec */2 :
        var wbase$1 = /* int64 */{
          hi: 0,
          lo: 10
        };
        var cvtbl$1 = "0123456789";
        if (Caml_int64.lt(x$1, /* int64 */{
                hi: 0,
                lo: 0
              })) {
          var y$1 = Caml_int64.discard_sign(x$1);
          var match$5 = Caml_int64.div_mod(y$1, wbase$1);
          var match$6 = Caml_int64.div_mod(Caml_int64.add(/* int64 */{
                    hi: 0,
                    lo: 8
                  }, match$5[1]), wbase$1);
          var quotient$2 = Caml_int64.add(Caml_int64.add(/* int64 */{
                    hi: 214748364,
                    lo: 3435973836
                  }, match$5[0]), match$6[0]);
          var modulus$2 = match$6[1];
          s = String.fromCharCode(cvtbl$1.charCodeAt(Caml_int64.to_int32(modulus$2))) + s;
          while(Caml_int64.neq(quotient$2, /* int64 */{
                  hi: 0,
                  lo: 0
                })) {
            var match$7 = Caml_int64.div_mod(quotient$2, wbase$1);
            quotient$2 = match$7[0];
            modulus$2 = match$7[1];
            s = String.fromCharCode(cvtbl$1.charCodeAt(Caml_int64.to_int32(modulus$2))) + s;
          };
        } else {
          var match$8 = Caml_int64.div_mod(x$1, wbase$1);
          var quotient$3 = match$8[0];
          var modulus$3 = match$8[1];
          s = String.fromCharCode(cvtbl$1.charCodeAt(Caml_int64.to_int32(modulus$3))) + s;
          while(Caml_int64.neq(quotient$3, /* int64 */{
                  hi: 0,
                  lo: 0
                })) {
            var match$9 = Caml_int64.div_mod(quotient$3, wbase$1);
            quotient$3 = match$9[0];
            modulus$3 = match$9[1];
            s = String.fromCharCode(cvtbl$1.charCodeAt(Caml_int64.to_int32(modulus$3))) + s;
          };
        }
        break;
    
  }
  if (f.prec >= 0) {
    f.filter = " ";
    var n = f.prec - s.length | 0;
    if (n > 0) {
      s = Caml_utils.repeat(n, "0") + s;
    }
    
  }
  return finish_formatting(f, s);
}

function caml_format_float(fmt, x) {
  var f = parse_format(fmt);
  var prec = f.prec < 0 ? 6 : f.prec;
  var x$1 = x < 0 ? (f.sign = -1, -x) : x;
  var s = "";
  if (isNaN(x$1)) {
    s = "nan";
    f.filter = " ";
  } else if (isFinite(x$1)) {
    var match = f.conv;
    switch (match) {
      case "e" :
          s = x$1.toExponential(prec);
          var i = s.length;
          if (s[i - 3 | 0] === "e") {
            s = s.slice(0, i - 1 | 0) + ("0" + s.slice(i - 1 | 0));
          }
          break;
      case "f" :
          s = x$1.toFixed(prec);
          break;
      case "g" :
          var prec$1 = prec !== 0 ? prec : 1;
          s = x$1.toExponential(prec$1 - 1 | 0);
          var j = s.indexOf("e");
          var exp = Number(s.slice(j + 1 | 0)) | 0;
          if (exp < -4 || x$1 >= 1e21 || x$1.toFixed().length > prec$1) {
            var i$1 = j - 1 | 0;
            while(s[i$1] === "0") {
              i$1 = i$1 - 1 | 0;
            };
            if (s[i$1] === ".") {
              i$1 = i$1 - 1 | 0;
            }
            s = s.slice(0, i$1 + 1 | 0) + s.slice(j);
            var i$2 = s.length;
            if (s[i$2 - 3 | 0] === "e") {
              s = s.slice(0, i$2 - 1 | 0) + ("0" + s.slice(i$2 - 1 | 0));
            }
            
          } else {
            var p = prec$1;
            if (exp < 0) {
              p = p - (exp + 1 | 0) | 0;
              s = x$1.toFixed(p);
            } else {
              while((function () {
                      s = x$1.toFixed(p);
                      return s.length > (prec$1 + 1 | 0);
                    })()) {
                p = p - 1 | 0;
              };
            }
            if (p !== 0) {
              var k = s.length - 1 | 0;
              while(s[k] === "0") {
                k = k - 1 | 0;
              };
              if (s[k] === ".") {
                k = k - 1 | 0;
              }
              s = s.slice(0, k + 1 | 0);
            }
            
          }
          break;
      default:
        
    }
  } else {
    s = "inf";
    f.filter = " ";
  }
  return finish_formatting(f, s);
}

function caml_hexstring_of_float (x,prec,style){ 
  if (!isFinite(x)) {
    if (isNaN(x)) return "nan";
    return x > 0 ? "infinity":"-infinity";
  }
  var sign = (x==0 && 1/x == -Infinity)?1:(x>=0)?0:1;
  if(sign) x = -x;
  var exp = 0;
  if (x == 0) { }
  else if (x < 1) {
    while (x < 1 && exp > -1022)  { x *= 2; exp-- }
  } else {
    while (x >= 2) { x /= 2; exp++ }
  }
  var exp_sign = exp < 0 ? '' : '+';
  var sign_str = '';
  if (sign) sign_str = '-'
  else {
    switch(style){
    case 43 /* '+' */: sign_str = '+'; break;
    case 32 /* ' ' */: sign_str = ' '; break;
    default: break;
    }
  }
  if (prec >= 0 && prec < 13) {
    /* If a precision is given, and is small, round mantissa accordingly */
      var cst = Math.pow(2,prec * 4);
      x = Math.round(x * cst) / cst;
  }
  var x_str = x.toString(16);
  if(prec >= 0){
      var idx = x_str.indexOf('.');
    if(idx<0) {
      x_str += '.' +  '0'.repeat(prec);
    }
    else {
      var size = idx+1+prec;
      if(x_str.length < size)
        x_str += '0'.repeat(size - x_str.length);
      else
        x_str = x_str.substr(0,size);
    }
  }
  return  (sign_str + '0x' + x_str + 'p' + exp_sign + exp.toString(10));
};

function float_of_string (s,exn){ 

    var res = +s;
    if ((s.length > 0) && (res === res))
        return res;
    s = s.replace(/_/g, "");
    res = +s;
    if (((s.length > 0) && (res === res)) || /^[+-]?nan$/i.test(s)) {
        return res;
    };
    var m = /^ *([+-]?)0x([0-9a-f]+)\.?([0-9a-f]*)p([+-]?[0-9]+)/i.exec(s);
    //            1        2             3           4
    if(m){
        var m3 = m[3].replace(/0+$/,'');
        var mantissa = parseInt(m[1] + m[2] + m3, 16);
        var exponent = (m[4]|0) - 4*m3.length;
        res = mantissa * Math.pow(2, exponent);
        return res;
    }
    if (/^\+?inf(inity)?$/i.test(s))
        return Infinity;
    if (/^-inf(inity)?$/i.test(s))
        return -Infinity;
    throw exn;

};

function caml_float_of_string(s) {
  return float_of_string(s, [
              Caml_builtin_exceptions.failure,
              "float_of_string"
            ]);
}

var caml_nativeint_format = caml_format_int;

var caml_int32_format = caml_format_int;

var caml_int32_of_string = caml_int_of_string;

var caml_nativeint_of_string = caml_int_of_string;

exports.caml_format_float = caml_format_float;
exports.caml_hexstring_of_float = caml_hexstring_of_float;
exports.caml_format_int = caml_format_int;
exports.caml_nativeint_format = caml_nativeint_format;
exports.caml_int32_format = caml_int32_format;
exports.caml_float_of_string = caml_float_of_string;
exports.caml_int64_format = caml_int64_format;
exports.caml_int_of_string = caml_int_of_string;
exports.caml_int32_of_string = caml_int32_of_string;
exports.caml_int64_of_string = caml_int64_of_string;
exports.caml_nativeint_of_string = caml_nativeint_of_string;
/* No side effect */

},{"./caml_builtin_exceptions.js":6,"./caml_int32.js":11,"./caml_int64.js":12,"./caml_utils.js":20}],11:[function(require,module,exports){
'use strict';

var Caml_builtin_exceptions = require("./caml_builtin_exceptions.js");

function div(x, y) {
  if (y === 0) {
    throw Caml_builtin_exceptions.division_by_zero;
  }
  return x / y | 0;
}

function mod_(x, y) {
  if (y === 0) {
    throw Caml_builtin_exceptions.division_by_zero;
  }
  return x % y;
}

function caml_bswap16(x) {
  return ((x & 255) << 8) | ((x & 65280) >>> 8);
}

function caml_int32_bswap(x) {
  return ((x & 255) << 24) | ((x & 65280) << 8) | ((x & 16711680) >>> 8) | ((x & 4278190080) >>> 24);
}

var imul = ( Math.imul || function (x,y) {
  y |= 0; return ((((x >> 16) * y) << 16) + (x & 0xffff) * y)|0; 
}
);

var caml_nativeint_bswap = caml_int32_bswap;

exports.div = div;
exports.mod_ = mod_;
exports.caml_bswap16 = caml_bswap16;
exports.caml_int32_bswap = caml_int32_bswap;
exports.caml_nativeint_bswap = caml_nativeint_bswap;
exports.imul = imul;
/* imul Not a pure module */

},{"./caml_builtin_exceptions.js":6}],12:[function(require,module,exports){
'use strict';

var Caml_int32 = require("./caml_int32.js");
var Caml_utils = require("./caml_utils.js");
var Caml_primitive = require("./caml_primitive.js");
var Caml_builtin_exceptions = require("./caml_builtin_exceptions.js");

var min_int = {
  hi: -2147483648,
  lo: 0
};

var max_int = {
  hi: 2147483647,
  lo: 1
};

var one = {
  hi: 0,
  lo: 1
};

var zero = {
  hi: 0,
  lo: 0
};

var neg_one = {
  hi: -1,
  lo: 4294967295
};

function neg_signed(x) {
  return (x & 2147483648) !== 0;
}

function add(param, param$1) {
  var other_low_ = param$1.lo;
  var this_low_ = param.lo;
  var lo = this_low_ + other_low_ & 4294967295;
  var overflow = neg_signed(this_low_) && (neg_signed(other_low_) || !neg_signed(lo)) || neg_signed(other_low_) && !neg_signed(lo) ? 1 : 0;
  var hi = param.hi + param$1.hi + overflow & 4294967295;
  return {
          hi: hi,
          lo: (lo >>> 0)
        };
}

function not(param) {
  var hi = param.hi ^ -1;
  var lo = param.lo ^ -1;
  return {
          hi: hi,
          lo: (lo >>> 0)
        };
}

function eq(x, y) {
  if (x.hi === y.hi) {
    return x.lo === y.lo;
  } else {
    return false;
  }
}

function equal_null(x, y) {
  if (y !== null) {
    return eq(x, y);
  } else {
    return false;
  }
}

function equal_undefined(x, y) {
  if (y !== undefined) {
    return eq(x, y);
  } else {
    return false;
  }
}

function equal_nullable(x, y) {
  if (y == null) {
    return false;
  } else {
    return eq(x, y);
  }
}

function neg(x) {
  if (eq(x, min_int)) {
    return min_int;
  } else {
    return add(not(x), one);
  }
}

function sub(x, y) {
  return add(x, neg(y));
}

function lsl_(x, numBits) {
  if (numBits === 0) {
    return x;
  } else {
    var lo = x.lo;
    if (numBits >= 32) {
      return {
              hi: (lo << (numBits - 32 | 0)),
              lo: 0
            };
    } else {
      var hi = (lo >>> (32 - numBits | 0)) | (x.hi << numBits);
      return {
              hi: hi,
              lo: ((lo << numBits) >>> 0)
            };
    }
  }
}

function lsr_(x, numBits) {
  if (numBits === 0) {
    return x;
  } else {
    var hi = x.hi;
    var offset = numBits - 32 | 0;
    if (offset === 0) {
      return {
              hi: 0,
              lo: (hi >>> 0)
            };
    } else if (offset > 0) {
      var lo = (hi >>> offset);
      return {
              hi: 0,
              lo: (lo >>> 0)
            };
    } else {
      var hi$1 = (hi >>> numBits);
      var lo$1 = (hi << (-offset | 0)) | (x.lo >>> numBits);
      return {
              hi: hi$1,
              lo: (lo$1 >>> 0)
            };
    }
  }
}

function asr_(x, numBits) {
  if (numBits === 0) {
    return x;
  } else {
    var hi = x.hi;
    if (numBits < 32) {
      var hi$1 = (hi >> numBits);
      var lo = (hi << (32 - numBits | 0)) | (x.lo >>> numBits);
      return {
              hi: hi$1,
              lo: (lo >>> 0)
            };
    } else {
      var lo$1 = (hi >> (numBits - 32 | 0));
      return {
              hi: hi >= 0 ? 0 : -1,
              lo: (lo$1 >>> 0)
            };
    }
  }
}

function is_zero(param) {
  if (param.hi !== 0 || param.lo !== 0) {
    return false;
  } else {
    return true;
  }
}

function mul(_this, _other) {
  while(true) {
    var other = _other;
    var $$this = _this;
    var lo;
    var this_hi = $$this.hi;
    var exit = 0;
    var exit$1 = 0;
    var exit$2 = 0;
    if (this_hi !== 0 || $$this.lo !== 0) {
      exit$2 = 4;
    } else {
      return zero;
    }
    if (exit$2 === 4) {
      if (other.hi !== 0 || other.lo !== 0) {
        exit$1 = 3;
      } else {
        return zero;
      }
    }
    if (exit$1 === 3) {
      if (this_hi !== -2147483648 || $$this.lo !== 0) {
        exit = 2;
      } else {
        lo = other.lo;
      }
    }
    if (exit === 2) {
      var other_hi = other.hi;
      var lo$1 = $$this.lo;
      var exit$3 = 0;
      if (other_hi !== -2147483648 || other.lo !== 0) {
        exit$3 = 3;
      } else {
        lo = lo$1;
      }
      if (exit$3 === 3) {
        var other_lo = other.lo;
        if (this_hi < 0) {
          if (other_hi < 0) {
            _other = neg(other);
            _this = neg($$this);
            continue ;
          } else {
            return neg(mul(neg($$this), other));
          }
        } else if (other_hi < 0) {
          return neg(mul($$this, neg(other)));
        } else {
          var a48 = (this_hi >>> 16);
          var a32 = this_hi & 65535;
          var a16 = (lo$1 >>> 16);
          var a00 = lo$1 & 65535;
          var b48 = (other_hi >>> 16);
          var b32 = other_hi & 65535;
          var b16 = (other_lo >>> 16);
          var b00 = other_lo & 65535;
          var c48 = 0;
          var c32 = 0;
          var c16 = 0;
          var c00 = a00 * b00;
          c16 = (c00 >>> 16) + a16 * b00;
          c32 = (c16 >>> 16);
          c16 = (c16 & 65535) + a00 * b16;
          c32 = c32 + (c16 >>> 16) + a32 * b00;
          c48 = (c32 >>> 16);
          c32 = (c32 & 65535) + a16 * b16;
          c48 = c48 + (c32 >>> 16);
          c32 = (c32 & 65535) + a00 * b32;
          c48 = c48 + (c32 >>> 16);
          c32 = c32 & 65535;
          c48 = c48 + (a48 * b00 + a32 * b16 + a16 * b32 + a00 * b48) & 65535;
          var hi = c32 | (c48 << 16);
          var lo$2 = c00 & 65535 | ((c16 & 65535) << 16);
          return {
                  hi: hi,
                  lo: (lo$2 >>> 0)
                };
        }
      }
      
    }
    if ((lo & 1) === 0) {
      return zero;
    } else {
      return min_int;
    }
  };
}

function swap(param) {
  var hi = Caml_int32.caml_int32_bswap(param.lo);
  var lo = Caml_int32.caml_int32_bswap(param.hi);
  return {
          hi: hi,
          lo: (lo >>> 0)
        };
}

function xor(param, param$1) {
  return {
          hi: param.hi ^ param$1.hi,
          lo: ((param.lo ^ param$1.lo) >>> 0)
        };
}

function or_(param, param$1) {
  return {
          hi: param.hi | param$1.hi,
          lo: ((param.lo | param$1.lo) >>> 0)
        };
}

function and_(param, param$1) {
  return {
          hi: param.hi & param$1.hi,
          lo: ((param.lo & param$1.lo) >>> 0)
        };
}

function ge(param, param$1) {
  var other_hi = param$1.hi;
  var hi = param.hi;
  if (hi > other_hi) {
    return true;
  } else if (hi < other_hi) {
    return false;
  } else {
    return param.lo >= param$1.lo;
  }
}

function neq(x, y) {
  return !eq(x, y);
}

function lt(x, y) {
  return !ge(x, y);
}

function gt(x, y) {
  if (x.hi > y.hi) {
    return true;
  } else if (x.hi < y.hi) {
    return false;
  } else {
    return x.lo > y.lo;
  }
}

function le(x, y) {
  return !gt(x, y);
}

function min(x, y) {
  if (ge(x, y)) {
    return y;
  } else {
    return x;
  }
}

function max(x, y) {
  if (gt(x, y)) {
    return x;
  } else {
    return y;
  }
}

function to_float(param) {
  return param.hi * (0x100000000) + param.lo;
}

function of_float(x) {
  if (isNaN(x) || !isFinite(x)) {
    return zero;
  } else if (x <= -9.22337203685477581e+18) {
    return min_int;
  } else if (x + 1 >= 9.22337203685477581e+18) {
    return max_int;
  } else if (x < 0) {
    return neg(of_float(-x));
  } else {
    var hi = x / 4294967296 | 0;
    var lo = x % 4294967296 | 0;
    return {
            hi: hi,
            lo: (lo >>> 0)
          };
  }
}

function div(_self, _other) {
  while(true) {
    var other = _other;
    var self = _self;
    var self_hi = self.hi;
    var exit = 0;
    var exit$1 = 0;
    if (other.hi !== 0 || other.lo !== 0) {
      exit$1 = 2;
    } else {
      throw Caml_builtin_exceptions.division_by_zero;
    }
    if (exit$1 === 2) {
      if (self_hi !== -2147483648) {
        if (self_hi !== 0 || self.lo !== 0) {
          exit = 1;
        } else {
          return zero;
        }
      } else if (self.lo !== 0) {
        exit = 1;
      } else if (eq(other, one) || eq(other, neg_one)) {
        return self;
      } else if (eq(other, min_int)) {
        return one;
      } else {
        var other_hi = other.hi;
        var half_this = asr_(self, 1);
        var approx = lsl_(div(half_this, other), 1);
        if (approx.hi === 0 && approx.lo === 0) {
          if (other_hi < 0) {
            return one;
          } else {
            return neg(one);
          }
        }
        var y = mul(other, approx);
        var rem = add(self, neg(y));
        return add(approx, div(rem, other));
      }
    }
    if (exit === 1) {
      var other_hi$1 = other.hi;
      if (other_hi$1 === -2147483648 && other.lo === 0) {
        return zero;
      }
      if (self_hi < 0) {
        if (other_hi$1 < 0) {
          _other = neg(other);
          _self = neg(self);
          continue ;
        } else {
          return neg(div(neg(self), other));
        }
      } else if (other_hi$1 < 0) {
        return neg(div(self, neg(other)));
      } else {
        var res = zero;
        var rem$1 = self;
        while(ge(rem$1, other)) {
          var approx$1 = Caml_primitive.caml_float_max(1, Math.floor(to_float(rem$1) / to_float(other)));
          var log2 = Math.ceil(Math.log(approx$1) / Math.LN2);
          var delta = log2 <= 48 ? 1 : Math.pow(2, log2 - 48);
          var approxRes = of_float(approx$1);
          var approxRem = mul(approxRes, other);
          while(approxRem.hi < 0 || gt(approxRem, rem$1)) {
            approx$1 = approx$1 - delta;
            approxRes = of_float(approx$1);
            approxRem = mul(approxRes, other);
          };
          if (is_zero(approxRes)) {
            approxRes = one;
          }
          res = add(res, approxRes);
          rem$1 = add(rem$1, neg(approxRem));
        };
        return res;
      }
    }
    
  };
}

function mod_(self, other) {
  var y = mul(div(self, other), other);
  return add(self, neg(y));
}

function div_mod(self, other) {
  var quotient = div(self, other);
  var y = mul(quotient, other);
  return /* tuple */[
          quotient,
          add(self, neg(y))
        ];
}

function compare(self, other) {
  var v = Caml_primitive.caml_nativeint_compare(self.hi, other.hi);
  if (v === 0) {
    return Caml_primitive.caml_nativeint_compare(self.lo, other.lo);
  } else {
    return v;
  }
}

function of_int32(lo) {
  return {
          hi: lo < 0 ? -1 : 0,
          lo: (lo >>> 0)
        };
}

function to_int32(x) {
  return x.lo | 0;
}

function to_hex(x) {
  var x_lo = x.lo;
  var x_hi = x.hi;
  var aux = function (v) {
    return (v >>> 0).toString(16);
  };
  if (x_hi === 0 && x_lo === 0) {
    return "0";
  }
  if (x_lo !== 0) {
    if (x_hi !== 0) {
      var lo = aux(x_lo);
      var pad = 8 - lo.length | 0;
      if (pad <= 0) {
        return aux(x_hi) + lo;
      } else {
        return aux(x_hi) + (Caml_utils.repeat(pad, "0") + lo);
      }
    } else {
      return aux(x_lo);
    }
  } else {
    return aux(x_hi) + "00000000";
  }
}

function discard_sign(x) {
  return {
          hi: 2147483647 & x.hi,
          lo: x.lo
        };
}

function float_of_bits(x) {
  return function (lo,hi){
   return (new Float64Array(new Int32Array([lo,hi]).buffer))[0]
   }(x.lo, x.hi);
}

function bits_of_float(x) {
  var buf = (new Int32Array(new Float64Array([x]).buffer));
  return {
          hi: buf[1],
          lo: (buf[0] >>> 0)
        };
}

function get64(s, i) {
  var hi = (s.charCodeAt(i + 4 | 0) << 32) | (s.charCodeAt(i + 5 | 0) << 40) | (s.charCodeAt(i + 6 | 0) << 48) | (s.charCodeAt(i + 7 | 0) << 56);
  var lo = s.charCodeAt(i) | (s.charCodeAt(i + 1 | 0) << 8) | (s.charCodeAt(i + 2 | 0) << 16) | (s.charCodeAt(i + 3 | 0) << 24);
  return {
          hi: hi,
          lo: (lo >>> 0)
        };
}

exports.min_int = min_int;
exports.max_int = max_int;
exports.one = one;
exports.zero = zero;
exports.not = not;
exports.of_int32 = of_int32;
exports.to_int32 = to_int32;
exports.add = add;
exports.neg = neg;
exports.sub = sub;
exports.lsl_ = lsl_;
exports.lsr_ = lsr_;
exports.asr_ = asr_;
exports.is_zero = is_zero;
exports.mul = mul;
exports.xor = xor;
exports.or_ = or_;
exports.and_ = and_;
exports.swap = swap;
exports.ge = ge;
exports.eq = eq;
exports.neq = neq;
exports.lt = lt;
exports.gt = gt;
exports.le = le;
exports.equal_null = equal_null;
exports.equal_undefined = equal_undefined;
exports.equal_nullable = equal_nullable;
exports.min = min;
exports.max = max;
exports.to_float = to_float;
exports.of_float = of_float;
exports.div = div;
exports.mod_ = mod_;
exports.compare = compare;
exports.float_of_bits = float_of_bits;
exports.bits_of_float = bits_of_float;
exports.get64 = get64;
exports.div_mod = div_mod;
exports.to_hex = to_hex;
exports.discard_sign = discard_sign;
/* Caml_int32 Not a pure module */

},{"./caml_builtin_exceptions.js":6,"./caml_int32.js":11,"./caml_primitive.js":17,"./caml_utils.js":20}],13:[function(require,module,exports){
(function (process){
'use strict';

var Curry = require("./curry.js");

var stdout = {
  buffer: "",
  output: (function (param, s) {
      var v = s.length - 1 | 0;
      if (( (typeof process !== "undefined") && process.stdout && process.stdout.write)) {
        return ( process.stdout.write )(s);
      } else if (s[v] === "\n") {
        console.log(s.slice(0, v));
        return /* () */0;
      } else {
        console.log(s);
        return /* () */0;
      }
    })
};

var stderr = {
  buffer: "",
  output: (function (param, s) {
      var v = s.length - 1 | 0;
      if (s[v] === "\n") {
        console.log(s.slice(0, v));
        return /* () */0;
      } else {
        console.log(s);
        return /* () */0;
      }
    })
};

function caml_ml_flush(oc) {
  if (oc.buffer !== "") {
    Curry._2(oc.output, oc, oc.buffer);
    oc.buffer = "";
    return /* () */0;
  } else {
    return 0;
  }
}

function caml_ml_output(oc, str, offset, len) {
  var str$1 = offset === 0 && len === str.length ? str : str.slice(offset, len);
  if (( (typeof process !== "undefined") && process.stdout && process.stdout.write ) && oc === stdout) {
    return ( process.stdout.write )(str$1);
  } else {
    var id = str$1.lastIndexOf("\n");
    if (id < 0) {
      oc.buffer = oc.buffer + str$1;
      return /* () */0;
    } else {
      oc.buffer = oc.buffer + str$1.slice(0, id + 1 | 0);
      caml_ml_flush(oc);
      oc.buffer = oc.buffer + str$1.slice(id + 1 | 0);
      return /* () */0;
    }
  }
}

function caml_ml_output_char(oc, $$char) {
  return caml_ml_output(oc, String.fromCharCode($$char), 0, 1);
}

function caml_ml_out_channels_list(param) {
  return /* :: */[
          stdout,
          /* :: */[
            stderr,
            /* [] */0
          ]
        ];
}

var stdin = undefined;

exports.stdin = stdin;
exports.stdout = stdout;
exports.stderr = stderr;
exports.caml_ml_flush = caml_ml_flush;
exports.caml_ml_output = caml_ml_output;
exports.caml_ml_output_char = caml_ml_output_char;
exports.caml_ml_out_channels_list = caml_ml_out_channels_list;
/* No side effect */

}).call(this,require('_process'))
},{"./curry.js":24,"_process":31}],14:[function(require,module,exports){
'use strict';

var Caml_option = require("./caml_option.js");
var Caml_exceptions = require("./caml_exceptions.js");

var $$Error = Caml_exceptions.create("Caml_js_exceptions.Error");

function internalToOCamlException(e) {
  if (Caml_exceptions.caml_is_extension(e)) {
    return e;
  } else {
    return [
            $$Error,
            e
          ];
  }
}

function caml_as_js_exn(exn) {
  if (exn[0] === $$Error) {
    return Caml_option.some(exn[1]);
  }
  
}

exports.$$Error = $$Error;
exports.internalToOCamlException = internalToOCamlException;
exports.caml_as_js_exn = caml_as_js_exn;
/* No side effect */

},{"./caml_exceptions.js":8,"./caml_option.js":16}],15:[function(require,module,exports){
'use strict';

var Block = require("./block.js");
var Caml_primitive = require("./caml_primitive.js");
var Caml_builtin_exceptions = require("./caml_builtin_exceptions.js");

function for_in (o,foo){
        for (var x in o) { foo(x) }
      };

function caml_obj_block(tag, size) {
  var v = new Array(size);
  v.tag = tag;
  return v;
}

function caml_obj_dup(x) {
  if (Array.isArray(x)) {
    var len = x.length | 0;
    var v = new Array(len);
    for(var i = 0 ,i_finish = len - 1 | 0; i <= i_finish; ++i){
      v[i] = x[i];
    }
    v.tag = x.tag | 0;
    return v;
  } else {
    return Object.assign(({}), x);
  }
}

function caml_obj_truncate(x, new_size) {
  var len = x.length | 0;
  if (new_size <= 0 || new_size > len) {
    throw [
          Caml_builtin_exceptions.invalid_argument,
          "Obj.truncate"
        ];
  }
  if (len !== new_size) {
    for(var i = new_size ,i_finish = len - 1 | 0; i <= i_finish; ++i){
      x[i] = 0;
    }
    x.length = new_size;
    return /* () */0;
  } else {
    return 0;
  }
}

function caml_lazy_make_forward(x) {
  return Block.__(250, [x]);
}

function caml_lazy_make(fn) {
  var block = /* array */[fn];
  block.tag = 246;
  return block;
}

function caml_update_dummy (x,y){
  for (var k in y){
    x[k] = y[k]
  }
  return 0;
};

function caml_compare(_a, _b) {
  while(true) {
    var b = _b;
    var a = _a;
    if (a === b) {
      return 0;
    } else {
      var a_type = typeof a;
      var b_type = typeof b;
      switch (a_type) {
        case "boolean" :
            if (b_type === "boolean") {
              return Caml_primitive.caml_bool_compare(a, b);
            }
            break;
        case "function" :
            if (b_type === "function") {
              throw [
                    Caml_builtin_exceptions.invalid_argument,
                    "compare: functional value"
                  ];
            }
            break;
        case "number" :
            if (b_type === "number") {
              return Caml_primitive.caml_int_compare(a, b);
            }
            break;
        case "string" :
            if (b_type === "string") {
              return Caml_primitive.caml_string_compare(a, b);
            } else {
              return 1;
            }
        case "undefined" :
            return -1;
        default:
          
      }
      switch (b_type) {
        case "string" :
            return -1;
        case "undefined" :
            return 1;
        default:
          if (a_type === "boolean") {
            return 1;
          } else if (b_type === "boolean") {
            return -1;
          } else if (a_type === "function") {
            return 1;
          } else if (b_type === "function") {
            return -1;
          } else if (a_type === "number") {
            if (b === null || b.tag === 256) {
              return 1;
            } else {
              return -1;
            }
          } else if (b_type === "number") {
            if (a === null || a.tag === 256) {
              return -1;
            } else {
              return 1;
            }
          } else if (a === null) {
            if (b.tag === 256) {
              return 1;
            } else {
              return -1;
            }
          } else if (b === null) {
            if (a.tag === 256) {
              return -1;
            } else {
              return 1;
            }
          } else {
            var tag_a = a.tag | 0;
            var tag_b = b.tag | 0;
            if (tag_a === 250) {
              _a = a[0];
              continue ;
            } else if (tag_b === 250) {
              _b = b[0];
              continue ;
            } else if (tag_a === 256) {
              if (tag_b === 256) {
                return Caml_primitive.caml_int_compare(a[1], b[1]);
              } else {
                return -1;
              }
            } else if (tag_a === 248) {
              return Caml_primitive.caml_int_compare(a[1], b[1]);
            } else {
              if (tag_a === 251) {
                throw [
                      Caml_builtin_exceptions.invalid_argument,
                      "equal: abstract value"
                    ];
              }
              if (tag_a !== tag_b) {
                if (tag_a < tag_b) {
                  return -1;
                } else {
                  return 1;
                }
              } else {
                var len_a = a.length | 0;
                var len_b = b.length | 0;
                if (len_a === len_b) {
                  if (Array.isArray(a)) {
                    var a$1 = a;
                    var b$1 = b;
                    var _i = 0;
                    var same_length = len_a;
                    while(true) {
                      var i = _i;
                      if (i === same_length) {
                        return 0;
                      } else {
                        var res = caml_compare(a$1[i], b$1[i]);
                        if (res !== 0) {
                          return res;
                        } else {
                          _i = i + 1 | 0;
                          continue ;
                        }
                      }
                    };
                  } else if ((a instanceof Date && b instanceof Date)) {
                    return (a - b);
                  } else {
                    var a$2 = a;
                    var b$2 = b;
                    var min_key_lhs = {
                      contents: undefined
                    };
                    var min_key_rhs = {
                      contents: undefined
                    };
                    var do_key = function (param, key) {
                      var min_key = param[2];
                      var b = param[1];
                      if (!b.hasOwnProperty(key) || caml_compare(param[0][key], b[key]) > 0) {
                        var match = min_key.contents;
                        if (match !== undefined && key >= match) {
                          return 0;
                        } else {
                          min_key.contents = key;
                          return /* () */0;
                        }
                      } else {
                        return 0;
                      }
                    };
                    var partial_arg = /* tuple */[
                      a$2,
                      b$2,
                      min_key_rhs
                    ];
                    var do_key_a = (function(partial_arg){
                    return function do_key_a(param) {
                      return do_key(partial_arg, param);
                    }
                    }(partial_arg));
                    var partial_arg$1 = /* tuple */[
                      b$2,
                      a$2,
                      min_key_lhs
                    ];
                    var do_key_b = (function(partial_arg$1){
                    return function do_key_b(param) {
                      return do_key(partial_arg$1, param);
                    }
                    }(partial_arg$1));
                    for_in(a$2, do_key_a);
                    for_in(b$2, do_key_b);
                    var match = min_key_lhs.contents;
                    var match$1 = min_key_rhs.contents;
                    if (match !== undefined) {
                      if (match$1 !== undefined) {
                        return Caml_primitive.caml_string_compare(match, match$1);
                      } else {
                        return -1;
                      }
                    } else if (match$1 !== undefined) {
                      return 1;
                    } else {
                      return 0;
                    }
                  }
                } else if (len_a < len_b) {
                  var a$3 = a;
                  var b$3 = b;
                  var _i$1 = 0;
                  var short_length = len_a;
                  while(true) {
                    var i$1 = _i$1;
                    if (i$1 === short_length) {
                      return -1;
                    } else {
                      var res$1 = caml_compare(a$3[i$1], b$3[i$1]);
                      if (res$1 !== 0) {
                        return res$1;
                      } else {
                        _i$1 = i$1 + 1 | 0;
                        continue ;
                      }
                    }
                  };
                } else {
                  var a$4 = a;
                  var b$4 = b;
                  var _i$2 = 0;
                  var short_length$1 = len_b;
                  while(true) {
                    var i$2 = _i$2;
                    if (i$2 === short_length$1) {
                      return 1;
                    } else {
                      var res$2 = caml_compare(a$4[i$2], b$4[i$2]);
                      if (res$2 !== 0) {
                        return res$2;
                      } else {
                        _i$2 = i$2 + 1 | 0;
                        continue ;
                      }
                    }
                  };
                }
              }
            }
          }
      }
    }
  };
}

function caml_equal(_a, _b) {
  while(true) {
    var b = _b;
    var a = _a;
    if (a === b) {
      return true;
    } else {
      var a_type = typeof a;
      if (a_type === "string" || a_type === "number" || a_type === "boolean" || a_type === "undefined" || a === null) {
        return false;
      } else {
        var b_type = typeof b;
        if (a_type === "function" || b_type === "function") {
          throw [
                Caml_builtin_exceptions.invalid_argument,
                "equal: functional value"
              ];
        }
        if (b_type === "number" || b_type === "undefined" || b === null) {
          return false;
        } else {
          var tag_a = a.tag | 0;
          var tag_b = b.tag | 0;
          if (tag_a === 250) {
            _a = a[0];
            continue ;
          } else if (tag_b === 250) {
            _b = b[0];
            continue ;
          } else if (tag_a === 248) {
            return a[1] === b[1];
          } else {
            if (tag_a === 251) {
              throw [
                    Caml_builtin_exceptions.invalid_argument,
                    "equal: abstract value"
                  ];
            }
            if (tag_a !== tag_b) {
              return false;
            } else if (tag_a === 256) {
              return a[1] === b[1];
            } else {
              var len_a = a.length | 0;
              var len_b = b.length | 0;
              if (len_a === len_b) {
                if (Array.isArray(a)) {
                  var a$1 = a;
                  var b$1 = b;
                  var _i = 0;
                  var same_length = len_a;
                  while(true) {
                    var i = _i;
                    if (i === same_length) {
                      return true;
                    } else if (caml_equal(a$1[i], b$1[i])) {
                      _i = i + 1 | 0;
                      continue ;
                    } else {
                      return false;
                    }
                  };
                } else if ((a instanceof Date && b instanceof Date)) {
                  return !(a > b || a < b);
                } else {
                  var a$2 = a;
                  var b$2 = b;
                  var result = {
                    contents: true
                  };
                  var do_key_a = (function(b$2,result){
                  return function do_key_a(key) {
                    if (b$2.hasOwnProperty(key)) {
                      return 0;
                    } else {
                      result.contents = false;
                      return /* () */0;
                    }
                  }
                  }(b$2,result));
                  var do_key_b = (function(a$2,b$2,result){
                  return function do_key_b(key) {
                    if (!a$2.hasOwnProperty(key) || !caml_equal(b$2[key], a$2[key])) {
                      result.contents = false;
                      return /* () */0;
                    } else {
                      return 0;
                    }
                  }
                  }(a$2,b$2,result));
                  for_in(a$2, do_key_a);
                  if (result.contents) {
                    for_in(b$2, do_key_b);
                  }
                  return result.contents;
                }
              } else {
                return false;
              }
            }
          }
        }
      }
    }
  };
}

function caml_equal_null(x, y) {
  if (y !== null) {
    return caml_equal(x, y);
  } else {
    return x === y;
  }
}

function caml_equal_undefined(x, y) {
  if (y !== undefined) {
    return caml_equal(x, y);
  } else {
    return x === y;
  }
}

function caml_equal_nullable(x, y) {
  if (y == null) {
    return x === y;
  } else {
    return caml_equal(x, y);
  }
}

function caml_notequal(a, b) {
  return !caml_equal(a, b);
}

function caml_greaterequal(a, b) {
  return caml_compare(a, b) >= 0;
}

function caml_greaterthan(a, b) {
  return caml_compare(a, b) > 0;
}

function caml_lessequal(a, b) {
  return caml_compare(a, b) <= 0;
}

function caml_lessthan(a, b) {
  return caml_compare(a, b) < 0;
}

function caml_min(x, y) {
  if (caml_compare(x, y) <= 0) {
    return x;
  } else {
    return y;
  }
}

function caml_max(x, y) {
  if (caml_compare(x, y) >= 0) {
    return x;
  } else {
    return y;
  }
}

function caml_obj_set_tag(prim, prim$1) {
  prim.tag = prim$1;
  return /* () */0;
}

exports.caml_obj_block = caml_obj_block;
exports.caml_obj_dup = caml_obj_dup;
exports.caml_obj_truncate = caml_obj_truncate;
exports.caml_lazy_make_forward = caml_lazy_make_forward;
exports.caml_lazy_make = caml_lazy_make;
exports.caml_update_dummy = caml_update_dummy;
exports.caml_compare = caml_compare;
exports.caml_equal = caml_equal;
exports.caml_equal_null = caml_equal_null;
exports.caml_equal_undefined = caml_equal_undefined;
exports.caml_equal_nullable = caml_equal_nullable;
exports.caml_notequal = caml_notequal;
exports.caml_greaterequal = caml_greaterequal;
exports.caml_greaterthan = caml_greaterthan;
exports.caml_lessthan = caml_lessthan;
exports.caml_lessequal = caml_lessequal;
exports.caml_min = caml_min;
exports.caml_max = caml_max;
exports.caml_obj_set_tag = caml_obj_set_tag;
/* No side effect */

},{"./block.js":2,"./caml_builtin_exceptions.js":6,"./caml_primitive.js":17}],16:[function(require,module,exports){
'use strict';


var undefinedHeader = /* array */[];

function some(x) {
  if (x === undefined) {
    var block = /* tuple */[
      undefinedHeader,
      0
    ];
    block.tag = 256;
    return block;
  } else if (x !== null && x[0] === undefinedHeader) {
    var nid = x[1] + 1 | 0;
    var block$1 = /* tuple */[
      undefinedHeader,
      nid
    ];
    block$1.tag = 256;
    return block$1;
  } else {
    return x;
  }
}

function nullable_to_opt(x) {
  if (x === null || x === undefined) {
    return ;
  } else {
    return some(x);
  }
}

function undefined_to_opt(x) {
  if (x === undefined) {
    return ;
  } else {
    return some(x);
  }
}

function null_to_opt(x) {
  if (x === null) {
    return ;
  } else {
    return some(x);
  }
}

function valFromOption(x) {
  if (x !== null && x[0] === undefinedHeader) {
    var depth = x[1];
    if (depth === 0) {
      return ;
    } else {
      return /* tuple */[
              undefinedHeader,
              depth - 1 | 0
            ];
    }
  } else {
    return x;
  }
}

function option_get(x) {
  if (x === undefined) {
    return ;
  } else {
    return valFromOption(x);
  }
}

function option_get_unwrap(x) {
  if (x === undefined) {
    return ;
  } else {
    return valFromOption(x)[1];
  }
}

exports.nullable_to_opt = nullable_to_opt;
exports.undefined_to_opt = undefined_to_opt;
exports.null_to_opt = null_to_opt;
exports.valFromOption = valFromOption;
exports.some = some;
exports.option_get = option_get;
exports.option_get_unwrap = option_get_unwrap;
/* No side effect */

},{}],17:[function(require,module,exports){
'use strict';


function caml_int_compare(x, y) {
  if (x < y) {
    return -1;
  } else if (x === y) {
    return 0;
  } else {
    return 1;
  }
}

function caml_bool_compare(x, y) {
  if (x) {
    if (y) {
      return 0;
    } else {
      return 1;
    }
  } else if (y) {
    return -1;
  } else {
    return 0;
  }
}

function caml_float_compare(x, y) {
  if (x === y) {
    return 0;
  } else if (x < y) {
    return -1;
  } else if (x > y || x === x) {
    return 1;
  } else if (y === y) {
    return -1;
  } else {
    return 0;
  }
}

function caml_string_compare(s1, s2) {
  if (s1 === s2) {
    return 0;
  } else if (s1 < s2) {
    return -1;
  } else {
    return 1;
  }
}

function caml_bytes_compare_aux(s1, s2, _off, len, def) {
  while(true) {
    var off = _off;
    if (off < len) {
      var a = s1[off];
      var b = s2[off];
      if (a > b) {
        return 1;
      } else if (a < b) {
        return -1;
      } else {
        _off = off + 1 | 0;
        continue ;
      }
    } else {
      return def;
    }
  };
}

function caml_bytes_compare(s1, s2) {
  var len1 = s1.length;
  var len2 = s2.length;
  if (len1 === len2) {
    return caml_bytes_compare_aux(s1, s2, 0, len1, 0);
  } else if (len1 < len2) {
    return caml_bytes_compare_aux(s1, s2, 0, len1, -1);
  } else {
    return caml_bytes_compare_aux(s1, s2, 0, len2, 1);
  }
}

function caml_bytes_equal(s1, s2) {
  var len1 = s1.length;
  var len2 = s2.length;
  if (len1 === len2) {
    var s1$1 = s1;
    var s2$1 = s2;
    var _off = 0;
    var len = len1;
    while(true) {
      var off = _off;
      if (off === len) {
        return true;
      } else {
        var a = s1$1[off];
        var b = s2$1[off];
        if (a === b) {
          _off = off + 1 | 0;
          continue ;
        } else {
          return false;
        }
      }
    };
  } else {
    return false;
  }
}

function caml_bool_min(x, y) {
  if (x) {
    return y;
  } else {
    return x;
  }
}

function caml_int_min(x, y) {
  if (x < y) {
    return x;
  } else {
    return y;
  }
}

function caml_float_min(x, y) {
  if (x < y) {
    return x;
  } else {
    return y;
  }
}

function caml_string_min(x, y) {
  if (x < y) {
    return x;
  } else {
    return y;
  }
}

function caml_nativeint_min(x, y) {
  if (x < y) {
    return x;
  } else {
    return y;
  }
}

function caml_int32_min(x, y) {
  if (x < y) {
    return x;
  } else {
    return y;
  }
}

function caml_bool_max(x, y) {
  if (x) {
    return x;
  } else {
    return y;
  }
}

function caml_int_max(x, y) {
  if (x > y) {
    return x;
  } else {
    return y;
  }
}

function caml_float_max(x, y) {
  if (x > y) {
    return x;
  } else {
    return y;
  }
}

function caml_string_max(x, y) {
  if (x > y) {
    return x;
  } else {
    return y;
  }
}

function caml_nativeint_max(x, y) {
  if (x > y) {
    return x;
  } else {
    return y;
  }
}

function caml_int32_max(x, y) {
  if (x > y) {
    return x;
  } else {
    return y;
  }
}

var caml_nativeint_compare = caml_int_compare;

var caml_int32_compare = caml_int_compare;

exports.caml_bytes_compare = caml_bytes_compare;
exports.caml_bytes_equal = caml_bytes_equal;
exports.caml_int_compare = caml_int_compare;
exports.caml_bool_compare = caml_bool_compare;
exports.caml_float_compare = caml_float_compare;
exports.caml_nativeint_compare = caml_nativeint_compare;
exports.caml_string_compare = caml_string_compare;
exports.caml_int32_compare = caml_int32_compare;
exports.caml_bool_min = caml_bool_min;
exports.caml_int_min = caml_int_min;
exports.caml_float_min = caml_float_min;
exports.caml_string_min = caml_string_min;
exports.caml_nativeint_min = caml_nativeint_min;
exports.caml_int32_min = caml_int32_min;
exports.caml_bool_max = caml_bool_max;
exports.caml_int_max = caml_int_max;
exports.caml_float_max = caml_float_max;
exports.caml_string_max = caml_string_max;
exports.caml_nativeint_max = caml_nativeint_max;
exports.caml_int32_max = caml_int32_max;
/* No side effect */

},{}],18:[function(require,module,exports){
'use strict';

var Caml_builtin_exceptions = require("./caml_builtin_exceptions.js");

function caml_string_get(s, i) {
  if (i >= s.length || i < 0) {
    throw [
          Caml_builtin_exceptions.invalid_argument,
          "index out of bounds"
        ];
  }
  return s.charCodeAt(i);
}

function caml_string_get16(s, i) {
  return s.charCodeAt(i) + (s.charCodeAt(i + 1 | 0) << 8) | 0;
}

function caml_string_get32(s, i) {
  return ((s.charCodeAt(i) + (s.charCodeAt(i + 1 | 0) << 8) | 0) + (s.charCodeAt(i + 2 | 0) << 16) | 0) + (s.charCodeAt(i + 3 | 0) << 24) | 0;
}

function get(s, i) {
  if (i < 0 || i >= s.length) {
    throw [
          Caml_builtin_exceptions.invalid_argument,
          "index out of bounds"
        ];
  }
  return s.charCodeAt(i);
}

exports.caml_string_get = caml_string_get;
exports.caml_string_get16 = caml_string_get16;
exports.caml_string_get32 = caml_string_get32;
exports.get = get;
/* No side effect */

},{"./caml_builtin_exceptions.js":6}],19:[function(require,module,exports){
(function (process){
'use strict';

var Caml_builtin_exceptions = require("./caml_builtin_exceptions.js");

function caml_sys_getenv(s) {
  if (typeof process === "undefined" || (process.env) === undefined) {
    throw Caml_builtin_exceptions.not_found;
  }
  var match = (process.env)[s];
  if (match !== undefined) {
    return match;
  } else {
    throw Caml_builtin_exceptions.not_found;
  }
}

function caml_sys_time(param) {
  if (typeof process === "undefined" || (process.uptime) === undefined) {
    return -1;
  } else {
    return process.uptime();
  }
}

function caml_sys_random_seed(param) {
  return /* array */[((Date.now() | 0) ^ 4294967295) * Math.random() | 0];
}

function caml_sys_system_command(_cmd) {
  return 127;
}

function caml_sys_getcwd(param) {
  if (typeof process === "undefined") {
    return "/";
  } else {
    return process.cwd();
  }
}

function caml_sys_get_argv(param) {
  if (typeof process === "undefined") {
    return /* tuple */[
            "",
            /* array */[""]
          ];
  } else {
    var argv = (process.argv);
    if (argv == null) {
      return /* tuple */[
              "",
              /* array */[""]
            ];
    } else {
      return /* tuple */[
              argv[0],
              argv
            ];
    }
  }
}

function caml_sys_exit(exit_code) {
  if (typeof process !== "undefined") {
    return process.exit(exit_code);
  } else {
    return 0;
  }
}

function caml_sys_is_directory(_s) {
  throw [
        Caml_builtin_exceptions.failure,
        "caml_sys_is_directory not implemented"
      ];
}

function caml_sys_file_exists(_s) {
  throw [
        Caml_builtin_exceptions.failure,
        "caml_sys_file_exists not implemented"
      ];
}

exports.caml_sys_getenv = caml_sys_getenv;
exports.caml_sys_time = caml_sys_time;
exports.caml_sys_random_seed = caml_sys_random_seed;
exports.caml_sys_system_command = caml_sys_system_command;
exports.caml_sys_getcwd = caml_sys_getcwd;
exports.caml_sys_get_argv = caml_sys_get_argv;
exports.caml_sys_exit = caml_sys_exit;
exports.caml_sys_is_directory = caml_sys_is_directory;
exports.caml_sys_file_exists = caml_sys_file_exists;
/* No side effect */

}).call(this,require('_process'))
},{"./caml_builtin_exceptions.js":6,"_process":31}],20:[function(require,module,exports){
'use strict';


function repeat (count,self){
    if (self.repeat){
        return self.repeat(count)
    }
    if (self.length == 0 || count == 0) {
            return '';
        }
    // Ensuring count is a 31-bit integer allows us to heavily optimize the
    // main part. But anyway, most current (August 2014) browsers can't handle
    // strings 1 << 28 chars or longer, so:
    if (self.length * count >= 1 << 28) {
            throw new RangeError('repeat count must not overflow maximum string size');
    }
    var rpt = '';
    for (;;) {
            if ((count & 1) == 1) {
                rpt += self;
            }
            count >>>= 1;
            if (count == 0) {
                break;
            }
            self += self;
    }
    return rpt;

};

exports.repeat = repeat;
/* No side effect */

},{}],21:[function(require,module,exports){
'use strict';

var Char = require("./char.js");
var Block = require("./block.js");
var Bytes = require("./bytes.js");
var Curry = require("./curry.js");
var $$Buffer = require("./buffer.js");
var $$String = require("./string.js");
var Caml_io = require("./caml_io.js");
var Caml_obj = require("./caml_obj.js");
var Caml_bytes = require("./caml_bytes.js");
var Caml_int32 = require("./caml_int32.js");
var Pervasives = require("./pervasives.js");
var Caml_format = require("./caml_format.js");
var Caml_string = require("./caml_string.js");
var Caml_primitive = require("./caml_primitive.js");
var Caml_exceptions = require("./caml_exceptions.js");
var Caml_js_exceptions = require("./caml_js_exceptions.js");
var Caml_builtin_exceptions = require("./caml_builtin_exceptions.js");
var CamlinternalFormatBasics = require("./camlinternalFormatBasics.js");

function create_char_set(param) {
  return Bytes.make(32, /* "\000" */0);
}

function add_in_char_set(char_set, c) {
  var str_ind = (c >>> 3);
  var mask = (1 << (c & 7));
  char_set[str_ind] = Pervasives.char_of_int(Caml_bytes.get(char_set, str_ind) | mask);
  return /* () */0;
}

var freeze_char_set = Bytes.to_string;

function rev_char_set(char_set) {
  var char_set$prime = Bytes.make(32, /* "\000" */0);
  for(var i = 0; i <= 31; ++i){
    char_set$prime[i] = Pervasives.char_of_int(Caml_string.get(char_set, i) ^ 255);
  }
  return Caml_bytes.bytes_to_string(char_set$prime);
}

function is_in_char_set(char_set, c) {
  var str_ind = (c >>> 3);
  var mask = (1 << (c & 7));
  return (Caml_string.get(char_set, str_ind) & mask) !== 0;
}

function pad_of_pad_opt(pad_opt) {
  if (pad_opt !== undefined) {
    return /* Lit_padding */Block.__(0, [
              /* Right */1,
              pad_opt
            ]);
  } else {
    return /* No_padding */0;
  }
}

function prec_of_prec_opt(prec_opt) {
  if (prec_opt !== undefined) {
    return /* Lit_precision */[prec_opt];
  } else {
    return /* No_precision */0;
  }
}

function param_format_of_ignored_format(ign, fmt) {
  if (typeof ign === "number") {
    switch (ign) {
      case /* Ignored_char */0 :
          return /* Param_format_EBB */[/* Char */Block.__(0, [fmt])];
      case /* Ignored_caml_char */1 :
          return /* Param_format_EBB */[/* Caml_char */Block.__(1, [fmt])];
      case /* Ignored_reader */2 :
          return /* Param_format_EBB */[/* Reader */Block.__(19, [fmt])];
      case /* Ignored_scan_next_char */3 :
          return /* Param_format_EBB */[/* Scan_next_char */Block.__(22, [fmt])];
      
    }
  } else {
    switch (ign.tag | 0) {
      case /* Ignored_string */0 :
          return /* Param_format_EBB */[/* String */Block.__(2, [
                      pad_of_pad_opt(ign[0]),
                      fmt
                    ])];
      case /* Ignored_caml_string */1 :
          return /* Param_format_EBB */[/* Caml_string */Block.__(3, [
                      pad_of_pad_opt(ign[0]),
                      fmt
                    ])];
      case /* Ignored_int */2 :
          return /* Param_format_EBB */[/* Int */Block.__(4, [
                      ign[0],
                      pad_of_pad_opt(ign[1]),
                      /* No_precision */0,
                      fmt
                    ])];
      case /* Ignored_int32 */3 :
          return /* Param_format_EBB */[/* Int32 */Block.__(5, [
                      ign[0],
                      pad_of_pad_opt(ign[1]),
                      /* No_precision */0,
                      fmt
                    ])];
      case /* Ignored_nativeint */4 :
          return /* Param_format_EBB */[/* Nativeint */Block.__(6, [
                      ign[0],
                      pad_of_pad_opt(ign[1]),
                      /* No_precision */0,
                      fmt
                    ])];
      case /* Ignored_int64 */5 :
          return /* Param_format_EBB */[/* Int64 */Block.__(7, [
                      ign[0],
                      pad_of_pad_opt(ign[1]),
                      /* No_precision */0,
                      fmt
                    ])];
      case /* Ignored_float */6 :
          return /* Param_format_EBB */[/* Float */Block.__(8, [
                      /* Float_f */0,
                      pad_of_pad_opt(ign[0]),
                      prec_of_prec_opt(ign[1]),
                      fmt
                    ])];
      case /* Ignored_bool */7 :
          return /* Param_format_EBB */[/* Bool */Block.__(9, [
                      pad_of_pad_opt(ign[0]),
                      fmt
                    ])];
      case /* Ignored_format_arg */8 :
          return /* Param_format_EBB */[/* Format_arg */Block.__(13, [
                      ign[0],
                      ign[1],
                      fmt
                    ])];
      case /* Ignored_format_subst */9 :
          return /* Param_format_EBB */[/* Format_subst */Block.__(14, [
                      ign[0],
                      ign[1],
                      fmt
                    ])];
      case /* Ignored_scan_char_set */10 :
          return /* Param_format_EBB */[/* Scan_char_set */Block.__(20, [
                      ign[0],
                      ign[1],
                      fmt
                    ])];
      case /* Ignored_scan_get_counter */11 :
          return /* Param_format_EBB */[/* Scan_get_counter */Block.__(21, [
                      ign[0],
                      fmt
                    ])];
      
    }
  }
}

function buffer_check_size(buf, overhead) {
  var len = buf.bytes.length;
  var min_len = buf.ind + overhead | 0;
  if (min_len > len) {
    var new_len = Caml_primitive.caml_int_max((len << 1), min_len);
    var new_str = Caml_bytes.caml_create_bytes(new_len);
    Bytes.blit(buf.bytes, 0, new_str, 0, len);
    buf.bytes = new_str;
    return /* () */0;
  } else {
    return 0;
  }
}

function buffer_add_char(buf, c) {
  buffer_check_size(buf, 1);
  buf.bytes[buf.ind] = c;
  buf.ind = buf.ind + 1 | 0;
  return /* () */0;
}

function buffer_add_string(buf, s) {
  var str_len = s.length;
  buffer_check_size(buf, str_len);
  $$String.blit(s, 0, buf.bytes, buf.ind, str_len);
  buf.ind = buf.ind + str_len | 0;
  return /* () */0;
}

function buffer_contents(buf) {
  return Bytes.sub_string(buf.bytes, 0, buf.ind);
}

function char_of_iconv(iconv) {
  switch (iconv) {
    case /* Int_d */0 :
    case /* Int_pd */1 :
    case /* Int_sd */2 :
        return /* "d" */100;
    case /* Int_i */3 :
    case /* Int_pi */4 :
    case /* Int_si */5 :
        return /* "i" */105;
    case /* Int_x */6 :
    case /* Int_Cx */7 :
        return /* "x" */120;
    case /* Int_X */8 :
    case /* Int_CX */9 :
        return /* "X" */88;
    case /* Int_o */10 :
    case /* Int_Co */11 :
        return /* "o" */111;
    case /* Int_u */12 :
        return /* "u" */117;
    
  }
}

function char_of_fconv(fconv) {
  switch (fconv) {
    case /* Float_f */0 :
    case /* Float_pf */1 :
    case /* Float_sf */2 :
        return /* "f" */102;
    case /* Float_e */3 :
    case /* Float_pe */4 :
    case /* Float_se */5 :
        return /* "e" */101;
    case /* Float_E */6 :
    case /* Float_pE */7 :
    case /* Float_sE */8 :
        return /* "E" */69;
    case /* Float_g */9 :
    case /* Float_pg */10 :
    case /* Float_sg */11 :
        return /* "g" */103;
    case /* Float_G */12 :
    case /* Float_pG */13 :
    case /* Float_sG */14 :
        return /* "G" */71;
    case /* Float_F */15 :
        return /* "F" */70;
    case /* Float_h */16 :
    case /* Float_ph */17 :
    case /* Float_sh */18 :
        return /* "h" */104;
    case /* Float_H */19 :
    case /* Float_pH */20 :
    case /* Float_sH */21 :
        return /* "H" */72;
    
  }
}

function char_of_counter(counter) {
  switch (counter) {
    case /* Line_counter */0 :
        return /* "l" */108;
    case /* Char_counter */1 :
        return /* "n" */110;
    case /* Token_counter */2 :
        return /* "N" */78;
    
  }
}

function bprint_char_set(buf, char_set) {
  var print_char = function (buf, i) {
    var c = Pervasives.char_of_int(i);
    if (c !== 37) {
      if (c !== 64) {
        return buffer_add_char(buf, c);
      } else {
        buffer_add_char(buf, /* "%" */37);
        return buffer_add_char(buf, /* "@" */64);
      }
    } else {
      buffer_add_char(buf, /* "%" */37);
      return buffer_add_char(buf, /* "%" */37);
    }
  };
  var print_out = function (set, _i) {
    while(true) {
      var i = _i;
      if (i < 256) {
        if (is_in_char_set(set, Pervasives.char_of_int(i))) {
          var set$1 = set;
          var i$1 = i;
          var match = Pervasives.char_of_int(i$1);
          var switcher = match - 45 | 0;
          if (switcher > 48 || switcher < 0) {
            if (switcher >= 210) {
              return print_char(buf, 255);
            } else {
              return print_second(set$1, i$1 + 1 | 0);
            }
          } else if (switcher > 47 || switcher < 1) {
            return print_out(set$1, i$1 + 1 | 0);
          } else {
            return print_second(set$1, i$1 + 1 | 0);
          }
        } else {
          _i = i + 1 | 0;
          continue ;
        }
      } else {
        return 0;
      }
    };
  };
  var print_second = function (set, i) {
    if (is_in_char_set(set, Pervasives.char_of_int(i))) {
      var match = Pervasives.char_of_int(i);
      var switcher = match - 45 | 0;
      if (switcher > 48 || switcher < 0) {
        if (switcher >= 210) {
          print_char(buf, 254);
          return print_char(buf, 255);
        }
        
      } else if ((switcher > 47 || switcher < 1) && !is_in_char_set(set, Pervasives.char_of_int(i + 1 | 0))) {
        print_char(buf, i - 1 | 0);
        return print_out(set, i + 1 | 0);
      }
      if (is_in_char_set(set, Pervasives.char_of_int(i + 1 | 0))) {
        var set$1 = set;
        var i$1 = i - 1 | 0;
        var _j = i + 2 | 0;
        while(true) {
          var j = _j;
          if (j === 256 || !is_in_char_set(set$1, Pervasives.char_of_int(j))) {
            print_char(buf, i$1);
            print_char(buf, /* "-" */45);
            print_char(buf, j - 1 | 0);
            if (j < 256) {
              return print_out(set$1, j + 1 | 0);
            } else {
              return 0;
            }
          } else {
            _j = j + 1 | 0;
            continue ;
          }
        };
      } else {
        print_char(buf, i - 1 | 0);
        print_char(buf, i);
        return print_out(set, i + 2 | 0);
      }
    } else {
      print_char(buf, i - 1 | 0);
      return print_out(set, i + 1 | 0);
    }
  };
  var print_start = function (set) {
    var is_alone = function (c) {
      var before = Char.chr(c - 1 | 0);
      var after = Char.chr(c + 1 | 0);
      if (is_in_char_set(set, c)) {
        return !(is_in_char_set(set, before) && is_in_char_set(set, after));
      } else {
        return false;
      }
    };
    if (is_alone(/* "]" */93)) {
      buffer_add_char(buf, /* "]" */93);
    }
    print_out(set, 1);
    if (is_alone(/* "-" */45)) {
      return buffer_add_char(buf, /* "-" */45);
    } else {
      return 0;
    }
  };
  buffer_add_char(buf, /* "[" */91);
  print_start(is_in_char_set(char_set, /* "\000" */0) ? (buffer_add_char(buf, /* "^" */94), rev_char_set(char_set)) : char_set);
  return buffer_add_char(buf, /* "]" */93);
}

function bprint_padty(buf, padty) {
  switch (padty) {
    case /* Left */0 :
        return buffer_add_char(buf, /* "-" */45);
    case /* Right */1 :
        return /* () */0;
    case /* Zeros */2 :
        return buffer_add_char(buf, /* "0" */48);
    
  }
}

function bprint_ignored_flag(buf, ign_flag) {
  if (ign_flag) {
    return buffer_add_char(buf, /* "_" */95);
  } else {
    return 0;
  }
}

function bprint_pad_opt(buf, pad_opt) {
  if (pad_opt !== undefined) {
    return buffer_add_string(buf, String(pad_opt));
  } else {
    return /* () */0;
  }
}

function bprint_padding(buf, pad) {
  if (typeof pad === "number") {
    return /* () */0;
  } else {
    bprint_padty(buf, pad[0]);
    if (pad.tag) {
      return buffer_add_char(buf, /* "*" */42);
    } else {
      return buffer_add_string(buf, String(pad[1]));
    }
  }
}

function bprint_precision(buf, prec) {
  if (typeof prec === "number") {
    if (prec !== 0) {
      return buffer_add_string(buf, ".*");
    } else {
      return /* () */0;
    }
  } else {
    buffer_add_char(buf, /* "." */46);
    return buffer_add_string(buf, String(prec[0]));
  }
}

function bprint_iconv_flag(buf, iconv) {
  switch (iconv) {
    case /* Int_pd */1 :
    case /* Int_pi */4 :
        return buffer_add_char(buf, /* "+" */43);
    case /* Int_sd */2 :
    case /* Int_si */5 :
        return buffer_add_char(buf, /* " " */32);
    case /* Int_Cx */7 :
    case /* Int_CX */9 :
    case /* Int_Co */11 :
        return buffer_add_char(buf, /* "#" */35);
    case /* Int_d */0 :
    case /* Int_i */3 :
    case /* Int_x */6 :
    case /* Int_X */8 :
    case /* Int_o */10 :
    case /* Int_u */12 :
        return /* () */0;
    
  }
}

function bprint_int_fmt(buf, ign_flag, iconv, pad, prec) {
  buffer_add_char(buf, /* "%" */37);
  bprint_ignored_flag(buf, ign_flag);
  bprint_iconv_flag(buf, iconv);
  bprint_padding(buf, pad);
  bprint_precision(buf, prec);
  return buffer_add_char(buf, char_of_iconv(iconv));
}

function bprint_altint_fmt(buf, ign_flag, iconv, pad, prec, c) {
  buffer_add_char(buf, /* "%" */37);
  bprint_ignored_flag(buf, ign_flag);
  bprint_iconv_flag(buf, iconv);
  bprint_padding(buf, pad);
  bprint_precision(buf, prec);
  buffer_add_char(buf, c);
  return buffer_add_char(buf, char_of_iconv(iconv));
}

function bprint_fconv_flag(buf, fconv) {
  switch (fconv) {
    case /* Float_f */0 :
    case /* Float_e */3 :
    case /* Float_E */6 :
    case /* Float_g */9 :
    case /* Float_G */12 :
    case /* Float_F */15 :
    case /* Float_h */16 :
    case /* Float_H */19 :
        return /* () */0;
    case /* Float_pf */1 :
    case /* Float_pe */4 :
    case /* Float_pE */7 :
    case /* Float_pg */10 :
    case /* Float_pG */13 :
    case /* Float_ph */17 :
    case /* Float_pH */20 :
        return buffer_add_char(buf, /* "+" */43);
    case /* Float_sf */2 :
    case /* Float_se */5 :
    case /* Float_sE */8 :
    case /* Float_sg */11 :
    case /* Float_sG */14 :
    case /* Float_sh */18 :
    case /* Float_sH */21 :
        return buffer_add_char(buf, /* " " */32);
    
  }
}

function bprint_float_fmt(buf, ign_flag, fconv, pad, prec) {
  buffer_add_char(buf, /* "%" */37);
  bprint_ignored_flag(buf, ign_flag);
  bprint_fconv_flag(buf, fconv);
  bprint_padding(buf, pad);
  bprint_precision(buf, prec);
  return buffer_add_char(buf, char_of_fconv(fconv));
}

function string_of_formatting_lit(formatting_lit) {
  if (typeof formatting_lit === "number") {
    switch (formatting_lit) {
      case /* Close_box */0 :
          return "@]";
      case /* Close_tag */1 :
          return "@}";
      case /* FFlush */2 :
          return "@?";
      case /* Force_newline */3 :
          return "@\n";
      case /* Flush_newline */4 :
          return "@.";
      case /* Escaped_at */5 :
          return "@@";
      case /* Escaped_percent */6 :
          return "@%";
      
    }
  } else {
    switch (formatting_lit.tag | 0) {
      case /* Break */0 :
      case /* Magic_size */1 :
          return formatting_lit[0];
      case /* Scan_indic */2 :
          return "@" + Caml_bytes.bytes_to_string(Bytes.make(1, formatting_lit[0]));
      
    }
  }
}

function string_of_formatting_gen(formatting_gen) {
  return formatting_gen[0][1];
}

function bprint_char_literal(buf, chr) {
  if (chr !== 37) {
    return buffer_add_char(buf, chr);
  } else {
    return buffer_add_string(buf, "%%");
  }
}

function bprint_string_literal(buf, str) {
  for(var i = 0 ,i_finish = str.length - 1 | 0; i <= i_finish; ++i){
    bprint_char_literal(buf, Caml_string.get(str, i));
  }
  return /* () */0;
}

function bprint_fmtty(buf, _fmtty) {
  while(true) {
    var fmtty = _fmtty;
    if (typeof fmtty === "number") {
      return /* () */0;
    } else {
      switch (fmtty.tag | 0) {
        case /* Char_ty */0 :
            buffer_add_string(buf, "%c");
            _fmtty = fmtty[0];
            continue ;
        case /* String_ty */1 :
            buffer_add_string(buf, "%s");
            _fmtty = fmtty[0];
            continue ;
        case /* Int_ty */2 :
            buffer_add_string(buf, "%i");
            _fmtty = fmtty[0];
            continue ;
        case /* Int32_ty */3 :
            buffer_add_string(buf, "%li");
            _fmtty = fmtty[0];
            continue ;
        case /* Nativeint_ty */4 :
            buffer_add_string(buf, "%ni");
            _fmtty = fmtty[0];
            continue ;
        case /* Int64_ty */5 :
            buffer_add_string(buf, "%Li");
            _fmtty = fmtty[0];
            continue ;
        case /* Float_ty */6 :
            buffer_add_string(buf, "%f");
            _fmtty = fmtty[0];
            continue ;
        case /* Bool_ty */7 :
            buffer_add_string(buf, "%B");
            _fmtty = fmtty[0];
            continue ;
        case /* Format_arg_ty */8 :
            buffer_add_string(buf, "%{");
            bprint_fmtty(buf, fmtty[0]);
            buffer_add_string(buf, "%}");
            _fmtty = fmtty[1];
            continue ;
        case /* Format_subst_ty */9 :
            buffer_add_string(buf, "%(");
            bprint_fmtty(buf, fmtty[0]);
            buffer_add_string(buf, "%)");
            _fmtty = fmtty[2];
            continue ;
        case /* Alpha_ty */10 :
            buffer_add_string(buf, "%a");
            _fmtty = fmtty[0];
            continue ;
        case /* Theta_ty */11 :
            buffer_add_string(buf, "%t");
            _fmtty = fmtty[0];
            continue ;
        case /* Any_ty */12 :
            buffer_add_string(buf, "%?");
            _fmtty = fmtty[0];
            continue ;
        case /* Reader_ty */13 :
            buffer_add_string(buf, "%r");
            _fmtty = fmtty[0];
            continue ;
        case /* Ignored_reader_ty */14 :
            buffer_add_string(buf, "%_r");
            _fmtty = fmtty[0];
            continue ;
        
      }
    }
  };
}

function int_of_custom_arity(param) {
  if (param) {
    return 1 + int_of_custom_arity(param[0]) | 0;
  } else {
    return 0;
  }
}

function bprint_fmt(buf, fmt) {
  var _fmt = fmt;
  var _ign_flag = false;
  while(true) {
    var ign_flag = _ign_flag;
    var fmt$1 = _fmt;
    if (typeof fmt$1 === "number") {
      return /* () */0;
    } else {
      switch (fmt$1.tag | 0) {
        case /* Char */0 :
            buffer_add_char(buf, /* "%" */37);
            bprint_ignored_flag(buf, ign_flag);
            buffer_add_char(buf, /* "c" */99);
            _ign_flag = false;
            _fmt = fmt$1[0];
            continue ;
        case /* Caml_char */1 :
            buffer_add_char(buf, /* "%" */37);
            bprint_ignored_flag(buf, ign_flag);
            buffer_add_char(buf, /* "C" */67);
            _ign_flag = false;
            _fmt = fmt$1[0];
            continue ;
        case /* String */2 :
            buffer_add_char(buf, /* "%" */37);
            bprint_ignored_flag(buf, ign_flag);
            bprint_padding(buf, fmt$1[0]);
            buffer_add_char(buf, /* "s" */115);
            _ign_flag = false;
            _fmt = fmt$1[1];
            continue ;
        case /* Caml_string */3 :
            buffer_add_char(buf, /* "%" */37);
            bprint_ignored_flag(buf, ign_flag);
            bprint_padding(buf, fmt$1[0]);
            buffer_add_char(buf, /* "S" */83);
            _ign_flag = false;
            _fmt = fmt$1[1];
            continue ;
        case /* Int */4 :
            bprint_int_fmt(buf, ign_flag, fmt$1[0], fmt$1[1], fmt$1[2]);
            _ign_flag = false;
            _fmt = fmt$1[3];
            continue ;
        case /* Int32 */5 :
            bprint_altint_fmt(buf, ign_flag, fmt$1[0], fmt$1[1], fmt$1[2], /* "l" */108);
            _ign_flag = false;
            _fmt = fmt$1[3];
            continue ;
        case /* Nativeint */6 :
            bprint_altint_fmt(buf, ign_flag, fmt$1[0], fmt$1[1], fmt$1[2], /* "n" */110);
            _ign_flag = false;
            _fmt = fmt$1[3];
            continue ;
        case /* Int64 */7 :
            bprint_altint_fmt(buf, ign_flag, fmt$1[0], fmt$1[1], fmt$1[2], /* "L" */76);
            _ign_flag = false;
            _fmt = fmt$1[3];
            continue ;
        case /* Float */8 :
            bprint_float_fmt(buf, ign_flag, fmt$1[0], fmt$1[1], fmt$1[2]);
            _ign_flag = false;
            _fmt = fmt$1[3];
            continue ;
        case /* Bool */9 :
            buffer_add_char(buf, /* "%" */37);
            bprint_ignored_flag(buf, ign_flag);
            bprint_padding(buf, fmt$1[0]);
            buffer_add_char(buf, /* "B" */66);
            _ign_flag = false;
            _fmt = fmt$1[1];
            continue ;
        case /* Flush */10 :
            buffer_add_string(buf, "%!");
            _fmt = fmt$1[0];
            continue ;
        case /* String_literal */11 :
            bprint_string_literal(buf, fmt$1[0]);
            _fmt = fmt$1[1];
            continue ;
        case /* Char_literal */12 :
            bprint_char_literal(buf, fmt$1[0]);
            _fmt = fmt$1[1];
            continue ;
        case /* Format_arg */13 :
            buffer_add_char(buf, /* "%" */37);
            bprint_ignored_flag(buf, ign_flag);
            bprint_pad_opt(buf, fmt$1[0]);
            buffer_add_char(buf, /* "{" */123);
            bprint_fmtty(buf, fmt$1[1]);
            buffer_add_char(buf, /* "%" */37);
            buffer_add_char(buf, /* "}" */125);
            _ign_flag = false;
            _fmt = fmt$1[2];
            continue ;
        case /* Format_subst */14 :
            buffer_add_char(buf, /* "%" */37);
            bprint_ignored_flag(buf, ign_flag);
            bprint_pad_opt(buf, fmt$1[0]);
            buffer_add_char(buf, /* "(" */40);
            bprint_fmtty(buf, fmt$1[1]);
            buffer_add_char(buf, /* "%" */37);
            buffer_add_char(buf, /* ")" */41);
            _ign_flag = false;
            _fmt = fmt$1[2];
            continue ;
        case /* Alpha */15 :
            buffer_add_char(buf, /* "%" */37);
            bprint_ignored_flag(buf, ign_flag);
            buffer_add_char(buf, /* "a" */97);
            _ign_flag = false;
            _fmt = fmt$1[0];
            continue ;
        case /* Theta */16 :
            buffer_add_char(buf, /* "%" */37);
            bprint_ignored_flag(buf, ign_flag);
            buffer_add_char(buf, /* "t" */116);
            _ign_flag = false;
            _fmt = fmt$1[0];
            continue ;
        case /* Formatting_lit */17 :
            bprint_string_literal(buf, string_of_formatting_lit(fmt$1[0]));
            _fmt = fmt$1[1];
            continue ;
        case /* Formatting_gen */18 :
            bprint_string_literal(buf, "@{");
            bprint_string_literal(buf, string_of_formatting_gen(fmt$1[0]));
            _fmt = fmt$1[1];
            continue ;
        case /* Reader */19 :
            buffer_add_char(buf, /* "%" */37);
            bprint_ignored_flag(buf, ign_flag);
            buffer_add_char(buf, /* "r" */114);
            _ign_flag = false;
            _fmt = fmt$1[0];
            continue ;
        case /* Scan_char_set */20 :
            buffer_add_char(buf, /* "%" */37);
            bprint_ignored_flag(buf, ign_flag);
            bprint_pad_opt(buf, fmt$1[0]);
            bprint_char_set(buf, fmt$1[1]);
            _ign_flag = false;
            _fmt = fmt$1[2];
            continue ;
        case /* Scan_get_counter */21 :
            buffer_add_char(buf, /* "%" */37);
            bprint_ignored_flag(buf, ign_flag);
            buffer_add_char(buf, char_of_counter(fmt$1[0]));
            _ign_flag = false;
            _fmt = fmt$1[1];
            continue ;
        case /* Scan_next_char */22 :
            buffer_add_char(buf, /* "%" */37);
            bprint_ignored_flag(buf, ign_flag);
            bprint_string_literal(buf, "0c");
            _ign_flag = false;
            _fmt = fmt$1[0];
            continue ;
        case /* Ignored_param */23 :
            var match = param_format_of_ignored_format(fmt$1[0], fmt$1[1]);
            _ign_flag = true;
            _fmt = match[0];
            continue ;
        case /* Custom */24 :
            for(var _i = 1 ,_i_finish = int_of_custom_arity(fmt$1[0]); _i <= _i_finish; ++_i){
              buffer_add_char(buf, /* "%" */37);
              bprint_ignored_flag(buf, ign_flag);
              buffer_add_char(buf, /* "?" */63);
            }
            _ign_flag = false;
            _fmt = fmt$1[2];
            continue ;
        
      }
    }
  };
}

function string_of_fmt(fmt) {
  var buf = {
    ind: 0,
    bytes: Caml_bytes.caml_create_bytes(16)
  };
  bprint_fmt(buf, fmt);
  return buffer_contents(buf);
}

function symm(param) {
  if (typeof param === "number") {
    return /* End_of_fmtty */0;
  } else {
    switch (param.tag | 0) {
      case /* Char_ty */0 :
          return /* Char_ty */Block.__(0, [symm(param[0])]);
      case /* String_ty */1 :
          return /* String_ty */Block.__(1, [symm(param[0])]);
      case /* Int_ty */2 :
          return /* Int_ty */Block.__(2, [symm(param[0])]);
      case /* Int32_ty */3 :
          return /* Int32_ty */Block.__(3, [symm(param[0])]);
      case /* Nativeint_ty */4 :
          return /* Nativeint_ty */Block.__(4, [symm(param[0])]);
      case /* Int64_ty */5 :
          return /* Int64_ty */Block.__(5, [symm(param[0])]);
      case /* Float_ty */6 :
          return /* Float_ty */Block.__(6, [symm(param[0])]);
      case /* Bool_ty */7 :
          return /* Bool_ty */Block.__(7, [symm(param[0])]);
      case /* Format_arg_ty */8 :
          return /* Format_arg_ty */Block.__(8, [
                    param[0],
                    symm(param[1])
                  ]);
      case /* Format_subst_ty */9 :
          return /* Format_subst_ty */Block.__(9, [
                    param[1],
                    param[0],
                    symm(param[2])
                  ]);
      case /* Alpha_ty */10 :
          return /* Alpha_ty */Block.__(10, [symm(param[0])]);
      case /* Theta_ty */11 :
          return /* Theta_ty */Block.__(11, [symm(param[0])]);
      case /* Any_ty */12 :
          return /* Any_ty */Block.__(12, [symm(param[0])]);
      case /* Reader_ty */13 :
          return /* Reader_ty */Block.__(13, [symm(param[0])]);
      case /* Ignored_reader_ty */14 :
          return /* Ignored_reader_ty */Block.__(14, [symm(param[0])]);
      
    }
  }
}

function fmtty_rel_det(param) {
  if (typeof param === "number") {
    return /* tuple */[
            (function (param) {
                return /* Refl */0;
              }),
            (function (param) {
                return /* Refl */0;
              }),
            (function (param) {
                return /* Refl */0;
              }),
            (function (param) {
                return /* Refl */0;
              })
          ];
  } else {
    switch (param.tag | 0) {
      case /* Char_ty */0 :
          var match = fmtty_rel_det(param[0]);
          var af = match[1];
          var fa = match[0];
          return /* tuple */[
                  (function (param) {
                      Curry._1(fa, /* Refl */0);
                      return /* Refl */0;
                    }),
                  (function (param) {
                      Curry._1(af, /* Refl */0);
                      return /* Refl */0;
                    }),
                  match[2],
                  match[3]
                ];
      case /* String_ty */1 :
          var match$1 = fmtty_rel_det(param[0]);
          var af$1 = match$1[1];
          var fa$1 = match$1[0];
          return /* tuple */[
                  (function (param) {
                      Curry._1(fa$1, /* Refl */0);
                      return /* Refl */0;
                    }),
                  (function (param) {
                      Curry._1(af$1, /* Refl */0);
                      return /* Refl */0;
                    }),
                  match$1[2],
                  match$1[3]
                ];
      case /* Int_ty */2 :
          var match$2 = fmtty_rel_det(param[0]);
          var af$2 = match$2[1];
          var fa$2 = match$2[0];
          return /* tuple */[
                  (function (param) {
                      Curry._1(fa$2, /* Refl */0);
                      return /* Refl */0;
                    }),
                  (function (param) {
                      Curry._1(af$2, /* Refl */0);
                      return /* Refl */0;
                    }),
                  match$2[2],
                  match$2[3]
                ];
      case /* Int32_ty */3 :
          var match$3 = fmtty_rel_det(param[0]);
          var af$3 = match$3[1];
          var fa$3 = match$3[0];
          return /* tuple */[
                  (function (param) {
                      Curry._1(fa$3, /* Refl */0);
                      return /* Refl */0;
                    }),
                  (function (param) {
                      Curry._1(af$3, /* Refl */0);
                      return /* Refl */0;
                    }),
                  match$3[2],
                  match$3[3]
                ];
      case /* Nativeint_ty */4 :
          var match$4 = fmtty_rel_det(param[0]);
          var af$4 = match$4[1];
          var fa$4 = match$4[0];
          return /* tuple */[
                  (function (param) {
                      Curry._1(fa$4, /* Refl */0);
                      return /* Refl */0;
                    }),
                  (function (param) {
                      Curry._1(af$4, /* Refl */0);
                      return /* Refl */0;
                    }),
                  match$4[2],
                  match$4[3]
                ];
      case /* Int64_ty */5 :
          var match$5 = fmtty_rel_det(param[0]);
          var af$5 = match$5[1];
          var fa$5 = match$5[0];
          return /* tuple */[
                  (function (param) {
                      Curry._1(fa$5, /* Refl */0);
                      return /* Refl */0;
                    }),
                  (function (param) {
                      Curry._1(af$5, /* Refl */0);
                      return /* Refl */0;
                    }),
                  match$5[2],
                  match$5[3]
                ];
      case /* Float_ty */6 :
          var match$6 = fmtty_rel_det(param[0]);
          var af$6 = match$6[1];
          var fa$6 = match$6[0];
          return /* tuple */[
                  (function (param) {
                      Curry._1(fa$6, /* Refl */0);
                      return /* Refl */0;
                    }),
                  (function (param) {
                      Curry._1(af$6, /* Refl */0);
                      return /* Refl */0;
                    }),
                  match$6[2],
                  match$6[3]
                ];
      case /* Bool_ty */7 :
          var match$7 = fmtty_rel_det(param[0]);
          var af$7 = match$7[1];
          var fa$7 = match$7[0];
          return /* tuple */[
                  (function (param) {
                      Curry._1(fa$7, /* Refl */0);
                      return /* Refl */0;
                    }),
                  (function (param) {
                      Curry._1(af$7, /* Refl */0);
                      return /* Refl */0;
                    }),
                  match$7[2],
                  match$7[3]
                ];
      case /* Format_arg_ty */8 :
          var match$8 = fmtty_rel_det(param[1]);
          var af$8 = match$8[1];
          var fa$8 = match$8[0];
          return /* tuple */[
                  (function (param) {
                      Curry._1(fa$8, /* Refl */0);
                      return /* Refl */0;
                    }),
                  (function (param) {
                      Curry._1(af$8, /* Refl */0);
                      return /* Refl */0;
                    }),
                  match$8[2],
                  match$8[3]
                ];
      case /* Format_subst_ty */9 :
          var match$9 = fmtty_rel_det(param[2]);
          var de = match$9[3];
          var ed = match$9[2];
          var af$9 = match$9[1];
          var fa$9 = match$9[0];
          var ty = trans(symm(param[0]), param[1]);
          var match$10 = fmtty_rel_det(ty);
          var jd = match$10[3];
          var dj = match$10[2];
          var ga = match$10[1];
          var ag = match$10[0];
          return /* tuple */[
                  (function (param) {
                      Curry._1(fa$9, /* Refl */0);
                      Curry._1(ag, /* Refl */0);
                      return /* Refl */0;
                    }),
                  (function (param) {
                      Curry._1(ga, /* Refl */0);
                      Curry._1(af$9, /* Refl */0);
                      return /* Refl */0;
                    }),
                  (function (param) {
                      Curry._1(ed, /* Refl */0);
                      Curry._1(dj, /* Refl */0);
                      return /* Refl */0;
                    }),
                  (function (param) {
                      Curry._1(jd, /* Refl */0);
                      Curry._1(de, /* Refl */0);
                      return /* Refl */0;
                    })
                ];
      case /* Alpha_ty */10 :
          var match$11 = fmtty_rel_det(param[0]);
          var af$10 = match$11[1];
          var fa$10 = match$11[0];
          return /* tuple */[
                  (function (param) {
                      Curry._1(fa$10, /* Refl */0);
                      return /* Refl */0;
                    }),
                  (function (param) {
                      Curry._1(af$10, /* Refl */0);
                      return /* Refl */0;
                    }),
                  match$11[2],
                  match$11[3]
                ];
      case /* Theta_ty */11 :
          var match$12 = fmtty_rel_det(param[0]);
          var af$11 = match$12[1];
          var fa$11 = match$12[0];
          return /* tuple */[
                  (function (param) {
                      Curry._1(fa$11, /* Refl */0);
                      return /* Refl */0;
                    }),
                  (function (param) {
                      Curry._1(af$11, /* Refl */0);
                      return /* Refl */0;
                    }),
                  match$12[2],
                  match$12[3]
                ];
      case /* Any_ty */12 :
          var match$13 = fmtty_rel_det(param[0]);
          var af$12 = match$13[1];
          var fa$12 = match$13[0];
          return /* tuple */[
                  (function (param) {
                      Curry._1(fa$12, /* Refl */0);
                      return /* Refl */0;
                    }),
                  (function (param) {
                      Curry._1(af$12, /* Refl */0);
                      return /* Refl */0;
                    }),
                  match$13[2],
                  match$13[3]
                ];
      case /* Reader_ty */13 :
          var match$14 = fmtty_rel_det(param[0]);
          var de$1 = match$14[3];
          var ed$1 = match$14[2];
          var af$13 = match$14[1];
          var fa$13 = match$14[0];
          return /* tuple */[
                  (function (param) {
                      Curry._1(fa$13, /* Refl */0);
                      return /* Refl */0;
                    }),
                  (function (param) {
                      Curry._1(af$13, /* Refl */0);
                      return /* Refl */0;
                    }),
                  (function (param) {
                      Curry._1(ed$1, /* Refl */0);
                      return /* Refl */0;
                    }),
                  (function (param) {
                      Curry._1(de$1, /* Refl */0);
                      return /* Refl */0;
                    })
                ];
      case /* Ignored_reader_ty */14 :
          var match$15 = fmtty_rel_det(param[0]);
          var de$2 = match$15[3];
          var ed$2 = match$15[2];
          var af$14 = match$15[1];
          var fa$14 = match$15[0];
          return /* tuple */[
                  (function (param) {
                      Curry._1(fa$14, /* Refl */0);
                      return /* Refl */0;
                    }),
                  (function (param) {
                      Curry._1(af$14, /* Refl */0);
                      return /* Refl */0;
                    }),
                  (function (param) {
                      Curry._1(ed$2, /* Refl */0);
                      return /* Refl */0;
                    }),
                  (function (param) {
                      Curry._1(de$2, /* Refl */0);
                      return /* Refl */0;
                    })
                ];
      
    }
  }
}

function trans(ty1, ty2) {
  var exit = 0;
  if (typeof ty1 === "number") {
    if (typeof ty2 === "number") {
      return /* End_of_fmtty */0;
    } else {
      switch (ty2.tag | 0) {
        case /* Format_arg_ty */8 :
            exit = 6;
            break;
        case /* Format_subst_ty */9 :
            exit = 7;
            break;
        case /* Alpha_ty */10 :
            exit = 1;
            break;
        case /* Theta_ty */11 :
            exit = 2;
            break;
        case /* Any_ty */12 :
            exit = 3;
            break;
        case /* Reader_ty */13 :
            exit = 4;
            break;
        case /* Ignored_reader_ty */14 :
            exit = 5;
            break;
        default:
          throw [
                Caml_builtin_exceptions.assert_failure,
                /* tuple */[
                  "camlinternalFormat.ml",
                  846,
                  23
                ]
              ];
      }
    }
  } else {
    switch (ty1.tag | 0) {
      case /* Char_ty */0 :
          if (typeof ty2 === "number") {
            exit = 8;
          } else {
            switch (ty2.tag | 0) {
              case /* Char_ty */0 :
                  return /* Char_ty */Block.__(0, [trans(ty1[0], ty2[0])]);
              case /* Format_arg_ty */8 :
                  exit = 6;
                  break;
              case /* Format_subst_ty */9 :
                  exit = 7;
                  break;
              case /* Alpha_ty */10 :
                  exit = 1;
                  break;
              case /* Theta_ty */11 :
                  exit = 2;
                  break;
              case /* Any_ty */12 :
                  exit = 3;
                  break;
              case /* Reader_ty */13 :
                  exit = 4;
                  break;
              case /* Ignored_reader_ty */14 :
                  exit = 5;
                  break;
              
            }
          }
          break;
      case /* String_ty */1 :
          if (typeof ty2 === "number") {
            exit = 8;
          } else {
            switch (ty2.tag | 0) {
              case /* String_ty */1 :
                  return /* String_ty */Block.__(1, [trans(ty1[0], ty2[0])]);
              case /* Format_arg_ty */8 :
                  exit = 6;
                  break;
              case /* Format_subst_ty */9 :
                  exit = 7;
                  break;
              case /* Alpha_ty */10 :
                  exit = 1;
                  break;
              case /* Theta_ty */11 :
                  exit = 2;
                  break;
              case /* Any_ty */12 :
                  exit = 3;
                  break;
              case /* Reader_ty */13 :
                  exit = 4;
                  break;
              case /* Ignored_reader_ty */14 :
                  exit = 5;
                  break;
              
            }
          }
          break;
      case /* Int_ty */2 :
          if (typeof ty2 === "number") {
            exit = 8;
          } else {
            switch (ty2.tag | 0) {
              case /* Int_ty */2 :
                  return /* Int_ty */Block.__(2, [trans(ty1[0], ty2[0])]);
              case /* Format_arg_ty */8 :
                  exit = 6;
                  break;
              case /* Format_subst_ty */9 :
                  exit = 7;
                  break;
              case /* Alpha_ty */10 :
                  exit = 1;
                  break;
              case /* Theta_ty */11 :
                  exit = 2;
                  break;
              case /* Any_ty */12 :
                  exit = 3;
                  break;
              case /* Reader_ty */13 :
                  exit = 4;
                  break;
              case /* Ignored_reader_ty */14 :
                  exit = 5;
                  break;
              
            }
          }
          break;
      case /* Int32_ty */3 :
          if (typeof ty2 === "number") {
            exit = 8;
          } else {
            switch (ty2.tag | 0) {
              case /* Int32_ty */3 :
                  return /* Int32_ty */Block.__(3, [trans(ty1[0], ty2[0])]);
              case /* Format_arg_ty */8 :
                  exit = 6;
                  break;
              case /* Format_subst_ty */9 :
                  exit = 7;
                  break;
              case /* Alpha_ty */10 :
                  exit = 1;
                  break;
              case /* Theta_ty */11 :
                  exit = 2;
                  break;
              case /* Any_ty */12 :
                  exit = 3;
                  break;
              case /* Reader_ty */13 :
                  exit = 4;
                  break;
              case /* Ignored_reader_ty */14 :
                  exit = 5;
                  break;
              
            }
          }
          break;
      case /* Nativeint_ty */4 :
          if (typeof ty2 === "number") {
            exit = 8;
          } else {
            switch (ty2.tag | 0) {
              case /* Nativeint_ty */4 :
                  return /* Nativeint_ty */Block.__(4, [trans(ty1[0], ty2[0])]);
              case /* Format_arg_ty */8 :
                  exit = 6;
                  break;
              case /* Format_subst_ty */9 :
                  exit = 7;
                  break;
              case /* Alpha_ty */10 :
                  exit = 1;
                  break;
              case /* Theta_ty */11 :
                  exit = 2;
                  break;
              case /* Any_ty */12 :
                  exit = 3;
                  break;
              case /* Reader_ty */13 :
                  exit = 4;
                  break;
              case /* Ignored_reader_ty */14 :
                  exit = 5;
                  break;
              
            }
          }
          break;
      case /* Int64_ty */5 :
          if (typeof ty2 === "number") {
            exit = 8;
          } else {
            switch (ty2.tag | 0) {
              case /* Int64_ty */5 :
                  return /* Int64_ty */Block.__(5, [trans(ty1[0], ty2[0])]);
              case /* Format_arg_ty */8 :
                  exit = 6;
                  break;
              case /* Format_subst_ty */9 :
                  exit = 7;
                  break;
              case /* Alpha_ty */10 :
                  exit = 1;
                  break;
              case /* Theta_ty */11 :
                  exit = 2;
                  break;
              case /* Any_ty */12 :
                  exit = 3;
                  break;
              case /* Reader_ty */13 :
                  exit = 4;
                  break;
              case /* Ignored_reader_ty */14 :
                  exit = 5;
                  break;
              
            }
          }
          break;
      case /* Float_ty */6 :
          if (typeof ty2 === "number") {
            exit = 8;
          } else {
            switch (ty2.tag | 0) {
              case /* Float_ty */6 :
                  return /* Float_ty */Block.__(6, [trans(ty1[0], ty2[0])]);
              case /* Format_arg_ty */8 :
                  exit = 6;
                  break;
              case /* Format_subst_ty */9 :
                  exit = 7;
                  break;
              case /* Alpha_ty */10 :
                  exit = 1;
                  break;
              case /* Theta_ty */11 :
                  exit = 2;
                  break;
              case /* Any_ty */12 :
                  exit = 3;
                  break;
              case /* Reader_ty */13 :
                  exit = 4;
                  break;
              case /* Ignored_reader_ty */14 :
                  exit = 5;
                  break;
              
            }
          }
          break;
      case /* Bool_ty */7 :
          if (typeof ty2 === "number") {
            exit = 8;
          } else {
            switch (ty2.tag | 0) {
              case /* Bool_ty */7 :
                  return /* Bool_ty */Block.__(7, [trans(ty1[0], ty2[0])]);
              case /* Format_arg_ty */8 :
                  exit = 6;
                  break;
              case /* Format_subst_ty */9 :
                  exit = 7;
                  break;
              case /* Alpha_ty */10 :
                  exit = 1;
                  break;
              case /* Theta_ty */11 :
                  exit = 2;
                  break;
              case /* Any_ty */12 :
                  exit = 3;
                  break;
              case /* Reader_ty */13 :
                  exit = 4;
                  break;
              case /* Ignored_reader_ty */14 :
                  exit = 5;
                  break;
              
            }
          }
          break;
      case /* Format_arg_ty */8 :
          if (typeof ty2 === "number") {
            throw [
                  Caml_builtin_exceptions.assert_failure,
                  /* tuple */[
                    "camlinternalFormat.ml",
                    832,
                    26
                  ]
                ];
          } else {
            switch (ty2.tag | 0) {
              case /* Format_arg_ty */8 :
                  return /* Format_arg_ty */Block.__(8, [
                            trans(ty1[0], ty2[0]),
                            trans(ty1[1], ty2[1])
                          ]);
              case /* Alpha_ty */10 :
                  exit = 1;
                  break;
              case /* Theta_ty */11 :
                  exit = 2;
                  break;
              case /* Any_ty */12 :
                  exit = 3;
                  break;
              case /* Reader_ty */13 :
                  exit = 4;
                  break;
              case /* Ignored_reader_ty */14 :
                  exit = 5;
                  break;
              default:
                throw [
                      Caml_builtin_exceptions.assert_failure,
                      /* tuple */[
                        "camlinternalFormat.ml",
                        832,
                        26
                      ]
                    ];
            }
          }
          break;
      case /* Format_subst_ty */9 :
          if (typeof ty2 === "number") {
            throw [
                  Caml_builtin_exceptions.assert_failure,
                  /* tuple */[
                    "camlinternalFormat.ml",
                    842,
                    28
                  ]
                ];
          } else {
            switch (ty2.tag | 0) {
              case /* Format_arg_ty */8 :
                  exit = 6;
                  break;
              case /* Format_subst_ty */9 :
                  var ty = trans(symm(ty1[1]), ty2[0]);
                  var match = fmtty_rel_det(ty);
                  Curry._1(match[1], /* Refl */0);
                  Curry._1(match[3], /* Refl */0);
                  return /* Format_subst_ty */Block.__(9, [
                            ty1[0],
                            ty2[1],
                            trans(ty1[2], ty2[2])
                          ]);
              case /* Alpha_ty */10 :
                  exit = 1;
                  break;
              case /* Theta_ty */11 :
                  exit = 2;
                  break;
              case /* Any_ty */12 :
                  exit = 3;
                  break;
              case /* Reader_ty */13 :
                  exit = 4;
                  break;
              case /* Ignored_reader_ty */14 :
                  exit = 5;
                  break;
              default:
                throw [
                      Caml_builtin_exceptions.assert_failure,
                      /* tuple */[
                        "camlinternalFormat.ml",
                        842,
                        28
                      ]
                    ];
            }
          }
          break;
      case /* Alpha_ty */10 :
          if (typeof ty2 === "number") {
            throw [
                  Caml_builtin_exceptions.assert_failure,
                  /* tuple */[
                    "camlinternalFormat.ml",
                    810,
                    21
                  ]
                ];
          } else if (ty2.tag === /* Alpha_ty */10) {
            return /* Alpha_ty */Block.__(10, [trans(ty1[0], ty2[0])]);
          } else {
            throw [
                  Caml_builtin_exceptions.assert_failure,
                  /* tuple */[
                    "camlinternalFormat.ml",
                    810,
                    21
                  ]
                ];
          }
      case /* Theta_ty */11 :
          if (typeof ty2 === "number") {
            throw [
                  Caml_builtin_exceptions.assert_failure,
                  /* tuple */[
                    "camlinternalFormat.ml",
                    814,
                    21
                  ]
                ];
          } else {
            switch (ty2.tag | 0) {
              case /* Alpha_ty */10 :
                  exit = 1;
                  break;
              case /* Theta_ty */11 :
                  return /* Theta_ty */Block.__(11, [trans(ty1[0], ty2[0])]);
              default:
                throw [
                      Caml_builtin_exceptions.assert_failure,
                      /* tuple */[
                        "camlinternalFormat.ml",
                        814,
                        21
                      ]
                    ];
            }
          }
          break;
      case /* Any_ty */12 :
          if (typeof ty2 === "number") {
            throw [
                  Caml_builtin_exceptions.assert_failure,
                  /* tuple */[
                    "camlinternalFormat.ml",
                    818,
                    19
                  ]
                ];
          } else {
            switch (ty2.tag | 0) {
              case /* Alpha_ty */10 :
                  exit = 1;
                  break;
              case /* Theta_ty */11 :
                  exit = 2;
                  break;
              case /* Any_ty */12 :
                  return /* Any_ty */Block.__(12, [trans(ty1[0], ty2[0])]);
              default:
                throw [
                      Caml_builtin_exceptions.assert_failure,
                      /* tuple */[
                        "camlinternalFormat.ml",
                        818,
                        19
                      ]
                    ];
            }
          }
          break;
      case /* Reader_ty */13 :
          if (typeof ty2 === "number") {
            throw [
                  Caml_builtin_exceptions.assert_failure,
                  /* tuple */[
                    "camlinternalFormat.ml",
                    822,
                    22
                  ]
                ];
          } else {
            switch (ty2.tag | 0) {
              case /* Alpha_ty */10 :
                  exit = 1;
                  break;
              case /* Theta_ty */11 :
                  exit = 2;
                  break;
              case /* Any_ty */12 :
                  exit = 3;
                  break;
              case /* Reader_ty */13 :
                  return /* Reader_ty */Block.__(13, [trans(ty1[0], ty2[0])]);
              default:
                throw [
                      Caml_builtin_exceptions.assert_failure,
                      /* tuple */[
                        "camlinternalFormat.ml",
                        822,
                        22
                      ]
                    ];
            }
          }
          break;
      case /* Ignored_reader_ty */14 :
          if (typeof ty2 === "number") {
            throw [
                  Caml_builtin_exceptions.assert_failure,
                  /* tuple */[
                    "camlinternalFormat.ml",
                    827,
                    30
                  ]
                ];
          } else {
            switch (ty2.tag | 0) {
              case /* Alpha_ty */10 :
                  exit = 1;
                  break;
              case /* Theta_ty */11 :
                  exit = 2;
                  break;
              case /* Any_ty */12 :
                  exit = 3;
                  break;
              case /* Reader_ty */13 :
                  exit = 4;
                  break;
              case /* Ignored_reader_ty */14 :
                  return /* Ignored_reader_ty */Block.__(14, [trans(ty1[0], ty2[0])]);
              default:
                throw [
                      Caml_builtin_exceptions.assert_failure,
                      /* tuple */[
                        "camlinternalFormat.ml",
                        827,
                        30
                      ]
                    ];
            }
          }
          break;
      
    }
  }
  switch (exit) {
    case 1 :
        throw [
              Caml_builtin_exceptions.assert_failure,
              /* tuple */[
                "camlinternalFormat.ml",
                811,
                21
              ]
            ];
    case 2 :
        throw [
              Caml_builtin_exceptions.assert_failure,
              /* tuple */[
                "camlinternalFormat.ml",
                815,
                21
              ]
            ];
    case 3 :
        throw [
              Caml_builtin_exceptions.assert_failure,
              /* tuple */[
                "camlinternalFormat.ml",
                819,
                19
              ]
            ];
    case 4 :
        throw [
              Caml_builtin_exceptions.assert_failure,
              /* tuple */[
                "camlinternalFormat.ml",
                823,
                22
              ]
            ];
    case 5 :
        throw [
              Caml_builtin_exceptions.assert_failure,
              /* tuple */[
                "camlinternalFormat.ml",
                828,
                30
              ]
            ];
    case 6 :
        throw [
              Caml_builtin_exceptions.assert_failure,
              /* tuple */[
                "camlinternalFormat.ml",
                833,
                26
              ]
            ];
    case 7 :
        throw [
              Caml_builtin_exceptions.assert_failure,
              /* tuple */[
                "camlinternalFormat.ml",
                843,
                28
              ]
            ];
    case 8 :
        throw [
              Caml_builtin_exceptions.assert_failure,
              /* tuple */[
                "camlinternalFormat.ml",
                847,
                23
              ]
            ];
    
  }
}

function fmtty_of_formatting_gen(formatting_gen) {
  return fmtty_of_fmt(formatting_gen[0][0]);
}

function fmtty_of_fmt(_fmtty) {
  while(true) {
    var fmtty = _fmtty;
    if (typeof fmtty === "number") {
      return /* End_of_fmtty */0;
    } else {
      switch (fmtty.tag | 0) {
        case /* String */2 :
        case /* Caml_string */3 :
            break;
        case /* Int */4 :
            var ty_rest = fmtty_of_fmt(fmtty[3]);
            var prec_ty = fmtty_of_precision_fmtty(fmtty[2], /* Int_ty */Block.__(2, [ty_rest]));
            return fmtty_of_padding_fmtty(fmtty[1], prec_ty);
        case /* Int32 */5 :
            var ty_rest$1 = fmtty_of_fmt(fmtty[3]);
            var prec_ty$1 = fmtty_of_precision_fmtty(fmtty[2], /* Int32_ty */Block.__(3, [ty_rest$1]));
            return fmtty_of_padding_fmtty(fmtty[1], prec_ty$1);
        case /* Nativeint */6 :
            var ty_rest$2 = fmtty_of_fmt(fmtty[3]);
            var prec_ty$2 = fmtty_of_precision_fmtty(fmtty[2], /* Nativeint_ty */Block.__(4, [ty_rest$2]));
            return fmtty_of_padding_fmtty(fmtty[1], prec_ty$2);
        case /* Int64 */7 :
            var ty_rest$3 = fmtty_of_fmt(fmtty[3]);
            var prec_ty$3 = fmtty_of_precision_fmtty(fmtty[2], /* Int64_ty */Block.__(5, [ty_rest$3]));
            return fmtty_of_padding_fmtty(fmtty[1], prec_ty$3);
        case /* Float */8 :
            var ty_rest$4 = fmtty_of_fmt(fmtty[3]);
            var prec_ty$4 = fmtty_of_precision_fmtty(fmtty[2], /* Float_ty */Block.__(6, [ty_rest$4]));
            return fmtty_of_padding_fmtty(fmtty[1], prec_ty$4);
        case /* Bool */9 :
            return fmtty_of_padding_fmtty(fmtty[0], /* Bool_ty */Block.__(7, [fmtty_of_fmt(fmtty[1])]));
        case /* Flush */10 :
            _fmtty = fmtty[0];
            continue ;
        case /* Format_arg */13 :
            return /* Format_arg_ty */Block.__(8, [
                      fmtty[1],
                      fmtty_of_fmt(fmtty[2])
                    ]);
        case /* Format_subst */14 :
            var ty = fmtty[1];
            return /* Format_subst_ty */Block.__(9, [
                      ty,
                      ty,
                      fmtty_of_fmt(fmtty[2])
                    ]);
        case /* Alpha */15 :
            return /* Alpha_ty */Block.__(10, [fmtty_of_fmt(fmtty[0])]);
        case /* Theta */16 :
            return /* Theta_ty */Block.__(11, [fmtty_of_fmt(fmtty[0])]);
        case /* String_literal */11 :
        case /* Char_literal */12 :
        case /* Formatting_lit */17 :
            _fmtty = fmtty[1];
            continue ;
        case /* Formatting_gen */18 :
            return CamlinternalFormatBasics.concat_fmtty(fmtty_of_formatting_gen(fmtty[0]), fmtty_of_fmt(fmtty[1]));
        case /* Reader */19 :
            return /* Reader_ty */Block.__(13, [fmtty_of_fmt(fmtty[0])]);
        case /* Scan_char_set */20 :
            return /* String_ty */Block.__(1, [fmtty_of_fmt(fmtty[2])]);
        case /* Scan_get_counter */21 :
            return /* Int_ty */Block.__(2, [fmtty_of_fmt(fmtty[1])]);
        case /* Ignored_param */23 :
            var ign = fmtty[0];
            var fmt = fmtty[1];
            if (typeof ign === "number") {
              if (ign === /* Ignored_reader */2) {
                return /* Ignored_reader_ty */Block.__(14, [fmtty_of_fmt(fmt)]);
              } else {
                return fmtty_of_fmt(fmt);
              }
            } else if (ign.tag === /* Ignored_format_subst */9) {
              return CamlinternalFormatBasics.concat_fmtty(ign[1], fmtty_of_fmt(fmt));
            } else {
              return fmtty_of_fmt(fmt);
            }
        case /* Custom */24 :
            return fmtty_of_custom(fmtty[0], fmtty_of_fmt(fmtty[2]));
        default:
          return /* Char_ty */Block.__(0, [fmtty_of_fmt(fmtty[0])]);
      }
    }
    return fmtty_of_padding_fmtty(fmtty[0], /* String_ty */Block.__(1, [fmtty_of_fmt(fmtty[1])]));
  };
}

function fmtty_of_custom(arity, fmtty) {
  if (arity) {
    return /* Any_ty */Block.__(12, [fmtty_of_custom(arity[0], fmtty)]);
  } else {
    return fmtty;
  }
}

function fmtty_of_padding_fmtty(pad, fmtty) {
  if (typeof pad === "number" || !pad.tag) {
    return fmtty;
  } else {
    return /* Int_ty */Block.__(2, [fmtty]);
  }
}

function fmtty_of_precision_fmtty(prec, fmtty) {
  if (typeof prec === "number" && prec !== 0) {
    return /* Int_ty */Block.__(2, [fmtty]);
  } else {
    return fmtty;
  }
}

var Type_mismatch = Caml_exceptions.create("CamlinternalFormat.Type_mismatch");

function type_padding(pad, fmtty) {
  if (typeof pad === "number") {
    return /* Padding_fmtty_EBB */[
            /* No_padding */0,
            fmtty
          ];
  } else if (pad.tag) {
    if (typeof fmtty === "number") {
      throw Type_mismatch;
    } else if (fmtty.tag === /* Int_ty */2) {
      return /* Padding_fmtty_EBB */[
              /* Arg_padding */Block.__(1, [pad[0]]),
              fmtty[0]
            ];
    } else {
      throw Type_mismatch;
    }
  } else {
    return /* Padding_fmtty_EBB */[
            /* Lit_padding */Block.__(0, [
                pad[0],
                pad[1]
              ]),
            fmtty
          ];
  }
}

function type_padprec(pad, prec, fmtty) {
  var match = type_padding(pad, fmtty);
  if (typeof prec === "number") {
    if (prec !== 0) {
      var match$1 = match[1];
      if (typeof match$1 === "number") {
        throw Type_mismatch;
      } else if (match$1.tag === /* Int_ty */2) {
        return /* Padprec_fmtty_EBB */[
                match[0],
                /* Arg_precision */1,
                match$1[0]
              ];
      } else {
        throw Type_mismatch;
      }
    } else {
      return /* Padprec_fmtty_EBB */[
              match[0],
              /* No_precision */0,
              match[1]
            ];
    }
  } else {
    return /* Padprec_fmtty_EBB */[
            match[0],
            /* Lit_precision */[prec[0]],
            match[1]
          ];
  }
}

function type_ignored_format_substitution(sub_fmtty, fmt, fmtty) {
  if (typeof sub_fmtty === "number") {
    return /* Fmtty_fmt_EBB */[
            /* End_of_fmtty */0,
            type_format_gen(fmt, fmtty)
          ];
  } else {
    switch (sub_fmtty.tag | 0) {
      case /* Char_ty */0 :
          if (typeof fmtty === "number") {
            throw Type_mismatch;
          } else if (fmtty.tag) {
            throw Type_mismatch;
          } else {
            var match = type_ignored_format_substitution(sub_fmtty[0], fmt, fmtty[0]);
            return /* Fmtty_fmt_EBB */[
                    /* Char_ty */Block.__(0, [match[0]]),
                    match[1]
                  ];
          }
      case /* String_ty */1 :
          if (typeof fmtty === "number") {
            throw Type_mismatch;
          } else if (fmtty.tag === /* String_ty */1) {
            var match$1 = type_ignored_format_substitution(sub_fmtty[0], fmt, fmtty[0]);
            return /* Fmtty_fmt_EBB */[
                    /* String_ty */Block.__(1, [match$1[0]]),
                    match$1[1]
                  ];
          } else {
            throw Type_mismatch;
          }
      case /* Int_ty */2 :
          if (typeof fmtty === "number") {
            throw Type_mismatch;
          } else if (fmtty.tag === /* Int_ty */2) {
            var match$2 = type_ignored_format_substitution(sub_fmtty[0], fmt, fmtty[0]);
            return /* Fmtty_fmt_EBB */[
                    /* Int_ty */Block.__(2, [match$2[0]]),
                    match$2[1]
                  ];
          } else {
            throw Type_mismatch;
          }
      case /* Int32_ty */3 :
          if (typeof fmtty === "number") {
            throw Type_mismatch;
          } else if (fmtty.tag === /* Int32_ty */3) {
            var match$3 = type_ignored_format_substitution(sub_fmtty[0], fmt, fmtty[0]);
            return /* Fmtty_fmt_EBB */[
                    /* Int32_ty */Block.__(3, [match$3[0]]),
                    match$3[1]
                  ];
          } else {
            throw Type_mismatch;
          }
      case /* Nativeint_ty */4 :
          if (typeof fmtty === "number") {
            throw Type_mismatch;
          } else if (fmtty.tag === /* Nativeint_ty */4) {
            var match$4 = type_ignored_format_substitution(sub_fmtty[0], fmt, fmtty[0]);
            return /* Fmtty_fmt_EBB */[
                    /* Nativeint_ty */Block.__(4, [match$4[0]]),
                    match$4[1]
                  ];
          } else {
            throw Type_mismatch;
          }
      case /* Int64_ty */5 :
          if (typeof fmtty === "number") {
            throw Type_mismatch;
          } else if (fmtty.tag === /* Int64_ty */5) {
            var match$5 = type_ignored_format_substitution(sub_fmtty[0], fmt, fmtty[0]);
            return /* Fmtty_fmt_EBB */[
                    /* Int64_ty */Block.__(5, [match$5[0]]),
                    match$5[1]
                  ];
          } else {
            throw Type_mismatch;
          }
      case /* Float_ty */6 :
          if (typeof fmtty === "number") {
            throw Type_mismatch;
          } else if (fmtty.tag === /* Float_ty */6) {
            var match$6 = type_ignored_format_substitution(sub_fmtty[0], fmt, fmtty[0]);
            return /* Fmtty_fmt_EBB */[
                    /* Float_ty */Block.__(6, [match$6[0]]),
                    match$6[1]
                  ];
          } else {
            throw Type_mismatch;
          }
      case /* Bool_ty */7 :
          if (typeof fmtty === "number") {
            throw Type_mismatch;
          } else if (fmtty.tag === /* Bool_ty */7) {
            var match$7 = type_ignored_format_substitution(sub_fmtty[0], fmt, fmtty[0]);
            return /* Fmtty_fmt_EBB */[
                    /* Bool_ty */Block.__(7, [match$7[0]]),
                    match$7[1]
                  ];
          } else {
            throw Type_mismatch;
          }
      case /* Format_arg_ty */8 :
          if (typeof fmtty === "number") {
            throw Type_mismatch;
          } else if (fmtty.tag === /* Format_arg_ty */8) {
            var sub2_fmtty$prime = fmtty[0];
            if (Caml_obj.caml_notequal(/* Fmtty_EBB */[sub_fmtty[0]], /* Fmtty_EBB */[sub2_fmtty$prime])) {
              throw Type_mismatch;
            }
            var match$8 = type_ignored_format_substitution(sub_fmtty[1], fmt, fmtty[1]);
            return /* Fmtty_fmt_EBB */[
                    /* Format_arg_ty */Block.__(8, [
                        sub2_fmtty$prime,
                        match$8[0]
                      ]),
                    match$8[1]
                  ];
          } else {
            throw Type_mismatch;
          }
      case /* Format_subst_ty */9 :
          if (typeof fmtty === "number") {
            throw Type_mismatch;
          } else if (fmtty.tag === /* Format_subst_ty */9) {
            var sub2_fmtty$prime$1 = fmtty[1];
            var sub1_fmtty$prime = fmtty[0];
            if (Caml_obj.caml_notequal(/* Fmtty_EBB */[CamlinternalFormatBasics.erase_rel(sub_fmtty[0])], /* Fmtty_EBB */[CamlinternalFormatBasics.erase_rel(sub1_fmtty$prime)])) {
              throw Type_mismatch;
            }
            if (Caml_obj.caml_notequal(/* Fmtty_EBB */[CamlinternalFormatBasics.erase_rel(sub_fmtty[1])], /* Fmtty_EBB */[CamlinternalFormatBasics.erase_rel(sub2_fmtty$prime$1)])) {
              throw Type_mismatch;
            }
            var sub_fmtty$prime = trans(symm(sub1_fmtty$prime), sub2_fmtty$prime$1);
            var match$9 = fmtty_rel_det(sub_fmtty$prime);
            Curry._1(match$9[1], /* Refl */0);
            Curry._1(match$9[3], /* Refl */0);
            var match$10 = type_ignored_format_substitution(CamlinternalFormatBasics.erase_rel(sub_fmtty[2]), fmt, fmtty[2]);
            return /* Fmtty_fmt_EBB */[
                    /* Format_subst_ty */Block.__(9, [
                        sub1_fmtty$prime,
                        sub2_fmtty$prime$1,
                        symm(match$10[0])
                      ]),
                    match$10[1]
                  ];
          } else {
            throw Type_mismatch;
          }
      case /* Alpha_ty */10 :
          if (typeof fmtty === "number") {
            throw Type_mismatch;
          } else if (fmtty.tag === /* Alpha_ty */10) {
            var match$11 = type_ignored_format_substitution(sub_fmtty[0], fmt, fmtty[0]);
            return /* Fmtty_fmt_EBB */[
                    /* Alpha_ty */Block.__(10, [match$11[0]]),
                    match$11[1]
                  ];
          } else {
            throw Type_mismatch;
          }
      case /* Theta_ty */11 :
          if (typeof fmtty === "number") {
            throw Type_mismatch;
          } else if (fmtty.tag === /* Theta_ty */11) {
            var match$12 = type_ignored_format_substitution(sub_fmtty[0], fmt, fmtty[0]);
            return /* Fmtty_fmt_EBB */[
                    /* Theta_ty */Block.__(11, [match$12[0]]),
                    match$12[1]
                  ];
          } else {
            throw Type_mismatch;
          }
      case /* Any_ty */12 :
          throw Type_mismatch;
      case /* Reader_ty */13 :
          if (typeof fmtty === "number") {
            throw Type_mismatch;
          } else if (fmtty.tag === /* Reader_ty */13) {
            var match$13 = type_ignored_format_substitution(sub_fmtty[0], fmt, fmtty[0]);
            return /* Fmtty_fmt_EBB */[
                    /* Reader_ty */Block.__(13, [match$13[0]]),
                    match$13[1]
                  ];
          } else {
            throw Type_mismatch;
          }
      case /* Ignored_reader_ty */14 :
          if (typeof fmtty === "number") {
            throw Type_mismatch;
          } else if (fmtty.tag === /* Ignored_reader_ty */14) {
            var match$14 = type_ignored_format_substitution(sub_fmtty[0], fmt, fmtty[0]);
            return /* Fmtty_fmt_EBB */[
                    /* Ignored_reader_ty */Block.__(14, [match$14[0]]),
                    match$14[1]
                  ];
          } else {
            throw Type_mismatch;
          }
      
    }
  }
}

function type_format_gen(fmt, fmtty) {
  if (typeof fmt === "number") {
    return /* Fmt_fmtty_EBB */[
            /* End_of_format */0,
            fmtty
          ];
  } else {
    switch (fmt.tag | 0) {
      case /* Char */0 :
          if (typeof fmtty === "number") {
            throw Type_mismatch;
          } else if (fmtty.tag) {
            throw Type_mismatch;
          } else {
            var match = type_format_gen(fmt[0], fmtty[0]);
            return /* Fmt_fmtty_EBB */[
                    /* Char */Block.__(0, [match[0]]),
                    match[1]
                  ];
          }
      case /* Caml_char */1 :
          if (typeof fmtty === "number") {
            throw Type_mismatch;
          } else if (fmtty.tag) {
            throw Type_mismatch;
          } else {
            var match$1 = type_format_gen(fmt[0], fmtty[0]);
            return /* Fmt_fmtty_EBB */[
                    /* Caml_char */Block.__(1, [match$1[0]]),
                    match$1[1]
                  ];
          }
      case /* String */2 :
          var match$2 = type_padding(fmt[0], fmtty);
          var match$3 = match$2[1];
          if (typeof match$3 === "number") {
            throw Type_mismatch;
          } else if (match$3.tag === /* String_ty */1) {
            var match$4 = type_format_gen(fmt[1], match$3[0]);
            return /* Fmt_fmtty_EBB */[
                    /* String */Block.__(2, [
                        match$2[0],
                        match$4[0]
                      ]),
                    match$4[1]
                  ];
          } else {
            throw Type_mismatch;
          }
      case /* Caml_string */3 :
          var match$5 = type_padding(fmt[0], fmtty);
          var match$6 = match$5[1];
          if (typeof match$6 === "number") {
            throw Type_mismatch;
          } else if (match$6.tag === /* String_ty */1) {
            var match$7 = type_format_gen(fmt[1], match$6[0]);
            return /* Fmt_fmtty_EBB */[
                    /* Caml_string */Block.__(3, [
                        match$5[0],
                        match$7[0]
                      ]),
                    match$7[1]
                  ];
          } else {
            throw Type_mismatch;
          }
      case /* Int */4 :
          var match$8 = type_padprec(fmt[1], fmt[2], fmtty);
          var match$9 = match$8[2];
          if (typeof match$9 === "number") {
            throw Type_mismatch;
          } else if (match$9.tag === /* Int_ty */2) {
            var match$10 = type_format_gen(fmt[3], match$9[0]);
            return /* Fmt_fmtty_EBB */[
                    /* Int */Block.__(4, [
                        fmt[0],
                        match$8[0],
                        match$8[1],
                        match$10[0]
                      ]),
                    match$10[1]
                  ];
          } else {
            throw Type_mismatch;
          }
      case /* Int32 */5 :
          var match$11 = type_padprec(fmt[1], fmt[2], fmtty);
          var match$12 = match$11[2];
          if (typeof match$12 === "number") {
            throw Type_mismatch;
          } else if (match$12.tag === /* Int32_ty */3) {
            var match$13 = type_format_gen(fmt[3], match$12[0]);
            return /* Fmt_fmtty_EBB */[
                    /* Int32 */Block.__(5, [
                        fmt[0],
                        match$11[0],
                        match$11[1],
                        match$13[0]
                      ]),
                    match$13[1]
                  ];
          } else {
            throw Type_mismatch;
          }
      case /* Nativeint */6 :
          var match$14 = type_padprec(fmt[1], fmt[2], fmtty);
          var match$15 = match$14[2];
          if (typeof match$15 === "number") {
            throw Type_mismatch;
          } else if (match$15.tag === /* Nativeint_ty */4) {
            var match$16 = type_format_gen(fmt[3], match$15[0]);
            return /* Fmt_fmtty_EBB */[
                    /* Nativeint */Block.__(6, [
                        fmt[0],
                        match$14[0],
                        match$14[1],
                        match$16[0]
                      ]),
                    match$16[1]
                  ];
          } else {
            throw Type_mismatch;
          }
      case /* Int64 */7 :
          var match$17 = type_padprec(fmt[1], fmt[2], fmtty);
          var match$18 = match$17[2];
          if (typeof match$18 === "number") {
            throw Type_mismatch;
          } else if (match$18.tag === /* Int64_ty */5) {
            var match$19 = type_format_gen(fmt[3], match$18[0]);
            return /* Fmt_fmtty_EBB */[
                    /* Int64 */Block.__(7, [
                        fmt[0],
                        match$17[0],
                        match$17[1],
                        match$19[0]
                      ]),
                    match$19[1]
                  ];
          } else {
            throw Type_mismatch;
          }
      case /* Float */8 :
          var match$20 = type_padprec(fmt[1], fmt[2], fmtty);
          var match$21 = match$20[2];
          if (typeof match$21 === "number") {
            throw Type_mismatch;
          } else if (match$21.tag === /* Float_ty */6) {
            var match$22 = type_format_gen(fmt[3], match$21[0]);
            return /* Fmt_fmtty_EBB */[
                    /* Float */Block.__(8, [
                        fmt[0],
                        match$20[0],
                        match$20[1],
                        match$22[0]
                      ]),
                    match$22[1]
                  ];
          } else {
            throw Type_mismatch;
          }
      case /* Bool */9 :
          var match$23 = type_padding(fmt[0], fmtty);
          var match$24 = match$23[1];
          if (typeof match$24 === "number") {
            throw Type_mismatch;
          } else if (match$24.tag === /* Bool_ty */7) {
            var match$25 = type_format_gen(fmt[1], match$24[0]);
            return /* Fmt_fmtty_EBB */[
                    /* Bool */Block.__(9, [
                        match$23[0],
                        match$25[0]
                      ]),
                    match$25[1]
                  ];
          } else {
            throw Type_mismatch;
          }
      case /* Flush */10 :
          var match$26 = type_format_gen(fmt[0], fmtty);
          return /* Fmt_fmtty_EBB */[
                  /* Flush */Block.__(10, [match$26[0]]),
                  match$26[1]
                ];
      case /* String_literal */11 :
          var match$27 = type_format_gen(fmt[1], fmtty);
          return /* Fmt_fmtty_EBB */[
                  /* String_literal */Block.__(11, [
                      fmt[0],
                      match$27[0]
                    ]),
                  match$27[1]
                ];
      case /* Char_literal */12 :
          var match$28 = type_format_gen(fmt[1], fmtty);
          return /* Fmt_fmtty_EBB */[
                  /* Char_literal */Block.__(12, [
                      fmt[0],
                      match$28[0]
                    ]),
                  match$28[1]
                ];
      case /* Format_arg */13 :
          if (typeof fmtty === "number") {
            throw Type_mismatch;
          } else if (fmtty.tag === /* Format_arg_ty */8) {
            var sub_fmtty$prime = fmtty[0];
            if (Caml_obj.caml_notequal(/* Fmtty_EBB */[fmt[1]], /* Fmtty_EBB */[sub_fmtty$prime])) {
              throw Type_mismatch;
            }
            var match$29 = type_format_gen(fmt[2], fmtty[1]);
            return /* Fmt_fmtty_EBB */[
                    /* Format_arg */Block.__(13, [
                        fmt[0],
                        sub_fmtty$prime,
                        match$29[0]
                      ]),
                    match$29[1]
                  ];
          } else {
            throw Type_mismatch;
          }
      case /* Format_subst */14 :
          if (typeof fmtty === "number") {
            throw Type_mismatch;
          } else if (fmtty.tag === /* Format_subst_ty */9) {
            var sub_fmtty1 = fmtty[0];
            if (Caml_obj.caml_notequal(/* Fmtty_EBB */[CamlinternalFormatBasics.erase_rel(fmt[1])], /* Fmtty_EBB */[CamlinternalFormatBasics.erase_rel(sub_fmtty1)])) {
              throw Type_mismatch;
            }
            var match$30 = type_format_gen(fmt[2], CamlinternalFormatBasics.erase_rel(fmtty[2]));
            return /* Fmt_fmtty_EBB */[
                    /* Format_subst */Block.__(14, [
                        fmt[0],
                        sub_fmtty1,
                        match$30[0]
                      ]),
                    match$30[1]
                  ];
          } else {
            throw Type_mismatch;
          }
      case /* Alpha */15 :
          if (typeof fmtty === "number") {
            throw Type_mismatch;
          } else if (fmtty.tag === /* Alpha_ty */10) {
            var match$31 = type_format_gen(fmt[0], fmtty[0]);
            return /* Fmt_fmtty_EBB */[
                    /* Alpha */Block.__(15, [match$31[0]]),
                    match$31[1]
                  ];
          } else {
            throw Type_mismatch;
          }
      case /* Theta */16 :
          if (typeof fmtty === "number") {
            throw Type_mismatch;
          } else if (fmtty.tag === /* Theta_ty */11) {
            var match$32 = type_format_gen(fmt[0], fmtty[0]);
            return /* Fmt_fmtty_EBB */[
                    /* Theta */Block.__(16, [match$32[0]]),
                    match$32[1]
                  ];
          } else {
            throw Type_mismatch;
          }
      case /* Formatting_lit */17 :
          var match$33 = type_format_gen(fmt[1], fmtty);
          return /* Fmt_fmtty_EBB */[
                  /* Formatting_lit */Block.__(17, [
                      fmt[0],
                      match$33[0]
                    ]),
                  match$33[1]
                ];
      case /* Formatting_gen */18 :
          var formatting_gen = fmt[0];
          var fmt0 = fmt[1];
          var fmtty0 = fmtty;
          if (formatting_gen.tag) {
            var match$34 = formatting_gen[0];
            var match$35 = type_format_gen(match$34[0], fmtty0);
            var match$36 = type_format_gen(fmt0, match$35[1]);
            return /* Fmt_fmtty_EBB */[
                    /* Formatting_gen */Block.__(18, [
                        /* Open_box */Block.__(1, [/* Format */[
                              match$35[0],
                              match$34[1]
                            ]]),
                        match$36[0]
                      ]),
                    match$36[1]
                  ];
          } else {
            var match$37 = formatting_gen[0];
            var match$38 = type_format_gen(match$37[0], fmtty0);
            var match$39 = type_format_gen(fmt0, match$38[1]);
            return /* Fmt_fmtty_EBB */[
                    /* Formatting_gen */Block.__(18, [
                        /* Open_tag */Block.__(0, [/* Format */[
                              match$38[0],
                              match$37[1]
                            ]]),
                        match$39[0]
                      ]),
                    match$39[1]
                  ];
          }
      case /* Reader */19 :
          if (typeof fmtty === "number") {
            throw Type_mismatch;
          } else if (fmtty.tag === /* Reader_ty */13) {
            var match$40 = type_format_gen(fmt[0], fmtty[0]);
            return /* Fmt_fmtty_EBB */[
                    /* Reader */Block.__(19, [match$40[0]]),
                    match$40[1]
                  ];
          } else {
            throw Type_mismatch;
          }
      case /* Scan_char_set */20 :
          if (typeof fmtty === "number") {
            throw Type_mismatch;
          } else if (fmtty.tag === /* String_ty */1) {
            var match$41 = type_format_gen(fmt[2], fmtty[0]);
            return /* Fmt_fmtty_EBB */[
                    /* Scan_char_set */Block.__(20, [
                        fmt[0],
                        fmt[1],
                        match$41[0]
                      ]),
                    match$41[1]
                  ];
          } else {
            throw Type_mismatch;
          }
      case /* Scan_get_counter */21 :
          if (typeof fmtty === "number") {
            throw Type_mismatch;
          } else if (fmtty.tag === /* Int_ty */2) {
            var match$42 = type_format_gen(fmt[1], fmtty[0]);
            return /* Fmt_fmtty_EBB */[
                    /* Scan_get_counter */Block.__(21, [
                        fmt[0],
                        match$42[0]
                      ]),
                    match$42[1]
                  ];
          } else {
            throw Type_mismatch;
          }
      case /* Ignored_param */23 :
          var ign = fmt[0];
          var fmt$1 = fmt[1];
          var fmtty$1 = fmtty;
          if (typeof ign === "number") {
            if (ign === /* Ignored_reader */2) {
              if (typeof fmtty$1 === "number") {
                throw Type_mismatch;
              } else if (fmtty$1.tag === /* Ignored_reader_ty */14) {
                var match$43 = type_format_gen(fmt$1, fmtty$1[0]);
                return /* Fmt_fmtty_EBB */[
                        /* Ignored_param */Block.__(23, [
                            /* Ignored_reader */2,
                            match$43[0]
                          ]),
                        match$43[1]
                      ];
              } else {
                throw Type_mismatch;
              }
            } else {
              return type_ignored_param_one(ign, fmt$1, fmtty$1);
            }
          } else {
            switch (ign.tag | 0) {
              case /* Ignored_format_arg */8 :
                  return type_ignored_param_one(/* Ignored_format_arg */Block.__(8, [
                                ign[0],
                                ign[1]
                              ]), fmt$1, fmtty$1);
              case /* Ignored_format_subst */9 :
                  var match$44 = type_ignored_format_substitution(ign[1], fmt$1, fmtty$1);
                  var match$45 = match$44[1];
                  return /* Fmt_fmtty_EBB */[
                          /* Ignored_param */Block.__(23, [
                              /* Ignored_format_subst */Block.__(9, [
                                  ign[0],
                                  match$44[0]
                                ]),
                              match$45[0]
                            ]),
                          match$45[1]
                        ];
              default:
                return type_ignored_param_one(ign, fmt$1, fmtty$1);
            }
          }
      case /* Scan_next_char */22 :
      case /* Custom */24 :
          throw Type_mismatch;
      
    }
  }
}

function type_ignored_param_one(ign, fmt, fmtty) {
  var match = type_format_gen(fmt, fmtty);
  return /* Fmt_fmtty_EBB */[
          /* Ignored_param */Block.__(23, [
              ign,
              match[0]
            ]),
          match[1]
        ];
}

function type_format(fmt, fmtty) {
  var match = type_format_gen(fmt, fmtty);
  if (typeof match[1] === "number") {
    return match[0];
  } else {
    throw Type_mismatch;
  }
}

function recast(fmt, fmtty) {
  return type_format(fmt, CamlinternalFormatBasics.erase_rel(symm(fmtty)));
}

function fix_padding(padty, width, str) {
  var len = str.length;
  var width$1 = Pervasives.abs(width);
  var padty$1 = width < 0 ? /* Left */0 : padty;
  if (width$1 <= len) {
    return str;
  } else {
    var res = Bytes.make(width$1, padty$1 === /* Zeros */2 ? /* "0" */48 : /* " " */32);
    switch (padty$1) {
      case /* Left */0 :
          $$String.blit(str, 0, res, 0, len);
          break;
      case /* Right */1 :
          $$String.blit(str, 0, res, width$1 - len | 0, len);
          break;
      case /* Zeros */2 :
          if (len > 0 && (Caml_string.get(str, 0) === /* "+" */43 || Caml_string.get(str, 0) === /* "-" */45 || Caml_string.get(str, 0) === /* " " */32)) {
            res[0] = Caml_string.get(str, 0);
            $$String.blit(str, 1, res, (width$1 - len | 0) + 1 | 0, len - 1 | 0);
          } else if (len > 1 && Caml_string.get(str, 0) === /* "0" */48 && (Caml_string.get(str, 1) === /* "x" */120 || Caml_string.get(str, 1) === /* "X" */88)) {
            res[1] = Caml_string.get(str, 1);
            $$String.blit(str, 2, res, (width$1 - len | 0) + 2 | 0, len - 2 | 0);
          } else {
            $$String.blit(str, 0, res, width$1 - len | 0, len);
          }
          break;
      
    }
    return Caml_bytes.bytes_to_string(res);
  }
}

function fix_int_precision(prec, str) {
  var prec$1 = Pervasives.abs(prec);
  var len = str.length;
  var c = Caml_string.get(str, 0);
  var exit = 0;
  if (c >= 58) {
    if (c >= 71) {
      if (c > 102 || c < 97) {
        return str;
      } else {
        exit = 2;
      }
    } else if (c >= 65) {
      exit = 2;
    } else {
      return str;
    }
  } else if (c !== 32) {
    if (c >= 43) {
      switch (c - 43 | 0) {
        case 0 :
        case 2 :
            exit = 1;
            break;
        case 1 :
        case 3 :
        case 4 :
            return str;
        case 5 :
            if ((prec$1 + 2 | 0) > len && len > 1 && (Caml_string.get(str, 1) === /* "x" */120 || Caml_string.get(str, 1) === /* "X" */88)) {
              var res = Bytes.make(prec$1 + 2 | 0, /* "0" */48);
              res[1] = Caml_string.get(str, 1);
              $$String.blit(str, 2, res, (prec$1 - len | 0) + 4 | 0, len - 2 | 0);
              return Caml_bytes.bytes_to_string(res);
            } else {
              exit = 2;
            }
            break;
        case 6 :
        case 7 :
        case 8 :
        case 9 :
        case 10 :
        case 11 :
        case 12 :
        case 13 :
        case 14 :
            exit = 2;
            break;
        
      }
    } else {
      return str;
    }
  } else {
    exit = 1;
  }
  switch (exit) {
    case 1 :
        if ((prec$1 + 1 | 0) > len) {
          var res$1 = Bytes.make(prec$1 + 1 | 0, /* "0" */48);
          res$1[0] = c;
          $$String.blit(str, 1, res$1, (prec$1 - len | 0) + 2 | 0, len - 1 | 0);
          return Caml_bytes.bytes_to_string(res$1);
        } else {
          return str;
        }
    case 2 :
        if (prec$1 > len) {
          var res$2 = Bytes.make(prec$1, /* "0" */48);
          $$String.blit(str, 0, res$2, prec$1 - len | 0, len);
          return Caml_bytes.bytes_to_string(res$2);
        } else {
          return str;
        }
    
  }
}

function string_to_caml_string(str) {
  var str$1 = $$String.escaped(str);
  var l = str$1.length;
  var res = Bytes.make(l + 2 | 0, /* "\"" */34);
  Caml_bytes.caml_blit_string(str$1, 0, res, 1, l);
  return Caml_bytes.bytes_to_string(res);
}

function format_of_iconv(param) {
  switch (param) {
    case /* Int_d */0 :
        return "%d";
    case /* Int_pd */1 :
        return "%+d";
    case /* Int_sd */2 :
        return "% d";
    case /* Int_i */3 :
        return "%i";
    case /* Int_pi */4 :
        return "%+i";
    case /* Int_si */5 :
        return "% i";
    case /* Int_x */6 :
        return "%x";
    case /* Int_Cx */7 :
        return "%#x";
    case /* Int_X */8 :
        return "%X";
    case /* Int_CX */9 :
        return "%#X";
    case /* Int_o */10 :
        return "%o";
    case /* Int_Co */11 :
        return "%#o";
    case /* Int_u */12 :
        return "%u";
    
  }
}

function format_of_iconvL(param) {
  switch (param) {
    case /* Int_d */0 :
        return "%Ld";
    case /* Int_pd */1 :
        return "%+Ld";
    case /* Int_sd */2 :
        return "% Ld";
    case /* Int_i */3 :
        return "%Li";
    case /* Int_pi */4 :
        return "%+Li";
    case /* Int_si */5 :
        return "% Li";
    case /* Int_x */6 :
        return "%Lx";
    case /* Int_Cx */7 :
        return "%#Lx";
    case /* Int_X */8 :
        return "%LX";
    case /* Int_CX */9 :
        return "%#LX";
    case /* Int_o */10 :
        return "%Lo";
    case /* Int_Co */11 :
        return "%#Lo";
    case /* Int_u */12 :
        return "%Lu";
    
  }
}

function format_of_iconvl(param) {
  switch (param) {
    case /* Int_d */0 :
        return "%ld";
    case /* Int_pd */1 :
        return "%+ld";
    case /* Int_sd */2 :
        return "% ld";
    case /* Int_i */3 :
        return "%li";
    case /* Int_pi */4 :
        return "%+li";
    case /* Int_si */5 :
        return "% li";
    case /* Int_x */6 :
        return "%lx";
    case /* Int_Cx */7 :
        return "%#lx";
    case /* Int_X */8 :
        return "%lX";
    case /* Int_CX */9 :
        return "%#lX";
    case /* Int_o */10 :
        return "%lo";
    case /* Int_Co */11 :
        return "%#lo";
    case /* Int_u */12 :
        return "%lu";
    
  }
}

function format_of_iconvn(param) {
  switch (param) {
    case /* Int_d */0 :
        return "%nd";
    case /* Int_pd */1 :
        return "%+nd";
    case /* Int_sd */2 :
        return "% nd";
    case /* Int_i */3 :
        return "%ni";
    case /* Int_pi */4 :
        return "%+ni";
    case /* Int_si */5 :
        return "% ni";
    case /* Int_x */6 :
        return "%nx";
    case /* Int_Cx */7 :
        return "%#nx";
    case /* Int_X */8 :
        return "%nX";
    case /* Int_CX */9 :
        return "%#nX";
    case /* Int_o */10 :
        return "%no";
    case /* Int_Co */11 :
        return "%#no";
    case /* Int_u */12 :
        return "%nu";
    
  }
}

function format_of_fconv(fconv, prec) {
  if (fconv === /* Float_F */15) {
    return "%.12g";
  } else {
    var prec$1 = Pervasives.abs(prec);
    var symb = char_of_fconv(fconv);
    var buf = {
      ind: 0,
      bytes: Caml_bytes.caml_create_bytes(16)
    };
    buffer_add_char(buf, /* "%" */37);
    bprint_fconv_flag(buf, fconv);
    buffer_add_char(buf, /* "." */46);
    buffer_add_string(buf, String(prec$1));
    buffer_add_char(buf, symb);
    return buffer_contents(buf);
  }
}

function convert_int(iconv, n) {
  return Caml_format.caml_format_int(format_of_iconv(iconv), n);
}

function convert_int32(iconv, n) {
  return Caml_format.caml_int32_format(format_of_iconvl(iconv), n);
}

function convert_nativeint(iconv, n) {
  return Caml_format.caml_nativeint_format(format_of_iconvn(iconv), n);
}

function convert_int64(iconv, n) {
  return Caml_format.caml_int64_format(format_of_iconvL(iconv), n);
}

function convert_float(fconv, prec, x) {
  if (fconv >= 16) {
    var sign;
    if (fconv >= 17) {
      switch (fconv - 17 | 0) {
        case /* Float_sf */2 :
            sign = /* "-" */45;
            break;
        case /* Float_f */0 :
        case /* Float_e */3 :
            sign = /* "+" */43;
            break;
        case /* Float_pf */1 :
        case /* Float_pe */4 :
            sign = /* " " */32;
            break;
        
      }
    } else {
      sign = /* "-" */45;
    }
    var str = Caml_format.caml_hexstring_of_float(x, prec, sign);
    if (fconv >= 19) {
      return Caml_bytes.bytes_to_string(Bytes.uppercase_ascii(Caml_bytes.bytes_of_string(str)));
    } else {
      return str;
    }
  } else {
    var str$1 = Caml_format.caml_format_float(format_of_fconv(fconv, prec), x);
    if (fconv !== /* Float_F */15) {
      return str$1;
    } else {
      var len = str$1.length;
      var is_valid = function (_i) {
        while(true) {
          var i = _i;
          if (i === len) {
            return false;
          } else {
            var match = Caml_string.get(str$1, i);
            var switcher = match - 46 | 0;
            if (switcher > 23 || switcher < 0) {
              if (switcher !== 55) {
                _i = i + 1 | 0;
                continue ;
              } else {
                return true;
              }
            } else if (switcher > 22 || switcher < 1) {
              return true;
            } else {
              _i = i + 1 | 0;
              continue ;
            }
          }
        };
      };
      var match = Pervasives.classify_float(x);
      if (match !== 3) {
        if (match >= 4) {
          return "nan";
        } else if (is_valid(0)) {
          return str$1;
        } else {
          return str$1 + ".";
        }
      } else if (x < 0.0) {
        return "neg_infinity";
      } else {
        return "infinity";
      }
    }
  }
}

function format_caml_char(c) {
  var str = Char.escaped(c);
  var l = str.length;
  var res = Bytes.make(l + 2 | 0, /* "'" */39);
  Caml_bytes.caml_blit_string(str, 0, res, 1, l);
  return Caml_bytes.bytes_to_string(res);
}

function string_of_fmtty(fmtty) {
  var buf = {
    ind: 0,
    bytes: Caml_bytes.caml_create_bytes(16)
  };
  bprint_fmtty(buf, fmtty);
  return buffer_contents(buf);
}

function make_printf(_k, o, _acc, _fmt) {
  while(true) {
    var fmt = _fmt;
    var acc = _acc;
    var k = _k;
    if (typeof fmt === "number") {
      return Curry._2(k, o, acc);
    } else {
      switch (fmt.tag | 0) {
        case /* Char */0 :
            var rest = fmt[0];
            return (function(k,acc,rest){
            return function (c) {
              var new_acc = /* Acc_data_char */Block.__(5, [
                  acc,
                  c
                ]);
              return make_printf(k, o, new_acc, rest);
            }
            }(k,acc,rest));
        case /* Caml_char */1 :
            var rest$1 = fmt[0];
            return (function(k,acc,rest$1){
            return function (c) {
              var new_acc_001 = format_caml_char(c);
              var new_acc = /* Acc_data_string */Block.__(4, [
                  acc,
                  new_acc_001
                ]);
              return make_printf(k, o, new_acc, rest$1);
            }
            }(k,acc,rest$1));
        case /* String */2 :
            return make_padding(k, o, acc, fmt[1], fmt[0], (function (str) {
                          return str;
                        }));
        case /* Caml_string */3 :
            return make_padding(k, o, acc, fmt[1], fmt[0], string_to_caml_string);
        case /* Int */4 :
            return make_int_padding_precision(k, o, acc, fmt[3], fmt[1], fmt[2], convert_int, fmt[0]);
        case /* Int32 */5 :
            return make_int_padding_precision(k, o, acc, fmt[3], fmt[1], fmt[2], convert_int32, fmt[0]);
        case /* Nativeint */6 :
            return make_int_padding_precision(k, o, acc, fmt[3], fmt[1], fmt[2], convert_nativeint, fmt[0]);
        case /* Int64 */7 :
            return make_int_padding_precision(k, o, acc, fmt[3], fmt[1], fmt[2], convert_int64, fmt[0]);
        case /* Float */8 :
            var k$1 = k;
            var o$1 = o;
            var acc$1 = acc;
            var fmt$1 = fmt[3];
            var pad = fmt[1];
            var prec = fmt[2];
            var fconv = fmt[0];
            if (typeof pad === "number") {
              if (typeof prec === "number") {
                if (prec !== 0) {
                  return (function(k$1,o$1,acc$1,fmt$1,fconv){
                  return function (p, x) {
                    var str = convert_float(fconv, p, x);
                    return make_printf(k$1, o$1, /* Acc_data_string */Block.__(4, [
                                  acc$1,
                                  str
                                ]), fmt$1);
                  }
                  }(k$1,o$1,acc$1,fmt$1,fconv));
                } else {
                  return (function(k$1,o$1,acc$1,fmt$1,fconv){
                  return function (x) {
                    var str = convert_float(fconv, -6, x);
                    return make_printf(k$1, o$1, /* Acc_data_string */Block.__(4, [
                                  acc$1,
                                  str
                                ]), fmt$1);
                  }
                  }(k$1,o$1,acc$1,fmt$1,fconv));
                }
              } else {
                var p = prec[0];
                return (function(k$1,o$1,acc$1,fmt$1,fconv,p){
                return function (x) {
                  var str = convert_float(fconv, p, x);
                  return make_printf(k$1, o$1, /* Acc_data_string */Block.__(4, [
                                acc$1,
                                str
                              ]), fmt$1);
                }
                }(k$1,o$1,acc$1,fmt$1,fconv,p));
              }
            } else if (pad.tag) {
              var padty = pad[0];
              if (typeof prec === "number") {
                if (prec !== 0) {
                  return (function(k$1,o$1,acc$1,fmt$1,fconv,padty){
                  return function (w, p, x) {
                    var str = fix_padding(padty, w, convert_float(fconv, p, x));
                    return make_printf(k$1, o$1, /* Acc_data_string */Block.__(4, [
                                  acc$1,
                                  str
                                ]), fmt$1);
                  }
                  }(k$1,o$1,acc$1,fmt$1,fconv,padty));
                } else {
                  return (function(k$1,o$1,acc$1,fmt$1,fconv,padty){
                  return function (w, x) {
                    var str = convert_float(fconv, -6, x);
                    var str$prime = fix_padding(padty, w, str);
                    return make_printf(k$1, o$1, /* Acc_data_string */Block.__(4, [
                                  acc$1,
                                  str$prime
                                ]), fmt$1);
                  }
                  }(k$1,o$1,acc$1,fmt$1,fconv,padty));
                }
              } else {
                var p$1 = prec[0];
                return (function(k$1,o$1,acc$1,fmt$1,fconv,padty,p$1){
                return function (w, x) {
                  var str = fix_padding(padty, w, convert_float(fconv, p$1, x));
                  return make_printf(k$1, o$1, /* Acc_data_string */Block.__(4, [
                                acc$1,
                                str
                              ]), fmt$1);
                }
                }(k$1,o$1,acc$1,fmt$1,fconv,padty,p$1));
              }
            } else {
              var w = pad[1];
              var padty$1 = pad[0];
              if (typeof prec === "number") {
                if (prec !== 0) {
                  return (function(k$1,o$1,acc$1,fmt$1,fconv,padty$1,w){
                  return function (p, x) {
                    var str = fix_padding(padty$1, w, convert_float(fconv, p, x));
                    return make_printf(k$1, o$1, /* Acc_data_string */Block.__(4, [
                                  acc$1,
                                  str
                                ]), fmt$1);
                  }
                  }(k$1,o$1,acc$1,fmt$1,fconv,padty$1,w));
                } else {
                  return (function(k$1,o$1,acc$1,fmt$1,fconv,padty$1,w){
                  return function (x) {
                    var str = convert_float(fconv, -6, x);
                    var str$prime = fix_padding(padty$1, w, str);
                    return make_printf(k$1, o$1, /* Acc_data_string */Block.__(4, [
                                  acc$1,
                                  str$prime
                                ]), fmt$1);
                  }
                  }(k$1,o$1,acc$1,fmt$1,fconv,padty$1,w));
                }
              } else {
                var p$2 = prec[0];
                return (function(k$1,o$1,acc$1,fmt$1,fconv,padty$1,w,p$2){
                return function (x) {
                  var str = fix_padding(padty$1, w, convert_float(fconv, p$2, x));
                  return make_printf(k$1, o$1, /* Acc_data_string */Block.__(4, [
                                acc$1,
                                str
                              ]), fmt$1);
                }
                }(k$1,o$1,acc$1,fmt$1,fconv,padty$1,w,p$2));
              }
            }
        case /* Bool */9 :
            return make_padding(k, o, acc, fmt[1], fmt[0], Pervasives.string_of_bool);
        case /* Flush */10 :
            _fmt = fmt[0];
            _acc = /* Acc_flush */Block.__(7, [acc]);
            continue ;
        case /* String_literal */11 :
            _fmt = fmt[1];
            _acc = /* Acc_string_literal */Block.__(2, [
                acc,
                fmt[0]
              ]);
            continue ;
        case /* Char_literal */12 :
            _fmt = fmt[1];
            _acc = /* Acc_char_literal */Block.__(3, [
                acc,
                fmt[0]
              ]);
            continue ;
        case /* Format_arg */13 :
            var rest$2 = fmt[2];
            var ty = string_of_fmtty(fmt[1]);
            return (function(k,acc,rest$2,ty){
            return function (str) {
              return make_printf(k, o, /* Acc_data_string */Block.__(4, [
                            acc,
                            ty
                          ]), rest$2);
            }
            }(k,acc,rest$2,ty));
        case /* Format_subst */14 :
            var rest$3 = fmt[2];
            var fmtty = fmt[1];
            return (function(k,acc,fmtty,rest$3){
            return function (param) {
              return make_printf(k, o, acc, CamlinternalFormatBasics.concat_fmt(recast(param[0], fmtty), rest$3));
            }
            }(k,acc,fmtty,rest$3));
        case /* Alpha */15 :
            var rest$4 = fmt[0];
            return (function(k,acc,rest$4){
            return function (f, x) {
              return make_printf(k, o, /* Acc_delay */Block.__(6, [
                            acc,
                            (function (o) {
                                return Curry._2(f, o, x);
                              })
                          ]), rest$4);
            }
            }(k,acc,rest$4));
        case /* Theta */16 :
            var rest$5 = fmt[0];
            return (function(k,acc,rest$5){
            return function (f) {
              return make_printf(k, o, /* Acc_delay */Block.__(6, [
                            acc,
                            f
                          ]), rest$5);
            }
            }(k,acc,rest$5));
        case /* Formatting_lit */17 :
            _fmt = fmt[1];
            _acc = /* Acc_formatting_lit */Block.__(0, [
                acc,
                fmt[0]
              ]);
            continue ;
        case /* Formatting_gen */18 :
            var match = fmt[0];
            if (match.tag) {
              var rest$6 = fmt[1];
              var k$prime = (function(k,acc,rest$6){
              return function k$prime(koc, kacc) {
                return make_printf(k, koc, /* Acc_formatting_gen */Block.__(1, [
                              acc,
                              /* Acc_open_box */Block.__(1, [kacc])
                            ]), rest$6);
              }
              }(k,acc,rest$6));
              _fmt = match[0][0];
              _acc = /* End_of_acc */0;
              _k = k$prime;
              continue ;
            } else {
              var rest$7 = fmt[1];
              var k$prime$1 = (function(k,acc,rest$7){
              return function k$prime$1(koc, kacc) {
                return make_printf(k, koc, /* Acc_formatting_gen */Block.__(1, [
                              acc,
                              /* Acc_open_tag */Block.__(0, [kacc])
                            ]), rest$7);
              }
              }(k,acc,rest$7));
              _fmt = match[0][0];
              _acc = /* End_of_acc */0;
              _k = k$prime$1;
              continue ;
            }
        case /* Reader */19 :
            throw [
                  Caml_builtin_exceptions.assert_failure,
                  /* tuple */[
                    "camlinternalFormat.ml",
                    1525,
                    4
                  ]
                ];
        case /* Scan_char_set */20 :
            var rest$8 = fmt[2];
            var new_acc = /* Acc_invalid_arg */Block.__(8, [
                acc,
                "Printf: bad conversion %["
              ]);
            return (function(k,rest$8,new_acc){
            return function (param) {
              return make_printf(k, o, new_acc, rest$8);
            }
            }(k,rest$8,new_acc));
        case /* Scan_get_counter */21 :
            var rest$9 = fmt[1];
            return (function(k,acc,rest$9){
            return function (n) {
              var new_acc_001 = Caml_format.caml_format_int("%u", n);
              var new_acc = /* Acc_data_string */Block.__(4, [
                  acc,
                  new_acc_001
                ]);
              return make_printf(k, o, new_acc, rest$9);
            }
            }(k,acc,rest$9));
        case /* Scan_next_char */22 :
            var rest$10 = fmt[0];
            return (function(k,acc,rest$10){
            return function (c) {
              var new_acc = /* Acc_data_char */Block.__(5, [
                  acc,
                  c
                ]);
              return make_printf(k, o, new_acc, rest$10);
            }
            }(k,acc,rest$10));
        case /* Ignored_param */23 :
            return make_ignored_param(k, o, acc, fmt[0], fmt[1]);
        case /* Custom */24 :
            return make_custom(k, o, acc, fmt[2], fmt[0], Curry._1(fmt[1], /* () */0));
        
      }
    }
  };
}

function make_ignored_param(k, o, acc, ign, fmt) {
  if (typeof ign === "number") {
    if (ign === /* Ignored_reader */2) {
      throw [
            Caml_builtin_exceptions.assert_failure,
            /* tuple */[
              "camlinternalFormat.ml",
              1593,
              39
            ]
          ];
    } else {
      return make_invalid_arg(k, o, acc, fmt);
    }
  } else if (ign.tag === /* Ignored_format_subst */9) {
    return make_from_fmtty(k, o, acc, ign[1], fmt);
  } else {
    return make_invalid_arg(k, o, acc, fmt);
  }
}

function make_from_fmtty(k, o, acc, fmtty, fmt) {
  if (typeof fmtty === "number") {
    return make_invalid_arg(k, o, acc, fmt);
  } else {
    switch (fmtty.tag | 0) {
      case /* Char_ty */0 :
          var rest = fmtty[0];
          return (function (param) {
              return make_from_fmtty(k, o, acc, rest, fmt);
            });
      case /* String_ty */1 :
          var rest$1 = fmtty[0];
          return (function (param) {
              return make_from_fmtty(k, o, acc, rest$1, fmt);
            });
      case /* Int_ty */2 :
          var rest$2 = fmtty[0];
          return (function (param) {
              return make_from_fmtty(k, o, acc, rest$2, fmt);
            });
      case /* Int32_ty */3 :
          var rest$3 = fmtty[0];
          return (function (param) {
              return make_from_fmtty(k, o, acc, rest$3, fmt);
            });
      case /* Nativeint_ty */4 :
          var rest$4 = fmtty[0];
          return (function (param) {
              return make_from_fmtty(k, o, acc, rest$4, fmt);
            });
      case /* Int64_ty */5 :
          var rest$5 = fmtty[0];
          return (function (param) {
              return make_from_fmtty(k, o, acc, rest$5, fmt);
            });
      case /* Float_ty */6 :
          var rest$6 = fmtty[0];
          return (function (param) {
              return make_from_fmtty(k, o, acc, rest$6, fmt);
            });
      case /* Bool_ty */7 :
          var rest$7 = fmtty[0];
          return (function (param) {
              return make_from_fmtty(k, o, acc, rest$7, fmt);
            });
      case /* Format_arg_ty */8 :
          var rest$8 = fmtty[1];
          return (function (param) {
              return make_from_fmtty(k, o, acc, rest$8, fmt);
            });
      case /* Format_subst_ty */9 :
          var rest$9 = fmtty[2];
          var ty = trans(symm(fmtty[0]), fmtty[1]);
          return (function (param) {
              return make_from_fmtty(k, o, acc, CamlinternalFormatBasics.concat_fmtty(ty, rest$9), fmt);
            });
      case /* Alpha_ty */10 :
          var rest$10 = fmtty[0];
          return (function (param, param$1) {
              return make_from_fmtty(k, o, acc, rest$10, fmt);
            });
      case /* Theta_ty */11 :
          var rest$11 = fmtty[0];
          return (function (param) {
              return make_from_fmtty(k, o, acc, rest$11, fmt);
            });
      case /* Any_ty */12 :
          var rest$12 = fmtty[0];
          return (function (param) {
              return make_from_fmtty(k, o, acc, rest$12, fmt);
            });
      case /* Reader_ty */13 :
          throw [
                Caml_builtin_exceptions.assert_failure,
                /* tuple */[
                  "camlinternalFormat.ml",
                  1616,
                  31
                ]
              ];
      case /* Ignored_reader_ty */14 :
          throw [
                Caml_builtin_exceptions.assert_failure,
                /* tuple */[
                  "camlinternalFormat.ml",
                  1617,
                  31
                ]
              ];
      
    }
  }
}

function make_invalid_arg(k, o, acc, fmt) {
  return make_printf(k, o, /* Acc_invalid_arg */Block.__(8, [
                acc,
                "Printf: bad conversion %_"
              ]), fmt);
}

function make_padding(k, o, acc, fmt, pad, trans) {
  if (typeof pad === "number") {
    return (function (x) {
        var new_acc_001 = Curry._1(trans, x);
        var new_acc = /* Acc_data_string */Block.__(4, [
            acc,
            new_acc_001
          ]);
        return make_printf(k, o, new_acc, fmt);
      });
  } else if (pad.tag) {
    var padty = pad[0];
    return (function (w, x) {
        var new_acc_001 = fix_padding(padty, w, Curry._1(trans, x));
        var new_acc = /* Acc_data_string */Block.__(4, [
            acc,
            new_acc_001
          ]);
        return make_printf(k, o, new_acc, fmt);
      });
  } else {
    var width = pad[1];
    var padty$1 = pad[0];
    return (function (x) {
        var new_acc_001 = fix_padding(padty$1, width, Curry._1(trans, x));
        var new_acc = /* Acc_data_string */Block.__(4, [
            acc,
            new_acc_001
          ]);
        return make_printf(k, o, new_acc, fmt);
      });
  }
}

function make_int_padding_precision(k, o, acc, fmt, pad, prec, trans, iconv) {
  if (typeof pad === "number") {
    if (typeof prec === "number") {
      if (prec !== 0) {
        return (function (p, x) {
            var str = fix_int_precision(p, Curry._2(trans, iconv, x));
            return make_printf(k, o, /* Acc_data_string */Block.__(4, [
                          acc,
                          str
                        ]), fmt);
          });
      } else {
        return (function (x) {
            var str = Curry._2(trans, iconv, x);
            return make_printf(k, o, /* Acc_data_string */Block.__(4, [
                          acc,
                          str
                        ]), fmt);
          });
      }
    } else {
      var p = prec[0];
      return (function (x) {
          var str = fix_int_precision(p, Curry._2(trans, iconv, x));
          return make_printf(k, o, /* Acc_data_string */Block.__(4, [
                        acc,
                        str
                      ]), fmt);
        });
    }
  } else if (pad.tag) {
    var padty = pad[0];
    if (typeof prec === "number") {
      if (prec !== 0) {
        return (function (w, p, x) {
            var str = fix_padding(padty, w, fix_int_precision(p, Curry._2(trans, iconv, x)));
            return make_printf(k, o, /* Acc_data_string */Block.__(4, [
                          acc,
                          str
                        ]), fmt);
          });
      } else {
        return (function (w, x) {
            var str = fix_padding(padty, w, Curry._2(trans, iconv, x));
            return make_printf(k, o, /* Acc_data_string */Block.__(4, [
                          acc,
                          str
                        ]), fmt);
          });
      }
    } else {
      var p$1 = prec[0];
      return (function (w, x) {
          var str = fix_padding(padty, w, fix_int_precision(p$1, Curry._2(trans, iconv, x)));
          return make_printf(k, o, /* Acc_data_string */Block.__(4, [
                        acc,
                        str
                      ]), fmt);
        });
    }
  } else {
    var w = pad[1];
    var padty$1 = pad[0];
    if (typeof prec === "number") {
      if (prec !== 0) {
        return (function (p, x) {
            var str = fix_padding(padty$1, w, fix_int_precision(p, Curry._2(trans, iconv, x)));
            return make_printf(k, o, /* Acc_data_string */Block.__(4, [
                          acc,
                          str
                        ]), fmt);
          });
      } else {
        return (function (x) {
            var str = fix_padding(padty$1, w, Curry._2(trans, iconv, x));
            return make_printf(k, o, /* Acc_data_string */Block.__(4, [
                          acc,
                          str
                        ]), fmt);
          });
      }
    } else {
      var p$2 = prec[0];
      return (function (x) {
          var str = fix_padding(padty$1, w, fix_int_precision(p$2, Curry._2(trans, iconv, x)));
          return make_printf(k, o, /* Acc_data_string */Block.__(4, [
                        acc,
                        str
                      ]), fmt);
        });
    }
  }
}

function make_custom(k, o, acc, rest, arity, f) {
  if (arity) {
    var arity$1 = arity[0];
    return (function (x) {
        return make_custom(k, o, acc, rest, arity$1, Curry._1(f, x));
      });
  } else {
    return make_printf(k, o, /* Acc_data_string */Block.__(4, [
                  acc,
                  f
                ]), rest);
  }
}

function make_iprintf(_k, o, _fmt) {
  while(true) {
    var fmt = _fmt;
    var k = _k;
    var exit = 0;
    if (typeof fmt === "number") {
      return Curry._1(k, o);
    } else {
      switch (fmt.tag | 0) {
        case /* String */2 :
            var tmp = fmt[0];
            if (typeof tmp !== "number" && tmp.tag) {
              var partial_arg = make_iprintf(k, o, fmt[1]);
              var partial_arg$1 = (function(partial_arg){
              return function partial_arg$1(param) {
                return partial_arg;
              }
              }(partial_arg));
              return (function (param) {
                  return partial_arg$1;
                });
            }
            var partial_arg$2 = make_iprintf(k, o, fmt[1]);
            return (function(partial_arg$2){
            return function (param) {
              return partial_arg$2;
            }
            }(partial_arg$2));
        case /* Caml_string */3 :
            var tmp$1 = fmt[0];
            if (typeof tmp$1 !== "number" && tmp$1.tag) {
              var partial_arg$3 = make_iprintf(k, o, fmt[1]);
              var partial_arg$4 = (function(partial_arg$3){
              return function partial_arg$4(param) {
                return partial_arg$3;
              }
              }(partial_arg$3));
              return (function (param) {
                  return partial_arg$4;
                });
            }
            var partial_arg$5 = make_iprintf(k, o, fmt[1]);
            return (function(partial_arg$5){
            return function (param) {
              return partial_arg$5;
            }
            }(partial_arg$5));
        case /* Bool */9 :
            var tmp$2 = fmt[0];
            if (typeof tmp$2 !== "number" && tmp$2.tag) {
              var partial_arg$6 = make_iprintf(k, o, fmt[1]);
              var partial_arg$7 = (function(partial_arg$6){
              return function partial_arg$7(param) {
                return partial_arg$6;
              }
              }(partial_arg$6));
              return (function (param) {
                  return partial_arg$7;
                });
            }
            var partial_arg$8 = make_iprintf(k, o, fmt[1]);
            return (function(partial_arg$8){
            return function (param) {
              return partial_arg$8;
            }
            }(partial_arg$8));
        case /* Flush */10 :
            _fmt = fmt[0];
            continue ;
        case /* Format_subst */14 :
            var rest = fmt[2];
            var fmtty = fmt[1];
            return (function(k,fmtty,rest){
            return function (param) {
              return make_iprintf(k, o, CamlinternalFormatBasics.concat_fmt(recast(param[0], fmtty), rest));
            }
            }(k,fmtty,rest));
        case /* Alpha */15 :
            var partial_arg$9 = make_iprintf(k, o, fmt[0]);
            var partial_arg$10 = (function(partial_arg$9){
            return function partial_arg$10(param) {
              return partial_arg$9;
            }
            }(partial_arg$9));
            return (function (param) {
                return partial_arg$10;
              });
        case /* String_literal */11 :
        case /* Char_literal */12 :
        case /* Formatting_lit */17 :
            exit = 2;
            break;
        case /* Formatting_gen */18 :
            var match = fmt[0];
            if (match.tag) {
              var rest$1 = fmt[1];
              _fmt = match[0][0];
              _k = (function(k,rest$1){
              return function (koc) {
                return make_iprintf(k, koc, rest$1);
              }
              }(k,rest$1));
              continue ;
            } else {
              var rest$2 = fmt[1];
              _fmt = match[0][0];
              _k = (function(k,rest$2){
              return function (koc) {
                return make_iprintf(k, koc, rest$2);
              }
              }(k,rest$2));
              continue ;
            }
        case /* Reader */19 :
            throw [
                  Caml_builtin_exceptions.assert_failure,
                  /* tuple */[
                    "camlinternalFormat.ml",
                    1797,
                    8
                  ]
                ];
        case /* Format_arg */13 :
        case /* Scan_char_set */20 :
            exit = 3;
            break;
        case /* Scan_get_counter */21 :
            var partial_arg$11 = make_iprintf(k, o, fmt[1]);
            return (function(partial_arg$11){
            return function (param) {
              return partial_arg$11;
            }
            }(partial_arg$11));
        case /* Char */0 :
        case /* Caml_char */1 :
        case /* Theta */16 :
        case /* Scan_next_char */22 :
            exit = 1;
            break;
        case /* Ignored_param */23 :
            return make_ignored_param((function(k){
                      return function (x, param) {
                        return Curry._1(k, x);
                      }
                      }(k)), o, /* End_of_acc */0, fmt[0], fmt[1]);
        case /* Custom */24 :
            return fn_of_custom_arity(k, o, fmt[2], fmt[0]);
        default:
          var k$1 = k;
          var o$1 = o;
          var fmt$1 = fmt[3];
          var pad = fmt[1];
          var prec = fmt[2];
          if (typeof pad === "number") {
            if (typeof prec === "number") {
              if (prec !== 0) {
                var partial_arg$12 = make_iprintf(k$1, o$1, fmt$1);
                var partial_arg$13 = (function(partial_arg$12){
                return function partial_arg$13(param) {
                  return partial_arg$12;
                }
                }(partial_arg$12));
                return (function (param) {
                    return partial_arg$13;
                  });
              } else {
                var partial_arg$14 = make_iprintf(k$1, o$1, fmt$1);
                return (function(partial_arg$14){
                return function (param) {
                  return partial_arg$14;
                }
                }(partial_arg$14));
              }
            } else {
              var partial_arg$15 = make_iprintf(k$1, o$1, fmt$1);
              return (function(partial_arg$15){
              return function (param) {
                return partial_arg$15;
              }
              }(partial_arg$15));
            }
          } else if (pad.tag) {
            if (typeof prec === "number") {
              if (prec !== 0) {
                var partial_arg$16 = make_iprintf(k$1, o$1, fmt$1);
                var partial_arg$17 = (function(partial_arg$16){
                return function partial_arg$17(param) {
                  return partial_arg$16;
                }
                }(partial_arg$16));
                var partial_arg$18 = function (param) {
                  return partial_arg$17;
                };
                return (function (param) {
                    return partial_arg$18;
                  });
              } else {
                var partial_arg$19 = make_iprintf(k$1, o$1, fmt$1);
                var partial_arg$20 = (function(partial_arg$19){
                return function partial_arg$20(param) {
                  return partial_arg$19;
                }
                }(partial_arg$19));
                return (function (param) {
                    return partial_arg$20;
                  });
              }
            } else {
              var partial_arg$21 = make_iprintf(k$1, o$1, fmt$1);
              var partial_arg$22 = (function(partial_arg$21){
              return function partial_arg$22(param) {
                return partial_arg$21;
              }
              }(partial_arg$21));
              return (function (param) {
                  return partial_arg$22;
                });
            }
          } else if (typeof prec === "number") {
            if (prec !== 0) {
              var partial_arg$23 = make_iprintf(k$1, o$1, fmt$1);
              var partial_arg$24 = (function(partial_arg$23){
              return function partial_arg$24(param) {
                return partial_arg$23;
              }
              }(partial_arg$23));
              return (function (param) {
                  return partial_arg$24;
                });
            } else {
              var partial_arg$25 = make_iprintf(k$1, o$1, fmt$1);
              return (function(partial_arg$25){
              return function (param) {
                return partial_arg$25;
              }
              }(partial_arg$25));
            }
          } else {
            var partial_arg$26 = make_iprintf(k$1, o$1, fmt$1);
            return (function(partial_arg$26){
            return function (param) {
              return partial_arg$26;
            }
            }(partial_arg$26));
          }
      }
    }
    switch (exit) {
      case 1 :
          var partial_arg$27 = make_iprintf(k, o, fmt[0]);
          return (function(partial_arg$27){
          return function (param) {
            return partial_arg$27;
          }
          }(partial_arg$27));
      case 2 :
          _fmt = fmt[1];
          continue ;
      case 3 :
          var partial_arg$28 = make_iprintf(k, o, fmt[2]);
          return (function(partial_arg$28){
          return function (param) {
            return partial_arg$28;
          }
          }(partial_arg$28));
      
    }
  };
}

function fn_of_custom_arity(k, o, fmt, param) {
  if (param) {
    var partial_arg = fn_of_custom_arity(k, o, fmt, param[0]);
    return (function (param) {
        return partial_arg;
      });
  } else {
    return make_iprintf(k, o, fmt);
  }
}

function output_acc(o, _acc) {
  while(true) {
    var acc = _acc;
    var exit = 0;
    if (typeof acc === "number") {
      return /* () */0;
    } else {
      switch (acc.tag | 0) {
        case /* Acc_formatting_lit */0 :
            var s = string_of_formatting_lit(acc[1]);
            output_acc(o, acc[0]);
            return Pervasives.output_string(o, s);
        case /* Acc_formatting_gen */1 :
            var match = acc[1];
            var p = acc[0];
            output_acc(o, p);
            if (match.tag) {
              Pervasives.output_string(o, "@[");
              _acc = match[0];
              continue ;
            } else {
              Pervasives.output_string(o, "@{");
              _acc = match[0];
              continue ;
            }
        case /* Acc_string_literal */2 :
        case /* Acc_data_string */4 :
            exit = 1;
            break;
        case /* Acc_char_literal */3 :
        case /* Acc_data_char */5 :
            exit = 2;
            break;
        case /* Acc_delay */6 :
            output_acc(o, acc[0]);
            return Curry._1(acc[1], o);
        case /* Acc_flush */7 :
            output_acc(o, acc[0]);
            return Caml_io.caml_ml_flush(o);
        case /* Acc_invalid_arg */8 :
            output_acc(o, acc[0]);
            throw [
                  Caml_builtin_exceptions.invalid_argument,
                  acc[1]
                ];
        
      }
    }
    switch (exit) {
      case 1 :
          output_acc(o, acc[0]);
          return Pervasives.output_string(o, acc[1]);
      case 2 :
          output_acc(o, acc[0]);
          return Caml_io.caml_ml_output_char(o, acc[1]);
      
    }
  };
}

function bufput_acc(b, _acc) {
  while(true) {
    var acc = _acc;
    var exit = 0;
    if (typeof acc === "number") {
      return /* () */0;
    } else {
      switch (acc.tag | 0) {
        case /* Acc_formatting_lit */0 :
            var s = string_of_formatting_lit(acc[1]);
            bufput_acc(b, acc[0]);
            return $$Buffer.add_string(b, s);
        case /* Acc_formatting_gen */1 :
            var match = acc[1];
            var p = acc[0];
            bufput_acc(b, p);
            if (match.tag) {
              $$Buffer.add_string(b, "@[");
              _acc = match[0];
              continue ;
            } else {
              $$Buffer.add_string(b, "@{");
              _acc = match[0];
              continue ;
            }
        case /* Acc_string_literal */2 :
        case /* Acc_data_string */4 :
            exit = 1;
            break;
        case /* Acc_char_literal */3 :
        case /* Acc_data_char */5 :
            exit = 2;
            break;
        case /* Acc_delay */6 :
            bufput_acc(b, acc[0]);
            return Curry._1(acc[1], b);
        case /* Acc_flush */7 :
            _acc = acc[0];
            continue ;
        case /* Acc_invalid_arg */8 :
            bufput_acc(b, acc[0]);
            throw [
                  Caml_builtin_exceptions.invalid_argument,
                  acc[1]
                ];
        
      }
    }
    switch (exit) {
      case 1 :
          bufput_acc(b, acc[0]);
          return $$Buffer.add_string(b, acc[1]);
      case 2 :
          bufput_acc(b, acc[0]);
          return $$Buffer.add_char(b, acc[1]);
      
    }
  };
}

function strput_acc(b, _acc) {
  while(true) {
    var acc = _acc;
    var exit = 0;
    if (typeof acc === "number") {
      return /* () */0;
    } else {
      switch (acc.tag | 0) {
        case /* Acc_formatting_lit */0 :
            var s = string_of_formatting_lit(acc[1]);
            strput_acc(b, acc[0]);
            return $$Buffer.add_string(b, s);
        case /* Acc_formatting_gen */1 :
            var match = acc[1];
            var p = acc[0];
            strput_acc(b, p);
            if (match.tag) {
              $$Buffer.add_string(b, "@[");
              _acc = match[0];
              continue ;
            } else {
              $$Buffer.add_string(b, "@{");
              _acc = match[0];
              continue ;
            }
        case /* Acc_string_literal */2 :
        case /* Acc_data_string */4 :
            exit = 1;
            break;
        case /* Acc_char_literal */3 :
        case /* Acc_data_char */5 :
            exit = 2;
            break;
        case /* Acc_delay */6 :
            strput_acc(b, acc[0]);
            return $$Buffer.add_string(b, Curry._1(acc[1], /* () */0));
        case /* Acc_flush */7 :
            _acc = acc[0];
            continue ;
        case /* Acc_invalid_arg */8 :
            strput_acc(b, acc[0]);
            throw [
                  Caml_builtin_exceptions.invalid_argument,
                  acc[1]
                ];
        
      }
    }
    switch (exit) {
      case 1 :
          strput_acc(b, acc[0]);
          return $$Buffer.add_string(b, acc[1]);
      case 2 :
          strput_acc(b, acc[0]);
          return $$Buffer.add_char(b, acc[1]);
      
    }
  };
}

function failwith_message(param) {
  var buf = $$Buffer.create(256);
  var k = function (param, acc) {
    strput_acc(buf, acc);
    var s = $$Buffer.contents(buf);
    throw [
          Caml_builtin_exceptions.failure,
          s
        ];
  };
  return make_printf(k, /* () */0, /* End_of_acc */0, param[0]);
}

function open_box_of_string(str) {
  if (str === "") {
    return /* tuple */[
            0,
            /* Pp_box */4
          ];
  } else {
    var len = str.length;
    var invalid_box = function (param) {
      return Curry._1(failwith_message(/* Format */[
                      /* String_literal */Block.__(11, [
                          "invalid box description ",
                          /* Caml_string */Block.__(3, [
                              /* No_padding */0,
                              /* End_of_format */0
                            ])
                        ]),
                      "invalid box description %S"
                    ]), str);
    };
    var parse_spaces = function (_i) {
      while(true) {
        var i = _i;
        if (i === len) {
          return i;
        } else {
          var match = Caml_string.get(str, i);
          if (match !== 9) {
            if (match !== 32) {
              return i;
            } else {
              _i = i + 1 | 0;
              continue ;
            }
          } else {
            _i = i + 1 | 0;
            continue ;
          }
        }
      };
    };
    var parse_lword = function (i, _j) {
      while(true) {
        var j = _j;
        if (j === len) {
          return j;
        } else {
          var match = Caml_string.get(str, j);
          if (match > 122 || match < 97) {
            return j;
          } else {
            _j = j + 1 | 0;
            continue ;
          }
        }
      };
    };
    var parse_int = function (i, _j) {
      while(true) {
        var j = _j;
        if (j === len) {
          return j;
        } else {
          var match = Caml_string.get(str, j);
          if (match >= 48) {
            if (match >= 58) {
              return j;
            } else {
              _j = j + 1 | 0;
              continue ;
            }
          } else if (match !== 45) {
            return j;
          } else {
            _j = j + 1 | 0;
            continue ;
          }
        }
      };
    };
    var wstart = parse_spaces(0);
    var wend = parse_lword(wstart, wstart);
    var box_name = $$String.sub(str, wstart, wend - wstart | 0);
    var nstart = parse_spaces(wend);
    var nend = parse_int(nstart, nstart);
    var indent;
    if (nstart === nend) {
      indent = 0;
    } else {
      try {
        indent = Caml_format.caml_int_of_string($$String.sub(str, nstart, nend - nstart | 0));
      }
      catch (raw_exn){
        var exn = Caml_js_exceptions.internalToOCamlException(raw_exn);
        if (exn[0] === Caml_builtin_exceptions.failure) {
          indent = invalid_box(/* () */0);
        } else {
          throw exn;
        }
      }
    }
    var exp_end = parse_spaces(nend);
    if (exp_end !== len) {
      invalid_box(/* () */0);
    }
    var box_type;
    switch (box_name) {
      case "" :
      case "b" :
          box_type = /* Pp_box */4;
          break;
      case "h" :
          box_type = /* Pp_hbox */0;
          break;
      case "hov" :
          box_type = /* Pp_hovbox */3;
          break;
      case "hv" :
          box_type = /* Pp_hvbox */2;
          break;
      case "v" :
          box_type = /* Pp_vbox */1;
          break;
      default:
        box_type = invalid_box(/* () */0);
    }
    return /* tuple */[
            indent,
            box_type
          ];
  }
}

function make_padding_fmt_ebb(pad, fmt) {
  if (typeof pad === "number") {
    return /* Padding_fmt_EBB */[
            /* No_padding */0,
            fmt
          ];
  } else if (pad.tag) {
    return /* Padding_fmt_EBB */[
            /* Arg_padding */Block.__(1, [pad[0]]),
            fmt
          ];
  } else {
    return /* Padding_fmt_EBB */[
            /* Lit_padding */Block.__(0, [
                pad[0],
                pad[1]
              ]),
            fmt
          ];
  }
}

function make_precision_fmt_ebb(prec, fmt) {
  if (typeof prec === "number") {
    if (prec !== 0) {
      return /* Precision_fmt_EBB */[
              /* Arg_precision */1,
              fmt
            ];
    } else {
      return /* Precision_fmt_EBB */[
              /* No_precision */0,
              fmt
            ];
    }
  } else {
    return /* Precision_fmt_EBB */[
            /* Lit_precision */[prec[0]],
            fmt
          ];
  }
}

function make_padprec_fmt_ebb(pad, prec, fmt) {
  var match = make_precision_fmt_ebb(prec, fmt);
  var fmt$prime = match[1];
  var prec$1 = match[0];
  if (typeof pad === "number") {
    return /* Padprec_fmt_EBB */[
            /* No_padding */0,
            prec$1,
            fmt$prime
          ];
  } else if (pad.tag) {
    return /* Padprec_fmt_EBB */[
            /* Arg_padding */Block.__(1, [pad[0]]),
            prec$1,
            fmt$prime
          ];
  } else {
    return /* Padprec_fmt_EBB */[
            /* Lit_padding */Block.__(0, [
                pad[0],
                pad[1]
              ]),
            prec$1,
            fmt$prime
          ];
  }
}

function fmt_ebb_of_string(legacy_behavior, str) {
  var legacy_behavior$1 = legacy_behavior !== undefined ? legacy_behavior : true;
  var invalid_format_message = function (str_ind, msg) {
    return Curry._3(failwith_message(/* Format */[
                    /* String_literal */Block.__(11, [
                        "invalid format ",
                        /* Caml_string */Block.__(3, [
                            /* No_padding */0,
                            /* String_literal */Block.__(11, [
                                ": at character number ",
                                /* Int */Block.__(4, [
                                    /* Int_d */0,
                                    /* No_padding */0,
                                    /* No_precision */0,
                                    /* String_literal */Block.__(11, [
                                        ", ",
                                        /* String */Block.__(2, [
                                            /* No_padding */0,
                                            /* End_of_format */0
                                          ])
                                      ])
                                  ])
                              ])
                          ])
                      ]),
                    "invalid format %S: at character number %d, %s"
                  ]), str, str_ind, msg);
  };
  var invalid_format_without = function (str_ind, c, s) {
    return Curry._4(failwith_message(/* Format */[
                    /* String_literal */Block.__(11, [
                        "invalid format ",
                        /* Caml_string */Block.__(3, [
                            /* No_padding */0,
                            /* String_literal */Block.__(11, [
                                ": at character number ",
                                /* Int */Block.__(4, [
                                    /* Int_d */0,
                                    /* No_padding */0,
                                    /* No_precision */0,
                                    /* String_literal */Block.__(11, [
                                        ", '",
                                        /* Char */Block.__(0, [/* String_literal */Block.__(11, [
                                                "' without ",
                                                /* String */Block.__(2, [
                                                    /* No_padding */0,
                                                    /* End_of_format */0
                                                  ])
                                              ])])
                                      ])
                                  ])
                              ])
                          ])
                      ]),
                    "invalid format %S: at character number %d, '%c' without %s"
                  ]), str, str_ind, c, s);
  };
  var expected_character = function (str_ind, expected, read) {
    return Curry._4(failwith_message(/* Format */[
                    /* String_literal */Block.__(11, [
                        "invalid format ",
                        /* Caml_string */Block.__(3, [
                            /* No_padding */0,
                            /* String_literal */Block.__(11, [
                                ": at character number ",
                                /* Int */Block.__(4, [
                                    /* Int_d */0,
                                    /* No_padding */0,
                                    /* No_precision */0,
                                    /* String_literal */Block.__(11, [
                                        ", ",
                                        /* String */Block.__(2, [
                                            /* No_padding */0,
                                            /* String_literal */Block.__(11, [
                                                " expected, read ",
                                                /* Caml_char */Block.__(1, [/* End_of_format */0])
                                              ])
                                          ])
                                      ])
                                  ])
                              ])
                          ])
                      ]),
                    "invalid format %S: at character number %d, %s expected, read %C"
                  ]), str, str_ind, expected, read);
  };
  var parse_after_at = function (str_ind, end_ind) {
    if (str_ind === end_ind) {
      return /* Fmt_EBB */[/* Char_literal */Block.__(12, [
                  /* "@" */64,
                  /* End_of_format */0
                ])];
    } else {
      var c = Caml_string.get(str, str_ind);
      if (c >= 65) {
        if (c >= 94) {
          switch (c) {
            case 123 :
                return parse_tag(true, str_ind + 1 | 0, end_ind);
            case 124 :
                break;
            case 125 :
                var beg_ind = str_ind + 1 | 0;
                var match = parse_literal(beg_ind, beg_ind, end_ind);
                return /* Fmt_EBB */[/* Formatting_lit */Block.__(17, [
                            /* Close_tag */1,
                            match[0]
                          ])];
            default:
              
          }
        } else if (c >= 91) {
          switch (c - 91 | 0) {
            case 0 :
                return parse_tag(false, str_ind + 1 | 0, end_ind);
            case 1 :
                break;
            case 2 :
                var beg_ind$1 = str_ind + 1 | 0;
                var match$1 = parse_literal(beg_ind$1, beg_ind$1, end_ind);
                return /* Fmt_EBB */[/* Formatting_lit */Block.__(17, [
                            /* Close_box */0,
                            match$1[0]
                          ])];
            
          }
        }
        
      } else if (c !== 10) {
        if (c >= 32) {
          switch (c - 32 | 0) {
            case 0 :
                var beg_ind$2 = str_ind + 1 | 0;
                var match$2 = parse_literal(beg_ind$2, beg_ind$2, end_ind);
                return /* Fmt_EBB */[/* Formatting_lit */Block.__(17, [
                            /* Break */Block.__(0, [
                                "@ ",
                                1,
                                0
                              ]),
                            match$2[0]
                          ])];
            case 5 :
                if ((str_ind + 1 | 0) < end_ind && Caml_string.get(str, str_ind + 1 | 0) === /* "%" */37) {
                  var beg_ind$3 = str_ind + 2 | 0;
                  var match$3 = parse_literal(beg_ind$3, beg_ind$3, end_ind);
                  return /* Fmt_EBB */[/* Formatting_lit */Block.__(17, [
                              /* Escaped_percent */6,
                              match$3[0]
                            ])];
                } else {
                  var match$4 = parse_literal(str_ind, str_ind, end_ind);
                  return /* Fmt_EBB */[/* Char_literal */Block.__(12, [
                              /* "@" */64,
                              match$4[0]
                            ])];
                }
            case 12 :
                var beg_ind$4 = str_ind + 1 | 0;
                var match$5 = parse_literal(beg_ind$4, beg_ind$4, end_ind);
                return /* Fmt_EBB */[/* Formatting_lit */Block.__(17, [
                            /* Break */Block.__(0, [
                                "@,",
                                0,
                                0
                              ]),
                            match$5[0]
                          ])];
            case 14 :
                var beg_ind$5 = str_ind + 1 | 0;
                var match$6 = parse_literal(beg_ind$5, beg_ind$5, end_ind);
                return /* Fmt_EBB */[/* Formatting_lit */Block.__(17, [
                            /* Flush_newline */4,
                            match$6[0]
                          ])];
            case 27 :
                var str_ind$1 = str_ind + 1 | 0;
                var end_ind$1 = end_ind;
                var match$7;
                try {
                  if (str_ind$1 === end_ind$1 || Caml_string.get(str, str_ind$1) !== /* "<" */60) {
                    throw Caml_builtin_exceptions.not_found;
                  }
                  var str_ind_1 = parse_spaces(str_ind$1 + 1 | 0, end_ind$1);
                  var match$8 = Caml_string.get(str, str_ind_1);
                  var exit = 0;
                  if (match$8 >= 48) {
                    if (match$8 >= 58) {
                      throw Caml_builtin_exceptions.not_found;
                    }
                    exit = 1;
                  } else {
                    if (match$8 !== 45) {
                      throw Caml_builtin_exceptions.not_found;
                    }
                    exit = 1;
                  }
                  if (exit === 1) {
                    var match$9 = parse_integer(str_ind_1, end_ind$1);
                    var width = match$9[1];
                    var str_ind_3 = parse_spaces(match$9[0], end_ind$1);
                    var match$10 = Caml_string.get(str, str_ind_3);
                    var switcher = match$10 - 45 | 0;
                    if (switcher > 12 || switcher < 0) {
                      if (switcher !== 17) {
                        throw Caml_builtin_exceptions.not_found;
                      }
                      var s = $$String.sub(str, str_ind$1 - 2 | 0, (str_ind_3 - str_ind$1 | 0) + 3 | 0);
                      match$7 = /* tuple */[
                        str_ind_3 + 1 | 0,
                        /* Break */Block.__(0, [
                            s,
                            width,
                            0
                          ])
                      ];
                    } else if (switcher === 2 || switcher === 1) {
                      throw Caml_builtin_exceptions.not_found;
                    } else {
                      var match$11 = parse_integer(str_ind_3, end_ind$1);
                      var str_ind_5 = parse_spaces(match$11[0], end_ind$1);
                      if (Caml_string.get(str, str_ind_5) !== /* ">" */62) {
                        throw Caml_builtin_exceptions.not_found;
                      }
                      var s$1 = $$String.sub(str, str_ind$1 - 2 | 0, (str_ind_5 - str_ind$1 | 0) + 3 | 0);
                      match$7 = /* tuple */[
                        str_ind_5 + 1 | 0,
                        /* Break */Block.__(0, [
                            s$1,
                            width,
                            match$11[1]
                          ])
                      ];
                    }
                  }
                  
                }
                catch (raw_exn){
                  var exn = Caml_js_exceptions.internalToOCamlException(raw_exn);
                  if (exn === Caml_builtin_exceptions.not_found || exn[0] === Caml_builtin_exceptions.failure) {
                    match$7 = /* tuple */[
                      str_ind$1,
                      /* Break */Block.__(0, [
                          "@;",
                          1,
                          0
                        ])
                    ];
                  } else {
                    throw exn;
                  }
                }
                var next_ind = match$7[0];
                var match$12 = parse_literal(next_ind, next_ind, end_ind$1);
                return /* Fmt_EBB */[/* Formatting_lit */Block.__(17, [
                            match$7[1],
                            match$12[0]
                          ])];
            case 28 :
                var str_ind$2 = str_ind + 1 | 0;
                var end_ind$2 = end_ind;
                var match$13;
                try {
                  var str_ind_1$1 = parse_spaces(str_ind$2, end_ind$2);
                  var match$14 = Caml_string.get(str, str_ind_1$1);
                  var exit$1 = 0;
                  if (match$14 >= 48) {
                    if (match$14 >= 58) {
                      match$13 = undefined;
                    } else {
                      exit$1 = 1;
                    }
                  } else if (match$14 !== 45) {
                    match$13 = undefined;
                  } else {
                    exit$1 = 1;
                  }
                  if (exit$1 === 1) {
                    var match$15 = parse_integer(str_ind_1$1, end_ind$2);
                    var str_ind_3$1 = parse_spaces(match$15[0], end_ind$2);
                    if (Caml_string.get(str, str_ind_3$1) !== /* ">" */62) {
                      throw Caml_builtin_exceptions.not_found;
                    }
                    var s$2 = $$String.sub(str, str_ind$2 - 2 | 0, (str_ind_3$1 - str_ind$2 | 0) + 3 | 0);
                    match$13 = /* tuple */[
                      str_ind_3$1 + 1 | 0,
                      /* Magic_size */Block.__(1, [
                          s$2,
                          match$15[1]
                        ])
                    ];
                  }
                  
                }
                catch (raw_exn$1){
                  var exn$1 = Caml_js_exceptions.internalToOCamlException(raw_exn$1);
                  if (exn$1 === Caml_builtin_exceptions.not_found || exn$1[0] === Caml_builtin_exceptions.failure) {
                    match$13 = undefined;
                  } else {
                    throw exn$1;
                  }
                }
                if (match$13 !== undefined) {
                  var match$16 = match$13;
                  var next_ind$1 = match$16[0];
                  var match$17 = parse_literal(next_ind$1, next_ind$1, end_ind$2);
                  return /* Fmt_EBB */[/* Formatting_lit */Block.__(17, [
                              match$16[1],
                              match$17[0]
                            ])];
                } else {
                  var match$18 = parse_literal(str_ind$2, str_ind$2, end_ind$2);
                  return /* Fmt_EBB */[/* Formatting_lit */Block.__(17, [
                              /* Scan_indic */Block.__(2, [/* "<" */60]),
                              match$18[0]
                            ])];
                }
            case 1 :
            case 2 :
            case 3 :
            case 4 :
            case 6 :
            case 7 :
            case 8 :
            case 9 :
            case 10 :
            case 11 :
            case 13 :
            case 15 :
            case 16 :
            case 17 :
            case 18 :
            case 19 :
            case 20 :
            case 21 :
            case 22 :
            case 23 :
            case 24 :
            case 25 :
            case 26 :
            case 29 :
            case 30 :
                break;
            case 31 :
                var beg_ind$6 = str_ind + 1 | 0;
                var match$19 = parse_literal(beg_ind$6, beg_ind$6, end_ind);
                return /* Fmt_EBB */[/* Formatting_lit */Block.__(17, [
                            /* FFlush */2,
                            match$19[0]
                          ])];
            case 32 :
                var beg_ind$7 = str_ind + 1 | 0;
                var match$20 = parse_literal(beg_ind$7, beg_ind$7, end_ind);
                return /* Fmt_EBB */[/* Formatting_lit */Block.__(17, [
                            /* Escaped_at */5,
                            match$20[0]
                          ])];
            
          }
        }
        
      } else {
        var beg_ind$8 = str_ind + 1 | 0;
        var match$21 = parse_literal(beg_ind$8, beg_ind$8, end_ind);
        return /* Fmt_EBB */[/* Formatting_lit */Block.__(17, [
                    /* Force_newline */3,
                    match$21[0]
                  ])];
      }
      var beg_ind$9 = str_ind + 1 | 0;
      var match$22 = parse_literal(beg_ind$9, beg_ind$9, end_ind);
      return /* Fmt_EBB */[/* Formatting_lit */Block.__(17, [
                  /* Scan_indic */Block.__(2, [c]),
                  match$22[0]
                ])];
    }
  };
  var add_literal = function (lit_start, str_ind, fmt) {
    var size = str_ind - lit_start | 0;
    if (size !== 0) {
      if (size !== 1) {
        return /* Fmt_EBB */[/* String_literal */Block.__(11, [
                    $$String.sub(str, lit_start, size),
                    fmt
                  ])];
      } else {
        return /* Fmt_EBB */[/* Char_literal */Block.__(12, [
                    Caml_string.get(str, lit_start),
                    fmt
                  ])];
      }
    } else {
      return /* Fmt_EBB */[fmt];
    }
  };
  var parse_format = function (pct_ind, end_ind) {
    var pct_ind$1 = pct_ind;
    var str_ind = pct_ind + 1 | 0;
    var end_ind$1 = end_ind;
    if (str_ind === end_ind$1) {
      invalid_format_message(end_ind$1, "unexpected end of format");
    }
    var match = Caml_string.get(str, str_ind);
    if (match !== 95) {
      return parse_flags(pct_ind$1, str_ind, end_ind$1, false);
    } else {
      return parse_flags(pct_ind$1, str_ind + 1 | 0, end_ind$1, true);
    }
  };
  var parse_literal = function (lit_start, _str_ind, end_ind) {
    while(true) {
      var str_ind = _str_ind;
      if (str_ind === end_ind) {
        return add_literal(lit_start, str_ind, /* End_of_format */0);
      } else {
        var match = Caml_string.get(str, str_ind);
        if (match !== 37) {
          if (match !== 64) {
            _str_ind = str_ind + 1 | 0;
            continue ;
          } else {
            var match$1 = parse_after_at(str_ind + 1 | 0, end_ind);
            return add_literal(lit_start, str_ind, match$1[0]);
          }
        } else {
          var match$2 = parse_format(str_ind, end_ind);
          return add_literal(lit_start, str_ind, match$2[0]);
        }
      }
    };
  };
  var parse_spaces = function (_str_ind, end_ind) {
    while(true) {
      var str_ind = _str_ind;
      if (str_ind === end_ind) {
        invalid_format_message(end_ind, "unexpected end of format");
      }
      if (Caml_string.get(str, str_ind) === /* " " */32) {
        _str_ind = str_ind + 1 | 0;
        continue ;
      } else {
        return str_ind;
      }
    };
  };
  var parse_flags = function (pct_ind, str_ind, end_ind, ign) {
    var zero = {
      contents: false
    };
    var minus = {
      contents: false
    };
    var plus = {
      contents: false
    };
    var space = {
      contents: false
    };
    var hash = {
      contents: false
    };
    var set_flag = function (str_ind, flag) {
      if (flag.contents && !legacy_behavior$1) {
        Curry._3(failwith_message(/* Format */[
                  /* String_literal */Block.__(11, [
                      "invalid format ",
                      /* Caml_string */Block.__(3, [
                          /* No_padding */0,
                          /* String_literal */Block.__(11, [
                              ": at character number ",
                              /* Int */Block.__(4, [
                                  /* Int_d */0,
                                  /* No_padding */0,
                                  /* No_precision */0,
                                  /* String_literal */Block.__(11, [
                                      ", duplicate flag ",
                                      /* Caml_char */Block.__(1, [/* End_of_format */0])
                                    ])
                                ])
                            ])
                        ])
                    ]),
                  "invalid format %S: at character number %d, duplicate flag %C"
                ]), str, str_ind, Caml_string.get(str, str_ind));
      }
      flag.contents = true;
      return /* () */0;
    };
    var _str_ind = str_ind;
    while(true) {
      var str_ind$1 = _str_ind;
      if (str_ind$1 === end_ind) {
        invalid_format_message(end_ind, "unexpected end of format");
      }
      var match = Caml_string.get(str, str_ind$1);
      switch (match) {
        case 32 :
            set_flag(str_ind$1, space);
            _str_ind = str_ind$1 + 1 | 0;
            continue ;
        case 35 :
            set_flag(str_ind$1, hash);
            _str_ind = str_ind$1 + 1 | 0;
            continue ;
        case 43 :
            set_flag(str_ind$1, plus);
            _str_ind = str_ind$1 + 1 | 0;
            continue ;
        case 45 :
            set_flag(str_ind$1, minus);
            _str_ind = str_ind$1 + 1 | 0;
            continue ;
        case 33 :
        case 34 :
        case 36 :
        case 37 :
        case 38 :
        case 39 :
        case 40 :
        case 41 :
        case 42 :
        case 44 :
        case 46 :
        case 47 :
            break;
        case 48 :
            set_flag(str_ind$1, zero);
            _str_ind = str_ind$1 + 1 | 0;
            continue ;
        default:
          
      }
      var pct_ind$1 = pct_ind;
      var str_ind$2 = str_ind$1;
      var end_ind$1 = end_ind;
      var zero$1 = zero.contents;
      var minus$1 = minus.contents;
      var plus$1 = plus.contents;
      var hash$1 = hash.contents;
      var space$1 = space.contents;
      var ign$1 = ign;
      if (str_ind$2 === end_ind$1) {
        invalid_format_message(end_ind$1, "unexpected end of format");
      }
      var padty = zero$1 ? (
          minus$1 ? (
              legacy_behavior$1 ? /* Left */0 : incompatible_flag(pct_ind$1, str_ind$2, /* "-" */45, "0")
            ) : /* Zeros */2
        ) : (
          minus$1 ? /* Left */0 : /* Right */1
        );
      var match$1 = Caml_string.get(str, str_ind$2);
      if (match$1 >= 48) {
        if (match$1 < 58) {
          var match$2 = parse_positive(str_ind$2, end_ind$1, 0);
          return parse_after_padding(pct_ind$1, match$2[0], end_ind$1, minus$1, plus$1, hash$1, space$1, ign$1, /* Lit_padding */Block.__(0, [
                        padty,
                        match$2[1]
                      ]));
        }
        
      } else if (match$1 === 42) {
        return parse_after_padding(pct_ind$1, str_ind$2 + 1 | 0, end_ind$1, minus$1, plus$1, hash$1, space$1, ign$1, /* Arg_padding */Block.__(1, [padty]));
      }
      switch (padty) {
        case /* Left */0 :
            if (!legacy_behavior$1) {
              invalid_format_without(str_ind$2 - 1 | 0, /* "-" */45, "padding");
            }
            return parse_after_padding(pct_ind$1, str_ind$2, end_ind$1, minus$1, plus$1, hash$1, space$1, ign$1, /* No_padding */0);
        case /* Right */1 :
            return parse_after_padding(pct_ind$1, str_ind$2, end_ind$1, minus$1, plus$1, hash$1, space$1, ign$1, /* No_padding */0);
        case /* Zeros */2 :
            return parse_after_padding(pct_ind$1, str_ind$2, end_ind$1, minus$1, plus$1, hash$1, space$1, ign$1, /* Lit_padding */Block.__(0, [
                          /* Right */1,
                          0
                        ]));
        
      }
    };
  };
  var search_subformat_end = function (_str_ind, end_ind, c) {
    while(true) {
      var str_ind = _str_ind;
      if (str_ind === end_ind) {
        Curry._3(failwith_message(/* Format */[
                  /* String_literal */Block.__(11, [
                      "invalid format ",
                      /* Caml_string */Block.__(3, [
                          /* No_padding */0,
                          /* String_literal */Block.__(11, [
                              ": unclosed sub-format, expected \"",
                              /* Char_literal */Block.__(12, [
                                  /* "%" */37,
                                  /* Char */Block.__(0, [/* String_literal */Block.__(11, [
                                          "\" at character number ",
                                          /* Int */Block.__(4, [
                                              /* Int_d */0,
                                              /* No_padding */0,
                                              /* No_precision */0,
                                              /* End_of_format */0
                                            ])
                                        ])])
                                ])
                            ])
                        ])
                    ]),
                  "invalid format %S: unclosed sub-format, expected \"%%%c\" at character number %d"
                ]), str, c, end_ind);
      }
      var match = Caml_string.get(str, str_ind);
      if (match !== 37) {
        _str_ind = str_ind + 1 | 0;
        continue ;
      } else {
        if ((str_ind + 1 | 0) === end_ind) {
          invalid_format_message(end_ind, "unexpected end of format");
        }
        if (Caml_string.get(str, str_ind + 1 | 0) === c) {
          return str_ind;
        } else {
          var match$1 = Caml_string.get(str, str_ind + 1 | 0);
          if (match$1 >= 95) {
            if (match$1 >= 123) {
              if (match$1 < 126) {
                switch (match$1 - 123 | 0) {
                  case 0 :
                      var sub_end = search_subformat_end(str_ind + 2 | 0, end_ind, /* "}" */125);
                      _str_ind = sub_end + 2 | 0;
                      continue ;
                  case 1 :
                      break;
                  case 2 :
                      return expected_character(str_ind + 1 | 0, "character ')'", /* "}" */125);
                  
                }
              }
              
            } else if (match$1 < 96) {
              if ((str_ind + 2 | 0) === end_ind) {
                invalid_format_message(end_ind, "unexpected end of format");
              }
              var match$2 = Caml_string.get(str, str_ind + 2 | 0);
              if (match$2 !== 40) {
                if (match$2 !== 123) {
                  _str_ind = str_ind + 3 | 0;
                  continue ;
                } else {
                  var sub_end$1 = search_subformat_end(str_ind + 3 | 0, end_ind, /* "}" */125);
                  _str_ind = sub_end$1 + 2 | 0;
                  continue ;
                }
              } else {
                var sub_end$2 = search_subformat_end(str_ind + 3 | 0, end_ind, /* ")" */41);
                _str_ind = sub_end$2 + 2 | 0;
                continue ;
              }
            }
            
          } else if (match$1 !== 40) {
            if (match$1 === 41) {
              return expected_character(str_ind + 1 | 0, "character '}'", /* ")" */41);
            }
            
          } else {
            var sub_end$3 = search_subformat_end(str_ind + 2 | 0, end_ind, /* ")" */41);
            _str_ind = sub_end$3 + 2 | 0;
            continue ;
          }
          _str_ind = str_ind + 2 | 0;
          continue ;
        }
      }
    };
  };
  var parse_positive = function (_str_ind, end_ind, _acc) {
    while(true) {
      var acc = _acc;
      var str_ind = _str_ind;
      if (str_ind === end_ind) {
        invalid_format_message(end_ind, "unexpected end of format");
      }
      var c = Caml_string.get(str, str_ind);
      if (c > 57 || c < 48) {
        return /* tuple */[
                str_ind,
                acc
              ];
      } else {
        var new_acc = Caml_int32.imul(acc, 10) + (c - /* "0" */48 | 0) | 0;
        _acc = new_acc;
        _str_ind = str_ind + 1 | 0;
        continue ;
      }
    };
  };
  var check_open_box = function (fmt) {
    if (typeof fmt === "number" || !(fmt.tag === /* String_literal */11 && typeof fmt[1] === "number")) {
      return /* () */0;
    } else {
      try {
        open_box_of_string(fmt[0]);
        return /* () */0;
      }
      catch (raw_exn){
        var exn = Caml_js_exceptions.internalToOCamlException(raw_exn);
        if (exn[0] === Caml_builtin_exceptions.failure) {
          return /* () */0;
        } else {
          throw exn;
        }
      }
    }
  };
  var parse_conversion = function (pct_ind, str_ind, end_ind, plus, hash, space, ign, pad, prec, padprec, symb) {
    var plus_used = false;
    var hash_used = false;
    var space_used = false;
    var ign_used = {
      contents: false
    };
    var pad_used = {
      contents: false
    };
    var prec_used = {
      contents: false
    };
    var get_int_pad = function (param) {
      pad_used.contents = true;
      prec_used.contents = true;
      if (typeof prec === "number" && prec === 0) {
        return pad;
      }
      if (typeof pad === "number") {
        return /* No_padding */0;
      } else if (pad.tag) {
        if (pad[0] >= 2) {
          if (legacy_behavior$1) {
            return /* Arg_padding */Block.__(1, [/* Right */1]);
          } else {
            return incompatible_flag(pct_ind, str_ind, /* "0" */48, "precision");
          }
        } else {
          return pad;
        }
      } else if (pad[0] >= 2) {
        if (legacy_behavior$1) {
          return /* Lit_padding */Block.__(0, [
                    /* Right */1,
                    pad[1]
                  ]);
        } else {
          return incompatible_flag(pct_ind, str_ind, /* "0" */48, "precision");
        }
      } else {
        return pad;
      }
    };
    var check_no_0 = function (symb, pad) {
      if (typeof pad === "number") {
        return pad;
      } else if (pad.tag) {
        if (pad[0] >= 2) {
          if (legacy_behavior$1) {
            return /* Arg_padding */Block.__(1, [/* Right */1]);
          } else {
            return incompatible_flag(pct_ind, str_ind, symb, "0");
          }
        } else {
          return pad;
        }
      } else if (pad[0] >= 2) {
        if (legacy_behavior$1) {
          return /* Lit_padding */Block.__(0, [
                    /* Right */1,
                    pad[1]
                  ]);
        } else {
          return incompatible_flag(pct_ind, str_ind, symb, "0");
        }
      } else {
        return pad;
      }
    };
    var opt_of_pad = function (c, pad) {
      if (typeof pad === "number") {
        return ;
      } else if (pad.tag) {
        return incompatible_flag(pct_ind, str_ind, c, "'*'");
      } else {
        switch (pad[0]) {
          case /* Left */0 :
              if (legacy_behavior$1) {
                return pad[1];
              } else {
                return incompatible_flag(pct_ind, str_ind, c, "'-'");
              }
          case /* Right */1 :
              return pad[1];
          case /* Zeros */2 :
              if (legacy_behavior$1) {
                return pad[1];
              } else {
                return incompatible_flag(pct_ind, str_ind, c, "'0'");
              }
          
        }
      }
    };
    var get_prec_opt = function (param) {
      prec_used.contents = true;
      if (typeof prec === "number") {
        if (prec !== 0) {
          return incompatible_flag(pct_ind, str_ind, /* "_" */95, "'*'");
        } else {
          return ;
        }
      } else {
        return prec[0];
      }
    };
    var fmt_result;
    var exit = 0;
    var exit$1 = 0;
    var exit$2 = 0;
    if (symb >= 124) {
      exit$1 = 6;
    } else {
      switch (symb) {
        case 33 :
            var match = parse_literal(str_ind, str_ind, end_ind);
            fmt_result = /* Fmt_EBB */[/* Flush */Block.__(10, [match[0]])];
            break;
        case 40 :
            var sub_end = search_subformat_end(str_ind, end_ind, /* ")" */41);
            var beg_ind = sub_end + 2 | 0;
            var match$1 = parse_literal(beg_ind, beg_ind, end_ind);
            var fmt_rest = match$1[0];
            var match$2 = parse_literal(str_ind, str_ind, sub_end);
            var sub_fmtty = fmtty_of_fmt(match$2[0]);
            if (ign_used.contents = true, ign) {
              var ignored_000 = opt_of_pad(/* "_" */95, (pad_used.contents = true, pad));
              var ignored = /* Ignored_format_subst */Block.__(9, [
                  ignored_000,
                  sub_fmtty
                ]);
              fmt_result = /* Fmt_EBB */[/* Ignored_param */Block.__(23, [
                    ignored,
                    fmt_rest
                  ])];
            } else {
              fmt_result = /* Fmt_EBB */[/* Format_subst */Block.__(14, [
                    opt_of_pad(/* "(" */40, (pad_used.contents = true, pad)),
                    sub_fmtty,
                    fmt_rest
                  ])];
            }
            break;
        case 44 :
            fmt_result = parse_literal(str_ind, str_ind, end_ind);
            break;
        case 37 :
        case 64 :
            exit$1 = 4;
            break;
        case 67 :
            var match$3 = parse_literal(str_ind, str_ind, end_ind);
            var fmt_rest$1 = match$3[0];
            fmt_result = (ign_used.contents = true, ign) ? /* Fmt_EBB */[/* Ignored_param */Block.__(23, [
                    /* Ignored_caml_char */1,
                    fmt_rest$1
                  ])] : /* Fmt_EBB */[/* Caml_char */Block.__(1, [fmt_rest$1])];
            break;
        case 78 :
            var match$4 = parse_literal(str_ind, str_ind, end_ind);
            var fmt_rest$2 = match$4[0];
            if (ign_used.contents = true, ign) {
              var ignored$1 = /* Ignored_scan_get_counter */Block.__(11, [/* Token_counter */2]);
              fmt_result = /* Fmt_EBB */[/* Ignored_param */Block.__(23, [
                    ignored$1,
                    fmt_rest$2
                  ])];
            } else {
              fmt_result = /* Fmt_EBB */[/* Scan_get_counter */Block.__(21, [
                    /* Token_counter */2,
                    fmt_rest$2
                  ])];
            }
            break;
        case 83 :
            var pad$1 = check_no_0(symb, (pad_used.contents = true, padprec));
            var match$5 = parse_literal(str_ind, str_ind, end_ind);
            var fmt_rest$3 = match$5[0];
            if (ign_used.contents = true, ign) {
              var ignored$2 = /* Ignored_caml_string */Block.__(1, [opt_of_pad(/* "_" */95, (pad_used.contents = true, padprec))]);
              fmt_result = /* Fmt_EBB */[/* Ignored_param */Block.__(23, [
                    ignored$2,
                    fmt_rest$3
                  ])];
            } else {
              var match$6 = make_padding_fmt_ebb(pad$1, fmt_rest$3);
              fmt_result = /* Fmt_EBB */[/* Caml_string */Block.__(3, [
                    match$6[0],
                    match$6[1]
                  ])];
            }
            break;
        case 91 :
            var match$7 = parse_char_set(str_ind, end_ind);
            var char_set = match$7[1];
            var next_ind = match$7[0];
            var match$8 = parse_literal(next_ind, next_ind, end_ind);
            var fmt_rest$4 = match$8[0];
            if (ign_used.contents = true, ign) {
              var ignored_000$1 = opt_of_pad(/* "_" */95, (pad_used.contents = true, pad));
              var ignored$3 = /* Ignored_scan_char_set */Block.__(10, [
                  ignored_000$1,
                  char_set
                ]);
              fmt_result = /* Fmt_EBB */[/* Ignored_param */Block.__(23, [
                    ignored$3,
                    fmt_rest$4
                  ])];
            } else {
              fmt_result = /* Fmt_EBB */[/* Scan_char_set */Block.__(20, [
                    opt_of_pad(/* "[" */91, (pad_used.contents = true, pad)),
                    char_set,
                    fmt_rest$4
                  ])];
            }
            break;
        case 32 :
        case 35 :
        case 43 :
        case 45 :
        case 95 :
            exit$1 = 5;
            break;
        case 97 :
            var match$9 = parse_literal(str_ind, str_ind, end_ind);
            fmt_result = /* Fmt_EBB */[/* Alpha */Block.__(15, [match$9[0]])];
            break;
        case 66 :
        case 98 :
            exit$1 = 3;
            break;
        case 99 :
            var char_format = function (fmt_rest) {
              if (ign_used.contents = true, ign) {
                return /* Fmt_EBB */[/* Ignored_param */Block.__(23, [
                            /* Ignored_char */0,
                            fmt_rest
                          ])];
              } else {
                return /* Fmt_EBB */[/* Char */Block.__(0, [fmt_rest])];
              }
            };
            var scan_format = function (fmt_rest) {
              if (ign_used.contents = true, ign) {
                return /* Fmt_EBB */[/* Ignored_param */Block.__(23, [
                            /* Ignored_scan_next_char */3,
                            fmt_rest
                          ])];
              } else {
                return /* Fmt_EBB */[/* Scan_next_char */Block.__(22, [fmt_rest])];
              }
            };
            var match$10 = parse_literal(str_ind, str_ind, end_ind);
            var fmt_rest$5 = match$10[0];
            var match$11 = opt_of_pad(/* "c" */99, (pad_used.contents = true, pad));
            fmt_result = match$11 !== undefined ? (
                match$11 !== 0 ? (
                    legacy_behavior$1 ? char_format(fmt_rest$5) : invalid_format_message(str_ind, "non-zero widths are unsupported for %c conversions")
                  ) : scan_format(fmt_rest$5)
              ) : char_format(fmt_rest$5);
            break;
        case 69 :
        case 70 :
        case 71 :
        case 72 :
        case 101 :
        case 102 :
        case 103 :
        case 104 :
            exit$1 = 2;
            break;
        case 76 :
        case 108 :
        case 110 :
            exit$2 = 8;
            break;
        case 114 :
            var match$12 = parse_literal(str_ind, str_ind, end_ind);
            var fmt_rest$6 = match$12[0];
            fmt_result = (ign_used.contents = true, ign) ? /* Fmt_EBB */[/* Ignored_param */Block.__(23, [
                    /* Ignored_reader */2,
                    fmt_rest$6
                  ])] : /* Fmt_EBB */[/* Reader */Block.__(19, [fmt_rest$6])];
            break;
        case 115 :
            var pad$2 = check_no_0(symb, (pad_used.contents = true, padprec));
            var match$13 = parse_literal(str_ind, str_ind, end_ind);
            var fmt_rest$7 = match$13[0];
            if (ign_used.contents = true, ign) {
              var ignored$4 = /* Ignored_string */Block.__(0, [opt_of_pad(/* "_" */95, (pad_used.contents = true, padprec))]);
              fmt_result = /* Fmt_EBB */[/* Ignored_param */Block.__(23, [
                    ignored$4,
                    fmt_rest$7
                  ])];
            } else {
              var match$14 = make_padding_fmt_ebb(pad$2, fmt_rest$7);
              fmt_result = /* Fmt_EBB */[/* String */Block.__(2, [
                    match$14[0],
                    match$14[1]
                  ])];
            }
            break;
        case 116 :
            var match$15 = parse_literal(str_ind, str_ind, end_ind);
            fmt_result = /* Fmt_EBB */[/* Theta */Block.__(16, [match$15[0]])];
            break;
        case 88 :
        case 100 :
        case 105 :
        case 111 :
        case 117 :
        case 120 :
            exit$2 = 7;
            break;
        case 0 :
        case 1 :
        case 2 :
        case 3 :
        case 4 :
        case 5 :
        case 6 :
        case 7 :
        case 8 :
        case 9 :
        case 10 :
        case 11 :
        case 12 :
        case 13 :
        case 14 :
        case 15 :
        case 16 :
        case 17 :
        case 18 :
        case 19 :
        case 20 :
        case 21 :
        case 22 :
        case 23 :
        case 24 :
        case 25 :
        case 26 :
        case 27 :
        case 28 :
        case 29 :
        case 30 :
        case 31 :
        case 34 :
        case 36 :
        case 38 :
        case 39 :
        case 41 :
        case 42 :
        case 46 :
        case 47 :
        case 48 :
        case 49 :
        case 50 :
        case 51 :
        case 52 :
        case 53 :
        case 54 :
        case 55 :
        case 56 :
        case 57 :
        case 58 :
        case 59 :
        case 60 :
        case 61 :
        case 62 :
        case 63 :
        case 65 :
        case 68 :
        case 73 :
        case 74 :
        case 75 :
        case 77 :
        case 79 :
        case 80 :
        case 81 :
        case 82 :
        case 84 :
        case 85 :
        case 86 :
        case 87 :
        case 89 :
        case 90 :
        case 92 :
        case 93 :
        case 94 :
        case 96 :
        case 106 :
        case 107 :
        case 109 :
        case 112 :
        case 113 :
        case 118 :
        case 119 :
        case 121 :
        case 122 :
            exit$1 = 6;
            break;
        case 123 :
            var sub_end$1 = search_subformat_end(str_ind, end_ind, /* "}" */125);
            var match$16 = parse_literal(str_ind, str_ind, sub_end$1);
            var beg_ind$1 = sub_end$1 + 2 | 0;
            var match$17 = parse_literal(beg_ind$1, beg_ind$1, end_ind);
            var fmt_rest$8 = match$17[0];
            var sub_fmtty$1 = fmtty_of_fmt(match$16[0]);
            if (ign_used.contents = true, ign) {
              var ignored_000$2 = opt_of_pad(/* "_" */95, (pad_used.contents = true, pad));
              var ignored$5 = /* Ignored_format_arg */Block.__(8, [
                  ignored_000$2,
                  sub_fmtty$1
                ]);
              fmt_result = /* Fmt_EBB */[/* Ignored_param */Block.__(23, [
                    ignored$5,
                    fmt_rest$8
                  ])];
            } else {
              fmt_result = /* Fmt_EBB */[/* Format_arg */Block.__(13, [
                    opt_of_pad(/* "{" */123, (pad_used.contents = true, pad)),
                    sub_fmtty$1,
                    fmt_rest$8
                  ])];
            }
            break;
        
      }
    }
    switch (exit$2) {
      case 7 :
          plus_used = true;
          hash_used = true;
          space_used = true;
          var iconv = compute_int_conv(pct_ind, str_ind, plus, hash, space, symb);
          var match$18 = parse_literal(str_ind, str_ind, end_ind);
          var fmt_rest$9 = match$18[0];
          if (ign_used.contents = true, ign) {
            var ignored_001 = opt_of_pad(/* "_" */95, (pad_used.contents = true, pad));
            var ignored$6 = /* Ignored_int */Block.__(2, [
                iconv,
                ignored_001
              ]);
            fmt_result = /* Fmt_EBB */[/* Ignored_param */Block.__(23, [
                  ignored$6,
                  fmt_rest$9
                ])];
          } else {
            var match$19 = make_padprec_fmt_ebb(get_int_pad(/* () */0), (prec_used.contents = true, prec), fmt_rest$9);
            fmt_result = /* Fmt_EBB */[/* Int */Block.__(4, [
                  iconv,
                  match$19[0],
                  match$19[1],
                  match$19[2]
                ])];
          }
          break;
      case 8 :
          if (str_ind === end_ind || !is_int_base(Caml_string.get(str, str_ind))) {
            var match$20 = parse_literal(str_ind, str_ind, end_ind);
            var fmt_rest$10 = match$20[0];
            var counter = counter_of_char(symb);
            if (ign_used.contents = true, ign) {
              var ignored$7 = /* Ignored_scan_get_counter */Block.__(11, [counter]);
              fmt_result = /* Fmt_EBB */[/* Ignored_param */Block.__(23, [
                    ignored$7,
                    fmt_rest$10
                  ])];
            } else {
              fmt_result = /* Fmt_EBB */[/* Scan_get_counter */Block.__(21, [
                    counter,
                    fmt_rest$10
                  ])];
            }
          } else {
            exit$1 = 6;
          }
          break;
      
    }
    switch (exit$1) {
      case 2 :
          plus_used = true;
          space_used = true;
          var fconv = compute_float_conv(pct_ind, str_ind, plus, space, symb);
          var match$21 = parse_literal(str_ind, str_ind, end_ind);
          var fmt_rest$11 = match$21[0];
          if (ign_used.contents = true, ign) {
            var ignored_000$3 = opt_of_pad(/* "_" */95, (pad_used.contents = true, pad));
            var ignored_001$1 = get_prec_opt(/* () */0);
            var ignored$8 = /* Ignored_float */Block.__(6, [
                ignored_000$3,
                ignored_001$1
              ]);
            fmt_result = /* Fmt_EBB */[/* Ignored_param */Block.__(23, [
                  ignored$8,
                  fmt_rest$11
                ])];
          } else {
            var match$22 = make_padprec_fmt_ebb((pad_used.contents = true, pad), (prec_used.contents = true, prec), fmt_rest$11);
            fmt_result = /* Fmt_EBB */[/* Float */Block.__(8, [
                  fconv,
                  match$22[0],
                  match$22[1],
                  match$22[2]
                ])];
          }
          break;
      case 3 :
          var pad$3 = check_no_0(symb, (pad_used.contents = true, padprec));
          var match$23 = parse_literal(str_ind, str_ind, end_ind);
          var fmt_rest$12 = match$23[0];
          if (ign_used.contents = true, ign) {
            var ignored$9 = /* Ignored_bool */Block.__(7, [opt_of_pad(/* "_" */95, (pad_used.contents = true, padprec))]);
            fmt_result = /* Fmt_EBB */[/* Ignored_param */Block.__(23, [
                  ignored$9,
                  fmt_rest$12
                ])];
          } else {
            var match$24 = make_padding_fmt_ebb(pad$3, fmt_rest$12);
            fmt_result = /* Fmt_EBB */[/* Bool */Block.__(9, [
                  match$24[0],
                  match$24[1]
                ])];
          }
          break;
      case 4 :
          var match$25 = parse_literal(str_ind, str_ind, end_ind);
          fmt_result = /* Fmt_EBB */[/* Char_literal */Block.__(12, [
                symb,
                match$25[0]
              ])];
          break;
      case 5 :
          fmt_result = Curry._3(failwith_message(/* Format */[
                    /* String_literal */Block.__(11, [
                        "invalid format ",
                        /* Caml_string */Block.__(3, [
                            /* No_padding */0,
                            /* String_literal */Block.__(11, [
                                ": at character number ",
                                /* Int */Block.__(4, [
                                    /* Int_d */0,
                                    /* No_padding */0,
                                    /* No_precision */0,
                                    /* String_literal */Block.__(11, [
                                        ", flag ",
                                        /* Caml_char */Block.__(1, [/* String_literal */Block.__(11, [
                                                " is only allowed after the '",
                                                /* Char_literal */Block.__(12, [
                                                    /* "%" */37,
                                                    /* String_literal */Block.__(11, [
                                                        "', before padding and precision",
                                                        /* End_of_format */0
                                                      ])
                                                  ])
                                              ])])
                                      ])
                                  ])
                              ])
                          ])
                      ]),
                    "invalid format %S: at character number %d, flag %C is only allowed after the '%%', before padding and precision"
                  ]), str, pct_ind, symb);
          break;
      case 6 :
          if (symb >= 108) {
            if (symb >= 111) {
              exit = 1;
            } else {
              switch (symb - 108 | 0) {
                case 0 :
                    plus_used = true;
                    hash_used = true;
                    space_used = true;
                    var iconv$1 = compute_int_conv(pct_ind, str_ind + 1 | 0, plus, hash, space, Caml_string.get(str, str_ind));
                    var beg_ind$2 = str_ind + 1 | 0;
                    var match$26 = parse_literal(beg_ind$2, beg_ind$2, end_ind);
                    var fmt_rest$13 = match$26[0];
                    if (ign_used.contents = true, ign) {
                      var ignored_001$2 = opt_of_pad(/* "_" */95, (pad_used.contents = true, pad));
                      var ignored$10 = /* Ignored_int32 */Block.__(3, [
                          iconv$1,
                          ignored_001$2
                        ]);
                      fmt_result = /* Fmt_EBB */[/* Ignored_param */Block.__(23, [
                            ignored$10,
                            fmt_rest$13
                          ])];
                    } else {
                      var match$27 = make_padprec_fmt_ebb(get_int_pad(/* () */0), (prec_used.contents = true, prec), fmt_rest$13);
                      fmt_result = /* Fmt_EBB */[/* Int32 */Block.__(5, [
                            iconv$1,
                            match$27[0],
                            match$27[1],
                            match$27[2]
                          ])];
                    }
                    break;
                case 1 :
                    exit = 1;
                    break;
                case 2 :
                    plus_used = true;
                    hash_used = true;
                    space_used = true;
                    var iconv$2 = compute_int_conv(pct_ind, str_ind + 1 | 0, plus, hash, space, Caml_string.get(str, str_ind));
                    var beg_ind$3 = str_ind + 1 | 0;
                    var match$28 = parse_literal(beg_ind$3, beg_ind$3, end_ind);
                    var fmt_rest$14 = match$28[0];
                    if (ign_used.contents = true, ign) {
                      var ignored_001$3 = opt_of_pad(/* "_" */95, (pad_used.contents = true, pad));
                      var ignored$11 = /* Ignored_nativeint */Block.__(4, [
                          iconv$2,
                          ignored_001$3
                        ]);
                      fmt_result = /* Fmt_EBB */[/* Ignored_param */Block.__(23, [
                            ignored$11,
                            fmt_rest$14
                          ])];
                    } else {
                      var match$29 = make_padprec_fmt_ebb(get_int_pad(/* () */0), (prec_used.contents = true, prec), fmt_rest$14);
                      fmt_result = /* Fmt_EBB */[/* Nativeint */Block.__(6, [
                            iconv$2,
                            match$29[0],
                            match$29[1],
                            match$29[2]
                          ])];
                    }
                    break;
                
              }
            }
          } else if (symb !== 76) {
            exit = 1;
          } else {
            plus_used = true;
            hash_used = true;
            space_used = true;
            var iconv$3 = compute_int_conv(pct_ind, str_ind + 1 | 0, plus, hash, space, Caml_string.get(str, str_ind));
            var beg_ind$4 = str_ind + 1 | 0;
            var match$30 = parse_literal(beg_ind$4, beg_ind$4, end_ind);
            var fmt_rest$15 = match$30[0];
            if (ign_used.contents = true, ign) {
              var ignored_001$4 = opt_of_pad(/* "_" */95, (pad_used.contents = true, pad));
              var ignored$12 = /* Ignored_int64 */Block.__(5, [
                  iconv$3,
                  ignored_001$4
                ]);
              fmt_result = /* Fmt_EBB */[/* Ignored_param */Block.__(23, [
                    ignored$12,
                    fmt_rest$15
                  ])];
            } else {
              var match$31 = make_padprec_fmt_ebb(get_int_pad(/* () */0), (prec_used.contents = true, prec), fmt_rest$15);
              fmt_result = /* Fmt_EBB */[/* Int64 */Block.__(7, [
                    iconv$3,
                    match$31[0],
                    match$31[1],
                    match$31[2]
                  ])];
            }
          }
          break;
      
    }
    if (exit === 1) {
      fmt_result = Curry._3(failwith_message(/* Format */[
                /* String_literal */Block.__(11, [
                    "invalid format ",
                    /* Caml_string */Block.__(3, [
                        /* No_padding */0,
                        /* String_literal */Block.__(11, [
                            ": at character number ",
                            /* Int */Block.__(4, [
                                /* Int_d */0,
                                /* No_padding */0,
                                /* No_precision */0,
                                /* String_literal */Block.__(11, [
                                    ", invalid conversion \"",
                                    /* Char_literal */Block.__(12, [
                                        /* "%" */37,
                                        /* Char */Block.__(0, [/* Char_literal */Block.__(12, [
                                                /* "\"" */34,
                                                /* End_of_format */0
                                              ])])
                                      ])
                                  ])
                              ])
                          ])
                      ])
                  ]),
                "invalid format %S: at character number %d, invalid conversion \"%%%c\""
              ]), str, str_ind - 1 | 0, symb);
    }
    if (!legacy_behavior$1) {
      if (!plus_used && plus) {
        incompatible_flag(pct_ind, str_ind, symb, "'+'");
      }
      if (!hash_used && hash) {
        incompatible_flag(pct_ind, str_ind, symb, "'#'");
      }
      if (!space_used && space) {
        incompatible_flag(pct_ind, str_ind, symb, "' '");
      }
      if (!pad_used.contents && Caml_obj.caml_notequal(/* Padding_EBB */[pad], /* Padding_EBB */[/* No_padding */0])) {
        incompatible_flag(pct_ind, str_ind, symb, "`padding'");
      }
      if (!prec_used.contents && Caml_obj.caml_notequal(/* Precision_EBB */[prec], /* Precision_EBB */[/* No_precision */0])) {
        incompatible_flag(pct_ind, str_ind, ign ? /* "_" */95 : symb, "`precision'");
      }
      if (ign && plus) {
        incompatible_flag(pct_ind, str_ind, /* "_" */95, "'+'");
      }
      
    }
    if (!ign_used.contents && ign) {
      var exit$3 = 0;
      if (symb >= 38) {
        if (symb !== 44) {
          if (symb !== 64 || !legacy_behavior$1) {
            exit$3 = 1;
          }
          
        } else if (!legacy_behavior$1) {
          exit$3 = 1;
        }
        
      } else if (symb !== 33) {
        if (!(symb >= 37 && legacy_behavior$1)) {
          exit$3 = 1;
        }
        
      } else if (!legacy_behavior$1) {
        exit$3 = 1;
      }
      if (exit$3 === 1) {
        incompatible_flag(pct_ind, str_ind, symb, "'_'");
      }
      
    }
    return fmt_result;
  };
  var parse_integer = function (str_ind, end_ind) {
    if (str_ind === end_ind) {
      invalid_format_message(end_ind, "unexpected end of format");
    }
    var match = Caml_string.get(str, str_ind);
    if (match >= 48) {
      if (match >= 58) {
        throw [
              Caml_builtin_exceptions.assert_failure,
              /* tuple */[
                "camlinternalFormat.ml",
                2814,
                11
              ]
            ];
      }
      return parse_positive(str_ind, end_ind, 0);
    } else {
      if (match !== 45) {
        throw [
              Caml_builtin_exceptions.assert_failure,
              /* tuple */[
                "camlinternalFormat.ml",
                2814,
                11
              ]
            ];
      }
      if ((str_ind + 1 | 0) === end_ind) {
        invalid_format_message(end_ind, "unexpected end of format");
      }
      var c = Caml_string.get(str, str_ind + 1 | 0);
      if (c > 57 || c < 48) {
        return expected_character(str_ind + 1 | 0, "digit", c);
      } else {
        var match$1 = parse_positive(str_ind + 1 | 0, end_ind, 0);
        return /* tuple */[
                match$1[0],
                -match$1[1] | 0
              ];
      }
    }
  };
  var incompatible_flag = function (pct_ind, str_ind, symb, option) {
    var subfmt = $$String.sub(str, pct_ind, str_ind - pct_ind | 0);
    return Curry._5(failwith_message(/* Format */[
                    /* String_literal */Block.__(11, [
                        "invalid format ",
                        /* Caml_string */Block.__(3, [
                            /* No_padding */0,
                            /* String_literal */Block.__(11, [
                                ": at character number ",
                                /* Int */Block.__(4, [
                                    /* Int_d */0,
                                    /* No_padding */0,
                                    /* No_precision */0,
                                    /* String_literal */Block.__(11, [
                                        ", ",
                                        /* String */Block.__(2, [
                                            /* No_padding */0,
                                            /* String_literal */Block.__(11, [
                                                " is incompatible with '",
                                                /* Char */Block.__(0, [/* String_literal */Block.__(11, [
                                                        "' in sub-format ",
                                                        /* Caml_string */Block.__(3, [
                                                            /* No_padding */0,
                                                            /* End_of_format */0
                                                          ])
                                                      ])])
                                              ])
                                          ])
                                      ])
                                  ])
                              ])
                          ])
                      ]),
                    "invalid format %S: at character number %d, %s is incompatible with '%c' in sub-format %S"
                  ]), str, pct_ind, option, symb, subfmt);
  };
  var parse_after_padding = function (pct_ind, str_ind, end_ind, minus, plus, hash, space, ign, pad) {
    if (str_ind === end_ind) {
      invalid_format_message(end_ind, "unexpected end of format");
    }
    var symb = Caml_string.get(str, str_ind);
    if (symb !== 46) {
      return parse_conversion(pct_ind, str_ind + 1 | 0, end_ind, plus, hash, space, ign, pad, /* No_precision */0, pad, symb);
    } else {
      var pct_ind$1 = pct_ind;
      var str_ind$1 = str_ind + 1 | 0;
      var end_ind$1 = end_ind;
      var minus$1 = minus;
      var plus$1 = plus;
      var hash$1 = hash;
      var space$1 = space;
      var ign$1 = ign;
      var pad$1 = pad;
      if (str_ind$1 === end_ind$1) {
        invalid_format_message(end_ind$1, "unexpected end of format");
      }
      var parse_literal = function (minus, str_ind) {
        var match = parse_positive(str_ind, end_ind$1, 0);
        return parse_after_precision(pct_ind$1, match[0], end_ind$1, minus, plus$1, hash$1, space$1, ign$1, pad$1, /* Lit_precision */[match[1]]);
      };
      var symb$1 = Caml_string.get(str, str_ind$1);
      var exit = 0;
      if (symb$1 >= 48) {
        if (symb$1 < 58) {
          return parse_literal(minus$1, str_ind$1);
        }
        
      } else if (symb$1 >= 42) {
        switch (symb$1 - 42 | 0) {
          case 0 :
              return parse_after_precision(pct_ind$1, str_ind$1 + 1 | 0, end_ind$1, minus$1, plus$1, hash$1, space$1, ign$1, pad$1, /* Arg_precision */1);
          case 1 :
          case 3 :
              exit = 2;
              break;
          case 2 :
          case 4 :
          case 5 :
              break;
          
        }
      }
      if (exit === 2 && legacy_behavior$1) {
        return parse_literal(minus$1 || symb$1 === /* "-" */45, str_ind$1 + 1 | 0);
      }
      if (legacy_behavior$1) {
        return parse_after_precision(pct_ind$1, str_ind$1, end_ind$1, minus$1, plus$1, hash$1, space$1, ign$1, pad$1, /* Lit_precision */[0]);
      } else {
        return invalid_format_without(str_ind$1 - 1 | 0, /* "." */46, "precision");
      }
    }
  };
  var is_int_base = function (symb) {
    switch (symb) {
      case 89 :
      case 90 :
      case 91 :
      case 92 :
      case 93 :
      case 94 :
      case 95 :
      case 96 :
      case 97 :
      case 98 :
      case 99 :
      case 101 :
      case 102 :
      case 103 :
      case 104 :
      case 106 :
      case 107 :
      case 108 :
      case 109 :
      case 110 :
      case 112 :
      case 113 :
      case 114 :
      case 115 :
      case 116 :
      case 118 :
      case 119 :
          return false;
      case 88 :
      case 100 :
      case 105 :
      case 111 :
      case 117 :
      case 120 :
          return true;
      default:
        return false;
    }
  };
  var counter_of_char = function (symb) {
    if (symb >= 108) {
      if (symb < 111) {
        switch (symb - 108 | 0) {
          case 0 :
              return /* Line_counter */0;
          case 1 :
              break;
          case 2 :
              return /* Char_counter */1;
          
        }
      }
      
    } else if (symb === 76) {
      return /* Token_counter */2;
    }
    throw [
          Caml_builtin_exceptions.assert_failure,
          /* tuple */[
            "camlinternalFormat.ml",
            2876,
            34
          ]
        ];
  };
  var parse_char_set = function (str_ind, end_ind) {
    if (str_ind === end_ind) {
      invalid_format_message(end_ind, "unexpected end of format");
    }
    var char_set = Bytes.make(32, /* "\000" */0);
    var add_range = function (c, c$prime) {
      for(var i = c; i <= c$prime; ++i){
        add_in_char_set(char_set, Pervasives.char_of_int(i));
      }
      return /* () */0;
    };
    var fail_single_percent = function (str_ind) {
      return Curry._2(failwith_message(/* Format */[
                      /* String_literal */Block.__(11, [
                          "invalid format ",
                          /* Caml_string */Block.__(3, [
                              /* No_padding */0,
                              /* String_literal */Block.__(11, [
                                  ": '",
                                  /* Char_literal */Block.__(12, [
                                      /* "%" */37,
                                      /* String_literal */Block.__(11, [
                                          "' alone is not accepted in character sets, use ",
                                          /* Char_literal */Block.__(12, [
                                              /* "%" */37,
                                              /* Char_literal */Block.__(12, [
                                                  /* "%" */37,
                                                  /* String_literal */Block.__(11, [
                                                      " instead at position ",
                                                      /* Int */Block.__(4, [
                                                          /* Int_d */0,
                                                          /* No_padding */0,
                                                          /* No_precision */0,
                                                          /* Char_literal */Block.__(12, [
                                                              /* "." */46,
                                                              /* End_of_format */0
                                                            ])
                                                        ])
                                                    ])
                                                ])
                                            ])
                                        ])
                                    ])
                                ])
                            ])
                        ]),
                      "invalid format %S: '%%' alone is not accepted in character sets, use %%%% instead at position %d."
                    ]), str, str_ind);
    };
    var parse_char_set_content = function (_str_ind, end_ind) {
      while(true) {
        var str_ind = _str_ind;
        if (str_ind === end_ind) {
          invalid_format_message(end_ind, "unexpected end of format");
        }
        var c = Caml_string.get(str, str_ind);
        if (c !== 45) {
          if (c !== 93) {
            return parse_char_set_after_char(str_ind + 1 | 0, end_ind, c);
          } else {
            return str_ind + 1 | 0;
          }
        } else {
          add_in_char_set(char_set, /* "-" */45);
          _str_ind = str_ind + 1 | 0;
          continue ;
        }
      };
    };
    var parse_char_set_after_char = function (_str_ind, end_ind, _c) {
      while(true) {
        var c = _c;
        var str_ind = _str_ind;
        if (str_ind === end_ind) {
          invalid_format_message(end_ind, "unexpected end of format");
        }
        var c$prime = Caml_string.get(str, str_ind);
        var exit = 0;
        if (c$prime >= 46) {
          if (c$prime !== 64) {
            if (c$prime === 93) {
              add_in_char_set(char_set, c);
              return str_ind + 1 | 0;
            }
            
          } else {
            exit = 2;
          }
        } else if (c$prime !== 37) {
          if (c$prime >= 45) {
            var str_ind$1 = str_ind + 1 | 0;
            var end_ind$1 = end_ind;
            var c$1 = c;
            if (str_ind$1 === end_ind$1) {
              invalid_format_message(end_ind$1, "unexpected end of format");
            }
            var c$prime$1 = Caml_string.get(str, str_ind$1);
            if (c$prime$1 !== 37) {
              if (c$prime$1 !== 93) {
                add_range(c$1, c$prime$1);
                return parse_char_set_content(str_ind$1 + 1 | 0, end_ind$1);
              } else {
                add_in_char_set(char_set, c$1);
                add_in_char_set(char_set, /* "-" */45);
                return str_ind$1 + 1 | 0;
              }
            } else {
              if ((str_ind$1 + 1 | 0) === end_ind$1) {
                invalid_format_message(end_ind$1, "unexpected end of format");
              }
              var c$prime$2 = Caml_string.get(str, str_ind$1 + 1 | 0);
              if (c$prime$2 !== 37 && c$prime$2 !== 64) {
                return fail_single_percent(str_ind$1);
              }
              add_range(c$1, c$prime$2);
              return parse_char_set_content(str_ind$1 + 2 | 0, end_ind$1);
            }
          }
          
        } else {
          exit = 2;
        }
        if (exit === 2 && c === /* "%" */37) {
          add_in_char_set(char_set, c$prime);
          return parse_char_set_content(str_ind + 1 | 0, end_ind);
        }
        if (c === /* "%" */37) {
          fail_single_percent(str_ind);
        }
        add_in_char_set(char_set, c);
        _c = c$prime;
        _str_ind = str_ind + 1 | 0;
        continue ;
      };
    };
    var parse_char_set_start = function (str_ind, end_ind) {
      if (str_ind === end_ind) {
        invalid_format_message(end_ind, "unexpected end of format");
      }
      var c = Caml_string.get(str, str_ind);
      return parse_char_set_after_char(str_ind + 1 | 0, end_ind, c);
    };
    if (str_ind === end_ind) {
      invalid_format_message(end_ind, "unexpected end of format");
    }
    var match = Caml_string.get(str, str_ind);
    var match$1 = match !== 94 ? /* tuple */[
        str_ind,
        false
      ] : /* tuple */[
        str_ind + 1 | 0,
        true
      ];
    var next_ind = parse_char_set_start(match$1[0], end_ind);
    var char_set$1 = Bytes.to_string(char_set);
    return /* tuple */[
            next_ind,
            match$1[1] ? rev_char_set(char_set$1) : char_set$1
          ];
  };
  var compute_int_conv = function (pct_ind, str_ind, _plus, _hash, _space, symb) {
    while(true) {
      var space = _space;
      var hash = _hash;
      var plus = _plus;
      var exit = 0;
      if (plus) {
        if (hash) {
          exit = 2;
        } else if (!space) {
          if (symb !== 100) {
            if (symb === 105) {
              return /* Int_pi */4;
            }
            
          } else {
            return /* Int_pd */1;
          }
        }
        
      } else if (hash) {
        if (space) {
          exit = 2;
        } else if (symb !== 88) {
          if (symb !== 111) {
            if (symb !== 120) {
              exit = 2;
            } else {
              return /* Int_Cx */7;
            }
          } else {
            return /* Int_Co */11;
          }
        } else {
          return /* Int_CX */9;
        }
      } else if (space) {
        if (symb !== 100) {
          if (symb === 105) {
            return /* Int_si */5;
          }
          
        } else {
          return /* Int_sd */2;
        }
      } else {
        switch (symb) {
          case 88 :
              return /* Int_X */8;
          case 100 :
              return /* Int_d */0;
          case 105 :
              return /* Int_i */3;
          case 111 :
              return /* Int_o */10;
          case 117 :
              return /* Int_u */12;
          case 89 :
          case 90 :
          case 91 :
          case 92 :
          case 93 :
          case 94 :
          case 95 :
          case 96 :
          case 97 :
          case 98 :
          case 99 :
          case 101 :
          case 102 :
          case 103 :
          case 104 :
          case 106 :
          case 107 :
          case 108 :
          case 109 :
          case 110 :
          case 112 :
          case 113 :
          case 114 :
          case 115 :
          case 116 :
          case 118 :
          case 119 :
              break;
          case 120 :
              return /* Int_x */6;
          default:
            
        }
      }
      if (exit === 2) {
        var exit$1 = 0;
        switch (symb) {
          case 88 :
              if (legacy_behavior$1) {
                return /* Int_CX */9;
              }
              break;
          case 111 :
              if (legacy_behavior$1) {
                return /* Int_Co */11;
              }
              break;
          case 100 :
          case 105 :
          case 117 :
              exit$1 = 3;
              break;
          case 89 :
          case 90 :
          case 91 :
          case 92 :
          case 93 :
          case 94 :
          case 95 :
          case 96 :
          case 97 :
          case 98 :
          case 99 :
          case 101 :
          case 102 :
          case 103 :
          case 104 :
          case 106 :
          case 107 :
          case 108 :
          case 109 :
          case 110 :
          case 112 :
          case 113 :
          case 114 :
          case 115 :
          case 116 :
          case 118 :
          case 119 :
              break;
          case 120 :
              if (legacy_behavior$1) {
                return /* Int_Cx */7;
              }
              break;
          default:
            
        }
        if (exit$1 === 3) {
          if (legacy_behavior$1) {
            _hash = false;
            continue ;
          } else {
            return incompatible_flag(pct_ind, str_ind, symb, "'#'");
          }
        }
        
      }
      if (plus) {
        if (space) {
          if (legacy_behavior$1) {
            _space = false;
            continue ;
          } else {
            return incompatible_flag(pct_ind, str_ind, /* " " */32, "'+'");
          }
        } else if (legacy_behavior$1) {
          _plus = false;
          continue ;
        } else {
          return incompatible_flag(pct_ind, str_ind, symb, "'+'");
        }
      } else if (space) {
        if (legacy_behavior$1) {
          _space = false;
          continue ;
        } else {
          return incompatible_flag(pct_ind, str_ind, symb, "' '");
        }
      } else {
        throw [
              Caml_builtin_exceptions.assert_failure,
              /* tuple */[
                "camlinternalFormat.ml",
                2909,
                28
              ]
            ];
      }
    };
  };
  var compute_float_conv = function (pct_ind, str_ind, _plus, _space, symb) {
    while(true) {
      var space = _space;
      var plus = _plus;
      if (plus) {
        if (space) {
          if (legacy_behavior$1) {
            _space = false;
            continue ;
          } else {
            return incompatible_flag(pct_ind, str_ind, /* " " */32, "'+'");
          }
        } else {
          if (symb >= 73) {
            switch (symb) {
              case 101 :
                  return /* Float_pe */4;
              case 102 :
                  return /* Float_pf */1;
              case 103 :
                  return /* Float_pg */10;
              case 104 :
                  return /* Float_ph */17;
              default:
                
            }
          } else if (symb >= 69) {
            switch (symb - 69 | 0) {
              case 0 :
                  return /* Float_pE */7;
              case 1 :
                  break;
              case 2 :
                  return /* Float_pG */13;
              case 3 :
                  return /* Float_pH */20;
              
            }
          }
          if (legacy_behavior$1) {
            _plus = false;
            continue ;
          } else {
            return incompatible_flag(pct_ind, str_ind, symb, "'+'");
          }
        }
      } else if (space) {
        if (symb >= 73) {
          switch (symb) {
            case 101 :
                return /* Float_se */5;
            case 102 :
                return /* Float_sf */2;
            case 103 :
                return /* Float_sg */11;
            case 104 :
                return /* Float_sh */18;
            default:
              
          }
        } else if (symb >= 69) {
          switch (symb - 69 | 0) {
            case 0 :
                return /* Float_sE */8;
            case 1 :
                break;
            case 2 :
                return /* Float_sG */14;
            case 3 :
                return /* Float_sH */21;
            
          }
        }
        if (legacy_behavior$1) {
          _space = false;
          continue ;
        } else {
          return incompatible_flag(pct_ind, str_ind, symb, "' '");
        }
      } else if (symb >= 73) {
        switch (symb) {
          case 101 :
              return /* Float_e */3;
          case 102 :
              return /* Float_f */0;
          case 103 :
              return /* Float_g */9;
          case 104 :
              return /* Float_h */16;
          default:
            throw [
                  Caml_builtin_exceptions.assert_failure,
                  /* tuple */[
                    "camlinternalFormat.ml",
                    2943,
                    25
                  ]
                ];
        }
      } else if (symb >= 69) {
        switch (symb - 69 | 0) {
          case 0 :
              return /* Float_E */6;
          case 1 :
              return /* Float_F */15;
          case 2 :
              return /* Float_G */12;
          case 3 :
              return /* Float_H */19;
          
        }
      } else {
        throw [
              Caml_builtin_exceptions.assert_failure,
              /* tuple */[
                "camlinternalFormat.ml",
                2943,
                25
              ]
            ];
      }
    };
  };
  var parse_after_precision = function (pct_ind, str_ind, end_ind, minus, plus, hash, space, ign, pad, prec) {
    if (str_ind === end_ind) {
      invalid_format_message(end_ind, "unexpected end of format");
    }
    var parse_conv = function (padprec) {
      return parse_conversion(pct_ind, str_ind + 1 | 0, end_ind, plus, hash, space, ign, pad, prec, padprec, Caml_string.get(str, str_ind));
    };
    if (typeof pad === "number") {
      if (typeof prec === "number" && prec === 0) {
        return parse_conv(/* No_padding */0);
      }
      if (minus) {
        if (typeof prec === "number") {
          return parse_conv(/* Arg_padding */Block.__(1, [/* Left */0]));
        } else {
          return parse_conv(/* Lit_padding */Block.__(0, [
                        /* Left */0,
                        prec[0]
                      ]));
        }
      } else if (typeof prec === "number") {
        return parse_conv(/* Arg_padding */Block.__(1, [/* Right */1]));
      } else {
        return parse_conv(/* Lit_padding */Block.__(0, [
                      /* Right */1,
                      prec[0]
                    ]));
      }
    } else {
      return parse_conv(pad);
    }
  };
  var parse_tag = function (is_open_tag, str_ind, end_ind) {
    try {
      if (str_ind === end_ind) {
        throw Caml_builtin_exceptions.not_found;
      }
      var match = Caml_string.get(str, str_ind);
      if (match !== 60) {
        throw Caml_builtin_exceptions.not_found;
      }
      var ind = $$String.index_from(str, str_ind + 1 | 0, /* ">" */62);
      if (ind >= end_ind) {
        throw Caml_builtin_exceptions.not_found;
      }
      var sub_str = $$String.sub(str, str_ind, (ind - str_ind | 0) + 1 | 0);
      var beg_ind = ind + 1 | 0;
      var match$1 = parse_literal(beg_ind, beg_ind, end_ind);
      var match$2 = parse_literal(str_ind, str_ind, ind + 1 | 0);
      var sub_fmt = match$2[0];
      var sub_format = /* Format */[
        sub_fmt,
        sub_str
      ];
      var formatting = is_open_tag ? /* Open_tag */Block.__(0, [sub_format]) : (check_open_box(sub_fmt), /* Open_box */Block.__(1, [sub_format]));
      return /* Fmt_EBB */[/* Formatting_gen */Block.__(18, [
                  formatting,
                  match$1[0]
                ])];
    }
    catch (exn){
      if (exn === Caml_builtin_exceptions.not_found) {
        var match$3 = parse_literal(str_ind, str_ind, end_ind);
        var sub_format$1 = /* Format */[
          /* End_of_format */0,
          ""
        ];
        var formatting$1 = is_open_tag ? /* Open_tag */Block.__(0, [sub_format$1]) : /* Open_box */Block.__(1, [sub_format$1]);
        return /* Fmt_EBB */[/* Formatting_gen */Block.__(18, [
                    formatting$1,
                    match$3[0]
                  ])];
      } else {
        throw exn;
      }
    }
  };
  return parse_literal(0, 0, str.length);
}

function format_of_string_fmtty(str, fmtty) {
  var match = fmt_ebb_of_string(undefined, str);
  try {
    return /* Format */[
            type_format(match[0], fmtty),
            str
          ];
  }
  catch (exn){
    if (exn === Type_mismatch) {
      return Curry._2(failwith_message(/* Format */[
                      /* String_literal */Block.__(11, [
                          "bad input: format type mismatch between ",
                          /* Caml_string */Block.__(3, [
                              /* No_padding */0,
                              /* String_literal */Block.__(11, [
                                  " and ",
                                  /* Caml_string */Block.__(3, [
                                      /* No_padding */0,
                                      /* End_of_format */0
                                    ])
                                ])
                            ])
                        ]),
                      "bad input: format type mismatch between %S and %S"
                    ]), str, string_of_fmtty(fmtty));
    } else {
      throw exn;
    }
  }
}

function format_of_string_format(str, param) {
  var match = fmt_ebb_of_string(undefined, str);
  try {
    return /* Format */[
            type_format(match[0], fmtty_of_fmt(param[0])),
            str
          ];
  }
  catch (exn){
    if (exn === Type_mismatch) {
      return Curry._2(failwith_message(/* Format */[
                      /* String_literal */Block.__(11, [
                          "bad input: format type mismatch between ",
                          /* Caml_string */Block.__(3, [
                              /* No_padding */0,
                              /* String_literal */Block.__(11, [
                                  " and ",
                                  /* Caml_string */Block.__(3, [
                                      /* No_padding */0,
                                      /* End_of_format */0
                                    ])
                                ])
                            ])
                        ]),
                      "bad input: format type mismatch between %S and %S"
                    ]), str, param[1]);
    } else {
      throw exn;
    }
  }
}

exports.is_in_char_set = is_in_char_set;
exports.rev_char_set = rev_char_set;
exports.create_char_set = create_char_set;
exports.add_in_char_set = add_in_char_set;
exports.freeze_char_set = freeze_char_set;
exports.param_format_of_ignored_format = param_format_of_ignored_format;
exports.make_printf = make_printf;
exports.make_iprintf = make_iprintf;
exports.output_acc = output_acc;
exports.bufput_acc = bufput_acc;
exports.strput_acc = strput_acc;
exports.type_format = type_format;
exports.fmt_ebb_of_string = fmt_ebb_of_string;
exports.format_of_string_fmtty = format_of_string_fmtty;
exports.format_of_string_format = format_of_string_format;
exports.char_of_iconv = char_of_iconv;
exports.string_of_formatting_lit = string_of_formatting_lit;
exports.string_of_formatting_gen = string_of_formatting_gen;
exports.string_of_fmtty = string_of_fmtty;
exports.string_of_fmt = string_of_fmt;
exports.open_box_of_string = open_box_of_string;
exports.symm = symm;
exports.trans = trans;
exports.recast = recast;
/* No side effect */

},{"./block.js":2,"./buffer.js":3,"./bytes.js":4,"./caml_builtin_exceptions.js":6,"./caml_bytes.js":7,"./caml_exceptions.js":8,"./caml_format.js":10,"./caml_int32.js":11,"./caml_io.js":13,"./caml_js_exceptions.js":14,"./caml_obj.js":15,"./caml_primitive.js":17,"./caml_string.js":18,"./camlinternalFormatBasics.js":22,"./char.js":23,"./curry.js":24,"./pervasives.js":27,"./string.js":30}],22:[function(require,module,exports){
'use strict';

var Block = require("./block.js");

function erase_rel(param) {
  if (typeof param === "number") {
    return /* End_of_fmtty */0;
  } else {
    switch (param.tag | 0) {
      case /* Char_ty */0 :
          return /* Char_ty */Block.__(0, [erase_rel(param[0])]);
      case /* String_ty */1 :
          return /* String_ty */Block.__(1, [erase_rel(param[0])]);
      case /* Int_ty */2 :
          return /* Int_ty */Block.__(2, [erase_rel(param[0])]);
      case /* Int32_ty */3 :
          return /* Int32_ty */Block.__(3, [erase_rel(param[0])]);
      case /* Nativeint_ty */4 :
          return /* Nativeint_ty */Block.__(4, [erase_rel(param[0])]);
      case /* Int64_ty */5 :
          return /* Int64_ty */Block.__(5, [erase_rel(param[0])]);
      case /* Float_ty */6 :
          return /* Float_ty */Block.__(6, [erase_rel(param[0])]);
      case /* Bool_ty */7 :
          return /* Bool_ty */Block.__(7, [erase_rel(param[0])]);
      case /* Format_arg_ty */8 :
          return /* Format_arg_ty */Block.__(8, [
                    param[0],
                    erase_rel(param[1])
                  ]);
      case /* Format_subst_ty */9 :
          var ty1 = param[0];
          return /* Format_subst_ty */Block.__(9, [
                    ty1,
                    ty1,
                    erase_rel(param[2])
                  ]);
      case /* Alpha_ty */10 :
          return /* Alpha_ty */Block.__(10, [erase_rel(param[0])]);
      case /* Theta_ty */11 :
          return /* Theta_ty */Block.__(11, [erase_rel(param[0])]);
      case /* Any_ty */12 :
          return /* Any_ty */Block.__(12, [erase_rel(param[0])]);
      case /* Reader_ty */13 :
          return /* Reader_ty */Block.__(13, [erase_rel(param[0])]);
      case /* Ignored_reader_ty */14 :
          return /* Ignored_reader_ty */Block.__(14, [erase_rel(param[0])]);
      
    }
  }
}

function concat_fmtty(fmtty1, fmtty2) {
  if (typeof fmtty1 === "number") {
    return fmtty2;
  } else {
    switch (fmtty1.tag | 0) {
      case /* Char_ty */0 :
          return /* Char_ty */Block.__(0, [concat_fmtty(fmtty1[0], fmtty2)]);
      case /* String_ty */1 :
          return /* String_ty */Block.__(1, [concat_fmtty(fmtty1[0], fmtty2)]);
      case /* Int_ty */2 :
          return /* Int_ty */Block.__(2, [concat_fmtty(fmtty1[0], fmtty2)]);
      case /* Int32_ty */3 :
          return /* Int32_ty */Block.__(3, [concat_fmtty(fmtty1[0], fmtty2)]);
      case /* Nativeint_ty */4 :
          return /* Nativeint_ty */Block.__(4, [concat_fmtty(fmtty1[0], fmtty2)]);
      case /* Int64_ty */5 :
          return /* Int64_ty */Block.__(5, [concat_fmtty(fmtty1[0], fmtty2)]);
      case /* Float_ty */6 :
          return /* Float_ty */Block.__(6, [concat_fmtty(fmtty1[0], fmtty2)]);
      case /* Bool_ty */7 :
          return /* Bool_ty */Block.__(7, [concat_fmtty(fmtty1[0], fmtty2)]);
      case /* Format_arg_ty */8 :
          return /* Format_arg_ty */Block.__(8, [
                    fmtty1[0],
                    concat_fmtty(fmtty1[1], fmtty2)
                  ]);
      case /* Format_subst_ty */9 :
          return /* Format_subst_ty */Block.__(9, [
                    fmtty1[0],
                    fmtty1[1],
                    concat_fmtty(fmtty1[2], fmtty2)
                  ]);
      case /* Alpha_ty */10 :
          return /* Alpha_ty */Block.__(10, [concat_fmtty(fmtty1[0], fmtty2)]);
      case /* Theta_ty */11 :
          return /* Theta_ty */Block.__(11, [concat_fmtty(fmtty1[0], fmtty2)]);
      case /* Any_ty */12 :
          return /* Any_ty */Block.__(12, [concat_fmtty(fmtty1[0], fmtty2)]);
      case /* Reader_ty */13 :
          return /* Reader_ty */Block.__(13, [concat_fmtty(fmtty1[0], fmtty2)]);
      case /* Ignored_reader_ty */14 :
          return /* Ignored_reader_ty */Block.__(14, [concat_fmtty(fmtty1[0], fmtty2)]);
      
    }
  }
}

function concat_fmt(fmt1, fmt2) {
  if (typeof fmt1 === "number") {
    return fmt2;
  } else {
    switch (fmt1.tag | 0) {
      case /* Char */0 :
          return /* Char */Block.__(0, [concat_fmt(fmt1[0], fmt2)]);
      case /* Caml_char */1 :
          return /* Caml_char */Block.__(1, [concat_fmt(fmt1[0], fmt2)]);
      case /* String */2 :
          return /* String */Block.__(2, [
                    fmt1[0],
                    concat_fmt(fmt1[1], fmt2)
                  ]);
      case /* Caml_string */3 :
          return /* Caml_string */Block.__(3, [
                    fmt1[0],
                    concat_fmt(fmt1[1], fmt2)
                  ]);
      case /* Int */4 :
          return /* Int */Block.__(4, [
                    fmt1[0],
                    fmt1[1],
                    fmt1[2],
                    concat_fmt(fmt1[3], fmt2)
                  ]);
      case /* Int32 */5 :
          return /* Int32 */Block.__(5, [
                    fmt1[0],
                    fmt1[1],
                    fmt1[2],
                    concat_fmt(fmt1[3], fmt2)
                  ]);
      case /* Nativeint */6 :
          return /* Nativeint */Block.__(6, [
                    fmt1[0],
                    fmt1[1],
                    fmt1[2],
                    concat_fmt(fmt1[3], fmt2)
                  ]);
      case /* Int64 */7 :
          return /* Int64 */Block.__(7, [
                    fmt1[0],
                    fmt1[1],
                    fmt1[2],
                    concat_fmt(fmt1[3], fmt2)
                  ]);
      case /* Float */8 :
          return /* Float */Block.__(8, [
                    fmt1[0],
                    fmt1[1],
                    fmt1[2],
                    concat_fmt(fmt1[3], fmt2)
                  ]);
      case /* Bool */9 :
          return /* Bool */Block.__(9, [
                    fmt1[0],
                    concat_fmt(fmt1[1], fmt2)
                  ]);
      case /* Flush */10 :
          return /* Flush */Block.__(10, [concat_fmt(fmt1[0], fmt2)]);
      case /* String_literal */11 :
          return /* String_literal */Block.__(11, [
                    fmt1[0],
                    concat_fmt(fmt1[1], fmt2)
                  ]);
      case /* Char_literal */12 :
          return /* Char_literal */Block.__(12, [
                    fmt1[0],
                    concat_fmt(fmt1[1], fmt2)
                  ]);
      case /* Format_arg */13 :
          return /* Format_arg */Block.__(13, [
                    fmt1[0],
                    fmt1[1],
                    concat_fmt(fmt1[2], fmt2)
                  ]);
      case /* Format_subst */14 :
          return /* Format_subst */Block.__(14, [
                    fmt1[0],
                    fmt1[1],
                    concat_fmt(fmt1[2], fmt2)
                  ]);
      case /* Alpha */15 :
          return /* Alpha */Block.__(15, [concat_fmt(fmt1[0], fmt2)]);
      case /* Theta */16 :
          return /* Theta */Block.__(16, [concat_fmt(fmt1[0], fmt2)]);
      case /* Formatting_lit */17 :
          return /* Formatting_lit */Block.__(17, [
                    fmt1[0],
                    concat_fmt(fmt1[1], fmt2)
                  ]);
      case /* Formatting_gen */18 :
          return /* Formatting_gen */Block.__(18, [
                    fmt1[0],
                    concat_fmt(fmt1[1], fmt2)
                  ]);
      case /* Reader */19 :
          return /* Reader */Block.__(19, [concat_fmt(fmt1[0], fmt2)]);
      case /* Scan_char_set */20 :
          return /* Scan_char_set */Block.__(20, [
                    fmt1[0],
                    fmt1[1],
                    concat_fmt(fmt1[2], fmt2)
                  ]);
      case /* Scan_get_counter */21 :
          return /* Scan_get_counter */Block.__(21, [
                    fmt1[0],
                    concat_fmt(fmt1[1], fmt2)
                  ]);
      case /* Scan_next_char */22 :
          return /* Scan_next_char */Block.__(22, [concat_fmt(fmt1[0], fmt2)]);
      case /* Ignored_param */23 :
          return /* Ignored_param */Block.__(23, [
                    fmt1[0],
                    concat_fmt(fmt1[1], fmt2)
                  ]);
      case /* Custom */24 :
          return /* Custom */Block.__(24, [
                    fmt1[0],
                    fmt1[1],
                    concat_fmt(fmt1[2], fmt2)
                  ]);
      
    }
  }
}

exports.concat_fmtty = concat_fmtty;
exports.erase_rel = erase_rel;
exports.concat_fmt = concat_fmt;
/* No side effect */

},{"./block.js":2}],23:[function(require,module,exports){
'use strict';

var Caml_bytes = require("./caml_bytes.js");
var Caml_builtin_exceptions = require("./caml_builtin_exceptions.js");

function chr(n) {
  if (n < 0 || n > 255) {
    throw [
          Caml_builtin_exceptions.invalid_argument,
          "Char.chr"
        ];
  }
  return n;
}

function escaped(c) {
  var exit = 0;
  if (c >= 40) {
    if (c !== 92) {
      exit = c >= 127 ? 1 : 2;
    } else {
      return "\\\\";
    }
  } else if (c >= 32) {
    if (c >= 39) {
      return "\\'";
    } else {
      exit = 2;
    }
  } else if (c >= 14) {
    exit = 1;
  } else {
    switch (c) {
      case 8 :
          return "\\b";
      case 9 :
          return "\\t";
      case 10 :
          return "\\n";
      case 0 :
      case 1 :
      case 2 :
      case 3 :
      case 4 :
      case 5 :
      case 6 :
      case 7 :
      case 11 :
      case 12 :
          exit = 1;
          break;
      case 13 :
          return "\\r";
      
    }
  }
  switch (exit) {
    case 1 :
        var s = [
          0,
          0,
          0,
          0
        ];
        s[0] = /* "\\" */92;
        s[1] = 48 + (c / 100 | 0) | 0;
        s[2] = 48 + (c / 10 | 0) % 10 | 0;
        s[3] = 48 + c % 10 | 0;
        return Caml_bytes.bytes_to_string(s);
    case 2 :
        var s$1 = [0];
        s$1[0] = c;
        return Caml_bytes.bytes_to_string(s$1);
    
  }
}

function lowercase(c) {
  if (c >= /* "A" */65 && c <= /* "Z" */90 || c >= /* "\192" */192 && c <= /* "\214" */214 || c >= /* "\216" */216 && c <= /* "\222" */222) {
    return c + 32 | 0;
  } else {
    return c;
  }
}

function uppercase(c) {
  if (c >= /* "a" */97 && c <= /* "z" */122 || c >= /* "\224" */224 && c <= /* "\246" */246 || c >= /* "\248" */248 && c <= /* "\254" */254) {
    return c - 32 | 0;
  } else {
    return c;
  }
}

function lowercase_ascii(c) {
  if (c >= /* "A" */65 && c <= /* "Z" */90) {
    return c + 32 | 0;
  } else {
    return c;
  }
}

function uppercase_ascii(c) {
  if (c >= /* "a" */97 && c <= /* "z" */122) {
    return c - 32 | 0;
  } else {
    return c;
  }
}

function compare(c1, c2) {
  return c1 - c2 | 0;
}

function equal(c1, c2) {
  return (c1 - c2 | 0) === 0;
}

exports.chr = chr;
exports.escaped = escaped;
exports.lowercase = lowercase;
exports.uppercase = uppercase;
exports.lowercase_ascii = lowercase_ascii;
exports.uppercase_ascii = uppercase_ascii;
exports.compare = compare;
exports.equal = equal;
/* No side effect */

},{"./caml_builtin_exceptions.js":6,"./caml_bytes.js":7}],24:[function(require,module,exports){
'use strict';

var Caml_array = require("./caml_array.js");

function app(_f, _args) {
  while(true) {
    var args = _args;
    var f = _f;
    var init_arity = f.length;
    var arity = init_arity === 0 ? 1 : init_arity;
    var len = args.length;
    var d = arity - len | 0;
    if (d === 0) {
      return f.apply(null, args);
    } else if (d < 0) {
      _args = Caml_array.caml_array_sub(args, arity, -d | 0);
      _f = f.apply(null, Caml_array.caml_array_sub(args, 0, arity));
      continue ;
    } else {
      return (function(f,args){
      return function (x) {
        return app(f, args.concat(/* array */[x]));
      }
      }(f,args));
    }
  };
}

function curry_1(o, a0, arity) {
  switch (arity) {
    case 1 :
        return o(a0);
    case 2 :
        return (function (param) {
            return o(a0, param);
          });
    case 3 :
        return (function (param, param$1) {
            return o(a0, param, param$1);
          });
    case 4 :
        return (function (param, param$1, param$2) {
            return o(a0, param, param$1, param$2);
          });
    case 5 :
        return (function (param, param$1, param$2, param$3) {
            return o(a0, param, param$1, param$2, param$3);
          });
    case 6 :
        return (function (param, param$1, param$2, param$3, param$4) {
            return o(a0, param, param$1, param$2, param$3, param$4);
          });
    case 7 :
        return (function (param, param$1, param$2, param$3, param$4, param$5) {
            return o(a0, param, param$1, param$2, param$3, param$4, param$5);
          });
    default:
      return app(o, /* array */[a0]);
  }
}

function _1(o, a0) {
  var arity = o.length;
  if (arity === 1) {
    return o(a0);
  } else {
    return curry_1(o, a0, arity);
  }
}

function __1(o) {
  var arity = o.length;
  if (arity === 1) {
    return o;
  } else {
    return (function (a0) {
        return _1(o, a0);
      });
  }
}

function curry_2(o, a0, a1, arity) {
  switch (arity) {
    case 1 :
        return app(o(a0), /* array */[a1]);
    case 2 :
        return o(a0, a1);
    case 3 :
        return (function (param) {
            return o(a0, a1, param);
          });
    case 4 :
        return (function (param, param$1) {
            return o(a0, a1, param, param$1);
          });
    case 5 :
        return (function (param, param$1, param$2) {
            return o(a0, a1, param, param$1, param$2);
          });
    case 6 :
        return (function (param, param$1, param$2, param$3) {
            return o(a0, a1, param, param$1, param$2, param$3);
          });
    case 7 :
        return (function (param, param$1, param$2, param$3, param$4) {
            return o(a0, a1, param, param$1, param$2, param$3, param$4);
          });
    default:
      return app(o, /* array */[
                  a0,
                  a1
                ]);
  }
}

function _2(o, a0, a1) {
  var arity = o.length;
  if (arity === 2) {
    return o(a0, a1);
  } else {
    return curry_2(o, a0, a1, arity);
  }
}

function __2(o) {
  var arity = o.length;
  if (arity === 2) {
    return o;
  } else {
    return (function (a0, a1) {
        return _2(o, a0, a1);
      });
  }
}

function curry_3(o, a0, a1, a2, arity) {
  switch (arity) {
    case 1 :
        return app(o(a0), /* array */[
                    a1,
                    a2
                  ]);
    case 2 :
        return app(o(a0, a1), /* array */[a2]);
    case 3 :
        return o(a0, a1, a2);
    case 4 :
        return (function (param) {
            return o(a0, a1, a2, param);
          });
    case 5 :
        return (function (param, param$1) {
            return o(a0, a1, a2, param, param$1);
          });
    case 6 :
        return (function (param, param$1, param$2) {
            return o(a0, a1, a2, param, param$1, param$2);
          });
    case 7 :
        return (function (param, param$1, param$2, param$3) {
            return o(a0, a1, a2, param, param$1, param$2, param$3);
          });
    default:
      return app(o, /* array */[
                  a0,
                  a1,
                  a2
                ]);
  }
}

function _3(o, a0, a1, a2) {
  var arity = o.length;
  if (arity === 3) {
    return o(a0, a1, a2);
  } else {
    return curry_3(o, a0, a1, a2, arity);
  }
}

function __3(o) {
  var arity = o.length;
  if (arity === 3) {
    return o;
  } else {
    return (function (a0, a1, a2) {
        return _3(o, a0, a1, a2);
      });
  }
}

function curry_4(o, a0, a1, a2, a3, arity) {
  switch (arity) {
    case 1 :
        return app(o(a0), /* array */[
                    a1,
                    a2,
                    a3
                  ]);
    case 2 :
        return app(o(a0, a1), /* array */[
                    a2,
                    a3
                  ]);
    case 3 :
        return app(o(a0, a1, a2), /* array */[a3]);
    case 4 :
        return o(a0, a1, a2, a3);
    case 5 :
        return (function (param) {
            return o(a0, a1, a2, a3, param);
          });
    case 6 :
        return (function (param, param$1) {
            return o(a0, a1, a2, a3, param, param$1);
          });
    case 7 :
        return (function (param, param$1, param$2) {
            return o(a0, a1, a2, a3, param, param$1, param$2);
          });
    default:
      return app(o, /* array */[
                  a0,
                  a1,
                  a2,
                  a3
                ]);
  }
}

function _4(o, a0, a1, a2, a3) {
  var arity = o.length;
  if (arity === 4) {
    return o(a0, a1, a2, a3);
  } else {
    return curry_4(o, a0, a1, a2, a3, arity);
  }
}

function __4(o) {
  var arity = o.length;
  if (arity === 4) {
    return o;
  } else {
    return (function (a0, a1, a2, a3) {
        return _4(o, a0, a1, a2, a3);
      });
  }
}

function curry_5(o, a0, a1, a2, a3, a4, arity) {
  switch (arity) {
    case 1 :
        return app(o(a0), /* array */[
                    a1,
                    a2,
                    a3,
                    a4
                  ]);
    case 2 :
        return app(o(a0, a1), /* array */[
                    a2,
                    a3,
                    a4
                  ]);
    case 3 :
        return app(o(a0, a1, a2), /* array */[
                    a3,
                    a4
                  ]);
    case 4 :
        return app(o(a0, a1, a2, a3), /* array */[a4]);
    case 5 :
        return o(a0, a1, a2, a3, a4);
    case 6 :
        return (function (param) {
            return o(a0, a1, a2, a3, a4, param);
          });
    case 7 :
        return (function (param, param$1) {
            return o(a0, a1, a2, a3, a4, param, param$1);
          });
    default:
      return app(o, /* array */[
                  a0,
                  a1,
                  a2,
                  a3,
                  a4
                ]);
  }
}

function _5(o, a0, a1, a2, a3, a4) {
  var arity = o.length;
  if (arity === 5) {
    return o(a0, a1, a2, a3, a4);
  } else {
    return curry_5(o, a0, a1, a2, a3, a4, arity);
  }
}

function __5(o) {
  var arity = o.length;
  if (arity === 5) {
    return o;
  } else {
    return (function (a0, a1, a2, a3, a4) {
        return _5(o, a0, a1, a2, a3, a4);
      });
  }
}

function curry_6(o, a0, a1, a2, a3, a4, a5, arity) {
  switch (arity) {
    case 1 :
        return app(o(a0), /* array */[
                    a1,
                    a2,
                    a3,
                    a4,
                    a5
                  ]);
    case 2 :
        return app(o(a0, a1), /* array */[
                    a2,
                    a3,
                    a4,
                    a5
                  ]);
    case 3 :
        return app(o(a0, a1, a2), /* array */[
                    a3,
                    a4,
                    a5
                  ]);
    case 4 :
        return app(o(a0, a1, a2, a3), /* array */[
                    a4,
                    a5
                  ]);
    case 5 :
        return app(o(a0, a1, a2, a3, a4), /* array */[a5]);
    case 6 :
        return o(a0, a1, a2, a3, a4, a5);
    case 7 :
        return (function (param) {
            return o(a0, a1, a2, a3, a4, a5, param);
          });
    default:
      return app(o, /* array */[
                  a0,
                  a1,
                  a2,
                  a3,
                  a4,
                  a5
                ]);
  }
}

function _6(o, a0, a1, a2, a3, a4, a5) {
  var arity = o.length;
  if (arity === 6) {
    return o(a0, a1, a2, a3, a4, a5);
  } else {
    return curry_6(o, a0, a1, a2, a3, a4, a5, arity);
  }
}

function __6(o) {
  var arity = o.length;
  if (arity === 6) {
    return o;
  } else {
    return (function (a0, a1, a2, a3, a4, a5) {
        return _6(o, a0, a1, a2, a3, a4, a5);
      });
  }
}

function curry_7(o, a0, a1, a2, a3, a4, a5, a6, arity) {
  switch (arity) {
    case 1 :
        return app(o(a0), /* array */[
                    a1,
                    a2,
                    a3,
                    a4,
                    a5,
                    a6
                  ]);
    case 2 :
        return app(o(a0, a1), /* array */[
                    a2,
                    a3,
                    a4,
                    a5,
                    a6
                  ]);
    case 3 :
        return app(o(a0, a1, a2), /* array */[
                    a3,
                    a4,
                    a5,
                    a6
                  ]);
    case 4 :
        return app(o(a0, a1, a2, a3), /* array */[
                    a4,
                    a5,
                    a6
                  ]);
    case 5 :
        return app(o(a0, a1, a2, a3, a4), /* array */[
                    a5,
                    a6
                  ]);
    case 6 :
        return app(o(a0, a1, a2, a3, a4, a5), /* array */[a6]);
    case 7 :
        return o(a0, a1, a2, a3, a4, a5, a6);
    default:
      return app(o, /* array */[
                  a0,
                  a1,
                  a2,
                  a3,
                  a4,
                  a5,
                  a6
                ]);
  }
}

function _7(o, a0, a1, a2, a3, a4, a5, a6) {
  var arity = o.length;
  if (arity === 7) {
    return o(a0, a1, a2, a3, a4, a5, a6);
  } else {
    return curry_7(o, a0, a1, a2, a3, a4, a5, a6, arity);
  }
}

function __7(o) {
  var arity = o.length;
  if (arity === 7) {
    return o;
  } else {
    return (function (a0, a1, a2, a3, a4, a5, a6) {
        return _7(o, a0, a1, a2, a3, a4, a5, a6);
      });
  }
}

function curry_8(o, a0, a1, a2, a3, a4, a5, a6, a7, arity) {
  switch (arity) {
    case 1 :
        return app(o(a0), /* array */[
                    a1,
                    a2,
                    a3,
                    a4,
                    a5,
                    a6,
                    a7
                  ]);
    case 2 :
        return app(o(a0, a1), /* array */[
                    a2,
                    a3,
                    a4,
                    a5,
                    a6,
                    a7
                  ]);
    case 3 :
        return app(o(a0, a1, a2), /* array */[
                    a3,
                    a4,
                    a5,
                    a6,
                    a7
                  ]);
    case 4 :
        return app(o(a0, a1, a2, a3), /* array */[
                    a4,
                    a5,
                    a6,
                    a7
                  ]);
    case 5 :
        return app(o(a0, a1, a2, a3, a4), /* array */[
                    a5,
                    a6,
                    a7
                  ]);
    case 6 :
        return app(o(a0, a1, a2, a3, a4, a5), /* array */[
                    a6,
                    a7
                  ]);
    case 7 :
        return app(o(a0, a1, a2, a3, a4, a5, a6), /* array */[a7]);
    default:
      return app(o, /* array */[
                  a0,
                  a1,
                  a2,
                  a3,
                  a4,
                  a5,
                  a6,
                  a7
                ]);
  }
}

function _8(o, a0, a1, a2, a3, a4, a5, a6, a7) {
  var arity = o.length;
  if (arity === 8) {
    return o(a0, a1, a2, a3, a4, a5, a6, a7);
  } else {
    return curry_8(o, a0, a1, a2, a3, a4, a5, a6, a7, arity);
  }
}

function __8(o) {
  var arity = o.length;
  if (arity === 8) {
    return o;
  } else {
    return (function (a0, a1, a2, a3, a4, a5, a6, a7) {
        return _8(o, a0, a1, a2, a3, a4, a5, a6, a7);
      });
  }
}

exports.app = app;
exports.curry_1 = curry_1;
exports._1 = _1;
exports.__1 = __1;
exports.curry_2 = curry_2;
exports._2 = _2;
exports.__2 = __2;
exports.curry_3 = curry_3;
exports._3 = _3;
exports.__3 = __3;
exports.curry_4 = curry_4;
exports._4 = _4;
exports.__4 = __4;
exports.curry_5 = curry_5;
exports._5 = _5;
exports.__5 = __5;
exports.curry_6 = curry_6;
exports._6 = _6;
exports.__6 = __6;
exports.curry_7 = curry_7;
exports._7 = _7;
exports.__7 = __7;
exports.curry_8 = curry_8;
exports._8 = _8;
exports.__8 = __8;
/* No side effect */

},{"./caml_array.js":5}],25:[function(require,module,exports){
'use strict';

var Curry = require("./curry.js");
var Caml_obj = require("./caml_obj.js");
var Pervasives = require("./pervasives.js");
var Caml_option = require("./caml_option.js");
var Caml_builtin_exceptions = require("./caml_builtin_exceptions.js");

function length(l) {
  var _len = 0;
  var _param = l;
  while(true) {
    var param = _param;
    var len = _len;
    if (param) {
      _param = param[1];
      _len = len + 1 | 0;
      continue ;
    } else {
      return len;
    }
  };
}

function cons(a, l) {
  return /* :: */[
          a,
          l
        ];
}

function hd(param) {
  if (param) {
    return param[0];
  } else {
    throw [
          Caml_builtin_exceptions.failure,
          "hd"
        ];
  }
}

function tl(param) {
  if (param) {
    return param[1];
  } else {
    throw [
          Caml_builtin_exceptions.failure,
          "tl"
        ];
  }
}

function nth(l, n) {
  if (n < 0) {
    throw [
          Caml_builtin_exceptions.invalid_argument,
          "List.nth"
        ];
  }
  var _l = l;
  var _n = n;
  while(true) {
    var n$1 = _n;
    var l$1 = _l;
    if (l$1) {
      if (n$1 === 0) {
        return l$1[0];
      } else {
        _n = n$1 - 1 | 0;
        _l = l$1[1];
        continue ;
      }
    } else {
      throw [
            Caml_builtin_exceptions.failure,
            "nth"
          ];
    }
  };
}

function nth_opt(l, n) {
  if (n < 0) {
    throw [
          Caml_builtin_exceptions.invalid_argument,
          "List.nth"
        ];
  }
  var _l = l;
  var _n = n;
  while(true) {
    var n$1 = _n;
    var l$1 = _l;
    if (l$1) {
      if (n$1 === 0) {
        return Caml_option.some(l$1[0]);
      } else {
        _n = n$1 - 1 | 0;
        _l = l$1[1];
        continue ;
      }
    } else {
      return ;
    }
  };
}

function rev_append(_l1, _l2) {
  while(true) {
    var l2 = _l2;
    var l1 = _l1;
    if (l1) {
      _l2 = /* :: */[
        l1[0],
        l2
      ];
      _l1 = l1[1];
      continue ;
    } else {
      return l2;
    }
  };
}

function rev(l) {
  return rev_append(l, /* [] */0);
}

function init_tailrec_aux(_acc, _i, n, f) {
  while(true) {
    var i = _i;
    var acc = _acc;
    if (i >= n) {
      return acc;
    } else {
      _i = i + 1 | 0;
      _acc = /* :: */[
        Curry._1(f, i),
        acc
      ];
      continue ;
    }
  };
}

function init_aux(i, n, f) {
  if (i >= n) {
    return /* [] */0;
  } else {
    var r = Curry._1(f, i);
    return /* :: */[
            r,
            init_aux(i + 1 | 0, n, f)
          ];
  }
}

function init(len, f) {
  if (len < 0) {
    throw [
          Caml_builtin_exceptions.invalid_argument,
          "List.init"
        ];
  }
  if (len > 10000) {
    return rev_append(init_tailrec_aux(/* [] */0, 0, len, f), /* [] */0);
  } else {
    return init_aux(0, len, f);
  }
}

function flatten(param) {
  if (param) {
    return Pervasives.$at(param[0], flatten(param[1]));
  } else {
    return /* [] */0;
  }
}

function map(f, param) {
  if (param) {
    var r = Curry._1(f, param[0]);
    return /* :: */[
            r,
            map(f, param[1])
          ];
  } else {
    return /* [] */0;
  }
}

function mapi(i, f, param) {
  if (param) {
    var r = Curry._2(f, i, param[0]);
    return /* :: */[
            r,
            mapi(i + 1 | 0, f, param[1])
          ];
  } else {
    return /* [] */0;
  }
}

function mapi$1(f, l) {
  return mapi(0, f, l);
}

function rev_map(f, l) {
  var _accu = /* [] */0;
  var _param = l;
  while(true) {
    var param = _param;
    var accu = _accu;
    if (param) {
      _param = param[1];
      _accu = /* :: */[
        Curry._1(f, param[0]),
        accu
      ];
      continue ;
    } else {
      return accu;
    }
  };
}

function iter(f, _param) {
  while(true) {
    var param = _param;
    if (param) {
      Curry._1(f, param[0]);
      _param = param[1];
      continue ;
    } else {
      return /* () */0;
    }
  };
}

function iteri(f, l) {
  var _i = 0;
  var f$1 = f;
  var _param = l;
  while(true) {
    var param = _param;
    var i = _i;
    if (param) {
      Curry._2(f$1, i, param[0]);
      _param = param[1];
      _i = i + 1 | 0;
      continue ;
    } else {
      return /* () */0;
    }
  };
}

function fold_left(f, _accu, _l) {
  while(true) {
    var l = _l;
    var accu = _accu;
    if (l) {
      _l = l[1];
      _accu = Curry._2(f, accu, l[0]);
      continue ;
    } else {
      return accu;
    }
  };
}

function fold_right(f, l, accu) {
  if (l) {
    return Curry._2(f, l[0], fold_right(f, l[1], accu));
  } else {
    return accu;
  }
}

function map2(f, l1, l2) {
  if (l1) {
    if (l2) {
      var r = Curry._2(f, l1[0], l2[0]);
      return /* :: */[
              r,
              map2(f, l1[1], l2[1])
            ];
    } else {
      throw [
            Caml_builtin_exceptions.invalid_argument,
            "List.map2"
          ];
    }
  } else if (l2) {
    throw [
          Caml_builtin_exceptions.invalid_argument,
          "List.map2"
        ];
  } else {
    return /* [] */0;
  }
}

function rev_map2(f, l1, l2) {
  var _accu = /* [] */0;
  var _l1 = l1;
  var _l2 = l2;
  while(true) {
    var l2$1 = _l2;
    var l1$1 = _l1;
    var accu = _accu;
    if (l1$1) {
      if (l2$1) {
        _l2 = l2$1[1];
        _l1 = l1$1[1];
        _accu = /* :: */[
          Curry._2(f, l1$1[0], l2$1[0]),
          accu
        ];
        continue ;
      } else {
        throw [
              Caml_builtin_exceptions.invalid_argument,
              "List.rev_map2"
            ];
      }
    } else {
      if (l2$1) {
        throw [
              Caml_builtin_exceptions.invalid_argument,
              "List.rev_map2"
            ];
      }
      return accu;
    }
  };
}

function iter2(f, _l1, _l2) {
  while(true) {
    var l2 = _l2;
    var l1 = _l1;
    if (l1) {
      if (l2) {
        Curry._2(f, l1[0], l2[0]);
        _l2 = l2[1];
        _l1 = l1[1];
        continue ;
      } else {
        throw [
              Caml_builtin_exceptions.invalid_argument,
              "List.iter2"
            ];
      }
    } else if (l2) {
      throw [
            Caml_builtin_exceptions.invalid_argument,
            "List.iter2"
          ];
    } else {
      return /* () */0;
    }
  };
}

function fold_left2(f, _accu, _l1, _l2) {
  while(true) {
    var l2 = _l2;
    var l1 = _l1;
    var accu = _accu;
    if (l1) {
      if (l2) {
        _l2 = l2[1];
        _l1 = l1[1];
        _accu = Curry._3(f, accu, l1[0], l2[0]);
        continue ;
      } else {
        throw [
              Caml_builtin_exceptions.invalid_argument,
              "List.fold_left2"
            ];
      }
    } else {
      if (l2) {
        throw [
              Caml_builtin_exceptions.invalid_argument,
              "List.fold_left2"
            ];
      }
      return accu;
    }
  };
}

function fold_right2(f, l1, l2, accu) {
  if (l1) {
    if (l2) {
      return Curry._3(f, l1[0], l2[0], fold_right2(f, l1[1], l2[1], accu));
    } else {
      throw [
            Caml_builtin_exceptions.invalid_argument,
            "List.fold_right2"
          ];
    }
  } else {
    if (l2) {
      throw [
            Caml_builtin_exceptions.invalid_argument,
            "List.fold_right2"
          ];
    }
    return accu;
  }
}

function for_all(p, _param) {
  while(true) {
    var param = _param;
    if (param) {
      if (Curry._1(p, param[0])) {
        _param = param[1];
        continue ;
      } else {
        return false;
      }
    } else {
      return true;
    }
  };
}

function exists(p, _param) {
  while(true) {
    var param = _param;
    if (param) {
      if (Curry._1(p, param[0])) {
        return true;
      } else {
        _param = param[1];
        continue ;
      }
    } else {
      return false;
    }
  };
}

function for_all2(p, _l1, _l2) {
  while(true) {
    var l2 = _l2;
    var l1 = _l1;
    if (l1) {
      if (l2) {
        if (Curry._2(p, l1[0], l2[0])) {
          _l2 = l2[1];
          _l1 = l1[1];
          continue ;
        } else {
          return false;
        }
      } else {
        throw [
              Caml_builtin_exceptions.invalid_argument,
              "List.for_all2"
            ];
      }
    } else if (l2) {
      throw [
            Caml_builtin_exceptions.invalid_argument,
            "List.for_all2"
          ];
    } else {
      return true;
    }
  };
}

function exists2(p, _l1, _l2) {
  while(true) {
    var l2 = _l2;
    var l1 = _l1;
    if (l1) {
      if (l2) {
        if (Curry._2(p, l1[0], l2[0])) {
          return true;
        } else {
          _l2 = l2[1];
          _l1 = l1[1];
          continue ;
        }
      } else {
        throw [
              Caml_builtin_exceptions.invalid_argument,
              "List.exists2"
            ];
      }
    } else if (l2) {
      throw [
            Caml_builtin_exceptions.invalid_argument,
            "List.exists2"
          ];
    } else {
      return false;
    }
  };
}

function mem(x, _param) {
  while(true) {
    var param = _param;
    if (param) {
      if (Caml_obj.caml_equal(param[0], x)) {
        return true;
      } else {
        _param = param[1];
        continue ;
      }
    } else {
      return false;
    }
  };
}

function memq(x, _param) {
  while(true) {
    var param = _param;
    if (param) {
      if (param[0] === x) {
        return true;
      } else {
        _param = param[1];
        continue ;
      }
    } else {
      return false;
    }
  };
}

function assoc(x, _param) {
  while(true) {
    var param = _param;
    if (param) {
      var match = param[0];
      if (Caml_obj.caml_equal(match[0], x)) {
        return match[1];
      } else {
        _param = param[1];
        continue ;
      }
    } else {
      throw Caml_builtin_exceptions.not_found;
    }
  };
}

function assoc_opt(x, _param) {
  while(true) {
    var param = _param;
    if (param) {
      var match = param[0];
      if (Caml_obj.caml_equal(match[0], x)) {
        return Caml_option.some(match[1]);
      } else {
        _param = param[1];
        continue ;
      }
    } else {
      return ;
    }
  };
}

function assq(x, _param) {
  while(true) {
    var param = _param;
    if (param) {
      var match = param[0];
      if (match[0] === x) {
        return match[1];
      } else {
        _param = param[1];
        continue ;
      }
    } else {
      throw Caml_builtin_exceptions.not_found;
    }
  };
}

function assq_opt(x, _param) {
  while(true) {
    var param = _param;
    if (param) {
      var match = param[0];
      if (match[0] === x) {
        return Caml_option.some(match[1]);
      } else {
        _param = param[1];
        continue ;
      }
    } else {
      return ;
    }
  };
}

function mem_assoc(x, _param) {
  while(true) {
    var param = _param;
    if (param) {
      if (Caml_obj.caml_equal(param[0][0], x)) {
        return true;
      } else {
        _param = param[1];
        continue ;
      }
    } else {
      return false;
    }
  };
}

function mem_assq(x, _param) {
  while(true) {
    var param = _param;
    if (param) {
      if (param[0][0] === x) {
        return true;
      } else {
        _param = param[1];
        continue ;
      }
    } else {
      return false;
    }
  };
}

function remove_assoc(x, param) {
  if (param) {
    var l = param[1];
    var pair = param[0];
    if (Caml_obj.caml_equal(pair[0], x)) {
      return l;
    } else {
      return /* :: */[
              pair,
              remove_assoc(x, l)
            ];
    }
  } else {
    return /* [] */0;
  }
}

function remove_assq(x, param) {
  if (param) {
    var l = param[1];
    var pair = param[0];
    if (pair[0] === x) {
      return l;
    } else {
      return /* :: */[
              pair,
              remove_assq(x, l)
            ];
    }
  } else {
    return /* [] */0;
  }
}

function find(p, _param) {
  while(true) {
    var param = _param;
    if (param) {
      var x = param[0];
      if (Curry._1(p, x)) {
        return x;
      } else {
        _param = param[1];
        continue ;
      }
    } else {
      throw Caml_builtin_exceptions.not_found;
    }
  };
}

function find_opt(p, _param) {
  while(true) {
    var param = _param;
    if (param) {
      var x = param[0];
      if (Curry._1(p, x)) {
        return Caml_option.some(x);
      } else {
        _param = param[1];
        continue ;
      }
    } else {
      return ;
    }
  };
}

function find_all(p) {
  return (function (param) {
      var _accu = /* [] */0;
      var _param = param;
      while(true) {
        var param$1 = _param;
        var accu = _accu;
        if (param$1) {
          var l = param$1[1];
          var x = param$1[0];
          if (Curry._1(p, x)) {
            _param = l;
            _accu = /* :: */[
              x,
              accu
            ];
            continue ;
          } else {
            _param = l;
            continue ;
          }
        } else {
          return rev_append(accu, /* [] */0);
        }
      };
    });
}

function partition(p, l) {
  var _yes = /* [] */0;
  var _no = /* [] */0;
  var _param = l;
  while(true) {
    var param = _param;
    var no = _no;
    var yes = _yes;
    if (param) {
      var l$1 = param[1];
      var x = param[0];
      if (Curry._1(p, x)) {
        _param = l$1;
        _yes = /* :: */[
          x,
          yes
        ];
        continue ;
      } else {
        _param = l$1;
        _no = /* :: */[
          x,
          no
        ];
        continue ;
      }
    } else {
      return /* tuple */[
              rev_append(yes, /* [] */0),
              rev_append(no, /* [] */0)
            ];
    }
  };
}

function split(param) {
  if (param) {
    var match = param[0];
    var match$1 = split(param[1]);
    return /* tuple */[
            /* :: */[
              match[0],
              match$1[0]
            ],
            /* :: */[
              match[1],
              match$1[1]
            ]
          ];
  } else {
    return /* tuple */[
            /* [] */0,
            /* [] */0
          ];
  }
}

function combine(l1, l2) {
  if (l1) {
    if (l2) {
      return /* :: */[
              /* tuple */[
                l1[0],
                l2[0]
              ],
              combine(l1[1], l2[1])
            ];
    } else {
      throw [
            Caml_builtin_exceptions.invalid_argument,
            "List.combine"
          ];
    }
  } else if (l2) {
    throw [
          Caml_builtin_exceptions.invalid_argument,
          "List.combine"
        ];
  } else {
    return /* [] */0;
  }
}

function merge(cmp, l1, l2) {
  if (l1) {
    if (l2) {
      var h2 = l2[0];
      var h1 = l1[0];
      if (Curry._2(cmp, h1, h2) <= 0) {
        return /* :: */[
                h1,
                merge(cmp, l1[1], l2)
              ];
      } else {
        return /* :: */[
                h2,
                merge(cmp, l1, l2[1])
              ];
      }
    } else {
      return l1;
    }
  } else {
    return l2;
  }
}

function chop(_k, _l) {
  while(true) {
    var l = _l;
    var k = _k;
    if (k === 0) {
      return l;
    } else if (l) {
      _l = l[1];
      _k = k - 1 | 0;
      continue ;
    } else {
      throw [
            Caml_builtin_exceptions.assert_failure,
            /* tuple */[
              "list.ml",
              262,
              11
            ]
          ];
    }
  };
}

function stable_sort(cmp, l) {
  var sort = function (n, l) {
    if (n !== 2) {
      if (n === 3 && l) {
        var match = l[1];
        if (match) {
          var match$1 = match[1];
          if (match$1) {
            var x3 = match$1[0];
            var x2 = match[0];
            var x1 = l[0];
            if (Curry._2(cmp, x1, x2) <= 0) {
              if (Curry._2(cmp, x2, x3) <= 0) {
                return /* :: */[
                        x1,
                        /* :: */[
                          x2,
                          /* :: */[
                            x3,
                            /* [] */0
                          ]
                        ]
                      ];
              } else if (Curry._2(cmp, x1, x3) <= 0) {
                return /* :: */[
                        x1,
                        /* :: */[
                          x3,
                          /* :: */[
                            x2,
                            /* [] */0
                          ]
                        ]
                      ];
              } else {
                return /* :: */[
                        x3,
                        /* :: */[
                          x1,
                          /* :: */[
                            x2,
                            /* [] */0
                          ]
                        ]
                      ];
              }
            } else if (Curry._2(cmp, x1, x3) <= 0) {
              return /* :: */[
                      x2,
                      /* :: */[
                        x1,
                        /* :: */[
                          x3,
                          /* [] */0
                        ]
                      ]
                    ];
            } else if (Curry._2(cmp, x2, x3) <= 0) {
              return /* :: */[
                      x2,
                      /* :: */[
                        x3,
                        /* :: */[
                          x1,
                          /* [] */0
                        ]
                      ]
                    ];
            } else {
              return /* :: */[
                      x3,
                      /* :: */[
                        x2,
                        /* :: */[
                          x1,
                          /* [] */0
                        ]
                      ]
                    ];
            }
          }
          
        }
        
      }
      
    } else if (l) {
      var match$2 = l[1];
      if (match$2) {
        var x2$1 = match$2[0];
        var x1$1 = l[0];
        if (Curry._2(cmp, x1$1, x2$1) <= 0) {
          return /* :: */[
                  x1$1,
                  /* :: */[
                    x2$1,
                    /* [] */0
                  ]
                ];
        } else {
          return /* :: */[
                  x2$1,
                  /* :: */[
                    x1$1,
                    /* [] */0
                  ]
                ];
        }
      }
      
    }
    var n1 = (n >> 1);
    var n2 = n - n1 | 0;
    var l2 = chop(n1, l);
    var s1 = rev_sort(n1, l);
    var s2 = rev_sort(n2, l2);
    var _l1 = s1;
    var _l2 = s2;
    var _accu = /* [] */0;
    while(true) {
      var accu = _accu;
      var l2$1 = _l2;
      var l1 = _l1;
      if (l1) {
        if (l2$1) {
          var h2 = l2$1[0];
          var h1 = l1[0];
          if (Curry._2(cmp, h1, h2) > 0) {
            _accu = /* :: */[
              h1,
              accu
            ];
            _l1 = l1[1];
            continue ;
          } else {
            _accu = /* :: */[
              h2,
              accu
            ];
            _l2 = l2$1[1];
            continue ;
          }
        } else {
          return rev_append(l1, accu);
        }
      } else {
        return rev_append(l2$1, accu);
      }
    };
  };
  var rev_sort = function (n, l) {
    if (n !== 2) {
      if (n === 3 && l) {
        var match = l[1];
        if (match) {
          var match$1 = match[1];
          if (match$1) {
            var x3 = match$1[0];
            var x2 = match[0];
            var x1 = l[0];
            if (Curry._2(cmp, x1, x2) > 0) {
              if (Curry._2(cmp, x2, x3) > 0) {
                return /* :: */[
                        x1,
                        /* :: */[
                          x2,
                          /* :: */[
                            x3,
                            /* [] */0
                          ]
                        ]
                      ];
              } else if (Curry._2(cmp, x1, x3) > 0) {
                return /* :: */[
                        x1,
                        /* :: */[
                          x3,
                          /* :: */[
                            x2,
                            /* [] */0
                          ]
                        ]
                      ];
              } else {
                return /* :: */[
                        x3,
                        /* :: */[
                          x1,
                          /* :: */[
                            x2,
                            /* [] */0
                          ]
                        ]
                      ];
              }
            } else if (Curry._2(cmp, x1, x3) > 0) {
              return /* :: */[
                      x2,
                      /* :: */[
                        x1,
                        /* :: */[
                          x3,
                          /* [] */0
                        ]
                      ]
                    ];
            } else if (Curry._2(cmp, x2, x3) > 0) {
              return /* :: */[
                      x2,
                      /* :: */[
                        x3,
                        /* :: */[
                          x1,
                          /* [] */0
                        ]
                      ]
                    ];
            } else {
              return /* :: */[
                      x3,
                      /* :: */[
                        x2,
                        /* :: */[
                          x1,
                          /* [] */0
                        ]
                      ]
                    ];
            }
          }
          
        }
        
      }
      
    } else if (l) {
      var match$2 = l[1];
      if (match$2) {
        var x2$1 = match$2[0];
        var x1$1 = l[0];
        if (Curry._2(cmp, x1$1, x2$1) > 0) {
          return /* :: */[
                  x1$1,
                  /* :: */[
                    x2$1,
                    /* [] */0
                  ]
                ];
        } else {
          return /* :: */[
                  x2$1,
                  /* :: */[
                    x1$1,
                    /* [] */0
                  ]
                ];
        }
      }
      
    }
    var n1 = (n >> 1);
    var n2 = n - n1 | 0;
    var l2 = chop(n1, l);
    var s1 = sort(n1, l);
    var s2 = sort(n2, l2);
    var _l1 = s1;
    var _l2 = s2;
    var _accu = /* [] */0;
    while(true) {
      var accu = _accu;
      var l2$1 = _l2;
      var l1 = _l1;
      if (l1) {
        if (l2$1) {
          var h2 = l2$1[0];
          var h1 = l1[0];
          if (Curry._2(cmp, h1, h2) <= 0) {
            _accu = /* :: */[
              h1,
              accu
            ];
            _l1 = l1[1];
            continue ;
          } else {
            _accu = /* :: */[
              h2,
              accu
            ];
            _l2 = l2$1[1];
            continue ;
          }
        } else {
          return rev_append(l1, accu);
        }
      } else {
        return rev_append(l2$1, accu);
      }
    };
  };
  var len = length(l);
  if (len < 2) {
    return l;
  } else {
    return sort(len, l);
  }
}

function sort_uniq(cmp, l) {
  var sort = function (n, l) {
    if (n !== 2) {
      if (n === 3 && l) {
        var match = l[1];
        if (match) {
          var match$1 = match[1];
          if (match$1) {
            var x3 = match$1[0];
            var x2 = match[0];
            var x1 = l[0];
            var c = Curry._2(cmp, x1, x2);
            if (c === 0) {
              var c$1 = Curry._2(cmp, x2, x3);
              if (c$1 === 0) {
                return /* :: */[
                        x2,
                        /* [] */0
                      ];
              } else if (c$1 < 0) {
                return /* :: */[
                        x2,
                        /* :: */[
                          x3,
                          /* [] */0
                        ]
                      ];
              } else {
                return /* :: */[
                        x3,
                        /* :: */[
                          x2,
                          /* [] */0
                        ]
                      ];
              }
            } else if (c < 0) {
              var c$2 = Curry._2(cmp, x2, x3);
              if (c$2 === 0) {
                return /* :: */[
                        x1,
                        /* :: */[
                          x2,
                          /* [] */0
                        ]
                      ];
              } else if (c$2 < 0) {
                return /* :: */[
                        x1,
                        /* :: */[
                          x2,
                          /* :: */[
                            x3,
                            /* [] */0
                          ]
                        ]
                      ];
              } else {
                var c$3 = Curry._2(cmp, x1, x3);
                if (c$3 === 0) {
                  return /* :: */[
                          x1,
                          /* :: */[
                            x2,
                            /* [] */0
                          ]
                        ];
                } else if (c$3 < 0) {
                  return /* :: */[
                          x1,
                          /* :: */[
                            x3,
                            /* :: */[
                              x2,
                              /* [] */0
                            ]
                          ]
                        ];
                } else {
                  return /* :: */[
                          x3,
                          /* :: */[
                            x1,
                            /* :: */[
                              x2,
                              /* [] */0
                            ]
                          ]
                        ];
                }
              }
            } else {
              var c$4 = Curry._2(cmp, x1, x3);
              if (c$4 === 0) {
                return /* :: */[
                        x2,
                        /* :: */[
                          x1,
                          /* [] */0
                        ]
                      ];
              } else if (c$4 < 0) {
                return /* :: */[
                        x2,
                        /* :: */[
                          x1,
                          /* :: */[
                            x3,
                            /* [] */0
                          ]
                        ]
                      ];
              } else {
                var c$5 = Curry._2(cmp, x2, x3);
                if (c$5 === 0) {
                  return /* :: */[
                          x2,
                          /* :: */[
                            x1,
                            /* [] */0
                          ]
                        ];
                } else if (c$5 < 0) {
                  return /* :: */[
                          x2,
                          /* :: */[
                            x3,
                            /* :: */[
                              x1,
                              /* [] */0
                            ]
                          ]
                        ];
                } else {
                  return /* :: */[
                          x3,
                          /* :: */[
                            x2,
                            /* :: */[
                              x1,
                              /* [] */0
                            ]
                          ]
                        ];
                }
              }
            }
          }
          
        }
        
      }
      
    } else if (l) {
      var match$2 = l[1];
      if (match$2) {
        var x2$1 = match$2[0];
        var x1$1 = l[0];
        var c$6 = Curry._2(cmp, x1$1, x2$1);
        if (c$6 === 0) {
          return /* :: */[
                  x1$1,
                  /* [] */0
                ];
        } else if (c$6 < 0) {
          return /* :: */[
                  x1$1,
                  /* :: */[
                    x2$1,
                    /* [] */0
                  ]
                ];
        } else {
          return /* :: */[
                  x2$1,
                  /* :: */[
                    x1$1,
                    /* [] */0
                  ]
                ];
        }
      }
      
    }
    var n1 = (n >> 1);
    var n2 = n - n1 | 0;
    var l2 = chop(n1, l);
    var s1 = rev_sort(n1, l);
    var s2 = rev_sort(n2, l2);
    var _l1 = s1;
    var _l2 = s2;
    var _accu = /* [] */0;
    while(true) {
      var accu = _accu;
      var l2$1 = _l2;
      var l1 = _l1;
      if (l1) {
        if (l2$1) {
          var t2 = l2$1[1];
          var h2 = l2$1[0];
          var t1 = l1[1];
          var h1 = l1[0];
          var c$7 = Curry._2(cmp, h1, h2);
          if (c$7 === 0) {
            _accu = /* :: */[
              h1,
              accu
            ];
            _l2 = t2;
            _l1 = t1;
            continue ;
          } else if (c$7 > 0) {
            _accu = /* :: */[
              h1,
              accu
            ];
            _l1 = t1;
            continue ;
          } else {
            _accu = /* :: */[
              h2,
              accu
            ];
            _l2 = t2;
            continue ;
          }
        } else {
          return rev_append(l1, accu);
        }
      } else {
        return rev_append(l2$1, accu);
      }
    };
  };
  var rev_sort = function (n, l) {
    if (n !== 2) {
      if (n === 3 && l) {
        var match = l[1];
        if (match) {
          var match$1 = match[1];
          if (match$1) {
            var x3 = match$1[0];
            var x2 = match[0];
            var x1 = l[0];
            var c = Curry._2(cmp, x1, x2);
            if (c === 0) {
              var c$1 = Curry._2(cmp, x2, x3);
              if (c$1 === 0) {
                return /* :: */[
                        x2,
                        /* [] */0
                      ];
              } else if (c$1 > 0) {
                return /* :: */[
                        x2,
                        /* :: */[
                          x3,
                          /* [] */0
                        ]
                      ];
              } else {
                return /* :: */[
                        x3,
                        /* :: */[
                          x2,
                          /* [] */0
                        ]
                      ];
              }
            } else if (c > 0) {
              var c$2 = Curry._2(cmp, x2, x3);
              if (c$2 === 0) {
                return /* :: */[
                        x1,
                        /* :: */[
                          x2,
                          /* [] */0
                        ]
                      ];
              } else if (c$2 > 0) {
                return /* :: */[
                        x1,
                        /* :: */[
                          x2,
                          /* :: */[
                            x3,
                            /* [] */0
                          ]
                        ]
                      ];
              } else {
                var c$3 = Curry._2(cmp, x1, x3);
                if (c$3 === 0) {
                  return /* :: */[
                          x1,
                          /* :: */[
                            x2,
                            /* [] */0
                          ]
                        ];
                } else if (c$3 > 0) {
                  return /* :: */[
                          x1,
                          /* :: */[
                            x3,
                            /* :: */[
                              x2,
                              /* [] */0
                            ]
                          ]
                        ];
                } else {
                  return /* :: */[
                          x3,
                          /* :: */[
                            x1,
                            /* :: */[
                              x2,
                              /* [] */0
                            ]
                          ]
                        ];
                }
              }
            } else {
              var c$4 = Curry._2(cmp, x1, x3);
              if (c$4 === 0) {
                return /* :: */[
                        x2,
                        /* :: */[
                          x1,
                          /* [] */0
                        ]
                      ];
              } else if (c$4 > 0) {
                return /* :: */[
                        x2,
                        /* :: */[
                          x1,
                          /* :: */[
                            x3,
                            /* [] */0
                          ]
                        ]
                      ];
              } else {
                var c$5 = Curry._2(cmp, x2, x3);
                if (c$5 === 0) {
                  return /* :: */[
                          x2,
                          /* :: */[
                            x1,
                            /* [] */0
                          ]
                        ];
                } else if (c$5 > 0) {
                  return /* :: */[
                          x2,
                          /* :: */[
                            x3,
                            /* :: */[
                              x1,
                              /* [] */0
                            ]
                          ]
                        ];
                } else {
                  return /* :: */[
                          x3,
                          /* :: */[
                            x2,
                            /* :: */[
                              x1,
                              /* [] */0
                            ]
                          ]
                        ];
                }
              }
            }
          }
          
        }
        
      }
      
    } else if (l) {
      var match$2 = l[1];
      if (match$2) {
        var x2$1 = match$2[0];
        var x1$1 = l[0];
        var c$6 = Curry._2(cmp, x1$1, x2$1);
        if (c$6 === 0) {
          return /* :: */[
                  x1$1,
                  /* [] */0
                ];
        } else if (c$6 > 0) {
          return /* :: */[
                  x1$1,
                  /* :: */[
                    x2$1,
                    /* [] */0
                  ]
                ];
        } else {
          return /* :: */[
                  x2$1,
                  /* :: */[
                    x1$1,
                    /* [] */0
                  ]
                ];
        }
      }
      
    }
    var n1 = (n >> 1);
    var n2 = n - n1 | 0;
    var l2 = chop(n1, l);
    var s1 = sort(n1, l);
    var s2 = sort(n2, l2);
    var _l1 = s1;
    var _l2 = s2;
    var _accu = /* [] */0;
    while(true) {
      var accu = _accu;
      var l2$1 = _l2;
      var l1 = _l1;
      if (l1) {
        if (l2$1) {
          var t2 = l2$1[1];
          var h2 = l2$1[0];
          var t1 = l1[1];
          var h1 = l1[0];
          var c$7 = Curry._2(cmp, h1, h2);
          if (c$7 === 0) {
            _accu = /* :: */[
              h1,
              accu
            ];
            _l2 = t2;
            _l1 = t1;
            continue ;
          } else if (c$7 < 0) {
            _accu = /* :: */[
              h1,
              accu
            ];
            _l1 = t1;
            continue ;
          } else {
            _accu = /* :: */[
              h2,
              accu
            ];
            _l2 = t2;
            continue ;
          }
        } else {
          return rev_append(l1, accu);
        }
      } else {
        return rev_append(l2$1, accu);
      }
    };
  };
  var len = length(l);
  if (len < 2) {
    return l;
  } else {
    return sort(len, l);
  }
}

function compare_lengths(_l1, _l2) {
  while(true) {
    var l2 = _l2;
    var l1 = _l1;
    if (l1) {
      if (l2) {
        _l2 = l2[1];
        _l1 = l1[1];
        continue ;
      } else {
        return 1;
      }
    } else if (l2) {
      return -1;
    } else {
      return 0;
    }
  };
}

function compare_length_with(_l, _n) {
  while(true) {
    var n = _n;
    var l = _l;
    if (l) {
      if (n <= 0) {
        return 1;
      } else {
        _n = n - 1 | 0;
        _l = l[1];
        continue ;
      }
    } else if (n === 0) {
      return 0;
    } else if (n > 0) {
      return -1;
    } else {
      return 1;
    }
  };
}

var append = Pervasives.$at;

var concat = flatten;

var filter = find_all;

var sort = stable_sort;

var fast_sort = stable_sort;

exports.length = length;
exports.compare_lengths = compare_lengths;
exports.compare_length_with = compare_length_with;
exports.cons = cons;
exports.hd = hd;
exports.tl = tl;
exports.nth = nth;
exports.nth_opt = nth_opt;
exports.rev = rev;
exports.init = init;
exports.append = append;
exports.rev_append = rev_append;
exports.concat = concat;
exports.flatten = flatten;
exports.iter = iter;
exports.iteri = iteri;
exports.map = map;
exports.mapi = mapi$1;
exports.rev_map = rev_map;
exports.fold_left = fold_left;
exports.fold_right = fold_right;
exports.iter2 = iter2;
exports.map2 = map2;
exports.rev_map2 = rev_map2;
exports.fold_left2 = fold_left2;
exports.fold_right2 = fold_right2;
exports.for_all = for_all;
exports.exists = exists;
exports.for_all2 = for_all2;
exports.exists2 = exists2;
exports.mem = mem;
exports.memq = memq;
exports.find = find;
exports.find_opt = find_opt;
exports.filter = filter;
exports.find_all = find_all;
exports.partition = partition;
exports.assoc = assoc;
exports.assoc_opt = assoc_opt;
exports.assq = assq;
exports.assq_opt = assq_opt;
exports.mem_assoc = mem_assoc;
exports.mem_assq = mem_assq;
exports.remove_assoc = remove_assoc;
exports.remove_assq = remove_assq;
exports.split = split;
exports.combine = combine;
exports.sort = sort;
exports.stable_sort = stable_sort;
exports.fast_sort = fast_sort;
exports.sort_uniq = sort_uniq;
exports.merge = merge;
/* No side effect */

},{"./caml_builtin_exceptions.js":6,"./caml_obj.js":15,"./caml_option.js":16,"./curry.js":24,"./pervasives.js":27}],26:[function(require,module,exports){
'use strict';

var Curry = require("./curry.js");
var Caml_option = require("./caml_option.js");
var Caml_builtin_exceptions = require("./caml_builtin_exceptions.js");

function Make(funarg) {
  var height = function (param) {
    if (param) {
      return param[/* h */4];
    } else {
      return 0;
    }
  };
  var create = function (l, x, d, r) {
    var hl = height(l);
    var hr = height(r);
    return /* Node */[
            /* l */l,
            /* v */x,
            /* d */d,
            /* r */r,
            /* h */hl >= hr ? hl + 1 | 0 : hr + 1 | 0
          ];
  };
  var singleton = function (x, d) {
    return /* Node */[
            /* l : Empty */0,
            /* v */x,
            /* d */d,
            /* r : Empty */0,
            /* h */1
          ];
  };
  var bal = function (l, x, d, r) {
    var hl = l ? l[/* h */4] : 0;
    var hr = r ? r[/* h */4] : 0;
    if (hl > (hr + 2 | 0)) {
      if (l) {
        var lr = l[/* r */3];
        var ld = l[/* d */2];
        var lv = l[/* v */1];
        var ll = l[/* l */0];
        if (height(ll) >= height(lr)) {
          return create(ll, lv, ld, create(lr, x, d, r));
        } else if (lr) {
          return create(create(ll, lv, ld, lr[/* l */0]), lr[/* v */1], lr[/* d */2], create(lr[/* r */3], x, d, r));
        } else {
          throw [
                Caml_builtin_exceptions.invalid_argument,
                "Map.bal"
              ];
        }
      } else {
        throw [
              Caml_builtin_exceptions.invalid_argument,
              "Map.bal"
            ];
      }
    } else if (hr > (hl + 2 | 0)) {
      if (r) {
        var rr = r[/* r */3];
        var rd = r[/* d */2];
        var rv = r[/* v */1];
        var rl = r[/* l */0];
        if (height(rr) >= height(rl)) {
          return create(create(l, x, d, rl), rv, rd, rr);
        } else if (rl) {
          return create(create(l, x, d, rl[/* l */0]), rl[/* v */1], rl[/* d */2], create(rl[/* r */3], rv, rd, rr));
        } else {
          throw [
                Caml_builtin_exceptions.invalid_argument,
                "Map.bal"
              ];
        }
      } else {
        throw [
              Caml_builtin_exceptions.invalid_argument,
              "Map.bal"
            ];
      }
    } else {
      return /* Node */[
              /* l */l,
              /* v */x,
              /* d */d,
              /* r */r,
              /* h */hl >= hr ? hl + 1 | 0 : hr + 1 | 0
            ];
    }
  };
  var is_empty = function (param) {
    if (param) {
      return false;
    } else {
      return true;
    }
  };
  var add = function (x, data, m) {
    if (m) {
      var r = m[/* r */3];
      var d = m[/* d */2];
      var v = m[/* v */1];
      var l = m[/* l */0];
      var c = Curry._2(funarg.compare, x, v);
      if (c === 0) {
        if (d === data) {
          return m;
        } else {
          return /* Node */[
                  /* l */l,
                  /* v */x,
                  /* d */data,
                  /* r */r,
                  /* h */m[/* h */4]
                ];
        }
      } else if (c < 0) {
        var ll = add(x, data, l);
        if (l === ll) {
          return m;
        } else {
          return bal(ll, v, d, r);
        }
      } else {
        var rr = add(x, data, r);
        if (r === rr) {
          return m;
        } else {
          return bal(l, v, d, rr);
        }
      }
    } else {
      return /* Node */[
              /* l : Empty */0,
              /* v */x,
              /* d */data,
              /* r : Empty */0,
              /* h */1
            ];
    }
  };
  var find = function (x, _param) {
    while(true) {
      var param = _param;
      if (param) {
        var c = Curry._2(funarg.compare, x, param[/* v */1]);
        if (c === 0) {
          return param[/* d */2];
        } else {
          _param = c < 0 ? param[/* l */0] : param[/* r */3];
          continue ;
        }
      } else {
        throw Caml_builtin_exceptions.not_found;
      }
    };
  };
  var find_first = function (f, _param) {
    while(true) {
      var param = _param;
      if (param) {
        var v = param[/* v */1];
        if (Curry._1(f, v)) {
          var _v0 = v;
          var _d0 = param[/* d */2];
          var f$1 = f;
          var _param$1 = param[/* l */0];
          while(true) {
            var param$1 = _param$1;
            var d0 = _d0;
            var v0 = _v0;
            if (param$1) {
              var v$1 = param$1[/* v */1];
              if (Curry._1(f$1, v$1)) {
                _param$1 = param$1[/* l */0];
                _d0 = param$1[/* d */2];
                _v0 = v$1;
                continue ;
              } else {
                _param$1 = param$1[/* r */3];
                continue ;
              }
            } else {
              return /* tuple */[
                      v0,
                      d0
                    ];
            }
          };
        } else {
          _param = param[/* r */3];
          continue ;
        }
      } else {
        throw Caml_builtin_exceptions.not_found;
      }
    };
  };
  var find_first_opt = function (f, _param) {
    while(true) {
      var param = _param;
      if (param) {
        var v = param[/* v */1];
        if (Curry._1(f, v)) {
          var _v0 = v;
          var _d0 = param[/* d */2];
          var f$1 = f;
          var _param$1 = param[/* l */0];
          while(true) {
            var param$1 = _param$1;
            var d0 = _d0;
            var v0 = _v0;
            if (param$1) {
              var v$1 = param$1[/* v */1];
              if (Curry._1(f$1, v$1)) {
                _param$1 = param$1[/* l */0];
                _d0 = param$1[/* d */2];
                _v0 = v$1;
                continue ;
              } else {
                _param$1 = param$1[/* r */3];
                continue ;
              }
            } else {
              return /* tuple */[
                      v0,
                      d0
                    ];
            }
          };
        } else {
          _param = param[/* r */3];
          continue ;
        }
      } else {
        return ;
      }
    };
  };
  var find_last = function (f, _param) {
    while(true) {
      var param = _param;
      if (param) {
        var v = param[/* v */1];
        if (Curry._1(f, v)) {
          var _v0 = v;
          var _d0 = param[/* d */2];
          var f$1 = f;
          var _param$1 = param[/* r */3];
          while(true) {
            var param$1 = _param$1;
            var d0 = _d0;
            var v0 = _v0;
            if (param$1) {
              var v$1 = param$1[/* v */1];
              if (Curry._1(f$1, v$1)) {
                _param$1 = param$1[/* r */3];
                _d0 = param$1[/* d */2];
                _v0 = v$1;
                continue ;
              } else {
                _param$1 = param$1[/* l */0];
                continue ;
              }
            } else {
              return /* tuple */[
                      v0,
                      d0
                    ];
            }
          };
        } else {
          _param = param[/* l */0];
          continue ;
        }
      } else {
        throw Caml_builtin_exceptions.not_found;
      }
    };
  };
  var find_last_opt = function (f, _param) {
    while(true) {
      var param = _param;
      if (param) {
        var v = param[/* v */1];
        if (Curry._1(f, v)) {
          var _v0 = v;
          var _d0 = param[/* d */2];
          var f$1 = f;
          var _param$1 = param[/* r */3];
          while(true) {
            var param$1 = _param$1;
            var d0 = _d0;
            var v0 = _v0;
            if (param$1) {
              var v$1 = param$1[/* v */1];
              if (Curry._1(f$1, v$1)) {
                _param$1 = param$1[/* r */3];
                _d0 = param$1[/* d */2];
                _v0 = v$1;
                continue ;
              } else {
                _param$1 = param$1[/* l */0];
                continue ;
              }
            } else {
              return /* tuple */[
                      v0,
                      d0
                    ];
            }
          };
        } else {
          _param = param[/* l */0];
          continue ;
        }
      } else {
        return ;
      }
    };
  };
  var find_opt = function (x, _param) {
    while(true) {
      var param = _param;
      if (param) {
        var c = Curry._2(funarg.compare, x, param[/* v */1]);
        if (c === 0) {
          return Caml_option.some(param[/* d */2]);
        } else {
          _param = c < 0 ? param[/* l */0] : param[/* r */3];
          continue ;
        }
      } else {
        return ;
      }
    };
  };
  var mem = function (x, _param) {
    while(true) {
      var param = _param;
      if (param) {
        var c = Curry._2(funarg.compare, x, param[/* v */1]);
        if (c === 0) {
          return true;
        } else {
          _param = c < 0 ? param[/* l */0] : param[/* r */3];
          continue ;
        }
      } else {
        return false;
      }
    };
  };
  var min_binding = function (_param) {
    while(true) {
      var param = _param;
      if (param) {
        var l = param[/* l */0];
        if (l) {
          _param = l;
          continue ;
        } else {
          return /* tuple */[
                  param[/* v */1],
                  param[/* d */2]
                ];
        }
      } else {
        throw Caml_builtin_exceptions.not_found;
      }
    };
  };
  var min_binding_opt = function (_param) {
    while(true) {
      var param = _param;
      if (param) {
        var l = param[/* l */0];
        if (l) {
          _param = l;
          continue ;
        } else {
          return /* tuple */[
                  param[/* v */1],
                  param[/* d */2]
                ];
        }
      } else {
        return ;
      }
    };
  };
  var max_binding = function (_param) {
    while(true) {
      var param = _param;
      if (param) {
        var r = param[/* r */3];
        if (r) {
          _param = r;
          continue ;
        } else {
          return /* tuple */[
                  param[/* v */1],
                  param[/* d */2]
                ];
        }
      } else {
        throw Caml_builtin_exceptions.not_found;
      }
    };
  };
  var max_binding_opt = function (_param) {
    while(true) {
      var param = _param;
      if (param) {
        var r = param[/* r */3];
        if (r) {
          _param = r;
          continue ;
        } else {
          return /* tuple */[
                  param[/* v */1],
                  param[/* d */2]
                ];
        }
      } else {
        return ;
      }
    };
  };
  var remove_min_binding = function (param) {
    if (param) {
      var l = param[/* l */0];
      if (l) {
        return bal(remove_min_binding(l), param[/* v */1], param[/* d */2], param[/* r */3]);
      } else {
        return param[/* r */3];
      }
    } else {
      throw [
            Caml_builtin_exceptions.invalid_argument,
            "Map.remove_min_elt"
          ];
    }
  };
  var merge = function (t1, t2) {
    if (t1) {
      if (t2) {
        var match = min_binding(t2);
        return bal(t1, match[0], match[1], remove_min_binding(t2));
      } else {
        return t1;
      }
    } else {
      return t2;
    }
  };
  var remove = function (x, m) {
    if (m) {
      var r = m[/* r */3];
      var d = m[/* d */2];
      var v = m[/* v */1];
      var l = m[/* l */0];
      var c = Curry._2(funarg.compare, x, v);
      if (c === 0) {
        return merge(l, r);
      } else if (c < 0) {
        var ll = remove(x, l);
        if (l === ll) {
          return m;
        } else {
          return bal(ll, v, d, r);
        }
      } else {
        var rr = remove(x, r);
        if (r === rr) {
          return m;
        } else {
          return bal(l, v, d, rr);
        }
      }
    } else {
      return /* Empty */0;
    }
  };
  var update = function (x, f, m) {
    if (m) {
      var r = m[/* r */3];
      var d = m[/* d */2];
      var v = m[/* v */1];
      var l = m[/* l */0];
      var c = Curry._2(funarg.compare, x, v);
      if (c === 0) {
        var match = Curry._1(f, Caml_option.some(d));
        if (match !== undefined) {
          var data = Caml_option.valFromOption(match);
          if (d === data) {
            return m;
          } else {
            return /* Node */[
                    /* l */l,
                    /* v */x,
                    /* d */data,
                    /* r */r,
                    /* h */m[/* h */4]
                  ];
          }
        } else {
          return merge(l, r);
        }
      } else if (c < 0) {
        var ll = update(x, f, l);
        if (l === ll) {
          return m;
        } else {
          return bal(ll, v, d, r);
        }
      } else {
        var rr = update(x, f, r);
        if (r === rr) {
          return m;
        } else {
          return bal(l, v, d, rr);
        }
      }
    } else {
      var match$1 = Curry._1(f, undefined);
      if (match$1 !== undefined) {
        return /* Node */[
                /* l : Empty */0,
                /* v */x,
                /* d */Caml_option.valFromOption(match$1),
                /* r : Empty */0,
                /* h */1
              ];
      } else {
        return /* Empty */0;
      }
    }
  };
  var iter = function (f, _param) {
    while(true) {
      var param = _param;
      if (param) {
        iter(f, param[/* l */0]);
        Curry._2(f, param[/* v */1], param[/* d */2]);
        _param = param[/* r */3];
        continue ;
      } else {
        return /* () */0;
      }
    };
  };
  var map = function (f, param) {
    if (param) {
      var l$prime = map(f, param[/* l */0]);
      var d$prime = Curry._1(f, param[/* d */2]);
      var r$prime = map(f, param[/* r */3]);
      return /* Node */[
              /* l */l$prime,
              /* v */param[/* v */1],
              /* d */d$prime,
              /* r */r$prime,
              /* h */param[/* h */4]
            ];
    } else {
      return /* Empty */0;
    }
  };
  var mapi = function (f, param) {
    if (param) {
      var v = param[/* v */1];
      var l$prime = mapi(f, param[/* l */0]);
      var d$prime = Curry._2(f, v, param[/* d */2]);
      var r$prime = mapi(f, param[/* r */3]);
      return /* Node */[
              /* l */l$prime,
              /* v */v,
              /* d */d$prime,
              /* r */r$prime,
              /* h */param[/* h */4]
            ];
    } else {
      return /* Empty */0;
    }
  };
  var fold = function (f, _m, _accu) {
    while(true) {
      var accu = _accu;
      var m = _m;
      if (m) {
        _accu = Curry._3(f, m[/* v */1], m[/* d */2], fold(f, m[/* l */0], accu));
        _m = m[/* r */3];
        continue ;
      } else {
        return accu;
      }
    };
  };
  var for_all = function (p, _param) {
    while(true) {
      var param = _param;
      if (param) {
        if (Curry._2(p, param[/* v */1], param[/* d */2]) && for_all(p, param[/* l */0])) {
          _param = param[/* r */3];
          continue ;
        } else {
          return false;
        }
      } else {
        return true;
      }
    };
  };
  var exists = function (p, _param) {
    while(true) {
      var param = _param;
      if (param) {
        if (Curry._2(p, param[/* v */1], param[/* d */2]) || exists(p, param[/* l */0])) {
          return true;
        } else {
          _param = param[/* r */3];
          continue ;
        }
      } else {
        return false;
      }
    };
  };
  var add_min_binding = function (k, x, param) {
    if (param) {
      return bal(add_min_binding(k, x, param[/* l */0]), param[/* v */1], param[/* d */2], param[/* r */3]);
    } else {
      return singleton(k, x);
    }
  };
  var add_max_binding = function (k, x, param) {
    if (param) {
      return bal(param[/* l */0], param[/* v */1], param[/* d */2], add_max_binding(k, x, param[/* r */3]));
    } else {
      return singleton(k, x);
    }
  };
  var join = function (l, v, d, r) {
    if (l) {
      if (r) {
        var rh = r[/* h */4];
        var lh = l[/* h */4];
        if (lh > (rh + 2 | 0)) {
          return bal(l[/* l */0], l[/* v */1], l[/* d */2], join(l[/* r */3], v, d, r));
        } else if (rh > (lh + 2 | 0)) {
          return bal(join(l, v, d, r[/* l */0]), r[/* v */1], r[/* d */2], r[/* r */3]);
        } else {
          return create(l, v, d, r);
        }
      } else {
        return add_max_binding(v, d, l);
      }
    } else {
      return add_min_binding(v, d, r);
    }
  };
  var concat = function (t1, t2) {
    if (t1) {
      if (t2) {
        var match = min_binding(t2);
        return join(t1, match[0], match[1], remove_min_binding(t2));
      } else {
        return t1;
      }
    } else {
      return t2;
    }
  };
  var concat_or_join = function (t1, v, d, t2) {
    if (d !== undefined) {
      return join(t1, v, Caml_option.valFromOption(d), t2);
    } else {
      return concat(t1, t2);
    }
  };
  var split = function (x, param) {
    if (param) {
      var r = param[/* r */3];
      var d = param[/* d */2];
      var v = param[/* v */1];
      var l = param[/* l */0];
      var c = Curry._2(funarg.compare, x, v);
      if (c === 0) {
        return /* tuple */[
                l,
                Caml_option.some(d),
                r
              ];
      } else if (c < 0) {
        var match = split(x, l);
        return /* tuple */[
                match[0],
                match[1],
                join(match[2], v, d, r)
              ];
      } else {
        var match$1 = split(x, r);
        return /* tuple */[
                join(l, v, d, match$1[0]),
                match$1[1],
                match$1[2]
              ];
      }
    } else {
      return /* tuple */[
              /* Empty */0,
              undefined,
              /* Empty */0
            ];
    }
  };
  var merge$1 = function (f, s1, s2) {
    if (s1) {
      var v1 = s1[/* v */1];
      if (s1[/* h */4] >= height(s2)) {
        var match = split(v1, s2);
        return concat_or_join(merge$1(f, s1[/* l */0], match[0]), v1, Curry._3(f, v1, Caml_option.some(s1[/* d */2]), match[1]), merge$1(f, s1[/* r */3], match[2]));
      }
      
    } else if (!s2) {
      return /* Empty */0;
    }
    if (s2) {
      var v2 = s2[/* v */1];
      var match$1 = split(v2, s1);
      return concat_or_join(merge$1(f, match$1[0], s2[/* l */0]), v2, Curry._3(f, v2, match$1[1], Caml_option.some(s2[/* d */2])), merge$1(f, match$1[2], s2[/* r */3]));
    } else {
      throw [
            Caml_builtin_exceptions.assert_failure,
            /* tuple */[
              "map.ml",
              393,
              10
            ]
          ];
    }
  };
  var union = function (f, s1, s2) {
    if (s1) {
      if (s2) {
        var d2 = s2[/* d */2];
        var v2 = s2[/* v */1];
        var d1 = s1[/* d */2];
        var v1 = s1[/* v */1];
        if (s1[/* h */4] >= s2[/* h */4]) {
          var match = split(v1, s2);
          var d2$1 = match[1];
          var l = union(f, s1[/* l */0], match[0]);
          var r = union(f, s1[/* r */3], match[2]);
          if (d2$1 !== undefined) {
            return concat_or_join(l, v1, Curry._3(f, v1, d1, Caml_option.valFromOption(d2$1)), r);
          } else {
            return join(l, v1, d1, r);
          }
        } else {
          var match$1 = split(v2, s1);
          var d1$1 = match$1[1];
          var l$1 = union(f, match$1[0], s2[/* l */0]);
          var r$1 = union(f, match$1[2], s2[/* r */3]);
          if (d1$1 !== undefined) {
            return concat_or_join(l$1, v2, Curry._3(f, v2, Caml_option.valFromOption(d1$1), d2), r$1);
          } else {
            return join(l$1, v2, d2, r$1);
          }
        }
      } else {
        return s1;
      }
    } else {
      return s2;
    }
  };
  var filter = function (p, m) {
    if (m) {
      var r = m[/* r */3];
      var d = m[/* d */2];
      var v = m[/* v */1];
      var l = m[/* l */0];
      var l$prime = filter(p, l);
      var pvd = Curry._2(p, v, d);
      var r$prime = filter(p, r);
      if (pvd) {
        if (l === l$prime && r === r$prime) {
          return m;
        } else {
          return join(l$prime, v, d, r$prime);
        }
      } else {
        return concat(l$prime, r$prime);
      }
    } else {
      return /* Empty */0;
    }
  };
  var partition = function (p, param) {
    if (param) {
      var d = param[/* d */2];
      var v = param[/* v */1];
      var match = partition(p, param[/* l */0]);
      var lf = match[1];
      var lt = match[0];
      var pvd = Curry._2(p, v, d);
      var match$1 = partition(p, param[/* r */3]);
      var rf = match$1[1];
      var rt = match$1[0];
      if (pvd) {
        return /* tuple */[
                join(lt, v, d, rt),
                concat(lf, rf)
              ];
      } else {
        return /* tuple */[
                concat(lt, rt),
                join(lf, v, d, rf)
              ];
      }
    } else {
      return /* tuple */[
              /* Empty */0,
              /* Empty */0
            ];
    }
  };
  var cons_enum = function (_m, _e) {
    while(true) {
      var e = _e;
      var m = _m;
      if (m) {
        _e = /* More */[
          m[/* v */1],
          m[/* d */2],
          m[/* r */3],
          e
        ];
        _m = m[/* l */0];
        continue ;
      } else {
        return e;
      }
    };
  };
  var compare = function (cmp, m1, m2) {
    var _e1 = cons_enum(m1, /* End */0);
    var _e2 = cons_enum(m2, /* End */0);
    while(true) {
      var e2 = _e2;
      var e1 = _e1;
      if (e1) {
        if (e2) {
          var c = Curry._2(funarg.compare, e1[0], e2[0]);
          if (c !== 0) {
            return c;
          } else {
            var c$1 = Curry._2(cmp, e1[1], e2[1]);
            if (c$1 !== 0) {
              return c$1;
            } else {
              _e2 = cons_enum(e2[2], e2[3]);
              _e1 = cons_enum(e1[2], e1[3]);
              continue ;
            }
          }
        } else {
          return 1;
        }
      } else if (e2) {
        return -1;
      } else {
        return 0;
      }
    };
  };
  var equal = function (cmp, m1, m2) {
    var _e1 = cons_enum(m1, /* End */0);
    var _e2 = cons_enum(m2, /* End */0);
    while(true) {
      var e2 = _e2;
      var e1 = _e1;
      if (e1) {
        if (e2 && Curry._2(funarg.compare, e1[0], e2[0]) === 0 && Curry._2(cmp, e1[1], e2[1])) {
          _e2 = cons_enum(e2[2], e2[3]);
          _e1 = cons_enum(e1[2], e1[3]);
          continue ;
        } else {
          return false;
        }
      } else if (e2) {
        return false;
      } else {
        return true;
      }
    };
  };
  var cardinal = function (param) {
    if (param) {
      return (cardinal(param[/* l */0]) + 1 | 0) + cardinal(param[/* r */3]) | 0;
    } else {
      return 0;
    }
  };
  var bindings_aux = function (_accu, _param) {
    while(true) {
      var param = _param;
      var accu = _accu;
      if (param) {
        _param = param[/* l */0];
        _accu = /* :: */[
          /* tuple */[
            param[/* v */1],
            param[/* d */2]
          ],
          bindings_aux(accu, param[/* r */3])
        ];
        continue ;
      } else {
        return accu;
      }
    };
  };
  var bindings = function (s) {
    return bindings_aux(/* [] */0, s);
  };
  return {
          empty: /* Empty */0,
          is_empty: is_empty,
          mem: mem,
          add: add,
          update: update,
          singleton: singleton,
          remove: remove,
          merge: merge$1,
          union: union,
          compare: compare,
          equal: equal,
          iter: iter,
          fold: fold,
          for_all: for_all,
          exists: exists,
          filter: filter,
          partition: partition,
          cardinal: cardinal,
          bindings: bindings,
          min_binding: min_binding,
          min_binding_opt: min_binding_opt,
          max_binding: max_binding,
          max_binding_opt: max_binding_opt,
          choose: min_binding,
          choose_opt: min_binding_opt,
          split: split,
          find: find,
          find_opt: find_opt,
          find_first: find_first,
          find_first_opt: find_first_opt,
          find_last: find_last,
          find_last_opt: find_last_opt,
          map: map,
          mapi: mapi
        };
}

exports.Make = Make;
/* No side effect */

},{"./caml_builtin_exceptions.js":6,"./caml_option.js":16,"./curry.js":24}],27:[function(require,module,exports){
'use strict';

var Curry = require("./curry.js");
var Caml_io = require("./caml_io.js");
var Caml_sys = require("./caml_sys.js");
var Caml_bytes = require("./caml_bytes.js");
var Caml_format = require("./caml_format.js");
var Caml_string = require("./caml_string.js");
var Caml_exceptions = require("./caml_exceptions.js");
var Caml_js_exceptions = require("./caml_js_exceptions.js");
var Caml_external_polyfill = require("./caml_external_polyfill.js");
var Caml_builtin_exceptions = require("./caml_builtin_exceptions.js");
var CamlinternalFormatBasics = require("./camlinternalFormatBasics.js");

function failwith(s) {
  throw [
        Caml_builtin_exceptions.failure,
        s
      ];
}

function invalid_arg(s) {
  throw [
        Caml_builtin_exceptions.invalid_argument,
        s
      ];
}

var Exit = Caml_exceptions.create("Pervasives.Exit");

function abs(x) {
  if (x >= 0) {
    return x;
  } else {
    return -x | 0;
  }
}

function lnot(x) {
  return x ^ -1;
}

var min_int = -2147483648;

function classify_float(x) {
  if (isFinite(x)) {
    if (Math.abs(x) >= 2.22507385850720138e-308) {
      return /* FP_normal */0;
    } else if (x !== 0) {
      return /* FP_subnormal */1;
    } else {
      return /* FP_zero */2;
    }
  } else if (isNaN(x)) {
    return /* FP_nan */4;
  } else {
    return /* FP_infinite */3;
  }
}

function char_of_int(n) {
  if (n < 0 || n > 255) {
    throw [
          Caml_builtin_exceptions.invalid_argument,
          "char_of_int"
        ];
  }
  return n;
}

function string_of_bool(b) {
  if (b) {
    return "true";
  } else {
    return "false";
  }
}

function bool_of_string(param) {
  switch (param) {
    case "false" :
        return false;
    case "true" :
        return true;
    default:
      throw [
            Caml_builtin_exceptions.invalid_argument,
            "bool_of_string"
          ];
  }
}

function bool_of_string_opt(param) {
  switch (param) {
    case "false" :
        return false;
    case "true" :
        return true;
    default:
      return ;
  }
}

function int_of_string_opt(s) {
  try {
    return Caml_format.caml_int_of_string(s);
  }
  catch (raw_exn){
    var exn = Caml_js_exceptions.internalToOCamlException(raw_exn);
    if (exn[0] === Caml_builtin_exceptions.failure) {
      return ;
    } else {
      throw exn;
    }
  }
}

function valid_float_lexem(s) {
  var l = s.length;
  var _i = 0;
  while(true) {
    var i = _i;
    if (i >= l) {
      return s + ".";
    } else {
      var match = Caml_string.get(s, i);
      if (match >= 48) {
        if (match >= 58) {
          return s;
        } else {
          _i = i + 1 | 0;
          continue ;
        }
      } else if (match !== 45) {
        return s;
      } else {
        _i = i + 1 | 0;
        continue ;
      }
    }
  };
}

function string_of_float(f) {
  return valid_float_lexem(Caml_format.caml_format_float("%.12g", f));
}

function float_of_string_opt(s) {
  try {
    return Caml_format.caml_float_of_string(s);
  }
  catch (raw_exn){
    var exn = Caml_js_exceptions.internalToOCamlException(raw_exn);
    if (exn[0] === Caml_builtin_exceptions.failure) {
      return ;
    } else {
      throw exn;
    }
  }
}

function $at(l1, l2) {
  if (l1) {
    return /* :: */[
            l1[0],
            $at(l1[1], l2)
          ];
  } else {
    return l2;
  }
}

var stdin = Caml_io.stdin;

var stdout = Caml_io.stdout;

var stderr = Caml_io.stderr;

function open_out_gen(mode, perm, name) {
  var c = Caml_external_polyfill.resolve("caml_ml_open_descriptor_out")(Caml_external_polyfill.resolve("caml_sys_open")(name, mode, perm));
  Caml_external_polyfill.resolve("caml_ml_set_channel_name")(c, name);
  return c;
}

function open_out(name) {
  return open_out_gen(/* :: */[
              /* Open_wronly */1,
              /* :: */[
                /* Open_creat */3,
                /* :: */[
                  /* Open_trunc */4,
                  /* :: */[
                    /* Open_text */7,
                    /* [] */0
                  ]
                ]
              ]
            ], 438, name);
}

function open_out_bin(name) {
  return open_out_gen(/* :: */[
              /* Open_wronly */1,
              /* :: */[
                /* Open_creat */3,
                /* :: */[
                  /* Open_trunc */4,
                  /* :: */[
                    /* Open_binary */6,
                    /* [] */0
                  ]
                ]
              ]
            ], 438, name);
}

function flush_all(param) {
  var _param = Caml_io.caml_ml_out_channels_list(/* () */0);
  while(true) {
    var param$1 = _param;
    if (param$1) {
      try {
        Caml_io.caml_ml_flush(param$1[0]);
      }
      catch (raw_exn){
        var exn = Caml_js_exceptions.internalToOCamlException(raw_exn);
        if (exn[0] !== Caml_builtin_exceptions.sys_error) {
          throw exn;
        }
        
      }
      _param = param$1[1];
      continue ;
    } else {
      return /* () */0;
    }
  };
}

function output_bytes(oc, s) {
  return Caml_external_polyfill.resolve("caml_ml_output_bytes")(oc, s, 0, s.length);
}

function output_string(oc, s) {
  return Caml_io.caml_ml_output(oc, s, 0, s.length);
}

function output(oc, s, ofs, len) {
  if (ofs < 0 || len < 0 || ofs > (s.length - len | 0)) {
    throw [
          Caml_builtin_exceptions.invalid_argument,
          "output"
        ];
  }
  return Caml_external_polyfill.resolve("caml_ml_output_bytes")(oc, s, ofs, len);
}

function output_substring(oc, s, ofs, len) {
  if (ofs < 0 || len < 0 || ofs > (s.length - len | 0)) {
    throw [
          Caml_builtin_exceptions.invalid_argument,
          "output_substring"
        ];
  }
  return Caml_io.caml_ml_output(oc, s, ofs, len);
}

function output_value(chan, v) {
  return Caml_external_polyfill.resolve("caml_output_value")(chan, v, /* [] */0);
}

function close_out(oc) {
  Caml_io.caml_ml_flush(oc);
  return Caml_external_polyfill.resolve("caml_ml_close_channel")(oc);
}

function close_out_noerr(oc) {
  try {
    Caml_io.caml_ml_flush(oc);
  }
  catch (exn){
    
  }
  try {
    return Caml_external_polyfill.resolve("caml_ml_close_channel")(oc);
  }
  catch (exn$1){
    return /* () */0;
  }
}

function open_in_gen(mode, perm, name) {
  var c = Caml_external_polyfill.resolve("caml_ml_open_descriptor_in")(Caml_external_polyfill.resolve("caml_sys_open")(name, mode, perm));
  Caml_external_polyfill.resolve("caml_ml_set_channel_name")(c, name);
  return c;
}

function open_in(name) {
  return open_in_gen(/* :: */[
              /* Open_rdonly */0,
              /* :: */[
                /* Open_text */7,
                /* [] */0
              ]
            ], 0, name);
}

function open_in_bin(name) {
  return open_in_gen(/* :: */[
              /* Open_rdonly */0,
              /* :: */[
                /* Open_binary */6,
                /* [] */0
              ]
            ], 0, name);
}

function input(ic, s, ofs, len) {
  if (ofs < 0 || len < 0 || ofs > (s.length - len | 0)) {
    throw [
          Caml_builtin_exceptions.invalid_argument,
          "input"
        ];
  }
  return Caml_external_polyfill.resolve("caml_ml_input")(ic, s, ofs, len);
}

function unsafe_really_input(ic, s, _ofs, _len) {
  while(true) {
    var len = _len;
    var ofs = _ofs;
    if (len <= 0) {
      return /* () */0;
    } else {
      var r = Caml_external_polyfill.resolve("caml_ml_input")(ic, s, ofs, len);
      if (r === 0) {
        throw Caml_builtin_exceptions.end_of_file;
      }
      _len = len - r | 0;
      _ofs = ofs + r | 0;
      continue ;
    }
  };
}

function really_input(ic, s, ofs, len) {
  if (ofs < 0 || len < 0 || ofs > (s.length - len | 0)) {
    throw [
          Caml_builtin_exceptions.invalid_argument,
          "really_input"
        ];
  }
  return unsafe_really_input(ic, s, ofs, len);
}

function really_input_string(ic, len) {
  var s = Caml_bytes.caml_create_bytes(len);
  really_input(ic, s, 0, len);
  return Caml_bytes.bytes_to_string(s);
}

function input_line(chan) {
  var build_result = function (buf, _pos, _param) {
    while(true) {
      var param = _param;
      var pos = _pos;
      if (param) {
        var hd = param[0];
        var len = hd.length;
        Caml_bytes.caml_blit_bytes(hd, 0, buf, pos - len | 0, len);
        _param = param[1];
        _pos = pos - len | 0;
        continue ;
      } else {
        return buf;
      }
    };
  };
  var scan = function (_accu, _len) {
    while(true) {
      var len = _len;
      var accu = _accu;
      var n = Caml_external_polyfill.resolve("caml_ml_input_scan_line")(chan);
      if (n === 0) {
        if (accu) {
          return build_result(Caml_bytes.caml_create_bytes(len), len, accu);
        } else {
          throw Caml_builtin_exceptions.end_of_file;
        }
      } else if (n > 0) {
        var res = Caml_bytes.caml_create_bytes(n - 1 | 0);
        Caml_external_polyfill.resolve("caml_ml_input")(chan, res, 0, n - 1 | 0);
        Caml_external_polyfill.resolve("caml_ml_input_char")(chan);
        if (accu) {
          var len$1 = (len + n | 0) - 1 | 0;
          return build_result(Caml_bytes.caml_create_bytes(len$1), len$1, /* :: */[
                      res,
                      accu
                    ]);
        } else {
          return res;
        }
      } else {
        var beg = Caml_bytes.caml_create_bytes(-n | 0);
        Caml_external_polyfill.resolve("caml_ml_input")(chan, beg, 0, -n | 0);
        _len = len - n | 0;
        _accu = /* :: */[
          beg,
          accu
        ];
        continue ;
      }
    };
  };
  return Caml_bytes.bytes_to_string(scan(/* [] */0, 0));
}

function close_in_noerr(ic) {
  try {
    return Caml_external_polyfill.resolve("caml_ml_close_channel")(ic);
  }
  catch (exn){
    return /* () */0;
  }
}

function print_char(c) {
  return Caml_io.caml_ml_output_char(stdout, c);
}

function print_string(s) {
  return output_string(stdout, s);
}

function print_bytes(s) {
  return output_bytes(stdout, s);
}

function print_int(i) {
  return output_string(stdout, String(i));
}

function print_float(f) {
  return output_string(stdout, valid_float_lexem(Caml_format.caml_format_float("%.12g", f)));
}

function print_newline(param) {
  Caml_io.caml_ml_output_char(stdout, /* "\n" */10);
  return Caml_io.caml_ml_flush(stdout);
}

function prerr_char(c) {
  return Caml_io.caml_ml_output_char(stderr, c);
}

function prerr_string(s) {
  return output_string(stderr, s);
}

function prerr_bytes(s) {
  return output_bytes(stderr, s);
}

function prerr_int(i) {
  return output_string(stderr, String(i));
}

function prerr_float(f) {
  return output_string(stderr, valid_float_lexem(Caml_format.caml_format_float("%.12g", f)));
}

function prerr_newline(param) {
  Caml_io.caml_ml_output_char(stderr, /* "\n" */10);
  return Caml_io.caml_ml_flush(stderr);
}

function read_line(param) {
  Caml_io.caml_ml_flush(stdout);
  return input_line(stdin);
}

function read_int(param) {
  return Caml_format.caml_int_of_string((Caml_io.caml_ml_flush(stdout), input_line(stdin)));
}

function read_int_opt(param) {
  return int_of_string_opt((Caml_io.caml_ml_flush(stdout), input_line(stdin)));
}

function read_float(param) {
  return Caml_format.caml_float_of_string((Caml_io.caml_ml_flush(stdout), input_line(stdin)));
}

function read_float_opt(param) {
  return float_of_string_opt((Caml_io.caml_ml_flush(stdout), input_line(stdin)));
}

function string_of_format(param) {
  return param[1];
}

function $caret$caret(param, param$1) {
  return /* Format */[
          CamlinternalFormatBasics.concat_fmt(param[0], param$1[0]),
          param[1] + ("%," + param$1[1])
        ];
}

var exit_function = {
  contents: flush_all
};

function at_exit(f) {
  var g = exit_function.contents;
  exit_function.contents = (function (param) {
      Curry._1(f, /* () */0);
      return Curry._1(g, /* () */0);
    });
  return /* () */0;
}

function do_at_exit(param) {
  return Curry._1(exit_function.contents, /* () */0);
}

function exit(retcode) {
  do_at_exit(/* () */0);
  return Caml_sys.caml_sys_exit(retcode);
}

var max_int = 2147483647;

var infinity = Infinity;

var neg_infinity = -Infinity;

var max_float = 1.79769313486231571e+308;

var min_float = 2.22507385850720138e-308;

var epsilon_float = 2.22044604925031308e-16;

var flush = Caml_io.caml_ml_flush;

var output_char = Caml_io.caml_ml_output_char;

var output_byte = Caml_io.caml_ml_output_char;

function output_binary_int(prim, prim$1) {
  return Caml_external_polyfill.resolve("caml_ml_output_int")(prim, prim$1);
}

function seek_out(prim, prim$1) {
  return Caml_external_polyfill.resolve("caml_ml_seek_out")(prim, prim$1);
}

function pos_out(prim) {
  return Caml_external_polyfill.resolve("caml_ml_pos_out")(prim);
}

function out_channel_length(prim) {
  return Caml_external_polyfill.resolve("caml_ml_channel_size")(prim);
}

function set_binary_mode_out(prim, prim$1) {
  return Caml_external_polyfill.resolve("caml_ml_set_binary_mode")(prim, prim$1);
}

function input_char(prim) {
  return Caml_external_polyfill.resolve("caml_ml_input_char")(prim);
}

function input_byte(prim) {
  return Caml_external_polyfill.resolve("caml_ml_input_char")(prim);
}

function input_binary_int(prim) {
  return Caml_external_polyfill.resolve("caml_ml_input_int")(prim);
}

function input_value(prim) {
  return Caml_external_polyfill.resolve("caml_input_value")(prim);
}

function seek_in(prim, prim$1) {
  return Caml_external_polyfill.resolve("caml_ml_seek_in")(prim, prim$1);
}

function pos_in(prim) {
  return Caml_external_polyfill.resolve("caml_ml_pos_in")(prim);
}

function in_channel_length(prim) {
  return Caml_external_polyfill.resolve("caml_ml_channel_size")(prim);
}

function close_in(prim) {
  return Caml_external_polyfill.resolve("caml_ml_close_channel")(prim);
}

function set_binary_mode_in(prim, prim$1) {
  return Caml_external_polyfill.resolve("caml_ml_set_binary_mode")(prim, prim$1);
}

function LargeFile_seek_out(prim, prim$1) {
  return Caml_external_polyfill.resolve("caml_ml_seek_out_64")(prim, prim$1);
}

function LargeFile_pos_out(prim) {
  return Caml_external_polyfill.resolve("caml_ml_pos_out_64")(prim);
}

function LargeFile_out_channel_length(prim) {
  return Caml_external_polyfill.resolve("caml_ml_channel_size_64")(prim);
}

function LargeFile_seek_in(prim, prim$1) {
  return Caml_external_polyfill.resolve("caml_ml_seek_in_64")(prim, prim$1);
}

function LargeFile_pos_in(prim) {
  return Caml_external_polyfill.resolve("caml_ml_pos_in_64")(prim);
}

function LargeFile_in_channel_length(prim) {
  return Caml_external_polyfill.resolve("caml_ml_channel_size_64")(prim);
}

var LargeFile = {
  seek_out: LargeFile_seek_out,
  pos_out: LargeFile_pos_out,
  out_channel_length: LargeFile_out_channel_length,
  seek_in: LargeFile_seek_in,
  pos_in: LargeFile_pos_in,
  in_channel_length: LargeFile_in_channel_length
};

exports.invalid_arg = invalid_arg;
exports.failwith = failwith;
exports.Exit = Exit;
exports.abs = abs;
exports.max_int = max_int;
exports.min_int = min_int;
exports.lnot = lnot;
exports.infinity = infinity;
exports.neg_infinity = neg_infinity;
exports.max_float = max_float;
exports.min_float = min_float;
exports.epsilon_float = epsilon_float;
exports.classify_float = classify_float;
exports.char_of_int = char_of_int;
exports.string_of_bool = string_of_bool;
exports.bool_of_string = bool_of_string;
exports.bool_of_string_opt = bool_of_string_opt;
exports.int_of_string_opt = int_of_string_opt;
exports.string_of_float = string_of_float;
exports.float_of_string_opt = float_of_string_opt;
exports.$at = $at;
exports.stdin = stdin;
exports.stdout = stdout;
exports.stderr = stderr;
exports.print_char = print_char;
exports.print_string = print_string;
exports.print_bytes = print_bytes;
exports.print_int = print_int;
exports.print_float = print_float;
exports.print_newline = print_newline;
exports.prerr_char = prerr_char;
exports.prerr_string = prerr_string;
exports.prerr_bytes = prerr_bytes;
exports.prerr_int = prerr_int;
exports.prerr_float = prerr_float;
exports.prerr_newline = prerr_newline;
exports.read_line = read_line;
exports.read_int = read_int;
exports.read_int_opt = read_int_opt;
exports.read_float = read_float;
exports.read_float_opt = read_float_opt;
exports.open_out = open_out;
exports.open_out_bin = open_out_bin;
exports.open_out_gen = open_out_gen;
exports.flush = flush;
exports.flush_all = flush_all;
exports.output_char = output_char;
exports.output_string = output_string;
exports.output_bytes = output_bytes;
exports.output = output;
exports.output_substring = output_substring;
exports.output_byte = output_byte;
exports.output_binary_int = output_binary_int;
exports.output_value = output_value;
exports.seek_out = seek_out;
exports.pos_out = pos_out;
exports.out_channel_length = out_channel_length;
exports.close_out = close_out;
exports.close_out_noerr = close_out_noerr;
exports.set_binary_mode_out = set_binary_mode_out;
exports.open_in = open_in;
exports.open_in_bin = open_in_bin;
exports.open_in_gen = open_in_gen;
exports.input_char = input_char;
exports.input_line = input_line;
exports.input = input;
exports.really_input = really_input;
exports.really_input_string = really_input_string;
exports.input_byte = input_byte;
exports.input_binary_int = input_binary_int;
exports.input_value = input_value;
exports.seek_in = seek_in;
exports.pos_in = pos_in;
exports.in_channel_length = in_channel_length;
exports.close_in = close_in;
exports.close_in_noerr = close_in_noerr;
exports.set_binary_mode_in = set_binary_mode_in;
exports.LargeFile = LargeFile;
exports.string_of_format = string_of_format;
exports.$caret$caret = $caret$caret;
exports.exit = exit;
exports.at_exit = at_exit;
exports.valid_float_lexem = valid_float_lexem;
exports.unsafe_really_input = unsafe_really_input;
exports.do_at_exit = do_at_exit;
/* No side effect */

},{"./caml_builtin_exceptions.js":6,"./caml_bytes.js":7,"./caml_exceptions.js":8,"./caml_external_polyfill.js":9,"./caml_format.js":10,"./caml_io.js":13,"./caml_js_exceptions.js":14,"./caml_string.js":18,"./caml_sys.js":19,"./camlinternalFormatBasics.js":22,"./curry.js":24}],28:[function(require,module,exports){
'use strict';

var Curry = require("./curry.js");
var $$Buffer = require("./buffer.js");
var Pervasives = require("./pervasives.js");
var CamlinternalFormat = require("./camlinternalFormat.js");

function kfprintf(k, o, param) {
  return CamlinternalFormat.make_printf((function (o, acc) {
                CamlinternalFormat.output_acc(o, acc);
                return Curry._1(k, o);
              }), o, /* End_of_acc */0, param[0]);
}

function kbprintf(k, b, param) {
  return CamlinternalFormat.make_printf((function (b, acc) {
                CamlinternalFormat.bufput_acc(b, acc);
                return Curry._1(k, b);
              }), b, /* End_of_acc */0, param[0]);
}

function ikfprintf(k, oc, param) {
  return CamlinternalFormat.make_iprintf(k, oc, param[0]);
}

function fprintf(oc, fmt) {
  return kfprintf((function (prim) {
                return /* () */0;
              }), oc, fmt);
}

function bprintf(b, fmt) {
  return kbprintf((function (prim) {
                return /* () */0;
              }), b, fmt);
}

function ifprintf(oc, fmt) {
  return ikfprintf((function (prim) {
                return /* () */0;
              }), oc, fmt);
}

function printf(fmt) {
  return fprintf(Pervasives.stdout, fmt);
}

function eprintf(fmt) {
  return fprintf(Pervasives.stderr, fmt);
}

function ksprintf(k, param) {
  var k$prime = function (param, acc) {
    var buf = $$Buffer.create(64);
    CamlinternalFormat.strput_acc(buf, acc);
    return Curry._1(k, $$Buffer.contents(buf));
  };
  return CamlinternalFormat.make_printf(k$prime, /* () */0, /* End_of_acc */0, param[0]);
}

function sprintf(fmt) {
  return ksprintf((function (s) {
                return s;
              }), fmt);
}

var kprintf = ksprintf;

exports.fprintf = fprintf;
exports.printf = printf;
exports.eprintf = eprintf;
exports.sprintf = sprintf;
exports.bprintf = bprintf;
exports.ifprintf = ifprintf;
exports.kfprintf = kfprintf;
exports.ikfprintf = ikfprintf;
exports.ksprintf = ksprintf;
exports.kbprintf = kbprintf;
exports.kprintf = kprintf;
/* No side effect */

},{"./buffer.js":3,"./camlinternalFormat.js":21,"./curry.js":24,"./pervasives.js":27}],29:[function(require,module,exports){
'use strict';

var List = require("./list.js");
var Curry = require("./curry.js");
var Caml_option = require("./caml_option.js");
var Caml_builtin_exceptions = require("./caml_builtin_exceptions.js");

function Make(funarg) {
  var height = function (param) {
    if (param) {
      return param[/* h */3];
    } else {
      return 0;
    }
  };
  var create = function (l, v, r) {
    var hl = l ? l[/* h */3] : 0;
    var hr = r ? r[/* h */3] : 0;
    return /* Node */[
            /* l */l,
            /* v */v,
            /* r */r,
            /* h */hl >= hr ? hl + 1 | 0 : hr + 1 | 0
          ];
  };
  var bal = function (l, v, r) {
    var hl = l ? l[/* h */3] : 0;
    var hr = r ? r[/* h */3] : 0;
    if (hl > (hr + 2 | 0)) {
      if (l) {
        var lr = l[/* r */2];
        var lv = l[/* v */1];
        var ll = l[/* l */0];
        if (height(ll) >= height(lr)) {
          return create(ll, lv, create(lr, v, r));
        } else if (lr) {
          return create(create(ll, lv, lr[/* l */0]), lr[/* v */1], create(lr[/* r */2], v, r));
        } else {
          throw [
                Caml_builtin_exceptions.invalid_argument,
                "Set.bal"
              ];
        }
      } else {
        throw [
              Caml_builtin_exceptions.invalid_argument,
              "Set.bal"
            ];
      }
    } else if (hr > (hl + 2 | 0)) {
      if (r) {
        var rr = r[/* r */2];
        var rv = r[/* v */1];
        var rl = r[/* l */0];
        if (height(rr) >= height(rl)) {
          return create(create(l, v, rl), rv, rr);
        } else if (rl) {
          return create(create(l, v, rl[/* l */0]), rl[/* v */1], create(rl[/* r */2], rv, rr));
        } else {
          throw [
                Caml_builtin_exceptions.invalid_argument,
                "Set.bal"
              ];
        }
      } else {
        throw [
              Caml_builtin_exceptions.invalid_argument,
              "Set.bal"
            ];
      }
    } else {
      return /* Node */[
              /* l */l,
              /* v */v,
              /* r */r,
              /* h */hl >= hr ? hl + 1 | 0 : hr + 1 | 0
            ];
    }
  };
  var add = function (x, t) {
    if (t) {
      var r = t[/* r */2];
      var v = t[/* v */1];
      var l = t[/* l */0];
      var c = Curry._2(funarg.compare, x, v);
      if (c === 0) {
        return t;
      } else if (c < 0) {
        var ll = add(x, l);
        if (l === ll) {
          return t;
        } else {
          return bal(ll, v, r);
        }
      } else {
        var rr = add(x, r);
        if (r === rr) {
          return t;
        } else {
          return bal(l, v, rr);
        }
      }
    } else {
      return /* Node */[
              /* l : Empty */0,
              /* v */x,
              /* r : Empty */0,
              /* h */1
            ];
    }
  };
  var singleton = function (x) {
    return /* Node */[
            /* l : Empty */0,
            /* v */x,
            /* r : Empty */0,
            /* h */1
          ];
  };
  var add_min_element = function (x, param) {
    if (param) {
      return bal(add_min_element(x, param[/* l */0]), param[/* v */1], param[/* r */2]);
    } else {
      return singleton(x);
    }
  };
  var add_max_element = function (x, param) {
    if (param) {
      return bal(param[/* l */0], param[/* v */1], add_max_element(x, param[/* r */2]));
    } else {
      return singleton(x);
    }
  };
  var join = function (l, v, r) {
    if (l) {
      if (r) {
        var rh = r[/* h */3];
        var lh = l[/* h */3];
        if (lh > (rh + 2 | 0)) {
          return bal(l[/* l */0], l[/* v */1], join(l[/* r */2], v, r));
        } else if (rh > (lh + 2 | 0)) {
          return bal(join(l, v, r[/* l */0]), r[/* v */1], r[/* r */2]);
        } else {
          return create(l, v, r);
        }
      } else {
        return add_max_element(v, l);
      }
    } else {
      return add_min_element(v, r);
    }
  };
  var min_elt = function (_param) {
    while(true) {
      var param = _param;
      if (param) {
        var l = param[/* l */0];
        if (l) {
          _param = l;
          continue ;
        } else {
          return param[/* v */1];
        }
      } else {
        throw Caml_builtin_exceptions.not_found;
      }
    };
  };
  var min_elt_opt = function (_param) {
    while(true) {
      var param = _param;
      if (param) {
        var l = param[/* l */0];
        if (l) {
          _param = l;
          continue ;
        } else {
          return Caml_option.some(param[/* v */1]);
        }
      } else {
        return ;
      }
    };
  };
  var max_elt = function (_param) {
    while(true) {
      var param = _param;
      if (param) {
        var r = param[/* r */2];
        if (r) {
          _param = r;
          continue ;
        } else {
          return param[/* v */1];
        }
      } else {
        throw Caml_builtin_exceptions.not_found;
      }
    };
  };
  var max_elt_opt = function (_param) {
    while(true) {
      var param = _param;
      if (param) {
        var r = param[/* r */2];
        if (r) {
          _param = r;
          continue ;
        } else {
          return Caml_option.some(param[/* v */1]);
        }
      } else {
        return ;
      }
    };
  };
  var remove_min_elt = function (param) {
    if (param) {
      var l = param[/* l */0];
      if (l) {
        return bal(remove_min_elt(l), param[/* v */1], param[/* r */2]);
      } else {
        return param[/* r */2];
      }
    } else {
      throw [
            Caml_builtin_exceptions.invalid_argument,
            "Set.remove_min_elt"
          ];
    }
  };
  var concat = function (t1, t2) {
    if (t1) {
      if (t2) {
        return join(t1, min_elt(t2), remove_min_elt(t2));
      } else {
        return t1;
      }
    } else {
      return t2;
    }
  };
  var split = function (x, param) {
    if (param) {
      var r = param[/* r */2];
      var v = param[/* v */1];
      var l = param[/* l */0];
      var c = Curry._2(funarg.compare, x, v);
      if (c === 0) {
        return /* tuple */[
                l,
                true,
                r
              ];
      } else if (c < 0) {
        var match = split(x, l);
        return /* tuple */[
                match[0],
                match[1],
                join(match[2], v, r)
              ];
      } else {
        var match$1 = split(x, r);
        return /* tuple */[
                join(l, v, match$1[0]),
                match$1[1],
                match$1[2]
              ];
      }
    } else {
      return /* tuple */[
              /* Empty */0,
              false,
              /* Empty */0
            ];
    }
  };
  var is_empty = function (param) {
    if (param) {
      return false;
    } else {
      return true;
    }
  };
  var mem = function (x, _param) {
    while(true) {
      var param = _param;
      if (param) {
        var c = Curry._2(funarg.compare, x, param[/* v */1]);
        if (c === 0) {
          return true;
        } else {
          _param = c < 0 ? param[/* l */0] : param[/* r */2];
          continue ;
        }
      } else {
        return false;
      }
    };
  };
  var remove = function (x, t) {
    if (t) {
      var r = t[/* r */2];
      var v = t[/* v */1];
      var l = t[/* l */0];
      var c = Curry._2(funarg.compare, x, v);
      if (c === 0) {
        var t1 = l;
        var t2 = r;
        if (t1) {
          if (t2) {
            return bal(t1, min_elt(t2), remove_min_elt(t2));
          } else {
            return t1;
          }
        } else {
          return t2;
        }
      } else if (c < 0) {
        var ll = remove(x, l);
        if (l === ll) {
          return t;
        } else {
          return bal(ll, v, r);
        }
      } else {
        var rr = remove(x, r);
        if (r === rr) {
          return t;
        } else {
          return bal(l, v, rr);
        }
      }
    } else {
      return /* Empty */0;
    }
  };
  var union = function (s1, s2) {
    if (s1) {
      if (s2) {
        var h2 = s2[/* h */3];
        var v2 = s2[/* v */1];
        var h1 = s1[/* h */3];
        var v1 = s1[/* v */1];
        if (h1 >= h2) {
          if (h2 === 1) {
            return add(v2, s1);
          } else {
            var match = split(v1, s2);
            return join(union(s1[/* l */0], match[0]), v1, union(s1[/* r */2], match[2]));
          }
        } else if (h1 === 1) {
          return add(v1, s2);
        } else {
          var match$1 = split(v2, s1);
          return join(union(match$1[0], s2[/* l */0]), v2, union(match$1[2], s2[/* r */2]));
        }
      } else {
        return s1;
      }
    } else {
      return s2;
    }
  };
  var inter = function (s1, s2) {
    if (s1 && s2) {
      var r1 = s1[/* r */2];
      var v1 = s1[/* v */1];
      var l1 = s1[/* l */0];
      var match = split(v1, s2);
      var l2 = match[0];
      if (match[1]) {
        return join(inter(l1, l2), v1, inter(r1, match[2]));
      } else {
        return concat(inter(l1, l2), inter(r1, match[2]));
      }
    } else {
      return /* Empty */0;
    }
  };
  var diff = function (s1, s2) {
    if (s1) {
      if (s2) {
        var r1 = s1[/* r */2];
        var v1 = s1[/* v */1];
        var l1 = s1[/* l */0];
        var match = split(v1, s2);
        var l2 = match[0];
        if (match[1]) {
          return concat(diff(l1, l2), diff(r1, match[2]));
        } else {
          return join(diff(l1, l2), v1, diff(r1, match[2]));
        }
      } else {
        return s1;
      }
    } else {
      return /* Empty */0;
    }
  };
  var cons_enum = function (_s, _e) {
    while(true) {
      var e = _e;
      var s = _s;
      if (s) {
        _e = /* More */[
          s[/* v */1],
          s[/* r */2],
          e
        ];
        _s = s[/* l */0];
        continue ;
      } else {
        return e;
      }
    };
  };
  var compare = function (s1, s2) {
    var _e1 = cons_enum(s1, /* End */0);
    var _e2 = cons_enum(s2, /* End */0);
    while(true) {
      var e2 = _e2;
      var e1 = _e1;
      if (e1) {
        if (e2) {
          var c = Curry._2(funarg.compare, e1[0], e2[0]);
          if (c !== 0) {
            return c;
          } else {
            _e2 = cons_enum(e2[1], e2[2]);
            _e1 = cons_enum(e1[1], e1[2]);
            continue ;
          }
        } else {
          return 1;
        }
      } else if (e2) {
        return -1;
      } else {
        return 0;
      }
    };
  };
  var equal = function (s1, s2) {
    return compare(s1, s2) === 0;
  };
  var subset = function (_s1, _s2) {
    while(true) {
      var s2 = _s2;
      var s1 = _s1;
      if (s1) {
        if (s2) {
          var r2 = s2[/* r */2];
          var l2 = s2[/* l */0];
          var r1 = s1[/* r */2];
          var v1 = s1[/* v */1];
          var l1 = s1[/* l */0];
          var c = Curry._2(funarg.compare, v1, s2[/* v */1]);
          if (c === 0) {
            if (subset(l1, l2)) {
              _s2 = r2;
              _s1 = r1;
              continue ;
            } else {
              return false;
            }
          } else if (c < 0) {
            if (subset(/* Node */[
                    /* l */l1,
                    /* v */v1,
                    /* r : Empty */0,
                    /* h */0
                  ], l2)) {
              _s1 = r1;
              continue ;
            } else {
              return false;
            }
          } else if (subset(/* Node */[
                  /* l : Empty */0,
                  /* v */v1,
                  /* r */r1,
                  /* h */0
                ], r2)) {
            _s1 = l1;
            continue ;
          } else {
            return false;
          }
        } else {
          return false;
        }
      } else {
        return true;
      }
    };
  };
  var iter = function (f, _param) {
    while(true) {
      var param = _param;
      if (param) {
        iter(f, param[/* l */0]);
        Curry._1(f, param[/* v */1]);
        _param = param[/* r */2];
        continue ;
      } else {
        return /* () */0;
      }
    };
  };
  var fold = function (f, _s, _accu) {
    while(true) {
      var accu = _accu;
      var s = _s;
      if (s) {
        _accu = Curry._2(f, s[/* v */1], fold(f, s[/* l */0], accu));
        _s = s[/* r */2];
        continue ;
      } else {
        return accu;
      }
    };
  };
  var for_all = function (p, _param) {
    while(true) {
      var param = _param;
      if (param) {
        if (Curry._1(p, param[/* v */1]) && for_all(p, param[/* l */0])) {
          _param = param[/* r */2];
          continue ;
        } else {
          return false;
        }
      } else {
        return true;
      }
    };
  };
  var exists = function (p, _param) {
    while(true) {
      var param = _param;
      if (param) {
        if (Curry._1(p, param[/* v */1]) || exists(p, param[/* l */0])) {
          return true;
        } else {
          _param = param[/* r */2];
          continue ;
        }
      } else {
        return false;
      }
    };
  };
  var filter = function (p, t) {
    if (t) {
      var r = t[/* r */2];
      var v = t[/* v */1];
      var l = t[/* l */0];
      var l$prime = filter(p, l);
      var pv = Curry._1(p, v);
      var r$prime = filter(p, r);
      if (pv) {
        if (l === l$prime && r === r$prime) {
          return t;
        } else {
          return join(l$prime, v, r$prime);
        }
      } else {
        return concat(l$prime, r$prime);
      }
    } else {
      return /* Empty */0;
    }
  };
  var partition = function (p, param) {
    if (param) {
      var v = param[/* v */1];
      var match = partition(p, param[/* l */0]);
      var lf = match[1];
      var lt = match[0];
      var pv = Curry._1(p, v);
      var match$1 = partition(p, param[/* r */2]);
      var rf = match$1[1];
      var rt = match$1[0];
      if (pv) {
        return /* tuple */[
                join(lt, v, rt),
                concat(lf, rf)
              ];
      } else {
        return /* tuple */[
                concat(lt, rt),
                join(lf, v, rf)
              ];
      }
    } else {
      return /* tuple */[
              /* Empty */0,
              /* Empty */0
            ];
    }
  };
  var cardinal = function (param) {
    if (param) {
      return (cardinal(param[/* l */0]) + 1 | 0) + cardinal(param[/* r */2]) | 0;
    } else {
      return 0;
    }
  };
  var elements_aux = function (_accu, _param) {
    while(true) {
      var param = _param;
      var accu = _accu;
      if (param) {
        _param = param[/* l */0];
        _accu = /* :: */[
          param[/* v */1],
          elements_aux(accu, param[/* r */2])
        ];
        continue ;
      } else {
        return accu;
      }
    };
  };
  var elements = function (s) {
    return elements_aux(/* [] */0, s);
  };
  var find = function (x, _param) {
    while(true) {
      var param = _param;
      if (param) {
        var v = param[/* v */1];
        var c = Curry._2(funarg.compare, x, v);
        if (c === 0) {
          return v;
        } else {
          _param = c < 0 ? param[/* l */0] : param[/* r */2];
          continue ;
        }
      } else {
        throw Caml_builtin_exceptions.not_found;
      }
    };
  };
  var find_first = function (f, _param) {
    while(true) {
      var param = _param;
      if (param) {
        var v = param[/* v */1];
        if (Curry._1(f, v)) {
          var _v0 = v;
          var f$1 = f;
          var _param$1 = param[/* l */0];
          while(true) {
            var param$1 = _param$1;
            var v0 = _v0;
            if (param$1) {
              var v$1 = param$1[/* v */1];
              if (Curry._1(f$1, v$1)) {
                _param$1 = param$1[/* l */0];
                _v0 = v$1;
                continue ;
              } else {
                _param$1 = param$1[/* r */2];
                continue ;
              }
            } else {
              return v0;
            }
          };
        } else {
          _param = param[/* r */2];
          continue ;
        }
      } else {
        throw Caml_builtin_exceptions.not_found;
      }
    };
  };
  var find_first_opt = function (f, _param) {
    while(true) {
      var param = _param;
      if (param) {
        var v = param[/* v */1];
        if (Curry._1(f, v)) {
          var _v0 = v;
          var f$1 = f;
          var _param$1 = param[/* l */0];
          while(true) {
            var param$1 = _param$1;
            var v0 = _v0;
            if (param$1) {
              var v$1 = param$1[/* v */1];
              if (Curry._1(f$1, v$1)) {
                _param$1 = param$1[/* l */0];
                _v0 = v$1;
                continue ;
              } else {
                _param$1 = param$1[/* r */2];
                continue ;
              }
            } else {
              return Caml_option.some(v0);
            }
          };
        } else {
          _param = param[/* r */2];
          continue ;
        }
      } else {
        return ;
      }
    };
  };
  var find_last = function (f, _param) {
    while(true) {
      var param = _param;
      if (param) {
        var v = param[/* v */1];
        if (Curry._1(f, v)) {
          var _v0 = v;
          var f$1 = f;
          var _param$1 = param[/* r */2];
          while(true) {
            var param$1 = _param$1;
            var v0 = _v0;
            if (param$1) {
              var v$1 = param$1[/* v */1];
              if (Curry._1(f$1, v$1)) {
                _param$1 = param$1[/* r */2];
                _v0 = v$1;
                continue ;
              } else {
                _param$1 = param$1[/* l */0];
                continue ;
              }
            } else {
              return v0;
            }
          };
        } else {
          _param = param[/* l */0];
          continue ;
        }
      } else {
        throw Caml_builtin_exceptions.not_found;
      }
    };
  };
  var find_last_opt = function (f, _param) {
    while(true) {
      var param = _param;
      if (param) {
        var v = param[/* v */1];
        if (Curry._1(f, v)) {
          var _v0 = v;
          var f$1 = f;
          var _param$1 = param[/* r */2];
          while(true) {
            var param$1 = _param$1;
            var v0 = _v0;
            if (param$1) {
              var v$1 = param$1[/* v */1];
              if (Curry._1(f$1, v$1)) {
                _param$1 = param$1[/* r */2];
                _v0 = v$1;
                continue ;
              } else {
                _param$1 = param$1[/* l */0];
                continue ;
              }
            } else {
              return Caml_option.some(v0);
            }
          };
        } else {
          _param = param[/* l */0];
          continue ;
        }
      } else {
        return ;
      }
    };
  };
  var find_opt = function (x, _param) {
    while(true) {
      var param = _param;
      if (param) {
        var v = param[/* v */1];
        var c = Curry._2(funarg.compare, x, v);
        if (c === 0) {
          return Caml_option.some(v);
        } else {
          _param = c < 0 ? param[/* l */0] : param[/* r */2];
          continue ;
        }
      } else {
        return ;
      }
    };
  };
  var map = function (f, t) {
    if (t) {
      var r = t[/* r */2];
      var v = t[/* v */1];
      var l = t[/* l */0];
      var l$prime = map(f, l);
      var v$prime = Curry._1(f, v);
      var r$prime = map(f, r);
      if (l === l$prime && v === v$prime && r === r$prime) {
        return t;
      } else {
        var l$1 = l$prime;
        var v$1 = v$prime;
        var r$1 = r$prime;
        if ((l$1 === /* Empty */0 || Curry._2(funarg.compare, max_elt(l$1), v$1) < 0) && (r$1 === /* Empty */0 || Curry._2(funarg.compare, v$1, min_elt(r$1)) < 0)) {
          return join(l$1, v$1, r$1);
        } else {
          return union(l$1, add(v$1, r$1));
        }
      }
    } else {
      return /* Empty */0;
    }
  };
  var of_list = function (l) {
    if (l) {
      var match = l[1];
      var x0 = l[0];
      if (match) {
        var match$1 = match[1];
        var x1 = match[0];
        if (match$1) {
          var match$2 = match$1[1];
          var x2 = match$1[0];
          if (match$2) {
            var match$3 = match$2[1];
            var x3 = match$2[0];
            if (match$3) {
              if (match$3[1]) {
                var l$1 = List.sort_uniq(funarg.compare, l);
                var sub = function (n, l) {
                  switch (n) {
                    case 0 :
                        return /* tuple */[
                                /* Empty */0,
                                l
                              ];
                    case 1 :
                        if (l) {
                          return /* tuple */[
                                  /* Node */[
                                    /* l : Empty */0,
                                    /* v */l[0],
                                    /* r : Empty */0,
                                    /* h */1
                                  ],
                                  l[1]
                                ];
                        }
                        break;
                    case 2 :
                        if (l) {
                          var match = l[1];
                          if (match) {
                            return /* tuple */[
                                    /* Node */[
                                      /* l : Node */[
                                        /* l : Empty */0,
                                        /* v */l[0],
                                        /* r : Empty */0,
                                        /* h */1
                                      ],
                                      /* v */match[0],
                                      /* r : Empty */0,
                                      /* h */2
                                    ],
                                    match[1]
                                  ];
                          }
                          
                        }
                        break;
                    case 3 :
                        if (l) {
                          var match$1 = l[1];
                          if (match$1) {
                            var match$2 = match$1[1];
                            if (match$2) {
                              return /* tuple */[
                                      /* Node */[
                                        /* l : Node */[
                                          /* l : Empty */0,
                                          /* v */l[0],
                                          /* r : Empty */0,
                                          /* h */1
                                        ],
                                        /* v */match$1[0],
                                        /* r : Node */[
                                          /* l : Empty */0,
                                          /* v */match$2[0],
                                          /* r : Empty */0,
                                          /* h */1
                                        ],
                                        /* h */2
                                      ],
                                      match$2[1]
                                    ];
                            }
                            
                          }
                          
                        }
                        break;
                    default:
                      
                  }
                  var nl = n / 2 | 0;
                  var match$3 = sub(nl, l);
                  var l$1 = match$3[1];
                  if (l$1) {
                    var match$4 = sub((n - nl | 0) - 1 | 0, l$1[1]);
                    return /* tuple */[
                            create(match$3[0], l$1[0], match$4[0]),
                            match$4[1]
                          ];
                  } else {
                    throw [
                          Caml_builtin_exceptions.assert_failure,
                          /* tuple */[
                            "set.ml",
                            510,
                            18
                          ]
                        ];
                  }
                };
                return sub(List.length(l$1), l$1)[0];
              } else {
                return add(match$3[0], add(x3, add(x2, add(x1, singleton(x0)))));
              }
            } else {
              return add(x3, add(x2, add(x1, singleton(x0))));
            }
          } else {
            return add(x2, add(x1, singleton(x0)));
          }
        } else {
          return add(x1, singleton(x0));
        }
      } else {
        return singleton(x0);
      }
    } else {
      return /* Empty */0;
    }
  };
  return {
          empty: /* Empty */0,
          is_empty: is_empty,
          mem: mem,
          add: add,
          singleton: singleton,
          remove: remove,
          union: union,
          inter: inter,
          diff: diff,
          compare: compare,
          equal: equal,
          subset: subset,
          iter: iter,
          map: map,
          fold: fold,
          for_all: for_all,
          exists: exists,
          filter: filter,
          partition: partition,
          cardinal: cardinal,
          elements: elements,
          min_elt: min_elt,
          min_elt_opt: min_elt_opt,
          max_elt: max_elt,
          max_elt_opt: max_elt_opt,
          choose: min_elt,
          choose_opt: min_elt_opt,
          split: split,
          find: find,
          find_opt: find_opt,
          find_first: find_first,
          find_first_opt: find_first_opt,
          find_last: find_last,
          find_last_opt: find_last_opt,
          of_list: of_list
        };
}

exports.Make = Make;
/* No side effect */

},{"./caml_builtin_exceptions.js":6,"./caml_option.js":16,"./curry.js":24,"./list.js":25}],30:[function(require,module,exports){
'use strict';

var Bytes = require("./bytes.js");
var Curry = require("./curry.js");
var Caml_bytes = require("./caml_bytes.js");
var Caml_primitive = require("./caml_primitive.js");
var Caml_builtin_exceptions = require("./caml_builtin_exceptions.js");

function make(n, c) {
  return Caml_bytes.bytes_to_string(Bytes.make(n, c));
}

function init(n, f) {
  return Caml_bytes.bytes_to_string(Bytes.init(n, f));
}

function copy(s) {
  return Caml_bytes.bytes_to_string(Bytes.copy(Caml_bytes.bytes_of_string(s)));
}

function sub(s, ofs, len) {
  return Caml_bytes.bytes_to_string(Bytes.sub(Caml_bytes.bytes_of_string(s), ofs, len));
}

function ensure_ge(x, y) {
  if (x >= y) {
    return x;
  } else {
    throw [
          Caml_builtin_exceptions.invalid_argument,
          "String.concat"
        ];
  }
}

function sum_lengths(_acc, seplen, _param) {
  while(true) {
    var param = _param;
    var acc = _acc;
    if (param) {
      var tl = param[1];
      var hd = param[0];
      if (tl) {
        _param = tl;
        _acc = ensure_ge((hd.length + seplen | 0) + acc | 0, acc);
        continue ;
      } else {
        return hd.length + acc | 0;
      }
    } else {
      return acc;
    }
  };
}

function unsafe_blits(dst, _pos, sep, seplen, _param) {
  while(true) {
    var param = _param;
    var pos = _pos;
    if (param) {
      var tl = param[1];
      var hd = param[0];
      if (tl) {
        Caml_bytes.caml_blit_string(hd, 0, dst, pos, hd.length);
        Caml_bytes.caml_blit_string(sep, 0, dst, pos + hd.length | 0, seplen);
        _param = tl;
        _pos = (pos + hd.length | 0) + seplen | 0;
        continue ;
      } else {
        Caml_bytes.caml_blit_string(hd, 0, dst, pos, hd.length);
        return dst;
      }
    } else {
      return dst;
    }
  };
}

function concat(sep, l) {
  if (l) {
    var seplen = sep.length;
    return Caml_bytes.bytes_to_string(unsafe_blits(Caml_bytes.caml_create_bytes(sum_lengths(0, seplen, l)), 0, sep, seplen, l));
  } else {
    return "";
  }
}

function iter(f, s) {
  for(var i = 0 ,i_finish = s.length - 1 | 0; i <= i_finish; ++i){
    Curry._1(f, s.charCodeAt(i));
  }
  return /* () */0;
}

function iteri(f, s) {
  for(var i = 0 ,i_finish = s.length - 1 | 0; i <= i_finish; ++i){
    Curry._2(f, i, s.charCodeAt(i));
  }
  return /* () */0;
}

function map(f, s) {
  return Caml_bytes.bytes_to_string(Bytes.map(f, Caml_bytes.bytes_of_string(s)));
}

function mapi(f, s) {
  return Caml_bytes.bytes_to_string(Bytes.mapi(f, Caml_bytes.bytes_of_string(s)));
}

function is_space(param) {
  var switcher = param - 9 | 0;
  if (switcher > 4 || switcher < 0) {
    return switcher === 23;
  } else {
    return switcher !== 2;
  }
}

function trim(s) {
  if (s === "" || !(is_space(s.charCodeAt(0)) || is_space(s.charCodeAt(s.length - 1 | 0)))) {
    return s;
  } else {
    return Caml_bytes.bytes_to_string(Bytes.trim(Caml_bytes.bytes_of_string(s)));
  }
}

function escaped(s) {
  var needs_escape = function (_i) {
    while(true) {
      var i = _i;
      if (i >= s.length) {
        return false;
      } else {
        var match = s.charCodeAt(i);
        if (match >= 32) {
          var switcher = match - 34 | 0;
          if (switcher > 58 || switcher < 0) {
            if (switcher >= 93) {
              return true;
            } else {
              _i = i + 1 | 0;
              continue ;
            }
          } else if (switcher > 57 || switcher < 1) {
            return true;
          } else {
            _i = i + 1 | 0;
            continue ;
          }
        } else {
          return true;
        }
      }
    };
  };
  if (needs_escape(0)) {
    return Caml_bytes.bytes_to_string(Bytes.escaped(Caml_bytes.bytes_of_string(s)));
  } else {
    return s;
  }
}

function index_rec(s, lim, _i, c) {
  while(true) {
    var i = _i;
    if (i >= lim) {
      throw Caml_builtin_exceptions.not_found;
    }
    if (s.charCodeAt(i) === c) {
      return i;
    } else {
      _i = i + 1 | 0;
      continue ;
    }
  };
}

function index(s, c) {
  return index_rec(s, s.length, 0, c);
}

function index_rec_opt(s, lim, _i, c) {
  while(true) {
    var i = _i;
    if (i >= lim) {
      return ;
    } else if (s.charCodeAt(i) === c) {
      return i;
    } else {
      _i = i + 1 | 0;
      continue ;
    }
  };
}

function index_opt(s, c) {
  return index_rec_opt(s, s.length, 0, c);
}

function index_from(s, i, c) {
  var l = s.length;
  if (i < 0 || i > l) {
    throw [
          Caml_builtin_exceptions.invalid_argument,
          "String.index_from / Bytes.index_from"
        ];
  }
  return index_rec(s, l, i, c);
}

function index_from_opt(s, i, c) {
  var l = s.length;
  if (i < 0 || i > l) {
    throw [
          Caml_builtin_exceptions.invalid_argument,
          "String.index_from_opt / Bytes.index_from_opt"
        ];
  }
  return index_rec_opt(s, l, i, c);
}

function rindex_rec(s, _i, c) {
  while(true) {
    var i = _i;
    if (i < 0) {
      throw Caml_builtin_exceptions.not_found;
    }
    if (s.charCodeAt(i) === c) {
      return i;
    } else {
      _i = i - 1 | 0;
      continue ;
    }
  };
}

function rindex(s, c) {
  return rindex_rec(s, s.length - 1 | 0, c);
}

function rindex_from(s, i, c) {
  if (i < -1 || i >= s.length) {
    throw [
          Caml_builtin_exceptions.invalid_argument,
          "String.rindex_from / Bytes.rindex_from"
        ];
  }
  return rindex_rec(s, i, c);
}

function rindex_rec_opt(s, _i, c) {
  while(true) {
    var i = _i;
    if (i < 0) {
      return ;
    } else if (s.charCodeAt(i) === c) {
      return i;
    } else {
      _i = i - 1 | 0;
      continue ;
    }
  };
}

function rindex_opt(s, c) {
  return rindex_rec_opt(s, s.length - 1 | 0, c);
}

function rindex_from_opt(s, i, c) {
  if (i < -1 || i >= s.length) {
    throw [
          Caml_builtin_exceptions.invalid_argument,
          "String.rindex_from_opt / Bytes.rindex_from_opt"
        ];
  }
  return rindex_rec_opt(s, i, c);
}

function contains_from(s, i, c) {
  var l = s.length;
  if (i < 0 || i > l) {
    throw [
          Caml_builtin_exceptions.invalid_argument,
          "String.contains_from / Bytes.contains_from"
        ];
  }
  try {
    index_rec(s, l, i, c);
    return true;
  }
  catch (exn){
    if (exn === Caml_builtin_exceptions.not_found) {
      return false;
    } else {
      throw exn;
    }
  }
}

function contains(s, c) {
  return contains_from(s, 0, c);
}

function rcontains_from(s, i, c) {
  if (i < 0 || i >= s.length) {
    throw [
          Caml_builtin_exceptions.invalid_argument,
          "String.rcontains_from / Bytes.rcontains_from"
        ];
  }
  try {
    rindex_rec(s, i, c);
    return true;
  }
  catch (exn){
    if (exn === Caml_builtin_exceptions.not_found) {
      return false;
    } else {
      throw exn;
    }
  }
}

function uppercase_ascii(s) {
  return Caml_bytes.bytes_to_string(Bytes.uppercase_ascii(Caml_bytes.bytes_of_string(s)));
}

function lowercase_ascii(s) {
  return Caml_bytes.bytes_to_string(Bytes.lowercase_ascii(Caml_bytes.bytes_of_string(s)));
}

function capitalize_ascii(s) {
  return Caml_bytes.bytes_to_string(Bytes.capitalize_ascii(Caml_bytes.bytes_of_string(s)));
}

function uncapitalize_ascii(s) {
  return Caml_bytes.bytes_to_string(Bytes.uncapitalize_ascii(Caml_bytes.bytes_of_string(s)));
}

var compare = Caml_primitive.caml_string_compare;

function split_on_char(sep, s) {
  var r = /* [] */0;
  var j = s.length;
  for(var i = s.length - 1 | 0; i >= 0; --i){
    if (s.charCodeAt(i) === sep) {
      r = /* :: */[
        sub(s, i + 1 | 0, (j - i | 0) - 1 | 0),
        r
      ];
      j = i;
    }
    
  }
  return /* :: */[
          sub(s, 0, j),
          r
        ];
}

function uppercase(s) {
  return Caml_bytes.bytes_to_string(Bytes.uppercase(Caml_bytes.bytes_of_string(s)));
}

function lowercase(s) {
  return Caml_bytes.bytes_to_string(Bytes.lowercase(Caml_bytes.bytes_of_string(s)));
}

function capitalize(s) {
  return Caml_bytes.bytes_to_string(Bytes.capitalize(Caml_bytes.bytes_of_string(s)));
}

function uncapitalize(s) {
  return Caml_bytes.bytes_to_string(Bytes.uncapitalize(Caml_bytes.bytes_of_string(s)));
}

var fill = Bytes.fill;

var blit = Bytes.blit_string;

function equal(prim, prim$1) {
  return prim === prim$1;
}

exports.make = make;
exports.init = init;
exports.copy = copy;
exports.sub = sub;
exports.fill = fill;
exports.blit = blit;
exports.concat = concat;
exports.iter = iter;
exports.iteri = iteri;
exports.map = map;
exports.mapi = mapi;
exports.trim = trim;
exports.escaped = escaped;
exports.index = index;
exports.index_opt = index_opt;
exports.rindex = rindex;
exports.rindex_opt = rindex_opt;
exports.index_from = index_from;
exports.index_from_opt = index_from_opt;
exports.rindex_from = rindex_from;
exports.rindex_from_opt = rindex_from_opt;
exports.contains = contains;
exports.contains_from = contains_from;
exports.rcontains_from = rcontains_from;
exports.uppercase = uppercase;
exports.lowercase = lowercase;
exports.capitalize = capitalize;
exports.uncapitalize = uncapitalize;
exports.uppercase_ascii = uppercase_ascii;
exports.lowercase_ascii = lowercase_ascii;
exports.capitalize_ascii = capitalize_ascii;
exports.uncapitalize_ascii = uncapitalize_ascii;
exports.compare = compare;
exports.equal = equal;
exports.split_on_char = split_on_char;
/* No side effect */

},{"./bytes.js":4,"./caml_builtin_exceptions.js":6,"./caml_bytes.js":7,"./caml_primitive.js":17,"./curry.js":24}],31:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],32:[function(require,module,exports){
// Generated by BUCKLESCRIPT, PLEASE EDIT WITH CARE
'use strict';

var Curry = require("bs-platform/lib/js/curry.js");

var getWindow = ( function() { return window; } );

var $$window = Curry._1(getWindow, /* () */0);

function newAnimation(param) {
  return {
          continuing: {
            contents: true
          }
        };
}

function stopAnimation(animation) {
  animation.continuing.contents = false;
  return /* () */0;
}

function runAnimation(animation, state, perFrame) {
  var t = new Date();
  var ts = t.getTime();
  var ns = Curry._2(perFrame, state, ts);
  if (animation.continuing.contents) {
    $$window.requestAnimationFrame((function (param) {
            return runAnimation(animation, ns, perFrame);
          }));
    return /* () */0;
  } else {
    return /* () */0;
  }
}

function startAnimation(animation, state, perFrame) {
  $$window.requestAnimationFrame((function (param) {
          return runAnimation(animation, state, perFrame);
        }));
  return /* () */0;
}

exports.getWindow = getWindow;
exports.$$window = $$window;
exports.newAnimation = newAnimation;
exports.stopAnimation = stopAnimation;
exports.runAnimation = runAnimation;
exports.startAnimation = startAnimation;
/* getWindow Not a pure module */

},{"bs-platform/lib/js/curry.js":24}],33:[function(require,module,exports){
// Generated by BUCKLESCRIPT, PLEASE EDIT WITH CARE
'use strict';


function WithCanvas(C) {
  var withNewCanvas = ( function(name,x,y,f) { var parent = document.getElementById(name); var canvas = document.createElement('canvas'); canvas.setAttribute('width', x); canvas.setAttribute('height', y); parent.appendChild(canvas); var res = f(canvas); parent.removeChild(canvas); return res; } );
  return {
          withNewCanvas: withNewCanvas
        };
}

var getCanvas = ( function(name) { var canvasElt = document.getElementById(name); return canvasElt; } );

var canvasToImage = ( function(c) { return c; } );

var getContext2D = ( function(canvas) { return canvas.getContext('2d'); } );

var setFocus = ( function(name) { var elt = document.getElementById(name); elt.focus(); } );

var fillStyleOfString = ( function(s) { return s; } );

var ImageFromCanvasUser = { };

var withNewCanvas = ( function(name,x,y,f) { var parent = document.getElementById(name); var canvas = document.createElement('canvas'); canvas.setAttribute('width', x); canvas.setAttribute('height', y); parent.appendChild(canvas); var res = f(canvas); parent.removeChild(canvas); return res; } );

var ImageFromCanvas = {
  withNewCanvas: withNewCanvas
};

exports.WithCanvas = WithCanvas;
exports.getCanvas = getCanvas;
exports.canvasToImage = canvasToImage;
exports.getContext2D = getContext2D;
exports.setFocus = setFocus;
exports.fillStyleOfString = fillStyleOfString;
exports.ImageFromCanvasUser = ImageFromCanvasUser;
exports.ImageFromCanvas = ImageFromCanvas;
/* getCanvas Not a pure module */

},{}],34:[function(require,module,exports){
// Generated by BUCKLESCRIPT, PLEASE EDIT WITH CARE
'use strict';


var workerPop = 10.0;

exports.workerPop = workerPop;
/* No side effect */

},{}],35:[function(require,module,exports){
// Generated by BUCKLESCRIPT, PLEASE EDIT WITH CARE
'use strict';

var City = require("./city.bs.js");
var List = require("bs-platform/lib/js/list.js");
var $$Math = require("./math.bs.js");
var Block = require("bs-platform/lib/js/block.js");
var Curry = require("bs-platform/lib/js/curry.js");
var Printf = require("bs-platform/lib/js/printf.js");
var Namegen = require("./namegen.bs.js");
var Caml_array = require("bs-platform/lib/js/caml_array.js");
var WorkerMethods = require("./workerMethods.bs.js");
var Caml_primitive = require("bs-platform/lib/js/caml_primitive.js");

function newCity(cx, cy) {
  return {
          x: cx,
          y: cy,
          ruin: 0.0,
          name: Namegen.generateRandomName(3),
          population: 100.0,
          food: 100.0
        };
}

function addWorkerProduct(w, city) {
  return {
          x: city.x,
          y: city.y,
          ruin: city.ruin,
          name: city.name,
          population: city.population + City.workerPop,
          food: city.food + w.food
        };
}

function workerProb(city) {
  return Caml_primitive.caml_float_max(0.01, 0.7 * (city.population / city.food));
}

function rankResource(city, param, param$1) {
  var here_000 = city.x + 0.5;
  var here_001 = city.y + 0.5;
  var here = /* tuple */[
    here_000,
    here_001
  ];
  var ad = $$Math.distance(here, $$Math.toFloatPoint(param[0]));
  var bd = $$Math.distance(here, $$Math.toFloatPoint(param$1[0]));
  return Caml_primitive.caml_float_compare(ad, bd);
}

function sortByBenefit(city, param, param$1) {
  return rankResource(city, /* tuple */[
              param[0],
              param[1]
            ], /* tuple */[
              param$1[0],
              param$1[1]
            ]);
}

function randomPatrolLocation(city) {
  var coords = /* array */[
    -5,
    -4,
    -3,
    3,
    4,
    5
  ];
  var clen = coords.length;
  var cx = Math.random() * clen | 0;
  var cy = Math.random() * clen | 0;
  var targetX = city.x + Caml_array.caml_array_get(coords, cx) | 0;
  var targetY = city.y + Caml_array.caml_array_get(coords, cy) | 0;
  return /* tuple */[
          /* tuple */[
            targetX,
            targetY
          ],
          /* Patrol */[/* tuple */[
              targetX,
              targetY
            ]]
        ];
}

function whatWeKnowToTarget(v) {
  var match = v[0];
  return /* tuple */[
          (function (param) {
              return WorkerMethods.addWorkerFood(10.0, param);
            }),
          /* TargetCoords */Block.__(1, [/* tuple */[
                match[0],
                match[1]
              ]])
        ];
}

function getAdvantageousOutings(gamestate, city) {
  var randomPatrol = randomPatrolLocation(city);
  var knownResources = List.map((function (param) {
          return param[1];
        }), List.sort((function (param, param$1) {
              return sortByBenefit(city, param, param$1);
            }), /* :: */[
            randomPatrol,
            /* [] */0
          ]));
  return List.map(whatWeKnowToTarget, knownResources);
}

function spawnWorker(gamestate, city) {
  var match = $$Math.randomlyChooseInOrder(0.5, getAdvantageousOutings(gamestate, city));
  if (match !== undefined) {
    var match$1 = match;
    var updated_x = city.x;
    var updated_y = city.y;
    var updated_ruin = city.ruin;
    var updated_name = city.name;
    var updated_population = city.population - City.workerPop;
    var updated_food = city.food;
    var updated = {
      x: updated_x,
      y: updated_y,
      ruin: updated_ruin,
      name: updated_name,
      population: updated_population,
      food: updated_food
    };
    var worker = Curry._1(match$1[0], WorkerMethods.newWorker(city, match$1[1]));
    console.log(worker);
    return /* tuple */[
            updated,
            worker
          ];
  } else {
    return /* tuple */[
            city,
            undefined
          ];
  }
}

function runCity(gamestate, incT, city) {
  if (city.ruin > 0.0) {
    var ruined = city.ruin - incT;
    if (ruined <= 0.0) {
      console.log(Curry._1(Printf.sprintf(/* Format */[
                    /* String_literal */Block.__(11, [
                        "destroy city ",
                        /* String */Block.__(2, [
                            /* No_padding */0,
                            /* End_of_format */0
                          ])
                      ]),
                    "destroy city %s"
                  ]), city.name));
      return /* tuple */[
              {
                x: city.x,
                y: city.y,
                ruin: -1.0,
                name: city.name,
                population: city.population,
                food: city.food
              },
              /* CityDestroyed */Block.__(0, [city.name])
            ];
    } else {
      return /* tuple */[
              {
                x: city.x,
                y: city.y,
                ruin: ruined,
                name: city.name,
                population: city.population,
                food: city.food
              },
              undefined
            ];
    }
  } else if (city.ruin === 0.0) {
    var updatedFood = city.food - city.population * 0.33 * incT;
    var updatedPop = updatedFood > city.population + 1.25 ? city.population + city.population * 0.1 : city.population;
    var cityWithFood_x = city.x;
    var cityWithFood_y = city.y;
    var cityWithFood_ruin = city.ruin;
    var cityWithFood_name = city.name;
    var cityWithFood = {
      x: cityWithFood_x,
      y: cityWithFood_y,
      ruin: cityWithFood_ruin,
      name: cityWithFood_name,
      population: updatedPop,
      food: updatedFood
    };
    var prob = workerProb(city);
    var rnd = Math.random() / incT;
    var trySpawnWorker = prob > rnd;
    var canSpawnWorker = city.population >= 20.0 && city.food >= 5.0;
    if (updatedFood < 0.0) {
      console.log(Curry._1(Printf.sprintf(/* Format */[
                    /* String_literal */Block.__(11, [
                        "ruin city ",
                        /* String */Block.__(2, [
                            /* No_padding */0,
                            /* End_of_format */0
                          ])
                      ]),
                    "ruin city %s"
                  ]), city.name));
      return /* tuple */[
              {
                x: cityWithFood_x,
                y: cityWithFood_y,
                ruin: 1.0,
                name: cityWithFood_name,
                population: updatedPop,
                food: updatedFood
              },
              undefined
            ];
    } else if (trySpawnWorker && canSpawnWorker) {
      var match = spawnWorker(gamestate, cityWithFood);
      var worker = match[1];
      var city$1 = match[0];
      console.log(Curry._4(Printf.sprintf(/* Format */[
                    /* String_literal */Block.__(11, [
                        "Spawn worker prob ",
                        /* Float */Block.__(8, [
                            /* Float_f */0,
                            /* No_padding */0,
                            /* No_precision */0,
                            /* String_literal */Block.__(11, [
                                " rnd ",
                                /* Float */Block.__(8, [
                                    /* Float_f */0,
                                    /* No_padding */0,
                                    /* No_precision */0,
                                    /* String_literal */Block.__(11, [
                                        " pop ",
                                        /* Float */Block.__(8, [
                                            /* Float_f */0,
                                            /* No_padding */0,
                                            /* No_precision */0,
                                            /* String_literal */Block.__(11, [
                                                " food ",
                                                /* Float */Block.__(8, [
                                                    /* Float_f */0,
                                                    /* No_padding */0,
                                                    /* No_precision */0,
                                                    /* End_of_format */0
                                                  ])
                                              ])
                                          ])
                                      ])
                                  ])
                              ])
                          ])
                      ]),
                    "Spawn worker prob %f rnd %f pop %f food %f"
                  ]), prob, rnd, city$1.population, city$1.food));
      console.log(city$1);
      console.log(worker);
      if (worker !== undefined) {
        return /* tuple */[
                city$1,
                /* SpawnWorker */Block.__(1, [worker])
              ];
      } else {
        return /* tuple */[
                city$1,
                undefined
              ];
      }
    } else {
      return /* tuple */[
              cityWithFood,
              undefined
            ];
    }
  } else {
    return /* tuple */[
            city,
            undefined
          ];
  }
}

var cityRuinTime = 1.0;

var eatingRate = 0.33;

var workerProbFactor = 0.7;

exports.cityRuinTime = cityRuinTime;
exports.eatingRate = eatingRate;
exports.workerProbFactor = workerProbFactor;
exports.newCity = newCity;
exports.addWorkerProduct = addWorkerProduct;
exports.workerProb = workerProb;
exports.rankResource = rankResource;
exports.sortByBenefit = sortByBenefit;
exports.randomPatrolLocation = randomPatrolLocation;
exports.whatWeKnowToTarget = whatWeKnowToTarget;
exports.getAdvantageousOutings = getAdvantageousOutings;
exports.spawnWorker = spawnWorker;
exports.runCity = runCity;
/* Math Not a pure module */

},{"./city.bs.js":34,"./math.bs.js":46,"./namegen.bs.js":48,"./workerMethods.bs.js":57,"bs-platform/lib/js/block.js":2,"bs-platform/lib/js/caml_array.js":5,"bs-platform/lib/js/caml_primitive.js":17,"bs-platform/lib/js/curry.js":24,"bs-platform/lib/js/list.js":25,"bs-platform/lib/js/printf.js":28}],36:[function(require,module,exports){
// Generated by BUCKLESCRIPT, PLEASE EDIT WITH CARE
'use strict';

var Block = require("bs-platform/lib/js/block.js");
var Curry = require("bs-platform/lib/js/curry.js");
var Printf = require("bs-platform/lib/js/printf.js");
var Caml_array = require("bs-platform/lib/js/caml_array.js");
var Caml_primitive = require("bs-platform/lib/js/caml_primitive.js");

var palette = /* array */[
  {
    r: 0,
    b: 0,
    g: 0,
    a: 1.0
  },
  {
    r: 64,
    b: 64,
    g: 64,
    a: 1.0
  },
  {
    r: 108,
    b: 108,
    g: 108,
    a: 1.0
  },
  {
    r: 144,
    b: 144,
    g: 144,
    a: 1.0
  },
  {
    r: 176,
    b: 176,
    g: 176,
    a: 1.0
  },
  {
    r: 200,
    b: 200,
    g: 200,
    a: 1.0
  },
  {
    r: 220,
    b: 220,
    g: 220,
    a: 1.0
  },
  {
    r: 236,
    b: 236,
    g: 236,
    a: 1.0
  },
  {
    r: 68,
    b: 0,
    g: 68,
    a: 1.0
  },
  {
    r: 100,
    b: 16,
    g: 100,
    a: 1.0
  },
  {
    r: 132,
    b: 36,
    g: 132,
    a: 1.0
  },
  {
    r: 160,
    b: 52,
    g: 160,
    a: 1.0
  },
  {
    r: 184,
    b: 64,
    g: 184,
    a: 1.0
  },
  {
    r: 208,
    b: 80,
    g: 208,
    a: 1.0
  },
  {
    r: 232,
    b: 92,
    g: 232,
    a: 1.0
  },
  {
    r: 252,
    b: 104,
    g: 252,
    a: 1.0
  },
  {
    r: 112,
    b: 0,
    g: 40,
    a: 1.0
  },
  {
    r: 132,
    b: 20,
    g: 68,
    a: 1.0
  },
  {
    r: 152,
    b: 40,
    g: 92,
    a: 1.0
  },
  {
    r: 172,
    b: 60,
    g: 120,
    a: 1.0
  },
  {
    r: 188,
    b: 76,
    g: 140,
    a: 1.0
  },
  {
    r: 204,
    b: 92,
    g: 160,
    a: 1.0
  },
  {
    r: 220,
    b: 104,
    g: 180,
    a: 1.0
  },
  {
    r: 236,
    b: 120,
    g: 200,
    a: 1.0
  },
  {
    r: 136,
    b: 0,
    g: 0,
    a: 1.0
  },
  {
    r: 156,
    b: 32,
    g: 32,
    a: 1.0
  },
  {
    r: 176,
    b: 60,
    g: 60,
    a: 1.0
  },
  {
    r: 192,
    b: 88,
    g: 88,
    a: 1.0
  },
  {
    r: 208,
    b: 112,
    g: 112,
    a: 1.0
  },
  {
    r: 224,
    b: 136,
    g: 136,
    a: 1.0
  },
  {
    r: 236,
    b: 160,
    g: 160,
    a: 1.0
  },
  {
    r: 252,
    b: 180,
    g: 180,
    a: 1.0
  },
  {
    r: 120,
    b: 92,
    g: 0,
    a: 1.0
  },
  {
    r: 140,
    b: 116,
    g: 32,
    a: 1.0
  },
  {
    r: 160,
    b: 136,
    g: 60,
    a: 1.0
  },
  {
    r: 176,
    b: 156,
    g: 88,
    a: 1.0
  },
  {
    r: 192,
    b: 176,
    g: 112,
    a: 1.0
  },
  {
    r: 208,
    b: 192,
    g: 132,
    a: 1.0
  },
  {
    r: 220,
    b: 208,
    g: 140,
    a: 1.0
  },
  {
    r: 236,
    b: 224,
    g: 176,
    a: 1.0
  },
  {
    r: 72,
    b: 120,
    g: 0,
    a: 1.0
  },
  {
    r: 96,
    b: 144,
    g: 32,
    a: 1.0
  },
  {
    r: 120,
    b: 164,
    g: 60,
    a: 1.0
  },
  {
    r: 140,
    b: 184,
    g: 88,
    a: 1.0
  },
  {
    r: 160,
    b: 204,
    g: 112,
    a: 1.0
  },
  {
    r: 180,
    b: 220,
    g: 132,
    a: 1.0
  },
  {
    r: 196,
    b: 236,
    g: 156,
    a: 1.0
  },
  {
    r: 212,
    b: 252,
    g: 176,
    a: 1.0
  },
  {
    r: 20,
    b: 132,
    g: 0,
    a: 1.0
  },
  {
    r: 48,
    b: 152,
    g: 32,
    a: 1.0
  },
  {
    r: 76,
    b: 172,
    g: 60,
    a: 1.0
  },
  {
    r: 104,
    b: 192,
    g: 88,
    a: 1.0
  },
  {
    r: 124,
    b: 208,
    g: 112,
    a: 1.0
  },
  {
    r: 148,
    b: 224,
    g: 136,
    a: 1.0
  },
  {
    r: 168,
    b: 236,
    g: 160,
    a: 1.0
  },
  {
    r: 188,
    b: 252,
    g: 180,
    a: 1.0
  },
  {
    r: 0,
    b: 136,
    g: 0,
    a: 1.0
  },
  {
    r: 28,
    b: 156,
    g: 32,
    a: 1.0
  },
  {
    r: 56,
    b: 176,
    g: 64,
    a: 1.0
  },
  {
    r: 80,
    b: 192,
    g: 92,
    a: 1.0
  },
  {
    r: 104,
    b: 208,
    g: 116,
    a: 1.0
  },
  {
    r: 124,
    b: 224,
    g: 140,
    a: 1.0
  },
  {
    r: 144,
    b: 236,
    g: 164,
    a: 1.0
  },
  {
    r: 164,
    b: 252,
    g: 184,
    a: 1.0
  },
  {
    r: 0,
    b: 124,
    g: 24,
    a: 1.0
  },
  {
    r: 28,
    b: 144,
    g: 56,
    a: 1.0
  },
  {
    r: 56,
    b: 168,
    g: 84,
    a: 1.0
  },
  {
    r: 80,
    b: 188,
    g: 112,
    a: 1.0
  },
  {
    r: 104,
    b: 204,
    g: 136,
    a: 1.0
  },
  {
    r: 124,
    b: 220,
    g: 156,
    a: 1.0
  },
  {
    r: 144,
    b: 236,
    g: 180,
    a: 1.0
  },
  {
    r: 164,
    b: 252,
    g: 200,
    a: 1.0
  },
  {
    r: 0,
    b: 92,
    g: 44,
    a: 1.0
  },
  {
    r: 28,
    b: 120,
    g: 76,
    a: 1.0
  },
  {
    r: 56,
    b: 144,
    g: 104,
    a: 1.0
  },
  {
    r: 80,
    b: 172,
    g: 132,
    a: 1.0
  },
  {
    r: 104,
    b: 192,
    g: 156,
    a: 1.0
  },
  {
    r: 124,
    b: 212,
    g: 180,
    a: 1.0
  },
  {
    r: 144,
    b: 232,
    g: 204,
    a: 1.0
  },
  {
    r: 164,
    b: 252,
    g: 224,
    a: 1.0
  },
  {
    r: 0,
    b: 44,
    g: 60,
    a: 1.0
  },
  {
    r: 28,
    b: 72,
    g: 92,
    a: 1.0
  },
  {
    r: 56,
    b: 100,
    g: 124,
    a: 1.0
  },
  {
    r: 80,
    b: 128,
    g: 156,
    a: 1.0
  },
  {
    r: 104,
    b: 148,
    g: 180,
    a: 1.0
  },
  {
    r: 124,
    b: 172,
    g: 208,
    a: 1.0
  },
  {
    r: 144,
    b: 192,
    g: 228,
    a: 1.0
  },
  {
    r: 164,
    b: 212,
    g: 252,
    a: 1.0
  },
  {
    r: 0,
    b: 0,
    g: 60,
    a: 1.0
  },
  {
    r: 32,
    b: 32,
    g: 92,
    a: 1.0
  },
  {
    r: 64,
    b: 64,
    g: 124,
    a: 1.0
  },
  {
    r: 92,
    b: 92,
    g: 156,
    a: 1.0
  },
  {
    r: 116,
    b: 116,
    g: 180,
    a: 1.0
  },
  {
    r: 140,
    b: 140,
    g: 208,
    a: 1.0
  },
  {
    r: 164,
    b: 164,
    g: 228,
    a: 1.0
  },
  {
    r: 184,
    b: 184,
    g: 252,
    a: 1.0
  },
  {
    r: 20,
    b: 0,
    g: 56,
    a: 1.0
  },
  {
    r: 52,
    b: 28,
    g: 92,
    a: 1.0
  },
  {
    r: 80,
    b: 56,
    g: 124,
    a: 1.0
  },
  {
    r: 108,
    b: 80,
    g: 152,
    a: 1.0
  },
  {
    r: 132,
    b: 104,
    g: 180,
    a: 1.0
  },
  {
    r: 156,
    b: 124,
    g: 204,
    a: 1.0
  },
  {
    r: 180,
    b: 144,
    g: 228,
    a: 1.0
  },
  {
    r: 200,
    b: 164,
    g: 252,
    a: 1.0
  },
  {
    r: 44,
    b: 0,
    g: 48,
    a: 1.0
  },
  {
    r: 76,
    b: 28,
    g: 80,
    a: 1.0
  },
  {
    r: 104,
    b: 52,
    g: 112,
    a: 1.0
  },
  {
    r: 132,
    b: 76,
    g: 140,
    a: 1.0
  },
  {
    r: 156,
    b: 100,
    g: 168,
    a: 1.0
  },
  {
    r: 180,
    b: 120,
    g: 192,
    a: 1.0
  },
  {
    r: 204,
    b: 136,
    g: 212,
    a: 1.0
  },
  {
    r: 224,
    b: 156,
    g: 236,
    a: 1.0
  },
  {
    r: 68,
    b: 0,
    g: 40,
    a: 1.0
  },
  {
    r: 100,
    b: 24,
    g: 72,
    a: 1.0
  },
  {
    r: 132,
    b: 48,
    g: 104,
    a: 1.0
  },
  {
    r: 160,
    b: 68,
    g: 132,
    a: 1.0
  },
  {
    r: 184,
    b: 88,
    g: 156,
    a: 1.0
  },
  {
    r: 208,
    b: 108,
    g: 180,
    a: 1.0
  },
  {
    r: 232,
    b: 124,
    g: 204,
    a: 1.0
  },
  {
    r: 252,
    b: 140,
    g: 224,
    a: 1.0
  }
];

function colorOfCoord(param) {
  return Caml_array.caml_array_get(palette, (param[0] << 3) + param[1] | 0);
}

function stringOfColor(color) {
  return Curry._4(Printf.sprintf(/* Format */[
                  /* String_literal */Block.__(11, [
                      "rgba(",
                      /* Int */Block.__(4, [
                          /* Int_d */0,
                          /* No_padding */0,
                          /* No_precision */0,
                          /* Char_literal */Block.__(12, [
                              /* "," */44,
                              /* Int */Block.__(4, [
                                  /* Int_d */0,
                                  /* No_padding */0,
                                  /* No_precision */0,
                                  /* Char_literal */Block.__(12, [
                                      /* "," */44,
                                      /* Int */Block.__(4, [
                                          /* Int_d */0,
                                          /* No_padding */0,
                                          /* No_precision */0,
                                          /* Char_literal */Block.__(12, [
                                              /* "," */44,
                                              /* Float */Block.__(8, [
                                                  /* Float_f */0,
                                                  /* No_padding */0,
                                                  /* No_precision */0,
                                                  /* Char_literal */Block.__(12, [
                                                      /* ")" */41,
                                                      /* End_of_format */0
                                                    ])
                                                ])
                                            ])
                                        ])
                                    ])
                                ])
                            ])
                        ])
                    ]),
                  "rgba(%d,%d,%d,%f)"
                ]), color.r, color.g, color.b, color.a);
}

function colorFromPalette(palette, level) {
  var colorChoice = Caml_primitive.caml_int_min(palette.length - 1 | 0, Math.floor(level * palette.length) | 0);
  return Caml_array.caml_array_get(palette, colorChoice);
}

exports.palette = palette;
exports.colorOfCoord = colorOfCoord;
exports.stringOfColor = stringOfColor;
exports.colorFromPalette = colorFromPalette;
/* No side effect */

},{"bs-platform/lib/js/block.js":2,"bs-platform/lib/js/caml_array.js":5,"bs-platform/lib/js/caml_primitive.js":17,"bs-platform/lib/js/curry.js":24,"bs-platform/lib/js/printf.js":28}],37:[function(require,module,exports){
// Generated by BUCKLESCRIPT, PLEASE EDIT WITH CARE
'use strict';


var worldSide = 64;

exports.worldSide = worldSide;
/* No side effect */

},{}],38:[function(require,module,exports){
// Generated by BUCKLESCRIPT, PLEASE EDIT WITH CARE
'use strict';

var $$Map = require("bs-platform/lib/js/map.js");
var $$Set = require("bs-platform/lib/js/set.js");
var $$Array = require("bs-platform/lib/js/array.js");
var Curry = require("bs-platform/lib/js/curry.js");
var Caml_obj = require("bs-platform/lib/js/caml_obj.js");
var Caml_option = require("bs-platform/lib/js/caml_option.js");

function fold_left(f, _s, _l) {
  while(true) {
    var l = _l;
    var s = _s;
    if (l) {
      _l = l[1];
      _s = Curry._2(f, s, l[0]);
      continue ;
    } else {
      return s;
    }
  };
}

function foldls(param) {
  if (param) {
    var tl = param[1];
    var match = param[0];
    var l = match[1];
    var f = match[0];
    return (function (v) {
        return foldls(tl)(fold_left(f, v, l));
      });
  } else {
    return (function (v) {
        return v;
      });
  }
}

function ListToMap(OrdType) {
  var MapT = $$Map.Make(OrdType);
  var go = function (l) {
    return fold_left((function (m, param) {
                  return Curry._3(MapT.add, param[0], param[1], m);
                }), MapT.empty, l);
  };
  return {
          MapT: MapT,
          go: go
        };
}

function FindMap(O) {
  var MapT = $$Map.Make(O);
  var go = function (key, map) {
    try {
      return Caml_option.some(Curry._2(MapT.find, key, map));
    }
    catch (exn){
      return ;
    }
  };
  return {
          MapT: MapT,
          go: go
        };
}

function UpdateMap(O) {
  var MapT = $$Map.Make(O);
  var MapT$1 = $$Map.Make(O);
  var go = function (key, map) {
    try {
      return Caml_option.some(Curry._2(MapT$1.find, key, map));
    }
    catch (exn){
      return ;
    }
  };
  var Find = {
    MapT: MapT$1,
    go: go
  };
  var go$1 = function (key, f, map) {
    var res = go(key, map);
    var match = Curry._1(f, res);
    if (match !== undefined) {
      return Curry._3(MapT.add, key, Caml_option.valFromOption(match), Curry._2(MapT.remove, key, map));
    } else {
      return Curry._2(MapT.remove, key, map);
    }
  };
  return {
          MapT: MapT,
          Find: Find,
          go: go$1
        };
}

function optionMap(f, o) {
  if (o !== undefined) {
    return Caml_option.some(Curry._1(f, Caml_option.valFromOption(o)));
  }
  
}

function optionThen(f, o) {
  if (o !== undefined) {
    return Curry._1(f, Caml_option.valFromOption(o));
  }
  
}

function optionOrElse(f, o) {
  if (o !== undefined) {
    return Caml_option.some(Caml_option.valFromOption(o));
  } else {
    return Curry._1(f, /* () */0);
  }
}

function optionElse(f, o) {
  if (o !== undefined) {
    return Caml_option.valFromOption(o);
  } else {
    return Curry._1(f, /* () */0);
  }
}

function catOptions(_param) {
  while(true) {
    var param = _param;
    if (param) {
      var match = param[0];
      if (match !== undefined) {
        return /* :: */[
                Caml_option.valFromOption(match),
                catOptions(param[1])
              ];
      } else {
        _param = param[1];
        continue ;
      }
    } else {
      return /* [] */0;
    }
  };
}

function $great$great(f, g, a) {
  return Curry._1(g, Curry._1(f, a));
}

function list_init(n, f) {
  return $$Array.to_list($$Array.init(n, f));
}

var compare = Caml_obj.caml_compare;

var StringOrd = {
  compare: compare
};

var compare$1 = Caml_obj.caml_compare;

var IPointOrd = {
  compare: compare$1
};

var StringSet = $$Set.Make(StringOrd);

var StringMap = $$Map.Make(StringOrd);

var MapT = $$Map.Make(StringOrd);

var MapT$1 = $$Map.Make(StringOrd);

function go(key, map) {
  try {
    return Caml_option.some(Curry._2(MapT$1.find, key, map));
  }
  catch (exn){
    return ;
  }
}

var Find = {
  MapT: MapT$1,
  go: go
};

function go$1(key, f, map) {
  var res = go(key, map);
  var match = Curry._1(f, res);
  if (match !== undefined) {
    return Curry._3(MapT.add, key, Caml_option.valFromOption(match), Curry._2(MapT.remove, key, map));
  } else {
    return Curry._2(MapT.remove, key, map);
  }
}

var StringUpdateMap = {
  MapT: MapT,
  Find: Find,
  go: go$1
};

var IPointSet = $$Set.Make(IPointOrd);

var IPointMap = $$Map.Make(IPointOrd);

exports.fold_left = fold_left;
exports.foldls = foldls;
exports.ListToMap = ListToMap;
exports.FindMap = FindMap;
exports.UpdateMap = UpdateMap;
exports.optionMap = optionMap;
exports.optionThen = optionThen;
exports.optionOrElse = optionOrElse;
exports.optionElse = optionElse;
exports.catOptions = catOptions;
exports.$great$great = $great$great;
exports.list_init = list_init;
exports.StringOrd = StringOrd;
exports.IPointOrd = IPointOrd;
exports.StringSet = StringSet;
exports.StringMap = StringMap;
exports.StringUpdateMap = StringUpdateMap;
exports.IPointSet = IPointSet;
exports.IPointMap = IPointMap;
/* StringSet Not a pure module */

},{"bs-platform/lib/js/array.js":1,"bs-platform/lib/js/caml_obj.js":15,"bs-platform/lib/js/caml_option.js":16,"bs-platform/lib/js/curry.js":24,"bs-platform/lib/js/map.js":26,"bs-platform/lib/js/set.js":29}],39:[function(require,module,exports){
// Generated by BUCKLESCRIPT, PLEASE EDIT WITH CARE
'use strict';

var Curry = require("bs-platform/lib/js/curry.js");
var Canvas = require("./canvas.bs.js");
var Perlin = require("./perlin.bs.js");
var $$String = require("bs-platform/lib/js/string.js");
var $$Window = require("./window.bs.js");
var Animate = require("./animate.bs.js");
var Contypes = require("./contypes.bs.js");
var Constants = require("./constants.bs.js");
var Caml_int32 = require("bs-platform/lib/js/caml_int32.js");
var Gamedisplay = require("./gamedisplay.bs.js");
var GamestateMethods = require("./gamestateMethods.bs.js");

var keysPressed = {
  contents: Contypes.StringSet.empty
};

function runGame(state, ts) {
  var pressed = keysPressed.contents;
  var newGame = GamestateMethods.runGame(state.game, pressed, ts);
  var newState_noise = state.noise;
  var newState_spec = state.spec;
  var newState_anim = state.anim;
  var newState_mapcache = state.mapcache;
  var newState_keys = state.keys;
  var newState = {
    game: newGame,
    noise: newState_noise,
    spec: newState_spec,
    anim: newState_anim,
    mapcache: newState_mapcache,
    keys: newState_keys
  };
  Gamedisplay.displayScreen(newState);
  var keys = $$String.concat(",", Curry._1(Contypes.StringSet.elements, keysPressed.contents));
  state.spec.context2d.fillStyle = Curry._1(Canvas.fillStyleOfString, "white");
  state.spec.context2d.fillText(keys, 10, 10);
  return {
          game: newGame,
          noise: state.noise,
          spec: state.spec,
          anim: state.anim,
          mapcache: state.mapcache,
          keys: pressed
        };
}

function main(param) {
  var match = Curry._1(Canvas.getCanvas, "demo");
  if (match == null) {
    console.log("no such canvas");
    return /* () */0;
  } else {
    var ctx = Curry._1(Canvas.getContext2D, match);
    var spec = {
      context2d: ctx,
      width: 512,
      height: 250
    };
    var noise = Perlin.noiseArray(Caml_int32.imul(Constants.worldSide, Constants.worldSide));
    var world = Perlin.noiseField(noise, 64, 64);
    var anim = Animate.newAnimation(/* () */0);
    $$Window.onKeyDown((function (k) {
            keysPressed.contents = Curry._2(Contypes.StringSet.add, $$String.uppercase_ascii(k), keysPressed.contents);
            return /* () */0;
          }));
    $$Window.onKeyUp((function (k) {
            keysPressed.contents = Curry._2(Contypes.StringSet.remove, $$String.uppercase_ascii(k), keysPressed.contents);
            return /* () */0;
          }));
    var state_game = GamestateMethods.newGame(world);
    var state_mapcache = {
      contents: Contypes.StringMap.empty
    };
    var state_keys = Contypes.StringSet.empty;
    var state = {
      game: state_game,
      noise: noise,
      spec: spec,
      anim: anim,
      mapcache: state_mapcache,
      keys: state_keys
    };
    return Animate.startAnimation(anim, state, runGame);
  }
}

exports.keysPressed = keysPressed;
exports.runGame = runGame;
exports.main = main;
/* Canvas Not a pure module */

},{"./animate.bs.js":32,"./canvas.bs.js":33,"./constants.bs.js":37,"./contypes.bs.js":38,"./gamedisplay.bs.js":40,"./gamestateMethods.bs.js":43,"./perlin.bs.js":49,"./window.bs.js":56,"bs-platform/lib/js/caml_int32.js":11,"bs-platform/lib/js/curry.js":24,"bs-platform/lib/js/string.js":30}],40:[function(require,module,exports){
// Generated by BUCKLESCRIPT, PLEASE EDIT WITH CARE
'use strict';

var List = require("bs-platform/lib/js/list.js");
var Menu = require("./menu.bs.js");
var Block = require("bs-platform/lib/js/block.js");
var Color = require("./color.bs.js");
var Curry = require("bs-platform/lib/js/curry.js");
var Canvas = require("./canvas.bs.js");
var Printf = require("bs-platform/lib/js/printf.js");
var Sprite = require("./sprite.bs.js");
var Contypes = require("./contypes.bs.js");
var Worldmap = require("./worldmap.bs.js");
var Caml_array = require("bs-platform/lib/js/caml_array.js");
var Caml_int32 = require("bs-platform/lib/js/caml_int32.js");
var SpriteDefs = require("./spriteDefs.bs.js");
var Gamepalette = require("./gamepalette.bs.js");

function drawSkyGradient(disp, steps, palette) {
  var ctx = disp.context2d;
  for(var thisStep = 0 ,thisStep_finish = palette.length - 1 | 0; thisStep <= thisStep_finish; ++thisStep){
    var nextColor = Caml_array.caml_array_get(palette, thisStep);
    var nextStep = thisStep + 1 | 0;
    var yTop = Caml_int32.div(Caml_int32.imul(thisStep, disp.height / 2 | 0), steps);
    var yBot = Caml_int32.div(Caml_int32.imul(nextStep, disp.height / 2 | 0), steps);
    ctx.fillStyle = Curry._1(Canvas.fillStyleOfString, Color.stringOfColor(Color.colorOfCoord(nextColor)));
    ctx.fillRect(0, yTop, disp.width, yBot - yTop | 0);
  }
  return /* () */0;
}

function drawGroundGradient(disp, steps, palette) {
  var ctx = disp.context2d;
  for(var thisStep = 0 ,thisStep_finish = palette.length - 1 | 0; thisStep <= thisStep_finish; ++thisStep){
    var nextColor = Caml_array.caml_array_get(palette, thisStep);
    var nextStep = thisStep + 1 | 0;
    var yTop = Caml_int32.div(Caml_int32.imul(thisStep, disp.height / 2 | 0), steps);
    var yBot = Caml_int32.div(Caml_int32.imul(nextStep, disp.height / 2 | 0), steps);
    ctx.fillStyle = Curry._1(Canvas.fillStyleOfString, Color.stringOfColor(Color.colorOfCoord(nextColor)));
    ctx.fillRect(0, (disp.height / 2 | 0) + yTop | 0, disp.width, (disp.height / 2 | 0) + (yBot - yTop | 0) | 0);
  }
  return /* () */0;
}

function drawFirstPersonBackdrop(state) {
  var ctx = state.spec.context2d;
  var bgcolor = Gamepalette.backgroundColor(state.game.weather, state.game.timeOfDay);
  var skyPalette = Gamepalette.backgroundPaletteByTimeOfDay(state.game.weather, state.game.timeOfDay);
  var groundPalette = Gamepalette.groundPaletteByTimeOfDay(state.game.weather, state.game.timeOfDay);
  var skySteps = skyPalette.length;
  var groundSteps = groundPalette.length;
  ctx.fillStyle = Curry._1(Canvas.fillStyleOfString, Color.stringOfColor(Color.colorOfCoord(bgcolor)));
  ctx.fillRect(0, 0, state.spec.width, state.spec.height);
  drawSkyGradient(state.spec, skySteps, skyPalette);
  return drawGroundGradient(state.spec, groundSteps, groundPalette);
}

function worldPositionToScreen(state, x, y) {
  var xx = (Math.floor(x) + 0.5) * state.spec.width / state.game.world.groundX;
  var yy = (Math.floor(y) + 0.5) * state.spec.height / state.game.world.groundY;
  return /* tuple */[
          xx | 0,
          yy | 0
        ];
}

function drawMapScreen(state) {
  var ctx = state.spec.context2d;
  var mapImage = Worldmap.cacheMapScreen(state);
  ctx.drawImage(mapImage, 0, 0, state.spec.width, state.spec.height, 0, 0, state.spec.width, state.spec.height);
  List.iter((function (param) {
          var c = param[1];
          var match = worldPositionToScreen(state, c.x, c.y);
          return Sprite.drawSpriteCenter(state.spec, c.ruin !== 0.0 ? SpriteDefs.ruinSprite : SpriteDefs.citySprite, match[0], match[1], (SpriteDefs.citySprite.width << 1), (SpriteDefs.citySprite.height << 1));
        }), Curry._1(Contypes.StringMap.bindings, state.game.cities));
  List.iter((function (param) {
          var match = worldPositionToScreen(state, param[0], param[1]);
          return Sprite.drawSpriteCenter(state.spec, SpriteDefs.plantSprite, match[0], match[1], (SpriteDefs.plantSprite.width << 1), (SpriteDefs.plantSprite.height << 1));
        }), Curry._1(Contypes.IPointSet.elements, state.game.plants));
  List.iter((function (param) {
          var w = param[1];
          var match = worldPositionToScreen(state, w.x, w.y);
          return Sprite.drawSpriteCenter(state.spec, w.death > 0.0 ? SpriteDefs.deadWorkerSprite : SpriteDefs.workerSprite, match[0], match[1], (SpriteDefs.workerSprite.width << 1), (SpriteDefs.workerSprite.height << 1));
        }), Curry._1(Contypes.StringMap.bindings, state.game.workers));
  var match = worldPositionToScreen(state, state.game.player.x, state.game.player.y);
  Sprite.drawSpriteCenter(state.spec, SpriteDefs.playerSprite, match[0], match[1], (SpriteDefs.playerSprite.width << 1), (SpriteDefs.playerSprite.height << 1));
  return /* () */0;
}

function drawUpperRightStatus(state, str) {
  var metrics = state.spec.context2d.measureText(str);
  var width = metrics.width | 0;
  var ascent = metrics.actualBoundingBoxAscent | 0;
  var xAt = state.spec.width - width | 0;
  state.spec.context2d.fillStyle = Curry._1(Canvas.fillStyleOfString, "white");
  state.spec.context2d.fillText(str, xAt - 10 | 0, ascent + 10 | 0);
  return /* () */0;
}

function drawHud(state) {
  var match = state.game.mode;
  if (typeof match === "number") {
    switch (match) {
      case /* HomeScreen */0 :
          return /* () */0;
      case /* CampScreen */1 :
          return drawUpperRightStatus(state, "Camp");
      case /* FirstPerson */2 :
          return drawUpperRightStatus(state, "First Person");
      
    }
  } else if (match.tag) {
    var match$1 = match[0];
    if (typeof match$1 === "number") {
      return drawUpperRightStatus(state, "Running");
    } else if (match$1.tag) {
      var choice = match$1[0];
      Menu.drawMenu(state.spec, /* :: */[
            {
              color: /* Resume */0 === choice ? "yellow" : "white",
              str: "Resume"
            },
            /* :: */[
              {
                color: /* ChooseLocation */1 === choice ? "yellow" : "white",
                str: "Change Target"
              },
              /* :: */[
                {
                  color: /* Encounter */2 === choice ? "yellow" : "white",
                  str: "Hard Travel"
                },
                /* :: */[
                  {
                    color: /* Camp */3 === choice ? "yellow" : "white",
                    str: "Camp"
                  },
                  /* [] */0
                ]
              ]
            ]
          ]);
      return drawUpperRightStatus(state, "Select...");
    } else {
      var match$2 = match$1[0];
      var y = match$2[1];
      var x = match$2[0];
      var match$3 = worldPositionToScreen(state, x, y);
      Sprite.drawSpriteCenter(state.spec, SpriteDefs.targetSprite, match$3[0], match$3[1], (SpriteDefs.targetSprite.width << 1), (SpriteDefs.targetSprite.height << 1));
      return drawUpperRightStatus(state, Curry._2(Printf.sprintf(/* Format */[
                          /* String_literal */Block.__(11, [
                              "Choose location (",
                              /* Int */Block.__(4, [
                                  /* Int_d */0,
                                  /* No_padding */0,
                                  /* No_precision */0,
                                  /* Char_literal */Block.__(12, [
                                      /* "," */44,
                                      /* Int */Block.__(4, [
                                          /* Int_d */0,
                                          /* No_padding */0,
                                          /* No_precision */0,
                                          /* Char_literal */Block.__(12, [
                                              /* ")" */41,
                                              /* End_of_format */0
                                            ])
                                        ])
                                    ])
                                ])
                            ]),
                          "Choose location (%d,%d)"
                        ]), x, y));
    }
  } else {
    return /* () */0;
  }
}

function displayScreen(state) {
  var match = state.game.mode;
  if (typeof match === "number") {
    switch (match) {
      case /* HomeScreen */0 :
          var theGame = state.game;
          var sunnyGame_startTime = theGame.startTime;
          var sunnyGame_worldTime = theGame.worldTime;
          var sunnyGame_realTime = theGame.realTime;
          var sunnyGame_lastTs = theGame.lastTs;
          var sunnyGame_gameSpeed = theGame.gameSpeed;
          var sunnyGame_player = theGame.player;
          var sunnyGame_mode = theGame.mode;
          var sunnyGame_world = theGame.world;
          var sunnyGame_keys = theGame.keys;
          var sunnyGame_cities = theGame.cities;
          var sunnyGame_workers = theGame.workers;
          var sunnyGame_plants = theGame.plants;
          var sunnyGame = {
            startTime: sunnyGame_startTime,
            worldTime: sunnyGame_worldTime,
            realTime: sunnyGame_realTime,
            lastTs: sunnyGame_lastTs,
            timeOfDay: 0.5,
            gameSpeed: sunnyGame_gameSpeed,
            player: sunnyGame_player,
            mode: sunnyGame_mode,
            weather: /* Clear */0,
            world: sunnyGame_world,
            keys: sunnyGame_keys,
            cities: sunnyGame_cities,
            workers: sunnyGame_workers,
            plants: sunnyGame_plants
          };
          drawFirstPersonBackdrop({
                game: sunnyGame,
                noise: state.noise,
                spec: state.spec,
                anim: state.anim,
                mapcache: state.mapcache,
                keys: state.keys
              });
          return Menu.drawMenu(state.spec, /* :: */[
                      {
                        color: "white",
                        str: "Start"
                      },
                      /* [] */0
                    ]);
      case /* CampScreen */1 :
          drawFirstPersonBackdrop(state);
          drawHud(state);
          return Menu.drawMenu(state.spec, /* :: */[
                      {
                        color: "yellow",
                        str: "CampScreen"
                      },
                      /* [] */0
                    ]);
      case /* FirstPerson */2 :
          drawFirstPersonBackdrop(state);
          return drawHud(state);
      
    }
  } else if (match.tag) {
    drawMapScreen(state);
    return drawHud(state);
  } else {
    return Menu.drawMenu(state.spec, /* :: */[
                {
                  color: "red",
                  str: "Game Over"
                },
                /* [] */0
              ]);
  }
}

var unimplementedStr = "Unimplemented";

exports.drawSkyGradient = drawSkyGradient;
exports.drawGroundGradient = drawGroundGradient;
exports.drawFirstPersonBackdrop = drawFirstPersonBackdrop;
exports.unimplementedStr = unimplementedStr;
exports.worldPositionToScreen = worldPositionToScreen;
exports.drawMapScreen = drawMapScreen;
exports.drawUpperRightStatus = drawUpperRightStatus;
exports.drawHud = drawHud;
exports.displayScreen = displayScreen;
/* Menu Not a pure module */

},{"./canvas.bs.js":33,"./color.bs.js":36,"./contypes.bs.js":38,"./gamepalette.bs.js":41,"./menu.bs.js":47,"./sprite.bs.js":52,"./spriteDefs.bs.js":53,"./worldmap.bs.js":58,"bs-platform/lib/js/block.js":2,"bs-platform/lib/js/caml_array.js":5,"bs-platform/lib/js/caml_int32.js":11,"bs-platform/lib/js/curry.js":24,"bs-platform/lib/js/list.js":25,"bs-platform/lib/js/printf.js":28}],41:[function(require,module,exports){
// Generated by BUCKLESCRIPT, PLEASE EDIT WITH CARE
'use strict';

var Caml_array = require("bs-platform/lib/js/caml_array.js");

var clearSkyPalette = /* array */[
  /* array */[
    /* tuple */[
      0,
      0
    ],
    /* tuple */[
      0,
      0
    ],
    /* tuple */[
      0,
      0
    ],
    /* tuple */[
      0,
      0
    ],
    /* tuple */[
      0,
      0
    ],
    /* tuple */[
      0,
      0
    ],
    /* tuple */[
      0,
      0
    ],
    /* tuple */[
      0,
      0
    ],
    /* tuple */[
      0,
      0
    ],
    /* tuple */[
      0,
      0
    ],
    /* tuple */[
      0,
      0
    ],
    /* tuple */[
      6,
      5
    ],
    /* tuple */[
      6,
      5
    ],
    /* tuple */[
      6,
      5
    ],
    /* tuple */[
      5,
      6
    ],
    /* tuple */[
      5,
      6
    ],
    /* tuple */[
      5,
      6
    ],
    /* tuple */[
      5,
      6
    ],
    /* tuple */[
      5,
      6
    ],
    /* tuple */[
      5,
      6
    ],
    /* tuple */[
      4,
      7
    ],
    /* tuple */[
      2,
      7
    ]
  ],
  /* array */[
    /* tuple */[
      7,
      5
    ],
    /* tuple */[
      7,
      5
    ],
    /* tuple */[
      7,
      5
    ],
    /* tuple */[
      7,
      5
    ],
    /* tuple */[
      7,
      5
    ],
    /* tuple */[
      7,
      5
    ],
    /* tuple */[
      7,
      5
    ],
    /* tuple */[
      7,
      5
    ],
    /* tuple */[
      7,
      5
    ],
    /* tuple */[
      7,
      5
    ],
    /* tuple */[
      7,
      5
    ],
    /* tuple */[
      7,
      5
    ],
    /* tuple */[
      7,
      5
    ],
    /* tuple */[
      6,
      5
    ],
    /* tuple */[
      5,
      6
    ],
    /* tuple */[
      4,
      7
    ],
    /* tuple */[
      3,
      6
    ],
    /* tuple */[
      2,
      5
    ],
    /* tuple */[
      2,
      4
    ],
    /* tuple */[
      3,
      4
    ],
    /* tuple */[
      3,
      3
    ],
    /* tuple */[
      3,
      2
    ]
  ],
  /* array */[
    /* tuple */[
      7,
      5
    ],
    /* tuple */[
      7,
      5
    ],
    /* tuple */[
      7,
      5
    ],
    /* tuple */[
      7,
      5
    ],
    /* tuple */[
      7,
      5
    ],
    /* tuple */[
      7,
      5
    ],
    /* tuple */[
      7,
      5
    ],
    /* tuple */[
      7,
      5
    ],
    /* tuple */[
      7,
      5
    ],
    /* tuple */[
      7,
      5
    ],
    /* tuple */[
      7,
      5
    ],
    /* tuple */[
      6,
      5
    ],
    /* tuple */[
      6,
      5
    ],
    /* tuple */[
      6,
      5
    ],
    /* tuple */[
      5,
      6
    ],
    /* tuple */[
      5,
      6
    ],
    /* tuple */[
      5,
      6
    ],
    /* tuple */[
      5,
      6
    ],
    /* tuple */[
      5,
      6
    ],
    /* tuple */[
      5,
      6
    ],
    /* tuple */[
      4,
      7
    ],
    /* tuple */[
      3,
      6
    ]
  ],
  /* array */[
    /* tuple */[
      7,
      5
    ],
    /* tuple */[
      7,
      5
    ],
    /* tuple */[
      7,
      5
    ],
    /* tuple */[
      7,
      5
    ],
    /* tuple */[
      7,
      5
    ],
    /* tuple */[
      7,
      5
    ],
    /* tuple */[
      7,
      5
    ],
    /* tuple */[
      7,
      5
    ],
    /* tuple */[
      7,
      5
    ],
    /* tuple */[
      7,
      5
    ],
    /* tuple */[
      7,
      5
    ],
    /* tuple */[
      6,
      5
    ],
    /* tuple */[
      6,
      5
    ],
    /* tuple */[
      6,
      5
    ],
    /* tuple */[
      5,
      6
    ],
    /* tuple */[
      5,
      6
    ],
    /* tuple */[
      5,
      6
    ],
    /* tuple */[
      5,
      6
    ],
    /* tuple */[
      5,
      6
    ],
    /* tuple */[
      5,
      6
    ],
    /* tuple */[
      4,
      7
    ],
    /* tuple */[
      2,
      7
    ]
  ]
];

var clearGroundPalette = /* array */[/* array */[
    /* tuple */[
      14,
      1
    ],
    /* tuple */[
      14,
      2
    ],
    /* tuple */[
      14,
      3
    ],
    /* tuple */[
      14,
      4
    ],
    /* tuple */[
      14,
      5
    ],
    /* tuple */[
      13,
      5
    ],
    /* tuple */[
      13,
      4
    ],
    /* tuple */[
      12,
      3
    ],
    /* tuple */[
      12,
      3
    ],
    /* tuple */[
      12,
      3
    ],
    /* tuple */[
      12,
      3
    ],
    /* tuple */[
      12,
      3
    ],
    /* tuple */[
      12,
      3
    ],
    /* tuple */[
      12,
      3
    ],
    /* tuple */[
      12,
      3
    ],
    /* tuple */[
      12,
      3
    ],
    /* tuple */[
      12,
      3
    ],
    /* tuple */[
      12,
      3
    ],
    /* tuple */[
      12,
      3
    ],
    /* tuple */[
      12,
      3
    ],
    /* tuple */[
      12,
      3
    ],
    /* tuple */[
      12,
      3
    ],
    /* tuple */[
      12,
      3
    ],
    /* tuple */[
      12,
      3
    ],
    /* tuple */[
      12,
      3
    ]
  ]];

var mapPalette = /* array */[
  /* array */[
    /* tuple */[
      8,
      1
    ],
    /* tuple */[
      14,
      4
    ],
    /* tuple */[
      13,
      4
    ],
    /* tuple */[
      13,
      3
    ],
    /* tuple */[
      12,
      2
    ],
    /* tuple */[
      12,
      1
    ],
    /* tuple */[
      14,
      2
    ],
    /* tuple */[
      0,
      5
    ]
  ],
  /* array */[
    /* tuple */[
      8,
      2
    ],
    /* tuple */[
      14,
      5
    ],
    /* tuple */[
      13,
      5
    ],
    /* tuple */[
      13,
      4
    ],
    /* tuple */[
      12,
      3
    ],
    /* tuple */[
      12,
      2
    ],
    /* tuple */[
      14,
      3
    ],
    /* tuple */[
      0,
      6
    ]
  ],
  /* array */[
    /* tuple */[
      8,
      2
    ],
    /* tuple */[
      14,
      5
    ],
    /* tuple */[
      13,
      5
    ],
    /* tuple */[
      13,
      4
    ],
    /* tuple */[
      12,
      3
    ],
    /* tuple */[
      12,
      2
    ],
    /* tuple */[
      14,
      3
    ],
    /* tuple */[
      0,
      7
    ]
  ],
  /* array */[
    /* tuple */[
      8,
      2
    ],
    /* tuple */[
      14,
      5
    ],
    /* tuple */[
      13,
      5
    ],
    /* tuple */[
      13,
      4
    ],
    /* tuple */[
      12,
      3
    ],
    /* tuple */[
      12,
      2
    ],
    /* tuple */[
      14,
      3
    ],
    /* tuple */[
      0,
      6
    ]
  ]
];

function skyPaletteByWeather(param) {
  return clearSkyPalette;
}

function groundPaletteByWeather(param) {
  return clearGroundPalette;
}

function getPaletteByTimeOfDay(palettes, timeOfDay) {
  var slices = palettes.length;
  return Caml_array.caml_array_get(palettes, Math.floor(timeOfDay * slices));
}

function backgroundPaletteByTimeOfDay(weather, timeOfDay) {
  return getPaletteByTimeOfDay(clearSkyPalette, timeOfDay);
}

function groundPaletteByTimeOfDay(weather, timeOfDay) {
  return getPaletteByTimeOfDay(clearGroundPalette, timeOfDay);
}

function backgroundColor(weather, timeOfDay) {
  var palette = getPaletteByTimeOfDay(clearSkyPalette, timeOfDay);
  return Caml_array.caml_array_get(palette, 0);
}

exports.clearSkyPalette = clearSkyPalette;
exports.clearGroundPalette = clearGroundPalette;
exports.mapPalette = mapPalette;
exports.skyPaletteByWeather = skyPaletteByWeather;
exports.groundPaletteByWeather = groundPaletteByWeather;
exports.getPaletteByTimeOfDay = getPaletteByTimeOfDay;
exports.backgroundPaletteByTimeOfDay = backgroundPaletteByTimeOfDay;
exports.groundPaletteByTimeOfDay = groundPaletteByTimeOfDay;
exports.backgroundColor = backgroundColor;
/* No side effect */

},{"bs-platform/lib/js/caml_array.js":5}],42:[function(require,module,exports){
// Generated by BUCKLESCRIPT, PLEASE EDIT WITH CARE
'use strict';

var Curry = require("bs-platform/lib/js/curry.js");
var Contypes = require("./contypes.bs.js");

function locateCityNamed(gamestate, name) {
  try {
    var city = Curry._2(Contypes.StringMap.find, name, gamestate.cities);
    return /* tuple */[
            city.x,
            city.y
          ];
  }
  catch (exn){
    return ;
  }
}

function locationOfWorkerTarget(gamestate, param) {
  if (param.tag) {
    return param[0];
  } else {
    return locateCityNamed(gamestate, param[0]);
  }
}

var menuChoices = /* :: */[
  /* Resume */0,
  /* :: */[
    /* ChooseLocation */1,
    /* :: */[
      /* Encounter */2,
      /* :: */[
        /* Camp */3,
        /* [] */0
      ]
    ]
  ]
];

exports.menuChoices = menuChoices;
exports.locateCityNamed = locateCityNamed;
exports.locationOfWorkerTarget = locationOfWorkerTarget;
/* Contypes Not a pure module */

},{"./contypes.bs.js":38,"bs-platform/lib/js/curry.js":24}],43:[function(require,module,exports){
// Generated by BUCKLESCRIPT, PLEASE EDIT WITH CARE
'use strict';

var Tod = require("./tod.bs.js");
var Life = require("./life.bs.js");
var List = require("bs-platform/lib/js/list.js");
var $$Math = require("./math.bs.js");
var $$Array = require("bs-platform/lib/js/array.js");
var Block = require("bs-platform/lib/js/block.js");
var Curry = require("bs-platform/lib/js/curry.js");
var Plants = require("./plants.bs.js");
var Contypes = require("./contypes.bs.js");
var Constants = require("./constants.bs.js");
var Gamestate = require("./gamestate.bs.js");
var Caml_array = require("bs-platform/lib/js/caml_array.js");
var CityMethods = require("./cityMethods.bs.js");
var PlayerMethods = require("./playerMethods.bs.js");
var WorkerMethods = require("./workerMethods.bs.js");
var Caml_primitive = require("bs-platform/lib/js/caml_primitive.js");

function newGame(world) {
  var startT = new Date();
  var startInstant = startT.getTime();
  var player = PlayerMethods.newPlayer(/* () */0);
  return Plants.runPlants(Plants.runPlants(Plants.startPlants(50, {
                      startTime: startInstant,
                      worldTime: 0.0,
                      realTime: 0.0,
                      lastTs: startInstant,
                      timeOfDay: 0.0,
                      gameSpeed: 12.0,
                      player: player,
                      mode: /* HomeScreen */0,
                      weather: /* Clear */0,
                      world: world,
                      keys: Contypes.StringSet.empty,
                      cities: Contypes.StringMap.empty,
                      workers: Contypes.StringMap.empty,
                      plants: Contypes.IPointSet.empty
                    })));
}

function addCity(city, game) {
  return {
          startTime: game.startTime,
          worldTime: game.worldTime,
          realTime: game.realTime,
          lastTs: game.lastTs,
          timeOfDay: game.timeOfDay,
          gameSpeed: game.gameSpeed,
          player: game.player,
          mode: game.mode,
          weather: game.weather,
          world: game.world,
          keys: game.keys,
          cities: Curry._3(Contypes.StringMap.add, city.name, city, game.cities),
          workers: game.workers,
          plants: game.plants
        };
}

function raiseCity(_n, game) {
  while(true) {
    var n = _n;
    if (n >= 5) {
      return game;
    } else {
      var cx = Math.random() * Constants.worldSide | 0;
      var cy = Math.random() * Constants.worldSide | 0;
      var alreadyHaveCities = Life.pointsAndNeighbors(Curry._3(Contypes.StringMap.fold, (function (param, c, s) {
                  return Curry._2(Contypes.IPointSet.add, /* tuple */[
                              c.x,
                              c.y
                            ], s);
                }), game.cities, Contypes.IPointSet.empty));
      if (Plants.temperate(game, /* tuple */[
              cx,
              cy
            ]) || Curry._2(Contypes.IPointSet.mem, /* tuple */[
              cx,
              cy
            ], alreadyHaveCities)) {
        var nc = CityMethods.newCity(cx, cy);
        return addCity({
                    x: nc.x,
                    y: nc.y,
                    ruin: nc.ruin,
                    name: nc.name,
                    population: 80.0 + Math.random() * 40.0,
                    food: nc.food
                  }, game);
      } else {
        _n = n + 1 | 0;
        continue ;
      }
    }
  };
}

function generateStartCities(game) {
  var citiesDummy = Caml_array.caml_make_vect(4, /* () */0);
  return $$Array.fold_left((function (game, param) {
                return raiseCity(0, game);
              }), game, citiesDummy);
}

function startGame(game) {
  return generateStartCities({
              startTime: game.startTime,
              worldTime: game.worldTime,
              realTime: game.realTime,
              lastTs: game.lastTs,
              timeOfDay: game.timeOfDay,
              gameSpeed: game.gameSpeed,
              player: game.player,
              mode: /* MapScreen */Block.__(1, [/* Running */0]),
              weather: game.weather,
              world: game.world,
              keys: game.keys,
              cities: game.cities,
              workers: game.workers,
              plants: game.plants
            });
}

function addWorkerProduct(game, w) {
  try {
    var city = Curry._2(Contypes.StringMap.find, w.home, game.cities);
    return {
            startTime: game.startTime,
            worldTime: game.worldTime,
            realTime: game.realTime,
            lastTs: game.lastTs,
            timeOfDay: game.timeOfDay,
            gameSpeed: game.gameSpeed,
            player: game.player,
            mode: game.mode,
            weather: game.weather,
            world: game.world,
            keys: game.keys,
            cities: Curry._3(Contypes.StringMap.add, city.name, CityMethods.addWorkerProduct(w, city), game.cities),
            workers: Curry._2(Contypes.StringMap.remove, w.name, game.workers),
            plants: game.plants
          };
  }
  catch (exn){
    return {
            startTime: game.startTime,
            worldTime: game.worldTime,
            realTime: game.realTime,
            lastTs: game.lastTs,
            timeOfDay: game.timeOfDay,
            gameSpeed: game.gameSpeed,
            player: game.player,
            mode: game.mode,
            weather: game.weather,
            world: game.world,
            keys: game.keys,
            cities: game.cities,
            workers: Curry._2(Contypes.StringMap.remove, w.name, game.workers),
            plants: game.plants
          };
  }
}

function takeWorkerResults(game, param) {
  switch (param.tag | 0) {
    case /* WorkerMove */0 :
        var w = param[0];
        return {
                startTime: game.startTime,
                worldTime: game.worldTime,
                realTime: game.realTime,
                lastTs: game.lastTs,
                timeOfDay: game.timeOfDay,
                gameSpeed: game.gameSpeed,
                player: game.player,
                mode: game.mode,
                weather: game.weather,
                world: game.world,
                keys: game.keys,
                cities: game.cities,
                workers: Contypes.StringUpdateMap.go(w.name, (function (param) {
                        return w;
                      }), game.workers),
                plants: game.plants
              };
    case /* WorkerSucceed */1 :
        return addWorkerProduct(game, param[0]);
    case /* WorkerDie */2 :
        return {
                startTime: game.startTime,
                worldTime: game.worldTime,
                realTime: game.realTime,
                lastTs: game.lastTs,
                timeOfDay: game.timeOfDay,
                gameSpeed: game.gameSpeed,
                player: game.player,
                mode: game.mode,
                weather: game.weather,
                world: game.world,
                keys: game.keys,
                cities: game.cities,
                workers: Curry._2(Contypes.StringMap.remove, param[0], game.workers),
                plants: game.plants
              };
    
  }
}

function takeCityUpdate(game, param) {
  var eff = param[1];
  var city = param[0];
  if (eff !== undefined) {
    var match = eff;
    if (match.tag) {
      var w = match[0];
      return {
              startTime: game.startTime,
              worldTime: game.worldTime,
              realTime: game.realTime,
              lastTs: game.lastTs,
              timeOfDay: game.timeOfDay,
              gameSpeed: game.gameSpeed,
              player: game.player,
              mode: game.mode,
              weather: game.weather,
              world: game.world,
              keys: game.keys,
              cities: Contypes.StringUpdateMap.go(city.name, (function (param) {
                      return city;
                    }), game.cities),
              workers: Curry._3(Contypes.StringMap.add, w.name, w, game.workers),
              plants: game.plants
            };
    } else {
      return {
              startTime: game.startTime,
              worldTime: game.worldTime,
              realTime: game.realTime,
              lastTs: game.lastTs,
              timeOfDay: game.timeOfDay,
              gameSpeed: game.gameSpeed,
              player: game.player,
              mode: game.mode,
              weather: game.weather,
              world: game.world,
              keys: game.keys,
              cities: Curry._2(Contypes.StringMap.remove, match[0], game.cities),
              workers: game.workers,
              plants: game.plants
            };
    }
  } else {
    return {
            startTime: game.startTime,
            worldTime: game.worldTime,
            realTime: game.realTime,
            lastTs: game.lastTs,
            timeOfDay: game.timeOfDay,
            gameSpeed: game.gameSpeed,
            player: game.player,
            mode: game.mode,
            weather: game.weather,
            world: game.world,
            keys: game.keys,
            cities: Contypes.StringUpdateMap.go(city.name, (function (param) {
                    return city;
                  }), game.cities),
            workers: game.workers,
            plants: game.plants
          };
  }
}

function oneFrame(game, ts) {
  var realTime = game.realTime + ts;
  var lastWorldTime = game.worldTime;
  var worldTime = realTime / (game.gameSpeed * 1000.0);
  var timeOfDay = Tod.timeOfDayFromWorldTime(worldTime);
  var timeInc = worldTime - game.worldTime;
  var newWeek = (worldTime / Plants.plantGrowth | 0) !== (lastWorldTime / Plants.plantGrowth | 0);
  var game_startTime = game.startTime;
  var game_lastTs = game.lastTs;
  var game_gameSpeed = game.gameSpeed;
  var game_player = game.player;
  var game_mode = game.mode;
  var game_weather = game.weather;
  var game_world = game.world;
  var game_keys = game.keys;
  var game_cities = game.cities;
  var game_workers = game.workers;
  var game_plants = game.plants;
  var game$1 = {
    startTime: game_startTime,
    worldTime: worldTime,
    realTime: realTime,
    lastTs: game_lastTs,
    timeOfDay: timeOfDay,
    gameSpeed: game_gameSpeed,
    player: game_player,
    mode: game_mode,
    weather: game_weather,
    world: game_world,
    keys: game_keys,
    cities: game_cities,
    workers: game_workers,
    plants: game_plants
  };
  var game$2 = newWeek ? Plants.runPlants(game$1) : game$1;
  var playerRes = PlayerMethods.moveCloserToTarget(game$2, timeInc, game$2.player);
  var game_startTime$1 = game$2.startTime;
  var game_worldTime = game$2.worldTime;
  var game_realTime = game$2.realTime;
  var game_lastTs$1 = game$2.lastTs;
  var game_timeOfDay = game$2.timeOfDay;
  var game_gameSpeed$1 = game$2.gameSpeed;
  var game_mode$1 = game$2.mode;
  var game_weather$1 = game$2.weather;
  var game_world$1 = game$2.world;
  var game_keys$1 = game$2.keys;
  var game_cities$1 = game$2.cities;
  var game_workers$1 = game$2.workers;
  var game_plants$1 = game$2.plants;
  var game$3 = {
    startTime: game_startTime$1,
    worldTime: game_worldTime,
    realTime: game_realTime,
    lastTs: game_lastTs$1,
    timeOfDay: game_timeOfDay,
    gameSpeed: game_gameSpeed$1,
    player: playerRes,
    mode: game_mode$1,
    weather: game_weather$1,
    world: game_world$1,
    keys: game_keys$1,
    cities: game_cities$1,
    workers: game_workers$1,
    plants: game_plants$1
  };
  var workerRes = List.map((function (param) {
          return WorkerMethods.runWorker(game$3, timeInc, param);
        }), List.map((function (param) {
              return param[1];
            }), Curry._1(Contypes.StringMap.bindings, game_workers$1)));
  var game$4 = List.fold_left(takeWorkerResults, game$3, workerRes);
  var cityRes = List.map((function (param) {
          return CityMethods.runCity(game$4, timeInc, param);
        }), List.map((function (param) {
              return param[1];
            }), Curry._1(Contypes.StringMap.bindings, game$4.cities)));
  var game$5 = List.fold_left(takeCityUpdate, game$4, cityRes);
  if (Curry._1(Contypes.StringMap.cardinal, game$5.cities) === 0) {
    return {
            startTime: game$5.startTime,
            worldTime: game$5.worldTime,
            realTime: game$5.realTime,
            lastTs: game$5.lastTs,
            timeOfDay: game$5.timeOfDay,
            gameSpeed: game$5.gameSpeed,
            player: game$5.player,
            mode: /* GameOverScreen */Block.__(0, [game$5.realTime + 5000.0]),
            weather: game$5.weather,
            world: game$5.world,
            keys: game$5.keys,
            cities: game$5.cities,
            workers: game$5.workers,
            plants: game$5.plants
          };
  } else {
    return game$5;
  }
}

function runGame(game$prime, keys, ts) {
  var newlyPressed = Curry._2(Contypes.StringSet.diff, keys, game$prime.keys);
  var spacePressed = Curry._2(Contypes.StringSet.mem, " ", newlyPressed);
  var downPressed = Curry._2(Contypes.StringSet.mem, "ARROWDOWN", newlyPressed);
  var upPressed = Curry._2(Contypes.StringSet.mem, "ARROWUP", newlyPressed);
  var leftPressed = Curry._2(Contypes.StringSet.mem, "ARROWLEFT", newlyPressed);
  var rightPressed = Curry._2(Contypes.StringSet.mem, "ARROWRIGHT", newlyPressed);
  var lastTs = game$prime.lastTs;
  var game_startTime = game$prime.startTime;
  var game_worldTime = game$prime.worldTime;
  var game_realTime = game$prime.realTime;
  var game_timeOfDay = game$prime.timeOfDay;
  var game_gameSpeed = game$prime.gameSpeed;
  var game_player = game$prime.player;
  var game_mode = game$prime.mode;
  var game_weather = game$prime.weather;
  var game_world = game$prime.world;
  var game_cities = game$prime.cities;
  var game_workers = game$prime.workers;
  var game_plants = game$prime.plants;
  var game = {
    startTime: game_startTime,
    worldTime: game_worldTime,
    realTime: game_realTime,
    lastTs: ts,
    timeOfDay: game_timeOfDay,
    gameSpeed: game_gameSpeed,
    player: game_player,
    mode: game_mode,
    weather: game_weather,
    world: game_world,
    keys: keys,
    cities: game_cities,
    workers: game_workers,
    plants: game_plants
  };
  var match = game_mode;
  if (typeof match === "number") {
    switch (match) {
      case /* HomeScreen */0 :
          if (spacePressed) {
            return startGame(game);
          } else {
            return game;
          }
      case /* CampScreen */1 :
      case /* FirstPerson */2 :
          if (spacePressed) {
            return {
                    startTime: game_startTime,
                    worldTime: game_worldTime,
                    realTime: game_realTime,
                    lastTs: ts,
                    timeOfDay: game_timeOfDay,
                    gameSpeed: game_gameSpeed,
                    player: game_player,
                    mode: /* MapScreen */Block.__(1, [/* Running */0]),
                    weather: game_weather,
                    world: game_world,
                    keys: keys,
                    cities: game_cities,
                    workers: game_workers,
                    plants: game_plants
                  };
          } else {
            return game;
          }
      
    }
  } else if (match.tag) {
    var match$1 = match[0];
    if (typeof match$1 === "number") {
      if (spacePressed) {
        return {
                startTime: game_startTime,
                worldTime: game_worldTime,
                realTime: game_realTime,
                lastTs: ts,
                timeOfDay: game_timeOfDay,
                gameSpeed: game_gameSpeed,
                player: game_player,
                mode: /* MapScreen */Block.__(1, [/* PauseMenu */Block.__(1, [/* Resume */0])]),
                weather: game_weather,
                world: game_world,
                keys: keys,
                cities: game_cities,
                workers: game_workers,
                plants: game_plants
              };
      } else {
        return oneFrame(game, ts - lastTs);
      }
    } else if (match$1.tag) {
      var choice = match$1[0];
      if (spacePressed) {
        switch (choice) {
          case /* Resume */0 :
              return {
                      startTime: game_startTime,
                      worldTime: game_worldTime,
                      realTime: game_realTime,
                      lastTs: ts,
                      timeOfDay: game_timeOfDay,
                      gameSpeed: game_gameSpeed,
                      player: game_player,
                      mode: /* MapScreen */Block.__(1, [/* Running */0]),
                      weather: game_weather,
                      world: game_world,
                      keys: keys,
                      cities: game_cities,
                      workers: game_workers,
                      plants: game_plants
                    };
          case /* ChooseLocation */1 :
              return {
                      startTime: game_startTime,
                      worldTime: game_worldTime,
                      realTime: game_realTime,
                      lastTs: ts,
                      timeOfDay: game_timeOfDay,
                      gameSpeed: game_gameSpeed,
                      player: game_player,
                      mode: /* MapScreen */Block.__(1, [/* ChoosingLocation */Block.__(0, [/* tuple */[
                                game_player.x | 0,
                                game_player.y | 0
                              ]])]),
                      weather: game_weather,
                      world: game_world,
                      keys: keys,
                      cities: game_cities,
                      workers: game_workers,
                      plants: game_plants
                    };
          case /* Encounter */2 :
              return {
                      startTime: game_startTime,
                      worldTime: game_worldTime,
                      realTime: game_realTime,
                      lastTs: ts,
                      timeOfDay: game_timeOfDay,
                      gameSpeed: game_gameSpeed,
                      player: game_player,
                      mode: /* FirstPerson */2,
                      weather: game_weather,
                      world: game_world,
                      keys: keys,
                      cities: game_cities,
                      workers: game_workers,
                      plants: game_plants
                    };
          case /* Camp */3 :
              return {
                      startTime: game_startTime,
                      worldTime: game_worldTime,
                      realTime: game_realTime,
                      lastTs: ts,
                      timeOfDay: game_timeOfDay,
                      gameSpeed: game_gameSpeed,
                      player: game_player,
                      mode: /* CampScreen */1,
                      weather: game_weather,
                      world: game_world,
                      keys: keys,
                      cities: game_cities,
                      workers: game_workers,
                      plants: game_plants
                    };
          
        }
      } else if (downPressed) {
        return {
                startTime: game_startTime,
                worldTime: game_worldTime,
                realTime: game_realTime,
                lastTs: ts,
                timeOfDay: game_timeOfDay,
                gameSpeed: game_gameSpeed,
                player: game_player,
                mode: /* MapScreen */Block.__(1, [/* PauseMenu */Block.__(1, [$$Math.nextOf(choice, Gamestate.menuChoices)])]),
                weather: game_weather,
                world: game_world,
                keys: keys,
                cities: game_cities,
                workers: game_workers,
                plants: game_plants
              };
      } else if (upPressed) {
        return {
                startTime: game_startTime,
                worldTime: game_worldTime,
                realTime: game_realTime,
                lastTs: ts,
                timeOfDay: game_timeOfDay,
                gameSpeed: game_gameSpeed,
                player: game_player,
                mode: /* MapScreen */Block.__(1, [/* PauseMenu */Block.__(1, [$$Math.prevOf(choice, Gamestate.menuChoices)])]),
                weather: game_weather,
                world: game_world,
                keys: keys,
                cities: game_cities,
                workers: game_workers,
                plants: game_plants
              };
      } else {
        return game;
      }
    } else {
      var match$2 = match$1[0];
      var ly = match$2[1];
      var lx = match$2[0];
      if (spacePressed) {
        return {
                startTime: game_startTime,
                worldTime: game_worldTime,
                realTime: game_realTime,
                lastTs: ts,
                timeOfDay: game_timeOfDay,
                gameSpeed: game_gameSpeed,
                player: PlayerMethods.setTargetLocation(/* tuple */[
                      lx,
                      ly
                    ], game_player),
                mode: /* MapScreen */Block.__(1, [/* Running */0]),
                weather: game_weather,
                world: game_world,
                keys: keys,
                cities: game_cities,
                workers: game_workers,
                plants: game_plants
              };
      } else {
        var diffY = upPressed ? -1 : (
            downPressed ? 1 : 0
          );
        var diffX = leftPressed ? -1 : (
            rightPressed ? 1 : 0
          );
        var newLX = Caml_primitive.caml_int_min(Constants.worldSide - 1 | 0, Caml_primitive.caml_int_max(lx + diffX | 0, 0));
        var newLY = Caml_primitive.caml_int_min(Constants.worldSide - 1 | 0, Caml_primitive.caml_int_max(ly + diffY | 0, 0));
        return {
                startTime: game_startTime,
                worldTime: game_worldTime,
                realTime: game_realTime,
                lastTs: ts,
                timeOfDay: game_timeOfDay,
                gameSpeed: game_gameSpeed,
                player: game_player,
                mode: /* MapScreen */Block.__(1, [/* ChoosingLocation */Block.__(0, [/* tuple */[
                          newLX,
                          newLY
                        ]])]),
                weather: game_weather,
                world: game_world,
                keys: keys,
                cities: game_cities,
                workers: game_workers,
                plants: game_plants
              };
      }
    }
  } else {
    var realTime = game_realTime + (ts - lastTs);
    if (realTime > match[0]) {
      return {
              startTime: game_startTime,
              worldTime: game_worldTime,
              realTime: realTime,
              lastTs: ts,
              timeOfDay: game_timeOfDay,
              gameSpeed: game_gameSpeed,
              player: game_player,
              mode: /* HomeScreen */0,
              weather: game_weather,
              world: game_world,
              keys: keys,
              cities: game_cities,
              workers: game_workers,
              plants: game_plants
            };
    } else {
      return game;
    }
  }
}

var startingCities = 4;

var gameOverTime = 5000.0;

exports.newGame = newGame;
exports.startingCities = startingCities;
exports.addCity = addCity;
exports.raiseCity = raiseCity;
exports.generateStartCities = generateStartCities;
exports.startGame = startGame;
exports.gameOverTime = gameOverTime;
exports.addWorkerProduct = addWorkerProduct;
exports.takeWorkerResults = takeWorkerResults;
exports.takeCityUpdate = takeCityUpdate;
exports.oneFrame = oneFrame;
exports.runGame = runGame;
/* Life Not a pure module */

},{"./cityMethods.bs.js":35,"./constants.bs.js":37,"./contypes.bs.js":38,"./gamestate.bs.js":42,"./life.bs.js":44,"./math.bs.js":46,"./plants.bs.js":50,"./playerMethods.bs.js":51,"./tod.bs.js":54,"./workerMethods.bs.js":57,"bs-platform/lib/js/array.js":1,"bs-platform/lib/js/block.js":2,"bs-platform/lib/js/caml_array.js":5,"bs-platform/lib/js/caml_primitive.js":17,"bs-platform/lib/js/curry.js":24,"bs-platform/lib/js/list.js":25}],44:[function(require,module,exports){
// Generated by BUCKLESCRIPT, PLEASE EDIT WITH CARE
'use strict';

var List = require("bs-platform/lib/js/list.js");
var Curry = require("bs-platform/lib/js/curry.js");
var Contypes = require("./contypes.bs.js");
var Constants = require("./constants.bs.js");

function neighbors(param) {
  var py = param[1];
  var px = param[0];
  return List.fold_left((function (s, p) {
                return Curry._2(Contypes.IPointSet.add, p, s);
              }), Contypes.IPointSet.empty, List.filter((function (param) {
                      var y = param[1];
                      var x = param[0];
                      if (x >= 0 && x < Constants.worldSide && y >= 0) {
                        return y < Constants.worldSide;
                      } else {
                        return false;
                      }
                    }))(/* :: */[
                  /* tuple */[
                    px + 1 | 0,
                    py
                  ],
                  /* :: */[
                    /* tuple */[
                      px - 1 | 0,
                      py
                    ],
                    /* :: */[
                      /* tuple */[
                        px,
                        py + 1 | 0
                      ],
                      /* :: */[
                        /* tuple */[
                          px,
                          py - 1 | 0
                        ],
                        /* :: */[
                          /* tuple */[
                            px + 1 | 0,
                            py + 1 | 0
                          ],
                          /* :: */[
                            /* tuple */[
                              px - 1 | 0,
                              py + 1 | 0
                            ],
                            /* :: */[
                              /* tuple */[
                                px + 1 | 0,
                                py - 1 | 0
                              ],
                              /* :: */[
                                /* tuple */[
                                  px - 1 | 0,
                                  py - 1 | 0
                                ],
                                /* [] */0
                              ]
                            ]
                          ]
                        ]
                      ]
                    ]
                  ]
                ]));
}

function pointsAndNeighbors(ps) {
  return List.fold_left((function (s, p) {
                return Curry._2(Contypes.IPointSet.union, neighbors(p), s);
              }), ps, Curry._1(Contypes.IPointSet.elements, ps));
}

function run(set) {
  return Curry._2(Contypes.IPointSet.filter, (function (param) {
                var y = param[1];
                var x = param[0];
                var activeNeighbors = Curry._2(Contypes.IPointSet.inter, neighbors(/* tuple */[
                          x,
                          y
                        ]), set);
                var cardinal = Curry._1(Contypes.IPointSet.cardinal, activeNeighbors);
                if (Curry._2(Contypes.IPointSet.mem, /* tuple */[
                        x,
                        y
                      ], set) && cardinal === 2 || cardinal === 1) {
                  return true;
                } else {
                  return cardinal === 3;
                }
              }), pointsAndNeighbors(set));
}

exports.neighbors = neighbors;
exports.pointsAndNeighbors = pointsAndNeighbors;
exports.run = run;
/* Contypes Not a pure module */

},{"./constants.bs.js":37,"./contypes.bs.js":38,"bs-platform/lib/js/curry.js":24,"bs-platform/lib/js/list.js":25}],45:[function(require,module,exports){
var demo = require('./demo.bs');
demo.main(document.getElementById('demo'));

},{"./demo.bs":39}],46:[function(require,module,exports){
// Generated by BUCKLESCRIPT, PLEASE EDIT WITH CARE
'use strict';

var List = require("bs-platform/lib/js/list.js");
var Caml_obj = require("bs-platform/lib/js/caml_obj.js");
var Contypes = require("./contypes.bs.js");
var Caml_int32 = require("bs-platform/lib/js/caml_int32.js");
var Caml_option = require("bs-platform/lib/js/caml_option.js");

function distance(param, param$1) {
  var dx = param$1[0] - param[0];
  var dy = param$1[1] - param[1];
  return Math.sqrt(dx * dx + dy * dy);
}

function randomlyChooseInOrder(factor, _lst) {
  while(true) {
    var lst = _lst;
    if (lst) {
      var tl = lst[1];
      var a = lst[0];
      if (tl && Math.random() >= factor) {
        _lst = tl;
        continue ;
      } else {
        return Caml_option.some(a);
      }
    } else {
      return ;
    }
  };
}

function toFloatPoint(param) {
  return /* tuple */[
          param[0],
          param[1]
        ];
}

function toIntPoint(param) {
  return /* tuple */[
          param[0] | 0,
          param[1] | 0
        ];
}

function rotationOf(inc, ch, lst) {
  var which = Contypes.catOptions(List.mapi((function (i, x) {
              if (Caml_obj.caml_equal(x, ch)) {
                return i;
              }
              
            }), lst));
  if (which) {
    return List.nth(lst, Caml_int32.mod_(which[0] + inc | 0, List.length(lst)));
  } else {
    return ch;
  }
}

function nextOf(ch, lst) {
  return rotationOf(1, ch, lst);
}

function prevOf(ch, lst) {
  var len = List.length(lst);
  return rotationOf(len - 1 | 0, ch, lst);
}

function moveToward(incT, moveRate, param, param$1) {
  var atY = param$1[1];
  var atX = param$1[0];
  var diffX = param[0] + 0.5 - atX;
  var diffY = param[1] + 0.5 - atY;
  if (diffX === 0.0 && diffY === 0.0) {
    return /* tuple */[
            atX,
            atY
          ];
  } else {
    var adx = Math.abs(diffX);
    var moveX = diffX / adx;
    var ady = Math.abs(diffY);
    var moveY = diffY / ady;
    return /* tuple */[
            atX + incT * moveX * moveRate,
            atY + incT * moveY * moveRate
          ];
  }
}

exports.distance = distance;
exports.randomlyChooseInOrder = randomlyChooseInOrder;
exports.toFloatPoint = toFloatPoint;
exports.toIntPoint = toIntPoint;
exports.rotationOf = rotationOf;
exports.nextOf = nextOf;
exports.prevOf = prevOf;
exports.moveToward = moveToward;
/* Contypes Not a pure module */

},{"./contypes.bs.js":38,"bs-platform/lib/js/caml_int32.js":11,"bs-platform/lib/js/caml_obj.js":15,"bs-platform/lib/js/caml_option.js":16,"bs-platform/lib/js/list.js":25}],47:[function(require,module,exports){
// Generated by BUCKLESCRIPT, PLEASE EDIT WITH CARE
'use strict';

var List = require("bs-platform/lib/js/list.js");
var Curry = require("bs-platform/lib/js/curry.js");
var Canvas = require("./canvas.bs.js");

function drawMenu(spec, textLines) {
  var ctx = spec.context2d;
  var withMetrics = List.map((function (tl) {
          return /* tuple */[
                  ctx.measureText(tl.str),
                  tl
                ];
        }), textLines);
  var ascents = List.map((function (param) {
          return param[0].actualBoundingBoxAscent;
        }), withMetrics);
  var descents = List.map((function (param) {
          return param[0].actualBoundingBoxDescent;
        }), withMetrics);
  var fullHeight = List.fold_left((function (prim, prim$1) {
          return prim + prim$1;
        }), 0.0, ascents) + List.fold_left((function (prim, prim$1) {
          return prim + prim$1;
        }), 0.0, descents);
  var top = (spec.height - fullHeight) / 2.0;
  List.fold_left((function (y, param) {
          var tl = param[1];
          var m = param[0];
          var ascent = m.actualBoundingBoxAscent | 0;
          var descent = m.actualBoundingBoxDescent | 0;
          var width = m.width;
          var x = (spec.width - width) / 2.0;
          ctx.fillStyle = Curry._1(Canvas.fillStyleOfString, tl.color);
          ctx.fillText(tl.str, x | 0, y + ascent | 0);
          return (y + ascent | 0) + descent | 0;
        }), top | 0, withMetrics);
  return /* () */0;
}

exports.drawMenu = drawMenu;
/* Canvas Not a pure module */

},{"./canvas.bs.js":33,"bs-platform/lib/js/curry.js":24,"bs-platform/lib/js/list.js":25}],48:[function(require,module,exports){
// Generated by BUCKLESCRIPT, PLEASE EDIT WITH CARE
'use strict';

var List = require("bs-platform/lib/js/list.js");
var Caml_array = require("bs-platform/lib/js/caml_array.js");

var nameWords = /* array */[
  "a",
  "ability",
  "able",
  "about",
  "above",
  "accept",
  "according",
  "account",
  "across",
  "act",
  "action",
  "activity",
  "actually",
  "add",
  "address",
  "administration",
  "admit",
  "adult",
  "affect",
  "after",
  "again",
  "against",
  "age",
  "agency",
  "agent",
  "ago",
  "agree",
  "agreement",
  "ahead",
  "air",
  "all",
  "allow",
  "almost",
  "alone",
  "along",
  "already",
  "also",
  "although",
  "always",
  "American",
  "among",
  "amount",
  "analysis",
  "and",
  "animal",
  "another",
  "answer",
  "any",
  "anyone",
  "anything",
  "appear",
  "apply",
  "approach",
  "area",
  "argue",
  "arm",
  "around",
  "arrive",
  "art",
  "article",
  "artist",
  "as",
  "ask",
  "assume",
  "at",
  "attack",
  "attention",
  "attorney",
  "audience",
  "author",
  "authority",
  "available",
  "avoid",
  "away",
  "baby",
  "back",
  "bad",
  "bag",
  "ball",
  "bank",
  "bar",
  "base",
  "be",
  "beat",
  "beautiful",
  "because",
  "become",
  "bed",
  "before",
  "begin",
  "behavior",
  "behind",
  "believe",
  "benefit",
  "best",
  "better",
  "between",
  "beyond",
  "big",
  "bill",
  "billion",
  "bit",
  "black",
  "blood",
  "blue",
  "board",
  "body",
  "book",
  "born",
  "both",
  "box",
  "boy",
  "break",
  "bring",
  "brother",
  "budget",
  "build",
  "building",
  "business",
  "but",
  "buy",
  "by",
  "call",
  "camera",
  "campaign",
  "can",
  "cancer",
  "candidate",
  "capital",
  "car",
  "card",
  "care",
  "career",
  "carry",
  "case",
  "catch",
  "cause",
  "cell",
  "center",
  "central",
  "century",
  "certain",
  "certainly",
  "chair",
  "challenge",
  "chance",
  "change",
  "character",
  "charge",
  "check",
  "child",
  "choice",
  "choose",
  "church",
  "citizen",
  "city",
  "civil",
  "claim",
  "class",
  "clear",
  "clearly",
  "close",
  "coach",
  "cold",
  "collection",
  "college",
  "color",
  "come",
  "commercial",
  "common",
  "community",
  "company",
  "compare",
  "computer",
  "concern",
  "condition",
  "conference",
  "Congress",
  "consider",
  "consumer",
  "contain",
  "continue",
  "control",
  "cost",
  "could",
  "country",
  "couple",
  "course",
  "court",
  "cover",
  "create",
  "crime",
  "cultural",
  "culture",
  "cup",
  "current",
  "customer",
  "cut",
  "dark",
  "data",
  "daughter",
  "day",
  "dead",
  "deal",
  "death",
  "debate",
  "decade",
  "decide",
  "decision",
  "deep",
  "defense",
  "degree",
  "Democrat",
  "democratic",
  "describe",
  "design",
  "despite",
  "detail",
  "determine",
  "develop",
  "development",
  "die",
  "difference",
  "different",
  "difficult",
  "dinner",
  "direction",
  "director",
  "discover",
  "discuss",
  "discussion",
  "disease",
  "do",
  "doctor",
  "dog",
  "door",
  "down",
  "draw",
  "dream",
  "drive",
  "drop",
  "drug",
  "during",
  "each",
  "early",
  "east",
  "easy",
  "eat",
  "economic",
  "economy",
  "edge",
  "education",
  "effect",
  "effort",
  "eight",
  "either",
  "election",
  "else",
  "employee",
  "end",
  "energy",
  "enjoy",
  "enough",
  "enter",
  "entire",
  "environment",
  "environmental",
  "especially",
  "establish",
  "even",
  "evening",
  "event",
  "ever",
  "every",
  "everybody",
  "everyone",
  "everything",
  "evidence",
  "exactly",
  "example",
  "executive",
  "exist",
  "expect",
  "experience",
  "expert",
  "explain",
  "eye",
  "face",
  "fact",
  "factor",
  "fail",
  "fall",
  "family",
  "far",
  "fast",
  "father",
  "fear",
  "federal",
  "feel",
  "feeling",
  "few",
  "field",
  "fight",
  "figure",
  "fill",
  "film",
  "final",
  "finally",
  "financial",
  "find",
  "fine",
  "finger",
  "finish",
  "fire",
  "firm",
  "first",
  "fish",
  "five",
  "floor",
  "fly",
  "focus",
  "follow",
  "food",
  "foot",
  "for",
  "force",
  "foreign",
  "forget",
  "form",
  "former",
  "forward",
  "four",
  "free",
  "friend",
  "from",
  "front",
  "full",
  "fund",
  "future",
  "game",
  "garden",
  "gas",
  "general",
  "generation",
  "get",
  "girl",
  "give",
  "glass",
  "go",
  "goal",
  "good",
  "government",
  "great",
  "green",
  "ground",
  "group",
  "grow",
  "growth",
  "guess",
  "gun",
  "guy",
  "hair",
  "half",
  "hand",
  "hang",
  "happen",
  "happy",
  "hard",
  "have",
  "he",
  "head",
  "health",
  "hear",
  "heart",
  "heat",
  "heavy",
  "help",
  "her",
  "here",
  "herself",
  "high",
  "him",
  "himself",
  "his",
  "history",
  "hit",
  "hold",
  "home",
  "hope",
  "hospital",
  "hot",
  "hotel",
  "hour",
  "house",
  "how",
  "however",
  "huge",
  "human",
  "hundred",
  "husband",
  "I",
  "idea",
  "identify",
  "if",
  "image",
  "imagine",
  "impact",
  "important",
  "improve",
  "in",
  "include",
  "including",
  "increase",
  "indeed",
  "indicate",
  "individual",
  "industry",
  "information",
  "inside",
  "instead",
  "institution",
  "interest",
  "interesting",
  "international",
  "interview",
  "into",
  "investment",
  "involve",
  "issue",
  "it",
  "item",
  "its",
  "itself",
  "job",
  "join",
  "just",
  "keep",
  "key",
  "kid",
  "kill",
  "kind",
  "kitchen",
  "know",
  "knowledge",
  "land",
  "language",
  "large",
  "last",
  "late",
  "later",
  "laugh",
  "law",
  "lawyer",
  "lay",
  "lead",
  "leader",
  "learn",
  "least",
  "leave",
  "left",
  "leg",
  "legal",
  "less",
  "let",
  "letter",
  "level",
  "lie",
  "life",
  "light",
  "like",
  "likely",
  "line",
  "list",
  "listen",
  "little",
  "live",
  "local",
  "long",
  "look",
  "lose",
  "loss",
  "lot",
  "love",
  "low",
  "machine",
  "magazine",
  "main",
  "maintain",
  "major",
  "majority",
  "make",
  "man",
  "manage",
  "management",
  "manager",
  "many",
  "market",
  "marriage",
  "material",
  "matter",
  "may",
  "maybe",
  "me",
  "mean",
  "measure",
  "media",
  "medical",
  "meet",
  "meeting",
  "member",
  "memory",
  "mention",
  "message",
  "method",
  "middle",
  "might",
  "military",
  "million",
  "mind",
  "minute",
  "miss",
  "mission",
  "model",
  "modern",
  "moment",
  "money",
  "month",
  "more",
  "morning",
  "most",
  "mother",
  "mouth",
  "move",
  "movement",
  "movie",
  "Mr",
  "Mrs",
  "much",
  "music",
  "must",
  "my",
  "myself",
  "name",
  "nation",
  "national",
  "natural",
  "nature",
  "near",
  "nearly",
  "necessary",
  "need",
  "network",
  "never",
  "new",
  "news",
  "newspaper",
  "next",
  "nice",
  "night",
  "no",
  "none",
  "nor",
  "north",
  "not",
  "note",
  "nothing",
  "notice",
  "now",
  "n't",
  "number",
  "occur",
  "of",
  "off",
  "offer",
  "office",
  "officer",
  "official",
  "often",
  "oh",
  "oil",
  "ok",
  "old",
  "on",
  "once",
  "one",
  "only",
  "onto",
  "open",
  "operation",
  "opportunity",
  "option",
  "or",
  "order",
  "organization",
  "other",
  "others",
  "our",
  "out",
  "outside",
  "over",
  "own",
  "owner",
  "page",
  "pain",
  "painting",
  "paper",
  "parent",
  "part",
  "participant",
  "particular",
  "particularly",
  "partner",
  "party",
  "pass",
  "past",
  "patient",
  "pattern",
  "pay",
  "peace",
  "people",
  "per",
  "perform",
  "performance",
  "perhaps",
  "period",
  "person",
  "personal",
  "phone",
  "physical",
  "pick",
  "picture",
  "piece",
  "place",
  "plan",
  "plant",
  "play",
  "player",
  "PM",
  "point",
  "police",
  "policy",
  "political",
  "politics",
  "poor",
  "popular",
  "population",
  "position",
  "positive",
  "possible",
  "power",
  "practice",
  "prepare",
  "present",
  "president",
  "pressure",
  "pretty",
  "prevent",
  "price",
  "private",
  "probably",
  "problem",
  "process",
  "produce",
  "product",
  "production",
  "professional",
  "professor",
  "program",
  "project",
  "property",
  "protect",
  "prove",
  "provide",
  "public",
  "pull",
  "purpose",
  "push",
  "put",
  "quality",
  "question",
  "quickly",
  "quite",
  "race",
  "radio",
  "raise",
  "range",
  "rate",
  "rather",
  "reach",
  "read",
  "ready",
  "real",
  "reality",
  "realize",
  "really",
  "reason",
  "receive",
  "recent",
  "recently",
  "recognize",
  "record",
  "red",
  "reduce",
  "reflect",
  "region",
  "relate",
  "relationship",
  "religious",
  "remain",
  "remember",
  "remove",
  "report",
  "represent",
  "Republican",
  "require",
  "research",
  "resource",
  "respond",
  "response",
  "responsibility",
  "rest",
  "result",
  "return",
  "reveal",
  "rich",
  "right",
  "rise",
  "risk",
  "road",
  "rock",
  "role",
  "room",
  "rule",
  "run",
  "safe",
  "same",
  "save",
  "say",
  "scene",
  "school",
  "science",
  "scientist",
  "score",
  "sea",
  "season",
  "seat",
  "second",
  "section",
  "security",
  "see",
  "seek",
  "seem",
  "sell",
  "send",
  "senior",
  "sense",
  "series",
  "serious",
  "serve",
  "service",
  "set",
  "seven",
  "several",
  "sex",
  "sexual",
  "shake",
  "share",
  "she",
  "shoot",
  "short",
  "shot",
  "should",
  "shoulder",
  "show",
  "side",
  "sign",
  "significant",
  "similar",
  "simple",
  "simply",
  "since",
  "sing",
  "single",
  "sister",
  "sit",
  "site",
  "situation",
  "six",
  "size",
  "skill",
  "skin",
  "small",
  "smile",
  "so",
  "social",
  "society",
  "soldier",
  "some",
  "somebody",
  "someone",
  "something",
  "sometimes",
  "son",
  "song",
  "soon",
  "sort",
  "sound",
  "source",
  "south",
  "southern",
  "space",
  "speak",
  "special",
  "specific",
  "speech",
  "spend",
  "sport",
  "spring",
  "staff",
  "stage",
  "stand",
  "standard",
  "star",
  "start",
  "state",
  "statement",
  "station",
  "stay",
  "step",
  "still",
  "stock",
  "stop",
  "store",
  "story",
  "strategy",
  "street",
  "strong",
  "structure",
  "student",
  "study",
  "stuff",
  "style",
  "subject",
  "success",
  "successful",
  "such",
  "suddenly",
  "suffer",
  "suggest",
  "summer",
  "support",
  "sure",
  "surface",
  "system",
  "table",
  "take",
  "talk",
  "task",
  "tax",
  "teach",
  "teacher",
  "team",
  "technology",
  "television",
  "tell",
  "ten",
  "tend",
  "term",
  "test",
  "than",
  "thank",
  "that",
  "the",
  "their",
  "them",
  "themselves",
  "then",
  "theory",
  "there",
  "these",
  "they",
  "thing",
  "think",
  "third",
  "this",
  "those",
  "though",
  "thought",
  "thousand",
  "threat",
  "three",
  "through",
  "throughout",
  "throw",
  "thus",
  "time",
  "to",
  "today",
  "together",
  "tonight",
  "too",
  "top",
  "total",
  "tough",
  "toward",
  "town",
  "trade",
  "traditional",
  "training",
  "travel",
  "treat",
  "treatment",
  "tree",
  "trial",
  "trip",
  "trouble",
  "true",
  "truth",
  "try",
  "turn",
  "TV",
  "two",
  "type",
  "under",
  "understand",
  "unit",
  "until",
  "up",
  "upon",
  "us",
  "use",
  "usually",
  "value",
  "various",
  "very",
  "victim",
  "view",
  "violence",
  "visit",
  "voice",
  "vote",
  "wait",
  "walk",
  "wall",
  "want",
  "war",
  "watch",
  "water",
  "way",
  "we",
  "weapon",
  "wear",
  "week",
  "weight",
  "well",
  "west",
  "western",
  "what",
  "whatever",
  "when",
  "where",
  "whether",
  "which",
  "while",
  "white",
  "who",
  "whole",
  "whom",
  "whose",
  "why",
  "wide",
  "wife",
  "will",
  "win",
  "wind",
  "window",
  "wish",
  "with",
  "within",
  "without",
  "woman",
  "wonder",
  "word",
  "work",
  "worker",
  "world",
  "worry",
  "would",
  "write",
  "writer",
  "wrong",
  "yard",
  "yeah",
  "year",
  "yes",
  "yet",
  "you",
  "young",
  "your",
  "yourself"
];

function randomNumber(n) {
  var x = Math.random();
  var ceiling = n;
  return Math.floor(x * ceiling) | 0;
}

function getRandomWord(param) {
  var nWords = nameWords.length;
  return Caml_array.caml_array_get(nameWords, randomNumber(nWords));
}

function generateRandomNameList(words) {
  if (words < 1) {
    return /* [] */0;
  } else {
    return /* :: */[
            getRandomWord(/* () */0),
            generateRandomNameList(words - 1 | 0)
          ];
  }
}

function generateRandomName(words) {
  return List.fold_left((function (o, s) {
                var sep = o !== "" ? " " : "";
                return o + (sep + s);
              }), "", generateRandomNameList(words));
}

exports.nameWords = nameWords;
exports.randomNumber = randomNumber;
exports.getRandomWord = getRandomWord;
exports.generateRandomNameList = generateRandomNameList;
exports.generateRandomName = generateRandomName;
/* No side effect */

},{"bs-platform/lib/js/caml_array.js":5,"bs-platform/lib/js/list.js":25}],49:[function(require,module,exports){
// Generated by BUCKLESCRIPT, PLEASE EDIT WITH CARE
'use strict';

var $$Array = require("bs-platform/lib/js/array.js");
var Caml_array = require("bs-platform/lib/js/caml_array.js");
var Caml_int32 = require("bs-platform/lib/js/caml_int32.js");
var Caml_primitive = require("bs-platform/lib/js/caml_primitive.js");

function noiseArray(n) {
  return $$Array.init(n, (function (param) {
                return Math.random();
              }));
}

function neighbors(xx, yy) {
  return /* array */[
          /* tuple */[
            xx,
            yy
          ],
          /* tuple */[
            xx + 1 | 0,
            yy
          ],
          /* tuple */[
            xx,
            yy + 1 | 0
          ],
          /* tuple */[
            xx + 1 | 0,
            yy + 1 | 0
          ]
        ];
}

function neighborWeights(pctX, pctY, rs) {
  var invX = 1.0 - pctX;
  var invY = 1.0 - pctY;
  return /* array */[
          Caml_array.caml_array_get(rs, 0) * invX * invY,
          Caml_array.caml_array_get(rs, 1) * pctX * invY,
          Caml_array.caml_array_get(rs, 2) * invX * pctY,
          Caml_array.caml_array_get(rs, 3) * pctX * pctY
        ];
}

function noiseField(noise, x, y) {
  var maxScale = x > y ? x : y;
  var sample = function (scale, xx, yy) {
    var rs = $$Array.map((function (param) {
            var xx = Caml_int32.mod_(param[0], x);
            var yy = Caml_int32.mod_(param[1], y);
            return Caml_array.caml_array_get(noise, Caml_int32.mod_(xx, x) + Caml_int32.imul(Caml_int32.mod_(yy, y), x) | 0);
          }), neighbors(Caml_int32.div(xx, scale), Caml_int32.div(yy, scale)));
    var pctX = Caml_int32.mod_(xx, scale) / scale;
    var pctY = Caml_int32.mod_(yy, scale) / scale;
    return $$Array.fold_left((function (prim, prim$1) {
                  return prim + prim$1;
                }), 0.0, neighborWeights(pctX, pctY, rs)) * scale;
  };
  var groundData = $$Array.init(Caml_int32.imul(x, y), (function (i) {
          var yy = Caml_int32.div(i, x);
          var xx = Caml_int32.mod_(i, x);
          var xx$1 = xx;
          var yy$1 = yy;
          var scale = maxScale;
          var result = 0.0;
          while(scale >= 1) {
            result = result + sample(scale, xx$1, yy$1);
            scale = scale / 2 | 0;
          };
          return result;
        }));
  var minSample$prime = $$Array.fold_left((function (prim, prim$1) {
          if (prim < prim$1) {
            return prim;
          } else {
            return prim$1;
          }
        }), Caml_array.caml_array_get(groundData, 0), groundData);
  var maxSample$prime = $$Array.fold_left((function (prim, prim$1) {
          if (prim > prim$1) {
            return prim;
          } else {
            return prim$1;
          }
        }), Caml_array.caml_array_get(groundData, 0), groundData);
  var minSample = (maxSample$prime - minSample$prime) / 4.5 + minSample$prime;
  var maxSample = 0.8 * (maxSample$prime - minSample$prime) + minSample$prime;
  var normalizedGround = $$Array.map((function (g) {
          return Caml_primitive.caml_float_min(1.0, Caml_primitive.caml_float_max(0.0, (g - minSample) / (maxSample - minSample)));
        }), groundData);
  console.log(normalizedGround);
  return {
          groundX: x,
          groundY: y,
          groundData: normalizedGround
        };
}

exports.noiseArray = noiseArray;
exports.neighbors = neighbors;
exports.neighborWeights = neighborWeights;
exports.noiseField = noiseField;
/* No side effect */

},{"bs-platform/lib/js/array.js":1,"bs-platform/lib/js/caml_array.js":5,"bs-platform/lib/js/caml_int32.js":11,"bs-platform/lib/js/caml_primitive.js":17}],50:[function(require,module,exports){
// Generated by BUCKLESCRIPT, PLEASE EDIT WITH CARE
'use strict';

var Life = require("./life.bs.js");
var List = require("bs-platform/lib/js/list.js");
var Curry = require("bs-platform/lib/js/curry.js");
var Contypes = require("./contypes.bs.js");
var Constants = require("./constants.bs.js");
var Caml_array = require("bs-platform/lib/js/caml_array.js");
var Caml_int32 = require("bs-platform/lib/js/caml_int32.js");

function temperate(game, param) {
  var px = Caml_int32.mod_(param[0] + Constants.worldSide | 0, Constants.worldSide);
  var py = Caml_int32.mod_(param[1] + Constants.worldSide | 0, Constants.worldSide);
  var height = Caml_array.caml_array_get(game.world.groundData, Caml_int32.imul(py, game.world.groundX) + px | 0);
  return Math.abs(Math.random() - height) < 0.2;
}

function startPlants(_n, _game) {
  while(true) {
    var game = _game;
    var n = _n;
    if (n <= 0) {
      return game;
    } else {
      var chooseLocationX = Math.random() * Constants.worldSide;
      var chooseLocationY = Math.random() * Constants.worldSide;
      var locations;
      if (Math.random() > 0.5) {
        var nextLocationX = Math.random() > 0.5 ? 1.0 : -1.0;
        locations = /* :: */[
          /* tuple */[
            chooseLocationX,
            chooseLocationY
          ],
          /* :: */[
            /* tuple */[
              nextLocationX,
              chooseLocationY
            ],
            /* [] */0
          ]
        ];
      } else {
        var nextLocationY = Math.random() > 0.5 ? 1.0 : -1.0;
        locations = /* :: */[
          /* tuple */[
            chooseLocationX,
            chooseLocationY
          ],
          /* :: */[
            /* tuple */[
              chooseLocationX,
              nextLocationY
            ],
            /* [] */0
          ]
        ];
      }
      _game = {
        startTime: game.startTime,
        worldTime: game.worldTime,
        realTime: game.realTime,
        lastTs: game.lastTs,
        timeOfDay: game.timeOfDay,
        gameSpeed: game.gameSpeed,
        player: game.player,
        mode: game.mode,
        weather: game.weather,
        world: game.world,
        keys: game.keys,
        cities: game.cities,
        workers: game.workers,
        plants: List.fold_left((function (s, param) {
                return Curry._2(Contypes.IPointSet.add, /* tuple */[
                            param[0] | 0,
                            param[1] | 0
                          ], s);
              }), game.plants, locations)
      };
      _n = n - 1 | 0;
      continue ;
    }
  };
}

function noPlants(game, pt) {
  var cities = Curry._3(Contypes.StringMap.fold, (function (param, c, s) {
          return Curry._2(Contypes.IPointSet.add, /* tuple */[
                      c.x,
                      c.y
                    ], s);
        }), game.cities, Contypes.IPointSet.empty);
  var workers = List.fold_left((function (s, p) {
          return Curry._2(Contypes.IPointSet.add, p, s);
        }), Contypes.IPointSet.empty, List.map((function (param) {
              var w = param[1];
              return /* tuple */[
                      w.x | 0,
                      w.y | 0
                    ];
            }), Curry._1(Contypes.StringMap.bindings, game.workers)));
  var nc = Life.pointsAndNeighbors(Curry._2(Contypes.IPointSet.union, cities, workers));
  var conditions = temperate(game, pt);
  if (Curry._2(Contypes.IPointSet.mem, pt, nc)) {
    return false;
  } else {
    return conditions;
  }
}

function runPlants(game) {
  return {
          startTime: game.startTime,
          worldTime: game.worldTime,
          realTime: game.realTime,
          lastTs: game.lastTs,
          timeOfDay: game.timeOfDay,
          gameSpeed: game.gameSpeed,
          player: game.player,
          mode: game.mode,
          weather: game.weather,
          world: game.world,
          keys: game.keys,
          cities: game.cities,
          workers: game.workers,
          plants: Curry._2(Contypes.IPointSet.filter, (function (param) {
                  return noPlants(game, param);
                }), Life.run(game.plants))
        };
}

var plantGrowth = 1.0;

exports.plantGrowth = plantGrowth;
exports.temperate = temperate;
exports.startPlants = startPlants;
exports.noPlants = noPlants;
exports.runPlants = runPlants;
/* Life Not a pure module */

},{"./constants.bs.js":37,"./contypes.bs.js":38,"./life.bs.js":44,"bs-platform/lib/js/caml_array.js":5,"bs-platform/lib/js/caml_int32.js":11,"bs-platform/lib/js/curry.js":24,"bs-platform/lib/js/list.js":25}],51:[function(require,module,exports){
// Generated by BUCKLESCRIPT, PLEASE EDIT WITH CARE
'use strict';

var $$Math = require("./math.bs.js");
var Constants = require("./constants.bs.js");

function getCurrentPlayerMoveRate(param) {
  switch (param) {
    case /* Clear */0 :
    case /* Pokkari */1 :
    case /* Overcast */2 :
        return 10.0;
    case /* Rain */3 :
        return 10.0 * 0.75;
    case /* Snow */4 :
        return 10.0 * 0.3;
    case /* Storm */5 :
        return 10.0 * 0.1;
    case /* Fog */6 :
        return 10.0 * 0.5;
    
  }
}

function newPlayer(param) {
  return {
          x: Constants.worldSide / 2.0 + 0.5,
          y: Constants.worldSide / 2.0 + 0.5,
          target: /* tuple */[
            Constants.worldSide / 2 | 0,
            Constants.worldSide / 2 | 0
          ],
          food: 1.0,
          knowledge: /* [] */0,
          health: 1.0
        };
}

function setTargetLocation(tgt, player) {
  return {
          x: player.x,
          y: player.y,
          target: tgt,
          food: player.food,
          knowledge: player.knowledge,
          health: player.health
        };
}

function moveCloserToTarget(game, incT, player) {
  var moveRate = getCurrentPlayerMoveRate(game.weather);
  var match = $$Math.moveToward(incT, moveRate, player.target, /* tuple */[
        player.x,
        player.y
      ]);
  return {
          x: match[0],
          y: match[1],
          target: player.target,
          food: player.food,
          knowledge: player.knowledge,
          health: player.health
        };
}

var playerMoveRate = 10.0;

exports.playerMoveRate = playerMoveRate;
exports.getCurrentPlayerMoveRate = getCurrentPlayerMoveRate;
exports.newPlayer = newPlayer;
exports.setTargetLocation = setTargetLocation;
exports.moveCloserToTarget = moveCloserToTarget;
/* Math Not a pure module */

},{"./constants.bs.js":37,"./math.bs.js":46}],52:[function(require,module,exports){
// Generated by BUCKLESCRIPT, PLEASE EDIT WITH CARE
'use strict';

var $$Array = require("bs-platform/lib/js/array.js");
var Color = require("./color.bs.js");
var Curry = require("bs-platform/lib/js/curry.js");
var Canvas = require("./canvas.bs.js");
var Caml_string = require("bs-platform/lib/js/caml_string.js");

function getSpriteDefDimensions(def) {
  var widths = $$Array.map((function (r) {
          return r.row.length;
        }), def);
  var height = def.length;
  var width = $$Array.fold_left((function (prim, prim$1) {
          if (prim > prim$1) {
            return prim;
          } else {
            return prim$1;
          }
        }), 0, widths);
  return /* tuple */[
          width,
          height
        ];
}

var CompiledSpriteCanvasUser = { };

var CompileSprite = Canvas.WithCanvas(CompiledSpriteCanvasUser);

function rowOpaque(r, j) {
  if (j >= r.row.length) {
    return false;
  } else {
    return Caml_string.get(r.row, j) !== /* " " */32;
  }
}

function compileSprite(def) {
  var match = getSpriteDefDimensions(def);
  var dy = match[1];
  var dx = match[0];
  return Curry._4(CompileSprite.withNewCanvas, "hidden", (dx << 4), (dy << 4), (function (canvas) {
                var ctx = Curry._1(Canvas.getContext2D, canvas);
                $$Array.mapi((function (i, r) {
                        ctx.fillStyle = Curry._1(Canvas.fillStyleOfString, Color.stringOfColor(Color.colorOfCoord(r.color)));
                        for(var j = 0 ,j_finish = dx - 1 | 0; j <= j_finish; ++j){
                          if (rowOpaque(r, j)) {
                            ctx.fillRect((j << 4), (i << 4), 16, 16);
                          }
                          
                        }
                        return /* () */0;
                      }), def);
                return {
                        definition: def,
                        width: dx,
                        height: dy,
                        compiled: Curry._1(Canvas.canvasToImage, canvas)
                      };
              }));
}

function drawSpriteCenter(spec, sprite, x, y, w, h) {
  var ctx = spec.context2d;
  var cx = w / 2 | 0;
  var cy = h / 2 | 0;
  ctx.drawImage(sprite.compiled, 0, 0, (sprite.width << 4), (sprite.height << 4), x - cx | 0, y - cy | 0, w, h);
  return /* () */0;
}

var squareness = 16;

exports.getSpriteDefDimensions = getSpriteDefDimensions;
exports.CompiledSpriteCanvasUser = CompiledSpriteCanvasUser;
exports.CompileSprite = CompileSprite;
exports.rowOpaque = rowOpaque;
exports.squareness = squareness;
exports.compileSprite = compileSprite;
exports.drawSpriteCenter = drawSpriteCenter;
/* CompileSprite Not a pure module */

},{"./canvas.bs.js":33,"./color.bs.js":36,"bs-platform/lib/js/array.js":1,"bs-platform/lib/js/caml_string.js":18,"bs-platform/lib/js/curry.js":24}],53:[function(require,module,exports){
// Generated by BUCKLESCRIPT, PLEASE EDIT WITH CARE
'use strict';

var Sprite = require("./sprite.bs.js");

var playerSpriteDef = /* array */[
  {
    color: /* tuple */[
      1,
      7
    ],
    row: "  x  "
  },
  {
    color: /* tuple */[
      1,
      7
    ],
    row: " xxx "
  },
  {
    color: /* tuple */[
      1,
      7
    ],
    row: "  x  "
  },
  {
    color: /* tuple */[
      1,
      7
    ],
    row: "  x  "
  },
  {
    color: /* tuple */[
      1,
      7
    ],
    row: " x x "
  }
];

var citySpriteDef = /* array */[
  {
    color: /* tuple */[
      3,
      7
    ],
    row: "    x  "
  },
  {
    color: /* tuple */[
      3,
      5
    ],
    row: " x  x  "
  },
  {
    color: /* tuple */[
      3,
      3
    ],
    row: " xxxxx "
  },
  {
    color: /* tuple */[
      3,
      1
    ],
    row: "xxxxxxx"
  },
  {
    color: /* tuple */[
      3,
      0
    ],
    row: " x x x "
  }
];

var ruinSpriteDef = /* array */[
  {
    color: /* tuple */[
      3,
      3
    ],
    row: "       "
  },
  {
    color: /* tuple */[
      3,
      3
    ],
    row: "       "
  },
  {
    color: /* tuple */[
      3,
      2
    ],
    row: "  x x  "
  },
  {
    color: /* tuple */[
      3,
      1
    ],
    row: " xxxxxx"
  },
  {
    color: /* tuple */[
      3,
      0
    ],
    row: "xxxxxxx"
  }
];

var workerSpriteDef = /* array */[
  {
    color: /* tuple */[
      6,
      5
    ],
    row: "   x   "
  },
  {
    color: /* tuple */[
      6,
      4
    ],
    row: " xxx   "
  },
  {
    color: /* tuple */[
      6,
      3
    ],
    row: " xxx   "
  },
  {
    color: /* tuple */[
      6,
      2
    ],
    row: "   xx  "
  },
  {
    color: /* tuple */[
      6,
      1
    ],
    row: "  x x  "
  }
];

var deadWorkerSpriteDef = /* array */[
  {
    color: /* tuple */[
      4,
      3
    ],
    row: "       "
  },
  {
    color: /* tuple */[
      4,
      3
    ],
    row: "       "
  },
  {
    color: /* tuple */[
      4,
      2
    ],
    row: "x  xxx "
  },
  {
    color: /* tuple */[
      4,
      1
    ],
    row: " xxxxxx"
  },
  {
    color: /* tuple */[
      4,
      0
    ],
    row: "xx     "
  }
];

var targetDef = /* array */[
  {
    color: /* tuple */[
      3,
      5
    ],
    row: "x x"
  },
  {
    color: /* tuple */[
      3,
      5
    ],
    row: " x "
  },
  {
    color: /* tuple */[
      3,
      5
    ],
    row: "x x"
  }
];

var plantDef = /* array */[
  {
    color: /* tuple */[
      10,
      6
    ],
    row: "  x  "
  },
  {
    color: /* tuple */[
      10,
      5
    ],
    row: "x x x"
  },
  {
    color: /* tuple */[
      10,
      4
    ],
    row: " xxx "
  },
  {
    color: /* tuple */[
      10,
      3
    ],
    row: " xxx "
  }
];

var playerSprite = Sprite.compileSprite(playerSpriteDef);

var citySprite = Sprite.compileSprite(citySpriteDef);

var ruinSprite = Sprite.compileSprite(ruinSpriteDef);

var workerSprite = Sprite.compileSprite(workerSpriteDef);

var deadWorkerSprite = Sprite.compileSprite(deadWorkerSpriteDef);

var targetSprite = Sprite.compileSprite(targetDef);

var plantSprite = Sprite.compileSprite(plantDef);

exports.playerSpriteDef = playerSpriteDef;
exports.citySpriteDef = citySpriteDef;
exports.ruinSpriteDef = ruinSpriteDef;
exports.workerSpriteDef = workerSpriteDef;
exports.deadWorkerSpriteDef = deadWorkerSpriteDef;
exports.targetDef = targetDef;
exports.plantDef = plantDef;
exports.playerSprite = playerSprite;
exports.citySprite = citySprite;
exports.ruinSprite = ruinSprite;
exports.workerSprite = workerSprite;
exports.deadWorkerSprite = deadWorkerSprite;
exports.targetSprite = targetSprite;
exports.plantSprite = plantSprite;
/* playerSprite Not a pure module */

},{"./sprite.bs.js":52}],54:[function(require,module,exports){
// Generated by BUCKLESCRIPT, PLEASE EDIT WITH CARE
'use strict';


function timeOfDayFromWorldTime(t) {
  var currentDay = Math.floor(t);
  return t - currentDay;
}

function todToString(t) {
  if (t < 0.25) {
    return "Dawn";
  } else if (t < 0.5) {
    return "Noon";
  } else if (t < 0.75) {
    return "Dusk";
  } else {
    return "Night";
  }
}

var midnight = 0.0;

var dawn = 0.25;

var noon = 0.5;

var dusk = 0.75;

exports.midnight = midnight;
exports.dawn = dawn;
exports.noon = noon;
exports.dusk = dusk;
exports.timeOfDayFromWorldTime = timeOfDayFromWorldTime;
exports.todToString = todToString;
/* No side effect */

},{}],55:[function(require,module,exports){
// Generated by BUCKLESCRIPT, PLEASE EDIT WITH CARE
'use strict';


function weatherToString(param) {
  switch (param) {
    case /* Clear */0 :
        return "Clear";
    case /* Pokkari */1 :
        return "Pokkari";
    case /* Overcast */2 :
        return "Overcast";
    case /* Rain */3 :
        return "Rain";
    case /* Snow */4 :
        return "Snow";
    case /* Storm */5 :
        return "Storm";
    case /* Fog */6 :
        return "Fog";
    
  }
}

exports.weatherToString = weatherToString;
/* No side effect */

},{}],56:[function(require,module,exports){
// Generated by BUCKLESCRIPT, PLEASE EDIT WITH CARE
'use strict';

var Curry = require("bs-platform/lib/js/curry.js");

var getWindow = ( function() { return window; } );

var $$window = Curry._1(getWindow, /* () */0);

function onKeyDown(f) {
  $$window.addEventListener("keydown", (function (k) {
          k.preventDefault();
          k.stopPropagation();
          return Curry._1(f, k.key);
        }));
  return /* () */0;
}

function onKeyUp(f) {
  $$window.addEventListener("keyup", (function (k) {
          k.preventDefault();
          k.stopPropagation();
          return Curry._1(f, k.key);
        }));
  return /* () */0;
}

exports.getWindow = getWindow;
exports.$$window = $$window;
exports.onKeyDown = onKeyDown;
exports.onKeyUp = onKeyUp;
/* getWindow Not a pure module */

},{"bs-platform/lib/js/curry.js":24}],57:[function(require,module,exports){
// Generated by BUCKLESCRIPT, PLEASE EDIT WITH CARE
'use strict';

var $$Math = require("./math.bs.js");
var Block = require("bs-platform/lib/js/block.js");
var Curry = require("bs-platform/lib/js/curry.js");
var Namegen = require("./namegen.bs.js");
var Caml_obj = require("bs-platform/lib/js/caml_obj.js");
var Contypes = require("./contypes.bs.js");
var Gamestate = require("./gamestate.bs.js");

function addWorkerFood(amt, worker) {
  return {
          name: worker.name,
          x: worker.x,
          y: worker.y,
          food: worker.food + amt,
          home: worker.home,
          target: worker.target,
          death: worker.death
        };
}

function newWorker(city, tgt) {
  return {
          name: Namegen.generateRandomName(3),
          x: city.x + 0.5,
          y: city.y + 0.5,
          food: 0.0,
          home: city.name,
          target: tgt,
          death: 0.0
        };
}

function moveToward(incT, param, worker) {
  var match = $$Math.moveToward(incT, 4.0, /* tuple */[
        param[0],
        param[1]
      ], /* tuple */[
        worker.x,
        worker.y
      ]);
  return {
          name: worker.name,
          x: match[0],
          y: match[1],
          food: worker.food,
          home: worker.home,
          target: worker.target,
          death: worker.death
        };
}

function runWorker(game, incT, worker) {
  if (worker.death > 0.0) {
    var newDeathTimer = worker.death - incT;
    if (newDeathTimer <= 0.0) {
      return /* WorkerDie */Block.__(2, [worker.name]);
    } else {
      return /* WorkerMove */Block.__(0, [{
                  name: worker.name,
                  x: worker.x,
                  y: worker.y,
                  food: worker.food,
                  home: worker.home,
                  target: worker.target,
                  death: newDeathTimer
                }]);
    }
  } else {
    var whereAt_000 = worker.x | 0;
    var whereAt_001 = worker.y | 0;
    var whereAt = /* tuple */[
      whereAt_000,
      whereAt_001
    ];
    var target = Gamestate.locationOfWorkerTarget(game, worker.target);
    var home = Gamestate.locationOfWorkerTarget(game, /* TargetEntity */Block.__(0, [worker.home]));
    if (home !== undefined && target !== undefined) {
      if (Caml_obj.caml_equal(whereAt, home) && Caml_obj.caml_equal(worker.target, /* TargetEntity */Block.__(0, [worker.home]))) {
        return /* WorkerSucceed */Block.__(1, [worker]);
      } else {
        var tgt = target;
        if (Caml_obj.caml_equal(whereAt, tgt)) {
          return /* WorkerMove */Block.__(0, [{
                      name: worker.name,
                      x: worker.x,
                      y: worker.y,
                      food: worker.food,
                      home: worker.home,
                      target: /* TargetEntity */Block.__(0, [worker.home]),
                      death: worker.death
                    }]);
        } else if (Curry._2(Contypes.IPointSet.mem, whereAt, game.plants)) {
          return /* WorkerMove */Block.__(0, [moveToward(incT, tgt, {
                          name: worker.name,
                          x: worker.x,
                          y: worker.y,
                          food: worker.food + incT * 50.0,
                          home: worker.home,
                          target: worker.target,
                          death: worker.death
                        })]);
        } else {
          return /* WorkerMove */Block.__(0, [moveToward(incT, tgt, worker)]);
        }
      }
    }
    return /* WorkerMove */Block.__(0, [{
                name: worker.name,
                x: worker.x,
                y: worker.y,
                food: worker.food,
                home: worker.home,
                target: worker.target,
                death: 0.3
              }]);
  }
}

var workerDeathTime = 0.3;

var workerMoveRate = 4.0;

exports.workerDeathTime = workerDeathTime;
exports.workerMoveRate = workerMoveRate;
exports.addWorkerFood = addWorkerFood;
exports.newWorker = newWorker;
exports.moveToward = moveToward;
exports.runWorker = runWorker;
/* Math Not a pure module */

},{"./contypes.bs.js":38,"./gamestate.bs.js":42,"./math.bs.js":46,"./namegen.bs.js":48,"bs-platform/lib/js/block.js":2,"bs-platform/lib/js/caml_obj.js":15,"bs-platform/lib/js/curry.js":24}],58:[function(require,module,exports){
// Generated by BUCKLESCRIPT, PLEASE EDIT WITH CARE
'use strict';

var Tod = require("./tod.bs.js");
var Block = require("bs-platform/lib/js/block.js");
var Color = require("./color.bs.js");
var Curry = require("bs-platform/lib/js/curry.js");
var Canvas = require("./canvas.bs.js");
var Printf = require("bs-platform/lib/js/printf.js");
var Weather = require("./weather.bs.js");
var Contypes = require("./contypes.bs.js");
var Caml_array = require("bs-platform/lib/js/caml_array.js");
var Caml_int32 = require("bs-platform/lib/js/caml_int32.js");
var Gamepalette = require("./gamepalette.bs.js");

function getMapScreenId(state) {
  return Curry._2(Printf.sprintf(/* Format */[
                  /* String_literal */Block.__(11, [
                      "world-map-",
                      /* String */Block.__(2, [
                          /* No_padding */0,
                          /* Char_literal */Block.__(12, [
                              /* "-" */45,
                              /* String */Block.__(2, [
                                  /* No_padding */0,
                                  /* End_of_format */0
                                ])
                            ])
                        ])
                    ]),
                  "world-map-%s-%s"
                ]), Weather.weatherToString(state.game.weather), Tod.todToString(state.game.timeOfDay));
}

function cacheMapScreen(state) {
  var cacheid = getMapScreenId(state);
  try {
    return Curry._2(Contypes.StringMap.find, cacheid, state.mapcache.contents);
  }
  catch (exn){
    return Curry._4(Canvas.ImageFromCanvas.withNewCanvas, "hidden", state.spec.width, state.spec.height, (function (canvas) {
                  var ctx = Curry._1(Canvas.getContext2D, canvas);
                  var palette = Gamepalette.getPaletteByTimeOfDay(Gamepalette.mapPalette, state.game.timeOfDay);
                  var bgColor = Caml_array.caml_array_get(palette, palette.length - 1 | 0);
                  ctx.fillStyle = Curry._1(Canvas.fillStyleOfString, Color.stringOfColor(Color.colorOfCoord(bgColor)));
                  for(var i = 0 ,i_finish = state.game.world.groundY - 1 | 0; i <= i_finish; ++i){
                    var yTop = Caml_int32.div(Caml_int32.imul(i, state.spec.height), state.game.world.groundY);
                    var yBot = Caml_int32.div(Caml_int32.imul(i + 1 | 0, state.spec.height), state.game.world.groundY);
                    for(var j = 0 ,j_finish = state.game.world.groundX - 1 | 0; j <= j_finish; ++j){
                      var xLeft = Caml_int32.div(Caml_int32.imul(j, state.spec.width), state.game.world.groundX);
                      var xRight = Caml_int32.div(Caml_int32.imul(j + 1 | 0, state.spec.width), state.game.world.groundX);
                      var level = Caml_array.caml_array_get(state.game.world.groundData, Caml_int32.imul(i, state.game.world.groundX) + j | 0);
                      var color = Color.colorOfCoord(Color.colorFromPalette(palette, level));
                      ctx.fillStyle = Curry._1(Canvas.fillStyleOfString, Color.stringOfColor(color));
                      ctx.fillRect(xLeft, yTop, xRight - xLeft | 0, yBot - yTop | 0);
                    }
                  }
                  var img = Curry._1(Canvas.canvasToImage, canvas);
                  state.mapcache.contents = Curry._3(Contypes.StringMap.add, cacheid, img, state.mapcache.contents);
                  return img;
                }));
  }
}

exports.getMapScreenId = getMapScreenId;
exports.cacheMapScreen = cacheMapScreen;
/* Canvas Not a pure module */

},{"./canvas.bs.js":33,"./color.bs.js":36,"./contypes.bs.js":38,"./gamepalette.bs.js":41,"./tod.bs.js":54,"./weather.bs.js":55,"bs-platform/lib/js/block.js":2,"bs-platform/lib/js/caml_array.js":5,"bs-platform/lib/js/caml_int32.js":11,"bs-platform/lib/js/curry.js":24,"bs-platform/lib/js/printf.js":28}]},{},[45]);
