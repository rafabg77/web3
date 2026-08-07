name: Sincronizar nuevos repos con GitHub Pages

on:
  schedule:
    # Todos los días a las 07:00 UTC (09:00 hora peninsular en horario de verano).
    - cron: '0 7 * * *'
  workflow_dispatch: {}

permissions:
  contents: write

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - name: Clonar el repo
        uses: actions/checkout@v4

      - name: Buscar y añadir materiales nuevos
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: node scripts/sync-repos.js

      - name: Traer (mirror) el contenido de cada material al propio repo
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: node scripts/mirror-materiales.js

      - name: Generar página propia (SEO + anuncios) por cada material
        run: node scripts/build-material-pages.js

      - name: Commitear y publicar si hay cambios
        run: |
          if ! git diff --quiet; then
            git config user.name "github-actions[bot]"
            git config user.email "github-actions[bot]@users.noreply.github.com"
            git add -A
            git commit -m "Sincronización automática: materiales nuevos/actualizados"
            git push
          else
            echo "Sin cambios que commitear."
          fi
