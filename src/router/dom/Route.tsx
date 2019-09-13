import React from 'react'
import invariant from "tiny-invariant";
import warning from "tiny-warning";
import history from 'history';

import createContext from '../createContext';

const RouterContext = createContext()

declare global {
  let __DEV__: boolean
}

interface IsEnptyChildren {
  (children: React.ReactChildren): boolean
}

const isEmptyChildren: IsEnptyChildren = (children) => {
  return React.Children.count(children) === 0;
}

interface RenderProps {
  [propName: string]: any
}

interface RouteProps {
  children?: React.ReactChildren | ((props: RenderProps) => React.ReactChildren) | null
  location: history.Location
  computedMatch: Function
  path: string
  render: (props: RenderProps) => React.ReactNode
  component: React.ComponentType
}
/**
 * The public API for matching a single path and rendering.
 */
class Route extends React.Component<RouteProps> {
  render() {
    return (
      <RouterContext.Consumer>
        {context => {
          invariant(context, "You should not use <Route> outside a <Router>");

          const location = this.props.location || context.location;
          const match = this.props.computedMatch
            ? this.props.computedMatch // <Switch> already computed the match for us
            : this.props.path
              ? matchPath(location.pathname, this.props)
              : context.match;

          const props = { ...context, location, match };

          let { children, component, render } = this.props;

          // Preact uses an empty array as children by
          // default, so use null if that's the case.
          if (Array.isArray(children) && children.length === 0) {
            children = null;
          }

          if (typeof children === "function") {
            children = children(props);

            if (children === undefined) {
              if (__DEV__) {
                const { path } = this.props;

                warning(
                  false,
                  "You returned `undefined` from the `children` function of " +
                    `<Route${path ? ` path="${path}"` : ""}>, but you ` +
                    "should have returned a React element or `null`"
                );
              }

              children = null;
            }
          }

          return (
            <RouterContext.Provider value={props}>
              {children && !isEmptyChildren(children as React.ReactChildren)
                ? children
                : props.match
                  ? component
                    ? React.createElement(component, props)
                    : render
                      ? render(props)
                      : null
                  : null}
            </RouterContext.Provider>
          );
        }}
      </RouterContext.Consumer>
    );
  }
}