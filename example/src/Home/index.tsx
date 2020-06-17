import React from 'react'
import { usePage } from '../../../src/page'
import store from './Model'

const Home = usePage((history, context) => {

  const View = () => {
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
        <a onClick={handleClick}>test</a>
      </div>
    )
  }

  return [View, store]
})

export default Home