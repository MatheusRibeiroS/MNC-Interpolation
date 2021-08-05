const compactGauss = (A, b, n) => {
  for (let i = 0; i < n; i++) {
    let pivo = A[i][i];
    if (pivo == 0) {
      console.log("O sistema é impossível de ser resolvido pelo método de gauss compacto pois o pivo é zero");
      alert("O sistema é impossível de ser resolvido pelo método de gauss compacto pois o pivo é zero");
      return;
    }
    for (let j = i + 1; j < n; j++) {
      let a = A[j][i] / pivo;
      A[j][i] = a;
      for (let k = i + 1; k < n; k++) {
        A[j][k] -= A[i][k] * a;
      }
    }
  }
  for (let i = 0; i < n; i++) {
    for (let j = i - 1; j > -1; j--) {
      b[i] -= b[j] * A[i][j];
    }
  }
  let x = new Array(n);
  for (let i = n - 1; i > -1; i--) {
    let aux = b[i];
    for (let j = i + 1; j < n; j++) {
      aux -= A[i][j] * x[j];
    }
    x[i] = aux / A[i][i];
  }
  return x;
};

/* -------------------------
|   Interpolation Methods
|--------------------------*/

// Newton Method

function interpolate(x, f) {
  var amap = function (v) {
      return parseFloat(v);
    },
    x = x.map(amap),
    f = f.map(amap),
    n = Math.min(x.length, f.length),
    a = [];
  for (var i = 0; i < n; i++) {
    a[i] = f[0];
    for (var j = 1; j < n - i; j++)
      f[j - 1] = parseFloat(
        ((f[j] - f[j - 1]) / (x[j + i] - x[j - 1])).toFixed(7)
      );
  }
  // a0 + a1(x - x0) + a2(x-x0)(x-x1) + a3(x-x0)(x-x1)(x-x2) + ...
  // print the interpolating polynomial and also multiply the binomials for final form
  var pstr = a[0],
    multi = [new Poly(a[0])];
  for (var i = 1; i < a.length; i++) {
    pstr += " + " + a[i];
    var pairs = [a[i]];
    for (var j = 0; j < i; j++) {
      pstr += "(x - " + x[j] + ")";
      pairs.push([-x[j], 1]);
    }
    multi.push(Poly.multiply.apply(undefined, pairs));
  }
  // print final form
  var multiStr = [];
  for (var i = multi.length - 1; i >= 0; i--) {
    for (var j = multi[i].length - 1; j >= 0; j--) {
      if (!multiStr[j]) {
        multiStr[j * 2] = 0;
        multiStr[j * 2 + 1] =
          (j != 0 ? " x" : "") +
          (j != 1 && j != 0 ? "<sup>" + j + "</sup>" : "") +
          " +";
      }
      multiStr[j * 2] += multi[i].coeff[j];
    }
  }
  for (var i = multiStr.length - 2; i >= 0; i -= 2) {
    multiStr[i] = parseFloat(multiStr[i].toFixed(7));
    if (multiStr[i + 2] < 0 || !multiStr[i + 2])
      multiStr[i + 1] = multiStr[i + 1].replace(/\+\s?$/, "");
  }
  var result = document.querySelector("#result");
  result.innerHTML =
    "<div>" +
    pstr +
    "</div><br /><div>" +
    multiStr.join("").replace(/([\-\+])/g, " $1 ") +
    "</div>";
}
/*!
 * polynomial class with multiplication
 */
function Poly(coeff) {
  this.coeff = !(coeff instanceof Array)
    ? Array.prototype.slice.call(arguments)
    : coeff;
  this.length = this.coeff.length;
  this.multiply = function (poly) {
    if (!poly) return this;
    var totalLength = this.coeff.length + poly.coeff.length - 1,
      result = new Array(totalLength);
    for (var i = 0; i < result.length; i++) result[i] = 0;
    for (var i = 0; i < this.coeff.length; i++) {
      for (var j = 0; j < poly.coeff.length; j++) {
        result[i + j] += this.coeff[i] * poly.coeff[j];
      }
    }
    return new Poly(result);
  };
}
Poly.multiply = function () {
  var args = Array.prototype.slice.call(arguments),
    result = undefined;
  for (var i = 0; i < args.length; i++) {
    if (!(args[i] instanceof Poly)) args[i] = new Poly(args[i]);
    result = args[i].multiply(result);
  }
  return result;
};

// -------------------------
