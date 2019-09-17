import Koa from 'koa'
import React from 'react'
import ReactDomServer from 'react-dom/server'
import { ServerRender, ViewProps } from '../index'
import generateView from '../view'

const getModule = (module: any) => module.default || module

const ROOT = 'root'

export const serverRender: ServerRender = async (src, container) => {
  const app = new Koa()

  let component = (await import(src).then(getModule)) as React.ComponentType
  let element = React.createElement(component)
  let contentStr = ReactDomServer.renderToString(element)

  let finalContainer = container || ROOT

  const viewProps: ViewProps = {
    container: finalContainer,
    content: contentStr,
    initialState: {},
    publicPath: '',
    assets: {
      index: 'string',
      vendor: 'string',
    }
  }

  app.use(ctx => {
    ctx.body = generateView(viewProps)
  })

  return app
}