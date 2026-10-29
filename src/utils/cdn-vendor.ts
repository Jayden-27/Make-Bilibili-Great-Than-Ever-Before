/** The upstream CDN vendor behind a Bilibili mirror host, as its DNS CNAME shows */
const VENDOR_RULES: ReadonlyArray<readonly [RegExp, string]> = [
  [/^upos-sz-mirroraliov\./, '七牛云'],
  [/^upos-sz-mirrorali\./, '阿里云'],
  [/^upos-sz-mirrorhwo1\./, '华为云'],
  [/^upos-sz-mirrorhw\./, '华为云'],
  [/^upos-sz-mirror08c\./, '华为云'],
  [/^upos-sz-mirrorbos\./, '百度云'],
  [/^upos-sz-mirrorbd\./, '百度云'],
  [/^upos-sz-mirrorcosb\./, '腾讯云'],
  [/^upos-sz-mirrorcoso1\./, '腾讯云'],
  [/^upos-sz-mirrorcosov\./, '腾讯云'],
  [/^upos-sz-mirrorcos\./, '腾讯云'],
  [/^upos-sz-mirrorzos\./, '腾讯云'],
  [/^upos-sz-estgoss\./, '阿里云'],
  [/^cn-/, 'B站自建']
];

export function cdnVendorOf(hostname: string): string | null {
  for (let i = 0, len = VENDOR_RULES.length; i < len; i++) {
    if (VENDOR_RULES[i][0].test(hostname)) {
      return VENDOR_RULES[i][1];
    }
  }
  return null;
}
