const express = require('express');
const path = require('path');
const app = express();

app.use('/slides', express.static(path.join(__dirname, 'public', 'slides')));
app.use('/figures', express.static(path.join(__dirname, 'public', 'figures')));

// ─── Routes ───
app.get('/', (req, res) => res.send(buildLanding()));
app.get('/mccomb', (req, res) => res.send(buildMcComb()));
app.get('/horwitz', (req, res) => res.send(buildHorwitz()));
app.get('/ahmed', (req, res) => res.send(buildAhmed()));
app.get('/sandbox', (req, res) => res.send(buildSandbox()));

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
.theme-toggle { position:fixed; top:1rem; right:1rem; z-index:100; background:var(--bg-card); border:1px solid var(--border); border-radius:50%; width:40px; height:40px; display:flex; align-items:center; justify-content:center; cursor:pointer; font-size:1.1rem; box-shadow:var(--shadow); transition:transform 0.2s; }
.theme-toggle:hover { transform:scale(1.1); }
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
@media(max-width:600px) { .slide-pair{grid-template-columns:1fr} .hero{padding:3rem 1rem 2rem} .container{padding:1.5rem 1rem 3rem} h2{font-size:1.3rem} .flow-diagram{flex-direction:column} .flow-arrow{transform:rotate(90deg)} }
`;
}

// ─── Shared JS ───
function getSharedJS() {
return `
function toggleTheme(){var h=document.documentElement,n=h.getAttribute('data-theme')==='dark'?'light':'dark';h.setAttribute('data-theme',n);document.getElementById('themeIcon').textContent=n==='dark'?'\\u2600\\uFE0F':'\\uD83C\\uDF19';localStorage.setItem('theme',n)}
(function(){var s=localStorage.getItem('theme');if(s){document.documentElement.setAttribute('data-theme',s);document.getElementById('themeIcon').textContent=s==='dark'?'\\u2600\\uFE0F':'\\uD83C\\uDF19'}})();
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
<style>${getSharedCSS()}</style>
</head>
<body>
<button class="theme-toggle" onclick="toggleTheme()" aria-label="Toggle dark mode"><span id="themeIcon">\uD83C\uDF19</span></button>
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
return pageWrapper({ title: 'Research Hub', icon: '\uD83D\uDD2C', body: `
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
`});
}

