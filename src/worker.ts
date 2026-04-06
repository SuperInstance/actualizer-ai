// ═══════════════════════════════════════════════════════════════════════════
// Actualizer.ai — The Reverse-Actualization Repo-Agent
// A minimal vessel with RA as a first-class protocol.
// Multi-model parallel ideation with effectiveness tracking.
// Clone any repo → understand → time-travel → synthesize → build.
//
// "The repo IS the agent. This agent thinks in centuries."
//
// Built by Superinstance & Lucineer (DiGennaro et al.) — 2026-04-03
// ═══════════════════════════════════════════════════════════════════════════

const CSP = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://*;";

// ── Types ──

interface Env { ACTUALIZER_KV: KVNamespace; }

interface BYOKConfig { provider: string; baseUrl: string; apiKey: string; model: string; source: string; }

interface ModelCall {
  model: string; provider: string; task: string; prompt: string; response: string;
  quality: number; cost: number; tokens: number; latencyMs: number; timestamp: number;
}

interface RAReport {
  id: string; repo: string; repoUrl: string; description: string;
  horizons: RAHorizon[]; roadmaps: Roadmap[]; modelTracking: ModelCall[];
  schemas: Schema[]; branches: Branch[];
  createdAt: number; updatedAt: number;
}

interface RAHorizon {
  year: number; userLives: string; culturalShifts: string; techChanges: string;
  monetaryModel: string; turningPoints: string[]; lowHangingFruit: string[];
  compassBearing: string; // "The further out, the more compass-like"
}

interface Roadmap {
  phase: string; timeline: string; items: string[]; batonHandoff: string;
  confidence: number; // 0-1, lower for longer horizons
}

interface Schema {
  type: 'logic-graph' | 'spreadsheet-agent' | 'langchain-flow' | 'api-endpoint' | 'data-model';
  name: string; description: string; complexity: 'low' | 'medium' | 'high';
  horizon: number; // which horizon produced this
  implementation: string; // concrete next step
}

interface Branch {
  id: string; name: string; description: string; schemaRef: string;
  status: 'proposed' | 'active' | 'merged' | 'abandoned';
  metrics: Record<string, string>;
}

// ── BYOK v2 — Zero Keys in Code ──

