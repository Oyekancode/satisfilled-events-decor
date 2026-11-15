// Builds the site icons from the round monogram in public/images/logo.png:
//   app/icon.png        512x512, transparent corners (tab icon, Google, Android)
//   app/apple-icon.png  180x180, opaque cream background (iOS home screen)
//   app/favicon.ico     16/32/48 px, transparent corners (classic favicon)
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const logoPath = path.join(projectDir, "public/images/logo.png");
const appDir = path.join(projectDir, "app");

const meta = await sharp(logoPath).metadata();

// The monogram circle sits in the top ~64% of the logo; the wordmark is below.
// (Two separate steps: sharp would otherwise trim before it crops.)
const topRegion = await sharp(logoPath)
  .extract({
    left: 0,
    top: 0,
    width: meta.width,
    height: Math.round(meta.height * 0.635),
  })
  .toBuffer();
const monogramRegion = await sharp(topRegion).trim().toBuffer();

const trimmedMeta = await sharp(monogramRegion).metadata();
console.log(`monogram: ${trimmedMeta.width}x${trimmedMeta.height}`);

function circleMask(size) {
  return Buffer.from(
    `<svg width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="#fff"/></svg>`
  );
}

async function transparentCircle(size) {
  return sharp(monogramRegion)
    .resize(size, size, { fit: "cover" })
    .composite([{ input: circleMask(size), blend: "dest-in" }])
    .png()
    .toBuffer();
}

// icon.png
const icon512 = await transparentCircle(512);
fs.writeFileSync(path.join(appDir, "icon.png"), icon512);

// apple-icon.png: iOS wants an opaque square, so sit the circle on cream.
const appleSize = 180;
const inner = Math.round(appleSize * 0.82);
const appleCircle = await transparentCircle(inner);
await sharp({
  create: {
    width: appleSize,
    height: appleSize,
    channels: 4,
    background: "#fdf6f2",
  },
})
  .composite([{ input: appleCircle, gravity: "center" }])
  .png()
  .toFile(path.join(appDir, "apple-icon.png"));

// favicon.ico (PNG-compressed entries, supported by all current browsers)
const icoSizes = [16, 32, 48];
const pngs = await Promise.all(icoSizes.map((s) => transparentCircle(s)));
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(icoSizes.length, 4);

let offset = 6 + 16 * icoSizes.length;
const entries = icoSizes.map((s, i) => {
  const e = Buffer.alloc(16);
  e.writeUInt8(s, 0);
  e.writeUInt8(s, 1);
  e.writeUInt8(0, 2);
  e.writeUInt8(0, 3);
  e.writeUInt16LE(1, 4);
  e.writeUInt16LE(32, 6);
  e.writeUInt32LE(pngs[i].length, 8);
  e.writeUInt32LE(offset, 12);
  offset += pngs[i].length;
  return e;
});
fs.writeFileSync(
  path.join(appDir, "favicon.ico"),
  Buffer.concat([header, ...entries, ...pngs])
);

console.log("Wrote app/icon.png, app/apple-icon.png, app/favicon.ico");
