import React from 'react'
import { createPage } from '../../../src'
import store from './store'
import './about.css'

const View = () => {
  const state = store.getState()
  console.log('about update')
  return <div>about</div>
}

const About = createPage(() => {
  return [View, store]
})

export default About