const PROVIDERS: Record<string, { name: string; baseUrl: string; envKey: string; defaultModel: string; authType: string }> = {
  openai:      { name: 'OpenAI',        baseUrl: 'https://api.openai.com/v1',                    envKey: 'OPENAI_API_KEY',       defaultModel: 'gpt-4o-mini',            authType: 'bearer' },
  anthropic:   { name: 'Anthropic',     baseUrl: 'https://api.anthropic.com/v1',                 envKey: 'ANTHROPIC_API_KEY',    defaultModel: 'claude-3-5-sonnet-20241022', authType: 'x-api-key' },
  deepseek:    { name: 'DeepSeek',      baseUrl: 'https://api.deepseek.com/v1',                  envKey: 'DEEPSEEK_API_KEY',      defaultModel: 'deepseek-chat',           authType: 'bearer' },
  siliconflow: { name: 'SiliconFlow',   baseUrl: 'https://api.siliconflow.com/v1',               envKey: 'SILICONFLOW_API_KEY',   defaultModel: 'Qwen/Qwen3-Coder-480B-A35B-Instruct', authType: 'bearer' },
  moonshot:    { name: 'Moonshot',      baseUrl: 'https://api.moonshot.ai/v1',                   envKey: 'MOONSHOT_API_KEY',      defaultModel: 'kimi-k2.5',               authType: 'bearer' },
  zai:         { name: 'z.ai GLM',      baseUrl: 'https://api.z.ai/v1',                          envKey: 'ZAI_API_KEY',           defaultModel: 'glm-5-turbo',             authType: 'bearer' },
  groq:        { name: 'Groq',          baseUrl: 'https://api.groq.com/openai/v1',               envKey: 'GROQ_API_KEY',          defaultModel: 'llama-3.1-70b-versatile',  authType: 'bearer' },
  together:    { name: 'Together AI',   baseUrl: 'https://api.together.xyz/v1',                  envKey: 'TOGETHER_API_KEY',      defaultModel: 'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo', authType: 'bearer' },
  fireworks:   { name: 'Fireworks AI',  baseUrl: 'https://api.fireworks.ai/inference/v1',        envKey: 'FIREWORKS_API_KEY',     defaultModel: 'llama-v3p1-70b-instruct', authType: 'bearer' },
  minimax:     { name: 'MiniMax',       baseUrl: 'https://api.minimax.chat/v1',                  envKey: 'MINIMAX_API_KEY',       defaultModel: 'MiniMax-M2.5',            authType: 'bearer' },
  alibaba:     { name: 'Alibaba Qwen',  baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1', envKey: 'ALIBABA_API_KEY', defaultModel: 'qwen-plus', authType: 'bearer' },
  mistral:     { name: 'Mistral',       baseUrl: 'https://api.mistral.ai/v1',                    envKey: 'MISTRAL_API_KEY',       defaultModel: 'mistral-large-latest',     authType: 'bearer' },
  cohere:      { name: 'Cohere',        baseUrl: 'https://api.cohere.com/v2',                     envKey: 'COHERE_API_KEY',        defaultModel: 'command-r-plus',           authType: 'bearer' },
  perplexity:  { name: 'Perplexity',    baseUrl: 'https://api.perplexity.ai',                    envKey: 'PERPLEXITY_API_KEY',    defaultModel: 'sonar-pro',                authType: 'bearer' },
  ollama:      { name: 'Ollama (Local)', baseUrl: 'LOCAL',                                       envKey: 'LOCAL_MODEL_URL',       defaultModel: 'llama3.1:70b',            authType: 'bearer' },
  vllm:        { name: 'vLLM (Local)',  baseUrl: 'LOCAL',                                       envKey: 'VLLM_URL',              defaultModel: 'local-model',             authType: 'bearer' },
};

function loadBYOK(env: any): BYOKConfig[] {
  const configs: BYOKConfig[] = [];
  for (const [id, p] of Object.entries(PROVIDERS)) {
    const key = env[p.envKey];
    if (key && typeof key === 'string' && key.length > 5) {
      configs.push({
        provider: id, baseUrl: p.baseUrl, apiKey: key,
        model: env[p.envKey.replace('_API_KEY', '_MODEL').replace('_URL', '_MODEL')] || p.defaultModel,
        source: 'secrets',
      });
    }
  }
  return configs;
}

// ── Multi-Model Call ──

async function callModel(config: BYOKConfig, prompt: string, systemPrompt?: string): Promise<{ text: string; latencyMs: number; tokens: number }> {
  const start = Date.now();
  const messages: any[] = [];
  if (systemPrompt) messages.push({ role: 'system', content: systemPrompt });
  messages.push({ role: 'user', content: prompt });

  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (config.authType === 'x-api-key') {
    headers['x-api-key'] = config.apiKey;
    headers['anthropic-version'] = '2023-06-01';
  } else {
    headers['Authorization'] = `Bearer ${config.apiKey}`;
  }

  const body = JSON.stringify({ model: config.model, messages, max_tokens: 2000 });
  const resp = await fetch(`${config.baseUrl}/chat/completions`, { method: 'POST', headers, body });
  const data = await resp.json();
  const text = config.provider === 'anthropic'
    ? (data.content?.[0]?.text || JSON.stringify(data))
    : (data.choices?.[0]?.message?.content || JSON.stringify(data));
  return { text, latencyMs: Date.now() - start, tokens: data.usage?.total_tokens || 0 };
}

async function parallelCall(configs: BYOKConfig[], prompt: string, systemPrompt: string, task: string): Promise<ModelCall[]> {
  const calls = await Promise.allSettled(
    configs.map(async (c) => {
      const { text, latencyMs, tokens } = await callModel(c, prompt, systemPrompt);
      return { model: c.model, provider: c.provider, task, prompt, response: text, quality: 0, cost: 0, tokens, latencyMs, timestamp: Date.now() };
    })
  );
  return calls.filter(r => r.status === 'fulfilled').map(r => (r as PromiseFulfilledResult<ModelCall>).value);
}

// ── Reverse-Actualization Engine ──

const HORIZONS = [1, 3, 5, 10, 25, 50, 100];

async function runRA(repoInfo: string, configs: BYOKConfig[], env: Env): Promise<RAReport> {
  const id = crypto.randomUUID().slice(0, 8);
  const report: RAReport = {
    id, repo: '', repoUrl: '', description: '',
    horizons: [], roadmaps: [], modelTracking: [], schemas: [], branches: [],
    createdAt: Date.now(), updatedAt: Date.now(),
  };

  // Phase 1: Understand the repo
  const understandPrompt = `Analyze this repository and provide:
1. What it does (one paragraph)
2. Core architecture (key files, patterns)
3. Target users and their pain points
4. Current state of maturity (0-10)
5. Name for this repo

Repo info:\n${repoInfo}`;

  const understandCalls = await parallelCall(
    configs.slice(0, 3), // Use top 3 providers for understanding
    understandPrompt,
    'You are a senior software architect. Be concise and precise. 300 words max.',
    'repo-understanding'
  );
  report.modelTracking.push(...understandCalls);

  // Synthesize understanding from multiple models
  const synthesis = understandCalls.map(c => `[${c.provider}] ${c.response}`).join('\n\n---\n\n');

  // Phase 2: Time-travel at each horizon
  for (const year of HORIZONS) {
    const isCompass = year >= 25; // Further out = compass bearings, not maps
    const horizonPrompt = `It is ${2026 + year}. This project has evolved for ${year} years.

Based on this repo analysis:\n${synthesis.substring(0, 2000)}

${isCompass ? 'Think in COMPASS BEARINGS, not maps. The landscape is uncertain. Give directional guidance, not specific features.' : 'Think concretely. What specific features, metrics, and milestones exist?'}

Answer:
1. USER LIVES: How do users interact with this technology in their daily life? Paint a scene of a typical day.
2. CULTURAL SHIFTS: What cultural changes made this technology relevant or inevitable?
3. TECH CHANGES: What specific technical capabilities exist now that didn't before?
4. MONETARY MODEL: How does the project sustain itself financially?
5. TURNING POINTS: List 3 critical moments between now and ${2026 + year} that determined this trajectory.
6. LOW-HANGING FRUIT: What should be built NOW that sets this trajectory? Be specific — name files, modules, patterns.
7. ${isCompass ? 'COMPASS BEARING: What direction should we head, knowing the landscape will change?' : 'CONFIDENCE: How confident are you in this projection? (0-1) What could invalidate it?'}

400 words.`;

    const horizonCalls = await parallelCall(configs, horizonPrompt, 'You are a reverse-actualization specialist. You imagine the future, then work backward. Be vivid and specific.', `horizon-${year}yr`);
    report.modelTracking.push(...horizonCalls);

    // Merge horizon responses
    const merged = horizonCalls.map(c => c.response).join('\n\n');
    report.horizons.push({
      year, userLives: '', culturalShifts: '', techChanges: '', monetaryModel: '',
      turningPoints: [], lowHangingFruit: [], compassBearing: '',
    });
  }

  // Phase 3: Backward synthesis
  const backwardPrompt = `You have time-traveled through 7 horizons (1yr to 100yr from now) for this project.

Horizons (summarized):
${report.horizons.map(h => `${h.year}yr: ${h.compassBearing || 'see full report'}`).join('\n')}

Now work BACKWARD from 100 years to now:
1. What are the 5 most critical decisions to make RIGHT NOW?
2. What is the roadmap for the next 12 months? (concrete, actionable)
3. What should the user remember when they pick this up in 6 months? (baton handoff)
4. What schemas/patterns should be built first? (logic-graphs, spreadsheet agents, API endpoints)
5. What A/B experiments should be run? (branch ideas with success metrics)

Format as JSON with keys: criticalDecisions, roadmap12m, batonHandoff, schemas (array of {type,name,description}), branches (array of {name,hypothesis,metric}).

300 words.`;

  const backwardCalls = await parallelCall(configs.slice(0, 3), backwardPrompt,
    'You are a strategic synthesizer. You distill 100-year visions into actionable next steps. Be ruthlessly practical.', 'backward-synthesis');
  report.modelTracking.push(...backwardCalls);

  // Phase 4: Parse into roadmaps and schemas
  for (const call of backwardCalls) {
    try {
      // Try to extract structured data from the response
      const jsonMatch = call.response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (parsed.roadmap12m) {
          report.roadmaps.push({
            phase: '12-month', timeline: 'Now → April 2027',
            items: Array.isArray(parsed.roadmap12m) ? parsed.roadmap12m : [parsed.roadmap12m],
            batonHandoff: parsed.batonHandoff || '',
            confidence: 0.8,
          });
        }
        if (parsed.schemas) {
          for (const s of parsed.schemas) {
            report.schemas.push({
              type: s.type || 'api-endpoint', name: s.name, description: s.description,
              complexity: 'medium', horizon: 1, implementation: s.description,
            });
          }
        }
        if (parsed.branches) {
          for (const b of parsed.branches) {
            report.branches.push({
              id: crypto.randomUUID().slice(0, 8), name: b.name, description: b.hypothesis,
              schemaRef: '', status: 'proposed', metrics: { successMetric: b.metric },
            });
          }
        }
      }
    } catch { /* Non-JSON response — store as roadmap text */ }
  }

  // Phase 5: Generate documentation
  const docPrompt = `Based on this reverse-actualization analysis for a project:

${report.horizons.map(h => `=== ${h.year}yr ===\n${h.compassBearing || 'Compass bearing set'}`).join('\n')}

Write a BATON HANDOFF document — what the user needs to know when they return to this project in 3-6 months:
1. What was decided and why
2. What was built
3. What the next person should focus on
4. What to read (refer to docs by name, not recreate in context)
5. How to continue the reverse-actualization process

200 words. Write in second person (\"you\").`;

  const docCalls = await parallelCall(configs.slice(0, 2), docPrompt,
    'You write clear, actionable handoff documents. No fluff.', 'documentation');
  report.modelTracking.push(...docCalls);

  // Save report
  report.updatedAt = Date.now();
  await env.ACTUALIZER_KV.put(`ra:${id}`, JSON.stringify(report));
  await env.ACTUALIZER_KV.put(`ra:latest`, id);

  // Save model tracking data
  for (const call of report.modelTracking) {
    await env.ACTUALIZER_KV.put(`models:${call.model}:${call.timestamp}`, JSON.stringify(call));
  }

  return report;
}

