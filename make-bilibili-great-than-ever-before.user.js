// ==UserScript==
// @name        Make Bilibili Great Than Ever Before (Jayden)
// @description A fork of @kookxiang's userscript "Make Bilibili Great Again", but with many experimental features
// @namespace   https://github.com/Jayden-27/Make-Bilibili-Great-Than-Ever-Before
// @run-at      document-start
// @match       https://www.bilibili.com/*
// @match       https://t.bilibili.com/*
// @match       https://live.bilibili.com/*
// @match       https://space.bilibili.com/*
// @updateURL   https://cdn.jsdelivr.net/gh/Jayden-27/Make-Bilibili-Great-Than-Ever-Before@dist/make-bilibili-great-than-ever-before.meta.js
// @downloadURL https://cdn.jsdelivr.net/gh/Jayden-27/Make-Bilibili-Great-Than-Ever-Before@dist/make-bilibili-great-than-ever-before.user.js
// @version     1.9.3
// @author      SukkaW <https://skk.moe>
// @grant       unsafeWindow
// @grant       GM.notification
// @grant       GM_getValue
// @grant       GM.setValue
// @grant       GM.deleteValue
// @grant       GM.listValues
// @grant       GM.registerMenuCommand
// @grant       GM.unregisterMenuCommand
// ==/UserScript==

