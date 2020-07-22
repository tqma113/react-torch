import React from 'react'
import GlobalContext from './index'
import type { GlobalContextType } from './index'

export const connect = (component: React.ComponentType) => {
  return ({
    location,
    history,
    store,
    context
  }: GlobalContextType) => React.createElement(GlobalContext.Provider, {
    value: {
      location,
      history,
      store,
      context
    },
    children: React.createElement(component)
  })
}