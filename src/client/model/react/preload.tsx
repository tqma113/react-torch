import React from 'react'
import type { Model } from '../core'
import type { ReactModelState, ReactModel } from './create-react-model'

export type ReactModelArg = {
  Model: ReactModel
  preloadedState?: any
}

type CombinedReactModelState<T extends ReactModelArg[]> = ReactModelState<
  T[number]['Model']
>[]

type PreloadResultType<T extends ReactModelArg[]> = Promise<{
  Provider: React.FC
  stateList: CombinedReactModelState<T>
  modelList: Model[]
}>

export const preload = async <T extends ReactModelArg[]>(list: T) => {
  let resultList = await Promise.all(
    list.map((item) => {
      let { Model, preloadedState } = item
      return Model.preload(preloadedState)
    })
  )

  let ProviderList = resultList.map((item) => item.Provider)
  let stateList = resultList.map((item) => item.state)
  let modelList = resultList.map((item) => item.model)

  let Provider: React.FC = ({ children }) => {
    for (let i = ProviderList.length - 1; i >= 0; i--) {
      let Provider = ProviderList[i]
      children = <Provider>{children}</Provider>
    }

    return <>{children}</>
  }

  return {
    Provider,
    stateList: stateList,
    modelList,
  } as unknown as PreloadResultType<T>
}
