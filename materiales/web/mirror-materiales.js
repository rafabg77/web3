.expediente-header--compacta {
  padding: 1.2rem 1.5rem;
}

.migas {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  opacity: 0.75;
  margin-bottom: 0.6rem;
}
.migas a {
  color: inherit;
}

.titulo-material-pagina {
  font-size: 1.4rem;
  margin: 0;
}

.hueco-anuncio {
  max-width: 970px;
  margin: 1rem auto;
  min-height: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed rgba(0, 0, 0, 0.15);
  border-radius: 4px;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  opacity: 0.35;
}
.hueco-anuncio::before {
  content: "publicidad";
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.visor-material {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 1rem;
}

.iframe-material {
  width: 100%;
  height: 80vh;
  min-height: 480px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 6px;
  background: #fff;
}

.nav-material-siguiente {
  max-width: 1100px;
  margin: 1.2rem auto;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  font-family: var(--font-mono);
  font-size: 0.85rem;
}
.nav-material-siguiente a {
  text-decoration: none;
  color: var(--seal-gold, #8a6d3b);
}
.nav-material-siguiente a:hover {
  text-decoration: underline;
}

@media (max-width: 640px) {
  .iframe-material {
    height: 70vh;
  }
}
