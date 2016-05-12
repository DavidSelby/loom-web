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
		}, function() {
			console.log(this.state.selectedDevices)
		});
	},
	collectScenarios: function(scenarios, index) {
		var selectedScenarios = this.state.selectedScenarios;
		selectedScenarios[index] = scenarios;
		this.setState({
			selectedScenarios: selectedScenarios
		}, function() {
			console.log(this.state.selectedScenarios)
		});
	},
	nextStep: function() {
		this.setState({
			step: this.state.step+1
		}, function() {
			console.log(this.state.step);
			window.scrollTo(0,0);
		});
	},
	previousStep: function() {
		this.setState({
			step: this.state.step-1
		}, function() {
			console.log(this.state.step);
			window.scrollTo(0,0);
		});
	},
	getInitialState: function() {
		return {
			selectedDevices: [],
			selectedScenarios: [],
			step: 1
		}
	},
	render: function() {
		switch (this.state.step) {
			case 1:
			return (
				<div>
				<FeatureBlock collectScenarios={this.collectScenarios} selectable={true}></FeatureBlock>
				<div className="next"><button className="btn btn-default" onClick={this.nextStep}>Next</button></div>
				</div>
			);
			case 2:
			return (
				<div>
				<DeviceBlock sendDevice={this.collectDevices} selectable={true}></DeviceBlock>
				<div className="previous"><button className="btn btn-default" onClick={this.previousStep}>Back</button></div>
				<div className="run-tests"><button className="btn btn-default" onClick={this.handleClick}>Run tests</button></div>
				</div>
			);

		}
	}
});