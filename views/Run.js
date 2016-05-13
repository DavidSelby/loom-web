import React from 'react'
import ReactDom from 'react-dom'
import FeatureBlock from './Features'
import DeviceBlock from './Devices'

export default React.createClass ({
	runTests: function() {
		var scenarios = this.state.lineNums.join(' ');
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
	// Gets features from the server and creates selectedScenarios, selectedFeatures and lineNums arrays with the correct number of values
	getFeatures: function() {
		var features = {};
		var selectedScenarios = [];
		var selectedFeatures = [];
		var lineNums = [];
		this.serverRequest = $.get('/api/features', function (result) {
			features = result[0];
			if ("features" in features) {
				features = result[0];
				for (var i = 0; i < features.features.length; i++) {
					lineNums[i] = '';
		    		selectedFeatures[i] = false;
		    		selectedScenarios[i] = [];
		    		for (var j = 0; j < features.features[i].scenarios.length; j++) {
		    			selectedScenarios[i][j] = false;
		    		}
		    	}
		    } else {
		    	features["features"] = "notFound";
		    }
			this.setState({
				selectedFeatures: selectedFeatures,
		   		selectedScenarios: selectedScenarios,
		   		features: features.features,
		   		lineNums: lineNums
		    });
	    }.bind(this));
	},
	handleCheckAllFeatures: function() {
		var allChecked = !this.state.allChecked;
		this.state.features.forEach(function(feature, index) {
			var lineNums = this.state.lineNums;
			lineNums[index] = '';
			var selectedFeatures = this.state.selectedFeatures;
			selectedFeatures[index] = allChecked;
			var selectedScenarios = this.state.selectedScenarios;
	  		for (var i = 0; i < feature.scenarios.length; i++) {
	  			selectedScenarios[index][i] = allChecked;
	  		}
	  		if (allChecked) {
	  			lineNums[index] = feature.path;
	  		}
			this.setState({
				allChecked: allChecked,
				selectedScenarios: selectedScenarios,
				selectedFeatures: selectedFeatures,
				lineNums: lineNums
			});
		}.bind(this));
	},
	handleScenarioCheck: function(feature, index) {
		// If a scenario is clicked, the feature is not selected (exception below)
		var selectedFeatures = this.state.selectedFeatures;
		var selectedScenarios = this.state.selectedScenarios;
		selectedFeatures[feature] = false;
		var lineNums = this.state.lineNums;
		lineNums[feature] = '';
		var lineNumsArray = [];
		selectedScenarios[feature][index] = !selectedScenarios[feature][index];
  		for (var i = 0; i < this.state.features[feature].scenarios.length; i++) {
  			if (selectedScenarios[feature][i]) {
  				lineNumsArray = lineNumsArray.concat([this.state.features[feature].scenarios[i].lineNum.toString()]);
  			}
  		};
		// If all scenarios are selected, lineNums is set to the feature path and selected is true
		if (selectedScenarios[feature].length == lineNumsArray.length) {
			lineNums[feature] = this.state.features[feature].path;
			selectedFeatures[feature] = true;
		// If some scenarios are selected, their line numbers are concatonated to the feature path, separated by ':'
		} else if (lineNumsArray.length > 0) {
			lineNums[feature] = this.state.features[feature].path + ':' + lineNumsArray.join(":");
		}
		// Update array of scenarios with which ones are selected
  		this.setState({
  			selectedFeatures: selectedFeatures,
  			selectedScenarios: selectedScenarios,
			lineNums: lineNums
		});
	},
	handleFeatureCheck: function(index) {
		var lineNums = this.state.lineNums;
		lineNums[index] = '';
		var selectedFeatures = this.state.selectedFeatures;
		selectedFeatures[index] = !selectedFeatures[index];
		var selectedScenarios = this.state.selectedScenarios;
  		for (var i = 0; i < this.state.features[index].scenarios.length; i++) {
  			selectedScenarios[index][i] = selectedFeatures[index];
  		}
  		if (selectedFeatures[index]) {
  			lineNums[index] = this.state.features[index].path;
  		}
		this.setState({
			selectedScenarios: selectedScenarios,
			selectedFeatures: selectedFeatures,
			lineNums: lineNums
		});

	},

	// Devices
	getDevices: function() {
		this.serverRequest = $.get('/api/devices', function (result) {
			this.setState({
				devices : result
			});
		}.bind(this));
	},
	handleDeviceCheck: function(event) {
		var udid = event.target.id.replace("sel-dev-", "");
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

	// Steps
	nextStep: function() {
		this.setState({
			step: this.state.step+1
		}, function() {
			window.scrollTo(0,0);
		});
	},
	previousStep: function() {
		this.setState({
			step: this.state.step-1
		}, function() {
			window.scrollTo(0,0);
		});
	},
	getInitialState: function() {
		return {
			devices: [],
			selectedDevices: [],
			features: [],
			scenarios: [],
			selectedFeatures: [],
			selectedScenarios: [],
			allChecked: false,
			lineNums: [],
			step: 1
		}
	},
	render: function() {
		var getPage = function() {
			switch (this.state.step) {
				case 1:
				return (
					<div>
						<div className="next"><button className="btn btn-default" onClick={this.nextStep}>Next</button></div>
							<FeatureBlock
								allChecked={this.state.allChecked}
								handleCheckAllFeatures={this.handleCheckAllFeatures}
								handleScenarioCheck={this.handleScenarioCheck} 
								handleFeatureCheck={this.handleFeatureCheck}
								getFeatures={this.getFeatures}
								features={this.state.features}
								selectedScenarios={this.state.selectedScenarios}
								selectedFeatures={this.state.selectedFeatures}
								selectable={true}
								handleBranch={this.handleBranch}
								refresh={this.refresh}>
							</FeatureBlock>
						<div className="next"><button className="btn btn-default" onClick={this.nextStep}>Next</button></div>
					</div>
				);
				case 2:
				return (
					<div>
						<div className="previous"><button className="btn btn-default" onClick={this.previousStep}>Back</button></div>
						<div className="run-tests"><button className="btn btn-default" onClick={this.runTests}>Run tests</button></div>
						<DeviceBlock
							getDevices={this.getDevices}
							devices={this.state.devices}
							selectedDevices={this.state.selectedDevices}
							handleDeviceCheck={this.handleDeviceCheck}
							selectable={true}>
						</DeviceBlock>
						<div className="previous"><button className="btn btn-default" onClick={this.previousStep}>Back</button></div>
						<div className="run-tests"><button className="btn btn-default" onClick={this.runTests}>Run tests</button></div>
					</div>
				);

			}
		}.bind(this);
		return (
			<div>
			<h1>Run Tests</h1>
			{getPage()}</div>
		)
	}
});