import React from 'react'

export interface ViewProps {
  container: string
  content: string
  publicPath: string
  assets: {
    index: string
    vendor: string
  },
  App: () => Promise<React.ComponentType<any>>
}

function generateView({
  container,
  content,
  publicPath,
  assets,
  App
}: ViewProps): React.ReactElement {
  return (
    <html>
      <head>
        <title>ssr</title>
      </head>
      <body>
        <noscript>You need to enable JavaScript to run this app.</noscript>
        <div id={`${container}`} dangerouslySetInnerHTML={{ __html: content }}></div>
        <script>
					{`
            (function() {
              window.App = "${src}"
            })()
          `}
				</script>
				<script src={`${publicPath}${assets.index}`}></script>
				<script src={`${publicPath}${assets.vendor}`}></script>
      </body>
    </html>
  )
}

export default generateView