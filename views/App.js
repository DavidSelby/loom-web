import React from 'react'
import { render } from 'react-dom'
import NavLink from './NavLink'
import Features from './Features'
import Devices from './Devices'

export default React.createClass({
  render() {
    return (
      <div className="page">
        <div className="app-header">
          <ul className="nav nav-tabs" role="nav">
            <li><NavLink to="/" onlyActiveOnIndex className="app-title">Arachne</NavLink></li>
            <li><NavLink to="/features">Features</NavLink></li>
            <li><NavLink to="/devices">Devices</NavLink></li>
            <li><NavLink to="/run">Run Tests</NavLink></li>
          </ul>
        </div>
        <div className="container">
          {this.props.children}
        </div>
      </div>
    )
  }
})