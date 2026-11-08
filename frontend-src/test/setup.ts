// Tests load Lit's development build: keep its other warnings, silence the "dev mode" banner.
(globalThis as { litIssuedWarnings?: Set<string> }).litIssuedWarnings = new Set(["dev-mode"]);
