import React from 'react'
import store from './Model'

export default function() {
  console.log('update')
  const state = store.state
  const actions = store.actions
  return <div>Home {state.count} <button onClick={() => actions.INCREASE()}>Increate</button></div>
}