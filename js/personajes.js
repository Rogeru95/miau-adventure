const listaPersonajes = document.querySelector('#lista-personajes');
const listaMundos = document.querySelector('#lista-mundos');
const campoBuscar = document.querySelector('#buscar');
const resultado = document.querySelector('#resultado');
const botonesFiltro = document.querySelectorAll('.filtro');
const modal = document.querySelector('#modal-personaje');

let personajes = [];
let filtroActual = 'todos';

const nombresTipo = { gato: 'Gato jugable', enemigo: 'Enemigo', jefe: 'Jefe' };

async function obtenerJSON(ruta) {
  const respuesta = await fetch(ruta);
  if (!respuesta.ok) throw new Error(`Error ${respuesta.status} al cargar ${ruta}`);
  return respuesta.json();
}

function crearTarjeta(personaje) {
  const tarjeta = document.createElement('article');
  tarjeta.className = `personaje personaje--${personaje.tipo}`;
  tarjeta.innerHTML = `
    <img class="personaje__imagen" src="${personaje.imagen}" alt="Ilustración de ${personaje.nombre}" width="200" height="200" loading="lazy">
    <div class="personaje__cuerpo">
      <p class="insignia insignia--${personaje.tipo}">${personaje.rol}</p>
      <h3 class="personaje__nombre">${personaje.nombre}</h3>
      <p class="personaje__habilidad">${personaje.habilidad}</p>
      <button class="boton boton--secundario boton--pequeno" type="button">Ver ficha</button>
    </div>`;
  tarjeta.querySelector('button').addEventListener('click', () => abrirFicha(personaje));
  return tarjeta;
}

function mostrarPersonajes() {
  const texto = campoBuscar.value.trim().toLowerCase();
  const visibles = personajes.filter((p) => {
    const coincideTipo = filtroActual === 'todos' || p.tipo === filtroActual;
    const coincideTexto = `${p.nombre} ${p.habilidad} ${p.rol}`.toLowerCase().includes(texto);
    return coincideTipo && coincideTexto;
  });
  listaPersonajes.replaceChildren(...visibles.map(crearTarjeta));
  resultado.textContent = visibles.length === 0
    ? 'No encontramos personajes con ese filtro.'
    : `Mostrando ${visibles.length} de ${personajes.length} personajes`;
}

function crearDatos(datos) {
  return datos
    .map(([nombre, valor]) => `<div class="ficha-datos__fila"><dt>${nombre}</dt><dd>${valor}</dd></div>`)
    .join('');
}

function abrirFicha(personaje) {
  modal.querySelector('#modal-imagen').src = personaje.imagen;
  modal.querySelector('#modal-imagen').alt = `Ilustración de ${personaje.nombre}`;
  const rol = modal.querySelector('#modal-rol');
  rol.textContent = `${nombresTipo[personaje.tipo]} · ${personaje.rol}`;
  rol.className = `insignia insignia--${personaje.tipo}`;
  modal.querySelector('#modal-nombre').textContent = personaje.nombre;
  modal.querySelector('#modal-descripcion').textContent = personaje.descripcion;
  modal.querySelector('#modal-habilidad').textContent = personaje.habilidad;
  modal.querySelector('#modal-datos').innerHTML = crearDatos(personaje.datos);
  modal.showModal();
}

modal.querySelector('#modal-cerrar').addEventListener('click', () => modal.close());
modal.addEventListener('click', (evento) => {
  if (evento.target === modal) modal.close();
});

botonesFiltro.forEach((boton) => {
  boton.addEventListener('click', () => {
    filtroActual = boton.dataset.filtro;
    botonesFiltro.forEach((b) => b.setAttribute('aria-pressed', String(b === boton)));
    mostrarPersonajes();
  });
});

campoBuscar.addEventListener('input', mostrarPersonajes);

function estrellas(cantidad) {
  return '★'.repeat(cantidad) + '☆'.repeat(5 - cantidad);
}

function abrirMundo(boton, item) {
  listaMundos.querySelectorAll('.acordeon__boton').forEach((b) => {
    b.setAttribute('aria-expanded', 'false');
    b.closest('.acordeon__item').classList.remove('acordeon__item--abierto');
  });
  boton.setAttribute('aria-expanded', 'true');
  item.classList.add('acordeon__item--abierto');
}

function crearAcordeon(mundos) {
  listaMundos.replaceChildren();
  mundos.forEach((mundo, indice) => {
    const item = document.createElement('div');
    item.className = 'acordeon__item';
    const idPanel = `panel-mundo-${mundo.numero}`;
    const idBoton = `boton-mundo-${mundo.numero}`;
    item.innerHTML = `
      <h3 class="acordeon__titulo">
        <button class="acordeon__boton" type="button" id="${idBoton}" aria-expanded="false" aria-controls="${idPanel}">
          <span class="acordeon__numero">${mundo.numero}</span>
          <span class="acordeon__nombre">${mundo.nombre}</span>
          <span class="acordeon__estado">Jefe: ${mundo.jefe}</span>
          <svg class="icono acordeon__flecha" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>
        </button>
      </h3>
      <div class="acordeon__panel" id="${idPanel}" role="region" aria-labelledby="${idBoton}">
        <div class="acordeon__interior">
          <img class="acordeon__imagen" src="img/galeria/mundo-${mundo.numero}.jpg" alt="Captura del mundo ${mundo.numero}: ${mundo.nombre}" width="1280" height="720" loading="lazy">
          <p>${mundo.descripcion}</p>
          <p><strong>Jefe del mundo:</strong> ${mundo.jefe}</p>
          <p><strong>Cueva secreta:</strong> ${mundo.cueva}, donde se puede encontrar ${mundo.premio}.</p>
          <p class="acordeon__dificultad" aria-label="Dificultad ${mundo.dificultad} de 5">Dificultad: <span aria-hidden="true">${estrellas(mundo.dificultad)}</span></p>
        </div>
      </div>`;
    const boton = item.querySelector('button');
    boton.addEventListener('click', () => {
      const abierto = boton.getAttribute('aria-expanded') === 'true';
      if (abierto) {
        boton.setAttribute('aria-expanded', 'false');
        item.classList.remove('acordeon__item--abierto');
      } else {
        abrirMundo(boton, item);
      }
    });
    listaMundos.appendChild(item);
    if (indice === 0) abrirMundo(boton, item);
  });
}

function mostrarError(contenedor) {
  contenedor.innerHTML = '<p class="aviso-error">No se pudieron cargar los datos. Si abriste el archivo con doble clic, usa Live Server en Visual Studio Code o visita la versión publicada en Netlify.</p>';
}

Promise.all([obtenerJSON('data/personajes.json'), obtenerJSON('data/mundos.json')])
  .then(([datosPersonajes, datosMundos]) => {
    personajes = datosPersonajes;
    mostrarPersonajes();
    crearAcordeon(datosMundos);
  })
  .catch(() => {
    mostrarError(listaPersonajes);
    mostrarError(listaMundos);
  });
