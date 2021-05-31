import React from 'react'
import { Provider, ReactModels } from './Provider'
import type { ReactModelArg } from './preload'
type Constructor = new (...args: any[]) => any

const createReactModelArgs = <
  MS extends ReactModels,
  Renderable extends Constructor
>(
  Models: MS,
  renderable: Renderable
) => {
  let list: ReactModelArg[] = Object.values(Models).map((Model) => {
    return {
      Model,
      context: renderable,
    }
  })
  return list
}

export const provide =
  <MS extends ReactModels>(Models: MS) =>
  <C extends Constructor>(Renderable: C) => {
    return class extends Renderable {
      ReactModelArg = createReactModelArgs(Models, this as any)

      render() {
        return <Provider list={this.ReactModelArg}>{super.render()}</Provider>
      }
    }
  }
