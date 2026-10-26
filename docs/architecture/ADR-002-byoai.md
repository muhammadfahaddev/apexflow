# ADR-002: Bring Your Own AI (BYOAI) Architecture

**Status:** Accepted  
**Date:** 2026-10-26

---

## Context

Open-source AI projects face a critical adoption barrier: if the project requires a specific paid AI API (e.g., only OpenAI), many potential users either:
- Cannot afford it
- Don't want to share data with that provider
- Live in regions where the API is unavailable
- Prefer local/private models

Additionally, locking into one provider creates risk if that provider changes pricing or availability.

## Decision

Abstract all AI interactions behind a single `AIProvider` interface in `packages/ai-provider/`:

```typescript
interface AIProvider {
  chat(messages: Message[]): Promise<string>;
  callWithTools(messages, tools): Promise<{ response, toolCalls }>;
  healthCheck(): Promise<boolean>;
}
```

Supported providers:
1. **Google Gemini** (default — best Google Workspace integration)
2. **OpenAI GPT-4o** (most popular, high community trust)
3. **Anthropic Claude** (strong reasoning)
4. **Ollama** (local, free, completely private)
5. **Custom** (any OpenAI-compatible endpoint)

User switches provider via single environment variable: `AI_PROVIDER=gemini|openai|claude|ollama|custom`

## Rationale

- **Maximum adoption**: Users aren't locked to one provider
- **Privacy option**: Ollama lets users run everything locally
- **Free option**: Gemini free tier + Ollama = zero AI cost
- **Community contribution**: Adding a new provider is a well-defined, isolated task
- **Resilience**: If one provider has an outage, users can switch

## Default Choice: Gemini

Gemini is the default because:
- Best integration with Google Workspace (same ecosystem as Gmail/Calendar/Drive)
- Free tier is generous for personal use
- Tool calling support is mature
- Context window is large (1M tokens for Gemini 1.5 Pro)

## Consequences

- **Positive:** Open-source project doesn't require paid API to start
- **Positive:** Contributor can add new provider as isolated PR
- **Positive:** Privacy-focused users can self-host with Ollama (zero external AI calls)
- **Negative:** Testing must cover all providers or mock the interface
- **Negative:** Some providers have different tool-calling formats (handled in each provider implementation)
