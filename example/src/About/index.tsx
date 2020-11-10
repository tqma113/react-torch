import React from 'react'
import { createPage } from '../../../src'
import store from './store'
import './about.css'

const Component = () => {
  const state = store.getState()
  console.log('about update')
  return <div>about</div>
}

const About = createPage(() => {
  return { store, create: async () => Component }
})

export default About
