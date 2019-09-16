import React from 'react'

const App = () => {
  const handleClick = () => {
    console.log('click')
  }
  return (
    <div onClick={handleClick}>
      App
    </div>
  )
}

export default App