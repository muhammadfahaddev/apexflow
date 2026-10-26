// ============================================================
// ApexFlow — Groq Provider (Ultra-fast LLM execution)
// Uses Groq Cloud API (OpenAI-compatible endpoint)
// Model: llama-3.3-70b-versatile, llama-3.1-8b-instant, etc.
// ============================================================

import type { AIProvider, Message, Tool, ToolCall, AIProviderOptions, ProviderConfig } from "../index";

export class GroqProvider implements AIProvider {
  readonly name = "groq";
  readonly model: string;
  private apiKey: string;
  private baseUrl = "https://api.groq.com/openai/v1";

  constructor(config: ProviderConfig) {
    const key = config.apiKey || process.env.GROQ_API_KEY;
    if (!key) {
      throw new Error("GROQ_API_KEY is required to initialize GroqProvider");
    }
    this.apiKey = key;
    this.model = config.model || process.env.GROQ_MODEL || "llama-3.3-70b-versatile";
  }

  async chat(messages: Message[], options?: AIProviderOptions): Promise<string> {
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: options?.model || this.model,
        messages,
        temperature: options?.temperature ?? 0.2,
        max_tokens: options?.maxTokens ?? 1024,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Groq API Error (${response.status}): ${err}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "";
  }

  async callWithTools(
    messages: Message[],
    tools: Tool[],
    options?: AIProviderOptions
  ): Promise<{ response: string; toolCalls: ToolCall[] }> {
    const formattedTools = tools.map((t) => ({
      type: "function",
      function: {
        name: t.name,
        description: t.description,
        parameters: t.parameters,
      },
    }));

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: options?.model || this.model,
        messages,
        tools: formattedTools.length > 0 ? formattedTools : undefined,
        tool_choice: formattedTools.length > 0 ? "auto" : undefined,
        temperature: options?.temperature ?? 0.1,
        max_tokens: options?.maxTokens ?? 500,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Groq Tool Call Error (${response.status}): ${err}`);
    }

    const data = await response.json();
    const choice = data.choices?.[0]?.message;
    const content = choice?.content || choice?.reasoning || "";
    const rawToolCalls = choice?.tool_calls || [];

    const toolCalls: ToolCall[] = rawToolCalls.map((tc: any) => ({
      toolName: tc.function.name,
      args: typeof tc.function.arguments === "string" ? JSON.parse(tc.function.arguments) : tc.function.arguments,
    }));

    return {
      response: content,
      toolCalls,
    };
  }

  async healthCheck(): Promise<boolean> {
    try {
      const res = await this.chat([{ role: "user", content: "ping" }], { maxTokens: 5 });
      return !!res;
    } catch {
      return false;
    }
  }
}
