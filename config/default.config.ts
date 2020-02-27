import { Config } from './index'

const defaultConfig: Config = {
  App: () => Promise.resolve(() => null),
  src: 'App.tsx',
  container: 'root',
  root: '.',
  public: 'public',
  SSR: false,
  env: 'development'
}

export default defaultConfig
