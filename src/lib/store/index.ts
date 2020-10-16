export interface Unsubscribe {
  (): void
}

export type StoreLike<S extends object> = {
  subscribe(listener: () => void): Unsubscribe
  getState(): S
  __UNSAFE_SET_STATE__(state: S): void
}

export const createNoopStore = (): StoreLike<any>  => {
  return {
    subscribe: () => {
      return () => {}
    },
    getState: () => {
      return {}
    },
    __UNSAFE_SET_STATE__: (state) => {

    }
  }
}