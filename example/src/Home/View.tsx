import React from 'react'
import store from './store'

export default function () {
  console.log('update')
  const state = store.getState()

  const Increate = () => {
    store.dispatch({ type: 'INCREMENT' })
  }
  const handleClick = () => {}
  return () => (
    <div>
      Home {state.count} <button onClick={() => Increate}>Increate</button>
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
