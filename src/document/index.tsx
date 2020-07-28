import fs from 'fs'
import path from 'path'
import React from 'react'
import type {
  Context,
  TORCH_DATA,
  PreloadType,
  ScriptPreload,
  StylePreload
} from '../index'
import type { ReactElement } from 'react'


export type DocumentProps = {
  dir: string,
  title: string,
  context: Context,
  container: string,
  element: ReactElement,
  publicPath: string,
  assets: {
    scripts: string[],
    styles: string[]
  },
  state: object,
  mode: PreloadType,
  styles?: StylePreload[],
  scripts?: ScriptPreload[],
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
  scripts = []
}: DocumentProps) {
  const data: TORCH_DATA = {
    context,
    container,
    state
  }

  const styleElements = styles.map((style, index) => {
    if (style.type === 'link' && style.preload) {
      if (mode === 'inner') {
        return null
      }
      return React.createElement('link', {
        key: index,
        href: style.href,
        rel: 'preload',
        as: 'style',
        type: "text/css"
      })
    } else {
      return null
    }
  }).concat(assets.styles.map((style, index) => {
    if (mode === 'inner') {
      return null
    }
    return React.createElement('link', {
      key: index,
      href: `${publicPath}/${style}`,
      rel: 'preload',
      as: 'style',
      type: "text/css"
    })
  })).concat(styles.map((style, index) => {
    if (style.type === 'link') {
      if (mode === 'inner') {
        const filePath = path.resolve(dir, '.torch', 'client', style.href.replace('static', 'public'))
        const code = fs.readFileSync(filePath)
        return (
          <style
            key={index}
            type="text/css"
            dangerouslySetInnerHTML={{ __html: code.toString() }}
          />
        ) 
      }
      return (
        <link key={index} rel="stylesheet" type="text/css" href={style.href} />
      )
    } else {
      return null
    }
  })).concat(assets.styles.map((style, index) => {
    if (mode === 'inner') {
      const filePath = path.resolve(dir, '.torch', 'client', style)
      const code = fs.readFileSync(filePath)
      return (
        <style
          key={index}
          type="text/css"
          dangerouslySetInnerHTML={{ __html: code.toString() }}
        />
      ) 
    }
    return (
      <link key={index} rel="stylesheet" type="text/css" href={`${publicPath}/${style}`} />
    )
  })).concat(styles.map((style, index) => {
    if (style.type === 'inner') {
      return (
        <style
          key={index}
          type="text/css"
          dangerouslySetInnerHTML={{ __html: style.content }}
        />
      ) 
    } else {
      return null
    }
  })).filter(Boolean)

  const scriptElements = scripts.map((script, index) => {
    if (script.type == 'inner') {
      return (
        <script
          key={index}
          type="application/javascript"
          dangerouslySetInnerHTML={{ __html: script.content.replace(/<\/script/gi, '&lt/script') }}
        />
      )
    } else {
      return (
        <script key={index} src={script.src} type="application/javascript" />
      )
    }
  })


  const deferScriptElement = assets.scripts.map((script, index) => {
    return (
      <script key={index} src={`${publicPath}/${script}`} />
    )
  })

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
          <strong>We're sorry but ${title} doesn't work properly without JavaScript enabled.You need to enable JavaScript to run this app.</strong>
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
          `
          }}
        />

        {deferScriptElement}
      </body>
    </html>
  )
}
