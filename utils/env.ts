import { ENV } from '../config'

export const getMode = (env: ENV) => env === 'test' ? 'development' : env || 'production'

export const getWatch = (env: ENV) => env !== 'test'