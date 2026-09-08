import { stdin, stdout } from "node:process"
import * as readline from "node:readline/promises"
import OpenAi from "openai"
import { Agent } from "./agent.ts"

async function main() {

  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY

  const client = new OpenAi({
    apiKey: OPENROUTER_API_KEY,
    baseURL: "https://openrouter.ai/api/v1"
  })

  const agent = new Agent(client, 'z-ai/glm-5.3-flash')

  const rl = readline.createInterface({
    input: stdin,
    output: stdout
  })


  while (true) {
    const input = await rl.question('> ')

    if (input === 'exit') {
      console.log('Agent exiting');
      break;
    };


    const response = await agent.callModel(input)

    console.log(response.content);

  }

  rl.close()

}

main().catch((err: unknown) => {
  const errorMessage = err instanceof Error ? err.message : String(err)
  console.error(errorMessage);
  process.exitCode = 1
})
