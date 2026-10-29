import { isAkamaiHost, isP2PCDNDomain } from '../core/player/cdn-classify';
import { setManualCdnHost } from '../core/player/host-model';
import { logger } from '../logger';
import { isObject } from './is-object';

const PREFERENCE_KEY = 'mbgtbe:cdn-preference:v1';
const HOSTNAME_RE = /^(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/i;

export type CdnPreferenceSource = 'manual' | 'fastest';

interface CdnPreference {
  readonly host: string,
  readonly savedAt: number,
  readonly source: CdnPreferenceSource
}

/** Mirrors the stored preference for the current page, so the panel can show it before a GM write resolves */
let rememberedHost: string | null = null;

function isValidHost(host: string) {
  if (!HOSTNAME_RE.test(host) || isP2PCDNDomain(host) || isAkamaiHost(host)) {
    return false;
  }
  try {
    return new URL(`https://${host}`).hostname === host.toLowerCase();
  } catch {
    return false;
  }
}

function savePreference(preference: CdnPreference) {
  const result: unknown = GM.setValue(PREFERENCE_KEY, preference);
  if (result instanceof Promise) {
    void result.catch((e: unknown) => {
      if (rememberedHost === preference.host) {
        rememberedHost = null;
      }
      logger.warn('Failed to save CDN preference', e);
    });
  }
}

function removePreferenceFromStorage() {
  const result: unknown = GM.deleteValue(PREFERENCE_KEY);
  if (result instanceof Promise) {
    void result.catch((e: unknown) => logger.warn('Failed to clear CDN preference', e));
  }
}

function removePreference() {
  try {
    removePreferenceFromStorage();
  } catch (e) {
    logger.warn('Failed to clear CDN preference', e);
  }
}

function readPreference(): CdnPreference | null {
  let raw: unknown;
  try {
    raw = GM_getValue<unknown>(PREFERENCE_KEY, null);
  } catch (e) {
    logger.warn('Failed to read CDN preference', e);
    return null;
  }
  if (!isObject(raw)) {
    return null;
  }

  const { host, savedAt, source } = raw as Partial<CdnPreference>;
  if (typeof host !== 'string' || !isValidHost(host)) {
    removePreference();
    return null;
  }

  return {
    host,
    savedAt: typeof savedAt === 'number' && Number.isFinite(savedAt) && savedAt > 0 ? savedAt : Date.now(),
    source: source === 'fastest' ? 'fastest' : 'manual'
  };
}

/** Apply the stored preference before no-p2p registers its policy */
export function restoreCdnPreference() {
  const preference = readPreference();
  if (preference === null) {
    rememberedHost = null;
    return null;
  }
  rememberedHost = preference.host;
  setManualCdnHost(preference.host);
  logger.info('CDN preference restored', { host: preference.host, source: preference.source, savedAt: preference.savedAt });
  return preference.host;
}

export function rememberCdnHost(hostname: string, source: CdnPreferenceSource) {
  if (!isValidHost(hostname)) {
    logger.warn('Ignoring invalid CDN preference', { hostname });
    return;
  }

  rememberedHost = hostname;
  setManualCdnHost(hostname);
  const preference: CdnPreference = { host: hostname, savedAt: Date.now(), source };
  try {
    savePreference(preference);
  } catch (e) {
    rememberedHost = null;
    logger.warn('Failed to save CDN preference', e);
  }
  logger.info('CDN preference saved', { host: hostname, source });
}

export function forgetCdnPreference() {
  rememberedHost = null;
  setManualCdnHost(null);
  removePreference();
  logger.info('CDN preference cleared');
}

export function getRememberedCdnHost() {
  return rememberedHost;
}
