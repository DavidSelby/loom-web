import React from 'react'
import { render } from 'react-dom'
import { Router, Route, browserHistory, IndexRoute } from 'react-router'
import App from '../views/App'
import Home from '../views/Home'
import Feature from '../views/Features'
import Device from '../views/Devices'
import 'bootstrap'

render((
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Home}/>
      <Route path="/features" component={Feature} />
      <Route path="/devices" component={Device} />
    </Route>
  </Router>
), document.getElementById('content'))