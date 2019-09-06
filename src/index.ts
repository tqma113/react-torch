import Koa from 'koa'
import {
  render
} from './torch-server'
import build from './build'

export {
  useTorch,
  useUnTorch
} from './hook'

export default {
  render,
  build
}

export interface Render {
  (element: React.ReactElement, container?: string): Koa
}