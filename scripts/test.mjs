// Runs every dist/*.test.js with node's test runner. The file list is built
// here instead of with a shell glob, because cmd and PowerShell don't expand
// globs, and node only expands them itself from v21 on.
import { readdirSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const files = readdirSync("dist")
  .filter((name) => name.endsWith(".test.js"))
  .sort()
  .map((name) => join("dist", name));

if (files.length === 0) {
  console.error("No dist/*.test.js files found. Did tsc run?");
  process.exit(1);
}

const result = spawnSync(process.execPath, ["--test", ...files], { stdio: "inherit" });
process.exit(result.status ?? 1);
