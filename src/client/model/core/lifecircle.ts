import { createCallbackManager, createSyncCallbackManager } from './callback'

export const createLifeCircleManager = () => {
  const preload = createCallbackManager(null, 'preload')
  const start = createSyncCallbackManager(preload, 'start')
  const finish = createSyncCallbackManager(start, 'finish')

  return {
    preload,
    start,
    finish,
  }
}
