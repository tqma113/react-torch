import React from 'react'
import Home from './src/Home'
import Test from './src/Test'

const App = () => {
  const handleClick = () => {
    console.log('click')
  }
  return (
    <div onClick={handleClick}>
      <p>App</p>
      <Home />
      <Test />
    </div>
  )
}

export default App