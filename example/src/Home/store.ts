import { createStore } from 'redux'

export type State = {
  count: number
}

const initialState: State = {
  count: 0,
}

export const UNSAFE_SETSTATE = 'UNSAFE_SETSTATE'

export const INCREMENT = 'INCREMENT'
export const DECREMENT = 'DECREMENT'
export const UPDATE_COUNT = 'UPDATE_COUNT'

interface UnsafeSetStateAction {
  type: typeof UNSAFE_SETSTATE
  preload: State
}

interface IncrementAction {
  type: typeof INCREMENT
}

interface DecrementAction {
  type: typeof DECREMENT
}

interface UpdateCountAction {
  type: typeof UPDATE_COUNT
  preload: number
}

type Action = UnsafeSetStateAction | IncrementAction | DecrementAction | UpdateCountAction

function counter(state: State, action: Action) {
  switch (action.type) {
    case INCREMENT:
      state.count++
      return state
    case DECREMENT:
      state.count++
      return state
    case UNSAFE_SETSTATE:
      return action.preload
    case UPDATE_COUNT:
      state.count = action.preload
      return state
    default:
      return state
  }
}

const reduxStore = createStore(counter, initialState)

const store = {
  ...reduxStore,
  __UNSAFE_SET_STATE__(state: State) {
    reduxStore.dispatch({ type: 'UNSAFE_SETSTATE', preload: state })
  }
}

export default store
