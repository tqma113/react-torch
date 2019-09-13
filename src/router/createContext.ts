import React from 'react'

export interface CreateContext {
  (): React.Context<any>
}

const context = React.createContext({})

const createContext: CreateContext = () => context

export default createContext;