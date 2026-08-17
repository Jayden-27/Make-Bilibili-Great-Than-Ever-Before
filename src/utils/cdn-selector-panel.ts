import { logger } from '../logger';
import type { CdnSpeedTestOutcome, CdnSpeedTestResult } from './cdn-speed-test';
import { formatOutcome, formatSpeed, getCachedSpeedTestResult, measureCdnHostSpeed } from './cdn-speed-test';
import { getCDNUtil } from './get-cdn-url';
import { onDOMContentLoaded } from './on-load-event';
import { wait } from 'foxts/wait';

const PANEL_HOST_ID = 'mbgtbe-cdn-selector-panel';

// Styles live inside the Shadow DOM, so bilibili's page styles can never leak in
// and ours can never leak out.
const PANEL_CSS = `
  .overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.55);
    z-index: 2147483647;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .panel {
    background: #fff;
    color: #18191c;
    border-radius: 8px;
    width: 520px;
    max-width: 92vw;
    max-height: 80vh;
    overflow-y: auto;
    padding: 16px 20px 20px;
    font-family: system-ui, -apple-system, sans-serif;
    font-size: 14px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  }
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 12px;
  }
  .close {
    background: none;
    border: none;
    font-size: 22px;
    line-height: 1;
    cursor: pointer;
    color: #61666d;
    padding: 0 4px;
  }
  .close:hover { color: #18191c; }
  .status {
    margin-bottom: 12px;
    padding: 8px 12px;
    background: #f1f2f3;
    border-radius: 4px;
  }
  .group-title {
    font-size: 13px;
    font-weight: 600;
    color: #61666d;
    margin: 12px 0 4px;
  }
  .item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 8px;
    border-radius: 4px;
    cursor: pointer;
  }
  .item:hover { background: #f1f2f3; }
  .hostname {
    font-family: ui-monospace, monospace;
    font-size: 13px;
    word-break: break-all;
  }
  .badge {
    padding: 0 4px;
    border: 1px solid #00a1d6;
    border-radius: 3px;
    font-size: 12px;
    line-height: 1.6;
    color: #00a1d6;
    white-space: nowrap;
  }
  .speed {
    margin-left: auto;
    padding-left: 12px;
    font-size: 12px;
    color: #61666d;
    white-space: nowrap;
  }
  .empty {
    padding: 24px 0;
    text-align: center;
    color: #9499a0;
  }
  .tip {
    margin-top: 14px;
    font-size: 12px;
    line-height: 1.7;
    color: #9499a0;
  }
  .footer {
    margin-top: 14px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }
  .footer-left, .footer-right {
    display: flex;
    gap: 8px;
  }
  .btn {
    background: #f1f2f3;
    border: 1px solid #e3e5e7;
    border-radius: 4px;
    padding: 6px 18px;
    font-size: 13px;
    cursor: pointer;
  }
  .btn:hover { background: #e3e5e7; }
  .btn:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
  .btn-primary {
    background: #00a1d6;
    border-color: #00a1d6;
    color: #fff;
  }
  .btn-primary:hover { background: #0090c0; }
  .hidden { display: none; }
`;

interface RowElements {
  badge: HTMLElement,
  speed: HTMLElement
}

export function registerCdnSelectorMenu() {
  GM.registerMenuCommand('选择 CDN 节点', () => {
    // The userscript runs at document-start, the menu may be clicked before body exists
    if (document.readyState === 'loading') {
      onDOMContentLoaded(openCdnSelectorPanel);
    } else {
      openCdnSelectorPanel();
    }
  });
}

function renderOutcome(span: HTMLElement, outcome: CdnSpeedTestOutcome | null) {
  span.textContent = formatOutcome(outcome);
  if (outcome?.ok === true) {
    const sampleSpeeds = outcome.result.samples.map((sample) => formatSpeed(sample.bytesPerSec)).join(' / ');
    span.title = `${outcome.result.samples.length} 次采样取中位数\n采样速度: ${sampleSpeeds}\nTTFB 中位数: ${Math.round(outcome.result.ttfbMs)} ms`;
  } else {
    span.removeAttribute('title');
  }
}

