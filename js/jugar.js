const marcoJuego = document.querySelector('#marco-juego');
const ventanaJuego = document.querySelector('#ventana-juego');
const botonPantalla = document.querySelector('#btn-pantalla');
const botonReiniciar = document.querySelector('#btn-reiniciar');

const marcadores = {
  puntaje: document.querySelector('#mejor-puntaje'),
  monedas: document.querySelector('#monedas'),
  peces: document.querySelector('#peces'),
  logros: document.querySelector('#logros')
};

const TOTAL_LOGROS = 7;

function leer(clave, valorInicial) {
  try {
    const valor = localStorage.getItem(clave);
    return valor === null ? valorInicial : JSON.parse(valor);
  } catch (error) {
    return valorInicial;
  }
}

function formatear(numero) {
  return Number(numero || 0).toLocaleString('es-EC');
}

function actualizarMarcadores() {
  const puntajes = leer('miau_scores', []);
  const mejor = Array.isArray(puntajes) && puntajes.length > 0
    ? puntajes.reduce((a, b) => (b.score > a.score ? b : a))
    : null;
  marcadores.puntaje.textContent = mejor ? `${formatear(mejor.score)} · ${mejor.name}` : 'Sin récord';
  marcadores.monedas.textContent = formatear(leer('miau_coins', 0));
  marcadores.peces.textContent = formatear(leer('miau_fish', 0));
  const logros = leer('miau_ach', []);
  marcadores.logros.textContent = `${Array.isArray(logros) ? logros.length : 0} / ${TOTAL_LOGROS}`;
}

function enfocarJuego() {
  ventanaJuego.focus({ preventScroll: true });
}

botonPantalla.addEventListener('click', () => {
  const pedir = marcoJuego.requestFullscreen || marcoJuego.webkitRequestFullscreen;
  if (pedir) pedir.call(marcoJuego);
  enfocarJuego();
});

botonReiniciar.addEventListener('click', () => {
  ventanaJuego.contentWindow.location.reload();
  enfocarJuego();
});

ventanaJuego.addEventListener('load', actualizarMarcadores);

window.addEventListener('storage', actualizarMarcadores);
window.addEventListener('focus', actualizarMarcadores);
setInterval(actualizarMarcadores, 3000);
actualizarMarcadores();
