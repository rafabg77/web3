async function iniciar() {
  const contenedor = document.getElementById('lista-contenedor');
  const buscadorInput = document.getElementById('buscador-input');
  const chips = Array.from(document.querySelectorAll('.filtros-tipo .chip'));
  const btnAdmin = document.getElementById('btn-admin');

  let materiales;
  try {
    const res = await fetch('data/temario.json');
    const data = await res.json();
    materiales = data.materiales || [];
  } catch (e) {
    contenedor.innerHTML = '<p class="sin-resultados">No se pudo cargar data/temario.json. Comprueba que el archivo existe y que el sitio se sirve por HTTP (GitHub Pages), no abriendo el HTML directamente.</p>';
    return;
  }

  const tiposActivos = new Set(chips.map(c => c.dataset.tipo));
  let modoAdmin = false;

  function render() {
    const texto = buscadorInput.value.trim().toLowerCase();
    contenedor.innerHTML = '';

    const visibles = materiales.filter(m => {
      if (!tiposActivos.has(m.tipo)) return false;
      if (!modoAdmin && m.activo === false) return false;
      if (texto && !m.titulo.toLowerCase().includes(texto)) return false;
      return true;
    });

    if (!visibles.length) {
      contenedor.innerHTML = '<p class="sin-resultados">Ningún material coincide con la búsqueda o los filtros actuales.</p>';
      return;
    }

    visibles
      .sort((a, b) => (b.fecha || '').localeCompare(a.fecha || ''))
      .forEach(m => contenedor.appendChild(construirTarjeta(m)));
  }

  function construirTarjeta(m) {
    const oculto = m.activo === false;
    const esLocal = Boolean(m.pagina); // ya migrado a materiales/ -> tiene página propia
    const a = document.createElement('a');
    a.className = 'material-card' + (oculto ? ' oculto-admin' : '');
    a.href = esLocal ? m.pagina : m.url;
    if (!esLocal) {
      a.target = '_blank';
      a.rel = 'noopener';
    }

    a.innerHTML = `
      <span class="etiqueta-tipo ${m.tipo}">${m.tipo}</span>
      <span class="titulo-material">${m.titulo}${oculto ? ' (oculto)' : ''}</span>
      <span class="fecha-material">${m.fecha || ''}</span>
    `;

    if (modoAdmin) {
      const boton = document.createElement('button');
      boton.type = 'button';
      boton.className = 'toggle-admin';
      boton.textContent = oculto ? 'Mostrar' : 'Ocultar';
      boton.addEventListener('click', (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        m.activo = oculto; // invierte
        render();
      });
      a.addEventListener('click', (ev) => {
        // en modo admin, el clic principal no navega, solo informa
        ev.preventDefault();
      });
      a.appendChild(boton);
    }

    return a;
  }

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const tipo = chip.dataset.tipo;
      if (tiposActivos.has(tipo)) {
        if (tiposActivos.size === 1) return;
        tiposActivos.delete(tipo);
        chip.setAttribute('aria-pressed', 'false');
      } else {
        tiposActivos.add(tipo);
        chip.setAttribute('aria-pressed', 'true');
      }
      render();
    });
  });

  btnAdmin.addEventListener('click', () => {
    modoAdmin = !modoAdmin;
    btnAdmin.setAttribute('aria-pressed', String(modoAdmin));
    btnAdmin.textContent = modoAdmin ? '⚙ Salir de administrar' : '⚙ Administrar';
    render();
  });

  buscadorInput.addEventListener('input', render);

  render();
}

document.addEventListener('DOMContentLoaded', iniciar);
