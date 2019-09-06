import * as React from 'react'
import ReactTorch from '../../src'

import App from './App'

let app = ReactTorch.render(
  <App />,
  'root'
)

app.listen(3000, () => {
  console.log('start')
})