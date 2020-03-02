#!/usr/bin/env node

import program from 'commander'
import { dev, build, start } from '../index'

program
  .version('1.0.6')

program
  .command('dev')
  .description(`start development mode at ${process.cwd()}`)
  .option('-d, --dir', 'root path')
  .option('-p, --port', 'listening port')
  .action((_, [dir, port]) => {
    dev(dir,port)
  })

program
  .command('build')
  .description(`build project at ${process.cwd()}`)
  .option('-d, --dir', 'root path')
  .action((_, [dir]) => {
    build(dir)
  })

program
  .command('start')
  .description(`start production mode at ${process.cwd()}`)
  .option('-d, --dir', 'root path')
  .option('-p, --port', 'listening port')
  .action((_, [dir, port]) => {
    start(dir, port)
  })

program.parse(process.argv)