(function(){'use strict';const o$2=/* @__NO_SIDE_EFFECTS__ */()=>{},r$3=/* @__NO_SIDE_EFFECTS__ */()=>true,e$7=/* @__NO_SIDE_EFFECTS__ */()=>false;const consoleLog = unsafeWindow.console.log;
const consoleError = unsafeWindow.console.error;
const consoleWarn = unsafeWindow.console.warn;
const consoleInfo = unsafeWindow.console.info;
unsafeWindow.console.debug;
const consoleTrace = unsafeWindow.console.trace;
const consoleTable = unsafeWindow.console.table;
const consoleGroup = unsafeWindow.console.group;
const consoleGroupCollapsed = unsafeWindow.console.groupCollapsed;
const consoleGroupEnd = unsafeWindow.console.groupEnd;
const logger = {
    log: consoleLog.bind(console, '[make-bilibili-great-than-ever-before]'),
    error: consoleError.bind(console, '[make-bilibili-great-than-ever-before]'),
    warn: consoleWarn.bind(console, '[make-bilibili-great-than-ever-before]'),
    info: consoleInfo.bind(console, '[make-bilibili-great-than-ever-before]'),
    debug: o$2,
    trace (...args) {
        consoleGroupCollapsed.bind(console, '[make-bilibili-great-than-ever-before]')(...args);
        consoleTrace(...args);
        consoleGroupEnd();
    },
    group: consoleGroup.bind(console, '[make-bilibili-great-than-ever-before]'),
    groupCollapsed: consoleGroupCollapsed.bind(console, '[make-bilibili-great-than-ever-before]'),
    groupEnd: consoleGroupEnd.bind(console),
    table: consoleTable.bind(console)
};function getUrlFromRequest(request) {
    if (typeof request === 'string') return request;
    if ('href' in request) return request.href;
    if ('url' in request) return request.url;
    logger.error('Invalid requestInfo', request);
    return null;
}function createMockClass(className, instanceMethods = {}, staticMethods = {}) {
    const fakeClassInstance = new Proxy(o$2, {
        get (target, prop) {
            if (prop in instanceMethods) return instanceMethods[prop];
            return (...args)=>{
                logger.log(`(new ${className})[${String(prop)}] called with arguments:`, args);
            };
        }
    });
    return new Proxy(class {
    }, {
        construct () {
            return fakeClassInstance;
        },
        get (target, prop) {
            if (prop in staticMethods) return staticMethods[prop];
            return (...args)=>{
                logger.log(`window.${className}[${String(prop)}] called with arguments:`, args);
            };
        }
    });
}function defineReadonlyProperty(target, key, value, enumerable = true) {
    Object.defineProperty(target, key, {
        get () {
            return value;
        },
        set: o$2,
        configurable: false,
        enumerable
    });
}const n$4=new Set([".","?","*","+","^","$","|","(",")","{","}","[","]","\\"]);function e$6(t,o=false){const r={},i=(t,n)=>{let e,o=r;for(let r=0,i=t.length;r<i;++r)(e=t.charAt(r))in o||(o[e]=n?{"":""}:{}),o=o[e];o[""]="";};for(let n=0,e=t.length;n<e;++n)i(t[n],o);const c=()=>(function t(e){let o,r=false;const i=[],c=[];for(const l in e){if(!l){r=true;continue}((o=t(e[l]))?i:c).push(("-"===l?"\\x2d":n$4.has(l)?"\\"+l:l)+o);}if(r&&null==o)return "";const l=!i.length;c.length&&i.push(c[1]?"["+c.join("")+"]":c[0]);let s=i[1]?"(?:"+i.join("|")+")":i[0];return r&&(s=l?s+"?":"(?:"+s+")?"),s||""})(r);return {tree:r,add:i,toString:c,toRe:()=>new RegExp((o?"^":"")+c())}}function o$1(n,r=false){if(0===n.length)return e$7;const i=e$6(n,r).toRe();return i.test.bind(i)}const shouldDefuseUrl = o$1([
    'data.bilibili.com',
    'cm.bilibili.com',
    'api.bilibili.com/x/internal/gaia-gateway/ExClimbWuzhi'
]);
const defuseSpyware = {
    name: 'defuse-spyware',
    description: '禁用叔叔日志上报和用户跟踪的无限请求风暴',
    any ({ onBeforeFetch, onXhrOpen }) {
        defineReadonlyProperty(unsafeWindow.navigator, 'sendBeacon', r$3);
        const SentryHub = createMockClass('SentryHub');
        const fakeSentry = {
            SDK_NAME: 'sentry.javascript.browser',
            SDK_VERSION: '0.0.1145141919810',
            BrowserClient: createMockClass('Sentry.BrowserClient'),
            Hub: SentryHub,
            Integrations: {
                Vue: createMockClass('Sentry.Integrations.Vue'),
                GlobalHandlers: createMockClass('Sentry.Integrations.GlobalHandlers'),
                InboundFilters: createMockClass('Sentry.Integrations.InboundFilters')
            },
            init: o$2,
            configureScope: o$2,
            getCurrentHub: ()=>new SentryHub(),
            setContext: o$2,
            setExtra: o$2,
            setExtras: o$2,
            setTag: o$2,
            setTags: o$2,
            setUser: o$2,
            wrap: o$2
        };
        defineReadonlyProperty(unsafeWindow, 'Sentry', fakeSentry);
        defineReadonlyProperty(unsafeWindow, 'MReporter', createMockClass('MReporter'));
        defineReadonlyProperty(unsafeWindow, 'ReporterPb', createMockClass('ReporterPb'));
        defineReadonlyProperty(unsafeWindow, '__biliUserFp__', {
            init: o$2,
            queryUserLog () {
                return [];
            }
        });
        defineReadonlyProperty(unsafeWindow, '__USER_FP_CONFIG__', undefined);
        defineReadonlyProperty(unsafeWindow, '__MIRROR_CONFIG__', undefined);
        onBeforeFetch((fetchArgs)=>{
            const url = getUrlFromRequest(fetchArgs[0]);
            if (typeof url === 'string' && shouldDefuseUrl(url)) return new Response();
            return fetchArgs;
        });
        onXhrOpen((args)=>{
            let url = args[1];
            if (typeof url !== 'string') url = url.href;
            if (shouldDefuseUrl(url)) return null;
            return args;
        });
    }
};class ListNode {
    timestamp;
    next = null;
    prev = null;
    constructor(timestamp){
        this.timestamp = timestamp;
    }
}
class ErrorCounter {
    timeWindow;
    head = null;
    tail = null;
    intervalId;
    $size = 0;
    constructor(timeWindow = 10000){
        this.timeWindow = timeWindow;
        this.intervalId = self.setInterval(()=>this.cleanup(), 1000);
    }
    recordError() {
        const now = Date.now();
        const newNode = new ListNode(now);
        if (this.tail) {
            this.tail.next = newNode;
            newNode.prev = this.tail;
        } else this.head = newNode;
        this.tail = newNode;
        this.$size++;
    }
    getErrorCount() {
        this.cleanup();
        return this.$size;
    // let count = 0;
    // let current = this.head;
    // while (current) {
    //   count++;
    //   current = current.next;
    // }
    // return count;
    }
    cleanup() {
        const now = Date.now();
        while(this.head && now - this.head.timestamp > this.timeWindow){
            this.head = this.head.next;
            if (this.head) this.head.prev = null;
            else this.tail = null;
            this.$size--;
        }
    }
    stop() {
        clearInterval(this.intervalId);
    }
}/**
 * @example import { tagged as html } from 'foxts/tagged';
 */function e$5(r,...t){return r.reduce((e,r,n)=>e+r+(t[n]??""),"")}function flru (max) {
	var num, curr, prev;
	var limit = max || 1;

	function keep(key, value) {
		if (++num > limit) {
			prev = curr;
			reset(1);
			++num;
		}
		curr[key] = value;
	}

	function reset(isPartial) {
		num = 0;
		curr = Object.create(null);
		isPartial || (prev=Object.create(null));
	}

	reset();

	return {
		clear: reset,
		has: function (key) {
			return curr[key] !== void 0 || prev[key] !== void 0;
		},
		get: function (key) {
			var val = curr[key];
			if (val !== void 0) return val;
			if ((val=prev[key]) !== void 0) {
				keep(key, val);
				return val;
			}
		},
		set: function (key, value) {
			if (curr[key] !== void 0) {
				curr[key] = value;
			} else {
				keep(key, value);
			}
		}
	};
}// const mcdnRegexp = /[\dxy]+\.mcdn\.bilivideo\.cn:\d+/;
const qualityRegexp = /(live-bvc\/\d+\/live_\d+_\d+)_\w+/;
const hevcRegexp = /(\d+)_(?:mini|pro)hevc/g;
const smtcdnsRegexp = /[\w.]+\.smtcdns.net\/([\w-]+\.bilivideo.com\/)/;
const liveCdnUrlKwFilter = o$1([
    '.bilivideo.',
    '.m3u8',
    '.m4s',
    '.flv'
]);
const enhanceLive = {
    name: 'enhance-live',
    description: '增强直播（原画画质、其他修复）',
    onLive ({ addStyle, onBeforeFetch, onResponse }) {
        let forceHighestQuality = true;
        const urlMap = flru(300);
        // 还得帮叔叔修 bug，唉
        addStyle(e$5`div[data-cy=EvaRenderer_LayerWrapper]:has(.player) { z-index: 999999; }`);
        // 干掉些直播间没用的东西
        addStyle(e$5`#welcome-area-bottom-vm, .web-player-icon-roomStatus { display: none !important; }`);
        // 修复直播画质
        onBeforeFetch((fetchArgs)=>{
            if (!forceHighestQuality) return fetchArgs;
            try {
                const url = getUrlFromRequest(fetchArgs[0]);
                if (url == null) return fetchArgs;
                let finalUrl = url;
                // if (mcdnRegexp.test(url) && disableMcdn) {
                //   return Promise.reject();
                // }
                if (qualityRegexp.test(url)) {
                    finalUrl = url.replace(qualityRegexp, '$1').replaceAll(hevcRegexp, '$1');
                    logger.info('force quality', url, '->', finalUrl);
                    urlMap.set(finalUrl, url);
                }
                if (smtcdnsRegexp.test(finalUrl)) {
                    finalUrl = finalUrl.replace(smtcdnsRegexp, '$1');
                    logger.info('drop smtcdns', url, '->', finalUrl);
                }
                fetchArgs[0] = finalUrl;
                return fetchArgs;
            } catch  {
                return fetchArgs;
            }
        });
        const errorCounter = new ErrorCounter(30000);
        onResponse((resp, fetchArgs, $fetch)=>{
            if (liveCdnUrlKwFilter(resp.url) && !resp.ok) {
                logger.error('force quality fail', resp.url, resp.status);
                errorCounter.recordError();
                if (forceHighestQuality && errorCounter.getErrorCount() >= 5) {
                    forceHighestQuality = false;
                    logger.error('Force quality failed! Falling back');
                    GM.notification('[Make Bilibili Great Then Ever Before] 已为您自动切换至播放器上选择的清晰度.', '最高清晰度可能不可用');
                }
                // If we have old url, we fetch old quality again
                if (urlMap.has(resp.url)) {
                    const oldUrl = urlMap.get(resp.url);
                    logger.warn('');
                    return $fetch(oldUrl, fetchArgs[1]);
                }
            }
            return resp;
        });
    }
};const fixCopyInCV = {
    name: 'fix-copy-in-cv',
    description: '修复文章复制功能',
    onCV () {
        if ('original' in unsafeWindow) defineReadonlyProperty(unsafeWindow.original, 'reprint', '1');
        const holder = document.querySelector('.article-holder');
        if (holder) {
            holder.classList.remove('unable-reprint');
            holder.addEventListener('copy', (e)=>e.stopImmediatePropagation(), {
                capture: true
            });
        }
    }
};const noAd = {
    name: 'no-ad',
    description: '防止叔叔通过广告给自己赚棺材钱',
    any ({ addStyle }) {
        // 去广告
        /**
     * 下面是叔叔家的垃圾前端在 computed 里写副作用检测 AdBlock 是否启用：

    u = () => {
      var A;
      if (!h.value)
        return !1;
      const _ = "cm."
        , v = "bilibili.com"
        , f = ((A = h.value) == null ? void 0 : A.querySelectorAll(`a[href*="${_}${v}"]`)) || [];
      for (let y = 0; y < f.length; y++)
        if (window.getComputedStyle(f[y]).display == "none")
          return !0;
      return !1

      我们只要 display 不是 none 就行了
    }
     */ addStyle(e$5`
      .adblock-tips,
      .feed-card:has(.bili-video-card>div:empty),
      a[href*="cm.bilibili.com"],
      .desktop-download-tip,
      .ad-report {
        width: 1px !important;
        height: 1px !important;
        opacity: 0 !important;
        pointer-events: none !important;
        position: absolute !important;
        padding: 0 !important;
        margin: -1px !important;
        overflow: hidden !important;
        clip: rect(0, 0, 0, 0) !important;
        white-space: nowrap !important;
        border-width: 0 !important;
      }
    `);
        const adData = unsafeWindow.__INITIAL_STATE__?.adData;
        if (adData) {
            const keys = Object.keys(adData);
            for(let i = 0, len = keys.length; i < len; i++){
                const key = keys[i];
                const items = adData[key];
                if (!Array.isArray(items)) continue;
                for(let j = 0, itemLen = items.length; j < itemLen; j++){
                    const item = items[j];
                    item.name = 'B 站未来有可能会倒闭，但绝不会变质';
                    item.pic = 'https://static.hdslb.com/images/transparent.gif';
                    item.url = 'https://space.bilibili.com/208259';
                }
            }
        }
        if (unsafeWindow.__INITIAL_STATE__?.elecFullInfo) unsafeWindow.__INITIAL_STATE__.elecFullInfo.list = [];
    }
};function t$4(t){return t}function t$3(e,d,n=t$4){return d.forEach(r=>e.add(n(r))),e}function n$3(n){return (t,o)=>Math.floor(n()*(o-t+1))+t}const t$2=n$3(Math.random);function r$2(n){return function(e){return 1===e.length?e[0]:e[n(0,e.length-1)]}}const o=r$2(t$2);function n$2(t,n){const e=t.indexOf(n);return -1===e?t:t.slice(0,e)}const e$4=n$2;const mirrorRegex = /^https?:\/\/(?:upos-\w+-(?!302)\w+|(?:upos|proxy)-tf-[^/]+)\.(?:bilivideo|akamaized)\.(?:com|net)\/upgcxcode/;
/** `exp=<unix>` among the `~`-separated fields of Akamai's `hdnts` token */ const AKAMAI_TOKEN_EXPIRY_RE = /(?:^|~)exp=(\d+)/;
const mCdnTfRegex = /^https?:\/\/(?:(?:\d{1,3}\.){3}\d{1,3}|[^/]+\.mcdn\.bilivideo\.(?:com|cn|net))(?::\d{1,5})?\/v\d\/resource/;
const knownP2pCdnDomainPattern = o$1([
    '302ppio',
    '302kodo',
    '.mcdn.bilivideo',
    'szbdyd.com',
    '.nexusedgeio.com',
    '.ahdohpiechei.com',
    '.mountaintoys.cn',
    'upos-sz-mirror14b.bilivideo.com' // mirror type, upgcxcode, but it has no valid SSL cert, its SSL cert is for PCDN (*.bilivideo.cn)
]);
function isP2PCDNDomain(hostname) {
    if (knownP2pCdnDomainPattern(hostname)) return true;
    // upos-sz-302ppio.bilivideo.com -> *.nexusedgeio.com
    // upos-sz-302kodo.bilivideo.com -> *.ahdohpiechei.com
    // pattern: *-*302*.*
    const subdomain = e$4(hostname, '.');
    return subdomain.includes('302');
}
/** A host `mirrorRegex` accepts: an upgcxcode path on it is a mirror URL (unless P2P, see `classifyCdnUrl`) */ function isMirrorHost(hostname) {
    return mirrorRegex.test(`https://${hostname}/upgcxcode/`);
}
/**
 * Akamai matches `mirrorRegex`, but it does not accept upos signatures (403), and its own addresses
 * carry an Akamai token on top: they are used as listed, and nothing is moved onto it.
 */ function isAkamaiHost(hostname) {
    return hostname.endsWith('.akamaized.net');
}
const knownNonVideoPattern = o$1([
    'bilibili.com',
    'hdslb.com',
    'bvc.bilivideo.com',
    'bvc-drm.bilivideo.com'
]);
function isKnownNonVideoUrl(url) {
    const urlStr = url.toString();
    if (knownNonVideoPattern(urlStr)) return true;
    if (typeof url === 'string') return url.startsWith('data:') || url.startsWith('blob:');
    return url.protocol === 'data:' || url.protocol === 'blob:';
}
function classifyCdnUrl(url) {
    const href = url.href;
    // `/v1/resource` paths are not interchangeable: only the proxy can fetch them, so they must
    // not be moved onto an upgcxcode host (a moved path answers 403)
    if (mCdnTfRegex.test(href) || url.pathname.includes('/v1/resource') && (isP2PCDNDomain(url.hostname) || url.searchParams.get('os') === 'mcdn')) return 'mcdn-tf';
    if (href.includes('/upgcxcode/')) {
        // `os=mcdn` marks a PCDN signature even on a host not on the list yet:
        //
        // upos-sz-mirrorcoso1.bilivideo.com os=mcdn
        // upos-*-302.bilivideo.com (HTTP 302 p2p cdn)
        // *.edge.mountaintoys.cn os=mcdn (see upstream issue #26)
        if (isP2PCDNDomain(url.hostname) || url.searchParams.get('os') === 'mcdn') return 'mcdn-upgcxcode';
        return mirrorRegex.test(href) ? 'mirror' : 'bcache';
    }
    if (href.includes('szbdyd.com')) return 'szbdyd';
    return 'unknown';
}
/**
 * When the signed address expires, in unix seconds; `0` if unknown. An Akamai address expires with
 * its token (`hdnts=exp=<unix>~…`) if that comes before `deadline`: a 403 after it is an expired
 * address
 */ function signatureDeadlineOf(url) {
    const deadline = unixSeconds(url.searchParams.get('deadline'));
    const token = url.searchParams.get('hdnts');
    const tokenExpiry = token === null ? 0 : unixSeconds(AKAMAI_TOKEN_EXPIRY_RE.exec(token)?.[1] ?? null);
    if (deadline === 0 || tokenExpiry === 0) return deadline || tokenExpiry;
    return Math.min(deadline, tokenExpiry);
}
function unixSeconds(value) {
    const seconds = Number(value);
    return Number.isSafeInteger(seconds) && seconds > 0 ? seconds : 0;
}let t$1=RangeError("samples must not be empty");function e$3(e){if(e<0||e>100||(0|e)!==e)throw RangeError("percentile must be an integer in [0, 100]");return 0===e?function(e){let r=e.length;if(0===r)throw t$1;let n=e[0];for(let t=1;t<r;t++)e[t]<n&&(n=e[t]);return n}:100===e?function(e){let r=e.length;if(0===r)throw t$1;let n=e[0];for(let t=1;t<r;t++)e[t]>n&&(n=e[t]);return n}:function(r){let n=r.length;if(0===n)throw t$1;let l=Math.ceil(e*n/100);return function(t,e,r=t.length){let n=0;for(;;){let l=t[n];if(n>=r-1)return l;let f=n,o=r-1;for(;f<o;){for(;f<o&&t[f]<l;)f++;for(;f<o&&t[o]>=l;)o--;if(f<o){let e=t[f];t[f]=t[o],t[o]=e;}}if(e<=f)r=f;else {for(f=n=f,o=r-1;f<o;){for(;f<o&&t[f]===l;)f++;for(;f<o&&t[o]!==l;)o--;if(f<o){let e=t[f];t[f]=t[o],t[o]=e;}}if(e<=f)return l;n=f;}}}(r.slice(),l,n)}}let r$1=e$3(50);e$3(95);e$3(99);/** How a media request ended, from the point of view of its host, address and file */ var MediaOutcome = /*#__PURE__*/ function(MediaOutcome) {
    /** Validated 206, complete */ MediaOutcome["Ok"] = "ok";
    /** Aborted by us: race lost, piece done elsewhere, job over */ MediaOutcome["Canceled"] = "canceled";
    /** Validated 206, but the body ended early */ MediaOutcome["Truncated"] = "truncated";
    /** Validated 206, then the connection broke */ MediaOutcome["Reset"] = "reset";
    MediaOutcome["BadRange"] = "bad-range";
    /** The file's total size differs from what other hosts said: another version of the file */ MediaOutcome["StaleObject"] = "stale-object";
    /** The request reaches past the end of the file */ MediaOutcome["EofClamp"] = "eof-clamp";
    /** 206 without a readable Content-Range */ MediaOutcome["Unverifiable"] = "unverifiable";
    /** 200: Range ignored */ MediaOutcome["NoRange"] = "no-range";
    /** Redirected off to a P2P CDN */ MediaOutcome["Redirect"] = "redirect";
    /** 401 / 403 */ MediaOutcome["Refused"] = "refused";
    /** 404 / 410 */ MediaOutcome["Missing"] = "missing";
    /** 412 / 429 / 503 */ MediaOutcome["Throttled"] = "throttled";
    MediaOutcome["ServerError"] = "server-error";
    /** TypeError before any header, fast: DNS / TLS / CORS */ MediaOutcome["ConnectFail"] = "connect-fail";
    /** TypeError before any header */ MediaOutcome["Network"] = "network";
    MediaOutcome["Stall"] = "stall";
    /** Two hosts sent different bytes for the same range */ MediaOutcome["Integrity"] = "integrity";
    return MediaOutcome;
}({});
const KiB$1 = 1024;
/** What a request is assumed to deliver before anything is measured */ const PRIOR_RATE = 768 * KiB$1 / 1000;
const PRIOR_TTFB = 350;
const SAMPLES = 8;
/** A connection idle for longer is probably closed: a new one costs about another first byte */ const WARM_MS = 30000;
/** Nothing arrived from any host for this long while requests ran: failures are the viewer's network, not the hosts */ const NETWORK_DOWN_MS = 3000;
/** Failures that the viewer's own network going away produces on every host at once */ const CONNECTION_FAILURES = new Set([
    "connect-fail",
    "network",
    "stall",
    "truncated",
    "reset"
]);
const hosts = new Map();
/** video key -> hostname -> speed */ const speeds = flru(32);
/** file key -> hostname -> excluded until */ const exclusions = flru(256);
/** Last time bytes arrived from any host */ let lastBytesAt = -Infinity;
/** The host the user pinned, `null` for automatic selection */ let manualHost = null;
function getManualCdnHost() {
    return manualHost;
}
function setManualCdnHost(hostname) {
    manualHost = hostname;
}
function estimate(hostname, file, bytes) {
    const own = speedsOf(file).get(hostname);
    const rate = own && robust(own.rate, false);
    const typical = typicalSpeed(file);
    const cold = performance.now() - get(hostname).lastUsedAt > WARM_MS;
    const ttfb = ((own && robust(own.ttfb, true)) ?? typical.ttfb) * (cold ? 2 : 1);
    return {
        ttfb,
        rate: rate ?? typical.rate,
        eta: ttfb + bytes / (rate ?? typical.rate),
        measured: rate != null,
        gap: own ? robust(own.gap, true) : null
    };
}
/** The median over the hosts measured on this video, else what is assumed */ function typicalSpeed(file) {
    const ttfbs = [];
    const rates = [];
    for (const speed of speedsOf(file).values()){
        const ttfb = robust(speed.ttfb, true);
        const rate = robust(speed.rate, false);
        if (ttfb !== null) ttfbs.push(ttfb);
        if (rate !== null) rates.push(rate);
    }
    return {
        ttfb: ttfbs.length > 0 ? r$1(ttfbs) : PRIOR_TTFB,
        rate: rates.length > 0 ? r$1(rates) : PRIOR_RATE
    };
}
/** Bytes arrived from some host, or work resumed after idle: the network works as of now */ function noteBytes(now) {
    lastBytesAt = now;
}
function isCoolingDown(hostname, now) {
    return get(hostname).cooldownUntil > now;
}
function isExcluded(hostname, file, now) {
    return (exclusions.get(file.key)?.get(hostname) ?? 0) > now;
}
/**
 * @param sample `ttfb` in ms, or how long it waited without one when that says the host is slow;
 * `rate` in bytes per ms after the first chunk, `partial` when the transfer was cut short (only
 * counted until a full one is known); `gap` in ms
 */ function recordSpeed(hostname, file, sample) {
    const byHost = speedsOf(file);
    let speed = byHost.get(hostname);
    if (speed === undefined) {
        speed = {
            ttfb: [],
            rate: [],
            gap: []
        };
        byHost.set(hostname, speed);
    }
    const { ttfb, rate, gap } = sample;
    push(speed.ttfb, ttfb);
    push(speed.rate, rate !== null && rate > 0 && (!sample.partial || speed.rate.length === 0) ? rate : null);
    push(speed.gap, gap);
}
/**
 * @param alive another request to the host is delivering right now: a connection-level failure
 * is then one bad connection, and the host stays available for the retry
 */ function recordOutcome(hostname, file, outcome, now, alive) {
    get(hostname).lastUsedAt = now;
    if (CONNECTION_FAILURES.has(outcome) && (alive || now - lastBytesAt > NETWORK_DOWN_MS)) return;
    const host = get(hostname);
    switch(outcome){
        case "ok":
            lastBytesAt = now;
            host.failureStreak = 0;
            break;
        case "truncated":
        case "reset":
        case "stall":
            cooldown(host, now, 500);
            break;
        case "bad-range":
        case "stale-object":
        case "no-range":
        case "unverifiable":
        case "redirect":
        case "missing":
        case "integrity":
            exclude(hostname, file, Infinity);
            break;
        case "refused":
            // Every host only gets signatures it verifies (upos ones, Akamai its own): a refusal in
            // time is between this host and this file
            exclude(hostname, file, now + 60000);
            break;
        case "throttled":
            cooldown(host, now, 2000 * 2 ** Math.min(host.failureStreak, 3));
            break;
        case "server-error":
        case "network":
            cooldown(host, now, 1000 * 2 ** Math.min(host.failureStreak, 5));
            break;
        case "connect-fail":
            cooldown(host, now, 60000 * 2 ** Math.min(host.failureStreak, 2));
            break;
    }
}
function get(hostname) {
    let host = hosts.get(hostname);
    if (host === undefined) {
        host = {
            lastUsedAt: -Infinity,
            cooldownUntil: 0,
            failureStreak: 0
        };
        hosts.set(hostname, host);
    }
    return host;
}
function speedsOf(file) {
    let byHost = speeds.get(file.videoKey);
    if (byHost === undefined) {
        byHost = new Map();
        speeds.set(file.videoKey, byHost);
    }
    return byHost;
}
function cooldown(host, now, ms) {
    host.failureStreak++;
    host.cooldownUntil = Math.max(host.cooldownUntil, now + ms);
}
function exclude(hostname, file, until) {
    let byHost = exclusions.get(file.key);
    if (byHost === undefined) {
        byHost = new Map();
        exclusions.set(file.key, byHost);
    }
    byHost.set(hostname, until);
}
/** The median, but a sudden turn for the worse shows at once: the two latest, both 2x worse than it */ function robust(samples, higherIsWorse) {
    const len = samples.length;
    if (len === 0) return null;
    const median = r$1(samples);
    const latest = samples[len - 1];
    const previous = samples[len - 2];
    if (higherIsWorse && len >= 3 && latest > 2 * median && previous > 2 * median) return Math.min(latest, previous);
    if (!higherIsWorse && len >= 3 && latest < median / 2 && previous < median / 2) return Math.max(latest, previous);
    return median;
}
function push(samples, value) {
    if (value !== null) {
        samples.push(value);
        samples.splice(0, samples.length - SAMPLES);
    }
}const hosts$1=/*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({__proto__:null,MediaOutcome,estimate,getManualCdnHost,isCoolingDown,isExcluded,noteBytes,recordOutcome,recordSpeed,setManualCdnHost,typicalSpeed},Symbol.toStringTag,{value:'Module'}));/** Inclusive byte range, as used by HTTP `Range` / `Content-Range` */ function byteRangeLength(range) {
    return range.end - range.start + 1;
}
const rangeHeaderRegex = /^bytes=(\d+)-(\d+)$/i;
/** A single bounded `Range: bytes=a-b` request header; anything else returns `null` */ function parseRangeHeader(value) {
    return toByteRange(rangeHeaderRegex.exec(value.trim()));
}
const contentRangeRegex = /^bytes (\d+)-(\d+)\/(\d+|\*)$/i;
function parseContentRange(value) {
    const match = value === null ? null : contentRangeRegex.exec(value.trim());
    const range = toByteRange(match);
    if (match === null || range === null) return null;
    if (match[3] === '*') return {
        ...range,
        total: null
    };
    const total = Number(match[3]);
    return Number.isSafeInteger(total) && total > range.end ? {
        ...range,
        total
    } : null;
}
const byteRangeSpecRegex = /^(\d+)-(\d+)$/;
/** Byte ranges in Bilibili's DASH `SegmentBase`, e.g. `'0-1011'` */ function parseByteRangeSpec(value) {
    return typeof value === 'string' ? toByteRange(byteRangeSpecRegex.exec(value.trim())) : null;
}
/** The first two groups of a match as a range: `null` unless both are safe integers, in order */ function toByteRange(match) {
    if (match === null) return null;
    const start = Number(match[1]);
    const end = Number(match[2]);
    return Number.isSafeInteger(start) && Number.isSafeInteger(end) && start <= end ? {
        start,
        end
    } : null;
}/** A non-null object: its properties are still to be checked, as with any parsed JSON */ function isObject(value) {
    return typeof value === 'object' && value !== null;
}/** Every upgcxcode host (upos mirror, Bilibili PoP, and Akamai, which `candidates.ts` leaves out) seen in any playinfo or request */ const upgcxcodeHosts = new Set();
/** A signed upgcxcode path, valid on any upgcxcode host: the speed test swaps its host */ let sampleUpgcxcodeKey = null;
function getSampleUpgcxcodeKey() {
    return sampleUpgcxcodeKey;
}
/**
 * pathname -> the file as listed by the newest playinfo. A new playinfo re-signs the same paths,
 * so the old addresses keep working until their deadline, and the new ones are fresher
 */ const filesByPath = flru(400);
/** video key -> its files, as listed by its newest playinfo */ const filesByVideo = flru(32);
let fileCount = 0;
let videoCount = 0;
/** Collect the host of a CDN URL */ function noteHost(address) {
    if (address.class === 'mirror' || address.class === 'bcache') upgcxcodeHosts.add(address.hostname);
}
function ingestPlayinfo(json, meta) {
    const dash = extractDash(json);
    if (!dash) {
        logger.warn('Invalid Bilibili Playinfo data', {
            json
        });
        return;
    }
    const listed = [];
    let videoKey = null;
    const representations = representationsOf(dash);
    for(let i = 0, len = representations.length; i < len; i++){
        const [kind, representation] = representations[i];
        const addresses = readAddresses(representation);
        if (addresses.length > 0) {
            const known = knownFileOf(addresses);
            // Files seen before: the same video again (re-signed addresses, another quality)
            videoKey ??= known?.videoKey ?? null;
            listed.push({
                kind,
                representation,
                addresses,
                known
            });
        }
    }
    videoKey ??= `video-${++videoCount}`;
    const files = [];
    for(let i = 0, len = listed.length; i < len; i++){
        const { kind, representation, addresses, known } = listed[i];
        const file = {
            key: known?.key ?? `file-${++fileCount}`,
            videoKey,
            kind,
            codecs: typeof representation.codecs === 'string' ? representation.codecs : '',
            bandwidth: Number(representation.bandwidth) || 0,
            segmentBase: segmentBaseOf(representation),
            addresses
        };
        files.push(file);
        for(let j = 0, count = addresses.length; j < count; j++)filesByPath.set(addresses[j].pathname, file);
    }
    filesByVideo.set(videoKey, files);
    logger.info('CDN URLs extracted', {
        meta
    });
}
/** As listed by the newest playinfo: the freshest signed addresses, whichever one was requested */ function findFile(address) {
    return filesByPath.get(address.pathname) ?? null;
}
function filesOf(videoKey) {
    return filesByVideo.get(videoKey) ?? [];
}
/** Read everything the interceptor needs from a CDN URL, once */ function toMediaAddress(url) {
    return {
        href: url.href,
        hostname: url.hostname,
        pathname: url.pathname,
        key: url.pathname + url.search,
        class: classifyCdnUrl(url),
        deadline: signatureDeadlineOf(url)
    };
}
function extractDash(json) {
    // normal video player, and pugv (cheese)
    if (isObject(json.data) && isObject(json.data.dash)) return json.data.dash;
    if (isObject(json.result)) {
        // bangumi video player
        if (isObject(json.result.video_info) && isObject(json.result.video_info.dash)) return json.result.video_info.dash;
        // bangumi video player, older playurl API
        if (isObject(json.result.dash)) return json.result.dash;
    }
    return null;
}
function representationsOf(dash) {
    const representations = [];
    const add = (kind, list)=>{
        if (Array.isArray(list)) for(let i = 0, len = list.length; i < len; i++){
            const item = list[i];
            if (isObject(item)) representations.push([
                kind,
                item
            ]);
        }
        else if (isObject(list)) representations.push([
            kind,
            list
        ]);
    };
    add('video', dash.video);
    add('audio', dash.audio);
    // Dolby Atmos: an array
    if (isObject(dash.dolby)) add('audio', dash.dolby.audio);
    // Hi-Res: a single representation
    if (isObject(dash.flac)) add('audio', dash.flac.audio);
    return representations;
}
function knownUrlsOf(representation) {
    const knownUrls = new Set();
    const add = (value)=>{
        if (typeof value === 'string') knownUrls.add(value);
        else if (Array.isArray(value)) for(let i = 0, len = value.length; i < len; i++){
            const item = value[i];
            if (typeof item === 'string') knownUrls.add(item);
        }
    };
    add(representation.baseUrl);
    add(representation.base_url);
    add(representation.backupUrl);
    add(representation.backup_url);
    return knownUrls;
}
function segmentBaseOf(representation) {
    const segmentBase = isObject(representation.SegmentBase) ? representation.SegmentBase : isObject(representation.segment_base) ? representation.segment_base : null;
    if (!segmentBase) return null;
    const init = parseByteRangeSpec(segmentBase.Initialization ?? segmentBase.initialization);
    const index = parseByteRangeSpec(segmentBase.indexRange ?? segmentBase.index_range);
    return init && index ? {
        init,
        index
    } : null;
}
/** Every address listed for a representation */ function readAddresses(representation) {
    const addresses = [];
    for (const urlStr of knownUrlsOf(representation)){
        let url;
        try {
            url = new URL(urlStr);
        } catch  {
            logger.debug('Failed to process CDN URL, skipping.', {
                url: urlStr
            });
            continue;
        }
        const address = toMediaAddress(url);
        if (address.class === 'unknown') logger.error(`Unrecognized CDN URL pattern: ${urlStr}`);
        else if (address.pathname.includes('/upgcxcode/') && !isAkamaiHost(address.hostname)) // Newer playinfo re-signs the same paths: keep the freshest sample
        sampleUpgcxcodeKey = address.key;
        noteHost(address);
        addresses.push(address);
    }
    return addresses;
}
/** The file an earlier playinfo listed under any of these addresses' paths */ function knownFileOf(addresses) {
    for(let i = 0, len = addresses.length; i < len; i++){
        const file = filesByPath.get(addresses[i].pathname);
        if (file !== undefined) return file;
    }
    return null;
}/**
 * How much a host with no measurement is preferred, lower first: what Bilibili listed for the file
 * before what is moved elsewhere (a native request has no fallback). Measurements override it
 */ var CandidateTier = /*#__PURE__*/ function(CandidateTier) {
    /** Listed for the file (or asked for by the player) on an upos mirror */ CandidateTier[CandidateTier["ListedMirror"] = 0] = "ListedMirror";
    /** Listed on Bilibili's own PoP */ CandidateTier[CandidateTier["ListedBcache"] = 1] = "ListedBcache";
    /** A listed signature moved onto another upos mirror */ CandidateTier[CandidateTier["Mirror"] = 2] = "Mirror";
    /** A listed signature moved onto another PoP */ CandidateTier[CandidateTier["Bcache"] = 3] = "Bcache";
    /** A PCDN URL pointed back at its source host */ CandidateTier[CandidateTier["Source"] = 4] = "Source";
    /** Fetched through Bilibili's proxy */ CandidateTier[CandidateTier["Proxy"] = 5] = "Proxy";
    /** A P2P / PCDN host */ CandidateTier[CandidateTier["P2P"] = 6] = "P2P";
    return CandidateTier;
}({});
/** Bilibili's proxy hosts, which fetch a PCDN URL for us */ const PROXY_HOST_RE = /^(?:upos|proxy)-tf-/;
/** A signature must stay valid at least this long to be used */ const DEADLINE_MARGIN_MS = 60000;
/**
 * upgcxcode hosts, tried even before any playinfo lists them. Which ones work, and how fast, is
 * learned. Never a P2P / PCDN host (`isP2PCDNDomain`), never Akamai (`isAkamaiHost`).
 */ const SEED_HOSTS = [
    'upos-sz-mirrorali.bilivideo.com',
    'upos-sz-mirrorhw.bilivideo.com',
    'upos-sz-mirrorbos.bilivideo.com',
    'upos-sz-mirror08c.bilivideo.com',
    'upos-sz-mirrorbd.bilivideo.com',
    'upos-sz-mirrorcos.bilivideo.com',
    'upos-sz-mirrorcoso1.bilivideo.com',
    'upos-sz-mirrorcosb.bilivideo.com',
    'upos-sz-mirrorcosov.bilivideo.com',
    'upos-sz-mirroraliov.bilivideo.com',
    'upos-sz-estgoss.bilivideo.com',
    'cn-hk-eq-01-01.bilivideo.com',
    'cn-hk-eq-01-03.bilivideo.com'
];
/**
 * The URL a request asked for (`null` for none) and every address listed for its file (`null`
 * when the registry does not know it), as they are, plus every upgcxcode signature among them on
 * every upgcxcode host.
 */ function mediaCandidates(requested, file) {
    const candidates = [];
    const seen = new Set();
    const add = (candidate)=>{
        if (!seen.has(candidate.href)) {
            seen.add(candidate.href);
            candidates.push(candidate);
        }
    };
    const listed = file === null ? [] : file.addresses;
    const sources = requested === null ? listed : [
        requested,
        ...listed
    ];
    const upgcxcodeHosts = upgcxcodeHostsOf(file);
    /** Signatures already on every upgcxcode host: the requested one is usually listed as well */ const moved = new Set();
    for(let i = 0, len = sources.length; i < len; i++){
        const source = sources[i];
        add(asListed(source));
        const { key } = source;
        if (source.pathname.includes('/upgcxcode/') && source.class !== 'mcdn-tf' && !isAkamaiHost(source.hostname) && !moved.has(key)) {
            moved.add(key);
            for(let j = 0, count = upgcxcodeHosts.length; j < count; j++){
                const hostname = upgcxcodeHosts[j];
                // The path is an upgcxcode one wherever it is moved: only the host tells mirror from PoP
                const mirror = isMirrorHost(hostname);
                add({
                    ...source,
                    href: `https://${hostname}${key}`,
                    hostname,
                    class: mirror ? 'mirror' : 'bcache',
                    tier: mirror ? 2 : 3,
                    p2p: false
                });
            }
        }
    }
    return candidates;
}
/** Not about to expire, and this host does not lack the file */ function isCandidateUsable(candidate, file, now, nowSec) {
    return (candidate.deadline === 0 || (candidate.deadline - nowSec) * 1000 > DEADLINE_MARGIN_MS) && (file === null || !isExcluded(candidate.hostname, file, now));
}
/** The candidate a request made for this address stands for, `null` if it is not acceptable */ function findCandidate(candidates, address) {
    for(let i = 0, len = candidates.length; i < len; i++){
        const candidate = candidates[i];
        if (candidate.hostname === address.hostname && candidate.key === address.key) return candidate;
    }
    return null;
}
/**
 * A usable candidate of the lowest tier, at random, on a host not cooling down if there is one:
 * what the browser fetches when the requested URL is not acceptable
 *
 * @param preferredKey the requested URL's signature, kept when a manually selected host can serve it
 */ function defaultCandidate(candidates, file, now, preferredKey = null) {
    const nowSec = Date.now() / 1000;
    const usable = candidates.filter((candidate)=>isCandidateUsable(candidate, file, now, nowSec));
    const available = usable.filter((candidate)=>!isCoolingDown(candidate.hostname, now));
    const options = available.length > 0 ? available : usable;
    const manualHost = getManualCdnHost();
    if (manualHost !== null) {
        const pinned = options.filter((candidate)=>candidate.hostname === manualHost);
        if (pinned.length > 0) {
            // Keep the requested signature when the pinned host serves it
            if (preferredKey !== null) for(let i = 0, len = pinned.length; i < len; i++){
                if (pinned[i].key === preferredKey) return pinned[i];
            }
            // Prefer the host's own (listed) signature over one moved from another host
            let tier = pinned[0].tier;
            for(let i = 1, len = pinned.length; i < len; i++)if (pinned[i].tier < tier) tier = pinned[i].tier;
            return o(pinned.filter((candidate)=>candidate.tier === tier));
        }
    }
    let best = null;
    for(let i = 0, len = options.length; i < len; i++)if (best === null || options[i].tier < best) best = options[i].tier;
    return best === null ? null : o(options.filter((candidate)=>candidate.tier === best));
}
/** The file's own upgcxcode hosts first (Bilibili picked them for this viewer), then the others */ function upgcxcodeHostsOf(file) {
    const names = new Set();
    if (file !== null) for(let i = 0, len = file.addresses.length; i < len; i++){
        const address = file.addresses[i];
        if (address.class === 'mirror' || address.class === 'bcache') names.add(address.hostname);
    }
    for (const hostname of upgcxcodeHosts)names.add(hostname);
    t$3(names, SEED_HOSTS);
    // A remembered host may not be listed by this playinfo: keep its signatures available
    const manualHost = getManualCdnHost();
    if (manualHost !== null) names.add(manualHost);
    return Array.from(names).filter((hostname)=>!isP2PCDNDomain(hostname) && !isAkamaiHost(hostname));
}
/** An address as it was given: non-P2P ones over HTTPS, P2P ones untouched (their own ports) */ function asListed(source) {
    const { hostname, class: cls } = source;
    if (cls === 'mcdn-upgcxcode' || cls === 'mcdn-tf' || cls === 'szbdyd' || isP2PCDNDomain(hostname)) return {
        ...source,
        tier: 6,
        p2p: true
    };
    const tier = PROXY_HOST_RE.test(hostname) ? 5 : cls === 'bcache' ? 1 : 0;
    return {
        ...source,
        href: `https://${hostname}${source.key}`,
        tier,
        p2p: false
    };
}/** The upstream CDN vendor behind a Bilibili mirror host, as its DNS CNAME shows */ const VENDOR_RULES = [
    [
        /^upos-sz-mirroraliov\./,
        '七牛云'
    ],
    [
        /^upos-sz-mirrorali\./,
        '阿里云'
    ],
    [
        /^upos-sz-mirrorhwo1\./,
        '华为云'
    ],
    [
        /^upos-sz-mirrorhw\./,
        '华为云'
    ],
    [
        /^upos-sz-mirror08c\./,
        '华为云'
    ],
    [
        /^upos-sz-mirrorbos\./,
        '百度云'
    ],
    [
        /^upos-sz-mirrorbd\./,
        '百度云'
    ],
    [
        /^upos-sz-mirrorcosb\./,
        '腾讯云'
    ],
    [
        /^upos-sz-mirrorcoso1\./,
        '腾讯云'
    ],
    [
        /^upos-sz-mirrorcosov\./,
        '腾讯云'
    ],
    [
        /^upos-sz-mirrorcos\./,
        '腾讯云'
    ],
    [
        /^upos-sz-mirrorzos\./,
        '腾讯云'
    ],
    [
        /^upos-sz-estgoss\./,
        '阿里云'
    ],
    [
        /^cn-/,
        'B站自建'
    ]
];
function cdnVendorOf(hostname) {
    for(let i = 0, len = VENDOR_RULES.length; i < len; i++){
        if (VENDOR_RULES[i][0].test(hostname)) return VENDOR_RULES[i][1];
    }
    return null;
}const PREFERENCE_KEY = 'mbgtbe:cdn-preference:v1';
const HOSTNAME_RE = /^(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/i;
/** Mirrors the stored preference for the current page, so the panel can show it before a GM write resolves */ let rememberedHost = null;
function isValidHost(host) {
    if (!HOSTNAME_RE.test(host) || isP2PCDNDomain(host) || isAkamaiHost(host)) return false;
    try {
        return new URL(`https://${host}`).hostname === host.toLowerCase();
    } catch  {
        return false;
    }
}
function savePreference(preference) {
    const result = GM.setValue(PREFERENCE_KEY, preference);
    if (result instanceof Promise) result.catch((e)=>{
        if (rememberedHost === preference.host) rememberedHost = null;
        logger.warn('Failed to save CDN preference', e);
    });
}
function removePreferenceFromStorage() {
    const result = GM.deleteValue(PREFERENCE_KEY);
    if (result instanceof Promise) result.catch((e)=>logger.warn('Failed to clear CDN preference', e));
}
function removePreference() {
    try {
        removePreferenceFromStorage();
    } catch (e) {
        logger.warn('Failed to clear CDN preference', e);
    }
}
function readPreference() {
    let raw;
    try {
        raw = GM_getValue(PREFERENCE_KEY, null);
    } catch (e) {
        logger.warn('Failed to read CDN preference', e);
        return null;
    }
    if (!isObject(raw)) return null;
    const { host, savedAt, source } = raw;
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
/** Apply the stored preference before no-p2p registers its policy */ function restoreCdnPreference() {
    const preference = readPreference();
    if (preference === null) {
        rememberedHost = null;
        return null;
    }
    rememberedHost = preference.host;
    setManualCdnHost(preference.host);
    logger.info('CDN preference restored', {
        host: preference.host,
        source: preference.source,
        savedAt: preference.savedAt
    });
    return preference.host;
}
function rememberCdnHost(hostname, source) {
    if (!isValidHost(hostname)) {
        logger.warn('Ignoring invalid CDN preference', {
            hostname
        });
        return;
    }
    rememberedHost = hostname;
    setManualCdnHost(hostname);
    const preference = {
        host: hostname,
        savedAt: Date.now(),
        source
    };
    try {
        savePreference(preference);
    } catch (e) {
        rememberedHost = null;
        logger.warn('Failed to save CDN preference', e);
    }
    logger.info('CDN preference saved', {
        host: hostname,
        source
    });
}
function forgetCdnPreference() {
    rememberedHost = null;
    setManualCdnHost(null);
    removePreference();
    logger.info('CDN preference cleared');
}
function getRememberedCdnHost() {
    return rememberedHost;
}const t="name",r="message",n$1="stack";function e$2(e){return "object"==typeof e&&!!e&&t in e&&"string"==typeof e[t]&&r in e&&"string"==typeof e[r]&&(!(n$1 in e)||"string"==typeof e[n$1])}function e$1(t,n=false){return new Promise(e=>{const o=setTimeout(e,t);n&&"object"==typeof o&&"unref"in o&&"function"==typeof o.unref&&o.unref();})}// Speed tests must bypass our own fetch/XHR hooks (no-p2p would rewrite the test
// URL to the currently selected CDN, ruining the measurement), so we capture the
// pristine fetch here. Module top-level code is evaluated before index.ts's
// bootstrap IIFE overrides unsafeWindow.fetch.
// eslint-disable-next-line @typescript-eslint/unbound-method -- cache original method
const nativeFetch = unsafeWindow.fetch;
const SAMPLES_PER_HOST = 3;
// Each sample downloads at most 1 MiB and lasts at most 500 ms, whichever comes
// first: fast hosts get a large enough sample for a stable steady-state reading
// (TCP slow start ramps down), while slow hosts no longer burn through the whole
// timeout just to report their actual speed.
const SAMPLE_BYTES_LIMIT = 1048576;
const SAMPLE_TIME_LIMIT_MS = 500;
const SAMPLE_TIMEOUT_MS = 5000;
const SAMPLE_INTERVAL_MS = 150;
// Session-level cache, so reopening the selector panel keeps the results
const resultCache = new Map();
function getCachedSpeedTestResult(hostname) {
    return resultCache.get(hostname);
}
function formatSpeed(bytesPerSec) {
    if (bytesPerSec >= 1048576) return `${(bytesPerSec / 1024 / 1024).toFixed(1)} MB/s`;
    if (bytesPerSec >= 1024) return `${(bytesPerSec / 1024).toFixed(0)} KB/s`;
    return `${bytesPerSec.toFixed(0)} B/s`;
}
function formatOutcome(outcome) {
    if (outcome === null) return '失败';
    return outcome.ok ? formatSpeed(outcome.result.bytesPerSec) : outcome.reason;
}
async function measureCdnHostSpeed(hostname, url) {
    const samples = [];
    for(let i = 0; i < SAMPLES_PER_HOST; i++){
        try {
            // eslint-disable-next-line no-await-in-loop -- samples must be sequential to avoid self-contention
            samples.push(await measureOnce(url));
        } catch (e) {
            logger.debug('CDN speed test sample failed', {
                hostname,
                error: e
            });
            if (samples.length === 0) // Fail fast: the very first sample already failed, no point in retrying
            return cacheOutcome(hostname, {
                ok: false,
                reason: toReason(e)
            });
        }
        if (i + 1 < SAMPLES_PER_HOST) // eslint-disable-next-line no-await-in-loop -- let the torn-down connection settle
        await e$1(SAMPLE_INTERVAL_MS);
    }
    const result = {
        bytesPerSec: median(samples.map((sample)=>sample.bytesPerSec)),
        ttfbMs: median(samples.map((sample)=>sample.ttfbMs)),
        samples
    };
    return cacheOutcome(hostname, {
        ok: true,
        result
    });
}
async function measureOnce(url) {
    const controller = new AbortController();
    const timeout = setTimeout(()=>controller.abort(), SAMPLE_TIMEOUT_MS);
    try {
        const startedAt = performance.now();
        const response = await nativeFetch(url, {
            signal: controller.signal,
            cache: 'no-store'
        });
        if (!response.ok || response.body === null) throw new Error(response.ok ? '失败' : `HTTP ${response.status}`);
        // Read the stream until one of the limits is reached, then cancel the rest of the download
        const reader = response.body.getReader();
        let bytes = 0;
        let firstChunkAt = null;
        for(;;){
            // eslint-disable-next-line no-await-in-loop -- sequential stream read until the limits are reached
            const { done, value } = await reader.read();
            if (done) break;
            const now = performance.now();
            if (firstChunkAt === null) firstChunkAt = now;
            else if (now - firstChunkAt >= SAMPLE_TIME_LIMIT_MS) break;
            bytes += value.byteLength;
            if (bytes >= SAMPLE_BYTES_LIMIT) break;
        }
        const endedAt = performance.now();
        // Forcefully tear down the in-flight request. Merely canceling the reader can
        // leave the connection lingering (especially in Firefox), and the half-open
        // connections pile up on repeated test runs, making the next run time out.
        controller.abort();
        reader.cancel().catch(o$2);
        const firstByteAt = firstChunkAt ?? endedAt;
        const ttfbMs = firstByteAt - startedAt;
        // Throughput is measured only after the first byte arrives, so connection
        // setup and server response time do not skew the result
        const downloadMs = Math.max(endedAt - firstByteAt, 1);
        return {
            bytesPerSec: bytes / (downloadMs / 1000),
            ttfbMs
        };
    } finally{
        clearTimeout(timeout);
    }
}
function median(values) {
    const sorted = [
        ...values
    ].sort((a, b)=>a - b);
    return sorted[Math.floor(sorted.length / 2)];
}
function toReason(e) {
    if (e instanceof DOMException && e.name === 'AbortError') return '超时';
    if (e$2(e) && e.message !== '') return e.message;
    return '失败';
}
function cacheOutcome(hostname, outcome) {
    resultCache.set(hostname, outcome);
    return outcome;
}function onDOMContentLoaded(callback) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', callback, {
        once: true
    });
    else callback();
}
function onLoaded(callback) {
    if (document.readyState === 'complete') callback();
    else // eslint-disable-next-line no-restricted-globals -- use sandboxed event handler
    window.addEventListener('load', callback, {
        once: true
    });
}const PANEL_HOST_ID = 'mbgtbe-cdn-selector-panel';
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
  .vendor {
    font-size: 12px;
    color: #9499a0;
    white-space: nowrap;
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
function registerCdnSelectorMenu() {
    GM.registerMenuCommand('选择 CDN 节点', ()=>{
        // The userscript runs at document-start, the menu may be clicked before body exists
        if (document.readyState === 'loading') onDOMContentLoaded(openCdnSelectorPanel);
        else openCdnSelectorPanel();
    });
}
function renderOutcome(span, outcome) {
    span.textContent = formatOutcome(outcome);
    if (outcome?.ok === true) {
        const sampleSpeeds = outcome.result.samples.map((sample)=>formatSpeed(sample.bytesPerSec)).join(' / ');
        span.title = `${outcome.result.samples.length} 次采样取中位数\n采样速度: ${sampleSpeeds}\nTTFB 中位数: ${Math.round(outcome.result.ttfbMs)} ms`;
    } else span.removeAttribute('title');
}
function openCdnSelectorPanel() {
    if (document.getElementById(PANEL_HOST_ID) !== null) return;
    const { mirror, bcache } = collectedCdnHosts();
    // Only the official mirror sources participate in the speed test;
    // bcache hosts stay manually selectable but are never tested
    const testHosts = mirror;
    const speedTestAvailable = getSampleUpgcxcodeKey() !== null;
    const host = document.createElement('div');
    host.id = PANEL_HOST_ID;
    const shadow = host.attachShadow({
        mode: 'open'
    });
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
    const updateStatus = ()=>{
        const selected = getManualCdnHost();
        const remembered = getRememberedCdnHost();
        status.textContent = selected === null ? '当前模式：自动（默认选择逻辑）' : `当前模式：手动（${selected}${remembered === selected ? '，已记住' : ''}）`;
    };
    updateStatus();
    panel.appendChild(status);
    const list = document.createElement('div');
    list.className = 'list';
    panel.appendChild(list);
    const rowElements = new Map();
    const onSelect = (hostname, source = 'manual')=>{
        rememberCdnHost(hostname, source);
        updateStatus();
        logger.info('CDN manually selected', {
            hostname,
            source
        });
    };
    if (mirror.length === 0 && bcache.length === 0) {
        const empty = document.createElement('div');
        empty.className = 'empty';
        empty.textContent = '尚未收集到 CDN 信息，请先开始播放视频后再打开此面板。';
        list.appendChild(empty);
    } else {
        if (mirror.length > 0) list.appendChild(createGroup('官方镜像 CDN（upos mirror，推荐）', mirror, getManualCdnHost(), onSelect, rowElements));
        if (bcache.length > 0) list.appendChild(createGroup('自建 CDN 节点（bcache，不参与测速）', bcache, getManualCdnHost(), onSelect, rowElements));
    }
    const tip = document.createElement('div');
    tip.className = 'tip';
    tip.textContent = '手动选择对所有可互换的 upgcxcode 视频流生效；纯 IP / mcdn 流不适用，仍走默认的代理兜底。选择会长期保存在本机，下次打开 B 站继续生效；开启「多 CDN 分片并发」时该节点优先，其他节点自动兜底，节点明显变慢时会自动降级。测速仅针对官方镜像源，每个节点做 3 次采样取中位数（每次下载最多 1MB 或持续 500ms），吞吐量不含连接建立耗时，悬停可查看采样明细，结果仅供参考。测速结果仅保留在当前页面会话中，点「恢复自动」可清除已记住的节点。';
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
    testButton.disabled = testHosts.length === 0 || !speedTestAvailable;
    const useFastestButton = document.createElement('button');
    useFastestButton.className = 'btn btn-primary hidden';
    useFastestButton.textContent = '使用最快节点';
    const resetButton = document.createElement('button');
    resetButton.className = 'btn';
    resetButton.textContent = '恢复自动';
    resetButton.addEventListener('click', ()=>{
        forgetCdnPreference();
        updateStatus();
        const checkedRadio = list.querySelector('input[type="radio"]:checked');
        if (checkedRadio !== null) checkedRadio.checked = false;
    });
    footerLeft.appendChild(testButton);
    footerLeft.appendChild(useFastestButton);
    footerRight.appendChild(resetButton);
    footer.appendChild(footerLeft);
    footer.appendChild(footerRight);
    panel.appendChild(footer);
    let fastest = null;
    const showRecommendation = ()=>{
        if (fastest === null) return;
        const spans = rowElements.get(fastest.hostname);
        if (spans) spans.badge.classList.remove('hidden');
        useFastestButton.classList.remove('hidden');
    };
    // Restore cached speed test results (if any) when the panel is reopened
    const restoreCachedResults = ()=>{
        let best = null;
        testHosts.forEach((hostname)=>{
            const cached = getCachedSpeedTestResult(hostname);
            const spans = rowElements.get(hostname);
            if (cached === undefined || spans === undefined) return;
            renderOutcome(spans.speed, cached);
            if (cached.ok && (best === null || cached.result.bytesPerSec > best.result.bytesPerSec)) best = {
                hostname,
                result: cached.result
            };
        });
        return best;
    };
    fastest = restoreCachedResults();
    if (fastest !== null) {
        showRecommendation();
        testButton.textContent = '重新测速';
    }
    let testing = false;
    testButton.addEventListener('click', async ()=>{
        if (testing) return;
        testing = true;
        testButton.disabled = true;
        useFastestButton.classList.add('hidden');
        fastest = null;
        try {
            for(let i = 0, len = testHosts.length; i < len; i++){
                const hostname = testHosts[i];
                testButton.textContent = `测速中 ${i + 1}/${len}…`;
                const spans = rowElements.get(hostname);
                if (spans) {
                    spans.badge.classList.add('hidden');
                    spans.speed.textContent = '测速中…';
                }
                const testUrl = speedTestUrlForHost(hostname);
                // eslint-disable-next-line no-await-in-loop -- hosts are tested sequentially to avoid bandwidth contention
                const outcome = testUrl === null ? null : await measureCdnHostSpeed(hostname, testUrl);
                if (spans) renderOutcome(spans.speed, outcome);
                if (outcome !== null && outcome.ok && (fastest === null || outcome.result.bytesPerSec > fastest.result.bytesPerSec)) fastest = {
                    hostname,
                    result: outcome.result
                };
                if (i + 1 < len) // Pace the tests so the torn-down connection of the previous host
                // can be released before probing the next one
                // eslint-disable-next-line no-await-in-loop -- intentional pacing between hosts
                await e$1(200);
            }
        } finally{
            testing = false;
            testButton.disabled = false;
            testButton.textContent = '重新测速';
            showRecommendation();
            if (fastest !== null) logger.info('CDN speed test completed', {
                fastestHostname: fastest.hostname,
                bytesPerSec: fastest.result.bytesPerSec
            });
        }
    });
    useFastestButton.addEventListener('click', ()=>{
        if (fastest === null) return;
        const hostname = fastest.hostname;
        onSelect(hostname, 'fastest');
        const radio = list.querySelector(`input[name="mbgtbe-cdn-host"][value="${CSS.escape(hostname)}"]`);
        if (radio !== null) radio.checked = true;
    });
    function onKeydown(event) {
        if (event.key === 'Escape') close();
    }
    function close() {
        document.removeEventListener('keydown', onKeydown);
        host.remove();
    }
    closeButton.addEventListener('click', close);
    overlay.addEventListener('click', (event)=>{
        if (event.target === overlay) close();
    });
    document.addEventListener('keydown', onKeydown);
    document.body.appendChild(host);
}
/** Every host an upgcxcode signature can be moved onto, as `candidates.ts` sees them */ function collectedCdnHosts() {
    const hostnames = new Set(upgcxcodeHosts);
    for(let i = 0, len = SEED_HOSTS.length; i < len; i++)hostnames.add(SEED_HOSTS[i]);
    // A remembered host may not be offered by the current playinfo: keep it selectable
    const selected = getManualCdnHost();
    if (selected !== null) hostnames.add(selected);
    const mirror = [];
    const bcache = [];
    for (const hostname of hostnames){
        if (isP2PCDNDomain(hostname) || isAkamaiHost(hostname)) continue;
        (isMirrorHost(hostname) ? mirror : bcache).push(hostname);
    }
    mirror.sort();
    bcache.sort();
    return {
        mirror,
        bcache
    };
}
/** A signed upgcxcode path is valid on any of these hosts */ function speedTestUrlForHost(hostname) {
    const key = getSampleUpgcxcodeKey();
    return key === null ? null : `https://${hostname}${key}`;
}
function createGroup(title, hostnames, current, onSelect, rowElements) {
    const group = document.createElement('div');
    group.className = 'group';
    const groupTitle = document.createElement('div');
    groupTitle.className = 'group-title';
    groupTitle.textContent = title;
    group.appendChild(groupTitle);
    hostnames.forEach((hostname)=>{
        const label = document.createElement('label');
        label.className = 'item';
        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = 'mbgtbe-cdn-host';
        radio.value = hostname;
        radio.checked = hostname === current;
        radio.addEventListener('change', ()=>{
            if (radio.checked) onSelect(hostname);
        });
        const name = document.createElement('span');
        name.className = 'hostname';
        name.textContent = hostname;
        const vendorName = cdnVendorOf(hostname);
        let vendor = null;
        if (vendorName !== null) {
            vendor = document.createElement('span');
            vendor.className = 'vendor';
            vendor.textContent = vendorName;
        }
        const badge = document.createElement('span');
        badge.className = 'badge hidden';
        badge.textContent = '推荐';
        const speed = document.createElement('span');
        speed.className = 'speed';
        label.appendChild(radio);
        label.appendChild(name);
        if (vendor !== null) label.appendChild(vendor);
        label.appendChild(badge);
        label.appendChild(speed);
        group.appendChild(label);
        rowElements.set(hostname, {
            badge,
            speed
        });
    });
    return group;
}const PROXY_TF = 'proxy-tf-all-ws.bilivideo.com';
/**
 * The no-p2p policy: no P2P / PCDN host. What such a host serves with an upgcxcode signature is
 * already a candidate on every upgcxcode host; the rest is pointed back at its source host
 * (szbdyd's `xy_usource`) or fetched through Bilibili's proxy (mcdn `/v1/resource`).
 */ function noP2PPolicy(candidates) {
    const acceptable = [];
    for(let i = 0, len = candidates.length; i < len; i++){
        const candidate = candidates[i];
        if (!candidate.p2p) {
            acceptable.push(candidate);
            continue;
        }
        const url = new URL(candidate.href);
        switch(candidate.class){
            // szbdyd.com appears to be deprecated, but we still handle it just in case
            case 'szbdyd':
                {
                    const source = url.searchParams.get('xy_usource');
                    if (source) {
                        url.protocol = 'https:';
                        url.hostname = source;
                        url.port = '';
                        acceptable.push({
                            ...toMediaAddress(url),
                            tier: CandidateTier.Source,
                            p2p: false
                        });
                    }
                    break;
                }
            // Pure IP / mcdn.bilivideo.* with its own path: only the proxy can reach it for us
            case 'mcdn-tf':
                {
                    const proxy = new URL(`https://${PROXY_TF}`);
                    proxy.searchParams.set('url', candidate.href);
                    acceptable.push({
                        ...toMediaAddress(proxy),
                        deadline: candidate.deadline,
                        tier: CandidateTier.Proxy,
                        p2p: false
                    });
                    break;
                }
        }
    }
    return acceptable;
}/**
 * The player request interceptor's policy phase: no media from P2P / PCDN hosts. The player's
 * P2P URLs are replaced by official ones
 */ const noP2P = {
    name: 'no-p2p',
    description: '防止叔叔用 P2P CDN 省下纸钱',
    any ({ player }) {
        registerCdnSelectorMenu();
        restoreCdnPreference();
        class MockPCDNLoader {
        }
        class MockBPP2PSDK {
            on = o$2;
        }
        class MockSeederSDK {
        }
        defineReadonlyProperty(unsafeWindow, 'PCDNLoader', MockPCDNLoader);
        defineReadonlyProperty(unsafeWindow, 'BPP2PSDK', MockBPP2PSDK);
        defineReadonlyProperty(unsafeWindow, 'SeederSDK', MockSeederSDK);
        player.registerPhase({
            type: 'policy',
            name: 'no-p2p',
            filter: noP2PPolicy
        });
    }
};const neverResolvedPromise = new Promise(o$2);
const noopNeverResolvedPromise = ()=>neverResolvedPromise;
// based on uBlock Origin's no-webrtc
// https://github.com/gorhill/uBlock/blob/6c228a8bfdcfc14140cdd3967270df28598c1aaf/src/js/resources/scriptlets.js#L2216
const noWebRTC = {
    name: 'no-webrtc',
    description: '通过禁用 WebRTC 防止叔叔省下棺材钱',
    any () {
        const rtcPcNames = [];
        if ('RTCPeerConnection' in unsafeWindow) rtcPcNames.push('RTCPeerConnection');
        if ('webkitRTCPeerConnection' in unsafeWindow) rtcPcNames.push('webkitRTCPeerConnection');
        if ('mozRTCPeerConnection' in unsafeWindow) rtcPcNames.push('mozRTCPeerConnection');
        const rtcDcNames = [];
        if ('RTCDataChannel' in unsafeWindow) rtcDcNames.push('RTCDataChannel');
        if ('webkitRTCDataChannel' in unsafeWindow) rtcDcNames.push('webkitRTCDataChannel');
        if ('mozRTCDataChannel' in unsafeWindow) rtcDcNames.push('mozRTCDataChannel');
        class MockDataChannel {
            static{
                this.prototype.close = o$2;
                this.prototype.send = o$2;
                this.prototype.addEventListener = o$2;
                this.prototype.removeEventListener = o$2;
                this.prototype.onbufferedamountlow = o$2;
                // eslint-disable-next-line sukka/unicorn/prefer-add-event-listener -- mock
                this.prototype.onclose = o$2;
                // eslint-disable-next-line sukka/unicorn/prefer-add-event-listener -- mock
                this.prototype.onerror = o$2;
                // eslint-disable-next-line sukka/unicorn/prefer-add-event-listener -- mock
                this.prototype.onmessage = o$2;
            }
            toString() {
                return '[object RTCDataChannel]';
            }
        }
        class MockRTCSessionDescription {
            type;
            sdp;
            constructor(init){
                this.type = init.type;
                this.sdp = init.sdp || '';
            }
            toJSON() {
                return {
                    type: this.type,
                    sdp: this.sdp
                };
            }
            toString() {
                return '[object RTCSessionDescription]';
            }
        }
        const mockedRtcSessionDescription = new MockRTCSessionDescription({
            type: 'offer',
            sdp: ''
        });
        class MockRTCPeerConnection {
            createDataChannel() {
                return new MockDataChannel();
            }
            static{
                this.prototype.close = o$2;
                this.prototype.createOffer = noopNeverResolvedPromise;
                this.prototype.setLocalDescription = o$2;
                this.prototype.setRemoteDescription = o$2;
                this.prototype.addEventListener = o$2;
                this.prototype.removeEventListener = o$2;
                this.prototype.addIceCandidate = o$2;
                this.prototype.setConfiguration = o$2;
                this.prototype.localDescription = mockedRtcSessionDescription;
                this.prototype.createAnswer = noopNeverResolvedPromise;
                this.prototype.onicecandidate = o$2;
            }
            toString() {
                return '[object RTCPeerConnection]';
            }
        }
        for(let i = 0, len = rtcPcNames.length; i < len; i++){
            const rtc = rtcPcNames[i];
            defineReadonlyProperty(unsafeWindow, rtc, MockRTCPeerConnection);
        }
        for(let i = 0, len = rtcDcNames.length; i < len; i++){
            const dc = rtcDcNames[i];
            defineReadonlyProperty(unsafeWindow, dc, MockDataChannel);
        }
        defineReadonlyProperty(unsafeWindow, 'RTCSessionDescription', MockRTCSessionDescription);
    }
};const optimizeHomepage = {
    name: 'optimize-homepage',
    description: '首页广告去除和样式优化',
    any ({ addStyle }) {
        addStyle(e$5`
      .feed2 .feed-card:has(a[href*="cm.bilibili.com"]),
      .feed2 .feed-card:has(.bili-video-card:empty) {
        width: 1px !important;
        height: 1px !important;
        opacity: 0 !important;
        pointer-events: none !important;
        position: absolute !important;
        padding: 0 !important;
        margin: -1px !important;
        overflow: hidden !important;
        clip: rect(0, 0, 0, 0) !important;
        white-space: nowrap !important;
        border-width: 0 !important;
      }

      .feed2 .container > * {
        margin-top: 0 !important
      }
    `);
    }
};const optimizeStory = {
    name: 'optimize-story',
    description: '动态页面优化',
    onStory ({ addStyle }) {
        addStyle(e$5`
      html[wide] #app { display: flex; }
      html[wide] .bili-dyn-home--member { box-sizing: border-box;padding: 0 10px;width: 100%;flex: 1; }
      html[wide] .bili-dyn-content { width: initial; }
      html[wide] main { margin: 0 8px;flex: 1;overflow: hidden;width: initial; }
      #wide-mode-switch { margin-left: 0;margin-right: 20px; }
      .bili-dyn-list__item:has(.bili-dyn-card-goods), .bili-dyn-list__item:has(.bili-rich-text-module.goods) { display: none !important }
    `);
        if (!localStorage.WIDE_OPT_OUT) document.documentElement.setAttribute('wide', 'wide');
        onLoaded(()=>{
            const tabContainer = document.querySelector('.bili-dyn-list-tabs__list');
            const placeholder = document.createElement('div');
            placeholder.style.flex = '1';
            const switchButton = document.createElement('a');
            switchButton.id = 'wide-mode-switch';
            switchButton.className = 'bili-dyn-list-tabs__item';
            switchButton.textContent = '宽屏模式';
            switchButton.addEventListener('click', (e)=>{
                e.preventDefault();
                if (localStorage.WIDE_OPT_OUT) {
                    localStorage.removeItem('WIDE_OPT_OUT');
                    document.documentElement.setAttribute('wide', 'wide');
                } else {
                    localStorage.setItem('WIDE_OPT_OUT', '1');
                    document.documentElement.removeAttribute('wide');
                }
            });
            tabContainer?.appendChild(placeholder);
            tabContainer?.appendChild(switchButton);
        });
    }
};function toggleMode(enabled) {
    document.body.toggleAttribute('video-fit', enabled);
}
const playerVideoFit = {
    name: 'player-video-fit',
    description: '播放器视频裁切模式',
    onVideo ({ addStyle }) {
        addStyle(e$5`body[video-fit] #bilibili-player video { object-fit: cover; } .bpx-player-ctrl-setting-fit-mode { display: flex;width: 100%;height: 32px;line-height: 32px; } .bpx-player-ctrl-setting-box .bui-panel-wrap, .bpx-player-ctrl-setting-box .bui-panel-item { min-height: 172px !important; }`);
        let timer;
        function injectButton() {
            if (!document.querySelector('.bpx-player-ctrl-setting-menu-left')) return;
            self.clearInterval(timer);
            const parent = document.querySelector('.bpx-player-ctrl-setting-menu-left');
            const item = document.createElement('div');
            item.className = 'bpx-player-ctrl-setting-fit-mode bui bui-switch';
            item.innerHTML = '<input class="bui-switch-input" type="checkbox"><label class="bui-switch-label"><span class="bui-switch-name">裁切模式</span><span class="bui-switch-body"><span class="bui-switch-dot"><span></span></span></span></label>';
            parent?.insertBefore(item, document.querySelector('.bpx-player-ctrl-setting-more'));
            document.querySelector('.bpx-player-ctrl-setting-fit-mode input')?.addEventListener('change', (e)=>toggleMode(e.target.checked));
            const panelItem = document.querySelector('.bpx-player-ctrl-setting-box .bui-panel-item');
            if (panelItem) panelItem.style.height = '';
        }
        timer = self.setInterval(injectButton, 200);
    }
};const removeBlackBackdropFilter = {
    name: 'remove-black-backdrop-filter',
    description: '去除叔叔去世时的全站黑白效果',
    any ({ addStyle }) {
        addStyle(e$5`html, body { -webkit-filter: none !important; filter: none !important; }`);
    }
};const uselessUrlParams = [
    'buvid',
    'is_story_h5',
    'launch_id',
    'live_from',
    'mid',
    'session_id',
    'timestamp',
    'up_id',
    'vd_source',
    'trackid',
    /^share/,
    /^spm/
];
const removeUselessUrlParams = {
    name: 'remove-useless-url-params',
    description: '清理 URL 中的无用参数',
    any () {
        unsafeWindow.history.replaceState(undefined, '', removeTracking(location.href));
        // eslint-disable-next-line @typescript-eslint/unbound-method -- called with Reflect.apply
        const pushState = unsafeWindow.history.pushState;
        unsafeWindow.history.pushState = function(state, unused, url) {
            return Reflect.apply(pushState, this, [
                state,
                unused,
                removeTracking(url)
            ]);
        };
        // eslint-disable-next-line @typescript-eslint/unbound-method -- called with Reflect.apply
        const replaceState = unsafeWindow.history.replaceState;
        unsafeWindow.history.replaceState = function(state, unused, url) {
            return Reflect.apply(replaceState, this, [
                state,
                unused,
                removeTracking(url)
            ]);
        };
    }
};
function removeTracking(url) {
    if (!url) return url;
    try {
        if (typeof url === 'string') url = new URL(url, unsafeWindow.location.href);
        if (!url.search) return url;
        const keys = Array.from(url.searchParams.keys());
        for(let i = 0, len = keys.length; i < len; i++){
            const key = keys[i];
            for(let j = 0, len = uselessUrlParams.length; j < len; j++){
                const item = uselessUrlParams[j];
                if (typeof item === 'string') {
                    if (item === key) url.searchParams.delete(key);
                } else if ('test' in item && item.test(key)) url.searchParams.delete(key);
            }
        }
        return url.href;
    } catch (e) {
        logger.error('Failed to remove useless urlParams', e);
        return url;
    }
}function n(n,o,r){return void 0===r?r=>r<n?n:r>o?o:r:n<o?o:n>r?r:n}function e(o){return !!e$2(o)&&("AbortError"===o.name||"code"in o&&"string"==typeof o.code&&"ABORT_ERR"===o.code)}/** `Ok` only for a 206 whose `Content-Range` is the range asked for, of the file size known so far */ function classifyResponse(response, contentRange, expected) {
    if (response.redirected && isP2PCDNDomain(hostnameOf(response.url))) return MediaOutcome.Redirect;
    const { status } = response;
    if (status === 206) {
        // Without it, which bytes came back is unknown: every tested host exposes it
        if (contentRange === null) return MediaOutcome.Unverifiable;
        if (contentRange.start !== expected.start) return MediaOutcome.BadRange;
        if (contentRange.end !== expected.end) return contentRange.end < expected.end && contentRange.total !== null && contentRange.end === contentRange.total - 1 ? MediaOutcome.EofClamp : MediaOutcome.BadRange;
        if (expected.total !== null && contentRange.total !== null && contentRange.total !== expected.total) return MediaOutcome.StaleObject;
        return MediaOutcome.Ok;
    }
    if (status === 200) return MediaOutcome.NoRange;
    if (status === 401 || status === 403) return MediaOutcome.Refused;
    if (status === 404 || status === 410) return MediaOutcome.Missing;
    if (status === 416) return MediaOutcome.EofClamp;
    if (status === 412 || status === 429 || status === 503) return MediaOutcome.Throttled;
    return MediaOutcome.ServerError;
}
/** A failed fetch() or body read */ function classifyError(error, abortReason, receivedBytes, headersReceived, elapsedMs) {
    if (abortReason !== null) return abortReason;
    if (e(error)) return MediaOutcome.Canceled;
    if (headersReceived) return receivedBytes > 0 ? MediaOutcome.Reset : MediaOutcome.Truncated;
    return elapsedMs < 150 ? MediaOutcome.ConnectFail : MediaOutcome.Network;
}
/** Outcomes after which the same bytes are worth asking for again elsewhere */ function isRetryable(outcome) {
    return outcome !== MediaOutcome.Ok && outcome !== MediaOutcome.Canceled && outcome !== MediaOutcome.Integrity && outcome !== MediaOutcome.EofClamp;
}
/** `''` for an invalid URL */ function hostnameOf(url) {
    try {
        return new URL(url).hostname;
    } catch  {
        return '';
    }
}const KiB = 1024;
const MiB = 1024 * KiB;
/** Attempts in flight across all jobs */ const GLOBAL_CAP = 32;
/** Slots only critical and urgent work may take */ const URGENT_RESERVE = 2;
/**
 * Attempts in flight per host: Chrome opens at most six connections to one host, and a seventh
 * would wait inside the browser. The CDN throttles per request, so several to one host add up
 */ const HOST_CAP = 6;
/** Pieces per host that may carry them on its own */ const PIECES_PER_HOST = 4;
const MAX_PIECES = 16;
const MIN_PIECE = 192 * KiB;
const MAX_PIECE = 4 * MiB;
const MAX_SERVED_LENGTH = 64 * MiB;
/** Failed attempts per piece before the job fails */ const MAX_TRIES = 6;
/** Committed, but no byte arrived for this long: the job fails */ const JOB_STALL_MS = 8000;
const TICK_MS = 50;
/** Duplicates per piece at most */ const MAX_EXTRA = 2;
/** A racer this far behind the leader is only comparing bytes */ const LAGGARD_BYTES = 64 * KiB;
/** A racer on a host never measured runs at least this far, enough to measure the host */ const PROBE_BYTES = 64 * KiB;
/** Init segments and indexes kept, the oldest dropped first */ const MAX_HEADERS = 64;
/** A piece this small is about latency: it goes to the host expected to finish it first */ const SMALL_PIECE = 256 * KiB;
/**
 * A piece goes on its own only to a host expected to finish it within this factor of the best
 * one: on a slower host the whole request would wait for that piece
 */ const ETA_BAND = 1.25;
/** Neither half of a split is smaller */ const STEAL_MIN = 192 * KiB;
/** Speed samples from shorter transfers are mostly round trip; below `FULL_SAMPLE`, cut short */ const MIN_SAMPLE = 16 * KiB;
const FULL_SAMPLE = 48 * KiB;
/** A host delivered bytes this recently: it works, and a failure is that one request's */ const ALIVE_MS = 2000;
/** After a failed job, the player's retry of the same range goes to the browser */ const NATIVE_RETRY_MS = 30000;
/** This many failed jobs within a minute: the browser takes every request for 30 s */ const FAILURES_TO_TURN_OFF = 3;
/** Urgency, most urgent first: init and index, what the player asked for, the warm-up */ const CRITICAL = 0;
const URGENT = 1;
const RELAXED = 2;
/** Scales the timeouts: critical work is helped sooner */ const URGENCY_FACTOR = [
    0.7,
    0.85,
    2
];
/** Hosts a request in one piece starts on */ const RACE_WIDTH = [
    3,
    2,
    1
];
/** The gaps between an attempt's chunks are reported as their 90th percentile */ const p90 = e$3(90);
function createThreadRipper(player, nativeFetch) {
    const model = player.hosts;
    const jobs = new Set();
    /** file key -> init segment and index, insertion ordered: the oldest goes first */ const headers = new Map();
    /** file key -> file size, as every host must agree on it */ const totals = new Map();
    /** `file key:start-end` -> until when the player's retry of a failed range goes to the browser */ const nativeRetry = new Map();
    let recentFailures = [];
    let offUntil = 0;
    let integrityFailed = false;
    /** hostname -> attempts in flight */ const busy = new Map();
    /** hostname -> when bytes last arrived from it */ const lastDelivery = new Map();
    /** Spreads a host's requests over the file's signatures */ let rotation = 0;
    /** Pieces waiting for a slot, in arrival order */ let queue = [];
    const running = new Set();
    let pumping = false;
    let tickTimer = null;
    // ---- Jobs
    function start(params, sink) {
        const { file, range } = params;
        const now = performance.now();
        const length = byteRangeLength(range);
        const buffer = new unsafeWindow.ArrayBuffer(length);
        const job = {
            ...params,
            length,
            createdAt: now,
            candidates: byHost(params.candidates),
            buffer,
            bytes: new unsafeWindow.Uint8Array(buffer),
            segments: [],
            sink,
            contentType: '',
            state: 'running',
            committed: false,
            total: totals.get(file.key) ?? null,
            covered: 0,
            lastProgressAt: now
        };
        jobs.add(job);
        if (sink) sink.signal.addEventListener('abort', ()=>{
            if (job.state === 'running') stop(job, false);
        }, {
            once: true
        });
        // No more pieces than the hosts that may carry one alone can take
        const typical = model.typicalSpeed(file);
        const owners = ownersOf(hostsOf(job, Math.min(length, MiB), now));
        const count = pieceCount(length, typical.rate, typical.ttfb, owners?.size ?? 1);
        for(let i = 0; i < count; i++)job.segments.push(segment(range.start + Math.floor(length * i / count), range.start + Math.floor(length * (i + 1) / count) - 1));
        for(let i = 0; i < count; i++)enqueue(job, job.segments[i]);
        if (count === 1) race(job);
        else if (job.segments[count - 1].attempts.size > 0) {
            // One piece is raced on a host never measured, if any: that measures it, at no risk to the
            // request (`choose`)
            const seg = job.segments[count - 1];
            if (eligible(hostsOf(job, 0, now), seg, null).some((option)=>!option.estimate.measured)) duplicate(job, seg, true);
        }
        return job;
    }
    /** Every piece on a few hosts at once: a slow first byte is covered from the start */ function race(job) {
        for(let i = 0, len = job.segments.length; i < len; i++)for(let j = 1; j < RACE_WIDTH[job.cls]; j++)duplicate(job, job.segments[i], true);
    }
    function stop(job, done) {
        job.state = done ? 'done' : 'failed';
        jobs.delete(job);
        queue = queue.filter((unit)=>unit[0] !== job);
        for (const att of running)// Not those already past their end: they finish on their own
        if (att.job === job && att.pos <= att.seg.end) abortAttempt(att, MediaOutcome.Canceled);
    }
    function complete(job) {
        stop(job, true);
        if (job.sink) {
            const { served, range } = job;
            job.sink.done(served.start === range.start && served.end === range.end ? job.buffer : job.buffer.slice(served.start - range.start, served.end - range.start + 1));
        }
        const header = headers.get(job.file.key);
        if (header?.bytes === null && job.range.start === header.range.start && job.range.end === header.range.end) {
            header.bytes = new Uint8Array(job.buffer);
            header.total = job.total;
            header.contentType = job.contentType;
        }
    }
    /** The XHR fails, and the player's retry of the range goes to the browser */ function giveUp(job, reason) {
        const now = performance.now();
        stop(job, false);
        if (!job.sink) // A warm-up: its entry stays empty, and requests fetch the normal way
        return;
        recentFailures = recentFailures.filter((at)=>now - at < 60000);
        recentFailures.push(now);
        if (recentFailures.length >= FAILURES_TO_TURN_OFF) {
            offUntil = now + 30000;
            recentFailures = [];
            logger.warn(`[thread-ripper] ${FAILURES_TO_TURN_OFF} failures within a minute, leaving media requests to the browser for 30 seconds`);
        }
        nativeRetry.set(`${job.file.key}:${job.served.start}-${job.served.end}`, now + NATIVE_RETRY_MS);
        logger.error(`[thread-ripper] failed: ${reason}`, {
            kind: job.file.kind,
            range: job.range
        });
        job.sink.error();
    }
    // ---- Attempts: one ranged fetch from one host
    async function fetchRange(att) {
        const { job } = att;
        // Synchronously from `launch`: the piece's remaining range
        const start = att.pos;
        const end = att.seg.end;
        let response;
        try {
            response = await nativeFetch(att.candidate.href, {
                method: 'GET',
                // The only author header: Range is CORS-safelisted, no preflight
                headers: {
                    Range: `bytes=${start}-${end}`
                },
                mode: 'cors',
                // What the page's XHR uses (withCredentials = false), so connections are shared with it
                credentials: 'same-origin',
                // Like the page's XHR. `no-store` would add `Cache-Control: no-cache` and `Pragma: no-cache`,
                // which upos hosts ignore but Akamai may honour by going upstream
                cache: 'default',
                // Like the page's XHR. A redirect is not necessarily a P2P CDN: Akamai may send to an edge,
                // an extension may clean the URL (AdGuard's 307). One landing on a P2P CDN is refused
                redirect: 'follow',
                referrerPolicy: 'strict-origin-when-cross-origin',
                priority: job.cls === RELAXED ? 'auto' : 'high',
                signal: att.controller.signal
            });
        } catch (e) {
            return classifyError(e, att.abortReason, att.bytes, false, performance.now() - att.startedAt);
        }
        const contentRange = parseContentRange(response.headers.get('content-range'));
        const outcome = classifyResponse(response, contentRange, {
            start,
            end,
            total: job.total
        });
        if (contentRange === null || outcome !== MediaOutcome.Ok || !response.body) {
            response.body?.cancel().catch(o$2);
            return outcome === MediaOutcome.Ok ? MediaOutcome.Truncated : outcome;
        }
        att.headersAt = performance.now();
        commit(job, response, contentRange.total);
        const reader = response.body.getReader();
        try {
            for(;;){
                // eslint-disable-next-line no-await-in-loop -- stream reading
                const { done, value } = await reader.read();
                if (done) break;
                const now = performance.now();
                if (att.firstByteAt === 0) {
                    att.firstByteAt = now;
                    att.firstChunkBytes = value.byteLength;
                } else if (att.gaps.length < 256) att.gaps.push(now - att.lastByteAt);
                att.lastByteAt = now;
                lastDelivery.set(att.hostname, now);
                att.bytes += value.byteLength;
                att.meter.push([
                    now,
                    att.bytes
                ]);
                if (att.meter.length > 32) att.meter.splice(0, att.meter.length - 32);
                const written = onChunk(att, value);
                if (written === 'mismatch') {
                    reader.cancel().catch(o$2);
                    return MediaOutcome.Integrity;
                }
                // Past the piece's end (its tail went elsewhere, or the job is over), or all asked for is here
                if (written === 'overrun' || att.pos > att.seg.end) {
                    att.abortReason ??= MediaOutcome.Canceled;
                    reader.cancel().catch(o$2);
                    return att.pos > att.seg.end ? MediaOutcome.Ok : MediaOutcome.Canceled;
                }
            }
        } catch (e) {
            return classifyError(e, att.abortReason, att.bytes, true, performance.now() - att.startedAt);
        } finally{
            reader.releaseLock();
        }
        return att.pos > att.seg.end ? MediaOutcome.Ok : MediaOutcome.Truncated;
    }
    /** The first validated response: its headers, for the whole range, go to the page */ function commit(job, response, total) {
        if (total !== null && job.total === null) {
            job.total = total;
            totals.set(job.file.key, total);
        }
        if (job.committed || job.state !== 'running') return;
        job.committed = true;
        job.contentType = response.headers.get('content-type') ?? '';
        if (!job.sink) return;
        const responseHeaders = [];
        response.headers.forEach((value, name)=>{
            if (name !== 'content-length' && name !== 'content-range') responseHeaders.push([
                name,
                value
            ]);
        });
        responseHeaders.push([
            'content-length',
            String(byteRangeLength(job.served))
        ]);
        if (job.total !== null) responseHeaders.push([
            'content-range',
            `bytes ${job.served.start}-${job.served.end}/${job.total}`
        ]);
        job.sink.headersReceived(206, responseHeaders, response.statusText);
    }
    /**
   * Take a chunk an attempt received. Every attempt starts at or below its piece's frontier and the
   * frontier only moves forward, so a piece always holds a contiguous run: bytes below the frontier
   * were written by another attempt and are compared instead, bytes above it are written.
   *
   * - `overrun`: the attempt is past its piece's end (the piece is done or shrunk), stop it
   * - `mismatch`: two responses disagree about the file's content
   */ function onChunk(att, chunk) {
        const { job, seg, pos } = att;
        const now = performance.now();
        model.noteBytes(now);
        const usable = job.state === 'running' ? Math.min(chunk.byteLength, seg.end + 1 - pos) : 0;
        if (usable <= 0) return 'overrun';
        const base = job.range.start;
        const duplicateEnd = Math.min(pos + usable, seg.frontier);
        for(let offset = pos; offset < duplicateEnd; offset++){
            if (job.bytes[offset - base] !== chunk[offset - pos]) return 'mismatch';
        }
        if (pos + usable > seg.frontier) {
            const fresh = chunk.subarray(seg.frontier - pos, usable);
            job.bytes.set(fresh, seg.frontier - base);
            job.covered += fresh.byteLength;
            seg.frontier = pos + usable;
            seg.tried.clear();
            job.lastProgressAt = now;
        }
        att.pos = pos + usable;
        if (seg.frontier > seg.end) {
            // The race is over for this piece
            for (const other of seg.attempts)if (other !== att) abortAttempt(other, MediaOutcome.Canceled);
        }
        if (job.segments.every((piece)=>piece.frontier > piece.end)) complete(job);
        else if (job.sink) {
            const served = byteRangeLength(job.served);
            job.sink.progress(Math.min(job.covered, served), served);
        }
        return usable < chunk.byteLength ? 'overrun' : 'ok';
    }
    function onAttemptEnd(att, outcome) {
        const { job, seg } = att;
        if (outcome === MediaOutcome.Integrity) {
            integrityFailed = true;
            logger.error('[thread-ripper] two CDN hosts sent different bytes for the same range, leaving media requests to the browser from now on', {
                url: att.candidate.href
            });
            if (job.state === 'running') giveUp(job, 'integrity');
            return;
        }
        if (job.state !== 'running' || seg.frontier > seg.end || seg.queued) return;
        if (seg.attempts.size > 0) {
            // A racer is still on the piece. It covers a lost race, but not a failed primary: left to a
            // racer on a worse host, the piece would crawl. A fresh primary joins, settling keeps the one ahead
            if (att.role === 'primary' && isRetryable(outcome) && ++seg.tries < MAX_TRIES) enqueue(job, seg);
            return;
        }
        if (outcome !== MediaOutcome.Canceled && !isRetryable(outcome)) {
            giveUp(job, outcome);
            return;
        }
        // Canceled by us (a race settled, a tail split off) is no failure of the piece
        if (outcome !== MediaOutcome.Canceled) seg.tries++;
        if (seg.tries >= MAX_TRIES) {
            giveUp(job, `a piece failed ${seg.tries} times, last: ${outcome}`);
            return;
        }
        enqueue(job, seg);
    }
    /** What the attempt's end says about its host, into the host model */ function learn(att, outcome) {
        const { hostname, job } = att;
        const now = performance.now();
        // A slow first byte or a stall on a host that delivered just now is that request's, not the host's
        model.recordOutcome(hostname, job.file, outcome, now, now - (lastDelivery.get(hostname) ?? -Infinity) < ALIVE_MS);
        const received = att.bytes - att.firstChunkBytes;
        const delivered = outcome === MediaOutcome.Ok || outcome === MediaOutcome.Canceled;
        const rate = delivered && received >= MIN_SAMPLE && att.lastByteAt > att.firstByteAt ? received / (att.lastByteAt - att.firstByteAt) : null;
        // No validated response yet: what it waited is a lower bound of its first byte. A racer
        // canceled before it waited as long as requests usually take says nothing
        const waited = now - att.startedAt;
        let ttfb = att.headersAt === 0 ? null : att.headersAt - att.startedAt;
        if (ttfb === null && outcome === MediaOutcome.Canceled && waited > model.typicalSpeed(job.file).ttfb) ttfb = waited;
        model.recordSpeed(hostname, job.file, {
            ttfb,
            rate,
            partial: outcome !== MediaOutcome.Ok || att.bytes < FULL_SAMPLE,
            gap: att.gaps.length === 0 ? null : p90(att.gaps)
        });
    }
    // ---- Scheduling
    function enqueue(job, seg) {
        if (!seg.queued) {
            seg.queued = true;
            queue.push([
                job,
                seg
            ]);
            tickTimer ??= setInterval(tick, TICK_MS);
            pump();
        }
    }
    /** Start what waits, in order, as slots and hosts allow */ function pump() {
        if (pumping) return;
        pumping = true;
        try {
            const blocked = new Set();
            for(;;){
                const next = queue.findIndex((unit)=>!blocked.has(unit[1]));
                if (next === -1 || !hasSlot(queue[next][0])) break;
                const [job, seg] = queue[next];
                let target = null;
                if (job.state === 'running' && seg.frontier <= seg.end) {
                    target = pickHost(job, seg, null);
                    if (target === null) {
                        blocked.add(seg);
                        continue;
                    }
                }
                queue.splice(next, 1);
                seg.queued = false;
                if (target !== null) launch(job, seg, 'primary', target);
            }
        } finally{
            pumping = false;
        }
    }
    /** Within `GLOBAL_CAP`, leaving room for what is urgent */ function hasSlot(job) {
        return running.size < (job.cls === RELAXED ? GLOBAL_CAP - URGENT_RESERVE : GLOBAL_CAP);
    }
    /**
   * Race a piece on a host not already on it, if one has room: over HTTP/2 one hung connection
   * hangs every request to its host. To `explore`, a host never measured first; else (a rescue)
   * the fastest measured one first
   */ function duplicate(job, seg, explore) {
        const target = seg.extra < MAX_EXTRA && hasSlot(job) ? pickHost(job, seg, explore ? 'explore' : 'fastest') : null;
        if (target !== null) {
            seg.extra++;
            launch(job, seg, 'dup', target);
        }
        return target !== null;
    }
    function launch(job, seg, role, { hostname, candidate, estimate }) {
        const att = {
            job,
            seg,
            hostname,
            candidate,
            role,
            controller: new AbortController(),
            abortReason: null,
            // A few times what the host usually takes
            ttfbSoft: n(2 * estimate.ttfb, 250, 1200),
            stallSoft: estimate.gap === null ? 600 : n(4 * estimate.gap, 300, 1000),
            startedAt: performance.now(),
            headersAt: 0,
            firstByteAt: 0,
            firstChunkBytes: 0,
            lastByteAt: 0,
            bytes: 0,
            pos: seg.frontier,
            meter: [],
            gaps: [],
            probe: !estimate.measured
        };
        rotation++;
        busy.set(hostname, (busy.get(hostname) ?? 0) + 1);
        // Work resumes after idle: silence from every host means the network is down only from here on
        if (running.size === 0) model.noteBytes(att.startedAt);
        running.add(att);
        seg.attempts.add(att);
        seg.tried.add(hostname);
        tickTimer ??= setInterval(tick, TICK_MS);
        (async ()=>{
            let outcome;
            try {
                outcome = await fetchRange(att);
            } catch (e) {
                logger.error('[thread-ripper] attempt crashed', e);
                outcome = MediaOutcome.Network;
            }
            busy.set(hostname, busy.get(hostname) - 1);
            running.delete(att);
            seg.attempts.delete(att);
            learn(att, outcome);
            try {
                onAttemptEnd(att, outcome);
            } finally{
                pump();
            }
        })();
    }
    function abortAttempt(att, reason) {
        if (att.abortReason === null) {
            att.abortReason = reason;
            att.controller.abort();
        }
    }
    /** Every `TICK_MS` while there is work */ function tick() {
        const now = performance.now();
        for (const att of running){
            // A slow first byte is never given up on: an edge without the file is pulling it from
            // upstream, and another one would start over. Its racer takes over once that one delivers
            // (`settleRace`)
            if (att.abortReason !== null || att.firstByteAt === 0) continue;
            // Gone silent after bytes flowed, and so has its host: one silent while the host delivers to
            // its other requests only waits its turn on their shared connection, and its racer takes
            // over (`settleRace`). Only when something else can carry its bytes, else the piece would
            // only go to whatever racer is on it, there because it was the worse choice
            const { job, seg } = att;
            const silence = 2 * att.stallSoft * URGENCY_FACTOR[job.cls];
            if (now - att.lastByteAt > silence && now - (lastDelivery.get(att.hostname) ?? -Infinity) > silence && (seg.attempts.size > 1 || hasAlternative(job, seg, now) || now - att.startedAt > JOB_STALL_MS)) abortAttempt(att, MediaOutcome.Stall);
        }
        try {
            for (const job of jobs)tickJob(job, now);
            if (queue.length === 0 && running.size < GLOBAL_CAP) offload(now);
        } catch (e) {
            logger.error('[thread-ripper] tick failed', e);
        }
        // Hosts cool down and slots free up: what waits may go now
        pump();
        if (tickTimer !== null && running.size === 0 && queue.length === 0 && jobs.size === 0) {
            clearInterval(tickTimer);
            tickTimer = null;
        }
    }
    function tickJob(job, now) {
        if (job.committed && now - job.lastProgressAt > JOB_STALL_MS) {
            giveUp(job, 'no progress');
            return;
        }
        for(let i = 0, len = job.segments.length; i < len; i++){
            const seg = job.segments[i];
            if (seg.frontier > seg.end) continue;
            if (seg.attempts.size > 1) {
                settleRace(seg);
                // Every request on it still waits for a first byte: one more host races it
                let newest = null;
                let waiting = true;
                for (const att of seg.attempts){
                    waiting &&= att.firstByteAt === 0 && att.abortReason === null;
                    if (newest === null || att.startedAt > newest.startedAt) newest = att;
                }
                if (waiting && newest !== null && job.cls !== RELAXED && isStuck(newest, now)) rescue(newest);
                continue;
            }
            const att = seg.attempts.values().next().value;
            // No first byte yet, or it stopped: another host may do better at once
            if (att?.abortReason === null && job.cls !== RELAXED && isStuck(att, now)) rescue(att);
        }
    }
    /** No first byte, or silent after bytes flowed, past its soft threshold */ function isStuck(att, now) {
        const factor = URGENCY_FACTOR[att.job.cls];
        return att.firstByteAt === 0 ? now - att.startedAt >= att.ttfbSoft * factor : now - att.lastByteAt >= att.stallSoft * factor;
    }
    /** A racer on another host for a stuck request's piece */ function rescue(att, now) {
        const { job, seg } = att;
        duplicate(job, seg, false);
    }
    /**
   * A race is for the first byte. Once both racers are receiving, the one behind only competes
   * with the leader for the same line and bytes: it goes, whatever the speeds. One still without
   * a first byte goes once the leader has `LAGGARD_BYTES` received since it started: the racer
   * rescuing a leader gone silent stays
   */ function settleRace(seg) {
        let leader = null;
        for (const att of seg.attempts)if (leader === null || att.pos > leader.pos) leader = att;
        for (const att of seg.attempts)if (att !== leader && (!att.probe || att.bytes >= PROBE_BYTES) && (att.firstByteAt === 0 ? leader.bytes >= LAGGARD_BYTES && leader.lastByteAt > att.startedAt : att.pos < leader.pos)) abortAttempt(att, MediaOutcome.Canceled);
    }
    /**
   * Free slots and nothing waiting: the piece expected to finish last holds its whole request, so
   * its tail goes to the fastest measured host not on it, cut so that both finish together
   */ function offload(now) {
        let slowest = null;
        let slowestMs = 0;
        for (const att of running){
            const { job, seg } = att;
            if (job.state !== 'running' || seg.attempts.size !== 1 || att.abortReason !== null || att.firstByteAt === 0 || seg.frontier > seg.end) continue;
            const rate = recentRate(att, now);
            const ms = (seg.end - seg.frontier + 1) / rate;
            if (rate > 0 && (slowest === null || ms > slowestMs)) {
                slowest = att;
                slowestMs = ms;
            }
        }
        if (slowest === null) return;
        const { job, seg } = slowest;
        const target = seg.end - seg.frontier + 1 >= 2 * STEAL_MIN && hasSlot(job) ? pickHost(job, seg, 'fastest') : null;
        const at = target && splitPoint(seg, recentRate(slowest, now), target.estimate);
        if (target && at !== null) {
            const tail = segment(at, seg.end);
            seg.end = at - 1;
            job.segments.push(tail);
            launch(job, tail, 'primary', target);
        }
    }
    // ---- Hosts
    /**
   * Where a piece goes. A primary (`racer` null) only to a host that may carry it alone
   * (`ownersOf`), relaxed work anywhere, to explore; a racer, or a tail, anywhere it is not running
   * already (`choose`). Hosts not tried since the piece last made progress first
   */ function pickHost(job, seg, racer) {
        const bytes = seg.end - seg.frontier + 1;
        const dup = racer !== null;
        const hosts = hostsOf(job, bytes, performance.now());
        const owners = dup || job.cls === RELAXED ? null : ownersOf(hosts);
        // A manually selected host carries primaries while it is unmeasured or within the owners'
        // speed band; once measured slower it only races, so a stale preference cannot stall a piece
        if (!dup && job.cls !== RELAXED) {
            const manualHost = model.getManualCdnHost();
            if (manualHost !== null && !seg.tried.has(manualHost)) {
                const pinned = hosts.find((option)=>option.hostname === manualHost && option.active < HOST_CAP);
                if (pinned !== undefined && (!pinned.estimate.measured || owners?.has(pinned.hostname))) return pinned;
            }
        }
        const all = eligible(hosts, dup ? seg : null, owners);
        const untried = all.filter((option)=>!seg.tried.has(option.hostname));
        const options = untried.length === 0 ? all : untried;
        if (options.length === 0) return null;
        const explore = racer === null ? job.cls === RELAXED : racer === 'explore';
        const chosen = choose(options, explore, dup || bytes < SMALL_PIECE || job.segments.length === 1);
        if (seg.tried.has(chosen.hostname)) // Every usable host was tried: a new round starts with this one
        seg.tried.clear();
        return chosen;
    }
    function hasAlternative(job, seg, now) {
        return eligible(hostsOf(job, seg.end - seg.frontier + 1, now), seg, null).length > 0;
    }
    /** Every host of the job not cooling down, with a signature it may use, busy or not, and what a piece of `bytes` would get from it */ function hostsOf(job, bytes, now) {
        const nowSec = Date.now() / 1000;
        const loads = hostLoads(now);
        const hosts = [];
        for (const [hostname, listed] of job.candidates){
            const candidate = model.isCoolingDown(hostname, now) ? null : pickCandidate(listed, job.file, now, nowSec);
            if (candidate !== null) hosts.push({
                hostname,
                candidate,
                estimate: withLoad(model.estimate(hostname, job.file, bytes), loads.get(hostname), bytes),
                active: busy.get(hostname) ?? 0
            });
        }
        return hosts;
    }
    /** hostname -> [its requests receiving, the bytes per ms they get together] */ function hostLoads(now) {
        const loads = new Map();
        for (const att of running)if (att.firstByteAt !== 0 && att.abortReason === null) {
            const load = loads.get(att.hostname) ?? [
                0,
                0
            ];
            load[0]++;
            load[1] += recentRate(att, now);
            loads.set(att.hostname, load);
        }
        return loads;
    }
    /** For one host: one of the file's signatures it may use, in turn */ function pickCandidate(listed, file, now, nowSec) {
        const usable = listed.filter((candidate)=>player.isCandidateUsable(candidate, file, now, nowSec));
        return usable.length > 0 ? usable[rotation % usable.length] : null;
    }
    // ---- Warm-up: the init segment and index of what the player may switch to, ahead of it
    /** Every representation of the file's video of its kind, and for video of its codec (`codecs` from the playinfo) */ function warmUp(file) {
        const now = performance.now();
        const nowSec = Date.now() / 1000;
        const files = player.filesOf(file.videoKey);
        for(let i = 0, len = files.length; i < len; i++){
            const other = files[i];
            if (other.kind !== file.kind || other.segmentBase === null || headers.has(other.key) || other.kind === 'video' && codecFamily(other) !== codecFamily(file)) continue;
            const candidates = player.candidates(other);
            // Nothing usable right now: a request for it fetches the normal way
            if (!candidates.some((candidate)=>player.isCandidateUsable(candidate, other, now, nowSec))) continue;
            const range = {
                start: 0,
                end: other.segmentBase.index.end
            };
            addHeader(other.key, range);
            start({
                file: other,
                range,
                served: range,
                cls: RELAXED,
                candidates
            }, null);
        }
    }
    /** An empty entry, filled by the job fetching exactly `range` */ function addHeader(key, range) {
        headers.set(key, {
            range,
            bytes: null,
            total: null,
            contentType: ''
        });
        if (headers.size > MAX_HEADERS) headers.delete(headers.keys().next().value);
    }
    /** A request inside the init and index fetched ahead: served from them, as a copy */ function serveHeader(header, bytes, file, range, sink) {
        const length = byteRangeLength(range);
        const body = new unsafeWindow.ArrayBuffer(length);
        new unsafeWindow.Uint8Array(body).set(bytes.subarray(range.start - header.range.start, range.end - header.range.start + 1));
        const responseHeaders = [
            [
                'content-type',
                header.contentType || `${file.kind}/mp4`
            ],
            [
                'content-length',
                String(length)
            ]
        ];
        if (header.total !== null) responseHeaders.push([
            'content-range',
            `bytes ${range.start}-${range.end}/${header.total}`
        ]);
        sink.headersReceived(206, responseHeaders, '');
        sink.done(body);
    }
    return {
        type: 'serve',
        name: 'thread-ripper',
        serve ({ ctx, range, file, candidates, requested }) {
            const now = performance.now();
            // Left to the browser. The requested URL is the last resort: not acceptable, the browser keeps it
            let reason = null;
            if (integrityFailed || now < offUntil) reason = 'off after failures';
            else if (range === null) reason = 'not a single byte range';
            else if (file === null) reason = 'no playinfo lists the file';
            else if (requested === null) reason = 'the requested URL is not acceptable';
            else if (byteRangeLength(range) > MAX_SERVED_LENGTH) reason = 'range too long';
            else if ((nativeRetry.get(`${file.key}:${range.start}-${range.end}`) ?? 0) > now) reason = 'it failed just now';
            if (reason !== null || range === null || file === null || requested === null) return null;
            // The initialization segment and the index come first: nothing plays without them
            const whole = file.segmentBase !== null && range.end <= file.segmentBase.index.end ? {
                start: 0,
                end: file.segmentBase.index.end
            } : null;
            const header = headers.get(file.key);
            const bytes = header?.bytes ?? null;
            if (header !== undefined && bytes !== null && range.start >= header.range.start && range.end <= header.range.end) return (sink)=>serveHeader(header, bytes, file, range, sink);
            // The first request for the init segment or the index fetches both, and the other is served from the copy
            const fetched = header === undefined && whole !== null ? whole : range;
            if (fetched !== range) addHeader(file.key, fetched);
            // The player plays this video: what it may switch to is fetched ahead of it
            warmUp(file);
            return (sink)=>start({
                    file,
                    range: fetched,
                    served: range,
                    cls: whole === null ? URGENT : CRITICAL,
                    candidates
                }, sink);
        }
    };
}
/**
 * How many pieces a range is split into. A range whose transfer takes less than two round trips
 * is not worth splitting; otherwise each piece keeps its request busy for a good part of a second,
 * with no more than `PIECES_PER_HOST` per host that may carry one
 */ function pieceCount(length, rate, ttfb, hosts) {
    if (length < n(2 * rate * ttfb, 128 * KiB, MiB)) return 1;
    const pieceSize = n(rate * n(4 * ttfb, 600, 1500), MIN_PIECE, MAX_PIECE);
    return n(Math.ceil(length / pieceSize), 1, Math.min(MAX_PIECES, hosts * PIECES_PER_HOST));
}
function segment(start, end) {
    return {
        end,
        frontier: start,
        attempts: new Set(),
        tries: 0,
        tried: new Set(),
        extra: 0,
        queued: false
    };
}
/** An attempt's speed over the last half second, or since its first byte when the history is short */ function recentRate(att, now) {
    const { meter } = att;
    if (meter.length === 0) return 0;
    const [lastTime, lastBytes] = meter.at(-1);
    for(let i = 0, len = meter.length; i < len; i++){
        const [time, bytes] = meter[i];
        if (now - time <= 500 && lastTime - time >= 100) return (lastBytes - bytes) / Math.max(1, now - time);
    }
    return att.firstByteAt === 0 || now <= att.firstByteAt ? 0 : (att.bytes - att.firstChunkBytes) / (now - att.firstByteAt);
}
/**
 * Where to split a piece so both halves finish together: the running attempt (rate `r`) keeps
 * `[frontier, m)`, the new host takes `[m, end]`. `null` when either half would be too small
 */ function splitPoint(seg, r, { ttfb, rate }) {
    if (r <= 0) return null;
    const remaining = seg.end + 1 - seg.frontier;
    const m = seg.frontier + Math.ceil(r * (ttfb + remaining / rate) / (1 + r / rate));
    // The running attempt must still have work while the new one waits for its first byte
    return seg.end + 1 - m < STEAL_MIN || m - seg.frontier < Math.max(STEAL_MIN, r * ttfb) ? null : m;
}
/**
 * What one more request to a host would get: no more than its requests get now. They share one
 * HTTP/2 connection, so on a host whose connection is the limit they slow each other down
 */ function withLoad(estimate, load, bytes) {
    const rate = load === undefined || load[1] <= 0 ? estimate.rate : Math.min(estimate.rate, load[1] / load[0]);
    return rate === estimate.rate ? estimate : {
        ...estimate,
        rate,
        eta: estimate.ttfb + bytes / rate
    };
}
/** Of `hosts`, those with room for one more piece, of `only` if given, not those on `avoid` if given */ function eligible(hosts, avoid, only) {
    const taken = new Set();
    if (avoid !== null) for (const att of avoid.attempts)taken.add(att.hostname);
    return hosts.filter((option)=>option.active < HOST_CAP && !taken.has(option.hostname) && (only === null || only.has(option.hostname)));
}
/**
 * Of `hosts`, those a piece may go to on its own, busy or not: the measured ones expected to finish
 * it within `ETA_BAND` of the best. `null` when none is measured: any host may take it
 */ function ownersOf(hosts) {
    const measured = hosts.filter((option)=>option.estimate.measured);
    const best = Math.min(...measured.map((option)=>option.estimate.eta));
    const owners = new Set();
    for(let i = 0, len = measured.length; i < len; i++)if (measured[i].estimate.eta <= best * ETA_BAND) owners.add(measured[i].hostname);
    return owners.size > 0 ? owners : null;
}
/**
 * Among the hosts that may carry a piece. A host never measured is unknown: its speed depends on
 * whether its edge has the file and on the path to it, so it is never ranked against measured
 * ones. Before anything is measured, or to `explore`, such a host first (the addresses Bilibili
 * listed, then the least busy); else, for a `small` piece, the measured host expected to finish
 * first, otherwise the least busy
 */ function choose(options, explore, small) {
    const untested = options.filter((option)=>!option.estimate.measured);
    if (untested.length > 0 && (explore || untested.length === options.length)) return leastBusy(preferred(untested));
    const measured = options.filter((option)=>option.estimate.measured);
    return small ? fastest(measured) : leastBusy(measured);
}
/**
 * Among hosts nothing is measured on yet: the addresses Bilibili issued for this file first (when
 * only the assigned hosts are good, the moved signatures are 13 ways to wait), then the signatures
 * moved onto other hosts, last the rest. Mirror and bcache hosts are peers at every step
 */ function preferred(options) {
    const listed = options.filter((option)=>option.candidate.tier <= CandidateTier.ListedBcache);
    if (listed.length > 0) return listed;
    const moved = options.filter((option)=>option.candidate.tier <= CandidateTier.Bcache);
    return moved.length > 0 ? moved : options;
}
function leastBusy(options) {
    return options.reduce((best, option)=>option.active < best.active || option.active === best.active && option.estimate.eta < best.estimate.eta ? option : best);
}
function fastest(options) {
    return options.reduce((best, option)=>option.estimate.eta < best.estimate.eta ? option : best);
}
/** `avc1`, `hev1` (`hvc1` alike), `av01`... */ function codecFamily(file) {
    return file.codecs.startsWith('hvc1') ? 'hev1' : file.codecs.slice(0, 4);
}
function byHost(candidates) {
    const grouped = new Map();
    for(let i = 0, len = candidates.length; i < len; i++){
        const list = grouped.get(candidates[i].hostname);
        if (list) list.push(candidates[i]);
        else grouped.set(candidates[i].hostname, [
            candidates[i]
        ]);
    }
    return grouped;
}const threadRipper = {
    name: 'thread-ripper',
    description: '多 CDN 分片并发并行下载视频，可能浪费一部分带宽和流量',
    defaultEnabled: false,
    any ({ player, nativeFetch }) {
        // Live streams are not DASH segments
        if (unsafeWindow.location.hostname === 'live.bilibili.com') return;
        player.registerPhase(createThreadRipper(player, nativeFetch));
    }
};// 去除鸿蒙字体，强制使用系统默认字体
const useSystemFonts = {
    name: 'use-system-fonts',
    description: '去除鸿蒙字体，强制使用系统默认字体',
    any ({ addStyle }) {
        document.querySelectorAll('link[href*="/jinkela/long/font/"]').forEach((x)=>x.remove());
        addStyle(e$5`html, body { font-family: system-ui !important; }`);
    }
};// only call once, since fucking Bilibili now storming us with AV1 check
const logAv1Disabled = {
    MediaSource_isTypeSupported () {
        logger.info('AV1 disabled!', {
            meta: 'MediaSource.isTypeSupported'
        });
    },
    HTMLVideoElement_canPlayType () {
        logger.info('AV1 disabled!', {
            meta: 'HTMLVideoElement.prototype.canPlayType'
        });
    }
};
const disableAV1 = {
    name: 'disable-av1',
    description: '防止叔叔用 AV1 格式燃烧你的 CPU 并省下棺材钱',
    any ({ onlyCallOnce }) {
        ((origCanPlayType)=>{
            // eslint-disable-next-line sukka/class-prototype -- override native method
            HTMLMediaElement.prototype.canPlayType = function(type) {
                if (type.includes('av01')) {
                    onlyCallOnce(logAv1Disabled.HTMLVideoElement_canPlayType);
                    return '';
                }
                return origCanPlayType.call(this, type);
            };
        // eslint-disable-next-line @typescript-eslint/unbound-method -- override native method
        })(HTMLMediaElement.prototype.canPlayType);
        ((origIsTypeSupported)=>{
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- can be nullable
            if (origIsTypeSupported == null) return false;
            unsafeWindow.MediaSource.isTypeSupported = function(type) {
                if (type.includes('av01')) {
                    onlyCallOnce(logAv1Disabled.MediaSource_isTypeSupported);
                    return false;
                }
                return origIsTypeSupported.call(this, type);
            };
        // eslint-disable-next-line @typescript-eslint/unbound-method -- override native method
        })(unsafeWindow.MediaSource.isTypeSupported);
    }
};const messages = {
  AbortError: "A request was aborted, for example through a call to IDBTransaction.abort.",
  ConstraintError: "A mutation operation in the transaction failed because a constraint was not satisfied. For example, an object such as an object store or index already exists and a request attempted to create a new one.",
  DataError: "Data provided to an operation does not meet requirements.",
  InvalidAccessError: "An invalid operation was performed on an object. For example transaction creation attempt was made, but an empty scope was provided.",
  InvalidStateError: "An operation was called on an object on which it is not allowed or at a time when it is not allowed. Also occurs if a request is made on a source object that has been deleted or removed. Use TransactionInactiveError or ReadOnlyError when possible, as they are more specific variations of InvalidStateError.",
  NotFoundError: "The operation failed because the requested database object could not be found. For example, an object store did not exist but was being opened.",
  ReadOnlyError: 'The mutating operation was attempted in a "readonly" transaction.',
  TransactionInactiveError: "A request was placed against a transaction which is currently not active, or which is finished.",
  VersionError: "An attempt was made to open a database using a lower version than the existing version."
};

// Cannot set an error code on an error using the normal setter;
// this leads to "Cannot set property code of  which has only a getter"
const setErrorCode = (error, value) => {
  Object.defineProperty(error, 'code', {
    value,
    writable: false,
    enumerable: true,
    configurable: false
  });
};
class AbortError extends DOMException {
  constructor(message = messages.AbortError) {
    super(message, "AbortError");
  }
}
class ConstraintError extends DOMException {
  constructor(message = messages.ConstraintError) {
    super(message, "ConstraintError");
  }
}
class DataError extends DOMException {
  constructor(message = messages.DataError) {
    super(message, "DataError");
    setErrorCode(this, 0);
  }
}
class InvalidAccessError extends DOMException {
  constructor(message = messages.InvalidAccessError) {
    super(message, "InvalidAccessError");
  }
}
class InvalidStateError extends DOMException {
  constructor(message = messages.InvalidStateError) {
    super(message, "InvalidStateError");
    setErrorCode(this, 11);
  }
}
class NotFoundError extends DOMException {
  constructor(message = messages.NotFoundError) {
    super(message, "NotFoundError");
  }
}
class ReadOnlyError extends DOMException {
  constructor(message = messages.ReadOnlyError) {
    super(message, "ReadOnlyError");
  }
}
class SyntaxError extends DOMException {
  constructor(message = messages.VersionError) {
    super(message, "SyntaxError");
    setErrorCode(this, 12);
  }
}
class TransactionInactiveError extends DOMException {
  constructor(message = messages.TransactionInactiveError) {
    super(message, "TransactionInactiveError");
    setErrorCode(this, 0);
  }
}
class VersionError extends DOMException {
  constructor(message = messages.VersionError) {
    super(message, "VersionError");
  }
}function isSharedArrayBuffer(input) {
  return typeof SharedArrayBuffer !== "undefined" && input instanceof SharedArrayBuffer;
}const INVALID_TYPE = Symbol("INVALID_TYPE");
const INVALID_VALUE = Symbol("INVALID_VALUE");

// https://w3c.github.io/IndexedDB/#convert-value-to-key
// The "without exceptions" version is because we typically want to throw exceptions (DataError) but not for
// the "is potentially valid key range" routine.
const valueToKeyWithoutThrowing = (input, seen) => {
  if (typeof input === "number") {
    if (isNaN(input)) {
      // If input is NaN then return "invalid value".
      return INVALID_VALUE;
    }
    return input;
  } else if (Object.prototype.toString.call(input) === "[object Date]") {
    const ms = input.valueOf();
    if (isNaN(ms)) {
      // If ms is NaN then return "invalid value".
      return INVALID_VALUE;
    }
    return new Date(ms);
  } else if (typeof input === "string") {
    return input;
  } else if (
  // https://w3c.github.io/IndexedDB/#ref-for-dfn-buffer-source-type
  input instanceof ArrayBuffer || isSharedArrayBuffer(input) || typeof ArrayBuffer !== "undefined" && ArrayBuffer.isView && ArrayBuffer.isView(input)) {
    // We can't consistently test detachedness, so instead we check if byteLength === 0
    // This isn't foolproof, but there's no perfect way to detect if Uint8Arrays or
    // SharedArrayBuffers are detached
    if ("detached" in input ? input.detached : input.byteLength === 0) {
      // If input is detached then return "invalid value".
      return INVALID_VALUE;
    }
    let arrayBuffer;
    let offset = 0;
    let length = 0;
    if (input instanceof ArrayBuffer || isSharedArrayBuffer(input)) {
      arrayBuffer = input;
      length = input.byteLength;
    } else {
      arrayBuffer = input.buffer;
      offset = input.byteOffset;
      length = input.byteLength;
    }
    return arrayBuffer.slice(offset, offset + length);
  } else if (Array.isArray(input)) {
    if (seen === undefined) {
      seen = new Set();
    } else if (seen.has(input)) {
      // If seen contains input, then return "invalid value".
      return INVALID_VALUE;
    }
    seen.add(input);

    // This algorithm is tricky to account for `bindings-inject-keys-bypass.any.js`. We _should_ return early when
    // encountering an invalid key/type, but we also need to avoid triggering `Object.prototype['10']` if it's been
    // overridden. One simple way to do this (and which doesn't rely on sparse arrays or other exotic solutions that
    // could cause de-opts) is to use `Array.from()` with a mapper function, which does not trigger the prototype
    // setter [1]. It does prevent an early return, but we can at least short-circuit inside the mapper function
    // (which isn't strictly necessary to pass the WPTs, but is closer to the spec).
    // [1]: See https://tc39.es/ecma262/multipage/indexed-collections.html#sec-array.from, specifically
    //      the chain CreateDataPropertyOrThrow -> CreateDataProperty -> DefineOwnProperty which defines
    //      the array element as an "own" property.
    let hasInvalid = false;
    const keys = Array.from({
      length: input.length
    }, (_, i) => {
      if (hasInvalid) {
        return;
      }
      const hop = Object.hasOwn(input, i);
      if (!hop) {
        // If hop is false, return "invalid value".
        hasInvalid = true;
        return;
      }
      const entry = input[i];
      const key = valueToKeyWithoutThrowing(entry, seen);
      // If key is "invalid value" or "invalid type" abort these steps and return "invalid value".
      if (key === INVALID_VALUE || key === INVALID_TYPE) {
        hasInvalid = true;
        return;
      }
      return key;
    });
    if (hasInvalid) {
      return INVALID_VALUE;
    }
    return keys;
  } else {
    // Otherwise: Return "invalid type".
    return INVALID_TYPE;
  }
};// https://w3c.github.io/IndexedDB/#convert-value-to-key
// Plus throwing a DataError for invalid value/invalid key, which is commonly done
// in lots of IndexedDB operations
const valueToKey = (input, seen) => {
  const result = valueToKeyWithoutThrowing(input, seen);
  if (result === INVALID_VALUE || result === INVALID_TYPE) {
    // If key is "invalid value" or "invalid type", throw a "DataError" DOMException
    throw new DataError();
  }
  return result;
};const getType = x => {
  if (typeof x === "number") {
    return "Number";
  }
  if (Object.prototype.toString.call(x) === "[object Date]") {
    return "Date";
  }
  if (Array.isArray(x)) {
    return "Array";
  }
  if (typeof x === "string") {
    return "String";
  }
  if (x instanceof ArrayBuffer) {
    return "Binary";
  }
  throw new DataError();
};

// https://w3c.github.io/IndexedDB/#compare-two-keys
const cmp = (first, second) => {
  if (second === undefined) {
    throw new TypeError();
  }
  first = valueToKey(first);
  second = valueToKey(second);
  const t1 = getType(first);
  const t2 = getType(second);
  if (t1 !== t2) {
    if (t1 === "Array") {
      return 1;
    }
    if (t1 === "Binary" && (t2 === "String" || t2 === "Date" || t2 === "Number")) {
      return 1;
    }
    if (t1 === "String" && (t2 === "Date" || t2 === "Number")) {
      return 1;
    }
    if (t1 === "Date" && t2 === "Number") {
      return 1;
    }
    return -1;
  }
  if (t1 === "Binary") {
    first = new Uint8Array(first);
    second = new Uint8Array(second);
  }
  if (t1 === "Array" || t1 === "Binary") {
    const length = Math.min(first.length, second.length);
    for (let i = 0; i < length; i++) {
      const result = cmp(first[i], second[i]);
      if (result !== 0) {
        return result;
      }
    }
    if (first.length > second.length) {
      return 1;
    }
    if (first.length < second.length) {
      return -1;
    }
    return 0;
  }
  if (t1 === "Date") {
    if (first.getTime() === second.getTime()) {
      return 0;
    }
  } else {
    if (first === second) {
      return 0;
    }
  }
  return first > second ? 1 : -1;
};// http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#range-concept
class FDBKeyRange {
  static only(value) {
    if (arguments.length === 0) {
      throw new TypeError();
    }
    value = valueToKey(value);
    return new FDBKeyRange(value, value, false, false);
  }
  static lowerBound(lower, open = false) {
    if (arguments.length === 0) {
      throw new TypeError();
    }
    lower = valueToKey(lower);
    return new FDBKeyRange(lower, undefined, open, true);
  }
  static upperBound(upper, open = false) {
    if (arguments.length === 0) {
      throw new TypeError();
    }
    upper = valueToKey(upper);
    return new FDBKeyRange(undefined, upper, true, open);
  }
  static bound(lower, upper, lowerOpen = false, upperOpen = false) {
    if (arguments.length < 2) {
      throw new TypeError();
    }
    const cmpResult = cmp(lower, upper);
    if (cmpResult === 1 || cmpResult === 0 && (lowerOpen || upperOpen)) {
      throw new DataError();
    }
    lower = valueToKey(lower);
    upper = valueToKey(upper);
    return new FDBKeyRange(lower, upper, lowerOpen, upperOpen);
  }
  constructor(lower, upper, lowerOpen, upperOpen) {
    this.lower = lower;
    this.upper = upper;
    this.lowerOpen = lowerOpen;
    this.upperOpen = upperOpen;
  }

  // https://w3c.github.io/IndexedDB/#dom-idbkeyrange-includes
  includes(key) {
    if (arguments.length === 0) {
      throw new TypeError();
    }
    key = valueToKey(key);
    if (this.lower !== undefined) {
      const cmpResult = cmp(this.lower, key);
      if (cmpResult === 1 || cmpResult === 0 && this.lowerOpen) {
        return false;
      }
    }
    if (this.upper !== undefined) {
      const cmpResult = cmp(this.upper, key);
      if (cmpResult === -1 || cmpResult === 0 && this.upperOpen) {
        return false;
      }
    }
    return true;
  }
  get [Symbol.toStringTag]() {
    return "IDBKeyRange";
  }
}// http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#dfn-steps-for-extracting-a-key-from-a-value-using-a-key-path
const extractKey = (keyPath, value) => {
  if (Array.isArray(keyPath)) {
    const result = [];
    for (let item of keyPath) {
      // This doesn't make sense to me based on the spec, but it is needed to pass the W3C KeyPath tests (see same
      // comment in validateKeyPath)
      if (item !== undefined && item !== null && typeof item !== "string" && item.toString) {
        item = item.toString();
      }
      const key = extractKey(item, value).key;
      result.push(valueToKey(key));
    }
    return {
      type: "found",
      key: result
    };
  }
  if (keyPath === "") {
    return {
      type: "found",
      key: value
    };
  }
  let remainingKeyPath = keyPath;
  let object = value;
  while (remainingKeyPath !== null) {
    let identifier;
    const i = remainingKeyPath.indexOf(".");
    if (i >= 0) {
      identifier = remainingKeyPath.slice(0, i);
      remainingKeyPath = remainingKeyPath.slice(i + 1);
    } else {
      identifier = remainingKeyPath;
      remainingKeyPath = null;
    }

    // special cases: https://w3c.github.io/IndexedDB/#evaluate-a-key-path-on-a-value
    const isSpecialIdentifier = identifier === "length" && (typeof object === "string" || Array.isArray(object)) || (identifier === "size" || identifier === "type") && typeof Blob !== "undefined" && object instanceof Blob || (identifier === "name" || identifier === "lastModified") && typeof File !== "undefined" && object instanceof File;
    if (!isSpecialIdentifier && (typeof object !== "object" || object === null || !Object.hasOwn(object, identifier))) {
      return {
        type: "notFound"
      };
    }
    object = object[identifier];
  }
  return {
    type: "found",
    key: object
  };
};// https://w3c.github.io/IndexedDB/#clone-value
// Note that we only need to call this during insertions because the spec does not expect any cloning during retrieval,
// only `StructuredDeserialize()` (e.g. see [1]). This is also only required for values, not keys, since keys do not
// require cloning during insertion (e.g. see [2]).
// [1]: https://w3c.github.io/IndexedDB/#retrieve-multiple-items-from-an-object-store
// [2]: https://w3c.github.io/IndexedDB/#add-or-put
function cloneValueForInsertion(value, transaction) {
  // Assert: transaction’s state is active.
  if (transaction._state !== "active") {
    throw new Error("Assert: transaction state is active");
  }

  // Set transaction’s state to inactive.
  transaction._state = "inactive";
  try {
    // Let serialized be StructuredSerializeForStorage(value).
    // Let clone be ? StructuredDeserialize(serialized, targetRealm).
    // Return clone.
    return structuredClone(value);
  } finally {
    // Set transaction’s state to active.
    transaction._state = "active";
  }
}const getEffectiveObjectStore = cursor => {
  if (cursor.source instanceof FDBObjectStore) {
    return cursor.source;
  }
  return cursor.source.objectStore;
};

// This takes a key range, a list of lower bounds, and a list of upper bounds and combines them all into a single key
// range. It does not handle gt/gte distinctions, because it doesn't really matter much anyway, since for next/prev
// cursor iteration it'd also have to look at values to be precise, which would be complicated. This should get us 99%
// of the way there.
const makeKeyRange = (range, lowers, uppers) => {
  // Start with bounds from range
  let lower = range !== undefined ? range.lower : undefined;
  let upper = range !== undefined ? range.upper : undefined;

  // Augment with values from lowers and uppers
  for (const lowerTemp of lowers) {
    if (lowerTemp === undefined) {
      continue;
    }
    if (lower === undefined || cmp(lower, lowerTemp) === 1) {
      lower = lowerTemp;
    }
  }
  for (const upperTemp of uppers) {
    if (upperTemp === undefined) {
      continue;
    }
    if (upper === undefined || cmp(upper, upperTemp) === -1) {
      upper = upperTemp;
    }
  }
  if (lower !== undefined && upper !== undefined) {
    return FDBKeyRange.bound(lower, upper);
  }
  if (lower !== undefined) {
    return FDBKeyRange.lowerBound(lower);
  }
  if (upper !== undefined) {
    return FDBKeyRange.upperBound(upper);
  }
};

// http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#cursor
class FDBCursor {
  _gotValue = false;
  _position = undefined; // Key of previously returned record
  _objectStorePosition = undefined;
  _keyOnly = false;
  _key = undefined;
  _primaryKey = undefined;
  constructor(source, range, direction = "next", request, keyOnly = false) {
    this._range = range;
    this._source = source;
    this._direction = direction;
    this._request = request;
    this._keyOnly = keyOnly;
  }

  // Read only properties
  get source() {
    return this._source;
  }
  set source(val) {
    /* For babel */
  }
  get request() {
    return this._request;
  }
  set request(val) {
    /* For babel */
  }
  get direction() {
    return this._direction;
  }
  set direction(val) {
    /* For babel */
  }
  get key() {
    return this._key;
  }
  set key(val) {
    /* For babel */
  }
  get primaryKey() {
    return this._primaryKey;
  }
  set primaryKey(val) {
    /* For babel */
  }

  // https://w3c.github.io/IndexedDB/#iterate-a-cursor
  _iterate(key, primaryKey) {
    const sourceIsObjectStore = this.source instanceof FDBObjectStore;

    // Can't use sourceIsObjectStore because TypeScript
    const records = this.source instanceof FDBObjectStore ? this.source._rawObjectStore.records : this.source._rawIndex.records;
    let foundRecord;
    if (this.direction === "next") {
      const range = makeKeyRange(this._range, [key, this._position], []);
      for (const record of records.values(range)) {
        const cmpResultKey = key !== undefined ? cmp(record.key, key) : undefined;
        const cmpResultPosition = this._position !== undefined ? cmp(record.key, this._position) : undefined;
        if (key !== undefined) {
          if (cmpResultKey === -1) {
            continue;
          }
        }
        if (primaryKey !== undefined) {
          if (cmpResultKey === -1) {
            continue;
          }
          const cmpResultPrimaryKey = cmp(record.value, primaryKey);
          if (cmpResultKey === 0 && cmpResultPrimaryKey === -1) {
            continue;
          }
        }
        if (this._position !== undefined && sourceIsObjectStore) {
          if (cmpResultPosition !== 1) {
            continue;
          }
        }
        if (this._position !== undefined && !sourceIsObjectStore) {
          if (cmpResultPosition === -1) {
            continue;
          }
          if (cmpResultPosition === 0 && cmp(record.value, this._objectStorePosition) !== 1) {
            continue;
          }
        }
        if (this._range !== undefined) {
          if (!this._range.includes(record.key)) {
            continue;
          }
        }
        foundRecord = record;
        break;
      }
    } else if (this.direction === "nextunique") {
      // This could be done without iterating, if the range was defined slightly better (to handle gt/gte cases).
      // But the performance difference should be small, and that wouldn't work anyway for directions where the
      // value needs to be used (like next and prev).
      const range = makeKeyRange(this._range, [key, this._position], []);
      for (const record of records.values(range)) {
        if (key !== undefined) {
          if (cmp(record.key, key) === -1) {
            continue;
          }
        }
        if (this._position !== undefined) {
          if (cmp(record.key, this._position) !== 1) {
            continue;
          }
        }
        if (this._range !== undefined) {
          if (!this._range.includes(record.key)) {
            continue;
          }
        }
        foundRecord = record;
        break;
      }
    } else if (this.direction === "prev") {
      const range = makeKeyRange(this._range, [], [key, this._position]);
      for (const record of records.values(range, "prev")) {
        const cmpResultKey = key !== undefined ? cmp(record.key, key) : undefined;
        const cmpResultPosition = this._position !== undefined ? cmp(record.key, this._position) : undefined;
        if (key !== undefined) {
          if (cmpResultKey === 1) {
            continue;
          }
        }
        if (primaryKey !== undefined) {
          if (cmpResultKey === 1) {
            continue;
          }
          const cmpResultPrimaryKey = cmp(record.value, primaryKey);
          if (cmpResultKey === 0 && cmpResultPrimaryKey === 1) {
            continue;
          }
        }
        if (this._position !== undefined && sourceIsObjectStore) {
          if (cmpResultPosition !== -1) {
            continue;
          }
        }
        if (this._position !== undefined && !sourceIsObjectStore) {
          if (cmpResultPosition === 1) {
            continue;
          }
          if (cmpResultPosition === 0 && cmp(record.value, this._objectStorePosition) !== -1) {
            continue;
          }
        }
        if (this._range !== undefined) {
          if (!this._range.includes(record.key)) {
            continue;
          }
        }
        foundRecord = record;
        break;
      }
    } else if (this.direction === "prevunique") {
      let tempRecord;
      const range = makeKeyRange(this._range, [], [key, this._position]);
      for (const record of records.values(range, "prev")) {
        if (key !== undefined) {
          if (cmp(record.key, key) === 1) {
            continue;
          }
        }
        if (this._position !== undefined) {
          if (cmp(record.key, this._position) !== -1) {
            continue;
          }
        }
        if (this._range !== undefined) {
          if (!this._range.includes(record.key)) {
            continue;
          }
        }
        tempRecord = record;
        break;
      }
      if (tempRecord) {
        foundRecord = records.get(tempRecord.key);
      }
    }
    let result;
    if (!foundRecord) {
      this._key = undefined;
      if (!sourceIsObjectStore) {
        this._objectStorePosition = undefined;
      }

      // "this instanceof FDBCursorWithValue" would be better and not require (this as any), but causes runtime
      // error due to circular dependency.
      if (!this._keyOnly && this.toString() === "[object IDBCursorWithValue]") {
        this.value = undefined;
      }
      result = null;
    } else {
      this._position = foundRecord.key;
      if (!sourceIsObjectStore) {
        this._objectStorePosition = foundRecord.value;
      }
      this._key = foundRecord.key;
      if (sourceIsObjectStore) {
        this._primaryKey = structuredClone(foundRecord.key);
        if (!this._keyOnly && this.toString() === "[object IDBCursorWithValue]") {
          this.value = structuredClone(foundRecord.value);
        }
      } else {
        this._primaryKey = structuredClone(foundRecord.value);
        if (!this._keyOnly && this.toString() === "[object IDBCursorWithValue]") {
          if (this.source instanceof FDBObjectStore) {
            // Can't use sourceIsObjectStore because TypeScript
            throw new Error("This should never happen");
          }
          const value = this.source.objectStore._rawObjectStore.getValue(foundRecord.value);
          this.value = structuredClone(value);
        }
      }
      this._gotValue = true;
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      result = this;
    }
    return result;
  }

  // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#widl-IDBCursor-update-IDBRequest-any-value
  update(value) {
    if (value === undefined) {
      throw new TypeError();
    }
    const effectiveObjectStore = getEffectiveObjectStore(this);
    const effectiveKey = Object.hasOwn(this.source, "_rawIndex") ? this.primaryKey : this._position;
    const transaction = effectiveObjectStore.transaction;
    if (transaction._state !== "active") {
      throw new TransactionInactiveError();
    }
    if (transaction.mode === "readonly") {
      throw new ReadOnlyError();
    }
    if (effectiveObjectStore._rawObjectStore.deleted) {
      throw new InvalidStateError();
    }
    if (!(this.source instanceof FDBObjectStore) && this.source._rawIndex.deleted) {
      throw new InvalidStateError();
    }
    if (!this._gotValue || !Object.hasOwn(this, "value")) {
      throw new InvalidStateError();
    }
    const clone = cloneValueForInsertion(value, transaction);
    if (effectiveObjectStore.keyPath !== null) {
      let tempKey;
      try {
        tempKey = extractKey(effectiveObjectStore.keyPath, clone).key;
      } catch (err) {
        /* Handled immediately below */
      }
      if (cmp(tempKey, effectiveKey) !== 0) {
        throw new DataError();
      }
    }
    const record = {
      key: effectiveKey,
      value: clone
    };
    return transaction._execRequestAsync({
      operation: effectiveObjectStore._rawObjectStore.storeRecord.bind(effectiveObjectStore._rawObjectStore, record, false, transaction._rollbackLog),
      source: this
    });
  }

  // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#widl-IDBCursor-advance-void-unsigned-long-count
  advance(count) {
    if (!Number.isInteger(count) || count <= 0) {
      throw new TypeError();
    }
    const effectiveObjectStore = getEffectiveObjectStore(this);
    const transaction = effectiveObjectStore.transaction;
    if (transaction._state !== "active") {
      throw new TransactionInactiveError();
    }
    if (effectiveObjectStore._rawObjectStore.deleted) {
      throw new InvalidStateError();
    }
    if (!(this.source instanceof FDBObjectStore) && this.source._rawIndex.deleted) {
      throw new InvalidStateError();
    }
    if (!this._gotValue) {
      throw new InvalidStateError();
    }
    if (this._request) {
      this._request.readyState = "pending";
    }
    transaction._execRequestAsync({
      operation: () => {
        let result;
        for (let i = 0; i < count; i++) {
          result = this._iterate();

          // Not sure why this is needed
          if (!result) {
            break;
          }
        }
        return result;
      },
      request: this._request,
      source: this.source
    });
    this._gotValue = false;
  }

  // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#widl-IDBCursor-continue-void-any-key
  continue(key) {
    const effectiveObjectStore = getEffectiveObjectStore(this);
    const transaction = effectiveObjectStore.transaction;
    if (transaction._state !== "active") {
      throw new TransactionInactiveError();
    }
    if (effectiveObjectStore._rawObjectStore.deleted) {
      throw new InvalidStateError();
    }
    if (!(this.source instanceof FDBObjectStore) && this.source._rawIndex.deleted) {
      throw new InvalidStateError();
    }
    if (!this._gotValue) {
      throw new InvalidStateError();
    }
    if (key !== undefined) {
      key = valueToKey(key);
      const cmpResult = cmp(key, this._position);
      if (cmpResult <= 0 && (this.direction === "next" || this.direction === "nextunique") || cmpResult >= 0 && (this.direction === "prev" || this.direction === "prevunique")) {
        throw new DataError();
      }
    }
    if (this._request) {
      this._request.readyState = "pending";
    }
    transaction._execRequestAsync({
      operation: this._iterate.bind(this, key),
      request: this._request,
      source: this.source
    });
    this._gotValue = false;
  }

  // hthttps://w3c.github.io/IndexedDB/#dom-idbcursor-continueprimarykey
  continuePrimaryKey(key, primaryKey) {
    const effectiveObjectStore = getEffectiveObjectStore(this);
    const transaction = effectiveObjectStore.transaction;
    if (transaction._state !== "active") {
      throw new TransactionInactiveError();
    }
    if (effectiveObjectStore._rawObjectStore.deleted) {
      throw new InvalidStateError();
    }
    if (!(this.source instanceof FDBObjectStore) && this.source._rawIndex.deleted) {
      throw new InvalidStateError();
    }
    if (this.source instanceof FDBObjectStore || this.direction !== "next" && this.direction !== "prev") {
      throw new InvalidAccessError();
    }
    if (!this._gotValue) {
      throw new InvalidStateError();
    }

    // Not sure about this
    if (key === undefined || primaryKey === undefined) {
      throw new DataError();
    }
    key = valueToKey(key);
    const cmpResult = cmp(key, this._position);
    if (cmpResult === -1 && this.direction === "next" || cmpResult === 1 && this.direction === "prev") {
      throw new DataError();
    }
    const cmpResult2 = cmp(primaryKey, this._objectStorePosition);
    if (cmpResult === 0) {
      if (cmpResult2 <= 0 && this.direction === "next" || cmpResult2 >= 0 && this.direction === "prev") {
        throw new DataError();
      }
    }
    if (this._request) {
      this._request.readyState = "pending";
    }
    transaction._execRequestAsync({
      operation: this._iterate.bind(this, key, primaryKey),
      request: this._request,
      source: this.source
    });
    this._gotValue = false;
  }
  delete() {
    const effectiveObjectStore = getEffectiveObjectStore(this);
    const effectiveKey = Object.hasOwn(this.source, "_rawIndex") ? this.primaryKey : this._position;
    const transaction = effectiveObjectStore.transaction;
    if (transaction._state !== "active") {
      throw new TransactionInactiveError();
    }
    if (transaction.mode === "readonly") {
      throw new ReadOnlyError();
    }
    if (effectiveObjectStore._rawObjectStore.deleted) {
      throw new InvalidStateError();
    }
    if (!(this.source instanceof FDBObjectStore) && this.source._rawIndex.deleted) {
      throw new InvalidStateError();
    }
    if (!this._gotValue || !Object.hasOwn(this, "value")) {
      throw new InvalidStateError();
    }
    return transaction._execRequestAsync({
      operation: effectiveObjectStore._rawObjectStore.deleteRecord.bind(effectiveObjectStore._rawObjectStore, effectiveKey, transaction._rollbackLog),
      source: this
    });
  }
  get [Symbol.toStringTag]() {
    return "IDBCursor";
  }
}class FDBCursorWithValue extends FDBCursor {
  value = undefined;
  constructor(source, range, direction, request) {
    super(source, range, direction, request);
  }
  get [Symbol.toStringTag]() {
    return "IDBCursorWithValue";
  }
}const stopped = (event, listener) => {
  return event.immediatePropagationStopped || event.eventPhase === event.CAPTURING_PHASE && listener.capture === false || event.eventPhase === event.BUBBLING_PHASE && listener.capture === true;
};

// http://www.w3.org/TR/dom/#concept-event-listener-invoke
const invokeEventListeners = (event, obj) => {
  event.currentTarget = obj;
  const errors = [];
  const invoke = callbackOrObject => {
    try {
      const callback = typeof callbackOrObject === "function" ? callbackOrObject : callbackOrObject.handleEvent;
      // @ts-expect-error EventCallback's types are not quite right here
      callback.call(event.currentTarget, event);
    } catch (err) {
      errors.push(err);
    }
  };

  // The callback might cause obj.listeners to mutate as we traverse it.
  // Take a copy of the array so that nothing sneaks in and we don't lose
  // our place.
  for (const listener of obj.listeners.slice()) {
    if (event.type !== listener.type || stopped(event, listener)) {
      continue;
    }
    invoke(listener.callback);
  }
  const typeToProp = {
    abort: "onabort",
    blocked: "onblocked",
    close: "onclose",
    complete: "oncomplete",
    error: "onerror",
    success: "onsuccess",
    upgradeneeded: "onupgradeneeded",
    versionchange: "onversionchange"
  };
  const prop = typeToProp[event.type];
  if (prop === undefined) {
    throw new Error(`Unknown event type: "${event.type}"`);
  }
  const callback = event.currentTarget[prop];
  if (callback) {
    const listener = {
      callback,
      capture: false,
      type: event.type
    };
    if (!stopped(event, listener)) {
      invoke(listener.callback);
    }
  }

  // we want to execute all listeners before deciding if we want to throw, because there could be an error thrown by
  // the first listener, but the second should still be invoked
  if (errors.length) {
    throw new AggregateError(errors);
  }
};
class FakeEventTarget {
  listeners = [];

  // These will be overridden in individual subclasses and made not readonly

  addEventListener(type, callback, options) {
    const capture = !!(typeof options === "object" && options ? options.capture : options);
    this.listeners.push({
      callback,
      capture,
      type
    });
  }
  removeEventListener(type, callback, options) {
    const capture = !!(typeof options === "object" && options ? options.capture : options);
    const i = this.listeners.findIndex(listener => {
      return listener.type === type && listener.callback === callback && listener.capture === capture;
    });
    this.listeners.splice(i, 1);
  }

  // http://www.w3.org/TR/dom/#dispatching-events
  dispatchEvent(event) {
    if (event.dispatched || !event.initialized) {
      throw new InvalidStateError("The object is in an invalid state.");
    }
    event.isTrusted = false;
    event.dispatched = true;
    event.target = this;
    // NOT SURE WHEN THIS SHOULD BE SET        event.eventPath = [];

    event.eventPhase = event.CAPTURING_PHASE;
    for (const obj of event.eventPath) {
      if (!event.propagationStopped) {
        invokeEventListeners(event, obj);
      }
    }
    event.eventPhase = event.AT_TARGET;
    if (!event.propagationStopped) {
      invokeEventListeners(event, event.target);
    }
    if (event.bubbles) {
      event.eventPath.reverse();
      event.eventPhase = event.BUBBLING_PHASE;
      for (const obj of event.eventPath) {
        if (!event.propagationStopped) {
          invokeEventListeners(event, obj);
        }
      }
    }
    event.dispatched = false;
    event.eventPhase = event.NONE;
    event.currentTarget = null;
    if (event.canceled) {
      return false;
    }
    return true;
  }
}class FDBRequest extends FakeEventTarget {
  _result = null;
  _error = null;
  source = null;
  transaction = null;
  readyState = "pending";
  onsuccess = null;
  onerror = null;
  get error() {
    if (this.readyState === "pending") {
      throw new InvalidStateError();
    }
    return this._error;
  }
  set error(value) {
    this._error = value;
  }
  get result() {
    if (this.readyState === "pending") {
      throw new InvalidStateError();
    }
    return this._result;
  }
  set result(value) {
    this._result = value;
  }
  get [Symbol.toStringTag]() {
    return "IDBRequest";
  }
}class FakeDOMStringList {
  constructor(...values) {
    this._values = values;
    for (let i = 0; i < values.length; i++) {
      this[i] = values[i];
    }
  }
  contains(value) {
    return this._values.includes(value);
  }
  item(i) {
    if (i < 0 || i >= this._values.length) {
      return null;
    }
    return this._values[i];
  }
  get length() {
    return this._values.length;
  }
  [Symbol.iterator]() {
    return this._values[Symbol.iterator]();
  }

  // Handled by proxy

  // Used internally, should not be used by others. I could maybe get rid of these and replace rather than mutate, but too lazy to check the spec.
  _push(...values) {
    for (let i = 0; i < values.length; i++) {
      this[this._values.length + i] = values[i];
    }
    this._values.push(...values);
  }
  _sort(...values) {
    this._values.sort(...values);
    for (let i = 0; i < this._values.length; i++) {
      this[i] = this._values[i];
    }
    return this;
  }
}// http://w3c.github.io/IndexedDB/#convert-a-value-to-a-key-range
const valueToKeyRange = (value, nullDisallowedFlag = false) => {
  if (value instanceof FDBKeyRange) {
    return value;
  }
  if (value === null || value === undefined) {
    if (nullDisallowedFlag) {
      throw new DataError();
    }
    return new FDBKeyRange(undefined, undefined, false, false);
  }
  const key = valueToKey(value);
  return FDBKeyRange.only(key);
};// Keys provided as functions or arrays or objects need to be stringified
const convertKey = key => typeof key === 'object' && key ? key + '' : key;

// https://www.w3.org/TR/IndexedDB/#dom-idbobjectstore-keypath
function getKeyPath(keyPath) {
  // It's important to clone the Array here because of the WPT test:
  // "Different instances are returned from different store instances."
  // Also note that the same instance must be returned across multiple gets
  return Array.isArray(keyPath) ? keyPath.map(convertKey) : convertKey(keyPath);
}// https://www.w3.org/TR/IndexedDB/#is-a-potentially-valid-key-range
const isPotentiallyValidKeyRange = value => {
  // If value is a key range, return true.
  if (value instanceof FDBKeyRange) {
    return true;
  }

  // Let key be the result of converting a value to a key with value.
  const key = valueToKeyWithoutThrowing(value);

  // If key is "invalid type" return false.
  // Else return true.
  return key !== INVALID_TYPE;
};// https://heycam.github.io/webidl/#EnforceRange

const enforceRange = (num, type) => {
  const min = 0;
  const max = type === "unsigned long" ? 4294967295 : 9007199254740991;
  if (isNaN(num) || num < min || num > max) {
    throw new TypeError();
  }
  if (num >= 0) {
    return Math.floor(num);
  }
};// https://www.w3.org/TR/IndexedDB/#create-request-to-retrieve-multiple-items
const extractGetAllOptions = (queryOrOptions, count, numArguments) => {
  let query;
  let direction;
  if (queryOrOptions === undefined || queryOrOptions === null || isPotentiallyValidKeyRange(queryOrOptions)) {
    // queryOrOptions is FDBKeyRange | Key | null | undefined
    query = queryOrOptions;
    if (numArguments > 1 && count !== undefined) {
      count = enforceRange(count, "unsigned long");
    }
  } else {
    // queryOrOptions is FDBGetAllOptions
    const getAllOptions = queryOrOptions;
    if (getAllOptions.query !== undefined) {
      query = getAllOptions.query;
    }
    if (getAllOptions.count !== undefined) {
      count = enforceRange(getAllOptions.count, "unsigned long");
    }
    if (getAllOptions.direction !== undefined) {
      direction = getAllOptions.direction;
    }
  }
  return {
    query,
    count,
    direction
  };
};const confirmActiveTransaction$1 = index => {
  if (index._rawIndex.deleted || index.objectStore._rawObjectStore.deleted) {
    throw new InvalidStateError();
  }
  if (index.objectStore.transaction._state !== "active") {
    throw new TransactionInactiveError();
  }
};

// http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#idl-def-IDBIndex
class FDBIndex {
  constructor(objectStore, rawIndex) {
    this._rawIndex = rawIndex;
    this._name = rawIndex.name;
    this.objectStore = objectStore;
    this.keyPath = getKeyPath(rawIndex.keyPath);
    this.multiEntry = rawIndex.multiEntry;
    this.unique = rawIndex.unique;
  }
  get name() {
    return this._name;
  }

  // https://w3c.github.io/IndexedDB/#dom-idbindex-name
  set name(name) {
    const transaction = this.objectStore.transaction;
    if (!transaction.db._runningVersionchangeTransaction) {
      throw transaction._state === "active" ? new InvalidStateError() : new TransactionInactiveError();
    }
    if (transaction._state !== "active") {
      throw new TransactionInactiveError();
    }
    if (this._rawIndex.deleted || this.objectStore._rawObjectStore.deleted) {
      throw new InvalidStateError();
    }
    name = String(name);
    if (name === this._name) {
      return;
    }
    if (this.objectStore.indexNames.contains(name)) {
      throw new ConstraintError();
    }
    const oldName = this._name;
    const oldIndexNames = [...this.objectStore.indexNames];
    this._name = name;
    this._rawIndex.name = name;
    this.objectStore._indexesCache.delete(oldName);
    this.objectStore._indexesCache.set(name, this);
    this.objectStore._rawObjectStore.rawIndexes.delete(oldName);
    this.objectStore._rawObjectStore.rawIndexes.set(name, this._rawIndex);
    this.objectStore.indexNames = new FakeDOMStringList(...Array.from(this.objectStore._rawObjectStore.rawIndexes.keys()).filter(indexName => {
      const index = this.objectStore._rawObjectStore.rawIndexes.get(indexName);
      return index && !index.deleted;
    }).sort());

    // https://www.w3.org/TR/IndexedDB/#abort-an-upgrade-transaction - "If handle’s index was not newly created during transaction, set handle’s name to its index’s name."
    if (!this.objectStore.transaction._createdIndexes.has(this._rawIndex)) {
      transaction._rollbackLog.push(() => {
        this._name = oldName;
        this._rawIndex.name = oldName;
        this.objectStore._indexesCache.delete(name);
        this.objectStore._indexesCache.set(oldName, this);
        this.objectStore._rawObjectStore.rawIndexes.delete(name);
        this.objectStore._rawObjectStore.rawIndexes.set(oldName, this._rawIndex);
        this.objectStore.indexNames = new FakeDOMStringList(...oldIndexNames);
      });
    }
  }

  // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#widl-IDBIndex-openCursor-IDBRequest-any-range-IDBCursorDirection-direction
  openCursor(range, direction) {
    confirmActiveTransaction$1(this);
    if (range === null) {
      range = undefined;
    }
    if (range !== undefined && !(range instanceof FDBKeyRange)) {
      range = FDBKeyRange.only(valueToKey(range));
    }
    const request = new FDBRequest();
    request.source = this;
    request.transaction = this.objectStore.transaction;
    const cursor = new FDBCursorWithValue(this, range, direction, request);
    return this.objectStore.transaction._execRequestAsync({
      operation: cursor._iterate.bind(cursor),
      request,
      source: this
    });
  }

  // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#widl-IDBIndex-openKeyCursor-IDBRequest-any-range-IDBCursorDirection-direction
  openKeyCursor(range, direction) {
    confirmActiveTransaction$1(this);
    if (range === null) {
      range = undefined;
    }
    if (range !== undefined && !(range instanceof FDBKeyRange)) {
      range = FDBKeyRange.only(valueToKey(range));
    }
    const request = new FDBRequest();
    request.source = this;
    request.transaction = this.objectStore.transaction;
    const cursor = new FDBCursor(this, range, direction, request, true);
    return this.objectStore.transaction._execRequestAsync({
      operation: cursor._iterate.bind(cursor),
      request,
      source: this
    });
  }
  get(key) {
    confirmActiveTransaction$1(this);
    if (!(key instanceof FDBKeyRange)) {
      key = valueToKey(key);
    }
    return this.objectStore.transaction._execRequestAsync({
      operation: this._rawIndex.getValue.bind(this._rawIndex, key),
      source: this
    });
  }

  // http://w3c.github.io/IndexedDB/#dom-idbindex-getall
  getAll(queryOrOptions, count) {
    const options = extractGetAllOptions(queryOrOptions, count, arguments.length);
    confirmActiveTransaction$1(this);
    const range = valueToKeyRange(options.query);
    return this.objectStore.transaction._execRequestAsync({
      operation: this._rawIndex.getAllValues.bind(this._rawIndex, range, options.count, options.direction),
      source: this
    });
  }

  // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#widl-IDBIndex-getKey-IDBRequest-any-key
  getKey(key) {
    confirmActiveTransaction$1(this);
    if (!(key instanceof FDBKeyRange)) {
      key = valueToKey(key);
    }
    return this.objectStore.transaction._execRequestAsync({
      operation: this._rawIndex.getKey.bind(this._rawIndex, key),
      source: this
    });
  }

  // http://w3c.github.io/IndexedDB/#dom-idbindex-getallkeys
  getAllKeys(queryOrOptions, count) {
    const options = extractGetAllOptions(queryOrOptions, count, arguments.length);
    confirmActiveTransaction$1(this);
    const range = valueToKeyRange(options.query);
    return this.objectStore.transaction._execRequestAsync({
      operation: this._rawIndex.getAllKeys.bind(this._rawIndex, range, options.count, options.direction),
      source: this
    });
  }

  // https://www.w3.org/TR/IndexedDB/#dom-idbobjectstore-getallrecords
  getAllRecords(options) {
    let query;
    let count;
    let direction;
    if (options !== undefined) {
      if (options.query !== undefined) {
        query = options.query;
      }
      if (options.count !== undefined) {
        count = enforceRange(options.count, "unsigned long");
      }
      if (options.direction !== undefined) {
        direction = options.direction;
      }
    }
    confirmActiveTransaction$1(this);
    const range = valueToKeyRange(query);
    return this.objectStore.transaction._execRequestAsync({
      operation: this._rawIndex.getAllRecords.bind(this._rawIndex, range, count, direction),
      source: this
    });
  }

  // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#widl-IDBIndex-count-IDBRequest-any-key
  count(key) {
    confirmActiveTransaction$1(this);
    if (key === null) {
      key = undefined;
    }
    if (key !== undefined && !(key instanceof FDBKeyRange)) {
      key = FDBKeyRange.only(valueToKey(key));
    }
    return this.objectStore.transaction._execRequestAsync({
      operation: () => {
        return this._rawIndex.count(key);
      },
      source: this
    });
  }
  get [Symbol.toStringTag]() {
    return "IDBIndex";
  }
}// http://w3c.github.io/IndexedDB/#check-that-a-key-could-be-injected-into-a-value
const canInjectKey = (keyPath, value) => {
  if (Array.isArray(keyPath)) {
    throw new Error("The key paths used in this section are always strings and never sequences, since it is not possible to create a object store which has a key generator and also has a key path that is a sequence.");
  }
  const identifiers = keyPath.split(".");
  if (identifiers.length === 0) {
    throw new Error("Assert: identifiers is not empty");
  }
  identifiers.pop();
  for (const identifier of identifiers) {
    if (typeof value !== "object" && !Array.isArray(value)) {
      return false;
    }
    const hop = Object.hasOwn(value, identifier);
    if (!hop) {
      return true;
    }
    value = value[identifier];
  }
  return typeof value === "object" || Array.isArray(value);
};class FDBRecord {
  constructor(key, primaryKey, value) {
    this._key = key;
    this._primaryKey = primaryKey;
    this._value = value;
  }
  get key() {
    return this._key;
  }
  set key(_) {
    /* for babel */
  }
  get primaryKey() {
    return this._primaryKey;
  }
  set primaryKey(_) {
    /* for babel */
  }
  get value() {
    return this._value;
  }
  set value(_) {
    /* for babel */
  }
  get [Symbol.toStringTag]() {
    return "IDBRecord";
  }
}// what fraction of the total number of nodes are allowed to be deleted tombstones?
const MAX_TOMBSTONE_FACTOR = 2 / 3;
const EVERYTHING_KEY_RANGE = new FDBKeyRange(undefined, undefined, false, false);
/**
 * Simple red-black binary tree with some aspects of a scapegoat tree. The main goal here is simplicity of
 * implementation, tailored to the needs of IndexedDB.
 *
 * Basically this implements a [red-black tree][1] for insertions, but uses the much simpler [scapegoat tree][2]
 * strategy for deletions. Deletions are a simple matter of rebuilding the tree from scratch if more than 2/3 of the
 * tree is full of deleted (tombstone) markers.
 *
 * [1]: https://en.wikipedia.org/wiki/Red%E2%80%93black_tree
 * [2]: https://en.wikipedia.org/wiki/Scapegoat_tree
 */
class BinarySearchTree {
  _numTombstones = 0;
  _numNodes = 0;

  /**
   *
   * @param keysAreUnique - whether keys can be unique, and thus whether we cn skip checking `record.value` when
   * comparing. This is basically used to distinguish ObjectStores (where the value is the entire object, not used
   * as a key) from non-unique Indexes (where both the key and the value are meaningful keys used for sorting)
   */
  constructor(keysAreUnique) {
    this._keysAreUnique = !!keysAreUnique;
  }
  size() {
    return this._numNodes - this._numTombstones;
  }
  get(record) {
    return this._getByComparator(this._root, otherRecord => this._compare(record, otherRecord));
  }
  contains(record) {
    return !!this.get(record);
  }
  _compare(a, b) {
    const keyComparison = cmp(a.key, b.key);
    if (keyComparison !== 0) {
      return keyComparison;
    }
    // if keys are unique, then we can (and must) avoid comparing the values, since they may be non-comparable
    // (e.g. in the case of an ObjectStore, they are record objects)
    return this._keysAreUnique ? 0 : cmp(a.value, b.value);
  }
  _getByComparator(node, comparator) {
    let current = node;
    while (current) {
      const comparison = comparator(current.record);
      if (comparison < 0) {
        current = current.left;
      } else if (comparison > 0) {
        current = current.right;
      } else {
        return current.record;
      }
    }
  }

  /**
   * Put a new record, and return the overwritten record if an overwrite occurred.
   * @param record
   * @param noOverwrite - throw a ConstraintError in case of overwrite
   */
  put(record, noOverwrite = false) {
    if (!this._root) {
      this._root = {
        record,
        left: undefined,
        right: undefined,
        parent: undefined,
        deleted: false,
        // the root is always black in a red-black tree
        red: false
      };
      this._numNodes++;
      return;
    }
    return this._put(this._root, record, noOverwrite);
  }
  _put(node, record, noOverwrite) {
    const comparison = this._compare(record, node.record);
    if (comparison < 0) {
      if (node.left) {
        return this._put(node.left, record, noOverwrite);
      } else {
        node.left = {
          record,
          left: undefined,
          right: undefined,
          parent: node,
          deleted: false,
          red: true
        };
        this._onNewNodeInserted(node.left);
      }
    } else if (comparison > 0) {
      if (node.right) {
        return this._put(node.right, record, noOverwrite);
      } else {
        node.right = {
          record,
          left: undefined,
          right: undefined,
          parent: node,
          deleted: false,
          red: true
        };
        this._onNewNodeInserted(node.right);
      }
    } else if (node.deleted) {
      // undelete
      node.deleted = false;
      node.record = record;
      this._numTombstones--;
    } else if (noOverwrite) {
      // replace not allowed in case of noOverwrite
      throw new ConstraintError();
    } else {
      // replace, don't add, so no need to increment. return the overwritten record
      const overwrittenRecord = node.record;
      node.record = record;
      return overwrittenRecord;
    }
  }
  delete(record) {
    if (!this._root) {
      return;
    }
    this._delete(this._root, record);
    if (this._numTombstones > this._numNodes * MAX_TOMBSTONE_FACTOR) {
      // to keep the implementation simple, and because most users of fake-indexeddb are not going to be deleting
      // a lot of nodes, just rebuild the whole tree (defragment) if the tree is too full of tombstones,
      // as inspired by the scapegoat tree: https://en.wikipedia.org/wiki/Scapegoat_tree#Deletion
      const records = [...this.getAllRecords()];
      this._root = this._rebuild(records, undefined, false);
      this._numNodes = records.length;
      this._numTombstones = 0;
    }
  }
  _delete(node, record) {
    if (!node) {
      return;
    }
    const comparison = this._compare(record, node.record);
    if (comparison < 0) {
      this._delete(node.left, record);
    } else if (comparison > 0) {
      this._delete(node.right, record);
    } else if (!node.deleted) {
      this._numTombstones++;
      node.deleted = true;
    }
  }
  *getAllRecords(descending = false) {
    yield* this.getRecords(EVERYTHING_KEY_RANGE, descending);
  }
  *getRecords(keyRange, descending = false) {
    yield* this._getRecordsForNode(this._root, keyRange, descending);
  }
  *_getRecordsForNode(node, keyRange, descending = false) {
    if (!node) {
      return;
    }
    yield* this._findRecords(node, keyRange, descending);
  }
  *_findRecords(node, keyRange, descending = false) {
    const {
      lower,
      upper,
      lowerOpen,
      upperOpen
    } = keyRange;
    const {
      record: {
        key
      }
    } = node;
    const lowerComparison = lower === undefined ? -1 : cmp(lower, key);
    const upperComparison = upper === undefined ? 1 : cmp(upper, key);

    // if keys are non-unique then we need to go left/right even for equality
    // else we can just do LT/GT rather than LTE/GTE as a slight optimization
    const moreLeft = this._keysAreUnique ? lowerComparison < 0 : lowerComparison <= 0;
    const moreRight = this._keysAreUnique ? upperComparison > 0 : upperComparison >= 0;

    // in descending mode we start with rightmost nodes, else leftmost
    const moreStart = descending ? moreRight : moreLeft;
    const moreEnd = descending ? moreLeft : moreRight;
    const start = descending ? "right" : "left";
    const end = descending ? "left" : "right";

    // does the current record actually match the key range?
    const lowerMatches = lowerOpen ? lowerComparison < 0 : lowerComparison <= 0;
    const upperMatches = upperOpen ? upperComparison > 0 : upperComparison >= 0;
    if (moreStart && node[start]) {
      yield* this._findRecords(node[start], keyRange, descending);
    }
    if (lowerMatches && upperMatches && !node.deleted) {
      yield node.record;
    }
    if (moreEnd && node[end]) {
      yield* this._findRecords(node[end], keyRange, descending);
    }
  }
  _onNewNodeInserted(newNode) {
    this._numNodes++;
    this._rebalanceTree(newNode);
  }

  // based on https://en.wikipedia.org/wiki/Red%E2%80%93black_tree#Insertion
  _rebalanceTree(node) {
    let parent = node.parent;
    do {
      // case 1 -  no red/black violation
      if (!parent.red) {
        return;
      }
      const grandparent = parent.parent;
      if (!grandparent) {
        // case #4 - parent is the red root, node is also red, so parent goes black
        parent.red = false;
        return;
      }
      const parentIsRightChild = parent === grandparent.right;
      const uncle = parentIsRightChild ? grandparent.left : grandparent.right;
      if (!uncle || !uncle.red) {
        if (node === (parentIsRightChild ? parent.left : parent.right)) {
          // case #5 - parent is red but uncle is black
          this._rotateSubtree(parent, parentIsRightChild);
          node = parent;
          parent = parentIsRightChild ? grandparent.right : grandparent.left;
        }

        // case #6 - node is "outer" grandchild of grandparent
        this._rotateSubtree(grandparent, !parentIsRightChild);
        parent.red = false;
        grandparent.red = true;
        return;
      }

      // case #2 - parent and uncle are both red, so both of them go black and grandparent goes red
      parent.red = false;
      uncle.red = false;
      grandparent.red = true;
      node = grandparent;
    } while (node.parent ? parent = node.parent : false);

    // case #3 - current node is the root, all constraints satisfied
  }

  // based on https://en.wikipedia.org/wiki/Red%E2%80%93black_tree#Implementation
  _rotateSubtree(node, right) {
    const parent = node.parent;
    const newRoot = right ? node.left : node.right; // opposite direction
    const newChild = right ? newRoot.right : newRoot.left;
    node[right ? "left" : "right"] = newChild;
    if (newChild) {
      newChild.parent = node;
    }
    newRoot[right ? "right" : "left"] = node;
    newRoot.parent = parent;
    node.parent = newRoot;
    if (parent) {
      parent[node === parent.right ? "right" : "left"] = newRoot;
    } else {
      this._root = newRoot;
    }
    return newRoot;
  }

  // rebuild the whole tree from scratch, used to avoid too many deletion tombstones accumulating
  _rebuild(records, parent, red) {
    const {
      length
    } = records;
    if (!length) {
      return undefined;
    }
    const mid = length >>> 1; // like Math.floor(records.length / 2) but fast

    const node = {
      record: records[mid],
      left: undefined,
      right: undefined,
      parent,
      deleted: false,
      red
    };
    const left = this._rebuild(records.slice(0, mid), node, !red);
    const right = this._rebuild(records.slice(mid + 1), node, !red);
    node.left = left;
    node.right = right;
    return node;
  }
}class RecordStore {
  constructor(keysAreUnique) {
    this.keysAreUnique = keysAreUnique;
    this.records = new BinarySearchTree(this.keysAreUnique);
  }
  get(key) {
    const range = key instanceof FDBKeyRange ? key : FDBKeyRange.only(key);
    return this.records.getRecords(range).next().value;
  }

  /**
   * Put a new record, and return the overwritten record if an overwrite occurred.
   * @param newRecord
   * @param noOverwrite - throw a ConstraintError in case of overwrite
   */
  put(newRecord, noOverwrite = false) {
    return this.records.put(newRecord, noOverwrite);
  }
  delete(key) {
    const range = key instanceof FDBKeyRange ? key : FDBKeyRange.only(key);
    const deletedRecords = [...this.records.getRecords(range)];
    for (const record of deletedRecords) {
      this.records.delete(record);
    }
    return deletedRecords;
  }
  deleteByValue(key) {
    const range = key instanceof FDBKeyRange ? key : FDBKeyRange.only(key);
    const deletedRecords = [];
    for (const record of this.records.getAllRecords()) {
      if (range.includes(record.value)) {
        this.records.delete(record);
        deletedRecords.push(record);
      }
    }
    return deletedRecords;
  }
  clear() {
    const deletedRecords = [...this.records.getAllRecords()];
    this.records = new BinarySearchTree(this.keysAreUnique);
    return deletedRecords;
  }
  values(range, direction = "next") {
    const descending = direction === "prev" || direction === "prevunique";
    const records = range ? this.records.getRecords(range, descending) : this.records.getAllRecords(descending);
    return {
      [Symbol.iterator]: () => {
        const next = () => {
          return records.next();
        };
        if (direction === "next" || direction === "prev") {
          return {
            next
          };
        }

        // For nextunique/prevunique, return an iterator that skips seen values
        // Note that we must return the _lowest_ value regardless of direction:
        // > Iterating with "prevunique" visits the same records that "nextunique"
        // > visits, but in reverse order.
        // https://w3c.github.io/IndexedDB/#dom-idbcursordirection-prevunique
        if (direction === "nextunique") {
          let previousValue = undefined;
          return {
            next: () => {
              let current = next();
              // for nextunique, continue if we already emitted the lowest unique value
              while (!current.done && previousValue !== undefined && cmp(previousValue.key, current.value.key) === 0) {
                current = next();
              }
              previousValue = current.value;
              return current;
            }
          };
        }

        // prevunique is a bit more complex due to needing to check the next value, which
        // invokes the iterable, so we need to keep a buffer of one "lookahead" result
        let current = next();
        let nextResult = next();
        return {
          next: () => {
            while (!nextResult.done && cmp(current.value.key, nextResult.value.key) === 0) {
              // note we return the _lowest_ possible value, hence set the current
              current = nextResult;
              nextResult = next();
            }
            const result = current;
            current = nextResult;
            nextResult = next();
            return result;
          }
        };
      }
    };
  }
  size() {
    return this.records.size();
  }
}// http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#dfn-index
class Index {
  deleted = false;
  // Initialized should be used to decide whether to throw an error or abort the versionchange transaction when there is a
  // constraint
  initialized = false;
  constructor(rawObjectStore, name, keyPath, multiEntry, unique) {
    this.rawObjectStore = rawObjectStore;
    this.name = name;
    this.keyPath = keyPath;
    this.multiEntry = multiEntry;
    this.unique = unique;
    this.records = new RecordStore(unique);
  }

  // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#dfn-steps-for-retrieving-a-value-from-an-index
  getKey(key) {
    const record = this.records.get(key);
    return record !== undefined ? record.value : undefined;
  }

  // http://w3c.github.io/IndexedDB/#retrieve-multiple-referenced-values-from-an-index
  getAllKeys(range, count, direction) {
    if (count === undefined || count === 0) {
      count = Infinity;
    }
    const records = [];
    for (const record of this.records.values(range, direction)) {
      records.push(structuredClone(record.value));
      if (records.length >= count) {
        break;
      }
    }
    return records;
  }

  // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#index-referenced-value-retrieval-operation
  getValue(key) {
    const record = this.records.get(key);
    return record !== undefined ? this.rawObjectStore.getValue(record.value) : undefined;
  }

  // http://w3c.github.io/IndexedDB/#retrieve-multiple-referenced-values-from-an-index
  getAllValues(range, count, direction) {
    if (count === undefined || count === 0) {
      count = Infinity;
    }
    const records = [];
    for (const record of this.records.values(range, direction)) {
      records.push(this.rawObjectStore.getValue(record.value));
      if (records.length >= count) {
        break;
      }
    }
    return records;
  }

  // https://www.w3.org/TR/IndexedDB/#dom-idbindex-getallrecords
  getAllRecords(range, count, direction) {
    if (count === undefined || count === 0) {
      count = Infinity;
    }
    const records = [];
    for (const record of this.records.values(range, direction)) {
      records.push(new FDBRecord(structuredClone(record.key), structuredClone(this.rawObjectStore.getKey(record.value)), this.rawObjectStore.getValue(record.value)));
      if (records.length >= count) {
        break;
      }
    }
    return records;
  }

  // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#dfn-steps-for-storing-a-record-into-an-object-store (step 7)
  storeRecord(newRecord) {
    let indexKey;
    try {
      indexKey = extractKey(this.keyPath, newRecord.value).key;
    } catch (err) {
      if (err.name === "DataError") {
        // Invalid key is not an actual error, just means we do not store an entry in this index
        return;
      }
      throw err;
    }
    if (!this.multiEntry || !Array.isArray(indexKey)) {
      try {
        valueToKey(indexKey);
      } catch (e) {
        return;
      }
    } else {
      // remove any elements from index key that are not valid keys and remove any duplicate elements from index
      // key such that only one instance of the duplicate value remains.
      const keep = [];
      for (const part of indexKey) {
        if (keep.indexOf(part) < 0) {
          try {
            keep.push(valueToKey(part));
          } catch (err) {
            /* Do nothing */
          }
        }
      }
      indexKey = keep;
    }
    if (!this.multiEntry || !Array.isArray(indexKey)) {
      if (this.unique) {
        const existingRecord = this.records.get(indexKey);
        if (existingRecord) {
          throw new ConstraintError();
        }
      }
    } else {
      if (this.unique) {
        for (const individualIndexKey of indexKey) {
          const existingRecord = this.records.get(individualIndexKey);
          if (existingRecord) {
            throw new ConstraintError();
          }
        }
      }
    }
    if (!this.multiEntry || !Array.isArray(indexKey)) {
      this.records.put({
        key: indexKey,
        value: newRecord.key
      });
    } else {
      for (const individualIndexKey of indexKey) {
        this.records.put({
          key: individualIndexKey,
          value: newRecord.key
        });
      }
    }
  }
  initialize(transaction) {
    if (this.initialized) {
      throw new Error("Index already initialized");
    }
    transaction._execRequestAsync({
      operation: () => {
        try {
          // Create index based on current value of objectstore
          for (const record of this.rawObjectStore.records.values()) {
            this.storeRecord(record);
          }
          this.initialized = true;
        } catch (err) {
          // console.error(err);
          transaction._abort(err.name);
        }
      },
      source: null
    });
  }
  count(range) {
    let count = 0;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const record of this.records.values(range)) {
      count += 1;
    }
    return count;
  }
}// http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#dfn-valid-key-path
const validateKeyPath = (keyPath, parent) => {
  // This doesn't make sense to me based on the spec, but it is needed to pass the W3C KeyPath tests (see same
  // comment in extractKey)
  if (keyPath !== undefined && keyPath !== null && typeof keyPath !== "string" && keyPath.toString && (parent === "array" || !Array.isArray(keyPath))) {
    keyPath = keyPath.toString();
  }
  if (typeof keyPath === "string") {
    if (keyPath === "" && parent !== "string") {
      return;
    }
    try {
      // https://mathiasbynens.be/demo/javascript-identifier-regex for ECMAScript 5.1 / Unicode v7.0.0, with
      // reserved words at beginning removed
      const validIdentifierRegex =
      // eslint-disable-next-line no-misleading-character-class
      /^(?:[$A-Z_a-z\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0-\u08B2\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA7AD\uA7B0\uA7B1\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB5F\uAB64\uAB65\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC])(?:[$0-9A-Z_a-z\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u0487\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05F0-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u0800-\u082D\u0840-\u085B\u08A0-\u08B2\u08E4-\u0963\u0966-\u096F\u0971-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BEF\u0C00-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58\u0C59\u0C60-\u0C63\u0C66-\u0C6F\u0C81-\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2\u0D01-\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D57\u0D60-\u0D63\u0D66-\u0D6F\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1820-\u1877\u1880-\u18AA\u18B0-\u18F5\u1900-\u191E\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19D9\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1AB0-\u1ABD\u1B00-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1CD0-\u1CD2\u1CD4-\u1CF6\u1CF8\u1CF9\u1D00-\u1DF5\u1DFC-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u200C\u200D\u203F\u2040\u2054\u2071\u207F\u2090-\u209C\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u2E2F\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099\u309A\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66F\uA674-\uA67D\uA67F-\uA69D\uA69F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA7AD\uA7B0\uA7B1\uA7F7-\uA827\uA840-\uA873\uA880-\uA8C4\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA900-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-\uA9D9\uA9E0-\uA9FE\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB5F\uAB64\uAB65\uABC0-\uABEA\uABEC\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE2D\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC])*$/;
      if (keyPath.length >= 1 && validIdentifierRegex.test(keyPath)) {
        return;
      }
    } catch (err) {
      throw new SyntaxError(err.message);
    }
    if (keyPath.indexOf(" ") >= 0) {
      throw new SyntaxError("The keypath argument contains an invalid key path (no spaces allowed).");
    }
  }
  if (Array.isArray(keyPath) && keyPath.length > 0) {
    if (parent) {
      // No nested arrays
      throw new SyntaxError("The keypath argument contains an invalid key path (nested arrays).");
    }
    for (const part of keyPath) {
      validateKeyPath(part, "array");
    }
    return;
  } else if (typeof keyPath === "string" && keyPath.indexOf(".") >= 0) {
    keyPath = keyPath.split(".");
    for (const part of keyPath) {
      validateKeyPath(part, "string");
    }
    return;
  }
  throw new SyntaxError();
};const confirmActiveTransaction = objectStore => {
  if (objectStore._rawObjectStore.deleted) {
    throw new InvalidStateError();
  }
  if (objectStore.transaction._state !== "active") {
    throw new TransactionInactiveError();
  }
};
const buildRecordAddPut = (objectStore, value, key) => {
  confirmActiveTransaction(objectStore);
  if (objectStore.transaction.mode === "readonly") {
    throw new ReadOnlyError();
  }
  if (objectStore.keyPath !== null) {
    if (key !== undefined) {
      throw new DataError();
    }
  }
  const clone = cloneValueForInsertion(value, objectStore.transaction);
  if (objectStore.keyPath !== null) {
    const tempKey = extractKey(objectStore.keyPath, clone);
    if (tempKey.type === "found") {
      valueToKey(tempKey.key);
    } else {
      if (!objectStore._rawObjectStore.keyGenerator) {
        throw new DataError();
      } else if (!canInjectKey(objectStore.keyPath, clone)) {
        throw new DataError();
      }
    }
  }
  if (objectStore.keyPath === null && objectStore._rawObjectStore.keyGenerator === null && key === undefined) {
    throw new DataError();
  }
  if (key !== undefined) {
    key = valueToKey(key);
  }
  return {
    key,
    value: clone
  };
};

// http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#object-store
class FDBObjectStore {
  _indexesCache = new Map();
  constructor(transaction, rawObjectStore) {
    this._rawObjectStore = rawObjectStore;
    this._name = rawObjectStore.name;
    this.keyPath = getKeyPath(rawObjectStore.keyPath);
    this.autoIncrement = rawObjectStore.autoIncrement;
    this.transaction = transaction;
    this.indexNames = new FakeDOMStringList(...Array.from(rawObjectStore.rawIndexes.keys()).sort());
  }
  get name() {
    return this._name;
  }

  // http://w3c.github.io/IndexedDB/#dom-idbobjectstore-name
  set name(name) {
    const transaction = this.transaction;
    if (!transaction.db._runningVersionchangeTransaction) {
      throw transaction._state === "active" ? new InvalidStateError() : new TransactionInactiveError();
    }
    confirmActiveTransaction(this);
    name = String(name);
    if (name === this._name) {
      return;
    }
    if (this._rawObjectStore.rawDatabase.rawObjectStores.has(name)) {
      throw new ConstraintError();
    }
    const oldName = this._name;
    const oldObjectStoreNames = [...transaction.db.objectStoreNames];
    this._name = name;
    this._rawObjectStore.name = name;
    this.transaction._objectStoresCache.delete(oldName);
    this.transaction._objectStoresCache.set(name, this);
    this._rawObjectStore.rawDatabase.rawObjectStores.delete(oldName);
    this._rawObjectStore.rawDatabase.rawObjectStores.set(name, this._rawObjectStore);
    transaction.db.objectStoreNames = new FakeDOMStringList(...Array.from(this._rawObjectStore.rawDatabase.rawObjectStores.keys()).filter(objectStoreName => {
      const objectStore = this._rawObjectStore.rawDatabase.rawObjectStores.get(objectStoreName);
      return objectStore && !objectStore.deleted;
    }).sort());
    const oldScope = new Set(transaction._scope);
    const oldTransactionObjectStoreNames = [...transaction.objectStoreNames];
    this.transaction._scope.delete(oldName);
    transaction._scope.add(name);
    transaction.objectStoreNames = new FakeDOMStringList(...Array.from(transaction._scope).sort());

    // https://www.w3.org/TR/IndexedDB/#abort-an-upgrade-transaction - "If handle’s object store was not newly created during transaction, set handle’s name to its object store’s name."
    if (!this.transaction._createdObjectStores.has(this._rawObjectStore)) {
      transaction._rollbackLog.push(() => {
        this._name = oldName;
        this._rawObjectStore.name = oldName;
        this.transaction._objectStoresCache.delete(name);
        this.transaction._objectStoresCache.set(oldName, this);
        this._rawObjectStore.rawDatabase.rawObjectStores.delete(name);
        this._rawObjectStore.rawDatabase.rawObjectStores.set(oldName, this._rawObjectStore);
        transaction.db.objectStoreNames = new FakeDOMStringList(...oldObjectStoreNames);
        transaction._scope = oldScope;
        transaction.objectStoreNames = new FakeDOMStringList(...oldTransactionObjectStoreNames);
      });
    }
  }
  put(value, key) {
    if (arguments.length === 0) {
      throw new TypeError();
    }
    const record = buildRecordAddPut(this, value, key);
    return this.transaction._execRequestAsync({
      operation: this._rawObjectStore.storeRecord.bind(this._rawObjectStore, record, false, this.transaction._rollbackLog),
      source: this
    });
  }
  add(value, key) {
    if (arguments.length === 0) {
      throw new TypeError();
    }
    const record = buildRecordAddPut(this, value, key);
    return this.transaction._execRequestAsync({
      operation: this._rawObjectStore.storeRecord.bind(this._rawObjectStore, record, true, this.transaction._rollbackLog),
      source: this
    });
  }
  delete(key) {
    if (arguments.length === 0) {
      throw new TypeError();
    }
    confirmActiveTransaction(this);
    if (this.transaction.mode === "readonly") {
      throw new ReadOnlyError();
    }
    if (!(key instanceof FDBKeyRange)) {
      key = valueToKey(key);
    }
    return this.transaction._execRequestAsync({
      operation: this._rawObjectStore.deleteRecord.bind(this._rawObjectStore, key, this.transaction._rollbackLog),
      source: this
    });
  }
  get(key) {
    if (arguments.length === 0) {
      throw new TypeError();
    }
    confirmActiveTransaction(this);
    if (!(key instanceof FDBKeyRange)) {
      key = valueToKey(key);
    }
    return this.transaction._execRequestAsync({
      operation: this._rawObjectStore.getValue.bind(this._rawObjectStore, key),
      source: this
    });
  }

  // http://w3c.github.io/IndexedDB/#dom-idbobjectstore-getall
  getAll(queryOrOptions, count) {
    const options = extractGetAllOptions(queryOrOptions, count, arguments.length);
    confirmActiveTransaction(this);
    const range = valueToKeyRange(options.query);
    return this.transaction._execRequestAsync({
      operation: this._rawObjectStore.getAllValues.bind(this._rawObjectStore, range, options.count, options.direction),
      source: this
    });
  }

  // http://w3c.github.io/IndexedDB/#dom-idbobjectstore-getkey
  getKey(key) {
    if (arguments.length === 0) {
      throw new TypeError();
    }
    confirmActiveTransaction(this);
    if (!(key instanceof FDBKeyRange)) {
      key = valueToKey(key);
    }
    return this.transaction._execRequestAsync({
      operation: this._rawObjectStore.getKey.bind(this._rawObjectStore, key),
      source: this
    });
  }

  // http://w3c.github.io/IndexedDB/#dom-idbobjectstore-getallkeys
  getAllKeys(queryOrOptions, count) {
    const options = extractGetAllOptions(queryOrOptions, count, arguments.length);
    confirmActiveTransaction(this);
    const range = valueToKeyRange(options.query);
    return this.transaction._execRequestAsync({
      operation: this._rawObjectStore.getAllKeys.bind(this._rawObjectStore, range, options.count, options.direction),
      source: this
    });
  }

  // https://www.w3.org/TR/IndexedDB/#dom-idbobjectstore-getallrecords
  getAllRecords(options) {
    let query;
    let count;
    let direction;
    if (options !== undefined) {
      if (options.query !== undefined) {
        query = options.query;
      }
      if (options.count !== undefined) {
        count = enforceRange(options.count, "unsigned long");
      }
      if (options.direction !== undefined) {
        direction = options.direction;
      }
    }
    confirmActiveTransaction(this);
    const range = valueToKeyRange(query);
    return this.transaction._execRequestAsync({
      operation: this._rawObjectStore.getAllRecords.bind(this._rawObjectStore, range, count, direction),
      source: this
    });
  }
  clear() {
    confirmActiveTransaction(this);
    if (this.transaction.mode === "readonly") {
      throw new ReadOnlyError();
    }
    return this.transaction._execRequestAsync({
      operation: this._rawObjectStore.clear.bind(this._rawObjectStore, this.transaction._rollbackLog),
      source: this
    });
  }
  openCursor(range, direction) {
    confirmActiveTransaction(this);
    if (range === null) {
      range = undefined;
    }
    if (range !== undefined && !(range instanceof FDBKeyRange)) {
      range = FDBKeyRange.only(valueToKey(range));
    }
    const request = new FDBRequest();
    request.source = this;
    request.transaction = this.transaction;
    const cursor = new FDBCursorWithValue(this, range, direction, request);
    return this.transaction._execRequestAsync({
      operation: cursor._iterate.bind(cursor),
      request,
      source: this
    });
  }
  openKeyCursor(range, direction) {
    confirmActiveTransaction(this);
    if (range === null) {
      range = undefined;
    }
    if (range !== undefined && !(range instanceof FDBKeyRange)) {
      range = FDBKeyRange.only(valueToKey(range));
    }
    const request = new FDBRequest();
    request.source = this;
    request.transaction = this.transaction;
    const cursor = new FDBCursor(this, range, direction, request, true);
    return this.transaction._execRequestAsync({
      operation: cursor._iterate.bind(cursor),
      request,
      source: this
    });
  }

  // tslint:-next-line max-line-length
  // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#widl-IDBObjectStore-createIndex-IDBIndex-DOMString-name-DOMString-sequence-DOMString--keyPath-IDBIndexParameters-optionalParameters
  createIndex(name, keyPath, optionalParameters = {}) {
    if (arguments.length < 2) {
      throw new TypeError();
    }
    const multiEntry = optionalParameters.multiEntry !== undefined ? optionalParameters.multiEntry : false;
    const unique = optionalParameters.unique !== undefined ? optionalParameters.unique : false;
    if (this.transaction.mode !== "versionchange") {
      throw new InvalidStateError();
    }
    confirmActiveTransaction(this);
    if (this.indexNames.contains(name)) {
      throw new ConstraintError();
    }
    validateKeyPath(keyPath);
    if (Array.isArray(keyPath) && multiEntry) {
      throw new InvalidAccessError();
    }

    // The index that is requested to be created can contain constraints on the data allowed in the index's
    // referenced object store, such as requiring uniqueness of the values referenced by the index's keyPath. If the
    // referenced object store already contains data which violates these constraints, this MUST NOT cause the
    // implementation of createIndex to throw an exception or affect what it returns. The implementation MUST still
    // create and return an IDBIndex object. Instead the implementation must queue up an operation to abort the
    // "versionchange" transaction which was used for the createIndex call.

    // Save for rollbackLog
    const indexNames = [...this.indexNames];
    const index = new Index(this._rawObjectStore, name, keyPath, multiEntry, unique);
    this.indexNames._push(name);
    this.indexNames._sort();
    this.transaction._createdIndexes.add(index);
    this._rawObjectStore.rawIndexes.set(name, index);
    index.initialize(this.transaction); // This is async by design

    this.transaction._rollbackLog.push(() => {
      index.deleted = true;
      this.indexNames = new FakeDOMStringList(...indexNames);
      this._rawObjectStore.rawIndexes.delete(index.name);
    });
    return new FDBIndex(this, index);
  }

  // https://w3c.github.io/IndexedDB/#dom-idbobjectstore-index
  index(name) {
    if (arguments.length === 0) {
      throw new TypeError();
    }
    if (this._rawObjectStore.deleted || this.transaction._state === "finished") {
      throw new InvalidStateError();
    }
    const index = this._indexesCache.get(name);
    if (index !== undefined) {
      return index;
    }
    const rawIndex = this._rawObjectStore.rawIndexes.get(name);
    if (!this.indexNames.contains(name) || rawIndex === undefined) {
      throw new NotFoundError();
    }
    const index2 = new FDBIndex(this, rawIndex);
    this._indexesCache.set(name, index2);
    return index2;
  }
  deleteIndex(name) {
    if (arguments.length === 0) {
      throw new TypeError();
    }
    if (this.transaction.mode !== "versionchange") {
      throw new InvalidStateError();
    }
    confirmActiveTransaction(this);
    const rawIndex = this._rawObjectStore.rawIndexes.get(name);
    if (rawIndex === undefined) {
      throw new NotFoundError();
    }
    this.transaction._rollbackLog.push(() => {
      rawIndex.deleted = false;
      this._rawObjectStore.rawIndexes.set(rawIndex.name, rawIndex);
      this.indexNames._push(rawIndex.name);
      this.indexNames._sort();
    });
    this.indexNames = new FakeDOMStringList(...Array.from(this.indexNames).filter(indexName => {
      return indexName !== name;
    }));
    rawIndex.deleted = true; // Not sure if this is supposed to happen synchronously

    this.transaction._execRequestAsync({
      operation: () => {
        const rawIndex2 = this._rawObjectStore.rawIndexes.get(name);

        // Hack in case another index is given this name before this async request is processed. It'd be better
        // to have a real unique ID for each index.
        if (rawIndex === rawIndex2) {
          this._rawObjectStore.rawIndexes.delete(name);
        }
      },
      source: this
    });
  }

  // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#widl-IDBObjectStore-count-IDBRequest-any-key
  count(key) {
    confirmActiveTransaction(this);
    if (key === null) {
      key = undefined;
    }
    if (key !== undefined && !(key instanceof FDBKeyRange)) {
      key = FDBKeyRange.only(valueToKey(key));
    }
    return this.transaction._execRequestAsync({
      operation: () => {
        return this._rawObjectStore.count(key);
      },
      source: this
    });
  }
  get [Symbol.toStringTag]() {
    return "IDBObjectStore";
  }
}class Event {
  eventPath = [];
  NONE = 0;
  CAPTURING_PHASE = 1;
  AT_TARGET = 2;
  BUBBLING_PHASE = 3;

  // Flags
  propagationStopped = false;
  immediatePropagationStopped = false;
  canceled = false;
  initialized = true;
  dispatched = false;
  target = null;
  currentTarget = null;
  eventPhase = 0;
  defaultPrevented = false;
  isTrusted = false;
  timeStamp = Date.now();
  constructor(type, eventInitDict = {}) {
    this.type = type;
    this.bubbles = eventInitDict.bubbles !== undefined ? eventInitDict.bubbles : false;
    this.cancelable = eventInitDict.cancelable !== undefined ? eventInitDict.cancelable : false;
  }
  preventDefault() {
    if (this.cancelable) {
      this.canceled = true;
    }
  }
  stopPropagation() {
    this.propagationStopped = true;
  }
  stopImmediatePropagation() {
    this.propagationStopped = true;
    this.immediatePropagationStopped = true;
  }
}// When running within Node.js (including jsdom), we want to use setImmediate
// (which runs immediately) rather than setTimeout (which enforces a minimum
// delay of 1ms, and on Windows only has a resolution of 15ms or so).  jsdom
// doesn't provide setImmediate (to better match the browser environment) and
// sandboxes scripts, but its sandbox is by necessity imperfect, so we can break
// out of it:
//
// - https://github.com/jsdom/jsdom#executing-scripts
// - https://github.com/jsdom/jsdom/issues/2729
// - https://github.com/scala-js/scala-js-macrotask-executor/pull/17
function getSetImmediateFromJsdom() {
  if (typeof navigator !== "undefined" && /jsdom/.test(navigator.userAgent)) {
    const outerRealmFunctionConstructor = Node.constructor;
    return new outerRealmFunctionConstructor("return setImmediate")();
  } else {
    return undefined;
  }
}

// waiting on this PR for typescript types: https://github.com/microsoft/TypeScript-DOM-lib-generator/pull/1249

// 'postTask' runs right after microtasks, so equivalent to setTimeout but without the 4ms clamping.
// Using the default priority of 'user-visible' to avoid blocking input while still running fairly quickly.
// See: https://developer.mozilla.org/en-US/docs/Web/API/Prioritized_Task_Scheduling_API#task_priorities
const schedulerPostTask = typeof scheduler !== "undefined" && (fn => scheduler.postTask(fn));

// fallback for environments that don't support any of the above
const doSetTimeout = fn => setTimeout(fn, 0);

// Schedules a task to run later.  Use Node.js's setImmediate if available and
// setTimeout otherwise.  Note that options like process.nextTick or
// queueMicrotask will likely not work: IndexedDB semantics require that
// transactions are marked as not active when the event loop runs. The next
// tick queue and microtask queue run within the current event loop macrotask,
// so they'd process database operations too quickly.
const queueTask = fn => {
  const setImmediate = globalThis.setImmediate || getSetImmediateFromJsdom() || schedulerPostTask || doSetTimeout;
  setImmediate(fn);
};const prioritizedListenerTypes = ["error", "abort", "complete"];
// http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#transaction
class FDBTransaction extends FakeEventTarget {
  _state = "active";
  _started = false;
  _rollbackLog = [];
  _objectStoresCache = new Map();
  _openRequest = null;
  error = null;
  onabort = null;
  oncomplete = null;
  onerror = null;
  _prioritizedListeners = new Map();
  _requests = [];
  _createdIndexes = new Set();
  _createdObjectStores = new Set();
  constructor(storeNames, mode, durability, db) {
    super();
    this._scope = new Set(storeNames);
    this.mode = mode;
    this.durability = durability;
    this.db = db;
    this.objectStoreNames = new FakeDOMStringList(...Array.from(this._scope).sort());
    for (const type of prioritizedListenerTypes) {
      // Attach prioritized (internal) listeners before any external listeners are attached.
      // This ensures that these listeners run with the same timing regardless of whether
      // the user uses `on*` or `addEventListener` for event listeners.
      this.addEventListener(type, () => {
        this._prioritizedListeners.get(type)?.();
      });
    }
  }

  // https://w3c.github.io/IndexedDB/#abort-transaction
  _abort(errName) {
    for (const f of this._rollbackLog.reverse()) {
      f();
    }
    if (errName !== null) {
      const e = new DOMException(undefined, errName);
      this.error = e;
    }

    // Should this directly remove from _requests?
    for (const {
      request
    } of this._requests) {
      if (request.readyState !== "done") {
        request.readyState = "done"; // This will cancel execution of this request's operation
        if (request.source) {
          // https://w3c.github.io/IndexedDB/#ref-for-list-iterate%E2%91%A2
          // For each request of transaction’s request list, abort the steps to asynchronously
          // execute a request for request, set request’s processed flag to true, and queue a
          // database task to run these steps:
          queueTask(() => {
            // Set request’s result to undefined.
            request.result = undefined;
            // Set request’s error to a newly created "AbortError" DOMException.
            request.error = new AbortError();

            // Fire an event named error at request with its bubbles and cancelable attributes initialized
            // to true.
            const event = new Event("error", {
              bubbles: true,
              cancelable: true
            });
            event.eventPath = [this.db, this];
            try {
              request.dispatchEvent(event);
            } catch (_err) {
              if (this._state === "active") {
                this._abort("AbortError");
              }
            }
          });
        }
      }
    }

    // Queue a database task to run these steps:
    queueTask(() => {
      // If transaction is an upgrade transaction, then set transaction’s connection’s associated database’s
      // upgrade transaction to null.
      // (i.e. remove it from the list of `db.connections`)
      const isUpgradeTransaction = this.mode === "versionchange";
      if (isUpgradeTransaction) {
        this.db._rawDatabase.connections = this.db._rawDatabase.connections.filter(connection => !connection._rawDatabase.transactions.includes(this));
      }
      // Fire an event named abort at transaction with its bubbles attribute initialized to true.
      const event = new Event("abort", {
        bubbles: true,
        cancelable: false
      });
      event.eventPath = [this.db];
      this.dispatchEvent(event);

      // If transaction is an upgrade transaction, then:
      if (isUpgradeTransaction) {
        // Let request be the open request associated with transaction.
        const request = this._openRequest;
        // Set request’s transaction to null.
        request.transaction = null;
        // Set request’s result to undefined.
        request.result = undefined;
      }
    });
    this._state = "finished";
  }
  abort() {
    if (this._state === "committing" || this._state === "finished") {
      throw new InvalidStateError();
    }
    this._state = "active";
    this._abort(null);
  }

  // http://w3c.github.io/IndexedDB/#dom-idbtransaction-objectstore
  objectStore(name) {
    if (this._state !== "active") {
      throw new InvalidStateError();
    }
    const objectStore = this._objectStoresCache.get(name);
    if (objectStore !== undefined) {
      return objectStore;
    }
    const rawObjectStore = this.db._rawDatabase.rawObjectStores.get(name);
    if (!this._scope.has(name) || rawObjectStore === undefined) {
      throw new NotFoundError();
    }
    const objectStore2 = new FDBObjectStore(this, rawObjectStore);
    this._objectStoresCache.set(name, objectStore2);
    return objectStore2;
  }

  // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#dfn-steps-for-asynchronously-executing-a-request
  _execRequestAsync(obj) {
    const source = obj.source;
    const operation = obj.operation;
    let request = Object.hasOwn(obj, "request") ? obj.request : null;
    if (this._state !== "active") {
      throw new TransactionInactiveError();
    }

    // Request should only be passed for cursors
    if (!request) {
      if (!source) {
        // Special requests like indexes that just need to run some code
        request = new FDBRequest();
      } else {
        request = new FDBRequest();
        request.source = source;
        request.transaction = source.transaction;
      }
    }
    this._requests.push({
      operation,
      request
    });
    return request;
  }
  _start() {
    this._started = true;

    // Remove from request queue - cursor ones will be added back if necessary by cursor.continue and such
    let operation;
    let request;
    while (this._requests.length > 0) {
      const r = this._requests.shift();

      // This should only be false if transaction was aborted
      if (r && r.request.readyState !== "done") {
        request = r.request;
        operation = r.operation;
        break;
      }
    }
    if (request && operation) {
      if (!request.source) {
        // Special requests like indexes that just need to run some code, with error handling already built into
        // operation
        operation();
      } else {
        let defaultAction;
        let event;
        try {
          const result = operation();
          request.readyState = "done";
          request.result = result;
          request.error = undefined;

          // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#dfn-fire-a-success-event
          if (this._state === "inactive") {
            this._state = "active";
          }
          event = new Event("success", {
            bubbles: false,
            cancelable: false
          });
        } catch (err) {
          request.readyState = "done";
          request.result = undefined;
          request.error = err;

          // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#dfn-fire-an-error-event
          if (this._state === "inactive") {
            this._state = "active";
          }
          event = new Event("error", {
            bubbles: true,
            cancelable: true
          });
          defaultAction = this._abort.bind(this, err.name);
        }
        try {
          event.eventPath = [this.db, this];
          request.dispatchEvent(event);
        } catch (_err) {
          if (this._state === "active") {
            this._abort("AbortError");
            defaultAction = undefined; // do not abort again
          }
        }

        // Default action of event
        if (!event.canceled) {
          if (defaultAction) {
            defaultAction();
          }
        }
      }

      // Give it another chance for new handlers to be set before finishing
      queueTask(this._start.bind(this));
      return;
    }

    // Check if transaction complete event needs to be fired
    if (this._state !== "finished") {
      // Either aborted or committed already
      this._state = "finished";
      if (!this.error) {
        const event = new Event("complete");
        this.dispatchEvent(event);
      }
    }
  }
  commit() {
    if (this._state !== "active") {
      throw new InvalidStateError();
    }
    this._state = "committing";
  }
  get [Symbol.toStringTag]() {
    return "IDBTransaction";
  }
}const MAX_KEY = 9007199254740992;
class KeyGenerator {
  // This is kind of wrong. Should start at 1 and increment only after record is saved
  num = 0;
  next() {
    if (this.num >= MAX_KEY) {
      throw new ConstraintError();
    }
    this.num += 1;
    return this.num;
  }

  // https://w3c.github.io/IndexedDB/#possibly-update-the-key-generator
  setIfLarger(num) {
    const value = Math.floor(Math.min(num, MAX_KEY)) - 1;
    if (value >= this.num) {
      this.num = value + 1;
    }
  }
}// http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#dfn-object-store
class ObjectStore {
  deleted = false;
  records = new RecordStore(true);
  rawIndexes = new Map();
  constructor(rawDatabase, name, keyPath, autoIncrement) {
    this.rawDatabase = rawDatabase;
    this.keyGenerator = autoIncrement === true ? new KeyGenerator() : null;
    this.deleted = false;
    this.name = name;
    this.keyPath = keyPath;
    this.autoIncrement = autoIncrement;
  }

  // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#dfn-steps-for-retrieving-a-value-from-an-object-store
  getKey(key) {
    const record = this.records.get(key);
    return record !== undefined ? structuredClone(record.key) : undefined;
  }

  // http://w3c.github.io/IndexedDB/#retrieve-multiple-keys-from-an-object-store
  getAllKeys(range, count, direction) {
    if (count === undefined || count === 0) {
      count = Infinity;
    }
    const records = [];
    for (const record of this.records.values(range, direction)) {
      records.push(structuredClone(record.key));
      if (records.length >= count) {
        break;
      }
    }
    return records;
  }

  // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#dfn-steps-for-retrieving-a-value-from-an-object-store
  getValue(key) {
    const record = this.records.get(key);
    return record !== undefined ? structuredClone(record.value) : undefined;
  }

  // http://w3c.github.io/IndexedDB/#retrieve-multiple-values-from-an-object-store
  getAllValues(range, count, direction) {
    if (count === undefined || count === 0) {
      count = Infinity;
    }
    const records = [];
    for (const record of this.records.values(range, direction)) {
      records.push(structuredClone(record.value));
      if (records.length >= count) {
        break;
      }
    }
    return records;
  }

  // https://www.w3.org/TR/IndexedDB/#dom-idbobjectstore-getallrecords
  getAllRecords(range, count, direction) {
    if (count === undefined || count === 0) {
      count = Infinity;
    }
    const records = [];
    for (const record of this.records.values(range, direction)) {
      records.push(new FDBRecord(structuredClone(record.key), structuredClone(record.key), structuredClone(record.value)));
      if (records.length >= count) {
        break;
      }
    }
    return records;
  }

  // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#dfn-steps-for-storing-a-record-into-an-object-store
  storeRecord(newRecord, noOverwrite, rollbackLog) {
    if (this.keyPath !== null) {
      const key = extractKey(this.keyPath, newRecord.value).key;
      if (key !== undefined) {
        newRecord.key = key;
      }
    }
    const rollbackLogForThisOperation = [];
    if (this.keyGenerator !== null && newRecord.key === undefined) {
      let rolledBack = false;
      const keyGeneratorBefore = this.keyGenerator.num;
      const rollbackKeyGenerator = () => {
        if (rolledBack) {
          return;
        }
        rolledBack = true;
        if (this.keyGenerator) {
          this.keyGenerator.num = keyGeneratorBefore;
        }
      };
      rollbackLogForThisOperation.push(rollbackKeyGenerator);
      if (rollbackLog) {
        rollbackLog.push(rollbackKeyGenerator);
      }
      newRecord.key = this.keyGenerator.next();

      // Set in value if keyPath defiend but led to no key
      // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#dfn-steps-to-assign-a-key-to-a-value-using-a-key-path
      if (this.keyPath !== null) {
        if (Array.isArray(this.keyPath)) {
          throw new Error("Cannot have an array key path in an object store with a key generator");
        }
        let remainingKeyPath = this.keyPath;
        let object = newRecord.value;
        let identifier;
        let i = 0; // Just to run the loop at least once
        while (i >= 0) {
          if (typeof object !== "object") {
            throw new DataError();
          }
          i = remainingKeyPath.indexOf(".");
          if (i >= 0) {
            identifier = remainingKeyPath.slice(0, i);
            remainingKeyPath = remainingKeyPath.slice(i + 1);
            if (!Object.hasOwn(object, identifier)) {
              // Bypass prototype when setting (See `bindings-inject-values-bypass.any.js`)
              // Equivalent to `object[identifier] = ...` without using `Object.prototype`
              Object.defineProperty(object, identifier, {
                configurable: true,
                enumerable: true,
                writable: true,
                value: {}
              });
            }
            object = object[identifier];
          }
        }
        identifier = remainingKeyPath;

        // Bypass prototype when setting (See `bindings-inject-values-bypass.any.js`)
        // Equivalent to `object[identifier] = ...` without using `Object.prototype`
        Object.defineProperty(object, identifier, {
          configurable: true,
          enumerable: true,
          writable: true,
          value: newRecord.key
        });
      }
    } else if (this.keyGenerator !== null && typeof newRecord.key === "number") {
      this.keyGenerator.setIfLarger(newRecord.key);
    }
    const existingRecord = this.records.put(newRecord, noOverwrite);
    let rolledBack = false;
    const rollbackStoreRecord = () => {
      if (rolledBack) {
        return;
      }
      rolledBack = true;
      if (existingRecord) {
        // overwrite on rollback
        this.storeRecord(existingRecord, false);
      } else {
        // delete on rollback
        this.deleteRecord(newRecord.key);
      }
    };
    rollbackLogForThisOperation.push(rollbackStoreRecord);
    if (rollbackLog) {
      rollbackLog.push(rollbackStoreRecord);
    }

    // Delete existing indexes
    if (existingRecord) {
      for (const rawIndex of this.rawIndexes.values()) {
        rawIndex.records.deleteByValue(newRecord.key);
      }
    }

    // Update indexes
    try {
      for (const rawIndex of this.rawIndexes.values()) {
        if (rawIndex.initialized) {
          rawIndex.storeRecord(newRecord);
        }
      }
    } catch (err) {
      // If this request fails here and preventDefault is used to stop the transaction from aborting, we need to roll back the addition of this record to the store, otherwise it will be present in subsequent requests on this transaction. Same for key generator.
      if (err.name === "ConstraintError") {
        for (const rollback of rollbackLogForThisOperation) {
          rollback();
        }
      }
      throw err;
    }
    return newRecord.key;
  }

  // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#dfn-steps-for-deleting-records-from-an-object-store
  deleteRecord(key, rollbackLog) {
    const deletedRecords = this.records.delete(key);
    if (rollbackLog) {
      for (const record of deletedRecords) {
        rollbackLog.push(() => {
          this.storeRecord(record, true);
        });
      }
    }
    for (const rawIndex of this.rawIndexes.values()) {
      rawIndex.records.deleteByValue(key);
    }
  }

  // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#dfn-steps-for-clearing-an-object-store
  clear(rollbackLog) {
    const deletedRecords = this.records.clear();
    if (rollbackLog) {
      for (const record of deletedRecords) {
        rollbackLog.push(() => {
          this.storeRecord(record, true);
        });
      }
    }
    for (const rawIndex of this.rawIndexes.values()) {
      rawIndex.records.clear();
    }
  }
  count(range) {
    // optimization: if there is no range, or if the range is everything, then we can just count the total size
    if (range === undefined || range.lower === undefined && range.upper === undefined) {
      return this.records.size();
    }
    let count = 0;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const record of this.records.values(range)) {
      count += 1;
    }
    return count;
  }
}// http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#database-closing-steps
const closeConnection = (connection, forced = false) => {
  connection._closePending = true;
  const transactionsComplete = connection._rawDatabase.transactions.every(transaction => {
    return transaction._state === "finished";
  });
  if (transactionsComplete) {
    connection._closed = true;
    connection._rawDatabase.connections = connection._rawDatabase.connections.filter(otherConnection => {
      return connection !== otherConnection;
    });
    if (forced) {
      const event = new Event("close", {
        bubbles: false,
        cancelable: false
      });
      event.eventPath = [];
      connection.dispatchEvent(event);
    }
  } else {
    queueTask(() => {
      closeConnection(connection, forced);
    });
  }
};// Common first 3 steps of https://www.w3.org/TR/IndexedDB/#dom-idbdatabase-createobjectstore and https://www.w3.org/TR/IndexedDB/#dom-idbdatabase-deleteobjectstore
const confirmActiveVersionchangeTransaction = database => {
  // Let transaction be database’s upgrade transaction if it is not null, or throw an "InvalidStateError" DOMException otherwise.
  let transaction;
  if (database._runningVersionchangeTransaction) {
    // Find the latest versionchange transaction
    transaction = database._rawDatabase.transactions.findLast(tx => {
      return tx.mode === "versionchange";
    });
  }
  if (!transaction) {
    throw new InvalidStateError();
  }

  // If transaction’s state is not active, then throw a "TransactionInactiveError" DOMException.
  if (transaction._state !== "active") {
    throw new TransactionInactiveError();
  }
  return transaction;
};

