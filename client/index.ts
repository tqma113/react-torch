import React from 'react'
import ReactDom from 'react-dom'

declare global {
  interface Window {
    __SRC__: string
  }
}

const getModule = (module: any) => module.default || module

const src = window.__SRC__

async function start() {
  let component = (await import(src).then(getModule)) as React.ComponentType
  component = getModule(component)
  let element = React.createElement(component as any)
  ReactDom.hydrate(element, document.getElementById('root'))
}

start()
