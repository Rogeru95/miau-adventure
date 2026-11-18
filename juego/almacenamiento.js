if (!window.storage) {
  window.storage = {
    async get(clave) {
      try {
        const valor = localStorage.getItem(clave);
        return valor === null ? null : { key: clave, value: valor };
      } catch (error) {
        return null;
      }
    },
    async set(clave, valor) {
      try {
        localStorage.setItem(clave, valor);
        return { key: clave, value: valor };
      } catch (error) {
        return null;
      }
    }
  };
}
