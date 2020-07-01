import React from 'react'
import type {
  Env,
  Context,
  TORCH_DATA,
  ScriptPreload,
  StylePreload
} from '../index'

export interface DocumentProps {
  title: string,
  context: Context,
  container: string,
  content: string,
  publicPath: string,
  assets: {
    index: string,
    vendor: string
  },
  state: object,
  styles?: StylePreload[],
  scripts?: ScriptPreload[]
}

export default function Document({
  title,
  context,
  container,
  content,
  publicPath,
  assets,
  state,
  styles = [],
  scripts = []
}: DocumentProps) {
  const data: TORCH_DATA = {
    context,
    container,
    state
  }

  return (
    <Html>
      <Head title={title} scripts={scripts} styles={styles} />

      <body>
        <NoScript />

        <Main container={container} content={content} />

        <TorchData env={context.env} data={data} />

        <TorchScripts
          index={`${publicPath}/${assets.index}`}
          vendor={`${publicPath}/${assets.vendor}`}
        />
      </body>
    </Html>
  )
}

function Html(props: React.PropsWithChildren<{}>) {
  return (
    <html {...props} />
  )
}

type HeadProps = {
  title: string,
  styles: StylePreload[],
  scripts: ScriptPreload[]
}

function Head({ title, styles, scripts }: HeadProps) {
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

function NoScript() {
  return (
    <noscript>
      You need to enable JavaScript to run this app.
    </noscript>
  )
}

type MainProps = {
  container: string,
  content: string
}

function Main({ container, content }: MainProps) {
  return (
    <div id={`${container}`} dangerouslySetInnerHTML={{ __html: content }}></div>
  )
}

type TorchDataProps = {
  env: Env,
  data: TORCH_DATA
}

function TorchData({ env, data }: TorchDataProps) {
  return (
    <>
      <script
        id="__TORCH_DATA__"
        type="application/json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `
          (function() {
            window.__DEV__ = ${env === 'development'}
          })()
        `
        }}
      />
    </>
  )
}


type TorchScriptsProps = {
  index: string,
  vendor: string
}

function TorchScripts({ index, vendor }: TorchScriptsProps) {
  return (
    <>
      <script src={index}></script>
      <script src={vendor}></script>
    </>
  )
}
