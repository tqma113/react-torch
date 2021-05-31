import { createServer } from '../start/createServer'
import { requireConfig } from '../internal/config'
import { Env, ScriptOptions } from '../index'

export default function ({
  dir,
  port,
  config = 'torch.config.ts',
}: ScriptOptions) {
  process.env.NODE_ENV = process.env.NODE_ENV || Env.Production

  let draftConfig = requireConfig(config)

  if (typeof draftConfig === 'object') {
    if (typeof dir === 'string') {
      draftConfig.dir = dir
    }

    if (typeof port === 'string') {
      draftConfig.port = Number(port)
    }
  } else {
    draftConfig = { dir, port: port ? Number(port) : undefined }
  }

  createServer(draftConfig).catch(console.error)
}
