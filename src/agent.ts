import type OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources.js";
import { parseReactReply as parseReActReply } from "./react.ts";
import { tools, toolsDescription } from "./tools/tools.ts";

type ModelResponse = {
  content: string;
};

const MAX_STEPS = 20;

const SYSTEM_PROMPT = `
You are a helpful coding assistent. You have access to these tools:

${toolsDescription}

To use a tool, reply in exactly this format:

Thought: <why>
Action: <tool name>
Action Input: {<args object>}

Stop after Action Input. I will reply with the result:

Observation: <the result of the tool - I write this line, never you>

Then continue with another Thought, or finish with:

Final Answer: <answer>
`;

export class Agent {
  private client: OpenAI;
  private model: string;
  private messages: ChatCompletionMessageParam[];
  private onStep: (s: string) => void;

  constructor(client: OpenAI, model: string, onStep: (s: string) => void) {
    this.client = client;
    this.model = model;
    this.onStep = onStep;
    this.messages = [
      {
        role: "system",
        content: SYSTEM_PROMPT,
      },
    ];
  }

  async callModel(input: string): Promise<ModelResponse> {
    this.messages.push({
      role: "user",
      content: input,
    });

    for (let i = 0; i < MAX_STEPS; i++) {
      const response = await this.client.chat.completions.create({
        messages: this.messages,
        model: this.model,
        stop: ["Observation:"],
      });

      const choice = response.choices[0];
      if (choice === undefined || choice.message.content === null) {
        throw new Error("model did not return response");
      }

      this.messages.push({
        role: "assistant",
        content: choice.message.content,
      });

      const reply = parseReActReply(choice.message.content);

      switch (reply.kind) {
        case "final":
          return { content: reply.answer };
        case "action": {
          this.onStep(`Calling tool ${reply.tool}`);
          const result = await this.executeTool(reply.tool, reply.input);
          this.messages.push({
            role: "user",
            content: `Observation: ${result}`,
          });
          break;
        }
        case "error":
          this.messages.push({ role: "user", content: reply.message });
          break;
      }
    }

    return {
      content: `model did not arrive at final answer after ${MAX_STEPS} maximum steps`,
    };
  }

  async executeTool(toolName: string, input: string): Promise<string> {
    let args: unknown;

    try {
      args = JSON.parse(input);
    } catch (err) {
      return `Could not parse input args for tool. Threw error ${err}`;
    }

    const tool = tools[toolName];

    if (tool === undefined) {
      return `Unknown tool ${toolName}. Available tools ${toolsDescription}`;
    }

    return tool.function(args);
  }
}
