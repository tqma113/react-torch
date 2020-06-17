import React from 'react'
import { usePage } from '../../../src/page/index'
import { createStore } from '../../../src/store/index'

const About = usePage((history, context) => {
  const store = createStore(
    {
      a: 1
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