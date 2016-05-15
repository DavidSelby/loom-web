
import React from 'react'
import ReactDom from 'react-dom'

// tutorial5.js

var BranchSelect = React.createClass({
	loadBranchesFromServer: function() {
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
		this.loadBranchesFromServer();
	},
	render: function() {
		var branches = this.state.branches.map(function(branch) {
    		return (
        		<li key={branch._id}>
        			<a href="#" onClick={this.props.handleBranch}>{branch.name}</a>
        		</li>
      		);
    	}.bind(this));
      	return (
			<div className="dropdown branches-dropdown">
				<a className="dropdown-toggle" type="button" data-toggle="dropdown">
					Branches
					<span className="caret"></span>
				</a>
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
				<td className="scenario-name">{this.props.scenario.scenario.replace(/Scenario: |Scenario Outline: /, "")}</td>
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
		    <div className="feature">
		      	<div className="feature-heading">
		      		{selectFeature}
		      		<a href={"#feat-"+this.props.feature._id} className="expand-collapse" data-toggle="collapse">
		      			<div>
			        	<h4 className="feature-name">
			        		{this.props.feature.feature}
			        	</h4>
			        	<p className="orange">+</p>
			        	</div>
			        </a>
		        </div>
		        <div className="collapse scenarios" id={"feat-" + this.props.feature._id}>
		        	<p className="feature-path small">{this.props.feature.path}</p>
			        <table className="scenario-table">
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
				var label = 'Select All';
				if (this.props.allChecked) {
					label = 'Select None';
				}
				return (
					<div className="featureList">
						<div className="select-all"><button className="btn btn-default" onClick={this.props.handleCheckAllFeatures}>{label}</button></div>
						<BranchSelect handleBranch={this.props.handleBranch} />
						<div className="refresh"><a onClick={this.props.getFeatures}><img src={'assets/refresh.png'} width="18px" height="18px" /></a></div>
						<form>
							{featureNodes}
						</form>
					</div>
	    		);
	    	} else {
	    		return (
	    			<div className="featureList">
						<BranchSelect handleBranch={this.props.handleBranch} />
						<div className="refresh"><button onClick={this.props.getFeatures}><img src={'assets/refresh.png'} width="18px" height="18px" /></button></div>
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
		if (this.props.features == "notFound") {
			return (
				<div className="container feature-block">
					<h2 className="page-subtitle feature-title">Feature List</h2>
					<p>Features not found, please check that a controller is running</p>
		      	</div>
		    );
		} else {
			return (
				<div className="container feature-block">
					<h2 className="page-subtitle feature-title">Feature List</h2>
					<FeatureList {...this.props} >
			        </FeatureList>
		      	</div>
			);
		}
	}
});
