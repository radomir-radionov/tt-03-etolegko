import assert from "node:assert/strict";
import { test } from "node:test";
import {
  averageRequestTimeMs,
  downloadSpeedMbps,
  formatReport,
} from "../src/speed.js";

test("averageRequestTimeMs", () => {
  assert.equal(averageRequestTimeMs(8000, 10), 800);
});

test("downloadSpeedMbps", () => {
  const mbps = downloadSpeedMbps(10_000_000, 8000);
  assert.ok(Math.abs(mbps - 10) < 0.001);
});

test("formatReport includes key lines", () => {
  const text = formatReport({
    url: "https://example.com/x",
    count: 10,
    totalBytes: 10_000_000,
    totalDurationMs: 8000,
    averageMs: 800,
    speedMbps: 10,
  });

  assert.match(text, /URL: https:\/\/example\.com\/x/);
  assert.match(text, /Requests: 10/);
  assert.match(text, /Download speed: 10\.00 Mbps/);
});