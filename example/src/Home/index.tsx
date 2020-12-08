import React from 'react'
import { createPage } from '../../../src'
import store from './store'
import './style.css'
import type { History } from 'torch-history'

// const ignorePropsChanged = View => {
//   let MemoizedView = (props) => {
//     let view = React.useMemo(() => {
//       return <View />
//     }, [])

//   return view
//   }
// }

const getView = (history: History) => () => {
  const state = store.getState()

  const INCREASE = () => {
    store.dispatch({ type: 'INCREMENT' })
  }

  const handleClick = () => {
    history.push('/test')
  }

  return (
    <div>
      Home {state.count} <button onClick={() => INCREASE()}>Increate</button>
      <hr />
      <a href="/about">about</a>
      <hr />
      <a href="/test">test</a>
      <hr />
      <a className="test" onClick={handleClick}>
        test
      </a>
    </div>
  )
}

const Home = createPage(async ({ history }) => {
  return {
    store,
    create: async () => {
      return getView(history)
    },
    beforeDestory: async (location) => {
      console.log(location, 'home beforeDestory')
    },
  }
})

export default Home
