import React from 'react'

export interface ViewProps {
  ssr: boolean,
  src: string,
  container: string,
  content: string,
  publicPath: string,
  assets: {
    index: string,
    vendor: string
  }
}

export default function Layout({
  ssr,
  container,
  content,
  publicPath,
  assets
}: ViewProps) {
  return (
    <html>
      <head>
        <title>React-Torch</title>
      </head>
      <body>
        <noscript>You need to enable JavaScript to run this app.</noscript>
        <div id={`${container}`} dangerouslySetInnerHTML={{ __html: content }}></div>
        <script
          dangerouslySetInnerHTML={{
            __html: `
            (function() {
              window.__SSR__ = "${ssr}"
              window.__CONTAINER__ = "${container}"
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
