import React from 'react'

export type MainProps = {
  container: string,
  content: string
}

export default function Main({ container, content }: MainProps) {
  return (
    <div id={`${container}`} dangerouslySetInnerHTML={{ __html: content }}></div>
  )
}