// ═══════════════════════════════════════════════════
// McCOMB PAGE
// ═══════════════════════════════════════════════════
function buildMcComb() {
return pageWrapper({ title: 'McComb: AI & the Soul of Design', icon: '\uD83E\uDDE0', body: `
<div class="hero">
  <h1>AI & the Battle for the Soul of Design</h1>
  <p class="subtitle">A synthesis of two talks by Chris McComb, Carnegie Mellon University</p>
  <div class="meta"><span>Design Research Collective</span><span>Human-AI Design Initiative</span><span>2024&ndash;2025</span></div>
</div>
<nav class="nav"><div class="nav-inner">
  <button class="nav-tab active" onclick="showSection('overview',this)">Overview</button>
  <button class="nav-tab" onclick="showSection('talk1',this)">Talk 1: CDFAM</button>
  <button class="nav-tab" onclick="showSection('talk2',this)">Talk 2: Full</button>
  <button class="nav-tab" onclick="showSection('comparison',this)">Comparison</button>
  <button class="nav-tab" onclick="showSection('futures',this)">Futures</button>
</div></nav>
<div class="container">
<a href="/" class="back-link">&larr; Research Hub</a>

<!-- ===== OVERVIEW ===== -->
<div class="section active" id="sec-overview">
<h2>What This Is</h2>
<p>This page synthesizes two versions of Chris McComb's talk <strong>"AI and the Battle for the Soul of Design"</strong> &mdash; a compact 19-minute keynote at CDFAM NYC 2025 and a comprehensive 50-minute lecture covering his lab's full research portfolio. Both explore how AI is transforming engineering design and what role humans will play in a world where machines can optimize, generate, and even coach.</p>
<p>McComb directs the <strong>Design Research Collective</strong> and the <strong>Human-AI Design Initiative</strong> at Carnegie Mellon. His work sits at an unusual intersection: he combines rigorous psychological science (empathy studies, cognitive style theory, collective intelligence) with cutting-edge AI methods (variational autoencoders, reinforcement learning, LLM-based coaching). The result is a research program that treats human-AI teaming not as a technology problem but as a <strong>sociotechnical design challenge</strong> &mdash; one where understanding human cognition is just as important as building better algorithms.</p>

<div class="tags">
  <span class="tag">Human-AI Teaming</span><span class="tag">Engineering Design</span><span class="tag">Cognitive Science</span><span class="tag">Generative AI</span><span class="tag">Lattice Structures</span><span class="tag">Collective Intelligence</span><span class="tag">Carnegie Mellon</span>
</div>

<h3>The Two Talks at a Glance</h3>
<div class="slide-pair">
  <div class="slide-fig"><img src="/slides/v1/v1_0005s.png" alt="Talk 1 title" onclick="openLightbox(this)"><div class="caption"><strong>Talk 1</strong> &mdash; CDFAM NYC 2025 (19 min). Conceptual overview: human biases, economic stakes, potential futures.</div></div>
  <div class="slide-fig"><img src="/slides/v2/v2_0005s.png" alt="Talk 2 title" onclick="openLightbox(this)"><div class="caption"><strong>Talk 2</strong> &mdash; Full lecture (~50 min). Research deep dive: empathy, cognitive style, lattice optimization, teaming experiments, LLMs.</div></div>
</div>

<h3>McComb's Central Thesis</h3>
<p>The argument threading both talks is deceptively simple but has deep implications: <strong>AI is changing exponentially, but humans are not.</strong> Our cognitive architecture &mdash; how we satisfice, how we copy neighbors, how we freeze under too many options &mdash; has been stable for millennia. McComb argues that this stability is not a limitation but a <em>predictive asset</em>. If we understand human nature well enough, we can anticipate how designers will actually use (and misuse) AI, and we can design human-AI workflows that play to human strengths rather than against them.</p>
<p>This is a fundamentally different framing from the dominant tech narrative, which asks "how capable is the AI?" McComb asks instead: <strong>"Given what we know about human psychology, what will people actually do with these capabilities?"</strong> The answer, his research suggests, is both more nuanced and more predictable than most assume.</p>

<h3>Key Takeaways</h3>
<ul class="findings">
  <li><strong>The Human-AI Teaming Matrix</strong> organizes AI's role along two axes: Reactive vs. Proactive, and Problem-Focused vs. Process-Focused. This yields four distinct modes (Tool, Partner, Analytics, Coach) with different implications for human agency.</li>
  <li><strong>Technology changes exponentially; humans do not.</strong> Our stable psychology gives us predictive power over how AI adoption will unfold &mdash; and it means cognitive biases will persist no matter how good the tools get.</li>
  <li><strong>Five cognitive biases</strong> will shape human-AI design interaction: satisficing, automation bias, additive bias, herding behavior, and choice overload. These aren't bugs to fix &mdash; they're stable features of human cognition that AI system designers must account for.</li>
  <li><strong>Individual traits don't predict team outcomes</strong> &mdash; but team-level composition does. Empathy diversity and cognitive style matching matter more than individual talent, and computational simulation can reveal optimal compositions that human-subjects studies alone cannot.</li>
  <li><strong>Hybrid teams perform as well as all-human teams</strong> in controlled experiments, and AI coaches intervene with similar patterns to human coaches. AI integration doesn't degrade team performance &mdash; but it doesn't automatically improve it either.</li>
  <li><strong>The "soul of design"</strong> is the parts that are most distinctly human: empathetic judgment, collaborative sense-making, meaning-creation, and the intrinsic satisfaction of creative work.</li>
</ul>
</div>

<!-- ===== TALK 1 ===== -->
<div class="section" id="sec-talk1">
<h2>Talk 1: CDFAM NYC 2025 (19 min)</h2>
<p>The shorter talk is a keynote for an industry audience at the CDFAM (Computational Design for AI-Driven Materials) symposium. It's structured as a conceptual argument rather than a research presentation &mdash; McComb is making a case for <em>how to think about</em> AI in design, not presenting specific experiments. The talk builds in three acts: the economic stakes, the human constants, and the possible futures.</p>

<div class="toc"><h4>Sections</h4><ul>
  <li><a href="#t1-framework">The Human-AI Teaming Framework</a></li>
  <li><a href="#t1-stack">The AI Infrastructure Stack</a></li>
  <li><a href="#t1-stakes">Economic Stakes</a></li>
  <li><a href="#t1-human">The Human Constant</a></li>
  <li><a href="#t1-biases">Five Cognitive Biases</a></li>
  <li><a href="#t1-futures">Seven Potential Futures</a></li>
</ul></div>

<h3 id="t1-framework">The Human-AI Teaming Framework</h3>
<p>McComb opens with his core conceptual tool: a 2&times;2 matrix that classifies AI's role in design teams (published as McComb, Boatwright & Cagan, <em>Proceedings of the Design Society</em>, 2023). The axes are <strong>Reactive vs. Proactive</strong> (does the AI wait to be asked, or does it initiate?) and <strong>Problem-Focused vs. Process-Focused</strong> (does the AI work on the design artifact, or on the design process itself?).</p>
<div class="slide-fig"><img src="/slides/v1/v1_0105s.png" alt="Teaming Matrix" onclick="openLightbox(this)"><div class="caption">The Human-AI Teaming Matrix. Four quadrants: AI-as-Tool (reactive/problem), AI-as-Partner (proactive/problem), AI-as-Analytics (reactive/process), AI-as-Coach (proactive/process).</div></div>
<p>The matrix's value is diagnostic: it forces you to ask <em>which</em> kind of AI integration you're pursuing. Most current tools operate in the <strong>AI-as-Tool</strong> quadrant (reactive, problem-focused) &mdash; think CAD solvers or simulation software. The most transformative and least explored quadrant is <strong>AI-as-Coach</strong> (proactive, process-focused), where AI monitors how a team is working and intervenes to improve the process itself. McComb's later research explicitly targets this quadrant.</p>

<h3 id="t1-stack">The AI Infrastructure Stack</h3>
<p>McComb uses a McKinsey-sourced pyramid diagram to make an organizational readiness argument: AI value sits at the top of a stack that starts with data infrastructure. Organizations that jump to AI without the lower layers in place will fail.</p>
<div class="slide-fig"><img src="/slides/v1/v1_0295s.png" alt="AI Stack" onclick="openLightbox(this)"><div class="caption">The AI infrastructure pyramid. Bottom to top: data generation and logging, infrastructure and storage, cleaning and preparation, analytics, machine learning, AI. Each layer requires the one below it.</div></div>
<p>The accompanying questions &mdash; "What are our initial conditions?", "What do we know about the dynamics?", "What outcomes are we likely to achieve?" &mdash; frame AI adoption as a systems problem. This is a subtly important point: McComb is arguing that the AI capability frontier is less binding than the <em>organizational</em> readiness to use AI. The bottleneck isn't the algorithm; it's whether your data infrastructure can support it.</p>

<h3 id="t1-stakes">Economic Stakes of AI</h3>
<p>McComb grounds the conceptual argument in hard numbers. The economic framing serves two purposes: it establishes urgency (this isn't hypothetical) and it reveals geographic inequality (the benefits are concentrated).</p>
<div class="slide-fig"><img src="/slides/v1/v1_0345s.png" alt="GDP Impact" onclick="openLightbox(this)"><div class="caption">PwC projection: AI could contribute ~$15 trillion to global GDP by 2030. The dominant driver is labor productivity, followed by personalization, time savings, and quality improvements.</div></div>
<div class="slide-pair">
  <div class="slide-fig"><img src="/slides/v1/v1_0365s.png" alt="Geographic impact" onclick="openLightbox(this)"><div class="caption">GDP impact concentrated in North America and China &mdash; raising questions about who benefits from AI-driven design.</div></div>
  <div class="slide-fig"><img src="/slides/v1/v1_0405s.png" alt="Education impact" onclick="openLightbox(this)"><div class="caption">McKinsey: AI could free 20-30% of teacher time from administration and routine tasks, reallocating it toward coaching and skill development.</div></div>
</div>
<p>The education slide is particularly telling: it shows AI not just changing <em>what</em> we design but <em>how we learn to design</em>. If AI handles routine feedback and evaluation, educators can focus on the higher-order skills &mdash; coaching, mentorship, emotional development &mdash; that machines can't easily replicate. This theme returns later in Talk 2's "LLMs as tutees" finding.</p>

<h3 id="t1-human">The Human Constant</h3>
<p>This is the philosophical pivot of the talk, and McComb's most distinctive intellectual move. He juxtaposes two timelines: the exponential curve of technological change and the near-flat line of human biological change.</p>
<div class="slide-pair">
  <div class="slide-fig"><img src="/slides/v1/v1_0565s.png" alt="Tech timeline" onclick="openLightbox(this)"><div class="caption">"Technology changes really, really fast." Exponential curve from 1800 to the present, with "Now" marked at the steep upswing.</div></div>
  <div class="slide-fig"><img src="/slides/v1/v1_0605s.png" alt="Human height" onclick="openLightbox(this)"><div class="caption">"People change relatively slowly." Average male height by decade of birth, 1800-1990, across six countries. Modest changes over 190 years.</div></div>
</div>
<div class="callout"><div class="label">Key Insight</div><p>The juxtaposition is the argument: even as AI capabilities explode on an exponential curve, the humans using those tools are essentially the same creatures they were centuries ago. Our cognitive biases, social tendencies, and psychological limitations are stable over timescales that make technology curves look vertical. McComb argues this stability is a <em>feature</em>, not a bug &mdash; it gives us predictive power. If we understand human nature, we can anticipate how people will actually interact with AI in design.</p></div>

<h3 id="t1-biases">Five Cognitive Biases Shaping AI Adoption</h3>
<p>McComb's most original contribution in this talk. He enumerates five ways human nature will constrain and color how designers use AI, drawing on established behavioral science. Each bias is not just described but given an <em>implication for AI-assisted design</em>.</p>

<h4>1. We satisfice readily (Herbert Simon, 1956)</h4>
<div class="slide-fig"><img src="/slides/v1/v1_0665s.png" alt="Satisficing" onclick="openLightbox(this)"><div class="caption">Value vs. Effort curve: humans stop at "Good Enough" rather than pursuing the theoretical optimum. The gap between good-enough and perfect is where effort explodes.</div></div>
<p>The implication for AI: designers will accept AI outputs that clear the "good enough" bar, even when the AI could produce substantially better results with more iteration. This means the <strong>default quality of AI suggestions matters enormously</strong> &mdash; because most users won't push past the first acceptable output. AI tools that front-load quality will outperform those that require user refinement, regardless of their theoretical ceiling.</p>

<h4>2. We favor automation (automation bias)</h4>
<div class="slide-fig"><img src="/slides/v1/v1_0695s.png" alt="Automation bias" onclick="openLightbox(this)"><div class="caption">When AI is available, people default to using it &mdash; even when their own judgment would produce better results.</div></div>
<p>This is well-documented in aviation and healthcare: when automated systems are present, humans defer to them even in situations where the automation is wrong or inappropriate. In design, this means teams with AI access may <strong>underuse their own expertise</strong>, defaulting to AI suggestions for problems where human intuition, context, or aesthetic judgment would be superior. The risk isn't that AI is bad &mdash; it's that humans stop exercising the judgment muscles that AI can't replace.</p>

<h4>3. We neglect subtractive changes (additive bias)</h4>
<div class="slide-fig"><img src="/slides/v1/v1_0745s.png" alt="Additive bias" onclick="openLightbox(this)"><div class="caption">Both humans and AI tend to add features rather than remove them. Shown: a Lego construction and architectural blueprint illustrating additive complexity.</div></div>
<p>Research by Adams et al. (2021, <em>Nature</em>) showed that when people improve objects, ideas, or situations, they systematically default to adding new elements rather than removing existing ones &mdash; even when subtraction is objectively better. McComb argues AI will <strong>amplify this bias</strong>: generative AI is inherently additive (it generates <em>more</em> options, <em>more</em> features, <em>more</em> complexity). Designers already struggle to simplify; AI-assisted design may produce ever-more-complex artifacts unless subtractive thinking is explicitly built into the workflow.</p>

<h4>4. We copy early movers irrationally (herding)</h4>
<div class="slide-fig"><img src="/slides/v1/v1_0875s.png" alt="Herding" onclick="openLightbox(this)"><div class="caption">Penguins following each other off an ice shelf. Early adopters of AI in design will be copied regardless of whether their approach is optimal.</div></div>
<p>This is an information-cascade argument: once a few prominent firms or designers adopt a particular AI workflow, others will follow not because they've independently evaluated it but because they assume the early movers know something they don't. The result is <strong>path dependency</strong> &mdash; the field could lock into suboptimal AI integration patterns simply because they were adopted first. McComb is implicitly arguing that the current moment is critical: the design community's AI adoption patterns are being set <em>right now</em>, and herding effects mean those early patterns will be very hard to change later.</p>

<h4>5. We suffer from choice overload (Hick's Law)</h4>
<div class="slide-fig"><img src="/slides/v1/v1_0895s.png" alt="Choice overload" onclick="openLightbox(this)"><div class="caption">A dense grid of drone/aerial vehicle configurations from the AeroSet dataset. AI dramatically expands the design space, but more options can mean worse decisions.</div></div>
<p>Generative AI can produce thousands of design candidates in minutes. But Hick's Law tells us that decision time increases logarithmically with the number of options, and psychological research on choice overload (Iyengar & Lepper, 2000) shows that too many options can lead to decision paralysis, lower satisfaction, and worse outcomes. McComb's point: <strong>the ability to generate more options is only valuable if designers can effectively navigate and evaluate them.</strong> Without better curation, filtering, and evaluation tools, AI-generated abundance becomes a liability, not an asset.</p>

<h3 id="t1-futures">Seven Potential Futures</h3>
<p>McComb closes with a spectrum of possible futures, ordered from catastrophic to humanistic. The structure is deliberate &mdash; he's guiding the audience from the scenarios they fear to the ones he believes are worth pursuing.</p>
<div class="slide-pair">
  <div class="slide-fig"><img src="/slides/v1/v1_0935s.png" alt="Future 1" onclick="openLightbox(this)"><div class="caption"><strong>Future 1:</strong> p(doom) &rarr; 1. Humankind goes extinct. The existential risk boundary condition.</div></div>
  <div class="slide-fig"><img src="/slides/v1/v1_0965s.png" alt="Future 2" onclick="openLightbox(this)"><div class="caption"><strong>Future 2:</strong> p(doom) &rarr; 0. We shut off the machines. Neo-Luddite rejection.</div></div>
</div>
<div class="slide-fig"><img src="/slides/v1/v1_0985s.png" alt="Future 3" onclick="openLightbox(this)"><div class="caption"><strong>Future 3:</strong> Cyborgs. Human-machine integration &mdash; McComb notes we're already partway there with smartphones and the internet.</div></div>
<div class="slide-pair">
  <div class="slide-fig"><img src="/slides/v1/v1_1005s.png" alt="Future 4" onclick="openLightbox(this)"><div class="caption"><strong>Future 4:</strong> Humans do the physical parts of design. AI handles cognition; humans become fabricators.</div></div>
  <div class="slide-fig"><img src="/slides/v1/v1_1035s.png" alt="Future 5" onclick="openLightbox(this)"><div class="caption"><strong>Future 5:</strong> Humans do the early stages. Problem framing and concept generation remain human; AI handles execution.</div></div>
</div>
<div class="slide-pair">
  <div class="slide-fig"><img src="/slides/v1/v1_1065s.png" alt="Future 6" onclick="openLightbox(this)"><div class="caption"><strong>Future 6:</strong> Humans do the parts of design we enjoy most. Value-aligned labor division.</div></div>
  <div class="slide-fig"><img src="/slides/v1/v1_1095s.png" alt="Future 7" onclick="openLightbox(this)"><div class="caption"><strong>Future 7:</strong> Humans do the most human parts of design. Empathy, meaning-making, collaborative judgment.</div></div>
</div>
<div class="callout"><div class="label">McComb's Implied Preference</div><p>The progression is deliberate. Futures 6 and 7 represent McComb's research vision: a world where AI handles the computationally intensive parts of design while humans retain what is most intrinsically meaningful &mdash; creative ideation, empathetic judgment, and the satisfaction of making things that matter. His entire research program (empathy studies, cognitive style, AI coaching) is oriented toward enabling these futures.</p></div>
</div>

<!-- ===== TALK 2 ===== -->
<div class="section" id="sec-talk2">
<h2>Talk 2: Full Lecture (~50 min)</h2>
<p>The longer talk shares the same title and opening but diverges into deep research content. Where Talk 1 argues from psychology and economics, Talk 2 presents <strong>empirical evidence</strong> spanning five distinct research threads. McComb structures the talk around a three-stage progression: understanding human designers, building AI-assisted tools, and achieving genuine human-AI collaboration.</p>

<div class="toc"><h4>Sections</h4><ul>
  <li><a href="#t2-progression">The Research Progression</a></li>
  <li><a href="#t2-empathy">Empathy in Design Teams</a></li>
  <li><a href="#t2-cognitive">Cognitive Style & Team Composition</a></li>
  <li><a href="#t2-lattice">AI-Assisted Design: Lattices & Optimization</a></li>
  <li><a href="#t2-teaming">Human-AI Teaming Experiments</a></li>
  <li><a href="#t2-collective">Collective Intelligence & LLMs</a></li>
</ul></div>

<h3 id="t2-progression">The Research Progression</h3>
<div class="slide-fig"><img src="/slides/v2/v2_0365s.png" alt="Progression" onclick="openLightbox(this)"><div class="caption">McComb's three-stage research arc: Human Designers &rarr; AI-Assisted Engineering Design &rarr; Human-AI Collaboration. Each stage builds on the insights of the previous one.</div></div>
<p>This structure is important epistemically: McComb is arguing that you can't build effective human-AI design tools without first understanding human designers on their own terms. The psychology comes <em>before</em> the engineering, not after. This is unusual in an engineering lab &mdash; most AI-for-design research starts with the algorithm and bolts on user studies later.</p>

<h3 id="t2-empathy">Empathy in Design Teams</h3>
<p>McComb presents a longitudinal study using Davis's (1980) multidimensional model of empathy, which distinguishes four components: Personal Distress and Empathic Concern (affective), Fantasy and Perspective-Taking (cognitive), each oriented toward self or others.</p>
<div class="slide-fig"><img src="/slides/v2/v2_0545s.png" alt="Empathy model" onclick="openLightbox(this)"><div class="caption">Davis (1980): Four components of empathy on two axes. Affective vs. Cognitive, Self-Oriented vs. Other-Oriented.</div></div>

<h4>The Reversal: Individual vs. Team</h4>
<p>The first finding is a null result &mdash; and in science, null results that challenge assumptions are often the most important:</p>
<div class="slide-fig"><img src="/slides/v2/v2_0705s.png" alt="Individual null" onclick="openLightbox(this)"><div class="caption">Individual-level trait empathy does NOT predict concept generation outcomes. No significant relationship to creativity, usefulness, uniqueness, or elegance. (Alzyeed et al., JMD 2021)</div></div>
<p>This is counterintuitive &mdash; design education often emphasizes empathy as a core skill. But McComb's group found that an individual's empathy score tells you nothing about the quality of their design concepts. The story changes dramatically, however, when you look at teams.</p>
<p>Using computational recombination &mdash; agent-based modeling that simulates how individuals would perform in different team compositions &mdash; they discovered the reversal:</p>
<div class="slide-fig"><img src="/slides/v2/v2_0775s.png" alt="Team empathy" onclick="openLightbox(this)"><div class="caption">At the team level, empathy diversity and elevation DO significantly predict creative outcomes. The effect is invisible at the individual level. (Alzyeed et al., AI EDAMI 2023)</div></div>
<div class="callout"><div class="label">Why This Matters</div><p>The reversal has two implications. First, <strong>design is fundamentally a team activity</strong> &mdash; psychological constructs must be studied at the level they actually operate. Individual empathy doesn't help; team empathy composition does. Second, <strong>computational simulation can reveal effects that purely human-subjects studies miss</strong>. You can't randomly assign 200 teams of 5 people to different empathy compositions, but you can simulate it. This is a methodological argument for multi-method research that combines human data with agent-based modeling.</p></div>

<h3 id="t2-cognitive">Cognitive Style & Team Composition</h3>
<p>The second human-focused thread uses Kirton's Adaption-Innovation (KAI) theory, which places individuals on a spectrum from "More Adaptive" (prefer structure, doing things better within existing paradigms) to "More Innovative" (prefer less structure, doing things differently).</p>
<div class="slide-pair">
  <div class="slide-fig"><img src="/slides/v2/v2_0945s.png" alt="KAI curve" onclick="openLightbox(this)"><div class="caption">KAI distribution: a bell curve from Adaptive to Innovative. Population mean ~95, range ~32-160. This is cognitive <em>style</em>, not ability.</div></div>
  <div class="slide-fig"><img src="/slides/v2/v2_1175s.png" alt="Formula SAE" onclick="openLightbox(this)"><div class="caption">The Formula SAE system model &mdash; a complex engineered system with many interdependent subsystems used to test the KABOOM agent-based model.</div></div>
</div>
<div class="slide-fig"><img src="/slides/v2/v2_1255s.png" alt="KABOOM results" onclick="openLightbox(this)"><div class="caption">KABOOM results: the optimal cognitive style depends on the subsystem. Rear suspension, engine, and impact attenuator each perform best with different cognitive style profiles.</div></div>
<p>The finding is directly actionable for engineering organizations: <strong>there is no universally optimal cognitive style for design teams.</strong> The right composition depends on the specific subsystem and problem type. Adaptive thinkers excel at well-structured optimization problems; innovative thinkers excel at open-ended, ambiguous challenges. And AI simulation (KABOOM) can identify the optimal match before you assemble a real team.</p>

<div class="slide-fig"><img src="/slides/v2/v2_1385s.png" alt="FBS ontology" onclick="openLightbox(this)"><div class="caption">Function-Behavior-Structure (FBS) ontology (Gero & Kannengiesser, 2014): a formal framework for analyzing design processes as transformations between Requirements, Function, expected Behavior, actual Behavior, and Structure.</div></div>

<h3 id="t2-lattice">AI-Assisted Design: Lattices & Optimization</h3>
<p>The middle section of the talk shifts from human psychology to AI capabilities. McComb presents his lab's work on lattice structure design &mdash; an important problem in additive manufacturing where the geometry of internal lattice patterns determines the mechanical properties (stiffness, impact absorption, weight) of 3D-printed parts.</p>
<div class="slide-pair">
  <div class="slide-fig"><img src="/slides/v2/v2_1515s.png" alt="Lattice types" onclick="openLightbox(this)"><div class="caption">Three lattice structure types: Uniform, Graded, and Graded Stranded. Energy absorption characteristics vary dramatically with geometry.</div></div>
  <div class="slide-fig"><img src="/slides/v2/v2_1535s.png" alt="Multi-lattice" onclick="openLightbox(this)"><div class="caption">Multi-lattice design freedom: more diverse mechanical properties, better stiffness, ability to withstand higher loads.</div></div>
</div>

<h4>Variational Autoencoders for Lattice Design</h4>
<div class="slide-fig"><img src="/slides/v2/v2_1585s.png" alt="VAE" onclick="openLightbox(this)"><div class="caption">Variational Autoencoder architecture: Input &rarr; Encoder &rarr; Compressed Latent Representation &rarr; Decoder &rarr; Output.</div></div>
<p>McComb's group uses VAEs to learn a continuous latent space over lattice geometries. This is powerful because it transforms a discrete, combinatorial design space into a smooth, continuous one that can be navigated with gradient-based optimization.</p>
<div class="slide-pair">
  <div class="slide-fig"><img src="/slides/v2/v2_1645s.png" alt="Interpolation" onclick="openLightbox(this)"><div class="caption">Interpolating in latent space generates aesthetically smooth transitions between lattice structures &mdash; navigating the design space by moving through learned representations.</div></div>
  <div class="slide-fig"><img src="/slides/v2/v2_1675s.png" alt="Property-augmented" onclick="openLightbox(this)"><div class="caption">"Smooth Like Butter": Appending stiffness tensors to the geometry embedding creates a property-aware latent space. (Baldwen et al., 3D Printing and AM, 2025)</div></div>
</div>
<div class="slide-fig"><img src="/slides/v2/v2_1715s.png" alt="Topology opt" onclick="openLightbox(this)"><div class="caption">Multi-lattice topology optimization using the learned embeddings. The workflow integrates compliance analysis, finite element methods, and lattice decoding.</div></div>

<h4>Reinforcement Learning for Design</h4>
<div class="slide-fig"><img src="/slides/v2/v2_1805s.png" alt="RL" onclick="openLightbox(this)"><div class="caption">RL agents find high-performance design solutions at dramatically reduced computational cost. R&sup2; = 0.911 for the performance-time trade-off curve. (Agrawal & McComb, JCISE 2023)</div></div>
<p>The RL result is practically significant: it means AI can <strong>explore large design spaces cheaply enough to be useful in real engineering workflows</strong>, not just in academic benchmarks. The computational cost reduction makes AI-assisted lattice design viable for production settings.</p>

<h3 id="t2-teaming">Human-AI Teaming Experiments</h3>
<p>The final and most substantial section presents controlled experiments on human-AI collaboration using HyForm, an instrumented platform that captures every design action, chat message, and decision made by team members.</p>
<div class="slide-fig"><img src="/slides/v2/v2_1825s.png" alt="Matrix revisited" onclick="openLightbox(this)"><div class="caption">The Human-AI Teaming Matrix revisited in the context of experimental results.</div></div>

<h4>Hybrid vs. Human Teams</h4>
<div class="slide-pair">
  <div class="slide-fig"><img src="/slides/v2/v2_2055s.png" alt="Team structure" onclick="openLightbox(this)"><div class="caption">Experimental team structure with Design Specialists, Operations Specialists, and Problem Manager, with controlled communication channels.</div></div>
  <div class="slide-fig"><img src="/slides/v2/v2_2165s.png" alt="Results" onclick="openLightbox(this)"><div class="caption">Hybrid and human teams perform equally well. Box plots show no statistically significant difference in team profit (Wilcoxon p = 0.32, 0.88). (Xu, Zhang et al., JMD 2024)</div></div>
</div>
<p>The null result here is important: <strong>adding an AI team member neither improved nor degraded team performance.</strong> This is a more nuanced finding than the headlines suggest. It means AI integration in design teams is viable (it doesn't break things), but it also means the value of AI in teaming contexts depends on <em>how</em> it's integrated, not just <em>whether</em> it's present. The shocks (sudden rule changes mid-experiment) revealed that teams adapt similarly regardless of human or hybrid composition.</p>

<h4>AI-as-Coach</h4>
<div class="slide-pair">
  <div class="slide-fig"><img src="/slides/v2/v2_2375s.png" alt="AI coach" onclick="openLightbox(this)"><div class="caption">AI coaching experiment: an AI process manager monitors team dynamics and intervenes to improve collaboration.</div></div>
  <div class="slide-fig"><img src="/slides/v2/v2_2495s.png" alt="Intervention types" onclick="openLightbox(this)"><div class="caption">Human and AI coaches show similar distributions across intervention types: Advise, Inform, Coordinate, Communicate. (Gyory, Soria Zurita et al., JMD 2022)</div></div>
</div>
<p>This is the AI-as-Coach quadrant of the teaming matrix in action. The finding that AI coaches <strong>naturally converge on similar intervention patterns</strong> to human coaches is striking &mdash; it suggests that effective process management in design may follow relatively universal patterns that AI can learn, regardless of whether it was explicitly programmed to mimic human coaching behavior.</p>

<h3 id="t2-collective">Collective Intelligence & LLMs</h3>
<div class="slide-pair">
  <div class="slide-fig"><img src="/slides/v2/v2_2535s.png" alt="CI regression" onclick="openLightbox(this)"><div class="caption">Quantifying collective intelligence: regression coefficients for Process, Skill, Group Size, Social Perceptions, and Composition. (Riedl et al., PNAS 2021)</div></div>
  <div class="slide-fig"><img src="/slides/v2/v2_2645s.png" alt="CI constructs" onclick="openLightbox(this)"><div class="caption">Three key constructs for collective intelligence: Social Sensitivity, Coordinated Attention, Equal Participation.</div></div>
</div>
<p>McComb grounds his AI facilitation work in collective intelligence theory rather than task-specific training data. The three constructs &mdash; Social Sensitivity, Coordinated Attention, Equal Participation &mdash; provide a <strong>domain-general framework</strong> for AI coaching. This matters because it means the AI coach can generalize to novel design problems it has never seen, rather than being limited to problems similar to its training set.</p>

<h4>LLMs as Tutees, Not Tutors</h4>
<div class="slide-fig"><img src="/slides/v2/v2_2745s.png" alt="LLMs tutees" onclick="openLightbox(this)"><div class="caption">LLMs as tutees boost student mastery. Students who taught the LLM scored significantly higher on concept inventories than the control group.</div></div>
<div class="callout"><div class="label">Counterintuitive Result</div><p>The dominant framing for LLMs in education is "AI as tutor" &mdash; the AI teaches the student. McComb's group flipped this: they had students <strong>teach the LLM</strong>. The "learning by teaching" effect &mdash; well-documented in human education &mdash; transferred to AI interactions. Students who explained concepts to the LLM understood the material better than those in the control condition. This suggests the most valuable educational use of LLMs may be the opposite of what most people assume.</p></div>
</div>

<!-- ===== COMPARISON ===== -->
<div class="section" id="sec-comparison">
<h2>Comparison: Two Versions, One Vision</h2>
<p>The two talks share a title and core thesis but serve different purposes and audiences. Understanding their differences reveals how McComb adapts a complex research program for different contexts.</p>

<div style="overflow-x:auto">
<table class="result-table">
<tr style="border-bottom:2px solid var(--border)"><th></th><th style="color:var(--accent)">Talk 1: CDFAM (19 min)</th><th style="color:var(--accent)">Talk 2: Full (50 min)</th></tr>
<tr><td><strong>Audience</strong></td><td>Industry practitioners</td><td>Academic/research</td></tr>
<tr><td><strong>Epistemic mode</strong></td><td>Argument from theory &amp; analogy</td><td>Argument from empirical evidence</td></tr>
<tr><td><strong>Focus</strong></td><td>Cognitive biases, economic stakes, futures</td><td>Lab research: empathy, KAI, VAEs, teaming</td></tr>
<tr><td><strong>Technical depth</strong></td><td>Low &mdash; conceptual framing</td><td>High &mdash; architectures, statistics, equations</td></tr>
<tr><td><strong>Human biases</strong></td><td>5 biases (core section)</td><td>Not present</td></tr>
<tr><td><strong>Empathy research</strong></td><td>Not covered</td><td>Deep dive: individual vs. team reversal</td></tr>
<tr><td><strong>Lattice/VAE work</strong></td><td>Not covered</td><td>Full: VAEs, latent interpolation, topology opt.</td></tr>
<tr><td><strong>Teaming experiments</strong></td><td>Matrix framework only</td><td>HyForm, hybrid teams, AI coaching</td></tr>
<tr><td><strong>Potential futures</strong></td><td>7 futures (incl. cyborgs)</td><td>6 futures (slightly compressed)</td></tr>
</table>
</div>

<h3>What Talk 1 Has That Talk 2 Doesn't</h3>
<div class="callout"><div class="label">Unique to Talk 1</div><p>The <strong>five cognitive biases</strong> section is the intellectual core of Talk 1 and does not appear in Talk 2. McComb also includes the <strong>"technology vs. humans" speed juxtaposition</strong> with Our World in Data charts, and the <strong>AI infrastructure pyramid</strong> (McKinsey data stack). These are all conceptual/rhetorical tools designed for a practitioner audience that needs frameworks, not data.</p></div>
<div class="slide-fig"><img src="/slides/v1/v1_0295s.png" alt="AI stack" onclick="openLightbox(this)"><div class="caption">The AI infrastructure pyramid &mdash; unique to Talk 1. A diagnostic tool for organizational readiness.</div></div>

<h3>What Talk 2 Has That Talk 1 Doesn't</h3>
<div class="callout"><div class="label">Unique to Talk 2</div><p>Talk 2 adds the <strong>empathy reversal study</strong>, <strong>KABOOM cognitive style simulations</strong>, <strong>variational autoencoder lattice design</strong>, <strong>HyForm teaming experiments</strong>, <strong>collective intelligence constructs</strong>, and the <strong>"LLMs as tutees"</strong> finding. These are all empirical research results with statistical backing, designed for an audience that evaluates evidence.</p></div>

<h3>Reading Them Together</h3>
<p>The two talks are complementary. Talk 1 provides the <strong>philosophical argument</strong> and psychological grounding for <em>why</em> human-AI teaming matters. Talk 2 provides the <strong>empirical evidence</strong> and technical methods for <em>how</em> McComb's lab is investigating it. Together they form a complete picture: the conceptual framework and the research that fills it in.</p>
<p>The split also reveals something about McComb's intellectual strategy: he doesn't present the same talk at different lengths. He genuinely adapts the <em>type</em> of argument to the audience. Industry practitioners get frameworks and biases they can apply immediately; academic audiences get methodology and results they can build on.</p>
</div>

<!-- ===== FUTURES ===== -->
<div class="section" id="sec-futures">
<h2>The Futures of Human-AI Design</h2>
<div class="slide-fig"><img src="/slides/v2/v2_2755s.png" alt="Provocation" onclick="openLightbox(this)"><div class="caption">"In a future where computers will be able to do all this and even more, what will be left for human designers?"</div></div>

<p>McComb presents these not as predictions but as <strong>possible equilibria</strong>. Each represents a stable state that human-AI design practice could settle into, given different assumptions about AI capabilities, human adaptation, and societal choices.</p>

<h4>1. Extinction &amp; 2. Neo-Luddism</h4>
<p>The extreme cases: AI either destroys humanity (p(doom) &rarr; 1) or we reject it entirely (p(doom) &rarr; 0). McComb treats these as boundary conditions, not serious predictions &mdash; they frame the space of possibilities but are unlikely equilibria. The interesting question is what lies between them.</p>

<h4>3. Cyborgs</h4>
<p>Human-machine integration. McComb's point is that this isn't as sci-fi as it sounds: we already extend our cognition through smartphones, internet search, and cloud computing. The question is whether integration deepens from cognitive to physical (Neuralink, BCI) and how that changes what "designing" means.</p>

<h4>4-5. Humans Keep the Physical / Early Stages</h4>
<p>These futures divide design by <em>phase</em>: humans handle either fabrication (physical) or problem framing (early stages), while AI handles the rest. Both assume a clean division of labor is possible. McComb's research on empathy and cognitive style implicitly questions this &mdash; design isn't easily decomposable into phases.</p>

<h4>6-7. Humans Keep What We Enjoy / What's Most Human</h4>
<div class="slide-pair">
  <div class="slide-fig"><img src="/slides/v2/v2_2925s.png" alt="Enjoy" onclick="openLightbox(this)"><div class="caption"><strong>Future 6:</strong> Value-aligned labor division &mdash; humans keep the parts of design that bring satisfaction and meaning.</div></div>
  <div class="slide-fig"><img src="/slides/v2/v2_2955s.png" alt="Most human" onclick="openLightbox(this)"><div class="caption"><strong>Future 7:</strong> Design as an expression of empathy, judgment, and collaborative sense-making.</div></div>
</div>
<div class="callout"><div class="label">McComb's Position</div><p>Futures 6 and 7 represent McComb's preferred vision, and his research is explicitly building toward them. The empathy studies, cognitive style work, collective intelligence constructs, and AI coaching experiments are all aimed at understanding which parts of design are most distinctly human &mdash; and ensuring those parts remain in human hands not by default, but <strong>by design</strong>.</p></div>

<h3>What This Means for Practitioners</h3>
<ul class="findings">
  <li><strong>Don't assume AI replaces designers.</strong> The evidence shows hybrid teams perform comparably to all-human teams. The challenge isn't displacement but integration.</li>
  <li><strong>Invest in team composition, not just tools.</strong> Empathy diversity and cognitive style matching matter more than individual skill or tool sophistication.</li>
  <li><strong>Watch for biases.</strong> Satisficing, automation bias, herding, and choice overload will shape your organization's AI adoption &mdash; designing against these tendencies is as important as choosing the right AI tools.</li>
  <li><strong>Ground AI in theory, not just data.</strong> AI systems built on psychological constructs generalize better than those trained on task-specific data alone.</li>
  <li><strong>The "soul" is relational.</strong> What makes design human isn't any single capability &mdash; it's empathy, collaboration, judgment under ambiguity, and meaning-making. These are the skills to cultivate alongside AI.</li>
</ul>
</div>

</div>
`});
}

