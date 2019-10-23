import React, { useEffect } from 'react'

import Layout from './Layout'

function Home() {
  useEffect(() => {
    console.log('Home')
  })
  return (
    <div>
      <p>home</p>
      <Layout />
    </div>
  )
}

export default Home