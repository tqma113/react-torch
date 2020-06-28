import React from 'react'
import type { StylePreload, ScriptPreload } from '../index'

export type HeadProps = {
  title: string,
  styles: StylePreload[],
  scripts: ScriptPreload[]
}

export default function Head({ title, styles, scripts }: HeadProps) {
  return (
    <head>
      <title>{title}</title>
      <meta
        name="viewport"
        content="width=device-width,minimum-scale=1,initial-scale=1"
      />
      {
        styles.map((style) => {
          if (style.type == 'inner') {
            return (
              <style
                type="text/css"
                dangerouslySetInnerHTML={{ __html: style.content }}
              />
            )
          } else {
            return (
              <link rel="stylesheet" type="text/css" href={style.href} />
            )
          }
        })
      }
      {
        scripts.map((script) => {
          if (script.type == 'inner') {
            return (
              <script
                dangerouslySetInnerHTML={{ __html: script.content.replace(/<\/script/gi, '&lt/script') }}
              />
            )
          } else {
            return (
              <script src={script.src} />
            )
          }
        })
      }
    </head>
  )
}