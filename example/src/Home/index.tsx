import React from 'react'
import { createPage } from '../../../src'
import { useWillCreate, useWillMount } from '../../../src'
import store from './Model'
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
  const state = store.state
  const actions = store.actions
  const handleClick = () => {
    history.push('/test')
  }

  return (
    <div>
      Home {state.count}{' '}
      <button onClick={() => actions.INCREASE()}>Increate</button>
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

const Home = createPage((history, context) => {
  useWillCreate(() => {
    console.log('willCreate')
  })

  useWillMount(() => {
    console.log('willMount')
  })

  return [getView(history, context), store]
})

export default Home
