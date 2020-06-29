import React from 'react'
import { createPage } from '../../../src/page'
import { Context } from '../../../src/index'
import { History } from '../../../src/history'
import store from './Model'
import './style.css'

const ignorePropsChanged = View => {
  let MemoizedView = (props) => {
    let view = React.useMemo(() => {
      return <View />
    }, [])

  return view
  }
}


const getView = (history: History, context: Context) => () => {
  console.log('update')
  const state = store.state
  const actions = store.actions
  const handleClick = () => {
    history.push('/test')
  }

  return (
    <div>
      Home {state.count} <button onClick={() => actions.INCREASE()}>Increate</button>
      <hr/>
      <a href="/about">about</a>
      <hr/>
      <a href="/test">test</a>
      <hr/>
      <a className="test" onClick={handleClick}>test</a>
    </div>
  )
}

const Home = createPage((history, context) => {

  return [getView(history, context), store]
})

export default Home