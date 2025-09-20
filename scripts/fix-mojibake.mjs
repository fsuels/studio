#!/usr/bin/env node
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, extname } from 'node:path';

const targets = [
  { dir: 'public/locales/es', exts: ['.json'] },
  { dir: 'public/templates/es', exts: ['.md', '.txt'] },
];

function listFiles(dir, exts, out = []) {
  let entries = [];
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) listFiles(p, exts, out);
    else if (exts.includes(extname(e.name))) out.push(p);
  }
  return out;
}

function baseFix(content) {
  // Map ASCII pairs into expected Latin-1 bytes then convert Latin-1 -> UTF-8
  let s = content
    .replace(/A1/g, '¡')
    .replace(/A9/g, '©')
    .replace(/AD/g, '­')
    .replace(/B1/g, '±')
    .replace(/B3/g, '³')
    .replace(/BA/g, 'º')
    .replace(/BF/g, '¿')
    .replace(/A3/g, '³')
    .replace(/A�/g, 'Ã');
  try {
    s = Buffer.from(s, 'latin1').toString('utf8');
  } catch {
    return content;
  }
  return s;
}

function postWordFixForEs(text) {
  // Target common Spanish words still containing replacement char after base conversion.
  return text
    .replace(/Atr�s/g, 'Atrás')
    .replace(/S�/g, 'Sí')
    .replace(/P�gina/g, 'Página')
    .replace(/Sesi�n/g, 'Sesión')
    .replace(/Electr�nico/g, 'Electrónico')
    .replace(/electr�nico/g, 'electrónico')
    .replace(/Contrase�a/g, 'Contraseña')
    .replace(/contrase�a/g, 'contraseña')
    .replace(/�No/g, '¿No')
    .replace(/�Ya/g, '¿Ya')
    .replace(/�Inicio/g, '¡Inicio')
    .replace(/Fall�/g, 'Falló')
    .replace(/int�ntalo/g, 'inténtalo')
    .replace(/expirar�/g, 'expirará')
    .replace(/Correo Electr�nico/g, 'Correo Electrónico')
    .replace(/correo electr�nico/g, 'correo electrónico')
    .replace(/�xito/g, 'Éxito');
}

function scoreGarbage(s) {
  const patterns = [/Ã/g, /A�/g, /�/g, /A3/g];
  let sum = 0;
  for (const re of patterns) {
    const m = s.match(re);
    sum += m ? m.length : 0;
  }
  return sum;
}

function processFile(p, isJson) {
  const raw = readFileSync(p, 'utf8');
  const indicator = /(A�|A1|A9|AD|A3|B1|B3|BA|BF|Ã.|�)/;
  if (!indicator.test(raw)) {
    return { changed: false };
  }
  const beforeScore = scoreGarbage(raw);
  let fixed = baseFix(raw);
  if (p.includes('/locales/es/') || p.includes('\\locales\\es\\')) {
    fixed = postWordFixForEs(fixed);
  }
  const afterScore = scoreGarbage(fixed);
  if (isJson) {
    try {
      JSON.parse(fixed);
    } catch {
      return { changed: false };
    }
  }
  // For JSON, write if parseable and changed even if score unchanged (content readability likely improved)
  if (fixed !== raw && (isJson || afterScore <= beforeScore)) {
    writeFileSync(p, fixed, 'utf8');
    return { changed: true, beforeScore, afterScore };
  }
  return { changed: false };
}

let changedCount = 0;
for (const target of targets) {
  const files = listFiles(target.dir, target.exts, []);
  for (const f of files) {
    const isJson = f.endsWith('.json');
    const res = processFile(f, isJson);
    if (res.changed) {
      changedCount++;
      console.log(`[fix-mojibake] ${f} (score ${res.beforeScore} -> ${res.afterScore})`);
    }
  }
}
console.log(`[fix-mojibake] files changed: ${changedCount}`);
