
import React from 'react'
import ReactDom from 'react-dom'

// tutorial5.js

var Scenario = React.createClass({
	render: function() {
		return (
			<tr>
				<td className="text-success">{this.props.scenario.scenario}</td>
				<td className="line-num text-muted">{this.props.scenario.lineNum}</td>
			</tr>
		)
	}
});

var Feature = React.createClass({
  render: function() {
  	var scenarios = this.props.feature.scenarios.map(function(scenario) {
  		return (
  			<Scenario scenario={scenario} key={scenario._id}/>
  		);
    });
    return (
      <div className="feature panel panel-default">
      	<div className="panel-heading">
	        <h4>
	        	<a class="btn btn-info" href={"#feat-"+this.props.feature._id} data-toggle="collapse">{this.props.feature.feature}</a>
	        </h4>
	        <p className="featureTitle">{this.props.feature.path}</p>
        </div>
        <div className="collapse panel-body" id={"feat-" + this.props.feature._id}>
	        <table>
	        	<tbody>
	   				{scenarios}
	   			</tbody>
	        </table>
        </div>
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
				<h2>Feature List</h2>
	            <FeatureList data={this.state.data}>
	            </FeatureList>
      		</div>
		);
	}
});
