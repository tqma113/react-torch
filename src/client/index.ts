import ReactDom from 'react-dom'

const getModule = (module: any) => module.default || module

  // @ts-ignore
let config = window.__CONFIG__

import(config.src).then((element) => {
  element = getModule(element)
  ReactDom.hydrate(element, document.getElementById(config.root))
})


