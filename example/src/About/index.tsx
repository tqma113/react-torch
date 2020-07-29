import React from 'react'
import { createPage } from '../../../page'
import { createStore } from '../../../store'
import './about.css'

const store = createStore(
  {
    a: 1
  },
  {}
)

const View = () => {
  const state = store.state
  console.log('about update')
  return <div>about {state.a}</div>
}

const About = createPage(() => {
  return [View, store]
})

export default About