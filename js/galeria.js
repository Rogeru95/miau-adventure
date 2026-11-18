const carrusel = document.querySelector('#carrusel');
const pista = document.querySelector('#pista');
const diapositivas = [...pista.children];
const contenedorPuntos = document.querySelector('#puntos');
const botonAuto = document.querySelector('#btn-auto');
const visor = document.querySelector('#visor');
const visorImagen = document.querySelector('#visor-imagen');
const visorTexto = document.querySelector('#visor-texto');
const movimientoReducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let actual = 0;
let indiceVisor = 0;
let temporizador = null;
let automatico = !movimientoReducido;
let inicioToque = null;

const puntos = diapositivas.map((_, i) => {
  const punto = document.createElement('button');
  punto.type = 'button';
  punto.className = 'carrusel__punto';
  punto.setAttribute('aria-label', `Ver imagen ${i + 1}`);
  punto.addEventListener('click', () => {
    irA(i);
    reiniciarAutomatico();
  });
  contenedorPuntos.appendChild(punto);
  return punto;
});

function irA(indice) {
  actual = (indice + diapositivas.length) % diapositivas.length;
  pista.style.transform = `translateX(-${actual * 100}%)`;
  diapositivas.forEach((d, i) => d.setAttribute('aria-hidden', String(i !== actual)));
  puntos.forEach((p, i) => p.setAttribute('aria-current', i === actual ? 'true' : 'false'));
}

function iniciarAutomatico() {
  detenerAutomatico();
  if (automatico) temporizador = setInterval(() => irA(actual + 1), 5000);
}

function detenerAutomatico() {
  clearInterval(temporizador);
}

function reiniciarAutomatico() {
  if (automatico) iniciarAutomatico();
}

function actualizarBotonAuto() {
  botonAuto.setAttribute('aria-pressed', String(automatico));
  botonAuto.textContent = automatico ? 'Pausar presentación' : 'Reanudar presentación';
}

document.querySelector('#btn-anterior').addEventListener('click', () => {
  irA(actual - 1);
  reiniciarAutomatico();
});

document.querySelector('#btn-siguiente').addEventListener('click', () => {
  irA(actual + 1);
  reiniciarAutomatico();
});

botonAuto.addEventListener('click', () => {
  automatico = !automatico;
  actualizarBotonAuto();
  if (automatico) iniciarAutomatico();
  else detenerAutomatico();
});

carrusel.addEventListener('keydown', (evento) => {
  if (evento.key === 'ArrowLeft') irA(actual - 1);
  if (evento.key === 'ArrowRight') irA(actual + 1);
});

carrusel.addEventListener('mouseenter', detenerAutomatico);
carrusel.addEventListener('mouseleave', reiniciarAutomatico);
carrusel.addEventListener('focusin', detenerAutomatico);
carrusel.addEventListener('focusout', reiniciarAutomatico);

carrusel.addEventListener('pointerdown', (evento) => {
  inicioToque = evento.clientX;
});

carrusel.addEventListener('pointerup', (evento) => {
  if (inicioToque === null) return;
  const distancia = evento.clientX - inicioToque;
  if (Math.abs(distancia) > 50) irA(distancia < 0 ? actual + 1 : actual - 1);
  inicioToque = null;
});

function mostrarEnVisor(indice) {
  indiceVisor = (indice + diapositivas.length) % diapositivas.length;
  const imagen = diapositivas[indiceVisor].querySelector('img');
  visorImagen.src = imagen.src;
  visorImagen.alt = imagen.alt;
  visorTexto.textContent = diapositivas[indiceVisor].querySelector('figcaption').textContent;
}

document.querySelectorAll('.miniatura').forEach((boton) => {
  boton.addEventListener('click', () => {
    mostrarEnVisor(Number(boton.dataset.indice));
    detenerAutomatico();
    visor.showModal();
  });
});

document.querySelector('#visor-cerrar').addEventListener('click', () => visor.close());
document.querySelector('#visor-anterior').addEventListener('click', () => mostrarEnVisor(indiceVisor - 1));
document.querySelector('#visor-siguiente').addEventListener('click', () => mostrarEnVisor(indiceVisor + 1));

visor.addEventListener('keydown', (evento) => {
  if (evento.key === 'ArrowLeft') mostrarEnVisor(indiceVisor - 1);
  if (evento.key === 'ArrowRight') mostrarEnVisor(indiceVisor + 1);
});

visor.addEventListener('click', (evento) => {
  if (evento.target === visor) visor.close();
});

visor.addEventListener('close', reiniciarAutomatico);

irA(0);
actualizarBotonAuto();
iniciarAutomatico();
