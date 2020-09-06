import path from 'path'
import chalk from 'chalk'
import cp from 'child_process'
import type { ExecSyncOptionsWithStringEncoding } from 'child_process'

const execSync = cp.execSync

const execOptions: ExecSyncOptionsWithStringEncoding = {
  encoding: 'utf8',
  stdio: [
    'pipe', // stdin (default)
    'pipe', // stdout (default)
    'ignore', //stderr
  ],
}

function isProcessAReactApp(processCommand: string) {
  return /^node .*react-scripts\/scripts\/start\.js\s?$/.test(processCommand)
}

function getProcessIdOnPort(port: number) {
  return execSync('lsof -i:' + port + ' -P -t -sTCP:LISTEN', execOptions)
    .split('\n')[0]
    .trim()
}

function getPackageNameInDirectory(directory: string) {
  var packagePath = path.join(directory.trim(), 'package.json')

  try {
    return require(packagePath).name
  } catch (e) {
    return null
  }
}

function getProcessCommand(processId: string, processDirectory: string) {
  var command = execSync(
    'ps -o command -p ' + processId + ' | sed -n 2p',
    execOptions
  )

  command = command.replace(/\n$/, '')

  if (isProcessAReactApp(command)) {
    const packageName = getPackageNameInDirectory(processDirectory)
    return packageName ? packageName : command
  } else {
    return command
  }
}

function getDirectoryOfProcessById(processId: string) {
  return execSync(
    'lsof -p ' +
      processId +
      ' | awk \'$4=="cwd" {for (i=9; i<=NF; i++) printf "%s ", $i}\'',
    execOptions
  ).trim()
}

export function getProcessForPort(port: number) {
  try {
    var processId = getProcessIdOnPort(port)
    var directory = getDirectoryOfProcessById(processId)
    var command = getProcessCommand(processId, directory)
    return (
      chalk.cyan(command) +
      chalk.grey(' (pid ' + processId + ')\n') +
      chalk.blue('  in ') +
      chalk.cyan(directory)
    )
  } catch (e) {
    return null
  }
}
