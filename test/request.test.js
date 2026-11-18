import assert from "node:assert/strict";
import http from "node:http";
import { after, before, test } from "node:test";
import { downloadOnce } from "../src/request.js";

const payload = Buffer.alloc(1024, 0xab);

let baseUrl;
let hangUrl;
/** @type {import("node:http").Server | undefined} */
let server;
/** @type {import("node:http").Server | undefined} */
let hangServer;

before(() => {
  return Promise.all([
    new Promise((resolve) => {
      server = http.createServer((_req, res) => {
        res.writeHead(200, { "Content-Type": "application/octet-stream" });
        res.end(payload);
      });
      server.listen(0, "127.0.0.1", () => {
        const addr = server.address();
        if (!addr || typeof addr === "string") {
          throw new Error("expected server to listen on a TCP port");
        }
        baseUrl = `http://127.0.0.1:${addr.port}/fixed`;
        resolve();
      });
    }),
    new Promise((resolve) => {
      hangServer = http.createServer((_req, res) => {
        res.writeHead(200, { "Content-Type": "application/octet-stream" });
        // never res.end()
      });
      hangServer.listen(0, "127.0.0.1", () => {
        const addr = hangServer.address();
        if (!addr || typeof addr === "string") {
          throw new Error("expected server to listen on a TCP port");
        }
        hangUrl = `http://127.0.0.1:${addr.port}/hang`;
        resolve();
      });
    }),
  ]);
});

after(() => {
  return Promise.all([
    new Promise((resolve, reject) => {
      if (!server) {
        resolve();
        return;
      }
      server.close((err) => (err ? reject(err) : resolve()));
    }),
    new Promise((resolve, reject) => {
      if (!hangServer) {
        resolve();
        return;
      }
      if (typeof hangServer.closeAllConnections === "function") {
        hangServer.closeAllConnections();
      }
      hangServer.close((err) => (err ? reject(err) : resolve()));
    }),
  ]);
});

test("downloadOnce returns bytes and durationMs for full body", async () => {
  const result = await downloadOnce(baseUrl);

  assert.equal(result.bytes, payload.length);
  assert.ok(result.durationMs >= 0);
});

test("downloadOnce rejects when response does not finish within timeout", async () => {
  await assert.rejects(
    () => downloadOnce(hangUrl, { timeoutMs: 80 }),
    /timed out/i,
  );
});