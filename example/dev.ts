import dev from '../src/start'
import config from './torch.config'
import { Env } from '../src'

process.env.NODE_ENV = Env.Development

dev(config)
