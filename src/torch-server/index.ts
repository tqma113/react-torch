import React from 'react'
import ReactDomServer from 'react-dom/server'
import {
  createApp
} from '../server'
import { Render } from '../index'

export const render: Render = (element, container) => {
  const app = createApp()

  let content = ReactDomServer.renderToString(element)

  app.use(ctx => {
    ctx.body = content
  })
  
  return app
}