#!/usr/bin/env node

import { stdin, stdout } from "node:process"
import * as readline from "node:readline/promises"
import OpenAi from "openai"
import { Agent } from "./agent.ts"
import { cliArguments, helpText } from "./cli.ts"

async function main() {

  const { model, help } = cliArguments()

  if (help) {
    console.log(helpText());
    return
  }

  console.log(`harness started with model: ${model}`)

  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY

  const client = new OpenAi({
    apiKey: OPENROUTER_API_KEY,
    baseURL: "https://openrouter.ai/api/v1"
  })

  const agent = new Agent(client, model, (s) => console.log(s))

  const rl = readline.createInterface({
    input: stdin,
    output: stdout
  })


  rl.setPrompt('> ')
  rl.prompt()

  for await (const input of rl) {
    if (input === 'exit') {
      console.log('Agent exiting');
      break;
    };

    try {
      const response = await agent.callModel(input)
      console.log(response.content)
    } catch (err) {
      console.error("Error:", err instanceof Error ? err.message : String(err))
    }

    rl.prompt()
  }

  rl.close()
}

main().catch((err: unknown) => {
  const errorMessage = err instanceof Error ? err.message : String(err)
  console.error(errorMessage);
  process.exitCode = 1
})
