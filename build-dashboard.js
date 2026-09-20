// One-off generator: builds dashboard.md - a single Kindle-style reading page
// listing every question across all prep files, linked to its answer.
const fs = require('fs');

const ROUNDS = [
  {
    file: 'resumedeepdrive.md',
    name: 'Resume & Project Deep Dive',
    pass: 1,
    blurb: 'Banking project, CTS optimization, React/Node/Redis/DB/AWS drilling + STAR stories',
    re: /^#{1,3} \d+\. /,
  },
  {
    file: 'productiondebugging.md',
    name: 'Production Debugging',
    pass: 1,
    blurb: 'Layer-by-layer debug flows + one-click commands (browser to DB)',
    re: /^#{1,3} \d+\. /,
  },
  {
    file: 'productionsenerio.md',
    name: 'Production Scenarios',
    pass: 1,
    blurb: 'Incidents: impact, isolate, mitigate, root cause, prevent',
    re: /^#{1,3} \d+\. /,
  },
  {
    file: 'systemdesign.md',
    name: 'System Design',
    pass: 2,
    blurb: 'Designs incl. money transfer, payment API, CTS batch processing',
    re: /^#{1,3} \d+\. /,
  },
  {
    file: 'systemdestri.md',
    name: 'Distributed Systems',
    pass: 2,
    blurb: 'HLD/LLD, capacity, CAP, queues, idempotency, RTO/RPO',
    re: /^## Q\d+\. /,
  },
  {
    file: 'leadership.md',
    name: 'Leadership & Behavioral',
    pass: 2,
    blurb: 'Behavioral Q&A + golden Lead mindset',
    re: /^#{1,3} \d+\. /,
  },
  {
    file: 'codinground.md',
    name: 'Coding Round',
    pass: 2,
    blurb: 'JS, DSA, LRU cache, React, Node, SQL',
    re: /^#{1,3} \d+\. /,
  },
  { file: 'js.md', name: 'JavaScript', pass: 3, blurb: 'Event loop, closures, promises, this, memory', re: /^## Q\d+\. / },
  { file: 'node.js.md', name: 'Node.js', pass: 3, blurb: 'Event loop internals, libuv, scaling, graceful shutdown', re: /^## Q\d+\. / },
  { file: 'react.md', name: 'React', pass: 3, blurb: 'Rendering, state, performance, memory leaks', re: /^## Q\d+\. / },
  { file: 'nextjs.md', name: 'Next.js', pass: 3, blurb: 'App Router, server/client components, caching, SEO', re: /^## Q\d+\. / },
  { file: 'db.md', name: 'Database & Redis', pass: 3, blurb: 'Indexes, transactions, isolation, sharding, cache patterns', re: /^## Q\d+\. / },
  { file: 'aws.md', name: 'AWS & Cloud', pass: 3, blurb: 'EC2, ALB, S3, RDS, VPC, IAM, deployment', re: /^## Q\d+\. / },
];

const slug = (t) =>
  t
    .toLowerCase()
    .replace(/[^\p{L}\p{N} _-]/gu, '')
    .replace(/ /g, '-');

// ---- phase 1: collect questions -------------------------------------------------
let total = 0;
for (const r of ROUNDS) {
  const seen = new Set();
  r.qs = [];
  for (const l of fs.readFileSync(r.file, 'utf8').split(/\r?\n/)) {
    if (!r.re.test(l)) continue;
    const title = l.replace(/^#{1,3} /, '').trim();
    if (/TIER|PRIORITY RANKING|Mental Model/i.test(title)) continue;
    const key = slug(title);
    if (seen.has(key)) continue; // systemdestri.md repeats the same 20 questions
    seen.add(key);
    r.qs.push({ key, label: title.replace(/^Q?\d+\.\s*/, '') });
  }
  total += r.qs.length;
}

// ---- phase 2: write the dashboard ----------------------------------------------
const out = [];
const push = (s = '') => out.push(s);

push('# 📖 Interview Prep Dashboard');
push();
push('Ek page. Saare rounds, saare questions. Kindle ki tarah top se neeche padho, ya apne round par jump karo.');
push();
push('**Kaise use karein:** har question line apne answer par link hai. Neeche diya 3-pass order follow karo — Pass 1 se start karo.');
push();
push('---');
push();
push('## 🎯 3-Pass Reading Order (80/20)');
push();
push('```text');
for (const p of [1, 2, 3]) {
  push(`PASS ${p}`);
  ROUNDS.filter((r) => r.pass === p).forEach((r) => {
    push(`  ${r.name.padEnd(28)} ${String(r.qs.length).padStart(3)} q`);
  });
  push();
}
push('```');
push();
push('---');
push();
push('## 📚 Contents');
push();
push('```text');
ROUNDS.forEach((r, i) => {
  push(`${String(i + 1).padStart(2)}. ${r.name}`);
});
push('```');
push();
push('---');

ROUNDS.forEach((r) => {
  push();
  push(`## ${r.name}`);
  push();
  push(`[${r.file}](${r.file}) · **${r.qs.length} questions** · ${r.blurb}`);
  push();
  r.qs.forEach((q, i) => {
    push(`${i + 1}. [${q.label}](${r.file}#${q.key})`);
  });
  push();
  push('---');
});

push();
push(`## 📊 Total: ${total} questions across ${ROUNDS.length} files`);
push();
push('```text');
ROUNDS.forEach((r) => {
  push(`${r.name.padEnd(26)} ${String(r.qs.length).padStart(3)}   ${r.file}`);
});
push('---------------------------------------------');
push(`${'TOTAL'.padEnd(26)} ${String(total).padStart(3)}`);
push('```');
push();
push('## ⚠️ Notes');
push();
push('* Saare 13 files mein code fences lag chuke hain — markdown preview aur `dashboard.html` dono consistent render hote hain.');
push('* Browser/Kindle me padhne ke liye `dashboard.html` kholo — same index + saare answers, ek hi file me. Rebuild: `node build-html.js`.');
push('* `dashboard.md` `node build-dashboard.js` se banta hai — kisi bhi file mein question add/remove karne ke baad script dobara chalao, warna index purana rehta hai.');
push('* Round ka poora answer file ke andar hai; yahan sirf questions ka index hai (mock practice ke liye).');
push();
push('> Mock dete waqt sirf question padho aur answer band rakho. Self-test ke baad hi file kholo.');
push();

fs.writeFileSync('dashboard.md', out.join('\r\n'), 'utf8');

console.log(ROUNDS.map((r) => `${r.file.padEnd(24)} ${String(r.qs.length).padStart(3)}`).join('\n'));
console.log(`\nTOTAL ${total}`);
console.log(`written dashboard.md (${out.length} lines)`);
