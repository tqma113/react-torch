import { createStore } from '../../../src'

export type State = {
  count: number
}

export type Actions = typeof actions

const initialState: State = {
  count: 0,
}

const actions = {
  UPDATE_COUNT(state: State, nextCount: number): State {
    return {
      ...state,
      count: nextCount,
    }
  },
  INCREASE(state: State): State {
    return {
      ...state,
      count: state.count + 1,
    }
  },
  DECREASE(state: State): State {
    return {
      ...state,
      count: state.count - 1,
    }
  },
}

const store = createStore(initialState, actions)

export default store
