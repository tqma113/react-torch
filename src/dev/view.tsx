import React from 'react'
import type { Context, TORCH_DATA } from '../index'

export interface ViewProps {
  context: Context,
  src: string,
  container: string,
  content: string,
  publicPath: string,
  assets: {
    index: string,
    vendor: string
  },
  state: object
}

export default function Layout({
  context,
  container,
  content,
  publicPath,
  assets,
  state
}: ViewProps) {
  const data: TORCH_DATA = {
    context,
    container,
    state
  }
  return (
    <html>
      <head>
        <title>React-Torch</title>
      </head>
      <body>
        <noscript>You need to enable JavaScript to run this app.</noscript>
        <div id={`${container}`} dangerouslySetInnerHTML={{ __html: content }}></div>
        <script
          id="__TORCH_DATA__"
          type="application/json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
            (function() {
              window.__DEV__ = ${context.env === 'development'}
            })()
          `
          }}
        />
				<script src={`${publicPath}/${assets.index}`}></script>
				<script src={`${publicPath}/${assets.vendor}`}></script>
      </body>
    </html>
  )
}