function openCdnSelectorPanel() {
  if (document.getElementById(PANEL_HOST_ID) !== null) {
    return;
  }

  const cdnUtil = getCDNUtil();
  const { mirror, bcache } = cdnUtil.getCollectedCdnHosts();
  const allHosts = [...mirror, ...bcache];

  const host = document.createElement('div');
  host.id = PANEL_HOST_ID;
  const shadow = host.attachShadow({ mode: 'open' });

  const style = document.createElement('style');
  style.textContent = PANEL_CSS;
  shadow.appendChild(style);

  const overlay = document.createElement('div');
  overlay.className = 'overlay';
  shadow.appendChild(overlay);

  const panel = document.createElement('div');
  panel.className = 'panel';
  overlay.appendChild(panel);

  const header = document.createElement('div');
  header.className = 'header';
  const title = document.createElement('span');
  title.textContent = '手动选择 CDN 节点';
  const closeButton = document.createElement('button');
  closeButton.className = 'close';
  closeButton.textContent = '×';
  header.appendChild(title);
  header.appendChild(closeButton);
  panel.appendChild(header);

  const status = document.createElement('div');
  status.className = 'status';
  const updateStatus = () => {
    const selected = cdnUtil.getManualCdnHost();
    status.textContent = selected === null
      ? '当前模式：自动（默认选择逻辑）'
      : `当前模式：手动（${selected}）`;
  };
  updateStatus();
  panel.appendChild(status);

  const list = document.createElement('div');
  list.className = 'list';
  panel.appendChild(list);

  const rowElements = new Map<string, RowElements>();

  const onSelect = (hostname: string) => {
    cdnUtil.setManualCdnHost(hostname);
    updateStatus();
    logger.info('CDN manually selected', { hostname });
  };

  if (allHosts.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'empty';
    empty.textContent = '尚未收集到 CDN 信息，请先开始播放视频后再打开此面板。';
    list.appendChild(empty);
  } else {
    if (mirror.length > 0) {
      list.appendChild(createGroup('官方镜像 CDN（upos mirror，推荐）', mirror, cdnUtil.getManualCdnHost(), onSelect, rowElements));
    }
    if (bcache.length > 0) {
      list.appendChild(createGroup('自建 CDN 节点（bcache）', bcache, cdnUtil.getManualCdnHost(), onSelect, rowElements));
    }
  }

  const tip = document.createElement('div');
  tip.className = 'tip';
  tip.textContent = '手动选择对所有可互换的 upgcxcode 视频流生效；纯 IP / mcdn 流不适用，仍走默认的代理兜底。测速会对每个节点做 3 次采样（每次下载约 256KB）取中位数，吞吐量不含连接建立耗时，悬停可查看采样明细，结果仅供参考。选择与测速结果仅保留在当前页面会话中，对之后发起的请求生效，已缓冲内容不受影响。';
  panel.appendChild(tip);

  const footer = document.createElement('div');
  footer.className = 'footer';

  const footerLeft = document.createElement('div');
  footerLeft.className = 'footer-left';
  const footerRight = document.createElement('div');
  footerRight.className = 'footer-right';

  const testButton = document.createElement('button');
  testButton.className = 'btn';
  testButton.textContent = '开始测速';
  testButton.disabled = allHosts.length === 0;

  const useFastestButton = document.createElement('button');
  useFastestButton.className = 'btn btn-primary hidden';
  useFastestButton.textContent = '使用最快节点';

  const resetButton = document.createElement('button');
  resetButton.className = 'btn';
  resetButton.textContent = '恢复自动';
  resetButton.addEventListener('click', () => {
    cdnUtil.setManualCdnHost(null);
    updateStatus();
    const checkedRadio = list.querySelector<HTMLInputElement>('input[type="radio"]:checked');
    if (checkedRadio !== null) {
      checkedRadio.checked = false;
    }
  });

  footerLeft.appendChild(testButton);
  footerLeft.appendChild(useFastestButton);
  footerRight.appendChild(resetButton);
  footer.appendChild(footerLeft);
  footer.appendChild(footerRight);
  panel.appendChild(footer);

  let fastest: { hostname: string, result: CdnSpeedTestResult } | null = null;

  const showRecommendation = () => {
    if (fastest === null) {
      return;
    }
    const spans = rowElements.get(fastest.hostname);
    if (spans) {
      spans.badge.classList.remove('hidden');
    }
    useFastestButton.classList.remove('hidden');
  };

  // Restore cached speed test results (if any) when the panel is reopened
  const restoreCachedResults = (): typeof fastest => {
    let best: { hostname: string, result: CdnSpeedTestResult } | null = null;

    allHosts.forEach((hostname) => {
      const cached = getCachedSpeedTestResult(hostname);
      const spans = rowElements.get(hostname);
      if (cached === undefined || spans === undefined) {
        return;
      }

      renderOutcome(spans.speed, cached);
      if (cached.ok && (best === null || cached.result.bytesPerSec > best.result.bytesPerSec)) {
        best = { hostname, result: cached.result };
      }
    });

    return best;
  };
  fastest = restoreCachedResults();
  if (fastest !== null) {
    showRecommendation();
    testButton.textContent = '重新测速';
  }

  let testing = false;
  testButton.addEventListener('click', async () => {
    if (testing) {
      return;
    }
    testing = true;
    testButton.disabled = true;
    useFastestButton.classList.add('hidden');
    fastest = null;

    try {
      for (let i = 0, len = allHosts.length; i < len; i++) {
        const hostname = allHosts[i];
        testButton.textContent = `测速中 ${i + 1}/${allHosts.length}…`;

        const spans = rowElements.get(hostname);
        if (spans) {
          spans.badge.classList.add('hidden');
          spans.speed.textContent = '测速中…';
        }

        const testUrl = cdnUtil.getSpeedTestUrlForHost(hostname);
        // eslint-disable-next-line no-await-in-loop -- hosts are tested sequentially to avoid bandwidth contention
        const outcome = testUrl === null ? null : await measureCdnHostSpeed(hostname, testUrl);

        if (spans) {
          renderOutcome(spans.speed, outcome);
        }
        if (outcome !== null && outcome.ok && (fastest === null || outcome.result.bytesPerSec > fastest.result.bytesPerSec)) {
          fastest = { hostname, result: outcome.result };
        }

        if (i + 1 < len) {
          // Pace the tests so the torn-down connection of the previous host
          // can be released before probing the next one
          // eslint-disable-next-line no-await-in-loop -- intentional pacing between hosts
          await wait(200);
        }
      }
    } finally {
      testing = false;
      testButton.disabled = false;
      testButton.textContent = '重新测速';
      showRecommendation();

      if (fastest !== null) {
        logger.info('CDN speed test completed', { fastestHostname: fastest.hostname, bytesPerSec: fastest.result.bytesPerSec });
      }
    }
  });

  useFastestButton.addEventListener('click', () => {
    if (fastest === null) {
      return;
    }
    const hostname = fastest.hostname;
    onSelect(hostname);

    const radio = list.querySelector<HTMLInputElement>(`input[name="mbgtbe-cdn-host"][value="${CSS.escape(hostname)}"]`);
    if (radio !== null) {
      radio.checked = true;
    }
  });

  function onKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      close();
    }
  }
  function close() {
    document.removeEventListener('keydown', onKeydown);
    host.remove();
  }

  closeButton.addEventListener('click', close);
  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) {
      close();
    }
  });
  document.addEventListener('keydown', onKeydown);

  document.body.appendChild(host);
}

function createGroup(title: string, hostnames: string[], current: string | null, onSelect: (hostname: string) => void, rowElements: Map<string, RowElements>) {
  const group = document.createElement('div');
  group.className = 'group';

  const groupTitle = document.createElement('div');
  groupTitle.className = 'group-title';
  groupTitle.textContent = title;
  group.appendChild(groupTitle);

  hostnames.forEach((hostname) => {
    const label = document.createElement('label');
    label.className = 'item';

    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.name = 'mbgtbe-cdn-host';
    radio.value = hostname;
    radio.checked = hostname === current;
    radio.addEventListener('change', () => {
      if (radio.checked) {
        onSelect(hostname);
      }
    });

    const name = document.createElement('span');
    name.className = 'hostname';
    name.textContent = hostname;

    const badge = document.createElement('span');
    badge.className = 'badge hidden';
    badge.textContent = '推荐';

    const speed = document.createElement('span');
    speed.className = 'speed';

    label.appendChild(radio);
    label.appendChild(name);
    label.appendChild(badge);
    label.appendChild(speed);
    group.appendChild(label);

    rowElements.set(hostname, { badge, speed });
  });

  return group;
}
