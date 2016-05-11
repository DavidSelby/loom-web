import React from 'react'
import ReactDom from 'react-dom'
import FeatureBlock from './Features'
import DeviceBlock from './Devices'

export default React.createClass ({
	collectDevices: function(udid) {
		var devices = this.state.selectedDevices;
		var index = devices.indexOf(udid);
		if (index > -1) {
			devices.splice(index, 1);
		} else {
			devices = devices.concat([udid]);
		}
		this.setState({
			selectedDevices: devices
		}, function() {
			console.log(this.state.selectedDevices);
		});
	},
	collectScenarios: function(scenarios) {

	},
	getInitialState: function() {
		return {
			selectedDevices: []
		}
	},
	render: function() {
		return (
			<div>
			<FeatureBlock sendScenario={this.collectScenarios} selectable={true} collapsed={true}></FeatureBlock>
			<DeviceBlock sendDevice={this.collectDevices} selectable={true} collapsed={true}></DeviceBlock>
			</div>
		);
	}
});