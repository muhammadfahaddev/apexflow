// ============================================================
// OpenAI Provider (also used for custom OpenAI-compatible endpoints)
// ============================================================
import type { AIProvider, Message, Tool, ToolCall, AIProviderOptions, ProviderConfig } from "../index";

export class OpenAIProvider implements AIProvider {
  readonly name = "openai";
  readonly model: string;
  private apiKey: string;
  private baseUrl: string;

  constructor(config: ProviderConfig) {
    if (!config.apiKey) throw new Error("OPENAI_API_KEY is required");
    this.apiKey = config.apiKey;
    this.model = config.model ?? "gpt-4o";
    this.baseUrl = config.baseUrl ?? "https://api.openai.com/v1";
  }

  async chat(messages: Message[], options?: AIProviderOptions): Promise<string> {
    // TODO: Implement OpenAI chat completion
    throw new Error("Not implemented yet — coming in v0.5");
  }

  async callWithTools(
    messages: Message[],
    tools: Tool[],
    options?: AIProviderOptions
  ): Promise<{ response: string; toolCalls: ToolCall[] }> {
    // TODO: Implement OpenAI function calling
    throw new Error("Not implemented yet — coming in v0.5");
  }

  async healthCheck(): Promise<boolean> {
    return false;
  }
}