// http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#database-interface
class FDBDatabase extends FakeEventTarget {
  _closePending = false;
  _closed = false;
  _runningVersionchangeTransaction = false;
  constructor(rawDatabase) {
    super();
    this._rawDatabase = rawDatabase;
    this._rawDatabase.connections.push(this);
    this.name = rawDatabase.name;
    this.version = rawDatabase.version;
    this.objectStoreNames = new FakeDOMStringList(...Array.from(rawDatabase.rawObjectStores.keys()).sort());
  }

  // http://w3c.github.io/IndexedDB/#dom-idbdatabase-createobjectstore
  createObjectStore(name, options = {}) {
    if (name === undefined) {
      throw new TypeError();
    }
    const transaction = confirmActiveVersionchangeTransaction(this);
    const keyPath = options !== null && options.keyPath !== undefined ? options.keyPath : null;
    const autoIncrement = options !== null && options.autoIncrement !== undefined ? options.autoIncrement : false;
    if (keyPath !== null) {
      validateKeyPath(keyPath);
    }
    if (this._rawDatabase.rawObjectStores.has(name)) {
      throw new ConstraintError();
    }
    if (autoIncrement && (keyPath === "" || Array.isArray(keyPath))) {
      throw new InvalidAccessError();
    }

    // Save for rollbackLog
    const objectStoreNames = [...this.objectStoreNames];
    const transactionObjectStoreNames = [...transaction.objectStoreNames];
    const rawObjectStore = new ObjectStore(this._rawDatabase, name, keyPath, autoIncrement);
    this.objectStoreNames._push(name);
    this.objectStoreNames._sort();
    transaction._scope.add(name);
    transaction._createdObjectStores.add(rawObjectStore);
    this._rawDatabase.rawObjectStores.set(name, rawObjectStore);
    transaction.objectStoreNames = new FakeDOMStringList(...this.objectStoreNames);
    transaction._rollbackLog.push(() => {
      rawObjectStore.deleted = true;
      this.objectStoreNames = new FakeDOMStringList(...objectStoreNames);
      transaction.objectStoreNames = new FakeDOMStringList(...transactionObjectStoreNames);
      transaction._scope.delete(rawObjectStore.name);
      this._rawDatabase.rawObjectStores.delete(rawObjectStore.name);
    });
    return transaction.objectStore(name);
  }

