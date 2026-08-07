# Centro de estudio CNP

Versión compacta, optimizada para móvil y con gestión privada del catálogo.

## Publicar

Sube el contenido de esta carpeta al repositorio `web3`. Mantén `materiales.zip` comprimido. GitHub Actions lo descomprime únicamente durante el despliegue de Pages.

## Administrar desde la web

1. En GitHub, crea un **fine-grained personal access token** limitado al repositorio `web3`, con permiso **Contents: Read and write**.
2. Abre la web, pulsa **Administrador** e introduce el token.
3. La web verifica que el usuario autenticado sea `rafabg77` antes de habilitar los controles.
4. Usa **Renombrar** o **Quitar** en cualquier material. Los cambios se guardan en `data/overrides.json`, se registran en GitHub y se publican automáticamente.

El token no se guarda ni se incorpora al código. Los visitantes sin un token válido de la cuenta autorizada solo pueden consultar los materiales.

`Quitar` oculta un material del catálogo; no borra el repositorio ni su contenido.
