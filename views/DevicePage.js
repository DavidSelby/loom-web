import React from 'react'
import ReactDom from 'react-dom'
import FeatureBlock from './Features'
import DeviceBlock from './Devices'

export default React.createClass ({
	getDevices: function(isLoaded) {
		this.serverRequest = $.get('/api/devices', function (result) {
			this.setState({
				devices : result
			}, function() {
				isLoaded();
			});
		}.bind(this));
	},
	getInitialState: function() {
		return {
			devices: []
		}
	},
	render: function() {
		return (
			<div>
				<div className="page-header">
					<h1>Devices</h1>
					<p>View all of the devices currently connected to arachne host machines.</p>
				</div>
				<div className="container">
				<DeviceBlock
					getDevices={this.getDevices}
					devices={this.state.devices}
					selectable={false}>
				</DeviceBlock>
				</div>
			</div>
		);
	}
});