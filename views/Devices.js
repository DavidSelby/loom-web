import React from 'react'
import ReactDom from 'react-dom'

var Device = React.createClass({
	render: function() {
		var selectDevice;
		if (this.props.selectable) {
			var index = this.props.selectedDevices.indexOf(this.props.device.udid);
			var selected = index > -1;
			selectDevice = <input type="checkbox" checked={selected} onChange={this.props.handleDeviceCheck} id={"sel-dev-" + this.props.device.udid} className={"select select-item sel-dev-" + this.props.device.udid} />
		}
		return (
			<div>
				<div className="panel panel-default device-list">
					<div className={"panel-heading device-header-" + this.props.device.platformName.toLowerCase()}>
						<h2 className={"device-status " + this.props.device.status}>&#8226;</h2>
						{selectDevice}
						<a href={"#device-"+this.props.device.udid} className="device-title-info" data-toggle="collapse" className="expand-collapse">
							<h2 className={"device-type-" + this.props.device.platformName.toLowerCase()}>{this.props.device.platformName}</h2>
							<h4 className="device-name">{this.props.device.deviceName}</h4>
							<span className="caret white large" />
						</a>
					</div>
					<div className="panel-body collapse" id={"device-"+this.props.device.udid}>
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
				<div className="deviceList">
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
			<div className="container device-block">
				<h2 className="page-subtitle">Device List</h2>
		        <DeviceList {...this.props}>
		        </DeviceList>
	      	</div>
		);
	}
})