import React from 'react'
import history from 'history'

import createContext from '../createContext'
import createMatcher from '../createMatcher'

export interface RouterProps {
  children: React.ReactChildren
  history: history.History
  context?: object
}

export interface RouterState {
  location: history.Location
}

class Router extends React.Component<RouterProps, RouterState> {
  private isMounted: boolean = false
  private pendingLocation: history.Location | null = null

  private unlisten: history.UnregisterCallback = () => {}
  
  constructor(props: RouterProps) {
    super(props)
    this.state = {
      location: props.history.location
    }

    if (!props.context) {
      this.unlisten = props.history.listen(location => {
        if (this.isMounted) {
          this.setState({ location });
        } else {
          this.pendingLocation = location;
        }
      })
    }
  }
}

export default Router