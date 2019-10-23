import React from 'react'

import Layout from './Layout'

class Test extends React.Component<{}> {
  constructor(props: {}) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }
  handleClick () {
    console.log('test')
  }
  render() {
    return (
      <div onClick={this.handleClick}>
        <p>test</p>
        <Layout />
      </div>
    )
  }
}

export default Test