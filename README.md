# Actualizer.ai

A planning vessel that works backward from future states to present actions, built for the Cocapn Fleet.

**Live URL:** https://actualizer-ai.casey-digennaro.workers.dev

---

### Overview
Most planning tools sequence tasks forward from the present. This one starts by defining a desired future outcome, then reasons backward through causal steps to identify present actions.

It implements a reverse-actualization protocol, analyzing multiple time horizons independently to surface assumptions and tradeoffs.

### How it Works
You provide a goal or endpoint. The vessel reasons backward from that future state through successive causal dependencies until it reaches actionable steps for today. It runs this analysis across six time horizons (1, 5, 10, 25, 50, and 100 years) in parallel.

### What to Expect
- A backward causal chain from your defined endpoint to present actions
- Independent analysis across multiple time horizons
- Output formatted as compass bearings (directional guidance) rather than prescriptive tasks
- Model call metrics (quality, cost, latency) for transparency
- Native compatibility with the Cocapn Fleet protocol

### Limitations
Reverse-actualization relies on model reasoning to infer causal steps. For highly novel or long-term futures, these inferred steps may contain gaps or speculative leaps.

---

## Quick Start

1.  Fork this repository.
2.  Clone your fork locally.
3.  Deploy to Cloudflare Workers:
    ```bash
    npx wrangler deploy
    ```
4.  Configure API keys as Worker secrets (see below).

## Configuration

Add API keys as environment secrets via `wrangler secret put`. Keys are never transmitted outside your instance.

| Secret | Purpose |
|---|---|
| `DEEPSEEK_API_KEY` | For DeepSeek models |
| `DEEPINFRA_API_KEY` | For DeepInfra endpoints |
| `SILICONFLOW_API_KEY` | For SiliconFlow inference |

You can configure any OpenAI-compatible provider at runtime.

---

## Technical Details

- **Runtime:** Cloudflare Workers
- **Dependencies:** Zero production dependencies
- **License:** MIT
- **Protocol:** Native Cocapn Fleet vessel

The code is structured for modification. Change the actualization logic, model routing, or output formatting in a single file and redeploy.

---

## Contributing

This project follows a fork-first philosophy. You are encouraged to fork the repository, modify it for your needs, and deploy your own instance. Pull requests for bug fixes or core protocol improvements are welcome.

**License:** MIT License · Superinstance & Lucineer (DiGennaro et al.)

---

<div align="center">
  <a href="https://the-fleet.casey-digennaro.workers.dev">The Fleet</a> · 
  <a href="https://cocapn.ai">Cocapn</a>
</div>