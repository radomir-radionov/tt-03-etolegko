import { REQUEST_COUNT } from "./constants.js";
import { measureSequential as defaultMeasureSequential } from "./measure.js";
import { parseArgs } from "./parse-args.js";
import {
  averageRequestTimeMs,
  downloadSpeedMbps,
  formatReport,
} from "./speed.js";

/**
 * @param {string[]} argv
 * @param {{
 *   measureSequential?: typeof defaultMeasureSequential;
 *   log?: (message: string) => void;
 *   onError?: (err: unknown) => void;
 * }} [deps]
 */
export async function run(argv, deps = {}) {
  const measureSequential = deps.measureSequential ?? defaultMeasureSequential;
  const log = deps.log ?? console.log;

  let url;
  try {
    ({ url } = parseArgs(argv));
  } catch (err) {
    if (deps.onError) {
      deps.onError(err);
    }
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