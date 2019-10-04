import webpack from 'webpack'
import React from 'react'
import ReactDomServer from 'react-dom/server'
import { createServer } from '../server'
import generateConfig, { Config } from '../config'
import { compile, Options } from '../webpack'
import { ENV } from '../utils'
import generateView from '../view'

const getModule = (module: any) => module.default || module

export interface RenderOptions {
  src?: string
  root?: string
  container?: string
  SSR?: boolean
  env?: ENV
  [key: string]: any
}

export interface Render {
  (options?: RenderOptions): void
}

const render: Render = async (options) => {
  const config = generateConfig(options)

  const app = await createServer(config)

  const webpackOpts: Options = {
    src: config.src,
    env: config.env,
    root: config.root,  
    public: config.public
  };

  const middleware = await compile(webpackOpts)

  app.use(middleware.devMiddleware)

  let component = (await import(config.src).then(getModule)) as React.ComponentType
  let element = React.createElement(component)
  let contentStr = ReactDomServer.renderToString(element)

  app.use(async (ctx) => {
    ctx.state = {
      container: config.container,
      content: contentStr,
      initialState: {},
      publicPath: '',
      assets: {
        index: 'static/js/main.js',
        vendor: 'static/js/vendor.js'
      }
    }
    
    ctx.render(generateView)
  })

  app.listen(3000, () => {
    console.log(`start at 3000`)
  })
}

export default render