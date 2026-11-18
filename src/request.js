import http from "node:http";
import https from "node:https";
import { performance } from "node:perf_hooks";
import { DEFAULT_REQUEST_TIMEOUT_MS } from "./constants.js";

/**
 * @param {string} url
 * @param {{ timeoutMs?: number }} [options]
 * @returns {Promise<{ durationMs: number; bytes: number }>}
 */
export function downloadOnce(url, options = {}) {
  const timeoutMs = options.timeoutMs ?? DEFAULT_REQUEST_TIMEOUT_MS;

  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const lib = parsed.protocol === "https:" ? https : http;

    const start = performance.now();
    /** @type {NodeJS.Timeout | undefined} */
    let deadline;

    const fail = (err) => {
      if (deadline) {
        clearTimeout(deadline);
      }
      reject(err);
    };

    const finish = (result) => {
      if (deadline) {
        clearTimeout(deadline);
      }
      resolve(result);
    };

    const req = lib.get(
      url,
      { headers: { "User-Agent": "internet-speed-measure/1.0" } },
      (res) => {
        if (res.statusCode && res.statusCode >= 400) {
          res.resume();
          fail(new Error(`HTTP ${res.statusCode} for ${url}`));
          return;
        }

        /** @type {number} */
        let bytes = 0;

        res.on("data", (chunk) => {
          bytes += chunk.length;
        });

        res.on("end", () => {
          finish({
            durationMs: performance.now() - start,
            bytes,
          });
        });

        res.on("error", fail);
      },
    );

    req.on("error", fail);

    deadline = setTimeout(() => {
      req.destroy();
      fail(new Error(`Request timed out after ${timeoutMs} ms for ${url}`));
    }, timeoutMs);

    if (typeof deadline.unref === "function") {
      deadline.unref();
    }
  });
}