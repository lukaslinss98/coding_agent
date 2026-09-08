import { after, before, test } from "node:test"
import assert from "node:assert/strict"
import { mkdtemp, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"

import { readFileTool } from "./readFile.ts"

let dir: string

before(async () => {
  dir = await mkdtemp(join(tmpdir(), "readfile-test-"))
  await writeFile(join(dir, "hello.txt"), "hello world", "utf-8")
})

after(async () => {
  await rm(dir, { recursive: true, force: true })
})

test("returns the file contents", async () => {
  const result = await readFileTool({ path: join(dir, "hello.txt") })

  assert.equal(result, "hello world")
})

test("returns an error message when the path is not a string", async () => {
  const result = await readFileTool({ path: 5 })

  assert.match(result, /expected string/)
})

test("returns an error message when the file does not exist", async () => {
  const result = await readFileTool({ path: join(dir, "missing.txt") })

  assert.match(result, /Could not read/)
})
