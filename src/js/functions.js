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
    document.querySelector(`#n`).value = "";
    document.querySelector(`#k`).valuek = "";
    document.querySelector(`#z`).value = "";
    return false;
  }
  return true;
};

const calculate = () => {
  if (!verification()) {
    return;
  }

  let n = parseInt(document.querySelector(`#n`).value);
  let k = parseInt(document.querySelector(`#k`).value);
  let z = parseFloat(document.querySelector(`#z`).value);

  let { x, y } = orderedPoints(); // x and y are ordered by x

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
    Xaux = parseFloat(document.querySelector(`P${left - 1}${1}`).value);
    Yaux = parseFloat(document.querySelector(`P${left - 1}${2}`).value);
    left++;
    points[i][0] = Xaux;
    points[i][1] = Yaux;
  }
  let method = document.querySelector(`methods`);
  let polynomial;

  // correct function structure

  /*
  if (method[0].checked) polynomial = // funcao sistema linear
  else if (method[1].checked) polynomial = NewtonMethod();
  else polynomial = NewtonGregoryMet();
  document.getElementById(`pRes`).innerText = polynomial;
  */

  if (method[0].checked) polynomial = new NewtonMethod();
  else if (method[1].checked) polynomial = new NewtonGregoryMet();

  // Definir onde será colocado o resultado na tela

  document.querySelector(`Resultado`).innerText = polynomial;
};

// Se K for menor que N - 1, A quantidade de pontos selecionados será K + 1 e pegando o valor mais próximo de z
const ySelected = (n, k, z, matrix) => {
  let { y: ySelected } = orderedPoints(); // y is ordered by x

  if (k < n - 1) {
    /* Fazer que o valor selecionado seja diferente do array já presente
     * retornar: ySelected[0] ... ySelected[k] + nearest (lenght = k + 1)
     */
    let nearest = matrix[0].reduce((prev, curr) =>
      Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev
    ); // Find the nearest value to z
    ySelected.push(nearest);
  }
  // Caso contrário retornar o ySelected[0] ... ySelected[n] (lenght = n)
};

const genChart = () => {
  const chartCanvas = document.querySelector("#chart"),
    chartDiv = document.querySelector("#chart-div"),
    n = parseInt(document.querySelector("#n").value),
    k = parseInt(document.querySelector("#k").value),
    z = parseFloat(document.querySelector("#z").value);
  const { x, y } = orderedPoints(); // x and y are ordered by x

  chartDiv.style.display = "block";

  const data = {
    labels: x,
    datasets: [
      {
        type: "scatter",
        label: "Pontos Dados",
        cubicInterpolationMode: "monotone",
        borderColor: "#BF1515",
        backgroundColor: "#d12a2a",
        data: y,
      },
      {
        type: "scatter",
        label: "Pontos Calculado",
        cubicInterpolationMode: "monotone",
        borderColor: "#158CBF",
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
