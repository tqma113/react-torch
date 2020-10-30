import React from 'react'
import { createPage } from '../../../src'
import store from './store'
import './style.css'
import type { History } from 'torch-history'
import type { Context } from '../../../src/index'

// const ignorePropsChanged = View => {
//   let MemoizedView = (props) => {
//     let view = React.useMemo(() => {
//       return <View />
//     }, [])

//   return view
//   }
// }

const getView = (history: History, context: Context) => () => {
  console.log('update')
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

const Home = createPage(async ({ history, context }) => {
  return [getView(history, context), store]
})

export default Home
