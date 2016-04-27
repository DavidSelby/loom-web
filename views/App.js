import React from 'react'
import { render } from 'react-dom'
import NavLink from './NavLink'
import Features from './Features'

export default React.createClass({
  render() {
    return (
      <div>
        <h1>Arachne</h1>
        <ul role="nav">
          <li><NavLink to="/" onlyActiveOnIndex>Home</NavLink></li>
          <li><NavLink to="/features">Features</NavLink></li>
        </ul>
        {this.props.children}
      </div>
    )
  }
})