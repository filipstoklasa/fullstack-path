import { test, mock } from "node:test";
import assert from "node:assert";
import { program } from ".";

const consoleMock = mock.method(
  console,
  "log",
  mock.fn((v: Array<string>) => v.toString())
);

mock.method(
  global,
  "fetch",
  () =>
    new Promise((resolve) =>
      resolve({
        text: () =>
          new Promise((resolve) =>
            resolve(
              `<!doctype html><html><body><h1>Example Domain</h1></body></html>`
            )
          ),
      })
    )
);

test("should return correct text content", async () => {
  await program.parseAsync([
    "node",
    "src/index.ts",
    "-s",
    "h1",
    "https://example.com",
  ]);

  assert.strictEqual(
    consoleMock.mock.calls[0].arguments[0][0],
    "Example Domain"
  );
});
