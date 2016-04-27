
import React from 'react'
import ReactDom from 'react-dom'

// tutorial5.js

var Scenario = React.createClass({
	render: function() {
		return (
			<tr>
				<td>{this.props.scenario.scenario}</td>
				<td><p>{this.props.scenario.lineNum}</p></td>
			</tr>
		)
	}
});

var Feature = React.createClass({
  render: function() {
  	var scenarios = this.props.feature.scenarios.map(function(scenario) {
  		return (
  			<Scenario scenario={scenario} />
  		);
    });
    return (
      <div className="feature">
        <h4>{this.props.feature.feature}</h4>
        <p className="featureTitle">{this.props.feature.path}</p>
        <ul>
   			{scenarios}
        </ul>
      </div>
    );
  }
});

var FeatureList = React.createClass({
  render: function() {
	var featureNodes = this.props.data.map(function(feature) {
      return (
        <Feature feature={feature} key={feature._id}>
        </Feature>
      );
    });
    return (
      <div className="featureList">
        {featureNodes}
      </div>
    );
  }
});

export default React.createClass({
	loadFeaturesFromServer: function() {
		this.serverRequest = $.get('/api/features', function (result) {
	    	this.setState({
	    		data: result
	    	});
	    }.bind(this));
	},
	getInitialState: function() {
		return {data: []};
	},
	componentDidMount: function() {
		this.loadFeaturesFromServer();
		this.interval = setInterval(this.loadFeaturesFromServer, 5000);
	},
	componentWillUnmount: function() {
		clearInterval(this.interval);
	},
	render: function() {
		return (
			<div className="featureBlock">
				<h1>Feature List</h1>
	            <FeatureList data={this.state.data}>
	            </FeatureList>
      		</div>
		);
	}
});
