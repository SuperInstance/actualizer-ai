# Actualizer.ai — Architecture

## Overview
Actualizer.ai is a minimal Cloudflare Worker vessel with reverse-actualization (RA) as a first-class protocol. It clones any repo, runs multi-model parallel ideation across 7 time horizons, and synthesizes actionable roadmaps.

## The Paradigm
- The repo IS the agent
- This agent thinks in centuries, builds in sprints
- Multi-model synthesis produces insights no single model could
- Documentation is first-class — agents reference docs, not maintain context

## File Structure
```
actualizer-ai/
├── src/
│   └── worker.ts          # Single-file vessel (all logic inline)
├── docs/
│   ├── ARCHITECTURE.md             # This file
│   ├── REVERSE-ACTUALIZATION-PROTOCOL.md  # How RA works
│   ├── MODEL-EFFECTIVENESS.md      # Per-model tracking methodology
│   ├── ONBOARDING.md               # Getting started guide
│   └── BATON-HANDOFF.md            # What to remember when you return
├── wrangler.toml
└── README.md
```

## Core Modules (inline in worker.ts)

### BYOK v2
- 16 providers across 4 tiers: Local (free) → Ultra-cheap background → Budget → Premium
- All keys via Cloudflare Secrets Store (env bindings)
- Priority: Secrets Store → Cookie → Header
- Zero keys stored in code or KV

### RA Engine
- 7 horizons: 1yr, 3yr, 5yr, 10yr, 25yr, 50yr, 100yr
- Each horizon: user lives, cultural shifts, tech changes, monetary model, turning points
- ≥25yr horizons produce compass bearings, not maps
- Backward synthesis: 100yr → now, extracting critical decisions

### Multi-Model Parallel
- Calls all configured providers simultaneously
- Records: model, provider, task, prompt, response, quality, cost, tokens, latency
- Per-project learning: which models excel at which tasks

### Report System
- KV-stored reports with unique IDs
- Includes: horizons, roadmaps, schemas, branches, model tracking
- Latest report always available at `ra:latest`

## Routes
| Route | Method | Description |
|-------|--------|-------------|
| / | GET | Landing page |
| /app | GET | Analysis interface |
| /setup | GET | Key setup instructions |
| /health | GET | Status + configured providers |
| /api/ra/run | POST | Execute reverse-actualization |
| /api/ra/reports | GET | List all reports |
| /api/ra/report | GET | Get specific report (?id=) |
| /api/models/report | GET | Model effectiveness data |
| /api/schemas | GET | Generated schemas |
| /api/branches | GET | A/B branch proposals |
| /api/docs | GET | Documentation index |
| /api/chat | POST | Chat with the agent |

## Data Flow
1. User provides repo URL or description
2. Multi-model analysis builds understanding (3 providers)
3. Each horizon simulated with ALL providers (parallel)
4. Backward synthesis from 100yr to now (3 providers)
5. Roadmaps, schemas, branches extracted
6. Model tracking data saved
7. Report stored in KV, accessible via API

## Design Principles
- **Zero runtime deps**: Pure TypeScript, no npm packages
- **Inline HTML**: No ASSETS binding, CSP-safe
- **KV-only state**: No Durable Objects needed (can upgrade later)
- **Document-heavy**: Agents read docs, don't maintain context
- **Fork-first**: Power users fork, lay users visit the app

## Access Patterns
- **Power user**: Forks repo, adds keys to Secrets Store, runs analyses, studies commits, reviews schemas
- **Lay user**: Visits /app, pastes project description, clicks "Run Analysis", reads report, asks chatbot "what's new?"
- **LucidDreamer**: Background RA runs on cheap coding plans (z.ai, MiniMax, Alibaba) during idle time
