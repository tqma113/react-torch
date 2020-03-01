export type ENV = 'test' | 'development' | 'production'

export const getMode = (env: ENV) => env === 'test' ? 'development' : env || 'production'

export const getWatch = (env: ENV) => env !== 'test'