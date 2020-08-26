import React from 'react'
import type { History, Location } from '../history'
import type { Store } from '../store'
import type { Context } from '..'

export type GlobalContextType = {
  location: Location
  history: History
  context: Context
  store: Store<any, any>
}

function createContext() {
  return React.createContext<GlobalContextType>({} as any)
}

const GlobalContext = createContext()

export default GlobalContext

export { connect } from './connect'
