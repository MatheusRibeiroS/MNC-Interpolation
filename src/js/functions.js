let points;

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
  let { y: ySelPolido, x } = orderedPoints(); // y is ordered by x

  // Convert to Number
  x = x.map(Number);
  matrix = matrix.map((el) => el.map(Number));
  ySelPolido = ySelPolido.map(Number);

  if (k < n - 1) {
    // Take the yselected values ​​from 0 to k
    ySelPolido = ySelPolido.slice(0, k);
    do {
      /* Fazer que o valor selecionado seja diferente do array já presente
       * retornar: ySelected[0] ... ySelected[k] + nearest (lenght = k + 1)
       */
      let nearest = x.reduce((prev, curr) =>
        Math.abs(curr - z) < Math.abs(prev - z) ? curr : prev
      ); // Find the nearest value to z
      !ySelPolido.includes(matrix[1][matrix[0].indexOf(nearest)])
        ? ySelPolido.push(matrix[1][matrix[0].indexOf(nearest)])
        : x.splice(x.indexOf(nearest), 1); // remove the nearest value from the x vector (if it's present)
    } while (ySelPolido.length != k + 1);
  }
  // Caso contrário retornar o ySelected[0] ... ySelected[n] (lenght = n)
  return ySelPolido;
};

const mathFunction = (input, x) =>
  x.map((el) => math.evaluate(input, { x: el }));

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

const infoButton = () => {
  let textTable = document.querySelector("#text");
  textTable.style.display = "block";
  textTable.innerHTML = "Feito por Cassiano Rodrigues e Matheus Ribeiro";
};

const clearInputs = () => {
  [...document.getElementsByTagName("input")].map((el) => (el.value = ""));
};

const verification = () => {
  let n = document.querySelector(`#n`).value;
  let k = document.querySelector(`#k`).value;
  let z = document.querySelector(`#z`).value;

  if (
    isNaN(parseInt(n)) ||
    isNaN(parseInt(k)) ||
    parseInt(n) < 1 ||
    parseInt(k) < 1
  ) {
    console.log("Insira valores válidos para n, k e z.");
    // document.querySelector(`#result`).innerText = "Insira valores válidos para n, k e z.";
    n = "";
    k = "";
    z = "";
    return false;
  }
  z
    ? isNaN(parseFloat(z)) || parseFloat(z) < 1 || parseFloat(z) > parseInt(n)
      ? false
      : true
    : false;

  return true;
};

const referencePoint = () => {
  let n = Number(document.querySelector(`#n`).value);
  let k = Number(document.querySelector(`#k`).value);
  let z = document.querySelector(`#z`);
  if (n && k && k > 0) {
    if (k < n - 1) z.removeAttribute("disabled");
    else z.setAttribute("disabled", "disabled");
  } else z.setAttribute("disabled", "disabled");
};

const calculate = () => {
  if (!verification()) {
    return;
  }

  const n = parseInt(document.querySelector(`#n`).value);
  const k = parseInt(document.querySelector(`#k`).value);
  const z = parseFloat(document.querySelector(`#z`).value);
  const resultDiv = document.querySelector(`#result-div`);

  const { x, y } = orderedPoints(); // x and y are ordered by x
  const { matrix } = getPoints(); // matrix
  let polynomial;

  switch (document.querySelector('input[name="methods"]:checked').value) {
    case "1":
      polynomial = linearSystemMethod();
      break;
    case "2":
      polynomial = interpolate(x, ySelected(n, k, z, matrix));
      break;
    case "3":
      polynomial = NewtonGregoryMet();
      break;

    default:
      break;
  }

  resultDiv.style.display = "block";
  document.querySelector(`#result-content`).innerHTML = polynomial;
  genChart(x, y, ySelected(n, k, z, matrix));
};

const genChart = (x, y, ySelected) => {
  const chartDiv = document.querySelector("#chart-div");
  const chartCanvas = document.createElement("canvas");
  chartCanvas.id = "chart";

  if (chartDiv.firstChild) chartDiv.removeChild(chartDiv.firstChild);
  chartDiv.appendChild(chartCanvas);

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
        borderWidth: 5,
        data: ySelected,
      },
      {
        type: "line",
        label: "Polinômio",
        cubicInterpolationMode: "monotone",
        borderColor: "#737373",
        borderWidth: 1,
        data: mathFunction(document.querySelector("#resultfinal").innerText, x),
        pointRadius: 0,
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
        beforeInit: function (chart) {
          var data = chart.config.data;
          for (var i = 0; i < data.datasets.length; i++) {
            for (var j = 0; j < data.labels.length; j++) {
              var fct = data.datasets[i].function,
                x = data.labels[j],
                y = fct(x);
              data.datasets[i].data.push(y);
            }
          }
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
