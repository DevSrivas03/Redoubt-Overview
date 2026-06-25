const fs = require("fs");
const path = require("path");
const https = require("https");

const CDN_BASE = "https://cdn.dev.exigernext.com/design-system";
const OUT_DIR = path.join(__dirname, "..", "public", "design-system");
const DIST_DIR = path.join(__dirname, "..", "dist", "design-system");

function fetch(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        if (res.statusCode !== 200) {
          reject(new Error(`Failed to fetch ${url}: HTTP ${res.statusCode}`));
          return;
        }

        const chunks = [];
        res.on("data", (chunk) => chunks.push(chunk));
        res.on("end", () => resolve(Buffer.concat(chunks)));
      })
      .on("error", reject);
  });
}

function collectJsAssets(manifest) {
  const files = new Set(["ds.js"]);

  for (const expose of manifest.exposes || []) {
    const jsAssets = expose.assets?.js || {};
    for (const kind of ["sync", "async"]) {
      for (const file of jsAssets[kind] || []) {
        files.add(file);
      }
    }
  }

  return files;
}

async function syncDesignSystem() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const manifestBuffer = await fetch(`${CDN_BASE}/mf-manifest.json`);
  const manifest = JSON.parse(manifestBuffer.toString("utf8"));
  fs.writeFileSync(path.join(OUT_DIR, "mf-manifest.json"), manifestBuffer);

  const files = collectJsAssets(manifest);
  await Promise.all(
    [...files].map(async (file) => {
      const data = await fetch(`${CDN_BASE}/${file}`);
      fs.writeFileSync(path.join(OUT_DIR, file), data);
      console.log(`Synced ${file}`);
    }),
  );

  console.log(`Design System mirrored to ${OUT_DIR}`);
}

function copyToDist() {
  if (!fs.existsSync(OUT_DIR)) {
    throw new Error("Missing public/design-system. Run sync first.");
  }

  fs.mkdirSync(path.dirname(DIST_DIR), { recursive: true });
  fs.cpSync(OUT_DIR, DIST_DIR, { recursive: true });

  const indexPath = path.join(__dirname, "..", "dist", "index.html");
  if (fs.existsSync(indexPath)) {
    fs.copyFileSync(indexPath, path.join(__dirname, "..", "dist", "404.html"));
  }

  console.log(`Copied Design System to ${DIST_DIR}`);
}

async function main() {
  await syncDesignSystem();

  if (process.argv.includes("--copy-to-dist")) {
    copyToDist();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
