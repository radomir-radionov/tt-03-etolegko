import { readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import assert from "node:assert/strict";
import { test } from "node:test";

const testDir = path.join(path.dirname(fileURLToPath(import.meta.url)));

test("test runner discovers *.test.ts files in test/", async () => {
  const entries = await readdir(testDir);
  const testFiles = entries.filter((name) => name.endsWith(".test.ts"));
  assert.ok(testFiles.length >= 1, "expected at least one *.test.ts file");
});