  // https://www.w3.org/TR/IndexedDB/#dom-idbdatabase-deleteobjectstore
  deleteObjectStore(name) {
    if (name === undefined) {
      throw new TypeError();
    }
    const transaction = confirmActiveVersionchangeTransaction(this);

    // Let store be the object store named name in database, or throw a "NotFoundError" DOMException if none.
    const store = this._rawDatabase.rawObjectStores.get(name);
    if (store === undefined) {
      throw new NotFoundError();
    }

    // Remove store from this’s object store set.
    // This method synchronously modifies the objectStoreNames property on the IDBDatabase instance on which it was called.
    this.objectStoreNames = new FakeDOMStringList(...Array.from(this.objectStoreNames).filter(objectStoreName => {
      return objectStoreName !== name;
    }));
    transaction.objectStoreNames = new FakeDOMStringList(...this.objectStoreNames);

    // If there is an object store handle associated with store and transaction, remove all entries from its index set.
    const objectStore = transaction._objectStoresCache.get(name);
    let prevIndexNames;
    if (objectStore) {
      prevIndexNames = [...objectStore.indexNames];
      objectStore.indexNames = new FakeDOMStringList();
    }
    transaction._rollbackLog.push(() => {
      store.deleted = false;
      this._rawDatabase.rawObjectStores.set(store.name, store);
      this.objectStoreNames._push(store.name);
      transaction.objectStoreNames._push(store.name);
      this.objectStoreNames._sort();
      if (objectStore && prevIndexNames) {
        objectStore.indexNames = new FakeDOMStringList(...prevIndexNames);
      }
    });

    // Destroy store.
    store.deleted = true;
    this._rawDatabase.rawObjectStores.delete(name);
    transaction._objectStoresCache.delete(name);
  }
  transaction(storeNames, mode, options) {
    mode = mode !== undefined ? mode : "readonly";
    if (mode !== "readonly" && mode !== "readwrite" && mode !== "versionchange") {
      throw new TypeError("Invalid mode: " + mode);
    }
    const hasActiveVersionchange = this._rawDatabase.transactions.some(transaction => {
      return transaction._state === "active" && transaction.mode === "versionchange" && transaction.db === this;
    });
    if (hasActiveVersionchange) {
      throw new InvalidStateError();
    }
    if (this._closePending) {
      throw new InvalidStateError();
    }
    if (!Array.isArray(storeNames)) {
      storeNames = [storeNames];
    }
    if (storeNames.length === 0 && mode !== "versionchange") {
      throw new InvalidAccessError();
    }
    for (const storeName of storeNames) {
      if (!this.objectStoreNames.contains(storeName)) {
        throw new NotFoundError("No objectStore named " + storeName + " in this database");
      }
    }

    // the actual algo is more complex but this passes the IDB tests: https://webidl.spec.whatwg.org/#es-dictionary
    const durability = options?.durability ?? "default";
    // invalid enums throw a TypeError: https://webidl.spec.whatwg.org/#es-enumeration
    if (durability !== "default" && durability !== "strict" && durability !== "relaxed") {
      throw new TypeError(
      // based on Firefox's error message
      `'${durability}' (value of 'durability' member of IDBTransactionOptions) ` + `is not a valid value for enumeration IDBTransactionDurability`);
    }
    const tx = new FDBTransaction(storeNames, mode, durability, this);
    this._rawDatabase.transactions.push(tx);
    this._rawDatabase.processTransactions(); // See if can start right away (async)

    return tx;
  }
  close() {
    closeConnection(this);
  }
  get [Symbol.toStringTag]() {
    return "IDBDatabase";
  }
}class FDBOpenDBRequest extends FDBRequest {
  onupgradeneeded = null;
  onblocked = null;
  get [Symbol.toStringTag]() {
    return "IDBOpenDBRequest";
  }
}class FDBVersionChangeEvent extends Event {
  constructor(type, parameters = {}) {
    super(type);
    this.newVersion = parameters.newVersion !== undefined ? parameters.newVersion : null;
    this.oldVersion = parameters.oldVersion !== undefined ? parameters.oldVersion : 0;
  }
  get [Symbol.toStringTag]() {
    return "IDBVersionChangeEvent";
  }
}/**
 * Minimal polyfill of `Set.prototype.intersection`, available in Node 22+.
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/intersection
 * @param set1
 * @param set2
 */