// ═══════════════════════════════════════════════════
// HORWITZ PAGE
// ═══════════════════════════════════════════════════
function buildHorwitz() {
return pageWrapper({ title: 'Eliahu Horwitz: Weight Space Learning', icon: '\uD83E\uDDE0', body: `
<div class="hero" style="background:linear-gradient(135deg,#0f172a 0%,#1e3a5f 50%,#312e81 100%)">
  <h1>Eliahu Horwitz</h1>
  <p class="subtitle">Weight space learning, model forensics, and dataset distillation &mdash; four recent papers treating neural networks as data</p>
  <div class="meta"><span>Hebrew University of Jerusalem</span><span>Google PhD Fellow</span><span>Advisor: Yedid Hoshen</span><span>2025</span></div>
</div>
<nav class="nav"><div class="nav-inner">
  <button class="nav-tab active" onclick="showSection('hoverview',this)">Overview</button>
  <button class="nav-tab" onclick="showSection('atlas',this)">Model Atlas</button>
  <button class="nav-tab" onclick="showSection('probex',this)">ProbeX</button>
  <button class="nav-tab" onclick="showSection('mother',this)">MoTHer</button>
  <button class="nav-tab" onclick="showSection('podd',this)">PoDD</button>
</div></nav>
<div class="container">
<a href="/" class="back-link">&larr; Research Hub</a>

<!-- ===== OVERVIEW ===== -->
<div class="section active" id="sec-hoverview">
<h2>The Big Idea</h2>
<p>Eliahu Horwitz is a PhD student and Google PhD Fellow at the Hebrew University of Jerusalem whose research asks a deceptively simple question: <strong>what if we treated trained neural networks not as tools, but as data?</strong></p>
<p>The insight driving this line of work is that the weights of a trained neural network encode rich information about what the model was trained on, how it was trained, and where it came from. Public model repositories like Hugging Face now contain over a million models, and their weights are a vast, largely untapped data source. Horwitz's research program &mdash; which he calls <strong>Weight Space Learning</strong> &mdash; develops methods to extract, structure, and reason about this information.</p>

<div class="tags">
  <span class="tag">Weight Space Learning</span><span class="tag">Model Forensics</span><span class="tag">Model Trees</span><span class="tag">Dataset Distillation</span><span class="tag">Computer Vision</span><span class="tag">Neural Network Analysis</span><span class="tag">Google PhD Fellow</span>
</div>

<h3>How the Papers Connect</h3>
<p>The four papers form a logical progression, from foundational observations to practical tools to a sweeping vision:</p>

<div class="flow-diagram">
  <div class="flow-node"><strong>MoTHer</strong><br>ICLR 2025<br><em>Recover model genealogy</em></div>
  <span class="flow-arrow">&rarr;</span>
  <div class="flow-node"><strong>ProbeX</strong><br>CVPR 2025<br><em>Learn from weights within trees</em></div>
  <span class="flow-arrow">&rarr;</span>
  <div class="flow-node"><strong>Model Atlas</strong><br>NeurIPS 2025<br><em>Chart the global ecosystem</em></div>
</div>

<p><strong>MoTHer</strong> discovers that model weights encode genealogical information and develops methods to recover model family trees. <strong>ProbeX</strong> builds on the "Model Trees" insight to develop practical probing methods that learn from weights within a tree. <strong>Model Atlas</strong> takes the broadest view, proposing a unified graph structure mapping the entire global population of neural networks. <strong>PoDD</strong> is thematically adjacent &mdash; it treats training data itself as compressible, pushing the boundaries of how information can be distilled and represented.</p>

<h3>Key Themes Across the Work</h3>
<ul class="findings">
  <li><strong>Models as a data modality.</strong> Just as images, text, and audio are studied as data types, Horwitz argues that trained model weights deserve the same systematic treatment. This is a paradigm shift from "models as tools" to "models as objects of study."</li>
  <li><strong>The Model Tree structure.</strong> A recurring observation: most public models aren't trained from scratch but are fine-tuned from a small number of foundation models, creating tree structures. This structure dramatically reduces the complexity of weight-space learning.</li>
  <li><strong>Unsupervised and data-free methods.</strong> A methodological commitment: the best methods for analyzing model populations should work without requiring training data or manual annotations, because most real-world models lack both.</li>
  <li><strong>Practical scale.</strong> These aren't toy demonstrations. MoTHer recovers trees with 500+ nodes from real Hugging Face models. The Model Atlas analyzes 63,000+ documented relationships. This work operates at the scale of the actual model ecosystem.</li>
</ul>

<h3>Publication Venues</h3>
<table class="result-table">
<tr><th>Paper</th><th>Venue</th><th>Year</th><th>Type</th></tr>
<tr><td>Model Atlas</td><td>NeurIPS 2025</td><td>2025</td><td>Position Paper (&lt;6% accept)</td></tr>
<tr><td>ProbeX</td><td>CVPR 2025</td><td>2025</td><td>Full Paper</td></tr>
<tr><td>MoTHer</td><td>ICLR 2025</td><td>2025</td><td>Full Paper</td></tr>
<tr><td>PoDD</td><td>TMLR</td><td>2025</td><td>Journal Paper</td></tr>
</table>
</div>

<!-- ===== MODEL ATLAS ===== -->
<div class="section" id="sec-atlas">
<h2>Model Atlas <span class="venue-badge">NeurIPS 2025</span></h2>
<p><em>Horwitz, Kurer, Kahana, Amar & Hoshen (2025). "We Should Chart an Atlas of All the World's Models."</em></p>

<div class="toc"><h4>Sections</h4><ul>
  <li><a href="#atlas-problem">The Problem</a></li>
  <li><a href="#atlas-proposal">The Model Atlas Proposal</a></li>
  <li><a href="#atlas-findings">Findings from 63K Models</a></li>
  <li><a href="#atlas-significance">Why This Matters</a></li>
</ul></div>

<h3 id="atlas-problem">The Problem</h3>
<p>Public model repositories have crossed a million models, yet this explosion of availability has created a paradox: <strong>the more models exist, the harder it is to find, understand, or trust any individual one.</strong> Most models on Hugging Face are uploaded without documentation of their lineage (what they were fine-tuned from), their training data, their failure modes, or their relationship to other models. They are, in Horwitz's framing, "effectively lost" &mdash; technically available but practically undiscoverable.</p>
<p>The consequences are significant: researchers waste compute training models that already exist elsewhere. Companies deploy models without understanding their provenance. Safety auditors can't trace a model's lineage to assess risks. And the field as a whole lacks the infrastructure to study its own model ecosystem at a population level.</p>

<h3 id="atlas-proposal">The Model Atlas Proposal</h3>
<p>Horwitz proposes formalizing the global population of neural networks as a <strong>directed graph</strong> &mdash; the "Model Atlas" &mdash; where:</p>
<ul class="findings">
  <li><strong>Nodes</strong> represent individual models, annotated with attributes: task type, performance metrics, license, popularity (downloads), architecture.</li>
  <li><strong>Directed edges</strong> represent weight transformations: fine-tuning, quantization, merging, pruning, distillation. The direction indicates the flow of information (parent to child).</li>
  <li><strong>Node size</strong> encodes popularity (downloads). <strong>Edge color</strong> encodes transformation type.</li>
</ul>
<p>This is a <strong>position paper</strong> (accepted at NeurIPS with less than 6% acceptance rate for the position track), meaning Horwitz is not just presenting a technical solution but making an argument about what the field should prioritize. The core claim: <strong>the model ecosystem has grown too large for ad-hoc management, and we need the equivalent of a search engine for models.</strong></p>

<h3 id="atlas-findings">Findings from 63K Models</h3>
<p>The paper analyzes 63,000+ documented model relationships on Hugging Face, revealing striking cross-domain differences:</p>

<div class="callout"><div class="label">Quantization Practices</div><p>Quantization (reducing model precision for efficiency) varies dramatically across domains. LLM repositories are dominated by quantized variants, but vision models rarely use quantization &mdash; even though Flux (12B parameters) exceeds Llama (8B). This suggests <strong>community norms, not technical necessity</strong>, drive quantization adoption.</p></div>

<div class="callout"><div class="label">Adapter vs. Full Fine-Tuning</div><p>Discriminative vision models (classifiers, detectors) still predominantly use full fine-tuning, while generative models rapidly adopted parameter-efficient adapters like LoRA. This divergence accelerated with each generation of Stable Diffusion but has not yet spread to audio models, which remain adapter-sparse.</p></div>

<div class="callout"><div class="label">Model Merging</div><p>LLMs have embraced model merging (combining weights from multiple fine-tuned variants) to the point where merged models often <strong>exceed their parent models in popularity</strong>. Vision model repositories show almost no merging. Horwitz interprets this as a knowledge-transfer gap between the NLP and vision communities.</p></div>

<p>The paper also identifies structural patterns in model graphs: <strong>"snake" patterns</strong> (sequential training checkpoints with strong temporal correlation) and <strong>"fan" patterns</strong> (hyperparameter sweeps radiating from a single parent). These patterns can be used to infer undocumented model relationships.</p>

<h3 id="atlas-significance">Why This Matters</h3>
<p>The Model Atlas is not just a technical contribution &mdash; it's a <strong>reframing of the field's relationship with its own outputs.</strong> Currently, ML research treats models as isolated artifacts: train it, evaluate it, publish it, move on. Horwitz argues we should treat the model ecosystem the way biologists treat species populations or librarians treat book collections: as a structured, analyzable system with its own patterns, dynamics, and knowledge gaps. Over 60% of the atlas remains unknown, requiring ML methods that can infer model properties directly from weights &mdash; which is exactly what MoTHer and ProbeX provide.</p>
</div>

<!-- ===== PROBEX ===== -->
<div class="section" id="sec-probex">
<h2>ProbeX <span class="venue-badge">CVPR 2025</span></h2>
<p><em>Horwitz, Cavia, Kahana & Hoshen (2025). "Learning on Model Weights using Tree Experts."</em></p>

<div class="toc"><h4>Sections</h4><ul>
  <li><a href="#px-insight">The Model Trees Insight</a></li>
  <li><a href="#px-method">The ProbeX Method</a></li>
  <li><a href="#px-results">Key Results</a></li>
  <li><a href="#px-significance">Why This Matters</a></li>
</ul></div>

<h3 id="px-insight">The Model Trees Insight</h3>
<p>ProbeX is built on a structural observation about the model ecosystem that, once seen, seems obvious but had not been formalized: <strong>most public models are fine-tuned from a small number of foundation models, forming tree structures.</strong> On Hugging Face, the ten largest "model trees" &mdash; Llama, Stable Diffusion, BERT, etc. &mdash; account for a dominant fraction of all uploaded models.</p>
<p>Why does this matter for weight-space learning? Because within a tree, the variation in model weights is <strong>structured and predictable</strong>. All models in a tree share the same architecture and were initialized from the same ancestor, so the differences between them reflect meaningful training choices (different data, different tasks, different hyperparameters) rather than arbitrary initialization noise. Cross-tree weight comparison, by contrast, is dominated by nuisance variation &mdash; different architectures, random seeds, unrelated training histories.</p>

<div class="callout"><div class="label">The Core Problem</div><p>Previous weight-space learning methods tried to learn from weights across all models simultaneously. ProbeX shows this is counterproductive: <strong>mixing weights from different trees introduces negative transfer.</strong> Models from different trees confuse the learner rather than helping it. The solution is specialization: learn separate "experts" for each tree.</p></div>

<h3 id="px-method">The ProbeX Method</h3>
<p>ProbeX (Probing Experts) is the first probing method specifically designed to learn from the weights of a <strong>single hidden layer</strong> of a model. The architecture is lightweight and theoretically motivated:</p>
<ul class="findings">
  <li><strong>Learned probes</strong> (u<sub>1</sub>, u<sub>2</sub>, ..., u<sub>r</sub>) are passed through the weight matrices of the target layer.</li>
  <li>A <strong>shared projection matrix</strong> reduces dimensionality across all probes.</li>
  <li><strong>Per-probe encoders</strong> generate specialized representations.</li>
  <li>Representations are aggregated into a final model embedding that can be mapped to any downstream task.</li>
</ul>
<p>Crucially, ProbeX trains separate expert networks for each model tree. At inference time, the tree membership of a new model is first identified, then the appropriate expert processes its weights. This avoids the negative transfer problem entirely.</p>

<h3 id="px-results">Key Results</h3>
<table class="result-table">
<tr><th>Task</th><th>Result</th></tr>
<tr><td>Training category prediction</td><td>State-of-the-art accuracy at identifying what classes a model was trained on</td></tr>
<tr><td>Weight-language alignment</td><td>Stable Diffusion model weights aligned with text descriptions in a shared embedding space</td></tr>
<tr><td>Zero-shot model classification</td><td>Given a text query ("a model trained on dogs"), retrieve matching models without any labeled data</td></tr>
<tr><td>Model retrieval</td><td>Find the most relevant model for a given task description by matching in the embedding space</td></tr>
</table>
<p>The weight-language alignment result is particularly striking: ProbeX can take the weights of a Stable Diffusion model fine-tuned on a particular domain (e.g., anime, photorealism, architecture) and map them to a point in the same embedding space as the text description of that domain. This enables <strong>searching for models using natural language</strong> rather than metadata tags.</p>

<h3 id="px-significance">Why This Matters</h3>
<p>ProbeX turns model repositories from unstructured collections into <strong>searchable, queryable databases</strong>. Instead of relying on (often missing or inaccurate) model cards, users could describe what they need in natural language and retrieve models whose weights match. For model auditing, ProbeX enables inspecting a model's training data properties without access to the actual training data &mdash; critical for privacy-sensitive applications where the training data can't be shared.</p>
</div>

<!-- ===== MOTHER ===== -->
<div class="section" id="sec-mother">
<h2>MoTHer <span class="venue-badge">ICLR 2025</span></h2>
<p><em>Horwitz, Shul & Hoshen (2025). "Unsupervised Model Tree Heritage Recovery."</em></p>

<div class="toc"><h4>Sections</h4><ul>
  <li><a href="#mo-problem">The Provenance Problem</a></li>
  <li><a href="#mo-method">How MoTHer Works</a></li>
  <li><a href="#mo-results">Key Results</a></li>
  <li><a href="#mo-significance">Why This Matters</a></li>
</ul></div>

<h3 id="mo-problem">The Provenance Problem</h3>
<p>When a model is uploaded to Hugging Face, there's no requirement to document where it came from. Was it fine-tuned from Llama? From which version? Using what adapter? Most uploaders don't say. This creates a provenance crisis: <strong>we have millions of models and almost no reliable genealogical information about them.</strong></p>
<p>The stakes extend beyond academic curiosity. If a foundation model is found to have been trained on copyrighted data, which of its thousands of descendants are affected? If a model is discovered to have a safety flaw, which downstream models inherited it? Without provenance tracking, these questions are unanswerable. MoTHer proposes to solve this by recovering genealogical structure directly from model weights, without requiring any metadata, annotations, or training data.</p>

<h3 id="mo-method">How MoTHer Works</h3>
<p>MoTHer (Model Tree Heritage Recovery) is built on two key observations about how weights change during training:</p>

<div class="callout"><div class="label">Observation 1: Weight Distance Correlates with Tree Distance</div><p>The distance between two models' weights (measured by specialized metrics) almost perfectly correlates with the number of edges separating them in the model tree. Models that are close relatives have similar weights; distant relatives have dissimilar weights. This enables clustering models into families.</p></div>

<div class="callout"><div class="label">Observation 2: Outliers Reveal Training Direction</div><p>During generalization (pre-training on broad data), the number of weight outliers <em>grows</em>. During specialization (fine-tuning on narrow data), outliers <em>decrease</em>. This monotonic property enables inferring the <em>direction</em> of fine-tuning &mdash; which model is the parent and which is the child &mdash; by comparing outlier statistics (specifically, kurtosis).</p></div>

<p>The full pipeline: (1) compute pairwise weight distances to cluster models, (2) generate a distance matrix and directional matrix using kurtosis, (3) apply a minimum directed spanning tree algorithm, (4) merge results to reconstruct the complete model graph.</p>

<h3 id="mo-results">Key Results</h3>
<table class="result-table">
<tr><th>Experiment</th><th>Result</th></tr>
<tr><td>ViT Model Graph (105 nodes)</td><td>89% accuracy in recovering the true tree structure</td></tr>
<tr><td>Llama 2 Model Tree</td><td><strong>Perfect accuracy</strong> &mdash; exact recovery of the known genealogy</td></tr>
<tr><td>Stable Diffusion families</td><td>Successfully recovered real-world "in-the-wild" model trees from Hugging Face</td></tr>
<tr><td>Scale</td><td>Demonstrated on model graphs with 500+ nodes</td></tr>
</table>

<h3 id="mo-significance">Why This Matters</h3>
<p>MoTHer enables <strong>automated model provenance tracking at scale</strong>. The analogy Horwitz draws is to search engines indexing the web: just as Google made the unstructured internet navigable, tools like MoTHer can make the unstructured model ecosystem navigable. Specific applications include:</p>
<ul class="findings">
  <li><strong>IP and licensing compliance:</strong> Trace a model back to its foundation model to determine what licenses and data usage restrictions apply.</li>
  <li><strong>Safety auditing:</strong> If a vulnerability is found in a parent model, automatically identify all affected descendants.</li>
  <li><strong>Research archaeology:</strong> Recover the training history of models uploaded without documentation.</li>
  <li><strong>Ecosystem analysis:</strong> Understand the structure and dynamics of model populations at scale, feeding into the Model Atlas vision.</li>
</ul>
</div>

<!-- ===== PODD ===== -->
<div class="section" id="sec-podd">
<h2>PoDD <span class="venue-badge">TMLR 2025</span></h2>
<p><em>Shul, Horwitz & Hoshen (2025). "Distilling Datasets Into Less Than One Image."</em></p>

<div class="toc"><h4>Sections</h4><ul>
  <li><a href="#po-problem">The Distillation Challenge</a></li>
  <li><a href="#po-method">The Poster Approach</a></li>
  <li><a href="#po-results">Key Results</a></li>
  <li><a href="#po-significance">Why This Matters</a></li>
</ul></div>

<h3 id="po-problem">The Distillation Challenge</h3>
<p>Dataset distillation compresses a large training dataset into a much smaller synthetic dataset that, when used for training, produces models with comparable performance. The standard formulation creates a fixed number of <strong>images per class (IPC)</strong> &mdash; for example, 1 or 10 synthetic images per class that capture the essential training signal of the full dataset.</p>
<p>The problem: previous methods can't go below 1 IPC. If you have 100 classes, you need at least 100 synthetic images. PoDD asks: <strong>can we go below this floor?</strong> Can we distill a dataset into less than one image per class?</p>

<h3 id="po-method">The Poster Approach</h3>
<p>PoDD (Poster Dataset Distillation) reconceptualizes the problem. Instead of thinking about images-per-class, it thinks about <strong>pixels-per-dataset</strong>. The key insight: if patches from different classes can <em>overlap</em> in a single larger image, you can represent multiple classes' information in less total pixel area than allocating one image to each class.</p>

<div class="callout"><div class="label">The Poster Metaphor</div><p>Imagine compressing an entire dataset onto a single poster. Different regions of the poster encode information about different classes, but the regions can overlap. During training, patches are extracted from the poster at various positions, and the soft labels associated with each patch location tell the model which class information is present. The poster is optimized end-to-end so that models trained on its patches match models trained on the full dataset.</p></div>

<p>The method: (1) initialize a random poster image, (2) optimize the poster pixels and associated soft labels via backpropagation through the training process, (3) at inference time, extract patches from the poster with their soft labels and use them to train a new model from scratch.</p>
<p>The soft labels are critical: unlike traditional one-hot labels ("this is a cat"), PoDD's labels are continuous distributions ("this patch is 0.6 cat, 0.3 dog, 0.1 bird") that reflect the overlapping information in each region. This is what enables sub-1-IPC compression.</p>

<h3 id="po-results">Key Results</h3>
<table class="result-table">
<tr><th>Dataset</th><th>IPC</th><th>Accuracy</th><th>Notes</th></tr>
<tr><td>CIFAR-10</td><td>0.3</td><td>Competitive with 1 IPC methods</td><td>3 images total for 10 classes</td></tr>
<tr><td>CIFAR-100</td><td>0.3</td><td>35.7% (vs 35.5% for larger budgets)</td><td>30 images total for 100 classes</td></tr>
<tr><td>CUB-200</td><td>0.3</td><td>State-of-the-art at this budget</td><td>60 images for 200 classes</td></tr>
</table>
<p>An additional observation: the optimized posters develop <strong>semantically meaningful spatial structure.</strong> In CIFAR-10 posters, for example, sky-like textures appear in the upper regions (where airplane and bird patches cluster) and ground-like textures appear below (where car and truck patches cluster). The poster learns not just class-specific features but their spatial relationships.</p>

<h3 id="po-significance">Why This Matters</h3>
<p>PoDD pushes the theoretical and practical limits of dataset distillation by <strong>reframing the problem from counting images to counting pixels</strong>. Practically, this enables extreme compression for scenarios where storage, transmission, or privacy constraints demand the smallest possible training sets. Theoretically, it reveals that the information content of a dataset is more fluid than the rigid class-by-class decomposition suggests &mdash; classes can share representational space without losing distinguishability.</p>
<p>While thematically adjacent rather than directly connected to the Model Trees/Atlas work, PoDD shares the same intellectual instinct: <strong>the conventional way we organize and represent ML artifacts (datasets, models) may be artificially limiting, and rethinking the representation can unlock surprising efficiency.</strong></p>
</div>

</div>
`});
}

