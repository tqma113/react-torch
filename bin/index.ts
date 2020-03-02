#!/usr/bin/env node
import program from 'commander'
import { dev, build, start } from '../index'

program
  .version('1.0.4')
  .name('torch')

program
  .command('dev <dir>')
  .description(`start development mode at ${process.cwd()}`)
  .option('-p, --port', 'listening port')
  .action((dir, { port }) => {
    dev(dir, port)
  })

program
  .command('build <dir>')
  .description(`build project at ${process.cwd()}`)
  .action((dir) => {
    build(dir)
  })

program
  .command('dev <dir>')
  .description(`start production mode at ${process.cwd()}`)
  .option('-p, --port', 'listening port')
  .action((dir, { port }) => {
    start(dir, port)
  })