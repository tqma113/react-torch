import React from 'react'

export interface ViewProps {
  ssr: boolean,
  container: string,
  content: string,
  script: string
}

function generateView({
  ssr,
  container,
  content,
  script
}: ViewProps): React.ReactElement {
  return (
    <html>
      <head>
        <title>ssr</title>
      </head>
      <body>
        <noscript>You need to enable JavaScript to run this app.</noscript>
        <div id={`${container}`} dangerouslySetInnerHTML={{ __html: content }}></div>
        <script
          dangerouslySetInnerHTML={{
            __html: `
            (function() {
              window.__SSR__ = "${ssr}"
            })()
          `
          }}
        />
				<script src={script}></script>
      </body>
    </html>
  )
}

export default generateView