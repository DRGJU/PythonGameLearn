/**
 * 生成分享图片卡片（PNG），可直接发微信 / 朋友圈。
 * 二维码由权威 API 生成 PNG，卡片底图用 sharp 渲染 SVG，再用 composite 合成。
 *
 * 用法：node tools/generate-share-card.mjs
 * 依赖：../astro-poc/node_modules/sharp（仓库内已有，无需 npm install）
 */
import { writeFileSync, unlinkSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const sharp = require(path.join(ROOT, '..', 'astro-poc', 'node_modules', 'sharp'));

const SHARE_URL = 'https://drgju.github.io/PythonGameLearn/share.html';
const W = 1200;
const H = 675;

async function getQrPng(size) {
  const url = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(SHARE_URL)}&ecc=M&margin=0&format=png&color=060910&bgcolor=ffffff`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`二维码 API 失败: HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.subarray(0, 8).toString('hex') !== '89504e470d0a1a0a') throw new Error('二维码不是有效 PNG');
  return buf;
}

async function main() {
  const qrPath = path.join(ROOT, '_qr_tmp.png');
  const qrPng = await getQrPng(440);
  writeFileSync(qrPath, qrPng);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="'Microsoft YaHei','PingFang SC','Noto Sans CJK SC',sans-serif">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#060910"/><stop offset="0.55" stop-color="#0b1220"/><stop offset="1" stop-color="#0a1622"/>
    </linearGradient>
    <linearGradient id="glow" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#22d3ee" stop-opacity="0"/><stop offset="0.5" stop-color="#22d3ee" stop-opacity="0.9"/><stop offset="1" stop-color="#22d3ee" stop-opacity="0"/>
    </linearGradient>
    <pattern id="grid" width="56" height="56" patternUnits="userSpaceOnUse">
      <path d="M56 0H0V56" fill="none" stroke="#e9eef6" stroke-opacity="0.045" stroke-width="1"/>
    </pattern>
    <radialGradient id="aura" cx="0.18" cy="0.05" r="0.7">
      <stop offset="0" stop-color="#22d3ee" stop-opacity="0.18"/><stop offset="1" stop-color="#22d3ee" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#aura)"/>
  <rect width="${W}" height="${H}" fill="url(#grid)"/>
  <rect x="0" y="0" width="${W}" height="2" fill="url(#glow)"/>

  <g transform="translate(72,64)">
    <rect width="40" height="40" rx="10" fill="#0f1726" stroke="#0e7490" stroke-width="1.5"/>
    <text x="20" y="27" text-anchor="middle" font-size="17" font-weight="700" fill="#22d3ee" font-family="Consolas,monospace">PY</text>
    <text x="56" y="27" font-size="21" font-weight="600" fill="#e9eef6">Python 系统化课程</text>
    <text x="1000" y="27" text-anchor="end" font-size="15" fill="#6b7a90" font-family="Consolas,monospace">v6.2.0</text>
  </g>

  <text x="72" y="196" font-size="56" font-weight="700" fill="#e9eef6">30 节教程，</text>
  <text x="72" y="264" font-size="56" font-weight="700" fill="#22d3ee">把 Python 真正学会。</text>
  <text x="72" y="316" font-size="22" fill="#aab6c8">6 章系统课程 · 先讲清原理，再用真实 Python 验证理解</text>

  <g transform="translate(72,356)">
    <line x1="0" y1="-8" x2="720" y2="-8" stroke="#2c3e56" stroke-width="1"/>
    ${[['6','章'],['30','节'],['6.2 万','字教程'],['15','小时']].map(([v,l],i)=>`
    <g transform="translate(${i*180},0)">
      <text x="0" y="42" font-size="40" font-weight="700" fill="#22d3ee" font-family="Consolas,monospace">${v}</text>
      <text x="2" y="70" font-size="16" fill="#6b7a90">${l}</text>
    </g>`).join('')}
    <line x1="0" y1="92" x2="720" y2="92" stroke="#2c3e56" stroke-width="1"/>
  </g>

  <g transform="translate(72,500)" font-size="19" fill="#aab6c8">
    <text x="0" y="0">· 60 个示例均经 python3 实跑校验</text>
    <text x="0" y="36">· 每节一种答题方式，浏览器内真实运行</text>
    <text x="0" y="72">· 无需安装环境，打开网页即可学习</text>
  </g>

  <g transform="translate(852,338)">
    <rect x="-14" y="-14" width="248" height="248" rx="16" fill="#f6f9fc"/>
    <text x="110" y="258" text-anchor="middle" font-size="16" fill="#aab6c8">扫码打开分享页</text>
  </g>

  <text x="72" y="632" font-size="15" fill="#6b7a90">纯前端 · 打开网页即可学习 · 进度保存在本机浏览器</text>
</svg>`;

  const qrResized = await sharp(qrPng).resize(220, 220, { fit: 'fill' }).png().toBuffer();
  const base = await sharp(Buffer.from(svg)).png().toBuffer();
  const out = path.join(ROOT, 'share-card.png');
  await sharp(base)
    .composite([{ input: qrResized, left: 870, top: 356 }])
    .png()
    .toFile(out);

  unlinkSync(qrPath);
  const info = await sharp(out).metadata();
  console.log(`已生成 ${out}（${info.width}×${info.height}）`);
}

main().catch((e) => { console.error('生成失败:', e.message); process.exit(1); });
