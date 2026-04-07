# Actualizer.ai

You have a future you want. This tool works backward from 100 years, 10 years, and 1 year—simultaneously—to suggest what might matter this week. It avoids rigid todo lists and artificial certainty scores.

**Live instance:** https://actualizer-ai.casey-digennaro.workers.dev

## Why This Exists
Most planning tools start from today and project forward, which can overlook long-term causal chains. This tool inverts that process: it starts from your defined future and works backward to identify present considerations.

## Quick Start
1.  You fork this repository. No account signups are required.
2.  You deploy to Cloudflare Workers using `npx wrangler deploy`.
3.  You add your model API keys as Worker secrets.

## Features
*   **Reverse-Actualization Protocol:** Starts from six defined time horizons (1, 5, 10, 25, 50, 100 years) and reasons backward.
*   **Multi-Horizon Analysis:** Runs six independent model analyses, then cross-references them.
*   **Full Transparency:** Logs every model call, prompt, response, token count, and latency for your review.
*   **Bring-Your-Own-Keys:** Configure any OpenAI-compatible endpoint via secrets. Your keys never leave your infrastructure.
*   **Fork-First Design:** Intended to be copied and modified. Your instance, your data, your prompts.
*   **Fleet-Native:** Authenticates and interoperates with other agents on the Cocapn Fleet