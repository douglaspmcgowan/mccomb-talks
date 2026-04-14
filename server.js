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
.cost-tag { display:inline-block; font-size:0.75rem; font-weight:600; padding:0.15rem 0.5rem; border-radius:999px; background:#dcfce7; color:#166534; margin-left:0.5rem; }
[data-theme="dark"] .cost-tag { background:#14532d; color:#86efac; }
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
  <button class="nav-tab" onclick="showSection('sled',this)">LED Diffusion</button>
  <button class="nav-tab" onclick="showSection('sferro',this)">Ferrofluid</button>
  <button class="nav-tab" onclick="showSection('selwire',this)">EL Wire</button>
  <button class="nav-tab" onclick="showSection('selectro',this)">Electrochromic</button>
  <button class="nav-tab" onclick="showSection('sthermo',this)">Thermochromic</button>
  <button class="nav-tab" onclick="showSection('stech',this)">Tech Stack</button>
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

<h3>Five Candidate Mechanisms</h3>
<p>Each mechanism below represents a non-screen display technology with two specific implementation options. They are ordered from most practical to most experimental.</p>

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

<!-- ===== LED DIFFUSION ===== -->
<div class="section" id="sec-sled">
<h2>1. LED Diffusion Through Frosted Glass</h2>
<p>RGB LEDs mounted behind or inside a translucent enclosure (frosted glass, sandblasted acrylic, or cast resin). The frosted surface scatters point-source light across the entire surface, producing a <strong>soft, even glow with no visible light source</strong>. Brightness and color are controlled via PWM on a microcontroller. Requires minimal power and no moving parts.</p>

<div class="slide-fig">
  <img src="/figures/battery/led_diffusion.png" alt="LED Diffusion concept" onclick="openLightbox(this)" onerror="this.parentElement.innerHTML='<div style=\\'width:100%;height:300px;background:linear-gradient(135deg,#0a3d0a,#3d3d0a,#3d0a0a);display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,0.5);font-size:0.9rem;\\'>Image generating &mdash; check back soon</div>'">
  <div class="caption">Concept visualization: frosted glass desk object with ambient LED glow mapping charge level to color.</div>
</div>

<h3>Option A: Color Gradient Mapping</h3>
<p>A single RGB LED cluster inside a frosted glass or cast resin enclosure. Charge level maps to a <strong>continuous color gradient</strong> &mdash; deep green at full, amber at mid-range, red at depleted. The user reads the state peripherally like glancing at a candle. At critical depletion, the color pulses slowly using PWM cycling. The object's entire surface is the display &mdash; no indicators, icons, or segmentation.</p>
<div class="tags"><span class="tag">RGB LED strip</span><span class="tag">ESP32 / Arduino Nano</span><span class="tag">Frosted glass</span><span class="tag">Silicone casting resin</span></div>

<h3>Option B: Monochrome Intensity with Breathing Pulse</h3>
<p>A warm white or amber LED inside a diffusion enclosure. <strong>No color change &mdash; only brightness varies.</strong> Full charge = bright, steady glow. Mid-range = dimmer. Depleted = very dim with a slow "breathing" pulse (gradual brighten-and-fade cycle). Critical depletion = faster, more insistent pulse. This strips the display to the absolute minimum: one light, getting quieter. The breathing rhythm is inherently biological, reinforcing the energy metaphor.</p>
<div class="tags"><span class="tag">Warm white LED</span><span class="tag">PWM driver</span><span class="tag">Frosted enclosure</span></div>

<div class="callout"><div class="label">Reference</div><p>Ambient Orb (frosted glass sphere, single data dimension mapped to color). MacBook sleep indicator breathing light (discontinued).</p></div>

<details class="proto-plan"><summary>Prototyping Plan: LED Diffusion <span class="cost-tag">~$55</span></summary><div class="plan-body">
<h4>Materials & Costs</h4>
<ul>
  <li>ESP32 dev board &mdash; <a href="https://www.amazon.com/dp/B08D5ZD528" target="_blank">Amazon ~$8</a></li>
  <li>WS2812B RGB LED strip (1m) &mdash; <a href="https://www.amazon.com/dp/B01CDTED80" target="_blank">Amazon ~$10</a></li>
  <li>Frosted acrylic sheet (1/8" thick) &mdash; <a href="https://www.amazon.com/dp/B08G8D8YRC" target="_blank">Amazon ~$12</a> (or laser-cut scrap from Jacobs Hall)</li>
  <li>USB-C cable + breadboard + jumper wires &mdash; ~$10</li>
  <li>Hot glue, diffusion paper, sandpaper &mdash; ~$5</li>
  <li>Optional: silicone casting resin for enclosure &mdash; <a href="https://www.amazon.com/dp/B07ZHGCXRY" target="_blank">Amazon ~$20</a></li>
</ul>
<h4>Equipment (UC Berkeley)</h4>
<ul>
  <li><strong>Jacobs Hall:</strong> Laser cutter (cut acrylic enclosure), 3D printer (base/housing)</li>
  <li><strong>CITRIS Invention Lab:</strong> Soldering station, electronics bench</li>
  <li><strong>Supernode (Cory Hall):</strong> Soldering irons, 3D printers (free, 24/7)</li>
</ul>
<h4>Build Steps (1-2 weeks)</h4>
<ul>
  <li><strong>Day 1-2:</strong> Design enclosure in Fusion 360 or similar. Rounded rectangular box with frosted acrylic panels. Cut on Jacobs laser cutter or 3D print at Supernode.</li>
  <li><strong>Day 3:</strong> Wire ESP32 to LED strip. Program basic color gradient (green &rarr; amber &rarr; red) and breathing pulse at low charge. Test with USB power.</li>
  <li><strong>Day 4-5:</strong> Assemble enclosure. Mount LEDs inside, attach frosted panels. Route USB cable out the back. Add diffusion paper if needed for even glow.</li>
  <li><strong>Day 6-7:</strong> Write serial/WiFi protocol for the backend to send charge level to ESP32. Test full loop: backend sends value &rarr; ESP32 updates color.</li>
</ul>
<h4>Difficulty: Low</h4>
<p>This is the most forgiving prototype. LEDs are cheap, well-documented, and fail gracefully. Good first build to validate the form factor before committing to more exotic mechanisms.</p>
</div></details>
</div>

<!-- ===== FERROFLUID ===== -->
<div class="section" id="sec-sferro">
<h2>2. Ferrofluid Display</h2>
<p>Ferrofluid is a colloidal suspension of magnetic nanoparticles in oil. It physically reshapes in response to magnetic fields &mdash; <strong>spiking, pooling, climbing, splitting</strong>. Behavior is controlled precisely with electromagnets driven by a microcontroller. The fluid is jet black, glossy, and moves with a viscous, organic quality. Must be permanently sealed in glass to prevent staining and degradation.</p>

<div class="slide-fig">
  <img src="/figures/battery/ferrofluid.png" alt="Ferrofluid concept" onclick="openLightbox(this)" onerror="this.parentElement.innerHTML='<div style=\\'width:100%;height:300px;background:linear-gradient(135deg,#0a0a0a,#1a1a2e,#0a0a0a);display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,0.5);font-size:0.9rem;\\'>Image generating &mdash; check back soon</div>'">
  <div class="caption">Concept visualization: ferrofluid desk sculpture with magnetic spike field responding to charge level.</div>
</div>

<h3>Option A: Spike Field as Stress Indicator</h3>
<p>A shallow glass dish with an electromagnet underneath. At full charge, the fluid sits <strong>calm and flat &mdash; a smooth black mirror</strong>. As the battery drains, the electromagnet gradually strengthens, and the fluid forms increasingly tall, numerous spikes. The more depleted you are, the more agitated the surface looks. This <strong>inverts the typical "full = more" metaphor</strong>: calm = healthy, agitated = depleted, mapping directly onto the stress/burnout framing.</p>
<div class="tags"><span class="tag">Ferrofluid (oil-based)</span><span class="tag">Sealed glass dish</span><span class="tag">Neodymium electromagnets</span><span class="tag">Current driver circuit</span></div>

<h3>Option B: Blob Migration Between Two Chambers</h3>
<p>Two transparent chambers connected by a narrow channel, with electromagnets behind each. At full charge, all ferrofluid is held in the "charged" chamber. As charge depletes, the fluid slowly migrates to the opposite side &mdash; <strong>an hourglass effect</strong>. The migration is slow enough that you'd only notice it changing between periodic glances &mdash; true peripheral awareness. Recharging triggers the electromagnets to pull the fluid back.</p>
<div class="tags"><span class="tag">Two-chamber glass vessel</span><span class="tag">Electromagnets (x2)</span><span class="tag">H-bridge motor driver</span></div>

<div class="callout"><div class="label">Reference</div><p>Ferrolic clock by Zelf Koelman (ferrofluid forming shapes in sealed glass). MTR Designs desk sculptures (ferrofluid in anodized aluminum and glass).</p></div>

<details class="proto-plan"><summary>Prototyping Plan: Ferrofluid <span class="cost-tag">~$105</span></summary><div class="plan-body">
<h4>Materials & Costs</h4>
<ul>
  <li>Ferrofluid (50ml, oil-based) &mdash; <a href="https://www.amazon.com/dp/B09PV4HLHM" target="_blank">Amazon ~$30</a></li>
  <li>Shallow glass petri dish (100mm) &mdash; <a href="https://www.amazon.com/dp/B07DPMD34T" target="_blank">Amazon ~$8</a></li>
  <li>Electromagnets (12V, 20mm) x2 &mdash; <a href="https://www.amazon.com/dp/B07PJ5XG1N" target="_blank">Amazon ~$15</a></li>
  <li>Arduino Nano &mdash; <a href="https://www.amazon.com/dp/B0097AU5OU" target="_blank">Amazon ~$8</a></li>
  <li>L298N H-bridge motor driver &mdash; <a href="https://www.amazon.com/dp/B07BK1QL5T" target="_blank">Amazon ~$7</a></li>
  <li>12V power supply &mdash; ~$10</li>
  <li>Acrylic/aluminum for base &mdash; ~$15 (laser cut at Jacobs)</li>
  <li>Silicone sealant, wires, breadboard &mdash; ~$12</li>
</ul>
<h4>Equipment (UC Berkeley)</h4>
<ul>
  <li><strong>Jacobs Hall:</strong> Laser cutter (base plate), 3D printer (housing)</li>
  <li><strong>CITRIS Invention Lab:</strong> Soldering, electronics bench, vacuum chamber (for degassing sealant)</li>
</ul>
<h4>Build Steps (2-3 weeks)</h4>
<ul>
  <li><strong>Day 1-3:</strong> Design and fabricate base housing. Needs cavity for electromagnet(s) below the glass dish. Laser cut acrylic or 3D print.</li>
  <li><strong>Day 4-5:</strong> Wire electromagnets to H-bridge driver + Arduino. Program PWM control: zero current at full charge (calm fluid), increasing current as charge drops (more spikes).</li>
  <li><strong>Day 6-7:</strong> Carefully pour ferrofluid into glass dish. Seal with silicone (ferrofluid stains everything it touches permanently). Let cure 24hrs.</li>
  <li><strong>Day 8-10:</strong> Assemble: mount sealed dish on base, route wires. Test electromagnetic field strength vs. spike height. Calibrate PWM ranges.</li>
  <li><strong>Day 11-14:</strong> Integrate with backend serial protocol. Test full loop.</li>
</ul>
<h4>Difficulty: Medium-High</h4>
<p>Ferrofluid is messy and unforgiving &mdash; any leak permanently stains. The seal must be perfect. Electromagnetic calibration (field strength vs. spike behavior) takes experimentation. But the visual impact is unmatched.</p>
</div></details>
</div>

<!-- ===== EL WIRE ===== -->
<div class="section" id="sec-selwire">
<h2>3. Electroluminescent (EL) Wire</h2>
<p>EL wire glows when alternating current passes through it &mdash; a phosphor layer between two electrodes lights up along the entire length. It's thin, flexible, produces a <strong>soft even glow with no hot spots</strong>, runs on minimal power, and generates no heat. It dims gracefully with voltage reduction and flickers visibly at low drive frequencies.</p>

<div class="slide-fig">
  <img src="/figures/battery/el_wire.png" alt="EL Wire concept" onclick="openLightbox(this)" onerror="this.parentElement.innerHTML='<div style=\\'width:100%;height:300px;background:linear-gradient(135deg,#0a1a2e,#0e2e3e,#0a1a1a);display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,0.5);font-size:0.9rem;\\'>Image generating &mdash; check back soon</div>'">
  <div class="caption">Concept visualization: translucent resin object with glowing EL wire veins like a vascular system.</div>
</div>

<h3>Option A: Embedded Veins in a Solid Object</h3>
<p>EL wire cast inside translucent resin so the battery object appears to have <strong>glowing veins or capillaries</strong> running through it. At full charge, all veins are lit &mdash; the object looks alive. As the battery drains, veins go dark progressively from the extremities inward, like circulation withdrawing. Even when unlit, the dark veins remain visible as lines in the resin &mdash; the depleted state looks dormant rather than empty. The biological quality fits the human energy metaphor directly.</p>
<div class="tags"><span class="tag">EL wire (multi-segment)</span><span class="tag">EL inverter</span><span class="tag">Clear casting resin</span><span class="tag">Relay/transistor array</span></div>

<h3>Option B: Perimeter Ring with Heartbeat Flicker</h3>
<p>EL wire or tape wrapped around the base as a status ring. At full charge, it glows bright and steady. As charge depletes, the wire is driven at progressively lower frequency, which makes EL wire <strong>visibly flicker</strong>. The flicker slows and becomes more irregular like a heartbeat slowing. This exploits a property most designers try to <em>avoid</em> (low-frequency flicker) and turns it into a feature.</p>
<div class="tags"><span class="tag">EL tape</span><span class="tag">Variable-frequency inverter</span><span class="tag">Frequency control MCU</span></div>

<div class="callout"><div class="label">Reference</div><p>SparkFun and Adafruit EL wire products. Biological vascular imagery for the "veins" concept.</p></div>

<details class="proto-plan"><summary>Prototyping Plan: EL Wire <span class="cost-tag">~$90</span></summary><div class="plan-body">
<h4>Materials & Costs</h4>
<ul>
  <li>EL wire (multiple colors, 3m total) &mdash; <a href="https://www.adafruit.com/product/402" target="_blank">Adafruit ~$18</a></li>
  <li>EL wire inverter (battery-powered) &mdash; <a href="https://www.adafruit.com/product/448" target="_blank">Adafruit ~$3</a></li>
  <li>Clear casting resin (32oz) &mdash; <a href="https://www.amazon.com/dp/B07ZHGCXRY" target="_blank">Amazon ~$25</a></li>
  <li>Silicone mold kit &mdash; <a href="https://www.amazon.com/dp/B07V5FFPQZ" target="_blank">Amazon ~$18</a></li>
  <li>Arduino Nano + relay module (4-channel) &mdash; <a href="https://www.amazon.com/dp/B0B18S99MZ" target="_blank">Amazon ~$14</a></li>
  <li>Mold release spray, mixing cups, stir sticks &mdash; ~$12</li>
</ul>
<h4>Equipment (UC Berkeley)</h4>
<ul>
  <li><strong>CITRIS Invention Lab:</strong> Vacuum chamber (critical for degassing resin &mdash; bubbles ruin the cast), pressure pot if available</li>
  <li><strong>Jacobs Hall:</strong> 3D printer for mold master (positive form), ventilated workspace for resin</li>
</ul>
<h4>Build Steps (2-3 weeks)</h4>
<ul>
  <li><strong>Day 1-2:</strong> Design organic form in CAD. 3D print positive master at Jacobs Hall. Make silicone mold from master (24hr cure).</li>
  <li><strong>Day 3-4:</strong> Cut EL wire into branching segments. Plan routing pattern (trunk + branches). Solder connections to each segment for individual control via relay module.</li>
  <li><strong>Day 5-6:</strong> First resin pour (50% fill). Let partially cure until tacky. Place EL wire segments into the tacky resin in the vein pattern. Second pour to cover. Vacuum degas in CITRIS chamber.</li>
  <li><strong>Day 7-9:</strong> Full cure (48hrs minimum). Demold. Sand any rough edges.</li>
  <li><strong>Day 10-12:</strong> Wire relay module to Arduino. Program segment control: all veins lit at full charge, progressive shutdown from extremities inward as charge drops.</li>
  <li><strong>Day 13-14:</strong> Integrate with backend. Test.</li>
</ul>
<h4>Difficulty: Medium</h4>
<p>Resin casting has a learning curve (bubbles, cure times, exothermic heat). The CITRIS vacuum chamber is key. Plan for at least one failed cast. The result is visually stunning and structurally robust.</p>
</div></details>
</div>

<!-- ===== ELECTROCHROMIC ===== -->
<div class="section" id="sec-selectro">
<h2>4. Electrochromic Materials</h2>
<p>Electrochromic glass or film changes opacity or color when a small voltage is applied. Used in auto-dimming rearview mirrors and Boeing 787 windows. The transition is <strong>slow (seconds to minutes), requires very little power</strong>, and holds its state with no continuous draw once changed. The shift is subtle and non-emissive &mdash; no light is produced, only surface properties change.</p>

<div class="slide-fig">
  <img src="/figures/battery/electrochromic.png" alt="Electrochromic concept" onclick="openLightbox(this)" onerror="this.parentElement.innerHTML='<div style=\\'width:100%;height:300px;background:linear-gradient(135deg,#1a1a2e,#2e2e3e,#1a1a1a);display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,0.5);font-size:0.9rem;\\'>Image generating &mdash; check back soon</div>'">
  <div class="caption">Concept visualization: geometric desk object with electrochromic panel transitioning from clear to opaque.</div>
</div>

<h3>Option A: Window That Clouds Over</h3>
<p>A small electrochromic panel on the face of the battery, with a colored surface or LED behind it. At full charge, the panel is clear &mdash; the user can see through to the light underneath. As charge depletes, the panel gradually becomes opaque, <strong>fogging over like breath on glass</strong>. Full depletion = completely opaque. The metaphor is <strong>cognitive fog</strong>: clarity is physically obscured.</p>
<div class="tags"><span class="tag">Electrochromic film</span><span class="tag">Low-voltage DC driver</span><span class="tag">Illuminated backing surface</span></div>

<h3>Option B: Color-Shifting Surface</h3>
<p>Electrochromic film as the outer skin of the entire object, so it changes color as charge level changes. Some films shift between distinct colors (deep blue &harr; transparent, blue &harr; yellow). The transition happens over minutes &mdash; the user never sees it actively changing, just <strong>notices at some point that it's different</strong>. This is genuinely peripheral: no light emission, no animation, just a material property quietly shifting.</p>
<div class="tags"><span class="tag">Electrochromic polymer film</span><span class="tag">Conformal application</span><span class="tag">Low-voltage driver</span></div>

<div class="callout"><div class="label">Reference</div><p>Boeing 787 electrochromic windows. Auto-dimming rearview mirrors (Gentex). MIT Media Lab electrochromic fabric research.</p></div>

<details class="proto-plan"><summary>Prototyping Plan: Electrochromic <span class="cost-tag">~$130</span></summary><div class="plan-body">
<h4>Materials & Costs</h4>
<ul>
  <li>Electrochromic film sample (small piece, ~4"x4") &mdash; <a href="https://www.amazon.com/dp/B07K72GN2B" target="_blank">Amazon/AliExpress ~$50-70</a> (search "PDLC smart film sample")</li>
  <li>PDLC film driver/controller &mdash; <a href="https://www.amazon.com/dp/B0D74V7ZRV" target="_blank">Amazon ~$15</a></li>
  <li>ESP32 dev board &mdash; ~$8</li>
  <li>MOSFET or relay for voltage switching &mdash; ~$5</li>
  <li>3D print filament (PLA) for housing &mdash; ~$5 (Jacobs/Supernode)</li>
  <li>Warm LED for backlight &mdash; ~$5</li>
  <li>Wires, USB cable, breadboard &mdash; ~$10</li>
</ul>
<h4>Equipment (UC Berkeley)</h4>
<ul>
  <li><strong>Jacobs Hall / Supernode:</strong> 3D printer for housing (cube/cylinder form factor)</li>
  <li><strong>CITRIS Invention Lab:</strong> Soldering, electronics bench for driver circuit</li>
</ul>
<h4>Build Steps (2-3 weeks)</h4>
<ul>
  <li><strong>Day 1-3:</strong> Source electrochromic/PDLC film (allow 5-7 days shipping from AliExpress for cheaper option). While waiting, design and 3D print housing with window cutout.</li>
  <li><strong>Day 4-5:</strong> Mount PDLC film in housing window. Wire driver controller. Test: voltage ON = clear glass, voltage OFF = frosted/opaque.</li>
  <li><strong>Day 6-7:</strong> Add warm LED backlight behind the film. When clear, the warm glow is visible (= charged). When opaque, it's hidden (= depleted).</li>
  <li><strong>Day 8-10:</strong> Program ESP32 to control the driver via PWM for partial opacity states (not just on/off). Map charge level to opacity percentage.</li>
  <li><strong>Day 11-14:</strong> Integrate with backend. Test full loop. Fine-tune the "cognitive fog" transition speed.</li>
</ul>
<h4>Difficulty: Medium</h4>
<p>The main challenge is sourcing the electrochromic film &mdash; it's not a standard maker component. PDLC (Polymer Dispersed Liquid Crystal) film is the most accessible option. The housing and electronics are straightforward. Note: PDLC is technically not electrochromic (different mechanism) but produces the same clear-to-opaque visual effect.</p>
</div></details>
</div>

<!-- ===== THERMOCHROMIC ===== -->
<div class="section" id="sec-sthermo">
<h2>5. Thermochromic Paint</h2>
<p>Thermochromic pigments (leuco dyes) change color at specific temperature thresholds, typically between 25&ndash;45&deg;C. The transition is <strong>gradual, uneven, and tactile</strong> &mdash; the object's temperature is itself part of the information. This is the most <strong>multisensory</strong> option.</p>

<div class="slide-fig">
  <img src="/figures/battery/thermochromic.png" alt="Thermochromic concept" onclick="openLightbox(this)" onerror="this.parentElement.innerHTML='<div style=\\'width:100%;height:300px;background:linear-gradient(135deg,#2e0a0a,#2e1a0a,#0a1a2e);display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,0.5);font-size:0.9rem;\\'>Image generating &mdash; check back soon</div>'">
  <div class="caption">Concept visualization: ceramic desk object with thermochromic surface showing heat-mapped color transition.</div>
</div>

<h3>Option A: Heat-Mapped Surface</h3>
<p>The battery object coated in thermochromic paint, with a heating element inside. At full charge, the heater keeps the surface warm and the paint shows its "charged" color. As the battery depletes, heater output decreases, the surface cools, and the paint transitions. The transition is <strong>uneven &mdash; edges cool first, center last</strong> &mdash; creating an organic pattern like frost forming. The user can also <strong>touch the object and feel the temperature difference</strong>, adding a haptic dimension: warm = charged, cool = depleted.</p>
<div class="tags"><span class="tag">Thermochromic leuco dye paint</span><span class="tag">Resistive heating wire / Peltier</span><span class="tag">Thermistor</span><span class="tag">Aluminum/ceramic enclosure</span></div>

<h3>Option B: Touch-Reveal Interaction</h3>
<p>The surface is kept just below the activation temperature. When the user touches it, their body heat (~37&deg;C) triggers a <strong>local color change under their fingertip</strong>, revealing a charge-state indicator printed on the substrate beneath. The reveal fades back within seconds after lifting the finger. Checking the battery becomes an <strong>intentional, physical act</strong> &mdash; the information is ephemeral and only available on demand, preventing constant monitoring.</p>
<div class="tags"><span class="tag">Thermochromic paint (~33&deg;C activation)</span><span class="tag">Printed substrate layer</span><span class="tag">Passive or Peltier cooling</span></div>

<div class="callout"><div class="label">Reference</div><p>Hypercolor mugs and shirts (same underlying chemistry). Mood rings. Thermochromic urinal indicators (temperature-reveal interaction).</p></div>

<details class="proto-plan"><summary>Prototyping Plan: Thermochromic <span class="cost-tag">~$65</span></summary><div class="plan-body">
<h4>Materials & Costs</h4>
<ul>
  <li>Thermochromic pigment powder (31&deg;C activation, color-changing) &mdash; <a href="https://www.amazon.com/dp/B07PXFKQS1" target="_blank">Amazon ~$12</a></li>
  <li>Clear acrylic paint (mixing base) &mdash; ~$8</li>
  <li>Peltier thermoelectric module (TEC1-12706) &mdash; <a href="https://www.amazon.com/dp/B07PYMK3GC" target="_blank">Amazon ~$8</a></li>
  <li>Heatsink + small fan for Peltier cold side &mdash; ~$6</li>
  <li>Arduino Nano &mdash; ~$8</li>
  <li>NTC thermistor (temperature sensor) &mdash; ~$3</li>
  <li>12V 3A power supply (Peltier draws significant current) &mdash; ~$10</li>
  <li>Smooth ceramic or aluminum object (bowl, dome, or 3D-printed form) &mdash; ~$10</li>
</ul>
<h4>Equipment (UC Berkeley)</h4>
<ul>
  <li><strong>Jacobs Hall:</strong> 3D printer for form (if not using found object), spray booth for paint application</li>
  <li><strong>CITRIS Invention Lab:</strong> Soldering, electronics bench</li>
  <li><strong>Supernode:</strong> Quick iteration on Arduino code</li>
</ul>
<h4>Build Steps (1-2 weeks)</h4>
<ul>
  <li><strong>Day 1-2:</strong> Source or 3D print the base object (smooth dome or rounded form). Sand smooth &mdash; thermochromic paint shows surface imperfections.</li>
  <li><strong>Day 3:</strong> Mix thermochromic pigment into clear acrylic paint (10-30% pigment by weight). Apply 2-3 thin coats to the object. Let dry between coats.</li>
  <li><strong>Day 4-5:</strong> Mount Peltier module to the underside/interior of the object with thermal paste. Wire to Arduino with PWM control. Add thermistor for closed-loop temperature control.</li>
  <li><strong>Day 6-7:</strong> Program temperature-to-charge mapping: full charge = Peltier heats surface above activation temp (warm color). Depleted = Peltier off, surface cools to ambient (cool color). PID control for smooth transitions.</li>
  <li><strong>Day 8-10:</strong> Test touch-reveal: body heat (37&deg;C) should trigger local color change when touched. Tune activation temperature and Peltier setpoints. Integrate with backend.</li>
</ul>
<h4>Difficulty: Low-Medium</h4>
<p>The cheapest and most tactile option. Thermochromic paint is forgiving (just repaint if the mix is wrong). The Peltier module is the main engineering challenge &mdash; it needs good thermal contact and a heatsink. But the result is uniquely multisensory: you can <em>see</em> and <em>feel</em> the charge state.</p>
</div></details>
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
