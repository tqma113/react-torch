import React from 'react'
import ReactDom from 'react-dom'

const getModule = (module: any) => module.default || module

const src = window.__SRC__

import(src).then((component) => {
  component = getModule(component)
  let element = React.createElement(component as any)
  ReactDom.hydrate(element, document.getElementById('root'))
})
