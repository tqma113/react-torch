import { createHooks } from './hook'

type Callback = () => any
type CallbackList = Callback[]
type AnyFn = (...args: any) => any

export type RenderHooks = {
  usePageSetup: (callback: Callback) => void
}

const publish = (callbackList: CallbackList) => {
  let resultList = []

  for (let i = 0; i < callbackList.length; i++) {
    let callback = callbackList[i]
    resultList.push(callback())
  }

  return resultList
}

export const createRenderHook = () => {
  const { run, hooks } = createHooks<RenderHooks>({
    usePageSetup: () => {
      debugger
      throw new Error(`usePageSetup can't not be called after initilizing`)
    },
  })

  const { usePageSetup } = hooks

  let setupPageCallbackList: CallbackList = []
  const implementations = {
    usePageSetup: (setupPageCallback: Callback) => {
      if (!setupPageCallbackList.includes(setupPageCallback)) {
        setupPageCallbackList.push(setupPageCallback)
      }
    },
  }

  const runCreater = <F extends AnyFn>(f: F): ReturnType<F> => {
    return run(f, implementations)
  }

  const setupPage = () => publish(setupPageCallbackList)

  return {
    runCreater,
    usePageSetup,
    setupPage,
  }
}

export const { setupPage, usePageSetup, runCreater } = createRenderHook()
