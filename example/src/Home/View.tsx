import React from 'react'
import type { Currings } from '../../../store/index'
import type { State, Actions } from './Model'

type Props = {
  state: State,
  actions: Currings<State, Actions>
}

export default function({ state, actions }: Props) {
  console.log('update')
  return <div>Home {state.count} <button onClick={() => actions.INCREASE()}>Increate</button></div>
}