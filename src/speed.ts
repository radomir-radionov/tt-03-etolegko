import type { SpeedReport } from "./types.js";

export function averageRequestTimeMs(
  totalDurationMs: number,
  count: number,
): number {
  return totalDurationMs / count;
}

/** Megabits per second: (bytes * 8) / seconds / 1e6 */
export function downloadSpeedMbps(
  totalBytes: number,
  totalDurationMs: number,
): number {
  const seconds = totalDurationMs / 1000;
  if (seconds <= 0) {
    return 0;
  }
  return (totalBytes * 8) / seconds / 1e6;
}

function formatBytesHuman(bytes: number): string {
  if (bytes >= 1_000_000) {
    return `${(bytes / 1_000_000).toFixed(2)} MB`;
  }
  if (bytes >= 1_000) {
    return `${(bytes / 1_000).toFixed(2)} KB`;
  }
  return `${bytes} B`;
}

export function formatReport(report: SpeedReport): string {
  const totalSeconds = report.totalDurationMs / 1000;

  return [
    `URL: ${report.url}`,
    `Requests: ${report.count} (sequential)`,
    `Total downloaded: ${formatBytesHuman(report.totalBytes)}`,
    `Total time (sum of requests): ${totalSeconds.toFixed(2)} s`,
    `Average request time: ${report.averageMs.toFixed(2)} ms`,
    `Download speed: ${report.speedMbps.toFixed(2)} Mbps`,
  ].join("\n");
}