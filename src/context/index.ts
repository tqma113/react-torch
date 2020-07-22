import React from 'react'
import type { History, Location } from '../history'
import type { Store } from '../store'
import type { Context } from '..'

function createContext() {
  type GlobalContextType = {
    location: Location,
    history: History,
    context: Context,
    store: Store<any, any>
  }

  return React.createContext<GlobalContextType>({} as any)
}

const GlobalContext = createContext()

export default GlobalContext