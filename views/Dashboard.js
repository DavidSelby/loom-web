
import React from 'react'
import ReactDom from 'react-dom'

var Cuke = React.createClass({
	componentDidMount: function() {
		console.log("WUT");
		this.props.addDeviceName(this.props.cuke.device);
	},
	render: function() {
		return (
			<td className="cuke-info">
				<p className="cuke-device">{this.props.deviceNames[this.props.cuke.device]}</p>
				<p className="cuke-status">{this.props.cuke.status}</p>
			</td>
		);
	}
});

var Run = React.createClass({
	getCukes: function() {
		var runId = this.props.run._id;
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
					<Cuke {...this.props} cuke={cuke} run={this.props.run._id} index={index} key={cuke._id}></Cuke>
				);
			}.bind(this));
		} else {
			var cukes = <td>Loading...</td>;
		}
		return(
			<tr className="run">
				<td className="run-name">{this.props.run.name}: </td>
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
					<Run {...this.props} run={run} index={index} key={run._id}></Run>
				);
			}.bind(this));
		} else {
			var runs = <tr><td>Loading...</td></tr>;
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
	addDeviceName: function(udid) {
		var deviceNames = this.state.deviceNames;
		if (!(udid in deviceNames)) {
			$.get('/api/devices/' + udid, function(result) {
				deviceNames[udid] = result[0].deviceName;
				this.setState({
					deviceNames: deviceNames
				});
			}.bind(this));
		}
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
			deviceNames: {},
			runs: []
		}
	},
	render: function() {
		return (
			<div>
				<div className="page-header">
					<h2>Dashboard</h2>
					<p>View past reports and stuff</p>
				</div>
				<div className="page-content run-page">
					<RunList {...this.props} addDeviceName={this.addDeviceName} deviceNames={this.state.deviceNames} runs={this.state.runs}></RunList>
				</div>
			</div>
		);
	}
})

