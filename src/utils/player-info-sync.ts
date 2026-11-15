import type { MediaKind } from '../core/player/registry';
import { onDOMContentLoaded } from './on-load-event';

/**
 * The player's statistics panel (`视频统计信息`) names the host of the URL Bilibili listed, not the
 * one the interceptor actually went to: keep it in step with the routed hosts.
 */
const PANEL_SELECTOR = '.bpx-player-info-panel';
const LINE_SELECTOR = '.info-line';
const TITLE_SELECTOR = '.info-title';
const DATA_SELECTOR = '.info-data';
const TITLE_KINDS: ReadonlyArray<readonly [string, MediaKind]> = [
  ['Video Host', 'video'],
  ['Audio Host', 'audio']
];

/** Host each kind of media was last routed to, unknown until the interceptor picks one */
const routedHosts = new Map<MediaKind, string>();

/** A media request of this kind is being answered from `hostname` */
export function noteRoutedHost(kind: MediaKind, hostname: string) {
  if (routedHosts.get(kind) === hostname) {
    return;
  }
  routedHosts.set(kind, hostname);
  syncPanel();
}

function syncPanel() {
  const panel = document.querySelector(PANEL_SELECTOR);
  if (panel === null) {
    return;
  }
  const lines = panel.querySelectorAll(LINE_SELECTOR);
  for (let i = 0, len = lines.length; i < len; i++) {
    const line = lines[i];
    const title = line.querySelector(TITLE_SELECTOR);
    const data = line.querySelector(DATA_SELECTOR);
    if (title === null || data === null) {
      continue;
    }
    const host = routedHostOf(title.textContent);
    if (host !== null && data.textContent !== host) {
      data.textContent = host;
    }
  }
}

function routedHostOf(title: string): string | null {
  for (let i = 0, len = TITLE_KINDS.length; i < len; i++) {
    if (title.includes(TITLE_KINDS[i][0])) {
      return routedHosts.get(TITLE_KINDS[i][1]) ?? null;
    }
  }
  return null;
}

/** The panel is re-rendered on the player's statistics updates: patch it as it comes back */
export function startPlayerInfoPanelSync() {
  if (typeof MutationObserver === 'undefined') {
    return;
  }

  const observe = () => {
    const observer = new MutationObserver((records) => {
      for (let i = 0, len = records.length; i < len; i++) {
        const record = records[i];
        const { target } = record;
        if (target.nodeType === 1 && (target as Element).closest(PANEL_SELECTOR) !== null) {
          syncPanel();
          return;
        }
        for (let j = 0, count = record.addedNodes.length; j < count; j++) {
          const node = record.addedNodes[j];
          if (node.nodeType !== 1) {
            continue;
          }
          const element = node as Element;
          const className = element.className;
          // The panel and its ancestors are the player's own `bpx-player-*` elements
          if (typeof className !== 'string' || !className.includes('bpx-player-')) {
            continue;
          }
          if (element.matches(PANEL_SELECTOR) || element.querySelector(PANEL_SELECTOR) !== null) {
            syncPanel();
            return;
          }
        }
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  };

  onDOMContentLoaded(observe);
}
