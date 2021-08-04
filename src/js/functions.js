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
    isNaN(parseInt(z)) ||
    parseInt(n) < 1 ||
    parseInt(k) < 1 ||
    parseInt(z) < 1 ||
    parseInt(z) > parseInt(n)
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
  let z = parseInt(document.querySelector(`#z`).value);

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

const genChart = () => {
  let chartCanvas = document.querySelector("#chart");
  let chartDiv = document.querySelector("#chart-div");

  chartDiv.style.display = "block";
  const { x, y } = orderedPoints(); // x and y are ordered by x

  const data = {
    labels: x,
    datasets: [
      {
        label: "P(x,y) = ",
        fillColor: "rgba(220,220,220,0.2)",
        strokeColor: "rgba(220,220,220,1)",
        pointColor: "rgba(220,220,220,1)",
        pointStrokeColor: "#fff",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(220,220,220,1)",
        data: y,
      },
    ],
  };

  const config = {
    type: "line",
    data: data,
    options: {},
  };

  const myChart = new Chart(chartCanvas, config);
};