function intersection(set1, set2) {
  if ("intersection" in set1) {
    return set1.intersection(set2);
  }
  return new Set([...set1].filter(item => set2.has(item)));
}// http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#dfn-database
class Database {
  transactions = [];
  rawObjectStores = new Map();
  connections = [];
  constructor(name, version) {
    this.name = name;
    this.version = version;
    this.processTransactions = this.processTransactions.bind(this);
  }
  processTransactions() {
    queueTask(() => {
      const running = this.transactions.filter(transaction => transaction._started && transaction._state !== "finished");
      const waiting = this.transactions.filter(transaction => !transaction._started && transaction._state !== "finished");

      // The next transaction to run is the first waiting one that doesn't overlap with either a running one or a
      // preceding waiting one. This allows non-overlapping transactions to run in parallel.
      // The exception is readonly transactions, which are allowed to run in parallel with other readonly
      // transactions, even with overlapping scopes, since no data is being modified.
      const next = waiting.find((transaction, i) => {
        const anyRunning = running.some(other => !(transaction.mode === "readonly" && other.mode === "readonly") && intersection(other._scope, transaction._scope).size > 0);
        if (anyRunning) {
          return false;
        }

        // If any _preceding_ waiting transactions are blocked, then that's also blocking.
        // E.g. if you have 3 transactions: [a], [a,b], and [b,c], then [a] blocks [a,b] which blocks [b,c]
        // until [a] is complete, even though [a] and [b,c] share no overlap.
        // Note that readonly transactions do not have to be handled as a special case here,
        // because if any transactions with overlapping scopes are blocked, then we can assume they are
        const anyWaiting = waiting.slice(0, i).some(other => intersection(other._scope, transaction._scope).size > 0);
        return !anyWaiting;
      });
      if (next) {
        next.addEventListener("complete", this.processTransactions);
        next.addEventListener("abort", this.processTransactions);
        next._start();
      }
    });
  }
}// WebIDL requires passing the right number of non-optional arguments, e.g. IDBFactory.open() must have at least 1 arg
function validateRequiredArguments(numArguments, expectedNumArguments, methodName) {
  if (numArguments < expectedNumArguments) {
    // imitate Firefox's error message
    throw new TypeError(`${methodName}: At least ${expectedNumArguments} ${expectedNumArguments === 1 ? "argument" : "arguments"} ` + `required, but only ${arguments.length} passed`);
  }
}// https://w3c.github.io/IndexedDB/#connection-queue
const runTaskInConnectionQueue = (connectionQueues, name, task) => {
  // Let queue be the connection queue for storageKey and name.
  // (note FakeIndexedDB does not support storageKeys currently)
  // Add request to queue.
  // Wait until all previous requests in queue have been processed.
  const queue = connectionQueues.get(name) ?? Promise.resolve();
  connectionQueues.set(name, queue.then(task));
};
const waitForOthersClosedDelete = (databases, name, openDatabases, cb) => {
  const anyOpen = openDatabases.some(openDatabase2 => {
    return !openDatabase2._closed && !openDatabase2._closePending;
  });
  if (anyOpen) {
    queueTask(() => waitForOthersClosedDelete(databases, name, openDatabases, cb));
    return;
  }
  databases.delete(name);
  cb(null);
};

