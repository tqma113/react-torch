import React, {
  useState as useReactState,
  useLayoutEffect,
  useEffect,
} from 'react'
import { preload, ReactModelArg } from './preload'

const useIsomorphicLayoutEffect =
  // tslint:disable-next-line: strict-type-predicates
  typeof window !== 'undefined' &&
  // tslint:disable-next-line: strict-type-predicates
  typeof window.document !== 'undefined' &&
  // tslint:disable-next-line: deprecation & strict-type-predicates
  typeof window.document.createElement !== 'undefined'
    ? useLayoutEffect
    : useEffect

import type { ReactModel } from './createReactModel'

export type ReactModels = {
  [key: string]: ReactModel
}

export type ProviderProps = {
  list: ReactModelArg[]
}

export const Provider: React.FC<ProviderProps> = ({ list = [], children }) => {
  let [state, setState] = useReactState<{ Provider: React.FC } | null>(null)

  useIsomorphicLayoutEffect(() => {
    let isUnmounted = false

    preload(list).then((result) => {
      if (isUnmounted) return
      setState({
        Provider: result.Provider,
      })
    })

    return () => {
      isUnmounted = true
    }
  }, [])

  let Provider = state?.Provider

  if (!Provider) return null

  return <Provider>{children}</Provider>
}
