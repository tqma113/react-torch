import React from 'react'
import { createPage } from '../../../page'
import { createStore } from '../../../store'

const About = createPage((history, context) => {
  const store = createStore(
    {
      a: 1,
    },
    {}
  )

  const View = () => {
    console.log(history, context)
    console.log('about update')
    const state = store.state
    return <div>about {state.a}</div>
  }

  return [View, store]
})

export default About
