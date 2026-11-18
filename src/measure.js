import { REQUEST_COUNT } from "./constants.js";
import { downloadOnce as defaultDownloadOnce } from "./request.js";

/**
 * @typedef {{ durationMs: number; bytes: number }} DownloadResult
 */

/**
 * @param {string} url
 * @param {{ count?: number; downloadOnce?: (url: string) => Promise<DownloadResult> }} [options]
 */
export async function measureSequential(url, options = {}) {
  const count = options.count ?? REQUEST_COUNT;
  const downloadOnce = options.downloadOnce ?? defaultDownloadOnce;

  /** @type {DownloadResult[]} */
  const results = [];

  for (let i = 0; i < count; i += 1) {
    const result = await downloadOnce(url);
    results.push(result);
  }

  const totalBytes = results.reduce((sum, r) => sum + r.bytes, 0);
  const totalDurationMs = results.reduce((sum, r) => sum + r.durationMs, 0);

  return { results, totalBytes, totalDurationMs };
}