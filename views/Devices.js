import React from 'react'
import ReactDom from 'react-dom'

var Device = React.createClass({
	handleClick: function() {
		$.ajax({
			url: '/api/cukes',
			dataType: "json",
			type: 'POST',
			data: {"runId" : "12334324", "command" : "cucumber", "status" : "pending", "device" : this.props.device._id},
			success: function() {
				console.log("CUKE SENT");
			}
		});
	},
	render: function() {
		return (
			<div>
				<div className="panel panel-default device-list">
					<a href={"#device-"+this.props.device.udid} className="device-title-info" data-toggle="collapse" className="expand-collapse">
						<div className={"panel-heading device-header-" + this.props.device.platformName.toLowerCase()}>
							<h2 className={"device-status " + this.props.device.status}>&#8226;</h2>
							<h2 className={"device-type-" + this.props.device.platformName.toLowerCase()}>{this.props.device.platformName}</h2>
							<h4 className="device-name">{this.props.device.deviceName}</h4>
							<span className="caret white large" />
						</div>
					</a>
					<div className="panel-body collapse" id={"device-"+this.props.device.udid}>
						<div className="run-tests"><button className="btn btn-default" onClick={this.handleClick}>Run tests</button></div>
						<p className="device-info"><b>Version:</b> {this.props.device.platformVersion}</p>
						<p className="device-info"><b>UDID:</b> {this.props.device.udid}</p>
						<p className="device-info"><b>Status:</b> {this.props.device.status}</p>
					</div>
				</div>
			</div>
		);
	}
});

var DeviceList = React.createClass({
	render: function() {
		var devices = this.props.devices.map(function(device) {
			return (
				<Device device={device} key={device._id}>
				</Device>
			);
		});
		return (
			<div className="deviceList">
				{devices}
			</div>
		);
	}
});

export default React.createClass({
	loadFeaturesFromServer: function() {
		this.serverRequest = $.get('/api/devices', function (result) {
			this.setState({
				devices : result
			});
		}.bind(this));
	},
	getInitialState: function() {
		return {devices: []};
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
			<div className="deviceBlock">
				<h2>Device List</h2>
	            <DeviceList devices={this.state.devices}>
	            </DeviceList>
      		</div>
		);
	}
})