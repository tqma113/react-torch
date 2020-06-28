import React from 'react'
import Html from './Html'
import Head from './Head'
import Main from './Main'
import NoScript from './NoScript'
import TorchData from './TorchData'
import TorchScripts from './TorchScripts'
import type {
  Context,
  TORCH_DATA,
  ScriptPreload,
  StylePreload
} from '../index'

export interface DocumentProps {
  title: string,
  context: Context,
  container: string,
  content: string,
  publicPath: string,
  assets: {
    index: string,
    vendor: string
  },
  state: object,
  styles?: StylePreload[],
  scripts?: ScriptPreload[]
}

export default function Document({
  title,
  context,
  container,
  content,
  publicPath,
  assets,
  state,
  styles = [],
  scripts = []
}: DocumentProps) {
  const data: TORCH_DATA = {
    context,
    container,
    state
  }

  return (
    <Html>
      <Head title={title} scripts={scripts} styles={styles} />

      <body>
        <NoScript />

        <Main container={container} content={content} />

        <TorchData env={context.env} data={data} />

        <TorchScripts
          index={`${publicPath}/${assets.index}`}
          vendor={`${publicPath}/${assets.vendor}`}
        />
      </body>
    </Html>
  )
}