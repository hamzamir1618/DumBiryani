// Builds self-contained HTML exports of the prototypes: photos and Google Fonts are embedded,
// so each file works offline and can be shared on its own.
// Usage: node design/build-exports.js
const fs = require('fs');
const path = require('path');
const https = require('https');
const { execFileSync } = require('child_process');

const ROOT = __dirname;
const PROTO = path.join(ROOT, 'prototypes');
const ASSETS = path.join(PROTO, 'assets');
const OUT = path.join(ROOT, 'exports');
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';
const KEEP_SUBSETS = new Set(['latin', 'latin-ext']);

const get = url => new Promise((resolve, reject) => {
  https.get(url, { headers: { 'User-Agent': UA } }, res => {
    if (res.statusCode >= 300 && res.statusCode < 400) return resolve(get(res.headers.location));
    if (res.statusCode !== 200) return reject(new Error(`${res.statusCode} ${url}`));
    const chunks = [];
    res.on('data', c => chunks.push(c)).on('end', () => resolve(Buffer.concat(chunks)));
  }).on('error', reject);
});

// Re-encode photos smaller for the exports so each file stays a reasonable size.
function imageData(name) {
  const tmp = path.join(OUT, '.img-' + name + '.jpg');
  execFileSync('python', ['-c', `from PIL import Image; im = Image.open(r"${path.join(ASSETS, name + '.jpg')}").convert("RGB"); im.thumbnail((900, 1400)); im.save(r"${tmp}", quality=64, optimize=True, progressive=True)`]);
  const b64 = fs.readFileSync(tmp).toString('base64');
  fs.unlinkSync(tmp);
  return 'data:image/jpeg;base64,' + b64;
}

async function inlineFonts(cssUrl) {
  const css = (await get(cssUrl.replace(/&amp;/g, '&'))).toString('utf8');
  const blocks = css.split(/(?=\/\* [a-z-]+ \*\/)/);
  const kept = [];
  for (const block of blocks) {
    const subset = (block.match(/^\/\* ([a-z-]+) \*\//) || [])[1];
    if (!subset || !KEEP_SUBSETS.has(subset)) continue;
    let out = block;
    for (const [, url] of block.matchAll(/url\((https:[^)]+)\)/g)) {
      const font = await get(url);
      out = out.replace(url, 'data:font/woff2;base64,' + font.toString('base64'));
    }
    kept.push(out);
  }
  return kept.join('\n');
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const imgCache = {};
  const img = name => (imgCache[name] ??= imageData(name));
  const files = fs.readdirSync(PROTO).filter(f => /^v\d.*\.html$/.test(f));

  for (const file of files) {
    let html = fs.readFileSync(path.join(PROTO, file), 'utf8');
    const title = (html.match(/<title>[\s\S]*?<\/title>/) || [''])[0];
    html = html.replace(title, '');

    // Fonts: swap the Google Fonts links for embedded @font-face rules.
    let fontCss = '';
    for (const [tag, href] of html.matchAll(/<link href="(https:\/\/fonts\.googleapis\.com\/css2[^"]+)" rel="stylesheet">/g)) {
      fontCss += await inlineFonts(href) + '\n';
      html = html.replace(tag, '');
    }
    html = html.replace(/<link rel="preconnect"[^>]*>\s*/g, '');

    // Photos used from scripts go through one lookup table so each is embedded once.
    const scriptNames = new Set();
    let dynamic = false;
    html = html.replace(/<script>[\s\S]*?<\/script>/g, script => script
      .replace(/'assets\/([a-z-]+)\.jpg'/g, (_, n) => (scriptNames.add(n), `__IMG[${JSON.stringify(n)}]`))
      .replace(/assets\/\$\{([^}]+)\}\.jpg/g, (_, expr) => (dynamic = true, `\${__IMG[${expr}]}`)));
    // Photos referenced directly in markup become data URIs.
    html = html.replace(/assets\/([a-z-]+)\.jpg/g, (_, n) => img(n));

    const allNames = fs.readdirSync(ASSETS).filter(f => f.endsWith('.jpg')).map(f => f.slice(0, -4));
    const tableNames = dynamic ? allNames : [...scriptNames];
    const table = tableNames.length ? `<script>window.__IMG = {${tableNames.map(n => `${JSON.stringify(n)}:"${img(n)}"`).join(',')}};</script>` : '';

    const page = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
${title}
<!-- Dum Biryani design prototype. Self-contained export: fonts and photos are embedded, no network needed.
     Photos: Unsplash (unsplash.com/license), placeholders only. Fonts: Google Fonts (SIL Open Font License). -->
<style>${fontCss}</style>
<style>:root{color-scheme:light}body{margin:0}img{max-width:100%}[hidden]{display:none!important}</style>
${table}
</head>
<body>
${html.trim()}
</body>
</html>
`;
    const outName = 'dum-biryani-' + file;
    fs.writeFileSync(path.join(OUT, outName), page);
    console.log(outName, (Buffer.byteLength(page) / 1048576).toFixed(2) + ' MB');
  }
})().catch(e => { console.error(e); process.exit(1); });
