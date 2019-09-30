import Koa from 'koa'
import React from 'react'
import ReactDomServer from 'react-dom/server'
import viewEngine from 'koa-react-view-typescript'
import { ServerRender, ViewProps } from '../index'
import generateView from '../view'

const getModule = (module: any) => module.default || module

const ROOT = 'root'

export const serverRender: ServerRender = async (src, container) => {
  const app = new Koa().use(viewEngine<ViewProps>())

  let component = (await import(src).then(getModule)) as React.ComponentType
  let element = React.createElement(component)
  let contentStr = ReactDomServer.renderToString(element)

  let finalContainer = container || ROOT

  app.use(viewEngine())

  app.use((ctx) => {
    ctx.state = {
      container: finalContainer,
      content: contentStr,
      initialState: {},
      publicPath: '',
      assets: {
        index: '',
        vendor: ''
      }
    }
    ctx.render(generateView)
    
  })

  return app
}