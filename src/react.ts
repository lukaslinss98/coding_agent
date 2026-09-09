export type ParseResult =
  | { kind: "final"; answer: string }
  | { kind: "action"; tool: string; input: string }
  | { kind: "error"; message: string };

const FINAL_ANSWER = "Final Answer:";
const ACTION = "Action:";
const ACTION_INPUT = "Action Input:";

export function parseReactReply(text: string): ParseResult {
  const lines = text.split("\n");

  for (const [i, line] of lines.entries()) {
    const trimmed = line.trimStart();

    if (trimmed.startsWith(FINAL_ANSWER)) {
      const rest = [trimmed.slice(FINAL_ANSWER.length), ...lines.slice(i + 1)];
      return { kind: "final", answer: rest.join("\n").trim() };
    }

    if (trimmed.startsWith(ACTION)) {
      const tool = trimmed.slice(ACTION.length).trim();
      const input = findLineValue(lines.slice(i + 1), ACTION_INPUT);

      if (input === null) {
        return {
          kind: "error",
          message: `Your reply had "${ACTION}" but no "${ACTION_INPUT}".`,
        };
      }

      return { kind: "action", tool, input };
    }
  }

  if (findLineValue(lines, ACTION_INPUT) !== null) {
    return {
      kind: "error",
      message: `Your reply had "${ACTION_INPUT}" but no "${ACTION}".`,
    };
  }

  return {
    kind: "error",
    message: `Your reply had no "${ACTION}" and no "${FINAL_ANSWER}". Reply in the required format.`,
  };
}

function findLineValue(lines: string[], prefix: string): string | null {
  for (const line of lines) {
    const trimmed = line.trimStart();
    if (trimmed.startsWith(prefix)) {
      return trimmed.slice(prefix.length).trim();
    }
  }
  return null;
}
