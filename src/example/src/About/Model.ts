import { createStore } from '../../../store/index'

export type State = {
  // count: number
}

export type Actions = typeof actions

const initialState: State = {
  // count: 0
}

const actions = {
  // UPDATE_COUNT(state: State, nextCount: number) {
  //   return {
  //     ...state,
  //     count: nextCount
  //   }
  // },
  // INCREASE(state: State) {
  //   return {
  //     ...state,
  //     count: state.count + 1
  //   }
  // },
  // DECREASE(state: State) {
  //   return {
  //     ...state,
  //     count: state.count - 1
  //   }
  // },
}

const store = createStore(initialState, actions)

export default store