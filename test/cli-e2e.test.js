import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { after, before, test } from "node:test";

const payload = Buffer.alloc(2048, 1);

let baseUrl;
/** @type {import("node:http").Server | undefined} */
let server;

const cliPath = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "src",
  "cli.js",
);

before(() => {
  return new Promise((resolve) => {
    server = http.createServer((_req, res) => {
      res.writeHead(200, { "Content-Type": "application/octet-stream" });
      res.end(payload);
    });
    server.listen(0, "127.0.0.1", () => {
      const addr = server.address();
      if (!addr || typeof addr === "string") {
        throw new Error("expected server to listen on a TCP port");
      }
      baseUrl = `http://127.0.0.1:${addr.port}/data`;
      resolve();
    });
  });
});

after(() => {
  return new Promise((resolve, reject) => {
    if (!server) {
      resolve();
      return;
    }
    server.close((err) => (err ? reject(err) : resolve()));
  });
});

function runCli(url) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [cliPath, url], {
      stdio: ["ignore", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    child.on("error", reject);
    child.on("close", (code) => {
      resolve({ code, stdout, stderr });
    });
  });
}

test("cli performs 10 downloads against local server", async () => {
  const { code, stdout, stderr } = await runCli(baseUrl);

  assert.equal(code, 0, stderr);
  assert.match(stdout, /Requests: 10/);
  assert.match(stdout, /Total downloaded: 20\.48 KB/);
  assert.match(stdout, /Download speed: .* Mbps/);
});