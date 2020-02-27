export * from './env'

export function getKeys<Obj extends {}>(obj: Obj) {
  return Object.keys(obj) as Array<keyof Obj>
}
