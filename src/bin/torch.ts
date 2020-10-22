import program from 'commander'
import dev from '../dev'
import build from '../build'
import start from '../start'
import { requireConfig } from '../lib/config'

program.version('1.0.12').name('torch')

program
  .command('dev')
  .description(`start development mode at ${process.cwd()}`)
  .option('-d, --dir <dir>', 'root path')
  .option('-p, --port <port>', 'listening port')
  .option('-c, --config <config>', 'config file path')
  .action(({ dir, port, config = 'torch.config.ts' }) => {
    let draftConfig = requireConfig(config)

    if (typeof draftConfig === 'object') {
      if (typeof dir === 'string') {
        draftConfig.dir = dir
      }

      if (typeof port === 'string') {
        draftConfig.port = Number(port)
      }

      dev(draftConfig)
    } else {
      dev({ dir, port })
    }
  })

program
  .command('build')
  .description(`build project at ${process.cwd()}`)
  .option('-d, --dir <dir>', 'root path')
  .option('-p, --port <port>', 'listening port')
  .option('-c, --config <config>', 'config file path')
  .action(({ dir, port, config = 'torch.config.ts' }) => {
    let draftConfig = requireConfig(config)

    if (typeof draftConfig === 'object') {
      if (typeof dir === 'string') {
        draftConfig.dir = dir
      }

      if (typeof port === 'string') {
        draftConfig.port = Number(port)
      }

      build(draftConfig)
    } else {
      build({ dir, port })
    }
  })

program
  .command('start')
  .description(`start production mode at ${process.cwd()}`)
  .option('-d, --dir <dir>', 'root path')
  .option('-p, --port <port>', 'listening port')
  .option('-c, --config <config>', 'config file path')
  .action(({ dir, port, config = 'torch.config.ts' }) => {
    let draftConfig = requireConfig(config)

    if (typeof draftConfig === 'object') {
      if (typeof dir === 'string') {
        draftConfig.dir = dir
      }

      if (typeof port === 'string') {
        draftConfig.port = Number(port)
      }

      start(draftConfig)
    } else {
      start({ dir, port })
    }
  })

program.parse(process.argv)
