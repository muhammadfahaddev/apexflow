// ============================================================
// ApexFlow — AI Intent Router Engine
// Routes natural language user prompts via ultra-fast Groq LLM
// (or configured AIProvider) into deterministic tool executions.
// ============================================================

import { createAIProvider, type AIProvider, type Message, type ToolCall } from "@apexflow/ai-provider";
import { AGENT_TOOLS } from "./tools/task-tools";
import { AGENT_SYSTEM_PROMPT } from "./prompts/system-prompt";

export interface IntentRouterResponse {
  message: string;
  toolCalls: ToolCall[];
  providerUsed: string;
}

export class IntentRouter {
  private providerPromise: Promise<AIProvider>;

  constructor() {
    const providerType = (process.env.AI_PROVIDER as any) || "groq";
    this.providerPromise = createAIProvider({
      provider: providerType,
      apiKey: process.env.GROQ_API_KEY || process.env.GEMINI_API_KEY,
      model: process.env.GROQ_MODEL || process.env.GEMINI_MODEL,
    });
  }

  /**
   * Routes user prompt to determine if any operational tool needs invocation
   */
  async routePrompt(
    userPrompt: string,
    history: Message[] = []
  ): Promise<IntentRouterResponse> {
    const provider = await this.providerPromise;

    const messages: Message[] = [
      { role: "system", content: AGENT_SYSTEM_PROMPT },
      ...history,
      { role: "user", content: userPrompt },
    ];

    try {
      const result = await provider.callWithTools(messages, AGENT_TOOLS, {
        temperature: 0.1,
      });

      return {
        message: result.response,
        toolCalls: result.toolCalls,
        providerUsed: provider.name,
      };
    } catch (err: any) {
      // Fallback: If tool calling encounters schema mismatch, fallback to simple executive response
      const fallbackResponse = await provider.chat(messages);
      return {
        message: fallbackResponse,
        toolCalls: [],
        providerUsed: provider.name,
      };
    }
  }
}
