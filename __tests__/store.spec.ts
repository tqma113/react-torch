import { createStore } from '../src/lib/store'

describe('store', () => {
  it('should get current state by store.state', () => {
    const store = createStore({ count: 0 }, {})
    expect(store.state).toEqual({ count: 0 })
  })

  it('should change state by calling actions', () => {
    const store = createStore(
      { count: 0 },
      {
        INCREMENT: (state) => {
          return {
            ...state,
            count: state.count + 1,
          }
        },
        DECREMENT: (state) => {
          return {
            ...state,
            count: state.count - 1,
          }
        },
      }
    )

    expect(store.state).toEqual({ count: 0 })

    store.actions.INCREMENT()
    expect(store.state).toEqual({ count: 1 })

    store.actions.DECREMENT()
    expect(store.state).toEqual({ count: 0 })
  })

  it('should trigger listeners after state changed', () => {
    const store = createStore(
      { count: 0 },
      {
        INCREMENT: (state) => {
          return {
            ...state,
            count: state.count + 1,
          }
        },
      }
    )

    const listener = jest.fn()
    store.listen(listener)
    store.listen((data) => {
      expect(data.currentState).toStrictEqual({ count: 1 })
      expect(data.previousState).toStrictEqual({ count: 0 })
    })

    store.actions.INCREMENT()
    expect(listener).toBeCalledTimes(1)
  })

  it('should not trigger listeners when state not changed', () => {
    const store = createStore(
      { count: 0 },
      {
        IDENTITY: (state) => {
          return state
        },
      }
    )

    const listener = jest.fn()
    store.listen(listener)

    store.actions.IDENTITY()
    expect(listener).toBeCalledTimes(0)
  })

  it('should not trigger listeners when state not changed', () => {
    const store = createStore(
      { count: 0 },
      {
        INCREMENT: (state) => {
          return {
            ...state,
            count: state.count + 1,
          }
        },
      }
    )

    const listener = jest.fn()
    const unlisten = store.listen(listener)

    store.actions.INCREMENT()
    expect(listener).toBeCalledTimes(1)

    unlisten()
    store.actions.INCREMENT()
    expect(listener).toBeCalledTimes(1)
  })

  it('should warning when listener has been unlisten twice', () => {
    const store = createStore({ count: 0 }, {})
    const listener = jest.fn()

    jest.spyOn(console, 'warn')

    const unlisten = store.listen(listener)

    unlisten()
    unlisten()

    expect(console.warn).toBeCalledTimes(1)
  })
})
