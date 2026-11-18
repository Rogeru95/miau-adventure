# MIAU Adventure

Sitio web interactivo del videojuego **MIAU Adventure**, un juego de plataformas con cinco gatos jugables, ocho mundos y ocho jefes. Proyecto del Primer Parcial de la asignatura **Desarrollo de Aplicaciones Web** (Universidad de Guayaquil, Carrera de Software).

## Integrantes

- Roger Gilberto Saltos Villao
- Carlos Elian Ventimilla Suconota

## Páginas

| Página | Contenido |
|---|---|
| `index.html` | Portada, historia, características, contadores animados y controles |
| `personajes.html` | Gatos, enemigos y jefes cargados con `fetch` desde JSON, filtros, buscador, ficha en ventana modal y acordeón de los ocho mundos |
| `galeria.html` | Carrusel automático con flechas, puntos, teclado y gesto de deslizar, más visor ampliado |
| `jugar.html` | El juego completo dentro de un `iframe`, con pantalla completa y el progreso guardado en `localStorage` |
| `contacto.html` | Formulario de contacto con validación en el cliente (y envío con Netlify Forms) |

## Tecnologías

- HTML5 semántico: `header`, `nav`, `main`, `section`, `article`, `aside`, `footer`, `dialog`
- CSS3 en un archivo externo: variables, Flexbox, Grid, media queries, animaciones y tema claro/oscuro
- JavaScript puro: eventos del DOM, `fetch`, `localStorage`, `IntersectionObserver`, Fullscreen API
- El juego usa Canvas 2D, Web Audio y Gamepad API

## Estructura

```
miau-adventure/
├── index.html
├── personajes.html
├── galeria.html
├── jugar.html
├── contacto.html
├── css/styles.css
├── js/
│   ├── tema.js
│   ├── main.js
│   ├── personajes.js
│   ├── galeria.js
│   ├── jugar.js
│   └── contacto.js
├── juego/
│   ├── index.html
│   └── almacenamiento.js
├── data/
│   ├── personajes.json
│   └── mundos.json
└── img/
    ├── favicon.svg
    ├── personajes/
    └── galeria/
```

## Cómo ejecutarlo

La página de personajes usa `fetch` para leer los archivos JSON, por eso el sitio debe abrirse desde un servidor:

1. Abrir la carpeta en Visual Studio Code.
2. Instalar la extensión **Live Server**.
3. Clic derecho en `index.html` → **Open with Live Server**.

## Controles del juego

- `←` `→`: moverse
- `Espacio` o `↑`: saltar (doble salto en el aire)
- `Shift` o `X`: dash
- `P` o `Esc`: pausa · `F`: pantalla completa
- Jugador 2: `A` `D` moverse, `W` saltar, `Q` dash
