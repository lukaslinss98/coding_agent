import { test } from "node:test";
import assert from "node:assert/strict";

import { parseReactReply } from "./react.ts";

test("parses an action and its input", () => {
  const reply = [
    "Thought: I need to read the file.",
    "Action: read_file",
    'Action Input: {"path": "src/agent.ts"}',
  ].join("\n");

  assert.deepEqual(parseReactReply(reply), {
    kind: "action",
    tool: "read_file",
    input: '{"path": "src/agent.ts"}',
    thought: "I need to read the file.",
  });
});

test("uses empty thought when Thought is missing", () => {
  const reply = ['Action: read_file', 'Action Input: {"path": "src/agent.ts"}'].join("\n");

  assert.deepEqual(parseReactReply(reply), {
    kind: "action",
    tool: "read_file",
    input: '{"path": "src/agent.ts"}',
    thought: "",
  });
});

test("parses a final answer spanning several lines", () => {
  const reply = "Thought: done\nFinal Answer: line one\nline two";

  assert.deepEqual(parseReactReply(reply), {
    kind: "final",
    answer: "line one\nline two",
  });
});

test("prefers whichever marker appears first, ignoring what follows", () => {
  const actionFirst =
    "Action: read_file\nAction Input: {}\nFinal Answer: never mind";
  assert.equal(parseReactReply(actionFirst).kind, "action");

  const finalFirst = "Final Answer: done\nAction: read_file";
  assert.equal(parseReactReply(finalFirst).kind, "final");
});

test("reports an error when the reply is plain chat", () => {
  const result = parseReactReply("Sure, I can help with that!");

  assert.equal(result.kind, "error");
});

test("reports an error when the action input is missing", () => {
  const result = parseReactReply("Action: read_file");

  assert.equal(result.kind, "error");
});
