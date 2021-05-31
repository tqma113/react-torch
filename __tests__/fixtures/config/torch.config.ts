import module from './module'
import { homedir } from 'os'

const foo = require('./foo.json')

export default {
  ssr: module.ssr,
  src: foo.src,
  dir: homedir(),
}
