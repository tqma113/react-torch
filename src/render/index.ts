import webpack from 'webpack'
import React from 'react'
import ReactDomServer from 'react-dom/server'
import { createServer } from '../server'
import generateConfig, { Config } from '../config'
import { generateClientConfig, generateServerConfig, Options } from '../webpack'
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

  // @ts-ignore
  window.__CONFIG__ = config

  let webpackConfig: webpack.Configuration

  if (config.SSR) {
    webpackConfig = generateServerConfig(webpackOpts)
  } else {
    webpackConfig = generateClientConfig(webpackOpts)
  }

  let compiler = webpack(webpackConfig)

  app.use(require('koa-static')('static'))

  let component = (await import(config.src).then(getModule)) as React.ComponentType
  let element = React.createElement(component)
  let contentStr = ReactDomServer.renderToString(element)

  app.use((ctx) => {
    ctx.state = {
      container: config.container,
      content: contentStr,
      initialState: {},
      publicPath: '',
      assets: {
        index: 'static/js/index.js',
        vendor: ''
      }
    }
    
    ctx.render(generateView)
  })

  app.listen(3000, () => {
    console.log(`start at 3000`)
  })
}

export default render