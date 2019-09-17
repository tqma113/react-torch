import { GenerateView } from '../index'

const generateView: GenerateView = ({
  container,
  content,
  initialState,
  publicPath,
  assets
}) => {
  return `
    <html>
      <head>
        <title>ssr</title>
      </head>
      <body>
        <div id="${container}">${content}</div>
        <Script>
					{
          (function() {
              window.__INITIAL_STATE__ = ${JSON.stringify(initialState)}
              window.__PUBLIC_PATH__ = '${publicPath}'
          })()
          }
				</Script>
				<script src='${publicPath}/${assets.vendor}' />
				<script src='${publicPath}/${assets.index}' />
      </body>
    </html>
  `
}

export default generateView