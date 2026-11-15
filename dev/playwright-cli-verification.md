# 用 playwright-cli 在真实 Chrome 里验证

不装 Tampermonkey，也能把构建出来的用户脚本以 `document-start` 注入真实 Chrome，验证
CDN 路由、CDN 选择面板和播放器「统计信息」面板。

适用于验证 `src/core/player/*`、`src/utils/cdn-*`、`src/utils/player-info-sync.ts` 这类
依赖真实 B 站播放器行为的改动。

## 前置

- Node.js（见 `.node-version`）与 pnpm
- `playwright-cli`（本机经 mise 安装，走 Chrome channel）
- 一个可播放的 B 站视频（未登录也能看 360P；示例用 `BV1QzVR63E3L`）

## 步骤

### 1. 构建并起本地静态服务

```bash
pnpm install
pnpm build

# 在仓库根目录另开一个终端，把构建产物挂到 8093 端口
node -e "const http=require('http'),fs=require('fs');const p='dist/make-bilibili-great-than-ever-before.user.js';http.createServer((q,s)=>{s.setHeader('content-type','application/javascript; charset=utf-8');s.end(fs.readFileSync(p));}).listen(8093,'127.0.0.1',()=>console.log('serving'))"
```

### 2. 启动 Chrome 会话

```bash
playwright-cli open --browser=chrome about:blank
# 需要肉眼观察时加 --headed
```

### 3. 写入注入脚本 `.pw-inject.js`

`run-code` 里没有 `require`，但可用 `fetch`；先把脚本拉下来，再和 GM 桩一起挂到
`addInitScript`，保证在页面任何脚本之前执行。

```js
async page => {
  const bundle = await (await fetch('http://127.0.0.1:8093/')).text();
  const prelude = `window.unsafeWindow = window;
window.__mbgtbeMenu = {};
(function () {
  // 主世界注入时 disable-storage 的 localStorage mock 会自递归，测试中先禁用该模块
  var store = { 'mbgtbemodule:disable-storage': false };
  window.GM_getValue = function (k, d) { return Object.prototype.hasOwnProperty.call(store, k) ? store[k] : d; };
  window.GM_setValue = function (k, v) { store[k] = v; };
  window.GM_deleteValue = function (k) { delete store[k]; };
  window.GM = {
    getValue: window.GM_getValue,
    setValue: window.GM_setValue,
    deleteValue: window.GM_deleteValue,
    listValues: function () { return Object.assign({}, store); },
    registerMenuCommand: function (label, fn) { window.__mbgtbeMenu[label] = fn; },
    unregisterMenuCommand: function (label) { delete window.__mbgtbeMenu[label]; },
    notification: function () {}
  };
})();`;
  await page.addInitScript({ content: prelude + '\n' + bundle });
  await page.goto('https://www.bilibili.com/video/BV1QzVR63E3L/', { waitUntil: 'domcontentloaded', timeout: 60000 });
  return { injectedBytes: bundle.length };
}
```

```bash
playwright-cli --raw run-code --filename=.pw-inject.js
```

### 4. 确认脚本完整加载

```bash
# 菜单里应出现全部模块，且有「选择 CDN 节点」；PCDNLoader 应已被 mock
playwright-cli --raw eval "JSON.stringify({ menus: Object.keys(window.__mbgtbeMenu||{}), pcdn: (()=>{const d=Object.getOwnPropertyDescriptor(window,'PCDNLoader');return d?{type:typeof window.PCDNLoader,w:d.writable}:null})() })"
```

### 5. 选择 CDN 并确认实际路由

```bash
# 打开面板（面板在 Shadow DOM 里）
playwright-cli --raw eval "(()=>{window.__mbgtbeMenu['选择 CDN 节点']();const sr=document.getElementById('mbgtbe-cdn-selector-panel').shadowRoot;return JSON.stringify(Array.from(sr.querySelectorAll('input[type=radio]')).map(r=>r.value));})()"

# 选中一个节点（change 事件即触发记忆与路由）
playwright-cli --raw eval "(()=>{const sr=document.getElementById('mbgtbe-cdn-selector-panel').shadowRoot;const r=sr.querySelector('input[value=\"upos-sz-mirrorali.bilivideo.com\"]');r.checked=true;r.dispatchEvent(new Event('change',{bubbles:true}));const st=sr.querySelector('.status').textContent;sr.querySelector('button.close').click();return st;})()"

# 播放几秒后看请求落在哪台主机
playwright-cli --raw eval "JSON.stringify(Array.from(new Set(performance.getEntriesByType('resource').filter(e=>/bilivideo/.test(e.name)).slice(-10).map(e=>new URL(e.name).hostname))))"
```

### 6. 打开播放器「统计信息」并读取 Host

右键菜单用 JS 派发 `contextmenu` 最稳，再点菜单项：

```bash
playwright-cli --raw eval "(()=>{const el=document.querySelector('.bpx-player-video-wrap')||document.querySelector('video');el.dispatchEvent(new MouseEvent('contextmenu',{bubbles:true,cancelable:true,clientX:450,clientY:374,button:2,buttons:2}));return JSON.stringify(Array.from(document.querySelectorAll('.bpx-player-contextmenu li')).map(l=>l.textContent.trim()));})()"

playwright-cli --raw eval "(()=>{const li=Array.from(document.querySelectorAll('.bpx-player-contextmenu li')).find(e=>e.textContent.trim()==='视频统计信息');const o={bubbles:true,cancelable:true,view:window};li.dispatchEvent(new MouseEvent('mousedown',o));li.dispatchEvent(new MouseEvent('mouseup',o));li.dispatchEvent(new MouseEvent('click',o));return 'clicked';})()"

playwright-cli --raw eval "JSON.stringify(Array.from(document.querySelectorAll('.bpx-player-info-panel .info-line')).map(l=>({t:l.querySelector('.info-title').textContent.trim(),v:l.querySelector('.info-data').textContent.trim()})).filter(x=>/Host/.test(x.t)))"
```

预期：`Video Host` / `Audio Host` 与上一步选中的主机一致；再切一个节点，恢复播放后
会跟着变。

### 7. 清理

```bash
playwright-cli close      # 结束会话
# 手动停掉 8093 端口上的 node 进程
rm -f .pw-inject.js
```

## 已知坑

- **主世界注入 vs 油猴隔离世界**：Tampermonkey 里 `localStorage` 是隔离世界的独立绑定，
  而主世界注入时 `disable-storage` 模块会把 `window.localStorage` 换成 mock，mock 的
  `length` getter 又读全局 `localStorage.length`，形成自递归、模块循环中断。这是测试
  环境差异，不是脚本 bug；测试时用 GM 桩把 `mbgtbemodule:disable-storage` 置为 `false`。
- **GM 桩是内存存储**：`GM_setValue` 不落盘，`localStorage` 里看不到偏好（属于预期）。
- **暂停时不会有新请求**：打开右键菜单/统计面板可能让视频暂停；要验证主机切换，先
  `document.querySelector('video').play()` 恢复播放，再等几秒。
- **右键菜单**：`playwright-cli mousedown right` 在当前播放器上不一定触发菜单，用 JS
  派发 `contextmenu` 更可靠。
- **headless 也能跑**：媒体请求和面板渲染都正常；需要人工查看时用 `--headed`。
- **临时文件**：`.pw-inject.js`、截图、`playwright-cli` 生成的 `.playwright-cli/` 不要提交。
