const path = require('path')
const fs = require('fs-extra')

const resolve = (file) => [
    path.resolve(__dirname, '../src', file),
    path.resolve(__dirname, '../dist', file),
]

fs.copySync(...resolve('global.d.ts'))
fs.copySync(...resolve('lib/utils/openChrome.applescript'))