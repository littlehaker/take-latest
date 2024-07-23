import takeLatest from "../src";

async function _defer(value: number, ms: number) {
  return new Promise<number>((resolve) => {
    setTimeout(() => {
      resolve(value);
    }, ms);
  });
}

test("race condition", async () => {
  let data: number = 0;
  async function getDeferredValue(value: number, ms: number) {
    const val = await _defer(value, ms);
    data = val;
  }

  await Promise.all([
    getDeferredValue(1, 1000),
    getDeferredValue(2, 500),
    getDeferredValue(3, 300),
  ]);

  expect(data).toBe(1);
});

test("no race condition", async () => {
  const defer = takeLatest(_defer); // Wrap the promise creator
  let data: number = 0;
  async function getDeferredValue(value: number, ms: number) {
    const val = await defer(value, ms);
    data = val;
  }

  await Promise.all([
    getDeferredValue(1, 1000),
    getDeferredValue(2, 500),
    getDeferredValue(3, 300),
  ]).catch(() => {});

  expect(data).toBe(3); // Take the latest value
});