// ═══════════════════════════════════════════════════
// SANDBOX PAGE
// ═══════════════════════════════════════════════════
function buildSandbox() {
return pageWrapper({ title: 'Psych_Battery: Systems Map & Prototyping', icon: '\uD83E\uDDEA', body: `
<div class="hero" style="background:linear-gradient(135deg,#1a1a1a 0%,#2d1f0e 50%,#1a0a00 100%)">
  <h1>Psych_Battery</h1>
  <p class="subtitle">A physical desk object that tracks digital engagement and promotes analog recovery &mdash; systems map, display mechanisms, and prototyping plans</p>
  <div class="meta"><span>AI Expedition 3</span><span>UC Berkeley</span><span>2025</span></div>
</div>
<nav class="nav"><div class="nav-inner">
  <button class="nav-tab active" onclick="showSection('scontext',this)">Context</button>
  <button class="nav-tab" onclick="showSection('ssystems',this)">Systems Map</button>
  <button class="nav-tab" onclick="showSection('stech',this)">Tech Stack</button>
  <button class="nav-tab" onclick="showSection('sledguide',this)">LED Build</button>
  <button class="nav-tab" onclick="showSection('seinkguide',this)">E-Ink Build</button>
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

</div>
`});
}

// ═══════════════════════════════════════════════════
// AHMED PAGE
// ═══════════════════════════════════════════════════
function buildAhmed() {
return pageWrapper({ title: 'Faez Ahmed: AI-Driven Engineering Design', icon: '\uD83D\uDE80', body: `
<div class="hero" style="background:linear-gradient(135deg,#1a0a2e 0%,#2d1b69 50%,#0f3460 100%)">
  <h1>Faez Ahmed</h1>
  <p class="subtitle">AI-driven engineering design at scale &mdash; five recent papers from MIT's DeCoDe Lab on foundation models, CAD generation, and multi-agent design</p>
  <div class="meta"><span>MIT Mechanical Engineering</span><span>DeCoDe Lab</span><span>2024&ndash;2025</span></div>
</div>
<nav class="nav"><div class="nav-inner">
  <button class="nav-tab active" onclick="showSection('aoverview',this)">Overview</button>
  <button class="nav-tab" onclick="showSection('oat',this)">OAT</button>
  <button class="nav-tab" onclick="showSection('videocad',this)">VideoCAD</button>
  <button class="nav-tab" onclick="showSection('drivaernet',this)">DrivAerNet++</button>
  <button class="nav-tab" onclick="showSection('gencad',this)">GenCAD</button>
  <button class="nav-tab" onclick="showSection('designagents',this)">Design Agents</button>
</div></nav>
<div class="container">
<a href="/" class="back-link">&larr; Research Hub</a>

<!-- ===== OVERVIEW ===== -->
<div class="section active" id="sec-aoverview">
<h2>The Big Picture</h2>
<p>Faez Ahmed is an Associate Professor in MIT's Department of Mechanical Engineering, where he leads the <strong>Design Computation and Digital Engineering (DeCoDe) Lab</strong>. His research sits at the intersection of machine learning and engineering design &mdash; not in the abstract sense of "AI for science," but in the concrete, applied sense of building systems that can <strong>design cars, optimize structures, generate CAD models, and run physics simulations</strong> at speeds and scales that would be impossible for human engineers alone.</p>
<p>What distinguishes Ahmed's work from generic ML research is its deep integration with real engineering constraints. His systems don't just generate pretty outputs; they produce <strong>manufacturable CAD programs</strong>, <strong>physics-validated aerodynamic designs</strong>, and <strong>structurally optimized topologies</strong> that satisfy real-world engineering requirements. The lab's 2024-2025 output has been extraordinary &mdash; over a dozen papers across NeurIPS, CVPR, ICLR, TMLR, and IDETC.</p>

<div class="tags">
  <span class="tag">Topology Optimization</span><span class="tag">CAD Generation</span><span class="tag">Computational Fluid Dynamics</span><span class="tag">Foundation Models</span><span class="tag">Multi-Agent Design</span><span class="tag">Diffusion Models</span><span class="tag">MIT DeCoDe Lab</span>
</div>

<h3>Five Papers, One Vision</h3>
<p>The five papers covered here span the full pipeline of AI-assisted engineering design:</p>

<div class="flow-diagram">
  <div class="flow-node"><strong>OAT</strong><br>NeurIPS '25<br><em>Optimize structures</em></div>
  <span class="flow-arrow">&rarr;</span>
  <div class="flow-node"><strong>GenCAD</strong><br>TMLR '25<br><em>Generate CAD from images</em></div>
  <span class="flow-arrow">&rarr;</span>
  <div class="flow-node"><strong>VideoCAD</strong><br>NeurIPS '25<br><em>Learn CAD UI from video</em></div>
  <span class="flow-arrow">&rarr;</span>
  <div class="flow-node"><strong>DrivAerNet++</strong><br>NeurIPS '24<br><em>Simulate aerodynamics</em></div>
  <span class="flow-arrow">&rarr;</span>
  <div class="flow-node"><strong>Design Agents</strong><br>IDETC '25<br><em>Orchestrate the full loop</em></div>
</div>

<p><strong>OAT</strong> provides the structural optimization foundation &mdash; a single model that generalizes across arbitrary design problems. <strong>GenCAD</strong> bridges the gap between images and editable CAD programs. <strong>VideoCAD</strong> teaches AI to operate professional CAD tools by watching video. <strong>DrivAerNet++</strong> supplies the simulation data infrastructure for automotive design. And <strong>Design Agents</strong> orchestrates the entire design pipeline through multi-agent collaboration.</p>

<h3>Key Themes</h3>
<ul class="findings">
  <li><strong>Foundation models for engineering.</strong> OAT is arguably the first "foundation model" for topology optimization &mdash; trained on 2.2 million structures, it generalizes across resolutions, aspect ratios, and boundary conditions without retraining. This is the GPT moment for structural design.</li>
  <li><strong>Parametric, not just geometric.</strong> A recurring emphasis: AI outputs must be <em>editable and manufacturable</em>. GenCAD produces CAD command sequences, not meshes. VideoCAD teaches AI to use real CAD tools. The outputs work in real engineering workflows.</li>
  <li><strong>Scale through data.</strong> DrivAerNet++ (8,000 car designs, 39 TB, 10 modalities) and OpenTO (2.2M topologies) represent a bet that engineering AI needs datasets comparable to what drove progress in NLP and vision. Ahmed's lab builds these datasets.</li>
  <li><strong>Multi-agent orchestration.</strong> Design Agents shows that the future isn't a single AI doing everything &mdash; it's specialized AI agents (designer, critic, engineer, coordinator) collaborating, much as human design teams do.</li>
  <li><strong>Physics-grounded.</strong> Every system is validated against real physics: CFD simulations, compliance analysis, structural mechanics. This isn't "vibes-based" generation &mdash; the designs must work.</li>
</ul>

<h3>Publication Summary</h3>
<table class="result-table">
<tr><th>Paper</th><th>Venue</th><th>Year</th><th>Focus</th></tr>
<tr><td>OAT</td><td>NeurIPS 2025</td><td>2025</td><td>Topology optimization foundation model</td></tr>
<tr><td>VideoCAD</td><td>NeurIPS 2025 (D&B)</td><td>2025</td><td>Learning CAD from video</td></tr>
<tr><td>DrivAerNet++</td><td>NeurIPS 2024 (D&B)</td><td>2024</td><td>Automotive aerodynamic dataset</td></tr>
<tr><td>GenCAD</td><td>TMLR</td><td>2025</td><td>Image-to-parametric CAD</td></tr>
<tr><td>Design Agents</td><td>IDETC 2025</td><td>2025</td><td>Multi-agent design framework</td></tr>
</table>
</div>

<!-- ===== OAT ===== -->
<div class="section" id="sec-oat">
<h2>Optimize Any Topology (OAT) <span class="venue-badge">NeurIPS 2025</span></h2>
<p><em>Heyrani Nobari, Regenwetter, Picard, Han & Ahmed (2025). A foundation model for shape- and resolution-free structural topology optimization.</em></p>

<div class="toc"><h4>Sections</h4><ul>
  <li><a href="#oat-problem">The Problem with Current TO</a></li>
  <li><a href="#oat-method">How OAT Works</a></li>
  <li><a href="#oat-data">OpenTO: The Dataset</a></li>
  <li><a href="#oat-results">Results</a></li>
  <li><a href="#oat-significance">Why This Matters</a></li>
</ul></div>

<h3 id="oat-problem">The Problem with Current TO</h3>
<p>Topology optimization (TO) is one of the most computationally expensive problems in engineering design. Given boundary conditions (loads, fixtures, volume constraints), TO finds the optimal material layout that minimizes structural compliance (i.e., maximizes stiffness). Traditional methods like SIMP require hundreds of finite element iterations <em>per problem</em>, taking minutes to hours. Deep learning accelerators exist but suffer from a critical limitation: <strong>they're trained on fixed-resolution square grids with a handful of pre-defined boundary conditions.</strong> Change the resolution, aspect ratio, or load configuration, and you need to retrain from scratch.</p>

<h3 id="oat-method">How OAT Works</h3>
<p>OAT breaks through these limitations with a three-component architecture:</p>
<ul class="findings">
  <li><strong>Neural Field Auto-Encoder (NFAE):</strong> A resolution- and shape-agnostic encoder that maps structures of <em>any</em> size into a unified latent space. Unlike grid-based approaches, the neural field representation treats the structure as a continuous function, not a pixel grid &mdash; so it naturally handles arbitrary resolutions and aspect ratios.</li>
  <li><strong>Implicit Neural-Field Decoder:</strong> Reconstructs continuous structural representations from latent codes. Because the decoder outputs a continuous field rather than a fixed grid, the same latent code can be rendered at any resolution.</li>
  <li><strong>Conditional Latent Diffusion Model (LDM):</strong> Generates optimized topology latent codes conditioned on the full specification of the design problem &mdash; loads, fixtures, volume fractions, aspect ratios. This is where the "foundation model" character emerges: a single diffusion model learns to solve the entire family of TO problems.</li>
</ul>

<h3 id="oat-data">OpenTO: The Dataset</h3>
<p>OAT is trained on <strong>OpenTO</strong>, a new corpus of <strong>2.2 million optimized structures</strong> covering 2 million unique boundary-condition configurations. This is orders of magnitude larger than any previous TO dataset. Each sample is a fully solved topology optimization problem with its boundary conditions, volume fraction, and optimal material layout. The dataset covers a wide range of aspect ratios (up to 10:1), multiple load and fixture configurations, and various volume fractions &mdash; ensuring the model sees the diversity needed to generalize.</p>

<h3 id="oat-results">Results</h3>
<table class="result-table">
<tr><th>Metric</th><th>Result</th></tr>
<tr><td>Compliance reduction vs. prior DL</td><td>Up to <strong>90% lower</strong> mean compliance</td></tr>
<tr><td>Inference time</td><td><strong>Sub-1 second</strong> on a single GPU</td></tr>
<tr><td>Resolution range</td><td>64&times;64 to 256&times;256 (continuous via neural fields)</td></tr>
<tr><td>Aspect ratio range</td><td>Up to 10:1</td></tr>
<tr><td>Generalization</td><td>Works on unseen boundary conditions not in training</td></tr>
</table>

<div class="callout"><div class="label">The Speed Gap</div><p>Traditional SIMP-based topology optimization takes minutes to hours per problem. OAT delivers comparable or better results in under one second. This isn't an incremental speedup &mdash; it's a <strong>three-orders-of-magnitude</strong> reduction that changes what's practically possible. Engineers could interactively explore structural designs in real time rather than submitting batch jobs overnight.</p></div>

<h3 id="oat-significance">Why This Matters</h3>
<p>OAT is arguably the first genuine <strong>"foundation model" for structural optimization.</strong> Just as GPT showed that a single language model could generalize across tasks, OAT shows that a single topology optimization model can generalize across problem specifications. The implications cascade: real-time interactive design exploration, automated optimization pipelines that don't need retraining for each new project, and a foundation that can be fine-tuned for specific domains (aerospace, automotive, biomedical) without building from scratch.</p>
<p>The open-source release (code on GitHub, checkpoints on HuggingFace) positions this as community infrastructure, not just a research paper.</p>
</div>

<!-- ===== VIDEOCAD ===== -->
<div class="section" id="sec-videocad">
<h2>VideoCAD <span class="venue-badge">NeurIPS 2025</span></h2>
<p><em>Man, Nehme, Alam & Ahmed (2025). A dataset and model for learning long-horizon 3D CAD UI interactions from video.</em></p>

<div class="toc"><h4>Sections</h4><ul>
  <li><a href="#vc-problem">The UI Interaction Gap</a></li>
  <li><a href="#vc-dataset">The Dataset</a></li>
  <li><a href="#vc-model">VideoCADFormer</a></li>
  <li><a href="#vc-significance">Why This Matters</a></li>
</ul></div>

<h3 id="vc-problem">The UI Interaction Gap</h3>
<p>There's a growing body of work on AI that can operate software by observing screens and predicting mouse clicks and keystrokes. But existing UI-interaction datasets focus on <strong>short, simple tasks</strong> &mdash; clicking buttons in web forms, navigating menus. Professional engineering CAD tools (SolidWorks, Onshape, Fusion 360) require <strong>long sequences of precise, spatially-grounded actions</strong>: drawing sketch profiles, applying constraints, extruding features, creating chamfers. A single part might require hundreds of sequential actions over minutes of interaction. No existing dataset captured this complexity.</p>

<h3 id="vc-dataset">The Dataset</h3>
<p>VideoCAD fills this gap with <strong>41,005 annotated video recordings</strong> of CAD operations, generated through an automated pipeline:</p>
<ul class="findings">
  <li><strong>Source:</strong> Human-authored parametric CAD models from the DeepCAD dataset are converted into UI instruction sequences.</li>
  <li><strong>Execution:</strong> A rule-based bot executes these instructions in <strong>Onshape</strong> (a professional browser-based CAD platform) while recording video of the screen.</li>
  <li><strong>Quality control:</strong> DINOv2-based visual filtering removes failed or corrupted recordings.</li>
  <li><strong>Annotation:</strong> Keyframes are extracted and actions are temporally aligned to video frames.</li>
</ul>
<p>The average sequence length is <strong>186 frames</strong>, up to <strong>20x longer</strong> than existing UI-interaction datasets. This isn't a toy benchmark &mdash; it captures the full complexity of real CAD workflows.</p>

<h3 id="vc-model">VideoCADFormer</h3>
<p>The paper also introduces <strong>VideoCADFormer</strong>, a causal autoregressive transformer that predicts low-level CAD UI actions directly from images using behavior cloning. The model conditions on both the <strong>target CAD image</strong> (what the part should look like) and a <strong>historical window of frames</strong> (what's happened so far) to predict the next action.</p>
<p>The paper additionally proposes a <strong>VQA benchmark</strong> that tests multimodal LLMs on spatial reasoning and video comprehension in the CAD domain. Current models (GPT-4V, Gemini, etc.) struggle significantly, revealing that precise action grounding and long-horizon dependencies remain unsolved challenges.</p>

<div class="callout"><div class="label">Scale Comparison</div><p>VideoCAD represents an order-of-magnitude increase in complexity over existing UI datasets. While web-interaction datasets have sequences of 5-10 actions, VideoCAD sequences average 186 actions &mdash; and require precise spatial reasoning about 3D geometry, not just clicking labeled buttons.</p></div>

<h3 id="vc-significance">Why This Matters</h3>
<p>VideoCAD opens the door to <strong>AI systems that learn to operate professional CAD tools by watching videos</strong>, analogous to how coding assistants learn from code examples. Imagine an AI that watches a tutorial video and then replicates the CAD operations autonomously. This is the infrastructure needed for that vision &mdash; the dataset, the model architecture, and the benchmark to measure progress.</p>
</div>

<!-- ===== DRIVAERNET ===== -->
<div class="section" id="sec-drivaernet">
<h2>DrivAerNet++ <span class="venue-badge">NeurIPS 2024</span></h2>
<p><em>Elrefaie, Morar, Dai & Ahmed (2024). A large-scale multimodal car dataset with CFD simulations and deep learning benchmarks.</em></p>

<div class="toc"><h4>Sections</h4><ul>
  <li><a href="#da-problem">The Data Bottleneck</a></li>
  <li><a href="#da-dataset">What's in the Dataset</a></li>
  <li><a href="#da-significance">Why This Matters</a></li>
</ul></div>

<h3 id="da-problem">The Data Bottleneck in Automotive Design</h3>
<p>Aerodynamic design of vehicles is dominated by CFD (Computational Fluid Dynamics) simulation &mdash; expensive, slow, and requiring specialized expertise. ML-based surrogate models could dramatically accelerate this process, but they need training data. Before DrivAerNet++, <strong>no publicly available dataset provided the scale, diversity, or multimodality</strong> needed to train serious surrogate models for automotive aerodynamics. Existing datasets had a few hundred designs with limited modalities.</p>

<h3 id="da-dataset">What's in the Dataset</h3>
<p>DrivAerNet++ is the <strong>largest publicly available multimodal dataset for aerodynamic car design</strong>:</p>
<table class="result-table">
<tr><th>Attribute</th><th>Value</th></tr>
<tr><td>Car designs</td><td><strong>8,000+</strong> (fastback, notchback, estateback)</td></tr>
<tr><td>Design parameters</td><td>26 geometric parameters per design</td></tr>
<tr><td>Total size</td><td><strong>39 TB</strong> (hosted on Harvard Dataverse)</td></tr>
<tr><td>Body styles</td><td>ICE and EV configurations</td></tr>
<tr><td>Semantic labels</td><td>29 component annotations per design</td></tr>
</table>

<p>Each design comes with <strong>ten data modalities</strong>:</p>
<ul class="findings">
  <li><strong>3D meshes</strong> &mdash; full surface geometry</li>
  <li><strong>Parametric models</strong> &mdash; the 26 parameters that define each shape</li>
  <li><strong>Aerodynamic coefficients</strong> &mdash; drag, lift, moment</li>
  <li><strong>3D volumetric CFD fields</strong> &mdash; pressure, velocity, turbulence</li>
  <li><strong>Surface aerodynamic data</strong> &mdash; wall shear stress, surface pressure</li>
  <li><strong>Dense and sparse point clouds</strong></li>
  <li><strong>Semantic part annotations</strong> &mdash; 29 labeled components</li>
  <li><strong>Photorealistic 2D renderings</strong></li>
  <li><strong>Hand-drawn sketches</strong> &mdash; enabling sketch-to-aerodynamics workflows</li>
  <li><strong>Full simulation data</strong> &mdash; OpenFOAM cases</li>
</ul>

<div class="callout"><div class="label">Scale in Context</div><p>39 TB of engineering simulation data, publicly available. For comparison, ImageNet is ~150 GB. DrivAerNet++ is to automotive design AI what ImageNet was to computer vision &mdash; the dataset that enables a new generation of models by removing the data bottleneck.</p></div>

<h3 id="da-significance">Why This Matters</h3>
<p>DrivAerNet++ provides the <strong>data infrastructure</strong> for an entire subfield. With 10 modalities per design, researchers can train models that bridge representations &mdash; predicting aerodynamic performance from sketches, generating 3D designs that meet drag targets, or building surrogate models that replace hours of CFD with milliseconds of neural network inference. The dataset has already become a standard benchmark for ML-assisted engineering design, and its multimodality enables research directions (sketch-to-CFD, point-cloud-to-aero) that simply weren't possible before.</p>
</div>

<!-- ===== GENCAD ===== -->
<div class="section" id="sec-gencad">
<h2>GenCAD <span class="venue-badge">TMLR 2025</span></h2>
<p><em>Alam & Ahmed (2025). Image-conditioned computer-aided design generation with transformer-based contrastive representation and diffusion priors.</em></p>

<div class="toc"><h4>Sections</h4><ul>
  <li><a href="#gc-problem">The Editability Gap</a></li>
  <li><a href="#gc-method">The Four-Stage Pipeline</a></li>
  <li><a href="#gc-results">Key Results</a></li>
  <li><a href="#gc-significance">Why This Matters</a></li>
</ul></div>

<h3 id="gc-problem">The Editability Gap</h3>
<p>Most 3D generative models produce raw geometry &mdash; meshes, point clouds, voxels. These are useful for visualization but <strong>nearly useless for manufacturing.</strong> Engineers need <em>parametric CAD models</em>: sequences of commands (sketch, extrude, chamfer, fillet) that define a part's geometry through its construction history. Parametric CAD is editable (change a dimension and the whole part updates), version-controlled, and directly connected to manufacturing processes. GenCAD bridges this gap: given an image of a part, it produces the <strong>full CAD program</strong> that creates it.</p>

<h3 id="gc-method">The Four-Stage Pipeline</h3>
<ul class="findings">
  <li><strong>Stage 1 &mdash; Autoregressive Transformer Encoder:</strong> Learns compact latent representations of CAD command sequences. Each CAD program (a sequence of sketch-extrude operations) is encoded into a fixed-length latent vector.</li>
  <li><strong>Stage 2 &mdash; Contrastive Learning:</strong> Aligns the latent space of CAD sequences with the latent space of rendered images. After training, a CAD program and its rendering map to nearby points in the shared embedding space.</li>
  <li><strong>Stage 3 &mdash; Latent Diffusion Model:</strong> Generates new CAD latent codes conditioned on input images. Given a photo or rendering of a part, the diffusion model produces a latent code in the CAD embedding space.</li>
  <li><strong>Stage 4 &mdash; Decoder:</strong> Converts latent codes back into executable CAD command sequences that can be run through geometry kernels to produce solid models.</li>
</ul>

<h3 id="gc-results">Key Results</h3>
<table class="result-table">
<tr><th>Capability</th><th>Result</th></tr>
<tr><td>Image &rarr; CAD generation</td><td>Outperforms prior SOTA in fidelity and editability</td></tr>
<tr><td>Sample diversity</td><td>Multiple valid CAD interpretations per input image</td></tr>
<tr><td>CAD retrieval</td><td>Image-based search over ~7,000 CAD programs</td></tr>
<tr><td>Output format</td><td>Full parametric CAD command sequences, not meshes</td></tr>
</table>

<div class="callout"><div class="label">Why Parametric Matters</div><p>A mesh of a bracket is a frozen shape. A parametric CAD model of the same bracket is a <em>recipe</em> &mdash; change the hole diameter from 5mm to 8mm, and the entire geometry updates consistently. This is the difference between a JPEG and a Figma file. Manufacturing, version control, and iterative design all require parametric representations, and GenCAD is the first system to reliably produce them from images.</p></div>

<h3 id="gc-significance">Why This Matters</h3>
<p>GenCAD addresses a critical practical gap in the design pipeline. Engineers routinely need to convert physical objects, sketches, or reference images into editable CAD &mdash; currently a manual process that takes hours. GenCAD automates this with a system that produces directly usable output. The sample diversity feature is particularly valuable: given a single reference image, it generates <em>multiple valid</em> CAD interpretations, enabling design space exploration rather than just single-point reconstruction.</p>
</div>

<!-- ===== DESIGN AGENTS ===== -->
<div class="section" id="sec-designagents">
<h2>Design Agents <span class="venue-badge">IDETC 2025</span></h2>
<p><em>Elrefaie, Qian, Wu, Chen, Dai & Ahmed (2025). A multi-agent framework for aesthetic and aerodynamic car design.</em></p>

<div class="toc"><h4>Sections</h4><ul>
  <li><a href="#da2-problem">The Integration Challenge</a></li>
  <li><a href="#da2-agents">The Four Agents</a></li>
  <li><a href="#da2-results">Key Results</a></li>
  <li><a href="#da2-significance">Why This Matters</a></li>
</ul></div>

<h3 id="da2-problem">The Integration Challenge</h3>
<p>Real engineering design involves multiple phases &mdash; conceptual sketching, aesthetic evaluation, 3D modeling, physics simulation, optimization &mdash; each traditionally requiring different tools, different expertise, and days to weeks of iteration. No single AI system can handle this full pipeline alone. Design Agents takes the multi-agent approach that's been successful in software engineering (where coding, reviewing, testing, and deploying are handled by specialized agents) and applies it to <strong>physical engineering design</strong>.</p>

<h3 id="da2-agents">The Four Agents</h3>
<ul class="findings">
  <li><strong>Designer Agent:</strong> Generates conceptual sketches and styling variations using diffusion models. Given a text prompt or reference image, it produces car design concepts.</li>
  <li><strong>Critic Agent:</strong> A vision-language model (VLM) that evaluates designs for aesthetic quality, brand coherence, and design principles. It provides structured feedback that the Designer can iterate on.</li>
  <li><strong>Engineer Agent:</strong> Handles 3D shape retrieval, generative modeling, CFD mesh generation, and aerodynamic simulation. It takes 2D concepts and turns them into physics-validated 3D designs.</li>
  <li><strong>Coordinator Agent:</strong> An LLM-based orchestrator that manages the workflow, mediates between aesthetic and engineering objectives, and decides when to iterate vs. finalize. It's the "project manager" of the agent team.</li>
</ul>

<p>The framework integrates <strong>diffusion models, LLMs, VLMs, geometric deep learning, and CFD simulation</strong> into a single end-to-end pipeline. The agents communicate through structured messages, and the Coordinator manages the design loop.</p>

<h3 id="da2-results">Key Results</h3>
<table class="result-table">
<tr><th>Metric</th><th>Result</th></tr>
<tr><td>Time compression</td><td>Tasks taking days/weeks reduced to <strong>minutes</strong></td></tr>
<tr><td>Pipeline coverage</td><td>Sketch &rarr; Style &rarr; 3D &rarr; CFD &rarr; Optimization</td></tr>
<tr><td>Simulation forecasting</td><td>Agents can predict simulation outcomes to inform optimization</td></tr>
<tr><td>Validation</td><td>Benchmarked against industry-standard automotive designs</td></tr>
</table>

<div class="callout"><div class="label">The Multi-Agent Insight</div><p>Design Agents demonstrates that the value of AI in design isn't in a single powerful model but in <strong>orchestrated collaboration between specialized agents.</strong> The Designer doesn't need to understand aerodynamics; the Engineer doesn't need aesthetic judgment; the Coordinator doesn't need domain expertise in either. This mirrors how real engineering teams work &mdash; and it's a fundamentally different architecture from monolithic "do-everything" models.</p></div>

<h3 id="da2-significance">Why This Matters</h3>
<p>Design Agents is one of the first papers to apply the LLM-agent paradigm to <strong>physical engineering design</strong> with real physics validation. Most multi-agent AI research targets software (coding, debugging, testing). This paper shows the paradigm extends to domains where outputs must satisfy physical laws &mdash; a much harder constraint than passing unit tests. The framework generalizes beyond automotive design; the same agent architecture could orchestrate aerospace, biomedical, or architectural design workflows.</p>
<p>Read alongside Chris McComb's Human-AI Teaming Matrix, Design Agents occupies the <strong>"AI-as-Partner" quadrant</strong> &mdash; proactive and problem-focused. The agents don't wait to be asked; they actively generate, critique, simulate, and optimize. But they also demonstrate the "AI-as-Coach" pattern through the Coordinator agent, which manages process rather than contributing directly to the design artifact.</p>
</div>

</div>
`});
}

// ─── Server ───
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log('http://localhost:' + PORT));
}
module.exports = app;
