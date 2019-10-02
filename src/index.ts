import Koa from 'koa'
import render from './render'
import build from './build'

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

export {
  useTorch,
  useUnTorch
} from './hook'

export default {
  render,
  build
}