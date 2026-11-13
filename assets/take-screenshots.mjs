// Takes one screenshot per Catppuccin flavor of the web app with the sample dataset,
// for the README previews. Requires the web dev server (`yarn web:serve`) on port 8080.
//
//   node assets/take-screenshots.mjs
//   catwalk -C assets latte.webp frappe.webp macchiato.webp mocha.webp -o preview.webp

import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const ASSETS = path.dirname(fileURLToPath(import.meta.url));
const URL = process.env.LICHTBLICK_URL ?? "http://localhost:8080/?ds=sample-nuscenes";
const FLAVORS = ["latte", "frappe", "macchiato", "mocha"];
const ACCENT = "mauve";
const LOAD_SECONDS = 25;
const PLAY_SECONDS = 6;

const tmp = mkdtempSync(path.join(tmpdir(), "lichtblick-shots-"));
// Uses the installed Google Chrome; set PLAYWRIGHT_CHANNEL="" to use Playwright's own Chromium.
const channel = process.env.PLAYWRIGHT_CHANNEL ?? "chrome";
const browser = await chromium.launch({ channel: channel || undefined });
try {
  for (const flavor of FLAVORS) {
    const context = await browser.newContext({
      viewport: { width: 1600, height: 1000 },
      deviceScaleFactor: 1,
    });
    await context.addInitScript(
      ([f, a]) => {
        localStorage.setItem("studio.app-configuration.catppuccin.flavor", JSON.stringify(f));
        localStorage.setItem("studio.app-configuration.catppuccin.accent", JSON.stringify(a));
      },
      [flavor, ACCENT],
    );
    const page = await context.newPage();
    await page.goto(URL);
    // The sample streams from a remote file, so give it time to load.
    await page.getByTestId("AppMenuButton").waitFor();
    await page.waitForTimeout(LOAD_SECONDS * 1000);

    // Show the lidar point cloud in the 3D panel (the first panel's settings).
    await page.getByRole("button", { name: "Settings" }).first().click();
    await page.getByPlaceholder("Type to filter…").fill("LIDAR_TOP");
    await page.locator('[title="Toggle visibility"]').first().click();

    // Play a few seconds so every panel has data, then pause.
    await page.getByTestId("play-button").click();
    await page.waitForTimeout(PLAY_SECONDS * 1000);
    await page.getByTestId("play-button").click();
    await page.mouse.move(0, 0);
    await page.waitForTimeout(2000);

    const png = path.join(tmp, `${flavor}.png`);
    await page.screenshot({ path: png });
    execFileSync("magick", [png, "-quality", "90", path.join(ASSETS, `${flavor}.webp`)]);
    console.log(`${flavor}.webp`);
    await context.close();
  }
} finally {
  await browser.close();
  rmSync(tmp, { recursive: true, force: true });
}
