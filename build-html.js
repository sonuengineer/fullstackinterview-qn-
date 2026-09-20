// One-off generator: markdown -> single self-contained dashboard.html
// No dependencies. Reuses the verified code-fence rules in memory for files
// that still have bare code/diagram lines (db.md, systemdestri.md).
const fs = require('fs');

const ROUNDS = [
  { file: 'resumedeepdrive.md', name: 'Resume & Project Deep Dive', pass: 1, blurb: 'Banking project, CTS optimization, React/Node/Redis/DB/AWS drilling + STAR stories', re: /^#{1,3} \d+\. / },
  { file: 'productiondebugging.md', name: 'Production Debugging', pass: 1, blurb: 'Layer-by-layer debug flows + one-click commands (browser to DB)', re: /^#{1,3} \d+\. / },
  { file: 'productionsenerio.md', name: 'Production Scenarios', pass: 1, blurb: 'Incidents: impact, isolate, mitigate, root cause, prevent', re: /^#{1,3} \d+\. / },
  { file: 'systemdesign.md', name: 'System Design', pass: 2, blurb: 'Designs incl. money transfer, payment API, CTS batch processing', re: /^#{1,3} \d+\. / },
  { file: 'systemdestri.md', name: 'Distributed Systems', pass: 2, blurb: 'HLD/LLD, capacity, CAP, queues, idempotency, RTO/RPO', re: /^## Q\d+\. / },
  { file: 'leadership.md', name: 'Leadership & Behavioral', pass: 2, blurb: 'Behavioral Q&A + golden Lead mindset', re: /^#{1,3} \d+\. / },
  { file: 'codinground.md', name: 'Coding Round', pass: 2, blurb: 'JS, DSA, LRU cache, React, Node, SQL', re: /^#{1,3} \d+\. / },
  { file: 'js.md', name: 'JavaScript', pass: 3, blurb: 'Event loop, closures, promises, this, memory', re: /^## Q\d+\. / },
  { file: 'node.js.md', name: 'Node.js', pass: 3, blurb: 'Event loop internals, libuv, scaling, graceful shutdown', re: /^## Q\d+\. / },
  { file: 'react.md', name: 'React', pass: 3, blurb: 'Rendering, state, performance, memory leaks', re: /^## Q\d+\. / },
  { file: 'nextjs.md', name: 'Next.js', pass: 3, blurb: 'App Router, server/client components, caching, SEO', re: /^## Q\d+\. / },
  { file: 'db.md', name: 'Database & Redis', pass: 3, blurb: 'Indexes, transactions, isolation, sharding, cache patterns', re: /^## Q\d+\. / },
  { file: 'aws.md', name: 'AWS & Cloud', pass: 3, blurb: 'EC2, ALB, S3, RDS, VPC, IAM, deployment', re: /^## Q\d+\. / },
];

const fileKey = (f) => f.replace(/\.md$/, '').replace(/\./g, '-');
const slug = (t) => t.toLowerCase().replace(/[^\p{L}\p{N} _-]/gu, '').replace(/ /g, '-');
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// ---------------------------------------------------------------- in-memory fencer
const CODE_HINTS = [
  /\(\)/,
  /\{\s*$/,
  /^\s*[\}\)\]]/,
  /^\s*[\[\](){}.,;]/,
  /=>/,
  /;\s*$/,
  /\/\//,
  /^\s*(const|let|var|function|async|import|export|return|class|new|await|if|for|while|throw|switch|case)\b/,
  // case-sensitive on purpose: "With index:" is a label, "WITH ... AS" is SQL
  /^\s*(SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP|EXPLAIN|SHOW|WITH|FROM|WHERE|JOIN|ON|VALUES|SET|LIMIT)\b/,
  /console\.|process\.|module\.exports|app\.use|req\.|res\.|server\.|db\.|JSON\./,
  /^\s*[A-Z_][A-Z0-9_]{2,}\s*=/,
  /^\s*(GET|POST|PUT|PATCH|DELETE)\s+\//,
  /^\s*\d{3}\s+[A-Za-z]/,
  /^[│├└→↓]/,
  /^<[A-Za-z>/]/,
  /<\/?[A-Za-z][^>]*>/,
  /\/>\s*$/,
  /^\s*[A-Za-z_$][\w$]*\s*:\s*\S+/,
  /^\s*[A-Za-z0-9_./-]+\.(tsx?|jsx?|json|md|css|html|env)\s*$/,
  /^\s*[a-z0-9_-]+\/\s*$/,
  /^[A-Za-z_$][\w$:.-]*\s*=\s*\S+/,
  /^[A-Za-z0-9][^→]{0,24}→\s*\S+/,
];
const HINGLISH = /\b(hai|hain|hota|hote|karta|karte|karo|nahi|chahiye|kyunki|matlab|jab|tab|toh|bhi|par|ko|ke|ka|ki|se|me|mein|is|are|the|should|would|could|because|when|which|that|but|and|not|with|from|then|only|instead)\b/i;
const DIAGRAM_CHARS = /^[A-Za-z0-9 \t\-.\/?_+():│├└─→↓|&]*$/;

const isListOrHeading = (s) => /^#{1,6}\s/.test(s) || /^---\s*$/.test(s) || /^\s*([*-]|\d+\.)\s+\S/.test(s);

function isProse(s) {
  const words = s.split(/\s+/).filter(Boolean).length;
  const tail = s.replace(/["\u201d')\]}]+$/, '');
  const endsSentence = /[.?!]$/.test(tail) && !/\.\.$/.test(tail);
  if (words >= 3 && endsSentence) return true;
  if (words >= 6 && HINGLISH.test(s) && !/[{};=><]/.test(s)) return true;
  return false;
}
const isCode = (s) => CODE_HINTS.some((re) => re.test(s));
function isDiagram(s) {
  const t = s.trim();
  if (!t) return false;
  if (t.endsWith('.') || t.endsWith(':')) return false;
  if (t.split(/\s+/).length > 6) return false;
  return DIAGRAM_CHARS.test(t);
}
function classify(s) {
  if (isListOrHeading(s)) return 'plain';
  const t = s.trim();
  if (/^[│├└→↓]/.test(t)) return 'code';
  if (/^[A-Za-z0-9][^→]{0,24}→\s*\S+/.test(t)) return 'code';
  if (isProse(s)) return 'plain';
  if (isCode(s)) return 'code';
  if (isDiagram(s)) return 'code';
  return 'plain';
}
function langFor(block) {
  const text = block.join('\n');
  const jsx = /<\/?[A-Za-z][A-Za-z0-9.]*|<>|<\/>|\/>/.test(text);
  const js = /=>|function\s|\bconst\b|\blet\b|\bawait\b|\breturn\b|console\.|useState|useEffect|useMemo|useCallback|useSelector|import\s|export\s|app\.use|process\.|server\.|db\.|module\.exports/.test(text);
  const sql = /^\s*(SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP|EXPLAIN|SHOW)\b/im.test(text);
  if (sql) return 'sql';
  if (js && jsx) return 'jsx';
  if (js) return 'js';
  return 'text';
}
function fenceIfNeeded(raw) {
  if (/^```/m.test(raw)) return raw; // already fenced, leave untouched
  const eol = '\n';
  const lines = raw.split(/\r?\n/);
  const out = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.trim() === '') { out.push(''); i++; continue; }
    if (classify(line) === 'code') {
      const block = [];
      while (i < lines.length) {
        const cur = lines[i];
        if (cur.trim() === '') {
          let j = i;
          while (j < lines.length && lines[j].trim() === '') j++;
          if (j < lines.length && classify(lines[j]) === 'code') { i = j; continue; }
          break;
        }
        if (classify(cur) !== 'code') break;
        block.push(cur);
        i++;
      }
      if (block.length) {
        if (out.length && out[out.length - 1].trim() !== '') out.push('');
        out.push('```' + langFor(block));
        block.forEach((l) => out.push(l));
        out.push('```');
      }
      continue;
    }
    out.push(line);
    i++;
  }
  return out.join(eol);
}

// ---------------------------------------------------------------- inline md -> html
function inline(s) {
  let out = esc(s);
  const codes = [];
  out = out.replace(/`([^`]+)`/g, (m, p) => {
    codes.push(p);
    return `\u0000${codes.length - 1}\u0000`;
  });
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  out = out.replace(/(^|[\s(])\*([^*\s][^*]*)\*/g, '$1<em>$2</em>');
  out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (m, text, url) => {
    let href = url;
    const md = url.match(/^([\w.-]+\.md)(?:#(.*))?$/);
    if (md) href = md[2] ? `#${fileKey(md[1])}--${md[2]}` : `#file-${fileKey(md[1])}`;
    return `<a href="${href}">${text}</a>`;
  });
  out = out.replace(/\u0000(\d+)\u0000/g, (m, i) => `<code>${codes[+i]}</code>`);
  return out;
}

// ---------------------------------------------------------------- markdown -> html
function mdToHtml(md, key, questionSlugs) {
  const lines = md.split(/\r?\n/);
  const out = [];
  let i = 0;

  const headingId = (text) => `${key}--${slug(text)}`;

  while (i < lines.length) {
    const line = lines[i];

    if (line.trim() === '') { i++; continue; }

    const fence = line.match(/^```(\w*)\s*$/);
    if (fence) {
      const lang = fence[1] || 'text';
      const body = [];
      i++;
      while (i < lines.length && !/^```\s*$/.test(lines[i])) body.push(lines[i++]);
      i++;
      out.push(`<pre class="code"><code class="lang-${lang}">${esc(body.join('\n'))}</code></pre>`);
      continue;
    }

    const h = line.match(/^(#{1,6})\s+(.*)$/);
    if (h) {
      const level = Math.min(6, h[1].length + 1); // demote: file h1 -> page h2
      const text = h[2].trim();
      const id = headingId(text);
      const isQ = questionSlugs.has(id);
      out.push(`<h${level} id="${id}"${isQ ? ' class="q"' : ''}>${inline(text)}</h${level}>`);
      i++;
      continue;
    }

    if (/^---\s*$/.test(line)) { out.push('<hr>'); i++; continue; }

    if (/^>\s?/.test(line)) {
      const inner = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) {
        inner.push(lines[i].replace(/^>\s?/, ''));
        i++;
      }
      const paras = [];
      let buf = [];
      for (const l of inner) {
        if (l.trim() === '') { if (buf.length) { paras.push(buf.join(' ')); buf = []; } }
        else buf.push(l.trim());
      }
      if (buf.length) paras.push(buf.join(' '));
      out.push(`<blockquote>${paras.map((p) => `<p>${inline(p)}</p>`).join('')}</blockquote>`);
      continue;
    }

    if (/^\s*([*-]|\d+\.)\s+/.test(line)) {
      const ordered = /^\s*\d+\.\s+/.test(line);
      const items = [];
      const nested = [];
      let nesting = false;
      while (i < lines.length && (lines[i].trim() === '' || /^\s*([*-]|\d+\.)\s+/.test(lines[i]))) {
        if (lines[i].trim() === '') {
          // blank line inside a list: only continue if the next line is still a list item
          let j = i;
          while (j < lines.length && lines[j].trim() === '') j++;
          if (j < lines.length && /^\s*([*-]|\d+\.)\s+/.test(lines[j])) { i = j; continue; }
          break;
        }
        const item = lines[i];
        const indent = item.match(/^\s*/)[0].length;
        const text = item.replace(/^\s*([*-]|\d+\.)\s+/, '');
        if (indent >= 2) { nested.push(`<li>${inline(text)}</li>`); nesting = true; }
        else {
          if (nesting && items.length) {
            items[items.length - 1] = items[items.length - 1].replace(
              /<\/li>$/,
              `<ul>${nested.join('')}</ul></li>`
            );
            nested.length = 0;
            nesting = false;
          }
          items.push(`<li>${inline(text)}</li>`);
        }
        i++;
      }
      if (nesting && items.length) {
        items[items.length - 1] = items[items.length - 1].replace(/<\/li>$/, `<ul>${nested.join('')}</ul></li>`);
      }
      const tag = ordered ? 'ol' : 'ul';
      out.push(`<${tag}>${items.join('')}</${tag}>`);
      continue;
    }

    const para = [];
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !/^```/.test(lines[i]) &&
      !/^#{1,6}\s/.test(lines[i]) &&
      !/^---\s*$/.test(lines[i]) &&
      !/^>\s?/.test(lines[i]) &&
      !/^\s*([*-]|\d+\.)\s+/.test(lines[i])
    ) {
      para.push(lines[i].trim());
      i++;
    }
    out.push(`<p>${para.map(inline).join(' ')}</p>`);
  }

  return out.join('\n');
}

// ---------------------------------------------------------------- collect + render
let totalQ = 0;
const rendered = [];
const index = [];
const WRITE_MD = process.argv.includes('--write-md');
const mdChanges = [];
const words = (s) => s.replace(/^```.*$/gm, '').split(/\s+/).filter(Boolean).length;

for (const [n, r] of ROUNDS.entries()) {
  const key = fileKey(r.file);
  const raw = fs.readFileSync(r.file, 'utf8');
  const fenced = fenceIfNeeded(raw);

  // keep the markdown on disk in sync with what the HTML renders
  if (WRITE_MD && fenced !== raw) {
    const saved = words(raw);
    const body = raw.includes('\r\n') ? fenced.replace(/\r?\n/g, '\r\n') : fenced;
    const now = words(body);
    fs.writeFileSync(r.file, body, 'utf8');
    mdChanges.push(
      `${r.file.padEnd(20)} ${String(raw.split(/\r?\n/).length).padStart(4)} -> ${String(
        body.split(/\r\n|\n/).length
      ).padStart(4)} lines · words ${saved} -> ${now} ${saved === now ? 'OK' : 'MISMATCH'}`
    );
  }

  // questions (same rules as the markdown dashboard)
  const seen = new Set();
  const qs = [];
  for (const l of fenced.split(/\r?\n/)) {
    if (!r.re.test(l)) continue;
    const title = l.replace(/^#{1,3} /, '').trim();
    if (/TIER|PRIORITY RANKING|Mental Model/i.test(title)) continue;
    const id = `${key}--${slug(title)}`;
    if (seen.has(id)) continue;
    seen.add(id);
    qs.push({ title, id, label: title.replace(/^Q?\d+\.\s*/, '') });
  }
  const slugs = new Set(qs.map((q) => q.id));
  totalQ += qs.length;
  index.push({ ...r, key, qs });
  rendered.push(
    `<section id="file-${key}" class="round">\n` +
      `<p class="roundbar"><span>Round ${n + 1} of ${ROUNDS.length}</span> <code>${r.file}</code> <a href="#index">↑ Index</a></p>\n` +
      mdToHtml(fenced, key, slugs) +
      `\n<p class="roundbar"><a href="#index">↑ Back to index</a></p>\n</section>`
  );
}

const plan = [1, 2, 3]
  .map((p) => {
    const rows = index
      .filter((r) => r.pass === p)
      .map((r) => `<li><a href="#file-${r.key}">${r.name}</a> <span class="count">${r.qs.length} q</span></li>`)
      .join('');
    return `<h3>Pass ${p}</h3><ul class="plain">${rows}</ul>`;
  })
  .join('');

const toc = index
  .map(
    (r) => `<details>
<summary><a href="#file-${r.key}">${r.name}</a> <span class="count">${r.qs.length} q</span></summary>
<ol class="qlist">${r.qs.map((q) => `<li><a href="#${q.id}">${esc(q.label)}</a></li>`).join('')}</ol>
</details>`
  )
  .join('');

const css = `
:root{--fg:#1b1b1b;--muted:#6b6b6b;--bg:#fdfcfa;--panel:#f2efe9;--line:#e0dbd2;--accent:#8a4b1f;--code:#f6f3ee}
@media (prefers-color-scheme:dark){:root{--fg:#e8e6e3;--muted:#a0a0a0;--bg:#16181a;--panel:#1f2225;--line:#33383d;--accent:#e0a878;--code:#1c2023}}
*{box-sizing:border-box}
html{scroll-behavior:smooth}
body{margin:0;background:var(--bg);color:var(--fg);font:17px/1.7 Georgia,"Iowan Old Style",serif;padding:0 1.1rem 5rem}
main,nav,header{max-width:47rem;margin:0 auto}
h1,h2,h3,h4{font-family:-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;line-height:1.3;margin:1.7em 0 .5em}
h1{font-size:1.7rem;margin-top:1.2rem}
h2{font-size:1.35rem;border-bottom:1px solid var(--line);padding-bottom:.3rem}
h3{font-size:1.1rem}
h4{font-size:1rem;color:var(--muted)}
p{margin:.75em 0}
a{color:var(--accent);text-decoration:none}
a:hover{text-decoration:underline}
hr{border:0;border-top:1px solid var(--line);margin:2rem 0}
code{font-family:ui-monospace,SFMono-Regular,Consolas,"Liberation Mono",monospace;font-size:.85em;background:var(--panel);padding:.12em .35em;border-radius:.25em}
pre.code{background:var(--code);border:1px solid var(--line);border-radius:.5rem;padding:.8rem .9rem;overflow-x:auto;font-size:.82rem;line-height:1.5;white-space:pre;page-break-inside:avoid}
pre.code code{background:none;padding:0;font-size:1em}
blockquote{margin:1em 0;padding:.1rem 1rem;border-left:3px solid var(--accent);color:var(--fg);background:var(--panel);border-radius:0 .4rem .4rem 0}
blockquote p{margin:.6em 0}
ul,ol{padding-left:1.3rem}
li{margin:.3em 0}
nav#index{background:var(--panel);border:1px solid var(--line);border-radius:.6rem;padding:1rem 1.2rem;margin:1.5rem auto}
nav#index h2{margin-top:.2rem;border:0}
ul.plain{list-style:none;padding-left:0}
ul.plain li{padding:.15rem 0}
details{border-top:1px solid var(--line);padding:.4rem 0}
summary{cursor:pointer;font-family:-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;font-size:.95rem;font-weight:600}
ol.qlist{font-size:.9rem}
.count{color:var(--muted);font-weight:400}
.roundbar{font-family:-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;font-size:.78rem;color:var(--muted);display:flex;gap:.6rem;align-items:center;margin:.2rem 0 1rem;padding-bottom:.5rem;border-bottom:1px solid var(--line)}
h2.q,h3.q,h4.q{margin-top:2.2rem}
h3.q::before,h4.q::before{content:"▸ ";color:var(--accent)}
h4.q{color:var(--fg);font-size:1.05rem}
header p.hint{color:var(--muted);font-size:.92rem}
.end{max-width:47rem;margin:3rem auto 0;color:var(--muted);font-size:.85rem;border-top:1px solid var(--line);padding-top:1rem}
@media print{
  body{background:#fff;color:#000;font-size:12pt}
  nav#index details{page-break-inside:avoid}
  a{color:#000;text-decoration:none}
  .roundbar{display:none}
  pre.code{background:#f7f7f7;page-break-inside:avoid}
  section.round{page-break-before:always}
}
`;

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Interview Prep — All Rounds (Lead Engineer)</title>
<style>${css}</style>
</head>
<body>
<header>
<h1>📖 Interview Prep — All Rounds</h1>
<p><strong>${ROUNDS.length} rounds</strong> · <strong>${totalQ} questions</strong> · single offline file, Kindle/browser friendly.</p>
<p class="hint">Neeche index se kisi bhi question par jump karo. Har round ka poora answer isi file me hai — koi internet ya doosri file nahi chahiye.</p>
</header>
<nav id="index">
<h2>🎯 3-Pass Reading Order (80/20)</h2>
${plan}
<h2>📚 All Questions</h2>
${toc}
</nav>
<main>
${rendered.join('\n')}
</main>
<p class="end">Generated from ${ROUNDS.length} markdown files · ${totalQ} questions · <a href="#index">↑ back to index</a><br>
Note: dashboard.md ka content yahan index ke roop me hai; baaki saare rounds ke answers isi file me hain.</p>
</body>
</html>
`;

fs.writeFileSync('dashboard.html', html, 'utf8');
if (WRITE_MD) {
  console.log(mdChanges.length ? mdChanges.join('\n') : 'no markdown files needed fencing');
  console.log('');
}
console.log(
  `${ROUNDS.length} files -> dashboard.html · ${totalQ} questions · ${(Buffer.byteLength(html) / 1024).toFixed(0)} KB`
);
console.log(index.map((r) => `${r.file.padEnd(24)} ${String(r.qs.length).padStart(3)}`).join('\n'));
