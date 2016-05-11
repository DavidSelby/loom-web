import React from 'react'
import ReactDom from 'react-dom'
import FeatureBlock from './Features'
import DeviceBlock from './Devices'

export default React.createClass ({
	handleClick: function() {
		var scenarios = this.state.selectedScenarios.join(' ');
		scenarios = scenarios.trim().replace(/\s+/g, ' ');
		for (var i = 0; i < this.state.selectedDevices.length; i++) {
			var command = "cucumber " + scenarios + " BROWSER=" + this.state.selectedDevices[i];
			$.ajax({
				url: '/api/cukes',
				dataType: "json",
				type: 'POST',
				data: {"runId" : "12334324", "command" : command, "status" : "pending", "device" : this.state.selectedDevices[i]},
				success: function() {
					console.log("CUKE SENT: " + command);
				}
			});
		}
	},
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
		});
	},
	collectScenarios: function(scenarios, index) {
		var selectedScenarios = this.state.selectedScenarios;
		selectedScenarios[index] = scenarios;
		this.setState({
			selectedScenarios: selectedScenarios
		});
	},
	getInitialState: function() {
		return {
			selectedDevices: [],
			selectedScenarios: []
		}
	},
	render: function() {
		return (
			<div>
			<FeatureBlock collectScenarios={this.collectScenarios} selectable={true} collapsed={true}></FeatureBlock>
			<DeviceBlock sendDevice={this.collectDevices} selectable={true} collapsed={true}></DeviceBlock>
			<div className="run-tests"><button className="btn btn-default" onClick={this.handleClick}>Run tests</button></div>
			</div>
		);
	}
});