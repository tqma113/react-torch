import chalk from 'chalk'

export const info = (msg: string) => console.log(chalk.green(msg))

export const warn = (msg: string) => console.log(chalk.yellow(msg))

export const error = (msg: string) => console.log(chalk.red(msg))

export const step = (msg: string) => console.log(chalk.cyan(msg))

export const clear = () => {
  process.stdout.write(
    process.platform === 'win32' ? '\x1B[2J\x1B[0f' : '\x1B[2J\x1B[3J\x1B[H'
  )
}
