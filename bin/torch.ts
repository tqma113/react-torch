#!/usr/bin/env node

import program from 'commander'
import { dev, build, start } from '../index'

program
  .version('1.0.7')
  .name('torch')

program
  .command('dev')
  .description(`start development mode at ${process.cwd()}`)
  .option('-d, --dir <dir>', 'root path')
  .option('-p, --port <port>', 'listening port')
  .action(({ dir, port }) => {
    dev(dir, port)
  })

program
  .command('build')
  .description(`build project at ${process.cwd()}`)
  .option('-d, --dir <dir>', 'root path')
  .action(({ dir }) => {
    build(dir)
  })

program
  .command('start')
  .description(`start production mode at ${process.cwd()}`)
  .option('-d, --dir <dir>', 'root path')
  .option('-p, --port <port>', 'listening port')
  .action(({ dir, port }) => {
    start(dir, port)
  })

program.parse(process.argv)