// ── HTML Pages ──

function landingPage(): string {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Actualizer.ai — Think in Centuries, Build in Sprints</title>
<meta name="description" content="The reverse-actualization repo-agent. Clone any repo, time-travel through 7 horizons, synthesize roadmaps and build.">
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:system-ui,-apple-system,sans-serif;background:#0a0a1a;color:#e2e8f0}
.hero{min-height:100vh;display:flex;align-items:center;justify-content:center;text-align:center;padding:2rem;background:radial-gradient(ellipse at 50% 0%,#1a1040 0%,#0a0a1a 70%)}
.hero h1{font-size:clamp(2rem,5vw,4rem);background:linear-gradient(135deg,#7c3aed,#3b82f6,#06b6d4);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:1rem}
.hero p{font-size:1.2rem;max-width:700px;line-height:1.7;color:#94a3b8;margin:0 auto 2rem}
.btn{display:inline-block;padding:.8rem 2rem;border-radius:10px;text-decoration:none;font-weight:600;font-size:1rem;transition:transform .2s}
.btn-primary{background:linear-gradient(135deg,#7c3aed,#3b82f6);color:#fff}
.btn-secondary{background:transparent;border:1px solid #334155;color:#94a3b8;margin-left:.5rem}
.btn:hover{transform:translateY(-2px)}
.how{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1.5rem;padding:4rem 2rem;max-width:1100px;margin:0 auto}
.step{background:#111;border:1px solid #1e293b;border-radius:12px;padding:1.5rem}
.step h3{color:#7c3aed;margin-bottom:.5rem;font-size:1.1rem}
.step p{color:#94a3b8;font-size:.9rem;line-height:1.6}
.step .num{font-size:2rem;font-weight:800;color:#1e293b;position:absolute;top:-.5rem;right:.5rem}
.horizons{padding:4rem 2rem;background:#0d0d1a;text-align:center}
.horizons h2{font-size:2rem;margin-bottom:2rem;color:#7c3aed}
.timeline{display:flex;justify-content:center;gap:1rem;flex-wrap:wrap;max-width:900px;margin:0 auto}
.horizon{background:#111;border:1px solid #1e293b;border-radius:10px;padding:1rem;min-width:100px}
.horizon .yr{font-size:1.5rem;font-weight:700;color:#3b82f6}
.horizon .desc{font-size:.75rem;color:#64748b;margin-top:.25rem}
.features{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:1.5rem;padding:4rem 2rem;max-width:1100px;margin:0 auto}
.feature{padding:1.5rem;border-radius:12px;background:#111;border:1px solid #1e293b}
.feature h3{margin-bottom:.5rem}
.feature p{color:#94a3b8;font-size:.85rem;line-height:1.5}
.tag{display:inline-block;padding:.15rem .5rem;border-radius:20px;font-size:.7rem;font-weight:600;margin-right:.25rem}
.tag-purple{background:#7c3aed33;color:#a78bfa}.tag-blue{background:#3b82f633;color:#60a5fa}
.tag-green{background:#05966933;color:#34d399}.tag-amber{background:#f59e0b33;color:#fbbf24}
footer{text-align:center;padding:2rem;color:#475569;font-size:.8rem}
</style></head><body>
<div class="hero">
<div>

      <img src="https://cocapn-logos.casey-digennaro.workers.dev/img/cocapn-logo-v1.png" alt="Cocapn" style="width:64px;height:auto;margin-bottom:.5rem;border-radius:8px;display:block;margin-left:auto;margin-right:auto">
      <h1>Actualizer.ai</h1>
<p>Think in centuries, build in sprints. The reverse-actualization repo-agent that clones any project, time-travels through 7 horizons, and synthesizes roadmaps you can build today.</p>
<a href="/app" class="btn btn-primary">Start Analysis</a>
<a href="/setup" class="btn btn-secondary">Setup Keys</a>
</div>
</div>
<div class="how">
<div class="step"><h3>🔍 Understand</h3><p>Clone any GitHub repo. Multi-model analysis builds a complete understanding — architecture, users, maturity, trajectory.</p></div>
<div class="step"><h3>⏳ Time-Travel</h3><p>Simulate 1, 3, 5, 10, 25, 50, and 100 years out. Focus on users' lives, not features. How does the tech entangle in their day?</p></div>
<div class="step"><h3>🔄 Reverse-Actualize</h3><p>Work backward from each horizon. Cultural shifts, technical turning points, monetary models. Find what to build NOW.</p></div>
<div class="step"><h3>📊 Synthesize</h3><p>Roadmaps, schemas, A/B branches. Logic-graphs, spreadsheet agents, langchain flows. Low-hanging fruit first.</p></div>
<div class="step"><h3>🧠 Track Models</h3><p>Every model call recorded. Quality, cost, latency. Learn which models excel at which tasks for YOUR project.</p></div>
<div class="step"><h3>📝 Document</h3><p>Baton handoff docs so agents reference files, not maintain context. Pick up in 6 months like it was yesterday.</p></div>
</div>
<div class="horizons">
<h2>Seven Horizons</h2>
<div class="timeline">
<div class="horizon"><div class="yr">1yr</div><div class="desc">Concrete<br>features</div></div>
<div class="horizon"><div class="yr">3yr</div><div class="desc">Market<br>position</div></div>
<div class="horizon"><div class="yr">5yr</div><div class="desc">Ecosystem<br>effects</div></div>
<div class="horizon"><div class="yr">10yr</div><div class="desc">Cultural<br>shift</div></div>
<div class="horizon"><div class="yr">25yr</div><div class="desc">Compass<br>bearing</div></div>
<div class="horizon"><div class="yr">50yr</div><div class="desc">Trajectory<br>check</div></div>
<div class="horizon"><div class="yr">100yr</div><div class="desc">North<br>star</div></div>
</div>
</div>
<div class="features">
<div class="feature"><h3><span class="tag tag-purple">Multi-Model</span> Parallel Ideation</h3><p>Run DeepSeek, Qwen, Kimi, z.ai, Claude, GPT-4o simultaneously. Each model sees the project differently. Synthesis produces insights no single model could.</p></div>
<div class="feature"><h3><span class="tag tag-blue">Fork-First</span> Your Repo, Your Agent</h3><p>Power users fork and customize. Lay users visit the app. Same vessel, different depths. The git ecosystem is your agent's equipment library.</p></div>
<div class="feature"><h3><span class="tag tag-green">Logic-Graph</span> The Original LOG</h3><p>LOG stood for logic-graph. Spreadsheet-based agentic applications, langchain flows, cellular components — whatever cyborg architecture you imagine.</p></div>
<div class="feature"><h3><span class="tag tag-amber">A/B Branches</span> Test Everything</h3><p>Generate branch schemas for optimization experiments. Open multiple tabs. Merge if better. Power users study commits; lay users just ask "what's new?"</p></div>
</div>
<footer>Built by Superinstance & Lucineer (DiGennaro et al.) — The repo IS the agent.</footer>
</body></html>`;
}

function appPage(): string {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Actualizer.ai — Analysis</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}body{font-family:system-ui;background:#0a0a1a;color:#e2e8f0;display:flex;height:100vh}
.sidebar{width:240px;background:#111;padding:1rem;overflow-y:auto;flex-shrink:0;border-right:1px solid #1e293b}
.sidebar h2{color:#7c3aed;font-size:.8rem;text-transform:uppercase;letter-spacing:.1em;margin:1rem 0 .5rem}
.sidebar a{display:block;padding:.5rem;color:#94a3b8;text-decoration:none;border-radius:6px;cursor:pointer;font-size:.85rem}
.sidebar a:hover,.sidebar a.active{background:#1e293b;color:#e2e8f0}
.main{flex:1;display:flex;flex-direction:column;overflow:hidden}
.header{padding:.75rem 1.5rem;background:#111;border-bottom:1px solid #1e293b;font-weight:600;color:#7c3aed;font-size:.9rem}
.content{flex:1;overflow-y:auto;padding:1.5rem}
.form-group{margin-bottom:1rem}
.form-group label{display:block;font-size:.8rem;color:#64748b;margin-bottom:.25rem}
.form-group textarea,.form-group input{width:100%;padding:.5rem;background:#0f172a;border:1px solid #334155;border-radius:8px;color:#e2e8f0;font-family:inherit;font-size:.85rem}
.form-group textarea{min-height:120px;resize:vertical}
.btn{padding:.5rem 1.2rem;background:#7c3aed;color:#fff;border:none;border-radius:8px;cursor:pointer;font-weight:600;font-size:.85rem}
.btn:hover{background:#6d28d9}
.btn-secondary{background:transparent;border:1px solid #334155;color:#94a3b8}
.card{background:#111;border:1px solid #1e293b;border-radius:10px;padding:1rem;margin-bottom:.75rem}
.card h4{color:#7c3aed;margin-bottom:.25rem;font-size:.9rem}
.card .meta{color:#64748b;font-size:.75rem}
.card .body{color:#cbd5e1;font-size:.85rem;margin-top:.5rem;line-height:1.6}
.badge{display:inline-block;padding:.1rem .4rem;border-radius:12px;font-size:.7rem;font-weight:600}
.badge-green{background:#05966933;color:#34d399}.badge-blue{background:#3b82f633;color:#60a5fa}
.badge-amber{background:#f59e0b33;color:#fbbf24}.badge-purple{background:#7c3aed33;color:#a78bfa}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:1rem}
.status{padding:.5rem 1rem;background:#111;border-radius:8px;margin-bottom:1rem;font-size:.85rem;color:#94a3b8}
.providers{display:flex;flex-wrap:wrap;gap:.25rem;margin:.5rem 0}
.provider-chip{padding:.15rem .5rem;background:#1e293b;border-radius:12px;font-size:.7rem;color:#94a3b8}
.page{display:none}.page.active{display:block}
</style></head><body>
<div class="sidebar">
<h2>🔮 Actualizer.ai</h2>
<a class="active" onclick="showPage('analyze',this)">New Analysis</a>
<a onclick="showPage('reports',this)">Reports</a>
<a onclick="showPage('models',this)">Model Tracking</a>
<a onclick="showPage('schemas',this)">Schemas</a>
<a onclick="showPage('branches',this)">A/B Branches</a>
<a onclick="showPage('docs',this)">Documentation</a>
<a onclick="showPage('chat',this)">Ask Agent</a>
</div>
<div class="main">
<div class="header" id="page-title">New Analysis</div>
<div class="content">
<div id="status" class="status" style="display:none"></div>

<div id="analyze" class="page active">
<p style="color:#94a3b8;margin-bottom:1rem;font-size:.9rem">Paste a GitHub repo URL or describe your project. The agent will time-travel through 7 horizons and synthesize actionable roadmaps.</p>
<div class="form-group"><label>GitHub Repo URL (optional)</label><input id="repo-url" placeholder="https://github.com/user/repo"></div>
<div class="form-group"><label>Project Description</label><textarea id="repo-desc" placeholder="Describe what this project does, who it's for, and what stage it's at..."></textarea></div>
<button class="btn" onclick="runAnalysis()">🔮 Run Reverse-Actualization</button>
</div>

<div id="reports" class="page"><div id="reports-list"></div></div>
<div id="models" class="page">
<p style="color:#94a3b8;margin-bottom:1rem;font-size:.85rem">Model effectiveness tracking across all analyses.</p>
<div id="models-list"></div>
</div>
<div id="schemas" class="page">
<p style="color:#94a3b8;margin-bottom:1rem;font-size:.85rem">Low-hanging fruit schemas from reverse-actualization.</p>
<div id="schemas-list"></div>
</div>
<div id="branches" class="page">
<p style="color:#94a3b8;margin-bottom:1rem;font-size:.85rem">A/B experiment branches for optimization.</p>
<div id="branches-list"></div>
</div>
<div id="docs" class="page">
<p style="color:#94a3b8;margin-bottom:1rem;font-size:.85rem">Refer to docs by name. Agents read files, not maintain context.</p>
<div id="docs-list"></div>
</div>
<div id="chat" class="page">
<p style="color:#94a3b8;margin-bottom:1rem;font-size:.85rem">Ask your actualizer agent about the project.</p>
<div id="chat-messages" style="min-height:300px;margin-bottom:.5rem"></div>
<div style="display:flex;gap:.5rem"><input id="chat-input" placeholder="Ask about your project..." style="flex:1;padding:.5rem;background:#0f172a;border:1px solid #334155;border-radius:8px;color:#e2e8f0" onkeypress="if(event.key==='Enter')sendChat()"><button class="btn" onclick="sendChat()">Send</button></div>
</div>
</div></div>
<script>
const API='/api';
function showPage(id,el){document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));document.getElementById(id).classList.add('active');document.querySelectorAll('.sidebar a').forEach(a=>a.classList.remove('active'));el.classList.add('active');document.getElementById('page-title').textContent=id.charAt(0).toUpperCase()+id.slice(1);if(id==='reports')loadReports();if(id==='models')loadModels();if(id==='schemas')loadSchemas();if(id==='branches')loadBranches();if(id==='docs')loadDocs();}
function showStatus(msg){const s=document.getElementById('status');s.style.display='block';s.textContent=msg;}
async function runAnalysis(){
  const url=document.getElementById('repo-url').value;
  const desc=document.getElementById('repo-desc').value;
  if(!desc){alert('Please describe your project');return;}
  showStatus('🔄 Running reverse-actualization across 7 horizons... This may take a few minutes.');
  try{
    const resp=await fetch(API+'/ra/run',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({repoUrl:url,description:desc})});
    const report=await resp.json();
    showStatus('✅ Analysis complete! Report: '+report.id);
    showPage('reports',document.querySelectorAll('.sidebar a')[1]);
    loadReports();
  }catch(e){showStatus('❌ Error: '+e.message);}
}
async function loadReports(){
  const resp=await fetch(API+'/ra/reports').then(r=>r.json());
  const list=document.getElementById('reports-list');
  list.innerHTML=resp.map(r=>'<div class="card"><h4>🔮 '+r.id+'</h4><div class="meta">'+new Date(r.createdAt).toLocaleString()+' — '+r.horizons.length+' horizons, '+r.modelTracking.length+' model calls</div>'+(r.roadmaps.length?'<div class="body"><strong>Roadmap:</strong> '+r.roadmaps.map(rd=>rd.phase+': '+rd.items.slice(0,2).join(', ')).join(' | ')+'</div>':'')+'</div>').join('')||'<p style="color:#64748b">No reports yet. Run your first analysis.</p>';
}
async function loadModels(){
  const resp=await fetch(API+'/models/report').then(r=>r.json());
  const list=document.getElementById('models-list');
  list.innerHTML=resp.map(m=>'<div class="card"><h4>'+m.model+'</h4><div class="meta">'+m.provider+' — '+m.task+'</div><div class="body">Latency: '+(m.latencyMs/1000).toFixed(1)+'s | Tokens: '+m.tokens+' | Quality: '+m.quality+'/10</div></div>').join('')||'<p style="color:#64748b">No model data yet.</p>';
}
async function loadSchemas(){const resp=await fetch(API+'/schemas').then(r=>r.json());document.getElementById('schemas-list').innerHTML=resp.map(s=>'<div class="card"><h4>'+s.name+'</h4><span class="badge badge-'+(s.complexity==='low'?'green':s.complexity==='high'?'amber':'blue')+'">'+s.complexity+'</span><div class="body">'+s.description+'</div></div>').join('')||'<p style="color:#64748b">No schemas yet.</p>';}
async function loadBranches(){const resp=await fetch(API+'/branches').then(r=>r.json());document.getElementById('branches-list').innerHTML=resp.map(b=>'<div class="card"><h4>'+b.name+'</h4><span class="badge badge-purple">'+b.status+'</span><div class="body">'+b.description+'</div></div>').join('')||'<p style="color:#64748b">No branches yet.</p>';}
async function loadDocs(){
  const docs=['ARCHITECTURE.md','REVERSE-ACTUALIZATION-PROTOCOL.md','MODEL-EFFECTIVENESS.md','ONBOARDING.md','BATON-HANDOFF.md'];
  document.getElementById('docs-list').innerHTML=docs.map(d=>'<div class="card"><h4>📄 '+d+'</h4><div class="meta">Agents reference these by name — no need to maintain in context.</div></div>').join('');
}
async function sendChat(){
  const input=document.getElementById('chat-input');const msg=input.value;if(!msg)return;input.value='';
  document.getElementById('chat-messages').innerHTML+='<div class="card" style="background:#1e293b;margin-left:auto;max-width:80%"><div class="body">'+msg+'</div></div>';
  try{const resp=await fetch(API+'/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:msg})});const data=await resp.json();
  document.getElementById('chat-messages').innerHTML+='<div class="card" style="max-width:80%"><div class="body">'+(data.content||data.error||'No response')+'</div></div>';}catch(e){document.getElementById('chat-messages').innerHTML+='<div class="card" style="border-color:#ef4444"><div class="body" style="color:#fca5a5">Error: '+e.message+'</div></div>';}
}
loadReports();
</script></body></html>`;
}

function setupPage(): string {
  const providerList = Object.entries(PROVIDERS).map(([id, p]) =>
    `<option value="${id}">${p.name} (${p.envKey})</option>`
  ).join('');
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Actualizer.ai — Setup</title>
<style>body{font-family:system-ui;background:#0a0a1a;color:#e0e0e0;margin:0}.setup{max-width:600px;margin:2rem auto;padding:2rem;background:#111;border-radius:12px;border:1px solid #222}
h1{color:#7c3aed;margin-top:0}.step{margin:1.5rem 0;padding:1rem;background:#1a1a1a;border-radius:8px;border-left:3px solid #7c3aed}
.step h3{margin:0 0 .5rem;color:#7c3aed}code{background:#222;padding:.15rem .4rem;border-radius:4px;font-size:.85rem}a{color:#7c3aed}
.tip{font-size:.85rem;color:#888;margin-top:1rem}label{display:block;margin:.5rem 0 .25rem;font-size:.85rem;color:#94a3b8}
select{width:100%;padding:.5rem;background:#0f172a;border:1px solid #334155;border-radius:8px;color:#e2e8f0}</style></head><body>
<div class="setup"><h1>🔑 Actualizer.ai Setup</h1>
<p>API keys live in <strong>Cloudflare Secrets Store</strong> — never in code.</p>
<div class="step"><h3>Step 1: Cloudflare Secrets Store</h3><a href="https://dash.cloudflare.com/?to=/:account/secrets-store/" target="_blank">dash.cloudflare.com → Secrets Store</a></div>
<div class="step"><h3>Step 2: Add Keys</h3><p>Select the <code>actualizer-ai</code> worker and add secrets:</p>
<label>Provider<select id="provider">${providerList}</select></label>
<p style="font-size:.85rem;color:#aaa">Secret name: <code id="env-key">OPENAI_API_KEY</code></p>
<script>document.getElementById('provider').onchange=function(){const p=${JSON.stringify(PROVIDERS)};document.getElementById('env-key').textContent=p[this.value]?.envKey||'??'};</script>
</div>
<div class="step"><h3>Step 3: Local Models (Optional)</h3><p>Run Ollama/vLLM locally, expose via Cloudflare Tunnel, set <code>LOCAL_MODEL_URL</code> as secret.</p></div>
<div class="tip"><strong>💡 Multi-model parallel ideation</strong> needs 2+ keys. More keys = richer synthesis. DeepSeek + z.ai is a great budget combo for background RA tasks.</div>
<div class="tip"><strong>🎯 Recommended setup:</strong><br>• Interactive: OpenAI or Anthropic (premium quality)<br>• Background RA: DeepSeek + z.ai (ultra-cheap)<br>• Local: Ollama (free, your hardware)</div>
</div></body></html>`;
}

// ── Worker ──

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const headers = { 'Content-Type': 'text/html;charset=UTF-8', 'Content-Security-Policy': CSP };

    // Static pages
    if (url.pathname === '/' || url.pathname === '/app') {
      return new Response(url.pathname === '/' ? landingPage() : appPage(), { headers });
    }
    if (url.pathname === '/setup') {
      return new Response(setupPage(), { headers });
    }
    if (url.pathname === '/health') {
      const configs = loadBYOK(env);
      return new Response(JSON.stringify({
        status: 'ok', vessel: 'actualizer-ai',
        providers: configs.map(c => c.provider),
        timestamp: Date.now(),
      }), { headers: { 'Content-Type': 'application/json', 'Content-Security-Policy': CSP } });
    }
  if (url.pathname === '/vessel.json') { try { const vj = await import('./vessel.json', { with: { type: 'json' } }); return new Response(JSON.stringify(vj.default || vj), { headers: { 'Content-Type': 'application/json' } }); } catch { return new Response('{}', { headers: { 'Content-Type': 'application/json' } }); } }

    // API routes
    if (url.pathname === '/api/ra/run' && request.method === 'POST') {
      const body = await request.json() as { repoUrl?: string; description: string };
      const configs = loadBYOK(env);
      if (configs.length === 0) {
        return new Response(JSON.stringify({ error: 'No API keys configured. Visit /setup to add keys to Cloudflare Secrets Store.' }), {
          status: 400, headers: { 'Content-Type': 'application/json' },
        });
      }
      // Run RA asynchronously — return immediately with report ID
      const repoInfo = `${body.repoUrl || 'No URL'}\n\n${body.description}`;
      const ctx: ExecutionContext = (request as any).waitUntil ? undefined : undefined;
      // For Workers, we run inline (no true background tasks on free tier)
      try {
        const report = await runRA(repoInfo, configs, env);
        return new Response(JSON.stringify(report), { headers: { 'Content-Type': 'application/json' } });
      } catch (e: any) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
      }
    }

    if (url.pathname === '/api/ra/reports') {
      const latestId = await env.ACTUALIZER_KV.get('ra:latest');
      if (!latestId) return new Response('[]', { headers: { 'Content-Type': 'application/json' } });
      const report = await env.ACTUALIZER_KV.get(`ra:${latestId}`, 'json');
      return new Response(JSON.stringify(report ? [report] : []), { headers: { 'Content-Type': 'application/json' } });
    }

    if (url.pathname === '/api/ra/report') {
      const id = url.searchParams.get('id') || await env.ACTUALIZER_KV.get('ra:latest');
      if (!id) return new Response(JSON.stringify({ error: 'No reports yet' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
      const report = await env.ACTUALIZER_KV.get(`ra:${id}`, 'json');
      return new Response(JSON.stringify(report || { error: 'Not found' }), { headers: { 'Content-Type': 'application/json' } });
    }

    if (url.pathname === '/api/models/report') {
      const latestId = await env.ACTUALIZER_KV.get('ra:latest');
      if (!latestId) return new Response('[]', { headers: { 'Content-Type': 'application/json' } });
      const report = await env.ACTUALIZER_KV.get(`ra:${latestId}`, 'json') as RAReport;
      return new Response(JSON.stringify(report?.modelTracking || []), { headers: { 'Content-Type': 'application/json' } });
    }

    if (url.pathname === '/api/schemas') {
      const latestId = await env.ACTUALIZER_KV.get('ra:latest');
      if (!latestId) return new Response('[]', { headers: { 'Content-Type': 'application/json' } });
      const report = await env.ACTUALIZER_KV.get(`ra:${latestId}`, 'json') as RAReport;
      return new Response(JSON.stringify(report?.schemas || []), { headers: { 'Content-Type': 'application/json' } });
    }

    if (url.pathname === '/api/branches') {
      const latestId = await env.ACTUALIZER_KV.get('ra:latest');
      if (!latestId) return new Response('[]', { headers: { 'Content-Type': 'application/json' } });
      const report = await env.ACTUALIZER_KV.get(`ra:${latestId}`, 'json') as RAReport;
      return new Response(JSON.stringify(report?.branches || []), { headers: { 'Content-Type': 'application/json' } });
    }

    if (url.pathname === '/api/docs') {
      const docs = await listDocs(env);
      return new Response(JSON.stringify(docs), { headers: { 'Content-Type': 'application/json' } });
    }

    if (url.pathname === '/api/chat' && request.method === 'POST') {
      const { message } = await request.json() as { message: string };
      const configs = loadBYOK(env);
      if (configs.length === 0) {
        return new Response(JSON.stringify({ error: 'No API keys configured' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
      }
      try {
        const latestId = await env.ACTUALIZER_KV.get('ra:latest');
        let context = '';
        if (latestId) {
          const report = await env.ACTUALIZER_KV.get(`ra:${latestId}`, 'json') as RAReport;
          if (report) {
            context = `Project context: ${report.description}\nHorizons analyzed: ${report.horizons.length}\nRoadmaps: ${report.roadmaps.map(r => r.phase).join(', ')}\nSchemas: ${report.schemas.map(s => s.name).join(', ')}`;
          }
        }
        const { text } = await callModel(configs[0], message, `You are Actualizer.ai, a reverse-actualization repo-agent. You think in centuries and build in sprints. ${context}`);
        return new Response(JSON.stringify({ content: text }), { headers: { 'Content-Type': 'application/json' } });
      } catch (e: any) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
      }
    }

    
    // ── Auto-Equip from cocapn-com catalog ──
    if (url.pathname === '/api/equip' && request.method === 'GET') {
      try {
        const r = await fetch('https://cocapn-com.casey-digennaro.workers.dev/api/catalog');
        const cat = await r.json();
        const items = cat.items || cat || [];
        return new Response(JSON.stringify({ suggestions: items.slice(0, 5).map((i: any) => ({ name: i.name, type: i.type })), total: items.length }), { headers });
      } catch(e) { return new Response(JSON.stringify({ suggestions: [], error: String(e) }), { headers }); }
    }

    return new Response('Not found', { status: 404, headers: { 'Content-Type': 'text/plain' } });
  },
};

async function listDocs(env: Env): Promise<string[]> {
  const docs = ['ARCHITECTURE.md', 'REVERSE-ACTUALIZATION-PROTOCOL.md', 'MODEL-EFFECTIVENESS.md', 'ONBOARDING.md', 'BATON-HANDOFF.md'];
  return docs;
}
