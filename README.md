`take-latest` is a util to avoid race conditions

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
