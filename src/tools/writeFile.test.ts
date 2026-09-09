import { after, before, test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { join, relative } from "node:path";

import { writeToFile } from "./writeFile.ts";

let dir: string;

before(async () => {
  dir = await mkdtemp(join(process.cwd(), "tmp-writefile-test-"));
});

after(async () => {
  await rm(dir, { recursive: true, force: true });
});

function toolPath(name: string): string {
  return relative(process.cwd(), join(dir, name));
}

test("creates a new file with the given content", async () => {
  const result = await writeToFile({
    path: toolPath("new.txt"),
    content: "hello",
  });

  assert.equal(await readFile(join(dir, "new.txt"), "utf-8"), "hello");
  assert.match(result, /Wrote/);
});

test("overwrites an existing file completely", async () => {
  await writeFile(join(dir, "old.txt"), "the original content", "utf-8");

  await writeToFile({ path: toolPath("old.txt"), content: "new" });

  assert.equal(await readFile(join(dir, "old.txt"), "utf-8"), "new");
});

test("refuses a path outside the project directory", async () => {
  const result = await writeToFile({ path: "../escaped.txt", content: "nope" });

  assert.match(result, /outside the project directory/);
});

test("returns an error message when the directory does not exist", async () => {
  const result = await writeToFile({
    path: toolPath("no/such/dir/file.txt"),
    content: "hello",
  });

  assert.match(result, /Error while invoking tool/);
});
