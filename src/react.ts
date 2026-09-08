export type ParseResult =
  | { kind: "final"; answer: string }
  | { kind: "action"; tool: string; input: string }
  | { kind: "error"; message: string }

const FINAL_ANSWER = "Final Answer:"
const ACTION = "Action:"
const ACTION_INPUT = "Action Input:"

export function parseReactReply(text: string): ParseResult {
  const finalAt = text.indexOf(FINAL_ANSWER)
  if (finalAt !== -1) {
    return {
      kind: "final",
      answer: text.slice(finalAt + FINAL_ANSWER.length).trim()
    }
  }

  const tool = findLineValue(text, ACTION)
  const input = findLineValue(text, ACTION_INPUT)

  if (tool === null && input === null) {
    return {
      kind: "error",
      message: `Your reply had no "${ACTION}" and no "${FINAL_ANSWER}". Reply in the required format.`
    }
  }
  if (tool === null) {
    return { kind: "error", message: `Your reply had "${ACTION_INPUT}" but no "${ACTION}".` }
  }
  if (input === null) {
    return { kind: "error", message: `Your reply had "${ACTION}" but no "${ACTION_INPUT}".` }
  }

  return { kind: "action", tool, input }
}

function findLineValue(text: string, prefix: string): string | null {
  for (const line of text.split("\n")) {
    const trimmed = line.trimStart()
    if (trimmed.startsWith(prefix)) {
      return trimmed.slice(prefix.length).trim()
    }
  }
  return null
}
