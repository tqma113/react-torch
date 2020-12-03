import React from 'react'

import type { Params } from 'torch-router'
import type { History, Location } from 'torch-history'
import type { Context } from '../..'

export type GlobalContextType = {
  location: Location
  history: History
  context: Context
  params: Params
}

function createContext() {
  return React.createContext<GlobalContextType>({} as any)
}

export const GlobalContext = createContext()

export default GlobalContext

export const connect = (component: React.ComponentType) => ({
  location,
  history,
  context,
  params,
}: GlobalContextType) =>
  React.createElement(GlobalContext.Provider, {
    value: {
      location,
      history,
      context,
      params,
    },
    children: React.createElement(component),
  })
