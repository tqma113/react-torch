import React from 'react'
import { createPage } from '../../../src/page/index'
import { createStore } from '../../../src/store/index'

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

const About = createPage(View, store)

export default About