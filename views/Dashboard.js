
import React from 'react'
import ReactDom from 'react-dom'

var Cuke = React.createClass({
	render: function() {
		return (
			<td className="cuke-info">
				<p className="cuke-device">{this.props.cuke.device}</p>
				<p className="cuke-status">{this.props.cuke.status}</p>
			</td>
		);
	}
});

var Run = React.createClass({
	getCukes: function() {
		var runId = this.props.run;
		$.get('/api/' + runId + '/cukes/', function(result) {
			this.setState({
				cukes: result
			});
		}.bind(this));
	},
	componentDidMount: function() {
		this.getCukes();
		this.interval = setInterval(this.getCukes, 5000);
	},
	componentWillUnmount: function() {
		clearInterval(this.interval);
	},
	getInitialState: function() {
		return {
			cukes: []
		}
	},
	render: function() {
		if (this.state.cukes.length > 0) {
			var cukes = this.state.cukes.map(function(cuke, index) {
				return(
					<Cuke {...this.props} cuke={cuke} run={this.props.run} index={index} key={cuke._id}></Cuke>
				);
			}.bind(this));
		} else {
			var cukes = <p>Loading...</p>;
		}
		return(
			<tr className="run">
				<td className="run-name">{this.props.run}: </td>
				{cukes}
			</tr>
		);
	}
});

var RunList = React.createClass({
	render: function() {
		if (this.props.runs.length > 0) {
			var runs = this.props.runs.map(function(run, index) {
				return (
					<Run {...this.props} run={run._id} index={index} key={run._id}></Run>
				);
			}.bind(this));
		} else {
			var runs = <p>Loading...</p>;
		}
		return(
			<div className="run-list">
			<h2>Run List</h2>
			<table>
				<tbody>
				{runs}
				</tbody>
			</table>
			</div>
		);
	}
});

export default React.createClass({
	getRuns: function() {
		this.serverRequest = $.get('/api/runs', function (runs) {
			this.setState({
				runs : runs
			});
		}.bind(this));
	},
	componentDidMount: function() {
		this.getRuns();
		this.interval = setInterval(this.getRuns, 5000);
	},
	componentWillUnmount: function() {
		clearInterval(this.interval);
	},
	getInitialState: function() {
		return {
			runs: []
		}
	},
	render: function() {
		return (
			<div>
				<div className="page-header">
					<h1>Dashboard</h1>
					<p>View past reports and stuff</p>
				</div>
				<div className="container run-page">
					<RunList {...this.props} runs={this.state.runs}></RunList>
				</div>
			</div>
		);
	}
})

