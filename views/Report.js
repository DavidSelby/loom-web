import React from 'react'
import ReactDom from 'react-dom'

var Scenario = React.createClass({
	render: function() {
		var steps = this.props.scenario.steps.map(function(step, index) {
			var error = (step.error != null) ? <p>{step.error}</p> : ''; 
			return(
				<div key={index}>
				<p className={"step-name " + step.result}>{step.name}</p>
				{error}
				</div>
			);
		}.bind(this));
		return(
			<div>
			<p className={"scenario-name " + this.props.scenario.result}>{this.props.scenario.name}</p>
			{steps}
			</div>
		);
	}
});

export default React.createClass({
	loadReports: function() {
		$.get('/api/reports', function(result) {
			this.setState({
				report: result[0].report[0]
			});
		}.bind(this));
	},
	componentDidMount: function() {
		this.loadReports();
	},
	getInitialState: function() {
		return {
			report: {}
		};
	},
	render: function() {
		var report = this.state.report;
		if (Object.keys(report).length > 0) {
			var scenarios = this.state.report.scenarios.map(function(scenario, index) {
				return (
					<Scenario {...this.props} scenario={scenario} key={index}></Scenario>
					);
			}.bind(this));
		} else {
			var scenarios = <p>loading...</p>;
		}
		var visible = this.props.visible ? " displayed" : " hidden";
		return(
			<div className="report-overlay">
			<div className="report-modal">
			<a className="close-modal" onClick={this.props.close}>Close X</a>
			<div className="report">
			{scenarios}
			</div>
			</div>
			</div>
		);
	}
});