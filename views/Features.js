
import React from 'react'
import ReactDom from 'react-dom'

// tutorial5.js

var BranchSelect = React.createClass({
	loadFeaturesFromServer: function() {
		this.serverRequest = $.get('/api/branches', function (result) {
			this.setState({
				branches : result
			});
		}.bind(this));
	},
	getInitialState: function() {
		return {branches: []};
	},
	componentDidMount: function() {
		this.loadFeaturesFromServer();
	},
	render: function() {
		var branches = this.state.branches.map(function(branch) {
    		return (
        		<li key={branch._id}>
        			<a href="#">{branch.name}</a>
        		</li>
      		);
    	});
      	return (
			<div className="dropdown branches-dropdown">
				<button className="dropdown-toggle" type="button" data-toggle="dropdown">
					Branches
					<span className="caret"></span>
				</button>
				<ul className="dropdown-menu">
		    		{branches}
		    		<li role="separator" className="divider"></li>
		    		<li><a href="#">Refresh</a></li>
	  			</ul>
			</div>
		);
	}
});

var Scenario = React.createClass({
	render: function() {
		var selectScenario;
		if (this.props.selectable) {
			selectScenario = <input type="checkbox" className={"select select-item sel-scen-" + this.props.scenario._id} />
		}
		return (
			<tr className="scenario">
				<td>{selectScenario}</td>
				<td className="text-success">{this.props.scenario.scenario}</td>
				<td className="line-num text-muted">{this.props.scenario.lineNum}</td>
			</tr>
		);
	}
});

var Feature = React.createClass({
  render: function() {
  	var selectFeature;
  	var selectable = this.props.selectable;
  	var scenarios = this.props.feature.scenarios.map(function(scenario) {
  		return (
  			<Scenario selectable={selectable} scenario={scenario} key={scenario._id}/>
  		);
    });
    if (this.props.selectable) {
    	selectFeature = <input type="checkbox" className={"select select-item sel-feat-" + this.props.feature._id} />
    }
    return (
	    <div className="feature panel panel-default">
	      	<div className="feature-heading panel-heading">
	      		{selectFeature}
	      		<a href={"#feat-"+this.props.feature._id} className="expand-collapse" data-toggle="collapse">
		        	<h4 className="feature-name">
		        		{this.props.feature.feature}
		        	</h4>
		        	<span className="caret"></span>
		        </a>
	        </div>
	        <div className="collapse panel-body" id={"feat-" + this.props.feature._id}>
	        	<p className="feature-path small">{this.props.feature.path}</p>
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
		console.log(this.props.features)
		console.log(this.props.features.features)
		var selectable = this.props.selectable;
		var featureNodes = this.props.features.map(function(feature) {
    		return (
    			<Feature selectable={selectable} feature={feature} key={feature._id}>
				</Feature>
			);
		});
		if (this.props.selectable) {
			return (
				<div className="featureList">
					<form>
						{featureNodes}
					</form>
				</div>
    		);
    	} else {
    		return (
    			<div className="featureList">
					{featureNodes}
				</div>
    		);
    	};
	}
});

export default React.createClass({
	getDefaultProps : function() {
		return {
			"selectable" : false,
			"collapsed" : false
		};
	},
	loadFeaturesFromServer: function() {
		this.serverRequest = $.get('/api/features', function (result) {
	    	this.setState({
	    		features: result[0].features
	    	});
	    }.bind(this));
	},
	getInitialState: function() {
		return {features: []};
	},
	componentDidMount: function() {
		this.loadFeaturesFromServer();
		// this.interval = setInterval(this.loadFeaturesFromServer, 5000);
	},
	componentWillUnmount: function() {
		clearInterval(this.interval);
	},
	render: function() {
		if (this.props.collapsed) {
			return (
				<div className="featureBlock">
					<a href="#featureList" data-toggle="collapse">
						<h2 className="page-title feature-title">Feature List</h2>
						<span className="caret black xl" />
					</a>
					<div className="collapse" id="featureList">
						<BranchSelect />
		            	<FeatureList selectable={this.props.selectable} features={this.state.features}></FeatureList>
		            </div>
	      		</div>
				)
		} else {
			return (
				<div className="featureBlock">
					<h2 className="page-title feature-title">Feature List</h2>
					<BranchSelect />
		            <FeatureList selectable={this.props.selectable} collapsed={this.props.collapsed} features={this.state.features}>
		            </FeatureList>
	      		</div>
			);
		}
	}
});
