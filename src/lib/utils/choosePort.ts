import chalk from 'chalk'
import isRoot from 'is-root'
import inquirer from 'inquirer'
import detect from 'detect-port-alt'
import { clear, getProcessForPort } from './index'

const isInteractive = process.stdout.isTTY

export function choosePort(
  host: string,
  defaultPort: number
): Promise<number | null> {
  return detect(defaultPort, host).then(
    (port) =>
      new Promise((resolve) => {
        if (port === defaultPort) {
          return resolve(port)
        }
        const message =
          process.platform !== 'win32' && defaultPort < 1024 && !isRoot()
            ? `Admin permissions are required to run a server on a port below 1024.`
            : `Something is already running on port ${defaultPort}.`
        if (isInteractive) {
          clear()
          const existingProcess = getProcessForPort(defaultPort)
          const question = {
            type: 'confirm' as const,
            name: 'shouldChangePort',
            message:
              chalk.yellow(
                message +
                  `${existingProcess ? ` Probably:\n  ${existingProcess}` : ''}`
              ) + '\n\nWould you like to run the app on another port instead?',
            default: true,
          }
          inquirer.prompt(question).then((answer) => {
            if (answer.shouldChangePort) {
              resolve(port)
            } else {
              resolve(null)
            }
          })
        } else {
          console.log(chalk.red(message))
          resolve(null)
        }
      }),
    (err) => {
      throw new Error(
        chalk.red(`Could not find an open port at ${chalk.bold(host)}.`) +
          '\n' +
          ('Network error message: ' + err.message || err) +
          '\n'
      )
    }
  )
}
