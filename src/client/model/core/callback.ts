export type Callback = () => any

export type CallbackList = Callback[]

export type CallbackManager = {
  id: string
  setup: (callback: Callback) => void
  run: () => Promise<any[]>
  hasRun: () => boolean
}

export const createCallbackManager = (
  previous: CallbackManager | SyncCallbackManager | null = null,
  id: string = ''
): CallbackManager => {
  let isRun = false
  let callbacks: CallbackList = []

  const setup = (callback: Callback) => {
    if (previous?.hasRun() || isRun) {
      throw new Error(`Can't add callback after running. [ID] ${id}`)
    }

    if (!callbacks.includes(callback)) {
      callbacks.push(callback)
    }
  }

  const run = async () => {
    if (previous && !previous.hasRun()) {
      throw new Error(
        `Expected calling previous: [ID] ${previous.id} before current. [ID] ${id}`
      )
    }

    if (isRun) {
      return []
    }

    let resultList = []

    for (let i = 0; i < callbacks.length; i++) {
      let callback = callbacks[i]
      resultList.push(callback())
    }

    callbacks = []

    return await Promise.all(resultList)
  }

  const hasRun = () => {
    return isRun
  }

  return {
    id,
    setup,
    run,
    hasRun,
  }
}

export type SyncCallbackManager = {
  id: string
  setup: (callback: Callback) => void
  run: () => any[]
  hasRun: () => boolean
}

export const createSyncCallbackManager = (
  previous: CallbackManager | SyncCallbackManager | null = null,
  id: string = ''
): SyncCallbackManager => {
  let isRun = false
  let callbacks: CallbackList = []

  const setup = (callback: Callback) => {
    if (previous?.hasRun() || isRun) {
      throw new Error(`Can't add callback after running. [ID] ${id}`)
    }

    if (!callbacks.includes(callback)) {
      callbacks.push(callback)
    }
  }

  const run = () => {
    if (previous && !previous.hasRun()) {
      throw new Error(
        `Expected calling previous: [ID] ${previous.id} before current. [ID] ${id}`
      )
    }

    if (isRun) {
      return []
    }

    let resultList = []

    for (let i = 0; i < callbacks.length; i++) {
      let callback = callbacks[i]
      resultList.push(callback())
    }

    callbacks = []

    return resultList
  }

  const hasRun = () => {
    return isRun
  }

  return {
    id,
    setup,
    run,
    hasRun,
  }
}
