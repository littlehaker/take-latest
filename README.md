`take-latest` is a util to avoid race conditions

## Race Condition

A race condition occurs when the behavior of a software system depends on the sequence or timing of uncontrollable events such as thread execution order. This can lead to unpredictable and erroneous outcomes, especially in concurrent or parallel computing environments.

Take a look at the following example:

```javascript
function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function mockRequest(res, timeout) {
  await sleep(timeout);
  return res;
}

async function test() {
  let data;

  function doRequest(res, timeout) {
    console.log(`${res} request`);
    mockRequest(res, timeout).then((val) => {
      data = val;
      console.log(`${res} respond`);
    });
  }

  // If user click a button to send a request to get data, for example Paginations.
  // This mocks the user behaviors that a user click the button twice very quickly.
  // And mocks the random latency of network.
  doRequest(1, 400);
  await sleep(50);
  doRequest(2, 200);

  await sleep(500);
  console.log(`final result: ${data}`);
}

test();
```

The output would be like this:

```shell
1 request
2 request
2 respond
1 respond
final result: 1 # <--- 2 expected
```

Usually, we want to take the latest response and ignore previous results. In this case 2 expected.
However, if request 2 respond early than request 1, its response would be override by request 1.

This is why `take-latest` exists. It will take the latest response and ignore previous ones.

## Installation

`npm install take-latest`

or

`yarn add take-latest`

or

`pnpm install take-latest`

## Usage

```javascript
import takeLatest from "take-latest";

// An async function
async function query() {
  // ...
}

const queryTakeLatest = takeLatest(query);

queryTakeLatest().then(() => {
  console.log(1); // Won't be logged
});
queryTakeLatest().then(() => {
  console.log(2); // Won't be logged
});
queryTakeLatest().then(() => {
  console.log(3); // Only the latest one will be logged
});
```

## Lisence

MIT
