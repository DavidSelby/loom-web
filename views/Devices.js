import React from 'react'
import ReactDom from 'react-dom'

var Device = React.createClass({
	stop: function(udid) {
		this.serverRequest = $.post("/api/devices/" + udid + "/stop");
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
			var stopButton = <button className="stop-device btn btn-default" onClick={() => this.stop(this.props.device.udid)}>Stop</button>
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
		if (devices.length < 1) {
			return (
				<p className="spinner">Loading...</p>
			)
		} else {
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
		};
	},
	componentDidMount: function() {
		this.props.getDevices();
		this.interval = setInterval(this.props.getDevices, 2000);
	},
	componentWillUnmount: function() {
		clearInterval(this.interval);
	},
	render: function() {
		return (
			<div className="device-block">
				<h2 className="page-subtitle">Device List</h2>
		        <DeviceList {...this.props}>
		        </DeviceList>
	      	</div>
		);
	}
})