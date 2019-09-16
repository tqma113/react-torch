import ReactDom from 'react-dom'
import { Config } from '../index'

const getModule = (module: any) => module.default || module

declare global {
  interface Window {
    CONFIG: Config
  }
}

let config = window.CONFIG

import(config.src).then((element) => {
  element = getModule(element)
  ReactDom.hydrate(element, document.getElementById(config.root))
})


