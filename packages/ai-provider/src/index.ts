// ============================================================
// ApexFlow — BYOAI: AI Provider Abstraction
// Switch between Gemini, OpenAI, Claude, Ollama without
// changing any agent code.
// ============================================================

export interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface Tool {
  name: string;
  description: string;
  parameters: Record<string, unknown>; // JSON Schema
}

export interface ToolCall {
  toolName: string;
  args: Record<string, unknown>;
}

export interface AIProviderOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

/**
 * All AI providers must implement this interface.
 * This allows the entire agent to be provider-agnostic.
 */
export interface AIProvider {
  readonly name: string;
  readonly model: string;

  /**
   * Simple chat completion — for summaries, descriptions, etc.
   */
  chat(messages: Message[], options?: AIProviderOptions): Promise<string>;

  /**
   * Tool-calling — for agent actions (create task, send email, etc.)
   */
  callWithTools(
    messages: Message[],
    tools: Tool[],
    options?: AIProviderOptions
  ): Promise<{ response: string; toolCalls: ToolCall[] }>;

  /**
   * Check if the provider is configured and reachable.
   */
  healthCheck(): Promise<boolean>;
}

// ── Provider Factory ─────────────────────────────────────────

export type AIProviderType =
  | "groq"
  | "gemini"
  | "openai"
  | "claude"
  | "ollama"
  | "custom";

export interface ProviderConfig {
  provider: AIProviderType;
  apiKey?: string;
  model?: string;
  baseUrl?: string;
}

export async function createAIProvider(
  config: ProviderConfig
): Promise<AIProvider> {
  switch (config.provider) {
    case "groq": {
      const { GroqProvider } = await import("./providers/groq");
      return new GroqProvider(config);
    }
    case "gemini": {
      const { GeminiProvider } = await import("./providers/gemini");
      return new GeminiProvider(config);
    }
    case "openai": {
      const { OpenAIProvider } = await import("./providers/openai");
      return new OpenAIProvider(config);
    }
    case "claude": {
      const { ClaudeProvider } = await import("./providers/claude");
      return new ClaudeProvider(config);
    }
    case "ollama": {
      const { OllamaProvider } = await import("./providers/ollama");
      return new OllamaProvider(config);
    }
    case "custom": {
      // OpenAI-compatible endpoint
      const { OpenAIProvider } = await import("./providers/openai");
      return new OpenAIProvider(config);
    }
    default:
      throw new Error(`Unknown AI provider: ${config.provider}`);
  }
}