// https://w3c.github.io/IndexedDB/#delete-a-database
const deleteDatabase = (databases, connectionQueues, name, request, cb) => {
  const deleteDBTask = () => {
    return new Promise(resolve => {
      const db = databases.get(name);
      const oldVersion = db !== undefined ? db.version : 0;
      const onComplete = err => {
        try {
          if (err) {
            cb(err);
          } else {
            cb(null, oldVersion);
          }
        } finally {
          resolve();
        }
      };
      try {
        const db = databases.get(name);
        if (db === undefined) {
          onComplete(null);
          return;
        }

        // Let openConnections be the set of all connections associated with db.
        const openConnections = db.connections.filter(connection => {
          return !connection._closed;
        });

        // For each entry of openConnections that does not have its close pending flag set to true, queue a
        // database task to fire a version change event named versionchange at entry with db’s version and null.
        for (const openDatabase2 of openConnections) {
          if (!openDatabase2._closePending) {
            queueTask(() => {
              const event = new FDBVersionChangeEvent("versionchange", {
                newVersion: null,
                oldVersion: db.version
              });
              openDatabase2.dispatchEvent(event);
            });
          }
        }

        // Wait for all of the events to be fired. (i.e. queue a task)
        queueTask(() => {
          // If any of the connections in openConnections are still not closed, queue a database task to
          // fire a version change event named blocked at request with db’s version and null.

          const anyOpen = openConnections.some(openDatabase3 => {
            return !openDatabase3._closed && !openDatabase3._closePending;
          });

          // If any of the connections in openConnections are still not closed, queue a database task to
          // fire a version change event named blocked at request with db’s version and null.
          if (anyOpen) {
            queueTask(() => {
              const event = new FDBVersionChangeEvent("blocked", {
                newVersion: null,
                oldVersion: db.version
              });
              request.dispatchEvent(event);
            });
          }

          // Wait until all connections in openConnections are closed.
          waitForOthersClosedDelete(databases, name, openConnections, onComplete);
        });
      } catch (err) {
        onComplete(err);
      }
    });
  };
  runTaskInConnectionQueue(connectionQueues, name, deleteDBTask);
};

