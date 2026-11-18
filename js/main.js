const raiz = document.documentElement;
const botonTema = document.querySelector('#btn-tema');
const botonMenu = document.querySelector('#btn-menu');
const menu = document.querySelector('#menu');
const cabecera = document.querySelector('.cabecera');
const botonArriba = document.querySelector('#btn-arriba');
const reducirMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function aplicarTema(tema) {
  raiz.dataset.tema = tema;
  const siguiente = tema === 'oscuro' ? 'claro' : 'oscuro';
  botonTema.setAttribute('aria-label', `Cambiar a tema ${siguiente}`);
  document.querySelector('meta[name="theme-color"]').setAttribute('content', tema === 'oscuro' ? '#14112b' : '#fbf6ec');
  try {
    localStorage.setItem('miau-tema', tema);
  } catch (error) {
    return;
  }
}

botonTema.addEventListener('click', () => {
  aplicarTema(raiz.dataset.tema === 'oscuro' ? 'claro' : 'oscuro');
});
aplicarTema(raiz.dataset.tema || 'oscuro');

function cerrarMenu() {
  menu.classList.remove('nav__menu--abierto');
  botonMenu.setAttribute('aria-expanded', 'false');
  botonMenu.setAttribute('aria-label', 'Abrir menú');
}

botonMenu.addEventListener('click', () => {
  const abierto = menu.classList.toggle('nav__menu--abierto');
  botonMenu.setAttribute('aria-expanded', String(abierto));
  botonMenu.setAttribute('aria-label', abierto ? 'Cerrar menú' : 'Abrir menú');
});

menu.querySelectorAll('a').forEach((enlace) => enlace.addEventListener('click', cerrarMenu));

document.addEventListener('keydown', (evento) => {
  if (evento.key === 'Escape' && menu.classList.contains('nav__menu--abierto')) {
    cerrarMenu();
    botonMenu.focus();
  }
});

window.addEventListener('resize', () => {
  if (window.innerWidth >= 860) cerrarMenu();
});

window.addEventListener('scroll', () => {
  cabecera.classList.toggle('cabecera--desplazada', window.scrollY > 10);
  botonArriba.classList.toggle('volver-arriba--visible', window.scrollY > 500);
}, { passive: true });

botonArriba.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: reducirMovimiento ? 'auto' : 'smooth' });
});

function animarContador(elemento) {
  const objetivo = Number(elemento.dataset.objetivo);
  const sufijo = elemento.dataset.sufijo || '';
  if (reducirMovimiento) {
    elemento.textContent = objetivo + sufijo;
    return;
  }
  const duracion = 1200;
  const inicio = performance.now();
  function paso(ahora) {
    const progreso = Math.min((ahora - inicio) / duracion, 1);
    const suavizado = 1 - Math.pow(1 - progreso, 3);
    elemento.textContent = Math.round(objetivo * suavizado) + sufijo;
    if (progreso < 1) requestAnimationFrame(paso);
  }
  requestAnimationFrame(paso);
}

const observador = new IntersectionObserver((entradas) => {
  entradas.forEach((entrada) => {
    if (!entrada.isIntersecting) return;
    entrada.target.classList.add('revelar--visible');
    entrada.target.querySelectorAll('[data-objetivo]').forEach(animarContador);
    observador.unobserve(entrada.target);
  });
}, { threshold: 0.15 });

document.querySelectorAll('.revelar').forEach((elemento) => observador.observe(elemento));

document.querySelector('#anio').textContent = new Date().getFullYear();
