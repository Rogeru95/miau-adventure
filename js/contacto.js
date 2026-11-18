const formulario = document.querySelector('#form-contacto');
const exito = document.querySelector('#mensaje-exito');
const textoExito = document.querySelector('#exito-texto');
const contador = document.querySelector('#contador-mensaje');
const botonEnviar = document.querySelector('#btn-enviar');

const reglas = {
  nombre: (valor) => {
    if (valor.trim() === '') return 'Escribe tu nombre.';
    if (valor.trim().length < 3) return 'El nombre debe tener al menos 3 letras.';
    if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/.test(valor.trim())) return 'El nombre solo puede tener letras y espacios.';
    return '';
  },
  correo: (valor) => {
    if (valor.trim() === '') return 'Escribe tu correo electrónico.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(valor.trim())) return 'Escribe un correo válido, por ejemplo nombre@correo.com.';
    return '';
  },
  motivo: (valor) => (valor === '' ? 'Elige el motivo de tu mensaje.' : ''),
  mensaje: (valor) => {
    if (valor.trim() === '') return 'Escribe tu mensaje.';
    if (valor.trim().length < 20) return `El mensaje debe tener al menos 20 caracteres (llevas ${valor.trim().length}).`;
    return '';
  },
  acepto: (_, campo) => (campo.checked ? '' : 'Debes aceptar para que podamos responderte.')
};

function validarCampo(nombre) {
  const campo = formulario.elements[nombre];
  const error = reglas[nombre](campo.value, campo);
  const textoError = document.querySelector(`#error-${nombre}`);
  textoError.textContent = error;
  campo.setAttribute('aria-invalid', error ? 'true' : 'false');
  campo.closest('.campo').classList.toggle('campo--error', Boolean(error));
  campo.closest('.campo').classList.toggle('campo--ok', !error);
  return error === '';
}

Object.keys(reglas).forEach((nombre) => {
  const campo = formulario.elements[nombre];
  const evento = campo.type === 'checkbox' || campo.tagName === 'SELECT' ? 'change' : 'input';
  campo.addEventListener('blur', () => {
    campo.dataset.tocado = 'si';
    validarCampo(nombre);
  });
  campo.addEventListener(evento, () => {
    if (campo.dataset.tocado === 'si' || campo.type === 'checkbox' || campo.tagName === 'SELECT') validarCampo(nombre);
  });
});

formulario.elements.mensaje.addEventListener('input', () => {
  const largo = formulario.elements.mensaje.value.length;
  contador.textContent = `${largo} / 500`;
  contador.classList.toggle('campo__contador--limite', largo > 450);
});

function guardarLocal(datos) {
  try {
    const guardados = JSON.parse(localStorage.getItem('miau-mensajes') || '[]');
    guardados.push({ ...datos, fecha: new Date().toISOString() });
    localStorage.setItem('miau-mensajes', JSON.stringify(guardados));
  } catch (error) {
    return;
  }
}

async function enviar(datos) {
  if (!window.location.hostname.endsWith('netlify.app')) {
    guardarLocal(Object.fromEntries(datos));
    return 'local';
  }
  const respuesta = await fetch('/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(datos).toString()
  });
  if (!respuesta.ok) throw new Error('No se pudo enviar');
  return 'netlify';
}

formulario.addEventListener('submit', async (evento) => {
  evento.preventDefault();
  const resultados = Object.keys(reglas).map((nombre) => {
    formulario.elements[nombre].dataset.tocado = 'si';
    return validarCampo(nombre);
  });
  const primeroInvalido = formulario.querySelector('[aria-invalid="true"]');
  if (resultados.includes(false)) {
    primeroInvalido.focus();
    return;
  }

  botonEnviar.disabled = true;
  botonEnviar.textContent = 'Enviando…';
  const datos = new FormData(formulario);
  const nombre = datos.get('nombre').trim().split(' ')[0];

  try {
    const modo = await enviar(datos);
    textoExito.textContent = modo === 'local'
      ? `Gracias, ${nombre}. Estás viendo el sitio sin Netlify, así que tu mensaje se guardó en este navegador.`
      : `Gracias, ${nombre}. Recibimos tu mensaje y te responderemos pronto a tu correo.`;
    formulario.hidden = true;
    exito.hidden = false;
    exito.focus();
  } catch (error) {
    document.querySelector('#error-acepto').textContent = 'Hubo un problema al enviar. Inténtalo de nuevo en unos segundos.';
  } finally {
    botonEnviar.disabled = false;
    botonEnviar.textContent = 'Enviar mensaje';
  }
});

document.querySelector('#btn-otro').addEventListener('click', () => {
  formulario.reset();
  contador.textContent = '0 / 500';
  formulario.querySelectorAll('.campo').forEach((campo) => campo.classList.remove('campo--error', 'campo--ok'));
  formulario.querySelectorAll('[data-tocado]').forEach((campo) => delete campo.dataset.tocado);
  exito.hidden = true;
  formulario.hidden = false;
  formulario.elements.nombre.focus();
});
