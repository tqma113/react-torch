import path from 'path'
import { build } from '../dist/index'

build({
  dir: path.resolve(__dirname),
})
