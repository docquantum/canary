! function(exports) {
  "use strict";
  var AuthInfo = function() {
      function t(e, t, r, n, o, i, s) {
        this.userId = e, this.deviceId = t, this.accessToken = r, this.refreshToken = n, this.loggedInProviderType = o, this.loggedInProviderName = i, this.userProfile = s
      }
      return t.empty = function() {
        return new t(void 0, void 0, void 0, void 0, void 0, void 0, void 0)
      }, t.prototype.loggedOut = function() {
        return new t(void 0, this.deviceId, void 0, void 0, void 0, void 0, void 0)
      }, t.prototype.merge = function(e) {
        return new t(void 0 === e.userId ? this.userId : e.userId, void 0 === e.deviceId ? this.deviceId : e.deviceId, void 0 === e.accessToken ? this.accessToken : e.accessToken, void 0 === e.refreshToken ? this.refreshToken : e.refreshToken, void 0 === e.loggedInProviderType ? this.loggedInProviderType : e.loggedInProviderType, void 0 === e.loggedInProviderName ? this.loggedInProviderName : e.loggedInProviderName, void 0 === e.userProfile ? this.userProfile : e.userProfile)
      }, t
    }(),
    global$1 = "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {},
    lookup = [],
    revLookup = [],
    Arr = "undefined" != typeof Uint8Array ? Uint8Array : Array,
    inited = !1;

  function init() {
    inited = !0;
    for (var e = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", t = 0, r = e.length; t < r; ++t) lookup[t] = e[t], revLookup[e.charCodeAt(t)] = t;
    revLookup["-".charCodeAt(0)] = 62, revLookup["_".charCodeAt(0)] = 63
  }

  function toByteArray(e) {
    var t, r, n, o, i, s;
    inited || init();
    var u = e.length;
    if (0 < u % 4) throw new Error("Invalid string. Length must be a multiple of 4");
    i = "=" === e[u - 2] ? 2 : "=" === e[u - 1] ? 1 : 0, s = new Arr(3 * u / 4 - i), n = 0 < i ? u - 4 : u;
    var a = 0;
    for (r = t = 0; t < n; t += 4, r += 3) o = revLookup[e.charCodeAt(t)] << 18 | revLookup[e.charCodeAt(t + 1)] << 12 | revLookup[e.charCodeAt(t + 2)] << 6 | revLookup[e.charCodeAt(t + 3)], s[a++] = o >> 16 & 255, s[a++] = o >> 8 & 255, s[a++] = 255 & o;
    return 2 === i ? (o = revLookup[e.charCodeAt(t)] << 2 | revLookup[e.charCodeAt(t + 1)] >> 4, s[a++] = 255 & o) : 1 === i && (o = revLookup[e.charCodeAt(t)] << 10 | revLookup[e.charCodeAt(t + 1)] << 4 | revLookup[e.charCodeAt(t + 2)] >> 2, s[a++] = o >> 8 & 255, s[a++] = 255 & o), s
  }

  function tripletToBase64(e) {
    return lookup[e >> 18 & 63] + lookup[e >> 12 & 63] + lookup[e >> 6 & 63] + lookup[63 & e]
  }

  function encodeChunk(e, t, r) {
    for (var n, o = [], i = t; i < r; i += 3) n = (e[i] << 16) + (e[i + 1] << 8) + e[i + 2], o.push(tripletToBase64(n));
    return o.join("")
  }

  function fromByteArray(e) {
    var t;
    inited || init();
    for (var r = e.length, n = r % 3, o = "", i = [], s = 16383, u = 0, a = r - n; u < a; u += s) i.push(encodeChunk(e, u, a < u + s ? a : u + s));
    return 1 === n ? (t = e[r - 1], o += lookup[t >> 2], o += lookup[t << 4 & 63], o += "==") : 2 === n && (t = (e[r - 2] << 8) + e[r - 1], o += lookup[t >> 10], o += lookup[t >> 4 & 63], o += lookup[t << 2 & 63], o += "="), i.push(o), i.join("")
  }

  function read(e, t, r, n, o) {
    var i, s, u = 8 * o - n - 1,
      a = (1 << u) - 1,
      f = a >> 1,
      c = -7,
      h = r ? o - 1 : 0,
      l = r ? -1 : 1,
      d = e[t + h];
    for (h += l, i = d & (1 << -c) - 1, d >>= -c, c += u; 0 < c; i = 256 * i + e[t + h], h += l, c -= 8);
    for (s = i & (1 << -c) - 1, i >>= -c, c += n; 0 < c; s = 256 * s + e[t + h], h += l, c -= 8);
    if (0 === i) i = 1 - f;
    else {
      if (i === a) return s ? NaN : 1 / 0 * (d ? -1 : 1);
      s += Math.pow(2, n), i -= f
    }
    return (d ? -1 : 1) * s * Math.pow(2, i - n)
  }

  function write(e, t, r, n, o, i) {
    var s, u, a, f = 8 * i - o - 1,
      c = (1 << f) - 1,
      h = c >> 1,
      l = 23 === o ? Math.pow(2, -24) - Math.pow(2, -77) : 0,
      d = n ? 0 : i - 1,
      p = n ? 1 : -1,
      y = t < 0 || 0 === t && 1 / t < 0 ? 1 : 0;
    for (t = Math.abs(t), isNaN(t) || t === 1 / 0 ? (u = isNaN(t) ? 1 : 0, s = c) : (s = Math.floor(Math.log(t) / Math.LN2), t * (a = Math.pow(2, -s)) < 1 && (s--, a *= 2), 2 <= (t += 1 <= s + h ? l / a : l * Math.pow(2, 1 - h)) * a && (s++, a /= 2), c <= s + h ? (u = 0, s = c) : 1 <= s + h ? (u = (t * a - 1) * Math.pow(2, o), s += h) : (u = t * Math.pow(2, h - 1) * Math.pow(2, o), s = 0)); 8 <= o; e[r + d] = 255 & u, d += p, u /= 256, o -= 8);
    for (s = s << o | u, f += o; 0 < f; e[r + d] = 255 & s, d += p, s /= 256, f -= 8);
    e[r + d - p] |= 128 * y
  }
  var toString = {}.toString,
    isArray = Array.isArray || function(e) {
      return "[object Array]" == toString.call(e)
    },
    INSPECT_MAX_BYTES = 50;

  function kMaxLength() {
    return Buffer.TYPED_ARRAY_SUPPORT ? 2147483647 : 1073741823
  }

  function createBuffer(e, t) {
    if (kMaxLength() < t) throw new RangeError("Invalid typed array length");
    return Buffer.TYPED_ARRAY_SUPPORT ? (e = new Uint8Array(t)).__proto__ = Buffer.prototype : (null === e && (e = new Buffer(t)), e.length = t), e
  }

  function Buffer(e, t, r) {
    if (!(Buffer.TYPED_ARRAY_SUPPORT || this instanceof Buffer)) return new Buffer(e, t, r);
    if ("number" == typeof e) {
      if ("string" == typeof t) throw new Error("If encoding is specified then the first argument must be a string");
      return allocUnsafe(this, e)
    }
    return from(this, e, t, r)
  }

  function from(e, t, r, n) {
    if ("number" == typeof t) throw new TypeError('"value" argument must not be a number');
    return "undefined" != typeof ArrayBuffer && t instanceof ArrayBuffer ? fromArrayBuffer(e, t, r, n) : "string" == typeof t ? fromString(e, t, r) : fromObject(e, t)
  }

  function assertSize(e) {
    if ("number" != typeof e) throw new TypeError('"size" argument must be a number');
    if (e < 0) throw new RangeError('"size" argument must not be negative')
  }

  function alloc(e, t, r, n) {
    return assertSize(t), t <= 0 ? createBuffer(e, t) : void 0 !== r ? "string" == typeof n ? createBuffer(e, t).fill(r, n) : createBuffer(e, t).fill(r) : createBuffer(e, t)
  }

  function allocUnsafe(e, t) {
    if (assertSize(t), e = createBuffer(e, t < 0 ? 0 : 0 | checked(t)), !Buffer.TYPED_ARRAY_SUPPORT)
      for (var r = 0; r < t; ++r) e[r] = 0;
    return e
  }

  function fromString(e, t, r) {
    if ("string" == typeof r && "" !== r || (r = "utf8"), !Buffer.isEncoding(r)) throw new TypeError('"encoding" must be a valid string encoding');
    var n = 0 | byteLength(t, r),
      o = (e = createBuffer(e, n)).write(t, r);
    return o !== n && (e = e.slice(0, o)), e
  }

  function fromArrayLike(e, t) {
    var r = t.length < 0 ? 0 : 0 | checked(t.length);
    e = createBuffer(e, r);
    for (var n = 0; n < r; n += 1) e[n] = 255 & t[n];
    return e
  }

  function fromArrayBuffer(e, t, r, n) {
    if (t.byteLength, r < 0 || t.byteLength < r) throw new RangeError("'offset' is out of bounds");
    if (t.byteLength < r + (n || 0)) throw new RangeError("'length' is out of bounds");
    return t = void 0 === r && void 0 === n ? new Uint8Array(t) : void 0 === n ? new Uint8Array(t, r) : new Uint8Array(t, r, n), Buffer.TYPED_ARRAY_SUPPORT ? (e = t).__proto__ = Buffer.prototype : e = fromArrayLike(e, t), e
  }

  function fromObject(e, t) {
    if (internalIsBuffer(t)) {
      var r = 0 | checked(t.length);
      return 0 === (e = createBuffer(e, r)).length || t.copy(e, 0, 0, r), e
    }
    if (t) {
      if ("undefined" != typeof ArrayBuffer && t.buffer instanceof ArrayBuffer || "length" in t) return "number" != typeof t.length || isnan(t.length) ? createBuffer(e, 0) : fromArrayLike(e, t);
      if ("Buffer" === t.type && isArray(t.data)) return fromArrayLike(e, t.data)
    }
    throw new TypeError("First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.")
  }

  function checked(e) {
    if (e >= kMaxLength()) throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + kMaxLength().toString(16) + " bytes");
    return 0 | e
  }

  function internalIsBuffer(e) {
    return !(null == e || !e._isBuffer)
  }

  function byteLength(e, t) {
    if (internalIsBuffer(e)) return e.length;
    if ("undefined" != typeof ArrayBuffer && "function" == typeof ArrayBuffer.isView && (ArrayBuffer.isView(e) || e instanceof ArrayBuffer)) return e.byteLength;
    "string" != typeof e && (e = "" + e);
    var r = e.length;
    if (0 === r) return 0;
    for (var n = !1;;) switch (t) {
      case "ascii":
      case "latin1":
      case "binary":
        return r;
      case "utf8":
      case "utf-8":
      case void 0:
        return utf8ToBytes(e).length;
      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
        return 2 * r;
      case "hex":
        return r >>> 1;
      case "base64":
        return base64ToBytes(e).length;
      default:
        if (n) return utf8ToBytes(e).length;
        t = ("" + t).toLowerCase(), n = !0
    }
  }

  function slowToString(e, t, r) {
    var n = !1;
    if ((void 0 === t || t < 0) && (t = 0), t > this.length) return "";
    if ((void 0 === r || r > this.length) && (r = this.length), r <= 0) return "";
    if ((r >>>= 0) <= (t >>>= 0)) return "";
    for (e || (e = "utf8");;) switch (e) {
      case "hex":
        return hexSlice(this, t, r);
      case "utf8":
      case "utf-8":
        return utf8Slice(this, t, r);
      case "ascii":
        return asciiSlice(this, t, r);
      case "latin1":
      case "binary":
        return latin1Slice(this, t, r);
      case "base64":
        return base64Slice(this, t, r);
      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
        return utf16leSlice(this, t, r);
      default:
        if (n) throw new TypeError("Unknown encoding: " + e);
        e = (e + "").toLowerCase(), n = !0
    }
  }

  function swap(e, t, r) {
    var n = e[t];
    e[t] = e[r], e[r] = n
  }

  function bidirectionalIndexOf(e, t, r, n, o) {
    if (0 === e.length) return -1;
    if ("string" == typeof r ? (n = r, r = 0) : 2147483647 < r ? r = 2147483647 : r < -2147483648 && (r = -2147483648), r = +r, isNaN(r) && (r = o ? 0 : e.length - 1), r < 0 && (r = e.length + r), r >= e.length) {
      if (o) return -1;
      r = e.length - 1
    } else if (r < 0) {
      if (!o) return -1;
      r = 0
    }
    if ("string" == typeof t && (t = Buffer.from(t, n)), internalIsBuffer(t)) return 0 === t.length ? -1 : arrayIndexOf(e, t, r, n, o);
    if ("number" == typeof t) return t &= 255, Buffer.TYPED_ARRAY_SUPPORT && "function" == typeof Uint8Array.prototype.indexOf ? o ? Uint8Array.prototype.indexOf.call(e, t, r) : Uint8Array.prototype.lastIndexOf.call(e, t, r) : arrayIndexOf(e, [t], r, n, o);
    throw new TypeError("val must be string, number or Buffer")
  }

  function arrayIndexOf(e, t, r, n, o) {
    var i, s = 1,
      u = e.length,
      a = t.length;
    if (void 0 !== n && ("ucs2" === (n = String(n).toLowerCase()) || "ucs-2" === n || "utf16le" === n || "utf-16le" === n)) {
      if (e.length < 2 || t.length < 2) return -1;
      u /= s = 2, a /= 2, r /= 2
    }

    function f(e, t) {
      return 1 === s ? e[t] : e.readUInt16BE(t * s)
    }
    if (o) {
      var c = -1;
      for (i = r; i < u; i++)
        if (f(e, i) === f(t, -1 === c ? 0 : i - c)) {
          if (-1 === c && (c = i), i - c + 1 === a) return c * s
        } else -1 !== c && (i -= i - c), c = -1
    } else
      for (u < r + a && (r = u - a), i = r; 0 <= i; i--) {
        for (var h = !0, l = 0; l < a; l++)
          if (f(e, i + l) !== f(t, l)) {
            h = !1;
            break
          } if (h) return i
      }
    return -1
  }

  function hexWrite(e, t, r, n) {
    r = Number(r) || 0;
    var o = e.length - r;
    n ? o < (n = Number(n)) && (n = o) : n = o;
    var i = t.length;
    if (i % 2 != 0) throw new TypeError("Invalid hex string");
    i / 2 < n && (n = i / 2);
    for (var s = 0; s < n; ++s) {
      var u = parseInt(t.substr(2 * s, 2), 16);
      if (isNaN(u)) return s;
      e[r + s] = u
    }
    return s
  }

  function utf8Write(e, t, r, n) {
    return blitBuffer(utf8ToBytes(t, e.length - r), e, r, n)
  }

  function asciiWrite(e, t, r, n) {
    return blitBuffer(asciiToBytes(t), e, r, n)
  }

  function latin1Write(e, t, r, n) {
    return asciiWrite(e, t, r, n)
  }

  function base64Write(e, t, r, n) {
    return blitBuffer(base64ToBytes(t), e, r, n)
  }

  function ucs2Write(e, t, r, n) {
    return blitBuffer(utf16leToBytes(t, e.length - r), e, r, n)
  }

  function base64Slice(e, t, r) {
    return 0 === t && r === e.length ? fromByteArray(e) : fromByteArray(e.slice(t, r))
  }

  function utf8Slice(e, t, r) {
    r = Math.min(e.length, r);
    for (var n = [], o = t; o < r;) {
      var i, s, u, a, f = e[o],
        c = null,
        h = 239 < f ? 4 : 223 < f ? 3 : 191 < f ? 2 : 1;
      if (o + h <= r) switch (h) {
        case 1:
          f < 128 && (c = f);
          break;
        case 2:
          128 == (192 & (i = e[o + 1])) && 127 < (a = (31 & f) << 6 | 63 & i) && (c = a);
          break;
        case 3:
          i = e[o + 1], s = e[o + 2], 128 == (192 & i) && 128 == (192 & s) && 2047 < (a = (15 & f) << 12 | (63 & i) << 6 | 63 & s) && (a < 55296 || 57343 < a) && (c = a);
          break;
        case 4:
          i = e[o + 1], s = e[o + 2], u = e[o + 3], 128 == (192 & i) && 128 == (192 & s) && 128 == (192 & u) && 65535 < (a = (15 & f) << 18 | (63 & i) << 12 | (63 & s) << 6 | 63 & u) && a < 1114112 && (c = a)
      }
      null === c ? (c = 65533, h = 1) : 65535 < c && (c -= 65536, n.push(c >>> 10 & 1023 | 55296), c = 56320 | 1023 & c), n.push(c), o += h
    }
    return decodeCodePointsArray(n)
  }
  Buffer.TYPED_ARRAY_SUPPORT = void 0 === global$1.TYPED_ARRAY_SUPPORT || global$1.TYPED_ARRAY_SUPPORT, Buffer.poolSize = 8192, Buffer._augment = function(e) {
    return e.__proto__ = Buffer.prototype, e
  }, Buffer.from = function(e, t, r) {
    return from(null, e, t, r)
  }, Buffer.TYPED_ARRAY_SUPPORT && (Buffer.prototype.__proto__ = Uint8Array.prototype, Buffer.__proto__ = Uint8Array), Buffer.alloc = function(e, t, r) {
    return alloc(null, e, t, r)
  }, Buffer.allocUnsafe = function(e) {
    return allocUnsafe(null, e)
  }, Buffer.allocUnsafeSlow = function(e) {
    return allocUnsafe(null, e)
  }, Buffer.isBuffer = isBuffer, Buffer.compare = function(e, t) {
    if (!internalIsBuffer(e) || !internalIsBuffer(t)) throw new TypeError("Arguments must be Buffers");
    if (e === t) return 0;
    for (var r = e.length, n = t.length, o = 0, i = Math.min(r, n); o < i; ++o)
      if (e[o] !== t[o]) {
        r = e[o], n = t[o];
        break
      } return r < n ? -1 : n < r ? 1 : 0
  }, Buffer.isEncoding = function(e) {
    switch (String(e).toLowerCase()) {
      case "hex":
      case "utf8":
      case "utf-8":
      case "ascii":
      case "latin1":
      case "binary":
      case "base64":
      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
        return !0;
      default:
        return !1
    }
  }, Buffer.concat = function(e, t) {
    if (!isArray(e)) throw new TypeError('"list" argument must be an Array of Buffers');
    if (0 === e.length) return Buffer.alloc(0);
    var r;
    if (void 0 === t)
      for (r = t = 0; r < e.length; ++r) t += e[r].length;
    var n = Buffer.allocUnsafe(t),
      o = 0;
    for (r = 0; r < e.length; ++r) {
      var i = e[r];
      if (!internalIsBuffer(i)) throw new TypeError('"list" argument must be an Array of Buffers');
      i.copy(n, o), o += i.length
    }
    return n
  }, Buffer.byteLength = byteLength, Buffer.prototype._isBuffer = !0, Buffer.prototype.swap16 = function() {
    var e = this.length;
    if (e % 2 != 0) throw new RangeError("Buffer size must be a multiple of 16-bits");
    for (var t = 0; t < e; t += 2) swap(this, t, t + 1);
    return this
  }, Buffer.prototype.swap32 = function() {
    var e = this.length;
    if (e % 4 != 0) throw new RangeError("Buffer size must be a multiple of 32-bits");
    for (var t = 0; t < e; t += 4) swap(this, t, t + 3), swap(this, t + 1, t + 2);
    return this
  }, Buffer.prototype.swap64 = function() {
    var e = this.length;
    if (e % 8 != 0) throw new RangeError("Buffer size must be a multiple of 64-bits");
    for (var t = 0; t < e; t += 8) swap(this, t, t + 7), swap(this, t + 1, t + 6), swap(this, t + 2, t + 5), swap(this, t + 3, t + 4);
    return this
  }, Buffer.prototype.toString = function() {
    var e = 0 | this.length;
    return 0 === e ? "" : 0 === arguments.length ? utf8Slice(this, 0, e) : slowToString.apply(this, arguments)
  }, Buffer.prototype.equals = function(e) {
    if (!internalIsBuffer(e)) throw new TypeError("Argument must be a Buffer");
    return this === e || 0 === Buffer.compare(this, e)
  }, Buffer.prototype.inspect = function() {
    var e = "",
      t = INSPECT_MAX_BYTES;
    return 0 < this.length && (e = this.toString("hex", 0, t).match(/.{2}/g).join(" "), this.length > t && (e += " ... ")), "<Buffer " + e + ">"
  }, Buffer.prototype.compare = function(e, t, r, n, o) {
    if (!internalIsBuffer(e)) throw new TypeError("Argument must be a Buffer");
    if (void 0 === t && (t = 0), void 0 === r && (r = e ? e.length : 0), void 0 === n && (n = 0), void 0 === o && (o = this.length), t < 0 || r > e.length || n < 0 || o > this.length) throw new RangeError("out of range index");
    if (o <= n && r <= t) return 0;
    if (o <= n) return -1;
    if (r <= t) return 1;
    if (this === e) return 0;
    for (var i = (o >>>= 0) - (n >>>= 0), s = (r >>>= 0) - (t >>>= 0), u = Math.min(i, s), a = this.slice(n, o), f = e.slice(t, r), c = 0; c < u; ++c)
      if (a[c] !== f[c]) {
        i = a[c], s = f[c];
        break
      } return i < s ? -1 : s < i ? 1 : 0
  }, Buffer.prototype.includes = function(e, t, r) {
    return -1 !== this.indexOf(e, t, r)
  }, Buffer.prototype.indexOf = function(e, t, r) {
    return bidirectionalIndexOf(this, e, t, r, !0)
  }, Buffer.prototype.lastIndexOf = function(e, t, r) {
    return bidirectionalIndexOf(this, e, t, r, !1)
  }, Buffer.prototype.write = function(e, t, r, n) {
    if (void 0 === t) n = "utf8", r = this.length, t = 0;
    else if (void 0 === r && "string" == typeof t) n = t, r = this.length, t = 0;
    else {
      if (!isFinite(t)) throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
      t |= 0, isFinite(r) ? (r |= 0, void 0 === n && (n = "utf8")) : (n = r, r = void 0)
    }
    var o = this.length - t;
    if ((void 0 === r || o < r) && (r = o), 0 < e.length && (r < 0 || t < 0) || t > this.length) throw new RangeError("Attempt to write outside buffer bounds");
    n || (n = "utf8");
    for (var i = !1;;) switch (n) {
      case "hex":
        return hexWrite(this, e, t, r);
      case "utf8":
      case "utf-8":
        return utf8Write(this, e, t, r);
      case "ascii":
        return asciiWrite(this, e, t, r);
      case "latin1":
      case "binary":
        return latin1Write(this, e, t, r);
      case "base64":
        return base64Write(this, e, t, r);
      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
        return ucs2Write(this, e, t, r);
      default:
        if (i) throw new TypeError("Unknown encoding: " + n);
        n = ("" + n).toLowerCase(), i = !0
    }
  }, Buffer.prototype.toJSON = function() {
    return {
      type: "Buffer",
      data: Array.prototype.slice.call(this._arr || this, 0)
    }
  };
  var MAX_ARGUMENTS_LENGTH = 4096;

  function decodeCodePointsArray(e) {
    var t = e.length;
    if (t <= MAX_ARGUMENTS_LENGTH) return String.fromCharCode.apply(String, e);
    for (var r = "", n = 0; n < t;) r += String.fromCharCode.apply(String, e.slice(n, n += MAX_ARGUMENTS_LENGTH));
    return r
  }

  function asciiSlice(e, t, r) {
    var n = "";
    r = Math.min(e.length, r);
    for (var o = t; o < r; ++o) n += String.fromCharCode(127 & e[o]);
    return n
  }

  function latin1Slice(e, t, r) {
    var n = "";
    r = Math.min(e.length, r);
    for (var o = t; o < r; ++o) n += String.fromCharCode(e[o]);
    return n
  }

  function hexSlice(e, t, r) {
    var n = e.length;
    (!t || t < 0) && (t = 0), (!r || r < 0 || n < r) && (r = n);
    for (var o = "", i = t; i < r; ++i) o += toHex(e[i]);
    return o
  }

  function utf16leSlice(e, t, r) {
    for (var n = e.slice(t, r), o = "", i = 0; i < n.length; i += 2) o += String.fromCharCode(n[i] + 256 * n[i + 1]);
    return o
  }

  function checkOffset(e, t, r) {
    if (e % 1 != 0 || e < 0) throw new RangeError("offset is not uint");
    if (r < e + t) throw new RangeError("Trying to access beyond buffer length")
  }

  function checkInt(e, t, r, n, o, i) {
    if (!internalIsBuffer(e)) throw new TypeError('"buffer" argument must be a Buffer instance');
    if (o < t || t < i) throw new RangeError('"value" argument is out of bounds');
    if (r + n > e.length) throw new RangeError("Index out of range")
  }

  function objectWriteUInt16(e, t, r, n) {
    t < 0 && (t = 65535 + t + 1);
    for (var o = 0, i = Math.min(e.length - r, 2); o < i; ++o) e[r + o] = (t & 255 << 8 * (n ? o : 1 - o)) >>> 8 * (n ? o : 1 - o)
  }

  function objectWriteUInt32(e, t, r, n) {
    t < 0 && (t = 4294967295 + t + 1);
    for (var o = 0, i = Math.min(e.length - r, 4); o < i; ++o) e[r + o] = t >>> 8 * (n ? o : 3 - o) & 255
  }

  function checkIEEE754(e, t, r, n, o, i) {
    if (r + n > e.length) throw new RangeError("Index out of range");
    if (r < 0) throw new RangeError("Index out of range")
  }

  function writeFloat(e, t, r, n, o) {
    return o || checkIEEE754(e, t, r, 4, 34028234663852886e22, -34028234663852886e22), write(e, t, r, n, 23, 4), r + 4
  }

  function writeDouble(e, t, r, n, o) {
    return o || checkIEEE754(e, t, r, 8, 17976931348623157e292, -17976931348623157e292), write(e, t, r, n, 52, 8), r + 8
  }
  Buffer.prototype.slice = function(e, t) {
    var r, n = this.length;
    if ((e = ~~e) < 0 ? (e += n) < 0 && (e = 0) : n < e && (e = n), (t = void 0 === t ? n : ~~t) < 0 ? (t += n) < 0 && (t = 0) : n < t && (t = n), t < e && (t = e), Buffer.TYPED_ARRAY_SUPPORT)(r = this.subarray(e, t)).__proto__ = Buffer.prototype;
    else {
      var o = t - e;
      r = new Buffer(o, void 0);
      for (var i = 0; i < o; ++i) r[i] = this[i + e]
    }
    return r
  }, Buffer.prototype.readUIntLE = function(e, t, r) {
    e |= 0, t |= 0, r || checkOffset(e, t, this.length);
    for (var n = this[e], o = 1, i = 0; ++i < t && (o *= 256);) n += this[e + i] * o;
    return n
  }, Buffer.prototype.readUIntBE = function(e, t, r) {
    e |= 0, t |= 0, r || checkOffset(e, t, this.length);
    for (var n = this[e + --t], o = 1; 0 < t && (o *= 256);) n += this[e + --t] * o;
    return n
  }, Buffer.prototype.readUInt8 = function(e, t) {
    return t || checkOffset(e, 1, this.length), this[e]
  }, Buffer.prototype.readUInt16LE = function(e, t) {
    return t || checkOffset(e, 2, this.length), this[e] | this[e + 1] << 8
  }, Buffer.prototype.readUInt16BE = function(e, t) {
    return t || checkOffset(e, 2, this.length), this[e] << 8 | this[e + 1]
  }, Buffer.prototype.readUInt32LE = function(e, t) {
    return t || checkOffset(e, 4, this.length), (this[e] | this[e + 1] << 8 | this[e + 2] << 16) + 16777216 * this[e + 3]
  }, Buffer.prototype.readUInt32BE = function(e, t) {
    return t || checkOffset(e, 4, this.length), 16777216 * this[e] + (this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3])
  }, Buffer.prototype.readIntLE = function(e, t, r) {
    e |= 0, t |= 0, r || checkOffset(e, t, this.length);
    for (var n = this[e], o = 1, i = 0; ++i < t && (o *= 256);) n += this[e + i] * o;
    return (o *= 128) <= n && (n -= Math.pow(2, 8 * t)), n
  }, Buffer.prototype.readIntBE = function(e, t, r) {
    e |= 0, t |= 0, r || checkOffset(e, t, this.length);
    for (var n = t, o = 1, i = this[e + --n]; 0 < n && (o *= 256);) i += this[e + --n] * o;
    return (o *= 128) <= i && (i -= Math.pow(2, 8 * t)), i
  }, Buffer.prototype.readInt8 = function(e, t) {
    return t || checkOffset(e, 1, this.length), 128 & this[e] ? -1 * (255 - this[e] + 1) : this[e]
  }, Buffer.prototype.readInt16LE = function(e, t) {
    t || checkOffset(e, 2, this.length);
    var r = this[e] | this[e + 1] << 8;
    return 32768 & r ? 4294901760 | r : r
  }, Buffer.prototype.readInt16BE = function(e, t) {
    t || checkOffset(e, 2, this.length);
    var r = this[e + 1] | this[e] << 8;
    return 32768 & r ? 4294901760 | r : r
  }, Buffer.prototype.readInt32LE = function(e, t) {
    return t || checkOffset(e, 4, this.length), this[e] | this[e + 1] << 8 | this[e + 2] << 16 | this[e + 3] << 24
  }, Buffer.prototype.readInt32BE = function(e, t) {
    return t || checkOffset(e, 4, this.length), this[e] << 24 | this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3]
  }, Buffer.prototype.readFloatLE = function(e, t) {
    return t || checkOffset(e, 4, this.length), read(this, e, !0, 23, 4)
  }, Buffer.prototype.readFloatBE = function(e, t) {
    return t || checkOffset(e, 4, this.length), read(this, e, !1, 23, 4)
  }, Buffer.prototype.readDoubleLE = function(e, t) {
    return t || checkOffset(e, 8, this.length), read(this, e, !0, 52, 8)
  }, Buffer.prototype.readDoubleBE = function(e, t) {
    return t || checkOffset(e, 8, this.length), read(this, e, !1, 52, 8)
  }, Buffer.prototype.writeUIntLE = function(e, t, r, n) {
    (e = +e, t |= 0, r |= 0, n) || checkInt(this, e, t, r, Math.pow(2, 8 * r) - 1, 0);
    var o = 1,
      i = 0;
    for (this[t] = 255 & e; ++i < r && (o *= 256);) this[t + i] = e / o & 255;
    return t + r
  }, Buffer.prototype.writeUIntBE = function(e, t, r, n) {
    (e = +e, t |= 0, r |= 0, n) || checkInt(this, e, t, r, Math.pow(2, 8 * r) - 1, 0);
    var o = r - 1,
      i = 1;
    for (this[t + o] = 255 & e; 0 <= --o && (i *= 256);) this[t + o] = e / i & 255;
    return t + r
  }, Buffer.prototype.writeUInt8 = function(e, t, r) {
    return e = +e, t |= 0, r || checkInt(this, e, t, 1, 255, 0), Buffer.TYPED_ARRAY_SUPPORT || (e = Math.floor(e)), this[t] = 255 & e, t + 1
  }, Buffer.prototype.writeUInt16LE = function(e, t, r) {
    return e = +e, t |= 0, r || checkInt(this, e, t, 2, 65535, 0), Buffer.TYPED_ARRAY_SUPPORT ? (this[t] = 255 & e, this[t + 1] = e >>> 8) : objectWriteUInt16(this, e, t, !0), t + 2
  }, Buffer.prototype.writeUInt16BE = function(e, t, r) {
    return e = +e, t |= 0, r || checkInt(this, e, t, 2, 65535, 0), Buffer.TYPED_ARRAY_SUPPORT ? (this[t] = e >>> 8, this[t + 1] = 255 & e) : objectWriteUInt16(this, e, t, !1), t + 2
  }, Buffer.prototype.writeUInt32LE = function(e, t, r) {
    return e = +e, t |= 0, r || checkInt(this, e, t, 4, 4294967295, 0), Buffer.TYPED_ARRAY_SUPPORT ? (this[t + 3] = e >>> 24, this[t + 2] = e >>> 16, this[t + 1] = e >>> 8, this[t] = 255 & e) : objectWriteUInt32(this, e, t, !0), t + 4
  }, Buffer.prototype.writeUInt32BE = function(e, t, r) {
    return e = +e, t |= 0, r || checkInt(this, e, t, 4, 4294967295, 0), Buffer.TYPED_ARRAY_SUPPORT ? (this[t] = e >>> 24, this[t + 1] = e >>> 16, this[t + 2] = e >>> 8, this[t + 3] = 255 & e) : objectWriteUInt32(this, e, t, !1), t + 4
  }, Buffer.prototype.writeIntLE = function(e, t, r, n) {
    if (e = +e, t |= 0, !n) {
      var o = Math.pow(2, 8 * r - 1);
      checkInt(this, e, t, r, o - 1, -o)
    }
    var i = 0,
      s = 1,
      u = 0;
    for (this[t] = 255 & e; ++i < r && (s *= 256);) e < 0 && 0 === u && 0 !== this[t + i - 1] && (u = 1), this[t + i] = (e / s >> 0) - u & 255;
    return t + r
  }, Buffer.prototype.writeIntBE = function(e, t, r, n) {
    if (e = +e, t |= 0, !n) {
      var o = Math.pow(2, 8 * r - 1);
      checkInt(this, e, t, r, o - 1, -o)
    }
    var i = r - 1,
      s = 1,
      u = 0;
    for (this[t + i] = 255 & e; 0 <= --i && (s *= 256);) e < 0 && 0 === u && 0 !== this[t + i + 1] && (u = 1), this[t + i] = (e / s >> 0) - u & 255;
    return t + r
  }, Buffer.prototype.writeInt8 = function(e, t, r) {
    return e = +e, t |= 0, r || checkInt(this, e, t, 1, 127, -128), Buffer.TYPED_ARRAY_SUPPORT || (e = Math.floor(e)), e < 0 && (e = 255 + e + 1), this[t] = 255 & e, t + 1
  }, Buffer.prototype.writeInt16LE = function(e, t, r) {
    return e = +e, t |= 0, r || checkInt(this, e, t, 2, 32767, -32768), Buffer.TYPED_ARRAY_SUPPORT ? (this[t] = 255 & e, this[t + 1] = e >>> 8) : objectWriteUInt16(this, e, t, !0), t + 2
  }, Buffer.prototype.writeInt16BE = function(e, t, r) {
    return e = +e, t |= 0, r || checkInt(this, e, t, 2, 32767, -32768), Buffer.TYPED_ARRAY_SUPPORT ? (this[t] = e >>> 8, this[t + 1] = 255 & e) : objectWriteUInt16(this, e, t, !1), t + 2
  }, Buffer.prototype.writeInt32LE = function(e, t, r) {
    return e = +e, t |= 0, r || checkInt(this, e, t, 4, 2147483647, -2147483648), Buffer.TYPED_ARRAY_SUPPORT ? (this[t] = 255 & e, this[t + 1] = e >>> 8, this[t + 2] = e >>> 16, this[t + 3] = e >>> 24) : objectWriteUInt32(this, e, t, !0), t + 4
  }, Buffer.prototype.writeInt32BE = function(e, t, r) {
    return e = +e, t |= 0, r || checkInt(this, e, t, 4, 2147483647, -2147483648), e < 0 && (e = 4294967295 + e + 1), Buffer.TYPED_ARRAY_SUPPORT ? (this[t] = e >>> 24, this[t + 1] = e >>> 16, this[t + 2] = e >>> 8, this[t + 3] = 255 & e) : objectWriteUInt32(this, e, t, !1), t + 4
  }, Buffer.prototype.writeFloatLE = function(e, t, r) {
    return writeFloat(this, e, t, !0, r)
  }, Buffer.prototype.writeFloatBE = function(e, t, r) {
    return writeFloat(this, e, t, !1, r)
  }, Buffer.prototype.writeDoubleLE = function(e, t, r) {
    return writeDouble(this, e, t, !0, r)
  }, Buffer.prototype.writeDoubleBE = function(e, t, r) {
    return writeDouble(this, e, t, !1, r)
  }, Buffer.prototype.copy = function(e, t, r, n) {
    if (r || (r = 0), n || 0 === n || (n = this.length), t >= e.length && (t = e.length), t || (t = 0), 0 < n && n < r && (n = r), n === r) return 0;
    if (0 === e.length || 0 === this.length) return 0;
    if (t < 0) throw new RangeError("targetStart out of bounds");
    if (r < 0 || r >= this.length) throw new RangeError("sourceStart out of bounds");
    if (n < 0) throw new RangeError("sourceEnd out of bounds");
    n > this.length && (n = this.length), e.length - t < n - r && (n = e.length - t + r);
    var o, i = n - r;
    if (this === e && r < t && t < n)
      for (o = i - 1; 0 <= o; --o) e[o + t] = this[o + r];
    else if (i < 1e3 || !Buffer.TYPED_ARRAY_SUPPORT)
      for (o = 0; o < i; ++o) e[o + t] = this[o + r];
    else Uint8Array.prototype.set.call(e, this.subarray(r, r + i), t);
    return i
  }, Buffer.prototype.fill = function(e, t, r, n) {
    if ("string" == typeof e) {
      if ("string" == typeof t ? (n = t, t = 0, r = this.length) : "string" == typeof r && (n = r, r = this.length), 1 === e.length) {
        var o = e.charCodeAt(0);
        o < 256 && (e = o)
      }
      if (void 0 !== n && "string" != typeof n) throw new TypeError("encoding must be a string");
      if ("string" == typeof n && !Buffer.isEncoding(n)) throw new TypeError("Unknown encoding: " + n)
    } else "number" == typeof e && (e &= 255);
    if (t < 0 || this.length < t || this.length < r) throw new RangeError("Out of range index");
    if (r <= t) return this;
    var i;
    if (t >>>= 0, r = void 0 === r ? this.length : r >>> 0, e || (e = 0), "number" == typeof e)
      for (i = t; i < r; ++i) this[i] = e;
    else {
      var s = internalIsBuffer(e) ? e : utf8ToBytes(new Buffer(e, n).toString()),
        u = s.length;
      for (i = 0; i < r - t; ++i) this[i + t] = s[i % u]
    }
    return this
  };
  var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g;

  function base64clean(e) {
    if ((e = stringtrim(e).replace(INVALID_BASE64_RE, "")).length < 2) return "";
    for (; e.length % 4 != 0;) e += "=";
    return e
  }

  function stringtrim(e) {
    return e.trim ? e.trim() : e.replace(/^\s+|\s+$/g, "")
  }

  function toHex(e) {
    return e < 16 ? "0" + e.toString(16) : e.toString(16)
  }

  function utf8ToBytes(e, t) {
    var r;
    t = t || 1 / 0;
    for (var n = e.length, o = null, i = [], s = 0; s < n; ++s) {
      if (55295 < (r = e.charCodeAt(s)) && r < 57344) {
        if (!o) {
          if (56319 < r) {
            -1 < (t -= 3) && i.push(239, 191, 189);
            continue
          }
          if (s + 1 === n) {
            -1 < (t -= 3) && i.push(239, 191, 189);
            continue
          }
          o = r;
          continue
        }
        if (r < 56320) {
          -1 < (t -= 3) && i.push(239, 191, 189), o = r;
          continue
        }
        r = 65536 + (o - 55296 << 10 | r - 56320)
      } else o && -1 < (t -= 3) && i.push(239, 191, 189);
      if (o = null, r < 128) {
        if ((t -= 1) < 0) break;
        i.push(r)
      } else if (r < 2048) {
        if ((t -= 2) < 0) break;
        i.push(r >> 6 | 192, 63 & r | 128)
      } else if (r < 65536) {
        if ((t -= 3) < 0) break;
        i.push(r >> 12 | 224, r >> 6 & 63 | 128, 63 & r | 128)
      } else {
        if (!(r < 1114112)) throw new Error("Invalid code point");
        if ((t -= 4) < 0) break;
        i.push(r >> 18 | 240, r >> 12 & 63 | 128, r >> 6 & 63 | 128, 63 & r | 128)
      }
    }
    return i
  }

  function asciiToBytes(e) {
    for (var t = [], r = 0; r < e.length; ++r) t.push(255 & e.charCodeAt(r));
    return t
  }

  function utf16leToBytes(e, t) {
    for (var r, n, o, i = [], s = 0; s < e.length && !((t -= 2) < 0); ++s) n = (r = e.charCodeAt(s)) >> 8, o = r % 256, i.push(o), i.push(n);
    return i
  }

  function base64ToBytes(e) {
    return toByteArray(base64clean(e))
  }

  function blitBuffer(e, t, r, n) {
    for (var o = 0; o < n && !(o + r >= t.length || o >= e.length); ++o) t[o + r] = e[o];
    return o
  }

  function isnan(e) {
    return e != e
  }

  function isBuffer(e) {
    return null != e && (!!e._isBuffer || isFastBuffer(e) || isSlowBuffer(e))
  }

  function isFastBuffer(e) {
    return !!e.constructor && "function" == typeof e.constructor.isBuffer && e.constructor.isBuffer(e)
  }

  function isSlowBuffer(e) {
    return "function" == typeof e.readFloatLE && "function" == typeof e.slice && isFastBuffer(e.slice(0, 0))
  }
  var long_1 = Long,
    wasm = null;
  try {
    wasm = new WebAssembly.Instance(new WebAssembly.Module(new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 13, 2, 96, 0, 1, 127, 96, 4, 127, 127, 127, 127, 1, 127, 3, 7, 6, 0, 1, 1, 1, 1, 1, 6, 6, 1, 127, 1, 65, 0, 11, 7, 50, 6, 3, 109, 117, 108, 0, 1, 5, 100, 105, 118, 95, 115, 0, 2, 5, 100, 105, 118, 95, 117, 0, 3, 5, 114, 101, 109, 95, 115, 0, 4, 5, 114, 101, 109, 95, 117, 0, 5, 8, 103, 101, 116, 95, 104, 105, 103, 104, 0, 0, 10, 191, 1, 6, 4, 0, 35, 0, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 126, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 127, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 128, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 129, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 130, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11])), {}).exports
  } catch (e) {}

  function Long(e, t, r) {
    this.low = 0 | e, this.high = 0 | t, this.unsigned = !!r
  }

  function isLong(e) {
    return !0 === (e && e.__isLong__)
  }
  Object.defineProperty(Long.prototype, "__isLong__", {
    value: !0
  }), Long.isLong = isLong;
  var INT_CACHE = {},
    UINT_CACHE = {};

  function fromInt(e, t) {
    var r, n, o;
    return t ? (o = 0 <= (e >>>= 0) && e < 256) && (n = UINT_CACHE[e]) ? n : (r = fromBits(e, (0 | e) < 0 ? -1 : 0, !0), o && (UINT_CACHE[e] = r), r) : (o = -128 <= (e |= 0) && e < 128) && (n = INT_CACHE[e]) ? n : (r = fromBits(e, e < 0 ? -1 : 0, !1), o && (INT_CACHE[e] = r), r)
  }

  function fromNumber(e, t) {
    if (isNaN(e)) return t ? UZERO : ZERO;
    if (t) {
      if (e < 0) return UZERO;
      if (TWO_PWR_64_DBL <= e) return MAX_UNSIGNED_VALUE
    } else {
      if (e <= -TWO_PWR_63_DBL) return MIN_VALUE;
      if (TWO_PWR_63_DBL <= e + 1) return MAX_VALUE
    }
    return e < 0 ? fromNumber(-e, t).neg() : fromBits(e % TWO_PWR_32_DBL | 0, e / TWO_PWR_32_DBL | 0, t)
  }

  function fromBits(e, t, r) {
    return new Long(e, t, r)
  }
  Long.fromInt = fromInt, Long.fromNumber = fromNumber, Long.fromBits = fromBits;
  var pow_dbl = Math.pow;

  function fromString$1(e, t, r) {
    if (0 === e.length) throw Error("empty string");
    if ("NaN" === e || "Infinity" === e || "+Infinity" === e || "-Infinity" === e) return ZERO;
    if ("number" == typeof t ? (r = t, t = !1) : t = !!t, (r = r || 10) < 2 || 36 < r) throw RangeError("radix");
    var n;
    if (0 < (n = e.indexOf("-"))) throw Error("interior hyphen");
    if (0 === n) return fromString$1(e.substring(1), t, r).neg();
    for (var o = fromNumber(pow_dbl(r, 8)), i = ZERO, s = 0; s < e.length; s += 8) {
      var u = Math.min(8, e.length - s),
        a = parseInt(e.substring(s, s + u), r);
      if (u < 8) {
        var f = fromNumber(pow_dbl(r, u));
        i = i.mul(f).add(fromNumber(a))
      } else i = (i = i.mul(o)).add(fromNumber(a))
    }
    return i.unsigned = t, i
  }

  function fromValue(e, t) {
    return "number" == typeof e ? fromNumber(e, t) : "string" == typeof e ? fromString$1(e, t) : fromBits(e.low, e.high, "boolean" == typeof t ? t : e.unsigned)
  }
  Long.fromString = fromString$1, Long.fromValue = fromValue;
  var TWO_PWR_16_DBL = 65536,
    TWO_PWR_24_DBL = 1 << 24,
    TWO_PWR_32_DBL = TWO_PWR_16_DBL * TWO_PWR_16_DBL,
    TWO_PWR_64_DBL = TWO_PWR_32_DBL * TWO_PWR_32_DBL,
    TWO_PWR_63_DBL = TWO_PWR_64_DBL / 2,
    TWO_PWR_24 = fromInt(TWO_PWR_24_DBL),
    ZERO = fromInt(0);
  Long.ZERO = ZERO;
  var UZERO = fromInt(0, !0);
  Long.UZERO = UZERO;
  var ONE = fromInt(1);
  Long.ONE = ONE;
  var UONE = fromInt(1, !0);
  Long.UONE = UONE;
  var NEG_ONE = fromInt(-1);
  Long.NEG_ONE = NEG_ONE;
  var MAX_VALUE = fromBits(-1, 2147483647, !1);
  Long.MAX_VALUE = MAX_VALUE;
  var MAX_UNSIGNED_VALUE = fromBits(-1, -1, !0);
  Long.MAX_UNSIGNED_VALUE = MAX_UNSIGNED_VALUE;
  var MIN_VALUE = fromBits(0, -2147483648, !1);
  Long.MIN_VALUE = MIN_VALUE;
  var LongPrototype = Long.prototype;
  LongPrototype.toInt = function() {
    return this.unsigned ? this.low >>> 0 : this.low
  }, LongPrototype.toNumber = function() {
    return this.unsigned ? (this.high >>> 0) * TWO_PWR_32_DBL + (this.low >>> 0) : this.high * TWO_PWR_32_DBL + (this.low >>> 0)
  }, LongPrototype.toString = function(e) {
    if ((e = e || 10) < 2 || 36 < e) throw RangeError("radix");
    if (this.isZero()) return "0";
    if (this.isNegative()) {
      if (this.eq(MIN_VALUE)) {
        var t = fromNumber(e),
          r = this.div(t),
          n = r.mul(t).sub(this);
        return r.toString(e) + n.toInt().toString(e)
      }
      return "-" + this.neg().toString(e)
    }
    for (var o = fromNumber(pow_dbl(e, 6), this.unsigned), i = this, s = "";;) {
      var u = i.div(o),
        a = (i.sub(u.mul(o)).toInt() >>> 0).toString(e);
      if ((i = u).isZero()) return a + s;
      for (; a.length < 6;) a = "0" + a;
      s = "" + a + s
    }
  }, LongPrototype.getHighBits = function() {
    return this.high
  }, LongPrototype.getHighBitsUnsigned = function() {
    return this.high >>> 0
  }, LongPrototype.getLowBits = function() {
    return this.low
  }, LongPrototype.getLowBitsUnsigned = function() {
    return this.low >>> 0
  }, LongPrototype.getNumBitsAbs = function() {
    if (this.isNegative()) return this.eq(MIN_VALUE) ? 64 : this.neg().getNumBitsAbs();
    for (var e = 0 != this.high ? this.high : this.low, t = 31; 0 < t && 0 == (e & 1 << t); t--);
    return 0 != this.high ? t + 33 : t + 1
  }, LongPrototype.isZero = function() {
    return 0 === this.high && 0 === this.low
  }, LongPrototype.eqz = LongPrototype.isZero, LongPrototype.isNegative = function() {
    return !this.unsigned && this.high < 0
  }, LongPrototype.isPositive = function() {
    return this.unsigned || 0 <= this.high
  }, LongPrototype.isOdd = function() {
    return 1 == (1 & this.low)
  }, LongPrototype.isEven = function() {
    return 0 == (1 & this.low)
  }, LongPrototype.equals = function(e) {
    return isLong(e) || (e = fromValue(e)), (this.unsigned === e.unsigned || this.high >>> 31 != 1 || e.high >>> 31 != 1) && (this.high === e.high && this.low === e.low)
  }, LongPrototype.eq = LongPrototype.equals, LongPrototype.notEquals = function(e) {
    return !this.eq(e)
  }, LongPrototype.neq = LongPrototype.notEquals, LongPrototype.ne = LongPrototype.notEquals, LongPrototype.lessThan = function(e) {
    return this.comp(e) < 0
  }, LongPrototype.lt = LongPrototype.lessThan, LongPrototype.lessThanOrEqual = function(e) {
    return this.comp(e) <= 0
  }, LongPrototype.lte = LongPrototype.lessThanOrEqual, LongPrototype.le = LongPrototype.lessThanOrEqual, LongPrototype.greaterThan = function(e) {
    return 0 < this.comp(e)
  }, LongPrototype.gt = LongPrototype.greaterThan, LongPrototype.greaterThanOrEqual = function(e) {
    return 0 <= this.comp(e)
  }, LongPrototype.gte = LongPrototype.greaterThanOrEqual, LongPrototype.ge = LongPrototype.greaterThanOrEqual, LongPrototype.compare = function(e) {
    if (isLong(e) || (e = fromValue(e)), this.eq(e)) return 0;
    var t = this.isNegative(),
      r = e.isNegative();
    return t && !r ? -1 : !t && r ? 1 : this.unsigned ? e.high >>> 0 > this.high >>> 0 || e.high === this.high && e.low >>> 0 > this.low >>> 0 ? -1 : 1 : this.sub(e).isNegative() ? -1 : 1
  }, LongPrototype.comp = LongPrototype.compare, LongPrototype.negate = function() {
    return !this.unsigned && this.eq(MIN_VALUE) ? MIN_VALUE : this.not().add(ONE)
  }, LongPrototype.neg = LongPrototype.negate, LongPrototype.add = function(e) {
    isLong(e) || (e = fromValue(e));
    var t = this.high >>> 16,
      r = 65535 & this.high,
      n = this.low >>> 16,
      o = 65535 & this.low,
      i = e.high >>> 16,
      s = 65535 & e.high,
      u = e.low >>> 16,
      a = 0,
      f = 0,
      c = 0,
      h = 0;
    return c += (h += o + (65535 & e.low)) >>> 16, f += (c += n + u) >>> 16, a += (f += r + s) >>> 16, a += t + i, fromBits((c &= 65535) << 16 | (h &= 65535), (a &= 65535) << 16 | (f &= 65535), this.unsigned)
  }, LongPrototype.subtract = function(e) {
    return isLong(e) || (e = fromValue(e)), this.add(e.neg())
  }, LongPrototype.sub = LongPrototype.subtract, LongPrototype.multiply = function(e) {
    if (this.isZero()) return ZERO;
    if (isLong(e) || (e = fromValue(e)), wasm) return fromBits(wasm.mul(this.low, this.high, e.low, e.high), wasm.get_high(), this.unsigned);
    if (e.isZero()) return ZERO;
    if (this.eq(MIN_VALUE)) return e.isOdd() ? MIN_VALUE : ZERO;
    if (e.eq(MIN_VALUE)) return this.isOdd() ? MIN_VALUE : ZERO;
    if (this.isNegative()) return e.isNegative() ? this.neg().mul(e.neg()) : this.neg().mul(e).neg();
    if (e.isNegative()) return this.mul(e.neg()).neg();
    if (this.lt(TWO_PWR_24) && e.lt(TWO_PWR_24)) return fromNumber(this.toNumber() * e.toNumber(), this.unsigned);
    var t = this.high >>> 16,
      r = 65535 & this.high,
      n = this.low >>> 16,
      o = 65535 & this.low,
      i = e.high >>> 16,
      s = 65535 & e.high,
      u = e.low >>> 16,
      a = 65535 & e.low,
      f = 0,
      c = 0,
      h = 0,
      l = 0;
    return h += (l += o * a) >>> 16, c += (h += n * a) >>> 16, h &= 65535, c += (h += o * u) >>> 16, f += (c += r * a) >>> 16, c &= 65535, f += (c += n * u) >>> 16, c &= 65535, f += (c += o * s) >>> 16, f += t * a + r * u + n * s + o * i, fromBits((h &= 65535) << 16 | (l &= 65535), (f &= 65535) << 16 | (c &= 65535), this.unsigned)
  }, LongPrototype.mul = LongPrototype.multiply, LongPrototype.divide = function(e) {
    if (isLong(e) || (e = fromValue(e)), e.isZero()) throw Error("division by zero");
    var t, r, n;
    if (wasm) return this.unsigned || -2147483648 !== this.high || -1 !== e.low || -1 !== e.high ? fromBits((this.unsigned ? wasm.div_u : wasm.div_s)(this.low, this.high, e.low, e.high), wasm.get_high(), this.unsigned) : this;
    if (this.isZero()) return this.unsigned ? UZERO : ZERO;
    if (this.unsigned) {
      if (e.unsigned || (e = e.toUnsigned()), e.gt(this)) return UZERO;
      if (e.gt(this.shru(1))) return UONE;
      n = UZERO
    } else {
      if (this.eq(MIN_VALUE)) return e.eq(ONE) || e.eq(NEG_ONE) ? MIN_VALUE : e.eq(MIN_VALUE) ? ONE : (t = this.shr(1).div(e).shl(1)).eq(ZERO) ? e.isNegative() ? ONE : NEG_ONE : (r = this.sub(e.mul(t)), n = t.add(r.div(e)));
      else if (e.eq(MIN_VALUE)) return this.unsigned ? UZERO : ZERO;
      if (this.isNegative()) return e.isNegative() ? this.neg().div(e.neg()) : this.neg().div(e).neg();
      if (e.isNegative()) return this.div(e.neg()).neg();
      n = ZERO
    }
    for (r = this; r.gte(e);) {
      t = Math.max(1, Math.floor(r.toNumber() / e.toNumber()));
      for (var o = Math.ceil(Math.log(t) / Math.LN2), i = o <= 48 ? 1 : pow_dbl(2, o - 48), s = fromNumber(t), u = s.mul(e); u.isNegative() || u.gt(r);) u = (s = fromNumber(t -= i, this.unsigned)).mul(e);
      s.isZero() && (s = ONE), n = n.add(s), r = r.sub(u)
    }
    return n
  }, LongPrototype.div = LongPrototype.divide, LongPrototype.modulo = function(e) {
    return isLong(e) || (e = fromValue(e)), wasm ? fromBits((this.unsigned ? wasm.rem_u : wasm.rem_s)(this.low, this.high, e.low, e.high), wasm.get_high(), this.unsigned) : this.sub(this.div(e).mul(e))
  }, LongPrototype.mod = LongPrototype.modulo, LongPrototype.rem = LongPrototype.modulo, LongPrototype.not = function() {
    return fromBits(~this.low, ~this.high, this.unsigned)
  }, LongPrototype.and = function(e) {
    return isLong(e) || (e = fromValue(e)), fromBits(this.low & e.low, this.high & e.high, this.unsigned)
  }, LongPrototype.or = function(e) {
    return isLong(e) || (e = fromValue(e)), fromBits(this.low | e.low, this.high | e.high, this.unsigned)
  }, LongPrototype.xor = function(e) {
    return isLong(e) || (e = fromValue(e)), fromBits(this.low ^ e.low, this.high ^ e.high, this.unsigned)
  }, LongPrototype.shiftLeft = function(e) {
    return isLong(e) && (e = e.toInt()), 0 == (e &= 63) ? this : e < 32 ? fromBits(this.low << e, this.high << e | this.low >>> 32 - e, this.unsigned) : fromBits(0, this.low << e - 32, this.unsigned)
  }, LongPrototype.shl = LongPrototype.shiftLeft, LongPrototype.shiftRight = function(e) {
    return isLong(e) && (e = e.toInt()), 0 == (e &= 63) ? this : e < 32 ? fromBits(this.low >>> e | this.high << 32 - e, this.high >> e, this.unsigned) : fromBits(this.high >> e - 32, 0 <= this.high ? 0 : -1, this.unsigned)
  }, LongPrototype.shr = LongPrototype.shiftRight, LongPrototype.shiftRightUnsigned = function(e) {
    if (isLong(e) && (e = e.toInt()), 0 === (e &= 63)) return this;
    var t = this.high;
    return e < 32 ? fromBits(this.low >>> e | t << 32 - e, t >>> e, this.unsigned) : fromBits(32 === e ? t : t >>> e - 32, 0, this.unsigned)
  }, LongPrototype.shru = LongPrototype.shiftRightUnsigned, LongPrototype.shr_u = LongPrototype.shiftRightUnsigned, LongPrototype.toSigned = function() {
    return this.unsigned ? fromBits(this.low, this.high, !1) : this
  }, LongPrototype.toUnsigned = function() {
    return this.unsigned ? this : fromBits(this.low, this.high, !0)
  }, LongPrototype.toBytes = function(e) {
    return e ? this.toBytesLE() : this.toBytesBE()
  }, LongPrototype.toBytesLE = function() {
    var e = this.high,
      t = this.low;
    return [255 & t, t >>> 8 & 255, t >>> 16 & 255, t >>> 24, 255 & e, e >>> 8 & 255, e >>> 16 & 255, e >>> 24]
  }, LongPrototype.toBytesBE = function() {
    var e = this.high,
      t = this.low;
    return [e >>> 24, e >>> 16 & 255, e >>> 8 & 255, 255 & e, t >>> 24, t >>> 16 & 255, t >>> 8 & 255, 255 & t]
  }, Long.fromBytes = function(e, t, r) {
    return r ? Long.fromBytesLE(e, t) : Long.fromBytesBE(e, t)
  }, Long.fromBytesLE = function(e, t) {
    return new Long(e[0] | e[1] << 8 | e[2] << 16 | e[3] << 24, e[4] | e[5] << 8 | e[6] << 16 | e[7] << 24, t)
  }, Long.fromBytesBE = function(e, t) {
    return new Long(e[4] << 24 | e[5] << 16 | e[6] << 8 | e[7], e[0] << 24 | e[1] << 16 | e[2] << 8 | e[3], t)
  };
  var commonjsGlobal = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {};

  function createCommonjsModule(e, t) {
    return e(t = {
      exports: {}
    }, t.exports), t.exports
  }
  for (var byteLength_1 = byteLength$1, toByteArray_1 = toByteArray$1, fromByteArray_1 = fromByteArray$1, lookup$1 = [], revLookup$1 = [], Arr$1 = "undefined" != typeof Uint8Array ? Uint8Array : Array, code = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", i = 0, len = code.length; i < len; ++i) lookup$1[i] = code[i], revLookup$1[code.charCodeAt(i)] = i;

  function getLens(e) {
    var t = e.length;
    if (0 < t % 4) throw new Error("Invalid string. Length must be a multiple of 4");
    var r = e.indexOf("=");
    return -1 === r && (r = t), [r, r === t ? 0 : 4 - r % 4]
  }

  function byteLength$1(e) {
    var t = getLens(e),
      r = t[0],
      n = t[1];
    return 3 * (r + n) / 4 - n
  }

  function _byteLength(e, t, r) {
    return 3 * (t + r) / 4 - r
  }

  function toByteArray$1(e) {
    for (var t, r = getLens(e), n = r[0], o = r[1], i = new Arr$1(_byteLength(e, n, o)), s = 0, u = 0 < o ? n - 4 : n, a = 0; a < u; a += 4) t = revLookup$1[e.charCodeAt(a)] << 18 | revLookup$1[e.charCodeAt(a + 1)] << 12 | revLookup$1[e.charCodeAt(a + 2)] << 6 | revLookup$1[e.charCodeAt(a + 3)], i[s++] = t >> 16 & 255, i[s++] = t >> 8 & 255, i[s++] = 255 & t;
    return 2 === o && (t = revLookup$1[e.charCodeAt(a)] << 2 | revLookup$1[e.charCodeAt(a + 1)] >> 4, i[s++] = 255 & t), 1 === o && (t = revLookup$1[e.charCodeAt(a)] << 10 | revLookup$1[e.charCodeAt(a + 1)] << 4 | revLookup$1[e.charCodeAt(a + 2)] >> 2, i[s++] = t >> 8 & 255, i[s++] = 255 & t), i
  }

  function tripletToBase64$1(e) {
    return lookup$1[e >> 18 & 63] + lookup$1[e >> 12 & 63] + lookup$1[e >> 6 & 63] + lookup$1[63 & e]
  }

  function encodeChunk$1(e, t, r) {
    for (var n, o = [], i = t; i < r; i += 3) n = (e[i] << 16 & 16711680) + (e[i + 1] << 8 & 65280) + (255 & e[i + 2]), o.push(tripletToBase64$1(n));
    return o.join("")
  }

  function fromByteArray$1(e) {
    for (var t, r = e.length, n = r % 3, o = [], i = 0, s = r - n; i < s; i += 16383) o.push(encodeChunk$1(e, i, s < i + 16383 ? s : i + 16383));
    return 1 === n ? (t = e[r - 1], o.push(lookup$1[t >> 2] + lookup$1[t << 4 & 63] + "==")) : 2 === n && (t = (e[r - 2] << 8) + e[r - 1], o.push(lookup$1[t >> 10] + lookup$1[t >> 4 & 63] + lookup$1[t << 2 & 63] + "=")), o.join("")
  }
  revLookup$1["-".charCodeAt(0)] = 62, revLookup$1["_".charCodeAt(0)] = 63;
  var base64Js = {
      byteLength: byteLength_1,
      toByteArray: toByteArray_1,
      fromByteArray: fromByteArray_1
    },
    read$1 = function(e, t, r, n, o) {
      var i, s, u = 8 * o - n - 1,
        a = (1 << u) - 1,
        f = a >> 1,
        c = -7,
        h = r ? o - 1 : 0,
        l = r ? -1 : 1,
        d = e[t + h];
      for (h += l, i = d & (1 << -c) - 1, d >>= -c, c += u; 0 < c; i = 256 * i + e[t + h], h += l, c -= 8);
      for (s = i & (1 << -c) - 1, i >>= -c, c += n; 0 < c; s = 256 * s + e[t + h], h += l, c -= 8);
      if (0 === i) i = 1 - f;
      else {
        if (i === a) return s ? NaN : 1 / 0 * (d ? -1 : 1);
        s += Math.pow(2, n), i -= f
      }
      return (d ? -1 : 1) * s * Math.pow(2, i - n)
    },
    write$1 = function(e, t, r, n, o, i) {
      var s, u, a, f = 8 * i - o - 1,
        c = (1 << f) - 1,
        h = c >> 1,
        l = 23 === o ? Math.pow(2, -24) - Math.pow(2, -77) : 0,
        d = n ? 0 : i - 1,
        p = n ? 1 : -1,
        y = t < 0 || 0 === t && 1 / t < 0 ? 1 : 0;
      for (t = Math.abs(t), isNaN(t) || t === 1 / 0 ? (u = isNaN(t) ? 1 : 0, s = c) : (s = Math.floor(Math.log(t) / Math.LN2), t * (a = Math.pow(2, -s)) < 1 && (s--, a *= 2), 2 <= (t += 1 <= s + h ? l / a : l * Math.pow(2, 1 - h)) * a && (s++, a /= 2), c <= s + h ? (u = 0, s = c) : 1 <= s + h ? (u = (t * a - 1) * Math.pow(2, o), s += h) : (u = t * Math.pow(2, h - 1) * Math.pow(2, o), s = 0)); 8 <= o; e[r + d] = 255 & u, d += p, u /= 256, o -= 8);
      for (s = s << o | u, f += o; 0 < f; e[r + d] = 255 & s, d += p, s /= 256, f -= 8);
      e[r + d - p] |= 128 * y
    },
    ieee754 = {
      read: read$1,
      write: write$1
    },
    buffer = createCommonjsModule(function(e, r) {
      r.Buffer = h, r.SlowBuffer = function(e) {
        +e != e && (e = 0);
        return h.alloc(+e)
      }, r.INSPECT_MAX_BYTES = 50;
      var n = 2147483647;

      function s(e) {
        if (n < e) throw new RangeError('The value "' + e + '" is invalid for option "size"');
        var t = new Uint8Array(e);
        return t.__proto__ = h.prototype, t
      }

      function h(e, t, r) {
        if ("number" == typeof e) {
          if ("string" == typeof t) throw new TypeError('The "string" argument must be of type string. Received type number');
          return i(e)
        }
        return o(e, t, r)
      }

      function o(e, t, r) {
        if ("string" == typeof e) return function(e, t) {
          "string" == typeof t && "" !== t || (t = "utf8");
          if (!h.isEncoding(t)) throw new TypeError("Unknown encoding: " + t);
          var r = 0 | c(e, t),
            n = s(r),
            o = n.write(e, t);
          o !== r && (n = n.slice(0, o));
          return n
        }(e, t);
        if (ArrayBuffer.isView(e)) return a(e);
        if (null == e) throw TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof e);
        if (D(e, ArrayBuffer) || e && D(e.buffer, ArrayBuffer)) return function(e, t, r) {
          if (t < 0 || e.byteLength < t) throw new RangeError('"offset" is outside of buffer bounds');
          if (e.byteLength < t + (r || 0)) throw new RangeError('"length" is outside of buffer bounds');
          var n;
          n = void 0 === t && void 0 === r ? new Uint8Array(e) : void 0 === r ? new Uint8Array(e, t) : new Uint8Array(e, t, r);
          return n.__proto__ = h.prototype, n
        }(e, t, r);
        if ("number" == typeof e) throw new TypeError('The "value" argument must not be of type number. Received type number');
        var n = e.valueOf && e.valueOf();
        if (null != n && n !== e) return h.from(n, t, r);
        var o = function(e) {
          if (h.isBuffer(e)) {
            var t = 0 | f(e.length),
              r = s(t);
            return 0 === r.length || e.copy(r, 0, 0, t), r
          }
          if (void 0 !== e.length) return "number" != typeof e.length || U(e.length) ? s(0) : a(e);
          if ("Buffer" === e.type && Array.isArray(e.data)) return a(e.data)
        }(e);
        if (o) return o;
        if ("undefined" != typeof Symbol && null != Symbol.toPrimitive && "function" == typeof e[Symbol.toPrimitive]) return h.from(e[Symbol.toPrimitive]("string"), t, r);
        throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof e)
      }

      function u(e) {
        if ("number" != typeof e) throw new TypeError('"size" argument must be of type number');
        if (e < 0) throw new RangeError('The value "' + e + '" is invalid for option "size"')
      }

      function i(e) {
        return u(e), s(e < 0 ? 0 : 0 | f(e))
      }

      function a(e) {
        for (var t = e.length < 0 ? 0 : 0 | f(e.length), r = s(t), n = 0; n < t; n += 1) r[n] = 255 & e[n];
        return r
      }

      function f(e) {
        if (n <= e) throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + n.toString(16) + " bytes");
        return 0 | e
      }

      function c(e, t) {
        if (h.isBuffer(e)) return e.length;
        if (ArrayBuffer.isView(e) || D(e, ArrayBuffer)) return e.byteLength;
        if ("string" != typeof e) throw new TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof e);
        var r = e.length,
          n = 2 < arguments.length && !0 === arguments[2];
        if (!n && 0 === r) return 0;
        for (var o = !1;;) switch (t) {
          case "ascii":
          case "latin1":
          case "binary":
            return r;
          case "utf8":
          case "utf-8":
            return I(e).length;
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return 2 * r;
          case "hex":
            return r >>> 1;
          case "base64":
            return P(e).length;
          default:
            if (o) return n ? -1 : I(e).length;
            t = ("" + t).toLowerCase(), o = !0
        }
      }

      function l(e, t, r) {
        var n = e[t];
        e[t] = e[r], e[r] = n
      }

      function d(e, t, r, n, o) {
        if (0 === e.length) return -1;
        if ("string" == typeof r ? (n = r, r = 0) : 2147483647 < r ? r = 2147483647 : r < -2147483648 && (r = -2147483648), U(r = +r) && (r = o ? 0 : e.length - 1), r < 0 && (r = e.length + r), r >= e.length) {
          if (o) return -1;
          r = e.length - 1
        } else if (r < 0) {
          if (!o) return -1;
          r = 0
        }
        if ("string" == typeof t && (t = h.from(t, n)), h.isBuffer(t)) return 0 === t.length ? -1 : p(e, t, r, n, o);
        if ("number" == typeof t) return t &= 255, "function" == typeof Uint8Array.prototype.indexOf ? o ? Uint8Array.prototype.indexOf.call(e, t, r) : Uint8Array.prototype.lastIndexOf.call(e, t, r) : p(e, [t], r, n, o);
        throw new TypeError("val must be string, number or Buffer")
      }

      function p(e, t, r, n, o) {
        var i, s = 1,
          u = e.length,
          a = t.length;
        if (void 0 !== n && ("ucs2" === (n = String(n).toLowerCase()) || "ucs-2" === n || "utf16le" === n || "utf-16le" === n)) {
          if (e.length < 2 || t.length < 2) return -1;
          u /= s = 2, a /= 2, r /= 2
        }

        function f(e, t) {
          return 1 === s ? e[t] : e.readUInt16BE(t * s)
        }
        if (o) {
          var c = -1;
          for (i = r; i < u; i++)
            if (f(e, i) === f(t, -1 === c ? 0 : i - c)) {
              if (-1 === c && (c = i), i - c + 1 === a) return c * s
            } else -1 !== c && (i -= i - c), c = -1
        } else
          for (u < r + a && (r = u - a), i = r; 0 <= i; i--) {
            for (var h = !0, l = 0; l < a; l++)
              if (f(e, i + l) !== f(t, l)) {
                h = !1;
                break
              } if (h) return i
          }
        return -1
      }

      function y(e, t, r, n) {
        r = Number(r) || 0;
        var o = e.length - r;
        n ? o < (n = Number(n)) && (n = o) : n = o;
        var i = t.length;
        i / 2 < n && (n = i / 2);
        for (var s = 0; s < n; ++s) {
          var u = parseInt(t.substr(2 * s, 2), 16);
          if (U(u)) return s;
          e[r + s] = u
        }
        return s
      }

      function g(e, t, r, n) {
        return C(function(e) {
          for (var t = [], r = 0; r < e.length; ++r) t.push(255 & e.charCodeAt(r));
          return t
        }(t), e, r, n)
      }

      function _(e, t, r) {
        return 0 === t && r === e.length ? base64Js.fromByteArray(e) : base64Js.fromByteArray(e.slice(t, r))
      }

      function v(e, t, r) {
        r = Math.min(e.length, r);
        for (var n = [], o = t; o < r;) {
          var i, s, u, a, f = e[o],
            c = null,
            h = 239 < f ? 4 : 223 < f ? 3 : 191 < f ? 2 : 1;
          if (o + h <= r) switch (h) {
            case 1:
              f < 128 && (c = f);
              break;
            case 2:
              128 == (192 & (i = e[o + 1])) && 127 < (a = (31 & f) << 6 | 63 & i) && (c = a);
              break;
            case 3:
              i = e[o + 1], s = e[o + 2], 128 == (192 & i) && 128 == (192 & s) && 2047 < (a = (15 & f) << 12 | (63 & i) << 6 | 63 & s) && (a < 55296 || 57343 < a) && (c = a);
              break;
            case 4:
              i = e[o + 1], s = e[o + 2], u = e[o + 3], 128 == (192 & i) && 128 == (192 & s) && 128 == (192 & u) && 65535 < (a = (15 & f) << 18 | (63 & i) << 12 | (63 & s) << 6 | 63 & u) && a < 1114112 && (c = a)
          }
          null === c ? (c = 65533, h = 1) : 65535 < c && (c -= 65536, n.push(c >>> 10 & 1023 | 55296), c = 56320 | 1023 & c), n.push(c), o += h
        }
        return function(e) {
          var t = e.length;
          if (t <= E) return String.fromCharCode.apply(String, e);
          var r = "",
            n = 0;
          for (; n < t;) r += String.fromCharCode.apply(String, e.slice(n, n += E));
          return r
        }(n)
      }
      r.kMaxLength = n, (h.TYPED_ARRAY_SUPPORT = function() {
        try {
          var e = new Uint8Array(1);
          return e.__proto__ = {
            __proto__: Uint8Array.prototype,
            foo: function() {
              return 42
            }
          }, 42 === e.foo()
        } catch (e) {
          return !1
        }
      }()) || "undefined" == typeof console || "function" != typeof console.error || console.error("This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."), Object.defineProperty(h.prototype, "parent", {
        enumerable: !0,
        get: function() {
          if (h.isBuffer(this)) return this.buffer
        }
      }), Object.defineProperty(h.prototype, "offset", {
        enumerable: !0,
        get: function() {
          if (h.isBuffer(this)) return this.byteOffset
        }
      }), "undefined" != typeof Symbol && null != Symbol.species && h[Symbol.species] === h && Object.defineProperty(h, Symbol.species, {
        value: null,
        configurable: !0,
        enumerable: !1,
        writable: !1
      }), h.poolSize = 8192, h.from = function(e, t, r) {
        return o(e, t, r)
      }, h.prototype.__proto__ = Uint8Array.prototype, h.__proto__ = Uint8Array, h.alloc = function(e, t, r) {
        return o = t, i = r, u(n = e), n <= 0 ? s(n) : void 0 !== o ? "string" == typeof i ? s(n).fill(o, i) : s(n).fill(o) : s(n);
        var n, o, i
      }, h.allocUnsafe = function(e) {
        return i(e)
      }, h.allocUnsafeSlow = function(e) {
        return i(e)
      }, h.isBuffer = function(e) {
        return null != e && !0 === e._isBuffer && e !== h.prototype
      }, h.compare = function(e, t) {
        if (D(e, Uint8Array) && (e = h.from(e, e.offset, e.byteLength)), D(t, Uint8Array) && (t = h.from(t, t.offset, t.byteLength)), !h.isBuffer(e) || !h.isBuffer(t)) throw new TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');
        if (e === t) return 0;
        for (var r = e.length, n = t.length, o = 0, i = Math.min(r, n); o < i; ++o)
          if (e[o] !== t[o]) {
            r = e[o], n = t[o];
            break
          } return r < n ? -1 : n < r ? 1 : 0
      }, h.isEncoding = function(e) {
        switch (String(e).toLowerCase()) {
          case "hex":
          case "utf8":
          case "utf-8":
          case "ascii":
          case "latin1":
          case "binary":
          case "base64":
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return !0;
          default:
            return !1
        }
      }, h.concat = function(e, t) {
        if (!Array.isArray(e)) throw new TypeError('"list" argument must be an Array of Buffers');
        if (0 === e.length) return h.alloc(0);
        var r;
        if (void 0 === t)
          for (r = t = 0; r < e.length; ++r) t += e[r].length;
        var n = h.allocUnsafe(t),
          o = 0;
        for (r = 0; r < e.length; ++r) {
          var i = e[r];
          if (D(i, Uint8Array) && (i = h.from(i)), !h.isBuffer(i)) throw new TypeError('"list" argument must be an Array of Buffers');
          i.copy(n, o), o += i.length
        }
        return n
      }, h.byteLength = c, h.prototype._isBuffer = !0, h.prototype.swap16 = function() {
        var e = this.length;
        if (e % 2 != 0) throw new RangeError("Buffer size must be a multiple of 16-bits");
        for (var t = 0; t < e; t += 2) l(this, t, t + 1);
        return this
      }, h.prototype.swap32 = function() {
        var e = this.length;
        if (e % 4 != 0) throw new RangeError("Buffer size must be a multiple of 32-bits");
        for (var t = 0; t < e; t += 4) l(this, t, t + 3), l(this, t + 1, t + 2);
        return this
      }, h.prototype.swap64 = function() {
        var e = this.length;
        if (e % 8 != 0) throw new RangeError("Buffer size must be a multiple of 64-bits");
        for (var t = 0; t < e; t += 8) l(this, t, t + 7), l(this, t + 1, t + 6), l(this, t + 2, t + 5), l(this, t + 3, t + 4);
        return this
      }, h.prototype.toLocaleString = h.prototype.toString = function() {
        var e = this.length;
        return 0 === e ? "" : 0 === arguments.length ? v(this, 0, e) : function(e, t, r) {
          var n = !1;
          if ((void 0 === t || t < 0) && (t = 0), t > this.length) return "";
          if ((void 0 === r || r > this.length) && (r = this.length), r <= 0) return "";
          if ((r >>>= 0) <= (t >>>= 0)) return "";
          for (e || (e = "utf8");;) switch (e) {
            case "hex":
              return b(this, t, r);
            case "utf8":
            case "utf-8":
              return v(this, t, r);
            case "ascii":
              return m(this, t, r);
            case "latin1":
            case "binary":
              return A(this, t, r);
            case "base64":
              return _(this, t, r);
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
              return S(this, t, r);
            default:
              if (n) throw new TypeError("Unknown encoding: " + e);
              e = (e + "").toLowerCase(), n = !0
          }
        }.apply(this, arguments)
      }, h.prototype.equals = function(e) {
        if (!h.isBuffer(e)) throw new TypeError("Argument must be a Buffer");
        return this === e || 0 === h.compare(this, e)
      }, h.prototype.inspect = function() {
        var e = "",
          t = r.INSPECT_MAX_BYTES;
        return e = this.toString("hex", 0, t).replace(/(.{2})/g, "$1 ").trim(), this.length > t && (e += " ... "), "<Buffer " + e + ">"
      }, h.prototype.compare = function(e, t, r, n, o) {
        if (D(e, Uint8Array) && (e = h.from(e, e.offset, e.byteLength)), !h.isBuffer(e)) throw new TypeError('The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof e);
        if (void 0 === t && (t = 0), void 0 === r && (r = e ? e.length : 0), void 0 === n && (n = 0), void 0 === o && (o = this.length), t < 0 || r > e.length || n < 0 || o > this.length) throw new RangeError("out of range index");
        if (o <= n && r <= t) return 0;
        if (o <= n) return -1;
        if (r <= t) return 1;
        if (this === e) return 0;
        for (var i = (o >>>= 0) - (n >>>= 0), s = (r >>>= 0) - (t >>>= 0), u = Math.min(i, s), a = this.slice(n, o), f = e.slice(t, r), c = 0; c < u; ++c)
          if (a[c] !== f[c]) {
            i = a[c], s = f[c];
            break
          } return i < s ? -1 : s < i ? 1 : 0
      }, h.prototype.includes = function(e, t, r) {
        return -1 !== this.indexOf(e, t, r)
      }, h.prototype.indexOf = function(e, t, r) {
        return d(this, e, t, r, !0)
      }, h.prototype.lastIndexOf = function(e, t, r) {
        return d(this, e, t, r, !1)
      }, h.prototype.write = function(e, t, r, n) {
        if (void 0 === t) n = "utf8", r = this.length, t = 0;
        else if (void 0 === r && "string" == typeof t) n = t, r = this.length, t = 0;
        else {
          if (!isFinite(t)) throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
          t >>>= 0, isFinite(r) ? (r >>>= 0, void 0 === n && (n = "utf8")) : (n = r, r = void 0)
        }
        var o = this.length - t;
        if ((void 0 === r || o < r) && (r = o), 0 < e.length && (r < 0 || t < 0) || t > this.length) throw new RangeError("Attempt to write outside buffer bounds");
        n || (n = "utf8");
        for (var i, s, u, a, f, c, h, l, d, p = !1;;) switch (n) {
          case "hex":
            return y(this, e, t, r);
          case "utf8":
          case "utf-8":
            return l = t, d = r, C(I(e, (h = this).length - l), h, l, d);
          case "ascii":
            return g(this, e, t, r);
          case "latin1":
          case "binary":
            return g(this, e, t, r);
          case "base64":
            return a = this, f = t, c = r, C(P(e), a, f, c);
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return s = t, u = r, C(function(e, t) {
              for (var r, n, o, i = [], s = 0; s < e.length && !((t -= 2) < 0); ++s) r = e.charCodeAt(s), n = r >> 8, o = r % 256, i.push(o), i.push(n);
              return i
            }(e, (i = this).length - s), i, s, u);
          default:
            if (p) throw new TypeError("Unknown encoding: " + n);
            n = ("" + n).toLowerCase(), p = !0
        }
      }, h.prototype.toJSON = function() {
        return {
          type: "Buffer",
          data: Array.prototype.slice.call(this._arr || this, 0)
        }
      };
      var E = 4096;

      function m(e, t, r) {
        var n = "";
        r = Math.min(e.length, r);
        for (var o = t; o < r; ++o) n += String.fromCharCode(127 & e[o]);
        return n
      }

      function A(e, t, r) {
        var n = "";
        r = Math.min(e.length, r);
        for (var o = t; o < r; ++o) n += String.fromCharCode(e[o]);
        return n
      }

      function b(e, t, r) {
        var n = e.length;
        (!t || t < 0) && (t = 0), (!r || r < 0 || n < r) && (r = n);
        for (var o = "", i = t; i < r; ++i) o += B(e[i]);
        return o
      }

      function S(e, t, r) {
        for (var n = e.slice(t, r), o = "", i = 0; i < n.length; i += 2) o += String.fromCharCode(n[i] + 256 * n[i + 1]);
        return o
      }

      function w(e, t, r) {
        if (e % 1 != 0 || e < 0) throw new RangeError("offset is not uint");
        if (r < e + t) throw new RangeError("Trying to access beyond buffer length")
      }

      function R(e, t, r, n, o, i) {
        if (!h.isBuffer(e)) throw new TypeError('"buffer" argument must be a Buffer instance');
        if (o < t || t < i) throw new RangeError('"value" argument is out of bounds');
        if (r + n > e.length) throw new RangeError("Index out of range")
      }

      function N(e, t, r, n, o, i) {
        if (r + n > e.length) throw new RangeError("Index out of range");
        if (r < 0) throw new RangeError("Index out of range")
      }

      function O(e, t, r, n, o) {
        return t = +t, r >>>= 0, o || N(e, 0, r, 4), ieee754.write(e, t, r, n, 23, 4), r + 4
      }

      function T(e, t, r, n, o) {
        return t = +t, r >>>= 0, o || N(e, 0, r, 8), ieee754.write(e, t, r, n, 52, 8), r + 8
      }
      h.prototype.slice = function(e, t) {
        var r = this.length;
        (e = ~~e) < 0 ? (e += r) < 0 && (e = 0) : r < e && (e = r), (t = void 0 === t ? r : ~~t) < 0 ? (t += r) < 0 && (t = 0) : r < t && (t = r), t < e && (t = e);
        var n = this.subarray(e, t);
        return n.__proto__ = h.prototype, n
      }, h.prototype.readUIntLE = function(e, t, r) {
        e >>>= 0, t >>>= 0, r || w(e, t, this.length);
        for (var n = this[e], o = 1, i = 0; ++i < t && (o *= 256);) n += this[e + i] * o;
        return n
      }, h.prototype.readUIntBE = function(e, t, r) {
        e >>>= 0, t >>>= 0, r || w(e, t, this.length);
        for (var n = this[e + --t], o = 1; 0 < t && (o *= 256);) n += this[e + --t] * o;
        return n
      }, h.prototype.readUInt8 = function(e, t) {
        return e >>>= 0, t || w(e, 1, this.length), this[e]
      }, h.prototype.readUInt16LE = function(e, t) {
        return e >>>= 0, t || w(e, 2, this.length), this[e] | this[e + 1] << 8
      }, h.prototype.readUInt16BE = function(e, t) {
        return e >>>= 0, t || w(e, 2, this.length), this[e] << 8 | this[e + 1]
      }, h.prototype.readUInt32LE = function(e, t) {
        return e >>>= 0, t || w(e, 4, this.length), (this[e] | this[e + 1] << 8 | this[e + 2] << 16) + 16777216 * this[e + 3]
      }, h.prototype.readUInt32BE = function(e, t) {
        return e >>>= 0, t || w(e, 4, this.length), 16777216 * this[e] + (this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3])
      }, h.prototype.readIntLE = function(e, t, r) {
        e >>>= 0, t >>>= 0, r || w(e, t, this.length);
        for (var n = this[e], o = 1, i = 0; ++i < t && (o *= 256);) n += this[e + i] * o;
        return (o *= 128) <= n && (n -= Math.pow(2, 8 * t)), n
      }, h.prototype.readIntBE = function(e, t, r) {
        e >>>= 0, t >>>= 0, r || w(e, t, this.length);
        for (var n = t, o = 1, i = this[e + --n]; 0 < n && (o *= 256);) i += this[e + --n] * o;
        return (o *= 128) <= i && (i -= Math.pow(2, 8 * t)), i
      }, h.prototype.readInt8 = function(e, t) {
        return e >>>= 0, t || w(e, 1, this.length), 128 & this[e] ? -1 * (255 - this[e] + 1) : this[e]
      }, h.prototype.readInt16LE = function(e, t) {
        e >>>= 0, t || w(e, 2, this.length);
        var r = this[e] | this[e + 1] << 8;
        return 32768 & r ? 4294901760 | r : r
      }, h.prototype.readInt16BE = function(e, t) {
        e >>>= 0, t || w(e, 2, this.length);
        var r = this[e + 1] | this[e] << 8;
        return 32768 & r ? 4294901760 | r : r
      }, h.prototype.readInt32LE = function(e, t) {
        return e >>>= 0, t || w(e, 4, this.length), this[e] | this[e + 1] << 8 | this[e + 2] << 16 | this[e + 3] << 24
      }, h.prototype.readInt32BE = function(e, t) {
        return e >>>= 0, t || w(e, 4, this.length), this[e] << 24 | this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3]
      }, h.prototype.readFloatLE = function(e, t) {
        return e >>>= 0, t || w(e, 4, this.length), ieee754.read(this, e, !0, 23, 4)
      }, h.prototype.readFloatBE = function(e, t) {
        return e >>>= 0, t || w(e, 4, this.length), ieee754.read(this, e, !1, 23, 4)
      }, h.prototype.readDoubleLE = function(e, t) {
        return e >>>= 0, t || w(e, 8, this.length), ieee754.read(this, e, !0, 52, 8)
      }, h.prototype.readDoubleBE = function(e, t) {
        return e >>>= 0, t || w(e, 8, this.length), ieee754.read(this, e, !1, 52, 8)
      }, h.prototype.writeUIntLE = function(e, t, r, n) {
        (e = +e, t >>>= 0, r >>>= 0, n) || R(this, e, t, r, Math.pow(2, 8 * r) - 1, 0);
        var o = 1,
          i = 0;
        for (this[t] = 255 & e; ++i < r && (o *= 256);) this[t + i] = e / o & 255;
        return t + r
      }, h.prototype.writeUIntBE = function(e, t, r, n) {
        (e = +e, t >>>= 0, r >>>= 0, n) || R(this, e, t, r, Math.pow(2, 8 * r) - 1, 0);
        var o = r - 1,
          i = 1;
        for (this[t + o] = 255 & e; 0 <= --o && (i *= 256);) this[t + o] = e / i & 255;
        return t + r
      }, h.prototype.writeUInt8 = function(e, t, r) {
        return e = +e, t >>>= 0, r || R(this, e, t, 1, 255, 0), this[t] = 255 & e, t + 1
      }, h.prototype.writeUInt16LE = function(e, t, r) {
        return e = +e, t >>>= 0, r || R(this, e, t, 2, 65535, 0), this[t] = 255 & e, this[t + 1] = e >>> 8, t + 2
      }, h.prototype.writeUInt16BE = function(e, t, r) {
        return e = +e, t >>>= 0, r || R(this, e, t, 2, 65535, 0), this[t] = e >>> 8, this[t + 1] = 255 & e, t + 2
      }, h.prototype.writeUInt32LE = function(e, t, r) {
        return e = +e, t >>>= 0, r || R(this, e, t, 4, 4294967295, 0), this[t + 3] = e >>> 24, this[t + 2] = e >>> 16, this[t + 1] = e >>> 8, this[t] = 255 & e, t + 4
      }, h.prototype.writeUInt32BE = function(e, t, r) {
        return e = +e, t >>>= 0, r || R(this, e, t, 4, 4294967295, 0), this[t] = e >>> 24, this[t + 1] = e >>> 16, this[t + 2] = e >>> 8, this[t + 3] = 255 & e, t + 4
      }, h.prototype.writeIntLE = function(e, t, r, n) {
        if (e = +e, t >>>= 0, !n) {
          var o = Math.pow(2, 8 * r - 1);
          R(this, e, t, r, o - 1, -o)
        }
        var i = 0,
          s = 1,
          u = 0;
        for (this[t] = 255 & e; ++i < r && (s *= 256);) e < 0 && 0 === u && 0 !== this[t + i - 1] && (u = 1), this[t + i] = (e / s >> 0) - u & 255;
        return t + r
      }, h.prototype.writeIntBE = function(e, t, r, n) {
        if (e = +e, t >>>= 0, !n) {
          var o = Math.pow(2, 8 * r - 1);
          R(this, e, t, r, o - 1, -o)
        }
        var i = r - 1,
          s = 1,
          u = 0;
        for (this[t + i] = 255 & e; 0 <= --i && (s *= 256);) e < 0 && 0 === u && 0 !== this[t + i + 1] && (u = 1), this[t + i] = (e / s >> 0) - u & 255;
        return t + r
      }, h.prototype.writeInt8 = function(e, t, r) {
        return e = +e, t >>>= 0, r || R(this, e, t, 1, 127, -128), e < 0 && (e = 255 + e + 1), this[t] = 255 & e, t + 1
      }, h.prototype.writeInt16LE = function(e, t, r) {
        return e = +e, t >>>= 0, r || R(this, e, t, 2, 32767, -32768), this[t] = 255 & e, this[t + 1] = e >>> 8, t + 2
      }, h.prototype.writeInt16BE = function(e, t, r) {
        return e = +e, t >>>= 0, r || R(this, e, t, 2, 32767, -32768), this[t] = e >>> 8, this[t + 1] = 255 & e, t + 2
      }, h.prototype.writeInt32LE = function(e, t, r) {
        return e = +e, t >>>= 0, r || R(this, e, t, 4, 2147483647, -2147483648), this[t] = 255 & e, this[t + 1] = e >>> 8, this[t + 2] = e >>> 16, this[t + 3] = e >>> 24, t + 4
      }, h.prototype.writeInt32BE = function(e, t, r) {
        return e = +e, t >>>= 0, r || R(this, e, t, 4, 2147483647, -2147483648), e < 0 && (e = 4294967295 + e + 1), this[t] = e >>> 24, this[t + 1] = e >>> 16, this[t + 2] = e >>> 8, this[t + 3] = 255 & e, t + 4
      }, h.prototype.writeFloatLE = function(e, t, r) {
        return O(this, e, t, !0, r)
      }, h.prototype.writeFloatBE = function(e, t, r) {
        return O(this, e, t, !1, r)
      }, h.prototype.writeDoubleLE = function(e, t, r) {
        return T(this, e, t, !0, r)
      }, h.prototype.writeDoubleBE = function(e, t, r) {
        return T(this, e, t, !1, r)
      }, h.prototype.copy = function(e, t, r, n) {
        if (!h.isBuffer(e)) throw new TypeError("argument should be a Buffer");
        if (r || (r = 0), n || 0 === n || (n = this.length), t >= e.length && (t = e.length), t || (t = 0), 0 < n && n < r && (n = r), n === r) return 0;
        if (0 === e.length || 0 === this.length) return 0;
        if (t < 0) throw new RangeError("targetStart out of bounds");
        if (r < 0 || r >= this.length) throw new RangeError("Index out of range");
        if (n < 0) throw new RangeError("sourceEnd out of bounds");
        n > this.length && (n = this.length), e.length - t < n - r && (n = e.length - t + r);
        var o = n - r;
        if (this === e && "function" == typeof Uint8Array.prototype.copyWithin) this.copyWithin(t, r, n);
        else if (this === e && r < t && t < n)
          for (var i = o - 1; 0 <= i; --i) e[i + t] = this[i + r];
        else Uint8Array.prototype.set.call(e, this.subarray(r, n), t);
        return o
      }, h.prototype.fill = function(e, t, r, n) {
        if ("string" == typeof e) {
          if ("string" == typeof t ? (n = t, t = 0, r = this.length) : "string" == typeof r && (n = r, r = this.length), void 0 !== n && "string" != typeof n) throw new TypeError("encoding must be a string");
          if ("string" == typeof n && !h.isEncoding(n)) throw new TypeError("Unknown encoding: " + n);
          if (1 === e.length) {
            var o = e.charCodeAt(0);
            ("utf8" === n && o < 128 || "latin1" === n) && (e = o)
          }
        } else "number" == typeof e && (e &= 255);
        if (t < 0 || this.length < t || this.length < r) throw new RangeError("Out of range index");
        if (r <= t) return this;
        var i;
        if (t >>>= 0, r = void 0 === r ? this.length : r >>> 0, e || (e = 0), "number" == typeof e)
          for (i = t; i < r; ++i) this[i] = e;
        else {
          var s = h.isBuffer(e) ? e : h.from(e, n),
            u = s.length;
          if (0 === u) throw new TypeError('The value "' + e + '" is invalid for argument "value"');
          for (i = 0; i < r - t; ++i) this[i + t] = s[i % u]
        }
        return this
      };
      var t = /[^+/0-9A-Za-z-_]/g;

      function B(e) {
        return e < 16 ? "0" + e.toString(16) : e.toString(16)
      }

      function I(e, t) {
        var r;
        t = t || 1 / 0;
        for (var n = e.length, o = null, i = [], s = 0; s < n; ++s) {
          if (55295 < (r = e.charCodeAt(s)) && r < 57344) {
            if (!o) {
              if (56319 < r) {
                -1 < (t -= 3) && i.push(239, 191, 189);
                continue
              }
              if (s + 1 === n) {
                -1 < (t -= 3) && i.push(239, 191, 189);
                continue
              }
              o = r;
              continue
            }
            if (r < 56320) {
              -1 < (t -= 3) && i.push(239, 191, 189), o = r;
              continue
            }
            r = 65536 + (o - 55296 << 10 | r - 56320)
          } else o && -1 < (t -= 3) && i.push(239, 191, 189);
          if (o = null, r < 128) {
            if ((t -= 1) < 0) break;
            i.push(r)
          } else if (r < 2048) {
            if ((t -= 2) < 0) break;
            i.push(r >> 6 | 192, 63 & r | 128)
          } else if (r < 65536) {
            if ((t -= 3) < 0) break;
            i.push(r >> 12 | 224, r >> 6 & 63 | 128, 63 & r | 128)
          } else {
            if (!(r < 1114112)) throw new Error("Invalid code point");
            if ((t -= 4) < 0) break;
            i.push(r >> 18 | 240, r >> 12 & 63 | 128, r >> 6 & 63 | 128, 63 & r | 128)
          }
        }
        return i
      }

      function P(e) {
        return base64Js.toByteArray(function(e) {
          if ((e = (e = e.split("=")[0]).trim().replace(t, "")).length < 2) return "";
          for (; e.length % 4 != 0;) e += "=";
          return e
        }(e))
      }

      function C(e, t, r, n) {
        for (var o = 0; o < n && !(o + r >= t.length || o >= e.length); ++o) t[o + r] = e[o];
        return o
      }

      function D(e, t) {
        return e instanceof t || null != e && null != e.constructor && null != e.constructor.name && e.constructor.name === t.name
      }

      function U(e) {
        return e != e
      }
    }),
    buffer_1 = buffer.Buffer,
    buffer_2 = buffer.SlowBuffer,
    buffer_3 = buffer.INSPECT_MAX_BYTES,
    buffer_4 = buffer.kMaxLength,
    commonjsGlobal$1 = "undefined" != typeof window ? window : void 0 !== global$1 ? global$1 : "undefined" != typeof self ? self : {};

  function createCommonjsModule$1(e, t) {
    return e(t = {
      exports: {}
    }, t.exports), t.exports
  }
  var map = createCommonjsModule$1(function(e) {
      if (void 0 !== commonjsGlobal$1.Map) e.exports = commonjsGlobal$1.Map, e.exports.Map = commonjsGlobal$1.Map;
      else {
        var t = function(e) {
          this._keys = [], this._values = {};
          for (var t = 0; t < e.length; t++)
            if (null != e[t]) {
              var r = e[t],
                n = r[0],
                o = r[1];
              this._keys.push(n), this._values[n] = {
                v: o,
                i: this._keys.length - 1
              }
            }
        };
        t.prototype.clear = function() {
          this._keys = [], this._values = {}
        }, t.prototype.delete = function(e) {
          var t = this._values[e];
          return null != t && (delete this._values[e], this._keys.splice(t.i, 1), !0)
        }, t.prototype.entries = function() {
          var t = this,
            r = 0;
          return {
            next: function() {
              var e = t._keys[r++];
              return {
                value: void 0 !== e ? [e, t._values[e].v] : void 0,
                done: void 0 === e
              }
            }
          }
        }, t.prototype.forEach = function(e, t) {
          t = t || this;
          for (var r = 0; r < this._keys.length; r++) {
            var n = this._keys[r];
            e.call(t, this._values[n].v, n, t)
          }
        }, t.prototype.get = function(e) {
          return this._values[e] ? this._values[e].v : void 0
        }, t.prototype.has = function(e) {
          return null != this._values[e]
        }, t.prototype.keys = function() {
          var t = this,
            r = 0;
          return {
            next: function() {
              var e = t._keys[r++];
              return {
                value: void 0 !== e ? e : void 0,
                done: void 0 === e
              }
            }
          }
        }, t.prototype.set = function(e, t) {
          return this._values[e] ? this._values[e].v = t : (this._keys.push(e), this._values[e] = {
            v: t,
            i: this._keys.length - 1
          }), this
        }, t.prototype.values = function() {
          var t = this,
            r = 0;
          return {
            next: function() {
              var e = t._keys[r++];
              return {
                value: void 0 !== e ? t._values[e].v : void 0,
                done: void 0 === e
              }
            }
          }
        }, Object.defineProperty(t.prototype, "size", {
          enumerable: !0,
          get: function() {
            return this._keys.length
          }
        }), e.exports = t
      }
    }),
    map_1 = map.Map;
  long_1.prototype.toExtendedJSON = function(e) {
    return e && e.relaxed ? this.toNumber() : {
      $numberLong: this.toString()
    }
  }, long_1.fromExtendedJSON = function(e, t) {
    var r = long_1.fromString(e.$numberLong);
    return t && t.relaxed ? r.toNumber() : r
  }, Object.defineProperty(long_1.prototype, "_bsontype", {
    value: "Long"
  });
  var long_1$1 = long_1;

  function _typeof(e) {
    return (_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
      return typeof e
    } : function(e) {
      return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
    })(e)
  }

  function _classCallCheck(e, t) {
    if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
  }

  function _defineProperties(e, t) {
    for (var r = 0; r < t.length; r++) {
      var n = t[r];
      n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
    }
  }

  function _createClass(e, t, r) {
    return t && _defineProperties(e.prototype, t), r && _defineProperties(e, r), e
  }

  function _inherits(e, t) {
    if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function");
    e.prototype = Object.create(t && t.prototype, {
      constructor: {
        value: e,
        writable: !0,
        configurable: !0
      }
    }), t && _setPrototypeOf(e, t)
  }

  function _getPrototypeOf(e) {
    return (_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function(e) {
      return e.__proto__ || Object.getPrototypeOf(e)
    })(e)
  }

  function _setPrototypeOf(e, t) {
    return (_setPrototypeOf = Object.setPrototypeOf || function(e, t) {
      return e.__proto__ = t, e
    })(e, t)
  }

  function _assertThisInitialized(e) {
    if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    return e
  }

  function _possibleConstructorReturn(e, t) {
    return !t || "object" != typeof t && "function" != typeof t ? _assertThisInitialized(e) : t
  }
  var Double = function() {
    function r(e) {
      _classCallCheck(this, r), this.value = e
    }
    return _createClass(r, [{
      key: "valueOf",
      value: function() {
        return this.value
      }
    }, {
      key: "toJSON",
      value: function() {
        return this.value
      }
    }, {
      key: "toExtendedJSON",
      value: function(e) {
        return e && e.relaxed && isFinite(this.value) ? this.value : {
          $numberDouble: this.value.toString()
        }
      }
    }], [{
      key: "fromExtendedJSON",
      value: function(e, t) {
        return t && t.relaxed ? parseFloat(e.$numberDouble) : new r(parseFloat(e.$numberDouble))
      }
    }]), r
  }();
  Object.defineProperty(Double.prototype, "_bsontype", {
    value: "Double"
  });
  var double_1 = Double,
    Timestamp = function(e) {
      function r(e, t) {
        return _classCallCheck(this, r), _possibleConstructorReturn(_possibleConstructorReturn(this, e instanceof long_1$1 ? _getPrototypeOf(r).call(this, e.low, e.high) : _getPrototypeOf(r).call(this, e, t)))
      }
      return _inherits(r, long_1$1), _createClass(r, [{
        key: "toJSON",
        value: function() {
          return {
            $timestamp: this.toString()
          }
        }
      }, {
        key: "toExtendedJSON",
        value: function() {
          return {
            $timestamp: {
              t: this.high,
              i: this.low
            }
          }
        }
      }], [{
        key: "fromInt",
        value: function(e) {
          return new r(long_1$1.fromInt(e))
        }
      }, {
        key: "fromNumber",
        value: function(e) {
          return new r(long_1$1.fromNumber(e))
        }
      }, {
        key: "fromBits",
        value: function(e, t) {
          return new r(e, t)
        }
      }, {
        key: "fromString",
        value: function(e, t) {
          return new r(long_1$1.fromString(e, t))
        }
      }, {
        key: "fromExtendedJSON",
        value: function(e) {
          return new r(e.$timestamp.i, e.$timestamp.t)
        }
      }]), r
    }();
  Object.defineProperty(Timestamp.prototype, "_bsontype", {
    value: "Timestamp"
  });
  var timestamp = Timestamp,
    require$$0 = {};

  function normalizedFunctionString(e) {
    return e.toString().replace("function(", "function (")
  }

  function insecureRandomBytes(e) {
    for (var t = new Uint8Array(e), r = 0; r < e; ++r) t[r] = Math.floor(256 * Math.random());
    return t
  }
  var randomBytes = insecureRandomBytes;
  if ("undefined" != typeof window && window.crypto && window.crypto.getRandomValues) randomBytes = function(e) {
    return window.crypto.getRandomValues(new Uint8Array(e))
  };
  else {
    try {
      randomBytes = require$$0.randomBytes
    } catch (e) {}
    null == randomBytes && (randomBytes = insecureRandomBytes)
  }
  var utils = {
      normalizedFunctionString: normalizedFunctionString,
      randomBytes: randomBytes
    },
    Buffer$1 = buffer.Buffer,
    randomBytes$1 = utils.randomBytes,
    PROCESS_UNIQUE = randomBytes$1(5),
    checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$"),
    hasBufferType = !1;
  try {
    Buffer$1 && Buffer$1.from && (hasBufferType = !0)
  } catch (e) {
    hasBufferType = !1
  }
  for (var hexTable = [], _i = 0; _i < 256; _i++) hexTable[_i] = (_i <= 15 ? "0" : "") + _i.toString(16);
  for (var decodeLookup = [], i$1 = 0; i$1 < 10;) decodeLookup[48 + i$1] = i$1++;
  for (; i$1 < 16;) decodeLookup[55 + i$1] = decodeLookup[87 + i$1] = i$1++;
  var _Buffer = Buffer$1;

  function convertToHex(e) {
    return e.toString("hex")
  }

  function makeObjectIdError(e, t) {
    var r = e[t];
    return new TypeError('ObjectId string "'.concat(e, '" contains invalid character "').concat(r, '" with character code (').concat(e.charCodeAt(t), "). All character codes for a non-hex string must be less than 256."))
  }
  var ObjectId = function() {
    function o(e) {
      if (_classCallCheck(this, o), e instanceof o) return e;
      if (null == e || "number" == typeof e) return this.id = this.generate(e), void(o.cacheHexString && (this.__id = this.toString("hex")));
      var t = o.isValid(e);
      if (!t && null != e) throw new TypeError("Argument passed in must be a single String of 12 bytes or a string of 24 hex characters");
      if (t && "string" == typeof e && 24 === e.length && hasBufferType) return new o(Buffer$1.from(e, "hex"));
      if (t && "string" == typeof e && 24 === e.length) return o.createFromHexString(e);
      if (null == e || 12 !== e.length) {
        if (null != e && e.toHexString) return e;
        throw new TypeError("Argument passed in must be a single String of 12 bytes or a string of 24 hex characters")
      }
      this.id = e, o.cacheHexString && (this.__id = this.toString("hex"))
    }
    return _createClass(o, [{
      key: "toHexString",
      value: function() {
        if (o.cacheHexString && this.__id) return this.__id;
        var e = "";
        if (!this.id || !this.id.length) throw new TypeError("invalid ObjectId, ObjectId.id must be either a string or a Buffer, but is [" + JSON.stringify(this.id) + "]");
        if (this.id instanceof _Buffer) return e = convertToHex(this.id), o.cacheHexString && (this.__id = e), e;
        for (var t = 0; t < this.id.length; t++) {
          var r = hexTable[this.id.charCodeAt(t)];
          if ("string" != typeof r) throw makeObjectIdError(this.id, t);
          e += r
        }
        return o.cacheHexString && (this.__id = e), e
      }
    }, {
      key: "get_inc",
      value: function() {
        return o.index = (o.index + 1) % 16777215
      }
    }, {
      key: "getInc",
      value: function() {
        return this.get_inc()
      }
    }, {
      key: "generate",
      value: function(e) {
        "number" != typeof e && (e = ~~(Date.now() / 1e3));
        var t = this.get_inc(),
          r = Buffer$1.alloc(12);
        return r[3] = 255 & e, r[2] = e >> 8 & 255, r[1] = e >> 16 & 255, r[0] = e >> 24 & 255, r[4] = PROCESS_UNIQUE[0], r[5] = PROCESS_UNIQUE[1], r[6] = PROCESS_UNIQUE[2], r[7] = PROCESS_UNIQUE[3], r[8] = PROCESS_UNIQUE[4], r[11] = 255 & t, r[10] = t >> 8 & 255, r[9] = t >> 16 & 255, r
      }
    }, {
      key: "toString",
      value: function(e) {
        return this.id && this.id.copy ? this.id.toString("string" == typeof e ? e : "hex") : this.toHexString()
      }
    }, {
      key: "toJSON",
      value: function() {
        return this.toHexString()
      }
    }, {
      key: "equals",
      value: function(e) {
        return e instanceof o ? this.toString() === e.toString() : "string" == typeof e && o.isValid(e) && 12 === e.length && this.id instanceof _Buffer ? e === this.id.toString("binary") : "string" == typeof e && o.isValid(e) && 24 === e.length ? e.toLowerCase() === this.toHexString() : "string" == typeof e && o.isValid(e) && 12 === e.length ? e === this.id : !(null == e || !(e instanceof o || e.toHexString)) && e.toHexString() === this.toHexString()
      }
    }, {
      key: "getTimestamp",
      value: function() {
        var e = new Date,
          t = this.id[3] | this.id[2] << 8 | this.id[1] << 16 | this.id[0] << 24;
        return e.setTime(1e3 * Math.floor(t)), e
      }
    }, {
      key: "toExtendedJSON",
      value: function() {
        return this.toHexString ? {
          $oid: this.toHexString()
        } : {
          $oid: this.toString("hex")
        }
      }
    }], [{
      key: "createPk",
      value: function() {
        return new o
      }
    }, {
      key: "createFromTime",
      value: function(e) {
        var t = Buffer$1.from([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
        return t[3] = 255 & e, t[2] = e >> 8 & 255, t[1] = e >> 16 & 255, t[0] = e >> 24 & 255, new o(t)
      }
    }, {
      key: "createFromHexString",
      value: function(e) {
        if (void 0 === e || null != e && 24 !== e.length) throw new TypeError("Argument passed in must be a single String of 12 bytes or a string of 24 hex characters");
        if (hasBufferType) return new o(Buffer$1.from(e, "hex"));
        for (var t = new _Buffer(12), r = 0, n = 0; n < 24;) t[r++] = decodeLookup[e.charCodeAt(n++)] << 4 | decodeLookup[e.charCodeAt(n++)];
        return new o(t)
      }
    }, {
      key: "isValid",
      value: function(e) {
        return null != e && ("number" == typeof e || ("string" == typeof e ? 12 === e.length || 24 === e.length && checkForHexRegExp.test(e) : e instanceof o || (e instanceof _Buffer && 12 === e.length || !!e.toHexString && (12 === e.id.length || 24 === e.id.length && checkForHexRegExp.test(e.id)))))
      }
    }, {
      key: "fromExtendedJSON",
      value: function(e) {
        return new o(e.$oid)
      }
    }]), o
  }();
  Object.defineProperty(ObjectId.prototype, "generationTime", {
    enumerable: !0,
    get: function() {
      return this.id[3] | this.id[2] << 8 | this.id[1] << 16 | this.id[0] << 24
    },
    set: function(e) {
      this.id[3] = 255 & e, this.id[2] = e >> 8 & 255, this.id[1] = e >> 16 & 255, this.id[0] = e >> 24 & 255
    }
  }), ObjectId.prototype.inspect = ObjectId.prototype.toString, ObjectId.index = ~~(16777215 * Math.random()), Object.defineProperty(ObjectId.prototype, "_bsontype", {
    value: "ObjectId"
  });
  var objectid = ObjectId;

  function alphabetize(e) {
    return e.split("").sort().join("")
  }
  var BSONRegExp = function() {
    function n(e, t) {
      _classCallCheck(this, n), this.pattern = e || "", this.options = t ? alphabetize(t) : "";
      for (var r = 0; r < this.options.length; r++)
        if ("i" !== this.options[r] && "m" !== this.options[r] && "x" !== this.options[r] && "l" !== this.options[r] && "s" !== this.options[r] && "u" !== this.options[r]) throw new Error("The regular expression option [".concat(this.options[r], "] is not supported"))
    }
    return _createClass(n, [{
      key: "toExtendedJSON",
      value: function() {
        return {
          $regularExpression: {
            pattern: this.pattern,
            options: this.options
          }
        }
      }
    }], [{
      key: "fromExtendedJSON",
      value: function(e) {
        return new n(e.$regularExpression.pattern, e.$regularExpression.options.split("").sort().join(""))
      }
    }]), n
  }();
  Object.defineProperty(BSONRegExp.prototype, "_bsontype", {
    value: "BSONRegExp"
  });
  var regexp = BSONRegExp,
    BSONSymbol = function() {
      function t(e) {
        _classCallCheck(this, t), this.value = e
      }
      return _createClass(t, [{
        key: "valueOf",
        value: function() {
          return this.value
        }
      }, {
        key: "toString",
        value: function() {
          return this.value
        }
      }, {
        key: "inspect",
        value: function() {
          return this.value
        }
      }, {
        key: "toJSON",
        value: function() {
          return this.value
        }
      }, {
        key: "toExtendedJSON",
        value: function() {
          return {
            $symbol: this.value
          }
        }
      }], [{
        key: "fromExtendedJSON",
        value: function(e) {
          return new t(e.$symbol)
        }
      }]), t
    }();
  Object.defineProperty(BSONSymbol.prototype, "_bsontype", {
    value: "Symbol"
  });
  var symbol = BSONSymbol,
    Int32 = function() {
      function r(e) {
        _classCallCheck(this, r), this.value = e
      }
      return _createClass(r, [{
        key: "valueOf",
        value: function() {
          return this.value
        }
      }, {
        key: "toJSON",
        value: function() {
          return this.value
        }
      }, {
        key: "toExtendedJSON",
        value: function(e) {
          return e && e.relaxed ? this.value : {
            $numberInt: this.value.toString()
          }
        }
      }], [{
        key: "fromExtendedJSON",
        value: function(e, t) {
          return t && t.relaxed ? parseInt(e.$numberInt, 10) : new r(e.$numberInt)
        }
      }]), r
    }();
  Object.defineProperty(Int32.prototype, "_bsontype", {
    value: "Int32"
  });
  var int_32 = Int32,
    Code = function() {
      function r(e, t) {
        _classCallCheck(this, r), this.code = e, this.scope = t
      }
      return _createClass(r, [{
        key: "toJSON",
        value: function() {
          return {
            scope: this.scope,
            code: this.code
          }
        }
      }, {
        key: "toExtendedJSON",
        value: function() {
          return this.scope ? {
            $code: this.code,
            $scope: this.scope
          } : {
            $code: this.code
          }
        }
      }], [{
        key: "fromExtendedJSON",
        value: function(e) {
          return new r(e.$code, e.$scope)
        }
      }]), r
    }();
  Object.defineProperty(Code.prototype, "_bsontype", {
    value: "Code"
  });
  var code$1 = Code,
    PARSE_STRING_REGEXP = /^(\+|-)?(\d+|(\d*\.\d*))?(E|e)?([-+])?(\d+)?$/,
    PARSE_INF_REGEXP = /^(\+|-)?(Infinity|inf)$/i,
    PARSE_NAN_REGEXP = /^(\+|-)?NaN$/i,
    EXPONENT_MAX = 6111,
    EXPONENT_MIN = -6176,
    EXPONENT_BIAS = 6176,
    MAX_DIGITS = 34,
    NAN_BUFFER = [124, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0].reverse(),
    INF_NEGATIVE_BUFFER = [248, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0].reverse(),
    INF_POSITIVE_BUFFER = [120, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0].reverse(),
    EXPONENT_REGEX = /^([-+])?(\d+)?$/;

  function isDigit(e) {
    return !isNaN(parseInt(e, 10))
  }

  function divideu128(e) {
    var t = long_1$1.fromNumber(1e9),
      r = long_1$1.fromNumber(0);
    if (!(e.parts[0] || e.parts[1] || e.parts[2] || e.parts[3])) return {
      quotient: e,
      rem: r
    };
    for (var n = 0; n <= 3; n++) r = (r = r.shiftLeft(32)).add(new long_1$1(e.parts[n], 0)), e.parts[n] = r.div(t).low, r = r.modulo(t);
    return {
      quotient: e,
      rem: r
    }
  }

  function multiply64x2(e, t) {
    if (!e && !t) return {
      high: long_1$1.fromNumber(0),
      low: long_1$1.fromNumber(0)
    };
    var r = e.shiftRightUnsigned(32),
      n = new long_1$1(e.getLowBits(), 0),
      o = t.shiftRightUnsigned(32),
      i = new long_1$1(t.getLowBits(), 0),
      s = r.multiply(o),
      u = r.multiply(i),
      a = n.multiply(o),
      f = n.multiply(i);
    return s = s.add(u.shiftRightUnsigned(32)), u = new long_1$1(u.getLowBits(), 0).add(a).add(f.shiftRightUnsigned(32)), {
      high: s = s.add(u.shiftRightUnsigned(32)),
      low: f = u.shiftLeft(32).add(new long_1$1(f.getLowBits(), 0))
    }
  }

  function lessThan(e, t) {
    var r = e.high >>> 0,
      n = t.high >>> 0;
    return r < n || r === n && e.low >>> 0 < t.low >>> 0
  }

  function invalidErr(e, t) {
    throw new TypeError('"'.concat(e, '" is not a valid Decimal128 string - ').concat(t))
  }

  function Decimal128(e) {
    this.bytes = e
  }
  Decimal128.fromString = function(e) {
    var t, r = !1,
      n = !1,
      o = !1,
      i = 0,
      s = 0,
      u = 0,
      a = 0,
      f = 0,
      c = [0],
      h = 0,
      l = 0,
      d = 0,
      p = 0,
      y = 0,
      g = 0,
      _ = [0, 0],
      v = [0, 0],
      E = 0;
    if (7e3 <= e.length) throw new TypeError(e + " not a valid Decimal128 string");
    var m = e.match(PARSE_STRING_REGEXP),
      A = e.match(PARSE_INF_REGEXP),
      b = e.match(PARSE_NAN_REGEXP);
    if (!m && !A && !b || 0 === e.length) throw new TypeError(e + " not a valid Decimal128 string");
    if (m) {
      var S = m[2],
        w = m[4],
        R = m[5],
        N = m[6];
      w && void 0 === N && invalidErr(e, "missing exponent power"), w && void 0 === S && invalidErr(e, "missing exponent base"), void 0 === w && (R || N) && invalidErr(e, "missing e before exponent")
    }
    if ("+" !== e[E] && "-" !== e[E] || (r = "-" === e[E++]), !isDigit(e[E]) && "." !== e[E]) {
      if ("i" === e[E] || "I" === e[E]) return new Decimal128(Buffer.from(r ? INF_NEGATIVE_BUFFER : INF_POSITIVE_BUFFER));
      if ("N" === e[E]) return new Decimal128(Buffer.from(NAN_BUFFER))
    }
    for (; isDigit(e[E]) || "." === e[E];) "." !== e[E] ? (h < 34 && ("0" !== e[E] || o) && (o || (f = s), o = !0, c[l++] = parseInt(e[E], 10), h += 1), o && (u += 1), n && (a += 1), s += 1) : (n && invalidErr(e, "contains multiple periods"), n = !0), E += 1;
    if (n && !s) throw new TypeError(e + " not a valid Decimal128 string");
    if ("e" === e[E] || "E" === e[E]) {
      var O = e.substr(++E).match(EXPONENT_REGEX);
      if (!O || !O[2]) return new Decimal128(Buffer.from(NAN_BUFFER));
      y = parseInt(O[0], 10), E += O[0].length
    }
    if (e[E]) return new Decimal128(Buffer.from(NAN_BUFFER));
    if (d = 0, h) {
      if (p = h - 1, 1 !== (i = u))
        for (;
          "0" === e[f + i - 1];) i -= 1
    } else h = u = 1, i = c[p = d = 0] = 0;
    for (y <= a && 16384 < a - y ? y = EXPONENT_MIN : y -= a; EXPONENT_MAX < y;) {
      if (MAX_DIGITS < (p += 1) - d) {
        if (c.join("").match(/^0+$/)) {
          y = EXPONENT_MAX;
          break
        }
        invalidErr(e, "overflow")
      }
      y -= 1
    }
    for (; y < EXPONENT_MIN || h < u;) {
      if (0 === p && i < h) {
        y = EXPONENT_MIN, i = 0;
        break
      }
      if (h < u ? u -= 1 : p -= 1, y < EXPONENT_MAX) y += 1;
      else {
        if (c.join("").match(/^0+$/)) {
          y = EXPONENT_MAX;
          break
        }
        invalidErr(e, "overflow")
      }
    }
    if (p - d + 1 < i) {
      var T = s;
      n && (f += 1, T += 1), r && (f += 1, T += 1);
      var B = parseInt(e[f + p + 1], 10),
        I = 0;
      if (5 <= B && (I = 1, 5 === B))
        for (I = c[p] % 2 == 1, g = f + p + 2; g < T; g++)
          if (parseInt(e[g], 10)) {
            I = 1;
            break
          } if (I)
        for (var P = p; 0 <= P; P--)
          if (9 < ++c[P] && (c[P] = 0) === P) {
            if (!(y < EXPONENT_MAX)) return new Decimal128(Buffer.from(r ? INF_NEGATIVE_BUFFER : INF_POSITIVE_BUFFER));
            y += 1, c[P] = 1
          }
    }
    if (_ = long_1$1.fromNumber(0), v = long_1$1.fromNumber(0), 0 === i) _ = long_1$1.fromNumber(0), v = long_1$1.fromNumber(0);
    else if (p - d < 17) {
      var C = d;
      for (v = long_1$1.fromNumber(c[C++]), _ = new long_1$1(0, 0); C <= p; C++) v = (v = v.multiply(long_1$1.fromNumber(10))).add(long_1$1.fromNumber(c[C]))
    } else {
      var D = d;
      for (_ = long_1$1.fromNumber(c[D++]); D <= p - 17; D++) _ = (_ = _.multiply(long_1$1.fromNumber(10))).add(long_1$1.fromNumber(c[D]));
      for (v = long_1$1.fromNumber(c[D++]); D <= p; D++) v = (v = v.multiply(long_1$1.fromNumber(10))).add(long_1$1.fromNumber(c[D]))
    }
    var U = multiply64x2(_, long_1$1.fromString("100000000000000000"));
    U.low = U.low.add(v), lessThan(U.low, v) && (U.high = U.high.add(long_1$1.fromNumber(1))), t = y + EXPONENT_BIAS;
    var x = {
      low: long_1$1.fromNumber(0),
      high: long_1$1.fromNumber(0)
    };
    U.high.shiftRightUnsigned(49).and(long_1$1.fromNumber(1)).equals(long_1$1.fromNumber(1)) ? (x.high = x.high.or(long_1$1.fromNumber(3).shiftLeft(61)), x.high = x.high.or(long_1$1.fromNumber(t).and(long_1$1.fromNumber(16383).shiftLeft(47))), x.high = x.high.or(U.high.and(long_1$1.fromNumber(0x7fffffffffff)))) : (x.high = x.high.or(long_1$1.fromNumber(16383 & t).shiftLeft(49)), x.high = x.high.or(U.high.and(long_1$1.fromNumber(562949953421311)))), x.low = U.low, r && (x.high = x.high.or(long_1$1.fromString("9223372036854775808")));
    var L = Buffer.alloc(16);
    return E = 0, L[E++] = 255 & x.low.low, L[E++] = x.low.low >> 8 & 255, L[E++] = x.low.low >> 16 & 255, L[E++] = x.low.low >> 24 & 255, L[E++] = 255 & x.low.high, L[E++] = x.low.high >> 8 & 255, L[E++] = x.low.high >> 16 & 255, L[E++] = x.low.high >> 24 & 255, L[E++] = 255 & x.high.low, L[E++] = x.high.low >> 8 & 255, L[E++] = x.high.low >> 16 & 255, L[E++] = x.high.low >> 24 & 255, L[E++] = 255 & x.high.high, L[E++] = x.high.high >> 8 & 255, L[E++] = x.high.high >> 16 & 255, L[E++] = x.high.high >> 24 & 255, new Decimal128(L)
  };
  var COMBINATION_MASK = 31,
    EXPONENT_MASK = 16383,
    COMBINATION_INFINITY = 30,
    COMBINATION_NAN = 31;
  Decimal128.prototype.toString = function() {
    for (var e, t, r, n, o, i, s = 0, u = new Array(36), a = 0; a < u.length; a++) u[a] = 0;
    var f, c, h, l, d, p = 0,
      y = !1,
      g = {
        parts: new Array(4)
      },
      _ = [];
    p = 0;
    var v = this.bytes;
    if (n = v[p++] | v[p++] << 8 | v[p++] << 16 | v[p++] << 24, r = v[p++] | v[p++] << 8 | v[p++] << 16 | v[p++] << 24, t = v[p++] | v[p++] << 8 | v[p++] << 16 | v[p++] << 24, e = v[p++] | v[p++] << 8 | v[p++] << 16 | v[p++] << 24, p = 0, {
        low: new long_1$1(n, r),
        high: new long_1$1(t, e)
      }.high.lessThan(long_1$1.ZERO) && _.push("-"), (o = e >> 26 & COMBINATION_MASK) >> 3 == 3) {
      if (o === COMBINATION_INFINITY) return _.join("") + "Infinity";
      if (o === COMBINATION_NAN) return "NaN";
      i = e >> 15 & EXPONENT_MASK, h = 8 + (e >> 14 & 1)
    } else h = e >> 14 & 7, i = e >> 17 & EXPONENT_MASK;
    if (f = i - EXPONENT_BIAS, g.parts[0] = (16383 & e) + ((15 & h) << 14), g.parts[1] = t, g.parts[2] = r, g.parts[3] = n, 0 === g.parts[0] && 0 === g.parts[1] && 0 === g.parts[2] && 0 === g.parts[3]) y = !0;
    else
      for (d = 3; 0 <= d; d--) {
        var E = 0,
          m = divideu128(g);
        if (g = m.quotient, E = m.rem.low)
          for (l = 8; 0 <= l; l--) u[9 * d + l] = E % 10, E = Math.floor(E / 10)
      }
    if (y) s = 1, u[p] = 0;
    else
      for (s = 36; !u[p];) s -= 1, p += 1;
    if (34 <= (c = s - 1 + f) || c <= -7 || 0 < f) {
      if (34 < s) return _.push(0), 0 < f ? _.push("E+" + f) : f < 0 && _.push("E" + f), _.join("");
      _.push(u[p++]), (s -= 1) && _.push(".");
      for (var A = 0; A < s; A++) _.push(u[p++]);
      _.push("E"), 0 < c ? _.push("+" + c) : _.push(c)
    } else if (0 <= f)
      for (var b = 0; b < s; b++) _.push(u[p++]);
    else {
      var S = s + f;
      if (0 < S)
        for (var w = 0; w < S; w++) _.push(u[p++]);
      else _.push("0");
      for (_.push("."); S++ < 0;) _.push("0");
      for (var R = 0; R < s - Math.max(S - 1, 0); R++) _.push(u[p++])
    }
    return _.join("")
  }, Decimal128.prototype.toJSON = function() {
    return {
      $numberDecimal: this.toString()
    }
  }, Decimal128.prototype.toExtendedJSON = function() {
    return {
      $numberDecimal: this.toString()
    }
  }, Decimal128.fromExtendedJSON = function(e) {
    return Decimal128.fromString(e.$numberDecimal)
  }, Object.defineProperty(Decimal128.prototype, "_bsontype", {
    value: "Decimal128"
  });
  var decimal128 = Decimal128,
    MinKey = function() {
      function e() {
        _classCallCheck(this, e)
      }
      return _createClass(e, [{
        key: "toExtendedJSON",
        value: function() {
          return {
            $minKey: 1
          }
        }
      }], [{
        key: "fromExtendedJSON",
        value: function() {
          return new e
        }
      }]), e
    }();
  Object.defineProperty(MinKey.prototype, "_bsontype", {
    value: "MinKey"
  });
  var min_key = MinKey,
    MaxKey = function() {
      function e() {
        _classCallCheck(this, e)
      }
      return _createClass(e, [{
        key: "toExtendedJSON",
        value: function() {
          return {
            $maxKey: 1
          }
        }
      }], [{
        key: "fromExtendedJSON",
        value: function() {
          return new e
        }
      }]), e
    }();
  Object.defineProperty(MaxKey.prototype, "_bsontype", {
    value: "MaxKey"
  });
  var max_key = MaxKey,
    DBRef = function() {
      function i(e, t, r, n) {
        _classCallCheck(this, i);
        var o = e.split(".");
        2 === o.length && (r = o.shift(), e = o.shift()), this.collection = e, this.oid = t, this.db = r, this.fields = n || {}
      }
      return _createClass(i, [{
        key: "toJSON",
        value: function() {
          var e = Object.assign({
            $ref: this.collection,
            $id: this.oid
          }, this.fields);
          return null != this.db && (e.$db = this.db), e
        }
      }, {
        key: "toExtendedJSON",
        value: function() {
          var e = {
            $ref: this.collection,
            $id: this.oid
          };
          return this.db && (e.$db = this.db), e = Object.assign(e, this.fields)
        }
      }], [{
        key: "fromExtendedJSON",
        value: function(e) {
          var t = Object.assign({}, e);
          return ["$ref", "$id", "$db"].forEach(function(e) {
            return delete t[e]
          }), new i(e.$ref, e.$id, e.$db, t)
        }
      }]), i
    }();
  Object.defineProperty(DBRef.prototype, "_bsontype", {
    value: "DBRef"
  });
  var db_ref = DBRef,
    Binary = function() {
      function i(e, t) {
        if (_classCallCheck(this, i), !(null == e || "string" == typeof e || isBuffer(e) || e instanceof Uint8Array || Array.isArray(e))) throw new TypeError("only String, Buffer, Uint8Array or Array accepted");
        if (this.sub_type = null == t ? BSON_BINARY_SUBTYPE_DEFAULT : t, this.position = 0, null == e || e instanceof Number) void 0 !== Buffer ? this.buffer = Buffer.alloc(i.BUFFER_SIZE) : "undefined" != typeof Uint8Array ? this.buffer = new Uint8Array(new ArrayBuffer(i.BUFFER_SIZE)) : this.buffer = new Array(i.BUFFER_SIZE);
        else {
          if ("string" == typeof e)
            if (void 0 !== Buffer) this.buffer = Buffer.from(e);
            else {
              if ("undefined" == typeof Uint8Array && !Array.isArray(e)) throw new TypeError("only String, Buffer, Uint8Array or Array accepted");
              this.buffer = writeStringToArray(e)
            }
          else this.buffer = e;
          this.position = e.length
        }
      }
      return _createClass(i, [{
        key: "put",
        value: function(e) {
          if (null != e.length && "number" != typeof e && 1 !== e.length) throw new TypeError("only accepts single character String, Uint8Array or Array");
          if ("number" != typeof e && e < 0 || 255 < e) throw new TypeError("only accepts number in a valid unsigned byte range 0-255");
          var t = null;
          if (t = "string" == typeof e ? e.charCodeAt(0) : null != e.length ? e[0] : e, this.buffer.length > this.position) this.buffer[this.position++] = t;
          else if (void 0 !== Buffer && isBuffer(this.buffer)) {
            var r = Buffer.alloc(i.BUFFER_SIZE + this.buffer.length);
            this.buffer.copy(r, 0, 0, this.buffer.length), this.buffer = r, this.buffer[this.position++] = t
          } else {
            var n = null;
            n = isUint8Array(this.buffer) ? new Uint8Array(new ArrayBuffer(i.BUFFER_SIZE + this.buffer.length)) : new Array(i.BUFFER_SIZE + this.buffer.length);
            for (var o = 0; o < this.buffer.length; o++) n[o] = this.buffer[o];
            this.buffer = n, this.buffer[this.position++] = t
          }
        }
      }, {
        key: "write",
        value: function(e, t) {
          if (t = "number" == typeof t ? t : this.position, this.buffer.length < t + e.length) {
            var r = null;
            if (void 0 !== Buffer && isBuffer(this.buffer)) r = Buffer.alloc(this.buffer.length + e.length), this.buffer.copy(r, 0, 0, this.buffer.length);
            else if (isUint8Array(this.buffer)) {
              r = new Uint8Array(new ArrayBuffer(this.buffer.length + e.length));
              for (var n = 0; n < this.position; n++) r[n] = this.buffer[n]
            }
            this.buffer = r
          }
          if (void 0 !== Buffer && isBuffer(e) && isBuffer(this.buffer)) e.copy(this.buffer, t, 0, e.length), this.position = t + e.length > this.position ? t + e.length : this.position;
          else if (void 0 !== Buffer && "string" == typeof e && isBuffer(this.buffer)) this.buffer.write(e, t, "binary"), this.position = t + e.length > this.position ? t + e.length : this.position;
          else if (isUint8Array(e) || Array.isArray(e) && "string" != typeof e) {
            for (var o = 0; o < e.length; o++) this.buffer[t++] = e[o];
            this.position = t > this.position ? t : this.position
          } else if ("string" == typeof e) {
            for (var i = 0; i < e.length; i++) this.buffer[t++] = e.charCodeAt(i);
            this.position = t > this.position ? t : this.position
          }
        }
      }, {
        key: "read",
        value: function(e, t) {
          if (t = t && 0 < t ? t : this.position, this.buffer.slice) return this.buffer.slice(e, e + t);
          for (var r = "undefined" != typeof Uint8Array ? new Uint8Array(new ArrayBuffer(t)) : new Array(t), n = 0; n < t; n++) r[n] = this.buffer[e++];
          return r
        }
      }, {
        key: "value",
        value: function(e) {
          if ((e = null != e && e) && void 0 !== Buffer && isBuffer(this.buffer) && this.buffer.length === this.position) return this.buffer;
          if (void 0 !== Buffer && isBuffer(this.buffer)) return e ? this.buffer.slice(0, this.position) : this.buffer.toString("binary", 0, this.position);
          if (e) {
            if (null != this.buffer.slice) return this.buffer.slice(0, this.position);
            for (var t = isUint8Array(this.buffer) ? new Uint8Array(new ArrayBuffer(this.position)) : new Array(this.position), r = 0; r < this.position; r++) t[r] = this.buffer[r];
            return t
          }
          return convertArraytoUtf8BinaryString(this.buffer, 0, this.position)
        }
      }, {
        key: "length",
        value: function() {
          return this.position
        }
      }, {
        key: "toJSON",
        value: function() {
          return null != this.buffer ? this.buffer.toString("base64") : ""
        }
      }, {
        key: "toString",
        value: function(e) {
          return null != this.buffer ? this.buffer.slice(0, this.position).toString(e) : ""
        }
      }, {
        key: "toExtendedJSON",
        value: function() {
          var e = isBuffer(this.buffer) ? this.buffer.toString("base64") : Buffer.from(this.buffer).toString("base64"),
            t = Number(this.sub_type).toString(16);
          return {
            $binary: {
              base64: e,
              subType: 1 === t.length ? "0" + t : t
            }
          }
        }
      }], [{
        key: "fromExtendedJSON",
        value: function(e) {
          var t = e.$binary.subType ? parseInt(e.$binary.subType, 16) : 0;
          return new i(new Buffer(e.$binary.base64, "base64"), t)
        }
      }]), i
    }(),
    BSON_BINARY_SUBTYPE_DEFAULT = 0;

  function isUint8Array(e) {
    return "[object Uint8Array]" === Object.prototype.toString.call(e)
  }

  function writeStringToArray(e) {
    for (var t = "undefined" != typeof Uint8Array ? new Uint8Array(new ArrayBuffer(e.length)) : new Array(e.length), r = 0; r < e.length; r++) t[r] = e.charCodeAt(r);
    return t
  }

  function convertArraytoUtf8BinaryString(e, t, r) {
    for (var n = "", o = t; o < r; o++) n += String.fromCharCode(e[o]);
    return n
  }
  Binary.BUFFER_SIZE = 256, Binary.SUBTYPE_DEFAULT = 0, Binary.SUBTYPE_FUNCTION = 1, Binary.SUBTYPE_BYTE_ARRAY = 2, Binary.SUBTYPE_UUID_OLD = 3, Binary.SUBTYPE_UUID = 4, Binary.SUBTYPE_MD5 = 5, Binary.SUBTYPE_USER_DEFINED = 128, Object.defineProperty(Binary.prototype, "_bsontype", {
    value: "Binary"
  });
  var binary = Binary,
    constants = {
      BSON_INT32_MAX: 2147483647,
      BSON_INT32_MIN: -2147483648,
      BSON_INT64_MAX: Math.pow(2, 63) - 1,
      BSON_INT64_MIN: -Math.pow(2, 63),
      JS_INT_MAX: 9007199254740992,
      JS_INT_MIN: -9007199254740992,
      BSON_DATA_NUMBER: 1,
      BSON_DATA_STRING: 2,
      BSON_DATA_OBJECT: 3,
      BSON_DATA_ARRAY: 4,
      BSON_DATA_BINARY: 5,
      BSON_DATA_UNDEFINED: 6,
      BSON_DATA_OID: 7,
      BSON_DATA_BOOLEAN: 8,
      BSON_DATA_DATE: 9,
      BSON_DATA_NULL: 10,
      BSON_DATA_REGEXP: 11,
      BSON_DATA_DBPOINTER: 12,
      BSON_DATA_CODE: 13,
      BSON_DATA_SYMBOL: 14,
      BSON_DATA_CODE_W_SCOPE: 15,
      BSON_DATA_INT: 16,
      BSON_DATA_TIMESTAMP: 17,
      BSON_DATA_LONG: 18,
      BSON_DATA_DECIMAL128: 19,
      BSON_DATA_MIN_KEY: 255,
      BSON_DATA_MAX_KEY: 127,
      BSON_BINARY_SUBTYPE_DEFAULT: 0,
      BSON_BINARY_SUBTYPE_FUNCTION: 1,
      BSON_BINARY_SUBTYPE_BYTE_ARRAY: 2,
      BSON_BINARY_SUBTYPE_UUID: 3,
      BSON_BINARY_SUBTYPE_MD5: 4,
      BSON_BINARY_SUBTYPE_USER_DEFINED: 128
    },
    keysToCodecs = {
      $oid: objectid,
      $binary: binary,
      $symbol: symbol,
      $numberInt: int_32,
      $numberDecimal: decimal128,
      $numberDouble: double_1,
      $numberLong: long_1$1,
      $minKey: min_key,
      $maxKey: max_key,
      $regularExpression: regexp,
      $timestamp: timestamp
    };

  function deserializeValue(e, t, r, n) {
    if ("number" == typeof r) {
      if (n.relaxed) return r;
      if (Math.floor(r) === r) {
        if (BSON_INT32_MIN <= r && r <= BSON_INT32_MAX) return new int_32(r);
        if (BSON_INT64_MIN <= r && r <= BSON_INT64_MAX) return new long_1$1.fromNumber(r)
      }
      return new double_1(r)
    }
    if (null == r || "object" !== _typeof(r)) return r;
    if (r.$undefined) return null;
    for (var o = Object.keys(r).filter(function(e) {
        return e.startsWith("$") && null != r[e]
      }), i = 0; i < o.length; i++) {
      var s = keysToCodecs[o[i]];
      if (s) return s.fromExtendedJSON(r, n)
    }
    if (null != r.$date) {
      var u = r.$date,
        a = new Date;
      return "string" == typeof u ? a.setTime(Date.parse(u)) : u instanceof long_1$1 ? a.setTime(u.toNumber()) : "number" == typeof u && n.relaxed && a.setTime(u), a
    }
    if (null != r.$code) {
      var f = Object.assign({}, r);
      return r.$scope && (f.$scope = deserializeValue(e, null, r.$scope)), code$1.fromExtendedJSON(r)
    }
    if (null != r.$ref || null != r.$dbPointer) {
      var c = r.$ref ? r : r.$dbPointer;
      if (c instanceof db_ref) return c;
      var h = Object.keys(c).filter(function(e) {
          return e.startsWith("$")
        }),
        l = !0;
      if (h.forEach(function(e) {
          -1 === ["$ref", "$id", "$db"].indexOf(e) && (l = !1)
        }), l) return db_ref.fromExtendedJSON(c)
    }
    return r
  }

  function parse(e, r) {
    var n = this;
    return "boolean" == typeof(r = Object.assign({}, {
      relaxed: !0
    }, r)).relaxed && (r.strict = !r.relaxed), "boolean" == typeof r.strict && (r.relaxed = !r.strict), JSON.parse(e, function(e, t) {
      return deserializeValue(n, e, t, r)
    })
  }
  var BSON_INT32_MAX = 2147483647,
    BSON_INT32_MIN = -2147483648,
    BSON_INT64_MAX = 0x8000000000000000,
    BSON_INT64_MIN = -0x8000000000000000;

  function stringify(e, t, r, n) {
    null != r && "object" === _typeof(r) && (n = r, r = 0), null != t && "object" === _typeof(t) && (n = t, t = null, r = 0), n = Object.assign({}, {
      relaxed: !0
    }, n);
    var o = Array.isArray(e) ? serializeArray(e, n) : serializeDocument(e, n);
    return JSON.stringify(o, t, r)
  }

  function serialize(e, t) {
    return t = t || {}, JSON.parse(stringify(e, t))
  }

  function deserialize(e, t) {
    return t = t || {}, parse(JSON.stringify(e), t)
  }

  function serializeArray(e, t) {
    return e.map(function(e) {
      return serializeValue(e, t)
    })
  }

  function getISOString(e) {
    var t = e.toISOString();
    return 0 !== e.getUTCMilliseconds() ? t : t.slice(0, -5) + "Z"
  }

  function serializeValue(e, t) {
    if (Array.isArray(e)) return serializeArray(e, t);
    if (void 0 === e) return null;
    if (e instanceof Date) {
      var r = e.getTime(),
        n = -1 < r && r < 2534023188e5;
      return t.relaxed && n ? {
        $date: getISOString(e)
      } : {
        $date: {
          $numberLong: e.getTime().toString()
        }
      }
    }
    if ("number" == typeof e && !t.relaxed) {
      if (Math.floor(e) === e) {
        var o = BSON_INT64_MIN <= e && e <= BSON_INT64_MAX;
        if (BSON_INT32_MIN <= e && e <= BSON_INT32_MAX) return {
          $numberInt: e.toString()
        };
        if (o) return {
          $numberLong: e.toString()
        }
      }
      return {
        $numberDouble: e.toString()
      }
    }
    return null != e && "object" === _typeof(e) ? serializeDocument(e, t) : e
  }

  function serializeDocument(e, t) {
    if (null == e || "object" !== _typeof(e)) throw new Error("not an object instance");
    if (e._bsontype && "function" == typeof e.toExtendedJSON) return "Code" === e._bsontype && e.scope ? e.scope = serializeDocument(e.scope, t) : "DBRef" === e._bsontype && e.oid && (e.oid = serializeDocument(e.oid, t)), e.toExtendedJSON(t);
    var r = {};
    for (var n in e) {
      var o = e[n];
      if (Array.isArray(o) ? r[n] = serializeArray(o, t) : null != o && "function" == typeof o.toExtendedJSON ? ("Code" === o._bsontype && o.scope ? o.scope = serializeDocument(o.scope, t) : "DBRef" === o._bsontype && o.oid && (o.oid = serializeDocument(o.oid, t)), r[n] = o.toExtendedJSON(t)) : o instanceof Date ? r[n] = serializeValue(o, t) : null != o && "object" === _typeof(o) && (r[n] = serializeDocument(o, t)), r[n] = serializeValue(o, t), o instanceof RegExp) {
        var i = o.flags;
        void 0 === i && (i = o.toString().match(/[gimuy]*$/)[0]);
        var s = new regexp(o.source, i);
        r[n] = s.toExtendedJSON()
      }
    }
    return r
  }
  var extended_json = {
      parse: parse,
      deserialize: deserialize,
      serialize: serialize,
      stringify: stringify
    },
    FIRST_BIT = 128,
    FIRST_TWO_BITS = 192,
    FIRST_THREE_BITS = 224,
    FIRST_FOUR_BITS = 240,
    FIRST_FIVE_BITS = 248,
    TWO_BIT_CHAR = 192,
    THREE_BIT_CHAR = 224,
    FOUR_BIT_CHAR = 240,
    CONTINUING_CHAR = 128;

  function validateUtf8(e, t, r) {
    for (var n = 0, o = t; o < r; o += 1) {
      var i = e[o];
      if (n) {
        if ((i & FIRST_TWO_BITS) !== CONTINUING_CHAR) return !1;
        n -= 1
      } else if (i & FIRST_BIT)
        if ((i & FIRST_THREE_BITS) === TWO_BIT_CHAR) n = 1;
        else if ((i & FIRST_FOUR_BITS) === THREE_BIT_CHAR) n = 2;
      else {
        if ((i & FIRST_FIVE_BITS) !== FOUR_BIT_CHAR) return !1;
        n = 3
      }
    }
    return !n
  }
  var validateUtf8_1 = validateUtf8,
    validate_utf8 = {
      validateUtf8: validateUtf8_1
    },
    Buffer$2 = buffer.Buffer,
    validateUtf8$1 = validate_utf8.validateUtf8,
    JS_INT_MAX_LONG = long_1$1.fromNumber(constants.JS_INT_MAX),
    JS_INT_MIN_LONG = long_1$1.fromNumber(constants.JS_INT_MIN),
    functionCache = {};

  function deserialize$1(e, t, r) {
    var n = (t = null == t ? {} : t) && t.index ? t.index : 0,
      o = e[n] | e[n + 1] << 8 | e[n + 2] << 16 | e[n + 3] << 24;
    if (o < 5) throw new Error("bson size must be >= 5, is ".concat(o));
    if (t.allowObjectSmallerThanBufferSize && e.length < o) throw new Error("buffer length ".concat(e.length, " must be >= bson size ").concat(o));
    if (!t.allowObjectSmallerThanBufferSize && e.length !== o) throw new Error("buffer length ".concat(e.length, " must === bson size ").concat(o));
    if (o + n > e.length) throw new Error("(bson size ".concat(o, " + options.index ").concat(n, " must be <= buffer length ").concat(Buffer$2.byteLength(e), ")"));
    if (0 !== e[n + o - 1]) throw new Error("One object, sized correctly, with a spot for an EOO, but the EOO isn't 0x00");
    return deserializeObject(e, n, t, r)
  }

  function deserializeObject(e, t, r, n) {
    var o = null != r.evalFunctions && r.evalFunctions,
      i = null != r.cacheFunctions && r.cacheFunctions,
      s = null != r.cacheFunctionsCrc32 && r.cacheFunctionsCrc32;
    if (!s) var u = null;
    var a = null == r.fieldsAsRaw ? null : r.fieldsAsRaw,
      f = null != r.raw && r.raw,
      c = "boolean" == typeof r.bsonRegExp && r.bsonRegExp,
      h = null != r.promoteBuffers && r.promoteBuffers,
      l = null == r.promoteLongs || r.promoteLongs,
      d = null == r.promoteValues || r.promoteValues,
      p = t;
    if (e.length < 5) throw new Error("corrupt bson message < 5 bytes long");
    var y = e[t++] | e[t++] << 8 | e[t++] << 16 | e[t++] << 24;
    if (y < 5 || y > e.length) throw new Error("corrupt bson message");
    for (var g = n ? [] : {}, _ = 0;;) {
      var v = e[t++];
      if (0 === v) break;
      for (var E = t; 0 !== e[E] && E < e.length;) E++;
      if (E >= Buffer$2.byteLength(e)) throw new Error("Bad BSON Document: illegal CString");
      var m = n ? _++ : e.toString("utf8", t, E);
      if (t = E + 1, v === constants.BSON_DATA_STRING) {
        var A = e[t++] | e[t++] << 8 | e[t++] << 16 | e[t++] << 24;
        if (A <= 0 || A > e.length - t || 0 !== e[t + A - 1]) throw new Error("bad string length in bson");
        if (!validateUtf8$1(e, t, t + A - 1)) throw new Error("Invalid UTF-8 string in BSON document");
        var b = e.toString("utf8", t, t + A - 1);
        g[m] = b, t += A
      } else if (v === constants.BSON_DATA_OID) {
        var S = Buffer$2.alloc(12);
        e.copy(S, 0, t, t + 12), g[m] = new objectid(S), t += 12
      } else if (v === constants.BSON_DATA_INT && !1 === d) g[m] = new int_32(e[t++] | e[t++] << 8 | e[t++] << 16 | e[t++] << 24);
      else if (v === constants.BSON_DATA_INT) g[m] = e[t++] | e[t++] << 8 | e[t++] << 16 | e[t++] << 24;
      else if (v === constants.BSON_DATA_NUMBER && !1 === d) g[m] = new double_1(e.readDoubleLE(t)), t += 8;
      else if (v === constants.BSON_DATA_NUMBER) g[m] = e.readDoubleLE(t), t += 8;
      else if (v === constants.BSON_DATA_DATE) {
        var w = e[t++] | e[t++] << 8 | e[t++] << 16 | e[t++] << 24,
          R = e[t++] | e[t++] << 8 | e[t++] << 16 | e[t++] << 24;
        g[m] = new Date(new long_1$1(w, R).toNumber())
      } else if (v === constants.BSON_DATA_BOOLEAN) {
        if (0 !== e[t] && 1 !== e[t]) throw new Error("illegal boolean type value");
        g[m] = 1 === e[t++]
      } else if (v === constants.BSON_DATA_OBJECT) {
        var N = t,
          O = e[t] | e[t + 1] << 8 | e[t + 2] << 16 | e[t + 3] << 24;
        if (O <= 0 || O > e.length - t) throw new Error("bad embedded document length in bson");
        g[m] = f ? e.slice(t, t + O) : deserializeObject(e, N, r, !1), t += O
      } else if (v === constants.BSON_DATA_ARRAY) {
        var T = t,
          B = e[t] | e[t + 1] << 8 | e[t + 2] << 16 | e[t + 3] << 24,
          I = r,
          P = t + B;
        if (a && a[m]) {
          for (var C in I = {}, r) I[C] = r[C];
          I.raw = !0
        }
        if (g[m] = deserializeObject(e, T, I, !0), 0 !== e[(t += B) - 1]) throw new Error("invalid array terminator byte");
        if (t !== P) throw new Error("corrupted array bson")
      } else if (v === constants.BSON_DATA_UNDEFINED) g[m] = void 0;
      else if (v === constants.BSON_DATA_NULL) g[m] = null;
      else if (v === constants.BSON_DATA_LONG) {
        var D = e[t++] | e[t++] << 8 | e[t++] << 16 | e[t++] << 24,
          U = e[t++] | e[t++] << 8 | e[t++] << 16 | e[t++] << 24,
          x = new long_1$1(D, U);
        g[m] = l && !0 === d && x.lessThanOrEqual(JS_INT_MAX_LONG) && x.greaterThanOrEqual(JS_INT_MIN_LONG) ? x.toNumber() : x
      } else if (v === constants.BSON_DATA_DECIMAL128) {
        var L = Buffer$2.alloc(16);
        e.copy(L, 0, t, t + 16), t += 16;
        var $ = new decimal128(L);
        g[m] = $.toObject ? $.toObject() : $
      } else if (v === constants.BSON_DATA_BINARY) {
        var F = e[t++] | e[t++] << 8 | e[t++] << 16 | e[t++] << 24,
          M = F,
          k = e[t++];
        if (F < 0) throw new Error("Negative binary type element size found");
        if (F > Buffer$2.byteLength(e)) throw new Error("Binary type size larger than document size");
        if (null != e.slice) {
          if (k === binary.SUBTYPE_BYTE_ARRAY) {
            if ((F = e[t++] | e[t++] << 8 | e[t++] << 16 | e[t++] << 24) < 0) throw new Error("Negative binary type element size found for subtype 0x02");
            if (M - 4 < F) throw new Error("Binary type with subtype 0x02 contains to long binary size");
            if (F < M - 4) throw new Error("Binary type with subtype 0x02 contains to short binary size")
          }
          g[m] = h && d ? e.slice(t, t + F) : new binary(e.slice(t, t + F), k)
        } else {
          var j = "undefined" != typeof Uint8Array ? new Uint8Array(new ArrayBuffer(F)) : new Array(F);
          if (k === binary.SUBTYPE_BYTE_ARRAY) {
            if ((F = e[t++] | e[t++] << 8 | e[t++] << 16 | e[t++] << 24) < 0) throw new Error("Negative binary type element size found for subtype 0x02");
            if (M - 4 < F) throw new Error("Binary type with subtype 0x02 contains to long binary size");
            if (F < M - 4) throw new Error("Binary type with subtype 0x02 contains to short binary size")
          }
          for (E = 0; E < F; E++) j[E] = e[t + E];
          g[m] = h && d ? j : new binary(j, k)
        }
        t += F
      } else if (v === constants.BSON_DATA_REGEXP && !1 === c) {
        for (E = t; 0 !== e[E] && E < e.length;) E++;
        if (E >= e.length) throw new Error("Bad BSON Document: illegal CString");
        var K = e.toString("utf8", t, E);
        for (E = t = E + 1; 0 !== e[E] && E < e.length;) E++;
        if (E >= e.length) throw new Error("Bad BSON Document: illegal CString");
        var z = e.toString("utf8", t, E);
        t = E + 1;
        var q = new Array(z.length);
        for (E = 0; E < z.length; E++) switch (z[E]) {
          case "m":
            q[E] = "m";
            break;
          case "s":
            q[E] = "g";
            break;
          case "i":
            q[E] = "i"
        }
        g[m] = new RegExp(K, q.join(""))
      } else if (v === constants.BSON_DATA_REGEXP && !0 === c) {
        for (E = t; 0 !== e[E] && E < e.length;) E++;
        if (E >= e.length) throw new Error("Bad BSON Document: illegal CString");
        var Y = e.toString("utf8", t, E);
        for (E = t = E + 1; 0 !== e[E] && E < e.length;) E++;
        if (E >= e.length) throw new Error("Bad BSON Document: illegal CString");
        var W = e.toString("utf8", t, E);
        t = E + 1, g[m] = new regexp(Y, W)
      } else if (v === constants.BSON_DATA_SYMBOL) {
        var V = e[t++] | e[t++] << 8 | e[t++] << 16 | e[t++] << 24;
        if (V <= 0 || V > e.length - t || 0 !== e[t + V - 1]) throw new Error("bad string length in bson");
        g[m] = e.toString("utf8", t, t + V - 1), t += V
      } else if (v === constants.BSON_DATA_TIMESTAMP) {
        var J = e[t++] | e[t++] << 8 | e[t++] << 16 | e[t++] << 24,
          G = e[t++] | e[t++] << 8 | e[t++] << 16 | e[t++] << 24;
        g[m] = new timestamp(J, G)
      } else if (v === constants.BSON_DATA_MIN_KEY) g[m] = new min_key;
      else if (v === constants.BSON_DATA_MAX_KEY) g[m] = new max_key;
      else if (v === constants.BSON_DATA_CODE) {
        var H = e[t++] | e[t++] << 8 | e[t++] << 16 | e[t++] << 24;
        if (H <= 0 || H > e.length - t || 0 !== e[t + H - 1]) throw new Error("bad string length in bson");
        var X = e.toString("utf8", t, t + H - 1);
        if (o)
          if (i) {
            var Z = s ? u(X) : X;
            g[m] = isolateEvalWithHash(functionCache, Z, X, g)
          } else g[m] = isolateEval(X);
        else g[m] = new code$1(X);
        t += H
      } else if (v === constants.BSON_DATA_CODE_W_SCOPE) {
        var Q = e[t++] | e[t++] << 8 | e[t++] << 16 | e[t++] << 24;
        if (Q < 13) throw new Error("code_w_scope total size shorter minimum expected length");
        var ee = e[t++] | e[t++] << 8 | e[t++] << 16 | e[t++] << 24;
        if (ee <= 0 || ee > e.length - t || 0 !== e[t + ee - 1]) throw new Error("bad string length in bson");
        var te = e.toString("utf8", t, t + ee - 1),
          re = t += ee,
          ne = e[t] | e[t + 1] << 8 | e[t + 2] << 16 | e[t + 3] << 24,
          oe = deserializeObject(e, re, r, !1);
        if (t += ne, Q < 8 + ne + ee) throw new Error("code_w_scope total size is to short, truncating scope");
        if (8 + ne + ee < Q) throw new Error("code_w_scope total size is to long, clips outer document");
        if (o) {
          if (i) {
            var ie = s ? u(te) : te;
            g[m] = isolateEvalWithHash(functionCache, ie, te, g)
          } else g[m] = isolateEval(te);
          g[m].scope = oe
        } else g[m] = new code$1(te, oe)
      } else {
        if (v !== constants.BSON_DATA_DBPOINTER) throw new Error("Detected unknown BSON type " + v.toString(16) + ' for fieldname "' + m + '", are you using the latest BSON parser?');
        var se = e[t++] | e[t++] << 8 | e[t++] << 16 | e[t++] << 24;
        if (se <= 0 || se > e.length - t || 0 !== e[t + se - 1]) throw new Error("bad string length in bson");
        if (!validateUtf8$1(e, t, t + se - 1)) throw new Error("Invalid UTF-8 string in BSON document");
        var ue = e.toString("utf8", t, t + se - 1);
        t += se;
        var ae = Buffer$2.alloc(12);
        e.copy(ae, 0, t, t + 12);
        var fe = new objectid(ae);
        t += 12, g[m] = new db_ref(ue, fe)
      }
    }
    if (y !== t - p) {
      if (n) throw new Error("corrupt array bson");
      throw new Error("corrupt object bson")
    }
    var ce = Object.keys(g).filter(function(e) {
        return e.startsWith("$")
      }),
      he = !0;
    if (ce.forEach(function(e) {
        -1 === ["$ref", "$id", "$db"].indexOf(e) && (he = !1)
      }), !he) return g;
    if (null != g.$id && null != g.$ref) {
      var le = Object.assign({}, g);
      return delete le.$ref, delete le.$id, delete le.$db, new db_ref(g.$ref, g.$id, g.$db || null, le)
    }
    return g
  }

  function isolateEvalWithHash(functionCache, hash, functionString, object) {
    var value = null;
    return null == functionCache[hash] && (eval("value = " + functionString), functionCache[hash] = value), functionCache[hash].bind(object)
  }

  function isolateEval(functionString) {
    var value = null;
    return eval("value = " + functionString), value
  }
  var deserializer = deserialize$1;

  function readIEEE754(e, t, r, n, o) {
    var i, s, u = "big" === r,
      a = 8 * o - n - 1,
      f = (1 << a) - 1,
      c = f >> 1,
      h = -7,
      l = u ? 0 : o - 1,
      d = u ? 1 : -1,
      p = e[t + l];
    for (l += d, i = p & (1 << -h) - 1, p >>= -h, h += a; 0 < h; i = 256 * i + e[t + l], l += d, h -= 8);
    for (s = i & (1 << -h) - 1, i >>= -h, h += n; 0 < h; s = 256 * s + e[t + l], l += d, h -= 8);
    if (0 === i) i = 1 - c;
    else {
      if (i === f) return s ? NaN : 1 / 0 * (p ? -1 : 1);
      s += Math.pow(2, n), i -= c
    }
    return (p ? -1 : 1) * s * Math.pow(2, i - n)
  }

  function writeIEEE754(e, t, r, n, o, i) {
    var s, u, a, f = "big" === n,
      c = 8 * i - o - 1,
      h = (1 << c) - 1,
      l = h >> 1,
      d = 23 === o ? Math.pow(2, -24) - Math.pow(2, -77) : 0,
      p = f ? i - 1 : 0,
      y = f ? -1 : 1,
      g = t < 0 || 0 === t && 1 / t < 0 ? 1 : 0;
    for (t = Math.abs(t), isNaN(t) || t === 1 / 0 ? (u = isNaN(t) ? 1 : 0, s = h) : (s = Math.floor(Math.log(t) / Math.LN2), t * (a = Math.pow(2, -s)) < 1 && (s--, a *= 2), 2 <= (t += 1 <= s + l ? d / a : d * Math.pow(2, 1 - l)) * a && (s++, a /= 2), h <= s + l ? (u = 0, s = h) : 1 <= s + l ? (u = (t * a - 1) * Math.pow(2, o), s += l) : (u = t * Math.pow(2, l - 1) * Math.pow(2, o), s = 0)), isNaN(t) && (u = 0); 8 <= o;) e[r + p] = 255 & u, p += y, u /= 256, o -= 8;
    for (s = s << o | u, isNaN(t) && (s += 8), c += o; 0 < c;) e[r + p] = 255 & s, p += y, s /= 256, c -= 8;
    e[r + p - y] |= 128 * g
  }
  var float_parser = {
      readIEEE754: readIEEE754,
      writeIEEE754: writeIEEE754
    },
    Buffer$3 = buffer.Buffer,
    writeIEEE754$1 = float_parser.writeIEEE754,
    normalizedFunctionString$1 = utils.normalizedFunctionString,
    regexp$1 = /\x00/,
    ignoreKeys = new Set(["$db", "$ref", "$id", "$clusterTime"]),
    isDate = function(e) {
      return "object" === _typeof(e) && "[object Date]" === Object.prototype.toString.call(e)
    },
    isRegExp = function(e) {
      return "[object RegExp]" === Object.prototype.toString.call(e)
    };

  function serializeString(e, t, r, n, o) {
    e[n++] = constants.BSON_DATA_STRING;
    var i = o ? e.write(t, n, "ascii") : e.write(t, n, "utf8");
    e[(n = n + i + 1) - 1] = 0;
    var s = e.write(r, n + 4, "utf8");
    return e[n + 3] = s + 1 >> 24 & 255, e[n + 2] = s + 1 >> 16 & 255, e[n + 1] = s + 1 >> 8 & 255, e[n] = s + 1 & 255, n = n + 4 + s, e[n++] = 0, n
  }

  function serializeNumber(e, t, r, n, o) {
    if (Math.floor(r) === r && r >= constants.JS_INT_MIN && r <= constants.JS_INT_MAX)
      if (r >= constants.BSON_INT32_MIN && r <= constants.BSON_INT32_MAX) e[n++] = constants.BSON_DATA_INT, n += o ? e.write(t, n, "ascii") : e.write(t, n, "utf8"), e[n++] = 0, e[n++] = 255 & r, e[n++] = r >> 8 & 255, e[n++] = r >> 16 & 255, e[n++] = r >> 24 & 255;
      else if (r >= constants.JS_INT_MIN && r <= constants.JS_INT_MAX) {
      e[n++] = constants.BSON_DATA_NUMBER, n += o ? e.write(t, n, "ascii") : e.write(t, n, "utf8"), e[n++] = 0, writeIEEE754$1(e, r, n, "little", 52, 8), n += 8
    } else {
      e[n++] = constants.BSON_DATA_LONG, n += o ? e.write(t, n, "ascii") : e.write(t, n, "utf8"), e[n++] = 0;
      var i = long_1$1.fromNumber(r),
        s = i.getLowBits(),
        u = i.getHighBits();
      e[n++] = 255 & s, e[n++] = s >> 8 & 255, e[n++] = s >> 16 & 255, e[n++] = s >> 24 & 255, e[n++] = 255 & u, e[n++] = u >> 8 & 255, e[n++] = u >> 16 & 255, e[n++] = u >> 24 & 255
    } else e[n++] = constants.BSON_DATA_NUMBER, n += o ? e.write(t, n, "ascii") : e.write(t, n, "utf8"), e[n++] = 0, writeIEEE754$1(e, r, n, "little", 52, 8), n += 8;
    return n
  }

  function serializeNull(e, t, r, n, o) {
    return e[n++] = constants.BSON_DATA_NULL, n += o ? e.write(t, n, "ascii") : e.write(t, n, "utf8"), e[n++] = 0, n
  }

  function serializeBoolean(e, t, r, n, o) {
    return e[n++] = constants.BSON_DATA_BOOLEAN, n += o ? e.write(t, n, "ascii") : e.write(t, n, "utf8"), e[n++] = 0, e[n++] = r ? 1 : 0, n
  }

  function serializeDate(e, t, r, n, o) {
    e[n++] = constants.BSON_DATA_DATE, n += o ? e.write(t, n, "ascii") : e.write(t, n, "utf8"), e[n++] = 0;
    var i = long_1$1.fromNumber(r.getTime()),
      s = i.getLowBits(),
      u = i.getHighBits();
    return e[n++] = 255 & s, e[n++] = s >> 8 & 255, e[n++] = s >> 16 & 255, e[n++] = s >> 24 & 255, e[n++] = 255 & u, e[n++] = u >> 8 & 255, e[n++] = u >> 16 & 255, e[n++] = u >> 24 & 255, n
  }

  function serializeRegExp(e, t, r, n, o) {
    if (e[n++] = constants.BSON_DATA_REGEXP, n += o ? e.write(t, n, "ascii") : e.write(t, n, "utf8"), e[n++] = 0, r.source && null != r.source.match(regexp$1)) throw Error("value " + r.source + " must not contain null bytes");
    return n += e.write(r.source, n, "utf8"), e[n++] = 0, r.ignoreCase && (e[n++] = 105), r.global && (e[n++] = 115), r.multiline && (e[n++] = 109), e[n++] = 0, n
  }

  function serializeBSONRegExp(e, t, r, n, o) {
    if (e[n++] = constants.BSON_DATA_REGEXP, n += o ? e.write(t, n, "ascii") : e.write(t, n, "utf8"), e[n++] = 0, null != r.pattern.match(regexp$1)) throw Error("pattern " + r.pattern + " must not contain null bytes");
    return n += e.write(r.pattern, n, "utf8"), e[n++] = 0, n += e.write(r.options.split("").sort().join(""), n, "utf8"), e[n++] = 0, n
  }

  function serializeMinMax(e, t, r, n, o) {
    return console.log({
      value: r,
      MinKey: min_key,
      isMinKey: r instanceof min_key
    }), e[n++] = null === r ? constants.BSON_DATA_NULL : r instanceof min_key ? constants.BSON_DATA_MIN_KEY : constants.BSON_DATA_MAX_KEY, n += o ? e.write(t, n, "ascii") : e.write(t, n, "utf8"), e[n++] = 0, n
  }

  function serializeObjectId(e, t, r, n, o) {
    if (e[n++] = constants.BSON_DATA_OID, n += o ? e.write(t, n, "ascii") : e.write(t, n, "utf8"), e[n++] = 0, "string" == typeof r.id) e.write(r.id, n, "binary");
    else {
      if (!r.id || !r.id.copy) throw new TypeError("object [" + JSON.stringify(r) + "] is not a valid ObjectId");
      r.id.copy(e, n, 0, 12)
    }
    return n + 12
  }

  function serializeBuffer(e, t, r, n, o) {
    e[n++] = constants.BSON_DATA_BINARY, n += o ? e.write(t, n, "ascii") : e.write(t, n, "utf8"), e[n++] = 0;
    var i = r.length;
    return e[n++] = 255 & i, e[n++] = i >> 8 & 255, e[n++] = i >> 16 & 255, e[n++] = i >> 24 & 255, e[n++] = constants.BSON_BINARY_SUBTYPE_DEFAULT, r.copy(e, n, 0, i), n += i
  }

  function serializeObject(e, t, r, n, o, i, s, u, a, f) {
    for (var c = 0; c < f.length; c++)
      if (f[c] === r) throw new Error("cyclic dependency detected");
    f.push(r), e[n++] = Array.isArray(r) ? constants.BSON_DATA_ARRAY : constants.BSON_DATA_OBJECT, n += a ? e.write(t, n, "ascii") : e.write(t, n, "utf8"), e[n++] = 0;
    var h = serializeInto(e, r, o, n, i + 1, s, u, f);
    return f.pop(), h
  }

  function serializeDecimal128(e, t, r, n, o) {
    return e[n++] = constants.BSON_DATA_DECIMAL128, n += o ? e.write(t, n, "ascii") : e.write(t, n, "utf8"), e[n++] = 0, r.bytes.copy(e, n, 0, 16), n + 16
  }

  function serializeLong(e, t, r, n, o) {
    e[n++] = "Long" === r._bsontype ? constants.BSON_DATA_LONG : constants.BSON_DATA_TIMESTAMP, n += o ? e.write(t, n, "ascii") : e.write(t, n, "utf8"), e[n++] = 0;
    var i = r.getLowBits(),
      s = r.getHighBits();
    return e[n++] = 255 & i, e[n++] = i >> 8 & 255, e[n++] = i >> 16 & 255, e[n++] = i >> 24 & 255, e[n++] = 255 & s, e[n++] = s >> 8 & 255, e[n++] = s >> 16 & 255, e[n++] = s >> 24 & 255, n
  }

  function serializeInt32(e, t, r, n, o) {
    return e[n++] = constants.BSON_DATA_INT, n += o ? e.write(t, n, "ascii") : e.write(t, n, "utf8"), e[n++] = 0, e[n++] = 255 & r, e[n++] = r >> 8 & 255, e[n++] = r >> 16 & 255, e[n++] = r >> 24 & 255, n
  }

  function serializeDouble(e, t, r, n, o) {
    return e[n++] = constants.BSON_DATA_NUMBER, n += o ? e.write(t, n, "ascii") : e.write(t, n, "utf8"), e[n++] = 0, writeIEEE754$1(e, r.value, n, "little", 52, 8), n += 8
  }

  function serializeFunction(e, t, r, n, o, i, s) {
    e[n++] = constants.BSON_DATA_CODE, n += s ? e.write(t, n, "ascii") : e.write(t, n, "utf8"), e[n++] = 0;
    var u = normalizedFunctionString$1(r),
      a = e.write(u, n + 4, "utf8") + 1;
    return e[n] = 255 & a, e[n + 1] = a >> 8 & 255, e[n + 2] = a >> 16 & 255, e[n + 3] = a >> 24 & 255, n = n + 4 + a - 1, e[n++] = 0, n
  }

  function serializeCode(e, t, r, n, o, i, s, u, a) {
    if (r.scope && "object" === _typeof(r.scope)) {
      e[n++] = constants.BSON_DATA_CODE_W_SCOPE, n += a ? e.write(t, n, "ascii") : e.write(t, n, "utf8"), e[n++] = 0;
      var f = n,
        c = "string" == typeof r.code ? r.code : r.code.toString();
      n += 4;
      var h = e.write(c, n + 4, "utf8") + 1;
      e[n] = 255 & h, e[n + 1] = h >> 8 & 255, e[n + 2] = h >> 16 & 255, e[n + 3] = h >> 24 & 255, e[n + 4 + h - 1] = 0, n = n + h + 4;
      var l = serializeInto(e, r.scope, o, n, i + 1, s, u);
      n = l - 1;
      var d = l - f;
      e[f++] = 255 & d, e[f++] = d >> 8 & 255, e[f++] = d >> 16 & 255, e[f++] = d >> 24 & 255, e[n++] = 0
    } else {
      e[n++] = constants.BSON_DATA_CODE, n += a ? e.write(t, n, "ascii") : e.write(t, n, "utf8"), e[n++] = 0;
      var p = r.code.toString(),
        y = e.write(p, n + 4, "utf8") + 1;
      e[n] = 255 & y, e[n + 1] = y >> 8 & 255, e[n + 2] = y >> 16 & 255, e[n + 3] = y >> 24 & 255, n = n + 4 + y - 1, e[n++] = 0
    }
    return n
  }

  function serializeBinary(e, t, r, n, o) {
    e[n++] = constants.BSON_DATA_BINARY, n += o ? e.write(t, n, "ascii") : e.write(t, n, "utf8"), e[n++] = 0;
    var i = r.value(!0),
      s = r.position;
    return r.sub_type === binary.SUBTYPE_BYTE_ARRAY && (s += 4), e[n++] = 255 & s, e[n++] = s >> 8 & 255, e[n++] = s >> 16 & 255, e[n++] = s >> 24 & 255, e[n++] = r.sub_type, r.sub_type === binary.SUBTYPE_BYTE_ARRAY && (s -= 4, e[n++] = 255 & s, e[n++] = s >> 8 & 255, e[n++] = s >> 16 & 255, e[n++] = s >> 24 & 255), i.copy(e, n, 0, r.position), n += r.position
  }

  function serializeSymbol(e, t, r, n, o) {
    e[n++] = constants.BSON_DATA_SYMBOL, n += o ? e.write(t, n, "ascii") : e.write(t, n, "utf8"), e[n++] = 0;
    var i = e.write(r.value, n + 4, "utf8") + 1;
    return e[n] = 255 & i, e[n + 1] = i >> 8 & 255, e[n + 2] = i >> 16 & 255, e[n + 3] = i >> 24 & 255, n = n + 4 + i - 1, e[n++] = 0, n
  }

  function serializeDBRef(e, t, r, n, o, i, s) {
    e[n++] = constants.BSON_DATA_OBJECT, n += s ? e.write(t, n, "ascii") : e.write(t, n, "utf8"), e[n++] = 0;
    var u, a = n,
      f = {
        $ref: r.collection,
        $id: r.oid
      };
    null != r.db && (f.$db = r.db);
    var c = (u = serializeInto(e, f = Object.assign(f, r.fields), !1, n, o + 1, i)) - a;
    return e[a++] = 255 & c, e[a++] = c >> 8 & 255, e[a++] = c >> 16 & 255, e[a++] = c >> 24 & 255, u
  }

  function serializeInto(e, t, r, n, o, i, s, u) {
    n = n || 0, (u = u || []).push(t);
    var a = n + 4;
    if (Array.isArray(t))
      for (var f = 0; f < t.length; f++) {
        var c = "" + f,
          h = t[f];
        if (h && h.toBSON) {
          if ("function" != typeof h.toBSON) throw new TypeError("toBSON is not a function");
          h = h.toBSON()
        }
        var l = _typeof(h);
        "string" === l ? a = serializeString(e, c, h, a, !0) : "number" === l ? a = serializeNumber(e, c, h, a, !0) : "boolean" === l ? a = serializeBoolean(e, c, h, a, !0) : h instanceof Date || isDate(h) ? a = serializeDate(e, c, h, a, !0) : void 0 === h ? a = serializeNull(e, c, h, a, !0) : null === h ? a = serializeNull(e, c, h, a, !0) : "ObjectId" === h._bsontype ? a = serializeObjectId(e, c, h, a, !0) : Buffer$3.isBuffer(h) ? a = serializeBuffer(e, c, h, a, !0) : h instanceof RegExp || isRegExp(h) ? a = serializeRegExp(e, c, h, a, !0) : "object" === l && null == h._bsontype ? a = serializeObject(e, c, h, a, r, o, i, s, !0, u) : "object" === l && "Decimal128" === h._bsontype ? a = serializeDecimal128(e, c, h, a, !0) : "Long" === h._bsontype || "Timestamp" === h._bsontype ? a = serializeLong(e, c, h, a, !0) : "Double" === h._bsontype ? a = serializeDouble(e, c, h, a, !0) : "function" == typeof h && i ? a = serializeFunction(e, c, h, a, r, o, i, !0) : "Code" === h._bsontype ? a = serializeCode(e, c, h, a, r, o, i, s, !0) : "Binary" === h._bsontype ? a = serializeBinary(e, c, h, a, !0) : "Symbol" === h._bsontype ? a = serializeSymbol(e, c, h, a, !0) : "DBRef" === h._bsontype ? a = serializeDBRef(e, c, h, a, o, i, !0) : "BSONRegExp" === h._bsontype ? a = serializeBSONRegExp(e, c, h, a, !0) : "Int32" === h._bsontype ? a = serializeInt32(e, c, h, a, !0) : "MinKey" !== h._bsontype && "MaxKey" !== h._bsontype || (a = serializeMinMax(e, c, h, a, !0))
      } else if (t instanceof map)
        for (var d = t.entries(), p = !1; !p;) {
          var y = d.next();
          if (!(p = y.done)) {
            var g = y.value[0],
              _ = y.value[1],
              v = _typeof(_);
            if ("string" == typeof g && !ignoreKeys.has(g)) {
              if (null != g.match(regexp$1)) throw Error("key " + g + " must not contain null bytes");
              if (r) {
                if ("$" === g[0]) throw Error("key " + g + " must not start with '$'");
                if (~g.indexOf(".")) throw Error("key " + g + " must not contain '.'")
              }
            }
            "string" === v ? a = serializeString(e, g, _, a) : "number" === v ? a = serializeNumber(e, g, _, a) : "boolean" === v ? a = serializeBoolean(e, g, _, a) : _ instanceof Date || isDate(_) ? a = serializeDate(e, g, _, a) : null === _ || void 0 === _ && !1 === s ? a = serializeNull(e, g, _, a) : "ObjectId" === _._bsontype ? a = serializeObjectId(e, g, _, a) : Buffer$3.isBuffer(_) ? a = serializeBuffer(e, g, _, a) : _ instanceof RegExp || isRegExp(_) ? a = serializeRegExp(e, g, _, a) : "object" === v && null == _._bsontype ? a = serializeObject(e, g, _, a, r, o, i, s, !1, u) : "object" === v && "Decimal128" === _._bsontype ? a = serializeDecimal128(e, g, _, a) : "Long" === _._bsontype || "Timestamp" === _._bsontype ? a = serializeLong(e, g, _, a) : "Double" === _._bsontype ? a = serializeDouble(e, g, _, a) : "Code" === _._bsontype ? a = serializeCode(e, g, _, a, r, o, i, s) : "function" == typeof _ && i ? a = serializeFunction(e, g, _, a, r, o, i) : "Binary" === _._bsontype ? a = serializeBinary(e, g, _, a) : "Symbol" === _._bsontype ? a = serializeSymbol(e, g, _, a) : "DBRef" === _._bsontype ? a = serializeDBRef(e, g, _, a, o, i) : "BSONRegExp" === _._bsontype ? a = serializeBSONRegExp(e, g, _, a) : "Int32" === _._bsontype ? a = serializeInt32(e, g, _, a) : "MinKey" !== _._bsontype && "MaxKey" !== _._bsontype || (a = serializeMinMax(e, g, _, a))
          }
        } else {
          if (t.toBSON) {
            if ("function" != typeof t.toBSON) throw new TypeError("toBSON is not a function");
            if (null != (t = t.toBSON()) && "object" !== _typeof(t)) throw new TypeError("toBSON function did not return an object")
          }
          for (var E in t) {
            var m = t[E];
            if (m && m.toBSON) {
              if ("function" != typeof m.toBSON) throw new TypeError("toBSON is not a function");
              m = m.toBSON()
            }
            var A = _typeof(m);
            if ("string" == typeof E && !ignoreKeys.has(E)) {
              if (null != E.match(regexp$1)) throw Error("key " + E + " must not contain null bytes");
              if (r) {
                if ("$" === E[0]) throw Error("key " + E + " must not start with '$'");
                if (~E.indexOf(".")) throw Error("key " + E + " must not contain '.'")
              }
            }
            "string" === A ? a = serializeString(e, E, m, a) : "number" === A ? a = serializeNumber(e, E, m, a) : "boolean" === A ? a = serializeBoolean(e, E, m, a) : m instanceof Date || isDate(m) ? a = serializeDate(e, E, m, a) : void 0 === m ? !1 === s && (a = serializeNull(e, E, m, a)) : null === m ? a = serializeNull(e, E, m, a) : "ObjectId" === m._bsontype ? a = serializeObjectId(e, E, m, a) : Buffer$3.isBuffer(m) ? a = serializeBuffer(e, E, m, a) : m instanceof RegExp || isRegExp(m) ? a = serializeRegExp(e, E, m, a) : "object" === A && null == m._bsontype ? a = serializeObject(e, E, m, a, r, o, i, s, !1, u) : "object" === A && "Decimal128" === m._bsontype ? a = serializeDecimal128(e, E, m, a) : "Long" === m._bsontype || "Timestamp" === m._bsontype ? a = serializeLong(e, E, m, a) : "Double" === m._bsontype ? a = serializeDouble(e, E, m, a) : "Code" === m._bsontype ? a = serializeCode(e, E, m, a, r, o, i, s) : "function" == typeof m && i ? a = serializeFunction(e, E, m, a, r, o, i) : "Binary" === m._bsontype ? a = serializeBinary(e, E, m, a) : "Symbol" === m._bsontype ? a = serializeSymbol(e, E, m, a) : "DBRef" === m._bsontype ? a = serializeDBRef(e, E, m, a, o, i) : "BSONRegExp" === m._bsontype ? a = serializeBSONRegExp(e, E, m, a) : "Int32" === m._bsontype ? a = serializeInt32(e, E, m, a) : "MinKey" !== m._bsontype && "MaxKey" !== m._bsontype || (a = serializeMinMax(e, E, m, a))
          }
        }
    u.pop(), e[a++] = 0;
    var b = a - n;
    return e[n++] = 255 & b, e[n++] = b >> 8 & 255, e[n++] = b >> 16 & 255, e[n++] = b >> 24 & 255, a
  }
  var serializer = serializeInto,
    Buffer$4 = buffer.Buffer,
    normalizedFunctionString$2 = utils.normalizedFunctionString;

  function isDate$1(e) {
    return "object" === _typeof(e) && "[object Date]" === Object.prototype.toString.call(e)
  }

  function calculateObjectSize(e, t, r) {
    var n = 5;
    if (Array.isArray(e))
      for (var o = 0; o < e.length; o++) n += calculateElement(o.toString(), e[o], t, !0, r);
    else
      for (var i in e.toBSON && (e = e.toBSON()), e) n += calculateElement(i, e[i], t, !1, r);
    return n
  }

  function calculateElement(e, t, r, n, o) {
    switch (t && t.toBSON && (t = t.toBSON()), _typeof(t)) {
      case "string":
        return 1 + Buffer$4.byteLength(e, "utf8") + 1 + 4 + Buffer$4.byteLength(t, "utf8") + 1;
      case "number":
        return Math.floor(t) === t && t >= constants.JS_INT_MIN && t <= constants.JS_INT_MAX && t >= constants.BSON_INT32_MIN && t <= constants.BSON_INT32_MAX ? (null != e ? Buffer$4.byteLength(e, "utf8") + 1 : 0) + 5 : (null != e ? Buffer$4.byteLength(e, "utf8") + 1 : 0) + 9;
      case "undefined":
        return n || !o ? (null != e ? Buffer$4.byteLength(e, "utf8") + 1 : 0) + 1 : 0;
      case "boolean":
        return (null != e ? Buffer$4.byteLength(e, "utf8") + 1 : 0) + 2;
      case "object":
        if (null == t || t instanceof min_key || t instanceof max_key || "MinKey" === t._bsontype || "MaxKey" === t._bsontype) return (null != e ? Buffer$4.byteLength(e, "utf8") + 1 : 0) + 1;
        if (t instanceof objectid || "ObjectId" === t._bsontype) return (null != e ? Buffer$4.byteLength(e, "utf8") + 1 : 0) + 13;
        if (t instanceof Date || isDate$1(t)) return (null != e ? Buffer$4.byteLength(e, "utf8") + 1 : 0) + 9;
        if (void 0 !== Buffer$4 && Buffer$4.isBuffer(t)) return (null != e ? Buffer$4.byteLength(e, "utf8") + 1 : 0) + 6 + t.length;
        if (t instanceof long_1$1 || t instanceof double_1 || t instanceof timestamp || "Long" === t._bsontype || "Double" === t._bsontype || "Timestamp" === t._bsontype) return (null != e ? Buffer$4.byteLength(e, "utf8") + 1 : 0) + 9;
        if (t instanceof decimal128 || "Decimal128" === t._bsontype) return (null != e ? Buffer$4.byteLength(e, "utf8") + 1 : 0) + 17;
        if (t instanceof code$1 || "Code" === t._bsontype) return null != t.scope && 0 < Object.keys(t.scope).length ? (null != e ? Buffer$4.byteLength(e, "utf8") + 1 : 0) + 1 + 4 + 4 + Buffer$4.byteLength(t.code.toString(), "utf8") + 1 + calculateObjectSize(t.scope, r, o) : (null != e ? Buffer$4.byteLength(e, "utf8") + 1 : 0) + 1 + 4 + Buffer$4.byteLength(t.code.toString(), "utf8") + 1;
        if (t instanceof binary || "Binary" === t._bsontype) return t.sub_type === binary.SUBTYPE_BYTE_ARRAY ? (null != e ? Buffer$4.byteLength(e, "utf8") + 1 : 0) + (t.position + 1 + 4 + 1 + 4) : (null != e ? Buffer$4.byteLength(e, "utf8") + 1 : 0) + (t.position + 1 + 4 + 1);
        if (t instanceof symbol || "Symbol" === t._bsontype) return (null != e ? Buffer$4.byteLength(e, "utf8") + 1 : 0) + Buffer$4.byteLength(t.value, "utf8") + 4 + 1 + 1;
        if (t instanceof db_ref || "DBRef" === t._bsontype) {
          var i = Object.assign({
            $ref: t.collection,
            $id: t.oid
          }, t.fields);
          return null != t.db && (i.$db = t.db), (null != e ? Buffer$4.byteLength(e, "utf8") + 1 : 0) + 1 + calculateObjectSize(i, r, o)
        }
        return t instanceof RegExp || "[object RegExp]" === Object.prototype.toString.call(t) ? (null != e ? Buffer$4.byteLength(e, "utf8") + 1 : 0) + 1 + Buffer$4.byteLength(t.source, "utf8") + 1 + (t.global ? 1 : 0) + (t.ignoreCase ? 1 : 0) + (t.multiline ? 1 : 0) + 1 : t instanceof regexp || "BSONRegExp" === t._bsontype ? (null != e ? Buffer$4.byteLength(e, "utf8") + 1 : 0) + 1 + Buffer$4.byteLength(t.pattern, "utf8") + 1 + Buffer$4.byteLength(t.options, "utf8") + 1 : (null != e ? Buffer$4.byteLength(e, "utf8") + 1 : 0) + calculateObjectSize(t, r, o) + 1;
      case "function":
        if (t instanceof RegExp || "[object RegExp]" === Object.prototype.toString.call(t) || "[object RegExp]" === String.call(t)) return (null != e ? Buffer$4.byteLength(e, "utf8") + 1 : 0) + 1 + Buffer$4.byteLength(t.source, "utf8") + 1 + (t.global ? 1 : 0) + (t.ignoreCase ? 1 : 0) + (t.multiline ? 1 : 0) + 1;
        if (r && null != t.scope && 0 < Object.keys(t.scope).length) return (null != e ? Buffer$4.byteLength(e, "utf8") + 1 : 0) + 1 + 4 + 4 + Buffer$4.byteLength(normalizedFunctionString$2(t), "utf8") + 1 + calculateObjectSize(t.scope, r, o);
        if (r) return (null != e ? Buffer$4.byteLength(e, "utf8") + 1 : 0) + 1 + 4 + Buffer$4.byteLength(normalizedFunctionString$2(t), "utf8") + 1
    }
    return 0
  }
  var calculate_size = calculateObjectSize,
    Buffer$5 = buffer.Buffer,
    ensure_buffer = function(e) {
      if (e instanceof Buffer$5) return e;
      if (e instanceof Uint8Array) return Buffer$5.from(e.buffer);
      throw new TypeError("Must use either Buffer or Uint8Array")
    },
    Buffer$6 = buffer.Buffer,
    MAXSIZE = 17825792,
    buffer$1 = Buffer$6.alloc(MAXSIZE);

  function setInternalBufferSize(e) {
    buffer$1.length < e && (buffer$1 = Buffer$6.alloc(e))
  }

  function serialize$1(e, t) {
    var r = "boolean" == typeof(t = t || {}).checkKeys && t.checkKeys,
      n = "boolean" == typeof t.serializeFunctions && t.serializeFunctions,
      o = "boolean" != typeof t.ignoreUndefined || t.ignoreUndefined,
      i = "number" == typeof t.minInternalBufferSize ? t.minInternalBufferSize : MAXSIZE;
    buffer$1.length < i && (buffer$1 = Buffer$6.alloc(i));
    var s = serializer(buffer$1, e, r, 0, 0, n, o, []),
      u = Buffer$6.alloc(s);
    return buffer$1.copy(u, 0, 0, u.length), u
  }

  function serializeWithBufferAndIndex(e, t, r) {
    var n = "boolean" == typeof(r = r || {}).checkKeys && r.checkKeys,
      o = "boolean" == typeof r.serializeFunctions && r.serializeFunctions,
      i = "boolean" != typeof r.ignoreUndefined || r.ignoreUndefined,
      s = "number" == typeof r.index ? r.index : 0,
      u = serializer(buffer$1, e, n, 0, 0, o, i);
    return buffer$1.copy(t, s, 0, u), s + u - 1
  }

  function deserialize$2(e, t) {
    return e = ensure_buffer(e), deserializer(e, t)
  }

  function calculateObjectSize$1(e, t) {
    var r = "boolean" == typeof(t = t || {}).serializeFunctions && t.serializeFunctions,
      n = "boolean" != typeof t.ignoreUndefined || t.ignoreUndefined;
    return calculate_size(e, r, n)
  }

  function deserializeStream(e, t, r, n, o, i) {
    i = Object.assign({
      allowObjectSmallerThanBufferSize: !0
    }, i), e = ensure_buffer(e);
    for (var s = t, u = 0; u < r; u++) {
      var a = e[s] | e[s + 1] << 8 | e[s + 2] << 16 | e[s + 3] << 24;
      i.index = s, n[o + u] = deserializer(e, i), s += a
    }
    return s
  }
  var bson = {
      BSON_INT32_MAX: constants.BSON_INT32_MAX,
      BSON_INT32_MIN: constants.BSON_INT32_MIN,
      BSON_INT64_MAX: constants.BSON_INT64_MAX,
      BSON_INT64_MIN: constants.BSON_INT64_MIN,
      JS_INT_MAX: constants.JS_INT_MAX,
      JS_INT_MIN: constants.JS_INT_MIN,
      BSON_DATA_NUMBER: constants.BSON_DATA_NUMBER,
      BSON_DATA_STRING: constants.BSON_DATA_STRING,
      BSON_DATA_OBJECT: constants.BSON_DATA_OBJECT,
      BSON_DATA_ARRAY: constants.BSON_DATA_ARRAY,
      BSON_DATA_BINARY: constants.BSON_DATA_BINARY,
      BSON_DATA_UNDEFINED: constants.BSON_DATA_UNDEFINED,
      BSON_DATA_OID: constants.BSON_DATA_OID,
      BSON_DATA_BOOLEAN: constants.BSON_DATA_BOOLEAN,
      BSON_DATA_DATE: constants.BSON_DATA_DATE,
      BSON_DATA_NULL: constants.BSON_DATA_NULL,
      BSON_DATA_REGEXP: constants.BSON_DATA_REGEXP,
      BSON_DATA_DBPOINTER: constants.BSON_DATA_DBPOINTER,
      BSON_DATA_CODE: constants.BSON_DATA_CODE,
      BSON_DATA_SYMBOL: constants.BSON_DATA_SYMBOL,
      BSON_DATA_CODE_W_SCOPE: constants.BSON_DATA_CODE_W_SCOPE,
      BSON_DATA_INT: constants.BSON_DATA_INT,
      BSON_DATA_TIMESTAMP: constants.BSON_DATA_TIMESTAMP,
      BSON_DATA_LONG: constants.BSON_DATA_LONG,
      BSON_DATA_DECIMAL128: constants.BSON_DATA_DECIMAL128,
      BSON_DATA_MIN_KEY: constants.BSON_DATA_MIN_KEY,
      BSON_DATA_MAX_KEY: constants.BSON_DATA_MAX_KEY,
      BSON_BINARY_SUBTYPE_DEFAULT: constants.BSON_BINARY_SUBTYPE_DEFAULT,
      BSON_BINARY_SUBTYPE_FUNCTION: constants.BSON_BINARY_SUBTYPE_FUNCTION,
      BSON_BINARY_SUBTYPE_BYTE_ARRAY: constants.BSON_BINARY_SUBTYPE_BYTE_ARRAY,
      BSON_BINARY_SUBTYPE_UUID: constants.BSON_BINARY_SUBTYPE_UUID,
      BSON_BINARY_SUBTYPE_MD5: constants.BSON_BINARY_SUBTYPE_MD5,
      BSON_BINARY_SUBTYPE_USER_DEFINED: constants.BSON_BINARY_SUBTYPE_USER_DEFINED,
      Code: code$1,
      Map: map,
      BSONSymbol: symbol,
      DBRef: db_ref,
      Binary: binary,
      ObjectId: objectid,
      Long: long_1$1,
      Timestamp: timestamp,
      Double: double_1,
      Int32: int_32,
      MinKey: min_key,
      MaxKey: max_key,
      BSONRegExp: regexp,
      Decimal128: decimal128,
      serialize: serialize$1,
      serializeWithBufferAndIndex: serializeWithBufferAndIndex,
      deserialize: deserialize$2,
      calculateObjectSize: calculateObjectSize$1,
      deserializeStream: deserializeStream,
      setInternalBufferSize: setInternalBufferSize,
      ObjectID: objectid,
      EJSON: extended_json
    },
    bson_54 = bson.EJSON,
    ContentTypes = function() {
      function e() {}
      return e.APPLICATION_JSON = "application/json", e.TEXT_EVENT_STREAM = "text/event-stream", e
    }(),
    Headers = function() {
      function t() {}
      return t.getAuthorizationBearer = function(e) {
        return t.AUTHORIZATION_BEARER + " " + e
      }, t.CONTENT_TYPE = (t.CONTENT_TYPE_CANON = "Content-Type").toLocaleLowerCase(), t.AUTHORIZATION = (t.AUTHORIZATION_CANON = "Authorization").toLocaleLowerCase(), t.ACCEPT = (t.ACCEPT_CANON = "Accept").toLocaleLowerCase(), t.AUTHORIZATION_BEARER = "Bearer", t
    }(),
    __extends = (JJ = Object.setPrototypeOf || {
        __proto__: []
      }
      instanceof Array && function(e, t) {
        e.__proto__ = t
      } || function(e, t) {
        for (var r in t) t.hasOwnProperty(r) && (e[r] = t[r])
      },
      function(e, t) {
        function r() {
          this.constructor = e
        }
        JJ(e, t), e.prototype = null === t ? Object.create(t) : (r.prototype = t.prototype, new r)
      }),
    JJ, _Error = function(e) {
      Error.call(this, e), Error.captureStackTrace && Error.captureStackTrace(this), this.message = e, this.name = this.constructor.name
    };
  _Error.prototype = Object.create(Error.prototype);
  var StitchError = function(e) {
      function t() {
        return null !== e && e.apply(this, arguments) || this
      }
      return __extends(t, e), t
    }(_Error),
    _a, VJ;
  VJ = exports.StitchRequestErrorCode || (exports.StitchRequestErrorCode = {}), VJ[VJ.TRANSPORT_ERROR = 0] = "TRANSPORT_ERROR", VJ[VJ.DECODING_ERROR = 1] = "DECODING_ERROR", VJ[VJ.ENCODING_ERROR = 2] = "ENCODING_ERROR";
  var requestErrorCodeDescs = (_a = {}, _a[exports.StitchRequestErrorCode.TRANSPORT_ERROR] = "the request transport encountered an error communicating with Stitch", _a[exports.StitchRequestErrorCode.DECODING_ERROR] = "an error occurred while decoding a response from Stitch", _a[exports.StitchRequestErrorCode.ENCODING_ERROR] = "an error occurred while encoding a request for Stitch", _a),
    __extends$1 = (WJ = Object.setPrototypeOf || {
        __proto__: []
      }
      instanceof Array && function(e, t) {
        e.__proto__ = t
      } || function(e, t) {
        for (var r in t) t.hasOwnProperty(r) && (e[r] = t[r])
      },
      function(e, t) {
        function r() {
          this.constructor = e
        }
        WJ(e, t), e.prototype = null === t ? Object.create(t) : (r.prototype = t.prototype, new r)
      }),
    WJ, StitchRequestError = function(o) {
      function e(e, t) {
        var r = this,
          n = "(" + exports.StitchRequestErrorCode[t] + "): " + requestErrorCodeDescs[t] + ": " + e.message;
        return (r = o.call(this, n) || this).underlyingError = e, r.errorCode = t, r.errorCodeName = exports.StitchRequestErrorCode[t], r
      }
      return __extends$1(e, o), e
    }(StitchError),
    jK;
  jK = exports.StitchServiceErrorCode || (exports.StitchServiceErrorCode = {}), jK[jK.MissingAuthReq = 0] = "MissingAuthReq", jK[jK.InvalidSession = 1] = "InvalidSession", jK[jK.UserAppDomainMismatch = 2] = "UserAppDomainMismatch", jK[jK.DomainNotAllowed = 3] = "DomainNotAllowed", jK[jK.ReadSizeLimitExceeded = 4] = "ReadSizeLimitExceeded", jK[jK.InvalidParameter = 5] = "InvalidParameter", jK[jK.MissingParameter = 6] = "MissingParameter", jK[jK.TwilioError = 7] = "TwilioError", jK[jK.GCMError = 8] = "GCMError", jK[jK.HTTPError = 9] = "HTTPError", jK[jK.AWSError = 10] = "AWSError", jK[jK.MongoDBError = 11] = "MongoDBError", jK[jK.ArgumentsNotAllowed = 12] = "ArgumentsNotAllowed", jK[jK.FunctionExecutionError = 13] = "FunctionExecutionError", jK[jK.NoMatchingRuleFound = 14] = "NoMatchingRuleFound", jK[jK.InternalServerError = 15] = "InternalServerError", jK[jK.AuthProviderNotFound = 16] = "AuthProviderNotFound", jK[jK.AuthProviderAlreadyExists = 17] = "AuthProviderAlreadyExists", jK[jK.ServiceNotFound = 18] = "ServiceNotFound", jK[jK.ServiceTypeNotFound = 19] = "ServiceTypeNotFound", jK[jK.ServiceAlreadyExists = 20] = "ServiceAlreadyExists", jK[jK.ServiceCommandNotFound = 21] = "ServiceCommandNotFound", jK[jK.ValueNotFound = 22] = "ValueNotFound", jK[jK.ValueAlreadyExists = 23] = "ValueAlreadyExists", jK[jK.ValueDuplicateName = 24] = "ValueDuplicateName", jK[jK.FunctionNotFound = 25] = "FunctionNotFound", jK[jK.FunctionAlreadyExists = 26] = "FunctionAlreadyExists", jK[jK.FunctionDuplicateName = 27] = "FunctionDuplicateName", jK[jK.FunctionSyntaxError = 28] = "FunctionSyntaxError", jK[jK.FunctionInvalid = 29] = "FunctionInvalid", jK[jK.IncomingWebhookNotFound = 30] = "IncomingWebhookNotFound", jK[jK.IncomingWebhookAlreadyExists = 31] = "IncomingWebhookAlreadyExists", jK[jK.IncomingWebhookDuplicateName = 32] = "IncomingWebhookDuplicateName", jK[jK.RuleNotFound = 33] = "RuleNotFound", jK[jK.ApiKeyNotFound = 34] = "ApiKeyNotFound", jK[jK.RuleAlreadyExists = 35] = "RuleAlreadyExists", jK[jK.RuleDuplicateName = 36] = "RuleDuplicateName", jK[jK.AuthProviderDuplicateName = 37] = "AuthProviderDuplicateName", jK[jK.RestrictedHost = 38] = "RestrictedHost", jK[jK.ApiKeyAlreadyExists = 39] = "ApiKeyAlreadyExists", jK[jK.IncomingWebhookAuthFailed = 40] = "IncomingWebhookAuthFailed", jK[jK.ExecutionTimeLimitExceeded = 41] = "ExecutionTimeLimitExceeded", jK[jK.FunctionNotCallable = 42] = "FunctionNotCallable", jK[jK.UserAlreadyConfirmed = 43] = "UserAlreadyConfirmed", jK[jK.UserNotFound = 44] = "UserNotFound", jK[jK.UserDisabled = 45] = "UserDisabled", jK[jK.Unknown = 46] = "Unknown";
  var apiErrorCodes = {
    MissingAuthReq: exports.StitchServiceErrorCode.MissingAuthReq,
    InvalidSession: exports.StitchServiceErrorCode.InvalidSession,
    UserAppDomainMismatch: exports.StitchServiceErrorCode.UserAppDomainMismatch,
    DomainNotAllowed: exports.StitchServiceErrorCode.DomainNotAllowed,
    ReadSizeLimitExceeded: exports.StitchServiceErrorCode.ReadSizeLimitExceeded,
    InvalidParameter: exports.StitchServiceErrorCode.InvalidParameter,
    MissingParameter: exports.StitchServiceErrorCode.MissingParameter,
    TwilioError: exports.StitchServiceErrorCode.TwilioError,
    GCMError: exports.StitchServiceErrorCode.GCMError,
    HTTPError: exports.StitchServiceErrorCode.HTTPError,
    AWSError: exports.StitchServiceErrorCode.AWSError,
    MongoDBError: exports.StitchServiceErrorCode.MongoDBError,
    ArgumentsNotAllowed: exports.StitchServiceErrorCode.ArgumentsNotAllowed,
    FunctionExecutionError: exports.StitchServiceErrorCode.FunctionExecutionError,
    NoMatchingRuleFound: exports.StitchServiceErrorCode.NoMatchingRuleFound,
    InternalServerError: exports.StitchServiceErrorCode.InternalServerError,
    AuthProviderNotFound: exports.StitchServiceErrorCode.AuthProviderNotFound,
    AuthProviderAlreadyExists: exports.StitchServiceErrorCode.AuthProviderAlreadyExists,
    ServiceNotFound: exports.StitchServiceErrorCode.ServiceNotFound,
    ServiceTypeNotFound: exports.StitchServiceErrorCode.ServiceTypeNotFound,
    ServiceAlreadyExists: exports.StitchServiceErrorCode.ServiceAlreadyExists,
    ServiceCommandNotFound: exports.StitchServiceErrorCode.ServiceCommandNotFound,
    ValueNotFound: exports.StitchServiceErrorCode.ValueNotFound,
    ValueAlreadyExists: exports.StitchServiceErrorCode.ValueAlreadyExists,
    ValueDuplicateName: exports.StitchServiceErrorCode.ValueDuplicateName,
    FunctionNotFound: exports.StitchServiceErrorCode.FunctionNotFound,
    FunctionAlreadyExists: exports.StitchServiceErrorCode.FunctionAlreadyExists,
    FunctionDuplicateName: exports.StitchServiceErrorCode.FunctionDuplicateName,
    FunctionSyntaxError: exports.StitchServiceErrorCode.FunctionSyntaxError,
    FunctionInvalid: exports.StitchServiceErrorCode.FunctionInvalid,
    IncomingWebhookNotFound: exports.StitchServiceErrorCode.IncomingWebhookNotFound,
    IncomingWebhookAlreadyExists: exports.StitchServiceErrorCode.IncomingWebhookAlreadyExists,
    IncomingWebhookDuplicateName: exports.StitchServiceErrorCode.IncomingWebhookDuplicateName,
    RuleNotFound: exports.StitchServiceErrorCode.RuleNotFound,
    APIKeyNotFound: exports.StitchServiceErrorCode.ApiKeyNotFound,
    RuleAlreadyExists: exports.StitchServiceErrorCode.RuleAlreadyExists,
    RuleDuplicateName: exports.StitchServiceErrorCode.RuleDuplicateName,
    AuthProviderDuplicateName: exports.StitchServiceErrorCode.AuthProviderDuplicateName,
    RestrictedHost: exports.StitchServiceErrorCode.RestrictedHost,
    APIKeyAlreadyExists: exports.StitchServiceErrorCode.ApiKeyAlreadyExists,
    IncomingWebhookAuthFailed: exports.StitchServiceErrorCode.IncomingWebhookAuthFailed,
    ExecutionTimeLimitExceeded: exports.StitchServiceErrorCode.ExecutionTimeLimitExceeded,
    FunctionNotCallable: exports.StitchServiceErrorCode.FunctionNotCallable,
    UserAlreadyConfirmed: exports.StitchServiceErrorCode.UserAlreadyConfirmed,
    UserNotFound: exports.StitchServiceErrorCode.UserNotFound,
    UserDisabled: exports.StitchServiceErrorCode.UserDisabled
  };

  function stitchServiceErrorCodeFromApi(e) {
    return e in apiErrorCodes ? apiErrorCodes[e] : exports.StitchServiceErrorCode.Unknown
  }
  var __extends$2 = (lK = Object.setPrototypeOf || {
        __proto__: []
      }
      instanceof Array && function(e, t) {
        e.__proto__ = t
      } || function(e, t) {
        for (var r in t) t.hasOwnProperty(r) && (e[r] = t[r])
      },
      function(e, t) {
        function r() {
          this.constructor = e
        }
        lK(e, t), e.prototype = null === t ? Object.create(t) : (r.prototype = t.prototype, new r)
      }),
    lK, StitchServiceError = function(n) {
      function e(e, t) {
        void 0 === t && (t = exports.StitchServiceErrorCode.Unknown);
        var r = n.call(this, e) || this;
        return r.message = e, r.errorCode = t, r.errorCodeName = exports.StitchServiceErrorCode[t], r
      }
      return __extends$2(e, n), e
    }(StitchError),
    Fields, zK, Method, LK;

  function wrapDecodingError(e) {
    return e instanceof StitchError ? e : new StitchRequestError(e, exports.StitchRequestErrorCode.DECODING_ERROR)
  }

  function handleRequestError(t) {
    if (void 0 === t.body) throw new StitchServiceError("received unexpected status code " + t.statusCode, exports.StitchServiceErrorCode.Unknown);
    var e;
    try {
      e = t.body
    } catch (e) {
      throw new StitchServiceError("received unexpected status code " + t.statusCode, exports.StitchServiceErrorCode.Unknown)
    }
    var r = handleRichError(t, e);
    throw new StitchServiceError(r, exports.StitchServiceErrorCode.Unknown)
  }

  function handleRichError(e, t) {
    if (void 0 === e.headers[Headers.CONTENT_TYPE] || void 0 !== e.headers[Headers.CONTENT_TYPE] && e.headers[Headers.CONTENT_TYPE] !== ContentTypes.APPLICATION_JSON) return t;
    var r = JSON.parse(t);
    if (!(r instanceof Object)) return t;
    var n = r;
    if (void 0 === n[Fields.ERROR]) return t;
    var o = n[Fields.ERROR];
    if (void 0 === n[Fields.ERROR_CODE]) return o;
    var i = n[Fields.ERROR_CODE];
    throw new StitchServiceError(o, stitchServiceErrorCodeFromApi(i))
  }
  zK = Fields || (Fields = {}), zK.ERROR = "error", zK.ERROR_CODE = "error_code", LK = Method || (Method = {}), LK.GET = "GET", LK.POST = "POST", LK.PUT = "PUT", LK.DELETE = "DELETE", LK.HEAD = "HEAD", LK.OPTIONS = "OPTIONS", LK.TRACE = "TRACE", LK.PATCH = "PATCH";
  var Method$1 = Method,
    Event = function() {
      function e(e, t) {
        this.eventName = e, this.data = t
      }
      return e.MESSAGE_EVENT = "message", e
    }(),
    StitchEvent = function() {
      function h(e, t, r) {
        this.eventName = e, t = t || "";
        for (var n = [], o = 0; o < t.length; o++) {
          var i = t[o];
          switch (i) {
            case "%":
              if (o + 2 >= t.length) break;
              var s = void 0;
              switch (t.substring(o + 1, o + 3)) {
                case "25":
                  s = !0, n.push("%");
                  break;
                case "0A":
                  s = !0, n.push("\n");
                  break;
                case "0D":
                  s = !0, n.push("\r");
                  break;
                default:
                  s = !1
              }
              if (s) {
                o += 2;
                continue
              }
          }
          n.push(i)
        }
        var u = n.join("");
        switch (this.eventName) {
          case h.ERROR_EVENT_NAME:
            var a = void 0,
              f = void 0;
            try {
              var c = bson_54.parse(u, {
                strict: !1
              });
              a = c[ErrorFields.Error], f = stitchServiceErrorCodeFromApi(c[ErrorFields.ErrorCode])
            } catch (e) {
              a = u, f = exports.StitchServiceErrorCode.Unknown
            }
            this.error = new StitchServiceError(a, f);
            break;
          case Event.MESSAGE_EVENT:
            this.data = bson_54.parse(u, {
              strict: !1
            }), r && (this.data = r.decode(this.data))
        }
      }
      return h.fromEvent = function(e, t) {
        return new h(e.eventName, e.data, t)
      }, h.ERROR_EVENT_NAME = "error", h
    }(),
    ErrorFields, dL;
  dL = ErrorFields || (ErrorFields = {}), dL.Error = "error", dL.ErrorCode = "error_code";
  var Stream = function() {
      function e(e, t) {
        this.eventStream = e, this.decoder = t, this.listeners = []
      }
      return e.prototype.next = function() {
        var r = this;
        return this.eventStream.nextEvent().then(function(e) {
          var t = StitchEvent.fromEvent(e, r.decoder);
          if (t.eventName === StitchEvent.ERROR_EVENT_NAME) throw t.error;
          return t.eventName === Event.MESSAGE_EVENT ? t.data : r.next()
        })
      }, e.prototype.onNext = function(r) {
        var n = this,
          e = {
            onEvent: function(e) {
              var t = StitchEvent.fromEvent(e, n.decoder);
              t.eventName === Event.MESSAGE_EVENT && r(t.data)
            }
          };
        this.eventStream.addListener(e)
      }, e.prototype.onError = function(r) {
        var n = this,
          e = {
            onEvent: function(e) {
              var t = StitchEvent.fromEvent(e, n.decoder);
              t.eventName === StitchEvent.ERROR_EVENT_NAME && r(t.error)
            }
          };
        this.eventStream.addListener(e)
      }, e.prototype.addListener = function(r) {
        var n = this,
          e = {
            onEvent: function(e) {
              var t = StitchEvent.fromEvent(e, n.decoder);
              t.eventName === StitchEvent.ERROR_EVENT_NAME ? r.onError && r.onError(t.error) : r.onNext && r.onNext(t.data)
            }
          };
        this.listeners.push([r, e]), this.eventStream.addListener(e)
      }, e.prototype.removeListener = function(e) {
        for (var t = -1, r = 0; r < this.listeners.length; r++)
          if (this.listeners[r][0] === e) {
            t = r;
            break
          } if (-1 !== t) {
          var n = this.listeners[t][1];
          this.listeners.splice(t, 1), this.eventStream.removeListener(n)
        }
      }, e.prototype.close = function() {
        this.eventStream.close()
      }, e
    }(),
    StitchRequest = function() {
      function e(e, t, r, n, o) {
        this.method = e, this.path = t, this.headers = r, this.body = o, this.startedAt = n
      }
      return Object.defineProperty(e.prototype, "builder", {
        get: function() {
          return new e.Builder(this)
        },
        enumerable: !0,
        configurable: !0
      }), e
    }(),
    JL, KL;
  JL = StitchRequest || (StitchRequest = {}), KL = function() {
    function e(e) {
      void 0 !== e && (this.method = e.method, this.path = e.path, this.headers = e.headers, this.body = e.body, this.startedAt = e.startedAt)
    }
    return e.prototype.withMethod = function(e) {
      return this.method = e, this
    }, e.prototype.withPath = function(e) {
      return this.path = e, this
    }, e.prototype.withHeaders = function(e) {
      return this.headers = e, this
    }, e.prototype.withBody = function(e) {
      return this.body = e, this
    }, e.prototype.build = function() {
      if (void 0 === this.method) throw Error("must set method");
      if (void 0 === this.path) throw Error("must set non-empty path");
      return void 0 === this.startedAt && (this.startedAt = Date.now() / 1e3), new JL(this.method, this.path, void 0 === this.headers ? {} : this.headers, this.startedAt, this.body)
    }, e
  }(), JL.Builder = KL;
  var __extends$3 = (RL = Object.setPrototypeOf || {
        __proto__: []
      }
      instanceof Array && function(e, t) {
        e.__proto__ = t
      } || function(e, t) {
        for (var r in t) t.hasOwnProperty(r) && (e[r] = t[r])
      },
      function(e, t) {
        function r() {
          this.constructor = e
        }
        RL(e, t), e.prototype = null === t ? Object.create(t) : (r.prototype = t.prototype, new r)
      }),
    RL, StitchAuthRequest = function(o) {
      function e(e, t, r) {
        void 0 === t && (t = !1), void 0 === r && (r = !0);
        var n = o.call(this, e.method, e.path, e.headers, e.startedAt, e.body) || this;
        return n.useRefreshToken = t, n.shouldRefreshOnFailure = r, n
      }
      return __extends$3(e, o), Object.defineProperty(e.prototype, "builder", {
        get: function() {
          return new e.Builder(this)
        },
        enumerable: !0,
        configurable: !0
      }), e
    }(StitchRequest),
    eM, fM;
  eM = StitchAuthRequest || (StitchAuthRequest = {}), fM = function(t) {
    function e(e) {
      return t.call(this, e) || this
    }
    return __extends$3(e, t), e.prototype.withAccessToken = function() {
      return this.useRefreshToken = !1, this
    }, e.prototype.withRefreshToken = function() {
      return this.useRefreshToken = !0, this
    }, e.prototype.withShouldRefreshOnFailure = function(e) {
      return this.shouldRefreshOnFailure = e, this
    }, e.prototype.build = function() {
      return this.useRefreshToken && (this.shouldRefreshOnFailure = !1), new eM(t.prototype.build.call(this), this.useRefreshToken, this.shouldRefreshOnFailure)
    }, e
  }(StitchRequest.Builder), eM.Builder = fM;
  var __extends$4 = (kM = Object.setPrototypeOf || {
        __proto__: []
      }
      instanceof Array && function(e, t) {
        e.__proto__ = t
      } || function(e, t) {
        for (var r in t) t.hasOwnProperty(r) && (e[r] = t[r])
      },
      function(e, t) {
        function r() {
          this.constructor = e
        }
        kM(e, t), e.prototype = null === t ? Object.create(t) : (r.prototype = t.prototype, new r)
      }),
    kM, StitchAuthDocRequest = function(n) {
      function e(e, t) {
        var r = this;
        return (r = e instanceof StitchAuthRequest ? n.call(this, e, e.useRefreshToken, e.shouldRefreshOnFailure) || this : n.call(this, e) || this).document = t, r
      }
      return __extends$4(e, n), Object.defineProperty(e.prototype, "builder", {
        get: function() {
          return new e.Builder(this)
        },
        enumerable: !0,
        configurable: !0
      }), e
    }(StitchAuthRequest),
    yM, zM;
  yM = StitchAuthDocRequest || (StitchAuthDocRequest = {}), zM = function(r) {
    function e(e) {
      var t = r.call(this, e) || this;
      return void 0 !== e && (t.document = e.document, t.useRefreshToken = e.useRefreshToken), t
    }
    return __extends$4(e, r), e.prototype.withDocument = function(e) {
      return this.document = e, this
    }, e.prototype.withAccessToken = function() {
      return this.useRefreshToken = !1, this
    }, e.prototype.build = function() {
      if (void 0 === this.document || !(this.document instanceof Object)) throw new Error("document must be set: " + this.document);
      return void 0 === this.headers && this.withHeaders({}), this.headers[Headers.CONTENT_TYPE] = ContentTypes.APPLICATION_JSON, this.withBody(bson_54.stringify(this.document, {
        relaxed: !1
      })), new yM(r.prototype.build.call(this), this.document)
    }, e
  }(StitchAuthRequest.Builder), yM.Builder = zM;
  var __extends$5 = (FM = Object.setPrototypeOf || {
        __proto__: []
      }
      instanceof Array && function(e, t) {
        e.__proto__ = t
      } || function(e, t) {
        for (var r in t) t.hasOwnProperty(r) && (e[r] = t[r])
      },
      function(e, t) {
        function r() {
          this.constructor = e
        }
        FM(e, t), e.prototype = null === t ? Object.create(t) : (r.prototype = t.prototype, new r)
      }),
    FM, StitchDocRequest = function(n) {
      function e(e, t) {
        var r = n.call(this, e.method, e.path, e.headers, e.startedAt, e.body) || this;
        return r.document = t, r
      }
      return __extends$5(e, n), Object.defineProperty(e.prototype, "builder", {
        get: function() {
          return new e.Builder(this)
        },
        enumerable: !0,
        configurable: !0
      }), e
    }(StitchRequest),
    TM, UM, _a$1, $M;
  TM = StitchDocRequest || (StitchDocRequest = {}), UM = function(r) {
    function e(e) {
      var t = r.call(this, e) || this;
      return void 0 !== e && (t.document = e.document), t
    }
    return __extends$5(e, r), e.prototype.withDocument = function(e) {
      return this.document = e, this
    }, e.prototype.build = function() {
      if (void 0 === this.document || !(this.document instanceof Object)) throw new Error("document must be set");
      return void 0 === this.headers && this.withHeaders({}), this.headers[Headers.CONTENT_TYPE] = ContentTypes.APPLICATION_JSON, this.withBody(bson_54.stringify(this.document, {
        relaxed: !1
      })), new TM(r.prototype.build.call(this), this.document)
    }, e
  }(StitchRequest.Builder), TM.Builder = UM, $M = exports.StitchClientErrorCode || (exports.StitchClientErrorCode = {}), $M[$M.LoggedOutDuringRequest = 0] = "LoggedOutDuringRequest", $M[$M.MustAuthenticateFirst = 1] = "MustAuthenticateFirst", $M[$M.UserNoLongerValid = 2] = "UserNoLongerValid", $M[$M.CouldNotLoadPersistedAuthInfo = 3] = "CouldNotLoadPersistedAuthInfo", $M[$M.CouldNotPersistAuthInfo = 4] = "CouldNotPersistAuthInfo", $M[$M.StreamingNotSupported = 5] = "StreamingNotSupported", $M[$M.StreamClosed = 6] = "StreamClosed";
  var clientErrorCodeDescs = (_a$1 = {}, _a$1[exports.StitchClientErrorCode.LoggedOutDuringRequest] = "logged out while making a request to Stitch", _a$1[exports.StitchClientErrorCode.MustAuthenticateFirst] = "method called requires being authenticated", _a$1[exports.StitchClientErrorCode.UserNoLongerValid] = "user instance being accessed is no longer valid; please get a new user with auth.getUser()", _a$1[exports.StitchClientErrorCode.CouldNotLoadPersistedAuthInfo] = "failed to load stored auth information for Stitch", _a$1[exports.StitchClientErrorCode.CouldNotPersistAuthInfo] = "failed to save auth information for Stitch", _a$1[exports.StitchClientErrorCode.StreamingNotSupported] = "streaming not supported in this SDK", _a$1[exports.StitchClientErrorCode.StreamClosed] = "stream is closed", _a$1),
    __extends$6 = (_M = Object.setPrototypeOf || {
        __proto__: []
      }
      instanceof Array && function(e, t) {
        e.__proto__ = t
      } || function(e, t) {
        for (var r in t) t.hasOwnProperty(r) && (e[r] = t[r])
      },
      function(e, t) {
        function r() {
          this.constructor = e
        }
        _M(e, t), e.prototype = null === t ? Object.create(t) : (r.prototype = t.prototype, new r)
      }),
    _M, StitchClientError = function(n) {
      function e(e) {
        var t = this,
          r = "(" + exports.StitchClientErrorCode[e] + "): " + clientErrorCodeDescs[e];
        return (t = n.call(this, r) || this).errorCode = e, t.errorCodeName = exports.StitchClientErrorCode[e], t
      }
      return __extends$6(e, n), e
    }(StitchError),
    StitchAuthResponseCredential = function(e, t, r, n) {
      this.authInfo = e, this.providerType = t, this.providerName = r, this.asLink = n
    };

  function base64Decode(e) {
    var t, r = e.length % 4;
    0 != r ? t = e + "=".repeat(4 - r) : t = e;
    var n = toByteArray_1(t);
    return utf8Slice$1(n, 0, n.length)
  }

  function base64Encode(e) {
    var t;
    return "undefined" == typeof Uint8Array && (t = utf8ToBytes$1(e)), t = new Uint8Array(utf8ToBytes$1(e)), fromByteArray_1(t)
  }

  function utf8ToBytes$1(e) {
    for (var t, r = 1 / 0, n = e.length, o = null, i = [], s = 0; s < n; s++) {
      if (55295 < (t = e.charCodeAt(s)) && t < 57344) {
        if (!o) {
          if (56319 < t) {
            -1 < (r -= 3) && i.push(239, 191, 189);
            continue
          }
          if (s + 1 === n) {
            -1 < (r -= 3) && i.push(239, 191, 189);
            continue
          }
          o = t;
          continue
        }
        if (t < 56320) {
          -1 < (r -= 3) && i.push(239, 191, 189), o = t;
          continue
        }
        t = o - 55296 << 10 | t - 56320 | 65536, o = null
      } else o && (-1 < (r -= 3) && i.push(239, 191, 189), o = null);
      if (t < 128) {
        if ((r -= 1) < 0) break;
        i.push(t)
      } else if (t < 2048) {
        if ((r -= 2) < 0) break;
        i.push(t >> 6 | 192, 63 & t | 128)
      } else if (t < 65536) {
        if ((r -= 3) < 0) break;
        i.push(t >> 12 | 224, t >> 6 & 63 | 128, 63 & t | 128)
      } else {
        if (!(t < 2097152)) throw new Error("Invalid code point");
        if ((r -= 4) < 0) break;
        i.push(t >> 18 | 240, t >> 12 & 63 | 128, t >> 6 & 63 | 128, 63 & t | 128)
      }
    }
    return i
  }

  function utf8Slice$1(e, t, r) {
    var n = "",
      o = "";
    r = Math.min(e.length, r || 1 / 0);
    for (var i = t = t || 0; i < r; i++) e[i] <= 127 ? (n += decodeUtf8Char(o) + String.fromCharCode(e[i]), o = "") : o += "%" + e[i].toString(16);
    return n + decodeUtf8Char(o)
  }

  function decodeUtf8Char(e) {
    try {
      return decodeURIComponent(e)
    } catch (e) {
      return String.fromCharCode(65533)
    }
  }
  var EXPIRES = "exp",
    ISSUED_AT = "iat",
    JWT = function() {
      function n(e, t) {
        this.expires = e, this.issuedAt = t
      }
      return n.fromEncoded = function(e) {
        var t = n.splitToken(e),
          r = JSON.parse(base64Decode(t[1]));
        return new n(r[EXPIRES], r[ISSUED_AT])
      }, n.splitToken = function(e) {
        var t = e.split(".");
        if (3 !== t.length) throw new Error("Malformed JWT token. The string " + e + " should have 3 parts.");
        return t
      }, n
    }(),
    SLEEP_MILLIS = 6e4,
    EXPIRATION_WINDOW_SECS = 300,
    AccessTokenRefresher = function() {
      function e(e) {
        this.auth = e
      }
      return e.prototype.shouldRefresh = function() {
        var e = this.auth;
        if (void 0 === e) return !1;
        if (!e.isLoggedIn) return !1;
        var t, r = e.authInfo;
        if (void 0 === r) return !1;
        try {
          t = JWT.fromEncoded(r.accessToken)
        } catch (e) {
          return console.log(e), !1
        }
        return !(Date.now() / 1e3 < t.expires - EXPIRATION_WINDOW_SECS)
      }, e.prototype.run = function() {
        var e = this;
        this.shouldRefresh() ? this.auth.refreshAccessToken().then(function() {
          e.nextTimeout = setTimeout(function() {
            return e.run()
          }, SLEEP_MILLIS)
        }).catch(function() {
          e.nextTimeout = setTimeout(function() {
            return e.run()
          }, SLEEP_MILLIS)
        }) : this.nextTimeout = setTimeout(function() {
          return e.run()
        }, SLEEP_MILLIS)
      }, e.prototype.stop = function() {
        clearTimeout(this.nextTimeout)
      }, e
    }(),
    __extends$7 = (dO = Object.setPrototypeOf || {
        __proto__: []
      }
      instanceof Array && function(e, t) {
        e.__proto__ = t
      } || function(e, t) {
        for (var r in t) t.hasOwnProperty(r) && (e[r] = t[r])
      },
      function(e, t) {
        function r() {
          this.constructor = e
        }
        dO(e, t), e.prototype = null === t ? Object.create(t) : (r.prototype = t.prototype, new r)
      }),
    dO, Fields$1, mO;
  mO = Fields$1 || (Fields$1 = {}), mO.USER_ID = "user_id", mO.DEVICE_ID = "device_id", mO.ACCESS_TOKEN = "access_token", mO.REFRESH_TOKEN = "refresh_token";
  var ApiAuthInfo = function(o) {
      function t(e, t, r, n) {
        return o.call(this, e, t, r, n) || this
      }
      return __extends$7(t, o), t.fromJSON = function(e) {
        return new t(e[Fields$1.USER_ID], e[Fields$1.DEVICE_ID], e[Fields$1.ACCESS_TOKEN], e[Fields$1.REFRESH_TOKEN])
      }, t.prototype.toJSON = function() {
        var e;
        return (e = {})[Fields$1.USER_ID] = this.userId, e[Fields$1.DEVICE_ID] = this.deviceId, e[Fields$1.ACCESS_TOKEN] = this.accessToken, e[Fields$1.REFRESH_TOKEN] = this.refreshToken, e
      }, t
    }(AuthInfo),
    Assertions = function() {
      function e() {}
      return e.keyPresent = function(e, t) {
        if (void 0 === t[e]) throw new Error("expected " + e + " to be present")
      }, e
    }(),
    NAME = "name",
    EMAIL = "email",
    PICTURE_Url = "picture",
    FIRST_NAME = "first_name",
    LAST_NAME = "last_name",
    GENDER = "gender",
    BIRTHDAY = "birthday",
    MIN_AGE = "min_age",
    MAX_AGE = "max_age",
    StitchUserProfileImpl = function() {
      function e(e, t, r) {
        void 0 === t && (t = {}), void 0 === r && (r = []), this.userType = e, this.data = t, this.identities = r
      }
      return e.empty = function() {
        return new e
      }, Object.defineProperty(e.prototype, "name", {
        get: function() {
          return this.data[NAME]
        },
        enumerable: !0,
        configurable: !0
      }), Object.defineProperty(e.prototype, "email", {
        get: function() {
          return this.data[EMAIL]
        },
        enumerable: !0,
        configurable: !0
      }), Object.defineProperty(e.prototype, "pictureUrl", {
        get: function() {
          return this.data[PICTURE_Url]
        },
        enumerable: !0,
        configurable: !0
      }), Object.defineProperty(e.prototype, "firstName", {
        get: function() {
          return this.data[FIRST_NAME]
        },
        enumerable: !0,
        configurable: !0
      }), Object.defineProperty(e.prototype, "lastName", {
        get: function() {
          return this.data[LAST_NAME]
        },
        enumerable: !0,
        configurable: !0
      }), Object.defineProperty(e.prototype, "gender", {
        get: function() {
          return this.data[GENDER]
        },
        enumerable: !0,
        configurable: !0
      }), Object.defineProperty(e.prototype, "birthday", {
        get: function() {
          return this.data[BIRTHDAY]
        },
        enumerable: !0,
        configurable: !0
      }), Object.defineProperty(e.prototype, "minAge", {
        get: function() {
          var e = this.data[MIN_AGE];
          if (void 0 !== e) return e
        },
        enumerable: !0,
        configurable: !0
      }), Object.defineProperty(e.prototype, "maxAge", {
        get: function() {
          var e = this.data[MAX_AGE];
          if (void 0 !== e) return e
        },
        enumerable: !0,
        configurable: !0
      }), e
    }(),
    StitchUserIdentity = function(e, t) {
      this.id = e, this.providerType = t
    },
    __extends$8 = (HO = Object.setPrototypeOf || {
        __proto__: []
      }
      instanceof Array && function(e, t) {
        e.__proto__ = t
      } || function(e, t) {
        for (var r in t) t.hasOwnProperty(r) && (e[r] = t[r])
      },
      function(e, t) {
        function r() {
          this.constructor = e
        }
        HO(e, t), e.prototype = null === t ? Object.create(t) : (r.prototype = t.prototype, new r)
      }),
    HO, Fields$2, QO;
  QO = Fields$2 || (Fields$2 = {}), QO.ID = "id", QO.PROVIDER_TYPE = "provider_type";
  var ApiStitchUserIdentity = function(r) {
      function t(e, t) {
        return r.call(this, e, t) || this
      }
      return __extends$8(t, r), t.fromJSON = function(e) {
        return new t(e[Fields$2.ID], e[Fields$2.PROVIDER_TYPE])
      }, t.prototype.toJSON = function() {
        var e;
        return (e = {})[Fields$2.ID] = this.id, e[Fields$2.PROVIDER_TYPE] = this.providerType, e
      }, t
    }(StitchUserIdentity),
    __extends$9 = (XO = Object.setPrototypeOf || {
        __proto__: []
      }
      instanceof Array && function(e, t) {
        e.__proto__ = t
      } || function(e, t) {
        for (var r in t) t.hasOwnProperty(r) && (e[r] = t[r])
      },
      function(e, t) {
        function r() {
          this.constructor = e
        }
        XO(e, t), e.prototype = null === t ? Object.create(t) : (r.prototype = t.prototype, new r)
      }),
    XO, Fields$3, eP;
  eP = Fields$3 || (Fields$3 = {}), eP.DATA = "data", eP.USER_TYPE = "type", eP.IDENTITIES = "identities";
  var ApiCoreUserProfile = function(n) {
      function t(e, t, r) {
        return n.call(this, e, t, r) || this
      }
      return __extends$9(t, n), t.fromJSON = function(e) {
        return Assertions.keyPresent(Fields$3.USER_TYPE, e), Assertions.keyPresent(Fields$3.DATA, e), Assertions.keyPresent(Fields$3.IDENTITIES, e), new t(e[Fields$3.USER_TYPE], e[Fields$3.DATA], e[Fields$3.IDENTITIES].map(ApiStitchUserIdentity.fromJSON))
      }, t.prototype.toJSON = function() {
        var e;
        return (e = {})[Fields$3.DATA] = this.data, e[Fields$3.USER_TYPE] = this.userType, e[Fields$3.IDENTITIES] = this.identities, e
      }, t
    }(StitchUserProfileImpl),
    __extends$a = (mP = Object.setPrototypeOf || {
        __proto__: []
      }
      instanceof Array && function(e, t) {
        e.__proto__ = t
      } || function(e, t) {
        for (var r in t) t.hasOwnProperty(r) && (e[r] = t[r])
      },
      function(e, t) {
        function r() {
          this.constructor = e
        }
        mP(e, t), e.prototype = null === t ? Object.create(t) : (r.prototype = t.prototype, new r)
      }),
    mP, Fields$4, vP;
  vP = Fields$4 || (Fields$4 = {}), vP.ID = "id", vP.PROVIDER_TYPE = "provider_type";
  var StoreStitchUserIdentity = function(r) {
      function t(e, t) {
        return r.call(this, e, t) || this
      }
      return __extends$a(t, r), t.decode = function(e) {
        return new t(e[Fields$4.ID], e[Fields$4.PROVIDER_TYPE])
      }, t.prototype.encode = function() {
        var e;
        return (e = {})[Fields$4.ID] = this.id, e[Fields$4.PROVIDER_TYPE] = this.providerType, e
      }, t
    }(StitchUserIdentity),
    __extends$b = (CP = Object.setPrototypeOf || {
        __proto__: []
      }
      instanceof Array && function(e, t) {
        e.__proto__ = t
      } || function(e, t) {
        for (var r in t) t.hasOwnProperty(r) && (e[r] = t[r])
      },
      function(e, t) {
        function r() {
          this.constructor = e
        }
        CP(e, t), e.prototype = null === t ? Object.create(t) : (r.prototype = t.prototype, new r)
      }),
    CP, Fields$5, LP;
  LP = Fields$5 || (Fields$5 = {}), LP.DATA = "data", LP.USER_TYPE = "type", LP.IDENTITIES = "identities";
  var StoreCoreUserProfile = function(o) {
      function t(e, t, r) {
        var n = o.call(this, e, t, r) || this;
        return n.userType = e, n.data = t, n.identities = r, n
      }
      return __extends$b(t, o), t.decode = function(e) {
        return e ? new t(e[Fields$5.USER_TYPE], e[Fields$5.DATA], e[Fields$5.IDENTITIES].map(function(e) {
          return StoreStitchUserIdentity.decode(e)
        })) : void 0
      }, t.prototype.encode = function() {
        var e;
        return (e = {})[Fields$5.DATA] = this.data, e[Fields$5.USER_TYPE] = this.userType, e[Fields$5.IDENTITIES] = this.identities.map(function(e) {
          return e.encode()
        }), e
      }, t
    }(StitchUserProfileImpl),
    __extends$c = (WP = Object.setPrototypeOf || {
        __proto__: []
      }
      instanceof Array && function(e, t) {
        e.__proto__ = t
      } || function(e, t) {
        for (var r in t) t.hasOwnProperty(r) && (e[r] = t[r])
      },
      function(e, t) {
        function r() {
          this.constructor = e
        }
        WP(e, t), e.prototype = null === t ? Object.create(t) : (r.prototype = t.prototype, new r)
      }),
    WP, Fields$6, dQ;

  function readFromStorage(e) {
    var t = e.get(StoreAuthInfo.STORAGE_NAME);
    if (t) return StoreAuthInfo.decode(JSON.parse(t))
  }

  function writeToStorage(e, t) {
    var r = new StoreAuthInfo(e.userId, e.deviceId, e.accessToken, e.refreshToken, e.loggedInProviderType, e.loggedInProviderName, e.userProfile ? new StoreCoreUserProfile(e.userProfile.userType, e.userProfile.data, e.userProfile.identities.map(function(e) {
      return new StoreStitchUserIdentity(e.id, e.providerType)
    })) : void 0);
    t.set(StoreAuthInfo.STORAGE_NAME, JSON.stringify(r.encode()))
  }
  dQ = Fields$6 || (Fields$6 = {}), dQ.USER_ID = "user_id", dQ.DEVICE_ID = "device_id", dQ.ACCESS_TOKEN = "access_token", dQ.REFRESH_TOKEN = "refresh_token", dQ.LOGGED_IN_PROVIDER_TYPE = "logged_in_provider_type", dQ.LOGGED_IN_PROVIDER_NAME = "logged_in_provider_name", dQ.USER_PROFILE = "user_profile";
  var StoreAuthInfo = function(a) {
      function f(e, t, r, n, o, i, s) {
        var u = a.call(this, e, t, r, n, o, i, s) || this;
        return u.userProfile = s, u
      }
      return __extends$c(f, a), f.decode = function(e) {
        var t = e[Fields$6.USER_ID],
          r = e[Fields$6.DEVICE_ID],
          n = e[Fields$6.ACCESS_TOKEN],
          o = e[Fields$6.REFRESH_TOKEN],
          i = e[Fields$6.LOGGED_IN_PROVIDER_TYPE],
          s = e[Fields$6.LOGGED_IN_PROVIDER_NAME],
          u = e[Fields$6.USER_PROFILE];
        return new f(t, r, n, o, i, s, StoreCoreUserProfile.decode(u))
      }, f.prototype.encode = function() {
        var e = {};
        return e[Fields$6.USER_ID] = this.userId, e[Fields$6.ACCESS_TOKEN] = this.accessToken, e[Fields$6.REFRESH_TOKEN] = this.refreshToken, e[Fields$6.DEVICE_ID] = this.deviceId, e[Fields$6.LOGGED_IN_PROVIDER_NAME] = this.loggedInProviderName, e[Fields$6.LOGGED_IN_PROVIDER_TYPE] = this.loggedInProviderType, e[Fields$6.USER_PROFILE] = this.userProfile ? this.userProfile.encode() : void 0, e
      }, f.STORAGE_NAME = "auth_info", f
    }(AuthInfo),
    OPTIONS = "options",
    DEVICE = "device",
    CoreStitchAuth = function() {
      function e(e, t, r, n) {
        var o;
        void 0 === n && (n = !0), this.requestClient = e, this.authRoutes = t, this.storage = r;
        try {
          o = readFromStorage(r)
        } catch (e) {
          throw new StitchClientError(exports.StitchClientErrorCode.CouldNotLoadPersistedAuthInfo)
        }
        this.authInfo = void 0 === o ? AuthInfo.empty() : o, this.prepUser(), n && (this.accessTokenRefresher = new AccessTokenRefresher(this), this.accessTokenRefresher.run())
      }
      return Object.defineProperty(e.prototype, "isLoggedIn", {
        get: function() {
          return void 0 !== this.currentUser
        },
        enumerable: !0,
        configurable: !0
      }), Object.defineProperty(e.prototype, "user", {
        get: function() {
          return this.currentUser
        },
        enumerable: !0,
        configurable: !0
      }), e.prototype.doAuthenticatedRequest = function(t) {
        var r = this;
        return this.requestClient.doRequest(this.prepareAuthRequest(t)).catch(function(e) {
          return r.handleAuthFailure(e, t)
        })
      }, e.prototype.doAuthenticatedRequestWithDecoder = function(e, r) {
        return this.doAuthenticatedRequest(e).then(function(e) {
          var t = bson_54.parse(e.body, {
            strict: !1
          });
          return r ? r.decode(t) : t
        }).catch(function(e) {
          throw wrapDecodingError(e)
        })
      }, e.prototype.openAuthenticatedEventStream = function(t, r) {
        var e, n = this;
        if (void 0 === r && (r = !0), !this.isLoggedIn) throw new StitchClientError(exports.StitchClientErrorCode.MustAuthenticateFirst);
        return e = t.useRefreshToken ? this.authInfo.refreshToken : this.authInfo.accessToken, this.requestClient.doStreamRequest(t.builder.withPath(t.path + "&stitch_at=" + e).build(), r, function() {
          return n.openAuthenticatedEventStream(t, !1)
        }).catch(function(e) {
          return n.handleAuthFailureForEventStream(e, t, r)
        })
      }, e.prototype.openAuthenticatedStreamWithDecoder = function(e, t) {
        return this.openAuthenticatedEventStream(e).then(function(e) {
          return new Stream(e, t)
        })
      }, e.prototype.refreshAccessToken = function() {
        var r = this,
          e = (new StitchAuthRequest.Builder).withRefreshToken().withPath(this.authRoutes.sessionRoute).withMethod(Method$1.POST);
        return this.doAuthenticatedRequest(e.build()).then(function(e) {
          try {
            var t = ApiAuthInfo.fromJSON(JSON.parse(e.body));
            r.authInfo = r.authInfo.merge(t)
          } catch (e) {
            throw new StitchRequestError(e, exports.StitchRequestErrorCode.DECODING_ERROR)
          }
          try {
            writeToStorage(r.authInfo, r.storage)
          } catch (e) {
            throw new StitchClientError(exports.StitchClientErrorCode.CouldNotPersistAuthInfo)
          }
        })
      }, e.prototype.loginWithCredentialInternal = function(e) {
        return e instanceof StitchAuthResponseCredential ? this.processLogin(e, e.authInfo, e.asLink) : this.isLoggedIn ? e.providerCapabilities.reusesExistingSession && e.providerType === this.currentUser.loggedInProviderType ? Promise.resolve(this.currentUser) : (this.logoutInternal(), this.doLogin(e, !1)) : this.doLogin(e, !1)
      }, e.prototype.linkUserWithCredentialInternal = function(e, t) {
        return void 0 !== this.currentUser && e.id !== this.currentUser.id ? Promise.reject(new StitchClientError(exports.StitchClientErrorCode.UserNoLongerValid)) : this.doLogin(t, !0)
      }, e.prototype.logoutInternal = function() {
        var e = this;
        return this.isLoggedIn ? this.doLogout().then(function() {
          e.clearAuth()
        }).catch(function() {
          e.clearAuth()
        }) : Promise.resolve()
      }, Object.defineProperty(e.prototype, "hasDeviceId", {
        get: function() {
          return void 0 !== this.authInfo.deviceId && "" !== this.authInfo.deviceId && "000000000000000000000000" !== this.authInfo.deviceId
        },
        enumerable: !0,
        configurable: !0
      }), Object.defineProperty(e.prototype, "deviceId", {
        get: function() {
          if (this.hasDeviceId) return this.authInfo.deviceId
        },
        enumerable: !0,
        configurable: !0
      }), e.prototype.prepareAuthRequest = function(e) {
        if (!this.isLoggedIn) throw new StitchClientError(exports.StitchClientErrorCode.MustAuthenticateFirst);
        var t = e.builder,
          r = t.headers || {};
        return e.useRefreshToken ? r[Headers.AUTHORIZATION] = Headers.getAuthorizationBearer(this.authInfo.refreshToken) : r[Headers.AUTHORIZATION] = Headers.getAuthorizationBearer(this.authInfo.accessToken), t.withHeaders(r), t.build()
      }, e.prototype.handleAuthFailureForEventStream = function(e, t, r) {
        var n = this;
        if (void 0 === r && (r = !0), !(e instanceof StitchServiceError) || e.errorCode !== exports.StitchServiceErrorCode.InvalidSession) throw e;
        if (t.useRefreshToken || !t.shouldRefreshOnFailure) throw this.clearAuth(), e;
        return this.tryRefreshAccessToken(t.startedAt).then(function() {
          return n.openAuthenticatedEventStream(t.builder.withShouldRefreshOnFailure(!1).build(), r)
        })
      }, e.prototype.handleAuthFailure = function(e, t) {
        var r = this;
        if (!(e instanceof StitchServiceError) || e.errorCode !== exports.StitchServiceErrorCode.InvalidSession) throw e;
        if (t.useRefreshToken || !t.shouldRefreshOnFailure) throw this.clearAuth(), e;
        return this.tryRefreshAccessToken(t.startedAt).then(function() {
          return r.doAuthenticatedRequest(t.builder.withShouldRefreshOnFailure(!1).build())
        })
      }, e.prototype.tryRefreshAccessToken = function(e) {
        if (!this.isLoggedIn) throw new StitchClientError(exports.StitchClientErrorCode.LoggedOutDuringRequest);
        try {
          if (JWT.fromEncoded(this.authInfo.accessToken).issuedAt >= e) return Promise.resolve()
        } catch (e) {}
        return this.refreshAccessToken()
      }, e.prototype.prepUser = function() {
        void 0 !== this.authInfo.userId && (this.currentUser = this.userFactory.makeUser(this.authInfo.userId, this.authInfo.loggedInProviderType, this.authInfo.loggedInProviderName, this.authInfo.userProfile))
      }, e.prototype.attachAuthOptions = function(e) {
        var t = {};
        t[DEVICE] = this.deviceInfo, e[OPTIONS] = t
      }, e.prototype.doLogin = function(t, r) {
        var n = this;
        return this.doLoginRequest(t, r).then(function(e) {
          return n.processLoginResponse(t, e, r)
        }).then(function(e) {
          return n.onAuthEvent(), e
        })
      }, e.prototype.doLoginRequest = function(e, t) {
        var r = new StitchDocRequest.Builder;
        r.withMethod(Method$1.POST), t ? r.withPath(this.authRoutes.getAuthProviderLinkRoute(e.providerName)) : r.withPath(this.authRoutes.getAuthProviderLoginRoute(e.providerName));
        var n = e.material;
        if (this.attachAuthOptions(n), r.withDocument(n), !t) return this.requestClient.doRequest(r.build());
        var o = new StitchAuthDocRequest(r.build(), r.document);
        return this.doAuthenticatedRequest(o)
      }, e.prototype.processLogin = function(t, r, n) {
        var o = this,
          i = this.authInfo,
          s = this.currentUser;
        return r = this.authInfo.merge(new AuthInfo(r.userId, r.deviceId, r.accessToken, r.refreshToken, t.providerType, t.providerName, void 0)), this.authInfo = r, this.currentUser = this.userFactory.makeUser(this.authInfo.userId, t.providerType, t.providerName, void 0), this.doGetUserProfile().then(function(e) {
          r = r.merge(new AuthInfo(r.userId, r.deviceId, r.accessToken, r.refreshToken, t.providerType, t.providerName, e));
          try {
            writeToStorage(r, o.storage)
          } catch (e) {
            throw new StitchClientError(exports.StitchClientErrorCode.CouldNotPersistAuthInfo)
          }
          return o.authInfo = r, o.currentUser = o.userFactory.makeUser(o.authInfo.userId, t.providerType, t.providerName, e), o.currentUser
        }).catch(function(e) {
          throw n ? (o.authInfo = i, o.currentUser = s) : o.clearAuth(), e
        })
      }, e.prototype.processLoginResponse = function(e, t, r) {
        try {
          if (!t) throw new StitchServiceError("the login response could not be processed for credential: " + e + ";response was undefined");
          if (!t.body) throw new StitchServiceError("response with status code " + t.statusCode + " has empty body");
          return this.processLogin(e, ApiAuthInfo.fromJSON(JSON.parse(t.body)), r)
        } catch (e) {
          throw new StitchRequestError(e, exports.StitchRequestErrorCode.DECODING_ERROR)
        }
      }, e.prototype.doGetUserProfile = function() {
        var e = new StitchAuthRequest.Builder;
        return e.withMethod(Method$1.GET).withPath(this.authRoutes.profileRoute), this.doAuthenticatedRequest(e.build()).then(function(e) {
          return ApiCoreUserProfile.fromJSON(JSON.parse(e.body))
        }).catch(function(e) {
          throw e instanceof StitchError ? e : new StitchRequestError(e, exports.StitchRequestErrorCode.DECODING_ERROR)
        })
      }, e.prototype.doLogout = function() {
        var e = new StitchAuthRequest.Builder;
        return e.withRefreshToken().withPath(this.authRoutes.sessionRoute).withMethod(Method$1.DELETE), this.doAuthenticatedRequest(e.build()).then(function() {})
      }, e.prototype.clearAuth = function() {
        if (this.isLoggedIn) {
          this.authInfo = this.authInfo.loggedOut();
          try {
            writeToStorage(this.authInfo, this.storage)
          } catch (e) {
            throw new StitchClientError(exports.StitchClientErrorCode.CouldNotPersistAuthInfo)
          }
          this.currentUser = void 0, this.onAuthEvent()
        }
      }, e.prototype.close = function() {
        this.accessTokenRefresher && this.accessTokenRefresher.stop()
      }, e
    }(),
    CoreStitchUserImpl = function() {
      function e(e, t, r, n) {
        this.id = e, this.loggedInProviderType = t, this.loggedInProviderName = r, this.profile = void 0 === n ? StitchUserProfileImpl.empty() : n
      }
      return Object.defineProperty(e.prototype, "userType", {
        get: function() {
          return this.profile.userType
        },
        enumerable: !0,
        configurable: !0
      }), Object.defineProperty(e.prototype, "identities", {
        get: function() {
          return this.profile.identities
        },
        enumerable: !0,
        configurable: !0
      }), e
    }(),
    DeviceFields, cS;
  cS = DeviceFields || (DeviceFields = {}), cS.DEVICE_ID = "deviceId", cS.APP_ID = "appId", cS.APP_VERSION = "appVersion", cS.PLATFORM = "platform", cS.PLATFORM_VERSION = "platformVersion", cS.SDK_VERSION = "sdkVersion";
  var DeviceFields$1 = DeviceFields,
    AnonymousAuthProvider = function() {
      function e() {}
      return e.TYPE = "anon-user", e.DEFAULT_NAME = "anon-user", e
    }(),
    ProviderCapabilities = function(e) {
      void 0 === e && (e = !1), this.reusesExistingSession = e
    },
    AnonymousCredential = function(e) {
      void 0 === e && (e = AnonymousAuthProvider.DEFAULT_NAME), this.providerType = AnonymousAuthProvider.TYPE, this.material = {}, this.providerCapabilities = new ProviderCapabilities(!0), this.providerName = e
    },
    CustomAuthProvider = function() {
      function e() {}
      return e.TYPE = "custom-token", e.DEFAULT_NAME = "custom-token", e
    }(),
    Fields$7;
  (Fields$7 || (Fields$7 = {})).TOKEN = "token";
  var CustomCredential = function(e, t) {
      var r;
      void 0 === t && (t = CustomAuthProvider.DEFAULT_NAME), this.providerType = CustomAuthProvider.TYPE, this.providerCapabilities = new ProviderCapabilities(!1), this.providerName = t, this.token = e, this.material = ((r = {})[Fields$7.TOKEN] = this.token, r)
    },
    FacebookAuthProvider = function() {
      function e() {}
      return e.TYPE = "oauth2-facebook", e.DEFAULT_NAME = "oauth2-facebook", e
    }(),
    Fields$8;
  (Fields$8 || (Fields$8 = {})).ACCESS_TOKEN = "accessToken";
  var FacebookCredential = function() {
      function e(e, t) {
        var r;
        void 0 === t && (t = FacebookAuthProvider.DEFAULT_NAME), this.providerType = FacebookAuthProvider.TYPE, this.providerName = t, this.accessToken = e, this.material = ((r = {})[Fields$8.ACCESS_TOKEN] = this.accessToken, r)
      }
      return Object.defineProperty(e.prototype, "providerCapabilities", {
        get: function() {
          return new ProviderCapabilities(!1)
        },
        enumerable: !0,
        configurable: !0
      }), e
    }(),
    GoogleAuthProvider = function() {
      function e() {}
      return e.TYPE = "oauth2-google", e.DEFAULT_NAME = "oauth2-google", e
    }(),
    Fields$9;
  (Fields$9 || (Fields$9 = {})).AUTH_CODE = "authCode";
  var GoogleCredential = function(e, t) {
      var r;
      void 0 === t && (t = GoogleAuthProvider.DEFAULT_NAME), this.providerType = GoogleAuthProvider.TYPE, this.providerCapabilities = new ProviderCapabilities(!1), this.providerName = t, this.authCode = e, this.material = ((r = {})[Fields$9.AUTH_CODE] = this.authCode, r)
    },
    ServerApiKeyAuthProvider = function() {
      function e() {}
      return e.TYPE = "api-key", e.DEFAULT_NAME = "api-key", e
    }(),
    Fields$a;
  (Fields$a || (Fields$a = {})).KEY = "key";
  var ServerApiKeyCredential = function(e, t) {
      var r;
      void 0 === t && (t = ServerApiKeyAuthProvider.DEFAULT_NAME), this.providerType = ServerApiKeyAuthProvider.TYPE, this.providerCapabilities = new ProviderCapabilities(!1), this.providerName = t, this.key = e, this.material = ((r = {})[Fields$a.KEY] = this.key, r)
    },
    CoreAuthProviderClient = function(e, t, r) {
      this.providerName = e, this.requestClient = t, this.baseRoute = r
    },
    Fields$b, KS;
  KS = Fields$b || (Fields$b = {}), KS.ID = "_id", KS.KEY = "key", KS.NAME = "name", KS.DISABLED = "disabled";
  var UserApiKey = function() {
      function r(e, t, r, n) {
        this.id = bson.ObjectID.createFromHexString(e), this.key = t, this.name = r, this.disabled = n
      }
      return r.readFromApi = function(e) {
        var t = "string" == typeof e ? JSON.parse(e) : e;
        return Assertions.keyPresent(Fields$b.ID, t), Assertions.keyPresent(Fields$b.NAME, t), Assertions.keyPresent(Fields$b.DISABLED, t), new r(t[Fields$b.ID], t[Fields$b.KEY], t[Fields$b.NAME], t[Fields$b.DISABLED])
      }, r.prototype.toJSON = function() {
        var e;
        return (e = {})[Fields$b.ID] = this.id, e[Fields$b.KEY] = this.key, e[Fields$b.NAME] = this.name, e[Fields$b.DISABLED] = this.disabled, e
      }, r
    }(),
    UserApiKeyAuthProvider = function() {
      function e() {}
      return e.TYPE = "api-key", e.DEFAULT_NAME = "api-key", e
    }(),
    __extends$d = (US = Object.setPrototypeOf || {
        __proto__: []
      }
      instanceof Array && function(e, t) {
        e.__proto__ = t
      } || function(e, t) {
        for (var r in t) t.hasOwnProperty(r) && (e[r] = t[r])
      },
      function(e, t) {
        function r() {
          this.constructor = e
        }
        US(e, t), e.prototype = null === t ? Object.create(t) : (r.prototype = t.prototype, new r)
      }),
    US, ApiKeyFields;
  (ApiKeyFields || (ApiKeyFields = {})).NAME = "name";
  var CoreUserApiKeyAuthProviderClient = function(o) {
      function e(e, t) {
        var r = t.baseAuthRoute + "/api_keys",
          n = UserApiKeyAuthProvider.DEFAULT_NAME;
        return o.call(this, n, e, r) || this
      }
      return __extends$d(e, o), e.prototype.createApiKey = function(e) {
        var t, r = new StitchAuthDocRequest.Builder;
        return r.withMethod(Method$1.POST).withPath(this.baseRoute).withDocument((t = {}, t[ApiKeyFields.NAME] = e, t)).withRefreshToken(), this.requestClient.doAuthenticatedRequest(r.build()).then(function(e) {
          return UserApiKey.readFromApi(e.body)
        }).catch(function(e) {
          throw wrapDecodingError(e)
        })
      }, e.prototype.fetchApiKey = function(e) {
        var t = new StitchAuthRequest.Builder;
        return t.withMethod(Method$1.GET).withPath(this.getApiKeyRoute(e.toHexString())), t.withRefreshToken(), this.requestClient.doAuthenticatedRequest(t.build()).then(function(e) {
          return UserApiKey.readFromApi(e.body)
        }).catch(function(e) {
          throw wrapDecodingError(e)
        })
      }, e.prototype.fetchApiKeys = function() {
        var e = new StitchAuthRequest.Builder;
        return e.withMethod(Method$1.GET).withPath(this.baseRoute), e.withRefreshToken(), this.requestClient.doAuthenticatedRequest(e.build()).then(function(e) {
          var t = JSON.parse(e.body);
          if (Array.isArray(t)) return t.map(function(e) {
            return UserApiKey.readFromApi(e)
          });
          throw new StitchRequestError(new Error("unexpected non-array response from server"), exports.StitchRequestErrorCode.DECODING_ERROR)
        }).catch(function(e) {
          throw wrapDecodingError(e)
        })
      }, e.prototype.deleteApiKey = function(e) {
        var t = new StitchAuthRequest.Builder;
        return t.withMethod(Method$1.DELETE).withPath(this.getApiKeyRoute(e.toHexString())), t.withRefreshToken(), this.requestClient.doAuthenticatedRequest(t.build()).then(function() {})
      }, e.prototype.enableApiKey = function(e) {
        var t = new StitchAuthRequest.Builder;
        return t.withMethod(Method$1.PUT).withPath(this.getApiKeyEnableRoute(e.toHexString())), t.withRefreshToken(), this.requestClient.doAuthenticatedRequest(t.build()).then(function() {})
      }, e.prototype.disableApiKey = function(e) {
        var t = new StitchAuthRequest.Builder;
        return t.withMethod(Method$1.PUT).withPath(this.getApiKeyDisableRoute(e.toHexString())), t.withRefreshToken(), this.requestClient.doAuthenticatedRequest(t.build()).then(function() {})
      }, e.prototype.getApiKeyRoute = function(e) {
        return this.baseRoute + "/" + e
      }, e.prototype.getApiKeyEnableRoute = function(e) {
        return this.getApiKeyRoute(e) + "/enable"
      }, e.prototype.getApiKeyDisableRoute = function(e) {
        return this.getApiKeyRoute(e) + "/disable"
      }, e
    }(CoreAuthProviderClient),
    Fields$c;
  (Fields$c || (Fields$c = {})).KEY = "key";
  var UserApiKeyCredential = function(e, t) {
      var r;
      void 0 === t && (t = UserApiKeyAuthProvider.DEFAULT_NAME), this.providerType = UserApiKeyAuthProvider.TYPE, this.providerCapabilities = new ProviderCapabilities(!1), this.providerName = t, this.key = e, this.material = ((r = {})[Fields$c.KEY] = this.key, r)
    },
    UserPasswordAuthProvider = function() {
      function e() {}
      return e.TYPE = "local-userpass", e.DEFAULT_NAME = "local-userpass", e
    }(),
    __extends$e = (MT = Object.setPrototypeOf || {
        __proto__: []
      }
      instanceof Array && function(e, t) {
        e.__proto__ = t
      } || function(e, t) {
        for (var r in t) t.hasOwnProperty(r) && (e[r] = t[r])
      },
      function(e, t) {
        function r() {
          this.constructor = e
        }
        MT(e, t), e.prototype = null === t ? Object.create(t) : (r.prototype = t.prototype, new r)
      }),
    MT, RegistrationFields, VT, ActionFields, WT;
  VT = RegistrationFields || (RegistrationFields = {}), VT.EMAIL = "email", VT.PASSWORD = "password", WT = ActionFields || (ActionFields = {}), WT.EMAIL = "email", WT.PASSWORD = "password", WT.TOKEN = "token", WT.TOKEN_ID = "tokenId";
  var CoreUserPasswordAuthProviderClient = function(o) {
      function e(e, t, r) {
        void 0 === e && (e = UserPasswordAuthProvider.DEFAULT_NAME);
        var n = r.getAuthProviderRoute(e);
        return o.call(this, e, t, n) || this
      }
      return __extends$e(e, o), e.prototype.registerWithEmailInternal = function(e, t) {
        var r, n = new StitchDocRequest.Builder;
        return n.withMethod(Method$1.POST).withPath(this.getRegisterWithEmailRoute()), n.withDocument(((r = {})[RegistrationFields.EMAIL] = e, r[RegistrationFields.PASSWORD] = t, r)), this.requestClient.doRequest(n.build()).then(function() {})
      }, e.prototype.confirmUserInternal = function(e, t) {
        var r, n = new StitchDocRequest.Builder;
        return n.withMethod(Method$1.POST).withPath(this.getConfirmUserRoute()), n.withDocument(((r = {})[ActionFields.TOKEN] = e, r[ActionFields.TOKEN_ID] = t, r)), this.requestClient.doRequest(n.build()).then(function() {})
      }, e.prototype.resendConfirmationEmailInternal = function(e) {
        var t, r = new StitchDocRequest.Builder;
        return r.withMethod(Method$1.POST).withPath(this.getResendConfirmationEmailRoute()), r.withDocument(((t = {})[ActionFields.EMAIL] = e, t)), this.requestClient.doRequest(r.build()).then(function() {})
      }, e.prototype.resetPasswordInternal = function(e, t, r) {
        var n, o = new StitchDocRequest.Builder;
        return o.withMethod(Method$1.POST).withPath(this.getResetPasswordRoute()), o.withDocument(((n = {})[ActionFields.TOKEN] = e, n[ActionFields.TOKEN_ID] = t, n[ActionFields.PASSWORD] = r, n)), this.requestClient.doRequest(o.build()).then(function() {})
      }, e.prototype.sendResetPasswordEmailInternal = function(e) {
        var t, r = new StitchDocRequest.Builder;
        return r.withMethod(Method$1.POST).withPath(this.getSendResetPasswordEmailRoute()), r.withDocument(((t = {})[ActionFields.EMAIL] = e, t)), this.requestClient.doRequest(r.build()).then(function() {})
      }, e.prototype.getRegisterWithEmailRoute = function() {
        return this.getExtensionRoute("register")
      }, e.prototype.getConfirmUserRoute = function() {
        return this.getExtensionRoute("confirm")
      }, e.prototype.getResendConfirmationEmailRoute = function() {
        return this.getExtensionRoute("confirm/send")
      }, e.prototype.getResetPasswordRoute = function() {
        return this.getExtensionRoute("reset")
      }, e.prototype.getSendResetPasswordEmailRoute = function() {
        return this.getExtensionRoute("reset/send")
      }, e.prototype.getExtensionRoute = function(e) {
        return this.baseRoute + "/" + e
      }, e
    }(CoreAuthProviderClient),
    Fields$d, wU;
  wU = Fields$d || (Fields$d = {}), wU.USERNAME = "username", wU.PASSWORD = "password";
  var UserPasswordCredential = function(e, t, r) {
      var n;
      void 0 === r && (r = UserPasswordAuthProvider.DEFAULT_NAME), this.username = e, this.password = t, this.providerName = r, this.providerType = UserPasswordAuthProvider.TYPE, this.providerCapabilities = new ProviderCapabilities(!1), this.material = ((n = {})[Fields$d.USERNAME] = this.username, n[Fields$d.PASSWORD] = this.password, n)
    },
    UserType, CU;
  CU = UserType || (UserType = {}), CU.Normal = "normal", CU.Server = "server", CU.Unknown = "unknown";
  var UserType$1 = UserType,
    MemoryStorage = function() {
      function e(e) {
        this.suiteName = e, this.storage = {}
      }
      return e.prototype.get = function(e) {
        return this.storage[this.suiteName + "." + e]
      }, e.prototype.set = function(e, t) {
        this.storage[this.suiteName + "." + e] = t
      }, e.prototype.remove = function(e) {
        delete this.storage[this.suiteName + "." + e]
      }, e
    }(),
    CoreStitchServiceClientImpl = function() {
      function e(e, t, r) {
        this.requestClient = e, this.serviceRoutes = t, this.serviceName = r
      }
      return e.prototype.callFunction = function(e, t, r) {
        return this.requestClient.doAuthenticatedRequestWithDecoder(this.getCallServiceFunctionRequest(e, t), r)
      }, e.prototype.streamFunction = function(e, t, r) {
        return this.requestClient.openAuthenticatedStreamWithDecoder(this.getStreamServiceFunctionRequest(e, t), r)
      }, e.prototype.getStreamServiceFunctionRequest = function(e, t) {
        var r = {
          name: e
        };
        void 0 !== this.serviceName && (r.service = this.serviceName), r.arguments = t;
        var n = new StitchAuthRequest.Builder;
        return n.withMethod(Method$1.GET).withPath(this.serviceRoutes.functionCallRoute + "?stitch_request=" + encodeURIComponent(base64Encode(JSON.stringify(r)))), n.build()
      }, e.prototype.getCallServiceFunctionRequest = function(e, t) {
        var r = {
          name: e
        };
        void 0 !== this.serviceName && (r.service = this.serviceName), r.arguments = t;
        var n = new StitchAuthDocRequest.Builder;
        return n.withMethod(Method$1.POST).withPath(this.serviceRoutes.functionCallRoute), n.withDocument(r), n.build()
      }, e
    }(),
    CoreStitchAppClient = function() {
      function e(e, t) {
        this.functionService = new CoreStitchServiceClientImpl(e, t.serviceRoutes)
      }
      return e.prototype.callFunction = function(e, t, r) {
        return this.functionService.callFunction(e, t, r)
      }, e
    }(),
    BasicRequest = function(e, t, r, n) {
      this.method = e, this.url = t, this.headers = r, this.body = n
    },
    kV, lV;
  kV = BasicRequest || (BasicRequest = {}), lV = function() {
    function e(e) {
      e && (this.method = e.method, this.url = e.url, this.headers = e.headers, this.body = e.body)
    }
    return e.prototype.withMethod = function(e) {
      return this.method = e, this
    }, e.prototype.withUrl = function(e) {
      return this.url = e, this
    }, e.prototype.withHeaders = function(e) {
      return this.headers = e, this
    }, e.prototype.withBody = function(e) {
      return this.body = e, this
    }, e.prototype.build = function() {
      if (void 0 === this.method) throw new Error("must set method");
      if (void 0 === this.url) throw new Error("must set non-empty url");
      return new kV(this.method, this.url, void 0 === this.headers ? {} : this.headers, this.body)
    }, e
  }(), kV.Builder = lV;
  var BaseEventStream = function() {
      function n(e) {
        this.reconnecter = e, this.closed = !1, this.events = [], this.listeners = [], this.lastErr = void 0
      }
      return n.prototype.reconnect = function(t) {
        var r = this;
        this.reconnecter ? this.reconnecter().then(function(e) {
          r.onReconnect(e)
        }).catch(function(e) {
          if (!(e instanceof StitchError && e instanceof StitchRequestError)) return r.closed = !0, r.events.push(new Event(StitchEvent.ERROR_EVENT_NAME, "stream closed: " + t)), void r.poll();
          setTimeout(function() {
            return r.reconnect(e)
          }, n.RETRY_TIMEOUT_MILLIS)
        }) : this.closed || (this.closed = !0, this.events.push(new Event(StitchEvent.ERROR_EVENT_NAME, "stream closed: " + t)), this.poll())
      }, n.prototype.poll = function() {
        for (; 0 !== this.events.length;)
          for (var e = this.events.pop(), t = 0, r = this.listeners; t < r.length; t++) {
            var n = r[t];
            n.onEvent && n.onEvent(e)
          }
      }, n.prototype.addListener = function(e) {
        var t = this;
        this.closed ? setTimeout(function() {
          return e.onEvent(new Event(StitchEvent.ERROR_EVENT_NAME, "stream closed"))
        }, 0) : void 0 === this.lastErr ? (this.listeners.push(e), this.poll()) : setTimeout(function() {
          return e.onEvent(new Event(StitchEvent.ERROR_EVENT_NAME, t.lastErr))
        }, 0)
      }, n.prototype.removeListener = function(e) {
        var t = this.listeners.indexOf(e); - 1 !== t && this.listeners.splice(t, 1)
      }, n.prototype.listenOnce = function(t) {
        var r = this;
        if (this.closed) setTimeout(function() {
          return t.onEvent(new Event(StitchEvent.ERROR_EVENT_NAME, "stream closed"))
        }, 0);
        else if (void 0 === this.lastErr) {
          var n = {
            onEvent: function(e) {
              r.removeListener(n), t.onEvent(e)
            }
          };
          this.addListener(n)
        } else setTimeout(function() {
          return t.onEvent(new Event(StitchEvent.ERROR_EVENT_NAME, r.lastErr))
        }, 0)
      }, n.prototype.nextEvent = function() {
        var r = this;
        return this.closed ? Promise.reject(new Event(StitchEvent.ERROR_EVENT_NAME, "stream closed")) : void 0 !== this.lastErr ? Promise.reject(new Event(StitchEvent.ERROR_EVENT_NAME, this.lastErr)) : new Promise(function(t, e) {
          r.listenOnce({
            onEvent: function(e) {
              t(e)
            }
          })
        })
      }, n.prototype.close = function() {
        this.closed || (this.closed = !0, this.afterClose())
      }, n.RETRY_TIMEOUT_MILLIS = 5e3, n
    }(),
    Response = function(r, e, t) {
      var n = this;
      this.statusCode = e, this.body = t, this.headers = {}, Object.keys(r).map(function(e, t) {
        n.headers[e.toLocaleLowerCase()] = r[e]
      })
    },
    browserPonyfill = createCommonjsModule(function(e) {
      var t = function(e) {
        function t() {
          this.fetch = !1
        }
        return t.prototype = e, new t
      }("undefined" != typeof self ? self : commonjsGlobal);
      (function(e) {
        ! function(e) {
          if (!e.fetch) {
            var t = "URLSearchParams" in e,
              r = "Symbol" in e && "iterator" in Symbol,
              s = "FileReader" in e && "Blob" in e && function() {
                try {
                  return new Blob, !0
                } catch (e) {
                  return !1
                }
              }(),
              n = "FormData" in e,
              o = "ArrayBuffer" in e;
            if (o) var i = ["[object Int8Array]", "[object Uint8Array]", "[object Uint8ClampedArray]", "[object Int16Array]", "[object Uint16Array]", "[object Int32Array]", "[object Uint32Array]", "[object Float32Array]", "[object Float64Array]"],
              u = function(e) {
                return e && DataView.prototype.isPrototypeOf(e)
              },
              a = ArrayBuffer.isView || function(e) {
                return e && -1 < i.indexOf(Object.prototype.toString.call(e))
              };
            p.prototype.append = function(e, t) {
              e = h(e), t = l(t);
              var r = this.map[e];
              this.map[e] = r ? r + "," + t : t
            }, p.prototype.delete = function(e) {
              delete this.map[h(e)]
            }, p.prototype.get = function(e) {
              return e = h(e), this.has(e) ? this.map[e] : null
            }, p.prototype.has = function(e) {
              return this.map.hasOwnProperty(h(e))
            }, p.prototype.set = function(e, t) {
              this.map[h(e)] = l(t)
            }, p.prototype.forEach = function(e, t) {
              for (var r in this.map) this.map.hasOwnProperty(r) && e.call(t, this.map[r], r, this)
            }, p.prototype.keys = function() {
              var r = [];
              return this.forEach(function(e, t) {
                r.push(t)
              }), d(r)
            }, p.prototype.values = function() {
              var t = [];
              return this.forEach(function(e) {
                t.push(e)
              }), d(t)
            }, p.prototype.entries = function() {
              var r = [];
              return this.forEach(function(e, t) {
                r.push([t, e])
              }), d(r)
            }, r && (p.prototype[Symbol.iterator] = p.prototype.entries);
            var f = ["DELETE", "GET", "HEAD", "OPTIONS", "POST", "PUT"];
            m.prototype.clone = function() {
              return new m(this, {
                body: this._bodyInit
              })
            }, E.call(m.prototype), E.call(b.prototype), b.prototype.clone = function() {
              return new b(this._bodyInit, {
                status: this.status,
                statusText: this.statusText,
                headers: new p(this.headers),
                url: this.url
              })
            }, b.error = function() {
              var e = new b(null, {
                status: 0,
                statusText: ""
              });
              return e.type = "error", e
            };
            var c = [301, 302, 303, 307, 308];
            b.redirect = function(e, t) {
              if (-1 === c.indexOf(t)) throw new RangeError("Invalid status code");
              return new b(null, {
                status: t,
                headers: {
                  location: e
                }
              })
            }, e.Headers = p, e.Request = m, e.Response = b, e.fetch = function(r, o) {
              return new Promise(function(n, e) {
                var t = new m(r, o),
                  i = new XMLHttpRequest;
                i.onload = function() {
                  var e, o, t = {
                    status: i.status,
                    statusText: i.statusText,
                    headers: (e = i.getAllResponseHeaders() || "", o = new p, e.replace(/\r?\n[\t ]+/g, " ").split(/\r?\n/).forEach(function(e) {
                      var t = e.split(":"),
                        r = t.shift().trim();
                      if (r) {
                        var n = t.join(":").trim();
                        o.append(r, n)
                      }
                    }), o)
                  };
                  t.url = "responseURL" in i ? i.responseURL : t.headers.get("X-Request-URL");
                  var r = "response" in i ? i.response : i.responseText;
                  n(new b(r, t))
                }, i.onerror = function() {
                  e(new TypeError("Network request failed"))
                }, i.ontimeout = function() {
                  e(new TypeError("Network request failed"))
                }, i.open(t.method, t.url, !0), "include" === t.credentials ? i.withCredentials = !0 : "omit" === t.credentials && (i.withCredentials = !1), "responseType" in i && s && (i.responseType = "blob"), t.headers.forEach(function(e, t) {
                  i.setRequestHeader(t, e)
                }), i.send(void 0 === t._bodyInit ? null : t._bodyInit)
              })
            }, e.fetch.polyfill = !0
          }

          function h(e) {
            if ("string" != typeof e && (e = String(e)), /[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(e)) throw new TypeError("Invalid character in header field name");
            return e.toLowerCase()
          }

          function l(e) {
            return "string" != typeof e && (e = String(e)), e
          }

          function d(t) {
            var e = {
              next: function() {
                var e = t.shift();
                return {
                  done: void 0 === e,
                  value: e
                }
              }
            };
            return r && (e[Symbol.iterator] = function() {
              return e
            }), e
          }

          function p(t) {
            this.map = {}, t instanceof p ? t.forEach(function(e, t) {
              this.append(t, e)
            }, this) : Array.isArray(t) ? t.forEach(function(e) {
              this.append(e[0], e[1])
            }, this) : t && Object.getOwnPropertyNames(t).forEach(function(e) {
              this.append(e, t[e])
            }, this)
          }

          function y(e) {
            if (e.bodyUsed) return Promise.reject(new TypeError("Already read"));
            e.bodyUsed = !0
          }

          function g(r) {
            return new Promise(function(e, t) {
              r.onload = function() {
                e(r.result)
              }, r.onerror = function() {
                t(r.error)
              }
            })
          }

          function _(e) {
            var t = new FileReader,
              r = g(t);
            return t.readAsArrayBuffer(e), r
          }

          function v(e) {
            if (e.slice) return e.slice(0);
            var t = new Uint8Array(e.byteLength);
            return t.set(new Uint8Array(e)), t.buffer
          }

          function E() {
            return this.bodyUsed = !1, this._initBody = function(e) {
              if (this._bodyInit = e)
                if ("string" == typeof e) this._bodyText = e;
                else if (s && Blob.prototype.isPrototypeOf(e)) this._bodyBlob = e;
              else if (n && FormData.prototype.isPrototypeOf(e)) this._bodyFormData = e;
              else if (t && URLSearchParams.prototype.isPrototypeOf(e)) this._bodyText = e.toString();
              else if (o && s && u(e)) this._bodyArrayBuffer = v(e.buffer), this._bodyInit = new Blob([this._bodyArrayBuffer]);
              else {
                if (!o || !ArrayBuffer.prototype.isPrototypeOf(e) && !a(e)) throw new Error("unsupported BodyInit type");
                this._bodyArrayBuffer = v(e)
              } else this._bodyText = "";
              this.headers.get("content-type") || ("string" == typeof e ? this.headers.set("content-type", "text/plain;charset=UTF-8") : this._bodyBlob && this._bodyBlob.type ? this.headers.set("content-type", this._bodyBlob.type) : t && URLSearchParams.prototype.isPrototypeOf(e) && this.headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8"))
            }, s && (this.blob = function() {
              var e = y(this);
              if (e) return e;
              if (this._bodyBlob) return Promise.resolve(this._bodyBlob);
              if (this._bodyArrayBuffer) return Promise.resolve(new Blob([this._bodyArrayBuffer]));
              if (this._bodyFormData) throw new Error("could not read FormData body as blob");
              return Promise.resolve(new Blob([this._bodyText]))
            }, this.arrayBuffer = function() {
              return this._bodyArrayBuffer ? y(this) || Promise.resolve(this._bodyArrayBuffer) : this.blob().then(_)
            }), this.text = function() {
              var e, t, r, n = y(this);
              if (n) return n;
              if (this._bodyBlob) return e = this._bodyBlob, t = new FileReader, r = g(t), t.readAsText(e), r;
              if (this._bodyArrayBuffer) return Promise.resolve(function(e) {
                for (var t = new Uint8Array(e), r = new Array(t.length), n = 0; n < t.length; n++) r[n] = String.fromCharCode(t[n]);
                return r.join("")
              }(this._bodyArrayBuffer));
              if (this._bodyFormData) throw new Error("could not read FormData body as text");
              return Promise.resolve(this._bodyText)
            }, n && (this.formData = function() {
              return this.text().then(A)
            }), this.json = function() {
              return this.text().then(JSON.parse)
            }, this
          }

          function m(e, t) {
            var r, n, o = (t = t || {}).body;
            if (e instanceof m) {
              if (e.bodyUsed) throw new TypeError("Already read");
              this.url = e.url, this.credentials = e.credentials, t.headers || (this.headers = new p(e.headers)), this.method = e.method, this.mode = e.mode, o || null == e._bodyInit || (o = e._bodyInit, e.bodyUsed = !0)
            } else this.url = String(e);
            if (this.credentials = t.credentials || this.credentials || "omit", !t.headers && this.headers || (this.headers = new p(t.headers)), this.method = (r = t.method || this.method || "GET", n = r.toUpperCase(), -1 < f.indexOf(n) ? n : r), this.mode = t.mode || this.mode || null, this.referrer = null, ("GET" === this.method || "HEAD" === this.method) && o) throw new TypeError("Body not allowed for GET or HEAD requests");
            this._initBody(o)
          }

          function A(e) {
            var o = new FormData;
            return e.trim().split("&").forEach(function(e) {
              if (e) {
                var t = e.split("="),
                  r = t.shift().replace(/\+/g, " "),
                  n = t.join("=").replace(/\+/g, " ");
                o.append(decodeURIComponent(r), decodeURIComponent(n))
              }
            }), o
          }

          function b(e, t) {
            t || (t = {}), this.type = "default", this.status = void 0 === t.status ? 200 : t.status, this.ok = 200 <= this.status && this.status < 300, this.statusText = "statusText" in t ? t.statusText : "OK", this.headers = new p(t.headers), this.url = t.url || "", this._initBody(e)
          }
        }(void 0 !== e ? e : this)
      }).call(t, void 0);
      var r = t.fetch;
      r.Response = t.Response, r.Request = t.Request, r.Headers = t.Headers;
      e.exports && (e.exports = r, e.exports.default = r)
    }),
    BASE_ROUTE = "/api/client/v2.0";

  function getAppRoute(e) {
    return BASE_ROUTE + "/app/" + e
  }

  function getFunctionCallRoute(e) {
    return getAppRoute(e) + "/functions/call"
  }

  function getAppMetadataRoute(e) {
    return getAppRoute(e) + "/location"
  }

  function getAuthProviderRoute(e, t) {
    return getAppRoute(e) + "/auth/providers/" + t
  }

  function getAuthProviderLoginRoute(e, t) {
    return getAuthProviderRoute(e, t) + "/login"
  }

  function getAuthProviderLinkRoute(e, t) {
    return getAuthProviderLoginRoute(e, t) + "?link=true"
  }
  var StitchAppAuthRoutes = function() {
      function e(e) {
        var t = this;
        this.baseAuthRoute = BASE_ROUTE + "/auth", this.sessionRoute = t.baseAuthRoute + "/session", this.profileRoute = t.baseAuthRoute + "/profile", this.clientAppId = e
      }
      return e.prototype.getAuthProviderRoute = function(e) {
        return getAuthProviderRoute(this.clientAppId, e)
      }, e.prototype.getAuthProviderLoginRoute = function(e) {
        return getAuthProviderLoginRoute(this.clientAppId, e)
      }, e.prototype.getAuthProviderLinkRoute = function(e) {
        return getAuthProviderLinkRoute(this.clientAppId, e)
      }, e.prototype.getAuthProviderExtensionRoute = function(e, t) {
        return this.getAuthProviderRoute(e) + "/" + t
      }, e
    }(),
    Fields$e, sY;
  sY = Fields$e || (Fields$e = {}), sY.DEPLOYMENT_MODEL = "deployment_model", sY.LOCATION = "location", sY.HOSTNAME = "hostname";
  var ApiAppMetadata = function() {
    function t(e, t, r) {
      this.deploymentModel = e, this.location = t, this.hostname = r
    }
    return t.fromJSON = function(e) {
      return new t(e[Fields$e.DEPLOYMENT_MODEL], e[Fields$e.LOCATION], e[Fields$e.HOSTNAME])
    }, t.prototype.toJSON = function() {
      var e;
      return (e = {})[Fields$e.DEPLOYMENT_MODEL] = this.deploymentModel, e[Fields$e.LOCATION] = this.location, e[Fields$e.HOSTNAME] = this.hostname, e
    }, t
  }();

  function inspectResponse(e, t, r) {
    return 200 <= r.statusCode && r.statusCode < 300 ? r : handleRequestError(r)
  }
  var StitchRequestClient = function() {
      function e(e, t) {
        this.baseUrl = e, this.transport = t
      }
      return e.prototype.doRequestToURL = function(t, r) {
        return this.transport.roundTrip(this.buildRequest(t, r)).catch(function(e) {
          throw new StitchRequestError(e, exports.StitchRequestErrorCode.TRANSPORT_ERROR)
        }).then(function(e) {
          return inspectResponse(t, r, e)
        })
      }, e.prototype.doStreamRequestToURL = function(e, t, r, n) {
        return void 0 === r && (r = !0), this.transport.stream(this.buildRequest(e, t), r, n).catch(function(e) {
          if (e instanceof StitchError) throw e;
          throw new StitchRequestError(e, exports.StitchRequestErrorCode.TRANSPORT_ERROR)
        })
      }, e.prototype.buildRequest = function(e, t) {
        return (new BasicRequest.Builder).withMethod(e.method).withUrl("" + t + e.path).withHeaders(e.headers).withBody(e.body).build()
      }, e
    }(),
    StitchServiceRoutes = function(e) {
      this.clientAppId = e, this.functionCallRoute = getFunctionCallRoute(e)
    },
    StitchAppRoutes = function(e) {
      this.clientAppId = e, this.authRoutes = new StitchAppAuthRoutes(e), this.serviceRoutes = new StitchServiceRoutes(e), this.appMetadataRoute = getAppMetadataRoute(e), this.functionCallRoute = getFunctionCallRoute(e)
    },
    __extends$f = (UY = Object.setPrototypeOf || {
        __proto__: []
      }
      instanceof Array && function(e, t) {
        e.__proto__ = t
      } || function(e, t) {
        for (var r in t) t.hasOwnProperty(r) && (e[r] = t[r])
      },
      function(e, t) {
        function r() {
          this.constructor = e
        }
        UY(e, t), e.prototype = null === t ? Object.create(t) : (r.prototype = t.prototype, new r)
      }),
    UY, StitchAppRequestClient = function(i) {
      function e(e, t, r) {
        var n = i.call(this, t, r) || this;
        return n.clientAppId = e, n.routes = new StitchAppRoutes(e), n
      }
      return __extends$f(e, i), e.prototype.doRequest = function(t) {
        var r = this;
        return this.initAppMetadata().then(function(e) {
          return i.prototype.doRequestToURL.call(r, t, e.hostname)
        })
      }, e.prototype.doStreamRequest = function(t, r, n) {
        var o = this;
        return void 0 === r && (r = !0), this.initAppMetadata().then(function(e) {
          return i.prototype.doStreamRequestToURL.call(o, t, e.hostname, r, n)
        })
      }, e.prototype.initAppMetadata = function() {
        var t = this;
        if (this.appMetadata) return Promise.resolve(this.appMetadata);
        var e = (new StitchRequest.Builder).withMethod(Method$1.GET).withPath(this.routes.appMetadataRoute).build();
        return i.prototype.doRequestToURL.call(this, e, this.baseUrl).then(function(e) {
          return t.appMetadata = ApiAppMetadata.fromJSON(bson_54.parse(e.body)), t.appMetadata
        })
      }, e
    }(StitchRequestClient),
    __extends$g = (sZ = Object.setPrototypeOf || {
        __proto__: []
      }
      instanceof Array && function(e, t) {
        e.__proto__ = t
      } || function(e, t) {
        for (var r in t) t.hasOwnProperty(r) && (e[r] = t[r])
      },
      function(e, t) {
        function r() {
          this.constructor = e
        }
        sZ(e, t), e.prototype = null === t ? Object.create(t) : (r.prototype = t.prototype, new r)
      }),
    sZ, StitchRequestClient$1 = function(n) {
      function e(e, t) {
        return n.call(this, e, t) || this
      }
      return __extends$g(e, n), e.prototype.doRequest = function(e) {
        return n.prototype.doRequestToURL.call(this, e, this.baseUrl)
      }, e.prototype.doStreamRequest = function(e, t, r) {
        return void 0 === t && (t = !0), n.prototype.doStreamRequestToURL.call(this, e, this.baseUrl, t, r)
      }, e
    }(StitchRequestClient),
    StitchClientConfiguration = function() {
      function e(e, t, r, n) {
        this.baseUrl = e, this.storage = t, this.dataDirectory = r, this.transport = n
      }
      return e.prototype.builder = function() {
        return new e.Builder(this)
      }, e
    }(),
    OZ, PZ;
  OZ = StitchClientConfiguration || (StitchClientConfiguration = {}), PZ = function() {
    function e(e) {
      e && (this.baseUrl = e.baseUrl, this.storage = e.storage, this.dataDirectory = e.dataDirectory, this.transport = e.transport)
    }
    return e.prototype.withBaseUrl = function(e) {
      return this.baseUrl = e, this
    }, e.prototype.withStorage = function(e) {
      return this.storage = e, this
    }, e.prototype.withDataDirectory = function(e) {
      return this.dataDirectory = e, this
    }, e.prototype.withTransport = function(e) {
      return this.transport = e, this
    }, e.prototype.build = function() {
      return new OZ(this.baseUrl, this.storage, this.dataDirectory, this.transport)
    }, e
  }(), OZ.Builder = PZ;
  var __extends$h = (WZ = Object.setPrototypeOf || {
        __proto__: []
      }
      instanceof Array && function(e, t) {
        e.__proto__ = t
      } || function(e, t) {
        for (var r in t) t.hasOwnProperty(r) && (e[r] = t[r])
      },
      function(e, t) {
        function r() {
          this.constructor = e
        }
        WZ(e, t), e.prototype = null === t ? Object.create(t) : (r.prototype = t.prototype, new r)
      }),
    WZ, j$, k$;
  exports.StitchAppClientConfiguration = function(o) {
    function e(e, t, r) {
      var n = o.call(this, e.baseUrl, e.storage, e.dataDirectory, e.transport) || this;
      return n.localAppVersion = r, n.localAppName = t, n
    }
    return __extends$h(e, o), e.prototype.builder = function() {
      return new e.Builder(this)
    }, e
  }(StitchClientConfiguration), j$ = exports.StitchAppClientConfiguration || (exports.StitchAppClientConfiguration = {}), k$ = function(r) {
    function e(e) {
      var t = r.call(this, e) || this;
      return e && (t.localAppVersion = e.localAppVersion, t.localAppName = e.localAppName), t
    }
    return __extends$h(e, r), e.prototype.withLocalAppName = function(e) {
      return this.localAppName = e, this
    }, e.prototype.withLocalAppVersion = function(e) {
      return this.localAppVersion = e, this
    }, e.prototype.build = function() {
      var e = r.prototype.build.call(this);
      return new j$(e, this.localAppName, this.localAppVersion)
    }, e
  }(StitchClientConfiguration.Builder), j$.Builder = k$;
  var StitchAppClientInfo = function(e, t, r, n) {
      this.clientAppId = e, this.dataDirectory = t, this.localAppName = r, this.localAppVersion = n
    },
    FacebookRedirectCredential = function(e, t, r) {
      void 0 === t && (t = FacebookAuthProvider.DEFAULT_NAME), void 0 === r && (r = FacebookAuthProvider.TYPE), this.redirectUrl = e, this.providerName = t, this.providerType = r
    },
    GoogleRedirectCredential = function(e, t, r) {
      void 0 === t && (t = GoogleAuthProvider.DEFAULT_NAME), void 0 === r && (r = GoogleAuthProvider.TYPE), this.redirectUrl = e, this.providerName = t, this.providerType = r
    },
    __extends$i = (F$ = Object.setPrototypeOf || {
        __proto__: []
      }
      instanceof Array && function(e, t) {
        e.__proto__ = t
      } || function(e, t) {
        for (var r in t) t.hasOwnProperty(r) && (e[r] = t[r])
      },
      function(e, t) {
        function r() {
          this.constructor = e
        }
        F$(e, t), e.prototype = null === t ? Object.create(t) : (r.prototype = t.prototype, new r)
      }),
    F$, UserApiKeyAuthProviderClientImpl = function(r) {
      function e(e, t) {
        return r.call(this, e, t) || this
      }
      return __extends$i(e, r), e.prototype.createApiKey = function(e) {
        return r.prototype.createApiKey.call(this, e)
      }, e.prototype.fetchApiKey = function(e) {
        return r.prototype.fetchApiKey.call(this, e)
      }, e.prototype.fetchApiKeys = function() {
        return r.prototype.fetchApiKeys.call(this)
      }, e.prototype.deleteApiKey = function(e) {
        return r.prototype.deleteApiKey.call(this, e)
      }, e.prototype.enableApiKey = function(e) {
        return r.prototype.enableApiKey.call(this, e)
      }, e.prototype.disableApiKey = function(e) {
        return r.prototype.disableApiKey.call(this, e)
      }, e
    }(CoreUserApiKeyAuthProviderClient);
  (exports.UserApiKeyAuthProviderClient || (exports.UserApiKeyAuthProviderClient = {})).factory = new(function() {
    function e() {}
    return e.prototype.getClient = function(e, t, r) {
      return new UserApiKeyAuthProviderClientImpl(e, r)
    }, e
  }());
  var __extends$j = (a_ = Object.setPrototypeOf || {
        __proto__: []
      }
      instanceof Array && function(e, t) {
        e.__proto__ = t
      } || function(e, t) {
        for (var r in t) t.hasOwnProperty(r) && (e[r] = t[r])
      },
      function(e, t) {
        function r() {
          this.constructor = e
        }
        a_(e, t), e.prototype = null === t ? Object.create(t) : (r.prototype = t.prototype, new r)
      }),
    a_, UserPasswordAuthProviderClientImpl = function(n) {
      function e(e, t) {
        return n.call(this, UserPasswordAuthProvider.DEFAULT_NAME, e, t) || this
      }
      return __extends$j(e, n), e.prototype.registerWithEmail = function(e, t) {
        return n.prototype.registerWithEmailInternal.call(this, e, t)
      }, e.prototype.confirmUser = function(e, t) {
        return n.prototype.confirmUserInternal.call(this, e, t)
      }, e.prototype.resendConfirmationEmail = function(e) {
        return n.prototype.resendConfirmationEmailInternal.call(this, e)
      }, e.prototype.resetPassword = function(e, t, r) {
        return n.prototype.resetPasswordInternal.call(this, e, t, r)
      }, e.prototype.sendResetPasswordEmail = function(e) {
        return n.prototype.sendResetPasswordEmailInternal.call(this, e)
      }, e
    }(CoreUserPasswordAuthProviderClient);
  (exports.UserPasswordAuthProviderClient || (exports.UserPasswordAuthProviderClient = {})).factory = new(function() {
    function e() {}
    return e.prototype.getClient = function(e, t, r) {
      return new UserPasswordAuthProviderClientImpl(t, r)
    }, e
  }());
  var stitchPrefixKey = "__stitch.client",
    LocalStorage = function() {
      function e(e) {
        this.suiteName = e
      }
      return e.prototype.getKey = function(e) {
        return stitchPrefixKey + "." + this.suiteName + "." + e
      }, e.prototype.get = function(e) {
        return localStorage.getItem(this.getKey(e))
      }, e.prototype.set = function(e, t) {
        localStorage.setItem(this.getKey(e), t)
      }, e.prototype.remove = function(e) {
        localStorage.removeItem(this.getKey(e))
      }, e
    }(),
    __extends$k = (I_ = Object.setPrototypeOf || {
        __proto__: []
      }
      instanceof Array && function(e, t) {
        e.__proto__ = t
      } || function(e, t) {
        for (var r in t) t.hasOwnProperty(r) && (e[r] = t[r])
      },
      function(e, t) {
        function r() {
          this.constructor = e
        }
        I_(e, t), e.prototype = null === t ? Object.create(t) : (r.prototype = t.prototype, new r)
      }),
    I_, ReaderEventStream = function(o) {
      function e(e, t, r) {
        var n = o.call(this, r) || this;
        return n.readerStream = e, t && n.reset(), n
      }
      return __extends$k(e, o), e.prototype.open = function() {
        if (this.closed) throw new StitchClientError(exports.StitchClientErrorCode.StreamClosed);
        this.reset()
      }, e.prototype.reset = function() {
        this.reader = this.readerStream.getReader(), this.dataBuffer = new Array, this.eventName = "", this.bufferPos = 0, this.buffer = new Array, this.doneOnce = !1, this.processLine()
      }, e.prototype.onReconnect = function(e) {
        this.readerStream = e.readerStream, this.reset()
      }, e.prototype.readLine = function() {
        for (var n = this; this.bufferPos < this.buffer.length; this.bufferPos++) {
          var e = -1;
          if (13 === this.buffer[this.bufferPos] && this.bufferPos + 1 > this.buffer.length && 10 === this.buffer[this.bufferPos] ? e = this.bufferPos + 2 : 10 === this.buffer[this.bufferPos] ? e = this.bufferPos + 1 : this.doneOnce && 13 === this.buffer[this.bufferPos] ? e = this.bufferPos + 1 : this.doneOnce && (e = 0), -1 !== e) {
            var t = utf8Slice$1(new Uint8Array(this.buffer.slice(0, this.bufferPos)), 0, this.bufferPos);
            return this.buffer.splice(0, e), this.bufferPos = 0, Promise.resolve({
              line: t,
              ok: !0
            })
          }
        }
        return this.doneOnce ? Promise.resolve({
          line: "",
          ok: !1
        }) : this.reader.read().then(function(e) {
          if (e.done) return n.doneOnce = !0, n.readLine();
          for (var t = e.value, r = 0; r < t.length; r++) n.buffer.push(t[r]);
          return n.readLine()
        })
      }, e.prototype.processField = function(e, t) {
        if ("event" === e) this.eventName = t;
        else if ("data" === e) {
          0 !== this.dataBuffer.length && this.dataBuffer.push("\n");
          for (var r = 0; r < t.length; r++) this.dataBuffer.push(t[r])
        }
      }, e.prototype.dispatchEvent = function() {
        if (0 !== this.dataBuffer.length) {
          var e = new Event(this.eventName ? this.eventName : Event.MESSAGE_EVENT, this.dataBuffer.join(""));
          this.dataBuffer = new Array, this.eventName = "", e.eventName === StitchEvent.ERROR_EVENT_NAME && (this.lastErr = e.data, this.close()), this.events.push(e), this.poll()
        } else this.eventName = ""
      }, e.prototype.processLine = function() {
        var i = this;
        this.readLine().then(function(e) {
          if (e.ok) {
            var t = e.line;
            if (0 === t.length) i.dispatchEvent();
            else if (t.startsWith(":"));
            else if (t.includes(":")) {
              var r = t.indexOf(":"),
                n = t.substring(0, r),
                o = t.substring(r + 1);
              o = o.startsWith(" ") ? o.substring(1) : o, i.processField(n, o)
            } else i.processField(t, "");
            i.processLine()
          } else {
            if (i.closed) return;
            i.reconnect()
          }
        }).catch(function(e) {
          return i.reconnect(e)
        })
      }, e.prototype.afterClose = function() {
        this.reader.cancel()
      }, e
    }(BaseEventStream),
    __extends$l = (n0 = Object.setPrototypeOf || {
        __proto__: []
      }
      instanceof Array && function(e, t) {
        e.__proto__ = t
      } || function(e, t) {
        for (var r in t) t.hasOwnProperty(r) && (e[r] = t[r])
      },
      function(e, t) {
        function r() {
          this.constructor = e
        }
        n0(e, t), e.prototype = null === t ? Object.create(t) : (r.prototype = t.prototype, new r)
      }),
    n0, EventSourceEventStream = function(i) {
      function e(e, t, r, n) {
        var o = i.call(this, n) || this;
        return o.evtSrc = e, o.onOpenError = r, o.openedOnce = !1, o.evtSrc.onopen = function(e) {
          t(o), o.openedOnce = !0
        }, o.reset(), o
      }
      return __extends$l(e, i), e.prototype.open = function() {
        if (this.closed) throw new StitchClientError(exports.StitchClientErrorCode.StreamClosed)
      }, e.prototype.reset = function() {
        var t = this;
        this.evtSrc.onmessage = function(e) {
          t.events.push(new Event(Event.MESSAGE_EVENT, e.data)), t.poll()
        }, this.evtSrc.onerror = function(e) {
          return e instanceof MessageEvent ? (t.lastErr = e.data, t.events.push(new Event(StitchEvent.ERROR_EVENT_NAME, t.lastErr)), t.close(), void t.poll()) : t.openedOnce ? (t.evtSrc.close(), void t.reconnect()) : (t.close(), void t.onOpenError(new Error("event source failed to open and will not reconnect; check network log for more details")))
        }
      }, e.prototype.onReconnect = function(e) {
        this.evtSrc = e.evtSrc, this.reset(), this.events = e.events.concat(this.events)
      }, e.prototype.afterClose = function() {
        this.evtSrc.close()
      }, e
    }(BaseEventStream),
    __assign = Object.assign || function(e) {
      for (var t, r = 1, n = arguments.length; r < n; r++)
        for (var o in t = arguments[r]) Object.prototype.hasOwnProperty.call(t, o) && (e[o] = t[o]);
      return e
    },
    FetchStreamTransport = function() {
      function e() {}
      return e.prototype.roundTrip = function(e) {
        var t = browserPonyfill(e.url, {
            body: e.body,
            headers: e.headers,
            method: e.method,
            mode: "cors"
          }),
          r = t.then(function(e) {
            return e.text()
          });
        return Promise.all([t, r]).then(function(e) {
          var t = e[0],
            r = e[1],
            n = {};
          return t.headers.forEach(function(e, t) {
            n[t] = e
          }), new Response(n, t.status, r)
        })
      }, e.prototype.stream = function(e, n, o) {
        var t;
        void 0 === n && (n = !0);
        try {
          new ReadableStream, t = !0
        } catch (e) {
          t = !1
        }
        var r = __assign({}, e.headers);
        return r[Headers.ACCEPT] = ContentTypes.TEXT_EVENT_STREAM, r[Headers.CONTENT_TYPE] = ContentTypes.TEXT_EVENT_STREAM, t ? browserPonyfill(e.url, {
          body: e.body,
          headers: r,
          method: e.method,
          mode: "cors"
        }).then(function(t) {
          var r = {};
          if (t.headers.forEach(function(e, t) {
              r[t] = e
            }), t.status < 200 || 300 <= t.status) return t.text().then(function(e) {
            return handleRequestError(new Response(r, t.status, e))
          });
          if (!o) throw new StitchClientError(exports.StitchClientErrorCode.StreamClosed);
          if (!t.body) throw new StitchClientError(exports.StitchClientErrorCode.StreamingNotSupported);
          return Promise.resolve(new ReaderEventStream(t.body, n, o ? function() {
            return o().then(function(e) {
              return e
            })
          } : void 0))
        }) : browserPonyfill(e.url + "&stitch_validate=true", {
          body: e.body,
          headers: r,
          method: e.method,
          mode: "cors"
        }).then(function(t) {
          var r = {};
          return t.headers.forEach(function(e, t) {
            r[t] = e
          }), t.status < 200 || 300 <= t.status ? t.text().then(function(e) {
            return handleRequestError(new Response(r, t.status, e))
          }) : new Promise(function(t, r) {
            new EventSourceEventStream(new EventSource(e.url), function(e) {
              return t(e)
            }, function(e) {
              return r(e)
            }, o ? function() {
              return o().then(function(e) {
                return e
              })
            } : void 0)
          })
        })
      }, e
    }();

  function defaultSetTimout() {
    throw new Error("setTimeout has not been defined")
  }

  function defaultClearTimeout() {
    throw new Error("clearTimeout has not been defined")
  }
  var cachedSetTimeout = defaultSetTimout,
    cachedClearTimeout = defaultClearTimeout;

  function runTimeout(t) {
    if (cachedSetTimeout === setTimeout) return setTimeout(t, 0);
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) return cachedSetTimeout = setTimeout, setTimeout(t, 0);
    try {
      return cachedSetTimeout(t, 0)
    } catch (e) {
      try {
        return cachedSetTimeout.call(null, t, 0)
      } catch (e) {
        return cachedSetTimeout.call(this, t, 0)
      }
    }
  }

  function runClearTimeout(t) {
    if (cachedClearTimeout === clearTimeout) return clearTimeout(t);
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) return cachedClearTimeout = clearTimeout, clearTimeout(t);
    try {
      return cachedClearTimeout(t)
    } catch (e) {
      try {
        return cachedClearTimeout.call(null, t)
      } catch (e) {
        return cachedClearTimeout.call(this, t)
      }
    }
  }
  "function" == typeof global$1.setTimeout && (cachedSetTimeout = setTimeout), "function" == typeof global$1.clearTimeout && (cachedClearTimeout = clearTimeout);
  var queue = [],
    draining = !1,
    currentQueue, queueIndex = -1;

  function cleanUpNextTick() {
    draining && currentQueue && (draining = !1, currentQueue.length ? queue = currentQueue.concat(queue) : queueIndex = -1, queue.length && drainQueue())
  }

  function drainQueue() {
    if (!draining) {
      var e = runTimeout(cleanUpNextTick);
      draining = !0;
      for (var t = queue.length; t;) {
        for (currentQueue = queue, queue = []; ++queueIndex < t;) currentQueue && currentQueue[queueIndex].run();
        queueIndex = -1, t = queue.length
      }
      currentQueue = null, draining = !1, runClearTimeout(e)
    }
  }

  function nextTick(e) {
    var t = new Array(arguments.length - 1);
    if (1 < arguments.length)
      for (var r = 1; r < arguments.length; r++) t[r - 1] = arguments[r];
    queue.push(new Item(e, t)), 1 !== queue.length || draining || runTimeout(drainQueue)
  }

  function Item(e, t) {
    this.fun = e, this.array = t
  }
  Item.prototype.run = function() {
    this.fun.apply(null, this.array)
  };
  var title = "browser",
    platform = "browser",
    browser = !0,
    env = {},
    argv = [],
    version = "",
    versions = {},
    release = {},
    config = {};

  function noop() {}
  var on = noop,
    addListener = noop,
    once = noop,
    off = noop,
    removeListener = noop,
    removeAllListeners = noop,
    emit = noop;

  function binding(e) {
    throw new Error("process.binding is not supported")
  }

  function cwd() {
    return "/"
  }

  function chdir(e) {
    throw new Error("process.chdir is not supported")
  }

  function umask() {
    return 0
  }
  var performance = global$1.performance || {},
    performanceNow = performance.now || performance.mozNow || performance.msNow || performance.oNow || performance.webkitNow || function() {
      return (new Date).getTime()
    };

  function hrtime(e) {
    var t = .001 * performanceNow.call(performance),
      r = Math.floor(t),
      n = Math.floor(t % 1 * 1e9);
    return e && (r -= e[0], (n -= e[1]) < 0 && (r--, n += 1e9)), [r, n]
  }
  var startTime = new Date;

  function uptime() {
    return (new Date - startTime) / 1e3
  }
  var process = {
    nextTick: nextTick,
    title: title,
    browser: browser,
    env: env,
    argv: argv,
    version: version,
    versions: versions,
    on: on,
    addListener: addListener,
    once: once,
    off: off,
    removeListener: removeListener,
    removeAllListeners: removeAllListeners,
    emit: emit,
    binding: binding,
    cwd: cwd,
    chdir: chdir,
    umask: umask,
    hrtime: hrtime,
    platform: platform,
    release: release,
    config: config,
    uptime: uptime
  };

  function detect() {
    return "undefined" != typeof navigator ? parseUserAgent(navigator.userAgent) : getNodeVersion()
  }

  function detectOS(t) {
    var e = getOperatingSystemRules().filter(function(e) {
      return e.rule && e.rule.test(t)
    })[0];
    return e ? e.name : null
  }

  function getNodeVersion() {
    return void 0 !== process && process.version && {
      name: "node",
      version: process.version.slice(1),
      os: process.platform
    }
  }

  function parseUserAgent(n) {
    var e = getBrowserRules();
    if (!n) return null;
    var t = e.map(function(e) {
      var t = e.rule.exec(n),
        r = t && t[1].split(/[._]/).slice(0, 3);
      return r && r.length < 3 && (r = r.concat(1 == r.length ? [0, 0] : [0])), t && {
        name: e.name,
        version: r.join(".")
      }
    }).filter(Boolean)[0] || null;
    return t && (t.os = detectOS(n)), /alexa|bot|crawl(er|ing)|facebookexternalhit|feedburner|google web preview|nagios|postrank|pingdom|slurp|spider|yahoo!|yandex/i.test(n) && ((t = t || {}).bot = !0), t
  }

  function getBrowserRules() {
    return buildRules([
      ["aol", /AOLShield\/([0-9\._]+)/],
      ["edge", /Edge\/([0-9\._]+)/],
      ["yandexbrowser", /YaBrowser\/([0-9\._]+)/],
      ["vivaldi", /Vivaldi\/([0-9\.]+)/],
      ["kakaotalk", /KAKAOTALK\s([0-9\.]+)/],
      ["samsung", /SamsungBrowser\/([0-9\.]+)/],
      ["chrome", /(?!Chrom.*OPR)Chrom(?:e|ium)\/([0-9\.]+)(:?\s|$)/],
      ["phantomjs", /PhantomJS\/([0-9\.]+)(:?\s|$)/],
      ["crios", /CriOS\/([0-9\.]+)(:?\s|$)/],
      ["firefox", /Firefox\/([0-9\.]+)(?:\s|$)/],
      ["fxios", /FxiOS\/([0-9\.]+)/],
      ["opera", /Opera\/([0-9\.]+)(?:\s|$)/],
      ["opera", /OPR\/([0-9\.]+)(:?\s|$)$/],
      ["ie", /Trident\/7\.0.*rv\:([0-9\.]+).*\).*Gecko$/],
      ["ie", /MSIE\s([0-9\.]+);.*Trident\/[4-7].0/],
      ["ie", /MSIE\s(7\.0)/],
      ["bb10", /BB10;\sTouch.*Version\/([0-9\.]+)/],
      ["android", /Android\s([0-9\.]+)/],
      ["ios", /Version\/([0-9\._]+).*Mobile.*Safari.*/],
      ["safari", /Version\/([0-9\._]+).*Safari/],
      ["facebook", /FBAV\/([0-9\.]+)/],
      ["instagram", /Instagram\s([0-9\.]+)/],
      ["ios-webview", /AppleWebKit\/([0-9\.]+).*Mobile/]
    ])
  }

  function getOperatingSystemRules() {
    return buildRules([
      ["iOS", /iP(hone|od|ad)/],
      ["Android OS", /Android/],
      ["BlackBerry OS", /BlackBerry|BB10/],
      ["Windows Mobile", /IEMobile/],
      ["Amazon OS", /Kindle/],
      ["Windows 3.11", /Win16/],
      ["Windows 95", /(Windows 95)|(Win95)|(Windows_95)/],
      ["Windows 98", /(Windows 98)|(Win98)/],
      ["Windows 2000", /(Windows NT 5.0)|(Windows 2000)/],
      ["Windows XP", /(Windows NT 5.1)|(Windows XP)/],
      ["Windows Server 2003", /(Windows NT 5.2)/],
      ["Windows Vista", /(Windows NT 6.0)/],
      ["Windows 7", /(Windows NT 6.1)/],
      ["Windows 8", /(Windows NT 6.2)/],
      ["Windows 8.1", /(Windows NT 6.3)/],
      ["Windows 10", /(Windows NT 10.0)/],
      ["Windows ME", /Windows ME/],
      ["Open BSD", /OpenBSD/],
      ["Sun OS", /SunOS/],
      ["Linux", /(Linux)|(X11)/],
      ["Mac OS", /(Mac_PowerPC)|(Macintosh)/],
      ["QNX", /QNX/],
      ["BeOS", /BeOS/],
      ["OS/2", /OS\/2/],
      ["Search Bot", /(nuhk)|(Googlebot)|(Yammybot)|(Openbot)|(Slurp)|(MSNBot)|(Ask Jeeves\/Teoma)|(ia_archiver)/]
    ])
  }

  function buildRules(e) {
    return e.map(function(e) {
      return {
        name: e[0],
        rule: e[1]
      }
    })
  }
  var detectBrowser = {
      detect: detect,
      detectOS: detectOS,
      getNodeVersion: getNodeVersion,
      parseUserAgent: parseUserAgent
    },
    detectBrowser_1 = detectBrowser.detect;
  ! function(e) {
    if (!e.fetch) {
      var t = "URLSearchParams" in e,
        r = "Symbol" in e && "iterator" in Symbol,
        s = "FileReader" in e && "Blob" in e && function() {
          try {
            return new Blob, !0
          } catch (e) {
            return !1
          }
        }(),
        n = "FormData" in e,
        o = "ArrayBuffer" in e;
      if (o) var i = ["[object Int8Array]", "[object Uint8Array]", "[object Uint8ClampedArray]", "[object Int16Array]", "[object Uint16Array]", "[object Int32Array]", "[object Uint32Array]", "[object Float32Array]", "[object Float64Array]"],
        u = function(e) {
          return e && DataView.prototype.isPrototypeOf(e)
        },
        a = ArrayBuffer.isView || function(e) {
          return e && -1 < i.indexOf(Object.prototype.toString.call(e))
        };
      p.prototype.append = function(e, t) {
        e = h(e), t = l(t);
        var r = this.map[e];
        this.map[e] = r ? r + "," + t : t
      }, p.prototype.delete = function(e) {
        delete this.map[h(e)]
      }, p.prototype.get = function(e) {
        return e = h(e), this.has(e) ? this.map[e] : null
      }, p.prototype.has = function(e) {
        return this.map.hasOwnProperty(h(e))
      }, p.prototype.set = function(e, t) {
        this.map[h(e)] = l(t)
      }, p.prototype.forEach = function(e, t) {
        for (var r in this.map) this.map.hasOwnProperty(r) && e.call(t, this.map[r], r, this)
      }, p.prototype.keys = function() {
        var r = [];
        return this.forEach(function(e, t) {
          r.push(t)
        }), d(r)
      }, p.prototype.values = function() {
        var t = [];
        return this.forEach(function(e) {
          t.push(e)
        }), d(t)
      }, p.prototype.entries = function() {
        var r = [];
        return this.forEach(function(e, t) {
          r.push([t, e])
        }), d(r)
      }, r && (p.prototype[Symbol.iterator] = p.prototype.entries);
      var f = ["DELETE", "GET", "HEAD", "OPTIONS", "POST", "PUT"];
      m.prototype.clone = function() {
        return new m(this, {
          body: this._bodyInit
        })
      }, E.call(m.prototype), E.call(b.prototype), b.prototype.clone = function() {
        return new b(this._bodyInit, {
          status: this.status,
          statusText: this.statusText,
          headers: new p(this.headers),
          url: this.url
        })
      }, b.error = function() {
        var e = new b(null, {
          status: 0,
          statusText: ""
        });
        return e.type = "error", e
      };
      var c = [301, 302, 303, 307, 308];
      b.redirect = function(e, t) {
        if (-1 === c.indexOf(t)) throw new RangeError("Invalid status code");
        return new b(null, {
          status: t,
          headers: {
            location: e
          }
        })
      }, e.Headers = p, e.Request = m, e.Response = b, e.fetch = function(r, o) {
        return new Promise(function(n, e) {
          var t = new m(r, o),
            i = new XMLHttpRequest;
          i.onload = function() {
            var e, o, t = {
              status: i.status,
              statusText: i.statusText,
              headers: (e = i.getAllResponseHeaders() || "", o = new p, e.replace(/\r?\n[\t ]+/g, " ").split(/\r?\n/).forEach(function(e) {
                var t = e.split(":"),
                  r = t.shift().trim();
                if (r) {
                  var n = t.join(":").trim();
                  o.append(r, n)
                }
              }), o)
            };
            t.url = "responseURL" in i ? i.responseURL : t.headers.get("X-Request-URL");
            var r = "response" in i ? i.response : i.responseText;
            n(new b(r, t))
          }, i.onerror = function() {
            e(new TypeError("Network request failed"))
          }, i.ontimeout = function() {
            e(new TypeError("Network request failed"))
          }, i.open(t.method, t.url, !0), "include" === t.credentials ? i.withCredentials = !0 : "omit" === t.credentials && (i.withCredentials = !1), "responseType" in i && s && (i.responseType = "blob"), t.headers.forEach(function(e, t) {
            i.setRequestHeader(t, e)
          }), i.send(void 0 === t._bodyInit ? null : t._bodyInit)
        })
      }, e.fetch.polyfill = !0
    }

    function h(e) {
      if ("string" != typeof e && (e = String(e)), /[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(e)) throw new TypeError("Invalid character in header field name");
      return e.toLowerCase()
    }

    function l(e) {
      return "string" != typeof e && (e = String(e)), e
    }

    function d(t) {
      var e = {
        next: function() {
          var e = t.shift();
          return {
            done: void 0 === e,
            value: e
          }
        }
      };
      return r && (e[Symbol.iterator] = function() {
        return e
      }), e
    }

    function p(t) {
      this.map = {}, t instanceof p ? t.forEach(function(e, t) {
        this.append(t, e)
      }, this) : Array.isArray(t) ? t.forEach(function(e) {
        this.append(e[0], e[1])
      }, this) : t && Object.getOwnPropertyNames(t).forEach(function(e) {
        this.append(e, t[e])
      }, this)
    }

    function y(e) {
      if (e.bodyUsed) return Promise.reject(new TypeError("Already read"));
      e.bodyUsed = !0
    }

    function g(r) {
      return new Promise(function(e, t) {
        r.onload = function() {
          e(r.result)
        }, r.onerror = function() {
          t(r.error)
        }
      })
    }

    function _(e) {
      var t = new FileReader,
        r = g(t);
      return t.readAsArrayBuffer(e), r
    }

    function v(e) {
      if (e.slice) return e.slice(0);
      var t = new Uint8Array(e.byteLength);
      return t.set(new Uint8Array(e)), t.buffer
    }

    function E() {
      return this.bodyUsed = !1, this._initBody = function(e) {
        if (this._bodyInit = e)
          if ("string" == typeof e) this._bodyText = e;
          else if (s && Blob.prototype.isPrototypeOf(e)) this._bodyBlob = e;
        else if (n && FormData.prototype.isPrototypeOf(e)) this._bodyFormData = e;
        else if (t && URLSearchParams.prototype.isPrototypeOf(e)) this._bodyText = e.toString();
        else if (o && s && u(e)) this._bodyArrayBuffer = v(e.buffer), this._bodyInit = new Blob([this._bodyArrayBuffer]);
        else {
          if (!o || !ArrayBuffer.prototype.isPrototypeOf(e) && !a(e)) throw new Error("unsupported BodyInit type");
          this._bodyArrayBuffer = v(e)
        } else this._bodyText = "";
        this.headers.get("content-type") || ("string" == typeof e ? this.headers.set("content-type", "text/plain;charset=UTF-8") : this._bodyBlob && this._bodyBlob.type ? this.headers.set("content-type", this._bodyBlob.type) : t && URLSearchParams.prototype.isPrototypeOf(e) && this.headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8"))
      }, s && (this.blob = function() {
        var e = y(this);
        if (e) return e;
        if (this._bodyBlob) return Promise.resolve(this._bodyBlob);
        if (this._bodyArrayBuffer) return Promise.resolve(new Blob([this._bodyArrayBuffer]));
        if (this._bodyFormData) throw new Error("could not read FormData body as blob");
        return Promise.resolve(new Blob([this._bodyText]))
      }, this.arrayBuffer = function() {
        return this._bodyArrayBuffer ? y(this) || Promise.resolve(this._bodyArrayBuffer) : this.blob().then(_)
      }), this.text = function() {
        var e, t, r, n = y(this);
        if (n) return n;
        if (this._bodyBlob) return e = this._bodyBlob, t = new FileReader, r = g(t), t.readAsText(e), r;
        if (this._bodyArrayBuffer) return Promise.resolve(function(e) {
          for (var t = new Uint8Array(e), r = new Array(t.length), n = 0; n < t.length; n++) r[n] = String.fromCharCode(t[n]);
          return r.join("")
        }(this._bodyArrayBuffer));
        if (this._bodyFormData) throw new Error("could not read FormData body as text");
        return Promise.resolve(this._bodyText)
      }, n && (this.formData = function() {
        return this.text().then(A)
      }), this.json = function() {
        return this.text().then(JSON.parse)
      }, this
    }

    function m(e, t) {
      var r, n, o = (t = t || {}).body;
      if (e instanceof m) {
        if (e.bodyUsed) throw new TypeError("Already read");
        this.url = e.url, this.credentials = e.credentials, t.headers || (this.headers = new p(e.headers)), this.method = e.method, this.mode = e.mode, o || null == e._bodyInit || (o = e._bodyInit, e.bodyUsed = !0)
      } else this.url = String(e);
      if (this.credentials = t.credentials || this.credentials || "omit", !t.headers && this.headers || (this.headers = new p(t.headers)), this.method = (r = t.method || this.method || "GET", n = r.toUpperCase(), -1 < f.indexOf(n) ? n : r), this.mode = t.mode || this.mode || null, this.referrer = null, ("GET" === this.method || "HEAD" === this.method) && o) throw new TypeError("Body not allowed for GET or HEAD requests");
      this._initBody(o)
    }

    function A(e) {
      var o = new FormData;
      return e.trim().split("&").forEach(function(e) {
        if (e) {
          var t = e.split("="),
            r = t.shift().replace(/\+/g, " "),
            n = t.join("=").replace(/\+/g, " ");
          o.append(decodeURIComponent(r), decodeURIComponent(n))
        }
      }), o
    }

    function b(e, t) {
      t || (t = {}), this.type = "default", this.status = void 0 === t.status ? 200 : t.status, this.ok = 200 <= this.status && this.status < 300, this.statusText = "statusText" in t ? t.statusText : "OK", this.headers = new p(t.headers), this.url = t.url || "", this._initBody(e)
    }
  }("undefined" != typeof self ? self : void 0);
  var version$1 = "4.1.1",
    RedirectFragmentFields, Z3;
  Z3 = RedirectFragmentFields || (RedirectFragmentFields = {}), Z3.StitchError = "_stitch_error", Z3.State = "_stitch_state", Z3.UserAuth = "_stitch_ua", Z3.LinkUser = "_stitch_link_user", Z3.StitchLink = "_stitch_link", Z3.ClientAppId = "_stitch_client_app_id";
  var RedirectFragmentFields$1 = RedirectFragmentFields,
    RedirectKeys, $3;
  $3 = RedirectKeys || (RedirectKeys = {}), $3.ProviderName = "_stitch_redirect_provider_name", $3.ProviderType = "_stitch_redirect_provider_type", $3.State = "_stitch_redirect_state";
  var RedirectKeys$1 = RedirectKeys,
    __extends$m = (_3 = Object.setPrototypeOf || {
        __proto__: []
      }
      instanceof Array && function(e, t) {
        e.__proto__ = t
      } || function(e, t) {
        for (var r in t) t.hasOwnProperty(r) && (e[r] = t[r])
      },
      function(e, t) {
        function r() {
          this.constructor = e
        }
        _3(e, t), e.prototype = null === t ? Object.create(t) : (r.prototype = t.prototype, new r)
      }),
    _3, StitchRedirectError = function(t) {
      function e(e) {
        return t.call(this, e) || this
      }
      return __extends$m(e, t), e
    }(StitchError),
    __extends$n = (l4 = Object.setPrototypeOf || {
        __proto__: []
      }
      instanceof Array && function(e, t) {
        e.__proto__ = t
      } || function(e, t) {
        for (var r in t) t.hasOwnProperty(r) && (e[r] = t[r])
      },
      function(e, t) {
        function r() {
          this.constructor = e
        }
        l4(e, t), e.prototype = null === t ? Object.create(t) : (r.prototype = t.prototype, new r)
      }),
    l4, StitchUserImpl = function(s) {
      function e(e, t, r, n, o) {
        var i = s.call(this, e, t, r, n) || this;
        return i.auth = o, i
      }
      return __extends$n(e, s), e.prototype.linkWithCredential = function(e) {
        return this.auth.linkWithCredential(this, e)
      }, e.prototype.linkUserWithRedirect = function(e) {
        return this.auth.linkWithRedirectInternal(this, e)
      }, e
    }(CoreStitchUserImpl),
    StitchUserFactoryImpl = function() {
      function e(e) {
        this.auth = e
      }
      return e.prototype.makeUser = function(e, t, r, n) {
        return new StitchUserImpl(e, t, r, n, this.auth)
      }, e
    }(),
    __extends$o = (K4 = Object.setPrototypeOf || {
        __proto__: []
      }
      instanceof Array && function(e, t) {
        e.__proto__ = t
      } || function(e, t) {
        for (var r in t) t.hasOwnProperty(r) && (e[r] = t[r])
      },
      function(e, t) {
        function r() {
          this.constructor = e
        }
        K4(e, t), e.prototype = null === t ? Object.create(t) : (r.prototype = t.prototype, new r)
      }),
    K4, alphaNumericCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
    StitchAuthImpl = function(s) {
      function u(e, t, r, n, o) {
        void 0 === o && (o = window);
        var i = s.call(this, e, t, r) || this;
        return i.browserAuthRoutes = t, i.authStorage = r, i.appInfo = n, i.jsdomWindow = o, i.listeners = new Set, i
      }
      return __extends$o(u, s), Object.defineProperty(u.prototype, "userFactory", {
        get: function() {
          return new StitchUserFactoryImpl(this)
        },
        enumerable: !0,
        configurable: !0
      }), u.prototype.getProviderClient = function(e, t) {
        return isAuthProviderClientFactory(e) ? e.getClient(this, this.requestClient, this.authRoutes) : e.getNamedClient(t, this.requestClient, this.authRoutes)
      }, u.prototype.loginWithCredential = function(e) {
        return s.prototype.loginWithCredentialInternal.call(this, e)
      }, u.prototype.loginWithRedirect = function(e) {
        var t = this.prepareRedirect(e),
          r = t.redirectUrl,
          n = t.state;
        this.jsdomWindow.location.replace(this.browserAuthRoutes.getAuthProviderRedirectRoute(e, r, n, this.deviceInfo))
      }, u.prototype.linkWithRedirectInternal = function(e, t) {
        var r = this;
        if (void 0 !== this.user && e.id !== this.user.id) return Promise.reject(new StitchClientError(exports.StitchClientErrorCode.UserNoLongerValid));
        var n = this.prepareRedirect(t),
          o = n.redirectUrl,
          i = n.state,
          s = this.browserAuthRoutes.getAuthProviderLinkRedirectRoute(t, o, i, this.deviceInfo);
        return (u.injectedFetch ? u.injectedFetch : fetch)(new Request(s, {
          credentials: "include",
          headers: {
            Authorization: "Bearer " + this.authInfo.accessToken
          },
          mode: "cors"
        })).then(function(e) {
          r.jsdomWindow.location.replace(e.headers.get("X-Stitch-Location"))
        })
      }, u.prototype.hasRedirectResult = function() {
        var e = !1;
        try {
          return e = this.parseRedirect().isValid
        } catch (e) {
          return !1
        } finally {
          e || this.cleanupRedirect()
        }
      }, u.prototype.handleRedirectResult = function() {
        try {
          var e = this.authStorage.get(RedirectKeys$1.ProviderName),
            t = this.authStorage.get(RedirectKeys$1.ProviderType),
            r = this.parseRedirect();
          return this.loginWithCredentialInternal(new StitchAuthResponseCredential(this.processRedirectResult(r), t, e, r.asLink)).then(function(e) {
            return e
          })
        } catch (e) {
          return Promise.reject(e)
        }
      }, u.prototype.linkWithCredential = function(e, t) {
        return s.prototype.linkUserWithCredentialInternal.call(this, e, t)
      }, u.prototype.logout = function() {
        return Promise.resolve(s.prototype.logoutInternal.call(this))
      }, Object.defineProperty(u.prototype, "deviceInfo", {
        get: function() {
          var e = {};
          this.hasDeviceId && (e[DeviceFields$1.DEVICE_ID] = this.deviceId), void 0 !== this.appInfo.localAppName && (e[DeviceFields$1.APP_ID] = this.appInfo.localAppName), void 0 !== this.appInfo.localAppVersion && (e[DeviceFields$1.APP_VERSION] = this.appInfo.localAppVersion);
          var t = detectBrowser_1();
          return t ? (e[DeviceFields$1.PLATFORM] = t.name, e[DeviceFields$1.PLATFORM_VERSION] = t.version) : (e[DeviceFields$1.PLATFORM] = "web", e[DeviceFields$1.PLATFORM_VERSION] = "0.0.0"), e[DeviceFields$1.SDK_VERSION] = version$1, e
        },
        enumerable: !0,
        configurable: !0
      }), u.prototype.addAuthListener = function(e) {
        this.listeners.add(e), this.onAuthEvent(e)
      }, u.prototype.removeAuthListener = function(e) {
        this.listeners.delete(e)
      }, u.prototype.onAuthEvent = function(t) {
        var r = this;
        if (t) {
          var n = this;
          new Promise(function(e) {
            t.onAuthEvent(n), e(void 0)
          })
        } else this.listeners.forEach(function(e) {
          r.onAuthEvent(e)
        })
      }, u.prototype.cleanupRedirect = function() {
        this.jsdomWindow.history.replaceState(null, "", this.pageRootUrl()), this.authStorage.remove(RedirectKeys$1.State), this.authStorage.remove(RedirectKeys$1.ProviderName), this.authStorage.remove(RedirectKeys$1.ProviderType)
      }, u.prototype.parseRedirect = function() {
        if (void 0 === this.jsdomWindow) throw new StitchRedirectError("running in a non-browser environment");
        if (!this.jsdomWindow.location || !this.jsdomWindow.location.hash) throw new StitchRedirectError("window location hash was undefined");
        var e = this.authStorage.get(RedirectKeys$1.State);
        return parseRedirectFragment(this.jsdomWindow.location.hash.substring(1), e, this.appInfo.clientAppId)
      }, u.prototype.processRedirectResult = function(e) {
        try {
          if (!e.isValid) throw new StitchRedirectError("invalid redirect result");
          if (e.lastError) throw new StitchRedirectError("error handling redirect: " + e.lastError);
          if (!e.authInfo) throw new StitchRedirectError("no user auth value was found: it could not be decoded from fragment")
        } catch (e) {
          throw e
        } finally {
          this.cleanupRedirect()
        }
        return e.authInfo
      }, u.prototype.prepareRedirect = function(e) {
        this.authStorage.set(RedirectKeys$1.ProviderName, e.providerName), this.authStorage.set(RedirectKeys$1.ProviderType, e.providerType);
        var t = e.redirectUrl;
        void 0 === t && (t = this.pageRootUrl());
        var r = generateState();
        return this.authStorage.set(RedirectKeys$1.State, r), {
          redirectUrl: t,
          state: r
        }
      }, u.prototype.pageRootUrl = function() {
        return [this.jsdomWindow.location.protocol, "//", this.jsdomWindow.location.host, this.jsdomWindow.location.pathname].join("")
      }, u
    }(CoreStitchAuth);

  function generateState() {
    for (var e = "", t = 0; t < 64; ++t) e += alphaNumericCharacters.charAt(Math.floor(Math.random() * alphaNumericCharacters.length));
    return e
  }

  function unmarshallUserAuth(e) {
    var t = e.split("$");
    if (4 !== t.length) throw new StitchRedirectError("invalid user auth data provided while marshalling user authentication data: " + e);
    var r = t[0],
      n = t[1],
      o = t[2],
      i = t[3];
    return new AuthInfo(o, i, r, n)
  }
  var ParsedRedirectFragment = function() {
    function e() {
      this.stateValid = !1, this.clientAppIdValid = !1, this.asLink = !1
    }
    return Object.defineProperty(e.prototype, "isValid", {
      get: function() {
        return this.stateValid && this.clientAppIdValid
      },
      enumerable: !0,
      configurable: !0
    }), e
  }();

  function parseRedirectFragment(e, o, i) {
    var t = e.split("&"),
      s = new ParsedRedirectFragment;
    return t.forEach(function(e) {
      var t = e.split("=");
      switch (decodeURIComponent(t[0])) {
        case RedirectFragmentFields$1.StitchError:
          s.lastError = decodeURIComponent(t[1]);
          break;
        case RedirectFragmentFields$1.UserAuth:
          try {
            s.authInfo = unmarshallUserAuth(decodeURIComponent(t[1]))
          } catch (e) {
            s.lastError = e
          }
          break;
        case RedirectFragmentFields$1.StitchLink:
          "ok" == t[1] && (s.asLink = !0);
          break;
        case RedirectFragmentFields$1.State:
          var r = decodeURIComponent(t[1]);
          o === r && (s.stateValid = !0);
          break;
        case RedirectFragmentFields$1.ClientAppId:
          var n = decodeURIComponent(t[1]);
          i === n && (s.clientAppIdValid = !0)
      }
    }), s
  }

  function isAuthProviderClientFactory(e) {
    return void 0 !== e.getClient
  }
  var __extends$p = (h6 = Object.setPrototypeOf || {
        __proto__: []
      }
      instanceof Array && function(e, t) {
        e.__proto__ = t
      } || function(e, t) {
        for (var r in t) t.hasOwnProperty(r) && (e[r] = t[r])
      },
      function(e, t) {
        function r() {
          this.constructor = e
        }
        h6(e, t), e.prototype = null === t ? Object.create(t) : (r.prototype = t.prototype, new r)
      }),
    h6, StitchBrowserAppAuthRoutes = function(n) {
      function e(e, t) {
        var r = n.call(this, e) || this;
        return r.baseUrl = t, r
      }
      return __extends$p(e, n), e.prototype.getAuthProviderRedirectRoute = function(e, t, r, n) {
        return "" + this.baseUrl + this.getAuthProviderLoginRoute(e.providerName) + "?redirect=" + encodeURI(t) + "&state=" + r + "&device=" + this.uriEncodeObject(n)
      }, e.prototype.getAuthProviderLinkRedirectRoute = function(e, t, r, n) {
        return "" + this.baseUrl + this.getAuthProviderLoginRoute(e.providerName) + "?redirect=" + encodeURI(t) + "&state=" + r + "&device=" + this.uriEncodeObject(n) + "&link=true&providerRedirectHeader=true"
      }, e.prototype.uriEncodeObject = function(e) {
        return encodeURIComponent(base64Encode(JSON.stringify(e)))
      }, e
    }(StitchAppAuthRoutes),
    __extends$q = (E6 = Object.setPrototypeOf || {
        __proto__: []
      }
      instanceof Array && function(e, t) {
        e.__proto__ = t
      } || function(e, t) {
        for (var r in t) t.hasOwnProperty(r) && (e[r] = t[r])
      },
      function(e, t) {
        function r() {
          this.constructor = e
        }
        E6(e, t), e.prototype = null === t ? Object.create(t) : (r.prototype = t.prototype, new r)
      }),
    E6, StitchBrowserAppRoutes = function(n) {
      function e(e, t) {
        var r = n.call(this, e) || this;
        return r.authRoutes = new StitchBrowserAppAuthRoutes(e, t), r
      }
      return __extends$q(e, n), e
    }(StitchAppRoutes),
    StitchServiceClientImpl = function() {
      function e(e) {
        this.proxy = e
      }
      return e.prototype.callFunction = function(e, t, r) {
        return this.proxy.callFunction(e, t, r)
      }, e.prototype.streamFunction = function(e, t, r) {
        return this.proxy.streamFunction(e, t, r)
      }, e
    }(),
    StitchAppClientImpl = function() {
      function e(e, t) {
        this.info = new StitchAppClientInfo(e, t.dataDirectory, t.localAppName, t.localAppVersion), this.routes = new StitchBrowserAppRoutes(this.info.clientAppId, t.baseUrl);
        var r = new StitchAppRequestClient(e, t.baseUrl, t.transport);
        this.auth = new StitchAuthImpl(r, this.routes.authRoutes, t.storage, this.info), this.coreClient = new CoreStitchAppClient(this.auth, this.routes)
      }
      return e.prototype.getServiceClient = function(e, t) {
        return isServiceClientFactory(e) ? e.getClient(new CoreStitchServiceClientImpl(this.auth, this.routes.serviceRoutes, ""), this.info) : e.getNamedClient(new CoreStitchServiceClientImpl(this.auth, this.routes.serviceRoutes, t), this.info)
      }, e.prototype.getGeneralServiceClient = function(e) {
        return new StitchServiceClientImpl(new CoreStitchServiceClientImpl(this.auth, this.routes.serviceRoutes, e))
      }, e.prototype.callFunction = function(e, t) {
        return this.coreClient.callFunction(e, t)
      }, e
    }();

  function isServiceClientFactory(e) {
    return void 0 !== e.getClient
  }
  var DEFAULT_BASE_URL = "https://stitch.mongodb.com",
    appClients = {},
    Stitch = function() {
      function o() {}
      return Object.defineProperty(o, "defaultAppClient", {
        get: function() {
          if (void 0 === o.defaultClientAppId) throw new Error("default app client has not yet been initialized/set");
          return appClients[o.defaultClientAppId]
        },
        enumerable: !0,
        configurable: !0
      }), o.getAppClient = function(e) {
        if (void 0 === appClients[e]) throw new Error("client for app '" + e + "' has not yet been initialized");
        return appClients[e]
      }, o.hasAppClient = function(e) {
        return void 0 !== appClients[e]
      }, o.initializeDefaultAppClient = function(e, t) {
        if (void 0 === t && (t = (new exports.StitchAppClientConfiguration.Builder).build()), void 0 === e || "" === e) throw new Error("clientAppId must be set to a non-empty string");
        if (void 0 !== o.defaultClientAppId) throw new Error("default app can only be set once; currently set to '" + o.defaultClientAppId + "'");
        var r = o.initializeAppClient(e, t);
        return o.defaultClientAppId = e, r
      }, o.initializeAppClient = function(e, t) {
        if (void 0 === t && (t = (new exports.StitchAppClientConfiguration.Builder).build()), void 0 === e || "" === e) throw new Error("clientAppId must be set to a non-empty string");
        if (void 0 !== appClients[e]) throw new Error("client for app '" + e + "' has already been initialized");
        var r = t.builder ? t.builder() : new exports.StitchAppClientConfiguration.Builder(t);
        void 0 === r.storage && r.withStorage(new LocalStorage(e)), void 0 === r.transport && r.withTransport(new FetchStreamTransport), void 0 !== r.baseUrl && "" !== r.baseUrl || r.withBaseUrl(DEFAULT_BASE_URL), void 0 !== r.localAppName && "" !== r.localAppName || r.withLocalAppName(o.localAppName), void 0 !== r.localAppVersion && "" !== r.localAppVersion || r.withLocalAppVersion(o.localAppVersion);
        var n = new StitchAppClientImpl(e, r.build());
        return appClients[e] = n
      }, o
    }(),
    CoreRemoteMongoReadOperation = function() {
      function e(e, t, r, n) {
        this.command = e, this.args = t, this.service = r, n && (this.collectionDecoder = new(function() {
          function e() {}
          return e.prototype.decode = function(e) {
            return e instanceof Array ? e.map(function(e) {
              return n.decode(e)
            }) : [n.decode(e)]
          }, e
        }()))
      }
      return e.prototype.iterator = function() {
        return this.executeRead().then(function(e) {
          return e[Symbol.iterator]()
        })
      }, e.prototype.first = function() {
        return this.executeRead().then(function(e) {
          return e[0]
        })
      }, e.prototype.toArray = function() {
        return this.executeRead()
      }, e.prototype.asArray = function() {
        return this.toArray()
      }, e.prototype.executeRead = function() {
        return this.service.callFunction(this.command, [this.args], this.collectionDecoder)
      }, e
    }(),
    OperationType, C7;

  function operationTypeFromRemote(e) {
    switch (e) {
      case "insert":
        return OperationType.Insert;
      case "delete":
        return OperationType.Delete;
      case "replace":
        return OperationType.Replace;
      case "update":
        return OperationType.Update;
      default:
        return OperationType.Unknown
    }
  }
  C7 = OperationType || (OperationType = {}), C7.Insert = "insert", C7.Delete = "delete", C7.Replace = "replace", C7.Update = "update", C7.Unknown = "unknown";
  var RemoteInsertManyResult = function(e) {
      var r = {};
      e.forEach(function(e, t) {
        r[t] = e
      }), this.insertedIds = r
    },
    RemoteInsertManyResultFields, RemoteInsertOneResultFields, RemoteUpdateResultFields, L7, RemoteDeleteResultFields, ChangeEventFields, N7;
  (RemoteInsertManyResultFields || (RemoteInsertManyResultFields = {})).InsertedIds = "insertedIds", (RemoteInsertOneResultFields || (RemoteInsertOneResultFields = {})).InsertedId = "insertedId", L7 = RemoteUpdateResultFields || (RemoteUpdateResultFields = {}), L7.MatchedCount = "matchedCount", L7.ModifiedCount = "modifiedCount", L7.UpsertedId = "upsertedId", (RemoteDeleteResultFields || (RemoteDeleteResultFields = {})).DeletedCount = "deletedCount", N7 = ChangeEventFields || (ChangeEventFields = {}), N7.Id = "_id", N7.OperationType = "operationType", N7.FullDocument = "fullDocument", N7.DocumentKey = "documentKey", N7.Namespace = "ns", N7.NamespaceDb = "db", N7.NamespaceColl = "coll", N7.UpdateDescription = "updateDescription", N7.UpdateDescriptionUpdatedFields = "updatedFields", N7.UpdateDescriptionRemovedFields = "removedFields";
  var RemoteInsertManyResultDecoder = function() {
      function e() {}
      return e.prototype.decode = function(e) {
        return new RemoteInsertManyResult(e[RemoteInsertManyResultFields.InsertedIds])
      }, e
    }(),
    RemoteInsertOneResultDecoder = function() {
      function e() {}
      return e.prototype.decode = function(e) {
        return {
          insertedId: e[RemoteInsertOneResultFields.InsertedId]
        }
      }, e
    }(),
    RemoteUpdateResultDecoder = function() {
      function e() {}
      return e.prototype.decode = function(e) {
        return {
          matchedCount: e[RemoteUpdateResultFields.MatchedCount],
          modifiedCount: e[RemoteUpdateResultFields.ModifiedCount],
          upsertedId: e[RemoteUpdateResultFields.UpsertedId]
        }
      }, e
    }(),
    RemoteDeleteResultDecoder = function() {
      function e() {}
      return e.prototype.decode = function(e) {
        return {
          deletedCount: e[RemoteDeleteResultFields.DeletedCount]
        }
      }, e
    }(),
    ChangeEventDecoder = function() {
      function e(e) {
        this.decoder = e
      }
      return e.prototype.decode = function(e) {
        Assertions.keyPresent(ChangeEventFields.Id, e), Assertions.keyPresent(ChangeEventFields.OperationType, e), Assertions.keyPresent(ChangeEventFields.Namespace, e), Assertions.keyPresent(ChangeEventFields.DocumentKey, e);
        var t, r, n = e[ChangeEventFields.Namespace];
        if (ChangeEventFields.UpdateDescription in e) {
          var o = e[ChangeEventFields.UpdateDescription];
          Assertions.keyPresent(ChangeEventFields.UpdateDescriptionUpdatedFields, o), Assertions.keyPresent(ChangeEventFields.UpdateDescriptionRemovedFields, o), t = {
            removedFields: o[ChangeEventFields.UpdateDescriptionRemovedFields],
            updatedFields: o[ChangeEventFields.UpdateDescriptionUpdatedFields]
          }
        } else t = void 0;
        return ChangeEventFields.FullDocument in e ? (r = e[ChangeEventFields.FullDocument], this.decoder && (r = this.decoder.decode(r))) : r = void 0, {
          documentKey: e[ChangeEventFields.DocumentKey],
          fullDocument: r,
          id: e[ChangeEventFields.Id],
          namespace: {
            collection: n[ChangeEventFields.NamespaceColl],
            database: n[ChangeEventFields.NamespaceDb]
          },
          operationType: operationTypeFromRemote(e[ChangeEventFields.OperationType]),
          updateDescription: t
        }
      }, e
    }(),
    ResultDecoders = function() {
      function e() {}
      return e.remoteInsertManyResultDecoder = new RemoteInsertManyResultDecoder, e.remoteInsertOneResultDecoder = new RemoteInsertOneResultDecoder, e.remoteUpdateResultDecoder = new RemoteUpdateResultDecoder, e.remoteDeleteResultDecoder = new RemoteDeleteResultDecoder, e.ChangeEventDecoder = ChangeEventDecoder, e
    }(),
    __assign$1 = Object.assign || function(e) {
      for (var t, r = 1, n = arguments.length; r < n; r++)
        for (var o in t = arguments[r]) Object.prototype.hasOwnProperty.call(t, o) && (e[o] = t[o]);
      return e
    },
    CoreRemoteMongoCollectionImpl = function() {
      function t(e, t, r, n) {
        var o = this;
        this.name = e, this.databaseName = t, this.service = r, this.codec = n, this.namespace = this.databaseName + "." + this.name, this.baseOperationArgs = {
          collection: o.name,
          database: o.databaseName
        }
      }
      return t.prototype.withCollectionType = function(e) {
        return new t(this.name, this.databaseName, this.service, e)
      }, t.prototype.find = function(e, t) {
        void 0 === e && (e = {});
        var r = __assign$1({}, this.baseOperationArgs);
        return r.query = e, t && (t.limit && (r.limit = t.limit), t.projection && (r.project = t.projection), t.sort && (r.sort = t.sort)), new CoreRemoteMongoReadOperation("find", r, this.service, this.codec)
      }, t.prototype.aggregate = function(e) {
        var t = __assign$1({}, this.baseOperationArgs);
        return t.pipeline = e, new CoreRemoteMongoReadOperation("aggregate", t, this.service, this.codec)
      }, t.prototype.count = function(e, t) {
        void 0 === e && (e = {});
        var r = __assign$1({}, this.baseOperationArgs);
        return r.query = e, t && t.limit && (r.limit = t.limit), this.service.callFunction("count", [r])
      }, t.prototype.insertOne = function(e) {
        var t = __assign$1({}, this.baseOperationArgs);
        return t.document = this.generateObjectIdIfMissing(this.codec ? this.codec.encode(e) : e), this.service.callFunction("insertOne", [t], ResultDecoders.remoteInsertOneResultDecoder)
      }, t.prototype.insertMany = function(e) {
        var t = this,
          r = __assign$1({}, this.baseOperationArgs);
        return r.documents = e.map(function(e) {
          return t.generateObjectIdIfMissing(t.codec ? t.codec.encode(e) : e)
        }), this.service.callFunction("insertMany", [r], ResultDecoders.remoteInsertManyResultDecoder)
      }, t.prototype.deleteOne = function(e) {
        return this.executeDelete(e, !1)
      }, t.prototype.deleteMany = function(e) {
        return this.executeDelete(e, !0)
      }, t.prototype.updateOne = function(e, t, r) {
        return this.executeUpdate(e, t, r, !1)
      }, t.prototype.updateMany = function(e, t, r) {
        return this.executeUpdate(e, t, r, !0)
      }, t.prototype.watch = function(e) {
        var t = __assign$1({}, this.baseOperationArgs);
        return t.ids = e, this.service.streamFunction("watch", [t], new ResultDecoders.ChangeEventDecoder(this.codec))
      }, t.prototype.executeDelete = function(e, t) {
        var r = __assign$1({}, this.baseOperationArgs);
        return r.query = e, this.service.callFunction(t ? "deleteMany" : "deleteOne", [r], ResultDecoders.remoteDeleteResultDecoder)
      }, t.prototype.executeUpdate = function(e, t, r, n) {
        void 0 === n && (n = !1);
        var o = __assign$1({}, this.baseOperationArgs);
        return o.query = e, o.update = t, r && r.upsert && (o.upsert = r.upsert), this.service.callFunction(n ? "updateMany" : "updateOne", [o], ResultDecoders.remoteUpdateResultDecoder)
      }, t.prototype.generateObjectIdIfMissing = function(e) {
        if (!e._id) {
          var t = e;
          return t._id = new bson.ObjectID, t
        }
        return e
      }, t
    }(),
    CoreRemoteMongoDatabaseImpl = function() {
      function e(e, t) {
        this.name = e, this.service = t
      }
      return e.prototype.collection = function(e, t) {
        return new CoreRemoteMongoCollectionImpl(e, this.name, this.service, t)
      }, e
    }(),
    CoreRemoteMongoClientImpl = function() {
      function e(e) {
        this.service = e
      }
      return e.prototype.db = function(e) {
        return new CoreRemoteMongoDatabaseImpl(e, this.service)
      }, e
    }(),
    RemoteMongoCursor = function() {
      function e(e) {
        this.proxy = e
      }
      return e.prototype.next = function() {
        return Promise.resolve(this.proxy.next().value)
      }, e
    }(),
    RemoteMongoReadOperation = function() {
      function e(e) {
        this.proxy = e
      }
      return e.prototype.first = function() {
        return this.proxy.first()
      }, e.prototype.toArray = function() {
        return this.proxy.toArray()
      }, e.prototype.asArray = function() {
        return this.toArray()
      }, e.prototype.iterator = function() {
        return this.proxy.iterator().then(function(e) {
          return new RemoteMongoCursor(e)
        })
      }, e
    }(),
    RemoteMongoCollectionImpl = function() {
      function t(e) {
        this.proxy = e, this.namespace = this.proxy.namespace
      }
      return t.prototype.withCollectionType = function(e) {
        return new t(this.proxy.withCollectionType(e))
      }, t.prototype.count = function(e, t) {
        return this.proxy.count(e, t)
      }, t.prototype.find = function(e, t) {
        return new RemoteMongoReadOperation(this.proxy.find(e, t))
      }, t.prototype.aggregate = function(e) {
        return new RemoteMongoReadOperation(this.proxy.aggregate(e))
      }, t.prototype.insertOne = function(e) {
        return this.proxy.insertOne(e)
      }, t.prototype.insertMany = function(e) {
        return this.proxy.insertMany(e)
      }, t.prototype.deleteOne = function(e) {
        return this.proxy.deleteOne(e)
      }, t.prototype.deleteMany = function(e) {
        return this.proxy.deleteMany(e)
      }, t.prototype.updateOne = function(e, t, r) {
        return this.proxy.updateOne(e, t, r)
      }, t.prototype.updateMany = function(e, t, r) {
        return this.proxy.updateMany(e, t, r)
      }, t.prototype.watch = function(e) {
        return this.proxy.watch(e)
      }, t
    }(),
    RemoteMongoDatabaseImpl = function() {
      function e(e) {
        this.proxy = e, this.name = this.proxy.name
      }
      return e.prototype.collection = function(e, t) {
        return new RemoteMongoCollectionImpl(this.proxy.collection(e, t))
      }, e
    }(),
    RemoteMongoClientImpl = function() {
      function e(e) {
        this.proxy = e
      }
      return e.prototype.db = function(e) {
        return new RemoteMongoDatabaseImpl(this.proxy.db(e))
      }, e
    }();
  (exports.RemoteMongoClient || (exports.RemoteMongoClient = {})).factory = new(function() {
    function e() {}
    return e.prototype.getNamedClient = function(e, t) {
      return new RemoteMongoClientImpl(new CoreRemoteMongoClientImpl(e))
    }, e
  }()), exports.AnonymousAuthProvider = AnonymousAuthProvider, exports.AnonymousCredential = AnonymousCredential, exports.CustomAuthProvider = CustomAuthProvider, exports.CustomCredential = CustomCredential, exports.FacebookAuthProvider = FacebookAuthProvider, exports.FacebookCredential = FacebookCredential, exports.GoogleAuthProvider = GoogleAuthProvider, exports.GoogleCredential = GoogleCredential, exports.ServerApiKeyAuthProvider = ServerApiKeyAuthProvider, exports.ServerApiKeyCredential = ServerApiKeyCredential, exports.UserApiKeyAuthProvider = UserApiKeyAuthProvider, exports.UserApiKey = UserApiKey, exports.UserApiKeyCredential = UserApiKeyCredential, exports.UserPasswordAuthProvider = UserPasswordAuthProvider, exports.UserPasswordCredential = UserPasswordCredential, exports.StitchAppClientInfo = StitchAppClientInfo, exports.StitchClientError = StitchClientError, exports.StitchRequestError = StitchRequestError, exports.StitchServiceError = StitchServiceError, exports.StitchUserIdentity = StitchUserIdentity, exports.MemoryStorage = MemoryStorage, exports.UserType = UserType$1, exports.Stitch = Stitch, exports.FacebookRedirectCredential = FacebookRedirectCredential, exports.GoogleRedirectCredential = GoogleRedirectCredential, exports.RemoteInsertManyResult = RemoteInsertManyResult, exports.RemoteMongoReadOperation = RemoteMongoReadOperation
}(this.stitch = this.stitch || {});
//# sourceMappingURL=stitch.js.map
