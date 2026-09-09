import { afterEach, test } from "node:test";
import assert from "node:assert/strict";

import { cliArguments, helpText } from "./cli.ts";

const originalArgv = process.argv;

function setArgs(...args: string[]) {
  process.argv = ["node", "cli.ts", ...args];
}

afterEach(() => {
  process.argv = originalArgv;
});

test("defaults to the free model when no flags are given", () => {
  setArgs();

  assert.equal(cliArguments().model, "openrouter/free");
});

test("uses the model passed with --model", () => {
  setArgs("--model", "gpt-5");

  assert.equal(cliArguments().model, "gpt-5");
});

test("help defaults to false", () => {
  setArgs();

  assert.equal(cliArguments().help, false);
});

test("sets help to true with -h", () => {
  setArgs("-h");

  assert.equal(cliArguments().help, true);
});

test("helpText lists both flags", () => {
  const text = helpText();

  assert.match(text, /--model/);
  assert.match(text, /-h, --help/);
});
