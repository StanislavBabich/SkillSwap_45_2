/**
 * Caches a Promise-producing request.
 * - If a request is in flight, returns the same Promise.
 * - If resolved, reuses cached result.
 * - If rejected, resets cache to allow retry.
 */
export default function memoizeRequest<T>(request: () => Promise<T>): () => Promise<T> {
  let promise: Promise<T> | null = null;

  return () => {
    if (!promise) {
      promise = request().catch((error) => {
        promise = null;
        throw error;
      });
    }

    return promise;
  };
}
