export default function isPromise(obj: any): obj is Promise<any> {
  return obj && obj.then && typeof obj.then === 'function'
}
