import React from 'react'
import ReactDom from 'react-dom'
import path from 'path'

const getModule = (module: any) => module.default || module

import(path.resolve(__dirname, '../../test/example/App.tsx')).then((component) => {
  component = getModule(component)
  let element = React.createElement(component as any)
  ReactDom.hydrate(element, document.getElementById('root'))
})


