import assert from "node:assert/strict";
import { test } from "node:test";
import type { spawnSync } from "node:child_process";
import { installed } from "./agents.js";

function fakeSpawnSync(calls: string[]): typeof spawnSync {
  return ((cmd: string) => {
    calls.push(cmd);
    return { status: 0 } as ReturnType<typeof spawnSync>;
  }) as typeof spawnSync;
}

test("installed() uses `where` on win32 and `which` elsewhere", () => {
  const platform = Object.getOwnPropertyDescriptor(process, "platform")!;
  try {
    const winCalls: string[] = [];
    Object.defineProperty(process, "platform", { value: "win32" });
    installed("claude", fakeSpawnSync(winCalls));
    assert.deepEqual(winCalls, ["where"]);

    const posixCalls: string[] = [];
    Object.defineProperty(process, "platform", { value: "darwin" });
    installed("claude", fakeSpawnSync(posixCalls));
    assert.deepEqual(posixCalls, ["which"]);
  } finally {
    Object.defineProperty(process, "platform", platform);
  }
});