// https://w3c.github.io/IndexedDB/#ref-for-database-version%E2%91%A0%E2%91%A2
const runVersionchangeTransaction = (connection, version, request, cb) => {
  connection._runningVersionchangeTransaction = true;
  const oldVersion = connection._oldVersion = connection.version;

  // Let openConnections be the set of all connections, except connection, associated with db.
  const openConnections = connection._rawDatabase.connections.filter(otherDatabase => {
    return connection !== otherDatabase;
  });

  // For each entry of openConnections that does not have its close pending flag set to true, queue a
  // database task to fire a version change event named versionchange at entry with db’s version and version.
  for (const openDatabase2 of openConnections) {
    if (!openDatabase2._closed && !openDatabase2._closePending) {
      queueTask(() => {
        const event = new FDBVersionChangeEvent("versionchange", {
          newVersion: version,
          oldVersion
        });
        openDatabase2.dispatchEvent(event);
      });
    }
  }

  // Wait for all of the events to be fired.
  // (i.e. queue a task)
  queueTask(() => {
    const anyOpen = openConnections.some(openDatabase3 => {
      return !openDatabase3._closed && !openDatabase3._closePending;
    });

    // If any of the connections in openConnections are still not closed, queue a database task to fire a version change event named blocked at request with db’s version and version.
    if (anyOpen) {
      queueTask(() => {
        const event = new FDBVersionChangeEvent("blocked", {
          newVersion: version,
          oldVersion
        });
        request.dispatchEvent(event);
      });
    }

    // Wait until all connections in openConnections are closed.
    const waitForOthersClosed = () => {
      const anyOpen2 = openConnections.some(openDatabase2 => {
        return !openDatabase2._closed && !openDatabase2._closePending;
      });
      if (anyOpen2) {
        queueTask(waitForOthersClosed);
        return;
      }

      // Set the version of database to version. This change is considered part of the transaction, and so if the
      // transaction is aborted, this change is reverted.
      connection._rawDatabase.version = version;
      connection.version = version;

      // Get rid of this setImmediate?
      const transaction = connection.transaction(Array.from(connection.objectStoreNames), "versionchange");

      // associate the transaction with the open request for later lookup
      transaction._openRequest = request;

      // https://w3c.github.io/IndexedDB/#upgrade-a-database
      // Set request’s result to connection.
      request.result = connection;
      // Set request’s done flag to true.
      request.readyState = "done";
      // Set request’s transaction to transaction.
      request.transaction = transaction;
      transaction._rollbackLog.push(() => {
        connection._rawDatabase.version = oldVersion;
        connection.version = oldVersion;
      });

      // Set transaction’s state to active.
      transaction._state = "active";

      // Let didThrow be the result of firing a version change event named upgradeneeded at request with old version and version.
      const event = new FDBVersionChangeEvent("upgradeneeded", {
        newVersion: version,
        oldVersion
      });
      let didThrow = false;
      try {
        request.dispatchEvent(event);
      } catch (_err) {
        didThrow = true;
      }
      const concludeUpgrade = () => {
        // If transaction’s state is active, then:
        if (transaction._state === "active") {
          // Set transaction’s state to inactive.
          transaction._state = "inactive";
          if (didThrow) {
            // If didThrow is true, run abort a transaction with transaction and a newly created "AbortError" DOMException.
            transaction._abort("AbortError");
          }
        }
      };

      // The "upgrade a database" steps are supposed to run as a database task on the database access task source
      // (i.e. off the main thread), but since we're actually running on the main thread, we have to be tricky:
      // 1. If any `upgradeneeded` event handlers errored, abort synchronously
      // 2. Else yield to allow any microtasks to run in response to that event
      if (didThrow) {
        concludeUpgrade();
      } else {
        queueTask(concludeUpgrade);
      }
      transaction._prioritizedListeners.set("error", () => {
        connection._runningVersionchangeTransaction = false;
        connection._oldVersion = undefined;
        // throw arguments[0].target.error;
        // console.log("error in versionchange transaction - not sure if anything needs to be done here", e.target.error.name);
      });
      transaction._prioritizedListeners.set("abort", () => {
        connection._runningVersionchangeTransaction = false;
        connection._oldVersion = undefined;
        queueTask(() => {
          // Reset transaction in a tick after onabort (upgrade-transaction-lifecycle-user-aborted.any)
          request.transaction = null;
          cb(new AbortError());
        });
      });
      transaction._prioritizedListeners.set("complete", () => {
        connection._runningVersionchangeTransaction = false;
        connection._oldVersion = undefined;
        // Let other complete event handlers run before continuing
        queueTask(() => {
          // Reset transaction in a tick after oncomplete (upgrade-transaction-lifecycle-committed.any.js)
          request.transaction = null;
          if (connection._closePending) {
            cb(new AbortError());
          } else {
            cb(null);
          }
        });
      });
    };
    waitForOthersClosed();
  });
};

// https://w3c.github.io/IndexedDB/#opening
const openDatabase = (databases, connectionQueues, name, version, request, cb) => {
  const openDBTask = () => {
    return new Promise(resolve => {
      const onComplete = err => {
        try {
          if (err) {
            // DO THIS HERE: ensure that connection is closed by running the steps for closing a database connection before these
            // steps are aborted.
            cb(err);
          } else {
            cb(null, connection);
          }
        } finally {
          resolve();
        }
      };

      // Let db be the database named name in storageKey, or null otherwise.
      let db = databases.get(name);
      if (db === undefined) {
        // If db is null, let db be a new database with name `name`, version 0 (zero), and with no object stores.
        db = new Database(name, 0);
        databases.set(name, db);
      }

      // If version is undefined, let version be 1 if db is null, or db’s version otherwise.
      if (version === undefined) {
        version = db.version !== 0 ? db.version : 1;
      }

      // If db’s version is greater than version, return a newly created "VersionError" DOMException and abort these steps.
      if (db.version > version) {
        return onComplete(new VersionError());
      }

      // Let connection be a new connection to db.
      const connection = new FDBDatabase(db);

      // If db’s version is less than version, then:
      if (db.version < version) {
        // (run a version change transaction and resolve so that the next promise in the queue will execute)
        runVersionchangeTransaction(connection, version, request, err => {
          onComplete(err);
        });
      } else {
        onComplete(null);
      }
    });
  };
  runTaskInConnectionQueue(connectionQueues, name, openDBTask);
};
class FDBFactory {
  _databases = new Map();
  // https://w3c.github.io/IndexedDB/#connection-queue
  _connectionQueues = new Map(); // promise chain as lightweight FIFO task queue

  // https://w3c.github.io/IndexedDB/#dom-idbfactory-cmp
  cmp(first, second) {
    validateRequiredArguments(arguments.length, 2, "IDBFactory.cmp");
    return cmp(first, second);
  }

  // https://w3c.github.io/IndexedDB/#dom-idbfactory-deletedatabase
  deleteDatabase(name) {
    validateRequiredArguments(arguments.length, 1, "IDBFactory.deleteDatabase");
    const request = new FDBOpenDBRequest();
    request.source = null;
    queueTask(() => {
      deleteDatabase(this._databases, this._connectionQueues, name, request, (err, oldVersion) => {
        if (err) {
          request.error = new DOMException(err.message, err.name);
          request.readyState = "done";
          const event = new Event("error", {
            bubbles: true,
            cancelable: true
          });
          event.eventPath = [];
          request.dispatchEvent(event);
          return;
        }
        request.result = undefined;
        request.readyState = "done";
        const event2 = new FDBVersionChangeEvent("success", {
          newVersion: null,
          oldVersion
        });
        request.dispatchEvent(event2);
      });
    });
    return request;
  }

  // http://www.w3.org/TR/2015/REC-IndexedDB-20150108/#widl-IDBFactory-open-IDBOpenDBRequest-DOMString-name-unsigned-long-long-version
  open(name, version) {
    validateRequiredArguments(arguments.length, 1, "IDBFactory.open");
    if (arguments.length > 1 && version !== undefined) {
      // Based on spec, not sure why "MAX_SAFE_INTEGER" instead of "unsigned long long", but it's needed to pass
      // tests
      version = enforceRange(version, "MAX_SAFE_INTEGER");
    }
    if (version === 0) {
      throw new TypeError("Database version cannot be 0");
    }
    const request = new FDBOpenDBRequest();
    request.source = null;
    queueTask(() => {
      openDatabase(this._databases, this._connectionQueues, name, version, request, (err, connection) => {
        if (err) {
          request.result = undefined;
          request.readyState = "done";
          request.error = new DOMException(err.message, err.name);
          const event = new Event("error", {
            bubbles: true,
            cancelable: true
          });
          event.eventPath = [];
          request.dispatchEvent(event);
          return;
        }
        request.result = connection;
        request.readyState = "done";
        const event2 = new Event("success");
        event2.eventPath = [];
        request.dispatchEvent(event2);
      });
    });
    return request;
  }

  // https://w3c.github.io/IndexedDB/#dom-idbfactory-databases
  databases() {
    return Promise.resolve(Array.from(this._databases.entries(), ([name, database]) => {
      const activeVersionChangeConnection = database.connections.find(connection => connection._runningVersionchangeTransaction);
      // If a versionchange is in progress, report the old version. See `get-databases.any.js` test:
      // "The result of databases() should contain the versions of databases at the time of calling,
      // regardless of versionchange transactions currently running."
      const version = activeVersionChangeConnection ? activeVersionChangeConnection._oldVersion : database.version;
      return {
        name,
        version
      };
    }).filter(({
      version
    }) => {
      // Ignore newly-created DBs with active versionchange transactions. See `get-databases.any.js` test:
      // "The result of databases() should be only those databases which have been created at the
      // time of calling, regardless of versionchange transactions currently running."
      return version > 0;
    }));
  }
  get [Symbol.toStringTag]() {
    return "IDBFactory";
  }
}const fakeIndexedDB = new FDBFactory();// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type -- any function
function createFakeNativeFunction(cb) {
    const fnName = cb.name || '';
    const toStringFn = ()=>`function ${fnName}() { [native code] }`;
    Object.defineProperties(cb, {
        toString: {
            value: toStringFn,
            writable: true,
            configurable: false,
            enumerable: false
        },
        toLocaleString: {
            value: toStringFn,
            writable: true,
            configurable: false,
            enumerable: false
        }
    });
    return cb;
}
// eslint-disable-next-line @typescript-eslint/unbound-method -- only called with Reflect.apply
const nativeFunctionToString = unsafeWindow.Function.prototype.toString;
/**
 * Just enough for polyfills and feature detection: `patched.toString()` (and `String(patched)`)
 * returns `native`'s source in the browser's own format, e.g. `function fetch() { [native code] }`,
 * and `patched.name` is `native.name`. `Function.prototype.toString` itself is left alone.
 */ // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type -- any function
