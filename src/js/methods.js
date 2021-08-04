let points;

const CompactGauss = (A, b, n) => {
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