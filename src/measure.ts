import { REQUEST_COUNT } from "./constants.js";
import { downloadOnce as defaultDownloadOnce } from "./request.js";
import type { DownloadOnceFn, DownloadResult, MeasureResult } from "./types.js";

export async function measureSequential(
  url: string,
  options: {
    readonly count?: number;
    readonly downloadOnce?: DownloadOnceFn;
  } = {},
): Promise<MeasureResult> {
  const count = options.count ?? REQUEST_COUNT;
  const downloadOnce = options.downloadOnce ?? defaultDownloadOnce;

  const results: DownloadResult[] = [];

  for (let i = 0; i < count; i += 1) {
    const result = await downloadOnce(url);
    results.push(result);
  }

  const totalBytes = results.reduce((sum, r) => sum + r.bytes, 0);
  const totalDurationMs = results.reduce((sum, r) => sum + r.durationMs, 0);

  return { results, totalBytes, totalDurationMs };
}