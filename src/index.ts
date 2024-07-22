interface Cancelable<T> {
  promise: Promise<T>;
  cancel: () => void;
}

/**
 * Cancellable Promise
 *
 * @template T
 * @param {Promise<T>} promise
 * @returns {Cancelable<T>}
 */
function cancelable<T>(promise: Promise<T>): Cancelable<T> {
  let hasCancelled = false;

  return {
    promise: promise.then((v) => {
      if (hasCancelled) {
        console.warn("Race condition: ignore");
        throw { isCancelled: true };
      }

      return v;
    }),
    cancel: () => (hasCancelled = true),
  };
}

function createTakeLatest<T>() {
  let cancelablePromise: Cancelable<T> | null = null;

  const takeLatest = (promise: Promise<T>) => {
    if (cancelablePromise) {
      cancelablePromise.cancel();
      cancelablePromise = cancelable(promise);
    } else {
      cancelablePromise = cancelable(promise);
    }

    return cancelablePromise.promise;
  };

  return takeLatest;
}

/**
 * Wrap a promiseFactory with takeLatest to avoid race conditions
 *
 * @export
 * @template T
 * @template {unknown[]} U
 * @param {(...args: U) => Promise<T>} promiseFactory
 * @returns {Promise<T>) => (...args: U) => Promise<T>}
 */
export default function takeLatest<T, U extends unknown[]>(
  promiseFactory: (...args: U) => Promise<T>
) {
  const _takeLatest = createTakeLatest<T>();
  return (...args: U) => {
    return _takeLatest(promiseFactory(...args));
  };
}
