import { readFileSync } from "node:fs";
import { context, build } from "esbuild";

const manifest = JSON.parse(
  readFileSync(new URL("../custom_components/chronothermostat/manifest.json", import.meta.url), "utf8"),
);

const options = {
  entryPoints: ["src/index.ts"],
  outfile: "../custom_components/chronothermostat/frontend/chronothermostat-cards.js",
  bundle: true,
  minify: true,
  format: "esm",
  target: "es2019",
  legalComments: "none",
  banner: { js: `/*! chronothermostat-cards v${manifest.version} */` },
  logLevel: "info",
};

if (process.argv.includes("--watch")) {
  const ctx = await context(options);
  await ctx.watch();
} else {
  await build(options);
}
