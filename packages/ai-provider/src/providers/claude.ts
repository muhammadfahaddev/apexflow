// ============================================================
// Claude Provider (Anthropic)
// ============================================================
import type { AIProvider, Message, Tool, ToolCall, AIProviderOptions, ProviderConfig } from "../index";

export class ClaudeProvider implements AIProvider {
  readonly name = "claude";
  readonly model: string;
  private apiKey: string;

  constructor(config: ProviderConfig) {
    if (!config.apiKey) throw new Error("ANTHROPIC_API_KEY is required");
    this.apiKey = config.apiKey;
    this.model = config.model ?? "claude-3-5-sonnet-20241022";
  }

  async chat(messages: Message[], options?: AIProviderOptions): Promise<string> {
    // TODO: Implement Anthropic Messages API
    throw new Error("Not implemented yet — coming in v0.6");
  }

  async callWithTools(
    messages: Message[],
    tools: Tool[],
    options?: AIProviderOptions
  ): Promise<{ response: string; toolCalls: ToolCall[] }> {
    // TODO: Implement Claude tool use
    throw new Error("Not implemented yet — coming in v0.6");
  }

  async healthCheck(): Promise<boolean> {
    return false;
  }
}
