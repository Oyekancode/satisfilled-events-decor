import sharp from "sharp";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const bgPath = path.join(projectDir, "public/images/decor-bearly-wait.jpg");
const logoPath = path.join(projectDir, "public/images/logo.png");
const outPath = path.join(projectDir, "app/opengraph-image.jpg");

const WIDTH = 1200;
const HEIGHT = 630;

const bg = await sharp(bgPath)
  .resize(WIDTH, HEIGHT, { fit: "cover", position: "attention" })
  .toBuffer();

const scrimSvg = `
<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0" y1="1" x2="0" y2="0">
      <stop offset="0%" stop-color="#560821" stop-opacity="0.92"/>
      <stop offset="55%" stop-color="#560821" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#560821" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#g)"/>
</svg>`;

const textSvg = `
<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <text x="230" y="500" font-family="Georgia, 'Times New Roman', serif" font-size="56" font-weight="700" fill="#fdf6f2">SatisFilled Events &amp; Decor</text>
  <text x="230" y="548" font-family="Arial, sans-serif" font-size="26" letter-spacing="1" fill="#f6e2e6">BALLOON DECOR &#183; EVENT STYLING</text>
  <text x="230" y="584" font-family="Arial, sans-serif" font-size="24" fill="#f6e2e6">Prague, Czech Republic &#8212; satisfilled.com</text>
</svg>`;

const logoBadgeSize = 150;
const logo = await sharp(logoPath)
  .resize(logoBadgeSize, logoBadgeSize, { fit: "cover" })
  .composite([
    {
      input: Buffer.from(
        `<svg width="${logoBadgeSize}" height="${logoBadgeSize}"><circle cx="${logoBadgeSize / 2}" cy="${logoBadgeSize / 2}" r="${logoBadgeSize / 2}" fill="#fff"/></svg>`
      ),
      blend: "dest-in",
    },
  ])
  .png()
  .toBuffer();

await sharp(bg)
  .composite([
    { input: Buffer.from(scrimSvg), top: 0, left: 0 },
    { input: logo, top: HEIGHT - logoBadgeSize - 40, left: 40 },
    { input: Buffer.from(textSvg), top: 0, left: 0 },
  ])
  .jpeg({ quality: 85 })
  .toFile(outPath);

console.log("Written:", outPath);
