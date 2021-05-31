import type { IntegralTorchConfig } from '../../index'
export default function createServer(
  config: IntegralTorchConfig
): import('express-serve-static-core').Express
