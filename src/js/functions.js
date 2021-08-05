let points;

const resize = () => {
  let table = document.querySelector("#table");
  let n = parseInt(document.querySelector("#n").value);
  table.innerHTML = "";
  if (isNaN(n) || n < 1) {
    return;
  }

  let row = new Array(3);
  let cells = new Array(3);

  Array.from({ length: 3 }, (v, k) => k).forEach((i) => {
    row[i] = document.createElement("tr");
    cells[i] = document.createElement("th");
  });

  // Labels
  cells[0].innerHTML = "i";
  cells[1].innerHTML = "x";
  cells[2].innerHTML = "y";

  row.map((element, index) => {
    element.appendChild(cells[index]);
  });
  // tableBody.appendChild(row);

  for (let index = 0; index < n; index++) {
    cells[0] = document.createElement("th");
    cells[0].innerHTML = index + 1;
    for (let j = 1; j < 3; j++) {
      cells[j] = document.createElement("td");
      cells[j].innerHTML = `<input type="text" id="point${index}${j}">`;
    }
    for (let j = 0; j < 3; j++) row[j].appendChild(cells[j]);
  }
  for (let index = 0; index < 3; index++) table.appendChild(row[index]);
};

const getPoints = () => {
  let auxX = [],
    auxY = [],
    xy = [];

  // "row[0].cells.length - 1" , equals the number of columns from 1
  let row = document.getElementsByTagName("table")[0].rows;
  for (let i = 1; i <= row[0].cells.length - 1; i++) {
    auxX.push(row[1].cells[i].firstChild.value);
    auxY.push(row[2].cells[i].firstChild.value);
  }

  // pairs x and y -> P(x,y)
  auxX.forEach((element, index) => {
    xy.push([element, auxY[index]]);
  });

  return { xy, matrix: [auxX, auxY] };
};

const orderedPoints = () => {
  let { xy } = getPoints();

  xy.sort((a, b) => a[0] - b[0]); // Sorting by x
  let x = xy.map((element) => element[0]);
  let y = xy.map((element) => element[1]);

  return { x, y };
};

const verification = () => {
  let n = document.querySelector(`#n`).value;
  let k = document.querySelector(`#k`).value;
  let z = document.querySelector(`#z`).value;

  if (
    isNaN(parseInt(n)) ||
    isNaN(parseInt(k)) ||
    isNaN(parseFloat(z)) ||
    parseInt(n) < 1 ||
    parseInt(k) < 1 ||
    parseFloat(z) < 1 ||
    parseFloat(z) > parseInt(n)
  ) {
    console.log("Insira valores válidos para n, k e z.");
    // document.querySelector(`#result`).innerText = "Insira valores válidos para n, k e z.";
    n = "";
    k = "";
    z = "";
    return false;
  }
  return true;
};

const referencePoint = () => {
  let n = Number(document.querySelector(`#n`).value);
  let k = Number(document.querySelector(`#k`).value);
  let z = document.querySelector(`#z`);
  if (n && k) {
    if (k < n - 1) z.removeAttribute("disabled");
    else z.setAttribute("disabled", "disabled");
  }
};

