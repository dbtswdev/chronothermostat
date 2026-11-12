import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { context, build } from "esbuild";

const here = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(here, "../custom_components/chronothermostat/frontend");
const NOTICES = "THIRD-PARTY-NOTICES.txt";

const manifest = JSON.parse(
  readFileSync(path.join(here, "../custom_components/chronothermostat/manifest.json"), "utf8"),
);

const options = {
  entryPoints: ["src/index.ts"],
  outfile: path.join(outDir, "chronothermostat-cards.js"),
  bundle: true,
  minify: true,
  format: "esm",
  target: "es2019",
  // The licence headers of bundled packages stay in the file, at its end.
  legalComments: "eof",
  banner: {
    js: `/*! chronothermostat-cards v${manifest.version} | third-party licences: ${NOTICES} */`,
  },
  metafile: true,
  logLevel: "info",
};

/** The npm packages whose code is in the bundle: [{ name, version, license, text }]. */
function bundledPackages(metafile) {
  const packages = new Map();
  for (const input of Object.keys(metafile.inputs)) {
    const at = input.lastIndexOf("node_modules/");
    if (at < 0) continue;
    const parts = input.slice(at + "node_modules/".length).split("/");
    const name = parts[0].startsWith("@") ? `${parts[0]}/${parts[1]}` : parts[0];
    if (packages.has(name)) continue;
    const root = path.join(here, input.slice(0, at), "node_modules", name);
    const pkg = JSON.parse(readFileSync(path.join(root, "package.json"), "utf8"));
    const file = ["LICENSE", "LICENSE.md", "LICENSE.txt"]
      .map((candidate) => path.join(root, candidate))
      .find((candidate) => existsSync(candidate));
    if (!file) throw new Error(`No licence file found for bundled package ${name}`);
    packages.set(name, {
      name,
      version: pkg.version,
      license: pkg.license,
      text: readFileSync(file, "utf8").replace(/\r\n/g, "\n").trim(),
    });
  }
  return [...packages.values()].sort((a, b) => a.name.localeCompare(b.name));
}

/** Write the licences of the bundled packages next to the bundle, identical texts once. */
function writeNotices(metafile) {
  const byText = new Map();
  for (const pkg of bundledPackages(metafile)) {
    const group = byText.get(pkg.text) ?? [];
    group.push(`${pkg.name}@${pkg.version} (${pkg.license})`);
    byText.set(pkg.text, group);
  }
  const sections = [...byText].map(
    ([text, names]) => `${names.join("\n")}\n\n${text}\n`,
  );
  const header =
    "chronothermostat-cards.js contains code from the packages below,\n" +
    "distributed under their own licences.\n";
  const rule = `\n${"-".repeat(72)}\n\n`;
  writeFileSync(path.join(outDir, NOTICES), [header, ...sections].join(rule));
}

if (process.argv.includes("--watch")) {
  const ctx = await context(options);
  await ctx.watch();
} else {
  const result = await build(options);
  writeNotices(result.metafile);
}
