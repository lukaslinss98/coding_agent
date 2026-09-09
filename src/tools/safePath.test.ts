import { test } from "node:test";
import assert from "node:assert/strict";
import { join } from "node:path";

import { safePath } from "./safePath.ts";

const ROOT = "/project";

test("allows a path inside the root", () => {
  assert.equal(safePath("src/agent.ts", ROOT), join(ROOT, "src/agent.ts"));
});

test("allows the root itself", () => {
  assert.equal(safePath(".", ROOT), ROOT);
});

test("rejects a path that climbs out with ..", () => {
  assert.equal(safePath("../secrets.txt", ROOT), null);
});

test("rejects a climb hidden in the middle of the path", () => {
  assert.equal(safePath("src/../../etc/passwd", ROOT), null);
});

test("rejects an absolute path outside the root", () => {
  assert.equal(safePath("/etc/hosts", ROOT), null);
});

test("allows an absolute path inside the root", () => {
  assert.equal(
    safePath("/project/src/main.ts", ROOT),
    join(ROOT, "src/main.ts"),
  );
});
