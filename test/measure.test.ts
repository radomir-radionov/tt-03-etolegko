import assert from "node:assert/strict";
import { test } from "node:test";
import { measureSequential } from "../src/measure.js";
import type { DownloadResult } from "../src/types.js";

test("measureSequential calls downloadOnce count times in order", async () => {
  const callOrder: number[] = [];
  let callIndex = 0;

  const downloadOnce = async (_url: string): Promise<DownloadResult> => {
    callOrder.push(callIndex++);
    return { durationMs: 100, bytes: 50 };
  };

  const result = await measureSequential("http://example.com", {
    count: 10,
    downloadOnce,
  });

  assert.equal(callOrder.length, 10);
  assert.deepEqual(callOrder, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  assert.equal(result.results.length, 10);
  assert.equal(result.totalBytes, 500);
  assert.equal(result.totalDurationMs, 1000);
});

test("measureSequential is strictly sequential", async () => {
  let inFlight = 0;
  let maxInFlight = 0;

  const downloadOnce = async (): Promise<DownloadResult> => {
    inFlight += 1;
    maxInFlight = Math.max(maxInFlight, inFlight);
    await new Promise((r) => setTimeout(r, 1));
    inFlight -= 1;
    return { durationMs: 1, bytes: 1 };
  };

  await measureSequential("http://example.com", {
    count: 3,
    downloadOnce,
  });

  assert.equal(maxInFlight, 1);
});