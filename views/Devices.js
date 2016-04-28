import React from 'react'
import ReactDom from 'react-dom'

var Device = React.createClass({
	render: function() {
		return (
			<div className="panel panel-default device-list">
				<div className={"panel-heading device-header-" + this.props.device.platformName.toLowerCase()}>
					<h2 className={"device-type-" + this.props.device.platformName.toLowerCase()}>{this.props.device.platformName}</h2>
					<h3 className="device-name">{this.props.device.deviceName}</h3></div>
				<div className="panel-body">
					<p>{this.props.device.platformVersion}</p>
					<p>{this.props.device.udid}</p>
					<p>{this.props.device.status}</p>
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
		this.interval = setInterval(this.loadFeaturesFromServer, 2000);
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