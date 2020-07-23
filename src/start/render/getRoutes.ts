import path from 'path'
import type { IntegralTorchConfig } from '../../index'

export default function getRoutes(config: IntegralTorchConfig) {
    const outputPath = path.join(
        config.dir,
        '.torch', 'server', 'routes.js'
    )
    const module = require(outputPath)
    return module.default || module
}