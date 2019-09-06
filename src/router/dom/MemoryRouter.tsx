import React from "react";
import PropTypes from "prop-types";
import History, { createMemoryHistory as createHistory } from "history";
import warning from "tiny-warning";

import Router from "./Router";

interface MemoryRouterProps extends History.MemoryHistoryBuildOptions {
  children: React.ReactChildren
}

/**
 * The public API for a <Router> that stores location in memory.
 */
class MemoryRouter extends React.Component<MemoryRouterProps> {
  private history = createHistory(this.props);

  constructor(props: MemoryRouterProps) {
    super(props)
  }

  render() {
    return <Router history={this.history} children={this.props.children} />;
  }
}

export default MemoryRouter;