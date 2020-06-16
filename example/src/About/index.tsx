import React from 'react'
import { createPage } from '../../../src/page/index'
import { createStore } from '../../../src/store/index'

const About = createPage(
  ({ state }) => {
    console.log('about update')
    return <div>about {state.a}</div>
  },
  createStore(
    {
      a: 1
    },
    {}
  )
)

export default About