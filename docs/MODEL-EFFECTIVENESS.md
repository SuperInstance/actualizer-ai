# Model Effectiveness Tracking

## Purpose
Track how different models perform on different tasks for YOUR specific project. Over time, this builds a project-specific model routing table.

## What We Track
For every model call:
- **Model**: e.g., deepseek-chat, gpt-4o, kimi-k2.5
- **Provider**: e.g., deepseek, openai, moonshot
- **Task**: e.g., repo-understanding, horizon-1yr, backward-synthesis, documentation
- **Prompt**: The actual prompt sent
- **Response**: The actual response received
- **Quality**: 0-10 (initially 0, human or agent-assigned)
- **Cost**: Estimated cost in USD
- **Tokens**: Total tokens used
- **LatencyMs**: Round-trip time
- **Timestamp**: When the call was made

## Task Types
| Task | Description | Best Models (observed) |
|------|-------------|----------------------|
| repo-understanding | Analyze architecture, users, maturity | Claude, GPT-4o, DeepSeek-Reasoner |
| horizon-1yr | Concrete 1-year projection | DeepSeek-chat, GPT-4o |
| horizon-5yr | Ecosystem effects | Kimi K2.5, DeepSeek-Reasoner |
| horizon-25yr | Compass bearings | DeepSeek-Reasoner, Claude |
| horizon-100yr | North star vision | DeepSeek-Reasoner (most novel) |
| backward-synthesis | 100yr→now extraction | Claude, GPT-4o, Qwen3-Coder |
| documentation | Handoff docs, onboarding | Claude, GPT-4o |
| code-generation | Schema implementation | Qwen3-Coder, DeepSeek-chat |

## Provider Cost Comparison
| Provider | Input/M tokens | Output/M tokens | Best For |
|----------|---------------|-----------------|----------|
| z.ai GLM | ~$0.07 | ~$0.07 | Background RA, ultra-cheap |
| DeepSeek | $0.14 | $0.28 | Bulk analysis, good quality |
| MiniMax | ~$0.08 | ~$0.08 | Background tasks (time-based plans) |
| Moonshot Kimi | ~$0.12 | ~$0.12 | Long context, creative |
| Groq | $0.59 | $0.79 | Speed-sensitive tasks |
| SiliconFlow | ~$0.50 | ~$0.50 | Qwen3-Coder for code |
| Together AI | ~$0.50 | ~$0.50 | Open-source model access |
| Mistral | $2.00 | $6.00 | EU-based, multilingual |
| OpenAI | $5.00 | $15.00 | Premium quality, reliability |
| Anthropic | $3.00 | $15.00 | Reasoning, long context |
| Ollama (local) | $0 | $0 | Your hardware, free |

## Coding Plan Strategy
Models with time-based limits (z.ai, MiniMax, Alibaba) are ideal for LucidDreamer/background tasks:
- When user is idle, throttle up background RA on cheap plans
- User's expensive model handles interactive chat
- 80-90% cost reduction on background tasks

## Reading the Data
Model tracking data is stored in KV at `models:{model}:{timestamp}`.
Access via `/api/models/report` endpoint.
Quality scores are initially 0 — the human assigns them by reviewing responses.
Over time, the system learns which models to route which tasks to.

## The Accumulation Theorem Applied
I = M · B^α · Q^β
- M = model capability
- B = breadth of tasks attempted
- Q = quality of outputs
- The more you use the system, the better it routes (α, β increase)
