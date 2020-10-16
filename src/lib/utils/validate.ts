export function isPromise<T, S>(
  input: PromiseLike<T> | S
): input is PromiseLike<T> {
  // @ts-ignore
  return input && input.then && typeof input.then === 'function'
}

export function isArray<T, S>(input: ArrayLike<T> | S): input is ArrayLike<T> {
  return Array.isArray(input)
}
