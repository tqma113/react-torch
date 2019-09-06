import React from "react";
import History, { createHashHistory as createHistory } from "history";
import warning from "tiny-warning";

import Router from "./Router";

interface HashRouterProps extends History.MemoryHistoryBuildOptions {
  children: React.ReactChildren
}

/**
 * The public API for a <Router> that stores location in hash.
 */
class HashRouter extends React.Component<HashRouterProps> {
  private history = createHistory(this.props);

  constructor(props: HashRouterProps) {
    super(props)
  }

  render() {
    return <Router history={this.history} children={this.props.children} />;
  }
}

export default HashRouter;