import React from 'react'
import { Currings } from '../../../store'
import { State, Actions } from './Model'

type Props = {
  state: State,
  actions: Currings<State, Actions>
}

export default function({ state }: Props) {
  return <div>about {state.count}</div>
}