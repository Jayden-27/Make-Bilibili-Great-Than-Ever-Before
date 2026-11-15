/** The upstream CDN vendor behind a Bilibili host, as its DNS CNAME shows */
const VENDOR_RULES: ReadonlyArray<readonly [string, string]> = [
  ['mirroraliov', '七牛云'], // queniuaa.com
  ['mirrorali', '阿里云'], // kunluncan.com
  ['mirrorhw', '华为云'], // cdnhwc1.com
  ['mirror08c', '华为云'], // cdnhwc1.com
  ['mirrorbos', '百度云'], // bdydns.com
  ['mirrorbd', '百度云'], // bdydns.com
  ['mirrorcos', '腾讯云'], // cdn.dnsv1.com, eo.dnse0.com
  ['mirrorzos', '天翼云'], // ctadns.cn
  ['mirrorks3', '金山云'],
  ['mirrorkodo', '七牛云'],
  ['mirrorwcs', '网宿'], // wsdvs.com
  ['mirrorxycdn', '迅雷'],
  ['mirrorasiaov', 'Asia-ISP（香港）'], // cy-isp.com
  ['upcdnbd', '百度云'], // bdydns.com
  ['upcdnhw', '华为云'], // cdnhwc1.com
  ['upcdntx', '腾讯云'],
  ['upcdnws', '网宿'], // wsglb0.com
  ['estgoss', '阿里云'], // aliyuncs.com
  ['estghw', '华为云'], // cdnhwcggk22.com
  ['estgcos', '腾讯云'] // myqcloud.com
];

export function cdnVendorOf(hostname: string): string | null {
  if (hostname.startsWith('cn-')) {
    return 'B站自建';
  }
  for (let i = 0, len = VENDOR_RULES.length; i < len; i++) {
    if (hostname.includes(VENDOR_RULES[i][0])) {
      return VENDOR_RULES[i][1];
    }
  }
  return null;
}
