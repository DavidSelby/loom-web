import React from 'react'
import ReactDom from 'react-dom'

var Device = React.createClass({
	stop: function(cuke) {
		this.serverRequest = $.post("/api/cukes/" + cuke + "/stop");
	},
	restart: function(udid) {
		this.serverRequest = $.post("/api/devices/" + udid + "/restart");
	},
	render: function() {
		var selectDevice;
		if (this.props.selectable) {
			var index = this.props.selectedDevices.indexOf(this.props.device.udid);
			var selected = index > -1;
			selectDevice = <input type="checkbox" checked={selected} onChange={this.props.handleDeviceCheck} id={"sel-dev-" + this.props.device.udid} className={"select select-item sel-dev-" + this.props.device.udid} />
		}
		if (['busy','stop'].indexOf(this.props.device.status) > -1) {
			var stopButton = <button className="stop-device btn btn-default" onClick={() => this.stop(this.props.device.cuke)}>Stop</button>
		}
		return (
			<div>
				<div className={"overlay " + this.props.device.status}>
				<div className={"device-header " + this.props.device.platformName.toLowerCase() + " " + this.props.device.status}>
					<h2 className={"device-status " + this.props.device.status}>&#8226;</h2>
					{selectDevice}
					<a href={"#device-"+this.props.device.udid} className="device-title-info" data-toggle="collapse" className="expand-collapse">
						<h3 className={"device-type-" + this.props.device.platformName.toLowerCase()}>{this.props.device.platformName.trim()}</h3>
						<h4 className="device-name">{this.props.device.deviceName.trim()}</h4>
						<p span className="orange">+</p>
					</a>
					{stopButton}
				</div>
				<div className="collapse" id={"device-"+this.props.device.udid}>
					<button className="restart btn btn-default" onClick={() => this.restart(this.props.device.udid)}>Restart Device</button>
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
				<Device {...this.props} device={device} key={device._id}>
				</Device>
			);
		}.bind(this));
		switch(this.props.loaded) {
			case 'loading':
				return (
					<p className="spinner">Loading...</p>
				);
			case 'not-found':
				return (
					<p>No devices found. Make sure they are plugged in and any android devices have developer mode enabled.</p>
				);
			default:
				return (
					<div className="device-list">
						{devices}
					</div>
				);
		}
	}
});

export default React.createClass({
	handleCheck: function(event) {
		var udid = event.target.id.replace("sel-dev-", "");
		this.props.sendDevice(udid);
	},
	getDefaultProps: function() {
		return {
			"selectable" : false,
			"deviceWarning" : false
		};
	},
	isLoaded: function() {
		if (this.props.devices.length > 0) {
			var loaded = 'loaded';
		} else {
			var loaded = 'not-found';
		}
		this.setState({
			loaded: loaded
		});
	},
	componentDidMount: function() {
		this.props.getDevices(this.isLoaded);
		this.interval = setInterval(() => this.props.getDevices(this.isLoaded), 2000);
	},
	componentWillUnmount: function() {
		clearInterval(this.interval);
	},
	getInitialState: function() {
		return {
			loaded: 'loading'
		}
	},
	render: function() {
		var warning = this.props.deviceWarning ? <div className="device warning"><p>Please select one or more devices before running tests</p></div> : <div />
		return (
			<div className="device-block">
				{warning}
		        <DeviceList {...this.props} loaded={this.state.loaded}>
		        </DeviceList>
	      	</div>
		);
	}
});