
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
	handleCheck: function() {
		this.props.handleScenarioCheck(this.props.feature, this.props.index);
	},
	render: function() {
		var selectScenario;
		if (this.props.selectable) {
			var selected = this.props.selectedScenarios[this.props.feature][this.props.index];
			var selectScenario = <input type="checkbox" checked={selected} onChange={this.handleCheck} className={"select select-item sel-scen-" + this.props.scenario._id} />
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
	handleCheck: function() {
		this.props.handleFeatureCheck(this.props.index);
	},
  	render: function() {
	  	var selectFeature;
	  	var scenarios = this.props.feature.scenarios.map(function(scenario, index) {
			return (
				<Scenario
					{...this.props}
					feature={this.props.index}
					index={index}
					scenario={scenario}
					key={scenario._id} />
		  	);
	    }.bind(this));
	    if (this.props.selectable) {
	    	selectFeature = <input type="checkbox" checked={this.props.selectedFeatures[this.props.index]} onChange={this.handleCheck} className={"select select-item sel-feat-" + this.props.feature._id} />
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
		var featureNodes = this.props.features.map(function(feature, index) {
    		return (
				<Feature {...this.props}
					index={index}
					feature={feature}
					key={feature._id}>
				</Feature>
			);
		}.bind(this));
		if (featureNodes.length < 1) {
			return (
				<p className="spinner">Loading...</p>
			)
		} else {
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
	}
});

export default React.createClass({
	getDefaultProps : function() {
		return {
			"selectable" : false,
			"handleScenarioCheck" : '',
			"selectedScenarios" : []
		};
	},
	componentDidMount: function() {
		if (this.props.features.length < 1) {
			this.props.getFeatures();
		}
	},
	render: function() {
		return (
			<div className="feature-block">
				<h2 className="page-title feature-title">Feature List</h2>
				<BranchSelect />
		        <FeatureList {...this.props} >
		        </FeatureList>
	      	</div>
		);
	}
});
