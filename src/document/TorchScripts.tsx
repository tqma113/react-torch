import React from 'react'

export type TorchScriptsProps = {
  index: string,
  vendor: string
}

export default function TorchScripts({ index, vendor }: TorchScriptsProps) {
  return (
    <>
      <script src={index}></script>
      <script src={vendor}></script>
    </>
  )
}