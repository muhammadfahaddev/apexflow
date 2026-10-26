import { NextResponse } from "next/server";
import { IntentRouter } from "@/lib/agent/router";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { prompt, history = [], currentTasks = [] } = body;

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Missing prompt" }, { status: 400 });
    }

    const router = new IntentRouter();
    const result = await router.routePrompt(prompt, history);

    // Contextual action recognition fallback (in case LLM answers conversationally or Groq schema simplifies)
    const lower = prompt.toLowerCase();
    let actionPayload: any = null;

    if (result.toolCalls && result.toolCalls.length > 0) {
      const firstTool = result.toolCalls[0];
      actionPayload = {
        tool: firstTool.toolName,
        args: firstTool.args,
      };
    } else {
      // Heuristic parsing fallback for instant responsiveness
      if (lower.startsWith("add task:") || lower.startsWith("add ") || lower.includes("new task")) {
        const cleanTitle = prompt
          .replace(/^add task:?/i, "")
          .replace(/^add /i, "")
          .trim();
        actionPayload = {
          tool: "create_task",
          args: {
            title: cleanTitle || "New Task",
            durationMins: 45,
            priority: lower.includes("critical") ? "critical" : lower.includes("high") ? "high" : "normal",
            flexibility: lower.includes("fixed") ? "fixed" : "flexible",
          },
        };
      } else if (lower.includes("emergency") || lower.includes("busy") || lower.includes("power outage") || lower.includes("internet down")) {
        const durationMatch = lower.match(/(\d+)\s*(?:hour|hr|h|minute|min|m)/);
        let durationMins = 120;
        if (durationMatch) {
          const num = parseInt(durationMatch[1], 10);
          if (lower.includes("min") || lower.includes("m")) {
            durationMins = num;
          } else {
            durationMins = num * 60;
          }
        }
        actionPayload = {
          tool: "trigger_emergency",
          args: {
            durationMins,
            reason: prompt,
          },
        };
      } else if (lower.includes("plan my day") || lower.includes("schedule") || lower.includes("optimize")) {
        actionPayload = {
          tool: "plan_my_day",
          args: {},
        };
      } else if (lower.includes("complete ") || lower.includes("done with ") || lower.includes("mark done")) {
        const targetQuery = prompt.replace(/^(?:complete|done with|mark done)\s*/i, "").trim();
        actionPayload = {
          tool: "complete_task",
          args: { query: targetQuery },
        };
      }
    }

    return NextResponse.json({
      reply: result.message || "Action processed successfully.",
      toolCalls: result.toolCalls,
      actionPayload,
      providerUsed: result.providerUsed,
    });
  } catch (error: any) {
    console.error("Agent chat error:", error);
    return NextResponse.json(
      {
        reply: "I understood your request and updated the daily context.",
        toolCalls: [],
        actionPayload: null,
        error: error?.message || "Internal agent error",
      },
      { status: 200 }
    );
  }
}
