const form = document.querySelector("#form-search");
const moneda = document.querySelector("#moneda");
const criptomoneda = document.querySelector("#criptomonedas");
const formContainer = document.querySelector(".form-side");
const containerAnswer = document.querySelector(".container-answer");

class Busqueda {
  constructor() {
    this.moneda = "";
    this.criptomoneda = "";
    this.resultados = [];
  }

  submitForm(e) {
    e.preventDefault();
    const { moneda, criptomoneda } = this;
    if (moneda === "" || criptomoneda === "") {
      this.showError("Seleccione ambas monedas...");
      return;
    }
    this.consultarAPI(moneda, criptomoneda);
  }

  consultarAPI(moneda, criptomoneda) {
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;
    fetch(url)
      .then((resultado) => resultado.json())
      .then((resultadoJson) => {
        this.mostrarCotizacion(resultadoJson.DISPLAY[criptomoneda][moneda]);
        const cotizacion = {
          moneda,
          criptomoneda,
          data: resultadoJson.DISPLAY[criptomoneda][moneda],
          fecha: moment().format("YYYY-MM-DD HH:mm:ss"),
        };
        this.resultados.push(cotizacion);
        this.guardarResultados();
      })
      .catch((error) => console.log(error));
  }

  mostrarCotizacion(data) {
    this.clearHTML();
    const { PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE } = data;
    const fechaActual = moment().format("YYYY-MM-DD HH:mm:ss");
    const answer = document.createElement("div");
    answer.classList.add("display-info");
    answer.innerHTML = `
      <p class="main-price">Precio: <span>${PRICE}</span></p>
      <p>Precio más alto del día:: <span>${HIGHDAY}</span></p>
      <p>Precio más bajo del día: <span>${LOWDAY}</span></p>
      <p>Última Actualización: <span>${LASTUPDATE}</span></p>
      <p>Fecha actual: <span>${fechaActual}</span></p>
    `;
    containerAnswer.appendChild(answer);
  }

  showError(message) {
    const error = document.createElement("p");
    error.classList.add("error");
    error.textContent = message;
    formContainer.appendChild(error);
    setTimeout(() => error.remove(), 3000);
  }

  getValue(e) {
    this[e.target.name] = e.target.value;
  }

  consultarCriptos() {
    const url =
      "https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD";

    fetch(url)
      .then((respuesta) => respuesta.json())
      .then((respuestaJson) => {
        this.selectCriptos(respuestaJson.Data);
        this.mostrarResultadosAnteriores();
      })
      .catch((error) => console.log(error));
  }

  selectCriptos(criptos) {
    criptos.forEach((cripto) => {
      const { FullName, Name } = cripto.CoinInfo;
      const option = document.createElement("option");
      option.value = Name;
      option.textContent = FullName;
      criptomoneda.appendChild(option);
    });
  }

  clearHTML() {
    containerAnswer.innerHTML = "";
  }

  guardarResultados() {
    localStorage.setItem("resultados", JSON.stringify(this.resultados));
  }
}

const busqueda = new Busqueda();

document.addEventListener("DOMContentLoaded", () => {
  busqueda.consultarCriptos();

  form.addEventListener("submit", (e) => busqueda.submitForm(e));
  moneda.addEventListener("change", (e) => busqueda.getValue(e));
  criptomoneda.addEventListener("change", (e) => busqueda.getValue(e));
});