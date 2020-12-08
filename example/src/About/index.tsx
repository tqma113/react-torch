import React from 'react'
import { createPage } from '../../../src'
import store from './store'
import './about.css'

const Component = () => {
  console.log('about update')
  return <div>about</div>
}

const About = createPage(() => {
  return { store, create: () => Component }
})

export default About
