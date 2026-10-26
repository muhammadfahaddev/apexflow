// ============================================================
// Gemini Provider — Default (recommended for Google Workspace)
// ============================================================
import type { AIProvider, Message, Tool, ToolCall, AIProviderOptions, ProviderConfig } from "../index";

export class GeminiProvider implements AIProvider {
  readonly name = "gemini";
  readonly model: string;
  private apiKey: string;

  constructor(config: ProviderConfig) {
    if (!config.apiKey) throw new Error("GEMINI_API_KEY is required");
    this.apiKey = config.apiKey;
    this.model = config.model ?? "gemini-1.5-pro";
  }

  async chat(messages: Message[], options?: AIProviderOptions): Promise<string> {
    // TODO: Implement Gemini API call
    // Reference: https://ai.google.dev/api/rest/v1beta/models/generateContent
    throw new Error("Not implemented yet — coming in v0.1");
  }

  async callWithTools(
    messages: Message[],
    tools: Tool[],
    options?: AIProviderOptions
  ): Promise<{ response: string; toolCalls: ToolCall[] }> {
    // TODO: Implement Gemini function calling
    throw new Error("Not implemented yet — coming in v0.1");
  }

  async healthCheck(): Promise<boolean> {
    // TODO: Ping Gemini API
    return false;
  }
}
