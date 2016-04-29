import React from 'react'
import { render } from 'react-dom'
import NavLink from './NavLink'
import Features from './Features'
import Devices from './Devices'

export default React.createClass({
  render() {
    return (
      <div className="container">
        <h1>Arachne</h1>
        <ul className="nav nav-tabs" role="nav">
          <li><NavLink to="/" onlyActiveOnIndex>Home</NavLink></li>
          <li><NavLink to="/features">Features</NavLink></li>
          <li><NavLink to="/devices">Devices</NavLink></li>
          <li><NavLink to="/run">Run Tests</NavLink></li>
        </ul>
        {this.props.children}
      </div>
    )
  }
})