const calculate = () => {
  if (!verification()) {
    return;
  }

  let n = parseInt(document.querySelector(`#n`).value);
  let k = parseInt(document.querySelector(`#k`).value);
  let z = parseFloat(document.querySelector(`#z`).value);
  let resultDiv = document.querySelector(`#result-div`); 

  let { x, y } = orderedPoints(); // x and y are ordered by x
  let { matrix } = getPoints(); // matrix
  let ySelected = ySelected(n, k, z, matrix); // y selected

  points = new Array(k);
  let Xaux, Yaux;
  if (n == k) {
    for (let i = 0; i < n; i++) {
      points[i] = new Array(2);
      Xaux = parseFloat(document.getElementById(`P${i}${1}`).value);
      Yaux = parseFloat(document.getElementById(`P${i}${2}`).value);
      points[i][0] = Xaux;
      points[i][1] = Yaux;
    }
  } else {
    let left = z,
      right = z;
    let aux = 1;
    while (aux < k) {
      if (left > 1) {
        left--;
        aux++;
      }
      if (right < n && aux < k) {
        right++;
        aux++;
      }
    }
    for (let i = 0; i < k; i++) {
      points[i] = new Array(2);
      Xaux = parseFloat(document.getElementById(`P${left - 1}${1}`).value);
      Yaux = parseFloat(document.getElementById(`P${left - 1}${2}`).value);
      left++;
      points[i][0] = Xaux;
      points[i][1] = Yaux;
    }
  }
  // let chosenMethod = document.querySelector(`methods`);
  let polynomial;

  switch (document.querySelector('input[name="methods"]:checked').value) {
    case "1":
      polynomial = linearSystemMethod();
      break;
    case "2":
      polynomial = NewtonMethod();
      break;
    case "3":
      polynomial = NewtonGregoryMet();
      break;

    default:
      break;
  }

  // Definir onde será colocado o resultado na tela

  resultDiv.style.display = "block";
  document.querySelector(`#result-content`).innerText = polynomial;
  genChart(x, y, ySelected);
};

/**
 *  If k is less than n - 1, the quantity of selected points will be k + 1 and picking up the closest value to z
 *  @param {number} n - Points
 *  @param {number} k - Grade of the polynomial
 *  @param {number} z - Reference value
 *  @param {array} matrix - Matrix of Points Ordered by X -> [[x], [y]]
 *
 *  @return {array} - Selected Points f(x)
 */
const ySelected = (n, k, z, matrix) => {
  let { y: ySelected, x } = orderedPoints(); // y is ordered by x

  // Convert to Number
  x = x.map(Number);
  matrix = matrix.map((el) => el.map(Number));
  ySelected = ySelected.map(Number);

  if (k < n - 1) {
    // Take the yselected values ​​from 0 to k
    ySelected = ySelected.slice(0, k);
    do {
      /* Fazer que o valor selecionado seja diferente do array já presente
       * retornar: ySelected[0] ... ySelected[k] + nearest (lenght = k + 1)
       */
      let nearest = x.reduce((prev, curr) =>
        Math.abs(curr - z) < Math.abs(prev - z) ? curr : prev
      ); // Find the nearest value to z
      !ySelected.contains(matrix[1][matrix[0].indexOf(nearest)])
        ? ySelected.push(matrix[1][matrix[0].indexOf(nearest)])
        : x.splice(x.indexOf(nearest), 1); // remove the nearest value from the x vector (if it's present)
    } while (ySelected.length != k + 1);
  }
  // Caso contrário retornar o ySelected[0] ... ySelected[n] (lenght = n)
  return ySelected;
};

const genChart = (x, y, ySelected) => {
  const chartCanvas = document.querySelector("#chart"),
    chartDiv = document.querySelector("#chart-div");

  chartDiv.style.display = "block";

  const data = {
    labels: x,
    datasets: [
      {
        type: "scatter",
        label: "Pontos Dados",
        cubicInterpolationMode: "monotone",
        // borderColor: "#BF1515",
        backgroundColor: "#d12a2a",
        data: y,
      },
      {
        type: "scatter",
        label: "Pontos Calculado",
        cubicInterpolationMode: "monotone",
        borderColor: "#158CBF",
        borderWidth: 3,
        data: ySelected,
      },
    ],
  };

  const config = {
    type: "line",
    data: data,
    options: {
      responsive: true,
      legend: {
        position: "top",
      },
      plugins: {
        title: {
          display: true,
          text: "Graphic of Interpolation",
        },
      },
      interaction: {
        intersect: false,
      },
      scale: {
        ticks: {
          beginAtZero: true,
        },
      },
    },
  };

  const myChart = new Chart(chartCanvas, config);
};
