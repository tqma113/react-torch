import React from 'react'

import { htmlEscapeJsonStringify } from '../utils/htmlescape'

import type {
  Context,
  TorchData,
  PreloadType,
  ScriptPreload,
  StylePreload,
} from '../../index'
import type { ReactElement } from 'react'

export type DocumentProps = {
  dir: string
  title: string
  context: Context
  container: string
  element: ReactElement
  cdn: string
  assets: {
    vendor: string
    index: string
  }
  state: object
  mode: PreloadType
  styles?: StylePreload[]
  scripts?: ScriptPreload[]
  stateList: any[]
}

export default function createDocument({
  dir,
  title,
  context,
  container,
  element,
  cdn,
  assets,
  state,
  mode,
  styles = [],
  scripts = [],
  stateList,
}: DocumentProps) {
  const data: TorchData = {
    context,
    container,
    state,
  }

  const styleElements = styles.map(getStyle)

  const scriptElements = scripts.map(getScript)

  const assetsScriptElement = [
    getSrcScript(`${cdn}${assets.vendor}`, 'vendor'),
    getSrcScript(`${cdn}${assets.index}`, 'index'),
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
          dangerouslySetInnerHTML={{
            __html: htmlEscapeJsonStringify(data),
          }}
        />
        <script
          type="application/javascript"
          dangerouslySetInnerHTML={{
            __html: htmlEscapeJsonStringify(`
            (function() {
              window.__DEV__ = ${context.env === 'development'}
            })()
          `),
          }}
        />
        <script
          type="application/javascript"
          dangerouslySetInnerHTML={{
            __html: htmlEscapeJsonStringify(`
            (function() {
              window.__MODEL_STATE_LIST__ = ${JSON.stringify(stateList)}
            })()
          `),
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
      dangerouslySetInnerHTML={{ __html: htmlEscapeJsonStringify(content) }}
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
        __html: htmlEscapeJsonStringify(content),
      }}
    />
  )
}
