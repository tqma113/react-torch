export { default as createPage } from "./createPage";

import type { Context } from "../index";
import type { History } from "../history";
import type { Store, Actions } from "../store/index";
import type { LifeCircle } from "../lifecircle";

export type PageCreatorLoader<S extends object, AS extends Actions<S>> = () =>
  | PageCreator<S, AS>
  | Promise<PageCreator<S, AS>>;

export type PageCreator<S extends object, AS extends Actions<S>> = (
  history: History,
  context: Context
) =>
  | [React.ComponentType, Store<S, AS>, LifeCircle]
  | Promise<[React.ComponentType, Store<S, AS>, LifeCircle]>;

export type Creater<S extends object, AS extends Actions<S>> = (
  history: History,
  context: Context
) =>
  | [React.ComponentType, Store<S, AS>]
  | Promise<[React.ComponentType, Store<S, AS>]>;

export type Page<S extends object = {}, AS extends Actions<S> = {}> = () => [
  React.ComponentType,
  Store<S, AS>
];

export type PageWithoutStore = [React.ComponentType, null];
