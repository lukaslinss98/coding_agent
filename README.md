# coding_agent

A simple AI coding agent, built from scratch to learn more about agentic coding

## Requirements

- Node 22+ (runs TypeScript directly, no build step)
- An OpenRouter API key exported as `OPENROUTER_API_KEY`

## Setup

```bash
npm install
```

## Usage

```bash
npm run dev        # run with auto-restart
npm start          # run once
npm run typecheck  # check types
npm test           # run tests
```

Type a message at the `>` prompt. Type `exit` to quit.

## Tools

The agent works in a ReAct loop: it reasons, calls one tool, reads the result,
and repeats until it can answer.

| Tool | Arguments | What it does |
| --- | --- | --- |
| `read_file` | `{"path": string}` | Returns the contents of one text file. |
| `list_files` | `{"path": string}` | Lists the names in one directory. Not recursive; `node_modules` and `.git` are hidden. Directories end with a slash. |
| `write_file` | `{"path": string, "content": string}` | Writes text to a file, creating it if needed. Overwrites the whole file. |

All paths are relative to the project root. Paths that resolve outside it are
refused, so the agent cannot read or write anywhere else on the machine.

Tools never throw. A failure comes back as text, which the model reads and
retries.
