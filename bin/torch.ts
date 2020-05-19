#!/usr/bin/env node

import program from 'commander'
import dev from '../dev'
import build from '../build'
import start from '../start'
import {
  mergeConfig,
  requireConfig
} from '../config'

program
  .version('1.0.12')
  .name('torch')

program
  .command('dev')
  .description(`start development mode at ${process.cwd()}`)
  .option('-d, --dir <dir>', 'root path')
  .option('-p, --port <port>', 'listening port')
  .option('-c, --config <config>', 'config file path')
  .action(({ dir, port, config }) => {
    if (config) {
      let draftConfig = requireConfig(config)
      
      if (typeof draftConfig === 'object') {
        if (typeof dir === 'string') {
          draftConfig.dir = dir
        }

        if (typeof port === 'string') {
          draftConfig.port = port
        }

        const internalConfig = mergeConfig(draftConfig)
        dev(internalConfig)
      } else {
        const internalConfig = mergeConfig({ dir, port })
        dev(internalConfig)
      }
    } else {
      const internalConfig = mergeConfig({ dir, port })
      dev(internalConfig)
    }
  })

program
  .command('build')
  .description(`build project at ${process.cwd()}`)
  .option('-d, --dir <dir>', 'root path')
  .option('-p, --port <port>', 'listening port')
  .option('-c, --config <config>', 'config file path')
  .action(({ dir, port, config }) => {
    if (config) {
      let draftConfig = requireConfig(config)
      
      if (typeof draftConfig === 'object') {
        if (typeof dir === 'string') {
          draftConfig.dir = dir
        }

        if (typeof port === 'string') {
          draftConfig.port = port
        }

        const internalConfig = mergeConfig(draftConfig)
        build(internalConfig)
      } else {
        const internalConfig = mergeConfig({ dir, port })
        build(internalConfig)
      }
    } else {
      const internalConfig = mergeConfig({ dir, port })
      build(internalConfig)
    }
  })

program
  .command('start')
  .description(`start production mode at ${process.cwd()}`)
  .option('-d, --dir <dir>', 'root path')
  .option('-p, --port <port>', 'listening port')
  .action(({ dir, port, config }) => {
    if (config) {
      let draftConfig = requireConfig(config)
      
      if (typeof draftConfig === 'object') {
        if (typeof dir === 'string') {
          draftConfig.dir = dir
        }

        if (typeof port === 'string') {
          draftConfig.port = port
        }

        const internalConfig = mergeConfig(draftConfig)
        start(internalConfig)
      } else {
        const internalConfig = mergeConfig({ dir, port })
        start(internalConfig)
      }
    } else {
      const internalConfig = mergeConfig({ dir, port })
      start(internalConfig)
    }
  })

program.parse(process.argv)