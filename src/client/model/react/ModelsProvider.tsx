import React from 'react'
import { Provider } from './Provider'
import { preload, ReactModelArg } from './preload'

const createPageProvider = () => {
  const models = new Set<ReactModelArg>()

  const setupModel = <RMA extends ReactModelArg>(model: RMA) => {
    if (!models.has(model)) {
      models.add(model)
    }
  }

  const ModelsProvider = ({ children }: React.PropsWithChildren<{}>) => {
    return <Provider list={Array.from(models)}>{children}</Provider>
  }

  const connectModels = (Component: React.ComponentType) => {
    return () => (
      <ModelsProvider>
        <Component />
      </ModelsProvider>
    )
  }

  const preloadModels = async (stateList: any[] = []) => {
    return preload(
      Array.from(models).map((model, index) => {
        const state = stateList[index]
        if (state === undefined) {
          return model
        }
        return { ...model, preloadedState: state }
      })
    )
  }

  const getStates = () => {
    return Array.from(models).map((model) => model.Model.useState())
  }

  return {
    setupModel,
    ModelsProvider,
    connectModels,
    preloadModels,
    getStates,
  }
}

export const {
  setupModel,
  ModelsProvider,
  connectModels,
  preloadModels,
  getStates,
} = createPageProvider()
