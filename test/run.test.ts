import assert from "node:assert/strict";
import { test } from "node:test";
import { run } from "../src/run.js";
import type { MeasureResult } from "../src/types.js";

test("run prints formatted report for url", async () => {
  const lines: string[] = [];
  const measureSequential = async (): Promise<MeasureResult> => ({
    results: [],
    totalBytes: 10_000_000,
    totalDurationMs: 8000,
  });

  await run(["node", "cli.js", "https://example.com/x"], {
    measureSequential,
    log: (msg) => lines.push(msg),
  });

  assert.equal(lines.length, 1);
  assert.match(lines[0], /URL: https:\/\/example\.com\/x/);
  assert.match(lines[0], /Download speed: 10\.00 Mbps/);
});

test("run exits via onError when parse fails", async () => {
  let reported: unknown;
  await assert.rejects(
    () =>
      run(["node", "cli.js"], {
        onError: (err) => {
          reported = err;
          throw err;
        },
      }),
  );
  assert.ok(reported instanceof Error);
});