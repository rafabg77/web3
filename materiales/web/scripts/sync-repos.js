#!/usr/bin/env node
'use strict';

/**
 * Sincroniza data/temario.json con los repos de GitHub que tengan
 * GitHub Pages activado y aún no estén indexados en el portal.
 *
 * Cada material nuevo se añade con tipo "otro" y "(sin clasificar)"
 * en el título, para que sea fácil localizarlo y corregir tipo/título
 * a mano si hace falta (el filtro "Otro" + el buscador lo encuentran al momento).
 *
 * No necesita ningún secreto adicional: usa el GITHUB_TOKEN que
 * GitHub Actions ya inyecta automáticamente en cada ejecución.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const GITHUB_USER = 'rafabg77';
const PORTAL_REPO = 'Web';
const JSON_PATH = path.join(__dirname, '..', 'data', 'temario.json');

// Nombres de repos que NO quieres que se indexen aunque tengan Pages activado
// (por ejemplo una web personal aparte). Añade aquí el nombre exacto del repo.
const EXCLUIR = [];

const TOKEN = process.env.GITHUB_TOKEN;

function apiRequest(urlPath) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.github.com',
      path: urlPath,
      headers: {
        'User-Agent': 'sync-repos-script',
        Accept: 'application/vnd.github+json',
        ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
      },
    };
    https
      .get(options, (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          if (res.statusCode < 200 || res.statusCode >= 300) {
            reject(new Error(`GitHub API ${res.statusCode}: ${data}`));
            return;
          }
          try {
            resolve(JSON.parse(data));
          } catch (err) {
            reject(err);
          }
        });
      })
      .on('error', reject);
  });
}

async function fetchAllRepos() {
  let repos = [];
  let pageNum = 1;
  for (;;) {
    const body = await apiRequest(
      `/users/${GITHUB_USER}/repos?per_page=100&page=${pageNum}&type=owner`
    );
    if (!Array.isArray(body) || body.length === 0) break;
    repos = repos.concat(body);
    if (body.length < 100) break;
    pageNum += 1;
  }
  return repos;
}

function tituloDesdeNombre(nombre) {
  return nombre
    .replace(/[-_.]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function normalizarUrl(url) {
  return url.replace(/\/?$/, '/');
}

function syncMateriales(temario, repos, { githubUser, portalRepo, excluir = [] }) {
  const materiales = temario.materiales || [];
  const urlsExistentes = new Set(materiales.map((m) => normalizarUrl(m.url)));

  const candidatos = repos.filter(
    (r) => r.has_pages && r.name !== portalRepo && !excluir.includes(r.name)
  );

  let añadidos = 0;
  for (const repo of candidatos) {
    const url = `https://${githubUser}.github.io/${repo.name}/`;
    if (urlsExistentes.has(url)) continue;

    const fecha = (repo.created_at || '').slice(0, 10);
    materiales.push({
      titulo: `${tituloDesdeNombre(repo.name)} (sin clasificar)`,
      tipo: 'otro',
      url,
      fecha,
      activo: true,
    });
    urlsExistentes.add(url);
    añadidos += 1;
  }

  temario.materiales = materiales;
  return { temario, añadidos };
}

async function main() {
  const temario = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));
  const repos = await fetchAllRepos();

  const { temario: resultado, añadidos } = syncMateriales(temario, repos, {
    githubUser: GITHUB_USER,
    portalRepo: PORTAL_REPO,
    excluir: EXCLUIR,
  });

  if (añadidos > 0) {
    fs.writeFileSync(JSON_PATH, JSON.stringify(resultado, null, 2) + '\n', 'utf8');
    console.log(`${añadidos} material(es) nuevo(s) añadido(s) a temario.json.`);
  } else {
    console.log('Sin novedades: no hay repos nuevos con GitHub Pages activado.');
  }

  const outputFile = process.env.GITHUB_OUTPUT;
  if (outputFile) {
    fs.appendFileSync(outputFile, `nuevos=${añadidos}\n`);
  }
}

if (require.main === module) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

module.exports = { tituloDesdeNombre, syncMateriales, normalizarUrl };
