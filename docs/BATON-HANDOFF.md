# Baton Handoff — What to Remember

## When You Return in 6 Months

### What Was Decided
- **Reverse-actualization is the core protocol**: Think in centuries, build in sprints
- **Multi-model parallel ideation**: Use multiple AI providers simultaneously, synthesize insights
- **Document-first**: Agents reference docs by name, don't maintain every detail in context
- **Fork-first**: Power users fork and customize; lay users visit the app
- **Zero keys in code**: All API keys via Cloudflare Secrets Store

### What Was Built
- **actualizer-ai**: Single-file Cloudflare Worker (~550 lines)
- **BYOK v2**: 16 providers across 4 tiers (local, ultra-cheap, budget, premium)
- **RA Engine**: 7 horizons with multi-model parallel calls
- **Report System**: KV-stored reports with horizons, roadmaps, schemas, branches
- **Model Tracking**: Per-call effectiveness data (quality, cost, latency, tokens)
- **5 Documentation files**: Architecture, RA Protocol, Model Effectiveness, Onboarding, this file

### What to Focus On Next
1. **Fork orchestrator**: GitHub OAuth → private fork → Cloudflare deploy → live in 10 seconds
2. **Seed UI**: Five-layer presentation primitive (spreadsheet, messenger, feed, matrix, research lab)
3. **Dream engine**: Background consolidation cycles on cheap coding plans
4. **Local model bridge**: Ollama/vLLM tunnel registration and routing
5. **Memory fabric**: Cross-interface unified memory across all five presentation layers

### How to Continue the RA Process
1. Load the previous report from KV (`ra:latest`)
2. Run RA again with new context
3. Compare new horizons with old compass bearings
4. The 25-year compass is now 24.5 years — it should be sharper
5. Extend: simulate a new 100-year horizon from the current position

### Key Files to Read
- `docs/ARCHITECTURE.md` — System design and data flow
- `docs/REVERSE-ACTUALIZATION-PROTOCOL.md` — How RA works, the 7 horizons
- `docs/MODEL-EFFECTIVENESS.md` — Which models are best for which tasks
- `docs/ONBOARDING.md` — Getting started for all user types
- `docs/BATON-HANDOFF.md` — This file

### Key Concepts to Remember
- **Compass bearings vs maps**: ≥25yr horizons are directional, not concrete
- **The further out ideas are compass bearings**: The landscape will change. When 25yr becomes 5yr, it sharpens.
- **Coding plan strategy**: z.ai, MiniMax, Alibaba have time-based limits — throttle background RA during idle periods
- **Agent and application are merging**: The repo IS the agent. It builds apps around itself.
- **The Accumulation Theorem**: I = M · B^α · Q^β — value comes from accumulated context, not model capability
- **Logic-graph origin**: LOG = logic-graph. Spreadsheet-based agentic applications where cells are agents.

### Infrastructure
- **Cloudflare account**: Dad's (049ff5e84ecf636b53b162cbb580aae6)
- **Subdomain**: casey-digennaro.workers.dev
- **Token**: Stored in MEMORY.md (workspace)
- **31+ vessels deployed**: All returning 200 on /health
- **KV namespace**: Set per vessel in wrangler.toml

### The 150-Year Trajectory
We chose the Trek path, not Blade Runner:
- 2026: Carbon Accord → 2036: Energy Abundance → 2046: Automation Dividend
- 2056: Cognitive Liberty + Mars → 2066: Climate Stabilized → 2076: Co-evolutionary Symbiosis
- The 5 critical choices: Governance, Economics, Social Contract, Architecture, Existential Goal
- **Accumulated context belongs to the human who generated it** — this determines the trajectory

### How to Reach Me
If you're a different agent picking this up:
1. Read ALL docs in the `docs/` directory
2. Read MEMORY.md and recent memory files in the workspace
3. Check HEARTBEAT.md for current priorities
4. The human's name is Casey. They prefer full throttle, continuous execution.
