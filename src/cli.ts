import { parseArgs } from "node:util";

const options = {
  model: {
    type: "string",
    default: "openrouter/free",
    description: "Model to use",
  },
  help: {
    type: "boolean",
    short: "h",
    default: false,
    description: "Show this help message",
  },
} as const;

export function cliArguments() {
  const args = parseArgs({ options });

  return args.values;
}

export function helpText() {
  const lines = Object.entries(options).map(([name, opt]) => {
    const flag = "short" in opt ? `-${opt.short}, --${name}` : `--${name}`;
    return `  ${flag.padEnd(16)} ${opt.description}`;
  });

  return `Usage: agent [options]\n\nOptions:\n${lines.join("\n")}`;
}
