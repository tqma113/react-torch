import React from 'react'
import { createPage } from '../../../src/client'

const About = createPage(({ history, context }) => {
  const View = () => {
    return <div>about</div>
  }

  return View
})

export default About
