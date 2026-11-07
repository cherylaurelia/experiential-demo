import { test } from "node:test";
import assert from "node:assert/strict";
import { refusalText, seconds, thousands, toolLine } from "./runs.ts";

test("toolLine shows the command for Bash and the file name for file tools", () => {
  assert.equal(toolLine("Bash", { command: "python3 test_prices.py" }), "Bash(python3 test_prices.py)");
  assert.equal(toolLine("Read", { file_path: "/private/tmp/cc-task/prices.py" }), "Read(prices.py)");
  assert.equal(toolLine("Write", {}), "Write()");
});

test("seconds rounds milliseconds", () => {
  assert.equal(seconds(39_828), "40 s");
});

test("refusalText keeps only the gateway's message", () => {
  assert.equal(
    refusalText("API Error: 400 The capability 'tools' is not supported. (param: tools)"),
    "The capability 'tools' is not supported.",
  );
  assert.equal(refusalText("plain"), "plain");
});

test("thousands", () => {
  assert.equal(thousands(90428), "90,428");
});
