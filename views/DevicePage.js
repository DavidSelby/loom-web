import React from 'react'
import ReactDom from 'react-dom'
import FeatureBlock from './Features'
import DeviceBlock from './Devices'

export default React.createClass ({
	getDevices: function() {
		this.serverRequest = $.get('/api/devices', function (result) {
			this.setState({
				devices : result
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
			<DeviceBlock
				getDevices={this.getDevices}
				devices={this.state.devices}
				selectable={false}>
			</DeviceBlock>
		);
	}
});