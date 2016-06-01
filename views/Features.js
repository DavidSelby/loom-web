
import React from 'react'
import ReactDom from 'react-dom'

var Scenario = React.createClass({
	handleCheck: function() {
		this.props.handleScenarioCheck(this.props.feature, this.props.index);
	},
	render: function() {
		var selectScenario;
		if (this.props.selectable) {
			var selected = this.props.selectedScenarios[this.props.feature].scenarios[this.props.index];
			var selectScenario = <input type="checkbox" checked={selected} onChange={this.handleCheck} className={"select select-item sel-scen-" + this.props.scenario._id} />
		}
		return (
			<div className="scenario">
				{selectScenario}
				{this.props.scenario.scenario.replace(/Scenario: |Scenario Outline: /, "")}
			</div>
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
			        <div className="scenario-table">
			   			{scenarios}
			        </div>
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
			var refreshing = this.props.refreshing? ' refreshing' : '';
			if (this.props.selectable) {
				var label = this.props.allChecked ? 'Select None' : 'Select All';
				return (
					<div className={"featureList" + refreshing}>
						<div className="list-options">
							<div className="select-all"><button className="btn btn-default" onClick={this.props.handleCheckAllFeatures}>{label}</button></div>
							<button className={"btn btn-default refresh" + refreshing} onClick={this.props.refresh}>Refresh <img src={'assets/refresh.png'} width="18px" height="18px" /></button>
						</div>
						<form>
							{featureNodes}
						</form>
					</div>
	    		);
	    	} else {
	    		return (
	    			<div className={"featureList" + refreshing}>
						<button className={"btn btn-default refresh" + refreshing} onClick={this.props.refresh}>Refresh <img src={'assets/refresh.png'} width="18px" height="18px" /></button>
						{featureNodes}
					</div>
	    		);
	    	};
    	}
	}
});

export default React.createClass({
	refresh: function() {
		this.setState({
			refreshing: true
		}, this.props.getFeatures(this.refreshFinished));
	},
	getInitialState: function() {
		return {
			refreshing: false
		}
	},
	refreshFinished: function() {
		this.setState({
			refreshing: false
		});
	},
	getDefaultProps : function() {
		return {
			"selectable" : false,
			"handleScenarioCheck" : '',
			"selectedScenarios" : {}
		};
	},
	componentDidMount: function() {
		if (this.props.features.length < 1) {
			this.props.getFeatures(this.refreshFinished);
		}
	},
	render: function() {
		if (this.props.features == "notFound") {
			var features = <p>Features not found, please check that a controller is running</p>
		} else {
			var features = <FeatureList {...this.props} refresh={this.refresh} refreshing={this.state.refreshing}></FeatureList>
		}
		return (
			<div className="feature-block">
				{features}
		    </div>
		);
	}
});
