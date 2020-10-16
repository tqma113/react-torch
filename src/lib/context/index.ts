import React from 'react'
import type { History, Location } from 'torch-history'
import type { Context } from '../..'

export type GlobalContextType = {
  location: Location
  history: History
  context: Context
}

function createContext() {
  return React.createContext<GlobalContextType>({} as any)
}

export const GlobalContext = createContext()

export default GlobalContext

export const connect = (component: React.ComponentType) => {
  return ({ location, history, context }: GlobalContextType) =>
    React.createElement(GlobalContext.Provider, {
      value: {
        location,
        history,
        context,
      },
      children: React.createElement(component),
    })
}
