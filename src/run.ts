import { REQUEST_COUNT } from "./constants.js";
import { measureSequential as defaultMeasureSequential } from "./measure.js";
import { parseArgs } from "./parse-args.js";
import {
  averageRequestTimeMs,
  downloadSpeedMbps,
  formatReport,
} from "./speed.js";
import type { RunDeps } from "./types.js";

export async function run(
  argv: readonly string[],
  deps: RunDeps = {},
): Promise<void> {
  const measureSequential = deps.measureSequential ?? defaultMeasureSequential;
  const log = deps.log ?? console.log;

  let url: string;
  try {
    ({ url } = parseArgs(argv));
  } catch (err) {
    deps.onError?.(err);
    throw err;
  }

  const { totalBytes, totalDurationMs } = await measureSequential(url, {
    count: REQUEST_COUNT,
  });

  const averageMs = averageRequestTimeMs(totalDurationMs, REQUEST_COUNT);
  const speedMbps = downloadSpeedMbps(totalBytes, totalDurationMs);

  log(
    formatReport({
      url,
      count: REQUEST_COUNT,
      totalBytes,
      totalDurationMs,
      averageMs,
      speedMbps,
    }),
  );
}