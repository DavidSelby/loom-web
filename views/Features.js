
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
	handleCheck: function(event) {
		this.props.handleScenarioCheck(this.props.scenario.lineNum);
	},
	render: function() {
		var selectScenario;
		if (this.props.selectable) {
			selectScenario = <input type="checkbox" onChange={this.handleCheck} className={"select select-item sel-scen-" + this.props.scenario._id} />
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
	handleScenarioCheck: function(num) {
		var lineNumsArray = [];
		var lineNums = '';
		// If state already has value for lineNums string, put the line numbers into an array
		if (this.state.lineNums.length > 0) {
			lineNumsArray = this.state.lineNums.replace(this.props.feature.path + ':', '').split(':');
		}
		// Find index line number for scenario that was checked.
		var index = lineNumsArray.indexOf(num.toString());
		// If line number is already in lineNum string from state, remove it. If it isn't then add it.
		if (index > -1) {
			lineNumsArray.splice(index, 1);
		} else {
			lineNumsArray = lineNumsArray.concat([num]);
		}
		// If the array of line numbers is not empty, concat the feature path and line numbers, separated by ':'
		if (lineNumsArray.length > 0) {
			lineNums = this.props.feature.path + ':' + lineNumsArray.join(":");
		}
		this.setState({
			lineNums: lineNums
		}, function() {
			console.log(this.state.lineNums);
		});
	},
	handleFeatureCheck: function(event) {

		this.props.sendScenario(this.props.feature.path);
	},
	getInitialState: function() {
		return {
			selected: false,
			lineNums: ''
		};
	},
  	render: function() {
	  	var selectFeature;
	  	var scenarios = this.props.feature.scenarios.map(function(scenario) {
	  		return (
	  			<Scenario handleScenarioCheck={this.handleScenarioCheck} selectable={this.props.selectable} scenario={scenario} key={scenario._id}/>
	  		);
	    }.bind(this));
	    if (this.props.selectable) {
	    	selectFeature = <input type="checkbox" onChange={this.handleCheck} className={"select select-item sel-feat-" + this.props.feature._id} />
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
		var featureNodes = this.props.features.map(function(feature) {
    		return (
    			<Feature sendScenario={this.props.sendScenario} selectable={this.props.selectable} feature={feature} key={feature._id}>
				</Feature>
			);
		}.bind(this));
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
		            	<FeatureList sendScenario={this.props.sendScenario} selectable={this.props.selectable} features={this.state.features}></FeatureList>
		            </div>
	      		</div>
				)
		} else {
			return (
				<div className="featureBlock">
					<h2 className="page-title feature-title">Feature List</h2>
					<BranchSelect />
		            <FeatureList sendScenario={this.props.sendScenario} selectable={this.props.selectable} collapsed={this.props.collapsed} features={this.state.features}>
		            </FeatureList>
	      		</div>
			);
		}
	}
});
