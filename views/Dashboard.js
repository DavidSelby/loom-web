
import React from 'react'
import ReactDom from 'react-dom'
import Report from './Report'

var CukeInfo = React.createClass({
	viewReport: function() {
		this.setState({
			reportVisible: true
		});
	},
	closeReport: function() {
		this.setState({
			reportVisible: false
		});
	},
	cancel: function() {
		this.spinning();
		$.post("/api/cukes/" + this.props.cuke._id + "/cancelled", function() {
			this.props.getCukes(this.stopSpinning);
		}.bind(this));
	},
	stop: function() {
		//this.spinning();
		$.post("/api/cukes/" + this.props.cuke._id + "/stop");
	},
	spinning: function() {
		this.setState({
			spinning: true
		});
	},
	stopSpinning: function() {
		this.setState({
			spinning: false
		});
	},
	getInitialState: function() {
		return {
			result: '',
			reportVisible: false
		}
	},
	render: function() {
		var expanded = this.props.expanded ? ' expanded' : ''; 
		if (this.props.cuke != undefined) {
			if (["queued", "pending"].indexOf(this.props.cuke.status) > -1) {
				var button = <button className="btn btn-default cuke-button" onClick={this.cancel}>Cancel</button>
			} else if (this.props.cuke.status == "running") {
				var button = <button className="btn btn-default cuke-button" onClick={this.stop}>Stop</button>
			}
			var report = this.state.reportVisible ? <Report close={this.closeReport}/> : '';
			return (
				<div id={"cuke-info-" + this.props.cuke._id} className={"cuke-info " + this.props.cuke.status + expanded}>
					<p className="cuke-command"><b>Command: </b>{this.props.cuke.command}</p>
					<p className="cuke-status"><b>Status: </b>{this.props.cuke.status}</p>
					{button}
					<p className="device-info"><b>Device:</b> {this.props.cuke.device.deviceName}</p>
					<p className="device-info"><b>{this.props.cuke.device.platformName} Version:</b> {this.props.cuke.device.platformVersion}</p>
					<p className="device-info"><b>Device UDID:</b> {this.props.cuke.device.udid}</p>
					<div className="report-links"><a className="view-report" onClick={this.viewReport}>View Report</a></div>
					{report}
				</div>
			);
		} else {
			return (
				<p className={"cuke-info" + expanded}>Error. Please reload the page.</p>
			);
		}
	}
});

var Cuke = React.createClass({
	getInitialState: function() {
		return {
			spinning: false,
			displayed: false
		}
	},
	render: function() {
		var displayed = this.props.expanded ? ' expanded' : '';
		var spinning = this.state.spinning ? <div className="spinning" /> : '';
		if (this.props.cuke.status == "done") {
			console.log("RESULT: " + this.props.report);
			if (this.props.report == undefined) {
				var result = "Loading results...";
			} else if (this.props.report.result == undefined) {
				var result = "Result not found"
			} else {
				var result = this.props.report.result;
			}
		
		} else {
			var result = this.props.cuke.status;
		}
		return (
			<div id={"cuke-" + this.props.cuke._id} className={"cuke " + this.props.cuke.status + displayed}>
				<a className="cuke-summary" onClick={() => this.props.expand(this.props.index)}>
					{spinning}
					<ul>
						<li className="cuke-device">{this.props.cuke.device.deviceName}</li>
						<li className="cuke-result">{result}</li>
					</ul>					
				</a>
			</div>
		);
	}
});

var Run = React.createClass({
	getCukes: function(done) {
		var runId = this.props.run._id;
		$.get('/api/' + runId + '/cukes/', function(result) {
			this.setState({
				cukes: result
			}, function() {
				var reports = this.fetchReports();
				this.setState({
					reports: reports
				});
				if (typeof(done) != "undefined") {
					done();
				}
			});
		}.bind(this));
	},
	fetchReports: function() {
		var cukes = this.state.cukes;
		var reports = this.state.reports;
		if (this.state.cukes != {}) {
			cukes.forEach(function(cuke) {
				if (cuke.status == "done") {
					$.get('/api/' + cuke._id + '/reports', function(result) {
						reports[cuke._id] = result;
					});
				}
			}.bind(this));
			return reports;
		}
	},
	expandCuke: function(cuke) {
		console.log("CUKE: " + cuke);
		if (this.state.selected == cuke) {
			var selected = null;
		} else {
			var selected = cuke;
		}
		this.setState({
			selected: selected
		}, function() {
			console.log("SELECTED: " + this.state.selected);
		});
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
			cukes: [],
			reports: {},
			selected: null,
			result: ''
		}
	},
	render: function() {
		if (this.state.cukes.length > 0) {
			var cukes = this.state.cukes.map(function(cuke, index) {
				var expanded = (this.state.selected == index) ? true : false;
				return(
					<Cuke {...this.props} cuke={cuke} report={this.state.reports[cuke._id]} expanded={expanded} expand={this.expandCuke} index={index} key={cuke._id}></Cuke>
				);
			}.bind(this));
		} else {
			var cukes = <p>Loading...</p>;
		}
		return(
			<div className="run">
				<div className="run-name"><p>{this.props.run.name}: </p></div>
				<div className="cuke-list">
					{cukes}
				</div>
				<CukeInfo cuke={this.state.cukes[this.state.selected]} reports={this.state.reports} expanded={this.state.selected != null}></CukeInfo>
			</div>
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
			var runs = <p>Loading...</p>;
		}
		return(
			<div className="run-list">
				<div className="dash-headers">
				</div>
				{runs}
			</div>
		);
	}
});

export default React.createClass({
	refreshRuns: function() {
		this.serverRequest = $.get('/api/runs?offset=0&load=' + this.state.load, function (runs) {
			this.setState({
				runs : runs
			});
		}.bind(this));
	},
	getRuns: function(offset) {
		this.serverRequest = $.get('/api/runs?offset=' + offset + '&load=10', function (runs) {
			this.setState({
				runs : this.state.runs.concat(runs),
				load: offset + 10
			});
		}.bind(this));
		this.serverRequest = $.get('api/runs/count', function (count) {
			this.setState({
				runCount: count
			});
		}.bind(this));
	},
	componentDidMount: function() {
		this.getRuns(0);
		this.interval = setInterval(this.refreshRuns, 5000);
	},
	componentWillUnmount: function() {
		clearInterval(this.interval);
	},
	getInitialState: function() {
		return {
			deviceNames: {},
			runs: [],
			load: 10
		}
	},
	render: function() {
		if (this.state.runCount > this.state.load) {
			var loadMore = <button className="btn btn-default" onClick={() => this.getRuns(this.state.load)}>Load more</button>;
		} else {
			var loadMore = '';
		}
		return (
			<div>
				<div className="page-header">
					<h2>Dashboard</h2>
					<p>View past reports and stuff</p>
				</div>
				<div className="page-content run-page">
					<RunList {...this.props} refreshRuns={this.refreshRuns} deviceNames={this.state.deviceNames} runs={this.state.runs}></RunList>
					{loadMore}
				</div>
			</div>
		);
	}
})

