import type OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources.js";

export class Agent {

  private client: OpenAI;
  private model: string;
  private messages: ChatCompletionMessageParam[]

  constructor(
    client: OpenAI,
    model: string
  ) {
    this.client = client;
    this.model = model;
    this.messages = []
  }

  async inference(input: string): Promise<string> {

    this.messages.push({
      role: 'user',
      content: input
    })

    const response = await this.client.chat.completions.create({
      messages: this.messages,
      model: this.model
    })

    const message = response.choices[0].message;

    this.messages.push(message)


    if (message.content == null) {
      throw new Error('model did not return response')
    }
    return message.content;
  }


}
