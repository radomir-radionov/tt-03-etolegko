import assert from "node:assert/strict";
import { test } from "node:test";
import { parseArgs } from "../src/parse-args.js";

test("parseArgs returns url from argv", () => {
  const result = parseArgs(["node", "script", "https://example.com/x"]);
  assert.deepEqual(result, { url: "https://example.com/x" });
});

test("parseArgs rejects missing url", () => {
  assert.throws(
    () => parseArgs(["node", "script"]),
    /URL is required/,
  );
});

test("parseArgs rejects non-http(s) url", () => {
  assert.throws(
    () => parseArgs(["node", "script", "ftp://example.com/file"]),
    /http or https/,
  );
});

test("parseArgs rejects invalid url", () => {
  assert.throws(() => parseArgs(["node", "script", "not-a-url"]), /Invalid URL/);
});