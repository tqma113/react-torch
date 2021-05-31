import React from 'react'

import type { Params } from 'torch-router'
import type { History, Location } from 'torch-history'
import type { Context } from '../..'
import { StoreLike } from '../store'

export type GlobalContextType = {
  location: Location
  history: History
  context: Context
  params: Params
  store: StoreLike<any>
}

function createContext() {
  return React.createContext<GlobalContextType>({} as any)
}

export const GlobalContext = createContext()

export default GlobalContext

export const connectContext =
  (Component: React.ComponentType) =>
  ({ location, history, context, params, store }: GlobalContextType) => {
    return () => (
      <GlobalContext.Provider
        value={{
          location,
          history,
          context,
          params,
          store,
        }}
      >
        <Component />
      </GlobalContext.Provider>
    )
  }
