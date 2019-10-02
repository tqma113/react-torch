import React from 'react'
import { GenerateView } from '../index'

const generateView: GenerateView = ({
  container,
  content,
  initialState,
  publicPath,
  assets
}) => {
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
              window.__INITIAL_STATE__ = ${JSON.stringify(initialState)}
              window.__PUBLIC_PATH__ = ${publicPath}
              window.__CUSTOM_LAYOUT__ = true
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