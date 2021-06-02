import { createHooks } from './hook'

type Callback = () => any
type CallbackList = Callback[]
type AnyFn = (...args: any) => any

export type RenderHooks = {
  usePreRender: (callback: Callback) => void
  useDidMount: (callback: Callback) => void
  useWillUnmount: (callback: Callback) => void
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
    usePreRender: () => {
      throw new Error(`usePageSetup can't not be called after initilizing`)
    },
    useDidMount: () => {
      throw new Error(`useDidMount can't not be called after initilizing`)
    },
    useWillUnmount: () => {
      throw new Error(`useWillUnmount can't not be called after initilizing`)
    },
  })

  const { usePreRender, useDidMount, useWillUnmount } = hooks

  let preRenderList: CallbackList = []
  let didMountList: CallbackList = []
  let willUnmountList: CallbackList = []
  const implementations = {
    usePreRender: (callback: Callback) => {
      if (!preRenderList.includes(callback)) {
        preRenderList.push(callback)
      }
    },
    useDidMount: (callback: Callback) => {
      if (!didMountList.includes(callback)) {
        didMountList.push(callback)
      }
    },
    useWillUnmount: (callback: Callback) => {
      if (!willUnmountList.includes(callback)) {
        willUnmountList.push(callback)
      }
    },
  }

  const runCreater = <F extends AnyFn>(f: F): ReturnType<F> => {
    return run(f, implementations)
  }

  const preRender = () => publish(preRenderList)

  const didMount = () => publish(didMountList)

  const willUnmount = () => publish(willUnmountList)

  return {
    runCreater,
    usePreRender,
    preRender,
    useDidMount,
    didMount,
    useWillUnmount,
    willUnmount
  }
}

export const { runCreater, usePreRender, preRender, useDidMount, didMount, useWillUnmount, willUnmount } = createRenderHook()