function disguiseAsNative(patched, native) {
    const source = Reflect.apply(nativeFunctionToString, native, []);
    Object.defineProperties(patched, {
        name: {
            value: native.name,
            configurable: true
        },
        toString: {
            // A page subclass inherits a class's static members: it keeps its own source
            value () {
                return this === patched ? source : Reflect.apply(nativeFunctionToString, this, []);
            },
            writable: true,
            configurable: true,
            enumerable: false
        }
    });
}const defusedPattern = o$1([
    'pbp3',
    'pbp_',
    'pbpstate',
    'BILI_MIRROR',
    'MIRROR_TRACK',
    '__LOG',
    'reporter-pb',
    'KV_CONFIG_SDK',
    'pcdn',
    'nc_loader',
    'bpcfgzip'
]);
const defuseStorage = {
    name: 'disable-storage',
    description: '防止叔叔浪费你宝贵的 SSD 寿命',
    any () {
        deleteIndexedDB();
        ((origOpen)=>{
            unsafeWindow.indexedDB.open = createFakeNativeFunction(function(name, version) {
                if (defusedPattern(name)) {
                    logger.trace('IndexedDB mocked!', {
                        name,
                        version
                    });
                    return fakeIndexedDB.open(name, version);
                }
                logger.trace('IndexedDB opened!', {
                    name,
                    version
                });
                return origOpen.call(this, name, version);
            });
        // eslint-disable-next-line @typescript-eslint/unbound-method -- override native method
        })(unsafeWindow.indexedDB.open);
        ((orignalLocalStorage)=>{
            for(let i = 0; i < orignalLocalStorage.length; i++){
                const key = orignalLocalStorage.key(i);
                if (key && defusedPattern(key)) {
                    orignalLocalStorage.removeItem(key);
                    logger.info('localStorage removed!', {
                        key
                    });
                }
            }
            const store = new Map();
            const keys = Object.keys(orignalLocalStorage);
            const mockedLocalStorage = {
                setItem (key, value) {
                    keys.push(key);
                    if (defusedPattern(key)) {
                        logger.info('localStorage.setItem mocked:', {
                            key,
                            value
                        });
                        orignalLocalStorage.removeItem(key);
                        store.set(key, value);
                    } else orignalLocalStorage.setItem(key, value);
                },
                getItem (key) {
                    if (defusedPattern(key)) {
                        const value = store.has(key) ? store.get(key) : null;
                        logger.info('localStorage.getItem mocked:', {
                            key,
                            value
                        });
                        return value;
                    }
                    // logger.trace('localStorage.getItem:', { key });
                    return orignalLocalStorage.getItem(key);
                },
                removeItem (key) {
                    const keyIndex = keys.indexOf(key);
                    if (keyIndex > -1) keys.splice(keys.indexOf(key), 1);
                    if (defusedPattern(key)) {
                        logger.info('localStorage.removeItem mocked:', {
                            key
                        });
                        store.delete(key);
                    } else // logger.trace('localStorage.removeItem:', { key });
                    orignalLocalStorage.removeItem(key);
                },
                clear () {
                    logger.info('localStorage.clear mocked');
                    store.clear();
                    orignalLocalStorage.clear();
                    keys.length = 0;
                },
                get length () {
                    return store.size + localStorage.length;
                },
                key (index) {
                    const realIndex = keys.length - index - 1;
                    return keys[realIndex] ?? null;
                }
            };
            Object.defineProperty(unsafeWindow, 'localStorage', {
                get () {
                    return mockedLocalStorage;
                },
                enumerable: true,
                configurable: false,
                set: o$2
            });
        })(unsafeWindow.localStorage);
    }
};
async function deleteIndexedDB() {
    if (!('databases' in unsafeWindow.indexedDB)) return;
    const dbs = await unsafeWindow.indexedDB.databases();
    for(let i = 0, len = dbs.length; i < len; i++){
        const db = dbs[i];
        if (db.name && defusedPattern(db.name)) {
            logger.info('IndexedDB deleted!', {
                name: db.name
            });
            unsafeWindow.indexedDB.deleteDatabase(db.name);
        }
    }
}const forceEnable4K = {
    name: 'force-enable-4k',
    description: '强制启用 4K 播放 / 解锁 HDR / Dolby Atmos',
    onVideo: hook,
    onBangumi: hook,
    onLive: hook
};
const OUR_KEYS = new Set([
    'bilibili_player_force_DolbyAtmos&8K&HDR',
    'bilibili_player_force_hdr',
    'bilibili_player_force_8k'
]);
function hook({ onlyCallOnce }) {
    const keysToDelete = [];
    for(let i = 0; i < localStorage.length; i++){
        const key = localStorage.key(i);
        if (key != null && key.startsWith('bilibili_player_force_') && !OUR_KEYS.has(key)) keysToDelete.push(key);
    }
    for(let i = 0, len = keysToDelete.length; i < len; i++){
        const key = keysToDelete[i];
        localStorage.removeItem(key);
    }
    if (localStorage.getItem('bilibili_player_force_DolbyAtmos&8K&HDR') !== '1') localStorage.setItem('bilibili_player_force_DolbyAtmos&8K&HDR', '1');
    if (localStorage.getItem('bilibili_player_force_hdr') !== '1') localStorage.setItem('bilibili_player_force_hdr', '1');
    if (localStorage.getItem('bilibili_player_force_8k') !== '1') localStorage.setItem('bilibili_player_force_8k', '1');
    ((sessionStorageGetItem)=>{
        sessionStorage.getItem = function(key) {
            // 部分視頻解碼錯誤後會強制全局回退，禁用所有HEVC內容
            // 此hook禁用對應邏輯
            if (key === 'enableHEVCError') return null;
            return Reflect.apply(sessionStorageGetItem, this, [
                key
            ]);
        };
    // eslint-disable-next-line @typescript-eslint/unbound-method -- cache origin method
    })(sessionStorage.getItem);
    onlyCallOnce(overrideUA);
    onlyCallOnce(modifyTouchPointer);
}
function overrideUA() {
    // Bilibili use User-Agent to determine if the 4K should be avaliable, we simply overrides UA
    defineReadonlyProperty(unsafeWindow.navigator, 'userAgent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_7_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15');
    defineReadonlyProperty(unsafeWindow.navigator, 'platform', 'MacIntel');
}
function modifyTouchPointer() {
    const pointerType = detectPointerType();
    if (pointerType.isMouseDevice && !pointerType.isTouchDevice) {
        Object.defineProperty(navigator, 'maxTouchPoints', {
            value: 0,
            configurable: true
        });
        logger.info('Mouse detected, set maxTouchPoints to 0');
    } else logger.info(`Retain maxTouchPoints (${navigator.maxTouchPoints}) because: ${pointerType.isTouchDevice ? 'touch device detected' : 'no mouse device detected'}`);
}
function detectPointerType() {
    try {
        const hasFinePointer = unsafeWindow.matchMedia('(pointer: fine)').matches;
        const hasCoarsePointer = unsafeWindow.matchMedia('(pointer: coarse)').matches;
        const anyHover = unsafeWindow.matchMedia('(any-hover: hover)').matches;
        const supportsTouch = 'ontouchstart' in unsafeWindow || unsafeWindow.navigator.maxTouchPoints > 0;
        return {
            isMouseDevice: hasFinePointer && anyHover,
            isTouchDevice: hasCoarsePointer && supportsTouch
        };
    } catch  {
        return {
            isMouseDevice: true,
            isTouchDevice: false
        };
    }
}const KEY_PREFIX = 'mbgtbemodule:';
function initModuleMenu(mod) {
    const enabled = getEnabled(mod);
    GM.registerMenuCommand(labelFor(enabled, mod), async ()=>{
        const current = getEnabled(mod);
        await setEnabled(mod, !current);
        try {
            unsafeWindow.location.reload();
        } catch  {
        // swallow
        }
    });
    return enabled;
}
function getEnabled(m) {
    return GM_getValue(KEY_PREFIX + m.name, m.defaultEnabled ?? true);
}
function setEnabled(m, enabled) {
    return GM.setValue(KEY_PREFIX + m.name, enabled);
}
function labelFor(enabled, m) {
    // use ASCII-friendly symbols to avoid linter/encoding issues
    const mark = enabled ? '[ON]' : '[OFF]';
    return `${mark} ${m.description}`;
}function x(n,r="value"){throw TypeError(`Unexpected ${r}: ${n} as ${JSON.stringify(typeof n)}, should be "never"`)}const playurlApiRegex = /\/\/api\.bilibili\.com\/(?:x\/player\/(?:wbi\/)?playurl|pgc\/player\/web\/(?:v2\/)?playurl|pugv\/player\/web\/playurl)(?:[#/?]|$)/;
function isPlayurlApi(url) {
    return playurlApiRegex.test(url.toString());
}
/**
 * Catch every playinfo the page receives: the one embedded in the page (`window.__playinfo__`),
 * and every playurl API response over XHR or fetch.
 */ function initPlayinfoCapture({ onXhrResponse, onResponse }, ingest) {
    let current = unsafeWindow.__playinfo__;
    let lastIngested = null;
    const ingestEmbedded = (value, meta)=>{
        if (value !== lastIngested && isObject(value)) {
            lastIngested = value;
            ingest(value, meta);
        }
    };
    ingestEmbedded(current, 'unsafeWindow.__playinfo__');
    // The page assigns `window.__playinfo__` in an inline script, before the player loads:
    // trap the assignment instead of polling for it
    try {
        Object.defineProperty(unsafeWindow, '__playinfo__', {
            configurable: true,
            enumerable: true,
            get () {
                return current;
            },
            set (value) {
                current = value;
                ingestEmbedded(value, 'unsafeWindow.__playinfo__ (setter)');
            }
        });
    } catch (e) {
        logger.warn('Failed to trap unsafeWindow.__playinfo__', e);
    }
    // In case the page (re)defines the property instead of assigning it
    onDOMContentLoaded(()=>{
        ingestEmbedded(unsafeWindow.__playinfo__, 'unsafeWindow.__playinfo__ (DOMContentLoaded)');
    });
    onXhrResponse((_method, url, response)=>{
        if (!isPlayurlApi(url)) return response;
        if (typeof response === 'string') try {
            const json = JSON.parse(response);
            if (isObject(json)) ingest(json, 'playurl XHR API');
        } catch (e) {
            logger.error('Failed to parse playinfo XHR API JSON', e, {
                response
            });
        }
        else if (isObject(response)) // responseType: 'json'
        ingest(response, 'playurl XHR API (json)');
        return response;
    });
    onResponse((response, fetchArgs)=>{
        const url = response.url || getUrlFromRequest(fetchArgs[0]);
        if (url && isPlayurlApi(url)) response.clone().json().then((json)=>{
            if (isObject(json)) ingest(json, 'playurl fetch API');
        }).catch((e)=>logger.error('Failed to parse playinfo fetch API JSON', e, {
                url
            }));
        return response;
    });
}/** no-p2p, once registered */ let policy = null;
/** thread-ripper, once registered */ let server = null;
/** The bootstrap's hooks: the route hooks are installed with them once a policy registers */ let bootstrapHook = null;
let routeHooksInstalled = false;
/** What media modules get as `hook.player` */ const player = {
    /** Everything learned about every CDN host */ hosts: hosts$1,
    /** Every acceptable URL of a file, for requests of its own (the warm-up) */ candidates: acceptableCandidates,
    /** A candidate not about to expire, on a host not known to lack the file */ isCandidateUsable,
    /** Every representation of a video, as its newest playinfo listed them */ filesOf,
    registerPhase
};
/** Started once by the bootstrap, before any module runs */ function initPlayerInterceptor(hook) {
    bootstrapHook = hook;
    initPlayinfoCapture(hook, ingestPlayinfo);
    hook.onXhrSend((ctx)=>{
        if (server === null) return null;
        const request = toMediaXhrRequest(ctx);
        try {
            return request && server.serve(request);
        } catch (e) {
            logger.error(`[player-interceptor] serve phase "${server.name}" failed`, e, {
                url: ctx.url
            });
            return null;
        }
    });
}
function registerPhase(phase) {
    if (phase.type === 'policy') {
        policy = phase;
        installRouteHooks(bootstrapHook);
    } else server = phase;
    logger.info(`[player-interceptor] ${phase.type} phase "${phase.name}" registered`);
}
/** Every acceptable URL of a file, for a request (`requested`) or for its own */ function acceptableCandidates(file, requested = null) {
    const candidates = mediaCandidates(requested, file);
    return policy === null ? candidates : policy.filter(candidates);
}
/**
 * @throws on an invalid URL
 * @returns the URL the browser should fetch instead, `null` to leave the request as it is
 */ function route(url, via) {
    const href = typeof url === 'string' ? url.startsWith('//') ? 'https:' + url : url : url.href;
    const address = toMediaAddress(new URL(href));
    const file = findFile(address);
    if (file === null) {
        // Neither a CDN URL nor a listed one: not a media request, left alone
        if (address.class === 'unknown') return null;
        // Hosts seen outside any playinfo are candidates for other requests too
        noteHost(address);
    }
    const candidates = acceptableCandidates(file, address);
    const now = performance.now();
    const requested = findCandidate(candidates, address);
    const manualHost = getManualCdnHost();
    // The player's own URL, unless it is known not to work right now; failing that, still better
    // than one that is not acceptable. A manually selected host wins over the player's own URL
    const keep = requested !== null && (manualHost === null || requested.hostname === manualHost) && isCandidateUsable(requested, file, now, Date.now() / 1000) && !isCoolingDown(requested.hostname, now);
    const chosen = keep ? requested : defaultCandidate(candidates, file, now, address.key) ?? requested;
    if (chosen === null) {
        logger.warn('[player-interceptor] no acceptable URL for a media request, left as is', {
            via,
            url: href
        });
        return null;
    }
    return chosen.href === href ? null : chosen.href;
}
function installRouteHooks(hook) {
    if (routeHooksInstalled) return;
    routeHooksInstalled = true;
    hook.onXhrOpen((xhrOpenArgs)=>{
        const xhrUrl = xhrOpenArgs[1];
        if (isKnownNonVideoUrl(xhrUrl)) return xhrOpenArgs;
        try {
            xhrOpenArgs[1] = route(xhrUrl, 'XMLHttpRequest.prototype.open') ?? xhrUrl;
        } catch (e) {
            logger.error('Failed to replace P2P for XMLHttpRequest.prototype.open', e, {
                xhrUrl
            });
        }
        return xhrOpenArgs;
    });
    hook.onBeforeFetch((fetchArgs)=>{
        const input = fetchArgs[0];
        if (typeof input === 'string' || 'href' in input) {
            if (!isKnownNonVideoUrl(input)) fetchArgs[0] = route(input, 'fetch') ?? input;
        } else if ('url' in input) {
            if (!isKnownNonVideoUrl(input.url)) {
                const routed = route(input.url, 'fetch');
                if (routed !== null) fetchArgs[0] = new Request(routed, input);
            }
        } else x(input, 'fetchArgs[0]');
        return fetchArgs;
    });
    // Patch new Native Player
    (function(HTMLMediaElementPrototypeSrcDescriptor) {
        Object.defineProperty(unsafeWindow.HTMLMediaElement.prototype, 'src', {
            ...HTMLMediaElementPrototypeSrcDescriptor,
            set (value) {
                if (typeof value !== 'string') // eslint-disable-next-line sukka/unicorn/no-useless-coercion -- fuck typescript-eslint about never
                value = String(value);
                if (!value.startsWith('blob:') && !value.startsWith('data:')) // we don't care about blob urls
                // they will use another way to fetch the real url and turn it into blob url anyway
                // we can intercept that fetch/XHR instead
                try {
                    value = route(value, 'HTMLMediaElement.prototype.src') ?? value;
                } catch (e) {
                    logger.error('Failed to handle HTMLMediaElement.prototype.src setter', e, {
                        value
                    });
                }
                HTMLMediaElementPrototypeSrcDescriptor?.set?.call(this, value);
            }
        });
    })(Object.getOwnPropertyDescriptor(unsafeWindow.HTMLMediaElement.prototype, 'src'));
}
/**
 * Only plain GETs of media files can be answered: no body, no credentials, and at most a single
 * bounded `Range` (plus `Accept`) as request headers.
 */ function toMediaXhrRequest(ctx) {
    if (ctx.method !== 'GET' || !ctx.async || ctx.responseType !== 'arraybuffer' || ctx.body != null || ctx.hasUrlCredentials || ctx.withCredentials) return null;
    // Absolute and normalised already
    const { url } = ctx;
    if (!url.startsWith('https:') && !url.startsWith('http:') || isKnownNonVideoUrl(url)) return null;
    let range = null;
    for(let i = 0, len = ctx.headers.length; i < len; i++){
        const [name, value] = ctx.headers[i];
        if (name === 'range') {
            if (range !== null) return null;
            range = parseRangeHeader(value);
            if (range === null) return null;
        } else if (name !== 'accept') return null;
    }
    let address;
    try {
        address = toMediaAddress(new URL(url));
    } catch  {
        return null;
    }
    const file = findFile(address);
    const candidates = file === null ? [] : acceptableCandidates(file, address);
    return {
        ctx,
        range,
        file,
        candidates,
        requested: findCandidate(candidates, address)
    };
}/** Filled by the bootstrap's `hook.onXhr*` */ const xhrHooks = {
    open: new Set(),
    response: new Set(),
    send: new Set()
};
/* eslint-disable @typescript-eslint/unbound-method -- only called with Reflect.apply */ const NativeXMLHttpRequest = unsafeWindow.XMLHttpRequest;
/**
 * Captured before any page script runs: the page may wrap it later (monitoring SDKs do), and our
 * own events should not go through its wrappers
 */ const { dispatchEvent: nativeDispatchEvent } = unsafeWindow.EventTarget.prototype;
const states = new WeakMap();
/** An `onXhrOpen` hook returned `null`: send() and setRequestHeader() do nothing until the next open() */ const blocked = new WeakSet();
/**
 * A request answered by its responder instead of the browser, following the XHR spec: the
 * responder drives it (it is the responder's sink), and the XHR's getters read from it.
 *
 * Every event dispatch runs the page's handlers synchronously, and a handler may abort or re-open
 * the XHR: once `ended`, nothing more is fired for this request.
 */ class SyntheticXhrSink {
    xhr;
    state;
    readyState = 1;
    status = 0;
    statusText = '';
    /** Lower-cased names: each one once, as `Headers` iteration gives them */ headers = new Map();
    body = null;
    /** No more events: finished, failed, aborted or re-opened */ ended = false;
    /** Headers received */ committed = false;
    lastProgressAt = -Infinity;
    timer = null;
    controller = new AbortController();
    /** Aborted when the page calls `abort()`, re-opens the XHR, or its `timeout` elapses */ signal = this.controller.signal;
    constructor(xhr, state){
        this.xhr = xhr;
        this.state = state;
    }
    /** The spec's send() flag: set while the request is in flight */ get inFlight() {
        return !this.ended && this.readyState !== 4;
    }
    start(responder) {
        if (!this.emitProgress('loadstart', false, 0, 0)) return;
        const { timeout } = this.xhr;
        if (timeout > 0) this.timer = setTimeout(()=>{
            this.timer = null;
            if (this.inFlight) this.fail('timeout', 'XMLHttpRequest timed out', 'TimeoutError');
        }, timeout);
        // Apart from `loadstart`, XHR events never fire synchronously inside send()
        Promise.resolve().then(()=>{
            if (this.ended) return;
            try {
                responder(this);
            } catch (e) {
                logger.error('XMLHttpRequest responder failed', e, {
                    url: this.state.url
                });
                this.error();
            }
        }).finally(o$2);
    }
    headersReceived(status, headers, statusText = '') {
        if (!this.inFlight || this.committed) return;
        this.committed = true;
        this.status = status;
        this.statusText = statusText;
        this.headers = new Map(headers.map(([name, value])=>[
                name.toLowerCase(),
                value
            ]));
        this.readyState = 2;
        this.emit('readystatechange');
    }
    progress(loaded, total) {
        if (!this.inFlight || !this.committed) return;
        const now = performance.now();
        // Browsers dispatch progress roughly every 50ms
        if (now - this.lastProgressAt < 50) return;
        this.lastProgressAt = now;
        this.readyState = 3;
        if (this.emit('readystatechange')) this.emitProgress('progress', true, loaded, total);
    }
    done(body) {
        if (!this.inFlight || !this.committed) return;
        this.clearTimer();
        // A non-empty response always passes through LOADING
        if (this.readyState === 2) {
            this.readyState = 3;
            if (!this.emit('readystatechange')) return;
        }
        // Like Chrome: the final progress event already sees DONE
        const length = body.byteLength;
        this.body = body;
        this.readyState = 4;
        if (this.emitProgress('progress', true, length, length) && this.emit('readystatechange') && this.emitProgress('load', true, length, length)) this.emitProgress('loadend', true, length, length);
        this.ended = true;
    }
    error() {
        if (this.inFlight) this.fail('error', 'XMLHttpRequest failed', 'NetworkError');
    }
    /** The page aborted it */ abort() {
        if (this.inFlight) this.fail('abort', 'The user aborted a request.', 'AbortError');
        if (this.readyState === 4) {
            this.readyState = 0;
            this.status = 0;
            this.statusText = '';
            this.headers.clear();
            this.body = null;
        }
    }
    /** The XHR was re-opened: the request ends silently */ terminate() {
        this.ended = true;
        this.clearTimer();
        this.controller.abort(new unsafeWindow.DOMException('XMLHttpRequest re-opened', 'AbortError'));
    }
    /** Abort the responder, then the spec's "request error steps" */ fail(type, message, name) {
        this.controller.abort(new unsafeWindow.DOMException(message, name));
        this.clearTimer();
        this.readyState = 4;
        this.status = 0;
        this.statusText = '';
        this.headers.clear();
        this.body = null;
        if (this.emit('readystatechange') && this.emitProgress(type, false, 0, 0)) this.emitProgress('loadend', false, 0, 0);
        this.ended = true;
    }
    clearTimer() {
        if (this.timer !== null) {
            clearTimeout(this.timer);
            this.timer = null;
        }
    }
    /** @returns whether the request still goes on */ emit(type) {
        Reflect.apply(nativeDispatchEvent, this.xhr, [
            new unsafeWindow.Event(type)
        ]);
        return !this.ended;
    }
    /** @returns whether the request still goes on */ emitProgress(type, lengthComputable, loaded, total) {
        Reflect.apply(nativeDispatchEvent, this.xhr, [
            new unsafeWindow.ProgressEvent(type, {
                lengthComputable,
                loaded,
                total
            })
        ]);
        return !this.ended;
    }
}
const PatchedXMLHttpRequest = class extends NativeXMLHttpRequest {
    open(...$args) {
        blocked.delete(this);
        const previous = states.get(this)?.fake ?? null;
        let xhrArgs = $args;
        for (const onXhrOpen of xhrHooks.open)try {
            if (xhrArgs === null) break;
            xhrArgs = onXhrOpen(xhrArgs, this);
        } catch (e) {
            logger.error('Failed to replace P2P for XMLHttpRequest.prototype.open', e);
        }
        if (xhrArgs === null) {
            logger.debug('XHR aborted', {
                $args
            });
            previous?.terminate();
            states.delete(this);
            blocked.add(this);
            return;
        }
        // Throws on a bad method or URL, leaving the request in flight alone
        super.open(...xhrArgs);
        previous?.terminate();
        const [, finalUrl, asyncArg, username, password] = xhrArgs;
        let absoluteUrl;
        try {
            absoluteUrl = new URL(finalUrl, unsafeWindow.location.href).href;
        } catch  {
            absoluteUrl = typeof finalUrl === 'string' ? finalUrl : finalUrl.href;
        }
        states.set(this, {
            method: $args[0],
            originalUrl: $args[1],
            url: absoluteUrl,
            // An omitted `async` argument means true
            async: xhrArgs.length < 3 || Boolean(asyncArg),
            hasUrlCredentials: username != null || password != null,
            headers: [],
            nativeSent: false,
            fake: null,
            response: null,
            lastResponseLength: null
        });
        // The page saw the answered request leave OPENED, so it has to see it return
        if (previous && previous.readyState !== 1) Reflect.apply(nativeDispatchEvent, this, [
            new unsafeWindow.Event('readystatechange')
        ]);
    }
    setRequestHeader(name, value) {
        if (blocked.has(this)) return;
        const state = states.get(this);
        if (state?.fake) throw invalidState('Failed to execute \'setRequestHeader\' on \'XMLHttpRequest\': The object\'s state must be OPENED.');
        super.setRequestHeader(name, value);
        state?.headers.push([
            name.toLowerCase(),
            value
        ]);
    }
    send(body) {
        if (blocked.has(this)) return;
        const state = states.get(this);
        if (!state) return super.send(body);
        if (state.fake) throw invalidState('Failed to execute \'send\' on \'XMLHttpRequest\': The object\'s state must be OPENED.');
        if (state.nativeSent) {
            state.nativeSent = true;
            return super.send(body);
        }
        const ctx = {
            method: state.method.toUpperCase(),
            url: state.url,
            async: state.async,
            hasUrlCredentials: state.hasUrlCredentials,
            headers: state.headers,
            body,
            responseType: this.responseType,
            withCredentials: this.withCredentials
        };
        let responder = null;
        for (const onXhrSend of xhrHooks.send){
            try {
                responder = onXhrSend(ctx);
            } catch (e) {
                logger.error('Failed to call onXhrSend', e);
                responder = null;
            }
            if (responder) break;
        }
        if (responder && (ctx.responseType !== 'arraybuffer' || !ctx.async)) {
            logger.error('Only async arraybuffer XMLHttpRequest can be answered by a responder', {
                url: ctx.url
            });
            responder = null;
        }
        if (!responder) {
            state.nativeSent = true;
            return super.send(body);
        }
        state.fake = new SyntheticXhrSink(this, state);
        state.fake.start(responder);
    }
    abort() {
        const fake = states.get(this)?.fake;
        if (fake) fake.abort();
        else super.abort();
    }
    get readyState() {
        return states.get(this)?.fake?.readyState ?? super.readyState;
    }
    get status() {
        return states.get(this)?.fake?.status ?? super.status;
    }
    get statusText() {
        return states.get(this)?.fake?.statusText ?? super.statusText;
    }
    get responseURL() {
        const state = states.get(this);
        if (!state?.fake) return super.responseURL;
        return state.fake.status === 0 ? '' : state.url;
    }
    get response() {
        const state = states.get(this);
        if (state?.fake) return state.fake.readyState === 4 ? state.fake.body : null;
        const originalResponse = super.response;
        if (!state) return originalResponse;
        const responseLength = typeof originalResponse === 'string' ? originalResponse.length : null;
        if (state.lastResponseLength !== responseLength) {
            state.response = null;
            state.lastResponseLength = responseLength;
        }
        if (state.response !== null) return state.response;
        let finalResponse = originalResponse;
        for (const onXhrResponse of xhrHooks.response)try {
            finalResponse = onXhrResponse(state.method, state.originalUrl, finalResponse, this);
        } catch (e) {
            logger.error('Failed to call onXhrResponse', e);
        }
        state.response = finalResponse;
        return finalResponse;
    }
    get responseText() {
        // An answered request is always an arraybuffer one: the native getter throws for it
        if (states.get(this)?.fake) return super.responseText;
        const response = this.response;
        return typeof response === 'string' ? response : super.responseText;
    }
    getResponseHeader(name) {
        const fake = states.get(this)?.fake;
        if (!fake) return super.getResponseHeader(name);
        return fake.status === 0 ? null : fake.headers.get(name.toLowerCase()) ?? null;
    }
    getAllResponseHeaders() {
        const fake = states.get(this)?.fake;
        if (!fake) return super.getAllResponseHeaders();
        if (fake.status === 0) return '';
        // Sorted by name, like the spec's "sort and combine" (names are unique already)
        return Array.from(fake.headers.keys()).sort().map((name)=>`${name}: ${fake.headers.get(name)}\r\n`).join('');
    }
};
// Class members are non-enumerable, native XHR members are enumerable: without this, for...in
// over an XHR skips every member we override
const patchedKeys = Object.getOwnPropertyNames(PatchedXMLHttpRequest.prototype);
for(let i = 0, len = patchedKeys.length; i < len; i++){
    const key = patchedKeys[i];
    if (key === 'constructor') continue;
    Object.defineProperty(PatchedXMLHttpRequest.prototype, key, {
        enumerable: true
    });
    // Methods stringify like the native ones, for feature detection
    const value = Object.getOwnPropertyDescriptor(PatchedXMLHttpRequest.prototype, key)?.value;
    const native = Object.getOwnPropertyDescriptor(NativeXMLHttpRequest.prototype, key)?.value;
    if (typeof value === 'function' && typeof native === 'function') disguiseAsNative(value, native);
}
disguiseAsNative(PatchedXMLHttpRequest, NativeXMLHttpRequest);
function invalidState(message) {
    return new unsafeWindow.DOMException(message, 'InvalidStateError');
}((unsafeWindow1)=>{
    const modules = [
        defuseStorage,
        defuseSpyware,
        disableAV1,
        enhanceLive,
        fixCopyInCV,
        forceEnable4K,
        noAd,
        noP2P,
        noWebRTC,
        optimizeHomepage,
        optimizeStory,
        playerVideoFit,
        removeBlackBackdropFilter,
        removeUselessUrlParams,
        threadRipper,
        useSystemFonts
    ];
    const styles = [];
    const onBeforeFetchHooks = new Set();
    const onResponseHooks = new Set();
    /** Captured before fetch gets overridden below */ const nativeFetch = unsafeWindow1.fetch.bind(unsafeWindow1);
    const fnWs = new WeakSet();
    function onlyCallOnce(fn) {
        if (fnWs.has(fn)) return;
        fnWs.add(fn);
        fn();
    }
    const hook = {
        addStyle (style) {
            styles.push(style);
        },
        onBeforeFetch (cb) {
            onBeforeFetchHooks.add(cb);
        },
        onResponse (cb) {
            onResponseHooks.add(cb);
        },
        onXhrOpen (cb) {
            xhrHooks.open.add(cb);
        },
        onXhrResponse (cb) {
            xhrHooks.response.add(cb);
        },
        onXhrSend (cb) {
            xhrHooks.send.add(cb);
        },
        onlyCallOnce,
        nativeFetch,
        player
    };
    /** Always on, whatever is enabled: no-p2p and thread-ripper are its phases */ initPlayerInterceptor(hook);
    const hostname = unsafeWindow1.location.hostname;
    const pathname = unsafeWindow1.location.pathname;
    for(let i = 0, len = modules.length; i < len; i++){
        const mod = modules[i];
        const enabled = initModuleMenu(mod);
        if (!enabled) {
            logger.log(`[${mod.name}] disabled -- skipping`);
            continue;
        }
        if (mod.any) {
            logger.log(`[${mod.name}] "any" ${unsafeWindow1.location.href}`);
            mod.any(hook);
        }
        switch(hostname){
            case 'www.bilibili.com':
                if (pathname.startsWith('/read/cv')) {
                    if (mod.onCV) {
                        logger.log(`[${mod.name}] "onCV" ${unsafeWindow1.location.href}`);
                        mod.onCV(hook);
                    }
                } else if (pathname.startsWith('/video/')) {
                    if (mod.onVideo) {
                        logger.log(`[${mod.name}] "onVideo" ${unsafeWindow1.location.href}`);
                        mod.onVideo(hook);
                    }
                    if (mod.onVideoOrBangumi) {
                        logger.log(`[${mod.name}] "onVideoOrBangumi" ${unsafeWindow1.location.href}`);
                        mod.onVideoOrBangumi(hook);
                    }
                } else if (pathname.startsWith('/bangumi/play/')) {
                    if (mod.onVideo) {
                        logger.log(`[${mod.name}] "onVideo" ${unsafeWindow1.location.href}`);
                        mod.onVideo(hook);
                    }
                    if (mod.onBangumi) {
                        logger.log(`[${mod.name}] "onBangumi" ${unsafeWindow1.location.href}`);
                        mod.onBangumi(hook);
                    }
                    if (mod.onVideoOrBangumi) {
                        logger.log(`[${mod.name}] "onVideoOrBangumi" ${unsafeWindow1.location.href}`);
                        mod.onVideoOrBangumi(hook);
                    }
                }
                break;
            case 'live.bilibili.com':
                if (mod.onLive) {
                    logger.log(`[${mod.name}] "onLive" ${unsafeWindow1.location.href}`);
                    mod.onLive(hook);
                }
                break;
            case 't.bilibili.com':
                if (mod.onStory) {
                    logger.log(`[${mod.name}] "onStory" ${unsafeWindow1.location.href}`);
                    mod.onStory(hook);
                }
                break;
        }
    }
    // Add Style
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(styles.join('\n'));
    document.adoptedStyleSheets.push(sheet);
    // Override fetch
    (($fetch)=>{
        unsafeWindow1.fetch = async function(...$fetchArgs) {
            /** Each hook gets the arguments the previous one returned */ let fetchArgs = $fetchArgs;
            let mockResponse = null;
            let abortFetch = false;
            for (const onBeforeFetch of onBeforeFetchHooks)try {
                const result = onBeforeFetch(fetchArgs);
                if (result === null) {
                    abortFetch = true;
                    break;
                }
                if ('body' in result) {
                    abortFetch = true;
                    mockResponse = result;
                    break;
                }
                fetchArgs = result;
            } catch (e) {
                logger.error('Failed to replace fetcherArgs', e, {
                    fetchArgs
                });
            }
            if (abortFetch) {
                logger.debug('Fetch aborted', {
                    fetchArgs: $fetchArgs,
                    mockResponse
                });
                return mockResponse ?? new Response();
            }
            let response = await Reflect.apply($fetch, this, fetchArgs);
            for (const onResponse of onResponseHooks)// eslint-disable-next-line no-await-in-loop -- hook
            response = await onResponse(response, fetchArgs, $fetch);
            return response;
        };
        // Polyfills and feature detection test fetch for `[native code]` (e.g. Sentry's `isNativeFetch`)
        // eslint-disable-next-line @typescript-eslint/unbound-method -- only stringified
        disguiseAsNative(unsafeWindow1.fetch, $fetch);
    // eslint-disable-next-line @typescript-eslint/unbound-method -- cache original method
    })(unsafeWindow1.fetch);
    unsafeWindow1.XMLHttpRequest = PatchedXMLHttpRequest;
})(unsafeWindow);})();