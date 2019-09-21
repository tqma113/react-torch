import Koa from 'koa'
import {
  serverRender
} from './server'
import build from './build'
import generateConfig from './config'

export interface ServerRender {
  (element: string, container?: string): Promise<Koa>
}

export interface RenderOptions {
  src?: string
  root?: string
  container?: string
  [key: string]: any
}

export interface Config {
  src: string
  root: string
  container: string
  public: string
  [key: string]: any
}

export interface GenerateConfig {
  (options: RenderOptions): Config
}

export interface ViewProps {
  container: string
  content: string
  initialState: object
  publicPath: string
  assets: {
    index: string
    vendor: string
  }
}

export interface GenerateView {
  (props: ViewProps): React.ReactElement
}

export interface Render {
  (options: RenderOptions): void
}

const render: Render = async (options) => {
  const config = generateConfig(options)

  const app = await serverRender(config.src, config.container)

  app.listen(3000, () => {
    console.log(`start at 3000`)
  })
}

export {
  useTorch,
  useUnTorch
} from './hook'

export default {
  render,
  build
}