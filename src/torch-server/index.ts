// import React from 'react'
import {
  createApp
} from '../server'

// export interface Render {
//   (element: React.ReactElement, container?: string): void
// }

export const render = (element: any, container?: any) => {
  const app = createApp()
  
  return app
}