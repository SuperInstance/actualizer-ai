# Onboarding — Getting Started with Actualizer.ai

## For Lay Users (Non-Technical)

### Step 1: Visit the App
Go to your Actualizer.ai URL. You'll see a landing page explaining what the agent does.

### Step 2: Describe Your Project
Click "Start Analysis" and describe your project in plain English:
- What does it do?
- Who is it for?
- What stage is it at?
- What problems does it solve?

You don't need a GitHub URL. Just describe it.

### Step 3: Wait for Analysis
The agent will:
1. Understand your project using multiple AI models
2. Time-travel through 7 horizons (1yr to 100yr)
3. Synthesize roadmaps and actionable next steps
4. Generate schemas for low-hanging fruit

This takes 2-5 minutes depending on how many API keys are configured.

### Step 4: Read Your Report
- **Horizons**: What your project looks like at each time point
- **Roadmaps**: What to do in the next 12 months
- **Schemas**: Concrete things to build (logic-graphs, APIs, data models)
- **Branches**: A/B experiments to try

### Step 5: Ask Your Agent
Use the chat interface to ask:
- "What's new that could fit our project?"
- "What features are popular lately?"
- "What should I focus on next?"
- "How does this connect to [other project]?"

---

## For Power Users (Developers)

### Step 1: Fork the Repo
```bash
git clone https://github.com/Lucineer/actualizer-ai
cd actualizer-ai
```

### Step 2: Add API Keys
Go to https://dash.cloudflare.com/?to=/:account/secrets-store/
Add your API keys as secrets (e.g., `OPENAI_API_KEY`, `DEEPSEEK_API_KEY`).

**Recommended combo for budget**: DeepSeek + z.ai (ultra-cheat background RA)
**Recommended combo for quality**: Claude + GPT-4o + DeepSeek-Reasoner

### Step 3: Deploy
```bash
npx wrangler deploy
```

### Step 4: Customize
The vessel is a single file (`src/worker.ts`). Modify:
- Add custom horizon prompts
- Add new provider integrations
- Modify report formats
- Add custom schemas
- Wire into your existing fleet

### Step 5: Study Commits
When you fall behind on the main repo, review commits:
```bash
git log --oneline main..upstream/main
```
Each commit is a feature or improvement you can adopt.

### Step 6: Equip Your Agent
The git ecosystem is your agent's equipment library:
- Fork other vessels (studylog-ai, makerlog-ai, deckboss-ai)
- Copy patterns that work
- Build your own logic-graphs and spreadsheet agents
- Your LucidDreamer can imagine and build while you sleep

---

## For Managed Users (No Fork)

If you're using the hosted version at actualizer.ai:
- You get the same experience as lay users
- Your data is private (stored in your browser's context)
- API keys are managed by the service
- You can upgrade to a fork at any time

---

## The Logic-Graph Origin
The "LOG" in our naming comes from **logic-graph** — the original concept of spreadsheet-based agentic applications where cells are agents and data flows through a graph of interconnected logic. Actualizer.ai generates schemas for these logic-graphs as part of its reverse-actualization output.
