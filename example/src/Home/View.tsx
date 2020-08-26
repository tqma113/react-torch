import React from 'react'
import store from './Model'

export default function () {
  console.log('update')
  const state = store.state
  const actions = store.actions
  const handleClick = () => {}
  return () => (
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
