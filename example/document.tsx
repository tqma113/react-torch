import React from 'react'
import type {
  Context,
  TorchData,
  PreloadType,
  ScriptPreload,
  StylePreload,
} from '../src'
import type { ReactElement } from 'react'

export type DocumentProps = {
  dir: string
  title: string
  context: Context
  container: string
  element: ReactElement
  publicPath: string
  assets: {
    vendor: string
    index: string
  }
  state: object
  mode: PreloadType
  styles?: StylePreload[]
  scripts?: ScriptPreload[]
}

export default function createDocument({
  dir,
  title,
  context,
  container,
  element,
  publicPath,
  assets,
  state,
  mode,
  styles = [],
  scripts = [],
}: DocumentProps) {
  const data: TorchData = {
    context,
    container,
    state,
  }

  const styleElements = styles.map(getStyle)

  const scriptElements = scripts.map(getScript)

  const assetsScriptElement = [
    getSrcScript(`${publicPath}${assets.vendor}`, 'vendor'),
    getSrcScript(`${publicPath}${assets.index}`, 'index'),
  ]

  return (
    <html>
      <head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width,initial-scale=1.0" />
        {styleElements}
        {scriptElements}
      </head>

      <body>
        <noscript>
          <strong>
            We're sorry but {title} doesn't work properly without JavaScript
            enabled.You need to enable JavaScript to run this app.
          </strong>
        </noscript>

        <div id={`${container}`}>{element}</div>

        <script
          id="__TORCH_DATA__"
          type="application/json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
        <script
          type="application/javascript"
          dangerouslySetInnerHTML={{
            __html: `
            (function() {
              window.__DEV__ = ${context.env === 'development'}
            })()
          `,
          }}
        />

        {assetsScriptElement}
      </body>
    </html>
  )
}

function getStyle(style: StylePreload, index?: number) {
  return style.type === 'link'
    ? getStyleLink(style.href, index)
    : getInnerStyle(style.content, index)
}

function getInnerStyle(content: string, key?: string | number) {
  return (
    <style
      key={key}
      type="text/css"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}

function getStyleLink(href: string, key?: string | number) {
  return <link key={key} rel="stylesheet" type="text/css" href={href} />
}

function getScript(script: ScriptPreload, key?: string | number) {
  return script.type == 'inner'
    ? getInnerScript(script.content, key)
    : getSrcScript(script.src, key)
}

function getSrcScript(src: string, key?: string | number) {
  return <script key={key} src={src} type="application/javascript" />
}

function getInnerScript(content: string, key?: string | number) {
  return (
    <script
      key={key}
      type="application/javascript"
      dangerouslySetInnerHTML={{
        __html: content.replace(/<\/script/gi, '&lt/script'),
      }}
    />
  )
}
