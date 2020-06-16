import React from 'react'
import { usePage } from '../../../src/page/index'
import { createStore } from '../../../src/store/index'

const About = usePage(() => {
  const View = ({ state }) => {
    console.log('about update')
    return <div>about {state.a}</div>
  }

  const store = createStore(
    {
      a: 1
    },
    {}
  )

  return [View, store]
})

export default About