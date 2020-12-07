import React from 'react'
import { createPage } from '../../../src'
import store from './store'
import { Provider, useStore } from 'react-redux'
import './style.css'

// const ignorePropsChanged = View => {
//   let MemoizedView = (props) => {
//     let view = React.useMemo(() => {
//       return <View />
//     }, [])

//   return view
//   }
// }

const Home = createPage(async ({ history, context }) => {
  return {
    store,
    create: async () => {
      return () => {
        const state = store.getState()

        const INCREASE = () => {
          store.dispatch({ type: 'INCREMENT' })
        }
      
        const handleClick = () => {
          history.push('/test')
        }

        return (
          <Provider store={store}>
            <div>
              Home {state.count} <button onClick={INCREASE}>Increate</button>
              <hr />
              <a href="/about">about</a>
              <hr />
              <a href="/test">test</a>
              <hr />
              <a className="test" onClick={handleClick}>
                test
              </a>
            </div>
          </Provider>
        )
      }
    },
    beforeDestory: async (location) => {
      console.log(location, 'home beforeDestory')
    },
  }
})

export default Home
