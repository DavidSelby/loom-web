import React from 'react'
import { render } from 'react-dom'
import { Router, Route, browserHistory, IndexRoute } from 'react-router'
import App from '../views/App'
import Home from '../views/Home'
import Feature from '../views/Features'
import Device from '../views/Devices'
import Run from '../views/Run'

render((
	<Router history={browserHistory}>
		<Route path="/" component={App}>
			<IndexRoute component={Home}/>
			<Route path="/features" component={Feature} selectable="true" />
			<Route path="/devices" component={Device} selectable="false" />
			<Route path="/run" component={Run} selectable="true" />
		</Route>
	</Router>
), document.getElementById('content'))