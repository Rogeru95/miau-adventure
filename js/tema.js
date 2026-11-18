(function () {
  let tema = null;
  try {
    tema = localStorage.getItem('miau-tema');
  } catch (error) {
    tema = null;
  }
  if (!tema) {
    tema = window.matchMedia('(prefers-color-scheme: light)').matches ? 'claro' : 'oscuro';
  }
  document.documentElement.dataset.tema = tema;
})();
