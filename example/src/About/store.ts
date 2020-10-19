import { createStore } from 'redux'

function reducer() {

}

const reduxStore = createStore(reducer)

const store = {
  ...reduxStore,
  __UNSAFE_SET_STATE__(state: any) {
    reduxStore.dispatch({ type: 'UNSAFE_SETSTATE', preload: state })
  }
}

export default store