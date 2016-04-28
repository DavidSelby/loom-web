import React from 'react'
import { render } from 'react-dom'
import { Router, Route, browserHistory, IndexRoute } from 'react-router'
import App from '../views/App'
import Home from '../views/Home'
import Feature from '../views/Features'
import 'bootstrap'

render((
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Home}/>
      <Route path="/features" component={Feature} />
    </Route>
  </Router>
), document.getElementById('content'))