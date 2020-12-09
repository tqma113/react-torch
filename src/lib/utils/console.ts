import chalk from 'chalk'

export const info = (msg: string) => console.log(chalk.green(msg))

export const warn = (msg: string) => console.log(chalk.yellow(msg))

// @ts-ignore
export const error = (msg: any) =>
  console.log(chalk.red(JSON.stringify(msg.message || msg)))

export const step = (msg: string) => console.log(chalk.cyan(msg))

export const clear = () => {
  process.stdout.write(
    process.platform === 'win32' ? '\x1B[2J\x1B[0f' : '\x1B[2J\x1B[3J\x1B[H'
  )
}
