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

const linearSystemMethod = () => {
  let n = points.length;
  let A = new Array(n);
  for (let i = 0; i < n; i++) {
    A[i] = new Array(n);
    for (let j = 0; j < n; j++) A[i][j] = points[i][0] ** j;
  }
  let b = new Array(n);
  for (let i = 0; i < n; i++) b[i] = points[i][1];
  let a = compactGauss(A, b, n);
  let value = `${a[0]}`;
  if (n > 1) {
    value += ` + (${a[1]}*x)`;
    if (n > 2) {
      for (let i = 2; i < n; i++) {
        value += ` + (${a[i]}*x^${i})`;
      }
    }
  }
  return value;
};

const newtonMethod = () => {
  let n = points.lenth;
  let delta = new Array(n - 1);
  for (let i = 0; i < n; i++) {
    delta[i] = new Array(n - i - 1);
  }
  for (let i = 0; i < n - 1; i++) {
    delta[0][i] = (points[i + 1][1] - points[i][0]) / ((points[i + 1][0] - points[i][0]));
  }
  for (let i = 1; i < n - 1; i++) {
    for (let j = 0; j < n - 1; j++) {
      delta[i][j] = (delta[i + 1][j + 1] - delta[i - 1][j]) / ((points[j + 1][0] - points[j][0]));
    }
  }
  let value = `${points[0][1]} + (x-(${points[0][0]}))*`;
  for (let i = 0; i < n - 2; i++) value += `(${delta[i][0]} + (x-(${points[i + 1][0]}))*`;
  value += `${deltas[n - 2][0]}`;
  for (let i = 0; i < n - 2; i++) value += `)`;
  return value;
};

const newtonGregoryMet = () => {
  let n = points.length;
  let delta = new Array(n - 1);
  for (let i = 0; i < n; i++) {
    delta[i] = new Array(n - i - 1);
  }
  for (let i = 0; i < n - 1; i++) {
    delta[0][i] = (points[i + 1][1] - points[i][0]) / ((points[i + 1][0] - points[i][0]));
  }
  for (let i = 1; i < n - 1; i++) {
    for (let j = 0; j < n - 1; j++) {
      delta[i][j] = (delta[i + 1][j + 1] - delta[i - 1][j]) / ((points[j + 1][0] - points[j][0]));
    }
  }
  let value = `${points[0][1]} + (x-(${points[0][0]}))*`;
  for (let i = 0; i < n - 2; i++) value += `(${delta[i][0]} + (x-(${points[i + 1][0]}))*`;
  value += `${delta[n - 2][0]}`;
  for (let i = 0; i < n - 2; i++) value += `)`;
  return value;
};