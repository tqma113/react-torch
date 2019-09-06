import React from "react";
import History, { createMemoryHistory as createHistory } from "history";
import warning from "tiny-warning";

import Router from "./Router";

interface BrowserRouterProps extends History.MemoryHistoryBuildOptions {
  children: React.ReactChildren
}

/**
 * The public API for a <Router> that stores location in browser.
 */
class BrowserRouter extends React.Component<BrowserRouterProps> {
  private history = createHistory(this.props);

  constructor(props: BrowserRouterProps) {
    super(props)
  }

  render() {
    return <Router history={this.history} children={this.props.children} />;
  }
}

export default BrowserRouter;