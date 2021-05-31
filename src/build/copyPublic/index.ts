import path from 'path'
import fs from 'fs-extra'

import { TORCH_DIR, TORCH_PUBLIC_DIR, TORCH_CLIENT_DIR } from '../../index'

export default function copyPublic(dir: string) {
  const src = path.resolve(dir, TORCH_PUBLIC_DIR)
  const dest = path.resolve(dir, TORCH_DIR, TORCH_CLIENT_DIR)

  fs.copySync(src, dest)
}
