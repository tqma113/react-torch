import React from 'react'
import type { History, Location } from 'torch-history'
import type { StoreLike } from '../store'
import type { Context } from '../..'

export type GlobalContextType = {
  location: Location
  history: History
  context: Context
  store: StoreLike<any>
}

function createContext() {
  return React.createContext<GlobalContextType>({} as any)
}

const GlobalContext = createContext()

export default GlobalContext

export { connect } from './connect'
