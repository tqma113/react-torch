import React from 'react'
import ReactDom from 'react-dom'

const getModule = (module: any) => module.default || module

import('/Users/matianqi/Projects/react-torch/test/example/App').then((component) => {
  component = getModule(component)
  let element = React.createElement(component as any)
  ReactDom.hydrate(element, document.getElementById('root'))
})


