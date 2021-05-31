import { createHooks } from './hook'
import type { Store } from 'redux'
import type {
  Reducers,
  CreateStoreOptions,
  ActionObject,
  ReducersToActions,
} from './store'

type Callback = () => any

export type PresetHooks = {
  setupStore: <S, RS extends Reducers<S>>(
    options: CreateStoreOptions<S, RS>
  ) => {
    store: Store<S, ActionObject>
    actions: ReducersToActions<RS>
  }
  setupStart: (callback: Callback) => void
  setupFinish: (callback: Callback) => void
  setupPreload: (callback: Callback) => void
}

export const { run, hooks } = createHooks<PresetHooks>({
  setupStore() {
    throw new Error(`setupStore can't not be called after initilizing`)
  },
  setupStart() {
    throw new Error(`setupStartCallback can't not be called after initilizing`)
  },
  setupFinish() {
    throw new Error(`setupFinishCallback can't not be called after initilizing`)
  },
  setupPreload() {
    throw new Error(
      `setupPreloadCallback can't not be called after initilizing`
    )
  },
})
