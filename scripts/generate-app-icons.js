// One-off script to rasterize the SDH logo (components/appLogo) into the
// PNG assets Expo expects. Run with: node scripts/generate-app-icons.js
const sharp = require("sharp");
const path = require("path");

const GREEN = "#0f4c3a";
const PINK = "#ec4899";

const OUT = (name) => path.join(__dirname, "..", "assets", "images", name);

// Same house+heart mark as components/appLogo/index.tsx, plain SVG source.
const markPaths = `
  <path d="M50 18 L82 48 L82 82 L18 82 L18 48 Z" fill="#FFFFFF" />
  <path d="M50 72
           C50 72 34 60 34 50
           C34 44 38 40 43 40
           C46.5 40 49 42 50 45
           C51 42 53.5 40 57 40
           C62 40 66 44 66 50
           C66 60 50 72 50 72 Z" fill="${PINK}" />
`;

const monoMarkPaths = `
  <path d="M50 18 L82 48 L82 82 L18 82 L18 48 Z" fill="#FFFFFF" />
  <path d="M50 72
           C50 72 34 60 34 50
           C34 44 38 40 43 40
           C46.5 40 49 42 50 45
           C51 42 53.5 40 57 40
           C62 40 66 44 66 50
           C66 60 50 72 50 72 Z" fill="#FFFFFF" />
`;

const svgIcon = `
<svg width="1024" height="1024" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <rect x="0" y="0" width="100" height="100" fill="${GREEN}" />
  ${markPaths}
</svg>`;

const svgForeground = `
<svg width="1024" height="1024" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  ${markPaths}
</svg>`;

const svgMonochrome = `
<svg width="1024" height="1024" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  ${monoMarkPaths}
</svg>`;

const svgBackground = `
<svg width="1024" height="1024" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <rect x="0" y="0" width="100" height="100" fill="${GREEN}" />
</svg>`;

const svgSplash = `
<svg width="512" height="512" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <rect x="0" y="0" width="100" height="100" rx="24" fill="${GREEN}" />
  ${markPaths}
</svg>`;

const svgFavicon = `
<svg width="196" height="196" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <rect x="0" y="0" width="100" height="100" rx="24" fill="${GREEN}" />
  ${markPaths}
</svg>`;

async function run() {
  await sharp(Buffer.from(svgIcon)).resize(1024, 1024).png().toFile(OUT("icon.png"));
  await sharp(Buffer.from(svgForeground)).resize(1024, 1024).png().toFile(OUT("android-icon-foreground.png"));
  await sharp(Buffer.from(svgMonochrome)).resize(1024, 1024).png().toFile(OUT("android-icon-monochrome.png"));
  await sharp(Buffer.from(svgBackground)).resize(1024, 1024).png().toFile(OUT("android-icon-background.png"));
  await sharp(Buffer.from(svgSplash)).resize(512, 512).png().toFile(OUT("splash-icon.png"));
  await sharp(Buffer.from(svgFavicon)).resize(196, 196).png().toFile(OUT("favicon.png"));
  console.log("Generated icon assets in assets/images/");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
