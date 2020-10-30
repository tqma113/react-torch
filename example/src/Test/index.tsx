import React from 'react'
import { createPage } from '../../../src'

const About = createPage(({ history, context }) => {
  const View = () => {
    console.log(history, context)
    console.log('about update')
    return <div>about</div>
  }

  return View
})

export default About
