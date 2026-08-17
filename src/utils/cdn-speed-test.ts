import { isErrorLikeObject } from 'foxts/extract-error-message';
import { noop } from 'foxts/noop';
import { wait } from 'foxts/wait';
import { logger } from '../logger';

// Speed tests must bypass our own fetch/XHR hooks (no-p2p would rewrite the test
// URL to the currently selected CDN, ruining the measurement), so we capture the
// pristine fetch here. Module top-level code is evaluated before index.ts's
// bootstrap IIFE overrides unsafeWindow.fetch.
// eslint-disable-next-line @typescript-eslint/unbound-method -- cache original method
const nativeFetch = unsafeWindow.fetch;

const SAMPLES_PER_HOST = 3;
const SAMPLE_BYTES_LIMIT = 256 * 1024; // Download at most 256 KiB per sample
const SAMPLE_TIMEOUT_MS = 5000;
const SAMPLE_INTERVAL_MS = 150;

export interface CdnSpeedTestSample {
  bytesPerSec: number,
  ttfbMs: number
}

export interface CdnSpeedTestResult {
  // Median of all samples, stable against network jitter
  bytesPerSec: number,
  ttfbMs: number,
  samples: CdnSpeedTestSample[]
}

export type CdnSpeedTestOutcome =
  | { ok: true, result: CdnSpeedTestResult }
  | { ok: false, reason: string };

// Session-level cache, so reopening the selector panel keeps the results
const resultCache = new Map<string, CdnSpeedTestOutcome>();

export function getCachedSpeedTestResult(hostname: string): CdnSpeedTestOutcome | undefined {
  return resultCache.get(hostname);
}

export function formatSpeed(bytesPerSec: number): string {
  if (bytesPerSec >= 1024 * 1024) {
    return `${(bytesPerSec / 1024 / 1024).toFixed(1)} MB/s`;
  }
  if (bytesPerSec >= 1024) {
    return `${(bytesPerSec / 1024).toFixed(0)} KB/s`;
  }
  return `${bytesPerSec.toFixed(0)} B/s`;
}

export function formatOutcome(outcome: CdnSpeedTestOutcome | null): string {
  if (outcome === null) {
    return '失败';
  }
  return outcome.ok ? formatSpeed(outcome.result.bytesPerSec) : outcome.reason;
}

export async function measureCdnHostSpeed(hostname: string, url: string): Promise<CdnSpeedTestOutcome> {
  const samples: CdnSpeedTestSample[] = [];
  let lastErrorReason = '失败';

  for (let i = 0; i < SAMPLES_PER_HOST; i++) {
    try {
      // eslint-disable-next-line no-await-in-loop -- samples must be sequential to avoid self-contention
      samples.push(await measureOnce(url));
    } catch (e) {
      lastErrorReason = toReason(e);
      logger.debug('CDN speed test sample failed', { hostname, error: e });
    }

    if (i + 1 < SAMPLES_PER_HOST) {
      // eslint-disable-next-line no-await-in-loop -- let the torn-down connection settle
      await wait(SAMPLE_INTERVAL_MS);
    }
  }

  if (samples.length === 0) {
    return cacheOutcome(hostname, { ok: false, reason: lastErrorReason });
  }

  const result: CdnSpeedTestResult = {
    bytesPerSec: median(samples.map((sample) => sample.bytesPerSec)),
    ttfbMs: median(samples.map((sample) => sample.ttfbMs)),
    samples
  };
  return cacheOutcome(hostname, { ok: true, result });
}

async function measureOnce(url: string): Promise<CdnSpeedTestSample> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), SAMPLE_TIMEOUT_MS);

  try {
    const startedAt = performance.now();

    const response = await nativeFetch(url, { signal: controller.signal, cache: 'no-store' });
    if (!response.ok || response.body === null) {
      throw new Error(response.ok ? '失败' : `HTTP ${response.status}`);
    }

    // Read the stream until we have enough bytes, then cancel the rest of the download
    const reader = response.body.getReader();
    let bytes = 0;
    let firstChunkAt: number | null = null;

    for (;;) {
      // eslint-disable-next-line no-await-in-loop -- sequential stream read until the byte limit is reached
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      if (firstChunkAt === null) {
        firstChunkAt = performance.now();
      }
      bytes += value.byteLength;
      if (bytes >= SAMPLE_BYTES_LIMIT) {
        break;
      }
    }

    const endedAt = performance.now();

    // Forcefully tear down the in-flight request. Merely canceling the reader can
    // leave the connection lingering (especially in Firefox), and the half-open
    // connections pile up on repeated test runs, making the next run time out.
    controller.abort();
    reader.cancel().catch(noop);

    const firstByteAt = firstChunkAt ?? endedAt;
    const ttfbMs = firstByteAt - startedAt;

    // Throughput is measured only after the first byte arrives, so connection
    // setup and server response time do not skew the result
    const downloadMs = Math.max(endedAt - firstByteAt, 1);

    return {
      bytesPerSec: bytes / (downloadMs / 1000),
      ttfbMs
    };
  } finally {
    clearTimeout(timeout);
  }
}

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
}

function toReason(e: unknown): string {
  if (e instanceof DOMException && e.name === 'AbortError') {
    return '超时';
  }
  if (isErrorLikeObject(e) && e.message !== '') {
    return e.message;
  }
  return '失败';
}

function cacheOutcome(hostname: string, outcome: CdnSpeedTestOutcome): CdnSpeedTestOutcome {
  resultCache.set(hostname, outcome);
  return outcome;
}
