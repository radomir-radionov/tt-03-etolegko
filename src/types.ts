export type DownloadResult = {
  readonly durationMs: number;
  readonly bytes: number;
};

export type MeasureResult = {
  readonly results: readonly DownloadResult[];
  readonly totalBytes: number;
  readonly totalDurationMs: number;
};

export type SpeedReport = {
  readonly url: string;
  readonly count: number;
  readonly totalBytes: number;
  readonly totalDurationMs: number;
  readonly averageMs: number;
  readonly speedMbps: number;
};

export type DownloadOnceFn = (
  url: string,
  options?: { readonly timeoutMs?: number },
) => Promise<DownloadResult>;

export type MeasureSequentialFn = (
  url: string,
  options?: {
    readonly count?: number;
    readonly downloadOnce?: DownloadOnceFn;
  },
) => Promise<MeasureResult>;

export type RunDeps = {
  readonly measureSequential?: MeasureSequentialFn;
  readonly log?: (message: string) => void;
  readonly onError?: (err: unknown) => void;
};