import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import http from "node:http";
import type { Server } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { after, before, test } from "node:test";

const payload = Buffer.alloc(2048, 1);

let baseUrl: string;
let server: Server | undefined;

const cliPath = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "dist",
  "cli.js",
);

before(() => {
  return new Promise<void>((resolve) => {
    server = http.createServer((_req, res) => {
      res.writeHead(200, { "Content-Type": "application/octet-stream" });
      res.end(payload);
    });
    server.listen(0, "127.0.0.1", () => {
      const addr = server!.address();
      if (!addr || typeof addr === "string") {
        throw new Error("expected server to listen on a TCP port");
      }
      baseUrl = `http://127.0.0.1:${addr.port}/data`;
      resolve();
    });
  });
});

after(() => {
  return new Promise<void>((resolve, reject) => {
    if (!server) {
      resolve();
      return;
    }
    server.close((err) => (err ? reject(err) : resolve()));
  });
});

function runCli(url: string) {
  return new Promise<{ code: number | null; stdout: string; stderr: string }>(
    (resolve, reject) => {
      const child = spawn(process.execPath, [cliPath, url], {
        stdio: ["ignore", "pipe", "pipe"],
      });

      let stdout = "";
      let stderr = "";

      child.stdout.on("data", (chunk: Buffer) => {
        stdout += chunk.toString();
      });
      child.stderr.on("data", (chunk: Buffer) => {
        stderr += chunk.toString();
      });

      child.on("error", reject);
      child.on("close", (code) => {
        resolve({ code, stdout, stderr });
      });
    },
  );
}

test("cli performs 10 downloads against local server", async () => {
  const { code, stdout, stderr } = await runCli(baseUrl);

  assert.equal(code, 0, stderr);
  assert.match(stdout, /Requests: 10/);
  assert.match(stdout, /Total downloaded: 20\.48 KB/);
  assert.match(stdout, /Download speed: .* Mbps/);
});