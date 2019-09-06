import React from 'react'

export interface CreateContext {
  (defaultValue: any): React.Context<any>
}

const createContext: CreateContext = (defaultValue) => React.createContext(defaultValue)

export default createContext;