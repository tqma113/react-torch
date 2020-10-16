import React from 'react'
import GlobalContext from './index'
import type { GlobalContextType } from './index'

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
