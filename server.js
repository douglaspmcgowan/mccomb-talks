const express = require("express");
const path = require("path");
const app = express();

app.use("/slides", express.static(path.join(__dirname, "public", "slides")));
app.use("/figures", express.static(path.join(__dirname, "public", "figures")));

// ─── Routes ───
app.get("/", (req, res) => res.send(buildLanding()));
app.get("/mccomb", (req, res) => res.send(buildMcComb()));
app.get("/horwitz", (req, res) => res.send(buildHorwitz()));
app.get("/ahmed", (req, res) => res.send(buildAhmed()));
app.get("/sandbox", (req, res) => res.send(buildSandbox()));

// ─── Shared CSS ───
function getSharedCSS() {
  return `
:root {
  --bg: #fafaf9; --bg-card: #ffffff;
  --bg-hero: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  --text: #1c1917; --text-secondary: #57534e; --text-muted: #a8a29e;
  --accent: #2563eb; --accent-light: #dbeafe;
  --border: #e7e5e4; --border-light: #f5f5f4;
  --shadow: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
  --shadow-lg: 0 10px 25px rgba(0,0,0,0.08);
  --radius: 12px; --max-w: 900px;
}
[data-theme="dark"] {
  --bg: #0c0a09; --bg-card: #1c1917;
  --text: #fafaf9; --text-secondary: #a8a29e; --text-muted: #78716c;
  --accent: #60a5fa; --accent-light: #1e3a5f;
  --border: #292524; --border-light: #1c1917;
  --shadow: 0 1px 3px rgba(0,0,0,0.3); --shadow-lg: 0 10px 25px rgba(0,0,0,0.4);
}
* { margin:0; padding:0; box-sizing:border-box; }
body { font-family:'Inter',-apple-system,sans-serif; background:var(--bg); color:var(--text); line-height:1.7; -webkit-font-smoothing:antialiased; }
.hero { background:var(--bg-hero); color:#fff; padding:4rem 1.5rem 3rem; text-align:center; }
.hero h1 { font-family:'Playfair Display',serif; font-size:clamp(1.8rem,5vw,3rem); font-weight:700; margin-bottom:0.5rem; letter-spacing:-0.02em; }
.hero .subtitle { font-size:clamp(0.9rem,2.5vw,1.1rem); opacity:0.8; font-weight:300; max-width:600px; margin:0 auto; }
.hero .meta { margin-top:1.5rem; display:flex; gap:1.5rem; justify-content:center; flex-wrap:wrap; font-size:0.85rem; opacity:0.7; }
.theme-toggle { position:fixed; top:1rem; right:1rem; z-index:100; background:var(--bg-card); color:var(--text); border:1px solid var(--border); border-radius:50%; width:44px; height:44px; display:flex; align-items:center; justify-content:center; cursor:pointer; font-size:1.1rem; box-shadow:var(--shadow); transition:transform 0.2s; }
.theme-toggle:hover { transform:scale(1.1); }
.theme-toggle:focus-visible { outline:2px solid var(--accent); outline-offset:2px; }
.nav { position:sticky; top:0; z-index:50; background:var(--bg); border-bottom:1px solid var(--border); padding:0 1rem; overflow-x:auto; -webkit-overflow-scrolling:touch; }
.nav-inner { max-width:var(--max-w); margin:0 auto; display:flex; gap:0; }
.nav-tab { padding:0.85rem 1.2rem; font-size:0.85rem; font-weight:500; color:var(--text-muted); cursor:pointer; border-bottom:2px solid transparent; white-space:nowrap; transition:all 0.2s; background:none; border-top:none; border-left:none; border-right:none; font-family:inherit; }
.nav-tab:hover { color:var(--text); }
.nav-tab.active { color:var(--accent); border-bottom-color:var(--accent); }
.container { max-width:var(--max-w); margin:0 auto; padding:2rem 1.5rem 4rem; }
.section { display:none; animation:fadeIn 0.3s ease; }
.section.active { display:block; }
@keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
h2 { font-family:'Playfair Display',serif; font-size:1.6rem; margin:2.5rem 0 1rem; scroll-margin-top:5rem; }
h3 { font-size:1.1rem; font-weight:600; margin:2rem 0 0.75rem; scroll-margin-top:5rem; }
h4 { font-size:0.95rem; font-weight:600; margin:1.5rem 0 0.5rem; color:var(--text-secondary); }
p { margin-bottom:1rem; color:var(--text-secondary); }
strong { color:var(--text); font-weight:600; }
.slide-fig { margin:1.5rem 0; background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius); overflow:hidden; box-shadow:var(--shadow); }
.slide-fig img { width:100%; height:auto; display:block; cursor:zoom-in; }
.slide-fig .caption { padding:0.75rem 1rem; font-size:0.8rem; color:var(--text-muted); border-top:1px solid var(--border-light); }
.callout { background:var(--accent-light); border-left:3px solid var(--accent); border-radius:0 var(--radius) var(--radius) 0; padding:1rem 1.25rem; margin:1.5rem 0; font-size:0.9rem; }
.callout p { color:var(--text); margin:0; }
.callout .label { font-weight:600; font-size:0.75rem; text-transform:uppercase; letter-spacing:0.05em; color:var(--accent); margin-bottom:0.25rem; }
.tags { display:flex; flex-wrap:wrap; gap:0.5rem; margin:1rem 0; }
.tag { font-size:0.75rem; padding:0.25rem 0.75rem; border-radius:999px; background:var(--border-light); color:var(--text-secondary); font-weight:500; }
[data-theme="dark"] .tag { background:var(--border); }
.findings { list-style:none; padding:0; }
.findings li { padding:0.75rem 0; padding-left:1.75rem; position:relative; color:var(--text-secondary); border-bottom:1px solid var(--border-light); }
.findings li::before { content:''; position:absolute; left:0; top:1.1rem; width:8px; height:8px; border-radius:50%; background:var(--accent); }
.lightbox { display:none; position:fixed; inset:0; z-index:1000; background:rgba(0,0,0,0.9); align-items:center; justify-content:center; cursor:zoom-out; }
.lightbox.open { display:flex; }
.lightbox img { max-width:95vw; max-height:95vh; object-fit:contain; border-radius:8px; }
.scroll-top { position:fixed; bottom:2rem; right:2rem; width:44px; height:44px; border-radius:50%; background:var(--accent); color:#fff; border:none; font-size:1.2rem; cursor:pointer; box-shadow:var(--shadow-lg); opacity:0; pointer-events:none; transition:opacity 0.3s,transform 0.2s; z-index:90; }
.scroll-top.visible { opacity:1; pointer-events:auto; }
.scroll-top:hover { transform:scale(1.1); }
.toc { background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius); padding:1.25rem 1.5rem; margin:1.5rem 0; }
.toc h4 { margin-top:0; color:var(--text-muted); font-size:0.8rem; text-transform:uppercase; letter-spacing:0.05em; }
.toc ul { list-style:none; padding:0; }
.toc li { padding:0.3rem 0; }
.toc a { color:var(--accent); text-decoration:none; font-size:0.9rem; font-weight:500; }
.toc a:hover { text-decoration:underline; }
.slide-pair { display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin:1.5rem 0; }
.back-link { display:inline-flex; align-items:center; gap:0.4rem; font-size:0.85rem; color:var(--text-muted); text-decoration:none; padding:0.4rem 0.8rem; border-radius:999px; background:var(--border-light); margin-bottom:1.5rem; transition:color 0.2s,background 0.2s; }
.back-link:hover { color:var(--accent); background:var(--accent-light); }
[data-theme="dark"] .back-link { background:var(--border); }
.report-cards { display:grid; grid-template-columns:1fr; gap:1.5rem; margin:2rem 0; }
.report-card { background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius); overflow:hidden; box-shadow:var(--shadow); transition:box-shadow 0.2s,transform 0.2s; text-decoration:none; color:inherit; display:block; }
.report-card:hover { box-shadow:var(--shadow-lg); transform:translateY(-2px); }
.report-card img { width:100%; height:200px; object-fit:cover; }
.report-card .card-body { padding:1.25rem; }
.report-card h3 { font-family:'Playfair Display',serif; font-size:1.15rem; margin-bottom:0.5rem; }
.report-card p { font-size:0.9rem; color:var(--text-secondary); margin-bottom:0.75rem; }
.report-card .card-meta { font-size:0.8rem; color:var(--text-muted); }
.venue-badge { display:inline-block; font-size:0.7rem; font-weight:600; padding:0.2rem 0.6rem; border-radius:999px; background:var(--accent); color:#fff; margin-left:0.5rem; vertical-align:middle; }
.result-table { width:100%; border-collapse:collapse; font-size:0.85rem; margin:1rem 0; }
.result-table th, .result-table td { text-align:left; padding:0.75rem; border-bottom:1px solid var(--border-light); }
.result-table th { color:var(--text-muted); font-weight:600; font-size:0.8rem; }
.result-table td { color:var(--text-secondary); }
.flow-diagram { display:flex; align-items:center; gap:0.5rem; flex-wrap:wrap; margin:1.5rem 0; padding:1.25rem; background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius); }
.flow-node { padding:0.5rem 1rem; border-radius:var(--radius); background:var(--accent-light); border:1px solid var(--accent); font-size:0.8rem; font-weight:500; color:var(--text); text-align:center; }
.flow-arrow { color:var(--text-muted); font-size:1.2rem; }
@media(min-width:700px) { .report-cards { grid-template-columns:1fr 1fr; } }
details.proto-plan { margin:1.5rem 0; background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius); overflow:hidden; }
details.proto-plan summary { padding:1rem 1.25rem; font-weight:600; font-size:0.95rem; cursor:pointer; color:var(--accent); list-style:none; display:flex; align-items:center; gap:0.5rem; }
details.proto-plan summary::before { content:'\\25B6'; font-size:0.7rem; transition:transform 0.2s; }
details.proto-plan[open] summary::before { transform:rotate(90deg); }
details.proto-plan .plan-body { padding:0 1.25rem 1.25rem; }
details.proto-plan .plan-body h4 { margin-top:1rem; }
details.proto-plan .plan-body p { font-size:0.88rem; }
details.proto-plan .plan-body ul { padding-left:1.25rem; margin:0.5rem 0; font-size:0.88rem; color:var(--text-secondary); }
details.proto-plan .plan-body li { margin:0.3rem 0; }
details.proto-plan .plan-body a { color:var(--accent); }
details.build-help { margin:1rem 0; background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius); overflow:hidden; }
details.build-help summary { padding:0.65rem 1rem; font-weight:600; font-size:0.88rem; cursor:pointer; color:var(--accent); list-style:none; display:flex; align-items:center; gap:0.5rem; }
details.build-help summary::before { content:'\\25B6'; font-size:0.65rem; transition:transform 0.2s; }
details.build-help[open] summary::before { transform:rotate(90deg); }
details.build-help .help-body { padding:0 1rem 1rem; font-size:0.88rem; }
details.build-help .help-body p { font-size:0.88rem; margin:0.5rem 0; }
details.build-help .help-body ul, details.build-help .help-body ol { padding-left:1.25rem; margin:0.5rem 0; font-size:0.88rem; color:var(--text-secondary); }
details.build-help .help-body li { margin:0.3rem 0; }
details.build-help .help-body pre { font-size:0.8rem; margin:0.6rem 0; }
details.build-help .help-body a { color:var(--accent); }
details.build-help .help-body code { font-size:0.82rem; }
.cost-tag { display:inline-block; font-size:0.75rem; font-weight:600; padding:0.15rem 0.5rem; border-radius:999px; background:#dcfce7; color:#166534; margin-left:0.5rem; }
[data-theme="dark"] .cost-tag { background:#14532d; color:#86efac; }
pre.code-block { background:#1e1e1e; color:#d4d4d4; padding:1rem 1.25rem; border-radius:var(--radius); overflow-x:auto; font-family:'SF Mono','Monaco','Consolas','Courier New',monospace; font-size:0.8rem; line-height:1.5; margin:1rem 0; border:1px solid var(--border); }
pre.code-block .kw { color:#569cd6; }
pre.code-block .str { color:#ce9178; }
pre.code-block .cmt { color:#6a9955; font-style:italic; }
pre.code-block .num { color:#b5cea8; }
pre.code-block .fn { color:#dcdcaa; }
pre.code-block .ty { color:#4ec9b0; }
.code-label { display:inline-block; font-size:0.7rem; font-weight:600; padding:0.2rem 0.6rem; border-radius:4px 4px 0 0; background:#2d2d2d; color:#d4d4d4; margin-bottom:-1px; border:1px solid var(--border); border-bottom:none; font-family:'SF Mono','Monaco','Consolas',monospace; }
details.section-fold { margin:1rem 0 0.75rem; border-top:1px solid var(--border); }
details.section-fold > summary { padding:0.75rem 0; font-family:'Playfair Display',serif; font-size:1.15rem; font-weight:600; color:var(--text); cursor:pointer; list-style:none; display:flex; align-items:center; gap:0.6rem; }
details.section-fold > summary::before { content:'\\25B6'; font-size:0.7rem; color:var(--accent); transition:transform 0.2s; flex-shrink:0; }
details.section-fold[open] > summary::before { transform:rotate(90deg); }
details.section-fold > summary:hover { color:var(--accent); }
details.section-fold > .section-body { padding:0 0 0.75rem 1.4rem; }
details.code-fold { margin:1rem 0; border:1px solid var(--border); border-radius:var(--radius); overflow:hidden; }
details.code-fold > summary { padding:0.5rem 0.85rem; font-size:0.78rem; font-weight:600; background:#2d2d2d; color:#d4d4d4; cursor:pointer; list-style:none; display:flex; align-items:center; gap:0.5rem; font-family:'SF Mono','Monaco','Consolas',monospace; }
details.code-fold > summary::before { content:'\\25B6'; font-size:0.65rem; color:#6a9955; transition:transform 0.2s; flex-shrink:0; }
details.code-fold[open] > summary::before { transform:rotate(90deg); }
details.code-fold > summary .code-lines { margin-left:auto; color:#858585; font-weight:400; font-size:0.72rem; }
details.code-fold > pre.code-block { margin:0; border:none; border-radius:0; }
.phase-header { display:flex; align-items:center; gap:0.75rem; margin:2.5rem 0 1rem; padding:0.75rem 1rem; background:linear-gradient(90deg,var(--accent-light),transparent); border-left:4px solid var(--accent); border-radius:0 var(--radius) var(--radius) 0; }
.phase-header .phase-num { font-family:'Playfair Display',serif; font-size:1.75rem; font-weight:700; color:var(--accent); line-height:1; }
.phase-header .phase-title { font-family:'Playfair Display',serif; font-size:1.35rem; font-weight:600; color:var(--text); }
.phase-header .phase-time { margin-left:auto; font-size:0.8rem; color:var(--text-muted); font-weight:500; }
/* === Algorithm comparison matrix === */
.algo-matrix-wrap { overflow-x:auto; margin:1.25rem 0; border-radius:var(--radius); border:1px solid var(--border); background:var(--bg-card); }
table.algo-matrix { width:100%; border-collapse:collapse; font-size:0.84rem; min-width:720px; }
table.algo-matrix thead { background:linear-gradient(180deg,#f1f5f9,#e2e8f0); }
[data-theme="dark"] table.algo-matrix thead { background:linear-gradient(180deg,#1e293b,#0f172a); }
table.algo-matrix th { text-align:left; padding:0.7rem 0.85rem; font-size:0.75rem; font-weight:700; text-transform:uppercase; letter-spacing:0.04em; color:var(--text-muted); border-bottom:2px solid var(--border); }
table.algo-matrix td { padding:0.8rem 0.85rem; border-bottom:1px solid var(--border-light); vertical-align:top; line-height:1.4; }
table.algo-matrix tr:last-child td { border-bottom:none; }
table.algo-matrix tr.algo-recommended { background:linear-gradient(90deg,rgba(59,130,246,0.08),transparent 70%); border-left:4px solid #3b82f6; }
[data-theme="dark"] table.algo-matrix tr.algo-recommended { background:linear-gradient(90deg,rgba(59,130,246,0.18),transparent 70%); }
table.algo-matrix tr.algo-recommended td:first-child { padding-left:calc(0.85rem - 4px); }
table.algo-matrix tr:hover { background:rgba(100,116,139,0.06); }
.algo-name { font-weight:700; color:var(--text); font-size:0.92rem; }
.algo-name .algo-letter { display:inline-block; width:1.4em; height:1.4em; line-height:1.4em; text-align:center; border-radius:4px; background:#64748b; color:#fff; font-size:0.72rem; font-weight:700; margin-right:0.45rem; vertical-align:1px; }
.algo-name.algo-rec .algo-letter { background:#3b82f6; }
.algo-name .algo-sub { display:block; font-weight:400; font-size:0.76rem; color:var(--text-muted); margin-top:0.15rem; }
.star-rating { letter-spacing:2px; font-size:0.85rem; color:#f59e0b; }
.star-rating .off { color:var(--border); }
.axis-chip { display:inline-block; font-size:0.68rem; font-weight:700; padding:0.12rem 0.45rem; border-radius:4px; margin:0 0.12rem 0.15rem 0; letter-spacing:0.03em; }
.axis-chip.axis-E { background:#fef3c7; color:#92400e; }
.axis-chip.axis-S { background:#fee2e2; color:#991b1b; }
.axis-chip.axis-F { background:#d1fae5; color:#065f46; }
.axis-chip.axis-none { background:var(--border-light); color:var(--text-muted); }
[data-theme="dark"] .axis-chip.axis-E { background:#78350f; color:#fcd34d; }
[data-theme="dark"] .axis-chip.axis-S { background:#7f1d1d; color:#fca5a5; }
[data-theme="dark"] .axis-chip.axis-F { background:#064e3b; color:#6ee7b7; }
.rec-badge { display:inline-block; font-size:0.65rem; font-weight:700; padding:0.15rem 0.5rem; border-radius:4px; background:#3b82f6; color:#fff; margin-left:0.4rem; vertical-align:2px; letter-spacing:0.05em; }
@media(max-width:600px) { .slide-pair{grid-template-columns:1fr} .hero{padding:3rem 1rem 2rem} .container{padding:1.5rem 1rem 3rem} h2{font-size:1.3rem} .flow-diagram{flex-direction:column} .flow-arrow{transform:rotate(90deg)} }
`;
}

// ─── Shared JS ───
function getSharedJS() {
  return `
function toggleTheme(){var h=document.documentElement,n=h.getAttribute('data-theme')==='dark'?'light':'dark';h.setAttribute('data-theme',n);document.getElementById('themeIcon').textContent=n==='dark'?'\\u2600\\uFE0F':'\\uD83C\\uDF19';localStorage.setItem('theme',n)}
(function(){var t=document.documentElement.getAttribute('data-theme');var i=document.getElementById('themeIcon');if(i)i.textContent=t==='dark'?'\\u2600\\uFE0F':'\\uD83C\\uDF19'})();
function showSection(id,btn){document.querySelectorAll('.section').forEach(function(s){s.classList.remove('active')});document.querySelectorAll('.nav-tab').forEach(function(t){t.classList.remove('active')});document.getElementById('sec-'+id).classList.add('active');btn.classList.add('active');window.scrollTo({top:0,behavior:'smooth'})}
function openLightbox(img){document.getElementById('lightboxImg').src=img.src;document.getElementById('lightbox').classList.add('open');document.body.style.overflow='hidden'}
function closeLightbox(){document.getElementById('lightbox').classList.remove('open');document.body.style.overflow=''}
document.addEventListener('keydown',function(e){if(e.key==='Escape')closeLightbox()});
window.addEventListener('scroll',function(){document.getElementById('scrollTop').classList.toggle('visible',window.scrollY>400)});
function openHashTarget(){if(!location.hash)return;var el=document.getElementById(location.hash.slice(1));if(!el)return;var p=el;while(p){if(p.tagName==='DETAILS')p.open=true;p=p.parentElement}setTimeout(function(){el.scrollIntoView({behavior:'smooth',block:'start'})},30)}
window.addEventListener('hashchange',openHashTarget);
window.addEventListener('load',openHashTarget);
document.addEventListener('click',function(e){var a=e.target.closest('a[href^="#"]');if(a){setTimeout(openHashTarget,0)}});
`;
}

// ─── Page Wrapper ───
function pageWrapper({ title, icon, body }) {
  return `<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>${icon}</text></svg>">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet">
<script>(function(){try{var s=localStorage.getItem('theme');var d=window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.setAttribute('data-theme',s||(d?'dark':'light'));}catch(e){}})();</script>
<style>${getSharedCSS()}</style>
</head>
<body>
<button id="theme-toggle" class="theme-toggle" onclick="toggleTheme()" aria-label="Toggle dark mode"><span id="themeIcon">\uD83C\uDF19</span></button>
${body}
<div class="lightbox" id="lightbox" onclick="closeLightbox()"><img id="lightboxImg" src="" alt="Enlarged slide"></div>
<button class="scroll-top" id="scrollTop" onclick="window.scrollTo({top:0,behavior:'smooth'})">&uarr;</button>
<script>${getSharedJS()}</script>
</body>
</html>`;
}

// ═══════════════════════════════════════════════════
// LANDING PAGE
// ═══════════════════════════════════════════════════
function buildLanding() {
  return pageWrapper({
    title: "Research Hub",
    icon: "\uD83D\uDD2C",
    body: `
<div class="hero">
  <h1>Research Hub</h1>
  <p class="subtitle">Detailed syntheses of research talks, papers, and ideas in AI, design, and machine learning</p>
  <div class="meta"><span>Douglas McGowan</span><span>UC Berkeley</span><span>2025&ndash;2026</span></div>
  <a href="/sandbox" style="display:inline-block;margin-top:1.5rem;padding:0.5rem 1.25rem;border:1px solid rgba(255,255,255,0.3);border-radius:999px;color:rgba(255,255,255,0.8);text-decoration:none;font-size:0.8rem;font-weight:500;transition:all 0.2s;letter-spacing:0.03em;" onmouseover="this.style.borderColor='rgba(255,255,255,0.7)';this.style.color='#fff'" onmouseout="this.style.borderColor='rgba(255,255,255,0.3)';this.style.color='rgba(255,255,255,0.8)'">&#x1F9EA; Psych_Battery</a>
</div>
<div class="container">
  <div class="report-cards">
    <a href="/mccomb" class="report-card">
      <img src="/slides/v1/v1_0105s.png" alt="McComb talk slide">
      <div class="card-body">
        <h3>AI & the Battle for the Soul of Design</h3>
        <p>A synthesis of two talks by Chris McComb (Carnegie Mellon) on human-AI teaming in design &mdash; cognitive biases, teaming experiments, lattice optimization, and the futures of human design work.</p>
        <div class="tags" style="margin-bottom:0.75rem">
          <span class="tag">Human-AI Teaming</span>
          <span class="tag">Engineering Design</span>
          <span class="tag">Cognitive Science</span>
        </div>
        <div class="card-meta">CDFAM NYC 2025 &middot; 2 talks &middot; 19 min + 50 min</div>
      </div>
    </a>
    <a href="/horwitz" class="report-card">
      <div style="width:100%;height:200px;background:linear-gradient(135deg,#0f172a,#1e3a5f,#312e81);display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Playfair Display',serif;font-size:1.3rem;padding:1.5rem;text-align:center;">Eliahu Horwitz</div>
      <div class="card-body">
        <h3>Weight Space Learning: Treating Neural Networks as Data</h3>
        <p>Four recent papers by Eliahu Horwitz (Hebrew University) on model genealogy, weight-space probing, model atlas construction, and extreme dataset distillation.</p>
        <div class="tags" style="margin-bottom:0.75rem">
          <span class="tag">Weight Space Learning</span>
          <span class="tag">Model Forensics</span>
          <span class="tag">Dataset Distillation</span>
        </div>
        <div class="card-meta">NeurIPS 2025 &middot; CVPR 2025 &middot; ICLR 2025 &middot; TMLR 2025</div>
      </div>
    </a>
    <a href="/ahmed" class="report-card">
      <div style="width:100%;height:200px;background:linear-gradient(135deg,#1a0a2e,#2d1b69,#0f3460);display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Playfair Display',serif;font-size:1.3rem;padding:1.5rem;text-align:center;">Faez Ahmed</div>
      <div class="card-body">
        <h3>AI-Driven Engineering Design at Scale</h3>
        <p>Five recent papers from MIT's DeCoDe Lab on topology optimization foundation models, image-to-CAD generation, automotive aerodynamics, video-based CAD learning, and multi-agent design systems.</p>
        <div class="tags" style="margin-bottom:0.75rem">
          <span class="tag">Topology Optimization</span>
          <span class="tag">CAD Generation</span>
          <span class="tag">Computational Design</span>
        </div>
        <div class="card-meta">NeurIPS 2024-2025 &middot; TMLR 2025 &middot; IDETC 2025</div>
      </div>
    </a>
  </div>
</div>
`,
  });
}

// ═══════════════════════════════════════════════════
// McCOMB PAGE
// ═══════════════════════════════════════════════════
function buildMcComb() {
  return pageWrapper({
    title: "McComb: AI & the Soul of Design",
    icon: "\uD83E\uDDE0",
    body: `
<div class="editorial">
<style>
.editorial{--paper:#FBF8F1;--ink:#1C1712;--ink-soft:#4a3f33;--rule:#d8cfbd;--accent-ed:#A62B1F;--accent-ed-soft:#c6584e;background:var(--paper);color:var(--ink);font-family:'Source Serif 4','Source Serif Pro',Georgia,serif;line-height:1.7;position:relative;min-height:100vh;}
[data-theme="dark"] .editorial{--paper:#1a1510;--ink:#f1ead8;--ink-soft:#b8ac93;--rule:#3a3126;--accent-ed:#d96e60;--accent-ed-soft:#e08a7e;}
.editorial *{color:inherit;}
.editorial .grain{position:fixed;inset:0;pointer-events:none;z-index:1;opacity:0.35;mix-blend-mode:multiply;background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.1 0 0 0 0 0.09 0 0 0 0 0.07 0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");}
[data-theme="dark"] .editorial .grain{mix-blend-mode:screen;opacity:0.15;}
.editorial .ed-wrap{position:relative;z-index:2;max-width:720px;margin:0 auto;padding:3.5rem 1.75rem 5rem;}
.editorial .ed-back{display:inline-block;font-family:'JetBrains Mono','IBM Plex Mono',ui-monospace,monospace;font-size:0.72rem;letter-spacing:0.14em;text-transform:uppercase;color:var(--ink-soft);text-decoration:none;margin-bottom:2.5rem;border-bottom:1px solid transparent;transition:border-color 0.2s,color 0.2s;}
.editorial .ed-back:hover{color:var(--accent-ed);border-bottom-color:var(--accent-ed);}
.editorial .masthead{border-top:3px double var(--ink);border-bottom:1px solid var(--rule);padding:1.75rem 0 2.25rem;margin-bottom:3rem;}
.editorial .folio{font-family:'JetBrains Mono','IBM Plex Mono',ui-monospace,monospace;font-size:0.72rem;letter-spacing:0.2em;text-transform:uppercase;color:var(--ink-soft);margin-bottom:1.5rem;display:flex;justify-content:space-between;flex-wrap:wrap;gap:0.5rem;}
.editorial .folio .folio-dot{color:var(--accent-ed);margin:0 0.6em;}
.editorial .ed-title{font-family:'Source Serif 4','Source Serif Pro',Georgia,serif;font-style:italic;font-weight:400;font-size:clamp(2.2rem,5.8vw,3.6rem);line-height:1.08;letter-spacing:-0.015em;margin:0 0 1.25rem;color:var(--ink);}
.editorial .ed-dek{font-family:'Source Serif 4','Source Serif Pro',Georgia,serif;font-size:1.15rem;line-height:1.55;color:var(--ink-soft);font-weight:400;margin:0 0 1.5rem;max-width:58ch;}
.editorial .ed-byline{font-family:'JetBrains Mono','IBM Plex Mono',ui-monospace,monospace;font-size:0.72rem;letter-spacing:0.14em;text-transform:uppercase;color:var(--ink-soft);}
.editorial .ed-byline .byline-sep{margin:0 0.55em;color:var(--accent-ed);}
.editorial .section-mark{display:flex;align-items:baseline;gap:1rem;margin:4rem 0 1.25rem;padding-top:2rem;border-top:1px solid var(--rule);}
.editorial .section-num{display:inline-block;font-family:'JetBrains Mono','IBM Plex Mono',ui-monospace,monospace;font-size:0.7rem;letter-spacing:0.18em;text-transform:uppercase;color:var(--accent-ed);border:1px solid var(--accent-ed);padding:0.2rem 0.55rem;border-radius:2px;flex-shrink:0;font-weight:600;}
.editorial .section-title{font-family:'Source Serif 4','Source Serif Pro',Georgia,serif;font-style:italic;font-weight:400;font-size:clamp(1.6rem,3.5vw,2.15rem);line-height:1.2;margin:0;letter-spacing:-0.01em;color:var(--ink);}
.editorial h3.ed-h3{font-family:'Source Serif 4','Source Serif Pro',Georgia,serif;font-style:italic;font-weight:400;font-size:1.35rem;margin:2.5rem 0 0.75rem;letter-spacing:-0.005em;color:var(--ink);}
.editorial h4.ed-h4{font-family:'JetBrains Mono','IBM Plex Mono',ui-monospace,monospace;font-size:0.72rem;letter-spacing:0.14em;text-transform:uppercase;color:var(--accent-ed);margin:2rem 0 0.5rem;font-weight:600;}
.editorial p{font-size:1.08rem;line-height:1.75;margin:0 0 1.2rem;color:var(--ink);font-family:'Source Serif 4','Source Serif Pro',Georgia,serif;}
.editorial p.lede{font-size:1.12rem;}
.editorial p.lede::first-letter{font-family:'Source Serif 4','Source Serif Pro',Georgia,serif;font-weight:700;font-size:4.4rem;line-height:0.9;float:left;padding:0.35rem 0.6rem 0 0;margin:0.15rem 0.1rem 0 0;color:var(--accent-ed);font-style:normal;}
.editorial strong{font-weight:600;color:var(--ink);}
.editorial em{font-style:italic;}
.editorial a.ed-link{color:var(--accent-ed);text-decoration:none;border-bottom:1px solid var(--accent-ed-soft);transition:border-color 0.15s,color 0.15s;}
.editorial a.ed-link:hover{color:var(--ink);border-bottom-color:var(--ink);}
.editorial a.cite{display:inline-block;font-family:'JetBrains Mono','IBM Plex Mono',ui-monospace,monospace;font-size:0.72em;vertical-align:super;line-height:1;color:var(--accent-ed);text-decoration:none;padding:0 0.1em;font-weight:600;position:relative;}
.editorial a.cite:hover{color:var(--ink);}
.editorial a.cite[data-tip]:hover::after{content:attr(data-tip);position:absolute;bottom:calc(100% + 6px);left:50%;transform:translateX(-50%);background:var(--ink);color:var(--paper);font-family:'JetBrains Mono','IBM Plex Mono',ui-monospace,monospace;font-size:0.7rem;line-height:1.35;padding:0.5rem 0.65rem;border-radius:3px;white-space:normal;width:max-content;max-width:260px;z-index:10;letter-spacing:0.02em;text-transform:none;font-weight:400;pointer-events:none;box-shadow:0 3px 8px rgba(0,0,0,0.18);}
.editorial .pull{border-left:3px solid var(--accent-ed);padding:0.5rem 0 0.5rem 1.5rem;margin:2.5rem 0;}
.editorial .pull p{font-family:'Source Serif 4','Source Serif Pro',Georgia,serif;font-style:italic;font-size:1.35rem;line-height:1.45;color:var(--ink);margin:0;}
.editorial .meta-label{font-family:'JetBrains Mono','IBM Plex Mono',ui-monospace,monospace;font-size:0.68rem;letter-spacing:0.16em;text-transform:uppercase;color:var(--accent-ed);font-weight:600;display:block;margin-bottom:0.35rem;}
.editorial .ed-fig{margin:2rem 0;}
.editorial .ed-fig img{width:100%;height:auto;display:block;border:1px solid var(--rule);cursor:zoom-in;background:var(--paper);}
.editorial .ed-fig figcaption{font-family:'JetBrains Mono','IBM Plex Mono',ui-monospace,monospace;font-size:0.72rem;line-height:1.55;color:var(--ink-soft);margin-top:0.6rem;letter-spacing:0.02em;padding-left:0.1rem;}
.editorial .ed-fig figcaption strong{font-weight:700;color:var(--accent-ed);letter-spacing:0.08em;text-transform:uppercase;font-size:0.7rem;display:inline-block;margin-right:0.4em;}
.editorial .ed-pair{display:grid;grid-template-columns:1fr 1fr;gap:1.25rem;margin:2rem 0;}
@media(max-width:640px){.editorial .ed-pair{grid-template-columns:1fr;}}
.editorial ol.findings-ed{list-style:none;counter-reset:findings;padding:0;margin:1.5rem 0 2rem;}
.editorial ol.findings-ed li{counter-increment:findings;position:relative;padding:0.85rem 0 0.85rem 3rem;border-bottom:1px solid var(--rule);font-size:1.05rem;line-height:1.65;}
.editorial ol.findings-ed li::before{content:counter(findings,decimal-leading-zero);position:absolute;left:0;top:0.95rem;font-family:'JetBrains Mono','IBM Plex Mono',ui-monospace,monospace;font-size:0.72rem;letter-spacing:0.1em;color:var(--accent-ed);font-weight:600;}
.editorial ol.findings-ed li:last-child{border-bottom:none;}
.editorial details.expandable{margin:3.5rem 0 1.5rem;border-top:2px solid var(--ink);padding-top:1.25rem;}
.editorial details.expandable summary{font-family:'JetBrains Mono','IBM Plex Mono',ui-monospace,monospace;font-size:0.8rem;letter-spacing:0.16em;text-transform:uppercase;color:var(--ink);cursor:pointer;list-style:none;display:flex;align-items:center;gap:0.6rem;font-weight:600;}
.editorial details.expandable summary::before{content:'+';font-family:'Source Serif 4',Georgia,serif;font-size:1.4rem;font-weight:400;color:var(--accent-ed);line-height:1;transition:transform 0.2s;}
.editorial details.expandable[open] summary::before{content:'\u2013';}
.editorial ol.reflist{list-style:none;counter-reset:refs;padding:0;margin:1.5rem 0 0;}
.editorial ol.reflist li{counter-increment:refs;position:relative;padding:0.75rem 0 0.75rem 2.5rem;font-family:'Source Serif 4','Source Serif Pro',Georgia,serif;font-size:0.95rem;line-height:1.55;color:var(--ink);border-bottom:1px solid var(--rule);scroll-margin-top:4rem;}
.editorial ol.reflist li::before{content:'[' counter(refs) ']';position:absolute;left:0;top:0.78rem;font-family:'JetBrains Mono','IBM Plex Mono',ui-monospace,monospace;font-size:0.7rem;letter-spacing:0.04em;color:var(--accent-ed);font-weight:600;}
.editorial ol.reflist li:last-child{border-bottom:none;}
.editorial ol.reflist li:target{background:rgba(166,43,31,0.07);padding-left:2.75rem;}
.editorial ol.reflist .ref-authors{color:var(--ink-soft);}
.editorial ol.reflist .ref-title{font-style:italic;}
.editorial ol.reflist .ref-venue{font-family:'JetBrains Mono','IBM Plex Mono',ui-monospace,monospace;font-size:0.78rem;color:var(--ink-soft);letter-spacing:0.02em;display:block;margin-top:0.2rem;}
.editorial ol.reflist a{color:var(--accent-ed);text-decoration:none;border-bottom:1px solid var(--accent-ed-soft);}
.editorial ol.reflist a:hover{color:var(--ink);border-bottom-color:var(--ink);}
.editorial .divider{text-align:center;font-family:'JetBrains Mono','IBM Plex Mono',ui-monospace,monospace;font-size:0.85rem;color:var(--rule);letter-spacing:0.6em;margin:3rem 0 2.5rem;padding-right:0;}
.editorial hr.rule{border:none;border-top:1px solid var(--rule);margin:2.5rem 0;}
.editorial table.comp-table{width:100%;border-collapse:collapse;font-size:0.92rem;margin:1.25rem 0 2rem;font-family:'Source Serif 4','Source Serif Pro',Georgia,serif;}
.editorial table.comp-table th,.editorial table.comp-table td{text-align:left;padding:0.65rem 0.75rem;border-bottom:1px solid var(--rule);vertical-align:top;}
.editorial table.comp-table thead th{font-family:'JetBrains Mono','IBM Plex Mono',ui-monospace,monospace;font-size:0.7rem;letter-spacing:0.12em;text-transform:uppercase;color:var(--accent-ed);font-weight:600;border-bottom:2px solid var(--ink);}
.editorial table.comp-table tbody th{font-family:'JetBrains Mono','IBM Plex Mono',ui-monospace,monospace;font-size:0.7rem;letter-spacing:0.08em;text-transform:uppercase;color:var(--ink-soft);font-weight:600;width:34%;}
</style>
<div class="grain"></div>
<div class="ed-wrap">
<a href="/" class="ed-back">&larr; Research Hub</a>

<header class="masthead">
  <div class="folio"><span>McComb<span class="folio-dot">&bull;</span>Research Note<span class="folio-dot">&bull;</span>Vol.&nbsp;I</span><span>April&nbsp;2026</span></div>
  <h1 class="ed-title">AI and the Battle for the Soul of Design</h1>
  <p class="ed-dek">A synthesis of two talks by Chris McComb on how human cognition, not capability curves, will shape the next generation of engineering design.</p>
  <div class="ed-byline">Douglas McGowan<span class="byline-sep">&#x2022;</span>UC Berkeley<span class="byline-sep">&#x2022;</span>Reading notes on CDFAM NYC 2025 and companion lecture</div>
</header>

<section>
<div class="section-mark"><span class="section-num">I</span><h2 class="section-title">The two talks</h2></div>
<p class="lede">This page synthesizes two versions of Chris McComb's talk <em>"AI and the Battle for the Soul of Design"</em> &mdash; a compact 19-minute keynote at CDFAM NYC 2025<a href="#ref-1" class="cite" data-tip="CDFAM NYC 2025 keynote, YouTube">[1]</a> and a comprehensive 50-minute lecture covering his lab's full research portfolio. Both explore how AI is transforming engineering design and what role humans will play in a world where machines can optimize, generate, and even coach.</p>
<p>McComb directs the <a href="https://cmudrc.github.io/" target="_blank" rel="noopener" class="ed-link">Design Research Collective</a><a href="#ref-2" class="cite" data-tip="Design Research Collective lab site">[2]</a> and the <a href="https://engineering.cmu.edu/human-ai-design/index.html" target="_blank" rel="noopener" class="ed-link">Human+AI Design Initiative</a><a href="#ref-3" class="cite" data-tip="Human+AI Design Initiative, CMU">[3]</a> at Carnegie Mellon<a href="#ref-4" class="cite" data-tip="Faculty page, CMU College of Engineering">[4]</a>. His work sits at an unusual intersection: he combines rigorous psychological science (empathy studies, cognitive style theory, collective intelligence) with AI methods (variational autoencoders, reinforcement learning, LLM-based coaching). The result is a research program that treats human-AI teaming not as a technology problem but as a <strong>sociotechnical design challenge</strong> &mdash; one where understanding human cognition is just as important as building better algorithms.</p>

<div class="ed-pair">
  <figure class="ed-fig"><img src="/slides/v1/v1_0005s.png" alt="Talk 1 title" onclick="openLightbox(this)"><figcaption><strong>Fig. 1</strong>CDFAM NYC 2025 (19 min). Conceptual overview: human biases, economic stakes, potential futures.</figcaption></figure>
  <figure class="ed-fig"><img src="/slides/v2/v2_0005s.png" alt="Talk 2 title" onclick="openLightbox(this)"><figcaption><strong>Fig. 2</strong>Full lecture (~50 min). Research deep dive: empathy, cognitive style, lattice optimization, teaming experiments, LLMs.</figcaption></figure>
</div>

<p><span class="meta-label">Central thesis</span>The argument threading both talks is deceptively simple but has deep implications: <strong>AI is changing exponentially, but humans are not.</strong> Our cognitive architecture &mdash; how we satisfice, how we copy neighbors, how we freeze under too many options &mdash; has been stable for millennia. McComb argues that this stability is not a limitation but a <em>predictive asset</em>. If we understand human nature well enough, we can anticipate how designers will actually use (and misuse) AI, and we can design human-AI workflows that play to human strengths rather than against them.</p>

<div class="pull"><p>The dominant tech narrative asks "how capable is the AI?" McComb asks instead: given what we know about human psychology, what will people actually do with these capabilities?</p></div>

<h3 class="ed-h3">Six takeaways</h3>
<ol class="findings-ed">
  <li><strong>The Human-AI Teaming Matrix</strong> organizes AI's role along two axes: Reactive vs. Proactive, and Problem-Focused vs. Process-Focused, yielding four modes &mdash; Tool, Partner, Analytics, Coach &mdash; with different implications for human agency.<a href="#ref-5" class="cite" data-tip="McComb, Boatwright &amp; Cagan, Proc. Design Society 2023">[5]</a></li>
  <li><strong>Technology changes exponentially; humans do not.</strong> Our stable psychology gives us predictive power over how AI adoption will unfold &mdash; and cognitive biases will persist no matter how good the tools get.</li>
  <li><strong>Five cognitive biases</strong> will shape human-AI design interaction: satisficing, automation bias, additive bias, herding, and choice overload. These aren't bugs to fix &mdash; they are stable features of human cognition AI designers must account for.</li>
  <li><strong>Individual traits don't predict team outcomes</strong> &mdash; but team-level composition does. Empathy diversity and cognitive style matching matter more than individual talent, and computational simulation can reveal optimal compositions human-subjects studies alone cannot.<a href="#ref-6" class="cite" data-tip="Alzayed et al., AI EDAM 2023">[6]</a></li>
  <li><strong>Hybrid teams perform as well as all-human teams</strong> in controlled experiments, and AI coaches intervene with similar patterns to human coaches.<a href="#ref-7" class="cite" data-tip="Xu et al., J. Mech. Design 2024">[7]</a> AI integration doesn't degrade team performance &mdash; but it doesn't automatically improve it either.</li>
  <li><strong>The "soul of design"</strong> is the parts that are most distinctly human: empathetic judgment, collaborative sense-making, meaning-creation, and the intrinsic satisfaction of creative work.</li>
</ol>
</section>

<section>
<div class="section-mark"><span class="section-num">II</span><h2 class="section-title">The keynote: an argument in three acts</h2></div>
<p>The shorter talk is a keynote for an industry audience at the CDFAM (Computational Design for AI-Driven Materials) symposium. It is structured as a conceptual argument rather than a research presentation &mdash; McComb is making a case for <em>how to think about</em> AI in design, not presenting experiments. The talk builds in three acts: the economic stakes, the human constants, and the possible futures.</p>

<h3 class="ed-h3">The teaming matrix</h3>
<p>McComb opens with his core conceptual tool: a 2&times;2 matrix that classifies AI's role in design teams, published as McComb, Boatwright and Cagan in <em>Proceedings of the Design Society</em>.<a href="#ref-5" class="cite" data-tip="Focus and Modality, Proc. Design Society 2023">[5]</a> The axes are <strong>Reactive vs. Proactive</strong> (does the AI wait to be asked, or does it initiate?) and <strong>Problem-Focused vs. Process-Focused</strong> (does the AI work on the design artifact, or on the design process itself?).</p>
<figure class="ed-fig"><img src="/slides/v1/v1_0105s.png" alt="Teaming Matrix" onclick="openLightbox(this)"><figcaption><strong>Fig. 3</strong>The Human-AI Teaming Matrix. Four quadrants: AI-as-Tool (reactive/problem), AI-as-Partner (proactive/problem), AI-as-Analytics (reactive/process), AI-as-Coach (proactive/process).</figcaption></figure>
<p>The matrix's value is diagnostic: it forces you to ask <em>which</em> kind of AI integration you're pursuing. Most current tools operate in the <strong>AI-as-Tool</strong> quadrant (reactive, problem-focused) &mdash; think CAD solvers or simulation software. The most transformative and least explored quadrant is <strong>AI-as-Coach</strong> (proactive, process-focused), where AI monitors how a team is working and intervenes to improve the process itself. McComb's later research explicitly targets this quadrant.</p>

<h3 class="ed-h3">The infrastructure stack</h3>
<p>McComb uses a McKinsey-sourced pyramid diagram to make an organizational readiness argument: AI value sits at the top of a stack that starts with data infrastructure. Organizations that jump to AI without the lower layers in place will fail.</p>
<figure class="ed-fig"><img src="/slides/v1/v1_0295s.png" alt="AI Stack" onclick="openLightbox(this)"><figcaption><strong>Fig. 4</strong>The AI infrastructure pyramid. Bottom to top: data generation and logging, infrastructure and storage, cleaning and preparation, analytics, machine learning, AI. Each layer requires the one below it.</figcaption></figure>
<p>The accompanying questions &mdash; "What are our initial conditions?", "What do we know about the dynamics?", "What outcomes are we likely to achieve?" &mdash; frame AI adoption as a systems problem. McComb is arguing that the AI capability frontier is less binding than the <em>organizational</em> readiness to use AI. The bottleneck isn't the algorithm; it's whether your data infrastructure can support it.</p>

<h3 class="ed-h3">Economic stakes</h3>
<p>McComb grounds the conceptual argument in hard numbers. The economic framing serves two purposes: it establishes urgency (this isn't hypothetical) and it reveals geographic inequality (the benefits are concentrated). The projection he cites is PwC's estimate that AI could contribute roughly $15.7 trillion to global GDP by 2030.<a href="#ref-8" class="cite" data-tip="PwC, Sizing the Prize, 2017">[8]</a></p>
<figure class="ed-fig"><img src="/slides/v1/v1_0345s.png" alt="GDP Impact" onclick="openLightbox(this)"><figcaption><strong>Fig. 5</strong>PwC projection: AI could contribute ~$15 trillion to global GDP by 2030. The dominant driver is labor productivity, followed by personalization, time savings, and quality improvements.</figcaption></figure>
<div class="ed-pair">
  <figure class="ed-fig"><img src="/slides/v1/v1_0365s.png" alt="Geographic impact" onclick="openLightbox(this)"><figcaption><strong>Fig. 6</strong>GDP impact concentrated in North America and China &mdash; raising questions about who benefits from AI-driven design.</figcaption></figure>
  <figure class="ed-fig"><img src="/slides/v1/v1_0405s.png" alt="Education impact" onclick="openLightbox(this)"><figcaption><strong>Fig. 7</strong>McKinsey: AI could free 20-30% of teacher time from administration and routine tasks, reallocating it toward coaching and skill development.<a href="#ref-9" class="cite" data-tip="McKinsey, 2020">[9]</a></figcaption></figure>
</div>
<p>The education slide is telling: it shows AI not just changing <em>what</em> we design but <em>how we learn to design</em>. If AI handles routine feedback and evaluation, educators can focus on the higher-order skills &mdash; coaching, mentorship, emotional development &mdash; that machines can't easily replicate. This theme returns later in the "LLMs as tutees" finding.</p>

<h3 class="ed-h3">The human constant</h3>
<p>This is the philosophical pivot of the talk, and McComb's most distinctive intellectual move. He juxtaposes two timelines: the exponential curve of technological change and the near-flat line of human biological change.</p>
<div class="ed-pair">
  <figure class="ed-fig"><img src="/slides/v1/v1_0565s.png" alt="Tech timeline" onclick="openLightbox(this)"><figcaption><strong>Fig. 8</strong>"Technology changes really, really fast." Exponential curve from 1800 to the present, with "Now" marked at the steep upswing.</figcaption></figure>
  <figure class="ed-fig"><img src="/slides/v1/v1_0605s.png" alt="Human height" onclick="openLightbox(this)"><figcaption><strong>Fig. 9</strong>"People change relatively slowly." Average male height by decade of birth, 1800-1990, across six countries. Modest changes over 190 years.</figcaption></figure>
</div>
<div class="pull"><p>Even as AI capabilities explode on an exponential curve, the humans using those tools are essentially the same creatures they were centuries ago.</p></div>
<p>Our cognitive biases, social tendencies, and psychological limitations are stable over timescales that make technology curves look vertical. McComb argues this stability is a <em>feature</em>, not a bug &mdash; it gives us predictive power. If we understand human nature, we can anticipate how people will actually interact with AI in design.</p>
</section>

<section>
<div class="section-mark"><span class="section-num">III</span><h2 class="section-title">Five biases that will not go away</h2></div>
<p>McComb's most original contribution in this talk. He enumerates five ways human nature will constrain and color how designers use AI, drawing on established behavioral science. Each bias is given an <em>implication for AI-assisted design</em>.</p>

<h4 class="ed-h4">01 / Satisficing &mdash; Simon, 1956</h4>
<figure class="ed-fig"><img src="/slides/v1/v1_0665s.png" alt="Satisficing" onclick="openLightbox(this)"><figcaption><strong>Fig. 10</strong>Value vs. Effort curve: humans stop at "Good Enough" rather than pursuing the theoretical optimum. The gap between good-enough and perfect is where effort explodes.</figcaption></figure>
<p>Herbert Simon<a href="#ref-10" class="cite" data-tip="Simon, Psychological Review, 1956">[10]</a> argued that organisms adapt well enough to satisfice; they do not, in general, optimize. The implication for AI: designers will accept outputs that clear the "good enough" bar, even when the AI could produce substantially better results with more iteration. This means the <strong>default quality of AI suggestions matters enormously</strong>, because most users won't push past the first acceptable output. AI tools that front-load quality will outperform those that require user refinement, regardless of their theoretical ceiling.</p>

<h4 class="ed-h4">02 / Automation bias</h4>
<figure class="ed-fig"><img src="/slides/v1/v1_0695s.png" alt="Automation bias" onclick="openLightbox(this)"><figcaption><strong>Fig. 11</strong>When AI is available, people default to using it &mdash; even when their own judgment would produce better results.</figcaption></figure>
<p>Well-documented in aviation and healthcare: when automated systems are present, humans defer to them even in situations where the automation is wrong or inappropriate. In design, this means teams with AI access may <strong>underuse their own expertise</strong>, defaulting to AI suggestions for problems where human intuition, context, or aesthetic judgment would be superior. The risk isn't that AI is bad &mdash; it's that humans stop exercising the judgment muscles that AI can't replace.</p>

<h4 class="ed-h4">03 / Additive bias &mdash; Adams et al., 2021</h4>
<figure class="ed-fig"><img src="/slides/v1/v1_0745s.png" alt="Additive bias" onclick="openLightbox(this)"><figcaption><strong>Fig. 12</strong>Both humans and AI tend to add features rather than remove them. Shown: a Lego construction and architectural blueprint illustrating additive complexity.</figcaption></figure>
<p>Adams, Converse, Hales and Klotz, writing in <em>Nature</em>,<a href="#ref-11" class="cite" data-tip="Adams et al., Nature, 2021">[11]</a> showed that when people improve objects, ideas, or situations, they systematically default to adding new elements rather than removing existing ones &mdash; even when subtraction is objectively better. McComb argues AI will <strong>amplify this bias</strong>: generative AI is inherently additive (it generates <em>more</em> options, <em>more</em> features, <em>more</em> complexity). Designers already struggle to simplify; AI-assisted design may produce ever-more-complex artifacts unless subtractive thinking is explicitly built into the workflow.</p>

<h4 class="ed-h4">04 / Herding</h4>
<figure class="ed-fig"><img src="/slides/v1/v1_0875s.png" alt="Herding" onclick="openLightbox(this)"><figcaption><strong>Fig. 13</strong>Penguins following each other off an ice shelf. Early adopters of AI in design will be copied regardless of whether their approach is optimal.</figcaption></figure>
<p>An information-cascade argument: once a few prominent firms or designers adopt a particular AI workflow, others will follow not because they've independently evaluated it but because they assume the early movers know something they don't. The result is <strong>path dependency</strong> &mdash; the field could lock into suboptimal AI integration patterns simply because they were adopted first. McComb is implicitly arguing that the current moment is critical: the design community's AI adoption patterns are being set <em>right now</em>, and herding effects mean those early patterns will be very hard to change later.</p>

<h4 class="ed-h4">05 / Choice overload &mdash; Hick (1952); Iyengar &amp; Lepper (2000)</h4>
<figure class="ed-fig"><img src="/slides/v1/v1_0895s.png" alt="Choice overload" onclick="openLightbox(this)"><figcaption><strong>Fig. 14</strong>A dense grid of drone/aerial vehicle configurations from the AeroSet dataset. AI dramatically expands the design space, but more options can mean worse decisions.</figcaption></figure>
<p>Generative AI can produce thousands of design candidates in minutes. But Hick's Law<a href="#ref-12" class="cite" data-tip="Hick, QJEP, 1952">[12]</a> tells us decision time increases logarithmically with the number of options, and Iyengar and Lepper's choice-overload studies<a href="#ref-13" class="cite" data-tip="Iyengar &amp; Lepper, JPSP, 2000">[13]</a> show that too many options can lead to decision paralysis, lower satisfaction, and worse outcomes. McComb's point: <strong>the ability to generate more options is only valuable if designers can effectively navigate and evaluate them.</strong> Without better curation and filtering tools, AI-generated abundance becomes a liability, not an asset.</p>
</section>

<section>
<div class="section-mark"><span class="section-num">IV</span><h2 class="section-title">Seven futures, ordered by preference</h2></div>
<p>McComb closes the keynote with a spectrum of possible futures, ordered from catastrophic to humanistic. The structure is deliberate &mdash; he's guiding the audience from the scenarios they fear to the ones he believes are worth pursuing. He presents these not as predictions but as <strong>possible equilibria</strong>: stable states that human-AI design practice could settle into.</p>
<div class="ed-pair">
  <figure class="ed-fig"><img src="/slides/v1/v1_0935s.png" alt="Future 1" onclick="openLightbox(this)"><figcaption><strong>Future 1</strong>p(doom) &rarr; 1. Humankind goes extinct. The existential-risk boundary condition.</figcaption></figure>
  <figure class="ed-fig"><img src="/slides/v1/v1_0965s.png" alt="Future 2" onclick="openLightbox(this)"><figcaption><strong>Future 2</strong>p(doom) &rarr; 0. We shut off the machines. Neo-Luddite rejection.</figcaption></figure>
</div>
<figure class="ed-fig"><img src="/slides/v1/v1_0985s.png" alt="Future 3" onclick="openLightbox(this)"><figcaption><strong>Future 3</strong>Cyborgs. Human-machine integration &mdash; McComb notes we're already partway there with smartphones and the internet.</figcaption></figure>
<div class="ed-pair">
  <figure class="ed-fig"><img src="/slides/v1/v1_1005s.png" alt="Future 4" onclick="openLightbox(this)"><figcaption><strong>Future 4</strong>Humans do the physical parts of design. AI handles cognition; humans become fabricators.</figcaption></figure>
  <figure class="ed-fig"><img src="/slides/v1/v1_1035s.png" alt="Future 5" onclick="openLightbox(this)"><figcaption><strong>Future 5</strong>Humans do the early stages. Problem framing and concept generation remain human; AI handles execution.</figcaption></figure>
</div>
<div class="ed-pair">
  <figure class="ed-fig"><img src="/slides/v1/v1_1065s.png" alt="Future 6" onclick="openLightbox(this)"><figcaption><strong>Future 6</strong>Humans do the parts of design we enjoy most. Value-aligned labor division.</figcaption></figure>
  <figure class="ed-fig"><img src="/slides/v1/v1_1095s.png" alt="Future 7" onclick="openLightbox(this)"><figcaption><strong>Future 7</strong>Humans do the most human parts of design. Empathy, meaning-making, collaborative judgment.</figcaption></figure>
</div>
<p>Futures 6 and 7 represent McComb's research vision: a world where AI handles the computationally intensive parts of design while humans retain what is most intrinsically meaningful &mdash; creative ideation, empathetic judgment, and the satisfaction of making things that matter. His entire research program (empathy studies, cognitive style, AI coaching) is oriented toward enabling these futures.</p>
</section>

<div class="divider">&sect; &sect; &sect;</div>

<section>
<div class="section-mark"><span class="section-num">V</span><h2 class="section-title">The lecture: evidence behind the argument</h2></div>
<p>The longer talk shares the same title and opening but diverges into deep research content. Where the keynote argues from psychology and economics, the lecture presents <strong>empirical evidence</strong> spanning five research threads. McComb structures it around a three-stage progression: understanding human designers, building AI-assisted tools, and achieving genuine human-AI collaboration.</p>
<figure class="ed-fig"><img src="/slides/v2/v2_0365s.png" alt="Progression" onclick="openLightbox(this)"><figcaption><strong>Fig. 15</strong>McComb's three-stage research arc: Human Designers &rarr; AI-Assisted Engineering Design &rarr; Human-AI Collaboration. Each stage builds on the insights of the previous one.</figcaption></figure>
<p>This structure is important epistemically: McComb is arguing that you can't build effective human-AI design tools without first understanding human designers on their own terms. The psychology comes <em>before</em> the engineering, not after. This is unusual in an engineering lab &mdash; most AI-for-design research starts with the algorithm and bolts on user studies later.</p>
</section>

<section>
<div class="section-mark"><span class="section-num">VI</span><h2 class="section-title">Empathy, inverted</h2></div>
<p>McComb presents a longitudinal study using Davis's multidimensional model of empathy,<a href="#ref-14" class="cite" data-tip="Davis, JSAS Catalog, 1980">[14]</a> which distinguishes four components: Personal Distress and Empathic Concern (affective), Fantasy and Perspective-Taking (cognitive), each oriented toward self or others.</p>
<figure class="ed-fig"><img src="/slides/v2/v2_0545s.png" alt="Empathy model" onclick="openLightbox(this)"><figcaption><strong>Fig. 16</strong>Davis (1980): Four components of empathy on two axes. Affective vs. Cognitive, Self-Oriented vs. Other-Oriented.</figcaption></figure>

<h4 class="ed-h4">The reversal</h4>
<p>The first finding is a null result &mdash; and in science, null results that challenge assumptions are often the most important.</p>
<figure class="ed-fig"><img src="/slides/v2/v2_0705s.png" alt="Individual null" onclick="openLightbox(this)"><figcaption><strong>Fig. 17</strong>Individual-level trait empathy does not predict concept generation outcomes. No significant relationship to creativity, usefulness, uniqueness, or elegance.<a href="#ref-15" class="cite" data-tip="Alzayed et al., J. Mech. Design, 2021">[15]</a></figcaption></figure>
<p>This is counterintuitive &mdash; design education often emphasizes empathy as a core skill. But McComb's group found that an individual's empathy score tells you nothing about the quality of their design concepts. The story changes dramatically when you look at teams. Using computational recombination &mdash; agent-based modeling that simulates how individuals would perform in different team compositions &mdash; they discovered the reversal:</p>
<figure class="ed-fig"><img src="/slides/v2/v2_0775s.png" alt="Team empathy" onclick="openLightbox(this)"><figcaption><strong>Fig. 18</strong>At the team level, empathy diversity and elevation do significantly predict creative outcomes. The effect is invisible at the individual level.<a href="#ref-6" class="cite" data-tip="Alzayed et al., AI EDAM, 2023">[6]</a></figcaption></figure>
<div class="pull"><p>Individual empathy doesn't help; team empathy composition does. Computational simulation can reveal effects that purely human-subjects studies miss.</p></div>
<p>The reversal has two implications. First, <strong>design is fundamentally a team activity</strong> &mdash; psychological constructs must be studied at the level they actually operate. Second, you can't randomly assign 200 teams of 5 people to different empathy compositions, but you can simulate it. This is a methodological argument for multi-method research that combines human data with agent-based modeling.</p>
</section>

<section>
<div class="section-mark"><span class="section-num">VII</span><h2 class="section-title">Cognitive style and team composition</h2></div>
<p>The second human-focused thread uses Kirton's Adaption-Innovation theory,<a href="#ref-16" class="cite" data-tip="Kirton, J. Applied Psychology, 1976">[16]</a> which places individuals on a spectrum from "More Adaptive" (prefer structure, doing things better within existing paradigms) to "More Innovative" (prefer less structure, doing things differently).</p>
<div class="ed-pair">
  <figure class="ed-fig"><img src="/slides/v2/v2_0945s.png" alt="KAI curve" onclick="openLightbox(this)"><figcaption><strong>Fig. 19</strong>KAI distribution: a bell curve from Adaptive to Innovative. Population mean ~95, range ~32-160. This is cognitive <em>style</em>, not ability.</figcaption></figure>
  <figure class="ed-fig"><img src="/slides/v2/v2_1175s.png" alt="Formula SAE" onclick="openLightbox(this)"><figcaption><strong>Fig. 20</strong>The Formula SAE system model &mdash; a complex engineered system with many interdependent subsystems used to test the KABOOM agent-based model.</figcaption></figure>
</div>
<figure class="ed-fig"><img src="/slides/v2/v2_1255s.png" alt="KABOOM results" onclick="openLightbox(this)"><figcaption><strong>Fig. 21</strong>KABOOM results: the optimal cognitive style depends on the subsystem. Rear suspension, engine, and impact attenuator each perform best with different cognitive style profiles.</figcaption></figure>
<p>The finding is directly actionable for engineering organizations: <strong>there is no universally optimal cognitive style for design teams.</strong> The right composition depends on the specific subsystem and problem type. Adaptive thinkers excel at well-structured optimization problems; innovative thinkers excel at open-ended, ambiguous challenges. And AI simulation (KABOOM) can identify the optimal match before you assemble a real team.</p>
<figure class="ed-fig"><img src="/slides/v2/v2_1385s.png" alt="FBS ontology" onclick="openLightbox(this)"><figcaption><strong>Fig. 22</strong>Function-Behaviour-Structure (FBS) ontology (Gero &amp; Kannengiesser):<a href="#ref-17" class="cite" data-tip="Gero &amp; Kannengiesser, 2014">[17]</a> a formal framework for analyzing design processes as transformations between Requirements, Function, expected Behaviour, actual Behaviour, and Structure.</figcaption></figure>
</section>

<section>
<div class="section-mark"><span class="section-num">VIII</span><h2 class="section-title">Lattices in a learned latent space</h2></div>
<p>The middle section of the lecture shifts from human psychology to AI capabilities. McComb presents his lab's work on lattice structure design &mdash; a problem in additive manufacturing where the geometry of internal lattice patterns determines the mechanical properties (stiffness, impact absorption, weight) of 3D-printed parts.</p>
<div class="ed-pair">
  <figure class="ed-fig"><img src="/slides/v2/v2_1515s.png" alt="Lattice types" onclick="openLightbox(this)"><figcaption><strong>Fig. 23</strong>Three lattice structure types: Uniform, Graded, and Graded Stranded. Energy absorption characteristics vary dramatically with geometry.</figcaption></figure>
  <figure class="ed-fig"><img src="/slides/v2/v2_1535s.png" alt="Multi-lattice" onclick="openLightbox(this)"><figcaption><strong>Fig. 24</strong>Multi-lattice design freedom: more diverse mechanical properties, better stiffness, ability to withstand higher loads.</figcaption></figure>
</div>

<h4 class="ed-h4">Variational autoencoders for lattice design</h4>
<figure class="ed-fig"><img src="/slides/v2/v2_1585s.png" alt="VAE" onclick="openLightbox(this)"><figcaption><strong>Fig. 25</strong>Variational Autoencoder architecture: Input &rarr; Encoder &rarr; Compressed Latent Representation &rarr; Decoder &rarr; Output.</figcaption></figure>
<p>McComb's group uses VAEs to learn a continuous latent space over lattice geometries. This transforms a discrete, combinatorial design space into a smooth one that can be navigated with gradient-based optimization.</p>
<div class="ed-pair">
  <figure class="ed-fig"><img src="/slides/v2/v2_1645s.png" alt="Interpolation" onclick="openLightbox(this)"><figcaption><strong>Fig. 26</strong>Interpolating in latent space generates aesthetically smooth transitions between lattice structures &mdash; navigating the design space by moving through learned representations.</figcaption></figure>
  <figure class="ed-fig"><img src="/slides/v2/v2_1675s.png" alt="Property-augmented" onclick="openLightbox(this)"><figcaption><strong>Fig. 27</strong>"Smooth Like Butter": appending stiffness tensors to the geometry embedding creates a property-aware latent space.<a href="#ref-18" class="cite" data-tip="Baldwin, Meisel &amp; McComb, 3D Printing &amp; AM, 2024">[18]</a></figcaption></figure>
</div>
<figure class="ed-fig"><img src="/slides/v2/v2_1715s.png" alt="Topology opt" onclick="openLightbox(this)"><figcaption><strong>Fig. 28</strong>Multi-lattice topology optimization using the learned embeddings. The workflow integrates compliance analysis, finite element methods, and lattice decoding.</figcaption></figure>

<h4 class="ed-h4">Reinforcement learning for design</h4>
<figure class="ed-fig"><img src="/slides/v2/v2_1805s.png" alt="RL" onclick="openLightbox(this)"><figcaption><strong>Fig. 29</strong>RL agents find high-performance design solutions at dramatically reduced computational cost. R&sup2; = 0.911 for the performance-time trade-off curve.<a href="#ref-19" class="cite" data-tip="Agrawal &amp; McComb, JCISE, 2023">[19]</a></figcaption></figure>
<p>The RL result is practically significant: it means AI can <strong>explore large design spaces cheaply enough to be useful in real engineering workflows</strong>, not just in academic benchmarks. The computational cost reduction makes AI-assisted lattice design viable for production settings.</p>
</section>

<section>
<div class="section-mark"><span class="section-num">IX</span><h2 class="section-title">Teaming experiments</h2></div>
<p>The final and most substantial section presents controlled experiments on human-AI collaboration using HyForm, an instrumented platform that captures every design action, chat message, and decision made by team members.</p>
<figure class="ed-fig"><img src="/slides/v2/v2_1825s.png" alt="Matrix revisited" onclick="openLightbox(this)"><figcaption><strong>Fig. 30</strong>The Human-AI Teaming Matrix revisited in the context of experimental results.</figcaption></figure>

<h4 class="ed-h4">Hybrid vs. human teams</h4>
<div class="ed-pair">
  <figure class="ed-fig"><img src="/slides/v2/v2_2055s.png" alt="Team structure" onclick="openLightbox(this)"><figcaption><strong>Fig. 31</strong>Experimental team structure with Design Specialists, Operations Specialists, and Problem Manager, with controlled communication channels.</figcaption></figure>
  <figure class="ed-fig"><img src="/slides/v2/v2_2165s.png" alt="Results" onclick="openLightbox(this)"><figcaption><strong>Fig. 32</strong>Hybrid and human teams perform equally well. Box plots show no statistically significant difference in team profit (Wilcoxon p = 0.32, 0.88).<a href="#ref-7" class="cite" data-tip="Xu et al., J. Mech. Design, 2024">[7]</a></figcaption></figure>
</div>
<p>The null result here is important: <strong>adding an AI team member neither improved nor degraded team performance.</strong> It means AI integration in design teams is viable (it doesn't break things), but the value of AI in teaming contexts depends on <em>how</em> it's integrated, not just <em>whether</em> it's present. The shocks (sudden rule changes mid-experiment) revealed that teams adapt similarly regardless of human or hybrid composition.</p>

<h4 class="ed-h4">AI-as-coach</h4>
<div class="ed-pair">
  <figure class="ed-fig"><img src="/slides/v2/v2_2375s.png" alt="AI coach" onclick="openLightbox(this)"><figcaption><strong>Fig. 33</strong>AI coaching experiment: an AI process manager monitors team dynamics and intervenes to improve collaboration.</figcaption></figure>
  <figure class="ed-fig"><img src="/slides/v2/v2_2495s.png" alt="Intervention types" onclick="openLightbox(this)"><figcaption><strong>Fig. 34</strong>Human and AI coaches show similar distributions across intervention types: Advise, Inform, Coordinate, Communicate.<a href="#ref-20" class="cite" data-tip="Gyory, Soria Zurita et al., J. Mech. Design, 2022">[20]</a></figcaption></figure>
</div>
<p>This is the AI-as-Coach quadrant of the teaming matrix in action. The finding that AI coaches <strong>naturally converge on similar intervention patterns</strong> to human coaches is striking &mdash; it suggests that effective process management in design may follow relatively universal patterns AI can learn, regardless of whether it was explicitly programmed to mimic human coaching behavior.</p>
</section>

<section>
<div class="section-mark"><span class="section-num">X</span><h2 class="section-title">Collective intelligence and LLMs</h2></div>
<div class="ed-pair">
  <figure class="ed-fig"><img src="/slides/v2/v2_2535s.png" alt="CI regression" onclick="openLightbox(this)"><figcaption><strong>Fig. 35</strong>Quantifying collective intelligence: regression coefficients for Process, Skill, Group Size, Social Perceptions, and Composition.<a href="#ref-21" class="cite" data-tip="Riedl et al., PNAS, 2021">[21]</a></figcaption></figure>
  <figure class="ed-fig"><img src="/slides/v2/v2_2645s.png" alt="CI constructs" onclick="openLightbox(this)"><figcaption><strong>Fig. 36</strong>Three key constructs for collective intelligence: Social Sensitivity, Coordinated Attention, Equal Participation.</figcaption></figure>
</div>
<p>McComb grounds his AI facilitation work in collective intelligence theory rather than task-specific training data. The three constructs &mdash; Social Sensitivity, Coordinated Attention, Equal Participation &mdash; provide a <strong>domain-general framework</strong> for AI coaching. The AI coach can generalize to novel design problems it has never seen, rather than being limited to problems similar to its training set.</p>

<h4 class="ed-h4">LLMs as tutees, not tutors</h4>
<figure class="ed-fig"><img src="/slides/v2/v2_2745s.png" alt="LLMs tutees" onclick="openLightbox(this)"><figcaption><strong>Fig. 37</strong>LLMs as tutees boost student mastery. Students who taught the LLM scored significantly higher on concept inventories than the control group.</figcaption></figure>
<div class="pull"><p>The dominant framing is "AI as tutor." McComb's group flipped it: students <em>teach</em> the LLM, and the learning-by-teaching effect transfers.</p></div>
<p>The "learning by teaching" effect &mdash; well-documented in human education &mdash; transferred to AI interactions. Students who explained concepts to the LLM understood the material better than those in the control condition. This suggests the most valuable educational use of LLMs may be the opposite of what most people assume.</p>
</section>

<div class="divider">&sect; &sect; &sect;</div>

<section>
<div class="section-mark"><span class="section-num">XI</span><h2 class="section-title">Two versions, one vision</h2></div>
<p>The two talks share a title and core thesis but serve different purposes and audiences. Understanding their differences reveals how McComb adapts a complex research program for different contexts.</p>

<table class="comp-table">
<thead><tr><th></th><th>Keynote (19&nbsp;min)</th><th>Lecture (50&nbsp;min)</th></tr></thead>
<tbody>
<tr><th>Audience</th><td>Industry practitioners</td><td>Academic / research</td></tr>
<tr><th>Epistemic mode</th><td>Argument from theory &amp; analogy</td><td>Argument from empirical evidence</td></tr>
<tr><th>Focus</th><td>Cognitive biases, economic stakes, futures</td><td>Lab research: empathy, KAI, VAEs, teaming</td></tr>
<tr><th>Technical depth</th><td>Low &mdash; conceptual framing</td><td>High &mdash; architectures, statistics, equations</td></tr>
<tr><th>Human biases</th><td>Five biases (core section)</td><td>Not present</td></tr>
<tr><th>Empathy research</th><td>Not covered</td><td>Deep dive: individual vs. team reversal</td></tr>
<tr><th>Lattice / VAE work</th><td>Not covered</td><td>Full: VAEs, latent interpolation, topology opt.</td></tr>
<tr><th>Teaming experiments</th><td>Matrix framework only</td><td>HyForm, hybrid teams, AI coaching</td></tr>
<tr><th>Potential futures</th><td>Seven (incl. cyborgs)</td><td>Six (slightly compressed)</td></tr>
</tbody>
</table>
<p>The keynote provides the <strong>philosophical argument</strong> and psychological grounding for <em>why</em> human-AI teaming matters. The lecture provides the <strong>empirical evidence</strong> and technical methods for <em>how</em> McComb's lab is investigating it. Together they form a complete picture: the conceptual framework and the research that fills it in. The split reveals something about McComb's intellectual strategy: he doesn't present the same talk at different lengths. He genuinely adapts the <em>type</em> of argument to the audience.</p>
</section>

<section>
<div class="section-mark"><span class="section-num">XII</span><h2 class="section-title">What this means for practitioners</h2></div>
<figure class="ed-fig"><img src="/slides/v2/v2_2755s.png" alt="Provocation" onclick="openLightbox(this)"><figcaption><strong>Fig. 38</strong>"In a future where computers will be able to do all this and even more, what will be left for human designers?"</figcaption></figure>
<div class="ed-pair">
  <figure class="ed-fig"><img src="/slides/v2/v2_2925s.png" alt="Enjoy" onclick="openLightbox(this)"><figcaption><strong>Future 6</strong>Value-aligned labor division &mdash; humans keep the parts of design that bring satisfaction and meaning.</figcaption></figure>
  <figure class="ed-fig"><img src="/slides/v2/v2_2955s.png" alt="Most human" onclick="openLightbox(this)"><figcaption><strong>Future 7</strong>Design as an expression of empathy, judgment, and collaborative sense-making.</figcaption></figure>
</div>
<p>Futures 6 and 7 represent McComb's preferred vision, and his research is explicitly building toward them. The empathy studies, cognitive style work, collective intelligence constructs, and AI coaching experiments are all aimed at understanding which parts of design are most distinctly human &mdash; and ensuring those parts remain in human hands not by default, but <strong>by design</strong>.</p>
<ol class="findings-ed">
  <li><strong>Don't assume AI replaces designers.</strong> The evidence shows hybrid teams perform comparably to all-human teams. The challenge isn't displacement but integration.</li>
  <li><strong>Invest in team composition, not just tools.</strong> Empathy diversity and cognitive style matching matter more than individual skill or tool sophistication.</li>
  <li><strong>Watch for biases.</strong> Satisficing, automation bias, herding, and choice overload will shape your organization's AI adoption &mdash; designing against these tendencies is as important as choosing the right tools.</li>
  <li><strong>Ground AI in theory, not just data.</strong> AI systems built on psychological constructs generalize better than those trained on task-specific data alone.</li>
  <li><strong>The "soul" is relational.</strong> What makes design human isn't any single capability &mdash; it's empathy, collaboration, judgment under ambiguity, and meaning-making.</li>
</ol>
</section>

<details class="expandable">
<summary>References</summary>
<ol class="reflist">
  <li id="ref-1"><span class="ref-authors">McComb, C.</span> <span class="ref-title">AI and the Battle for the Soul of Design.</span> <span class="ref-venue">CDFAM NYC 2025 keynote (video).</span> <a href="https://www.youtube.com/watch?v=hyu1AuSeIDA" target="_blank" rel="noopener">youtube.com/watch?v=hyu1AuSeIDA</a></li>
  <li id="ref-2"><span class="ref-authors">Design Research Collective.</span> <span class="ref-title">Lab website, Carnegie Mellon University.</span> <a href="https://cmudrc.github.io/" target="_blank" rel="noopener">cmudrc.github.io</a></li>
  <li id="ref-3"><span class="ref-authors">Human+AI Design Initiative.</span> <span class="ref-title">Initiative website, Carnegie Mellon University.</span> <a href="https://engineering.cmu.edu/human-ai-design/index.html" target="_blank" rel="noopener">engineering.cmu.edu/human-ai-design</a></li>
  <li id="ref-4"><span class="ref-authors">McComb, C.</span> <span class="ref-title">Faculty profile.</span> <span class="ref-venue">CMU College of Engineering.</span> <a href="https://engineering.cmu.edu/directory/bios/mccomb-christopher.html" target="_blank" rel="noopener">engineering.cmu.edu/&hellip;/mccomb-christopher</a></li>
  <li id="ref-5"><span class="ref-authors">McComb, C., Boatwright, P., &amp; Cagan, J.</span> <span class="ref-title">Focus and Modality: Defining a Roadmap to Future AI-Human Teaming in Design.</span> <span class="ref-venue">Proceedings of the Design Society 3, 1905-1914 (2023).</span> <a href="https://doi.org/10.1017/pds.2023.191" target="_blank" rel="noopener">doi.org/10.1017/pds.2023.191</a></li>
  <li id="ref-6"><span class="ref-authors">Alzayed, M. A., Miller, S. R., Menold, J., Huff, J., &amp; McComb, C.</span> <span class="ref-title">Does empathy lead to creativity? A simulation-based investigation on the role of team trait empathy on nominal group concept generation and early concept screening.</span> <span class="ref-venue">AI EDAM 37 (2023).</span> <a href="https://doi.org/10.1017/S089006042300001X" target="_blank" rel="noopener">doi.org/10.1017/S089006042300001X</a></li>
  <li id="ref-7"><span class="ref-authors">Xu, Z., Hong, C. S., Soria Zurita, N. F., Gyory, J. T., Stump, G., Nolte, H., Cagan, J., &amp; McComb, C.</span> <span class="ref-title">Adaptation Through Communication: Assessing Human-Artificial Intelligence Partnership for the Design of Complex Engineering Systems.</span> <span class="ref-venue">Journal of Mechanical Design 146(8), 081401 (2024).</span> <a href="https://doi.org/10.1115/1.4064490" target="_blank" rel="noopener">asmedigitalcollection.asme.org</a></li>
  <li id="ref-8"><span class="ref-authors">PwC.</span> <span class="ref-title">Sizing the Prize: What's the real value of AI for your business and how can you capitalise?</span> <span class="ref-venue">PwC Global AI Study (2017).</span> <a href="https://www.pwc.com/gx/en/issues/artificial-intelligence/publications/artificial-intelligence-study.html" target="_blank" rel="noopener">pwc.com/&hellip;/artificial-intelligence-study</a></li>
  <li id="ref-9"><span class="ref-authors">Bryant, J., Heitz, C., Sanghvi, S., &amp; Wagle, D.</span> <span class="ref-title">How artificial intelligence will impact K-12 teachers.</span> <span class="ref-venue">McKinsey &amp; Company (14 January 2020).</span> <a href="https://www.mckinsey.com/industries/education/our-insights/how-artificial-intelligence-will-impact-k-12-teachers" target="_blank" rel="noopener">mckinsey.com/&hellip;/k-12-teachers</a></li>
  <li id="ref-10"><span class="ref-authors">Simon, H. A.</span> <span class="ref-title">Rational choice and the structure of the environment.</span> <span class="ref-venue">Psychological Review 63(2), 129-138 (1956).</span> <a href="https://doi.org/10.1037/h0042769" target="_blank" rel="noopener">doi.org/10.1037/h0042769</a></li>
  <li id="ref-11"><span class="ref-authors">Adams, G. S., Converse, B. A., Hales, A. H., &amp; Klotz, L. E.</span> <span class="ref-title">People systematically overlook subtractive changes.</span> <span class="ref-venue">Nature 592, 258-261 (2021).</span> <a href="https://doi.org/10.1038/s41586-021-03380-y" target="_blank" rel="noopener">doi.org/10.1038/s41586-021-03380-y</a></li>
  <li id="ref-12"><span class="ref-authors">Hick, W. E.</span> <span class="ref-title">On the rate of gain of information.</span> <span class="ref-venue">Quarterly Journal of Experimental Psychology 4(1), 11-26 (1952).</span> <a href="https://doi.org/10.1080/17470215208416600" target="_blank" rel="noopener">doi.org/10.1080/17470215208416600</a></li>
  <li id="ref-13"><span class="ref-authors">Iyengar, S. S., &amp; Lepper, M. R.</span> <span class="ref-title">When choice is demotivating: Can one desire too much of a good thing?</span> <span class="ref-venue">Journal of Personality and Social Psychology 79(6), 995-1006 (2000).</span> <a href="https://doi.org/10.1037/0022-3514.79.6.995" target="_blank" rel="noopener">doi.org/10.1037/0022-3514.79.6.995</a></li>
  <li id="ref-14"><span class="ref-authors">Davis, M. H.</span> <span class="ref-title">A multidimensional approach to individual differences in empathy.</span> <span class="ref-venue">JSAS Catalog of Selected Documents in Psychology 10, 85 (1980).</span> <a href="https://www.uv.es/friasnav/Davis_1980.pdf" target="_blank" rel="noopener">uv.es/friasnav/Davis_1980.pdf</a></li>
  <li id="ref-15"><span class="ref-authors">Alzayed, M. A., McComb, C., Menold, J., Huff, J., &amp; Miller, S. R.</span> <span class="ref-title">Are You Feeling Me? An Exploration of Empathy Development in Engineering Design Education.</span> <span class="ref-venue">Journal of Mechanical Design 143(11), 112301 (2021).</span> <a href="https://doi.org/10.1115/1.4048624" target="_blank" rel="noopener">doi.org/10.1115/1.4048624</a></li>
  <li id="ref-16"><span class="ref-authors">Kirton, M. J.</span> <span class="ref-title">Adaptors and innovators: A description and a measure.</span> <span class="ref-venue">Journal of Applied Psychology 61(5), 622-629 (1976).</span> <a href="https://doi.org/10.1037/0021-9010.61.5.622" target="_blank" rel="noopener">doi.org/10.1037/0021-9010.61.5.622</a></li>
  <li id="ref-17"><span class="ref-authors">Gero, J. S., &amp; Kannengiesser, U.</span> <span class="ref-title">The Function-Behaviour-Structure Ontology of Design.</span> <span class="ref-venue">In An Anthology of Theories and Models of Design 263-283 (Springer, 2014).</span> <a href="https://doi.org/10.1007/978-1-4471-6338-1_13" target="_blank" rel="noopener">doi.org/10.1007/978-1-4471-6338-1_13</a></li>
  <li id="ref-18"><span class="ref-authors">Baldwin, M., Meisel, N. A., &amp; McComb, C.</span> <span class="ref-title">Smooth Like Butter: Evaluating Multi-Lattice Transitions in Property-Augmented Latent Spaces.</span> <span class="ref-venue">3D Printing and Additive Manufacturing (2024).</span> <a href="https://doi.org/10.1089/3dp.2023.0316" target="_blank" rel="noopener">doi.org/10.1089/3dp.2023.0316</a> &middot; <a href="https://arxiv.org/abs/2407.08074" target="_blank" rel="noopener">arXiv:2407.08074</a></li>
  <li id="ref-19"><span class="ref-authors">Agrawal, A., &amp; McComb, C.</span> <span class="ref-title">Reinforcement Learning for Efficient Design Space Exploration With Variable Fidelity Analysis Models.</span> <span class="ref-venue">Journal of Computing and Information Science in Engineering 23(4), 041004 (2023).</span> <a href="https://doi.org/10.1115/1.4056297" target="_blank" rel="noopener">doi.org/10.1115/1.4056297</a></li>
  <li id="ref-20"><span class="ref-authors">Gyory, J. T., Kotovsky, K., McComb, C., &amp; Cagan, J.</span> <span class="ref-title">Comparing the Impacts on Team Behaviors Between Artificial Intelligence and Human Process Management in Interdisciplinary Design Teams.</span> <span class="ref-venue">Journal of Mechanical Design 144(10), 104501 (2022).</span> <a href="https://doi.org/10.1115/1.4054723" target="_blank" rel="noopener">doi.org/10.1115/1.4054723</a></li>
  <li id="ref-21"><span class="ref-authors">Riedl, C., Kim, Y. J., Gupta, P., Malone, T. W., &amp; Woolley, A. W.</span> <span class="ref-title">Quantifying collective intelligence in human groups.</span> <span class="ref-venue">Proceedings of the National Academy of Sciences 118(21), e2005737118 (2021).</span> <a href="https://doi.org/10.1073/pnas.2005737118" target="_blank" rel="noopener">doi.org/10.1073/pnas.2005737118</a></li>
</ol>
</details>

</div>
</div>
`,
  });
}

// ═══════════════════════════════════════════════════
// HORWITZ PAGE
// ═══════════════════════════════════════════════════
function buildHorwitz() {
  return pageWrapper({
    title: "Eliahu Horwitz: Weight Space Learning",
    icon: "\uD83E\uDDE0",
    body: `
<div class="editorial">
<style>
.editorial{--paper:#FBF8F1;--ink:#1C1712;--ink-soft:#4a3f33;--rule:#d8cfbd;--accent-ed:#1F4E8C;--accent-ed-soft:#5d84b5;background:var(--paper);color:var(--ink);font-family:'Source Serif 4','Source Serif Pro',Georgia,serif;line-height:1.7;position:relative;min-height:100vh;}
[data-theme="dark"] .editorial{--paper:#10141a;--ink:#e8edf5;--ink-soft:#a4b0c5;--rule:#2a3545;--accent-ed:#7fa8d9;--accent-ed-soft:#9dbee3;}
.editorial *{color:inherit;}
.editorial .grain{position:fixed;inset:0;pointer-events:none;z-index:1;opacity:0.32;mix-blend-mode:multiply;background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.08 0 0 0 0 0.08 0 0 0 0 0.09 0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");}
[data-theme="dark"] .editorial .grain{mix-blend-mode:screen;opacity:0.12;}
.editorial .ed-wrap{position:relative;z-index:2;max-width:720px;margin:0 auto;padding:3.5rem 1.75rem 5rem;}
.editorial .ed-back{display:inline-block;font-family:'JetBrains Mono','IBM Plex Mono',ui-monospace,monospace;font-size:0.72rem;letter-spacing:0.14em;text-transform:uppercase;color:var(--ink-soft);text-decoration:none;margin-bottom:2.5rem;border-bottom:1px solid transparent;transition:border-color 0.2s,color 0.2s;}
.editorial .ed-back:hover{color:var(--accent-ed);border-bottom-color:var(--accent-ed);}
.editorial .masthead{border-top:3px double var(--ink);border-bottom:1px solid var(--rule);padding:1.75rem 0 2.25rem;margin-bottom:3rem;}
.editorial .folio{font-family:'JetBrains Mono','IBM Plex Mono',ui-monospace,monospace;font-size:0.72rem;letter-spacing:0.2em;text-transform:uppercase;color:var(--ink-soft);margin-bottom:1.5rem;display:flex;justify-content:space-between;flex-wrap:wrap;gap:0.5rem;}
.editorial .folio .folio-dot{color:var(--accent-ed);margin:0 0.6em;}
.editorial .ed-title{font-family:'Source Serif 4','Source Serif Pro',Georgia,serif;font-style:italic;font-weight:400;font-size:clamp(2.2rem,5.8vw,3.6rem);line-height:1.08;letter-spacing:-0.015em;margin:0 0 1.25rem;color:var(--ink);}
.editorial .ed-dek{font-family:'Source Serif 4','Source Serif Pro',Georgia,serif;font-size:1.15rem;line-height:1.55;color:var(--ink-soft);font-weight:400;margin:0 0 1.5rem;max-width:58ch;}
.editorial .ed-byline{font-family:'JetBrains Mono','IBM Plex Mono',ui-monospace,monospace;font-size:0.72rem;letter-spacing:0.14em;text-transform:uppercase;color:var(--ink-soft);}
.editorial .ed-byline .byline-sep{margin:0 0.55em;color:var(--accent-ed);}
.editorial .section-mark{display:flex;align-items:baseline;gap:1rem;margin:4rem 0 1.25rem;padding-top:2rem;border-top:1px solid var(--rule);}
.editorial .section-num{display:inline-block;font-family:'JetBrains Mono','IBM Plex Mono',ui-monospace,monospace;font-size:0.7rem;letter-spacing:0.18em;text-transform:uppercase;color:var(--accent-ed);border:1px solid var(--accent-ed);padding:0.2rem 0.55rem;border-radius:2px;flex-shrink:0;font-weight:600;}
.editorial .section-title{font-family:'Source Serif 4','Source Serif Pro',Georgia,serif;font-style:italic;font-weight:400;font-size:clamp(1.6rem,3.5vw,2.15rem);line-height:1.2;margin:0;letter-spacing:-0.01em;color:var(--ink);}
.editorial h3.ed-h3{font-family:'Source Serif 4','Source Serif Pro',Georgia,serif;font-style:italic;font-weight:400;font-size:1.35rem;margin:2.5rem 0 0.75rem;letter-spacing:-0.005em;color:var(--ink);}
.editorial h4.ed-h4{font-family:'JetBrains Mono','IBM Plex Mono',ui-monospace,monospace;font-size:0.72rem;letter-spacing:0.14em;text-transform:uppercase;color:var(--accent-ed);margin:2rem 0 0.5rem;font-weight:600;}
.editorial p{font-size:1.08rem;line-height:1.75;margin:0 0 1.2rem;color:var(--ink);font-family:'Source Serif 4','Source Serif Pro',Georgia,serif;}
.editorial p.lede{font-size:1.12rem;}
.editorial p.lede::first-letter{font-family:'Source Serif 4','Source Serif Pro',Georgia,serif;font-weight:700;font-size:4.4rem;line-height:0.9;float:left;padding:0.35rem 0.6rem 0 0;margin:0.15rem 0.1rem 0 0;color:var(--accent-ed);font-style:normal;}
.editorial strong{font-weight:600;color:var(--ink);}
.editorial em{font-style:italic;}
.editorial a.ed-link{color:var(--accent-ed);text-decoration:none;border-bottom:1px solid var(--accent-ed-soft);transition:border-color 0.15s,color 0.15s;}
.editorial a.ed-link:hover{color:var(--ink);border-bottom-color:var(--ink);}
.editorial a.cite{display:inline-block;font-family:'JetBrains Mono','IBM Plex Mono',ui-monospace,monospace;font-size:0.72em;vertical-align:super;line-height:1;color:var(--accent-ed);text-decoration:none;padding:0 0.1em;font-weight:600;position:relative;}
.editorial a.cite:hover{color:var(--ink);}
.editorial a.cite[data-tip]:hover::after{content:attr(data-tip);position:absolute;bottom:calc(100% + 6px);left:50%;transform:translateX(-50%);background:var(--ink);color:var(--paper);font-family:'JetBrains Mono','IBM Plex Mono',ui-monospace,monospace;font-size:0.7rem;line-height:1.35;padding:0.5rem 0.65rem;border-radius:3px;white-space:normal;width:max-content;max-width:260px;z-index:10;letter-spacing:0.02em;text-transform:none;font-weight:400;pointer-events:none;box-shadow:0 3px 8px rgba(0,0,0,0.18);}
.editorial .pull{border-left:3px solid var(--accent-ed);padding:0.5rem 0 0.5rem 1.5rem;margin:2.5rem 0;}
.editorial .pull p{font-family:'Source Serif 4','Source Serif Pro',Georgia,serif;font-style:italic;font-size:1.35rem;line-height:1.45;color:var(--ink);margin:0;}
.editorial .meta-label{font-family:'JetBrains Mono','IBM Plex Mono',ui-monospace,monospace;font-size:0.68rem;letter-spacing:0.16em;text-transform:uppercase;color:var(--accent-ed);font-weight:600;display:block;margin-bottom:0.35rem;}
.editorial ol.findings-ed{list-style:none;counter-reset:findings;padding:0;margin:1.5rem 0 2rem;}
.editorial ol.findings-ed li{counter-increment:findings;position:relative;padding:0.85rem 0 0.85rem 3rem;border-bottom:1px solid var(--rule);font-size:1.05rem;line-height:1.65;}
.editorial ol.findings-ed li::before{content:counter(findings,decimal-leading-zero);position:absolute;left:0;top:0.95rem;font-family:'JetBrains Mono','IBM Plex Mono',ui-monospace,monospace;font-size:0.72rem;letter-spacing:0.1em;color:var(--accent-ed);font-weight:600;}
.editorial ol.findings-ed li:last-child{border-bottom:none;}
.editorial details.expandable{margin:3.5rem 0 1.5rem;border-top:2px solid var(--ink);padding-top:1.25rem;}
.editorial details.expandable summary{font-family:'JetBrains Mono','IBM Plex Mono',ui-monospace,monospace;font-size:0.8rem;letter-spacing:0.16em;text-transform:uppercase;color:var(--ink);cursor:pointer;list-style:none;display:flex;align-items:center;gap:0.6rem;font-weight:600;}
.editorial details.expandable summary::before{content:'+';font-family:'Source Serif 4',Georgia,serif;font-size:1.4rem;font-weight:400;color:var(--accent-ed);line-height:1;transition:transform 0.2s;}
.editorial details.expandable[open] summary::before{content:'\u2013';}
.editorial ol.reflist{list-style:none;counter-reset:refs;padding:0;margin:1.5rem 0 0;}
.editorial ol.reflist li{counter-increment:refs;position:relative;padding:0.75rem 0 0.75rem 2.5rem;font-family:'Source Serif 4','Source Serif Pro',Georgia,serif;font-size:0.95rem;line-height:1.55;color:var(--ink);border-bottom:1px solid var(--rule);scroll-margin-top:4rem;}
.editorial ol.reflist li::before{content:'[' counter(refs) ']';position:absolute;left:0;top:0.78rem;font-family:'JetBrains Mono','IBM Plex Mono',ui-monospace,monospace;font-size:0.7rem;letter-spacing:0.04em;color:var(--accent-ed);font-weight:600;}
.editorial ol.reflist li:last-child{border-bottom:none;}
.editorial ol.reflist li:target{background:rgba(31,78,140,0.08);padding-left:2.75rem;}
.editorial ol.reflist .ref-authors{color:var(--ink-soft);}
.editorial ol.reflist .ref-title{font-style:italic;}
.editorial ol.reflist .ref-venue{font-family:'JetBrains Mono','IBM Plex Mono',ui-monospace,monospace;font-size:0.78rem;color:var(--ink-soft);letter-spacing:0.02em;display:block;margin-top:0.2rem;}
.editorial ol.reflist a{color:var(--accent-ed);text-decoration:none;border-bottom:1px solid var(--accent-ed-soft);}
.editorial ol.reflist a:hover{color:var(--ink);border-bottom-color:var(--ink);}
.editorial .divider{text-align:center;font-family:'JetBrains Mono','IBM Plex Mono',ui-monospace,monospace;font-size:0.85rem;color:var(--rule);letter-spacing:0.6em;margin:3rem 0 2.5rem;padding-right:0;}
.editorial hr.rule{border:none;border-top:1px solid var(--rule);margin:2.5rem 0;}
.editorial table.comp-table{width:100%;border-collapse:collapse;font-size:0.92rem;margin:1.25rem 0 2rem;font-family:'Source Serif 4','Source Serif Pro',Georgia,serif;}
.editorial table.comp-table th,.editorial table.comp-table td{text-align:left;padding:0.65rem 0.75rem;border-bottom:1px solid var(--rule);vertical-align:top;}
.editorial table.comp-table thead th{font-family:'JetBrains Mono','IBM Plex Mono',ui-monospace,monospace;font-size:0.7rem;letter-spacing:0.12em;text-transform:uppercase;color:var(--accent-ed);font-weight:600;border-bottom:2px solid var(--ink);}
.editorial table.comp-table tbody th{font-family:'JetBrains Mono','IBM Plex Mono',ui-monospace,monospace;font-size:0.7rem;letter-spacing:0.08em;text-transform:uppercase;color:var(--ink-soft);font-weight:600;width:34%;}
</style>
<div class="grain"></div>
<div class="ed-wrap">
<a href="/" class="ed-back">&larr; Research Hub</a>

<header class="masthead">
  <div class="folio"><span>Horwitz<span class="folio-dot">&bull;</span>Research Note<span class="folio-dot">&bull;</span>Vol.&nbsp;I</span><span>April&nbsp;2026</span></div>
  <h1 class="ed-title">Neural networks, read as data</h1>
  <p class="ed-dek">Eliahu Horwitz's weight-space research asks what trained models reveal about themselves &mdash; their ancestors, their training data, and the structure of the ecosystem they inhabit.</p>
  <div class="ed-byline">Douglas McGowan<span class="byline-sep">&#x2022;</span>UC Berkeley<span class="byline-sep">&#x2022;</span>Reading notes on four papers: Model Atlas, ProbeX, MoTHer, PoDD</div>
</header>

<section>
<div class="section-mark"><span class="section-num">I</span><h2 class="section-title">The big idea</h2></div>
<p class="lede">Eliahu Horwitz is a PhD student and Google PhD Fellow at the Hebrew University of Jerusalem,<a href="#ref-1" class="cite" data-tip="Horwitz personal site, HUJI">[1]</a> working with Yedid Hoshen. His research starts from a deceptively plain question: <em>what if trained neural networks were treated as data, rather than as tools?</em> Public repositories like Hugging Face now host millions of models, each one a dense encoding of what it was trained on, how it was tuned, and where it came from. Those weights are a largely unexplored corpus, and Horwitz's program &mdash; he calls it <strong>weight space learning</strong><a href="#ref-2" class="cite" data-tip="Publications index, horwitz.ai">[2]</a> &mdash; develops methods to read them.</p>
<p>Four papers sit at the center of that program. <strong>MoTHer</strong><a href="#ref-3" class="cite" data-tip="Unsupervised Model Tree Heritage Recovery, ICLR 2025">[3]</a> recovers model genealogies from weights alone. <strong>ProbeX</strong><a href="#ref-4" class="cite" data-tip="Learning on Model Weights using Tree Experts, CVPR 2025">[4]</a> turns those genealogies into practical representations of individual model behaviour. <strong>Model Atlas</strong><a href="#ref-5" class="cite" data-tip="We Should Chart an Atlas of All the World's Models, NeurIPS 2025">[5]</a> zooms out to argue we should be charting the population of neural networks the way biologists chart species. <strong>PoDD</strong><a href="#ref-6" class="cite" data-tip="Distilling Datasets Into Less Than One Image, TMLR 2025">[6]</a> is thematically adjacent: rather than compressing models, it compresses the training data itself, pushing distillation below one image per class.</p>

<div class="pull"><p>Just as biologists chart species and librarians chart books, Horwitz argues, ML needs an atlas of its own outputs &mdash; and methods that can infer a model's lineage and training data directly from its weights.</p></div>

<h3 class="ed-h3">Four threads, one instinct</h3>
<ol class="findings-ed">
  <li><strong>Models are a data modality.</strong> Weights, not just outputs, deserve the kind of systematic treatment we give images, text, and audio.</li>
  <li><strong>The model ecosystem is a tree, not a cloud.</strong> Most public models descend from a small set of foundation models. That structure is load-bearing for everything else.</li>
  <li><strong>Data-free and unsupervised by default.</strong> Real-world models rarely ship with documentation or training data, so the methods need to work without either.</li>
  <li><strong>Scale is the point.</strong> MoTHer recovers trees with 500+ nodes from in-the-wild Hugging Face families;<a href="#ref-3" class="cite" data-tip="MoTHer results section">[3]</a> Model Atlas analyses more than 63,000 documented relationships.<a href="#ref-5" class="cite" data-tip="Model Atlas paper, arXiv 2503.10633">[5]</a></li>
</ol>

<table class="comp-table">
<thead><tr><th>Paper</th><th>Venue</th><th>Role in the program</th></tr></thead>
<tbody>
<tr><th>MoTHer</th><td>ICLR 2025</td><td>Foundational: weights encode genealogy</td></tr>
<tr><th>ProbeX</th><td>CVPR 2025</td><td>Method: learn from weights inside a tree</td></tr>
<tr><th>Model Atlas</th><td>NeurIPS 2025 (Position)</td><td>Vision: chart the global population</td></tr>
<tr><th>PoDD</th><td>TMLR 2025</td><td>Adjacent: compressing data, not models</td></tr>
</tbody>
</table>
</section>

<section>
<div class="section-mark"><span class="section-num">II</span><h2 class="section-title">MoTHer &mdash; reading family trees from weights</h2></div>
<p><span class="meta-label">Horwitz, Shul &amp; Hoshen &mdash; ICLR 2025</span>When a model is uploaded to Hugging Face, nothing forces the uploader to say where it came from. Was it fine-tuned from Llama? Which version? With what adapter? Most don't say. The result, Horwitz and co-authors argue, is a <strong>provenance crisis</strong>: millions of models with almost no reliable genealogical information.<a href="#ref-3" class="cite" data-tip="MoTHer paper, arXiv 2405.18432">[3]</a></p>
<p>The stakes go beyond curiosity. If a foundation model is later found to have been trained on copyrighted data, which of its thousands of descendants inherit the liability? If a safety flaw is discovered upstream, which downstream models propagate it? Without provenance, those questions have no answer.</p>

<h3 class="ed-h3">Two observations about weights</h3>
<p>MoTHer &mdash; Model Tree Heritage Recovery &mdash; builds on two empirical regularities in how weights change during training.</p>

<h4 class="ed-h4">01 / Weight distance tracks tree distance</h4>
<p>Pairwise distances between models' weights, under suitable metrics, correlate almost perfectly with the number of edges separating them in the true model tree. Close relatives look similar; distant relatives don't. That structure is enough to cluster models into families.</p>

<h4 class="ed-h4">02 / Outliers reveal training direction</h4>
<p>During generalization &mdash; pre-training on broad data &mdash; the number of weight outliers grows. During specialization &mdash; fine-tuning on narrower data &mdash; outliers decrease. That monotonic shift, captured by <em>kurtosis</em>, makes it possible to tell which of two related models is the parent and which is the child.</p>

<p>Put together, MoTHer computes pairwise distances to cluster, uses kurtosis to assign direction, runs a minimum directed spanning tree to stitch clusters together, and recovers the full genealogy from weights alone.</p>

<h3 class="ed-h3">What it recovers</h3>
<p>On a 105-node Vision Transformer graph, MoTHer reaches <strong>89% accuracy</strong> in recovering the true tree structure. On Llama 2's known genealogy, it achieves perfect recovery. The method scales to graphs with more than 500 nodes and has been demonstrated on real, undocumented Stable Diffusion families on Hugging Face.<a href="#ref-3" class="cite" data-tip="MoTHer paper, arXiv 2405.18432">[3]</a> The practical applications Horwitz lists are concrete: licensing compliance, safety auditing, research archaeology on models uploaded without documentation, and feeding the structural spine of the Model Atlas described later.</p>
</section>

<section>
<div class="section-mark"><span class="section-num">III</span><h2 class="section-title">ProbeX &mdash; experts, one tree at a time</h2></div>
<p><span class="meta-label">Horwitz, Cavia, Kahana &amp; Hoshen &mdash; CVPR 2025</span>The tree structure MoTHer exposes is not only a bookkeeping win; it also changes what it means to <em>learn</em> from weights. Earlier weight-space learning methods tried to generalize across all models at once. ProbeX's central claim is that this is counterproductive: mixing weights from different trees introduces <strong>negative transfer</strong>, because the differences between, say, a Llama variant and a Stable Diffusion variant are dominated by architectural and initialization nuisance rather than meaningful training signal.<a href="#ref-4" class="cite" data-tip="ProbeX paper, arXiv 2410.13569">[4]</a></p>
<p>Within a single tree, by contrast, every model shares the same architecture and ancestor. Weight differences reflect actual choices &mdash; which data, which task, which hyperparameters &mdash; and those differences are learnable.</p>

<h3 class="ed-h3">The probing-experts architecture</h3>
<p>ProbeX (Probing Experts) is the first probing method designed to read from the weights of a <strong>single hidden layer</strong>. The architecture is deliberately lightweight:</p>
<ol class="findings-ed">
  <li><strong>Learned probes</strong> are passed through the weight matrices of a target layer.</li>
  <li>A <strong>shared projection</strong> reduces the resulting representations' dimensionality across all probes.</li>
  <li><strong>Per-probe encoders</strong> produce specialized representations, which are aggregated into a single model embedding.</li>
</ol>
<p>A separate expert network is trained for each model tree. At inference time, a new model's tree is identified first; then its weights are routed to the matching expert. Negative transfer is avoided by construction rather than hoped away.<a href="#ref-4" class="cite" data-tip="ProbeX paper, arXiv 2410.13569">[4]</a></p>

<h3 class="ed-h3">Results worth pausing on</h3>
<p>ProbeX reaches state-of-the-art accuracy at predicting the training categories of a model from its weights. More striking: it aligns Stable Diffusion weights with <em>text</em> embeddings, so that a model fine-tuned on anime or photorealism lands, in a shared space, near the description of that domain. The consequence is <strong>zero-shot model search</strong> &mdash; type a query like "a model trained on dogs," retrieve the matching models, no metadata required.</p>

<div class="pull"><p>ProbeX turns a model repository from an unstructured heap into a searchable database: you describe what you want in natural language; the system inspects weights, not model cards.</p></div>
</section>

<section>
<div class="section-mark"><span class="section-num">IV</span><h2 class="section-title">Model Atlas &mdash; charting the population</h2></div>
<p><span class="meta-label">Horwitz, Kurer, Kahana, Amar &amp; Hoshen &mdash; NeurIPS 2025 (Position)</span>Public model repositories have crossed a million uploads, and the ML field's success has created an oddly familiar paradox: the more models exist, the harder it is to find, understand, or trust any one of them. Most uploads carry no documentation of their lineage, training data, or relationship to other models. In the authors' phrasing, they are <em>effectively lost</em> &mdash; available but undiscoverable.<a href="#ref-5" class="cite" data-tip="Model Atlas paper, arXiv 2503.10633">[5]</a></p>

<h3 class="ed-h3">A directed graph, not a catalogue</h3>
<p>The proposal is to formalize the global population of neural networks as a <strong>directed graph</strong> &mdash; the Model Atlas. Nodes are models, annotated with task, metrics, license, popularity, and architecture. Edges are weight transformations: fine-tuning, quantization, merging, pruning, distillation. The edge direction carries the flow of information from parent to child.</p>
<p>Accepted as a position paper at NeurIPS 2025 &mdash; a track with under 6% acceptance<a href="#ref-7" class="cite" data-tip="Horwitz, X thread announcing NeurIPS 2025 acceptance">[7]</a> &mdash; the piece is less a technical contribution than an argument for what the field should prioritize: the ecosystem has outgrown ad-hoc management, and needs something like a search engine for models.</p>

<h3 class="ed-h3">What 63,000 relationships reveal</h3>
<p>The paper analyses more than 63,000 documented relationships on Hugging Face and surfaces cross-domain patterns that are hard to see from any single release:</p>
<ul class="findings-ed">
  <li><strong>Quantization is a community habit.</strong> LLM repositories are dominated by quantized variants; vision repositories almost never use quantization &mdash; even though current image models like Flux (12B) exceed Llama (8B) in size. The driver is norm, not necessity.</li>
  <li><strong>Adapters split discriminative from generative.</strong> Vision classifiers and detectors still favour full fine-tuning; generative models, especially Stable Diffusion variants, rapidly adopted parameter-efficient adapters like LoRA. Audio is still adapter-sparse.</li>
  <li><strong>LLMs merge; vision does not.</strong> Merged LLMs often exceed their parents in popularity. Vision repositories show almost no merging at all &mdash; a knowledge-transfer gap between communities.</li>
</ul>

<p>Structural motifs surface too: <em>snake</em> patterns (sequential training checkpoints) and <em>fan</em> patterns (hyperparameter sweeps radiating from a single parent). Over 60% of the atlas remains unknown by direct documentation, which is exactly the gap that methods like MoTHer and ProbeX are built to fill.</p>
</section>

<section>
<div class="section-mark"><span class="section-num">V</span><h2 class="section-title">PoDD &mdash; distilling a dataset below one image per class</h2></div>
<p><span class="meta-label">Shul, Horwitz &amp; Hoshen &mdash; TMLR 2025</span>Dataset distillation compresses a large training dataset into a much smaller synthetic one that can still train a competent model. The canonical framing is <strong>images per class</strong> (IPC): one synthetic image per class, ten per class, and so on. The floor is 1 &mdash; a hundred-class problem needs a hundred images.<a href="#ref-6" class="cite" data-tip="PoDD paper, arXiv 2403.12040">[6]</a></p>
<p>PoDD &mdash; Poster Dataset Distillation &mdash; asks whether that floor is real. Can a dataset be distilled into <em>less</em> than one image per class?</p>

<h3 class="ed-h3">The poster move</h3>
<p>The reframing is small but consequential: stop thinking in images-per-class and start thinking in <strong>pixels-per-dataset</strong>. If patches from different classes are allowed to overlap inside a single larger image, multiple classes can share pixel real estate without one-to-one allocation. The method optimizes a single poster image end-to-end so that patches drawn from it, paired with soft labels, train models that match what the full dataset would produce.</p>
<p>The soft labels do the heavy lifting. Instead of one-hot tags, each patch carries a continuous distribution &mdash; "0.6 cat, 0.3 dog, 0.1 bird" &mdash; that reflects the overlapping information in that region. That continuous label is what makes sub-1-IPC compression coherent.</p>

<h3 class="ed-h3">Results</h3>
<table class="comp-table">
<thead><tr><th>Dataset</th><th>IPC</th><th>Result</th></tr></thead>
<tbody>
<tr><th>CIFAR-10</th><td>0.3</td><td>Competitive with 1-IPC methods (3 images for 10 classes)</td></tr>
<tr><th>CIFAR-100</th><td>0.3</td><td>State-of-the-art at this budget (30 images for 100 classes)</td></tr>
<tr><th>CUB-200</th><td>0.3</td><td>State-of-the-art at this budget (60 images for 200 classes)</td></tr>
</tbody>
</table>
<p>A nice side observation: the optimized posters develop <em>semantically meaningful spatial structure</em>. In CIFAR-10, sky-like textures appear where airplane and bird patches cluster and ground-like textures appear where cars and trucks cluster. The poster learns not only per-class features but the spatial relations between classes.</p>
<p>PoDD sits thematically adjacent to the weight-space program rather than inside it, but it shares the same instinct: the conventional way the field organizes its artifacts &mdash; one model per upload, one image per class &mdash; may be more a convention than a constraint, and rethinking the representation can unlock surprising efficiency.</p>
</section>

<div class="divider">&sect; &sect; &sect;</div>

<section>
<div class="section-mark"><span class="section-num">VI</span><h2 class="section-title">What ties these together</h2></div>
<p>The four papers form a progression from foundational observation (MoTHer: weights encode lineage) to practical method (ProbeX: learn from weights inside a tree) to ecosystem-scale argument (Model Atlas: chart the whole population), with PoDD as a parallel exercise in rethinking what a minimal representation of an ML artifact looks like. The through-line is a steady refusal to treat trained networks as finished products. A model, in this program, is an object of study &mdash; something you can locate in a tree, query by description, and analyse at population scale, even when its uploader left no notes behind.</p>
<ol class="findings-ed">
  <li><strong>Start from structure, not scale.</strong> The tree structure of public models is load-bearing; ignoring it makes weight-space learning harder, not easier.</li>
  <li><strong>Prefer data-free methods.</strong> Real models ship without documentation or training data. Methods that need either don't meet the ecosystem where it is.</li>
  <li><strong>Treat weights as a queryable signal.</strong> Provenance, training categories, and even language-aligned descriptions can be read from the weights themselves.</li>
  <li><strong>Question the units.</strong> Images per class, models per upload &mdash; these are conventions. Rethinking them (pixels per dataset, trees per repository) reshapes what is tractable.</li>
</ol>
</section>

<details class="expandable">
<summary>References</summary>
<ol class="reflist">
  <li id="ref-1"><span class="ref-authors">Horwitz, E.</span> <span class="ref-title">Personal site &mdash; PhD Student in Weight Space Learning.</span> <span class="ref-venue">Hebrew University of Jerusalem.</span> <a href="https://horwitz.ai/" target="_blank" rel="noopener">horwitz.ai</a></li>
  <li id="ref-2"><span class="ref-authors">Horwitz, E.</span> <span class="ref-title">Publications index.</span> <span class="ref-venue">horwitz.ai/publications.html.</span> <a href="https://horwitz.ai/publications.html" target="_blank" rel="noopener">horwitz.ai/publications.html</a></li>
  <li id="ref-3"><span class="ref-authors">Horwitz, E., Shul, A., &amp; Hoshen, Y.</span> <span class="ref-title">Unsupervised Model Tree Heritage Recovery.</span> <span class="ref-venue">International Conference on Learning Representations (ICLR), 2025.</span> <a href="https://arxiv.org/abs/2405.18432" target="_blank" rel="noopener">arXiv:2405.18432</a> &middot; <a href="https://horwitz.ai/mother" target="_blank" rel="noopener">horwitz.ai/mother</a> &middot; <a href="https://github.com/eliahuhorwitz/MoTHer" target="_blank" rel="noopener">github.com/eliahuhorwitz/MoTHer</a></li>
  <li id="ref-4"><span class="ref-authors">Horwitz, E., Cavia, B., Kahana, J., &amp; Hoshen, Y.</span> <span class="ref-title">Learning on Model Weights using Tree Experts.</span> <span class="ref-venue">IEEE/CVF Conference on Computer Vision and Pattern Recognition (CVPR), 2025.</span> <a href="https://arxiv.org/abs/2410.13569" target="_blank" rel="noopener">arXiv:2410.13569</a> &middot; <a href="https://horwitz.ai/probex" target="_blank" rel="noopener">horwitz.ai/probex</a> &middot; <a href="https://openaccess.thecvf.com/content/CVPR2025/papers/Horwitz_Learning_on_Model_Weights_using_Tree_Experts_CVPR_2025_paper.pdf" target="_blank" rel="noopener">CVPR open access PDF</a> &middot; <a href="https://github.com/eliahuhorwitz/ProbeX" target="_blank" rel="noopener">github.com/eliahuhorwitz/ProbeX</a></li>
  <li id="ref-5"><span class="ref-authors">Horwitz, E., Kurer, N., Kahana, J., Amar, L., &amp; Hoshen, Y.</span> <span class="ref-title">Charting and Navigating Hugging Face's Model Atlas (We Should Chart an Atlas of All the World's Models).</span> <span class="ref-venue">Neural Information Processing Systems (NeurIPS), 2025 &mdash; Position Paper track.</span> <a href="https://arxiv.org/abs/2503.10633" target="_blank" rel="noopener">arXiv:2503.10633</a> &middot; <a href="https://horwitz.ai/model-atlas" target="_blank" rel="noopener">horwitz.ai/model-atlas</a> &middot; <a href="https://neurips.cc/virtual/2025/loc/san-diego/poster/121950" target="_blank" rel="noopener">NeurIPS poster page</a> &middot; <a href="https://openreview.net/forum?id=BzFMBNqg7R" target="_blank" rel="noopener">OpenReview</a></li>
  <li id="ref-6"><span class="ref-authors">Shul, A., Horwitz, E., &amp; Hoshen, Y.</span> <span class="ref-title">Distilling Datasets Into Less Than One Image.</span> <span class="ref-venue">Transactions on Machine Learning Research (TMLR), 2025.</span> <a href="https://arxiv.org/abs/2403.12040" target="_blank" rel="noopener">arXiv:2403.12040</a> &middot; <a href="https://vision.huji.ac.il/podd/" target="_blank" rel="noopener">vision.huji.ac.il/podd</a> &middot; <a href="https://github.com/AsafShul/PoDD" target="_blank" rel="noopener">github.com/AsafShul/PoDD</a></li>
  <li id="ref-7"><span class="ref-authors">Horwitz, E.</span> <span class="ref-title">Announcement of NeurIPS 2025 position-paper acceptance for Model Atlas (&lt;6% accept).</span> <span class="ref-venue">X (Twitter), 26 September 2025.</span> <a href="https://x.com/EliahuHorwitz/status/1971543359820005606" target="_blank" rel="noopener">x.com/EliahuHorwitz/status/1971543359820005606</a></li>
</ol>
</details>

</div>
</div>
`,
  });
}

// ═══════════════════════════════════════════════════
// SANDBOX PAGE
// ═══════════════════════════════════════════════════
function buildSandbox() {
  return pageWrapper({
    title: "Psych_Battery: Systems Map & Prototyping",
    icon: "\uD83E\uDDEA",
    body: `
<div class="hero" style="background:linear-gradient(135deg,#1a1a1a 0%,#2d1f0e 50%,#1a0a00 100%)">
  <h1>Psych_Battery</h1>
  <p class="subtitle">A physical desk object that tracks digital engagement and promotes analog recovery &mdash; systems map, display mechanisms, and prototyping plans</p>
  <div class="meta"><span>AI Expedition 3</span><span>UC Berkeley</span><span>2025</span></div>
</div>
<nav class="nav"><div class="nav-inner">
  <button class="nav-tab active" onclick="showSection('scontext',this)">Context</button>
  <button class="nav-tab" onclick="showSection('ssystems',this)">Systems Map</button>
  <button class="nav-tab" onclick="showSection('stech',this)">Tech Stack</button>
  <button class="nav-tab" onclick="showSection('ssignals',this)">Data Signals</button>
  <button class="nav-tab" onclick="showSection('salgorithm',this)">Scoring Algorithms</button>
  <button class="nav-tab" onclick="showSection('sledguide',this)">LED Build</button>
  <button class="nav-tab" onclick="showSection('seinkguide',this)">E-Ink Build</button>
  <button class="nav-tab" onclick="showSection('scrowpanel',this)">CrowPanel Build</button>
</div></nav>
<div class="container">
<a href="/" class="back-link">&larr; Research Hub</a>

<!-- ===== CONTEXT ===== -->
<div class="section active" id="sec-scontext">
<h2>The PATHOS-BATTERY Concept</h2>
<p>This project emerges from a UC Berkeley design course exploring <strong>burnout and anxiety in AI-centered hybrid workplaces</strong>. Qualitative research &mdash; five semi-structured interviews and two observational studies &mdash; produced three core insights:</p>
<ul class="findings">
  <li><strong>More is Just More.</strong> Users have already iterated on their workflows multiple times. Adding tools or tasks isn't inherently helpful. Design must integrate without adding friction.</li>
  <li><strong>Workarounds are Still Common.</strong> Even highly technical users revert to low-tech, custom-made workarounds for focus and environment optimization.</li>
  <li><strong>Hybrid Workers Choose Environments Based on Short-Term Work Needs.</strong> The shift from connection to focus is as physical as it is mental.</li>
</ul>

<p>The core metaphor: <strong>humans have a social battery &mdash; why not a digital battery?</strong> A physical desk object that tracks and limits digital engagement, requiring analog recovery activities to recharge.</p>

<div class="callout"><div class="label">How It Works</div><p>The user starts the day with a full battery. It drains through AI engagement, extended digital comms, exhausting task-switching, and eating into break time. When depleted, the device interrupts the user (lights dim, screen dims, latency increases). The user must physically remove the battery and recharge through recovery: talking to people, non-sleep deep rest, napping, sunlight, hydrating.</p></div>

<h3>Design Constraints</h3>
<div class="tags">
  <span class="tag">No blue-light screens</span>
  <span class="tag">No audio/voice</span>
  <span class="tag">Analog/mechanical display</span>
  <span class="tag">Single data dimension</span>
  <span class="tag">Peripheral awareness</span>
</div>
<p>The display is analog or mechanical; all digital logic stays in the backend. Single-dimension data mapping (charge level) is the sweet spot &mdash; more axes reintroduce the cognitive load the device is meant to reduce.</p>

<h3>Display Mechanisms Evaluated</h3>
<p>During the concept exploration phase, five non-screen display technologies were evaluated as the chart below shows. Full write-ups with materials, implementation options, and prototyping plans for all five are archived in <code>psych_battery_concept_mechanisms_archived_html.html</code> and <code>pathos_battery_display_mechanisms.md</code> in the research folder. After evaluation, the project narrowed to two directions detailed in the <strong>LED Build</strong> and <strong>E-Ink Build</strong> tabs.</p>

<div class="flow-diagram">
  <div class="flow-node"><strong>LED Diffusion</strong><br><em>Light + color</em></div>
  <span class="flow-arrow">&rarr;</span>
  <div class="flow-node"><strong>Ferrofluid</strong><br><em>Magnetic sculpture</em></div>
  <span class="flow-arrow">&rarr;</span>
  <div class="flow-node"><strong>EL Wire</strong><br><em>Glowing veins</em></div>
  <span class="flow-arrow">&rarr;</span>
  <div class="flow-node"><strong>Electrochromic</strong><br><em>Smart glass</em></div>
  <span class="flow-arrow">&rarr;</span>
  <div class="flow-node"><strong>Thermochromic</strong><br><em>Heat-reactive</em></div>
</div>
</div>

<!-- ===== SYSTEMS MAP ===== -->
<div class="section" id="sec-ssystems">
<h2>Systems Map: AI Expedition 3</h2>
<p>This section walks through the Phase 1 systems mapping process from AI Expedition 3, applying each step to the Psych_Battery concept. The goal: surface assumptions, identify dynamics, and build a system diagram that informs the physical prototype.</p>

<div class="toc"><h4>Steps</h4><ul>
  <li><a href="#s1-purpose">Step 1: Purpose</a></li>
  <li><a href="#s2-behavior">Step 2: Behavior Assumptions</a></li>
  <li><a href="#s3-causes">Step 3: What Causes That Behavior</a></li>
  <li><a href="#s4-elements">Step 4: Elements & Interconnections</a></li>
  <li><a href="#s5-scope">Step 5: What to Include</a></li>
  <li><a href="#s6-stocks">Step 6: Stocks & Flows</a></li>
  <li><a href="#s7-loops">Step 7: Feedback Loops</a></li>
  <li><a href="#s8-graphs">Step 8: Behavior-Over-Time Graphs</a></li>
</ul></div>

<h3 id="s1-purpose">Step 1: What is the purpose of your concept?</h3>
<p>The Psych_Battery helps users understand their <strong>mental energy and cognitive capacity</strong> by representing it through a physical battery object. It also promotes <strong>healthier recovery habits that involve connecting with others</strong>.</p>
<table class="result-table">
<tr><th>Question</th><th>Answer</th></tr>
<tr><td><strong>What is it supposed to do?</strong></td><td>Track and limit digital engagement, require analog recovery activities to recharge, and make cognitive load visible through a physical object.</td></tr>
<tr><td><strong>For whom?</strong></td><td>Hybrid knowledge workers that use AI-powered workflows.</td></tr>
<tr><td><strong>In what situation?</strong></td><td>During the workday, during a typical 9-to-5 job &mdash; both in-person and remote.</td></tr>
<tr><td><strong>Intended experience?</strong></td><td>Greater awareness of personal rhythms of energy and cognitive load, and more sustainable recovery practices involving social connection &mdash; making work more joyful and fulfilling.</td></tr>
</table>

<h3 id="s2-behavior">Step 2: Assumptions about the behavior of the system</h3>
<p>If the Psych_Battery works as intended, we'd expect the following behavioral patterns over the first ~10 weeks of use:</p>

<h4>Trust</h4>
<div class="slide-fig"><img src="/figures/battery/bot_trust.png" alt="Trust over time" onclick="openLightbox(this)"><div class="caption">Trust starts neutral, dips slightly during the first 1-2 weeks of adoption friction, then gradually rises and levels off around month two as the system calibrates and the user builds confidence in its predictions.</div></div>
<p>The initial dip comes from the system getting predictions wrong early on &mdash; it hasn't learned the user's actual patterns yet. As calibration improves and the user sees accurate reflections of their energy state, trust builds steadily.</p>

<h4>Frustration</h4>
<div class="slide-fig"><img src="/figures/battery/bot_frustration.png" alt="Frustration over time" onclick="openLightbox(this)"><div class="caption">Frustration starts moderate, peaks during weeks 1-3 as users encounter calibration mismatches and disagree with the system's readings, then decreases to a low (but above-zero) steady state by month two.</div></div>
<p>The frustration spike comes from three sources: (1) the friction of data input during adoption, (2) the discomfort of having one's data analyzed, even in a closed system, and (3) calibration errors where the system misjudges the user's actual energy level. The user may <em>disagree</em> with the battery's reading and be forced to confront their own patterns &mdash; which is uncomfortable but ultimately the point.</p>

<h4>Daily Energy Cycle</h4>
<div class="slide-fig"><img src="/figures/battery/bot_energy.png" alt="Daily energy cycle" onclick="openLightbox(this)"><div class="caption">A typical daily energy curve: high in the morning, draining through work, with recovery bumps during breaks. The dashed line shows what happens without the battery &mdash; steady decline with no prompted recovery.</div></div>

<h3 id="s3-causes">Step 3: What causes that behavior?</h3>
<p>The patterns above are driven by several interacting causes:</p>
<ul class="findings">
  <li><strong>Adoption friction.</strong> The user must input data and change habits. Any behavior change creates initial resistance, especially in established workflows.</li>
  <li><strong>Data awareness discomfort.</strong> Realizing that communication patterns, AI usage, and break habits are being tracked &mdash; even in a closed system &mdash; triggers privacy instincts and self-consciousness.</li>
  <li><strong>Calibration mismatch.</strong> The system needs time to learn the user's actual energy rhythms. Early predictions will be wrong, and the user will disagree with the battery's reading of their state.</li>
  <li><strong>Confrontation with self-knowledge.</strong> The battery forces users to see their own patterns &mdash; patterns they may have been avoiding. This is the source of both frustration (short-term) and value (long-term).</li>
  <li><strong>Interruption escalation.</strong> As the battery drains, interruptions intensify (dims, latency, blocks). This is intentionally uncomfortable &mdash; it's the mechanism that drives behavior change, but it also drives frustration.</li>
  <li><strong>Social recovery benefits.</strong> Over time, the recovery activities (face-to-face conversation, sunlight, rest) produce genuine improvements in wellbeing, which reinforces trust and reduces frustration.</li>
</ul>

<h3 id="s4-elements">Step 4: Elements & Interconnections</h3>
<p>The key elements of the system and how they connect:</p>

<div class="slide-fig"><img src="/figures/battery/system_diagram_user.svg" alt="System diagram" onclick="openLightbox(this)" style="background:#fff;padding:1rem;"><div class="caption">System diagram showing the three stocks (Battery Charge Level, Interruption Intensity, Recharge Resistance), their inflows/outflows, and the balancing (B1) and reinforcing (R1) feedback loops.</div></div>

<table class="result-table">
<tr><th>Element</th><th>Role</th><th>Connections</th></tr>
<tr><td><strong>User</strong></td><td>The hybrid knowledge worker</td><td>Generates all drain activities; performs recovery activities</td></tr>
<tr><td><strong>Battery object</strong></td><td>Physical display device</td><td>Reads charge level; displays state; sits on desk</td></tr>
<tr><td><strong>Backend system</strong></td><td>Data collection + prediction</td><td>Ingests communication/compute/media data; calculates energy score</td></tr>
<tr><td><strong>Digital environment</strong></td><td>Slack, email, AI tools, browser</td><td>Source of drain data; target of interruptions (dims, blocks, latency)</td></tr>
<tr><td><strong>Physical environment</strong></td><td>Office, outdoors, breakroom</td><td>Setting for recovery activities</td></tr>
<tr><td><strong>Coworkers</strong></td><td>Social recovery partners</td><td>Face-to-face interaction is the primary recharge activity</td></tr>
</table>

<p><strong>Data interconnections</strong> &mdash; information that flows between elements:</p>
<ul class="findings">
  <li><strong>Communication data</strong> (Slack messages, email, video calls) &rarr; backend &rarr; drain rate calculation</li>
  <li><strong>Compute data</strong> (AI token usage, agent interactions) &rarr; backend &rarr; drain rate calculation</li>
  <li><strong>Media data</strong> (LinkedIn, news, browser history) &rarr; backend &rarr; drain rate calculation</li>
  <li><strong>Electricity/power data</strong> &rarr; backend &rarr; ambient device usage signal</li>
  <li><strong>Charge level</strong> &rarr; battery display &rarr; user perception</li>
  <li><strong>Charge level</strong> &rarr; digital environment &rarr; interruption actions (dim, block, slow)</li>
</ul>

<h3 id="s5-scope">Step 5: What to include in the system diagram</h3>
<div class="callout"><div class="label">Included</div><p>The primary stock (mental energy / charge level), both secondary stocks (recharge resistance, interruption intensity), all drain and recovery flows, the two main feedback loops (balancing and reinforcing), and the data inputs that feed the energy calculation. These are all necessary to explain the core behavior: drain &rarr; interrupt &rarr; recover &rarr; stabilize.</p></div>
<div class="callout"><div class="label">Excluded (for now)</div><p><strong>Social dynamics between coworkers</strong> &mdash; how the user's battery state affects team dynamics is important but adds too much complexity for the initial diagram. <strong>Long-term habit formation</strong> &mdash; the 2-month calibration arc is real but operates on a different timescale than the daily drain/recover cycle. <strong>Manager/org influence</strong> &mdash; workplace culture shapes what "acceptable" break behavior looks like, but this is context, not mechanism. <strong>Multiple users</strong> &mdash; team-level battery effects are a future extension.</p></div>

<h3 id="s6-stocks">Step 6: Stocks & Flows</h3>

<h4>Primary Stock: Mental Energy Score</h4>
<p>The core quantity that the battery tracks. It can be counted (0-100%), estimated from data inputs, and is directly visible through the physical display. This is what the user cares about.</p>
<table class="result-table">
<tr><th>Outflows (Drains)</th><th>Inflows (Recharges)</th></tr>
<tr><td>Extended AI interaction (sustained chat, iteration)</td><td>Face-to-face interaction (tailored: 1-on-1 for introverts, groups for extroverts)</td></tr>
<tr><td>Frustrated AI interaction</td><td>Unplugged, low-stimulation time</td></tr>
<tr><td>Prolonged digital comms (Slack, Zoom, email)</td><td>Exposure to sunlight</td></tr>
<tr><td>High task switching between contexts</td><td>Napping</td></tr>
<tr><td>Working into scheduled break time</td><td>Eating / drinking / hydrating</td></tr>
</table>
<p>The rates aren't equal &mdash; a 30-minute AI deep-dive drains faster than a quick email check. And the user must <em>physically remove the battery</em> and engage in recovery to recharge.</p>

<h4>Secondary Stock: Recharge Resistance</h4>
<p>Accumulates when the user works beyond planned hours. Acts as a <strong>modifier that reduces the effectiveness of all inflows.</strong></p>
<ul class="findings">
  <li><strong>Inflow:</strong> Time spent working when battery is low or dead</li>
  <li><strong>Outflow:</strong> Time spent actively recharging</li>
  <li><strong>Effect:</strong> Higher resistance = recovery activities restore less charge per unit time</li>
</ul>

<h4>Secondary Stock: Interruption Intensity</h4>
<p>As battery charge drops past thresholds, the system escalates interventions (dimming lights, adding latency, reducing frame rate, blocking apps).</p>
<ul class="findings">
  <li><strong>Inflow:</strong> Time spent with battery in or below the red zone</li>
  <li><strong>Outflow:</strong> Time spent recharging, with battery in yellow/green</li>
  <li><strong>Effect:</strong> Creates escalating pressure on the user to stop and recover</li>
</ul>

<h3 id="s7-loops">Step 7: Feedback Loops</h3>

<h4>B1: The Recovery Loop (Balancing)</h4>
<div class="callout"><div class="label">Balancing Loop</div><p><strong>Low charge &rarr; interruptions increase &rarr; user is pushed to recharge &rarr; charge rises &rarr; interruptions stop.</strong> This is the core therapeutic mechanism. The system applies escalating discomfort that can only be relieved by engaging in healthy recovery activities. It's balancing because it pushes the system back toward equilibrium.</p></div>

<h4>R1: The Overtime Spiral (Reinforcing)</h4>
<div class="callout"><div class="label">Reinforcing Loop</div><p><strong>Low battery &rarr; user pushes through &rarr; overtime hours increase &rarr; recharge resistance grows &rarr; recovery becomes less effective &rarr; battery stays low &rarr; more interruptions &rarr; more frustration &rarr; potentially more overtime.</strong> This is the dangerous loop &mdash; it captures the real-world dynamic where overworked people become <em>less</em> able to recover, creating a downward spiral. The Psych_Battery makes this spiral visible and uncomfortable enough to break.</p></div>

<h4>Stabilizing Feedback via Data</h4>
<ul class="findings">
  <li><strong>Communication control loop:</strong> Communication data &rarr; battery score &rarr; controls communication apps (e.g. Slack notifications paused) &rarr; communication data changes &rarr; battery adjusts</li>
  <li><strong>AI agent control loop:</strong> AI agent use &rarr; battery score &rarr; controls AI agents (e.g. adds latency to responses) &rarr; agent interaction data changes &rarr; battery adjusts</li>
</ul>

<h3 id="s8-graphs">Step 8: Behavior-Over-Time Graphs</h3>
<p>The graphs from Step 2 above capture the key dynamics. Summarizing what the shapes tell us:</p>
<ul class="findings">
  <li><strong>Trust curve (dip then rise):</strong> Suggests the system needs a grace period. Early trust loss is expected and recoverable if calibration improves visibly. Implication: the first 2 weeks are critical &mdash; if the dip is too deep, users may abandon the device. Consider starting with conservative predictions and gradually increasing specificity.</li>
  <li><strong>Frustration curve (spike then decay):</strong> Suggests the system should be <em>lenient early</em> and <em>stricter later</em>. Aggressive interruptions during the calibration phase would compound frustration with calibration errors. Implication: interruption intensity should ramp up only after the system has demonstrated accuracy.</li>
  <li><strong>Energy curve (daily oscillation with recovery bumps):</strong> Suggests the battery's primary value is making recovery breaks <em>visible</em> and <em>non-negotiable</em>. Without the battery, energy just declines. With it, the recovery bumps create a healthier sawtooth pattern. Implication: the physical form must make the charge state visible at a glance &mdash; peripheral awareness is the core UX requirement.</li>
  <li><strong>Sustainability check:</strong> The trust and frustration curves level off (they don't grow forever), which suggests the system reaches a sustainable equilibrium. The reinforcing overtime spiral (R1) is the main risk &mdash; it needs the balancing loop (B1) to be strong enough to counteract it. If interruptions aren't uncomfortable enough, R1 wins.</li>
</ul>
</div>


<!-- ===== TECH STACK ===== -->
<div class="section" id="sec-stech">
<h2>Technical Implementation Guide</h2>
<p>This section covers how to actually build the Psych_Battery software &mdash; how to collect the data, how to trigger interruptions, and what tools to use. It's written for someone who codes in Python but isn't a software engineer.</p>

<div class="callout"><div class="label">Jargon Guide</div><p>
<strong>API</strong> = a set of rules for talking to another service. Like a restaurant menu: you order (request) and get food back (response).<br>
<strong>MCP</strong> = Model Context Protocol. A USB-C port for AI &mdash; standardizes how AI tools connect to external services. MCP servers wrap regular APIs to make them AI-friendly.<br>
<strong>OAuth</strong> = a security system that lets you grant an app limited access to your account without giving it your password.<br>
<strong>Admin/root privileges</strong> = running a program with "superuser" powers. Required for some hardware/network changes.<br>
<strong>Gamma ramp</strong> = a lookup table that maps pixel colors to what your monitor displays. Lowering it darkens the screen in software.<br>
<strong>Proxy server</strong> = a middleman between your computer and the internet. Traffic passes through it, letting you inspect, delay, or block requests.<br>
<strong>Hosts file</strong> = a text file on your computer that maps website names to IP addresses. Pointing a site to 127.0.0.1 blocks it.<br>
<strong>Heartbeat</strong> = a periodic "I'm still here" message. ActivityWatch uses heartbeats to efficiently track what you're doing without recording every millisecond.
</p></div>

<div class="toc"><h4>Sections</h4><ul>
  <li><a href="#tech-arch">Recommended Architecture</a></li>
  <li><a href="#tech-data">Data Collection</a></li>
  <li><a href="#tech-interrupt">Workflow Interruptions</a></li>
  <li><a href="#tech-mcp">MCP Servers & Integrations</a></li>
  <li><a href="#tech-risks">Risks & Gotchas</a></li>
  <li><a href="#tech-privacy">Privacy & Legal</a></li>
  <li><a href="#tech-phases">Phased Build Plan</a></li>
</ul></div>

<h3 id="tech-arch">Recommended Architecture</h3>
<p>After researching multiple approaches and having them critically reviewed, here's the architecture that balances <strong>feasibility for one person</strong> with <strong>enough data to be useful</strong>:</p>

<div class="flow-diagram">
  <div class="flow-node"><strong>ActivityWatch</strong><br><em>App/web/idle tracking</em></div>
  <span class="flow-arrow">&rarr;</span>
  <div class="flow-node"><strong>Custom Watchers</strong><br><em>Gmail, Slack, AI APIs</em></div>
  <span class="flow-arrow">&rarr;</span>
  <div class="flow-node"><strong>Energy Score<br>Calculator</strong><br><em>Python script</em></div>
  <span class="flow-arrow">&rarr;</span>
  <div class="flow-node"><strong>Intervention<br>Engine</strong><br><em>Notifications, blocks</em></div>
  <span class="flow-arrow">&rarr;</span>
  <div class="flow-node"><strong>Physical Battery</strong><br><em>ESP32 + display</em></div>
</div>

<p><strong>ActivityWatch</strong> is the backbone. It's free, open-source, stores everything locally (privacy-first), runs on Windows/macOS/Linux, and has a Python API. It already tracks which apps you use, which websites you visit, and when you're idle. You write custom "watchers" in Python to feed in additional data (email counts, AI usage, etc.), and everything merges into a unified timeline queryable through one API.</p>

<div class="callout"><div class="label">Critical Caveat: macOS</div><p>ActivityWatch has documented permission issues on macOS &mdash; window title tracking requires Accessibility permissions that can break silently after OS updates. The keystroke library (pynput) also struggles with macOS Sequoia/Sonoma permission changes. <strong>If you're developing on macOS, budget 3-4x extra time for permissions debugging.</strong> Windows is significantly more reliable for this stack.</p></div>

<h3 id="tech-data">Data Collection: Five Streams</h3>

<h4>1. App & Website Time (ActivityWatch &mdash; built-in)</h4>
<p>Install ActivityWatch + its browser extension. Out of the box, you get:</p>
<ul class="findings">
  <li>Time per application (e.g., "VS Code: 3h, Slack: 1.5h, Chrome: 2h")</li>
  <li>Time per website/domain via browser extension</li>
  <li>Idle/AFK detection (mouse/keyboard inactivity)</li>
  <li>All stored locally in SQLite, queryable via REST API on localhost:5600</li>
</ul>
<p><strong>Python access:</strong> <code>pip install aw-client</code>, then query events with date ranges and filters. This alone gives you AI tool time (time on chatgpt.com, claude.ai), social media time, news time, and total screen time.</p>
<p><strong>Difficulty:</strong> Install and run. Minimal code needed.</p>

<h4>2. Communication Volume (Gmail API + Slack API)</h4>
<table class="result-table">
<tr><th>Service</th><th>API</th><th>What You Get</th><th>MCP Server?</th><th>Difficulty</th></tr>
<tr><td>Gmail</td><td>Gmail API <code>messages.list</code></td><td>Message count, timestamps (no content needed)</td><td>Yes &mdash; multiple available</td><td>Medium (OAuth setup)</td></tr>
<tr><td>Slack</td><td>Slack Web API <code>conversations.history</code></td><td>Message counts per channel, timestamps</td><td>Yes &mdash; official MCP server</td><td>Medium (workspace admin approval)</td></tr>
<tr><td>Zoom</td><td>Zoom Report API <code>/report/meetings</code></td><td>Actual call duration (not scheduled)</td><td>No MCP server</td><td>Medium</td></tr>
<tr><td>Outlook/Teams</td><td>Microsoft Graph API</td><td>Email volume, call records</td><td>Partial MCP support</td><td>High (Azure AD auth)</td></tr>
</table>
<p><strong>Key design choice:</strong> Only query message <em>counts</em> and <em>timestamps</em>, never message content. This dramatically reduces privacy risk and keeps your data collection closer to metadata than surveillance.</p>

<h4>3. AI Token Usage (Direct API Calls)</h4>
<table class="result-table">
<tr><th>Provider</th><th>Endpoint</th><th>What You Get</th><th>Access Needed</th></tr>
<tr><td>OpenAI</td><td>Usage API</td><td>Tokens per request, daily costs</td><td>API key + org admin for full Usage API</td></tr>
<tr><td>Anthropic</td><td><code>/v1/organizations/usage_report</code></td><td>Input/output tokens by model, 1-min to 1-day intervals</td><td>Admin API key (<code>sk-ant-admin...</code>)</td></tr>
<tr><td>GitHub Copilot</td><td>Copilot Metrics API</td><td>Acceptance rates, lines generated</td><td>Org admin access</td></tr>
</table>
<p><strong>Simpler alternative:</strong> Skip the API complexity &mdash; ActivityWatch's browser watcher already tracks <em>time</em> on AI tool websites. For a prototype, "minutes spent in ChatGPT" may be a better proxy for cognitive drain than raw token counts.</p>

<h4>4. Typing Cadence (Proceed with Caution)</h4>
<div class="callout"><div class="label">Honest Assessment</div><p>Keystroke monitoring is the <strong>highest-risk, lowest-reward</strong> component. The pynput library silently fails on macOS, requires Accessibility + Input Monitoring permissions, and the data (typing speed, pause patterns) is a weak proxy for mental energy compared to what ActivityWatch gives you for free. <strong>Recommendation: skip this for Phase 1.</strong> If you add it later, use pynput on Windows only, and record only aggregate metrics (keystrokes/minute, not individual keys).</p></div>
<p>If you do build it, the library is <code>pip install pynput</code>, and you'd write a small daemon that counts keystrokes per time window and logs averages to ActivityWatch as a custom watcher.</p>

<h4>5. Work Time / Calendar (Google Calendar API)</h4>
<p>Compare scheduled vs. actual work hours by pulling calendar events and comparing against ActivityWatch's active-time data. Multiple Google Calendar MCP servers exist for this. The key insight: <strong>the gap between scheduled end-of-day and actual last-activity time IS the "overtime" signal</strong> that feeds the Recharge Resistance stock.</p>

<h3 id="tech-interrupt">Workflow Interruptions: What's Actually Feasible</h3>
<p>The interruptions are ordered from simplest to most complex. Start with the top rows; only add the bottom rows if the simple ones aren't enough.</p>

<table class="result-table">
<tr><th>Intervention</th><th>How</th><th>Admin Needed?</th><th>Difficulty</th><th>Platforms</th></tr>
<tr><td><strong>Desktop notifications</strong></td><td><code>pip install desktop-notifier</code> &mdash; supports action buttons ("Take Break" / "Snooze")</td><td>No</td><td>Low</td><td>All</td></tr>
<tr><td><strong>Slack DND</strong></td><td>Slack API <code>dnd.setSnooze</code> &mdash; one API call pauses notifications</td><td>No (needs Slack token)</td><td>Low</td><td>All</td></tr>
<tr><td><strong>Website blocking</strong></td><td>Modify hosts file: <code>127.0.0.1 twitter.com</code></td><td>Yes (one-time)</td><td>Low</td><td>All</td></tr>
<tr><td><strong>Screen dimming (overlay)</strong></td><td>PyQt5 semi-transparent fullscreen window with <code>setWindowOpacity()</code></td><td>No</td><td>Low-Med</td><td>All</td></tr>
<tr><td><strong>Screen dimming (hardware)</strong></td><td><code>pip install screen-brightness-control</code> with <code>fade_brightness()</code></td><td>No (laptops)</td><td>Low</td><td>Windows/Linux</td></tr>
<tr><td><strong>AI tool throttling</strong></td><td>If you mediate API calls: add <code>time.sleep(delay)</code>. If not: hosts file blocking.</td><td>No / Yes</td><td>Low</td><td>All</td></tr>
<tr><td><strong>Network latency</strong></td><td>macOS: pfctl+dummynet. Windows: NetBalancer.</td><td>Yes (root/admin)</td><td>High</td><td>Platform-specific</td></tr>
<tr><td><strong>Frame rate reduction</strong></td><td>Windows: <code>pywin32 ChangeDisplaySettingsEx</code>. macOS: CoreGraphics.</td><td>Yes (Win)</td><td>High</td><td>Platform-specific</td></tr>
</table>

<div class="callout"><div class="label">The 80/20 Rule</div><p>Notifications + Slack DND + website blocking + screen overlay dimming covers 80% of the interruption effect with about 20% of the implementation effort. Network throttling and frame rate reduction are technically impressive but require admin privileges, platform-specific code, and fragile system-level changes. <strong>Build the simple interventions first and see if they're sufficient before adding complexity.</strong></p></div>

<h4>Escalation Pattern</h4>
<p>A suggested four-level escalation as mental energy depletes:</p>
<ul class="findings">
  <li><strong>Level 1 (Yellow zone):</strong> Gentle toast notification with recovery suggestion. Auto-dismisses after 10 seconds. No other changes.</li>
  <li><strong>Level 2 (Orange zone):</strong> Persistent notification with action buttons. Slack DND enabled. Screen dims 15%.</li>
  <li><strong>Level 3 (Red zone):</strong> Distracting websites blocked via hosts file. AI tools throttled. Screen dims 30%. Full-screen overlay notification with break timer.</li>
  <li><strong>Level 4 (Dead battery):</strong> All communication tools paused. AI access blocked. Screen at 50% dim. Only way to recover: physically remove battery and recharge.</li>
</ul>

<p><strong>Critical safety feature:</strong> Implement a "panic button" (global keyboard shortcut) that immediately reverses ALL interventions. This is essential for user trust and for situations where the system misjudges and the user genuinely needs to keep working.</p>

<h3 id="tech-mcp">MCP Servers & When to Use Them</h3>
<p><strong>MCP (Model Context Protocol)</strong> is a standardized way for AI tools to connect to external services. Think of it as a USB-C port for AI &mdash; instead of every AI tool building custom integrations with Gmail, Slack, etc., MCP provides a universal connector.</p>

<table class="result-table">
<tr><th>Service</th><th>MCP Server</th><th>Use It When</th></tr>
<tr><td>Slack</td><td>Official (<code>@modelcontextprotocol/server-slack</code>)</td><td>You want an AI agent to dynamically query Slack based on context</td></tr>
<tr><td>Gmail</td><td>Multiple (GongRzhe/Gmail-MCP-Server, Google Workspace MCP)</td><td>AI needs to search/read email metadata</td></tr>
<tr><td>Google Calendar</td><td>nspady/google-calendar-mcp</td><td>AI needs to check schedule to determine work boundaries</td></tr>
<tr><td>ActivityWatch</td><td>activitywatch-mcp (community)</td><td>AI needs real-time awareness of computer activity</td></tr>
<tr><td>System Monitor</td><td>Multiple (srirama7, abhinav7895)</td><td>AI needs CPU/memory/battery data</td></tr>
</table>

<div class="callout"><div class="label">MCP vs. Direct API Calls &mdash; When to Use Which</div><p>
<strong>Use direct API calls</strong> for your data collection backbone. Psych_Battery runs on a schedule, pulling the same data repeatedly. Direct calls are faster, simpler, and more reliable for deterministic tasks.<br><br>
<strong>Use MCP</strong> if you add an AI agent component that needs to dynamically decide which tools to call based on context. For example, an LLM that looks at your current state and decides "I should check your calendar to see if you have a meeting in 10 minutes before triggering an interruption."<br><br>
<strong>For Phase 1, you don't need MCP.</strong> Direct API calls are sufficient. MCP becomes valuable in Phase 3 when you might add an intelligent agent layer.
</p></div>

<h3 id="tech-risks">Biggest Risks & Gotchas</h3>
<ul class="findings">
  <li><strong>macOS permissions will eat your time alive.</strong> Nearly every component (ActivityWatch, pynput, screen brightness, network throttling) requires different macOS permissions. Each breaks differently after OS updates. If developing on macOS, budget 3-4x the time for permissions debugging. Consider developing on Windows first.</li>
  <li><strong>The API surface area is large.</strong> The full stack touches 10+ different APIs. For one developer, this is a recipe for spending all time on plumbing and none on research. <strong>Start with ActivityWatch + Gmail only.</strong></li>
  <li><strong>Data timestamp synchronization.</strong> Correlating keystroke data (system time) with Gmail timestamps (RFC 3339) with ActivityWatch events (ISO 8601) requires careful normalization. Build a unified timestamp format from day one.</li>
  <li><strong>screen-brightness-control does NOT support macOS.</strong> Despite being cross-platform in name, the pip package only works on Windows and Linux. On macOS, use Hammerspoon (Lua scripting tool) or the overlay approach instead.</li>
  <li><strong>Slack workspace admin approval.</strong> Getting API access to a work Slack requires admin approval, which may be slow or denied. Have a fallback plan (manual logging, or ActivityWatch tracking time in Slack).</li>
</ul>

<h3 id="tech-privacy">Privacy & Legal Considerations</h3>
<div class="callout"><div class="label">UC Berkeley IRB</div><p>If this tool will be used on human subjects (even yourself, if the data informs published research), you likely need IRB approval from UC Berkeley's Committee for the Protection of Human Subjects (CPHS). Keystroke dynamics, communication metadata, and browsing history are considered sensitive data. <strong>If you only self-track and never publish the data as human-subjects research, IRB may not apply</strong> &mdash; but consult CPHS to be sure.</p></div>

<ul class="findings">
  <li><strong>Never store key content.</strong> Keystroke monitoring must record only aggregate metrics (keystrokes/minute, pause lengths), never which keys were pressed. This is the line between "typing dynamics monitor" and "keylogger."</li>
  <li><strong>Never read email/Slack content.</strong> Query message <em>counts</em> and <em>timestamps</em> only. Use metadata-only API calls.</li>
  <li><strong>Track domains, not URLs.</strong> Browser data should record "twitter.com: 45 min" not full page URLs (which can reveal sensitive information).</li>
  <li><strong>Local-first architecture.</strong> Store everything on the user's machine. Never upload to cloud without explicit consent. ActivityWatch's model is the template.</li>
  <li><strong>California law (2025):</strong> New workplace surveillance regulations require 14-day written notice before monitoring employees. This applies if you ever deploy to a team. For self-use, it's less relevant.</li>
  <li><strong>Encryption at rest.</strong> All collected data should be encrypted on disk. If the user's machine is compromised, a pre-built surveillance infrastructure is a gift to attackers.</li>
</ul>

<h3 id="tech-phases">Phased Build Plan</h3>
<p>Designed to get a working prototype as fast as possible, then layer in complexity only where needed.</p>

<h4>Phase 1: Data Collection (Week 1-2)</h4>
<table class="result-table">
<tr><th>Component</th><th>Tool</th><th>New Code</th></tr>
<tr><td>App/window tracking</td><td>ActivityWatch (install + run)</td><td>0 lines</td></tr>
<tr><td>Browser tracking</td><td>ActivityWatch browser extension</td><td>0 lines</td></tr>
<tr><td>AI tool time</td><td>ActivityWatch (tracks time on chatgpt.com, claude.ai)</td><td>0 lines</td></tr>
<tr><td>Email volume</td><td>Gmail API (<code>messages.list</code>, counts only)</td><td>~80 lines</td></tr>
<tr><td>Energy score calculator</td><td>Python script querying ActivityWatch + Gmail data</td><td>~120 lines</td></tr>
<tr><td>Data store</td><td>ActivityWatch's built-in SQLite + small CSV for Gmail</td><td>Trivial</td></tr>
</table>
<p><strong>Total: ~200 lines of Python. Two APIs (ActivityWatch local, Gmail).</strong></p>

<h4>Phase 2: Interventions (Week 3-4)</h4>
<table class="result-table">
<tr><th>Intervention</th><th>Tool</th><th>New Code</th></tr>
<tr><td>Notifications</td><td><code>desktop-notifier</code></td><td>~40 lines</td></tr>
<tr><td>Slack DND</td><td>Slack <code>dnd.setSnooze</code> API</td><td>~20 lines</td></tr>
<tr><td>Website blocking</td><td>Hosts file modification script</td><td>~30 lines</td></tr>
<tr><td>Screen dimming</td><td>PyQt5 overlay OR OS-level Night Shift/f.lux</td><td>~50 lines or 0</td></tr>
<tr><td>Physical battery output</td><td>Serial/WiFi to ESP32</td><td>~40 lines</td></tr>
</table>
<p><strong>Total: ~180 lines. One new API (Slack DND).</strong></p>

<h4>Phase 3: Enrichment (Only if Phase 1-2 work)</h4>
<ul class="findings">
  <li>Add Anthropic/OpenAI usage API polling for precise token tracking</li>
  <li>Add pynput keystroke timing (Windows only)</li>
  <li>Add Zoom API for call duration</li>
  <li>Add MCP servers for AI agent integration</li>
  <li>Add network throttling and frame rate reduction (admin-gated)</li>
  <li>Build richer PyQt5 overlay with break timer and progress visualization</li>
</ul>

<div class="callout"><div class="label">Design Philosophy</div><p>This phased approach optimizes for <strong>"get clean data and validate the concept"</strong> rather than feature completeness. Phase 1 + Phase 2 together are about 380 lines of Python and touch only 3 external APIs. That's buildable in two weekends. Phase 3 is only worth doing after you've confirmed the core loop (data &rarr; energy score &rarr; intervention &rarr; recovery) actually works.</p></div>
</div>

<!-- ===== DATA SIGNALS ===== -->
<div class="section" id="sec-ssignals">
<h2>Passive Data Signals: What We Collect &amp; How</h2>
<p>The battery is only as good as the signals feeding it. This tab inventories every passive data source we can reasonably collect from a knowledge-worker's digital exhaust, the exact API or system hook that produces it, what we keep vs. drop, and how we keep it private. Self-report is intentionally excluded from the main loop &mdash; it's only used for <em>one-time calibration</em>. Every signal below is something a laptop, phone, or watch can observe without the user re-typing their day.</p>

<div class="callout"><div class="label">Three design principles</div>
<p><strong>1. Local-first.</strong> All raw signals are stored on-device in SQLite (ActivityWatch + our own tables). Only a derived score leaves the machine, and only to the battery itself over LAN.<br>
<strong>2. Minimum viable data.</strong> For each source we explicitly list <em>fields to keep</em> and <em>fields to drop</em>. Message bodies, URLs beyond hostname, and document contents never hit disk.<br>
<strong>3. Three axes, not one.</strong> Every signal is tagged as contributing to <span style="color:#b45309"><strong>Energy (E)</strong></span>, <span style="color:#7f1d1d"><strong>Stress (S)</strong></span>, or <span style="color:#065f46"><strong>Fulfillment (F)</strong></span> &mdash; often multiple. See the Scoring Algorithms tab for how these combine.</p></div>

<details class="section-fold" open><summary>Table of Contents</summary>
<div class="section-body">
<div class="toc"><ul>
  <li><a href="#sig-cal">1. Calendar signals (Google, Outlook)</a></li>
  <li><a href="#sig-comms">2. Communications metadata (Slack, Teams, Gmail)</a></li>
  <li><a href="#sig-rhythm">3. Work-rhythm (ActivityWatch: windows, AFK, web)</a></li>
  <li><a href="#sig-keys">4. Keystroke &amp; mouse cadence (CGEventTap, Win32 hooks)</a></li>
  <li><a href="#sig-todo">5. To-do &amp; task systems (Todoist, Linear, Notion, Reminders)</a></li>
  <li><a href="#sig-rest">6. Rest &amp; recovery (DRAMMA-weighted categories)</a></li>
  <li><a href="#sig-social">7. Social media &amp; AI-tool use (ActivityWatch rules)</a></li>
  <li><a href="#sig-wear">8. Wearables (Oura, Whoop, HealthKit)</a></li>
  <li><a href="#sig-ctx">9. Environmental context (Wi-Fi SSID, audio mic flag)</a></li>
  <li><a href="#sig-mvp">MVP stack: the 7 signals to ship first</a></li>
  <li><a href="#sig-2026">2025&ndash;2026 API cheat sheet</a></li>
  <li><a href="#sig-privacy">Privacy posture &amp; what we <em>never</em> collect</a></li>
</ul></div>
</div></details>

<h3 id="sig-cal">1. Calendar signals</h3>
<details class="section-fold"><summary>Google Calendar + Outlook &mdash; meeting load, fragmentation, deep-work windows</summary>
<div class="section-body">
<p>Calendar is the single highest-signal passive source for knowledge work. We can infer meeting density, back-to-back pressure, video-call load, after-hours creep, and (critically) the <em>gaps</em> that represent possible deep-work windows &mdash; all without reading a single meeting title.</p>

<h4>Google Calendar API</h4>
<ul class="findings">
  <li><strong>Scope:</strong> <code>https://www.googleapis.com/auth/calendar.events.readonly</code> (read-only, no write).</li>
  <li><strong>Auth:</strong> Loopback OAuth on <code>http://127.0.0.1:PORT</code> &mdash; a desktop client flow, no secrets shipped.</li>
  <li><strong>Endpoint:</strong> <code>GET /calendars/primary/events?timeMin=&amp;timeMax=&amp;singleEvents=true&amp;orderBy=startTime</code>.</li>
  <li><strong>Incremental sync:</strong> use <code>syncToken</code> after first full pull &mdash; each poll is then O(changes).</li>
</ul>

<p><strong>Fields we keep:</strong> <code>start.dateTime</code>, <code>end.dateTime</code>, <code>attendees.length</code>, <code>conferenceData.conferenceId ? true : false</code> (video? yes/no), <code>organizer.self</code> (am I the host?), <code>responseStatus</code> (accepted/declined/tentative), <code>recurringEventId ? true : false</code>.</p>
<p><strong>Fields we drop immediately:</strong> <code>summary</code> (title), <code>description</code>, <code>location</code>, attendee emails, attachments, every free-text field.</p>

<details class="code-fold"><summary>Minimal loader (Python, google-auth-oauthlib)</summary>
<pre class="code-block"><code># calendar_loader.py -- pulls only what we need, drops everything else
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
SCOPES = ['https://www.googleapis.com/auth/calendar.events.readonly']

def load_today(creds):
    svc = build('calendar', 'v3', credentials=creds)
    events = svc.events().list(
        calendarId='primary',
        timeMin=today_start_iso(), timeMax=today_end_iso(),
        singleEvents=True, orderBy='startTime',
        fields='items(start,end,attendees,conferenceData(conferenceId),organizer,responseStatus,recurringEventId)'
    ).execute().get('items', [])
    return [{
        'start': e['start'].get('dateTime'),
        'end':   e['end'].get('dateTime'),
        'n_attendees': len(e.get('attendees', [])),
        'is_video':  bool(e.get('conferenceData', {}).get('conferenceId')),
        'is_self_org': e.get('organizer', {}).get('self', False),
        'response': e.get('responseStatus', 'accepted'),
        'recurring': bool(e.get('recurringEventId')),
    } for e in events]</code></pre></details>

<h4>Microsoft Graph (Outlook / Teams calendar)</h4>
<ul class="findings">
  <li><strong>Scope:</strong> <code>Calendars.Read</code> (delegated).</li>
  <li><strong>Endpoint:</strong> <code>GET /me/calendarView?startDateTime=&amp;endDateTime=&amp;$select=start,end,attendees,isOnlineMeeting,organizer,showAs</code>.</li>
  <li><strong>Delta queries:</strong> <code>/me/calendarView/delta</code> returns only what changed &mdash; same incremental-sync pattern as Google.</li>
</ul>

<p><strong>Derived features we compute from calendar alone:</strong></p>
<ul class="findings">
  <li><code>meeting_density</code> &mdash; meeting minutes / available-hour minutes (excluding lunch + blocked).</li>
  <li><code>b2b_run_max</code> &mdash; longest back-to-back streak with gaps &le; 5 min.</li>
  <li><code>video_load_min</code> &mdash; total minutes on <code>isOnlineMeeting=true</code>.</li>
  <li><code>fragmentation</code> &mdash; count of sub-30-min gaps between meetings (too-short deep-work slots).</li>
  <li><code>after_hours_meetings</code> &mdash; meetings ending after 18:00 local or before 08:00.</li>
  <li><code>longest_gap_min</code> &mdash; the biggest unbroken window today (the battery lights up green here).</li>
</ul>

<p><strong>Privacy posture:</strong> We never store <em>who</em> you met with, only how many. A meeting with 2 people and one with 20 look identical to the algorithm except in the <code>n_attendees</code> scalar &mdash; no names, no emails, no titles.</p>
</div></details>

<h3 id="sig-comms">2. Communications metadata</h3>
<details class="section-fold"><summary>Slack, Microsoft Teams, Gmail &mdash; counts &amp; timing, never content</summary>
<div class="section-body">
<p>Message <em>volume and timing</em> is a strong stress predictor (off-hours pings correlate with HRV suppression in every major study since 2018). We collect counts, timestamps, and sender-role flags. We never read a single character of message text.</p>

<h4>Slack (granular scopes only &mdash; legacy custom bots are dead since March 2025)</h4>
<ul class="findings">
  <li><strong>App type:</strong> Slack "granular app" with user token (not bot token), installed to your own workspace.</li>
  <li><strong>Scopes:</strong> <code>channels:history</code>, <code>groups:history</code>, <code>im:history</code>, <code>users:read</code> &mdash; request only scopes you need; scope additions trigger reinstall.</li>
  <li><strong>Events API:</strong> subscribe to <code>message.channels</code>, <code>message.groups</code>, <code>message.im</code>. Classic apps lose Events API November 2026 &mdash; granular apps are the forward-compatible path.</li>
  <li><strong>What we keep per event:</strong> <code>channel_type</code> (dm/group/public), <code>ts</code> (timestamp), <code>thread_ts ? true : false</code>, sender-is-self flag, length bucket (short/medium/long, from <code>text.length</code> computed <em>in-memory then discarded</em>).</li>
  <li><strong>What we drop:</strong> <code>text</code>, <code>files</code>, <code>attachments</code>, <code>blocks</code>, user IDs of others (hashed or dropped).</li>
</ul>

<h4>Microsoft Teams via Graph</h4>
<ul class="findings">
  <li><strong>Scope:</strong> <code>ChannelMessage.Read.All</code> + <code>Chat.Read</code>.</li>
  <li><strong>Endpoint:</strong> <code>GET /me/chats/getAllMessages/delta</code> and <code>/teams/{id}/channels/{id}/messages/delta</code>.</li>
  <li>Same keep/drop policy as Slack.</li>
</ul>

<h4>Gmail (metadata-only scope)</h4>
<ul class="findings">
  <li><strong>Scope:</strong> <code>gmail.metadata</code> &mdash; headers and labels only, no body, no snippet. Critical: you <em>cannot</em> combine <code>gmail.metadata</code> with a <code>q=</code> query parameter; you list all IDs then fetch individually.</li>
  <li><strong>What we keep:</strong> <code>internalDate</code>, <code>labelIds</code> (INBOX/IMPORTANT/CATEGORY_*), <code>threadId</code>, header-only: from-domain (hashed), to-count.</li>
  <li><strong>Derived:</strong> inbox-arrival rate by hour, after-hours inbound ratio, thread-depth distribution.</li>
</ul>

<details class="code-fold"><summary>Slack event handler (Python, slack_bolt)</summary>
<pre class="code-block"><code># slack_listener.py -- count-only, content-free
from slack_bolt import App
app = App(token=os.environ['SLACK_USER_TOKEN'])

@app.event("message")
def handle_message(event, logger):
    # drop bot messages and edits
    if event.get('subtype') in ('bot_message','message_changed','message_deleted'): return
    len_bucket = 's' if len(event.get('text','')) &lt; 40 else ('m' if len(event['text']) &lt; 200 else 'l')
    db.execute(
        "INSERT INTO msg_events(ts, channel_type, is_thread, is_self, len_bucket) VALUES(?,?,?,?,?)",
        (float(event['ts']),
         event.get('channel_type','unknown'),
         'thread_ts' in event,
         event['user'] == MY_USER_ID,
         len_bucket)
    )
    # note: we never store event['text']</code></pre></details>

<p><strong>Derived features from comms metadata:</strong> <code>msgs_per_hour</code>, <code>after_hours_msgs</code>, <code>dm_burst_ratio</code> (DMs / total), <code>thread_depth_mean</code>, <code>interrupt_index</code> (messages arriving while an ActivityWatch focus session is open).</p>
</div></details>

<h3 id="sig-rhythm">3. Work-rhythm: ActivityWatch (windows, AFK, web)</h3>
<details class="section-fold"><summary>The canonical open-source passive-activity logger</summary>
<div class="section-body">
<p><a href="https://activitywatch.net/" target="_blank">ActivityWatch</a> v0.13.2 is the backbone. It runs locally, stores everything in a local SQLite database at <code>~/.local/share/activitywatch/</code> (Linux), <code>~/Library/Application Support/activitywatch/</code> (macOS), or <code>%LOCALAPPDATA%\activitywatch\</code> (Windows). Three default watchers plus a browser extension give us everything.</p>

<ul class="findings">
  <li><strong>aw-watcher-window:</strong> active-window title + app every 1 s. We keep <em>app bundle ID</em> and <em>window-title hash</em>, drop the raw title.</li>
  <li><strong>aw-watcher-afk:</strong> AFK/active state, driven by keyboard + mouse idle time (default 180 s threshold).</li>
  <li><strong>aw-watcher-web:</strong> Manifest V3 browser extension (Chrome, Firefox, Edge). We keep <em>hostname only</em>, drop full URL and title.</li>
  <li><strong>Query API:</strong> <code>POST http://localhost:5600/api/0/query/</code> with an AWQL query returns aggregated events &mdash; no need to reinvent aggregation.</li>
</ul>

<p><strong>macOS Sequoia gotcha (2024+):</strong> aw-watcher-window needs Accessibility permission (System Settings &rarr; Privacy &amp; Security &rarr; Accessibility) <em>and</em> Screen Recording permission (for window titles, though we don't keep them). Without both, you get empty events and silent failure. Document this in the build guide &mdash; it's the #1 new-user drop-off.</p>

<details class="code-fold"><summary>Minimal AWQL query (last 24h, grouped by app)</summary>
<pre class="code-block"><code># aw_query.py
import requests, json
AWQL = '''
events = query_bucket(find_bucket("aw-watcher-window_"));
afk = query_bucket(find_bucket("aw-watcher-afk_"));
events = filter_period_intersect(events, filter_keyvals(afk, "status", ["not-afk"]));
RETURN = merge_events_by_keys(events, ["app"]);
'''
def query(start, end):
    r = requests.post('http://localhost:5600/api/0/query/', json={
        'query': [AWQL],
        'timeperiods': [f'{start}/{end}']
    })
    return r.json()[0]   # list of {app, duration, ...}</code></pre></details>

<p><strong>Derived features:</strong> <code>focus_session_count</code> (&ge; 25 min uninterrupted single-app), <code>focus_session_mean_len</code>, <code>context_switches_per_hour</code> (app changes), <code>afk_breaks_10min+</code>, <code>deep_work_minutes</code> (focus session on category = "creation/coding/writing").</p>
</div></details>

<h3 id="sig-keys">4. Keystroke &amp; mouse cadence</h3>
<details class="section-fold"><summary>Intensity without content &mdash; rates only, zero keylogging</summary>
<div class="section-body">
<p>Raw typing content is off-limits. But <em>rate</em> &mdash; keystrokes per minute, mouse clicks per minute, idle-to-burst ratios &mdash; is a useful fatigue proxy. Typing slows measurably under cognitive load and sleep debt (multiple studies 2019&ndash;2024). We aggregate to per-minute counts in a ring buffer and never store which keys were pressed.</p>

<p><strong>macOS:</strong> <code>CGEventTap</code> in a Swift LSUIElement background agent. (Do <em>not</em> use <code>pynput</code> &mdash; it's been broken on Apple Silicon + Xcode 15+ since 2024.) Requires Input Monitoring permission.</p>

<p><strong>Windows:</strong> <code>SetWindowsHookEx(WH_KEYBOARD_LL, ...)</code> low-level keyboard hook, or the Rust <code>rdev</code> crate (cross-platform, maintained).</p>

<p><strong>Linux/Wayland:</strong> gets ugly &mdash; no unprivileged global keyboard hook on Wayland. Options: libinput record (root), or skip this signal and rely on ActivityWatch's window-event rate as a proxy.</p>

<details class="code-fold"><summary>macOS CGEventTap — counts only, in Swift</summary>
<pre class="code-block"><code>// KeyCountTap.swift  — LSUIElement agent, ~40 lines
import Cocoa
var buckets: [Int: Int] = [:]   // minute-of-epoch -&gt; count
let mask = (1 &lt;&lt; CGEventType.keyDown.rawValue) | (1 &lt;&lt; CGEventType.leftMouseDown.rawValue)
let tap = CGEvent.tapCreate(
    tap: .cgSessionEventTap, place: .headInsertEventTap,
    options: .listenOnly, eventsOfInterest: CGEventMask(mask),
    callback: { _, _, event, _ in
        let m = Int(Date().timeIntervalSince1970 / 60)
        buckets[m, default: 0] += 1      // count only; event discarded
        return Unmanaged.passUnretained(event)
    }, userInfo: nil)!
CFRunLoopAddSource(CFRunLoopGetCurrent(),
    CFMachPortCreateRunLoopSource(nil, tap, 0), .commonModes)
CGEvent.tapEnable(tap: tap, enable: true)
// every 60s, flush buckets to SQLite, clear buffer
Timer.scheduledTimer(withTimeInterval: 60, repeats: true) { _ in flushToDB() }
CFRunLoopRun()</code></pre></details>

<p><strong>Derived:</strong> <code>kpm_p50</code>, <code>kpm_p95</code>, <code>kpm_during_meetings</code> (proxy for multitasking in calls), <code>typing_session_length</code>, <code>burst_idleness</code> (variance in inter-key intervals).</p>

<p><strong>Privacy invariant:</strong> the callback increments a counter and returns immediately. <code>event</code> is never copied, dereferenced for content, or persisted. Even a core dump wouldn't contain keystrokes.</p>
</div></details>

<h3 id="sig-todo">5. To-do &amp; task systems</h3>
<details class="section-fold"><summary>Progress Principle signal &mdash; completions as fulfillment</summary>
<div class="section-body">
<p>Amabile &amp; Kramer's <em>Progress Principle</em> (2011) shows small wins are the single strongest daily-mood predictor in knowledge work. Completed tasks are therefore a key Fulfillment (F-axis) input &mdash; and they're trivial to observe passively.</p>

<h4>Todoist</h4>
<ul class="findings">
  <li><strong>API:</strong> Todoist Unified API <strong>v1</strong> &mdash; this replaced v2 and Sync v9 in 2025. The old <code>api.todoist.com/rest/v2</code> endpoints are deprecated; use <code>api.todoist.com/api/v1</code>.</li>
  <li><strong>Auth:</strong> Personal API token from user's settings, or OAuth2 for distributed apps.</li>
  <li><strong>Endpoint:</strong> <code>GET /tasks/completed</code> for done-today; <code>GET /tasks/filter</code> for active.</li>
  <li><strong>Keep:</strong> <code>completed_at</code>, <code>project_id</code> (hashed), priority, duration-since-created. <strong>Drop:</strong> task content, description, labels text.</li>
</ul>

<h4>Linear</h4>
<ul class="findings">
  <li><strong>API:</strong> GraphQL at <code>https://api.linear.app/graphql</code>.</li>
  <li><strong>Query:</strong> <code>issues(filter: {completedAt: {gte: $today}}) { nodes { completedAt priority estimate team { id } } }</code>.</li>
  <li>Same keep/drop: completion timestamps, priority, estimate points; drop title/description.</li>
</ul>

<h4>Notion</h4>
<ul class="findings">
  <li><strong>API version:</strong> <code>2025-09-03</code> &mdash; this is a breaking change. You now query against <code>data_source_id</code>, not <code>database_id</code>. Older code breaks silently.</li>
  <li>Useful if the user manages tasks in a Notion DB with a "Status" or "Done" checkbox property.</li>
</ul>

<h4>Apple Reminders</h4>
<ul class="findings">
  <li><strong>Framework:</strong> EventKit (<code>EKReminder</code>, <code>EKEventStore.fetchReminders(matching:)</code>).</li>
  <li>Native, no auth. Requires <code>NSRemindersUsageDescription</code> in Info.plist and user grant.</li>
</ul>

<p><strong>Derived features:</strong> <code>tasks_completed_today</code>, <code>high_prio_done</code>, <code>streak_days</code>, <code>completion_spread</code> (all at 5pm = crunch; spread across day = sustainable), <code>carry_over_count</code> (tasks moved to tomorrow &mdash; negative F, positive S).</p>
</div></details>

<h3 id="sig-rest">6. Rest &amp; recovery (DRAMMA-weighted)</h3>
<details class="section-fold"><summary>Newman, Tay &amp; Diener (2014) &mdash; the six ingredients of psychological recovery</summary>
<div class="section-body">
<p>DRAMMA is the best-validated framework for <em>what kind</em> of break actually recovers energy. Not all breaks are equal &mdash; scrolling Twitter for 10 min recovers almost nothing; a 10-min walk outside recovers substantially.</p>

<table class="components"><thead><tr><th>DRAMMA component</th><th>What it is</th><th>Passive signal we can catch</th><th>Recovery weight</th></tr></thead>
<tbody>
<tr><td><strong>D</strong>etachment</td><td>Mental disengagement from work</td><td>AFK &ge; 10 min + no work-app foreground + (optional) phone lock state</td><td>+++</td></tr>
<tr><td><strong>R</strong>elaxation</td><td>Low-arousal positive state</td><td>HRV rise (Oura/Whoop/Watch), mindfulness app opens, HealthKit <code>mindfulSession</code></td><td>+++</td></tr>
<tr><td><strong>A</strong>utonomy</td><td>Self-chosen activity</td><td>Hard to detect passively; proxy: non-calendar time, non-work apps</td><td>++</td></tr>
<tr><td><strong>M</strong>astery</td><td>Challenging non-work skill-building</td><td>App category = "hobby" (Duolingo, music apps, GitHub on personal repos)</td><td>++</td></tr>
<tr><td><strong>M</strong>eaning</td><td>Values-aligned activity</td><td>Not passively detectable; user one-time tags favorite apps as "meaningful"</td><td>++</td></tr>
<tr><td><strong>A</strong>ffiliation</td><td>Positive social contact</td><td>Calendar event with <code>n_attendees&ge;2</code> + non-work + video/in-person</td><td>+++</td></tr>
</tbody></table>

<p><strong>Additional high-value recovery signals:</strong></p>
<ul class="findings">
  <li><strong>Outdoor / nature minutes:</strong> iOS motion sensor + GPS "outdoor" heuristic (Apple Health's <em>time in daylight</em> since iOS 17), or Android's activity-recognition API. Attention Restoration Theory (Kaplan, Berman) &mdash; 20 min in greenspace measurably restores executive-function test scores.</li>
  <li><strong>Synchronous voice/in-person social:</strong> calendar + Zoom/Meet/Teams active-call detection via app foregrounding. Holt-Lunstad meta-analyses (2010, 2015) put social connection mortality effect at OR 1.50 &mdash; larger than smoking.</li>
  <li><strong>Sleep continuity:</strong> wearable sleep stages, or iOS/Android sleep schedule. 7+ h continuous sleep &rarr; detaches S-axis the next day.</li>
</ul>
</div></details>

<h3 id="sig-social">7. Social media &amp; AI-tool use</h3>
<details class="section-fold"><summary>ActivityWatch categorization rules &mdash; the easy parts and the hard parts</summary>
<div class="section-body">
<p>ActivityWatch already supports a category-rule engine at <a href="http://localhost:5600/#/settings" target="_blank">localhost:5600/#/settings</a>. We ship a starter ruleset and let the user edit.</p>

<p><strong>Easy (clear categories):</strong></p>
<ul class="findings">
  <li><strong>Social media:</strong> <code>twitter.com|x.com|instagram.com|tiktok.com|facebook.com|reddit.com|youtube.com|threads.net|bsky.app</code> &rarr; category <code>social_passive</code>. Negative Energy on &gt;20 min, zero Fulfillment.</li>
  <li><strong>AI tools &mdash; conversational:</strong> <code>claude.ai|chatgpt.com|gemini.google.com|perplexity.ai|poe.com</code> &rarr; category <code>ai_chat</code>. Neutral on short sessions; fatigue-inducing on &gt;90 min.</li>
  <li><strong>AI tools &mdash; coding:</strong> Cursor, Windsurf, Zed bundle-IDs; JetBrains + Copilot plugin; VS Code + any *.copilot extension. Category <code>ai_code</code>.</li>
  <li><strong>Meeting apps:</strong> <code>zoom.us</code>, Zoom desktop bundle, MSFT Teams bundle, Google Meet tab. Category <code>meeting</code>.</li>
</ul>

<p><strong>Hard:</strong> distinguishing "scrolling Twitter as break" from "scrolling Twitter because I'm avoiding a hard task." We don't try &mdash; we just count minutes and let Model B's stress/energy coupling surface it (high stress + high social_passive = the avoidance signature).</p>

<details class="code-fold"><summary>Example ActivityWatch category JSON</summary>
<pre class="code-block"><code>{
  "categories": [
    {"name":["Work","Code"], "rule":{"type":"regex","regex":"vscode|code-insiders|Cursor|Windsurf|JetBrains|Xcode"}},
    {"name":["Work","AI","chat"], "rule":{"type":"regex","regex":"claude\\.ai|chatgpt|perplexity|gemini"}},
    {"name":["Work","Comms"], "rule":{"type":"regex","regex":"Slack|Teams|Outlook|Gmail|mail\\.google"}},
    {"name":["Rest","Social-passive"], "rule":{"type":"regex","regex":"twitter|x\\.com|instagram|tiktok|reddit|youtube|threads|bsky"}},
    {"name":["Rest","Mastery"], "rule":{"type":"regex","regex":"Duolingo|Anki|GitHub.*\\/personal"}}
  ]
}</code></pre></details>
</div></details>

<h3 id="sig-wear">8. Wearables (Oura, Whoop, HealthKit)</h3>
<details class="section-fold"><summary>HRV, sleep debt, readiness &mdash; the most direct S-axis measurements we have</summary>
<div class="section-body">
<p>Heart-rate variability (RMSSD or SDNN, 2&ndash;5 min recording) is the single most validated allostatic-load biomarker. Thayer's neurovisceral-integration model (2009, and every follow-up) ties low HRV to reduced executive function. If the user already wears a device, we should ingest its signals.</p>

<h4>Oura (v2 API)</h4>
<ul class="findings">
  <li><strong>Auth:</strong> Personal Access Token &mdash; requires <em>active Oura membership</em>. A user without membership can't grant us data even if they own the ring. This is a hard change from v1.</li>
  <li><strong>Endpoints we use:</strong> <code>/v2/usercollection/daily_readiness</code>, <code>/v2/usercollection/daily_sleep</code>, <code>/v2/usercollection/daily_activity</code>, <code>/v2/usercollection/heartrate</code>.</li>
  <li><strong>Keep:</strong> readiness_score, hrv_balance, sleep_score, total_sleep_duration, efficiency, activity_score, average_resting_heart_rate.</li>
</ul>

<h4>Whoop</h4>
<ul class="findings">
  <li><strong>Auth:</strong> OAuth2. Scopes: <code>read:recovery read:sleep read:workout read:cycles</code>.</li>
  <li><strong>Endpoints:</strong> <code>/v1/recovery</code>, <code>/v1/sleep</code>, <code>/v1/cycle</code>.</li>
  <li><strong>Keep:</strong> recovery_score, hrv (rmssd), resting_heart_rate, sleep_performance_pct, strain.</li>
</ul>

<h4>Apple HealthKit (if we ship a macOS companion)</h4>
<ul class="findings">
  <li>Apple Watch HRV lives in <code>HKQuantityTypeIdentifierHeartRateVariabilitySDNN</code>.</li>
  <li>Mindfulness sessions: <code>HKCategoryTypeIdentifierMindfulSession</code>.</li>
  <li>Daylight: <code>HKQuantityTypeIdentifierTimeInDaylight</code> (iOS 17+).</li>
  <li>Sleep: <code>HKCategoryTypeIdentifierSleepAnalysis</code> with the post-iOS-16 stages (Core/REM/Deep).</li>
</ul>

<p><strong>If no wearable:</strong> we degrade gracefully. Sleep debt can be estimated from first-window-event-of-morning + last-event-of-night timestamps (ActivityWatch-derived "device-active hours"). HRV becomes unavailable; Model B just runs without it and weights the S-compartment more on fragmentation + after-hours-comms.</p>
</div></details>

<h3 id="sig-ctx">9. Environmental context</h3>
<details class="section-fold"><summary>Wi-Fi SSID hashing for home/office/cafe detection; mic-in-use flag</summary>
<div class="section-body">
<p>Where you are physically shapes what counts as "focus" or "rest." We don't need GPS &mdash; SSID of the connected network is enough. We hash it so the raw name never touches disk.</p>

<h4>Wi-Fi SSID (macOS)</h4>
<ul class="findings">
  <li><strong>Post-Sequoia (macOS 15+):</strong> <code>airport -I</code> is gone and <code>networksetup -getairportnetwork</code> no longer returns SSID without Location Services. The sanctioned path is now <code>CoreWLAN</code>.</li>
  <li><strong>Framework:</strong> <code>CWWiFiClient.shared().interface()?.ssid()</code> from Swift or ObjC. Requires Location Services permission (ironically), but returns the SSID.</li>
</ul>

<details class="code-fold"><summary>Swift SSID probe — hash + bucket</summary>
<pre class="code-block"><code>// SSIDProbe.swift
import CoreWLAN, CryptoKit
func currentSSIDHash() -&gt; String? {
    guard let ssid = CWWiFiClient.shared().interface()?.ssid() else { return nil }
    let h = SHA256.hash(data: Data(ssid.utf8))
    return h.prefix(6).map { String(format: "%02x", $0) }.joined()  // 12-char hash
}
// first run: ask user to label hashes: "home", "office", "cafe".
// from then on, just the hash is stored.</code></pre></details>

<h4>Wi-Fi SSID (Windows)</h4>
<p><code>netsh wlan show interfaces</code> returns SSID &mdash; same hash-and-bucket approach.</p>

<h4>Microphone / camera in-use flag</h4>
<p>macOS: Audio Services / AVCaptureDevice "in use" notifications &mdash; a proxy for "currently in a call." Windows: <code>Windows.Media.Capture</code> camera-in-use event. We don't record audio; we just flag "currently on a call" which is a better signal than "Zoom is foregrounded" (you might be on a call with Slack foregrounded).</p>
</div></details>

<h3 id="sig-mvp">MVP stack: the 7 signals to ship first</h3>
<details class="section-fold" open><summary>What actually goes in v1 &mdash; the 80/20 list</summary>
<div class="section-body">
<p>Collecting everything above is months of work. To validate the battery concept, ship with <em>these seven</em> and nothing else:</p>

<ol class="findings">
  <li><strong>Google Calendar</strong> (read-only) &mdash; meeting density, b2b runs, video load, longest gap.</li>
  <li><strong>ActivityWatch window + AFK</strong> &mdash; focus sessions, context switches, idle breaks.</li>
  <li><strong>ActivityWatch web extension</strong> &mdash; social-media minutes, AI-chat minutes, meeting-app minutes.</li>
  <li><strong>Slack message metadata</strong> (self-installed granular app) &mdash; msgs/hour, after-hours, DM-burst.</li>
  <li><strong>Gmail metadata</strong> &mdash; inbox-arrival rate, after-hours ratio.</li>
  <li><strong>Todoist completions</strong> (or Reminders on macOS) &mdash; Progress Principle / Fulfillment signal.</li>
  <li><strong>Wearable HRV + sleep</strong> if available (Oura or Whoop); otherwise skip and document the degraded mode.</li>
</ol>

<details class="code-fold"><summary>The v1 SQLite schema</summary>
<pre class="code-block"><code>-- schema.sql
CREATE TABLE cal_events   (ts INT, dur_s INT, n_att INT, is_video INT, is_self_org INT, response TEXT);
CREATE TABLE msg_events   (ts REAL, channel_type TEXT, is_thread INT, is_self INT, len_bucket TEXT, source TEXT);
CREATE TABLE mail_events  (ts INT, label TEXT, from_domain_hash TEXT);
CREATE TABLE aw_focus     (start INT, dur_s INT, app_category TEXT);
CREATE TABLE aw_afk       (start INT, dur_s INT);
CREATE TABLE aw_web       (ts INT, dur_s INT, hostname TEXT, category TEXT);
CREATE TABLE tasks_done   (ts INT, project_hash TEXT, priority INT, age_days INT);
CREATE TABLE wear_daily   (date TEXT PRIMARY KEY, hrv REAL, sleep_h REAL, readiness INT, rhr INT);
CREATE TABLE kpm_minute   (minute INT PRIMARY KEY, count INT, src TEXT);
CREATE TABLE ctx_minute   (minute INT PRIMARY KEY, ssid_hash TEXT, on_call INT);
-- derived / cached:
CREATE TABLE features_5m  (ts INT PRIMARY KEY, meeting_density REAL, fragmentation REAL,
                           focus_frac REAL, ctx_switches INT, msgs_ph REAL,
                           social_min REAL, ai_min REAL, hrv_z REAL, sleep_debt_h REAL);
CREATE TABLE score_5m     (ts INT PRIMARY KEY, E REAL, S REAL, F REAL, model TEXT);</code></pre></details>
</div></details>

<h3 id="sig-2026">2025&ndash;2026 API cheat sheet</h3>
<details class="section-fold"><summary>Things that changed recently and will break your build if you copy old tutorials</summary>
<div class="section-body">
<table class="components"><thead><tr><th>Area</th><th>Old (deprecated)</th><th>Current (2025&ndash;2026)</th></tr></thead><tbody>
<tr><td>Slack apps</td><td>Legacy custom bots</td><td>Granular apps (legacy dies March 2025; classic-app Events API dies Nov 2026)</td></tr>
<tr><td>Todoist</td><td>REST v2, Sync v9</td><td>Unified API v1 (<code>api.todoist.com/api/v1</code>)</td></tr>
<tr><td>Notion</td><td><code>database_id</code></td><td><code>data_source_id</code>, API version <code>2025-09-03</code></td></tr>
<tr><td>macOS Wi-Fi</td><td><code>airport -I</code>, <code>networksetup -getairportnetwork</code></td><td>CoreWLAN <code>CWWiFiClient</code></td></tr>
<tr><td>Oura</td><td>v1 API, no membership required</td><td>v2 API, <em>active membership</em> required for PATs</td></tr>
<tr><td>Python key hooks</td><td><code>pynput</code></td><td>CGEventTap (Swift) on macOS; <code>rdev</code> (Rust) cross-platform</td></tr>
<tr><td>Browser extension</td><td>Manifest V2</td><td>Manifest V3 mandatory (Chrome MV2 disabled June 2024; Firefox/Edge same trajectory)</td></tr>
<tr><td>iOS daylight</td><td>Not exposed</td><td><code>HKQuantityTypeIdentifierTimeInDaylight</code> (iOS 17+)</td></tr>
</tbody></table>
</div></details>

<h3 id="sig-privacy">Privacy posture &amp; what we <em>never</em> collect</h3>
<div class="callout"><div class="label">Hard rules, encoded as code review gates</div>
<ol class="findings">
<li><strong>No message/document content.</strong> Message bodies, email subjects/bodies, document text, meeting titles. If a PR adds a field named <code>text</code>, <code>title</code>, <code>subject</code>, <code>summary</code>, or <code>description</code> to any storage table, it's rejected.</li>
<li><strong>No URL paths.</strong> Only hostname. <code>claude.ai/chat/xyz</code> becomes <code>claude.ai</code>.</li>
<li><strong>No individual collaborator identities.</strong> Attendee counts, not attendee emails. Message counts from a hashed sender ID, not the sender's username.</li>
<li><strong>No keystroke content.</strong> Only per-minute counts. The Swift tap increments a counter and discards the event.</li>
<li><strong>No location beyond a hashed SSID bucket.</strong> No GPS coordinates, no IP geolocation.</li>
<li><strong>All data local by default.</strong> Only the derived E/S/F scalars and current-state bits (color, pulse) leave the host &mdash; and only to the battery hardware on the LAN.</li>
<li><strong>Kill switch.</strong> A single tray icon toggle that freezes all watchers and can purge the last N days with one click.</li>
</ol></div>
</div>

<!-- ===== SCORING ALGORITHMS ===== -->
<div class="section" id="sec-salgorithm">
<h2>Scoring Algorithms: Seven Ways to Weight the Battery</h2>
<p>Once signals are flowing, the question becomes: <em>how do we turn a stream of events into a single number (or small vector) that drives a fill-level and color</em>? There is no settled answer in the literature. Different theoretical traditions yield different equations &mdash; some simple, some requiring weeks of per-user calibration. This tab lays out seven candidate models, grounded in psychology, cognitive science, and affective computing; names the tradeoffs; and recommends one as v1 with a clear upgrade path.</p>

<div class="slide-fig"><img src="/figures/battery/circumplex.svg" alt="Russell circumplex with Energy, Stress, Fulfillment placed on valence-arousal plane" onclick="openLightbox(this)"><div class="caption">Russell's valence &times; arousal circumplex. "Energy," "stress," and "fulfillment" sit in distinct quadrants. A single scalar cannot preserve this geometry &mdash; which is why several of the models below output a vector, not a number.</div></div>

<div class="callout"><div class="label">Why not just add and subtract?</div>
<p>The intuitive "meeting = -5, walk = +10, run out the clock" model is wrong for two reasons well-established in the literature:</p>
<p><strong>(1) Ego-depletion has not replicated.</strong> Vohs et al. (2021) pre-registered multi-lab replication: effect size d &asymp; 0.10, indistinguishable from zero. The original Baumeister (1998) "willpower is a finite resource" framing &mdash; which would justify pure subtraction &mdash; does not survive replication. <em>Any</em> additive model should therefore be treated as a heuristic, not a mechanism.</p>
<p><strong>(2) Baselines are wildly person-specific.</strong> Facer-Childs et al. (2018) measured chronotype peak-cognitive-performance times: larks peak at 13:52, owls at 20:59. A 3 pm dip is "normal day" for a lark and "red alert" for an owl. An algorithm that doesn't personalize the <em>prior</em> will be wrong for half its users.</p>
</div>

<details class="section-fold" open><summary>Table of Contents</summary>
<div class="section-body">
<div class="toc"><ul>
  <li><a href="#alg-found">Theoretical foundations</a></li>
  <li><a href="#alg-principles">Five design principles</a></li>
  <li><a href="#alg-a">Model A: Linear weighted sum (simplest baseline)</a></li>
  <li><a href="#alg-b">Model B: Two-compartment dynamical model &mdash; <strong>recommended v1</strong></a></li>
  <li><a href="#alg-c">Model C: Allostatic load EMA</a></li>
  <li><a href="#alg-d">Model D: Circadian + ultradian prior</a></li>
  <li><a href="#alg-e">Model E: Multi-axis vector (E, S, F)</a></li>
  <li><a href="#alg-f">Model F: Bayesian Kalman filter</a></li>
  <li><a href="#alg-g">Model G: RL / contextual bandit (speculative)</a></li>
  <li><a href="#alg-compare">Comparison matrix</a></li>
  <li><a href="#alg-personal">Personalization tiers (cold &rarr; warm &rarr; stable)</a></li>
  <li><a href="#alg-roadmap">v1 roadmap &amp; honest limitations</a></li>
</ul></div>
</div></details>

<h3 id="alg-found">Theoretical foundations</h3>
<details class="section-fold"><summary>The 20 theories every model below draws on (one-liners with citations)</summary>
<div class="section-body">
<ol class="findings">
  <li><strong>Effort-Recovery (Meijman &amp; Mulder, 1998).</strong> Load depletes a reserve; recovery restores it; incomplete recovery compounds. Directly motivates two-compartment models.</li>
  <li><strong>Conservation of Resources (Hobfoll, 1989).</strong> People actively protect resources (time, attention, energy); loss spirals are non-linear. Motivates convex loss in stress accumulation.</li>
  <li><strong>Job Demands-Resources (Demerouti et al., 2001).</strong> Demands &times; resources interact; high demand + low resource &rarr; burnout. Motivates multiplicative (not additive) coupling between S and E.</li>
  <li><strong>Cognitive Load Theory (Sweller, 1988).</strong> Working-memory capacity is bounded; intrinsic + extraneous + germane loads sum. Motivates weighting context-switch cost heavily.</li>
  <li><strong>Attention Residue (Leroy, 2009).</strong> Switching tasks leaves residue that impairs the next task; unfinished tasks leak more residue than finished ones. Motivates a decay term on incomplete-switch penalties.</li>
  <li><strong>Ego-depletion replication crisis (Vohs et al., 2021).</strong> Effect d &asymp; 0.10 across 36 labs; original effect likely overestimated. <em>Don't</em> use pure subtraction as the mechanism.</li>
  <li><strong>Flow (Csikszentmihalyi, 1990).</strong> Challenge-skill match &rarr; deep engagement, which is actively energizing (not depleting). Motivates the positive recovery term on long focus sessions.</li>
  <li><strong>Basic Rest-Activity Cycle (Kleitman, 1963).</strong> ~90&ndash;120 min ultradian oscillation in alertness throughout the day. Motivates the ripple layer in Model D.</li>
  <li><strong>Chronotype (Facer-Childs et al., 2018).</strong> Lark peak 13:52, owl peak 20:59 &mdash; 7-hour spread in peak cognition. Motivates per-user circadian prior.</li>
  <li><strong>DRAMMA recovery (Newman, Tay &amp; Diener, 2014).</strong> Six distinct recovery ingredients with different weights. Motivates typed recovery events in Model B.</li>
  <li><strong>Self-Determination Theory (Deci &amp; Ryan, 2000).</strong> Autonomy, competence, relatedness &rarr; intrinsic motivation &rarr; Fulfillment axis.</li>
  <li><strong>Allostatic Load (McEwen, 1998).</strong> Repeated activation wears physiology down; slow time constants (days&ndash;weeks). Motivates Model C's EMA on stress.</li>
  <li><strong>Holt-Lunstad social connection meta-analyses (2010, 2015).</strong> Social isolation OR 1.50 for mortality &mdash; larger than smoking. Motivates +++ weight on affiliation.</li>
  <li><strong>Zoom Fatigue (Bailenson, 2021; Fauville ZEF scale).</strong> Hyper-gaze, mirror anxiety, reduced mobility specifically deplete beyond equivalent in-person meeting time. Motivates a video-specific drain coefficient.</li>
  <li><strong>Context switching (Mark et al., 2005 &rarr; 2008 &rarr; 2023).</strong> The popular "23-minute" figure comes from Mark 2005; more recent work shows distribution is heavy-tailed. Motivates convex cost per switch above a daily threshold.</li>
  <li><strong>Progress Principle (Amabile &amp; Kramer, 2011).</strong> Small daily wins are the single strongest mood predictor. Motivates Fulfillment ratchet on task completions.</li>
  <li><strong>HRV / Neurovisceral Integration (Thayer, 2009).</strong> Vagal tone indexes executive-function capacity. Motivates HRV as the most direct E-axis input when available.</li>
  <li><strong>Attention Restoration Theory (Kaplan, 1995; Berman et al., 2008).</strong> 20 min in greenspace restores measurable executive function. Motivates outdoor/daylight minutes as a high-weight recovery event.</li>
  <li><strong>Sleep debt dose-response (Van Dongen et al., 2003).</strong> Chronic partial sleep restriction produces cognitive deficits equivalent to acute total deprivation, <em>without subjective awareness</em>. Motivates sleep debt as an S-load that we trust over the user's self-report.</li>
  <li><strong>Russell circumplex (1980).</strong> Affect lives on a valence &times; arousal plane; energy/stress/fulfillment are geometrically distinct. Motivates multi-axis Model E over any single scalar.</li>
</ol>
</div></details>

<h3 id="alg-principles">Five design principles</h3>
<details class="section-fold"><summary>Constraints every candidate model must satisfy</summary>
<div class="section-body">
<ol class="findings">
  <li><strong>Deviations, not absolutes.</strong> A meeting-dense day is normal for a manager and abnormal for a researcher. Score against a personalized prior.</li>
  <li><strong>Non-linear stress accumulation.</strong> Per CoR, resource loss is convex; per Leroy, switch residue compounds. Use convex (not linear) penalty beyond a daily threshold.</li>
  <li><strong>Type-weighted recovery.</strong> A scroll-break &ne; a walk-outside. DRAMMA-weight recovery events.</li>
  <li><strong>Fast energy, slow stress.</strong> E recovers on hours; S unwinds on days. The coupling is not symmetric.</li>
  <li><strong>Legible to the user.</strong> If the battery drops, the algorithm must be able to answer "why" in one sentence. Black-box models fail this bar.</li>
</ol>
</div></details>

<h3 id="alg-a">Model A: Linear weighted sum with exponential decay</h3>
<details class="section-fold"><summary>The simplest useful baseline &mdash; one scalar, fixed weights, exponential forgetting</summary>
<div class="section-body">
<div class="slide-fig"><img src="/figures/battery/model_a_linear.svg" alt="Model A: linear weighted sum with exponential decay, shown as a scored curve over a workday with drain and recover events" onclick="openLightbox(this)"><div class="caption">Model A: each event bumps the score; between events it decays. A single scalar, transparent but unaware of chronotype or stress accumulation.</div></div>
<p><strong>Equation:</strong> <code>E(t) = E(t-&Delta;t) &middot; exp(-&Delta;t/&tau;) + &Sigma;<sub>i</sub> w<sub>i</sub> &middot; x<sub>i</sub>(t)</code></p>
<p>where <code>&tau;</code> is a half-life (say 2 h), <code>x<sub>i</sub></code> are event magnitudes (meeting-minutes, walk-minutes, etc.), and <code>w<sub>i</sub></code> are signed weights (negative for drains, positive for restorers). Clipped to [0, 100].</p>

<p><strong>Pros:</strong> trivially implementable, fully interpretable ("your battery dropped 8 because of a 60-min video meeting"), near-zero calibration needed. Good for a tech demo in week 1.</p>
<p><strong>Cons:</strong> ignores all five design principles except #5. No personalization, no circadian prior, no stress axis, no type-weighted recovery.</p>

<details class="code-fold"><summary>Python reference</summary>
<pre class="code-block"><code>def update_score_A(E, events, dt_min, tau_min=120, weights=W):
    # decay
    E *= math.exp(-dt_min / tau_min)
    # add/subtract events
    for ev in events:
        E += weights[ev.type] * ev.magnitude
    return max(0.0, min(100.0, E))

W = {
    'meeting_video_min': -0.30, 'meeting_f2f_min': -0.15,
    'context_switch':    -0.40, 'after_hours_msg':  -0.20,
    'focus_block_min':   +0.25, 'walk_outside_min': +0.80,
    'social_voice_min':  +0.40, 'task_completed':   +1.50,
    'sleep_debt_h':      -5.00,
}</code></pre></details>

<p><strong>Verdict:</strong> ship as Model A for the first week as a sanity check and to sanity-check the display pipeline. Do not leave it in production; it will give chronotype-wrong feedback to half the users.</p>
</div></details>

<h3 id="alg-b">Model B: Two-compartment dynamical model <span style="color:#0066cc">&#9733; recommended v1</span></h3>
<details class="section-fold" open><summary>Energy and Stress as coupled state variables with different time constants</summary>
<div class="section-body">
<p>Grounded in Effort-Recovery + Allostatic Load + JD-R. Two state variables, E and S, each with their own dynamics. Stress taxes energy; energy recovers on hours, stress unwinds on days.</p>

<div class="slide-fig"><img src="/figures/battery/two_compartment.svg" alt="Two-compartment model of energy and stress with coupling" onclick="openLightbox(this)"><div class="caption">Model B: E (energy, fast time-constant, shown on the battery fill) is pushed around by meetings, focus, breaks, and also taxed by the slower S (stress) compartment. S accumulates from sleep debt, after-hours work, fragmentation, and HRV trend, and only unwinds with detachment + continuous sleep.</div></div>

<p><strong>Equations (discrete, per 5-minute tick):</strong></p>
<pre class="code-block"><code>dE/dt = recover(t) &minus; drain(t) &minus; &alpha; &middot; S(t)      # E has fast time constant (&tau;<sub>E</sub> &asymp; 2h)
dS/dt = load(t)    &minus; &beta; &middot; detach(t)              # S has slow time constant (&tau;<sub>S</sub> &asymp; 3d)</code></pre>

<p>where <code>drain</code>/<code>recover</code> aggregate typed events with DRAMMA weights; <code>load</code> aggregates sleep-debt EMA, after-hours ratio, fragmentation, HRV trend; <code>detach</code> aggregates uninterrupted off-work blocks and continuous sleep.</p>

<p><strong>Display mapping:</strong> fill-level = E; hue shifts amber &rarr; red as S &gt; 60; "dangerous state" = low E &times; high S (slow red pulse). Fulfillment (from task completions + mastery minutes) is a secondary accent indicator.</p>

<details class="code-fold"><summary>Python reference</summary>
<pre class="code-block"><code>def update_state_B(E, S, features, dt_min=5, params=P):
    tauE = params['tauE_min']    # 120 min
    tauS_d = params['tauS_days'] # 3 days
    alpha = params['alpha']      # 0.05 per unit S per hour

    # E-axis terms
    drain = (features['meeting_video_min'] * 0.30
           + features['meeting_f2f_min']   * 0.15
           + features['context_switches']  * 0.40
           + features['kpm_p95_over_base'] * 0.10)
    recover = (features['focus_block_min']   * 0.25
             + features['walk_outside_min']  * 0.80
             + features['social_voice_min']  * 0.40
             + features['afk_10plus_min']    * 0.15)
    dE = (recover - drain) * (dt_min/60) - alpha * S * (dt_min/60)
    E = max(0.0, min(100.0, E * math.exp(-dt_min/tauE) + dE))

    # S-axis terms
    load   = (features['sleep_debt_h']        * 2.0
            + features['after_hours_frac']    * 5.0
            + features['fragmentation_dev']   * 3.0
            + max(0, -features['hrv_z'])      * 4.0)
    detach = (features['continuous_sleep_h']  * 1.0
            + features['detach_block_min']/60 * 2.0)
    dS = (load - params['beta'] * detach) * (dt_min / (tauS_d*1440))
    S = max(0.0, min(100.0, S + dS))

    return E, S</code></pre></details>

<p><strong>Pros:</strong> satisfies principles 2, 3, 4, 5. Axes are legible. Coefficients are small enough to ship sensible defaults and refine per-user over weeks. Matches the mental model users already have ("I'm tired AND stressed" is different from "I'm tired"). This is the <strong>recommended v1</strong>.</p>
<p><strong>Cons:</strong> still no circadian prior &mdash; it will be wrong in the morning for owls and late for larks. Fix by stacking Model D's prior underneath (see <a href="#alg-d">below</a>).</p>
</div></details>

<h3 id="alg-c">Model C: Allostatic load EMA</h3>
<details class="section-fold"><summary>Stress-centric: a slow-moving exponential moving average of stressor load</summary>
<div class="section-body">
<div class="slide-fig"><img src="/figures/battery/model_c_allostatic.svg" alt="Model C: daily stressor-score bars over two weeks with a smooth exponential-moving-average curve overlaid" onclick="openLightbox(this)"><div class="caption">Model C: daily stressor scores (gray bars) feed a multi-day EMA (red line). A single bad day barely moves it; a bad week pushes it across the chronic-load threshold.</div></div>
<p>A minimal version of the S-compartment alone. Useful if you want a single "am I heading for burnout" scalar without tracking short-term energy. Mechanism: multi-day EMA of a stressor vector &mdash; sleep debt, after-hours, video load, HRV trend, no-detachment days.</p>

<pre class="code-block"><code>AL(t) = &lambda; &middot; AL(t&minus;1d) + (1&minus;&lambda;) &middot; stressor_score(t)
# &lambda; = 0.85 &rarr; half-life ~ 4 days</code></pre>

<p><strong>Display mapping:</strong> battery color (green/amber/red) is driven by AL; fill level is separate and driven by Model A or B energy.</p>
<p><strong>Pros:</strong> captures the McEwen "chronic load" mechanism, which is what burnout research actually tracks. Drift is slow &mdash; a single bad day doesn't panic the display.</p>
<p><strong>Cons:</strong> doesn't react fast enough to acute events. Alone, it can't drive a real-time battery. It's a complement to Model B, not a replacement.</p>
</div></details>

<h3 id="alg-d">Model D: Circadian + ultradian prior</h3>
<details class="section-fold"><summary>Personalized baseline curve; signals are weighted as deviations from it</summary>
<div class="section-body">
<p>Grounded in Kleitman + Facer-Childs. Every user has a baseline expected-energy curve that depends on chronotype (lark / intermediate / owl) and the time of day. Signals are then weighted as <em>deviations from this prior</em>, not absolute values.</p>

<div class="slide-fig"><img src="/figures/battery/circadian_prior.svg" alt="Lark vs owl baseline expected-energy curves across a day with ultradian ripples" onclick="openLightbox(this)"><div class="caption">Model D's prior layer: lark peaks ~14:00, owl peaks ~21:00 (per Facer-Childs 2018), with ~90-min BRAC ripples on top. A 3 pm dip for a lark is expected; for an owl, it's a warning.</div></div>

<pre class="code-block"><code>def expected_energy(t, chronotype):
    peak_h = {'lark':13.87, 'intermediate':16.0, 'owl':20.98}[chronotype]
    # broad circadian envelope (cosine peaking at peak_h)
    envelope = 50 + 30 * math.cos(2*math.pi * (t.hour + t.minute/60 - peak_h) / 24)
    # ultradian ripple (~90 min)
    ripple   = 5 * math.sin(2*math.pi * (t.hour + t.minute/60) / 1.5)
    return envelope + ripple

def update_score_D(E_obs, t, chronotype, features):
    prior = expected_energy(t, chronotype)
    delta = sum(W[k]*features[k] for k in features)
    return prior + delta   # deviations from personalized prior</code></pre>

<p><strong>Pros:</strong> addresses principle #1 directly. Critical for chronotype-diverse users &mdash; half the user base otherwise gets wrong feedback. Only one piece of calibration needed (chronotype, from the 5-question MCTQ-Munich Chronotype Questionnaire).</p>
<p><strong>Cons:</strong> a prior alone isn't a model &mdash; this should stack <em>under</em> Model B, not replace it.</p>
</div></details>

<h3 id="alg-e">Model E: Multi-axis vector (E, S, F)</h3>
<details class="section-fold"><summary>Three distinct scalars mapped to three distinct display features</summary>
<div class="section-body">
<div class="slide-fig"><img src="/figures/battery/model_e_vector.svg" alt="Model E: three stacked tracks showing Energy, Stress, and Fulfillment evolving independently across a workday, with a battery display decoding panel" onclick="openLightbox(this)"><div class="caption">Model E: three independent tracks across a workday. The right panel shows how E drives fill, S drives hue and pulse, and F drives the accent glow &mdash; one object, three channels.</div></div>
<p>Grounded in Russell's circumplex + SDT + Progress Principle. Rather than collapse to one number, the state is a 3-vector &mdash; Energy, Stress, Fulfillment &mdash; each with its own update rule.</p>

<pre class="code-block"><code>def update_vector_E(state, features, dt_min):
    E, S, F = state
    E = update_E_with_circadian_prior(E, features, dt_min)   # from Model D+B
    S = update_S_allostatic(S, features, dt_min)             # from Model C
    F_delta = (features['tasks_done_hi_prio']   * 3.0
             + features['mastery_minutes']      * 0.05
             + features['meaning_tagged_min']   * 0.08
             + features['social_voice_min']     * 0.10
             - features['carry_over_tasks']     * 1.0)
    F = max(0.0, min(100.0, F*0.95 + F_delta))  # gentle decay toward 0
    return (E, S, F)

def display_decode(E, S, F):
    return {
      'fill_level':  E,                              # battery fill
      'hue_shift':   min(1.0, S/60),                 # amber-to-red
      'pulse_speed': 0 if S&lt;40 else (S-40)/60,       # 0..1 pulse as S climbs
      'accent_glow': max(0, min(1, (F-50)/50)),      # secondary LED
      'alert':       (E&lt;20 and S&gt;70),                # danger state
    }</code></pre>

<p><strong>Pros:</strong> matches the psychology. Distinguishes "tired but content" (low E, low S, high F &mdash; a good Friday afternoon) from "tired and depleted" (low E, high S, low F &mdash; a bad Thursday). Only Model E can render that difference.</p>
<p><strong>Cons:</strong> harder to explain to users in one sentence. The hardware has to support the multi-channel display (we planned for this: fill + hue + accent).</p>
</div></details>

<h3 id="alg-f">Model F: Bayesian Kalman filter</h3>
<details class="section-fold"><summary>Treat E and S as latent states; signals are noisy observations</summary>
<div class="section-body">
<div class="slide-fig"><img src="/figures/battery/model_f_kalman.svg" alt="Model F: Kalman filter showing noisy observations, a latent true-E curve, and the posterior mean with a shaded uncertainty band" onclick="openLightbox(this)"><div class="caption">Model F: a latent state with an explicit uncertainty band. The band widens when signals are sparse (no wearable, logged-off) and tightens when many sources agree.</div></div>
<p>Treat E, S as latent states evolving per Model B's linear dynamics. Each signal (HRV, focus-minutes, meeting-density, etc.) is a noisy observation of a linear combination of E and S. Standard Kalman update gives a posterior + uncertainty.</p>

<details class="code-fold"><summary>Numpy sketch</summary>
<pre class="code-block"><code>import numpy as np
# state x = [E, S]
def kalman_update_F(x, P, z, A, H, Q, R):
    # predict
    x = A @ x
    P = A @ P @ A.T + Q
    # update with observation z
    y = z - H @ x
    S = H @ P @ H.T + R
    K = P @ H.T @ np.linalg.inv(S)
    x = x + K @ y
    P = (np.eye(2) - K @ H) @ P
    return x, P</code></pre></details>

<p><strong>Pros:</strong> explicit uncertainty (the battery could dim its certainty: a crisp fill when confident, a fuzzy one when signals are sparse). Gracefully handles missing signals (e.g. wearable not worn today).</p>
<p><strong>Cons:</strong> needs per-user variance estimates to work well &mdash; that's weeks of passive data. Less legible than Model B.</p>
</div></details>

<h3 id="alg-g">Model G: RL / contextual bandit (speculative)</h3>
<details class="section-fold"><summary>Let the device learn which interventions actually restore <em>this user's</em> energy</summary>
<div class="section-body">
<div class="slide-fig"><img src="/figures/battery/model_g_rl.svg" alt="Model G: contextual-bandit loop with state, policy, action, environment, reward, and a regret curve flattening over twelve weeks" onclick="openLightbox(this)"><div class="caption">Model G: the classic RL loop adapted to this domain. Actions are nudges; reward is downstream energy change. Regret falls slowly as the policy learns which interventions actually work for this particular user.</div></div>
<p>Concept: after N weeks of data, train a contextual-bandit policy that suggests interventions ("take a walk now"? "close Slack for 30 min"?) and observes downstream E-axis change as reward. Interventions are arms; context is the current state vector.</p>
<p><strong>Pros:</strong> per-user personalization without asking the user anything. In principle, the device gets smarter the longer you own it.</p>
<p><strong>Cons:</strong> only honest if we have a closed intervention loop on the device (nudge &rarr; behavior &rarr; measured change). Also ethically loaded &mdash; nudging is a design decision, not a data-science decision.</p>
<p><strong>Verdict:</strong> v3 or later. Not a day-one priority. Worth mentioning so the architecture doesn't foreclose it.</p>
</div></details>

<h3 id="alg-compare">Comparison matrix</h3>
<details class="section-fold" open><summary>Tradeoffs at a glance</summary>
<div class="section-body">
<div class="algo-matrix-wrap">
<table class="algo-matrix">
<thead><tr>
  <th style="min-width:180px">Model</th>
  <th style="width:95px">Complexity</th>
  <th style="width:95px">Interpretable</th>
  <th style="min-width:140px">Data needed</th>
  <th style="min-width:130px">Personalization</th>
  <th style="min-width:110px">Axes</th>
  <th style="min-width:170px">Grounded in</th>
  <th style="min-width:170px">Use for</th>
</tr></thead>
<tbody>
<tr>
  <td><span class="algo-name"><span class="algo-letter">A</span>Linear sum<span class="algo-sub">weighted add/subtract with decay</span></span></td>
  <td><span class="star-rating">&#9679;<span class="off">&#9679;&#9679;&#9679;&#9679;</span></span></td>
  <td><span class="star-rating">&#9733;&#9733;&#9733;&#9733;&#9733;</span></td>
  <td>Day 1</td>
  <td>None</td>
  <td><span class="axis-chip axis-none">scalar</span></td>
  <td>Heuristic only</td>
  <td>Week-1 sanity check of display pipeline</td>
</tr>
<tr class="algo-recommended">
  <td><span class="algo-name algo-rec"><span class="algo-letter">B</span>Two-compartment<span class="rec-badge">V1</span><span class="algo-sub">coupled ODE, E fast, S slow</span></span></td>
  <td><span class="star-rating">&#9679;&#9679;&#9679;<span class="off">&#9679;&#9679;</span></span></td>
  <td><span class="star-rating">&#9733;&#9733;&#9733;&#9733;<span class="off">&#9733;</span></span></td>
  <td>Day 1</td>
  <td>Light (weights)</td>
  <td><span class="axis-chip axis-E">E</span><span class="axis-chip axis-S">S</span></td>
  <td>Effort-Recovery, JD-R, Allostatic Load</td>
  <td><strong>v1 shipping model</strong></td>
</tr>
<tr>
  <td><span class="algo-name"><span class="algo-letter">C</span>Allostatic EMA<span class="algo-sub">multi-day exponential average</span></span></td>
  <td><span class="star-rating">&#9679;&#9679;<span class="off">&#9679;&#9679;&#9679;</span></span></td>
  <td><span class="star-rating">&#9733;&#9733;&#9733;&#9733;&#9733;</span></td>
  <td>1&ndash;2 weeks</td>
  <td>None at start</td>
  <td><span class="axis-chip axis-S">S</span></td>
  <td>McEwen allostatic load</td>
  <td>Color layer, stacks on top of B</td>
</tr>
<tr>
  <td><span class="algo-name"><span class="algo-letter">D</span>Circadian prior<span class="algo-sub">lark/owl baseline + BRAC ripples</span></span></td>
  <td><span class="star-rating">&#9679;&#9679;<span class="off">&#9679;&#9679;&#9679;</span></span></td>
  <td><span class="star-rating">&#9733;&#9733;&#9733;&#9733;&#9733;</span></td>
  <td>1 question (MCTQ)</td>
  <td>Chronotype</td>
  <td><span class="axis-chip axis-E">E prior</span></td>
  <td>Kleitman, Facer-Childs</td>
  <td>Prior layer, stacks under B</td>
</tr>
<tr>
  <td><span class="algo-name"><span class="algo-letter">E</span>Three-axis vector<span class="algo-sub">separate E, S, F scalars</span></span></td>
  <td><span class="star-rating">&#9679;&#9679;&#9679;<span class="off">&#9679;&#9679;</span></span></td>
  <td><span class="star-rating">&#9733;&#9733;&#9733;&#9733;<span class="off">&#9733;</span></span></td>
  <td>Day 1 + completions</td>
  <td>Per-axis</td>
  <td><span class="axis-chip axis-E">E</span><span class="axis-chip axis-S">S</span><span class="axis-chip axis-F">F</span></td>
  <td>Russell, SDT, Progress Principle</td>
  <td>v2 &mdash; accent indicator needed</td>
</tr>
<tr>
  <td><span class="algo-name"><span class="algo-letter">F</span>Kalman filter<span class="algo-sub">Bayesian latent-state update</span></span></td>
  <td><span class="star-rating">&#9679;&#9679;&#9679;&#9679;<span class="off">&#9679;</span></span></td>
  <td><span class="star-rating">&#9733;&#9733;&#9733;<span class="off">&#9733;&#9733;</span></span></td>
  <td>2&ndash;4 weeks</td>
  <td>Per-user variances</td>
  <td><span class="axis-chip axis-E">E</span><span class="axis-chip axis-S">S</span></td>
  <td>Bayesian state-space</td>
  <td>v3 upgrade to B</td>
</tr>
<tr>
  <td><span class="algo-name"><span class="algo-letter">G</span>RL bandit<span class="algo-sub">contextual nudge-policy learner</span></span></td>
  <td><span class="star-rating">&#9679;&#9679;&#9679;&#9679;&#9679;</span></td>
  <td><span class="star-rating">&#9733;&#9733;<span class="off">&#9733;&#9733;&#9733;</span></span></td>
  <td>Months + closed loop</td>
  <td>Full</td>
  <td><span class="axis-chip axis-none">any</span></td>
  <td>Contextual bandits</td>
  <td>Research direction</td>
</tr>
</tbody>
</table>
</div>
<p><strong>Recommended architecture:</strong> ship Model B as the core, stack Model D's chronotype prior underneath, layer Model C's multi-day EMA to drive color separately from fill, and leave a Model E hook so the secondary F-axis indicator is populated from day one. That composite is what v1 should be.</p>
</div></details>

<h3 id="alg-personal">Personalization tiers</h3>
<details class="section-fold"><summary>Cold start &rarr; warm &rarr; stable, with one-time calibration that stays in scope</summary>
<div class="section-body">
<p>The user asked for "one-time user-report for calibration" to be acceptable. That gives us three tiers:</p>

<h4>Cold start (day 0 &mdash; one 90-second survey)</h4>
<ul class="findings">
  <li><strong>MCTQ (Munich Chronotype Questionnaire, short form):</strong> 5 items, chronotype in minutes. Sets Model D's <code>peak_h</code>. Validated Roenneberg et al.</li>
  <li><strong>BFI-2-S Extraversion subscale (6 items, ~40 s):</strong> high extraversion &rarr; upweight social-affiliation recovery; low extraversion &rarr; upweight solo recovery.</li>
  <li><strong>UWES-3 engagement baseline (3 items):</strong> gives a fulfillment-scale zero-point so the F-axis isn't stuck at the user's average.</li>
  <li><strong>Work pattern declarations:</strong> typical start/end hours, remote/hybrid/office. Sets the "after-hours" threshold individually.</li>
</ul>

<h4>Warm phase (days 1&ndash;14)</h4>
<ul class="findings">
  <li>Per-user mean and SD for every feature are learned (meeting_density, msgs_per_hour, focus_block_length, HRV, etc.).</li>
  <li>All features are z-scored against the user's own baseline from here on.</li>
  <li>The weights in Model B stay at shipped defaults &mdash; we don't have enough labels yet to re-fit.</li>
</ul>

<h4>Stable phase (day 14+)</h4>
<ul class="findings">
  <li>Periodic (weekly) reweighting of Model B coefficients, if we have any label signal at all (e.g. the user occasionally taps a "was this about right?" button on the battery).</li>
  <li>Kalman (Model F) becomes viable: per-user observation noise and process noise are estimable.</li>
  <li>Optional: chronotype can be refined from observed typing/activity rhythm rather than self-report.</li>
</ul>
</div></details>

<h3 id="alg-roadmap">v1 roadmap &amp; honest limitations</h3>
<details class="section-fold" open><summary>Six shipping steps and what we know will be wrong at first</summary>
<div class="section-body">
<ol class="findings">
  <li><strong>Week 1:</strong> Model A + 7-signal MVP stack. Validate the data pipeline and display path end-to-end. Accept that the scores themselves will be noisy.</li>
  <li><strong>Week 2:</strong> Swap in Model B with shipped default coefficients. Stack Model D's chronotype prior underneath (ask for MCTQ at onboarding).</li>
  <li><strong>Week 3&ndash;4:</strong> Start computing per-user z-scores for every feature; begin driving Model C's color layer from allostatic EMA, decoupled from fill level.</li>
  <li><strong>Week 5&ndash;6:</strong> Populate Model E's F-axis from task completions + mastery minutes; wire to the accent indicator.</li>
  <li><strong>Month 2+:</strong> Add a single "was this right?" button. Accumulate labels. Begin coefficient refitting.</li>
  <li><strong>Month 3+:</strong> Upgrade to Model F (Kalman) per user with enough data. Consider Model G research pilot.</li>
</ol>

<div class="callout"><div class="label">What we know will be imperfect on day 1</div>
<ul class="findings">
  <li><strong>Chronotype self-report is noisy.</strong> MCTQ has test-retest of ~0.8; some users will be miscategorized.</li>
  <li><strong>Default coefficients won't fit you perfectly.</strong> Expect 2&ndash;4 weeks before the battery "feels right."</li>
  <li><strong>Wearable-less mode is a degraded mode.</strong> Without HRV, the S-axis is estimated from behavior alone and will lag acute changes.</li>
  <li><strong>Fulfillment is the hardest axis to measure passively.</strong> Task completions are a proxy; we'll under-capture creative and relational meaning.</li>
  <li><strong>Chronic stress and burnout are not the same as "bad day."</strong> Model C's slow EMA helps, but we should not claim clinical validity; the device is a research prototype.</li>
</ul></div>
</div></details>

</div>

<!-- ===== LED BUILD GUIDE ===== -->
<div class="section" id="sec-sledguide">
<h2>LED + Frosted Glass: Complete Build Guide</h2>
<p>A complete, end-to-end guide for building a Psych_Battery prototype using <strong>WS2812B addressable LEDs</strong> (NeoPixels) behind a frosted acrylic diffuser. This guide walks you through every step: buying parts, installing software, wiring the circuit, writing the code, and integrating with the Psych_Battery Python backend. Assumes no prior experience with ESP32 or addressable LEDs. Inspired by <strong>The Ripple Effect</strong> by Elisa Lupin-Jimenez (ESP32 + NeoPixel 8x8 matrix + sanded acrylic).</p>

<div class="slide-fig"><img src="/figures/battery/led_assembly.png" alt="LED battery prototype" onclick="openLightbox(this)"><div class="caption">The finished prototype: a cylindrical battery-shaped enclosure with WS2812B LEDs arranged inside, diffused through sanded acrylic. Color ramps from red (depleted) through amber to green (full charge). Soft breathing pulse indicates active state.</div></div>

<details class="section-fold"><summary>Table of Contents</summary>
<div class="section-body">
<div class="toc"><ul>
  <li><a href="#led-why">Why LED + Frosted Glass for Psych_Battery</a></li>
  <li><a href="#led-bom">Phase 0: Supplies &amp; Bill of Materials</a></li>
  <li><a href="#led-software">Phase 1: Software Setup (Arduino IDE + Libraries)</a></li>
  <li><a href="#led-wiring">Phase 2: Hardware Wiring (Breadboard, Step-by-Step)</a></li>
  <li><a href="#led-firsttest">Phase 3: First Upload &amp; Smoke Test</a></li>
  <li><a href="#led-chargecode">Phase 4: The Complete Charge Bar Firmware</a></li>
  <li><a href="#led-python">Phase 5: Python Backend Integration</a></li>
  <li><a href="#led-enclosure">Phase 6: Enclosure, Diffuser &amp; Mounting</a></li>
  <li><a href="#led-matrix">Appendix: LED Matrix Options</a></li>
  <li><a href="#led-compare">Comparison: LED vs E-Ink</a></li>
  <li><a href="#led-troubleshooting">Troubleshooting Guide</a></li>
</ul></div>
</div>
</details>
<details class="section-fold" id="led-why"><summary>Why LED + Frosted Glass for Psych_Battery?</summary>
<div class="section-body">
<ul class="findings">
  <li><strong>Instant updates.</strong> Brightness and color change in milliseconds &mdash; useful for live feedback or breathing animations that respond to keystrokes, Slack pings, or AFK states.</li>
  <li><strong>Ambient, glanceable.</strong> A soft diffused glow sits in peripheral vision without demanding attention. The color shift is the signal; precise numbers aren't needed.</li>
  <li><strong>Self-illuminating.</strong> Visible in a dark office, late at night, or under a desk hood. No ambient light required (unlike e-ink).</li>
  <li><strong>Continuous color space.</strong> Unlike e-ink's 4 discrete colors, LEDs can render a smooth red&rarr;amber&rarr;green gradient, so "59% charged" looks meaningfully different from "65% charged."</li>
  <li><strong>Organic animation.</strong> Breathing pulses via <code>exp(sin(t))</code> feel alive. The battery looks "on" even when the level isn't changing.</li>
</ul>

<div class="callout"><div class="label">Known trade-off: blue light &amp; always-on power</div><p>LEDs emit (including a small blue-light component) and draw 200-500 mW continuously. If your design constraint is "no blue light on the desk" or "always-on without power," choose the e-ink build instead. The LED build is best when the battery will be in a well-lit workspace during active hours and unplugged after work.</p></div>
</div>
</details>
<details class="section-fold"><summary>Architecture</summary>
<div class="section-body">
<p><code>Python Backend &rarr; (HTTP POST or Serial) &rarr; ESP32 &rarr; 74AHCT125 level shifter &rarr; WS2812B LEDs &rarr; frosted acrylic diffuser &rarr; battery enclosure</code></p>
</div>
</details>
<details class="section-fold"><summary>Full Circuit Blueprints</summary>
<div class="section-body">
<div class="slide-fig"><img src="/figures/battery/led_blueprint_full.png" alt="Full 4-row LED blueprint" onclick="openLightbox(this)"><div class="caption">Complete blueprint: ESP32 &rarr; 74AHCT125 level shifter &rarr; 330&ohm; resistor &rarr; 4 rows of WS2812B LEDs in serpentine layout. 1000&micro;F capacitor on power rails. 5V 4A power supply. Title block: "PSYCH_BATTERY LED CIRCUIT &mdash; 4 ROW SERPENTINE LAYOUT".</div></div>

<div class="slide-fig"><img src="/figures/battery/led_matrix_blueprint.png" alt="8x8 matrix blueprint" onclick="openLightbox(this)"><div class="caption">Alternative: 8&times;8 NeoPixel matrix version. Same ESP32 + level shifter circuit, but the matrix is a single rigid PCB with 64 LEDs. Frosted acrylic panel shown at 50mm distance for diffusion.</div></div>

<div class="slide-fig"><img src="/figures/battery/led_wiring.png" alt="LED wiring closeup" onclick="openLightbox(this)"><div class="caption">Simplified wiring closeup: ESP32 GPIO 16 &rarr; 330&ohm; resistor &rarr; 74AHCT125 &rarr; WS2812B data input. 1000&micro;F capacitor across the +5V and GND rails, as close to the first LED as possible.</div></div>
</div>
</details>
<!-- ============ PHASE 0: SUPPLIES ============ -->
<div class="phase-header"><span class="phase-num">0</span><span class="phase-title">Supplies &amp; Bill of Materials</span><span class="phase-time">30 min (shopping + inventory)</span></div>

<details class="section-fold" id="led-bom"><summary>0.1 Electronics BOM (~$55-80 total)</summary>
<div class="section-body">
<p>These are the electronic components. If you already have an ESP32 from another project, you can skip the dev board line.</p>
<table class="result-table">
<tr><th>Component</th><th>Product</th><th>Price</th><th>Source</th></tr>
<tr><td><strong>ESP32 Dev Board</strong></td><td>ESP32-WROOM-32 DevKit V1 (CP2102 USB chip)</td><td>~$8</td><td><a href="https://www.amazon.com/s?k=hiletgo+esp32+devkit+v1" target="_blank">Amazon (HiLetgo 3-pack)</a></td></tr>
<tr><td><strong>LED module (pick one)</strong></td><td>24-LED NeoPixel Ring + 7-LED Jewel combo (recommended)</td><td>~$23</td><td><a href="https://www.adafruit.com/product/1586" target="_blank">Adafruit #1586</a> + <a href="https://www.adafruit.com/product/2226" target="_blank">#2226</a></td></tr>
<tr><td></td><td>OR: WS2812B strip, 60 LED/m, 1m (for serpentine layout)</td><td>~$10</td><td><a href="https://www.amazon.com/s?k=ws2812b+60led+1m" target="_blank">Amazon (BTF-LIGHTING)</a></td></tr>
<tr><td></td><td>OR: Adafruit NeoPixel NeoMatrix 8&times;8 (64 LEDs, rigid)</td><td>~$35</td><td><a href="https://www.adafruit.com/product/1487" target="_blank">Adafruit #1487</a></td></tr>
<tr><td><strong>Power Supply</strong></td><td>5V 4A switching PSU (barrel jack)</td><td>~$15</td><td><a href="https://www.adafruit.com/product/1466" target="_blank">Adafruit #1466</a></td></tr>
<tr><td><strong>Level Shifter</strong></td><td>74AHCT125 quad buffer (3.3V&rarr;5V)</td><td>~$2</td><td><a href="https://www.adafruit.com/product/1787" target="_blank">Adafruit #1787</a></td></tr>
<tr><td><strong>Capacitor</strong></td><td>1000&micro;F 6.3V+ electrolytic</td><td>~$5 (10pk)</td><td>Amazon assortment</td></tr>
<tr><td><strong>Resistor</strong></td><td>330&ohm; 1/4W carbon film</td><td>~$6 (kit)</td><td>Amazon resistor assortment</td></tr>
<tr><td><strong>Breadboard + jumpers</strong></td><td>Half-size breadboard + M-M / M-F jumper wire pack</td><td>~$12</td><td>Amazon</td></tr>
<tr><td><strong>DC barrel jack adapter</strong></td><td>Screw-terminal barrel jack adapter (matches PSU)</td><td>~$3</td><td>Amazon</td></tr>
<tr><td><strong>USB cable</strong></td><td>USB-A to Micro-USB, data-capable</td><td>~$5</td><td>Anywhere</td></tr>
</table>

<div class="callout"><div class="label">Recommended LED pick: Ring + Jewel combo</div><p>For a first prototype, the <strong>24-LED NeoPixel Ring + 7-LED Jewel combo ($23)</strong> is the easiest path. The ring's 65.5mm diameter fits a cylindrical battery enclosure perfectly, the circular shape matches the form, and it produces the smoothest diffused glow. Just daisy-chain Jewel DOUT to Ring DIN &mdash; no custom soldering between segments. See the <a href="#led-matrix">LED Matrix Options appendix</a> for alternatives.</p></div>
</div>
</details>
<details class="section-fold"><summary>0.2 Enclosure &amp; Diffuser Supplies (~$15-30)</summary>
<div class="section-body">
<p>Physical materials for the enclosure and light diffusion. Many are free at UC Berkeley makerspaces &mdash; bring this list to make sure you don't get stuck mid-build.</p>

<table class="result-table">
<tr><th>Supply</th><th>Purpose</th><th>Available at Jacobs?</th><th>Or buy yourself</th></tr>
<tr><td><strong>Frosted acrylic, 1/8" (3mm), 6"&times;6"</strong></td><td>Light diffuser panel in front of LEDs</td><td>Jacobs often has clear acrylic scraps (sand yourself); frosted is rarer</td><td><a href="https://www.amazon.com/s?k=frosted+acrylic+sheet+1%2F8" target="_blank">~$10 on Amazon</a> or <a href="https://canalplastic.com/" target="_blank">Canal Plastics</a></td></tr>
<tr><td><strong>PLA filament (white or black)</strong></td><td>3D-printing the battery-shaped enclosure (~60g needed)</td><td>Yes (Jacobs Hall, Supernode, CITRIS all stock common colors)</td><td>~$25/kg on Amazon if you want a specific color</td></tr>
<tr><td><strong>Sandpaper (400 &amp; 600 grit)</strong></td><td>Sanding clear acrylic into frosted, or smoothing 3D-print layer lines</td><td>Yes (Jacobs hand tool area)</td><td>~$6 at any hardware store</td></tr>
<tr><td><strong>Isopropyl alcohol (90%+)</strong></td><td>Cleaning acrylic before mounting, degreasing enclosure</td><td>Yes (Jacobs / CITRIS electronics bench)</td><td>~$5 at any pharmacy</td></tr>
<tr><td><strong>Black electrical tape</strong></td><td>Sealing light leaks around the diffuser edge and USB hole</td><td>Yes (Jacobs electronics bench)</td><td>~$3 at any hardware store</td></tr>
<tr><td><strong>Hot glue sticks + hot glue gun</strong></td><td>Tacking the LED module inside the shell; fixing the diffuser</td><td>Yes (Jacobs, Supernode, CITRIS)</td><td>~$15 for a small gun + sticks at hardware store</td></tr>
<tr><td><strong>M3 screws + heat-set inserts (optional)</strong></td><td>Assembling a 2-part enclosure (alternative: friction fit)</td><td>Yes (Jacobs fastener bin)</td><td>~$10 on Amazon if needed</td></tr>
</table>

<p><strong>Minimum additional cost: $10-$25</strong> depending on how much you source from Jacobs vs buy yourself. The frosted acrylic is the one item that's hard to source for free.</p>
</div>
</details>
<details class="section-fold"><summary>0.3 Tools You'll Use (all free at UC Berkeley makerspaces)</summary>
<div class="section-body">
<table class="result-table">
<tr><th>Tool</th><th>Purpose</th><th>Where to Find It</th></tr>
<tr><td><strong>Soldering iron + solder</strong></td><td>Connecting LED segments, attaching wires to the strip/ring</td><td><a href="https://jacobsinstitute.berkeley.edu/making-at-jacobs/" target="_blank">Jacobs Hall</a>, <a href="https://supernode.berkeley.edu/" target="_blank">Supernode</a> (24/7, Cory Hall), <a href="https://invent.citris-uc.org/" target="_blank">CITRIS Invention Lab</a></td></tr>
<tr><td><strong>3D printer</strong></td><td>Printing the enclosure (~6-10 hour print for a battery-sized shell)</td><td>Jacobs Hall (Ultimakers), Supernode (Prusas, 24/7), CITRIS (Sutardja Dai Hall)</td></tr>
<tr><td><strong>Laser cutter (optional)</strong></td><td>Cutting the diffuser panel cleanly from acrylic sheet</td><td>Jacobs Hall (training required), CITRIS Invention Lab</td></tr>
<tr><td><strong>Multimeter</strong></td><td>Verifying 5V rail, checking continuity, debugging wiring</td><td>Jacobs, CITRIS, Supernode electronics benches</td></tr>
<tr><td><strong>Wire strippers + small flathead</strong></td><td>Prepping jumper wires, opening barrel-jack terminals</td><td>Jacobs hand tool area</td></tr>
<tr><td><strong>Helping hands / third hand</strong></td><td>Holding LED segments steady while soldering</td><td>Jacobs, CITRIS electronics benches</td></tr>
<tr><td><strong>Computer with USB port</strong></td><td>Running Arduino IDE and uploading firmware</td><td>Bring your laptop</td></tr>
</table>

<div class="callout"><div class="label">Maker Pass required</div><p>To use Jacobs Hall, CITRIS Invention Lab, or most Berkeley makerspaces, you need a Maker Pass. Sign up at <a href="https://jacobsinstitute.berkeley.edu/our-space/" target="_blank">jacobsinstitute.berkeley.edu</a> &mdash; free for UC Berkeley students. Supernode is free and 24/7 with no pass required.</p></div>
</div>
</details>
<details class="section-fold"><summary>0.4 Final Shopping List (if you want to cover everything)</summary>
<div class="section-body">
<p>If you want to buy everything yourself instead of relying on makerspace supplies, total cost is roughly:</p>
<ul class="findings">
  <li>Electronics BOM (0.1): <strong>~$79</strong> with Ring+Jewel combo</li>
  <li>Enclosure &amp; diffuser supplies (0.2) if buying all yourself: <strong>~$55</strong> (filament, acrylic, sandpaper, tape, glue gun, alcohol)</li>
  <li><strong>Full DIY total: ~$134</strong></li>
  <li><strong>Realistic with Berkeley makerspace resources: ~$85-95</strong></li>
</ul>

<details class="build-help"><summary>One-click shopping cart (copy-paste URLs)</summary><div class="help-body">
<p>Open these in new tabs and add to cart:</p>
<ul>
  <li>ESP32 DevKit V1 (3-pack): <a href="https://www.amazon.com/HiLetgo-ESP-WROOM-32-Development-Microcontroller-Integrated/dp/B0718T232Z" target="_blank">amazon.com/dp/B0718T232Z</a></li>
  <li>24-LED NeoPixel Ring: <a href="https://www.adafruit.com/product/1586" target="_blank">adafruit.com/product/1586</a></li>
  <li>7-LED NeoPixel Jewel: <a href="https://www.adafruit.com/product/2226" target="_blank">adafruit.com/product/2226</a></li>
  <li>5V 4A power supply: <a href="https://www.adafruit.com/product/1466" target="_blank">adafruit.com/product/1466</a></li>
  <li>74AHCT125 level shifter: <a href="https://www.adafruit.com/product/1787" target="_blank">adafruit.com/product/1787</a></li>
  <li>1000 µF electrolytic cap + 330 Ω resistor kit: <a href="https://www.amazon.com/s?k=electrolytic+capacitor+assortment+kit" target="_blank">capacitor assortment</a> + <a href="https://www.amazon.com/s?k=resistor+kit+1%2F4w" target="_blank">resistor kit</a></li>
  <li>Half-size breadboard + jumper pack: <a href="https://www.amazon.com/s?k=breadboard+jumper+wire+kit" target="_blank">amazon search</a></li>
  <li>DC barrel jack screw-terminal adapter: <a href="https://www.amazon.com/s?k=5.5mm+barrel+jack+adapter+screw+terminal" target="_blank">amazon search</a></li>
  <li>Frosted acrylic sheet, 3mm: <a href="https://www.amazon.com/s?k=frosted+acrylic+sheet+1%2F8" target="_blank">amazon search</a></li>
</ul>
<p>Ordering Ring and Jewel from Adafruit in the same order saves shipping. Everything else is Prime-eligible on Amazon.</p>
</div></details>
</div>
</details>
<!-- ============ PHASE 1: SOFTWARE ============ -->
<div class="phase-header"><span class="phase-num">1</span><span class="phase-title">Software Setup (Arduino IDE + Libraries)</span><span class="phase-time">45 min</span></div>

<details class="section-fold" id="led-software"><summary>1.1 Install Arduino IDE 2.x</summary>
<div class="section-body">
<p>Arduino IDE is the free program where you'll write code (called "sketches") and upload it to the ESP32 via USB. It handles compiling, library management, and uploading.</p>
<ul class="findings">
  <li>Go to <a href="https://www.arduino.cc/en/software" target="_blank">arduino.cc/en/software</a></li>
  <li>Download the "Arduino IDE 2.x" installer for your OS (Windows, Mac, or Linux)</li>
  <li>Run the installer. Accept all defaults. On Mac, drag it to Applications.</li>
  <li>Launch Arduino IDE. You'll see an empty sketch with <code>setup()</code> (runs once at power-on) and <code>loop()</code> (runs repeatedly forever). Your charge-level code goes in <code>loop()</code>.</li>
</ul>
</div>
</details>
<details class="section-fold"><summary>1.2 Add ESP32 Board Support</summary>
<div class="section-body">
<p>Arduino IDE doesn't know about ESP32 by default. You have to add Espressif's board package URL.</p>
<ul class="findings">
  <li>In Arduino IDE, go to <strong>File &rarr; Preferences</strong> (Windows/Linux) or <strong>Arduino IDE &rarr; Settings</strong> (macOS)</li>
  <li>Find the field labeled <strong>"Additional boards manager URLs"</strong></li>
  <li>Paste this URL: <code>https://espressif.github.io/arduino-esp32/package_esp32_index.json</code></li>
  <li>Click OK</li>
  <li>Go to <strong>Tools &rarr; Board &rarr; Boards Manager</strong></li>
  <li>Search for <strong>"esp32"</strong></li>
  <li>Install <strong>"esp32 by Espressif Systems"</strong> (version 3.x or higher). This takes ~3-5 minutes.</li>
  <li>After installation: <strong>Tools &rarr; Board &rarr; ESP32 Arduino &rarr; ESP32 Dev Module</strong></li>
</ul>
</div>
</details>
<details class="section-fold"><summary>1.3 Install USB Driver (Windows/Mac only)</summary>
<div class="section-body">
<p>The ESP32 DevKit V1 uses a <strong>CP2102</strong> USB-to-serial chip. Most modern computers have the driver pre-installed, but if your ESP32 doesn't appear as a COM port, install it manually.</p>
<ul class="findings">
  <li>Download the driver from <a href="https://www.silabs.com/developers/usb-to-uart-bridge-vcp-drivers" target="_blank">Silicon Labs CP2102 drivers</a></li>
  <li>Install, reboot if prompted</li>
  <li>Plug in your ESP32 via USB. Open Arduino IDE &rarr; <strong>Tools &rarr; Port</strong>. You should see a new port appear (COM3+ on Windows, /dev/cu.SLAB_USBtoUART on Mac, /dev/ttyUSB0 on Linux). Select it.</li>
</ul>
</div>
</details>
<details class="section-fold"><summary>1.4 Install Required Arduino Libraries</summary>
<div class="section-body">
<p>You need four libraries to drive the LEDs and run an HTTP server. Install via <strong>Sketch &rarr; Include Library &rarr; Manage Libraries</strong>:</p>
<ul class="findings">
  <li><strong>Adafruit NeoPixel</strong> by Adafruit (latest version) &mdash; drives the WS2812B LEDs using bit-banged timing</li>
  <li><strong>ArduinoJson</strong> by Benoit Blanchon (v7.x) &mdash; parses incoming JSON from the Python backend</li>
</ul>
<p>The next two libraries are <strong>not in the Library Manager</strong> &mdash; install them manually from GitHub ZIP:</p>
<ul class="findings">
  <li><strong>ESPAsyncWebServer</strong> &mdash; download ZIP from <a href="https://github.com/ESP32Async/ESPAsyncWebServer" target="_blank">github.com/ESP32Async/ESPAsyncWebServer</a>. In Arduino IDE: <strong>Sketch &rarr; Include Library &rarr; Add .ZIP Library</strong>, pick the downloaded ZIP.</li>
  <li><strong>AsyncTCP</strong> &mdash; download ZIP from <a href="https://github.com/ESP32Async/AsyncTCP" target="_blank">github.com/ESP32Async/AsyncTCP</a>. Install the same way.</li>
</ul>

<div class="callout"><div class="label">Why async web server instead of WebServer.h?</div><p>The built-in <code>WebServer.h</code> is synchronous &mdash; it blocks the main loop while serving each request. That's fine for e-ink (which blocks during refresh anyway), but for LED breathing animations you want the <code>loop()</code> to run continuously at 60+ fps. ESPAsyncWebServer handles HTTP in the background so your animation never stutters.</p></div>

<details class="build-help"><summary>Library install troubleshooting: "Library not found" even after installing</summary><div class="help-body">
<p>Arduino IDE 2.x uses a sketchbook folder for user-installed libraries. When the IDE can't find a library you just installed, 99% of the time it's one of:</p>
<ul>
  <li><strong>Multiple Arduino installs.</strong> If you have both the Arduino IDE 2.x and the legacy 1.8.x installed, each has a separate libraries folder. The IDE you're actively using must see the library. Uninstall the one you're not using.</li>
  <li><strong>Wrong sketchbook location.</strong> Check <strong>File &rarr; Preferences &rarr; Sketchbook location</strong>. Libraries go in <code>&lt;sketchbook&gt;/libraries/</code>. Manually verify the ZIP unzipped into a correctly-named folder there (e.g. <code>libraries/ESPAsyncWebServer/</code>, not <code>libraries/ESPAsyncWebServer-master/ESPAsyncWebServer/</code>).</li>
  <li><strong>Nested folder.</strong> Downloaded ZIPs from GitHub often unzip to a <code>name-master</code> or <code>name-main</code> folder &mdash; rename to just <code>name</code> so Arduino recognizes it.</li>
  <li><strong>Restart the IDE.</strong> Arduino IDE caches the library list on startup. After manual file moves, quit and reopen fully (not just close the sketch window).</li>
</ul>
</div></details>

<details class="build-help"><summary>What "sketch folder" means &mdash; keeping .ino + .h files together</summary><div class="help-body">
<p>An Arduino "sketch" is a folder, not just the <code>.ino</code> file. The IDE requires the folder name to match the <code>.ino</code> file's name (e.g. <code>psych_battery_led/psych_battery_led.ino</code>). Any support files (<code>.h</code>, <code>.cpp</code>) you want this sketch to use must sit in the <em>same folder</em>.</p>
<p>On disk, your sketchbook looks like this:</p>
<details class="code-fold"><summary>&lt;sketchbook&gt;/</summary>
<pre class="code-block">&lt;sketchbook&gt;/
  psych_battery_led/
    psych_battery_led.ino    &larr; the main file (File &rarr; Open this)
    EPD_5in79_G.h            &larr; any support files go alongside
    EPD_5in79_G.cpp
  libraries/
    Adafruit_NeoPixel/       &larr; libraries live one level up
    ArduinoJson/
    ESPAsyncWebServer/</pre>
</details>
<p>When Arduino opens your <code>.ino</code>, any <code>.h</code>/<code>.cpp</code> in the same folder will be compiled together automatically &mdash; no Makefile needed.</p>
</div></details>
</div>
</details>
<!-- ============ PHASE 2: WIRING ============ -->
<div class="phase-header"><span class="phase-num">2</span><span class="phase-title">Hardware Wiring (Breadboard, Step-by-Step)</span><span class="phase-time">45 min</span></div>

<details class="section-fold" id="led-wiring"><summary>2.1 Understand the Components</summary>
<div class="section-body">
<p>Unlike the e-ink kit (which is plug-and-play), the LED build uses a breadboard and discrete components. Here's what each piece does:</p>
<ul class="findings">
  <li><strong>ESP32 DevKit V1:</strong> The "brain." Reads commands over WiFi or USB, runs the charge animation, sends data to the LEDs. Outputs 3.3V logic on its GPIO pins. Has WiFi and Bluetooth built in.</li>
  <li><strong>74AHCT125 level shifter:</strong> Converts the ESP32's 3.3V data signal to a clean 5V signal that the LEDs reliably understand. Without it, the LEDs often misinterpret data &mdash; wrong colors, flickering, or nothing.</li>
  <li><strong>WS2812B LEDs (NeoPixels):</strong> Addressable RGB LEDs. Each LED has a tiny driver chip inside. You send a chain of color data over a single wire; each LED grabs its color and passes the rest along to the next.</li>
  <li><strong>330&ohm; resistor:</strong> Sits between the level shifter output and the first LED's data input. Dampens signal reflections that can corrupt data on longer runs.</li>
  <li><strong>1000&micro;F capacitor:</strong> Buffers the 5V power rail. Absorbs the inrush current when LEDs transition between dark and bright colors.</li>
  <li><strong>5V 4A power supply:</strong> Powers the LEDs. USB can't supply enough current (USB is 500mA; 31 LEDs at full white = ~1.8A).</li>
</ul>

<div class="callout"><div class="label">Common ground rule</div><p>The ESP32 (USB-powered) and the LEDs (wall-powered) MUST share a common ground, or the data signal reference is different between them and you get garbage output. Every build guide will hammer this point &mdash; it's the #1 mistake.</p></div>

<div class="slide-fig"><img src="/figures/battery/led_schematic.svg" alt="LED wiring schematic (SVG)" onclick="openLightbox(this)"><div class="caption">Clean schematic: ESP32 GPIO 16 &rarr; 330&ohm; resistor &rarr; 74AHCT125 pin 2 (in) &rarr; pin 3 (out) &rarr; Ring+Jewel DIN. Pin 1 (1OE) tied to GND enables the chip's output channel. Pin 14 (VCC) on +5V, pin 7 on GND. 1000 &micro;F capacitor sits on the power rails near the LED to absorb inrush. All three grounds (ESP32, 74AHCT125, LED) are tied on the blue rail.</div></div>

<div class="callout"><div class="label">Use a data-capable USB cable</div><p>Many USB cables in junk drawers are <strong>charge-only</strong> &mdash; the data lines are physically missing. They'll power the ESP32 but the computer won't see a COM port, and Arduino IDE will fail to upload with cryptic "Serial port not found" or "Failed to connect" errors. If the ESP32's power LED comes on but no port appears in <strong>Tools &rarr; Port</strong> after installing the CP2102 driver, swap to a cable you know has worked for data (e.g. the one that came with a phone that actually syncs).</p></div>

<details class="build-help"><summary>Why GPIO 16 specifically? Can I use a different pin?</summary><div class="help-body">
<p>GPIO 16 is convenient and has no known conflicts on the ESP32 DevKit V1. Any general-purpose output pin works, but avoid these:</p>
<ul>
  <li><strong>GPIO 6-11:</strong> connected to the onboard SPI flash &mdash; touching these will crash the ESP32 on boot.</li>
  <li><strong>GPIO 0, 2, 12, 15:</strong> strapping pins &mdash; they affect boot mode. Usable once booted, but avoid for a data line.</li>
  <li><strong>GPIO 1, 3:</strong> default UART0 TX/RX &mdash; wiring an LED strip here will fight the Serial Monitor.</li>
  <li><strong>GPIO 34-39:</strong> input-only &mdash; can't drive a data line.</li>
</ul>
<p>Safe alternatives if GPIO 16 is occupied: 17, 18, 19, 21, 22, 23, 25, 26, 27, 32, 33. Update <code>#define LED_PIN</code> in the firmware to match whichever you pick.</p>
</div></details>
</div>
</details>
<details class="section-fold"><summary>2.2 Place the ESP32 on the Breadboard</summary>
<div class="section-body">
<ul class="findings">
  <li><strong>Step 1:</strong> Place the ESP32 dev board straddling the center channel of the breadboard so its pins line up with the numbered rows on both sides. The USB port should hang off one end.</li>
  <li><strong>Step 2:</strong> Run a jumper wire from the ESP32's <strong>GND pin</strong> to the breadboard's <strong>blue (negative) power rail</strong>. This is the common ground.</li>
  <li><strong>Step 3:</strong> Do NOT connect the ESP32's 5V or VIN pin to the power rail. The ESP32 gets its own power from USB. Only GND is shared.</li>
</ul>
</div>
</details>
<details class="section-fold"><summary>2.3 Place the 74AHCT125 Level Shifter</summary>
<div class="section-body">
<p>The 74AHCT125 is a 14-pin DIP chip. Orient it with the notch (or dot) toward the ESP32.</p>
<ul class="findings">
  <li><strong>Step 1:</strong> Straddle the 74AHCT125 across the center channel of the breadboard, far enough from the ESP32 to leave room for jumpers.</li>
  <li><strong>Step 2:</strong> Connect <strong>pin 7 (GND)</strong> to the blue ground rail.</li>
  <li><strong>Step 3:</strong> Connect <strong>pin 14 (VCC)</strong> to the red (+5V) power rail.</li>
  <li><strong>Step 4:</strong> Connect <strong>pin 1 (1OE, output enable)</strong> to GND. This enables channel 1 of the chip. (Tying to GND = always on.)</li>
</ul>

<div class="callout"><div class="label">Pin numbering on DIP chips</div><p>Pin 1 is marked with a small dot or notch. Counting goes counterclockwise when viewed from above: pin 1 in the top-left, pin 7 in the bottom-left, pin 8 in the bottom-right, pin 14 in the top-right.</p></div>
</div>
</details>
<details class="section-fold"><summary>2.4 Wire the Data Signal Path</summary>
<div class="section-body">
<p>This is the whole point of the level shifter &mdash; to route the ESP32's data output through the chip and get a clean 5V signal out.</p>
<ul class="findings">
  <li><strong>Step 1:</strong> Run a jumper from <strong>ESP32 GPIO 16</strong> to one end of a <strong>330&ohm; resistor</strong>.</li>
  <li><strong>Step 2:</strong> From the other end of the resistor, run a short jumper to <strong>74AHCT125 pin 2 (1A, input)</strong>.</li>
  <li><strong>Step 3:</strong> Run a jumper from <strong>74AHCT125 pin 3 (1Y, output)</strong> out to an empty row &mdash; this is where the LED module's data wire will connect.</li>
</ul>
</div>
</details>
<details class="section-fold"><summary>2.5 Connect the 5V Power Supply</summary>
<div class="section-body">
<ul class="findings">
  <li><strong>Step 1:</strong> Screw the 5V 4A power supply's plug into the barrel jack adapter's positive (+) and negative (-) terminals. Confirm polarity with a multimeter if unsure &mdash; the adapter should be labeled.</li>
  <li><strong>Step 2:</strong> Run a wire from the barrel jack adapter's <strong>(+)</strong> terminal to the breadboard's <strong>red (+5V) power rail</strong>.</li>
  <li><strong>Step 3:</strong> Run a wire from the adapter's <strong>(-)</strong> terminal to the breadboard's <strong>blue (GND) power rail</strong>.</li>
  <li><strong>Step 4:</strong> Do NOT plug the wall brick into the wall yet. Power-on only after the full circuit is verified.</li>
</ul>
</div>
</details>
<details class="section-fold"><summary>2.6 Place the 1000&micro;F Capacitor</summary>
<div class="section-body">
<p>Electrolytic capacitors are polarized &mdash; getting polarity wrong can make them pop.</p>
<ul class="findings">
  <li><strong>Step 1:</strong> Identify the capacitor's <strong>negative leg</strong> &mdash; marked with a stripe and a minus sign on the can. The other leg (usually longer) is positive.</li>
  <li><strong>Step 2:</strong> Place the capacitor near where the LED module will connect (NOT near the ESP32). This is to absorb inrush current at the LEDs.</li>
  <li><strong>Step 3:</strong> Connect the <strong>positive (long) leg</strong> to the red (+5V) rail.</li>
  <li><strong>Step 4:</strong> Connect the <strong>negative (striped) leg</strong> to the blue (GND) rail.</li>
</ul>
</div>
</details>
<details class="section-fold"><summary>2.7 Connect the LED Module</summary>
<div class="section-body">
<p>All WS2812B LED modules use the same 3-wire interface: VCC (5V), GND, DIN (data in). The wiring below works for the Ring+Jewel combo, 8&times;8 matrix, or cut LED strip &mdash; only the physical solder joints differ.</p>

<h4>Ring + Jewel combo (recommended):</h4>
<ul class="findings">
  <li><strong>Step 1:</strong> Solder 3 wires to the Jewel's input pads: <strong>+5V</strong>, <strong>GND</strong>, <strong>DIN (data in)</strong>. Use red, black, and green wires for clarity.</li>
  <li><strong>Step 2:</strong> Solder 3 wires between Jewel <strong>DOUT</strong>, Jewel <strong>+5V</strong>, Jewel <strong>GND</strong> and the matching input pads (<strong>DIN</strong>, <strong>+5V</strong>, <strong>GND</strong>) on the Ring. Both boards share power; the Jewel's data-out feeds the Ring's data-in.</li>
  <li><strong>Step 3:</strong> Leave the Ring's <strong>DOUT</strong> disconnected. It's the end of the chain.</li>
  <li><strong>Step 4:</strong> Connect the Jewel's 3 input wires to the breadboard: <strong>+5V</strong> &rarr; red rail, <strong>GND</strong> &rarr; blue rail, <strong>DIN</strong> &rarr; the level shifter output from Step 2.4.</li>
</ul>

<h4>8&times;8 rigid matrix or flexible panel:</h4>
<ul class="findings">
  <li>One DIN connection to the level shifter output, one +5V, one GND. The matrix internally chains all 64 LEDs &mdash; no soldering between rows needed. Set <code>NUM_LEDS = 64</code> in firmware.</li>
</ul>

<h4>LED strip cut into 4 rows:</h4>
<ul class="findings">
  <li>Cut the strip at the marked cut lines to get 4 equal-length segments. Solder short jumper wires (VCC, GND, DATA) between the end of row 1 and the start of row 2, then row 2 to row 3, and row 3 to row 4. Arrange in a serpentine (zigzag) pattern. First row's DIN goes to the level shifter output; last row's DOUT is left unconnected. Set <code>NUM_LEDS = total LEDs across all rows</code>.</li>
</ul>
</div>
</details>
<details class="section-fold"><summary>2.8 Final Wiring Check</summary>
<div class="section-body">
<p>Before plugging anything in, verify:</p>
<ul class="findings">
  <li>ESP32 GND is tied to the blue rail (common ground)</li>
  <li>74AHCT125 pin 7 to GND, pin 14 to +5V, pin 1 to GND</li>
  <li>Data path: GPIO 16 &rarr; 330&ohm; resistor &rarr; pin 2 &rarr; pin 3 &rarr; LED DIN</li>
  <li>LED module's +5V to red rail, GND to blue rail</li>
  <li>1000&micro;F cap with long leg on +5V, striped leg on GND</li>
  <li>Barrel jack (+) to red rail, (-) to blue rail</li>
  <li>ESP32 USB cable plugged into your computer</li>
  <li>Wall brick NOT yet plugged in &mdash; do that only after Phase 3 upload</li>
</ul>
</div>
</details>
<!-- ============ PHASE 3: FIRST TEST ============ -->
<div class="phase-header"><span class="phase-num">3</span><span class="phase-title">First Upload &amp; Smoke Test</span><span class="phase-time">15 min</span></div>

<details class="section-fold" id="led-firsttest"><summary>3.1 Select Board and Port</summary>
<div class="section-body">
<ul class="findings">
  <li><strong>Tools &rarr; Board &rarr; ESP32 Arduino &rarr; ESP32 Dev Module</strong></li>
  <li><strong>Tools &rarr; Port &rarr;</strong> select your ESP32's port (COM3+ on Windows, /dev/cu.SLAB_USBtoUART on Mac, /dev/ttyUSB0 on Linux)</li>
  <li>If no port appears: install the CP2102 USB driver (Phase 1.3), unplug and replug</li>
  <li><strong>Tools &rarr; Upload Speed &rarr; 921600</strong> (drop to 115200 if upload errors occur)</li>
</ul>
</div>
</details>
<details class="section-fold"><summary>3.2 Upload NeoPixel strandtest</summary>
<div class="section-body">
<p>Don't skip this step. Uploading Adafruit's built-in strandtest example verifies your wiring independently of the custom Psych_Battery code &mdash; if strandtest fails, it's a hardware problem, not a code problem.</p>
<ul class="findings">
  <li><strong>File &rarr; Examples &rarr; Adafruit NeoPixel &rarr; strandtest</strong></li>
  <li>Near the top, find <code>#define LED_PIN 6</code> and change to <strong><code>#define LED_PIN 16</code></strong> to match the GPIO you wired.</li>
  <li>Find <code>#define LED_COUNT 60</code> and change to match your module (<strong>31</strong> for Ring+Jewel, <strong>64</strong> for 8&times;8 matrix, etc.).</li>
  <li>Plug the 5V wall brick into the wall now. You should NOT see smoke or feel heat. If you do, unplug immediately and re-check polarity and wiring.</li>
  <li>Click <strong>Upload</strong>. First compile takes ~1 minute.</li>
</ul>
</div>
</details>
<details class="section-fold"><summary>3.3 Verify the Smoke Test</summary>
<div class="section-body">
<p>If everything is wired correctly, right after upload completes you should see:</p>
<ul class="findings">
  <li>A <strong>chase animation</strong> &mdash; single LED moving across the module in red, then green, then blue, then white</li>
  <li>A <strong>rainbow cycle</strong> &mdash; all LEDs cycling through the spectrum together</li>
  <li>A <strong>theater chase</strong> pattern &mdash; alternating LEDs blinking in color</li>
  <li>The animations loop forever. Count the LEDs you see light up &mdash; should match <code>LED_COUNT</code>.</li>
</ul>

<div class="callout"><div class="label">If strandtest fails</div><p>Jump to the <a href="#led-troubleshooting">Troubleshooting Guide</a> below. The most common first-time failures are: no common ground (ESP32 GND not tied to LED GND), wrong GPIO pin, level shifter pin 1 (OE) not tied to GND, or WS2812B data wire over 15cm long (causes reflections).</p></div>
</div>
</details>
<!-- ============ PHASE 4: COMPLETE FIRMWARE ============ -->
<div class="phase-header"><span class="phase-num">4</span><span class="phase-title">The Complete Charge Bar Firmware</span><span class="phase-time">2 hours</span></div>

<details class="section-fold" id="led-chargecode"><summary>4.1 Overview of What We're Building</summary>
<div class="section-body">
<p>Once strandtest works, replace it with the real Psych_Battery sketch that:</p>
<ul class="findings">
  <li>Connects to your WiFi network</li>
  <li>Runs an async HTTP server on port 80</li>
  <li>Accepts <code>POST /charge</code> requests with JSON like <code>{"level": 75}</code></li>
  <li>Also accepts <code>GET /charge?level=75</code> for browser testing</li>
  <li>Maps 0-100 charge to a red&rarr;amber&rarr;green HSV hue gradient</li>
  <li>Applies a breathing pulse via <code>exp(sin(t))</code> for an organic, alive feel</li>
  <li>Falls back to serial commands if WiFi isn't available</li>
</ul>
</div>
</details>
<details class="section-fold"><summary>4.2 The Main Arduino Sketch</summary>
<div class="section-body">
<p>Create a new sketch (<strong>File &rarr; New Sketch</strong>) and paste this code. Save as <code>psych_battery_led.ino</code>.</p>

<details class="code-fold"><summary>psych_battery_led.ino &mdash; main firmware</summary>
<pre class="code-block"><span class="cmt">/*
 * Psych_Battery LED Firmware
 * Hardware: ESP32 DevKit V1 + WS2812B LEDs (Ring+Jewel / matrix / strip)
 * Receives charge level (0-100) via WiFi HTTP or Serial
 * Displays a red->amber->green hue gradient with a breathing pulse
 */</span>

<span class="kw">#include</span> <span class="str">&lt;WiFi.h&gt;</span>
<span class="kw">#include</span> <span class="str">&lt;AsyncTCP.h&gt;</span>
<span class="kw">#include</span> <span class="str">&lt;ESPAsyncWebServer.h&gt;</span>
<span class="kw">#include</span> <span class="str">&lt;ArduinoJson.h&gt;</span>
<span class="kw">#include</span> <span class="str">&lt;Adafruit_NeoPixel.h&gt;</span>
<span class="kw">#include</span> <span class="str">&lt;math.h&gt;</span>

<span class="cmt">// ============ CONFIG - EDIT THESE ============</span>
<span class="kw">const</span> <span class="ty">char</span>* WIFI_SSID     = <span class="str">"YourWiFiName"</span>;
<span class="kw">const</span> <span class="ty">char</span>* WIFI_PASSWORD = <span class="str">"YourWiFiPassword"</span>;
<span class="kw">const</span> <span class="ty">int</span>   HTTP_PORT     = <span class="num">80</span>;

<span class="cmt">// LED strip config</span>
<span class="kw">#define</span> LED_PIN     <span class="num">16</span>    <span class="cmt">// GPIO wired through level shifter</span>
<span class="kw">#define</span> NUM_LEDS    <span class="num">31</span>    <span class="cmt">// Ring(24) + Jewel(7). Set to 64 for 8x8 matrix.</span>
<span class="kw">#define</span> MAX_BRIGHT  <span class="num">180</span>   <span class="cmt">// 0-255. 180 is ambient-comfortable.</span>

<span class="cmt">// Animation config</span>
<span class="kw">#define</span> BREATH_MS   <span class="num">4500</span>  <span class="cmt">// Full breathing cycle duration</span>
<span class="kw">#define</span> BREATH_MIN  <span class="num">0.35f</span> <span class="cmt">// Minimum pulse floor (never fully dark)</span>

Adafruit_NeoPixel strip(NUM_LEDS, LED_PIN, NEO_GRB + NEO_KHZ800);
<span class="ty">AsyncWebServer</span> server(HTTP_PORT);

<span class="ty">int</span>  currentCharge = <span class="num">100</span>;
<span class="ty">bool</span> wifiConnected = <span class="kw">false</span>;

<span class="cmt">// ============ COLOR MAPPING ============</span>
<span class="cmt">// Charge 0   -> hue 0     (red)</span>
<span class="cmt">// Charge 50  -> hue 10922 (amber/yellow)</span>
<span class="cmt">// Charge 100 -> hue 21845 (green)</span>
<span class="ty">uint32_t</span> <span class="fn">chargeToColor</span>(<span class="ty">int</span> level, <span class="ty">uint8_t</span> brightness) {
  <span class="ty">uint16_t</span> hue = map(level, <span class="num">0</span>, <span class="num">100</span>, <span class="num">0</span>, <span class="num">21845</span>);
  <span class="kw">return</span> strip.ColorHSV(hue, <span class="num">255</span>, brightness);
}

<span class="cmt">// ============ BREATHING ANIMATION ============</span>
<span class="cmt">// exp(sin(t)) gives an organic asymmetric pulse - faster rise, slower fall</span>
<span class="ty">uint8_t</span> <span class="fn">breathBrightness</span>(<span class="ty">uint32_t</span> ms) {
  <span class="ty">float</span> phase = (<span class="ty">float</span>)(ms % BREATH_MS) / BREATH_MS * <span class="num">2.0f</span> * M_PI;
  <span class="ty">float</span> raw   = expf(sinf(phase)) - <span class="num">0.3679f</span>;   <span class="cmt">// shift so floor hits ~0</span>
  <span class="ty">float</span> norm  = raw / (M_E - <span class="num">0.3679f</span>);        <span class="cmt">// normalize to 0-1</span>
  <span class="ty">float</span> scaled = BREATH_MIN + (<span class="num">1.0f</span> - BREATH_MIN) * norm;
  <span class="kw">return</span> (<span class="ty">uint8_t</span>)(MAX_BRIGHT * scaled);
}

<span class="cmt">// ============ DISPLAY UPDATE ============</span>
<span class="ty">void</span> <span class="fn">renderFrame</span>() {
  <span class="ty">uint8_t</span>  b     = breathBrightness(millis());
  <span class="ty">uint32_t</span> color = chargeToColor(currentCharge, b);
  <span class="kw">for</span> (<span class="ty">int</span> i = <span class="num">0</span>; i &lt; NUM_LEDS; i++) strip.setPixelColor(i, color);
  strip.show();
}

<span class="cmt">// ============ SETUP ============</span>
<span class="ty">void</span> <span class="fn">setup</span>() {
  Serial.begin(<span class="num">115200</span>);
  Serial.println(<span class="str">"\nPsych_Battery LED starting..."</span>);

  strip.begin();
  strip.setBrightness(MAX_BRIGHT);
  strip.clear();
  strip.show();

  <span class="cmt">// Connect to WiFi</span>
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print(<span class="str">"Connecting to WiFi"</span>);
  <span class="ty">int</span> retries = <span class="num">0</span>;
  <span class="kw">while</span> (WiFi.status() != WL_CONNECTED && retries &lt; <span class="num">20</span>) {
    delay(<span class="num">500</span>);
    Serial.print(<span class="str">"."</span>);
    retries++;
  }
  <span class="kw">if</span> (WiFi.status() == WL_CONNECTED) {
    wifiConnected = <span class="kw">true</span>;
    Serial.print(<span class="str">"\nConnected! IP: "</span>);
    Serial.println(WiFi.localIP());
  } <span class="kw">else</span> {
    Serial.println(<span class="str">"\nWiFi failed. Running serial-only mode."</span>);
  }

  <span class="cmt">// HTTP endpoints</span>
  server.on(<span class="str">"/"</span>, HTTP_GET, [](<span class="ty">AsyncWebServerRequest</span>* req) {
    req-&gt;send(<span class="num">200</span>, <span class="str">"text/plain"</span>,
      <span class="str">"Psych_Battery LED ready. POST /charge with JSON {\"level\": 0-100}"</span>);
  });

  <span class="cmt">// GET /charge?level=75 - easy browser test</span>
  server.on(<span class="str">"/charge"</span>, HTTP_GET, [](<span class="ty">AsyncWebServerRequest</span>* req) {
    <span class="kw">if</span> (!req-&gt;hasParam(<span class="str">"level"</span>)) {
      <span class="ty">String</span> body = <span class="str">"{\"level\":"</span> + String(currentCharge) + <span class="str">"}"</span>;
      req-&gt;send(<span class="num">200</span>, <span class="str">"application/json"</span>, body);
      <span class="kw">return</span>;
    }
    <span class="ty">int</span> level = req-&gt;getParam(<span class="str">"level"</span>)-&gt;value().toInt();
    <span class="kw">if</span> (level &lt; <span class="num">0</span> || level &gt; <span class="num">100</span>) {
      req-&gt;send(<span class="num">400</span>, <span class="str">"text/plain"</span>, <span class="str">"level must be 0-100"</span>);
      <span class="kw">return</span>;
    }
    currentCharge = level;
    Serial.print(<span class="str">"HTTP GET: charge = "</span>);
    Serial.println(level);
    req-&gt;send(<span class="num">200</span>, <span class="str">"application/json"</span>,
      <span class="str">"{\"ok\":true,\"level\":"</span> + String(level) + <span class="str">"}"</span>);
  });

  <span class="cmt">// POST /charge with JSON body</span>
  server.on(<span class="str">"/charge"</span>, HTTP_POST,
    [](<span class="ty">AsyncWebServerRequest</span>* req) { <span class="cmt">/* handled by body callback */</span> },
    <span class="kw">NULL</span>,
    [](<span class="ty">AsyncWebServerRequest</span>* req, <span class="ty">uint8_t</span>* data, <span class="ty">size_t</span> len,
       <span class="ty">size_t</span> idx, <span class="ty">size_t</span> total) {
      <span class="ty">JsonDocument</span> doc;
      <span class="ty">DeserializationError</span> err = deserializeJson(doc, data, len);
      <span class="kw">if</span> (err) {
        req-&gt;send(<span class="num">400</span>, <span class="str">"text/plain"</span>, <span class="str">"Invalid JSON"</span>);
        <span class="kw">return</span>;
      }
      <span class="ty">int</span> level = doc[<span class="str">"level"</span>] | -<span class="num">1</span>;
      <span class="kw">if</span> (level &lt; <span class="num">0</span> || level &gt; <span class="num">100</span>) {
        req-&gt;send(<span class="num">400</span>, <span class="str">"text/plain"</span>, <span class="str">"level must be 0-100"</span>);
        <span class="kw">return</span>;
      }
      currentCharge = level;
      Serial.print(<span class="str">"HTTP POST: charge = "</span>);
      Serial.println(level);
      req-&gt;send(<span class="num">200</span>, <span class="str">"application/json"</span>,
        <span class="str">"{\"ok\":true,\"level\":"</span> + String(level) + <span class="str">"}"</span>);
    });

  server.begin();
  Serial.println(<span class="str">"HTTP server on port 80"</span>);
}

<span class="cmt">// ============ LOOP ============</span>
<span class="ty">void</span> <span class="fn">loop</span>() {
  <span class="cmt">// Serial fallback: type a number 0-100 + Enter</span>
  <span class="kw">if</span> (Serial.available()) {
    <span class="ty">int</span> level = Serial.parseInt();
    <span class="kw">if</span> (level &gt;= <span class="num">0</span> && level &lt;= <span class="num">100</span>) {
      currentCharge = level;
      Serial.print(<span class="str">"Serial: charge = "</span>);
      Serial.println(level);
    }
    <span class="kw">while</span> (Serial.available()) Serial.read();
  }

  renderFrame();
  delay(<span class="num">20</span>);   <span class="cmt">// ~50 fps update rate</span>
}</pre>
</details>
</div>
</details>
<details class="section-fold"><summary>4.3 Edit Your WiFi Credentials</summary>
<div class="section-body">
<p>Find these two lines near the top:</p>
<details class="code-fold"><summary>const char* WIFI_SSID     = "YourWiFiName";</summary>
<pre class="code-block"><span class="kw">const</span> <span class="ty">char</span>* WIFI_SSID     = <span class="str">"YourWiFiName"</span>;
<span class="kw">const</span> <span class="ty">char</span>* WIFI_PASSWORD = <span class="str">"YourWiFiPassword"</span>;</pre>
</details>
<p>Replace with your actual network name and password. <strong>ESP32 only supports 2.4 GHz WiFi</strong> &mdash; if your home network is 5 GHz only, use your phone's hotspot (usually 2.4 GHz) or ask your router admin to enable a 2.4 GHz band.</p>
</div>
</details>
<details class="section-fold"><summary>4.4 Set NUM_LEDS for Your Module</summary>
<div class="section-body">
<p>Find the <code>#define NUM_LEDS 31</code> line and adjust:</p>
<ul class="findings">
  <li><strong>Ring + Jewel combo:</strong> <code>NUM_LEDS 31</code> (24 + 7)</li>
  <li><strong>8&times;8 NeoMatrix:</strong> <code>NUM_LEDS 64</code></li>
  <li><strong>4-row WS2812B strip, 144 LED/m, ~48mm rows:</strong> count the LEDs you actually have and set accordingly</li>
  <li><strong>16-LED NeoPixel Ring:</strong> <code>NUM_LEDS 16</code></li>
</ul>
</div>
</details>
<details class="section-fold"><summary>4.5 Upload and Monitor</summary>
<div class="section-body">
<ul class="findings">
  <li>Click <strong>Upload</strong>. Wait for compile + flash.</li>
  <li>Open <strong>Tools &rarr; Serial Monitor</strong>. Set baud rate to <strong>115200</strong>.</li>
  <li>You should see:<br>
    <code>Psych_Battery LED starting...</code><br>
    <code>Connecting to WiFi.....</code><br>
    <code>Connected! IP: 192.168.1.123</code><br>
    <code>HTTP server on port 80</code></li>
  <li>Write down the IP address &mdash; you'll need it for the Python backend.</li>
  <li>The LEDs should light up green (100%) with a slow breathing pulse.</li>
</ul>
</div>
</details>
<details class="section-fold"><summary>4.6 Test via Serial</summary>
<div class="section-body">
<p>In the Serial Monitor, type a number 0-100 and press Enter. The LEDs should hue-shift immediately. Try:</p>
<ul class="findings">
  <li><code>85</code> &rarr; bright green, healthy pulse</li>
  <li><code>50</code> &rarr; amber/yellow</li>
  <li><code>15</code> &rarr; red, danger-zone pulse</li>
  <li><code>0</code> &rarr; deep red, minimum pulse</li>
</ul>
</div>
</details>
<details class="section-fold"><summary>4.7 Test via Browser</summary>
<div class="section-body">
<p>Open a browser on any device on the same WiFi network. Go to <code>http://192.168.1.123/charge?level=42</code> (use your IP). You should see a JSON response and the LEDs will hue-shift within a few milliseconds.</p>

<details class="build-help"><summary>Serial Monitor line-ending settings (fixes "nothing happens when I type a number")</summary><div class="help-body">
<p>Arduino IDE's Serial Monitor has a line-ending dropdown at the bottom right. It controls what character is appended when you press Enter:</p>
<ul>
  <li><strong>No line ending</strong> &mdash; nothing appended. <code>Serial.parseInt()</code> will block waiting for terminator.</li>
  <li><strong>Newline (NL)</strong> &mdash; appends <code>\n</code>. Recommended for this firmware.</li>
  <li><strong>Carriage return (CR)</strong> &mdash; appends <code>\r</code>. Also works with parseInt's default timeout.</li>
  <li><strong>Both NL &amp; CR</strong> &mdash; appends <code>\r\n</code>. Also works.</li>
</ul>
<p>If typing <code>75</code> + Enter does nothing, set line-ending to <strong>Newline</strong> and try again. Also verify baud rate is <strong>115200</strong>.</p>
</div></details>

<details class="build-help"><summary>Finding your ESP32's IP address (if Serial Monitor didn't show it)</summary><div class="help-body">
<p>If you missed the boot log, you have three options to find the IP:</p>
<ol>
  <li><strong>Re-read Serial Monitor:</strong> press the ESP32's EN/RST button with Serial Monitor open at 115200 baud. It'll re-print "Connected! IP: x.x.x.x".</li>
  <li><strong>Router admin panel:</strong> log into your router (typically <code>192.168.1.1</code> or <code>192.168.0.1</code> in a browser), find "attached devices" or "DHCP clients," look for an entry named <code>espressif</code> or matching your ESP32's MAC address.</li>
  <li><strong>Network scan:</strong> on Windows, run <code>arp -a</code> at a command prompt. On Mac/Linux, <code>arp -a</code> or <code>nmap -sn 192.168.1.0/24</code>. The ESP32's MAC starts with vendor prefix <code>24:6F:28</code>, <code>7C:9E:BD</code>, or similar Espressif range.</li>
</ol>
<p><strong>Tip:</strong> if your router supports it, assign a <strong>static DHCP lease</strong> for the ESP32's MAC address so it always gets the same IP. Saves you from re-editing <code>BATTERY_IP</code> every time your router reboots.</p>
</div></details>
</div>
</details>
<!-- ============ PHASE 5: PYTHON BACKEND ============ -->
<div class="phase-header"><span class="phase-num">5</span><span class="phase-title">Python Backend Integration</span><span class="phase-time">1 hour</span></div>

<details class="section-fold" id="led-python"><summary>5.1 Install Python Dependencies</summary>
<div class="section-body">
<p>On your laptop (the "brain" that calculates mental energy and sends it to the battery):</p>
<details class="code-fold"><summary>pip install requests aw-client pyserial</summary>
<pre class="code-block">pip install requests aw-client pyserial</pre>
</details>
<ul class="findings">
  <li><code>requests</code> &mdash; sends HTTP requests to the ESP32 over WiFi</li>
  <li><code>aw-client</code> &mdash; queries ActivityWatch for app/website usage data</li>
  <li><code>pyserial</code> &mdash; optional fallback for sending charge over USB if WiFi fails</li>
</ul>

<details class="build-help"><summary>Python install on Windows/Mac (if "pip" isn't recognized)</summary><div class="help-body">
<p><strong>Windows:</strong></p>
<ol>
  <li>Install Python 3.11+ from <a href="https://www.python.org/downloads/" target="_blank">python.org/downloads</a>. <strong>Check "Add Python to PATH"</strong> on the first installer screen &mdash; this is the #1 fix for "pip is not recognized."</li>
  <li>Restart your terminal/PowerShell after install.</li>
  <li>Verify: <code>python --version</code> and <code>pip --version</code>.</li>
  <li>If you had Python installed before without PATH, run <code>py -m pip install ...</code> as a fallback.</li>
</ol>
<p><strong>Mac:</strong></p>
<ol>
  <li>The system Python on macOS is too old. Install a modern version with <a href="https://brew.sh/" target="_blank">Homebrew</a>: <code>brew install python@3.11</code>.</li>
  <li>Use <code>python3</code> and <code>pip3</code> (not <code>python</code>/<code>pip</code>, which point to system Python).</li>
  <li>Verify: <code>python3 --version</code>.</li>
</ol>
<p><strong>Virtual env (recommended):</strong> isolates Psych_Battery deps from other Python projects.</p>
<details class="code-fold"><summary>python -m venv psychbat-env</summary>
<pre class="code-block">python -m venv psychbat-env
<span class="cmt"># Windows</span>
psychbat-env\Scripts\activate
<span class="cmt"># Mac/Linux</span>
source psychbat-env/bin/activate
pip install requests aw-client pyserial</pre>
</details>
</div></details>

<details class="build-help"><summary>Install ActivityWatch + browser extension (the data source)</summary><div class="help-body">
<p>ActivityWatch is an open-source, local-only app that tracks which windows/websites you're using. All data stays on your laptop &mdash; nothing is uploaded anywhere. Psych_Battery reads from it via <code>aw-client</code>.</p>
<p><strong>1. Install the ActivityWatch app:</strong></p>
<ul>
  <li>Download from <a href="https://activitywatch.net/" target="_blank">activitywatch.net</a> (Win/Mac/Linux installers).</li>
  <li>Run the installer. Launch ActivityWatch &mdash; the tray icon / menu bar item should show a green dot.</li>
  <li>Open <code>http://localhost:5600</code> in a browser to see the dashboard. You should see <code>aw-watcher-window</code> and <code>aw-watcher-afk</code> already collecting data.</li>
</ul>
<p><strong>2. Install the browser extension (for web-domain tracking):</strong></p>
<ul>
  <li>Chrome/Edge: <a href="https://chrome.google.com/webstore/detail/activitywatch-web-watcher/nglaklhklhcoonedhgnpgddginnjdadi" target="_blank">aw-watcher-web on Chrome Web Store</a></li>
  <li>Firefox: <a href="https://addons.mozilla.org/en-US/firefox/addon/aw-watcher-web/" target="_blank">aw-watcher-web on AMO</a></li>
  <li>After install, visit any site and refresh the ActivityWatch dashboard. A <code>aw-watcher-web</code> bucket should appear.</li>
</ul>
<p><strong>3. Verify Python can read it:</strong></p>
<details class="code-fold"><summary>python -c "from aw_client import ActivityWatchClient; c = ActivityW…</summary>
<pre class="code-block">python -c "from aw_client import ActivityWatchClient; c = ActivityWatchClient('test'); print(c.get_buckets().keys())"</pre>
</details>
<p>You should see a list including <code>aw-watcher-window_*</code>, <code>aw-watcher-afk_*</code>, and (if the extension is active) <code>aw-watcher-web-chrome</code> or similar.</p>
<p><strong>Privacy note:</strong> ActivityWatch has no cloud, no telemetry, no network calls beyond localhost. All data is stored in a local SQLite file (<code>~/.local/share/activitywatch/</code> on Linux, similar paths on Win/Mac).</p>
</div></details>

<div class="callout"><div class="label">Minimum test without the full Python backend</div><p>Before wiring in ActivityWatch, verify the LED half works end-to-end with a one-liner. After saving <code>charge_sender.py</code> (next section): <code>python charge_sender.py 42</code> should hue-shift the LEDs within a second. If that works, the ESP32 + firmware + WiFi are all good &mdash; any later problems are on the Python side.</p></div>
</div>
</details>
<details class="section-fold"><summary>5.2 The Charge Sender Module</summary>
<div class="section-body">
<p>This is the same <code>charge_sender.py</code> used by the E-Ink build &mdash; the ESP32-side HTTP contract is identical (<code>POST /charge</code> with <code>{"level": 0-100}</code>), so the Python interface doesn't change. Save as <code>charge_sender.py</code>:</p>

<details class="code-fold"><summary>charge_sender.py &mdash; unified charge interface</summary>
<pre class="code-block"><span class="str">"""
charge_sender.py - sends charge level (0-100) to the Psych_Battery.
Tries WiFi first, falls back to serial, logs locally if both fail.
"""</span>
<span class="kw">import</span> requests
<span class="kw">import</span> serial
<span class="kw">import</span> time
<span class="kw">import</span> logging
<span class="kw">from</span> pathlib <span class="kw">import</span> Path

<span class="cmt"># ============ CONFIG ============</span>
BATTERY_IP   = <span class="str">"192.168.1.123"</span>   <span class="cmt"># from Serial Monitor</span>
BATTERY_PORT = <span class="num">80</span>
SERIAL_PORT  = <span class="str">"COM3"</span>            <span class="cmt"># Windows; "/dev/cu.SLAB_USBtoUART" on Mac</span>
SERIAL_BAUD  = <span class="num">115200</span>
LOG_FILE     = Path.home() / <span class="str">".psych_battery"</span> / <span class="str">"charge.log"</span>
LOG_FILE.parent.mkdir(exist_ok=<span class="kw">True</span>)

logging.basicConfig(level=logging.INFO,
    format=<span class="str">"%(asctime)s [%(levelname)s] %(message)s"</span>)
log = logging.getLogger(<span class="str">"charge_sender"</span>)

<span class="kw">class</span> <span class="ty">ChargeSender</span>:
    <span class="kw">def</span> <span class="fn">__init__</span>(self, ip=BATTERY_IP, serial_port=SERIAL_PORT):
        self.ip = ip
        self.serial_port = serial_port
        self.last_level = <span class="kw">None</span>

    <span class="kw">def</span> <span class="fn">send</span>(self, level: <span class="ty">int</span>) -&gt; <span class="ty">bool</span>:
        <span class="str">"""Send charge level 0-100. Returns True on success."""</span>
        <span class="kw">if</span> <span class="kw">not</span> (<span class="num">0</span> &lt;= level &lt;= <span class="num">100</span>):
            <span class="kw">raise</span> <span class="ty">ValueError</span>(<span class="str">f"level must be 0-100, got {level}"</span>)

        <span class="cmt"># LEDs update instantly, so no "skip duplicates" optimization needed</span>
        self._log_local(level)

        <span class="cmt"># Try WiFi first</span>
        <span class="kw">if</span> self._send_http(level):
            self.last_level = level
            <span class="kw">return</span> <span class="kw">True</span>

        <span class="cmt"># Fall back to serial</span>
        <span class="kw">if</span> self._send_serial(level):
            self.last_level = level
            <span class="kw">return</span> <span class="kw">True</span>

        log.error(<span class="str">"Both WiFi and serial failed"</span>)
        <span class="kw">return</span> <span class="kw">False</span>

    <span class="kw">def</span> <span class="fn">_send_http</span>(self, level: <span class="ty">int</span>) -&gt; <span class="ty">bool</span>:
        url = <span class="str">f"http://{self.ip}:{BATTERY_PORT}/charge"</span>
        <span class="kw">try</span>:
            r = requests.post(url, json={<span class="str">"level"</span>: level}, timeout=<span class="num">3</span>)
            <span class="kw">if</span> r.status_code == <span class="num">200</span>:
                log.info(<span class="str">f"HTTP OK: level={level}"</span>)
                <span class="kw">return</span> <span class="kw">True</span>
            log.warning(<span class="str">f"HTTP {r.status_code}: {r.text}"</span>)
        <span class="kw">except</span> requests.exceptions.RequestException <span class="kw">as</span> e:
            log.warning(<span class="str">f"HTTP failed: {e}"</span>)
        <span class="kw">return</span> <span class="kw">False</span>

    <span class="kw">def</span> <span class="fn">_send_serial</span>(self, level: <span class="ty">int</span>) -&gt; <span class="ty">bool</span>:
        <span class="kw">try</span>:
            <span class="kw">with</span> serial.Serial(self.serial_port, SERIAL_BAUD, timeout=<span class="num">2</span>) <span class="kw">as</span> s:
                s.write(<span class="str">f"{level}\n"</span>.encode())
                s.flush()
                log.info(<span class="str">f"Serial OK: level={level}"</span>)
                <span class="kw">return</span> <span class="kw">True</span>
        <span class="kw">except</span> serial.SerialException <span class="kw">as</span> e:
            log.warning(<span class="str">f"Serial failed: {e}"</span>)
            <span class="kw">return</span> <span class="kw">False</span>

    <span class="kw">def</span> <span class="fn">_log_local</span>(self, level: <span class="ty">int</span>):
        <span class="kw">with</span> open(LOG_FILE, <span class="str">"a"</span>) <span class="kw">as</span> f:
            f.write(<span class="str">f"{time.time()},{level}\n"</span>)

<span class="cmt"># ============ CLI TEST ============</span>
<span class="kw">if</span> __name__ == <span class="str">"__main__"</span>:
    <span class="kw">import</span> sys
    <span class="kw">if</span> len(sys.argv) != <span class="num">2</span>:
        print(<span class="str">"Usage: python charge_sender.py &lt;level 0-100&gt;"</span>)
        sys.exit(<span class="num">1</span>)
    sender = ChargeSender()
    ok = sender.send(<span class="ty">int</span>(sys.argv[<span class="num">1</span>]))
    sys.exit(<span class="num">0</span> <span class="kw">if</span> ok <span class="kw">else</span> <span class="num">1</span>)</pre>
</details>
</div>
</details>
<details class="section-fold"><summary>5.3 Connect to the Psych_Battery Energy Score</summary>
<div class="section-body">
<p>This is where Tech Stack meets Build Guide. The same <code>energy_score_to_battery.py</code> loop from the E-Ink guide works unchanged, but for the LED build you can poll more aggressively because there's no e-ink refresh-cycle budget to conserve.</p>

<details class="code-fold"><summary>energy_score_to_battery.py &mdash; LED-tuned loop</summary>
<pre class="code-block"><span class="str">"""
Polls ActivityWatch every 30 seconds (faster than e-ink),
computes a mental energy score, pushes it to the Psych_Battery LEDs.
The firmware handles breathing animation locally - we just send target level.
"""</span>
<span class="kw">import</span> time
<span class="kw">from</span> datetime <span class="kw">import</span> datetime
<span class="kw">from</span> aw_client <span class="kw">import</span> ActivityWatchClient
<span class="kw">from</span> charge_sender <span class="kw">import</span> ChargeSender

<span class="cmt"># ============ TUNING ============</span>
POLL_INTERVAL_SEC = <span class="num">30</span>        <span class="cmt"># LED refresh is instant - poll often</span>
DAILY_BUDGET_MIN  = <span class="num">480</span>       <span class="cmt"># 8 hours "charged" time per workday</span>

DRAIN_PER_MIN = {
    <span class="str">"chatgpt.com"</span>:     <span class="num">2.0</span>,
    <span class="str">"claude.ai"</span>:       <span class="num">2.0</span>,
    <span class="str">"app.slack.com"</span>:   <span class="num">1.2</span>,
    <span class="str">"mail.google.com"</span>: <span class="num">1.0</span>,
    <span class="str">"twitter.com"</span>:     <span class="num">1.5</span>,
    <span class="str">"x.com"</span>:           <span class="num">1.5</span>,
    <span class="str">"linkedin.com"</span>:    <span class="num">1.3</span>,
    <span class="str">"_default_"</span>:       <span class="num">0.3</span>,
}
RECHARGE_IDLE_PER_MIN = <span class="num">0.4</span>

<span class="kw">def</span> <span class="fn">compute_energy_score</span>():
    aw = ActivityWatchClient(<span class="str">"psych_battery"</span>, testing=<span class="kw">False</span>)
    now = datetime.now().astimezone()
    start = now.replace(hour=<span class="num">9</span>, minute=<span class="num">0</span>, second=<span class="num">0</span>, microsecond=<span class="num">0</span>)

    buckets = aw.get_buckets()
    web = next((b <span class="kw">for</span> b <span class="kw">in</span> buckets <span class="kw">if</span> <span class="str">"aw-watcher-web"</span> <span class="kw">in</span> b), <span class="kw">None</span>)
    afk = next((b <span class="kw">for</span> b <span class="kw">in</span> buckets <span class="kw">if</span> <span class="str">"aw-watcher-afk"</span> <span class="kw">in</span> b), <span class="kw">None</span>)

    drain = <span class="num">0.0</span>
    <span class="kw">if</span> web:
        <span class="kw">for</span> e <span class="kw">in</span> aw.get_events(web, start=start, end=now):
            url = e.data.get(<span class="str">"url"</span>, <span class="str">""</span>)
            domain = url.split(<span class="str">"/"</span>)[<span class="num">2</span>] <span class="kw">if</span> <span class="str">"://"</span> <span class="kw">in</span> url <span class="kw">else</span> <span class="str">""</span>
            mins   = e.duration.total_seconds() / <span class="num">60</span>
            drain += mins * DRAIN_PER_MIN.get(domain, DRAIN_PER_MIN[<span class="str">"_default_"</span>])

    recharge = <span class="num">0.0</span>
    <span class="kw">if</span> afk:
        <span class="kw">for</span> e <span class="kw">in</span> aw.get_events(afk, start=start, end=now):
            <span class="kw">if</span> e.data.get(<span class="str">"status"</span>) == <span class="str">"afk"</span>:
                mins = e.duration.total_seconds() / <span class="num">60</span>
                recharge += mins * RECHARGE_IDLE_PER_MIN

    net = (drain - recharge) / DAILY_BUDGET_MIN * <span class="num">100</span>
    <span class="kw">return</span> max(<span class="num">0</span>, min(<span class="num">100</span>, <span class="ty">int</span>(<span class="num">100</span> - net)))

<span class="kw">def</span> <span class="fn">main</span>():
    sender = ChargeSender()
    <span class="kw">while</span> <span class="kw">True</span>:
        <span class="kw">try</span>:
            score = compute_energy_score()
            print(<span class="str">f"[{datetime.now():%H:%M:%S}] Energy = {score}%"</span>)
            sender.send(score)
        <span class="kw">except</span> <span class="ty">Exception</span> <span class="kw">as</span> e:
            print(<span class="str">f"Error: {e}"</span>)
        time.sleep(POLL_INTERVAL_SEC)

<span class="kw">if</span> __name__ == <span class="str">"__main__"</span>:
    main()</pre>
</details>

<div class="callout"><div class="label">LED vs E-Ink polling cadence</div><p>LEDs have no refresh budget &mdash; they update in microseconds and don't accumulate ghosting. Poll every 30-60 seconds so the battery feels live and responds to short AFK breaks. E-ink should poll every 5 minutes (12-second refresh + ghosting). The firmware handles the breathing animation locally, so the ESP32 doesn't need constant new data to look alive.</p></div>
</div>
</details>
<!-- ============ PHASE 6: ENCLOSURE ============ -->
<div class="phase-header"><span class="phase-num">6</span><span class="phase-title">Enclosure, Diffuser &amp; Mounting</span><span class="phase-time">4-5 hours (plus print time)</span></div>

<details class="section-fold" id="led-enclosure"><summary>6.1 Form Factor Considerations</summary>
<div class="section-body">
<p>The LED build lends itself to a classic cylindrical battery shape, since the Ring+Jewel combo is circular (65.5mm&oslash;). Design choices:</p>
<ul class="findings">
  <li><strong>Cylinder (recommended):</strong> 70mm outer diameter &times; 110mm tall. Ring+Jewel mounts on the inside front face, pointing forward. Top cap has a 5mm &ldquo;positive terminal&rdquo; bump for the classic AA silhouette.</li>
  <li><strong>Flat-pack laser-cut box:</strong> 80mm &times; 80mm &times; 40mm deep. Faster to fabricate but less battery-like.</li>
  <li><strong>Nalgene-scale:</strong> If matching the <a href="https://www.nalgene.com/shop/wide-mouth-1l/">Nalgene 1L wide-mouth</a> form (88.9mm&oslash; &times; 215.9mm tall), scale the diffuser panel up accordingly &mdash; consider the 8&times;8 matrix for more coverage.</li>
</ul>
</div>
</details>
<details class="section-fold"><summary>6.2 Prepare the Diffuser</summary>
<div class="section-body">
<p>The diffuser is what makes LEDs look like a battery glow rather than visible dots.</p>
<ul class="findings">
  <li><strong>If buying frosted acrylic:</strong> cut a disc or square to fit the enclosure window. No sanding needed.</li>
  <li><strong>If sanding clear acrylic:</strong> wet-sand with <strong>400 grit</strong> first (circular motion, both sides), then <strong>600 grit</strong>. Rinse and dry. The finish should look like a shower door &mdash; evenly hazy.</li>
  <li><strong>Diffuser distance:</strong> place <strong>30-50mm from the LED surface</strong>. The Ripple Effect project found <strong>50mm</strong> optimal for the 8&times;8 matrix. Too close and individual LEDs show through as dots; too far and the light loses intensity.</li>
  <li><strong>Test before final assembly:</strong> hold the diffuser in front of the lit LEDs by hand and adjust distance until the glow looks smooth and even.</li>
</ul>
</div>
</details>
<details class="section-fold"><summary>6.3 3D Print the Enclosure</summary>
<div class="section-body">
<ul class="findings">
  <li>Design in Fusion 360 (free for UC Berkeley students) or Onshape. A simple two-part cylinder: top cap with terminal bump, bottom shell with a window cutout and internal ledge for the diffuser.</li>
  <li>Print in <strong>black PLA</strong> for the shell (blocks stray light) and <strong>white PLA</strong> for reflective interior surfaces. 0.2mm layer height, 20% infill.</li>
  <li>Expected print time: 6-10 hours for the shell, 2 hours for the cap.</li>
  <li>Add a slot on the back for the USB cable exit. Add internal standoffs or a cradle to hold the ESP32 behind the LED module.</li>
  <li>Leave a 3mm internal ledge where the diffuser will rest.</li>
</ul>

<details class="build-help"><summary>Skip CAD: paste-ready OpenSCAD enclosure (exports to STL)</summary><div class="help-body">
<p>If you don't want to learn Fusion/Onshape, paste this into the free <a href="https://openscad.org/cheatsheet/" target="_blank">OpenSCAD desktop app</a> or the <a href="https://ochafik.com/openscad2/" target="_blank">web-based viewer</a>, adjust the constants at top, then <strong>File &rarr; Export &rarr; Export as STL</strong> and slice in Cura / PrusaSlicer.</p>
<details class="code-fold"><summary>psych_battery_shell.scad &mdash; parametric battery enclosure</summary>
<pre class="code-block"><span class="cmt">// Psych_Battery LED enclosure shell
// Cylinder with viewing window, +terminal bump, and back cable slot.
// Export as STL, then slice at 0.2mm layer / 20% infill / black PLA.</span>

$fn = <span class="num">80</span>;         <span class="cmt">// curve smoothness (higher = slower, prettier)</span>

<span class="cmt">// ===== parameters - tweak these =====</span>
OD       = <span class="num">70</span>;     <span class="cmt">// outer diameter (mm)</span>
H        = <span class="num">110</span>;    <span class="cmt">// shell height (mm, excl. terminal)</span>
wall     = <span class="num">2.4</span>;    <span class="cmt">// wall thickness</span>
window_d = <span class="num">50</span>;     <span class="cmt">// viewing window diameter</span>
term_d   = <span class="num">14</span>;     <span class="cmt">// + terminal bump diameter</span>
term_h   = <span class="num">6</span>;      <span class="cmt">// + terminal bump height</span>
cable_w  = <span class="num">12</span>;     <span class="cmt">// back cable slot width</span>
cable_h  = <span class="num">5</span>;      <span class="cmt">// back cable slot height</span>
ledge_z  = <span class="num">30</span>;     <span class="cmt">// diffuser ledge height from bottom</span>

module battery_shell() {
  difference() {
    union() {
      cylinder(d=OD, h=H);
      translate([<span class="num">0</span>,<span class="num">0</span>,H]) cylinder(d=term_d, h=term_h);  <span class="cmt">// + terminal</span>
    }
    <span class="cmt">// hollow interior</span>
    translate([<span class="num">0</span>,<span class="num">0</span>,wall]) cylinder(d=OD-<span class="num">2</span>*wall, h=H);
    <span class="cmt">// viewing window (front face)</span>
    translate([<span class="num">0</span>, OD/<span class="num">2</span>-wall-<span class="num">1</span>, H/<span class="num">2</span>])
      rotate([<span class="num">90</span>,<span class="num">0</span>,<span class="num">0</span>]) cylinder(d=window_d, h=wall+<span class="num">2</span>);
    <span class="cmt">// back cable slot</span>
    translate([-cable_w/<span class="num">2</span>, -OD/<span class="num">2</span>-<span class="num">1</span>, wall+<span class="num">2</span>])
      cube([cable_w, <span class="num">4</span>, cable_h]);
  }
  <span class="cmt">// internal diffuser ledge</span>
  translate([<span class="num">0</span>,<span class="num">0</span>,ledge_z])
    difference() {
      cylinder(d=OD-<span class="num">2</span>*wall, h=<span class="num">2</span>);
      translate([<span class="num">0</span>,<span class="num">0</span>,-<span class="num">1</span>]) cylinder(d=OD-<span class="num">2</span>*wall-<span class="num">6</span>, h=<span class="num">5</span>);
    }
}

battery_shell();</pre>
</details>
<p>Slicer settings that work: 0.2mm layer, 20% gyroid infill, 3 perimeters, no supports needed if the window cutout is oriented downward during printing (lay the cylinder on its side).</p>
</div></details>

<div class="slide-fig"><img src="/figures/battery/led_diffusion.png" alt="LED diffusion" onclick="openLightbox(this)"><div class="caption">Diffusion distance matters: individual LEDs are visible up close, but the 30-50mm air gap lets the light blend into a single smooth glow behind the frosted acrylic.</div></div>
</div>
</details>
<details class="section-fold"><summary>6.4 Mount the LED Module</summary>
<div class="section-body">
<ul class="findings">
  <li><strong>Step 1:</strong> Clean the inside of the enclosure shell with isopropyl alcohol to remove 3D-print dust and release agents.</li>
  <li><strong>Step 2:</strong> Position the LED module (Ring+Jewel or matrix) against the front interior wall. For the cylinder, center it on the front face.</li>
  <li><strong>Step 3:</strong> Tack it in place with 2-3 small hot-glue dots at the edges. Don't cover the LEDs themselves.</li>
  <li><strong>Step 4:</strong> Route the 3-wire bundle (VCC/GND/DIN) through an internal slot to where the ESP32 breadboard sits in the rear of the shell.</li>
  <li><strong>Step 5:</strong> If using a cut LED strip in serpentine layout: arrange segments to fill the viewing window evenly, leaving small gaps between rows for even diffusion. Hot-glue each segment's corners.</li>
</ul>
</div>
</details>
<details class="section-fold"><summary>6.5 Install the Diffuser</summary>
<div class="section-body">
<ul class="findings">
  <li><strong>Step 1:</strong> Rest the frosted diffuser on the internal 3mm ledge. It should be 30-50mm in front of the LED module.</li>
  <li><strong>Step 2:</strong> Run a thin bead of hot glue around the inside perimeter to fix it in place. Don't smear glue onto the viewable front surface.</li>
  <li><strong>Step 3:</strong> Use black electrical tape or black Sharpie around any gaps between the diffuser and shell to block light leaks &mdash; they kill the "glowing object" illusion.</li>
</ul>
</div>
</details>
<details class="section-fold"><summary>6.6 Final Assembly</summary>
<div class="section-body">
<ul class="findings">
  <li><strong>Step 1:</strong> Route the USB cable out through the back slot, with a small strain-relief knot on the inside so tugs don't pull the ESP32 loose.</li>
  <li><strong>Step 2:</strong> Route the 5V power supply cable through a separate hole (or use a shared larger hole with both cables).</li>
  <li><strong>Step 3:</strong> Seat the ESP32+breadboard inside the rear shell with foam tape or a 3D-printed cradle so it can't rattle.</li>
  <li><strong>Step 4:</strong> Snap or screw the top cap in place. The battery should look like a closed AA cell with the terminal bump up top.</li>
  <li><strong>Step 5:</strong> Plug in both USB and 5V power. The Ring+Jewel should glow green through the diffuser with a gentle pulse. If there are visible "hot spots" or individual LED dots, increase diffuser distance.</li>
</ul>
</div>
</details>
<!-- ============ APPENDIX: MATRIX OPTIONS ============ -->
<details class="section-fold" id="led-matrix"><summary>Appendix: LED Matrix Options</summary>
<div class="section-body">
<p>Instead of cutting LED strip into rows, you can use a pre-made matrix panel. Here are the best options for the ~60-70mm cylindrical battery enclosure:</p>

<table class="result-table">
<tr><th>Option</th><th>LEDs</th><th>Size</th><th>Price</th><th>Fit</th><th>Notes</th></tr>
<tr><td><strong>24-LED NeoPixel Ring + 7-LED Jewel</strong></td><td>31</td><td>65.5mm &oslash;</td><td>~$23</td><td>Perfect</td><td>Best for cylindrical battery. Smoothest diffusion. <a href="https://www.adafruit.com/product/1586" target="_blank">Ring</a> + <a href="https://www.adafruit.com/product/2226" target="_blank">Jewel</a></td></tr>
<tr><td><strong>BTF-LIGHTING 8&times;8 Flexible Panel</strong></td><td>64</td><td>80&times;80mm</td><td>~$10</td><td>Curve to fit</td><td>Flexible FPCB, can be bent into an arc. Most LEDs for the price. <a href="https://www.amazon.com/BTF-LIGHTING-0-24ft0-24ft-Programmed-Individually-Addressable/dp/B01DC0IMRW" target="_blank">Amazon</a></td></tr>
<tr><td><strong>Adafruit NeoPixel 8&times;8 Rigid</strong></td><td>64</td><td>71&times;71mm</td><td>~$35</td><td>Tight (71mm)</td><td>Rigid PCB, proven in Ripple Effect project. <a href="https://www.adafruit.com/product/1487" target="_blank">Adafruit #1487</a></td></tr>
<tr><td><strong>144 LED/m Strip (4 rows)</strong></td><td>32</td><td>56&times;48mm custom</td><td>~$3</td><td>Custom</td><td>Cheapest. Densest pitch (6.9mm). Requires soldering 6 bridges. <a href="https://www.amazon.com/BTF-LIGHTING-WS2812B1M144LB30/dp/B01CDTEJR0" target="_blank">Amazon</a></td></tr>
<tr><td><strong>16-LED NeoPixel Ring</strong></td><td>16</td><td>44.5mm &oslash;</td><td>~$10</td><td>Small</td><td>For a smaller battery. Less coverage. <a href="https://www.adafruit.com/product/1463" target="_blank">Adafruit #1463</a></td></tr>
</table>

<h4>Matrix Wiring Notes</h4>
<p>All options use the same 3-wire interface (VCC, GND, DIN). The only differences:</p>
<ul class="findings">
  <li><strong>Ring + Jewel:</strong> Jewel DIN to level shifter output. Jewel DOUT to Ring DIN. Ring DOUT unconnected. Both share VCC/GND. <code>NUM_LEDS = 31</code>.</li>
  <li><strong>8&times;8 Matrix (rigid or flexible):</strong> Single DIN to level shifter output. <code>NUM_LEDS = 64</code>. Matrix internally chains all 64 LEDs in serpentine &mdash; no soldering between rows.</li>
  <li><strong>4-row strip:</strong> Cut at marked lines, solder 3 wires (VCC/GND/Data) between rows. First row's DIN to level shifter. Last row's DOUT unconnected. <code>NUM_LEDS = total across all rows</code>.</li>
</ul>
</div>
</details>
<!-- ============ COMPARISON ============ -->
<details class="section-fold" id="led-compare"><summary>Comparison: LED vs E-Ink</summary>
<div class="section-body">
<table class="result-table">
<tr><th></th><th>LED (this build)</th><th>E-Ink</th></tr>
<tr><td><strong>Cost</strong></td><td>~$85-95</td><td>~$55-63</td></tr>
<tr><td><strong>Wiring complexity</strong></td><td>Breadboard + level shifter + capacitor + PSU</td><td>Plug-and-play kit, no wiring</td></tr>
<tr><td><strong>Blue light</strong></td><td>Yes (LED emission)</td><td>None (reflective)</td></tr>
<tr><td><strong>Dark-room visibility</strong></td><td>Self-illuminating</td><td>Needs ambient light</td></tr>
<tr><td><strong>Always-on power</strong></td><td>200-500 mW continuous</td><td>0 mW (retains image)</td></tr>
<tr><td><strong>Update speed</strong></td><td>Instant (ms)</td><td>12 sec (full flash)</td></tr>
<tr><td><strong>Information density</strong></td><td>Low (color + brightness only)</td><td>High (text, graphics, percentages)</td></tr>
<tr><td><strong>Aesthetic</strong></td><td>Warm ambient glow, animated</td><td>Paper-like, minimal, static</td></tr>
<tr><td><strong>Best for</strong></td><td>Desk-visible, responsive, ambient peripheral</td><td>Low-power, no-blue-light, legible detail</td></tr>
</table>
</div>
</details>
<!-- ============ TROUBLESHOOTING ============ -->
<details class="section-fold" id="led-troubleshooting"><summary>Troubleshooting Guide</summary>
<div class="section-body">
<table class="result-table">
<tr><th>Symptom</th><th>Likely Cause</th><th>Fix</th></tr>
<tr><td>No LEDs light up at all</td><td>No 5V power, missing common ground, wrong GPIO pin</td><td>Verify 5V rail with multimeter. Confirm ESP32 GND is tied to the blue rail. Check <code>#define LED_PIN 16</code> matches wired GPIO.</td></tr>
<tr><td>First LED lights, rest stay dark</td><td>Bad solder joint between segments, or broken data line downstream</td><td>Reflow the DOUT &rarr; DIN joint between the failing pair. If using cut strip, check the 3 jumper wires between rows.</td></tr>
<tr><td>Wrong or random colors</td><td>Missing level shifter, data wire too long, or wrong color order</td><td>Add/verify 74AHCT125 on the data line. Keep the data wire under 15cm. Check <code>NEO_GRB</code> matches your LED (some are RGB, not GRB).</td></tr>
<tr><td>LEDs flicker or dim randomly</td><td>Insufficient power, capacitor missing, or brownout</td><td>Use external 5V 4A PSU (not USB power). Verify 1000&micro;F cap is installed. Check PSU isn't being shared with something else.</td></tr>
<tr><td>LEDs show briefly then go dark</td><td>ESP32 browns out from LED inrush current</td><td>LEDs should NOT be powered from ESP32's 5V pin. Use the external PSU to the rail, share GND only.</td></tr>
<tr><td>Upload fails: "Failed to connect to ESP32"</td><td>Board/Port not selected, or auto-reset circuit faulty</td><td>Tools &rarr; Port &rarr; pick COM port. Press &amp; hold BOOT button on ESP32 while upload starts, release when "Writing" appears.</td></tr>
<tr><td>Upload: "A fatal error occurred: Serial data stream stopped"</td><td>Upload speed too high, or bad USB cable</td><td>Tools &rarr; Upload Speed &rarr; 115200. Swap to a known-good data cable (charge-only cables won't work).</td></tr>
<tr><td>"Connecting to WiFi...." never ends</td><td>Wrong SSID/password, or 5GHz network</td><td>Double-check credentials. ESP32 only does 2.4GHz &mdash; use a phone hotspot if needed.</td></tr>
<tr><td>HTTP requests time out from Python</td><td>ESP32 lost WiFi, or IP address changed</td><td>Check Serial Monitor for current IP. Update <code>BATTERY_IP</code> in charge_sender.py. Consider a static DHCP lease on your router.</td></tr>
<tr><td>Individual LED dots visible through diffuser</td><td>Diffuser too close to LEDs or not frosted enough</td><td>Increase distance to 40-50mm. Sand with finer grit (600+). Add a second diffusion layer (thin vellum paper) if needed.</td></tr>
<tr><td>Breathing animation looks jerky</td><td><code>loop()</code> delay too long, or HTTP blocking the loop</td><td>Keep <code>delay(20)</code> or less. Verify you're using ESPAsyncWebServer (not blocking <code>WebServer.h</code>).</td></tr>
<tr><td>Color is too bright / harsh</td><td><code>MAX_BRIGHT</code> set too high</td><td>Reduce <code>#define MAX_BRIGHT 180</code> to 100-130 for a softer ambient look.</td></tr>
<tr><td>COM port doesn't appear on your computer</td><td>Missing CP2102 USB driver</td><td>Install from <a href="https://www.silabs.com/developers/usb-to-uart-bridge-vcp-drivers" target="_blank">Silicon Labs</a>. Unplug/replug after install.</td></tr>
</table>

<div class="callout"><div class="label">When to ask for help</div><p>If the LEDs are mis-coloring, flickering, or partially dark, photograph your breadboard top-down under bright light and post to the <a href="https://forums.adafruit.com/viewforum.php?f=47" target="_blank">Adafruit NeoPixel forum</a> with a description of your LED count, power supply rating, and whether strandtest worked. 90% of first-time LED bugs are a missing common ground or a skipped level shifter.</p></div>
</div>
</details>
</div>

<!-- ===== E-INK BUILD GUIDE ===== -->
<div class="section" id="sec-seinkguide">
<h2>E-Ink (5.79" 4-Color Bar): Complete Build Guide</h2>
<p>A complete, end-to-end guide for building a Psych_Battery prototype using the <strong>Good Display GDEY0579F52</strong> &mdash; a 5.79-inch 4-color e-ink bar display (red/yellow/black/white). This guide walks you through every step: buying parts, installing software, wiring the circuit, writing the code, and integrating with the Psych_Battery Python backend. Assumes no prior experience with ESP32 or e-ink displays.</p>

<div class="slide-fig"><img src="/figures/battery/eink_prototype.png" alt="E-ink battery prototype" onclick="openLightbox(this)"><div class="caption">The finished prototype: a battery-shaped enclosure with the 5.79" 4-color e-ink bar display showing charge level. Yellow fill = healthy, red = danger. Readable in daylight with no backlight. USB-C for power and data.</div></div>

<details class="section-fold"><summary>Table of Contents</summary>
<div class="section-body">
<div class="toc"><ul>
  <li><a href="#eink-why">Why E-Ink for Psych_Battery</a></li>
  <li><a href="#eink-bom">Phase 0: Supplies &amp; What's In Your Kit</a></li>
  <li><a href="#eink-software">Phase 1: Software Setup (Arduino IDE + Libraries)</a></li>
  <li><a href="#eink-wiring">Phase 2: Hardware Assembly (Kit Plug-and-Play)</a></li>
  <li><a href="#eink-firsttest">Phase 3: First Upload &amp; Smoke Test</a></li>
  <li><a href="#eink-chargecode">Phase 4: The Complete Charge Bar Firmware</a></li>
  <li><a href="#eink-python">Phase 5: Python Backend Integration</a></li>
  <li><a href="#eink-enclosure">Phase 6: Enclosure &amp; Mounting</a></li>
  <li><a href="#eink-troubleshooting">Troubleshooting Guide</a></li>
</ul></div>
</div>
</details>
<details class="section-fold" id="eink-why"><summary>Why E-Ink for Psych_Battery?</summary>
<div class="section-body">
<ul class="findings">
  <li><strong>Zero blue light.</strong> E-ink reflects ambient light like paper. No backlight, no screen glow. Matches the "no blue-light screens" design constraint perfectly.</li>
  <li><strong>Always-on with zero power.</strong> The charge bar stays visible even when the ESP32 is asleep or unplugged. The display retains its image indefinitely without drawing any current.</li>
  <li><strong>Daylight readable.</strong> Gets <em>more</em> visible in bright light (opposite of LEDs/LCDs). Perfect for a desk near a window.</li>
  <li><strong>4 colors map cleanly to charge zones.</strong> Yellow = healthy/charged, Red = danger/depleted, Black = text and outlines, White = background. Discrete zones, no gradient needed.</li>
  <li><strong>Slow refresh is acceptable.</strong> A charge bar that updates every few minutes is a perfect match for the 12-second refresh cycle.</li>
</ul>

<div class="callout"><div class="label">Known Limitation: Dark Rooms</div><p>E-ink is not visible in a dark room without ambient light. If your desk is in a dim space, add a <strong>single RGB LED</strong> alongside the e-ink display for low-charge alerts (pulse red when critically depleted). The e-ink handles the primary display; the LED handles dark-room visibility.</p></div>
</div>
</details>
<details class="section-fold"><summary>Full Circuit Blueprint</summary>
<div class="section-body">
<div class="slide-fig"><img src="/figures/battery/eink_blueprint.png" alt="E-ink circuit blueprint" onclick="openLightbox(this)"><div class="caption">Complete circuit: ESP32 &rarr; SPI signals (MOSI, CLK, CS, DC, RST, BUSY) &rarr; DESPI-C579 driver board &rarr; FPC ribbon cable &rarr; 5.79" 4-color e-ink display showing battery charge bar.</div></div>
</div>
</details>
<!-- ============ PHASE 0: SUPPLIES ============ -->
<div class="phase-header"><span class="phase-num">0</span><span class="phase-title">Supplies &amp; What's In Your Kit</span><span class="phase-time">15 min (inventory)</span></div>

<div class="callout"><div class="label">You bought the ESP32-L(C579) Development Kit from Good Display</div><p>This is the integrated all-in-one kit from buy-lcd.com. It replaces the separate ESP32 DevKit + breadboard + jumper wires + header pins approach. The kit contains everything you need to drive the display &mdash; no breadboard wiring required, no soldering, no purchase of individual electronic components. Just plug the DESPI-C579 into the ESP32-L motherboard, connect the display ribbon cable, and plug in USB.</p></div>

<details class="section-fold" id="eink-bom"><summary>0.1 What's In Your Kit (you already have these)</summary>
<div class="section-body">
<table class="result-table">
<tr><th>Item</th><th>What It Is</th><th>Replaces (from generic BOM)</th></tr>
<tr><td><strong>5.79" GDEY0579F52 Display</strong></td><td>4-color e-ink panel, 792&times;272, 139&times;48mm active area, 24-pin FPC ribbon</td><td>The display ($18-25)</td></tr>
<tr><td><strong>ESP32-L Motherboard</strong></td><td>Pre-built ESP32 dev board with USB port, reset button, LED indicators, flash chip, and a dedicated socket for the DESPI-C579 connector board. WiFi + Bluetooth built in.</td><td>ESP32 DevKit V1 ($8) + breadboard ($5) + jumper wires ($7) + header pins ($3)</td></tr>
<tr><td><strong>DESPI-C579 Connector Board</strong></td><td>Small adapter board with a 24-pin FPC ZIF connector for the display cable. Plugs directly into the ESP32-L motherboard via a mating header &mdash; no soldering needed.</td><td>DESPI-C579 adapter ($7)</td></tr>
<tr><td><strong>FPC Connector/Extender</strong></td><td>Spare 24-pin flat flex cable extender in case you need to route the display further from the driver board.</td><td>Not in the generic BOM (bonus component)</td></tr>
<tr><td><strong>USB Cable</strong></td><td>Data-capable cable for powering and programming the ESP32-L from your laptop.</td><td>Micro-USB cable ($5)</td></tr>
</table>

<p><strong>Kit covers ~$55 worth of components.</strong> You only need to source the enclosure materials below.</p>
</div>
</details>
<details class="section-fold"><summary>0.2 Supplies You Still Need (not in the kit)</summary>
<div class="section-body">
<p>These are physical materials for the enclosure and mounting. Most are available at UC Berkeley makerspaces, but bring this list to make sure you don't get stuck mid-build.</p>

<table class="result-table">
<tr><th>Supply</th><th>Purpose</th><th>Available at Jacobs?</th><th>Or buy yourself</th></tr>
<tr><td><strong>PLA filament (white or gray)</strong></td><td>3D-printing the battery-shaped enclosure (~50g needed)</td><td>Yes (Jacobs Hall, Supernode, CITRIS all stock common colors)</td><td>~$25/kg on Amazon if you want a specific color</td></tr>
<tr><td><strong>3M VHB F9460PC thin double-sided tape</strong></td><td>Permanently mounting the display bezel to the inside of the enclosure. The 0.15mm thin version is ideal.</td><td>Jacobs has generic double-sided tape &mdash; works but less reliable</td><td>~$8 on Amazon (best option)</td></tr>
<tr><td><strong>Isopropyl alcohol (90%+)</strong></td><td>Cleaning enclosure and display bezel before applying tape</td><td>Yes (Jacobs / CITRIS electronics bench)</td><td>~$5 at any pharmacy if needed</td></tr>
<tr><td><strong>Fine sandpaper (400 &amp; 600 grit)</strong></td><td>Smoothing 3D-printed enclosure surfaces (layer lines)</td><td>Yes (Jacobs hand tool area)</td><td>~$5 at hardware store</td></tr>
<tr><td><strong>M3 screws + heat-set inserts (optional)</strong></td><td>Assembling a 2-part enclosure (alternative: friction fit)</td><td>Yes (Jacobs fastener bin)</td><td>~$10 on Amazon if needed</td></tr>
<tr><td><strong>Clear acrylic pane, 1mm (optional)</strong></td><td>Protective window over the display</td><td>Yes (Jacobs laser cutter has clear acrylic scraps, often free)</td><td>~$5 for a sheet from Canal Plastics</td></tr>
</table>

<p><strong>Minimum additional cost: $0-$13</strong> depending on how much you source from Jacobs vs buy yourself. The 3M VHB tape is the one item I'd strongly recommend buying fresh.</p>
</div>
</details>
<details class="section-fold"><summary>0.3 Tools You'll Use (all free at UC Berkeley makerspaces)</summary>
<div class="section-body">
<table class="result-table">
<tr><th>Tool</th><th>Purpose</th><th>Where to Find It</th></tr>
<tr><td><strong>3D printer</strong></td><td>Printing the enclosure (~6-10 hour print for a battery-sized shell)</td><td><a href="https://jacobsinstitute.berkeley.edu/making-at-jacobs/" target="_blank">Jacobs Hall</a> (Ultimakers), <a href="https://supernode.berkeley.edu/" target="_blank">Supernode</a> (24/7, Cory Hall), <a href="https://invent.citris-uc.org/" target="_blank">CITRIS Invention Lab</a> (Sutardja Dai Hall)</td></tr>
<tr><td><strong>Computer with USB port</strong></td><td>Running Arduino IDE and uploading firmware</td><td>Bring your laptop</td></tr>
<tr><td><strong>Fingernail or small flathead</strong></td><td>Opening the ZIF ribbon cable connector</td><td>You have fingernails. Otherwise Jacobs has precision screwdriver sets.</td></tr>
<tr><td><strong>X-Acto knife</strong></td><td>Trimming support material off the 3D print</td><td>Jacobs hand tool area</td></tr>
<tr><td><strong>Multimeter (optional)</strong></td><td>Debugging if something doesn't work (unlikely with the kit &mdash; nothing to miswire)</td><td>Jacobs and CITRIS electronics benches</td></tr>
<tr><td><strong>Soldering iron (probably NOT needed)</strong></td><td>Only needed if you're adding an optional RGB LED for dark-room alerts</td><td>Jacobs, CITRIS, Supernode all have soldering stations</td></tr>
</table>

<div class="callout"><div class="label">Maker Pass required</div><p>To use Jacobs Hall, CITRIS Invention Lab, or most Berkeley makerspaces, you need a Maker Pass. Sign up at <a href="https://jacobsinstitute.berkeley.edu/our-space/" target="_blank">jacobsinstitute.berkeley.edu</a> &mdash; free for UC Berkeley students. Supernode is free and 24/7 with no pass required.</p></div>
</div>
</details>
<details class="section-fold"><summary>0.4 Final Shopping List (if you want to cover everything)</summary>
<div class="section-body">
<p>If you want to buy everything yourself instead of relying on makerspace supplies, here's the complete list for the enclosure side:</p>
<ul class="findings">
  <li><a href="https://www.amazon.com/3M-VHB-F9460PC-Adhesive-Transfer/dp/B00N56JA1E" target="_blank">3M VHB F9460PC tape</a> &mdash; ~$8</li>
  <li>PLA filament, 0.5kg in white or gray &mdash; ~$15 on Amazon (if Jacobs is out of stock)</li>
  <li>Isopropyl alcohol 90%+, small bottle &mdash; ~$5 at any pharmacy</li>
  <li>Assorted sandpaper pack (400/600/1000 grit) &mdash; ~$6 at Home Depot</li>
</ul>
<p><strong>Absolute maximum cost beyond the kit: ~$35.</strong> Realistic cost if using makerspace resources: <strong>$8</strong> (just the VHB tape).</p>
</div>
</details>
<!-- ============ PHASE 1: SOFTWARE ============ -->
<div class="phase-header"><span class="phase-num">1</span><span class="phase-title">Software Setup (Arduino IDE + Libraries)</span><span class="phase-time">45 min</span></div>

<details class="section-fold" id="eink-software"><summary>1.1 Install Arduino IDE 2.x</summary>
<div class="section-body">
<p>Arduino IDE is the free program where you'll write code and upload it to the ESP32. It handles compiling, library management, and USB uploading.</p>
<ul class="findings">
  <li>Go to <a href="https://www.arduino.cc/en/software" target="_blank">arduino.cc/en/software</a></li>
  <li>Download the "Arduino IDE 2.x" installer for your OS (Windows, Mac, or Linux)</li>
  <li>Run the installer. Accept all defaults. On Mac, drag it to Applications.</li>
  <li>Launch Arduino IDE. You'll see an empty sketch with <code>setup()</code> and <code>loop()</code> functions.</li>
</ul>
</div>
</details>
<details class="section-fold"><summary>1.2 Add ESP32 Board Support</summary>
<div class="section-body">
<p>Arduino IDE doesn't know about ESP32 by default. You have to add Espressif's board package URL.</p>
<ul class="findings">
  <li>In Arduino IDE, go to <strong>File &rarr; Preferences</strong> (Windows/Linux) or <strong>Arduino IDE &rarr; Settings</strong> (macOS)</li>
  <li>Find the field labeled <strong>"Additional boards manager URLs"</strong></li>
  <li>Paste this URL: <code>https://espressif.github.io/arduino-esp32/package_esp32_index.json</code></li>
  <li>Click OK</li>
  <li>Go to <strong>Tools &rarr; Board &rarr; Boards Manager</strong></li>
  <li>Search for <strong>"esp32"</strong></li>
  <li>Install <strong>"esp32 by Espressif Systems"</strong> (version 3.x or higher). This takes ~3-5 minutes.</li>
  <li>After installation: <strong>Tools &rarr; Board &rarr; ESP32 Arduino &rarr; ESP32 Dev Module</strong></li>
</ul>
</div>
</details>
<details class="section-fold"><summary>1.3 Install USB Driver (Windows/Mac only)</summary>
<div class="section-body">
<p>The ESP32 DevKit V1 uses a <strong>CP2102</strong> USB-to-serial chip. Most modern computers have the driver pre-installed, but if your ESP32 doesn't appear as a COM port, install it manually.</p>
<ul class="findings">
  <li>Download the driver from <a href="https://www.silabs.com/developers/usb-to-uart-bridge-vcp-drivers" target="_blank">Silicon Labs CP2102 drivers</a></li>
  <li>Install, reboot if prompted</li>
  <li>Plug in your ESP32 via USB. Open Arduino IDE &rarr; <strong>Tools &rarr; Port</strong>. You should see a new port appear (COM3+ on Windows, /dev/cu.SLAB_USBtoUART on Mac, /dev/ttyUSB0 on Linux). Select it.</li>
</ul>
</div>
</details>
<details class="section-fold"><summary>1.4 Install Required Arduino Libraries</summary>
<div class="section-body">
<p>You need three libraries to drive the display and run a WiFi HTTP server. Install via <strong>Sketch &rarr; Include Library &rarr; Manage Libraries</strong>:</p>
<ul class="findings">
  <li><strong>Adafruit GFX Library</strong> by Adafruit (latest version) &mdash; provides drawing primitives like <code>fillRect</code>, <code>drawLine</code>, <code>setCursor</code>, <code>print</code></li>
  <li><strong>Adafruit BusIO</strong> by Adafruit (auto-installed as dependency of GFX)</li>
  <li><strong>ArduinoJson</strong> by Benoit Blanchon (version 7.x) &mdash; parses JSON from HTTP requests</li>
</ul>

<p>For the WiFi HTTP server, you'll use <code>WebServer.h</code> which is built into the ESP32 board package &mdash; no separate install needed.</p>
</div>
</details>
<details class="section-fold"><summary>1.5 Download Good Display's Sample Code for GDEY0579F52</summary>
<div class="section-body">
<p>The critical step. The popular GxEPD2 library does <strong>not</strong> support the GDEY0579F52 (dual IST7158 controllers). You must use Good Display's vendor-provided sample code.</p>
<ul class="findings">
  <li>Go to <a href="https://www.good-display.com/companyfile/1832.html" target="_blank">good-display.com/companyfile/1832.html</a></li>
  <li>Download the ZIP file (titled "ESP32 demo for GDEY0579F52" or similar, ~21KB)</li>
  <li>Unzip it. You should see a folder containing an <code>.ino</code> file and a few <code>.h</code> / <code>.cpp</code> support files (<code>EPD_5in79_G.h</code>, <code>EPD_5in79_G.cpp</code>, <code>DEV_Config.h</code>, <code>DEV_Config.cpp</code>, <code>ImageData.h</code>)</li>
  <li>Open the <code>.ino</code> file in Arduino IDE. Arduino IDE will ask to move it into a properly-named folder &mdash; click yes.</li>
</ul>

<div class="callout"><div class="label">Why this sample code is critical</div><p>The GDEY0579F52 uses <strong>two IST7158 driver ICs</strong> internally (Master + Slave). Each controls half the screen. The register addressing uses offsets (Master at 0x00-0x79, Slave at Master + 0x80). No generic e-paper library understands this &mdash; they'll only drive half the screen. Good Display's sample has the correct init sequence and register map baked in.</p></div>

<details class="build-help"><summary>Which of the two download pages should I use?</summary><div class="help-body">
<p>There are two URLs floating around and they are not interchangeable:</p>
<ul>
  <li><strong><a href="https://www.good-display.com/companyfile/1832.html" target="_blank">good-display.com/companyfile/1832.html</a></strong> &mdash; the generic GDEY0579F52 demo. Works if you are wiring a bare ESP32 to the DESPI-C579 on a breadboard with your own pin choices.</li>
  <li><strong><a href="https://buyepaper.com/products/579-inch-e-paper-display-development-kit-esp32-epaper-board-esp32-lc579" target="_blank">buyepaper.com product page &rarr; Resources</a></strong> &mdash; the ESP32-L(C579) kit demo. Pin mapping in <code>DEV_Config.h</code> already matches the hardwired GPIOs on the ESP32-L motherboard. <strong>This is the one you want</strong> &mdash; you own the kit.</li>
</ul>
<p>If the companyfile download is the only one you can find, you can still use it, but you'll need to edit <code>DEV_Config.h</code> to match the ESP32-L pins shown in Phase 3.1 below (BUSY=25, RST=26, DC=27, CS=15, CLK=13, MOSI=14).</p>
</div></details>
</div>
</details>
<!-- ============ PHASE 2: WIRING ============ -->
<div class="phase-header"><span class="phase-num">2</span><span class="phase-title">Hardware Wiring (Step by Step)</span><span class="phase-time">30 min</span></div>

<details class="section-fold" id="eink-wiring"><summary>2.1 Understand the Components</summary>
<div class="section-body">
<p>The ESP32-L(C579) kit is designed so the pieces fit together without any breadboard wiring. Here's what each piece does:</p>
<ul class="findings">
  <li><strong>ESP32-L motherboard:</strong> The "brain." Pre-built ESP32-based board with USB port, reset button, status LEDs, and a built-in socket (called the "DESPI interface") where the connector board plugs in. Has WiFi and Bluetooth built in.</li>
  <li><strong>DESPI-C579 connector board:</strong> A small adapter PCB with a ZIF connector (for the display's ribbon cable) on one end and a set of pins that mate directly into the ESP32-L motherboard's socket on the other end. No soldering, no jumper wires &mdash; it just plugs in.</li>
  <li><strong>GDEY0579F52 display:</strong> The 4-color e-ink panel with a thin, flexible 24-pin ribbon cable (FPC) permanently attached.</li>
  <li><strong>USB cable:</strong> Carries both power and data between your laptop and the ESP32-L.</li>
</ul>

<div class="callout"><div class="label">What you're NOT doing (compared to a generic build)</div><p>No breadboard. No jumper wires. No soldering header pins. No debugging 8 separate wire connections. The kit was designed specifically to eliminate all of that. Total assembly time is about 10 minutes.</p></div>
</div>
</details>
<details class="section-fold"><summary>2.2 Plug the DESPI-C579 Into the ESP32-L Motherboard</summary>
<div class="section-body">
<p>The ESP32-L motherboard has a dedicated socket (a cluster of female pin headers) labeled something like "DESPI" or with matching silkscreen for the connector board.</p>
<ul class="findings">
  <li><strong>Step 1:</strong> Find the socket on the ESP32-L motherboard. It's the row of female headers designed to receive the DESPI-C579's pins.</li>
  <li><strong>Step 2:</strong> Orient the DESPI-C579 so its ZIF connector (the wide black connector with a flip-up tab) faces <em>outward</em> (away from the motherboard) &mdash; this gives the ribbon cable room to reach.</li>
  <li><strong>Step 3:</strong> Align the male pins on the bottom of the DESPI-C579 with the female socket on the motherboard. They should only fit one way; if it feels wrong, rotate 180&deg;.</li>
  <li><strong>Step 4:</strong> Press firmly and evenly until the connector board is fully seated. The pins should be fully inserted with no gap between the two boards.</li>
</ul>
</div>
</details>
<details class="section-fold"><summary>2.3 Connect the Display Ribbon Cable to the DESPI-C579</summary>
<div class="section-body">
<p>This is the most delicate step in the entire build. The ribbon cable is fragile &mdash; handle it gently.</p>

<div class="slide-fig"><img src="/figures/battery/eink_ribbon.svg" alt="ZIF ribbon cable insertion: lift tab, insert with contacts DOWN, push tab down" onclick="openLightbox(this)"><div class="caption">Side-view of the DESPI-C579 ZIF connector. The shiny gold contacts on the ribbon MUST face down (toward the PCB). Getting this backwards is the #1 first-build failure.</div></div>

<ul class="findings">
  <li><strong>Step 1:</strong> Find the ZIF connector on the DESPI-C579. It's the wide black connector with a small flip-up tab on one edge.</li>
  <li><strong>Step 2:</strong> Gently flip the black tab <strong>up</strong> (perpendicular to the board) using a fingernail or small flathead screwdriver. It should move about 2mm. Don't force it &mdash; if it resists, you're pushing the wrong part.</li>
  <li><strong>Step 3:</strong> Take the display's ribbon cable. Notice that it has shiny metal contacts only on <em>one side</em>.</li>
  <li><strong>Step 4:</strong> Slide the ribbon cable into the ZIF slot with the contacts facing <strong>down</strong> (toward the PCB). Push gently and evenly until the cable stops &mdash; about 5-6mm deep.</li>
  <li><strong>Step 5:</strong> Flip the black tab back <strong>down</strong> (flat against the PCB) to clamp the cable in place.</li>
  <li><strong>Step 6:</strong> Very gently tug on the cable to verify it's locked. It should not come out. If it slides out, re-open the tab and re-seat.</li>
</ul>

<div class="callout"><div class="label">Ribbon cable orientation tip</div><p>If you can't tell which side has contacts: look at the ribbon under a bright light. The contacts are slightly shiny/gold-colored compared to the plastic backing. Those shiny contacts go DOWN (facing the PCB), not up. Getting this backwards is the #1 mistake and will show a blank screen even with correct code.</p></div>
</div>
</details>
<details class="section-fold"><summary>2.4 Connect USB Cable</summary>
<div class="section-body">
<ul class="findings">
  <li><strong>Step 1:</strong> Plug the USB cable (included in the kit) into the USB port on the ESP32-L motherboard.</li>
  <li><strong>Step 2:</strong> Plug the other end into your computer.</li>
  <li><strong>Step 3:</strong> You should see a power LED light up on the ESP32-L. If nothing lights up, try a different USB cable or port (the kit cable should work, but computer ports can be flaky).</li>
</ul>
</div>
</details>
<details class="section-fold"><summary>2.5 Physical Assembly Check</summary>
<div class="section-body">
<p>Before moving on to software, verify:</p>
<ul class="findings">
  <li>DESPI-C579 is fully seated in the ESP32-L motherboard socket (no visible gap)</li>
  <li>Ribbon cable is firmly locked in the ZIF connector with the tab pushed down</li>
  <li>Display panel is free to move on the bench (don't stress the ribbon cable)</li>
  <li>USB cable is connected between the ESP32-L and your computer</li>
  <li>Power LED on ESP32-L is lit</li>
</ul>

<p>That's it. Hardware assembly is done. With the kit, this takes about 10 minutes compared to the 30+ minutes of breadboard wiring a generic build would require.</p>

<div class="slide-fig"><img src="/figures/battery/eink_assembly.png" alt="E-ink assembly" onclick="openLightbox(this)"><div class="caption">Assembly: the display ribbon cable inserts into the ZIF connector on the DESPI-C579, which in turn plugs into the ESP32-L motherboard's socket. No breadboard, no jumper wires.</div></div>
</div>
</details>
<!-- ============ PHASE 3: FIRST TEST ============ -->
<div class="phase-header"><span class="phase-num">3</span><span class="phase-title">First Upload &amp; Smoke Test</span><span class="phase-time">15 min</span></div>

<details class="section-fold" id="eink-firsttest"><summary>3.1 Good News: No Pin Editing Needed</summary>
<div class="section-body">
<p>With the ESP32-L(C579) kit, the sample code from Good Display is <strong>preconfigured for the ESP32-L motherboard's fixed GPIO pin mapping</strong>. Unlike a generic ESP32 + DESPI-C579 on a breadboard (where you pick your own pins and edit <code>DEV_Config.h</code>), the ESP32-L hardware routes the display signals to specific GPIOs that the sample code already knows about.</p>

<div class="callout"><div class="label">Just for reference: ESP32-L pin mapping</div><p>You don't need to change these, but in case you want to know what's happening under the hood, the ESP32-L routes display signals to these GPIOs (documented in the sample code's <code>DEV_Config.h</code>):
<br><br>
<code>BUSY &rarr; GPIO 25 | RST &rarr; GPIO 26 | DC &rarr; GPIO 27 | CS &rarr; GPIO 15 | CLK &rarr; GPIO 13 | MOSI &rarr; GPIO 14</code>
<br><br>
These are hardwired on the ESP32-L motherboard's PCB. Don't change them in the sample code.</p></div>
</div>
</details>
<details class="section-fold"><summary>3.2 Download the ESP32-L(C579) Sample Code</summary>
<div class="section-body">
<p>Good Display provides a specific sample code bundle for the ESP32-L(C579) kit. <strong>This is different from the generic GDEY0579F52 sample</strong> &mdash; make sure you get the right one.</p>
<ul class="findings">
  <li>Go to the <a href="https://buyepaper.com/products/579-inch-e-paper-display-development-kit-esp32-epaper-board-esp32-lc579" target="_blank">ESP32-L(C579) product page</a> on buyepaper.com</li>
  <li>Scroll to the "Resources" or "Downloads" section and download the ESP32-L(C579) sample code ZIP (may also be linked as <a href="https://www.good-display.com/companyfile/1832.html" target="_blank">good-display.com/companyfile/1832.html</a>)</li>
  <li>Unzip the archive. You should see a folder with the main <code>.ino</code> Arduino sketch and support files: <code>EPD_5in79_G.h</code>, <code>EPD_5in79_G.cpp</code>, <code>DEV_Config.h</code>, <code>DEV_Config.cpp</code>, <code>ImageData.h</code>, and <code>GUI_Paint.h/.cpp</code></li>
  <li>Open the <code>.ino</code> file in Arduino IDE. If it asks to move into a correctly named folder, click yes.</li>
</ul>
</div>
</details>
<details class="section-fold"><summary>3.3 Select Board and Port</summary>
<div class="section-body">
<ul class="findings">
  <li><strong>Tools &rarr; Board &rarr; ESP32 Arduino &rarr; ESP32 Dev Module</strong> (the ESP32-L uses the generic ESP32 profile)</li>
  <li><strong>Tools &rarr; Port &rarr;</strong> select the port your ESP32-L is on (COM3+ on Windows, /dev/cu.SLAB_USBtoUART on Mac, /dev/ttyUSB0 on Linux)</li>
  <li>If no port appears: install the CP2102 USB driver from <a href="https://www.silabs.com/developers/usb-to-uart-bridge-vcp-drivers" target="_blank">Silicon Labs</a>, then unplug and replug the USB cable</li>
  <li><strong>Tools &rarr; Upload Speed &rarr; 921600</strong> (or 115200 if upload errors occur)</li>
  <li><strong>Tools &rarr; Partition Scheme &rarr; Default 4MB with spiffs</strong></li>
</ul>
</div>
</details>
<details class="section-fold"><summary>3.4 Upload the Unmodified Sample Code</summary>
<div class="section-body">
<p>This is your "hello world." The sample will display test patterns to verify everything works before you write custom code.</p>
<ul class="findings">
  <li>Click the <strong>Upload</strong> button (right-arrow icon, top-left). First compile takes 2-3 minutes (library cache builds).</li>
  <li>When you see <strong>"Connecting..."</strong> in the output, the ESP32-L should auto-enter flash mode. If it doesn't, press and hold the <strong>BOOT</strong> button on the motherboard, then release after upload starts.</li>
  <li>Upload should finish with <strong>"Hard resetting via RTS pin..."</strong></li>
  <li>Within a few seconds, the display will flash black/white multiple times (this is normal &mdash; e-ink needs multiple cycles to settle particles), then show the sample image &mdash; typically the Good Display logo, color bars, or a demo image in red/yellow/black/white.</li>
</ul>

<div class="callout"><div class="label">If the display stays blank</div><p>With the kit, there's no breadboard wiring to mess up, so the most likely culprits are:
<br><br>
<strong>1. Ribbon cable seated backward</strong> (contacts facing up instead of down) &mdash; flip the tab, re-seat with contacts DOWN, lock the tab.
<br><br>
<strong>2. Ribbon cable not fully inserted</strong> &mdash; push deeper (5-6mm).
<br><br>
<strong>3. DESPI-C579 not fully seated</strong> in the motherboard socket &mdash; press firmly until no gap remains.
<br><br>
<strong>4. Wrong sample code</strong> &mdash; double-check you downloaded the ESP32-L(C579) version, not the generic GDEY0579F52 or the 2.9" sample.</p></div>

<details class="build-help"><summary>What a successful first upload actually looks like</summary><div class="help-body">
<p>Upload completes, then for roughly 20&ndash;30 seconds you'll see:</p>
<ol>
  <li>Display goes fully <strong>black</strong> (~2 sec).</li>
  <li>Flashes to <strong>white</strong> (~2 sec).</li>
  <li>A couple of repeat black/white flashes &mdash; this is the controller "clearing" the panel. Normal.</li>
  <li>Color bars or a Good Display logo / demo image appear in <strong>red / yellow / black / white</strong>.</li>
  <li>Image stays on screen even after you unplug USB. That's the e-ink persistence &mdash; working correctly.</li>
</ol>
<p>If steps 1&ndash;3 happen but the final image is blurry, ghosted, or only half the panel shows content, the ribbon is likely seated imperfectly &mdash; re-seat it.</p>
<p>If the display never reacts at all, the most likely cause is wrong sample code (generic vs ESP32-L variant). See the dropdown at Phase 1.5.</p>
</div></details>
</div>
</details>
<!-- ============ PHASE 4: COMPLETE FIRMWARE ============ -->
<div class="phase-header"><span class="phase-num">4</span><span class="phase-title">The Complete Charge Bar Firmware</span><span class="phase-time">2 hours</span></div>

<details class="section-fold" id="eink-chargecode"><summary>4.1 Overview of What We're Building</summary>
<div class="section-body">
<p>Once the sample code works, we'll replace its logic with a real Psych_Battery sketch that:</p>
<ul class="findings">
  <li>Connects to your WiFi network</li>
  <li>Runs an HTTP server on port 80</li>
  <li>Accepts <code>POST /charge</code> requests with JSON like <code>{"level": 75}</code></li>
  <li>Also accepts <code>GET /charge?level=75</code> for easy browser testing</li>
  <li>Maps 0-100 charge to a 4-color battery bar (red zone, yellow zone, outline, text)</li>
  <li>Updates the display using fast refresh (12 seconds)</li>
  <li>Does a full refresh every 10 updates to clear ghosting</li>
  <li>Falls back to serial commands if WiFi isn't available</li>
</ul>
</div>
</details>
<details class="section-fold"><summary>4.2 The Main Arduino Sketch</summary>
<div class="section-body">
<p>Create a new sketch (<strong>File &rarr; New Sketch</strong>) and paste this code. Save as <code>psych_battery_eink.ino</code>. You'll also need to copy the Good Display support files (<code>EPD_5in79_G.h</code>, <code>EPD_5in79_G.cpp</code>, <code>DEV_Config.h</code>, <code>DEV_Config.cpp</code>) into the sketch folder.</p>

<details class="build-help"><summary>What goes in the "sketch folder"</summary><div class="help-body">
<p>When you save the sketch as <code>psych_battery_eink.ino</code>, Arduino creates a folder by the same name. Drop the support files in next to the <code>.ino</code>:</p>
<details class="code-fold"><summary>psych_battery_eink/</summary>
<pre class="code-block">psych_battery_eink/
├── psych_battery_eink.ino     &larr; your main sketch
├── EPD_5in79_G.h
├── EPD_5in79_G.cpp
├── DEV_Config.h
├── DEV_Config.cpp
└── ImageData.h                &larr; optional, only if you display bitmaps</pre>
</details>
<p>Use <strong>Sketch &rarr; Show Sketch Folder</strong> to open the folder in Explorer/Finder; then copy the files in from the Good Display ZIP. Restart Arduino IDE after adding them so the tabs refresh.</p>
</div></details>

<details class="build-help"><summary>About PSRAM and the framebuffer</summary><div class="help-body">
<p>The panel is 792 &times; 272 = 215,424 pixels. At 2 bits per pixel (4 colors), each logical buffer is ~54 KB; the driver uses two (Master + Slave halves). That fits comfortably in regular SRAM, so <strong>you don't need PSRAM</strong> for this display &mdash; the sample code uses <code>malloc()</code>, not <code>ps_malloc()</code>.</p>
<p>If you later swap in a larger panel (e.g. 7.5" or the 13.3" tri-color), you will start running out of SRAM. At that point: <strong>Tools &rarr; PSRAM &rarr; Enabled</strong> and switch the framebuffer allocation to <code>ps_malloc()</code>. The ESP32-L doesn't have PSRAM on the motherboard, so for that scale you'd step up to an ESP32-S3 board instead.</p>
</div></details>

<details class="build-help"><summary>Fast refresh vs full refresh &mdash; when and why</summary><div class="help-body">
<p>The GDEY0579F52 supports two refresh modes:</p>
<ul>
  <li><strong>Fast refresh (~12 s)</strong> &mdash; only toggles pixels that changed. Lower power, faster, but leaves faint "ghosts" of the previous image.</li>
  <li><strong>Full refresh (~20 s)</strong> &mdash; drives every pixel through a full black-white-red-yellow waveform cycle. No ghosting, but visually jarring and ~1.7&times; the energy.</li>
</ul>
<p>The firmware below uses fast refresh on every <code>/charge</code> update and triggers a full refresh every 10 updates (counter resets on reboot). If you notice ghosting building up visibly, lower that counter to 5; if you want to save power and don't mind ghosts, raise it to 20 or more.</p>
<p>E-ink doesn't wear by pixel like OLED, but each refresh cycle is a small stress on the particle layer. Don't call <code>refresh()</code> in a tight loop &mdash; debounce to at least 30 s between pushes.</p>
</div></details>


<details class="code-fold"><summary>psych_battery_eink.ino &mdash; main firmware</summary>
<pre class="code-block"><span class="cmt">/*
 * Psych_Battery E-Ink Firmware
 * Hardware: ESP32 DevKit V1 + GDEY0579F52 (5.79" 4-color e-ink) + DESPI-C579
 * Receives charge level (0-100) via WiFi HTTP or Serial
 * Displays a 4-color battery bar on the e-ink panel
 */</span>

<span class="kw">#include</span> <span class="str">&lt;WiFi.h&gt;</span>
<span class="kw">#include</span> <span class="str">&lt;WebServer.h&gt;</span>
<span class="kw">#include</span> <span class="str">&lt;ArduinoJson.h&gt;</span>
<span class="kw">#include</span> <span class="str">&lt;Adafruit_GFX.h&gt;</span>
<span class="kw">#include</span> <span class="str">"EPD_5in79_G.h"</span>
<span class="kw">#include</span> <span class="str">"DEV_Config.h"</span>

<span class="cmt">// ============ CONFIG - EDIT THESE ============</span>
<span class="kw">const</span> <span class="ty">char</span>* WIFI_SSID     = <span class="str">"YourWiFiName"</span>;
<span class="kw">const</span> <span class="ty">char</span>* WIFI_PASSWORD = <span class="str">"YourWiFiPassword"</span>;
<span class="kw">const</span> <span class="ty">int</span>   HTTP_PORT     = <span class="num">80</span>;

<span class="cmt">// Display dimensions (GDEY0579F52)</span>
<span class="kw">#define</span> EPD_W <span class="num">792</span>
<span class="kw">#define</span> EPD_H <span class="num">272</span>

<span class="cmt">// 4-color palette (Good Display's sample defines these)</span>
<span class="kw">#define</span> EPD_WHITE   <span class="num">0x1</span>
<span class="kw">#define</span> EPD_BLACK   <span class="num">0x0</span>
<span class="kw">#define</span> EPD_YELLOW  <span class="num">0x2</span>
<span class="kw">#define</span> EPD_RED     <span class="num">0x3</span>

<span class="cmt">// Framebuffer: 2 bits per pixel x 792 x 272 = 53,856 bytes</span>
<span class="ty">UBYTE</span> <span class="fn">*BlackImage</span>;

<span class="ty">WebServer</span> server(HTTP_PORT);
<span class="ty">int</span>  currentCharge   = <span class="num">100</span>;
<span class="ty">int</span>  refreshCount    = <span class="num">0</span>;
<span class="ty">bool</span> needsRedraw     = <span class="kw">true</span>;

<span class="cmt">// ============ SETUP ============</span>
<span class="ty">void</span> <span class="fn">setup</span>() {
  Serial.begin(<span class="num">115200</span>);
  Serial.println(<span class="str">"\nPsych_Battery E-Ink starting..."</span>);

  <span class="cmt">// Init display hardware (GPIO, SPI)</span>
  <span class="kw">if</span> (DEV_Module_Init() != <span class="num">0</span>) {
    Serial.println(<span class="str">"ERROR: display init failed"</span>);
    <span class="kw">while</span> (<span class="num">1</span>);
  }

  <span class="cmt">// Allocate framebuffer (PSRAM if available, else heap)</span>
  <span class="ty">UDOUBLE</span> Imagesize = (EPD_W * <span class="num">2</span> * EPD_H) / <span class="num">8</span>;
  BlackImage = (<span class="ty">UBYTE</span> *)ps_malloc(Imagesize);
  <span class="kw">if</span> (BlackImage == <span class="kw">NULL</span>) BlackImage = (<span class="ty">UBYTE</span> *)malloc(Imagesize);
  <span class="kw">if</span> (BlackImage == <span class="kw">NULL</span>) {
    Serial.println(<span class="str">"ERROR: no memory for framebuffer"</span>);
    <span class="kw">while</span> (<span class="num">1</span>);
  }

  <span class="cmt">// Initial full refresh - clear any ghosts from shipping</span>
  EPD_5in79_G_Init();
  drawChargeBar(currentCharge);
  EPD_5in79_G_Display(BlackImage);
  EPD_5in79_G_Sleep();

  <span class="cmt">// Connect to WiFi</span>
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print(<span class="str">"Connecting to WiFi"</span>);
  <span class="ty">int</span> retries = <span class="num">0</span>;
  <span class="kw">while</span> (WiFi.status() != WL_CONNECTED && retries &lt; <span class="num">20</span>) {
    delay(<span class="num">500</span>);
    Serial.print(<span class="str">"."</span>);
    retries++;
  }
  <span class="kw">if</span> (WiFi.status() == WL_CONNECTED) {
    Serial.print(<span class="str">"\nConnected! IP: "</span>);
    Serial.println(WiFi.localIP());
  } <span class="kw">else</span> {
    Serial.println(<span class="str">"\nWiFi failed. Running serial-only mode."</span>);
  }

  <span class="cmt">// HTTP endpoints</span>
  server.on(<span class="str">"/charge"</span>, HTTP_POST, handleChargePost);
  server.on(<span class="str">"/charge"</span>, HTTP_GET,  handleChargeGet);
  server.on(<span class="str">"/"</span>, []() {
    server.send(<span class="num">200</span>, <span class="str">"text/plain"</span>,
      <span class="str">"Psych_Battery ready. POST /charge with JSON {\"level\": 0-100}"</span>);
  });
  server.begin();
  Serial.println(<span class="str">"HTTP server on port 80"</span>);
}

<span class="cmt">// ============ LOOP ============</span>
<span class="ty">void</span> <span class="fn">loop</span>() {
  server.handleClient();
  handleSerialInput();
  <span class="kw">if</span> (needsRedraw) {
    redrawDisplay();
    needsRedraw = <span class="kw">false</span>;
  }
}

<span class="cmt">// ============ HTTP HANDLERS ============</span>
<span class="ty">void</span> <span class="fn">handleChargePost</span>() {
  <span class="kw">if</span> (!server.hasArg(<span class="str">"plain"</span>)) {
    server.send(<span class="num">400</span>, <span class="str">"text/plain"</span>, <span class="str">"Missing JSON body"</span>);
    <span class="kw">return</span>;
  }
  <span class="ty">JsonDocument</span> doc;
  <span class="ty">DeserializationError</span> err = deserializeJson(doc, server.arg(<span class="str">"plain"</span>));
  <span class="kw">if</span> (err) {
    server.send(<span class="num">400</span>, <span class="str">"text/plain"</span>, <span class="str">"Invalid JSON"</span>);
    <span class="kw">return</span>;
  }
  <span class="ty">int</span> level = doc[<span class="str">"level"</span>] | -<span class="num">1</span>;
  <span class="kw">if</span> (level &lt; <span class="num">0</span> || level &gt; <span class="num">100</span>) {
    server.send(<span class="num">400</span>, <span class="str">"text/plain"</span>, <span class="str">"level must be 0-100"</span>);
    <span class="kw">return</span>;
  }
  setCharge(level);
  server.send(<span class="num">200</span>, <span class="str">"application/json"</span>,
    <span class="str">"{\"ok\":true,\"level\":"</span> + String(level) + <span class="str">"}"</span>);
}

<span class="ty">void</span> <span class="fn">handleChargeGet</span>() {
  <span class="kw">if</span> (!server.hasArg(<span class="str">"level"</span>)) {
    server.send(<span class="num">200</span>, <span class="str">"application/json"</span>,
      <span class="str">"{\"level\":"</span> + String(currentCharge) + <span class="str">"}"</span>);
    <span class="kw">return</span>;
  }
  <span class="ty">int</span> level = server.arg(<span class="str">"level"</span>).toInt();
  <span class="kw">if</span> (level &lt; <span class="num">0</span> || level &gt; <span class="num">100</span>) {
    server.send(<span class="num">400</span>, <span class="str">"text/plain"</span>, <span class="str">"level must be 0-100"</span>);
    <span class="kw">return</span>;
  }
  setCharge(level);
  server.send(<span class="num">200</span>, <span class="str">"application/json"</span>,
    <span class="str">"{\"ok\":true,\"level\":"</span> + String(level) + <span class="str">"}"</span>);
}

<span class="cmt">// ============ SERIAL FALLBACK ============</span>
<span class="ty">void</span> <span class="fn">handleSerialInput</span>() {
  <span class="kw">if</span> (Serial.available()) {
    <span class="ty">int</span> level = Serial.parseInt();
    <span class="kw">if</span> (level &gt;= <span class="num">0</span> && level &lt;= <span class="num">100</span>) {
      Serial.print(<span class="str">"Serial input: charge = "</span>);
      Serial.println(level);
      setCharge(level);
    }
    <span class="kw">while</span> (Serial.available()) Serial.read();
  }
}

<span class="ty">void</span> <span class="fn">setCharge</span>(<span class="ty">int</span> level) {
  <span class="kw">if</span> (level != currentCharge) {
    currentCharge = level;
    needsRedraw = <span class="kw">true</span>;
  }
}

<span class="cmt">// ============ DISPLAY ============</span>
<span class="ty">void</span> <span class="fn">redrawDisplay</span>() {
  Serial.print(<span class="str">"Drawing charge = "</span>);
  Serial.println(currentCharge);

  drawChargeBar(currentCharge);

  refreshCount++;
  <span class="cmt">// Full refresh every 10 updates to clear ghosting</span>
  <span class="kw">if</span> (refreshCount % <span class="num">10</span> == <span class="num">0</span>) {
    EPD_5in79_G_Init();  <span class="cmt">// full refresh mode (20s)</span>
  } <span class="kw">else</span> {
    EPD_5in79_G_Init_Fast();  <span class="cmt">// fast refresh mode (12s)</span>
  }
  EPD_5in79_G_Display(BlackImage);
  EPD_5in79_G_Sleep();
}

<span class="ty">void</span> <span class="fn">drawChargeBar</span>(<span class="ty">int</span> percentage) {
  <span class="cmt">// Clear framebuffer to white</span>
  Paint_NewImage(BlackImage, EPD_W, EPD_H, <span class="num">0</span>, EPD_WHITE);
  Paint_Clear(EPD_WHITE);

  <span class="cmt">// Battery body: rounded rect outline in black</span>
  <span class="ty">int</span> bx = <span class="num">40</span>,  by = <span class="num">50</span>;
  <span class="ty">int</span> bw = <span class="num">680</span>, bh = <span class="num">172</span>;
  Paint_DrawRectangle(bx, by, bx + bw, by + bh,
                      EPD_BLACK, DOT_PIXEL_3X3, DRAW_FILL_EMPTY);

  <span class="cmt">// Battery positive terminal nub on the right</span>
  Paint_DrawRectangle(bx + bw, by + <span class="num">50</span>, bx + bw + <span class="num">25</span>, by + bh - <span class="num">50</span>,
                      EPD_BLACK, DOT_PIXEL_3X3, DRAW_FILL_FULL);

  <span class="cmt">// Calculate fill width (within the outline, with 8px margin)</span>
  <span class="ty">int</span> innerX = bx + <span class="num">8</span>;
  <span class="ty">int</span> innerY = by + <span class="num">8</span>;
  <span class="ty">int</span> innerW = bw - <span class="num">16</span>;
  <span class="ty">int</span> innerH = bh - <span class="num">16</span>;
  <span class="ty">int</span> fillW  = (innerW * percentage) / <span class="num">100</span>;

  <span class="cmt">// Color the fill: red for 0-20%, yellow for 21-100%</span>
  <span class="ty">int</span> fillColor = (percentage &lt;= <span class="num">20</span>) ? EPD_RED : EPD_YELLOW;
  <span class="kw">if</span> (fillW &gt; <span class="num">0</span>) {
    Paint_DrawRectangle(innerX, innerY, innerX + fillW, innerY + innerH,
                        fillColor, DOT_PIXEL_1X1, DRAW_FILL_FULL);
  }

  <span class="cmt">// Percentage text, large, centered inside the bar</span>
  <span class="ty">char</span> txt[<span class="num">8</span>];
  snprintf(txt, <span class="kw">sizeof</span>(txt), <span class="str">"%d%%"</span>, percentage);
  Paint_DrawString_EN(bx + bw/<span class="num">2</span> - <span class="num">60</span>, by + bh/<span class="num">2</span> - <span class="num">28</span>,
                      txt, &amp;Font48, EPD_BLACK, EPD_WHITE);

  <span class="cmt">// "PSYCH_BATTERY" label across top</span>
  Paint_DrawString_EN(<span class="num">250</span>, <span class="num">10</span>, <span class="str">"PSYCH_BATTERY"</span>,
                      &amp;Font24, EPD_WHITE, EPD_BLACK);
}</pre>
</details>
</div>
</details>
<details class="section-fold"><summary>4.3 Edit Your WiFi Credentials</summary>
<div class="section-body">
<p>Find these two lines near the top:</p>
<details class="code-fold"><summary>const char* WIFI_SSID     = "YourWiFiName";</summary>
<pre class="code-block"><span class="kw">const</span> <span class="ty">char</span>* WIFI_SSID     = <span class="str">"YourWiFiName"</span>;
<span class="kw">const</span> <span class="ty">char</span>* WIFI_PASSWORD = <span class="str">"YourWiFiPassword"</span>;</pre>
</details>
<p>Replace with your actual network name and password. <strong>ESP32 only supports 2.4 GHz WiFi</strong> &mdash; if your home network is 5 GHz only, either use the hotspot from your phone (usually 2.4 GHz) or ask your router admin to enable a 2.4 GHz band.</p>
</div>
</details>
<details class="section-fold"><summary>4.4 Upload and Monitor</summary>
<div class="section-body">
<ul class="findings">
  <li>Click <strong>Upload</strong>. Wait for compile + flash (~1 minute after libraries are cached).</li>
  <li>Open <strong>Tools &rarr; Serial Monitor</strong>. Set baud rate to <strong>115200</strong>.</li>
  <li>You should see:<br>
    <code>Psych_Battery E-Ink starting...</code><br>
    <code>Connecting to WiFi.....</code><br>
    <code>Connected! IP: 192.168.1.123</code><br>
    <code>HTTP server on port 80</code></li>
  <li>Write down the IP address &mdash; you'll need it for the Python backend.</li>
  <li>The display will do one full refresh showing a 100% battery bar in yellow with black "100%" text.</li>
</ul>
</div>
</details>
<details class="section-fold"><summary>4.5 Test via Serial</summary>
<div class="section-body">
<p>In the Serial Monitor, type a number 0-100 and press Enter. The display should refresh with the new charge level within 12 seconds. Try:</p>
<ul class="findings">
  <li><code>85</code> &rarr; large yellow fill, "85%" text</li>
  <li><code>50</code> &rarr; half-filled yellow bar</li>
  <li><code>15</code> &rarr; short red fill (in the danger zone)</li>
  <li><code>0</code> &rarr; empty outline, "0%" text</li>
</ul>
</div>
</details>
<details class="section-fold"><summary>4.6 Test via Browser</summary>
<div class="section-body">
<p>Open a browser on any device on the same WiFi network. Go to <code>http://192.168.1.123/charge?level=42</code> (use your IP). You should see a JSON response and the display will update.</p>
</div>
</details>
<!-- ============ PHASE 5: PYTHON BACKEND ============ -->
<div class="phase-header"><span class="phase-num">5</span><span class="phase-title">Python Backend Integration</span><span class="phase-time">1 hour</span></div>

<details class="section-fold" id="eink-python"><summary>5.1 Install Python Dependencies</summary>
<div class="section-body">
<p>On your laptop (the "brain" that calculates mental energy and sends it to the battery):</p>
<details class="code-fold"><summary>pip install requests aw-client pyserial</summary>
<pre class="code-block">pip install requests aw-client pyserial</pre>
</details>
<ul class="findings">
  <li><code>requests</code> &mdash; sends HTTP requests to the ESP32 over WiFi</li>
  <li><code>aw-client</code> &mdash; queries ActivityWatch for app/website usage data</li>
  <li><code>pyserial</code> &mdash; optional fallback for sending charge over USB if WiFi fails</li>
</ul>

<details class="build-help"><summary>Python install on Windows / macOS (if you don't have it yet)</summary><div class="help-body">
<p><strong>Windows:</strong></p>
<ul>
  <li>Download the installer from <a href="https://www.python.org/downloads/" target="_blank">python.org/downloads</a> (3.11 or 3.12 are safest for <code>aw-client</code>).</li>
  <li>On the first install screen, check <strong>"Add python.exe to PATH"</strong>. Missing this is the #1 "pip not recognized" cause.</li>
  <li>If <code>pip</code> still isn't found, use <code>py -m pip install requests aw-client pyserial</code> instead &mdash; the <code>py</code> launcher ships with the installer.</li>
</ul>
<p><strong>macOS:</strong></p>
<ul>
  <li>Don't use the system Python (<code>/usr/bin/python3</code>) &mdash; it's locked down on Sequoia. Install via Homebrew: <code>brew install python@3.11</code>.</li>
  <li>Use <code>python3</code> and <code>pip3</code> explicitly (not <code>python</code>/<code>pip</code>).</li>
</ul>
<p><strong>Recommended: use a virtualenv</strong> so these libraries don't pollute the system install.</p>
<details class="code-fold"><summary>python -m venv .venv</summary>
<pre class="code-block">python -m venv .venv
# Windows
.venv\Scripts\activate
# macOS/Linux
source .venv/bin/activate
pip install requests aw-client pyserial</pre>
</details>
</div></details>

<details class="build-help"><summary>Install ActivityWatch + the browser extension</summary><div class="help-body">
<p><code>aw-client</code> only queries ActivityWatch &mdash; it doesn't collect anything on its own. You need the ActivityWatch daemon running on your laptop.</p>
<ol>
  <li>Download from <a href="https://activitywatch.net/downloads/" target="_blank">activitywatch.net/downloads</a> and install. It starts a tray icon and a local server on <strong>localhost:5600</strong>.</li>
  <li>Install the browser watcher so AW sees websites (it only sees app windows without it):
    <ul>
      <li><a href="https://chromewebstore.google.com/detail/activitywatch-web-watcher/nglaklhklhcoonedhgnpgddginnjdadi" target="_blank">Chrome extension</a></li>
      <li><a href="https://addons.mozilla.org/en-US/firefox/addon/activitywatch-web-watcher/" target="_blank">Firefox add-on</a></li>
    </ul>
  </li>
  <li>Verify the client can connect:
<details class="code-fold"><summary>python -c "from aw_client import ActivityWatchClient; c = ActivityW…</summary>
<pre class="code-block">python -c "from aw_client import ActivityWatchClient; c = ActivityWatchClient('test'); print(c.get_buckets())"</pre>
</details>
  You should see a dict with bucket names like <code>aw-watcher-window_&lt;host&gt;</code> and <code>aw-watcher-afk_&lt;host&gt;</code>. Empty dict = daemon not running.</li>
</ol>
<p><strong>Privacy note:</strong> AW is local-only by default. Nothing leaves your laptop unless you configure sync. If you're uncomfortable with keystroke-adjacent data logging, you can run AW only during work sessions and stop the daemon when done.</p>
</div></details>

<div class="callout"><div class="label">Minimum test without the full Python backend</div><p>You don't need ActivityWatch to verify the battery is reachable. Once the firmware is flashed and you have its IP, just:
<br><br>
<code>python charge_sender.py 42</code>
<br><br>
(or simply <code>curl "http://&lt;BATTERY_IP&gt;/charge?level=42"</code> from any shell). If the display redraws, the end-to-end pipe works and you can bolt on the energy-score calculator later.</p></div>
</div>
</details>
<details class="section-fold"><summary>5.2 The Charge Sender Module</summary>
<div class="section-body">
<p>Save this as <code>charge_sender.py</code> &mdash; it's the interface between your energy-score calculator and the physical battery:</p>

<details class="code-fold"><summary>charge_sender.py &mdash; unified charge interface</summary>
<pre class="code-block"><span class="str">"""
charge_sender.py - sends charge level (0-100) to the Psych_Battery.
Tries WiFi first, falls back to serial, logs locally if both fail.
"""</span>
<span class="kw">import</span> requests
<span class="kw">import</span> serial
<span class="kw">import</span> time
<span class="kw">import</span> logging
<span class="kw">from</span> pathlib <span class="kw">import</span> Path

<span class="cmt"># ============ CONFIG ============</span>
BATTERY_IP   = <span class="str">"192.168.1.123"</span>   <span class="cmt"># from Serial Monitor</span>
BATTERY_PORT = <span class="num">80</span>
SERIAL_PORT  = <span class="str">"COM3"</span>            <span class="cmt"># Windows; "/dev/cu.SLAB_USBtoUART" on Mac</span>
SERIAL_BAUD  = <span class="num">115200</span>
LOG_FILE     = Path.home() / <span class="str">".psych_battery"</span> / <span class="str">"charge.log"</span>
LOG_FILE.parent.mkdir(exist_ok=<span class="kw">True</span>)

logging.basicConfig(level=logging.INFO,
    format=<span class="str">"%(asctime)s [%(levelname)s] %(message)s"</span>)
log = logging.getLogger(<span class="str">"charge_sender"</span>)

<span class="kw">class</span> <span class="ty">ChargeSender</span>:
    <span class="kw">def</span> <span class="fn">__init__</span>(self, ip=BATTERY_IP, serial_port=SERIAL_PORT):
        self.ip = ip
        self.serial_port = serial_port
        self.last_level = <span class="kw">None</span>

    <span class="kw">def</span> <span class="fn">send</span>(self, level: <span class="ty">int</span>) -&gt; <span class="ty">bool</span>:
        <span class="str">"""Send charge level 0-100. Returns True on success."""</span>
        <span class="kw">if</span> <span class="kw">not</span> (<span class="num">0</span> &lt;= level &lt;= <span class="num">100</span>):
            <span class="kw">raise</span> <span class="ty">ValueError</span>(<span class="str">f"level must be 0-100, got {level}"</span>)

        <span class="cmt"># Skip redundant sends (e-ink refresh is slow, don't waste it)</span>
        <span class="kw">if</span> level == self.last_level:
            log.debug(<span class="str">f"Skipping duplicate level {level}"</span>)
            <span class="kw">return</span> <span class="kw">True</span>

        self._log_local(level)

        <span class="cmt"># Try WiFi first</span>
        <span class="kw">if</span> self._send_http(level):
            self.last_level = level
            <span class="kw">return</span> <span class="kw">True</span>

        <span class="cmt"># Fall back to serial</span>
        <span class="kw">if</span> self._send_serial(level):
            self.last_level = level
            <span class="kw">return</span> <span class="kw">True</span>

        log.error(<span class="str">"Both WiFi and serial failed"</span>)
        <span class="kw">return</span> <span class="kw">False</span>

    <span class="kw">def</span> <span class="fn">_send_http</span>(self, level: <span class="ty">int</span>) -&gt; <span class="ty">bool</span>:
        url = <span class="str">f"http://{self.ip}:{BATTERY_PORT}/charge"</span>
        <span class="kw">try</span>:
            r = requests.post(url, json={<span class="str">"level"</span>: level}, timeout=<span class="num">3</span>)
            <span class="kw">if</span> r.status_code == <span class="num">200</span>:
                log.info(<span class="str">f"HTTP OK: level={level}"</span>)
                <span class="kw">return</span> <span class="kw">True</span>
            log.warning(<span class="str">f"HTTP {r.status_code}: {r.text}"</span>)
        <span class="kw">except</span> requests.exceptions.RequestException <span class="kw">as</span> e:
            log.warning(<span class="str">f"HTTP failed: {e}"</span>)
        <span class="kw">return</span> <span class="kw">False</span>

    <span class="kw">def</span> <span class="fn">_send_serial</span>(self, level: <span class="ty">int</span>) -&gt; <span class="ty">bool</span>:
        <span class="kw">try</span>:
            <span class="kw">with</span> serial.Serial(self.serial_port, SERIAL_BAUD, timeout=<span class="num">2</span>) <span class="kw">as</span> s:
                s.write(<span class="str">f"{level}\n"</span>.encode())
                s.flush()
                log.info(<span class="str">f"Serial OK: level={level}"</span>)
                <span class="kw">return</span> <span class="kw">True</span>
        <span class="kw">except</span> serial.SerialException <span class="kw">as</span> e:
            log.warning(<span class="str">f"Serial failed: {e}"</span>)
            <span class="kw">return</span> <span class="kw">False</span>

    <span class="kw">def</span> <span class="fn">_log_local</span>(self, level: <span class="ty">int</span>):
        <span class="kw">with</span> open(LOG_FILE, <span class="str">"a"</span>) <span class="kw">as</span> f:
            f.write(<span class="str">f"{time.time()},{level}\n"</span>)

<span class="cmt"># ============ CLI TEST ============</span>
<span class="kw">if</span> __name__ == <span class="str">"__main__"</span>:
    <span class="kw">import</span> sys
    <span class="kw">if</span> len(sys.argv) != <span class="num">2</span>:
        print(<span class="str">"Usage: python charge_sender.py &lt;level 0-100&gt;"</span>)
        sys.exit(<span class="num">1</span>)
    sender = ChargeSender()
    ok = sender.send(<span class="ty">int</span>(sys.argv[<span class="num">1</span>]))
    sys.exit(<span class="num">0</span> <span class="kw">if</span> ok <span class="kw">else</span> <span class="num">1</span>)</pre>
</details>
</div>
</details>
<details class="section-fold"><summary>5.3 Connect to the Psych_Battery Energy Score</summary>
<div class="section-body">
<p>This is where Tech Stack meets Build Guide. Here's a minimal example that queries ActivityWatch, computes an energy score, and pushes it to the display:</p>

<details class="code-fold"><summary>energy_score_to_battery.py &mdash; the core loop</summary>
<pre class="code-block"><span class="str">"""
Polls ActivityWatch every 5 minutes, computes a mental energy score,
and pushes it to the Psych_Battery display.
"""</span>
<span class="kw">import</span> time
<span class="kw">from</span> datetime <span class="kw">import</span> datetime, timedelta
<span class="kw">from</span> aw_client <span class="kw">import</span> ActivityWatchClient
<span class="kw">from</span> charge_sender <span class="kw">import</span> ChargeSender

<span class="cmt"># ============ TUNING - TWEAK THESE ============</span>
POLL_INTERVAL_SEC = <span class="num">300</span>       <span class="cmt"># 5 minutes between updates</span>
DAILY_BUDGET_MIN  = <span class="num">480</span>       <span class="cmt"># 8 hours of "charged" time per workday</span>

<span class="cmt"># Drain weights per minute of use</span>
DRAIN_PER_MIN = {
    <span class="str">"chatgpt.com"</span>:     <span class="num">2.0</span>,   <span class="cmt"># extended AI chat drains fast</span>
    <span class="str">"claude.ai"</span>:       <span class="num">2.0</span>,
    <span class="str">"app.slack.com"</span>:   <span class="num">1.2</span>,   <span class="cmt"># digital comms</span>
    <span class="str">"mail.google.com"</span>: <span class="num">1.0</span>,
    <span class="str">"twitter.com"</span>:     <span class="num">1.5</span>,
    <span class="str">"x.com"</span>:           <span class="num">1.5</span>,
    <span class="str">"linkedin.com"</span>:    <span class="num">1.3</span>,
    <span class="str">"news.ycombinator.com"</span>: <span class="num">0.8</span>,
    <span class="str">"_default_"</span>:       <span class="num">0.3</span>,   <span class="cmt"># any other active tab</span>
}

<span class="cmt"># Recharge weights per minute away</span>
RECHARGE_IDLE_PER_MIN = <span class="num">0.4</span>    <span class="cmt"># AFK/idle = gentle recharge</span>

<span class="kw">def</span> <span class="fn">compute_energy_score</span>():
    <span class="str">"""Query ActivityWatch for today's activity; return 0-100."""</span>
    aw = ActivityWatchClient(<span class="str">"psych_battery"</span>, testing=<span class="kw">False</span>)
    now = datetime.now().astimezone()
    start = now.replace(hour=<span class="num">9</span>, minute=<span class="num">0</span>, second=<span class="num">0</span>, microsecond=<span class="num">0</span>)

    <span class="cmt"># Get the web-domain bucket (installed via aw-watcher-web extension)</span>
    buckets = aw.get_buckets()
    web_bucket = next(
        (b <span class="kw">for</span> b <span class="kw">in</span> buckets <span class="kw">if</span> <span class="str">"aw-watcher-web"</span> <span class="kw">in</span> b),
        <span class="kw">None</span>
    )
    afk_bucket = next(
        (b <span class="kw">for</span> b <span class="kw">in</span> buckets <span class="kw">if</span> <span class="str">"aw-watcher-afk"</span> <span class="kw">in</span> b),
        <span class="kw">None</span>
    )

    drain = <span class="num">0.0</span>
    <span class="kw">if</span> web_bucket:
        events = aw.get_events(web_bucket, start=start, end=now)
        <span class="kw">for</span> e <span class="kw">in</span> events:
            domain  = e.data.get(<span class="str">"url"</span>, <span class="str">""</span>).split(<span class="str">"/"</span>)[<span class="num">2</span>] <span class="kw">if</span> <span class="str">"://"</span> <span class="kw">in</span> e.data.get(<span class="str">"url"</span>, <span class="str">""</span>) <span class="kw">else</span> <span class="str">""</span>
            minutes = e.duration.total_seconds() / <span class="num">60</span>
            weight  = DRAIN_PER_MIN.get(domain, DRAIN_PER_MIN[<span class="str">"_default_"</span>])
            drain  += minutes * weight

    recharge = <span class="num">0.0</span>
    <span class="kw">if</span> afk_bucket:
        events = aw.get_events(afk_bucket, start=start, end=now)
        <span class="kw">for</span> e <span class="kw">in</span> events:
            <span class="kw">if</span> e.data.get(<span class="str">"status"</span>) == <span class="str">"afk"</span>:
                minutes   = e.duration.total_seconds() / <span class="num">60</span>
                recharge += minutes * RECHARGE_IDLE_PER_MIN

    <span class="cmt"># Net energy: start at 100, subtract drain, add recharge, cap 0-100</span>
    net_drain_pct = (drain - recharge) / DAILY_BUDGET_MIN * <span class="num">100</span>
    energy = max(<span class="num">0</span>, min(<span class="num">100</span>, <span class="ty">int</span>(<span class="num">100</span> - net_drain_pct)))
    <span class="kw">return</span> energy

<span class="cmt"># ============ MAIN LOOP ============</span>
<span class="kw">def</span> <span class="fn">main</span>():
    sender = ChargeSender()
    <span class="kw">while</span> <span class="kw">True</span>:
        <span class="kw">try</span>:
            score = compute_energy_score()
            print(<span class="str">f"[{datetime.now():%H:%M}] Energy = {score}%"</span>)
            sender.send(score)
        <span class="kw">except</span> <span class="ty">Exception</span> <span class="kw">as</span> e:
            print(<span class="str">f"Error: {e}"</span>)
        time.sleep(POLL_INTERVAL_SEC)

<span class="kw">if</span> __name__ == <span class="str">"__main__"</span>:
    main()</pre>
</details>
</div>
</details>
<details class="section-fold"><summary>5.4 Run and Verify the Full Loop</summary>
<div class="section-body">
<ul class="findings">
  <li>Start ActivityWatch (if not already running): <code>aw-qt</code> or open the app</li>
  <li>Make sure the browser extension is installed (Chrome/Firefox)</li>
  <li>Run <code>python energy_score_to_battery.py</code></li>
  <li>Every 5 minutes, you should see console output like <code>[14:30] Energy = 72%</code> and the e-ink display should update within 12 seconds of each calculation</li>
  <li>As you use Slack or ChatGPT, the score should gradually drop. After an AFK break, it should rise slightly.</li>
</ul>

<div class="callout"><div class="label">Sanity check</div><p>For the first hour, run with <code>POLL_INTERVAL_SEC = 60</code> (every minute) to verify updates flow through. Once you trust the pipeline, set it back to 300 (every 5 minutes) &mdash; e-ink displays have a limited number of refresh cycles before ghosting accumulates, and 5 minutes gives the score time to meaningfully change.</p></div>
</div>
</details>
<!-- ============ PHASE 6: ENCLOSURE ============ -->
<div class="phase-header"><span class="phase-num">6</span><span class="phase-title">Enclosure &amp; Mounting</span><span class="phase-time">3-4 hours</span></div>

<details class="section-fold" id="eink-enclosure"><summary>6.1 Form Factor Considerations</summary>
<div class="section-body">
<p>The GDEY0579F52 is <strong>151 &times; 57mm</strong> (outline) with a <strong>139 &times; 48mm</strong> active area. That's roughly 6" &times; 2.25" &mdash; larger than a typical AA battery. Design choices:</p>
<ul class="findings">
  <li><strong>Elongated battery form:</strong> Make the whole enclosure ~170mm tall &times; 65mm wide &times; 30mm deep. The display sits on the front face; the ESP32 + DESPI-C579 fits inside.</li>
  <li><strong>Horizontal "battery brick":</strong> Lay the display horizontally on a shorter wide enclosure &mdash; more like a power bank than an AA cell.</li>
  <li><strong>Recessed window:</strong> Cut the window to 139 &times; 48mm (matching the active area exactly). The display's bezel (6mm on all sides) sits behind the opaque front face, hiding the edges.</li>
</ul>
</div>
</details>
<details class="section-fold"><summary>6.2 3D Print at Jacobs Hall or Supernode</summary>
<div class="section-body">
<ul class="findings">
  <li>Design in Fusion 360 (free for UC Berkeley students) or Onshape</li>
  <li>Print in white or black PLA, 0.2mm layer height, 20% infill</li>
  <li>Two parts: front face (with window) and rear shell. Join with M3 screws or friction fit.</li>
  <li>Add a slot on the back for the USB cable exit and a hole for the ribbon cable to pass from display to driver board inside</li>
</ul>
</div>
</details>
<details class="section-fold"><summary>6.3 Mount the Display</summary>
<div class="section-body">
<ul class="findings">
  <li><strong>Step 1:</strong> Clean the inside of the front face and the bezel of the display with isopropyl alcohol</li>
  <li><strong>Step 2:</strong> Apply thin double-sided tape (3M VHB F9460PC, 0.15mm thick) around the bezel area only &mdash; never on the active area</li>
  <li><strong>Step 3:</strong> Route the ribbon cable through the internal slot to where the DESPI-C579 sits</li>
  <li><strong>Step 4:</strong> Carefully press the display into the window opening so the active area is visible through the cutout</li>
  <li><strong>Step 5:</strong> Secure the DESPI-C579 and ESP32 inside the rear shell with foam tape or a 3D-printed cradle</li>
</ul>

<div class="callout"><div class="label">No frosted acrylic needed</div><p>Unlike the LED build, e-ink is already matte and paper-like. The display surface IS the final surface. You can optionally add a thin clear acrylic pane over the window for physical protection, but it reduces contrast slightly and isn't required.</p></div>
</div>
</details>
<!-- ============ COMPARISON ============ -->
<details class="section-fold"><summary>Comparison: E-Ink vs LED Alternatives</summary>
<div class="section-body">
<table class="result-table">
<tr><th></th><th>E-Ink (this build)</th><th>LED + Frosted Glass</th></tr>
<tr><td><strong>Cost</strong></td><td>~$55-63</td><td>~$80-130</td></tr>
<tr><td><strong>Wiring complexity</strong></td><td>8 wires, 0 extra components</td><td>8 wires + level shifter + capacitor + PSU</td></tr>
<tr><td><strong>Blue light</strong></td><td>None (reflective)</td><td>Yes (LED emission)</td></tr>
<tr><td><strong>Dark-room visibility</strong></td><td>Needs ambient light</td><td>Self-illuminating</td></tr>
<tr><td><strong>Always-on power</strong></td><td>0 mW (retains image)</td><td>200-500 mW continuous</td></tr>
<tr><td><strong>Update speed</strong></td><td>12 sec (full flash)</td><td>Instant</td></tr>
<tr><td><strong>Information density</strong></td><td>High (text, graphics, percentages)</td><td>Low (color + brightness)</td></tr>
<tr><td><strong>Aesthetic</strong></td><td>Paper-like, minimal</td><td>Warm ambient glow</td></tr>
</table>
</div>
</details>
<!-- ============ TROUBLESHOOTING ============ -->
<details class="section-fold" id="eink-troubleshooting"><summary>Troubleshooting Guide</summary>
<div class="section-body">
<table class="result-table">
<tr><th>Symptom</th><th>Likely Cause</th><th>Fix</th></tr>
<tr><td>Upload fails: "Failed to connect to ESP32"</td><td>Board/Port not selected, or auto-reset circuit faulty</td><td>Tools &rarr; Port &rarr; pick COM port. Press &amp; hold BOOT button on ESP32 while upload starts, release when "Writing" appears.</td></tr>
<tr><td>Upload fails: "A fatal error occurred: Serial data stream stopped"</td><td>Upload speed too high, or bad USB cable</td><td>Tools &rarr; Upload Speed &rarr; 115200. Swap USB cable (try a known-good data cable).</td></tr>
<tr><td>Display stays completely blank</td><td>Ribbon cable seated backward, not fully inserted, or DESPI-C579 not fully plugged into motherboard</td><td>Re-seat the FPC ribbon with contacts facing DOWN, push it 5-6mm deep, lock the tab. Press the DESPI-C579 firmly into the motherboard socket &mdash; no gap.</td></tr>
<tr><td>Only top or bottom half displays</td><td>Wrong sample code &mdash; dual-controller not initialized properly</td><td>Confirm you downloaded the ESP32-L(C579) sample specifically, not a generic GDEY0579F52 sample. The ESP32-L sample is tuned for the motherboard's pin mapping and the dual IST7158 init sequence.</td></tr>
<tr><td>Wrong colors (red where yellow should be)</td><td>Color constants swapped</td><td>In the sample code, check the palette definitions. Some Good Display samples use 0x2=red, 0x3=yellow (opposite of our charge bar code). Adjust the <code>#define EPD_YELLOW / EPD_RED</code> values in the main sketch to match.</td></tr>
<tr><td>Ghosting (faint previous image)</td><td>Too many partial refreshes in a row</td><td>Normal. The firmware does a full refresh every 10 updates to clear this. For manual clearing, send the same level twice.</td></tr>
<tr><td>"Connecting to WiFi...." never ends</td><td>Wrong SSID/password, or 5GHz network</td><td>Double-check credentials. ESP32 only does 2.4GHz &mdash; use a phone hotspot if needed.</td></tr>
<tr><td>HTTP requests time out</td><td>ESP32-L lost WiFi, or wrong IP</td><td>Check the Serial Monitor. If IP has changed, update BATTERY_IP in charge_sender.py. Consider setting a static DHCP lease on your router.</td></tr>
<tr><td>Refresh takes 20+ seconds every time</td><td>Always using full refresh mode</td><td>Verify the code calls <code>EPD_5in79_G_Init_Fast()</code> most of the time and only <code>EPD_5in79_G_Init()</code> every 10th refresh.</td></tr>
<tr><td>BUSY pin timeout / display stays in "busy" state</td><td>Bad connection between DESPI-C579 and motherboard, or ribbon cable loose</td><td>Unplug USB, re-seat DESPI-C579 into the motherboard socket firmly, re-seat the ribbon cable, plug USB back in.</td></tr>
<tr><td>"Out of memory" during boot</td><td>Framebuffer allocation failed</td><td>The ESP32-L's ESP32 chip has 520KB SRAM &mdash; usually enough. If using a custom sketch that's too large, reduce other memory usage or enable PSRAM if present on the motherboard variant.</td></tr>
<tr><td>COM port doesn't appear on your computer</td><td>Missing CP2102 USB driver</td><td>Install the driver from <a href="https://www.silabs.com/developers/usb-to-uart-bridge-vcp-drivers" target="_blank">Silicon Labs</a>. Unplug and replug USB after install.</td></tr>
</table>

<div class="callout"><div class="label">When to ask for help</div><p>If you've re-seated the ribbon cable, confirmed the DESPI-C579 is fully plugged in, and the display still doesn't respond: post on the <a href="https://forum.arduino.cc/" target="_blank">Arduino Forum</a> with "ESP32-L C579 GDEY0579F52" in the title, include photos of your assembled kit, and mention which sample code version you downloaded. Good Display's support team also responds to emails directly at <code>info@good-display.com</code>.</p></div>
</div>
</details>
</div>

<!-- ===== CROWPANEL BUILD GUIDE ===== -->
<div class="section" id="sec-scrowpanel">
<h2>CrowPanel ESP32-S3 5.79" E-Ink (B/W): Complete Build Guide</h2>
<p>A parallel build path using the <strong>ELECROW CrowPanel ESP32 5.79" E-Paper HMI</strong> &mdash; a single all-in-one board that integrates the same Good Display 5.79" 272&times;792 panel directly onto an ESP32-S3 carrier PCB. No DESPI-C579 adapter, no breadboard, no ribbon-cable handling. The trade-off: B/W only (no yellow/red), so the charge bar uses size and inversion for alert zones instead of color.</p>

<div class="callout"><div class="label">Why a second e-ink build</div><p>The existing <strong>E-Ink Build</strong> uses the Good Display <em>ESP32-L(C579) kit</em> &mdash; three boards you plug together (ESP32-L motherboard + DESPI-C579 connector + GDEY0579F52 panel + ribbon cable). This build uses the <em>ELECROW CrowPanel</em>, which takes the same 5.79" panel and fuses it onto a single carrier PCB with an ESP32-S3. Both drive physically identical Good Display glass; pick whichever board you actually bought. If you ordered the CrowPanel from Amazon (ASIN B0FX4PDW6M), follow this guide. If you ordered the Good Display kit from buy-lcd.com / buyepaper.com, follow the E-Ink Build tab.</p></div>

<details class="section-fold"><summary>Table of Contents</summary>
<div class="section-body">
<div class="toc"><ul>
  <li><a href="#cp-why">Why CrowPanel vs. Good Display Kit</a></li>
  <li><a href="#cp-bom">Phase 0: What's In The Box</a></li>
  <li><a href="#cp-software">Phase 1: Software Setup (Arduino IDE + ESP32-S3 + EPD Library)</a></li>
  <li><a href="#cp-hardware">Phase 2: Hardware (Just Plug In USB-C)</a></li>
  <li><a href="#cp-firsttest">Phase 3: First Upload &amp; Smoke Test</a></li>
  <li><a href="#cp-chargecode">Phase 4: The B/W Charge Bar Firmware</a></li>
  <li><a href="#cp-python">Phase 5: Python Backend (reuses charge_sender.py)</a></li>
  <li><a href="#cp-enclosure">Phase 6: Enclosure Notes</a></li>
  <li><a href="#cp-troubleshooting">Troubleshooting Guide</a></li>
</ul></div>
</div>
</details>

<details class="section-fold" id="cp-why"><summary>Why CrowPanel vs. Good Display Kit?</summary>
<div class="section-body">
<ul class="findings">
  <li><strong>One board, not three.</strong> The ESP32-S3, the SPI wiring, and the panel are all on the same PCB. No DESPI-C579 adapter to misseat, no ribbon cable to flip backwards, no motherboard pairing.</li>
  <li><strong>USB-C, not Micro-USB.</strong> Modern cable, reversible, more common in 2026.</li>
  <li><strong>ESP32-S3 with 8&nbsp;MB PSRAM.</strong> More headroom for double-buffering, OTA, or future upgrades to a larger panel.</li>
  <li><strong>SH1.0 LiPo connector built in.</strong> Drop-in battery for cord-free operation; no soldering a JST pigtail.</li>
  <li><strong>TF card slot.</strong> Useful for logging charge history offline, or loading bitmap assets without re-flashing.</li>
  <li><strong>Same Good Display panel.</strong> Good Display is the OEM of the 5.79" 272&times;792 glass. Visually identical to the F52 panel in the kit build &mdash; just the driver layer and B/W vs. 4-color differ.</li>
</ul>

<div class="callout"><div class="label">Known trade-off: B/W only, no color zones</div><p>The CrowPanel panel variant is black &amp; white only (driven by dual SSD1683 ICs). You lose the yellow-&rarr;red color transition that marked the "danger zone" in the 4-color build. We compensate by (1) doubling the font size of the percentage in the low-charge zone and (2) inverting the fill (black body, white text) when charge drops below 20%. That gives the same peripheral "something's wrong" signal without a hue channel. If color zones matter to you, stay on the Good Display F52 build.</p></div>
</div>
</details>

<!-- ============ PHASE 0: SUPPLIES ============ -->
<div class="phase-header"><span class="phase-num">0</span><span class="phase-title">What's In The Box</span><span class="phase-time">5 min (inventory)</span></div>

<details class="section-fold" id="cp-bom"><summary>0.1 What ships with the CrowPanel</summary>
<div class="section-body">
<table class="result-table">
<tr><th>Item</th><th>What It Is</th><th>Replaces (vs. kit build)</th></tr>
<tr><td><strong>CrowPanel ESP32-S3 5.79" E-Paper</strong></td><td>All-in-one carrier: ESP32-S3-WROOM-1-N8R8 (8MB flash / 8MB PSRAM, WiFi + BLE) pre-wired via SPI to the 5.79" 272&times;792 B/W e-paper panel through dual SSD1683 drivers. Includes RESET / BOOT / Menu / Back buttons, a dial switch, TF card slot, and an SH1.0-2P LiPo connector.</td><td>ESP32-L motherboard + DESPI-C579 connector + GDEY0579F52 panel + ribbon cable (4 parts &rarr; 1 board)</td></tr>
<tr><td><strong>USB-C cable</strong></td><td>Power and programming.</td><td>Micro-USB cable</td></tr>
<tr><td><strong>Acrylic standoffs / feet</strong> (usually)</td><td>Lets the board stand on a desk without shorting traces.</td><td>n/a</td></tr>
</table>

<p>That's the whole build from the electronics side. Everything else on the bill of materials (filament, VHB tape, IPA, sandpaper, screws) is identical to the <a href="#sec-seinkguide">E-Ink Build's Phase 0.2</a> &mdash; reuse that list verbatim.</p>

<div class="callout"><div class="label">Verify the ASIN before you buy</div><p>ELECROW sells several CrowPanel variants (2.13", 4.2", 5.79", plus color LCD models). Only the 5.79" e-paper model matches this guide. The Amazon listing you used was <strong>B0FX4PDW6M</strong>, which resolves to the 272&times;792 B/W panel. If you see "IPS", "TFT", or "Touch" in the title, it's the wrong product.</p></div>
</div>
</details>

<!-- ============ PHASE 1: SOFTWARE ============ -->
<div class="phase-header"><span class="phase-num">1</span><span class="phase-title">Software Setup (Arduino IDE + ESP32-S3 + EPD Library)</span><span class="phase-time">30 min</span></div>

<details class="section-fold" id="cp-software"><summary>1.1 Install Arduino IDE 2.x &amp; ESP32 Board Support</summary>
<div class="section-body">
<p>Identical to Phase 1.1&ndash;1.2 of the E-Ink Build &mdash; install Arduino IDE 2.x from <a href="https://www.arduino.cc/en/software" target="_blank">arduino.cc/en/software</a>, then add the Espressif boards URL (<code>https://espressif.github.io/arduino-esp32/package_esp32_index.json</code>) in Preferences and install "esp32 by Espressif Systems" via Boards Manager. Use version 3.x or higher &mdash; the S3 needs it.</p>
</div>
</details>

<details class="section-fold"><summary>1.2 Board Settings for the ESP32-S3 (different from the kit build)</summary>
<div class="section-body">
<p>The CrowPanel uses an ESP32-S3, not a plain ESP32. Board settings matter here &mdash; getting them wrong causes silent boot loops.</p>
<ul class="findings">
  <li><strong>Tools &rarr; Board &rarr; ESP32 Arduino &rarr; ESP32S3 Dev Module</strong> (not "ESP32 Dev Module")</li>
  <li><strong>Tools &rarr; Partition Scheme &rarr; Huge APP (3MB No OTA / 1MB SPIFFS)</strong></li>
  <li><strong>Tools &rarr; PSRAM &rarr; OPI PSRAM</strong> (this enables the 8&nbsp;MB of PSRAM &mdash; without it, framebuffer allocation can fail)</li>
  <li><strong>Tools &rarr; Flash Size &rarr; 8MB (64Mb)</strong></li>
  <li><strong>Tools &rarr; Flash Mode &rarr; QIO 80MHz</strong></li>
  <li><strong>Tools &rarr; Upload Speed &rarr; 921600</strong> (drop to 460800 if uploads fail)</li>
  <li><strong>Tools &rarr; USB CDC On Boot &rarr; Enabled</strong> (lets the Serial Monitor talk over the native USB-C without a CP2102 driver)</li>
</ul>

<div class="callout"><div class="label">Why USB CDC On Boot matters</div><p>The CrowPanel uses the ESP32-S3's native USB peripheral, not a CP2102 USB-to-serial chip (like the older ESP32 DevKit or the ESP32-L). You do <strong>not</strong> need the Silicon Labs driver. But if "USB CDC On Boot" is disabled, the Serial Monitor won't see any output even though uploads work &mdash; which is a confusing failure mode. Turn it on once and forget it.</p></div>

<details class="build-help"><summary>If upload hangs at "Connecting..." &mdash; boot-mode entry</summary><div class="help-body">
<p>The ESP32-S3 sometimes doesn't auto-enter flash mode on first upload after power-up. Manual entry:</p>
<ol>
  <li>Hold the <strong>BOOT</strong> button.</li>
  <li>While holding BOOT, press and release the <strong>RESET</strong> button.</li>
  <li>Release BOOT. Board is now in download mode (Serial shows "Waiting for download").</li>
  <li>Click Upload. Once "Writing at..." appears, the board will reset itself on completion.</li>
</ol>
<p>Subsequent uploads usually auto-enter and you won't need this dance again.</p>
</div></details>
</div>
</details>

<details class="section-fold"><summary>1.3 Download ELECROW's CrowPanel Library</summary>
<div class="section-body">
<p>ELECROW provides a custom <code>EPD.h</code> library tuned for the dual-SSD1683 layout of this panel. Stock <code>GxEPD2</code> will <strong>only drive half the screen</strong> &mdash; use ELECROW's library.</p>
<ul class="findings">
  <li>Go to <a href="https://github.com/Elecrow-RD/CrowPanel-ESP32-5.79-E-paper-HMI-Display-with-272-792" target="_blank">github.com/Elecrow-RD/CrowPanel-ESP32-5.79-E-paper-HMI-Display-with-272-792</a></li>
  <li>Click <strong>Code &rarr; Download ZIP</strong></li>
  <li>Unzip. Navigate into the <code>example/</code> folder &mdash; each example is its own self-contained Arduino sketch with <code>EPD.h</code> / <code>EPD.cpp</code> / <code>GUI_Paint.h</code> / <code>GUI_Paint.cpp</code> / font headers alongside the <code>.ino</code>.</li>
  <li>Open one of the example <code>.ino</code> files (e.g. <code>Display_Picture</code>) in Arduino IDE. If it asks to move into a correctly named folder, click yes.</li>
</ul>

<div class="callout"><div class="label">No global Library install</div><p>Unlike Adafruit_GFX or ArduinoJson, you do <em>not</em> install <code>EPD.h</code> via Library Manager. ELECROW's pattern is to keep the library source files in each sketch folder. That's ugly but works; it also means you can safely hack on the library per-sketch without breaking other projects.</p></div>

<details class="build-help"><summary>Community alternatives (optional)</summary><div class="help-body">
<p>If you prefer a more mainstream driver stack, two community ports exist:</p>
<ul>
  <li><strong>ESPHome custom driver</strong> &mdash; <a href="https://community.home-assistant.io/t/esphome-custom-driver-for-elecrow-crowpanel-5-79-e-paper-display-dis08792e-dual-ssd1683-lvgl-working-partial-refresh/1005479" target="_blank">Home Assistant forum thread</a>. Gives you YAML-configured LVGL and partial refresh for a Home Assistant integration.</li>
  <li><strong>GxEPD2 dual-driver fork</strong> &mdash; documented in <a href="https://bukys.eu/blog/250105_my_love-hate_relationship_with_the_elecrow_crowpanel_5.79_e-paper_display" target="_blank">Ignas Bukys's blog post</a>. Lets you reuse GxEPD2/Adafruit_GFX code from other e-paper projects.</li>
  <li><strong>MicroPython library</strong> &mdash; <a href="https://github.com/omiq/crowpanel" target="_blank">github.com/omiq/crowpanel</a>. If Python is more natural than C++.</li>
</ul>
<p>The firmware below uses ELECROW's native <code>EPD.h</code> because it's the best-documented path and the one their examples use. If you want to port to GxEPD2 later, the <code>drawChargeBar</code> function is library-agnostic drawing primitives and will port with minimal changes.</p>
</div></details>
</div>
</details>

<!-- ============ PHASE 2: HARDWARE ============ -->
<div class="phase-header"><span class="phase-num">2</span><span class="phase-title">Hardware (Just Plug In USB-C)</span><span class="phase-time">2 min</span></div>

<details class="section-fold" id="cp-hardware"><summary>2.1 Connect USB-C and verify</summary>
<div class="section-body">
<ul class="findings">
  <li>Plug the included USB-C cable into the port on the CrowPanel's edge, and the other end into your computer.</li>
  <li>The power LED on the board should light up.</li>
  <li>Arduino IDE &rarr; <strong>Tools &rarr; Port</strong>: a new port should appear within 2 seconds (COM3+ on Windows, <code>/dev/cu.usbmodem*</code> on macOS, <code>/dev/ttyACM0</code> on Linux). Select it.</li>
</ul>

<div class="callout"><div class="label">What you're NOT doing</div><p>No ribbon cable to seat. No DESPI-C579 to press into a socket. No breadboard. No jumper wires. No orientation tricks. The whole hardware phase is one cable. Total time: 2 minutes versus ~30 minutes for the kit build.</p></div>
</div>
</details>

<details class="section-fold"><summary>2.2 Reference: onboard GPIO mapping (don't change these)</summary>
<div class="section-body">
<p>The display signals are hardwired on the PCB to specific GPIOs. The library <code>EPD.h</code> already knows about these &mdash; you won't edit them &mdash; but they're documented here in case you add external sensors and need to know which pins are taken.</p>

<table class="result-table">
<tr><th>Signal</th><th>ESP32-S3 GPIO</th></tr>
<tr><td>SCK (SPI clock)</td><td>GPIO 12</td></tr>
<tr><td>MOSI (SPI data)</td><td>GPIO 11</td></tr>
<tr><td>CS (chip select)</td><td>GPIO 45</td></tr>
<tr><td>DC (data / command)</td><td>GPIO 46</td></tr>
<tr><td>RES (reset)</td><td>GPIO 47</td></tr>
<tr><td>BUSY</td><td>GPIO 48</td></tr>
</table>

<p>Free GPIOs (verify against the board's schematic before wiring anything): typically GPIO 1&ndash;10 and 17&ndash;21 are available on the 2&times;10 expansion header for sensors, LEDs, or the color-change layer discussed in the Tech Stack tab.</p>
</div>
</details>

<!-- ============ PHASE 3: FIRST TEST ============ -->
<div class="phase-header"><span class="phase-num">3</span><span class="phase-title">First Upload &amp; Smoke Test</span><span class="phase-time">10 min</span></div>

<details class="section-fold" id="cp-firsttest"><summary>3.1 Upload the stock Display_Picture example</summary>
<div class="section-body">
<p>Before writing your own code, confirm the library, board settings, and USB connection all work. The ELECROW repo ships a <code>Display_Picture</code> example that just draws the company logo.</p>
<ul class="findings">
  <li>In the library ZIP you extracted, open <code>example/Display_Picture/Display_Picture.ino</code> in Arduino IDE.</li>
  <li>Confirm Tools &rarr; Board says <strong>ESP32S3 Dev Module</strong> and the other settings from Phase 1.2 are all set.</li>
  <li>Confirm Tools &rarr; Port is set to the CrowPanel's port.</li>
  <li>Click <strong>Upload</strong> (right-arrow icon). First compile is slow (~2&ndash;3 min while the ESP32-S3 toolchain builds its cache).</li>
  <li>Once "Hard resetting via RTS pin..." appears, the display will flash black/white a few times, then show the ELECROW logo in B/W.</li>
</ul>

<div class="callout"><div class="label">Expected refresh sequence</div><p>Full refresh is jarring but normal:
<br><br>
1. <strong>Black</strong> for ~2 s<br>
2. <strong>White</strong> for ~2 s<br>
3. One or two more black/white flashes (the controller is clearing particle state)<br>
4. Final image appears in crisp B/W<br>
5. Image stays on screen even after USB unplug &mdash; that's e-ink persistence</p>
<p>Total time: ~8 s for full refresh. Partial refresh (used in the firmware below) is ~300 ms and doesn't flash.</p></div>
</div>
</details>

<details class="section-fold"><summary>3.2 If the display stays blank or half-drawn</summary>
<div class="section-body">
<ul class="findings">
  <li><strong>Blank screen, upload succeeded:</strong> most likely the partition scheme or PSRAM setting is wrong &mdash; go back to Phase 1.2 and check every Tools menu entry. PSRAM set to "Disabled" is the #1 cause.</li>
  <li><strong>Only half the panel draws:</strong> you loaded code written for a single-SSD1683 panel. Make sure you're using ELECROW's <code>EPD.h</code> (dual-driver), not GxEPD2 or a generic Waveshare driver.</li>
  <li><strong>Garbled / snowy image:</strong> SPI clock mismatch. Lower upload speed in Tools, re-flash, then check if it persists on the final image (if yes, a library bug &mdash; file an issue on the repo).</li>
  <li><strong>No serial output but upload worked:</strong> "USB CDC On Boot" is disabled. Turn it on in Tools and re-upload.</li>
</ul>
</div>
</details>

<!-- ============ PHASE 4: COMPLETE FIRMWARE ============ -->
<div class="phase-header"><span class="phase-num">4</span><span class="phase-title">The B/W Charge Bar Firmware</span><span class="phase-time">1.5 hours</span></div>

<details class="section-fold" id="cp-chargecode"><summary>4.1 What this firmware does (and how B/W changes things)</summary>
<div class="section-body">
<p>The firmware is structurally the same as the 4-color build &mdash; WiFi HTTP server on port 80, <code>POST /charge</code> with JSON, 0&ndash;100 mapped to a battery bar &mdash; but the visual design changes because we lose color zones:</p>
<ul class="findings">
  <li><strong>&ge; 20% charge:</strong> normal mode &mdash; black outline, black-filled proportional bar, black percentage text on white.</li>
  <li><strong>&lt; 20% charge:</strong> alert mode &mdash; whole panel inverted (black background), oversized percentage in bold white, "RECHARGE" label. The sudden contrast shift is the peripheral "something's wrong" signal that used to be handled by the red fill.</li>
  <li><strong>At 0%:</strong> a stippled diagonal hatch across the empty bar body reinforces "dead," visible from across a room.</li>
</ul>

<details class="build-help"><summary>Why size + inversion instead of dithered "gray"</summary><div class="help-body">
<p>Dual-SSD1683 B/W panels <em>can</em> render faux-gray via spatial dithering (half-tone patterns), but (1) dithered gray looks grainy at reading distance and (2) partial refresh on dithered regions ghosts faster. Step-changes in contrast (black/white flip) are what e-ink does best. Leaning into that instead of fighting it gives a cleaner peripheral signal than a gradient ever would on this panel.</p>
</div></details>
</div>
</details>

<details class="section-fold"><summary>4.2 The main Arduino sketch</summary>
<div class="section-body">
<p>Create a new sketch folder called <code>psych_battery_crowpanel/</code> and copy the library source files (<code>EPD.h</code>, <code>EPD.cpp</code>, <code>GUI_Paint.h</code>, <code>GUI_Paint.cpp</code>, font headers) from one of the ELECROW example folders into it. Then save this as <code>psych_battery_crowpanel.ino</code>:</p>

<details class="build-help"><summary>What goes in the sketch folder</summary><div class="help-body">
<details class="code-fold"><summary>psych_battery_crowpanel/</summary>
<pre class="code-block">psych_battery_crowpanel/
├── psych_battery_crowpanel.ino   &larr; your main sketch (below)
├── EPD.h
├── EPD.cpp
├── GUI_Paint.h
├── GUI_Paint.cpp
├── Debug.h
├── fonts.h                       &larr; or individual font*.c files, depending on release
└── (optional) ImageData.h        &larr; only if you display bitmaps</pre>
</details>
<p>Use <strong>Sketch &rarr; Show Sketch Folder</strong> to open the folder, then copy files in from the ELECROW ZIP's <code>example/</code> subdirectory. Restart Arduino IDE afterward so the tabs refresh.</p>
</div></details>

<details class="code-fold"><summary>psych_battery_crowpanel.ino &mdash; main firmware</summary>
<pre class="code-block"><span class="cmt">/*
 * Psych_Battery CrowPanel Firmware (B/W variant)
 * Hardware: ELECROW CrowPanel ESP32-S3 5.79" E-Paper (dual SSD1683, 272x792 B/W)
 * Receives charge level (0-100) via WiFi HTTP or Serial
 * Displays a B/W battery bar; inverts display below 20% as the alert zone.
 */</span>

<span class="kw">#include</span> <span class="str">&lt;WiFi.h&gt;</span>
<span class="kw">#include</span> <span class="str">&lt;WebServer.h&gt;</span>
<span class="kw">#include</span> <span class="str">&lt;ArduinoJson.h&gt;</span>
<span class="kw">#include</span> <span class="str">"EPD.h"</span>
<span class="kw">#include</span> <span class="str">"GUI_Paint.h"</span>

<span class="cmt">// ============ CONFIG - EDIT THESE ============</span>
<span class="kw">const</span> <span class="ty">char</span>* WIFI_SSID     = <span class="str">"YourWiFiName"</span>;
<span class="kw">const</span> <span class="ty">char</span>* WIFI_PASSWORD = <span class="str">"YourWiFiPassword"</span>;
<span class="kw">const</span> <span class="ty">int</span>   HTTP_PORT     = <span class="num">80</span>;
<span class="kw">const</span> <span class="ty">int</span>   ALERT_THRESHOLD = <span class="num">20</span>;  <span class="cmt">// below this, invert the display</span>

<span class="cmt">// Display dimensions (CrowPanel 5.79" B/W landscape)</span>
<span class="kw">#define</span> EPD_W <span class="num">792</span>
<span class="kw">#define</span> EPD_H <span class="num">272</span>

<span class="cmt">// Framebuffer: 1 bit per pixel x 792 x 272 = 26,928 bytes (round to 27000)</span>
<span class="ty">UBYTE</span> ImageBW[<span class="num">27000</span>];

<span class="ty">WebServer</span> server(HTTP_PORT);
<span class="ty">int</span>  currentCharge   = <span class="num">100</span>;
<span class="ty">int</span>  refreshCount    = <span class="num">0</span>;
<span class="ty">bool</span> needsRedraw     = <span class="kw">true</span>;
<span class="ty">bool</span> lastWasInverted = <span class="kw">false</span>;

<span class="cmt">// ============ SETUP ============</span>
<span class="ty">void</span> <span class="fn">setup</span>() {
  Serial.begin(<span class="num">115200</span>);
  delay(<span class="num">500</span>);
  Serial.println(<span class="str">"\nPsych_Battery CrowPanel starting..."</span>);

  <span class="cmt">// Init display hardware (SPI + control pins)</span>
  EPD_GPIOInit();
  EPD_Init();                 <span class="cmt">// full refresh init</span>
  EPD_Clear(<span class="num">0xFF</span>);             <span class="cmt">// white</span>
  Paint_NewImage(ImageBW, EPD_W, EPD_H, <span class="num">0</span>, WHITE);
  Paint_Clear(WHITE);
  drawChargeBar(currentCharge);
  EPD_Display(ImageBW);
  EPD_DeepSleep();

  <span class="cmt">// Connect to WiFi</span>
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print(<span class="str">"Connecting to WiFi"</span>);
  <span class="ty">int</span> retries = <span class="num">0</span>;
  <span class="kw">while</span> (WiFi.status() != WL_CONNECTED && retries &lt; <span class="num">20</span>) {
    delay(<span class="num">500</span>);
    Serial.print(<span class="str">"."</span>);
    retries++;
  }
  <span class="kw">if</span> (WiFi.status() == WL_CONNECTED) {
    Serial.print(<span class="str">"\nConnected! IP: "</span>);
    Serial.println(WiFi.localIP());
  } <span class="kw">else</span> {
    Serial.println(<span class="str">"\nWiFi failed. Running serial-only mode."</span>);
  }

  <span class="cmt">// HTTP endpoints</span>
  server.on(<span class="str">"/charge"</span>, HTTP_POST, handleChargePost);
  server.on(<span class="str">"/charge"</span>, HTTP_GET,  handleChargeGet);
  server.on(<span class="str">"/"</span>, []() {
    server.send(<span class="num">200</span>, <span class="str">"text/plain"</span>,
      <span class="str">"Psych_Battery (CrowPanel B/W) ready. POST /charge with JSON {\"level\": 0-100}"</span>);
  });
  server.begin();
  Serial.println(<span class="str">"HTTP server on port 80"</span>);
}

<span class="cmt">// ============ LOOP ============</span>
<span class="ty">void</span> <span class="fn">loop</span>() {
  server.handleClient();
  handleSerialInput();
  <span class="kw">if</span> (needsRedraw) {
    redrawDisplay();
    needsRedraw = <span class="kw">false</span>;
  }
}

<span class="cmt">// ============ HTTP HANDLERS (identical to e-ink build) ============</span>
<span class="ty">void</span> <span class="fn">handleChargePost</span>() {
  <span class="kw">if</span> (!server.hasArg(<span class="str">"plain"</span>)) {
    server.send(<span class="num">400</span>, <span class="str">"text/plain"</span>, <span class="str">"Missing JSON body"</span>); <span class="kw">return</span>;
  }
  <span class="ty">JsonDocument</span> doc;
  <span class="ty">DeserializationError</span> err = deserializeJson(doc, server.arg(<span class="str">"plain"</span>));
  <span class="kw">if</span> (err) { server.send(<span class="num">400</span>, <span class="str">"text/plain"</span>, <span class="str">"Invalid JSON"</span>); <span class="kw">return</span>; }
  <span class="ty">int</span> level = doc[<span class="str">"level"</span>] | -<span class="num">1</span>;
  <span class="kw">if</span> (level &lt; <span class="num">0</span> || level &gt; <span class="num">100</span>) {
    server.send(<span class="num">400</span>, <span class="str">"text/plain"</span>, <span class="str">"level must be 0-100"</span>); <span class="kw">return</span>;
  }
  setCharge(level);
  server.send(<span class="num">200</span>, <span class="str">"application/json"</span>,
    <span class="str">"{\"ok\":true,\"level\":"</span> + String(level) + <span class="str">"}"</span>);
}

<span class="ty">void</span> <span class="fn">handleChargeGet</span>() {
  <span class="kw">if</span> (!server.hasArg(<span class="str">"level"</span>)) {
    server.send(<span class="num">200</span>, <span class="str">"application/json"</span>,
      <span class="str">"{\"level\":"</span> + String(currentCharge) + <span class="str">"}"</span>); <span class="kw">return</span>;
  }
  <span class="ty">int</span> level = server.arg(<span class="str">"level"</span>).toInt();
  <span class="kw">if</span> (level &lt; <span class="num">0</span> || level &gt; <span class="num">100</span>) {
    server.send(<span class="num">400</span>, <span class="str">"text/plain"</span>, <span class="str">"level must be 0-100"</span>); <span class="kw">return</span>;
  }
  setCharge(level);
  server.send(<span class="num">200</span>, <span class="str">"application/json"</span>,
    <span class="str">"{\"ok\":true,\"level\":"</span> + String(level) + <span class="str">"}"</span>);
}

<span class="ty">void</span> <span class="fn">handleSerialInput</span>() {
  <span class="kw">if</span> (Serial.available()) {
    <span class="ty">int</span> level = Serial.parseInt();
    <span class="kw">if</span> (level &gt;= <span class="num">0</span> && level &lt;= <span class="num">100</span>) {
      Serial.print(<span class="str">"Serial input: charge = "</span>);
      Serial.println(level);
      setCharge(level);
    }
    <span class="kw">while</span> (Serial.available()) Serial.read();
  }
}

<span class="ty">void</span> <span class="fn">setCharge</span>(<span class="ty">int</span> level) {
  <span class="kw">if</span> (level != currentCharge) { currentCharge = level; needsRedraw = <span class="kw">true</span>; }
}

<span class="cmt">// ============ DISPLAY ============</span>
<span class="ty">void</span> <span class="fn">redrawDisplay</span>() {
  Serial.print(<span class="str">"Drawing charge = "</span>); Serial.println(currentCharge);

  <span class="ty">bool</span> inverted = (currentCharge &lt; ALERT_THRESHOLD);
  drawChargeBar(currentCharge);

  refreshCount++;
  <span class="cmt">// Force a full refresh on inversion flip OR every 10 partial updates
  // (full refresh clears ghosting that partial refresh leaves behind)</span>
  <span class="ty">bool</span> needFullRefresh =
      (inverted != lastWasInverted) || (refreshCount % <span class="num">10</span> == <span class="num">0</span>);

  <span class="kw">if</span> (needFullRefresh) {
    EPD_Init();
    EPD_Display(ImageBW);
  } <span class="kw">else</span> {
    EPD_Init_Fast();
    EPD_Display_Fast(ImageBW);
  }
  EPD_DeepSleep();
  lastWasInverted = inverted;
}

<span class="ty">void</span> <span class="fn">drawChargeBar</span>(<span class="ty">int</span> percentage) {
  <span class="ty">bool</span> alert = (percentage &lt; ALERT_THRESHOLD);
  <span class="ty">UBYTE</span> bg = alert ? BLACK : WHITE;
  <span class="ty">UBYTE</span> fg = alert ? WHITE : BLACK;

  <span class="cmt">// Reset framebuffer with chosen background</span>
  Paint_NewImage(ImageBW, EPD_W, EPD_H, <span class="num">0</span>, bg);
  Paint_Clear(bg);

  <span class="cmt">// Battery body outline</span>
  <span class="ty">int</span> bx = <span class="num">40</span>,  by = <span class="num">50</span>;
  <span class="ty">int</span> bw = <span class="num">680</span>, bh = <span class="num">172</span>;
  Paint_DrawRectangle(bx, by, bx + bw, by + bh,
                      fg, DOT_PIXEL_3X3, DRAW_FILL_EMPTY);

  <span class="cmt">// Positive terminal (button top) on the right</span>
  Paint_DrawRectangle(bx + bw, by + <span class="num">50</span>, bx + bw + <span class="num">25</span>, by + bh - <span class="num">50</span>,
                      fg, DOT_PIXEL_3X3, DRAW_FILL_FULL);

  <span class="cmt">// Proportional fill inside the body</span>
  <span class="ty">int</span> innerX = bx + <span class="num">8</span>,  innerY = by + <span class="num">8</span>;
  <span class="ty">int</span> innerW = bw - <span class="num">16</span>, innerH = bh - <span class="num">16</span>;
  <span class="ty">int</span> fillW  = (innerW * percentage) / <span class="num">100</span>;
  <span class="kw">if</span> (fillW &gt; <span class="num">0</span>) {
    Paint_DrawRectangle(innerX, innerY, innerX + fillW, innerY + innerH,
                        fg, DOT_PIXEL_1X1, DRAW_FILL_FULL);
  }

  <span class="cmt">// Diagonal hatch pattern in the empty (unfilled) region at 0%</span>
  <span class="kw">if</span> (percentage == <span class="num">0</span>) {
    <span class="kw">for</span> (<span class="ty">int</span> x = innerX; x &lt; innerX + innerW; x += <span class="num">16</span>) {
      Paint_DrawLine(x, innerY, x + innerH, innerY + innerH,
                     fg, DOT_PIXEL_1X1, LINE_STYLE_SOLID);
    }
  }

  <span class="cmt">// Percentage text, centered. Bigger font in alert mode.</span>
  <span class="ty">char</span> txt[<span class="num">8</span>];
  snprintf(txt, <span class="kw">sizeof</span>(txt), <span class="str">"%d%%"</span>, percentage);
  <span class="kw">if</span> (alert) {
    <span class="cmt">// In alert mode: text sits on the fill (white on black)</span>
    Paint_DrawString_EN(bx + bw/<span class="num">2</span> - <span class="num">72</span>, by + bh/<span class="num">2</span> - <span class="num">28</span>,
                        txt, &amp;Font48, BLACK, WHITE);
    Paint_DrawString_EN(bx + bw/<span class="num">2</span> - <span class="num">68</span>, by + bh + <span class="num">14</span>,
                        <span class="str">"RECHARGE"</span>, &amp;Font24, BLACK, WHITE);
  } <span class="kw">else</span> {
    <span class="cmt">// Normal mode: text is black on the white background, reversed to white over the fill</span>
    Paint_DrawString_EN(bx + bw/<span class="num">2</span> - <span class="num">60</span>, by + bh/<span class="num">2</span> - <span class="num">28</span>,
                        txt, &amp;Font48, bg, fg);
  }

  <span class="cmt">// Top label</span>
  Paint_DrawString_EN(<span class="num">250</span>, <span class="num">10</span>, <span class="str">"PSYCH_BATTERY"</span>,
                      &amp;Font24, bg, fg);
}</pre>
</details>
</div>
</details>

<details class="section-fold"><summary>4.3 Edit WiFi credentials &amp; upload</summary>
<div class="section-body">
<p>Near the top of the sketch, replace <code>"YourWiFiName"</code> and <code>"YourWiFiPassword"</code> with your actual 2.4&nbsp;GHz network. ESP32-S3 supports 2.4&nbsp;GHz only &mdash; same restriction as the original ESP32. Upload (same Upload button). Open Serial Monitor at 115200. You should see:</p>
<details class="code-fold"><summary>Expected serial output</summary>
<pre class="code-block">Psych_Battery CrowPanel starting...
Connecting to WiFi.....
Connected! IP: 192.168.1.132
HTTP server on port 80</pre>
</details>
<p>Write down the IP &mdash; same contract as the other build, same <code>charge_sender.py</code>.</p>
</div>
</details>

<details class="section-fold"><summary>4.4 Test via serial &amp; browser</summary>
<div class="section-body">
<ul class="findings">
  <li><strong>Serial:</strong> in Serial Monitor, type a number 0&ndash;100 and press Enter. Partial refresh &lt;1 s.</li>
  <li><strong>Browser:</strong> go to <code>http://&lt;BATTERY_IP&gt;/charge?level=15</code>. Display should invert (black bg, white "15%" + "RECHARGE") since you crossed under 20%.</li>
  <li><strong>Alert flip &rarr; normal flip:</strong> try <code>level=25</code>. Display reverts to white background. The inversion transitions always trigger a full refresh (~8 s) to avoid ghost artifacts.</li>
</ul>
</div>
</details>

<!-- ============ PHASE 5: PYTHON BACKEND ============ -->
<div class="phase-header"><span class="phase-num">5</span><span class="phase-title">Python Backend Integration</span><span class="phase-time">0 extra min (reuses e-ink build)</span></div>

<details class="section-fold" id="cp-python"><summary>5.1 Reuse charge_sender.py &mdash; the HTTP contract is identical</summary>
<div class="section-body">
<p>The firmware above exposes the same HTTP interface as the E-Ink Build firmware: <code>POST /charge</code> with JSON <code>{"level": 0-100}</code>, <code>GET /charge?level=N</code>, and <code>GET /</code> returns plain-text status. That means <strong>the entire Phase 5 of the <a href="#sec-seinkguide">E-Ink Build</a> applies verbatim</strong> &mdash; <code>charge_sender.py</code>, <code>energy_score_to_battery.py</code>, the ActivityWatch loop, and the virtualenv setup all work unchanged.</p>

<p>The only edit: set <code>BATTERY_IP</code> at the top of <code>charge_sender.py</code> to the CrowPanel's IP address (from the Serial Monitor output in 4.3). Everything else is byte-for-byte the same.</p>

<div class="callout"><div class="label">If you're running both builds side-by-side</div><p>Nothing stops you from flashing both a Good Display kit and a CrowPanel on the same network and mirroring charge to both. Just set two IPs in <code>charge_sender.py</code> and <code>POST</code> to each in parallel. Useful for A/B testing visual legibility at a distance, or for demoing the two display styles during the McComb seminar.</p></div>
</div>
</details>

<!-- ============ PHASE 6: ENCLOSURE ============ -->
<div class="phase-header"><span class="phase-num">6</span><span class="phase-title">Enclosure Notes</span><span class="phase-time">varies</span></div>

<details class="section-fold" id="cp-enclosure"><summary>6.1 What changes vs. the kit enclosure</summary>
<div class="section-body">
<p>The CrowPanel is mechanically a single rigid PCB, so the enclosure simplifies:</p>
<ul class="findings">
  <li><strong>One cavity, not two.</strong> The kit needed a display cavity (for the panel) plus a PCB cavity (for the motherboard + adapter), connected by a ribbon channel. The CrowPanel needs a single rectangular pocket sized to the full board.</li>
  <li><strong>Front bezel dimensions:</strong> the panel's visible glass area is still 139&times;48&nbsp;mm (same Good Display glass), but it's offset within the PCB &mdash; measure the offset on your physical unit before cutting the front window in CAD.</li>
  <li><strong>USB-C port location:</strong> typically on the short edge of the PCB. Add a 10&times;4&nbsp;mm cable relief notch on that side so the enclosure doesn't block USB-C head clearance.</li>
  <li><strong>LiPo hatch (optional):</strong> if running cordless, leave a small hatch to access the SH1.0 connector and the battery bay.</li>
  <li><strong>Buttons:</strong> the board's onboard RESET / BOOT / Menu / Back / dial switch stick up ~3&nbsp;mm from the PCB. Either leave them exposed via cutouts or add silicone flexure tabs over them if you want clean industrial design.</li>
</ul>

<p>Every other enclosure detail (VHB mounting, Jacobs/Supernode printing, sanding, M3 inserts, acrylic window) is identical to <a href="#sec-seinkguide">the Good Display kit enclosure</a>. Reuse that guide.</p>
</div>
</details>

<!-- ============ COMPARISON ============ -->
<details class="section-fold"><summary>Comparison: CrowPanel vs. Good Display 4-Color Kit</summary>
<div class="section-body">
<table class="result-table">
<tr><th></th><th>CrowPanel (this build)</th><th>Good Display 4-Color Kit</th></tr>
<tr><td><strong>Cost (board only)</strong></td><td>~$55&ndash;70 (Amazon)</td><td>~$55&ndash;80 (buy-lcd.com)</td></tr>
<tr><td><strong>Board count</strong></td><td>1 (all-in-one)</td><td>3 (motherboard + adapter + panel)</td></tr>
<tr><td><strong>MCU</strong></td><td>ESP32-S3 @ 240 MHz, 8 MB flash + 8 MB PSRAM</td><td>ESP32 @ 240 MHz, 4 MB flash, no PSRAM</td></tr>
<tr><td><strong>Panel colors</strong></td><td>Black / White</td><td>Black / White / Yellow / Red</td></tr>
<tr><td><strong>Panel resolution</strong></td><td>272&times;792 (identical glass)</td><td>272&times;792 (identical glass)</td></tr>
<tr><td><strong>USB</strong></td><td>USB-C native (no CP2102 driver)</td><td>Micro-USB via CP2102</td></tr>
<tr><td><strong>LiPo connector</strong></td><td>SH1.0-2P built in</td><td>Not present (requires soldering)</td></tr>
<tr><td><strong>SD card slot</strong></td><td>Yes (TF)</td><td>No</td></tr>
<tr><td><strong>Onboard buttons</strong></td><td>RESET, BOOT, Menu, Back, dial switch</td><td>RESET, BOOT</td></tr>
<tr><td><strong>Partial refresh</strong></td><td>~300 ms</td><td>~12 s (fast mode)</td></tr>
<tr><td><strong>Full refresh</strong></td><td>~8 s</td><td>~20 s</td></tr>
<tr><td><strong>Ribbon-cable handling</strong></td><td>None required</td><td>Critical (contacts DOWN, 5-6 mm deep)</td></tr>
<tr><td><strong>Alert mechanism</strong></td><td>Size + inversion (size/contrast)</td><td>Yellow &rarr; red hue transition</td></tr>
<tr><td><strong>Best for</strong></td><td>Fast iteration, cordless operation, lower ribbon-related failure rate</td><td>Information-rich display with color-coded zones</td></tr>
</table>
</div>
</details>

<!-- ============ TROUBLESHOOTING ============ -->
<details class="section-fold" id="cp-troubleshooting"><summary>Troubleshooting Guide</summary>
<div class="section-body">
<table class="result-table">
<tr><th>Symptom</th><th>Likely Cause</th><th>Fix</th></tr>
<tr><td>Upload fails: "Failed to connect"</td><td>Board didn't auto-enter flash mode</td><td>Hold BOOT, tap RESET, release BOOT, then click Upload.</td></tr>
<tr><td>Upload succeeds but Serial Monitor is blank</td><td>"USB CDC On Boot" disabled</td><td>Tools &rarr; USB CDC On Boot &rarr; Enabled. Re-upload.</td></tr>
<tr><td>Display stays blank after upload</td><td>Wrong partition scheme or PSRAM off</td><td>Verify Partition = "Huge APP (3MB No OTA/1MB SPIFFS)" and PSRAM = "OPI PSRAM". Re-upload.</td></tr>
<tr><td>Only half the panel draws</td><td>Using GxEPD2 or single-driver library</td><td>Switch to ELECROW's EPD.h (dual-SSD1683). Copy the library files from <code>example/</code> into your sketch folder.</td></tr>
<tr><td>Panel flickers / ghosts heavily after many updates</td><td>Partial refresh has accumulated ghost charge</td><td>Normal. Firmware does a full refresh every 10 updates. Lower the counter to 5 if it bothers you.</td></tr>
<tr><td>"Out of memory" at boot</td><td>Framebuffer allocation failed</td><td>Confirm PSRAM is set to OPI PSRAM in Tools. The framebuffer (~27 KB) is well under the 8 MB PSRAM budget, so this almost always means PSRAM is disabled.</td></tr>
<tr><td>Inversion transition flashes multiple times</td><td>Full refresh sequence on the alert-flip</td><td>Expected &mdash; we force a full refresh on inversion so ghosting doesn't leak between contrast states. Partial refresh between same-state updates.</td></tr>
<tr><td>"Connecting to WiFi...." never ends</td><td>Wrong SSID / password, or 5 GHz only</td><td>ESP32-S3 is 2.4 GHz only. Use a phone hotspot if your home network is 5 GHz.</td></tr>
<tr><td>HTTP requests time out</td><td>CrowPanel lost WiFi or IP changed</td><td>Check Serial Monitor for a new IP. Set a static DHCP lease on your router for a stable IP.</td></tr>
<tr><td>COM port doesn't appear</td><td>USB cable is charge-only, not data</td><td>Swap to a known-good USB-C data cable. ESP32-S3 uses native USB, so no driver needs installing.</td></tr>
<tr><td>Board resets every few seconds</td><td>Watchdog timeout from a blocking function</td><td>Check that <code>loop()</code> calls <code>server.handleClient()</code> frequently. Don't put <code>delay()</code> over 1 s in the main loop.</td></tr>
</table>

<div class="callout"><div class="label">When to ask for help</div><p>If the firmware uploads cleanly but the display is blank after verifying all Tools settings, file an issue on the <a href="https://github.com/Elecrow-RD/CrowPanel-ESP32-5.79-E-paper-HMI-Display-with-272-792/issues" target="_blank">ELECROW repo</a> with your Arduino IDE version, ESP32 package version, and the complete Tools menu settings. ELECROW's support also responds to emails at <code>techsupport@elecrow.com</code>.</p></div>
</div>
</details>
</div>

</div>
`,
  });
}

// ═══════════════════════════════════════════════════
// AHMED PAGE
// ═══════════════════════════════════════════════════
function buildAhmed() {
  return pageWrapper({
    title: "Faez Ahmed: AI-Driven Engineering Design",
    icon: "\uD83D\uDE80",
    body: `
<div class="editorial">
<style>
.editorial{--paper:#FBF8F1;--ink:#1C1712;--ink-soft:#4a3f33;--rule:#d8cfbd;--accent-ed:#2E5D3E;--accent-ed-soft:#6a8f78;background:var(--paper);color:var(--ink);font-family:'Source Serif 4','Source Serif Pro',Georgia,serif;line-height:1.7;position:relative;min-height:100vh;}
[data-theme="dark"] .editorial{--paper:#0f1410;--ink:#e9efe8;--ink-soft:#a6b6a9;--rule:#29352c;--accent-ed:#8fbf9f;--accent-ed-soft:#a8d1b4;}
.editorial *{color:inherit;}
.editorial .grain{position:fixed;inset:0;pointer-events:none;z-index:1;opacity:0.32;mix-blend-mode:multiply;background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.08 0 0 0 0 0.08 0 0 0 0 0.09 0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");}
[data-theme="dark"] .editorial .grain{mix-blend-mode:screen;opacity:0.12;}
.editorial .ed-wrap{position:relative;z-index:2;max-width:720px;margin:0 auto;padding:3.5rem 1.75rem 5rem;}
.editorial .ed-back{display:inline-block;font-family:'JetBrains Mono','IBM Plex Mono',ui-monospace,monospace;font-size:0.72rem;letter-spacing:0.14em;text-transform:uppercase;color:var(--ink-soft);text-decoration:none;margin-bottom:2.5rem;border-bottom:1px solid transparent;transition:border-color 0.2s,color 0.2s;}
.editorial .ed-back:hover{color:var(--accent-ed);border-bottom-color:var(--accent-ed);}
.editorial .masthead{border-top:3px double var(--ink);border-bottom:1px solid var(--rule);padding:1.75rem 0 2.25rem;margin-bottom:3rem;}
.editorial .folio{font-family:'JetBrains Mono','IBM Plex Mono',ui-monospace,monospace;font-size:0.72rem;letter-spacing:0.2em;text-transform:uppercase;color:var(--ink-soft);margin-bottom:1.5rem;display:flex;justify-content:space-between;flex-wrap:wrap;gap:0.5rem;}
.editorial .folio .folio-dot{color:var(--accent-ed);margin:0 0.6em;}
.editorial .ed-title{font-family:'Source Serif 4','Source Serif Pro',Georgia,serif;font-style:italic;font-weight:400;font-size:clamp(2.2rem,5.8vw,3.6rem);line-height:1.08;letter-spacing:-0.015em;margin:0 0 1.25rem;color:var(--ink);}
.editorial .ed-dek{font-family:'Source Serif 4','Source Serif Pro',Georgia,serif;font-size:1.15rem;line-height:1.55;color:var(--ink-soft);font-weight:400;margin:0 0 1.5rem;max-width:58ch;}
.editorial .ed-byline{font-family:'JetBrains Mono','IBM Plex Mono',ui-monospace,monospace;font-size:0.72rem;letter-spacing:0.14em;text-transform:uppercase;color:var(--ink-soft);}
.editorial .ed-byline .byline-sep{margin:0 0.55em;color:var(--accent-ed);}
.editorial .section-mark{display:flex;align-items:baseline;gap:1rem;margin:4rem 0 1.25rem;padding-top:2rem;border-top:1px solid var(--rule);}
.editorial .section-num{display:inline-block;font-family:'JetBrains Mono','IBM Plex Mono',ui-monospace,monospace;font-size:0.7rem;letter-spacing:0.18em;text-transform:uppercase;color:var(--accent-ed);border:1px solid var(--accent-ed);padding:0.2rem 0.55rem;border-radius:2px;flex-shrink:0;font-weight:600;}
.editorial .section-title{font-family:'Source Serif 4','Source Serif Pro',Georgia,serif;font-style:italic;font-weight:400;font-size:clamp(1.6rem,3.5vw,2.15rem);line-height:1.2;margin:0;letter-spacing:-0.01em;color:var(--ink);}
.editorial h3.ed-h3{font-family:'Source Serif 4','Source Serif Pro',Georgia,serif;font-style:italic;font-weight:400;font-size:1.35rem;margin:2.5rem 0 0.75rem;letter-spacing:-0.005em;color:var(--ink);}
.editorial h4.ed-h4{font-family:'JetBrains Mono','IBM Plex Mono',ui-monospace,monospace;font-size:0.72rem;letter-spacing:0.14em;text-transform:uppercase;color:var(--accent-ed);margin:2rem 0 0.5rem;font-weight:600;}
.editorial p{font-size:1.08rem;line-height:1.75;margin:0 0 1.2rem;color:var(--ink);font-family:'Source Serif 4','Source Serif Pro',Georgia,serif;}
.editorial p.lede{font-size:1.12rem;}
.editorial p.lede::first-letter{font-family:'Source Serif 4','Source Serif Pro',Georgia,serif;font-weight:700;font-size:4.4rem;line-height:0.9;float:left;padding:0.35rem 0.6rem 0 0;margin:0.15rem 0.1rem 0 0;color:var(--accent-ed);font-style:normal;}
.editorial strong{font-weight:600;color:var(--ink);}
.editorial em{font-style:italic;}
.editorial a.ed-link{color:var(--accent-ed);text-decoration:none;border-bottom:1px solid var(--accent-ed-soft);transition:border-color 0.15s,color 0.15s;}
.editorial a.ed-link:hover{color:var(--ink);border-bottom-color:var(--ink);}
.editorial a.cite{display:inline-block;font-family:'JetBrains Mono','IBM Plex Mono',ui-monospace,monospace;font-size:0.72em;vertical-align:super;line-height:1;color:var(--accent-ed);text-decoration:none;padding:0 0.1em;font-weight:600;position:relative;}
.editorial a.cite:hover{color:var(--ink);}
.editorial a.cite[data-tip]:hover::after{content:attr(data-tip);position:absolute;bottom:calc(100% + 6px);left:50%;transform:translateX(-50%);background:var(--ink);color:var(--paper);font-family:'JetBrains Mono','IBM Plex Mono',ui-monospace,monospace;font-size:0.7rem;line-height:1.35;padding:0.5rem 0.65rem;border-radius:3px;white-space:normal;width:max-content;max-width:260px;z-index:10;letter-spacing:0.02em;text-transform:none;font-weight:400;pointer-events:none;box-shadow:0 3px 8px rgba(0,0,0,0.18);}
.editorial .pull{border-left:3px solid var(--accent-ed);padding:0.5rem 0 0.5rem 1.5rem;margin:2.5rem 0;}
.editorial .pull p{font-family:'Source Serif 4','Source Serif Pro',Georgia,serif;font-style:italic;font-size:1.35rem;line-height:1.45;color:var(--ink);margin:0;}
.editorial .meta-label{font-family:'JetBrains Mono','IBM Plex Mono',ui-monospace,monospace;font-size:0.68rem;letter-spacing:0.16em;text-transform:uppercase;color:var(--accent-ed);font-weight:600;display:block;margin-bottom:0.35rem;}
.editorial ol.findings-ed{list-style:none;counter-reset:findings;padding:0;margin:1.5rem 0 2rem;}
.editorial ol.findings-ed li{counter-increment:findings;position:relative;padding:0.85rem 0 0.85rem 3rem;border-bottom:1px solid var(--rule);font-size:1.05rem;line-height:1.65;}
.editorial ol.findings-ed li::before{content:counter(findings,decimal-leading-zero);position:absolute;left:0;top:0.95rem;font-family:'JetBrains Mono','IBM Plex Mono',ui-monospace,monospace;font-size:0.72rem;letter-spacing:0.1em;color:var(--accent-ed);font-weight:600;}
.editorial ol.findings-ed li:last-child{border-bottom:none;}
.editorial details.expandable{margin:3.5rem 0 1.5rem;border-top:2px solid var(--ink);padding-top:1.25rem;}
.editorial details.expandable summary{font-family:'JetBrains Mono','IBM Plex Mono',ui-monospace,monospace;font-size:0.8rem;letter-spacing:0.16em;text-transform:uppercase;color:var(--ink);cursor:pointer;list-style:none;display:flex;align-items:center;gap:0.6rem;font-weight:600;}
.editorial details.expandable summary::before{content:'+';font-family:'Source Serif 4',Georgia,serif;font-size:1.4rem;font-weight:400;color:var(--accent-ed);line-height:1;transition:transform 0.2s;}
.editorial details.expandable[open] summary::before{content:'\u2013';}
.editorial ol.reflist{list-style:none;counter-reset:refs;padding:0;margin:1.5rem 0 0;}
.editorial ol.reflist li{counter-increment:refs;position:relative;padding:0.75rem 0 0.75rem 2.5rem;font-family:'Source Serif 4','Source Serif Pro',Georgia,serif;font-size:0.95rem;line-height:1.55;color:var(--ink);border-bottom:1px solid var(--rule);scroll-margin-top:4rem;}
.editorial ol.reflist li::before{content:'[' counter(refs) ']';position:absolute;left:0;top:0.78rem;font-family:'JetBrains Mono','IBM Plex Mono',ui-monospace,monospace;font-size:0.7rem;letter-spacing:0.04em;color:var(--accent-ed);font-weight:600;}
.editorial ol.reflist li:last-child{border-bottom:none;}
.editorial ol.reflist li:target{background:rgba(46,93,62,0.1);padding-left:2.75rem;}
.editorial ol.reflist .ref-authors{color:var(--ink-soft);}
.editorial ol.reflist .ref-title{font-style:italic;}
.editorial ol.reflist .ref-venue{font-family:'JetBrains Mono','IBM Plex Mono',ui-monospace,monospace;font-size:0.78rem;color:var(--ink-soft);letter-spacing:0.02em;display:block;margin-top:0.2rem;}
.editorial ol.reflist a{color:var(--accent-ed);text-decoration:none;border-bottom:1px solid var(--accent-ed-soft);}
.editorial ol.reflist a:hover{color:var(--ink);border-bottom-color:var(--ink);}
.editorial .divider{text-align:center;font-family:'JetBrains Mono','IBM Plex Mono',ui-monospace,monospace;font-size:0.85rem;color:var(--rule);letter-spacing:0.6em;margin:3rem 0 2.5rem;padding-right:0;}
.editorial hr.rule{border:none;border-top:1px solid var(--rule);margin:2.5rem 0;}
.editorial table.comp-table{width:100%;border-collapse:collapse;font-size:0.92rem;margin:1.25rem 0 2rem;font-family:'Source Serif 4','Source Serif Pro',Georgia,serif;}
.editorial table.comp-table th,.editorial table.comp-table td{text-align:left;padding:0.65rem 0.75rem;border-bottom:1px solid var(--rule);vertical-align:top;}
.editorial table.comp-table thead th{font-family:'JetBrains Mono','IBM Plex Mono',ui-monospace,monospace;font-size:0.7rem;letter-spacing:0.12em;text-transform:uppercase;color:var(--accent-ed);font-weight:600;border-bottom:2px solid var(--ink);}
.editorial table.comp-table tbody th{font-family:'JetBrains Mono','IBM Plex Mono',ui-monospace,monospace;font-size:0.7rem;letter-spacing:0.08em;text-transform:uppercase;color:var(--ink-soft);font-weight:600;width:34%;}
</style>
<div class="grain"></div>
<div class="ed-wrap">
<a href="/" class="ed-back">&larr; Research Hub</a>

<header class="masthead">
  <div class="folio"><span>Ahmed<span class="folio-dot">&bull;</span>Research Note<span class="folio-dot">&bull;</span>Vol.&nbsp;I</span><span>April&nbsp;2026</span></div>
  <h1 class="ed-title">Engineering design, at the speed of inference</h1>
  <p class="ed-dek">Faez Ahmed's DeCoDE Lab is building the infrastructure &mdash; datasets, foundation models, and multi-agent systems &mdash; for an engineering practice in which optimization, CAD, and simulation happen in seconds.</p>
  <div class="ed-byline">Douglas McGowan<span class="byline-sep">&#x2022;</span>UC Berkeley<span class="byline-sep">&#x2022;</span>Reading notes on five papers: OAT, VideoCAD, DrivAerNet++, GenCAD, Design Agents</div>
</header>

<section>
<div class="section-mark"><span class="section-num">I</span><h2 class="section-title">The big idea</h2></div>
<p class="lede">Faez Ahmed is an Associate Professor in MIT's Department of Mechanical Engineering, where he directs the <strong>Design Computation and Digital Engineering (DeCoDE) Lab</strong>.<a href="#ref-1" class="cite" data-tip="DeCoDE Lab, MIT">[1]</a> His work sits at an unusual intersection: not <em>AI for science</em> in the broad sense, but machine learning that takes the constraints of mechanical engineering seriously &mdash; parts that have to be manufacturable, structures that have to carry load, vehicles that have to obey the Navier&ndash;Stokes equations. The question the lab keeps returning to is whether the same data-and-scale playbook that remade language and vision can be applied, concretely, to the pipeline an engineer actually uses.<a href="#ref-2" class="cite" data-tip="Ahmed, MIT MechE faculty page">[2]</a></p>
<p>Five papers from 2024 and 2025 sketch an answer. <strong>OAT</strong><a href="#ref-3" class="cite" data-tip="Optimize Any Topology, NeurIPS 2025">[3]</a> trains a foundation model for structural topology optimization on 2.2 million examples. <strong>GenCAD</strong><a href="#ref-4" class="cite" data-tip="Image-conditioned CAD generation, TMLR 2025">[4]</a> turns images into <em>editable</em> parametric CAD programs rather than static meshes. <strong>VideoCAD</strong><a href="#ref-5" class="cite" data-tip="Learning CAD UI from video, NeurIPS 2025">[5]</a> teaches a model to drive a real CAD tool by watching screen recordings. <strong>DrivAerNet++</strong><a href="#ref-6" class="cite" data-tip="Multimodal car dataset with CFD, NeurIPS 2024">[6]</a> is the 39-TB, 8,000-car simulation corpus underneath that kind of work. <strong>Design Agents</strong><a href="#ref-7" class="cite" data-tip="Multi-agent framework for car design, IDETC 2025">[7]</a> stitches these pieces into an agentic loop &mdash; designer, critic, engineer, coordinator &mdash; over the automotive pipeline.</p>

<div class="pull"><p>The wager across these papers is that engineering AI, like NLP before it, is bottlenecked on data and on representation &mdash; and that the right representation is rarely a mesh.</p></div>

<h3 class="ed-h3">Five papers, one instinct</h3>
<ol class="findings-ed">
  <li><strong>Parametric, not pictorial.</strong> The outputs have to be things an engineer can edit &mdash; CAD command sequences, topology fields at arbitrary resolution, not 3D shapes frozen into meshes.</li>
  <li><strong>Data first, architecture second.</strong> OpenTO (2.2M topologies), DrivAerNet++ (8,000 cars, 10 modalities, 39 TB), and VideoCAD (41K annotated CAD videos) are the load-bearing contributions before any model.</li>
  <li><strong>Foundation models for design.</strong> One trained system, many problem specifications &mdash; the same bet that paid off in language, applied to compliance minimization and image-to-CAD.</li>
  <li><strong>Physics in the loop.</strong> Every output is checked against CFD, FEM compliance, or a geometry kernel. Plausible-looking is not the bar.</li>
  <li><strong>Agents as orchestration.</strong> Single monolithic models don't span sketch-to-simulation; specialized agents connected by a coordinator do.</li>
</ol>

<table class="comp-table">
<thead><tr><th>Paper</th><th>Venue</th><th>Role in the program</th></tr></thead>
<tbody>
<tr><th>OAT</th><td>NeurIPS 2025</td><td>Foundation model for topology optimization</td></tr>
<tr><th>GenCAD</th><td>TMLR 2025</td><td>Image &rarr; editable parametric CAD</td></tr>
<tr><th>VideoCAD</th><td>NeurIPS 2025 (D&amp;B)</td><td>Learning to drive CAD tools from video</td></tr>
<tr><th>DrivAerNet++</th><td>NeurIPS 2024 (D&amp;B)</td><td>Multimodal automotive simulation corpus</td></tr>
<tr><th>Design Agents</th><td>IDETC/ASME 2025</td><td>Multi-agent framework over the pipeline</td></tr>
</tbody>
</table>
</section>

<section>
<div class="section-mark"><span class="section-num">II</span><h2 class="section-title">OAT &mdash; topology optimization, freed from the grid</h2></div>
<p><span class="meta-label">Heyrani Nobari, Regenwetter, Picard, Han &amp; Ahmed &mdash; NeurIPS 2025</span>Topology optimization asks, given a set of loads, fixtures, and a volume budget, where should material go? The canonical solver is SIMP, an iterative finite-element method that is accurate and slow &mdash; minutes to hours per problem. Deep-learning accelerators exist, but nearly all of them are trained on a single resolution, a square grid, and a small menu of hand-coded boundary conditions. Change any of those, and the model needs retraining.<a href="#ref-3" class="cite" data-tip="OAT paper, arXiv 2510.23667">[3]</a></p>

<h3 class="ed-h3">Three components, one latent space</h3>
<h4 class="ed-h4">01 / Neural-field autoencoder</h4>
<p>The encoder is resolution- and shape-agnostic. Rather than flattening structures into a fixed pixel grid, it maps them to a continuous neural field &mdash; so the same encoding handles a 64&times;64 square and a 256&times;512 rectangle without architectural changes.</p>

<h4 class="ed-h4">02 / Implicit neural-field decoder</h4>
<p>The decoder reads a latent code and produces a continuous density field, which can then be queried at any resolution. Unlike a grid decoder, it does not commit to a target image size.</p>

<h4 class="ed-h4">03 / Conditional latent diffusion</h4>
<p>The diffusion model generates optimized latent codes conditioned on the full design specification &mdash; loads, fixtures, volume fraction, aspect ratio. This is the component that makes the system a <em>foundation</em> model: one trained diffusion, many problems.</p>

<h3 class="ed-h3">OpenTO &mdash; the corpus underneath</h3>
<p>OAT is trained on <strong>OpenTO</strong>, a new corpus of <strong>2.2 million optimized structures</strong> covering roughly 2 million unique boundary-condition configurations. Aspect ratios go up to 10:1; volume fractions and load/fixture layouts are broadly varied. The dataset is released alongside the model.<a href="#ref-3" class="cite" data-tip="OAT arXiv 2510.23667 and GitHub release">[3]</a></p>

<h3 class="ed-h3">What the benchmarks say</h3>
<table class="comp-table">
<thead><tr><th>Axis</th><th>Result</th></tr></thead>
<tbody>
<tr><th>Mean compliance</th><td>Up to 90% lower than the best prior deep-learning baselines, across four public benchmarks and two unseen tests</td></tr>
<tr><th>Inference</th><td>Sub-1-second on a single GPU</td></tr>
<tr><th>Resolution range</th><td>64&times;64 to 256&times;256, continuous via neural fields</td></tr>
<tr><th>Aspect ratio</th><td>Up to 10:1, including ratios unseen during training</td></tr>
</tbody>
</table>

<div class="pull"><p>SIMP takes minutes to hours; OAT takes under a second. Three orders of magnitude is not a speedup. It is a different regime of work.</p></div>

<p>The claim the paper lets you make is unusually plain: on compliance-minimization problems with arbitrary rectangular domains and arbitrary boundary conditions, a single trained model is competitive with &mdash; and often better than &mdash; the solver, at interactive latency. That changes what is worth doing during an early design meeting.</p>
</section>

<section>
<div class="section-mark"><span class="section-num">III</span><h2 class="section-title">GenCAD &mdash; images into recipes, not shapes</h2></div>
<p><span class="meta-label">Alam &amp; Ahmed &mdash; TMLR 2025</span>Most image-to-3D systems output meshes, point clouds, or voxel grids. An engineer looking at that output knows something is wrong: a mesh of a bracket is a photograph of a bracket. It is not the bracket. The bracket &mdash; the thing that goes into a release, that can be revised when the hole diameter changes &mdash; is a <em>parametric CAD model</em>, a sequence of sketch and extrude operations whose construction history is the point. GenCAD closes the gap between a rendering and that recipe.<a href="#ref-4" class="cite" data-tip="GenCAD paper, arXiv 2409.16294">[4]</a></p>

<h3 class="ed-h3">A four-stage pipeline</h3>
<ol class="findings-ed">
  <li><strong>Autoregressive CAD encoder.</strong> A transformer learns compact latent codes for sequences of CAD commands (sketch lines, arcs, extrusions, chamfers).</li>
  <li><strong>Contrastive image&ndash;CAD alignment.</strong> A contrastive objective places a CAD program and its rendering near each other in a shared embedding space.</li>
  <li><strong>Latent diffusion, conditioned on images.</strong> Given a photo or rendering of a part, the diffusion model samples a CAD latent code &mdash; and, because it is a diffusion, it samples many.</li>
  <li><strong>Decoder back to commands.</strong> The decoder turns each latent into an executable CAD command sequence, which a geometry kernel can run to produce a solid.</li>
</ol>

<h3 class="ed-h3">Why the sampling matters</h3>
<p>Because the third stage is a diffusion rather than a point estimate, a single input image can produce <em>multiple valid</em> CAD programs &mdash; different constructions that all render to the same part. In practice this converts "reconstruct this object" into "explore its design space," and gives the engineer something more like a set of alternatives than a single hallucination. GenCAD also supports image-based retrieval over a library of about 7,000 CAD programs, which is a quiet but useful side-effect of the contrastive stage.</p>

<div class="pull"><p>A mesh is a JPEG. A parametric CAD model is a Figma file. GenCAD outputs Figma files.</p></div>
</section>

<section>
<div class="section-mark"><span class="section-num">IV</span><h2 class="section-title">VideoCAD &mdash; learning CAD by watching the screen</h2></div>
<p><span class="meta-label">Man, Nehme, Alam &amp; Ahmed &mdash; NeurIPS 2025 (D&amp;B)</span>The UI-agent literature has mostly worked on short, web-flavoured tasks: click a button, fill a field, navigate a menu. Professional CAD tools &mdash; Onshape, SolidWorks, Fusion 360 &mdash; are a different regime entirely. A single part may take <em>hundreds</em> of ordered, spatially-grounded actions: sketch a profile, constrain it, extrude, chamfer, fillet, pattern. Before this paper, no public dataset captured that.<a href="#ref-5" class="cite" data-tip="VideoCAD paper, arXiv 2505.24838">[5]</a></p>

<h3 class="ed-h3">41,000 CAD videos, generated</h3>
<p>VideoCAD releases <strong>41,005 annotated video recordings</strong> of CAD operations. The pipeline starts from the DeepCAD corpus of human-authored parametric models, converts each model into a UI instruction sequence, and drives a scripted bot through Onshape, screen-recording the whole run. DINOv2-based visual filtering removes corrupted takes, and keyframes are aligned to actions.</p>
<p>The key number is the average sequence length: <strong>186 frames</strong>, up to <strong>20&times; longer</strong> than existing UI-interaction datasets. The horizon is not a minor detail; it is the reason VideoCAD exists.</p>

<h3 class="ed-h3">VideoCADFormer and the VQA stress test</h3>
<p>Alongside the dataset, the authors introduce <strong>VideoCADFormer</strong>, a causal autoregressive transformer trained by behaviour cloning. It conditions on the target CAD image (the part you want) and a rolling window of recent frames (what has happened so far) and predicts the next low-level UI action.</p>
<p>A companion visual-question-answering benchmark asks frontier multimodal LLMs about spatial and procedural structure inside these same videos. Current models &mdash; GPT-class and Gemini-class vision systems &mdash; struggle, which is itself the point. The long horizons and precise spatial grounding in CAD remain unsolved, and VideoCAD gives everyone a yardstick.</p>
</section>

<section>
<div class="section-mark"><span class="section-num">V</span><h2 class="section-title">DrivAerNet++ &mdash; the ImageNet-sized corpus under automotive AI</h2></div>
<p><span class="meta-label">Elrefaie, Morar, Dai &amp; Ahmed &mdash; NeurIPS 2024 (D&amp;B)</span>Aerodynamic design in the auto industry is dominated by CFD &mdash; expensive, slow, expertise-heavy. Surrogate models could, in principle, replace days of simulation with milliseconds of inference, but only if the training data exists. Until DrivAerNet++, it didn't: the available public datasets had a few hundred shapes and a handful of modalities, which is not enough to train serious surrogates.<a href="#ref-6" class="cite" data-tip="DrivAerNet++ paper, arXiv 2406.09624">[6]</a></p>

<h3 class="ed-h3">What's in the box</h3>
<table class="comp-table">
<thead><tr><th>Attribute</th><th>Value</th></tr></thead>
<tbody>
<tr><th>Car designs</th><td>8,000+ (fastback, notchback, estateback; ICE and EV underbodies)</td></tr>
<tr><th>Per-design parameters</th><td>26 geometric design parameters</td></tr>
<tr><th>Semantic labels</th><td>29 labelled components per car</td></tr>
<tr><th>Total size</th><td>~39 TB, hosted on Harvard Dataverse</td></tr>
<tr><th>Modalities</th><td>Meshes, parametric models, aero coefficients, 3D CFD volumes, surface fields, point clouds, renderings, sketches, full OpenFOAM cases</td></tr>
</tbody>
</table>

<p>Ten modalities per design is the part that makes the dataset interesting as infrastructure. It opens research directions that were practically inaccessible before: sketch-to-aerodynamics, point-cloud-to-drag, renderings as an input channel. The dataset is released under CC&nbsp;BY-NC 4.0 via Harvard Dataverse,<a href="#ref-8" class="cite" data-tip="DrivAerNet dataverse repository">[8]</a> and is the substrate that <em>Design Agents</em> (below) runs its CAD and simulation queries against.</p>

<div class="pull"><p>ImageNet was 150 GB. DrivAerNet++ is 39 TB. The size reflects the cost of a single CFD run, multiplied by eight thousand cars.</p></div>
</section>

<section>
<div class="section-mark"><span class="section-num">VI</span><h2 class="section-title">Design Agents &mdash; the pipeline, orchestrated</h2></div>
<p><span class="meta-label">Elrefaie, Qian, Wu, Chen, Dai &amp; Ahmed &mdash; IDETC/ASME 2025</span>No single model handles the whole automotive design pipeline. Styling needs image generation and aesthetic judgement. Engineering needs geometric deep learning and CFD. Coordinating them needs a different kind of reasoning again. <em>Design Agents</em> takes the multi-agent pattern that has worked in software engineering &mdash; specialized agents, a coordinator, a shared workspace &mdash; and ports it to a physical-engineering problem with hard constraints.<a href="#ref-7" class="cite" data-tip="AI Agents in Engineering Design, arXiv 2503.23315">[7]</a></p>

<h3 class="ed-h3">Four roles</h3>
<ol class="findings-ed">
  <li><strong>Styling Agent.</strong> Takes a sketch or text prompt and renders high-resolution styling variations using diffusion models (SDXL, ControlNet, DALL&middot;E).</li>
  <li><strong>CAD Agent.</strong> Either generates a new 3D mesh through generative modelling (DeepSDF, TripNet) or retrieves a close match from the DrivAerNet++ library of 8,000 vehicles.</li>
  <li><strong>Meshing + Simulation Agent.</strong> Generates CFD-quality meshes and either runs a simulation or predicts aerodynamic performance from a deep surrogate trained on DrivAerNet++.</li>
  <li><strong>Coordinator.</strong> An LLM-based orchestrator (AutoGen-mediated) that routes tasks, reconciles aesthetic vs. aerodynamic objectives, and decides when to iterate or finalize.</li>
</ol>

<h3 class="ed-h3">What the coordination buys</h3>
<p>The compression is the headline: conceptual-to-simulated design cycles that would historically take days or weeks collapse into minutes, because the simulation step is largely replaced by a surrogate and the CAD step is largely replaced by retrieval. The agents communicate through structured messages, and the coordinator decides when aerodynamic cost is worth paying for aesthetic gain. It is an early example of the agentic pattern operating over outputs that have to obey physical laws rather than unit tests.</p>

<p>Design Agents is also the paper where the other four come together: it retrieves from DrivAerNet++, could in principle call GenCAD for image-to-CAD, runs surrogates whose natural partner is OAT-style foundation modelling, and sits adjacent to the VideoCAD problem of how an agent might drive a CAD tool at all.</p>
</section>

<div class="divider">&sect; &sect; &sect;</div>

<section>
<div class="section-mark"><span class="section-num">VII</span><h2 class="section-title">What ties these together</h2></div>
<p>Read in sequence, the five papers describe a stack. At the bottom are data corpora &mdash; OpenTO for topologies, DrivAerNet++ for cars, VideoCAD for CAD interactions &mdash; that pay the up-front cost of making engineering AI trainable at all. Above them sit foundation models that generalize across problem specifications rather than memorizing fixed grids: OAT for structural layouts, GenCAD for parametric parts. Above those sits orchestration &mdash; Design Agents &mdash; that assembles specialized models into a pipeline an engineer can actually use. The through-line is a refusal to treat engineering artifacts as images. A topology is a continuous field. A part is a sequence of operations. A car is a simulation with ten modalities. Build representations that respect that, and the rest &mdash; speed, editability, composition &mdash; falls out.</p>
<ol class="findings-ed">
  <li><strong>The representation is half the paper.</strong> Neural fields, CAD command sequences, UI action streams &mdash; each swap out of the pixel grid unlocks something the grid hid.</li>
  <li><strong>Datasets are research.</strong> OpenTO, DrivAerNet++ and VideoCAD are contributions on their own terms, independent of the models trained on them.</li>
  <li><strong>Physics is not negotiable.</strong> Every output is run against a solver, a kernel, or a surrogate that was trained against one. The bar is not visual plausibility.</li>
  <li><strong>Agents are a wrapper, not a model.</strong> The hard work lives in the components; the coordinator is there because no single model does all of design.</li>
</ol>
</section>

<details class="expandable">
<summary>References</summary>
<ol class="reflist">
  <li id="ref-1"><span class="ref-authors">Ahmed, F.</span> <span class="ref-title">Design Computation and Digital Engineering (DeCoDE) Lab.</span> <span class="ref-venue">Massachusetts Institute of Technology, Department of Mechanical Engineering.</span> <a href="https://decode.mit.edu/" target="_blank" rel="noopener">decode.mit.edu</a></li>
  <li id="ref-2"><span class="ref-authors">Ahmed, F.</span> <span class="ref-title">Faculty profile &mdash; Associate Professor, MIT Mechanical Engineering.</span> <span class="ref-venue">MIT MechE.</span> <a href="https://meche.mit.edu/people/faculty/faez@MIT.EDU" target="_blank" rel="noopener">meche.mit.edu/people/faculty/faez@MIT.EDU</a></li>
  <li id="ref-3"><span class="ref-authors">Heyrani Nobari, A., Regenwetter, L., Picard, C., Han, L., &amp; Ahmed, F.</span> <span class="ref-title">Optimize Any Topology: A Foundation Model for Shape- and Resolution-Free Structural Topology Optimization.</span> <span class="ref-venue">Neural Information Processing Systems (NeurIPS), 2025.</span> <a href="https://arxiv.org/abs/2510.23667" target="_blank" rel="noopener">arXiv:2510.23667</a> &middot; <a href="https://neurips.cc/virtual/2025/loc/san-diego/poster/116944" target="_blank" rel="noopener">NeurIPS poster</a> &middot; <a href="https://github.com/ahnobari/OptimizeAnyTopology" target="_blank" rel="noopener">github.com/ahnobari/OptimizeAnyTopology</a></li>
  <li id="ref-4"><span class="ref-authors">Alam, M. F., &amp; Ahmed, F.</span> <span class="ref-title">GenCAD: Image-Conditioned Computer-Aided Design Generation with Transformer-Based Contrastive Representation and Diffusion Priors.</span> <span class="ref-venue">Transactions on Machine Learning Research (TMLR), 2025.</span> <a href="https://arxiv.org/abs/2409.16294" target="_blank" rel="noopener">arXiv:2409.16294</a> &middot; <a href="https://openreview.net/forum?id=e817c1wEZ6" target="_blank" rel="noopener">OpenReview</a> &middot; <a href="https://gencad.github.io/" target="_blank" rel="noopener">gencad.github.io</a></li>
  <li id="ref-5"><span class="ref-authors">Man, B., Nehme, G., Alam, M. F., &amp; Ahmed, F.</span> <span class="ref-title">VideoCAD: A Dataset and Model for Learning Long-Horizon 3D CAD UI Interactions from Video.</span> <span class="ref-venue">Neural Information Processing Systems (NeurIPS), 2025 &mdash; Datasets and Benchmarks Track.</span> <a href="https://arxiv.org/abs/2505.24838" target="_blank" rel="noopener">arXiv:2505.24838</a> &middot; <a href="https://neurips.cc/virtual/2025/loc/san-diego/poster/121820" target="_blank" rel="noopener">NeurIPS poster</a> &middot; <a href="https://ghadinehme.github.io/videocad.github.io/" target="_blank" rel="noopener">project page</a> &middot; <a href="https://github.com/ghadinehme/VideoCAD" target="_blank" rel="noopener">github.com/ghadinehme/VideoCAD</a></li>
  <li id="ref-6"><span class="ref-authors">Elrefaie, M., Morar, F., Dai, A., &amp; Ahmed, F.</span> <span class="ref-title">DrivAerNet++: A Large-Scale Multimodal Car Dataset with Computational Fluid Dynamics Simulations and Deep Learning Benchmarks.</span> <span class="ref-venue">Neural Information Processing Systems (NeurIPS), 2024 &mdash; Datasets and Benchmarks Track.</span> <a href="https://arxiv.org/abs/2406.09624" target="_blank" rel="noopener">arXiv:2406.09624</a> &middot; <a href="https://proceedings.neurips.cc/paper_files/paper/2024/hash/013cf29a9e68e4411d0593040a8a1eb3-Abstract-Datasets_and_Benchmarks_Track.html" target="_blank" rel="noopener">NeurIPS proceedings</a> &middot; <a href="https://github.com/Mohamedelrefaie/DrivAerNet" target="_blank" rel="noopener">github.com/Mohamedelrefaie/DrivAerNet</a></li>
  <li id="ref-7"><span class="ref-authors">Elrefaie, M., Qian, J., Wu, R., Chen, Q., Dai, A., &amp; Ahmed, F.</span> <span class="ref-title">AI Agents in Engineering Design: A Multi-Agent Framework for Aesthetic and Aerodynamic Car Design.</span> <span class="ref-venue">ASME International Design Engineering Technical Conferences (IDETC-CIE), 2025.</span> <a href="https://arxiv.org/abs/2503.23315" target="_blank" rel="noopener">arXiv:2503.23315</a> &middot; <a href="https://asmedigitalcollection.asme.org/IDETC-CIE/proceedings/IDETC-CIE2025/89237/V03BT03A048/1226007" target="_blank" rel="noopener">ASME Digital Collection</a></li>
  <li id="ref-8"><span class="ref-authors">Elrefaie, M. et&nbsp;al.</span> <span class="ref-title">DrivAerNet++ dataset repository.</span> <span class="ref-venue">Harvard Dataverse.</span> <a href="https://dataverse.harvard.edu/dataverse/DrivAerNet" target="_blank" rel="noopener">dataverse.harvard.edu/dataverse/DrivAerNet</a></li>
</ol>
</details>

</div>
</div>

`,
  });
}

// ─── Server ───
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log("http://localhost:" + PORT));
}
module.exports = app;
