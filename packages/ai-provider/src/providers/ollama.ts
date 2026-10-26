// ============================================================
// Ollama Provider — Local models (free, private, offline)
// Requires Ollama running at localhost:11434
// Supports: llama3.1, mistral, phi3, gemma2, etc.
// ============================================================
import type { AIProvider, Message, Tool, ToolCall, AIProviderOptions, ProviderConfig } from "../index";

export class OllamaProvider implements AIProvider {
  readonly name = "ollama";
  readonly model: string;
  private baseUrl: string;

  constructor(config: ProviderConfig) {
    this.model = config.model ?? "llama3.1";
    this.baseUrl = config.baseUrl ?? "http://localhost:11434";
  }

  async chat(messages: Message[], options?: AIProviderOptions): Promise<string> {
    // TODO: Implement Ollama /api/chat endpoint
    // No API key needed — fully local!
    throw new Error("Not implemented yet — coming in v0.8");
  }

  async callWithTools(
    messages: Message[],
    tools: Tool[],
    options?: AIProviderOptions
  ): Promise<{ response: string; toolCalls: ToolCall[] }> {
    // TODO: Implement Ollama tool calling (requires models with tool support)
    throw new Error("Not implemented yet — coming in v0.8");
  }

  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`);
      return response.ok;
    } catch {
      return false;
    }
  }
}
