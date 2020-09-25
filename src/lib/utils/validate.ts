export function isPromise<T, S>(obj: PromiseLike<T> | S): obj is PromiseLike<T> {
  // @ts-ignore
  return obj && obj.then && typeof obj.then === 'function'
}