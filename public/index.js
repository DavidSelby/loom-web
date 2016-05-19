import React from 'react'
import { render } from 'react-dom'
import { Router, Route, browserHistory, IndexRoute } from 'react-router'
import App from '../views/App'
import Home from '../views/Home'
import FeaturesPage from '../views/FeaturesPage'
import DevicePage from '../views/DevicePage'
import Run from '../views/Run'
import Dashboard from '../views/Dashboard'

render((
	<Router history={browserHistory}>
		<Route path="/" component={App}>
			<IndexRoute component={Dashboard}/>
			<Route path="/features" component={FeaturesPage} selectable="true" />
			<Route path="/devices" component={DevicePage} selectable="false" />
			<Route path="/run" component={Run} selectable="true" />
		</Route>
	</Router>
), document.getElementById('content'))