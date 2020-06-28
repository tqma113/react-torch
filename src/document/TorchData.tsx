import React from 'react'
import type { Env, TORCH_DATA } from '../index'

export type TorchDataProps = {
  env: Env,
  data: TORCH_DATA
}

export default function TorchData({ env, data }: TorchDataProps) {
  return (
    <>
      <script
        id="__TORCH_DATA__"
        type="application/json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `
          (function() {
            window.__DEV__ = ${env === 'development'}
          })()
        `
        }}
      />
    </>
  )
}