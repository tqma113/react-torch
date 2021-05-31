export interface Unsubscribe {
  (): void
}

export type StoreLike<S> = {
  subscribe(listener: () => void): Unsubscribe
  getState(): S
}

export type StateFromStore<Store extends StoreLike<any>> =
  Store extends StoreLike<infer State> ? State : never

export type StoreCreator<S> = (state?: S) => StoreLike<S>
export type StoreFactory<
  Store extends StoreLike<any>,
  S = StateFromStore<Store>,
  Args extends any[] = S extends never ? [] : [S]
> = (...args: Args) => Store

export const createNoopStore: StoreCreator<any> = (): StoreLike<any> => {
  return {
    subscribe: () => {
      return () => {}
    },
    getState: () => {
      return {}
    },
  }
}
