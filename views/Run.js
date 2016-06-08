import React from 'react'
import ReactDom from 'react-dom'
import { Router, Route, browserHistory, IndexRoute } from 'react-router'
import BranchBlock from './Branches'
import FeatureBlock from './Features'
import DeviceBlock from './Devices'
import TagBlock from './Tags'
import FavouriteBlock from './Favourites'
import AddFavourite from './AddFavourite'

export default React.createClass ({
	contextTypes: {
    	router: React.PropTypes.object.isRequired
  	},
	runTests: function() {
		var command = this.state.command;
		// IE8 support
		if (!Date.now) {
			Date.now = function() { return new Date().getTime(); }
		}
		var runId = Date.now();
		var name = this.state.runName || runId
		$.ajax({
			url: '/api/runs',
			dataType: "json",
			type: 'POST',
			data: {"runId" : runId, "name" : name},
			success: function() {
				for (var i = 0; i < this.state.selectedDevices.length; i++) {
					var device = {};
					$.get('/api/devices/' + this.state.selectedDevices[i], function(result) {
						device = result[0];
						var deviceCommand = command + " BROWSER=" + device.udid;
						deviceCommand = deviceCommand.replace(/\s+/, " ");
						console.log("DEVICE = " + device.udid);
						$.post({
							url: '/api/cukes',
							dataType: "json",
							type: 'POST',
							data: {"runId" : runId, "command" : deviceCommand, "status" : "pending", "device" : device},
							success: function() {
								console.log("DEVICE = " + device);
								console.log("CUKE SENT: " + deviceCommand);
								this.context.router.push('/');
							}.bind(this)
						});
					}.bind(this));
				}
			}.bind(this)
		});
	},
	runAfterSave: function(name) {
		this.setState({
			runName: name
		}, function() {
			if (this.state.selectedDevices.length < 1) {
				this.switchTab(5);
				this.warnDevice();
			} else {
				this.runTests();
			}
		});
	},
	selectFavourite: function(name, features, scenarios, lineNums, tags) {
		this.setState({
			runName: name,
			selectedFeatures: features,
			selectedScenarios: scenarios,
			lineNums: lineNums,
			tagsString: tags
		}, function() {
			this.buildCommand();
			this.unstringTags();
			this.setState({
				step: 5
			});
		});
	},
	saveRun: function() {
		var command = this.state.command;
		this.setState({
			favModalShown: true
		});
	},
	closeModal: function() {
		this.setState({
			favModalShown: false
		});
	},
	buildCommand: function() {
		var scenarios = this.state.lineNums.join(' ');
		scenarios = scenarios.trim().replace(/\s+/g, ' ');
		var command = "cucumber " + this.state.tagsString + " " + scenarios;
		command = command.trim();
		this.setState({
			command: command
		});
	},
	getFavourites: function(isLoaded) {
		this.serverRequest = $.get('/api/favourites', function (result) {
			this.setState({
				favourites : result
			}, function(){
				isLoaded();
			});
		}.bind(this));
	},
	// Gets features from the server and creates selectedScenarios, selectedFeatures and lineNums arrays with the correct number of values
	getFeatures: function(finished) {
		var features = {};
		var selectedScenarios = {};
		var selectedFeatures = [];
		var lineNums = [];
		this.serverRequest = $.get('/api/features', function (result) {
			features = result[0];
			if ("features" in features) {
				if (this.state.lineNums.length < 1) {
					for (var i = 0; i < features.features.length; i++) {
						lineNums[i] = '';
			    		selectedFeatures[i] = false;
			    		selectedScenarios[i] = {'scenarios' : []};
			    		for (var j = 0; j < features.features[i].scenarios.length; j++) {
			    			selectedScenarios[i].scenarios[j] = false;
			    		}
			    	}
		    	} else {
		    		selectedScenarios = this.state.selectedScenarios;
		    		selectedFeatures = this.state.selectedFeatures;
		    		lineNums = this.state.lineNums;
		    	}
		    } else {
		    	features["features"] = "notFound";
		    }
			this.setState({
				selectedFeatures: selectedFeatures,
		   		selectedScenarios: selectedScenarios,
		   		features: features.features,
		   		lineNums: lineNums
		    }, finished());
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
	  			selectedScenarios[index].scenarios[i] = allChecked;
	  		}
	  		if (allChecked) {
	  			lineNums[index] = feature.path;
	  		}
			this.setState({
				allChecked: allChecked,
				selectedScenarios: selectedScenarios,
				selectedFeatures: selectedFeatures,
				lineNums: lineNums
			}, function() {
				this.buildCommand();
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
		selectedScenarios[feature].scenarios[index] = !selectedScenarios[feature].scenarios[index];
  		for (var i = 0; i < this.state.features[feature].scenarios.length; i++) {
  			if (selectedScenarios[feature].scenarios[i]) {
  				lineNumsArray = lineNumsArray.concat([this.state.features[feature].scenarios[i].lineNum.toString()]);
  			}
  		};
		// If all scenarios are selected, lineNums is set to the feature path and selected is true
		if (selectedScenarios[feature].scenarios.length == lineNumsArray.length) {
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
		}, function() {
			this.buildCommand();
		});
	},
	handleFeatureCheck: function(index) {
		var lineNums = this.state.lineNums;
		lineNums[index] = '';
		var selectedFeatures = this.state.selectedFeatures;
		selectedFeatures[index] = !selectedFeatures[index];
		var selectedScenarios = this.state.selectedScenarios;
  		for (var i = 0; i < this.state.features[index].scenarios.length; i++) {
  			selectedScenarios[index].scenarios[i] = selectedFeatures[index];
  		}
  		if (selectedFeatures[index]) {
  			lineNums[index] = this.state.features[index].path;
  		}
		this.setState({
			selectedScenarios: selectedScenarios,
			selectedFeatures: selectedFeatures,
			lineNums: lineNums
		}, function() {
			this.buildCommand();
		});

	},
	// Tags
	getTags: function() {
		var tags = [{"_id": "1", "tag": "@bag"},
			{"_id": "2", "tag": "@checkout"},
			{"_id": "3", "tag": "@country"},
			{"_id": "4", "tag": "@language"},
			{"_id": "5", "tag": "@pdp"}, 
			{"_id": "6", "tag": "@plp"}, 
			{"_id": "7", "tag": "@fail"}, 
			{"_id": "8", "tag": "@mobile"}, 
			{"_id": "9", "tag": "@touch"}];
		this.setState({
			tags: tags
		});
	},

	setTagsString: function(event) {
		var tags = event.target.value;
		this.setState({
			tagsString: tags
		}, function() {
			this.unstringTags();
		});
	},

	includeTag: function(tag) {
		var tags = this.state.includedTags;
		var index = tags.indexOf(tag)
		if (index > -1) {
			tags.splice(index, 1);
		} else {
			tags = tags.concat([tag]);
		}
		this.setState({
			includedTags: tags
		}, function() {
			this.stringifyTags();
		});
	},

	excludeTag: function(tag) {
		var tags = this.state.excludedTags;
		var index = tags.indexOf(tag)
		if (index > -1) {
			tags.splice(index, 1);
		} else {
			tags = tags.concat([tag]);
		}
		this.setState({
			excludedTags: tags
		}, function() {
			this.stringifyTags();
		});
	},

	stringifyTags: function() {
		var tags = "";
		if (this.state.includedTags.length > 0) {
			tags = "-t " + this.state.includedTags.join(",");
		}
		if (this.state.excludedTags.length > 0) {
			tags = tags + " -t " + this.state.excludedTags.join(" -t ");
		}
		tags = tags.trim();
		this.setState({
			tagsString: tags
		}, function() {
			this.buildCommand();
		});
	},

	unstringTags: function() {
		var includedTags = [];
		var excludedTags = [];
		var tagsSects = this.state.tagsString.split("-t");
		tagsSects.forEach(function(tags) {
			tags = tags.split(",")
			tags.forEach(function(tag) {
				tag = tag.trim();
				if (tag.startsWith("@")) {
					includedTags = includedTags.concat([tag]);
				}
				if (tag.startsWith("~@")) {
					excludedTags = excludedTags.concat([tag]);
				}
			});
		});
		this.setState({
			includedTags: includedTags,
			excludedTags: excludedTags
		});
	},

	// Devices
	getDevices: function(isLoaded) {
		this.serverRequest = $.get('/api/devices', function (result) {
			this.setState({
				devices : result
			}, function() {
				isLoaded();
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
	warnDevice: function() {
		this.setState({
			deviceWarning: true
		});
	},

	// Steps
	switchTab: function(index) {
		this.setState({
			step: index
		});
	},
	getInitialState: function() {
		return {
			command: 'cucumber',
			runName: '',
			favourites: [],
			tags: [],
			includedTags: [],
			excludedTags: [],
			tagsString: '',
			devices: [],
			selectedDevices: [],
			features: [],
			scenarios: [],
			selectedFeatures: [],
			selectedScenarios: {},
			allChecked: false,
			lineNums: [],
			step: 1
		}
	},
	render: function() {
		var tabs = ['Favourites', 'Branches', 'Features', 'Tags', 'Devices'];
		var getPage = function() {
			switch (this.state.step) {
				case 1:
				return (
					<FavouriteBlock
						favourites={this.state.favourites}
						getFavourites={this.getFavourites}
						selectFavourite={this.selectFavourite} />
				);
				case 2:
				return (
					<BranchBlock handleBranch={this.handleBranch} />
				);
				case 3:
				return (
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
						handleBranch={this.handleBranch}>
					</FeatureBlock>
				);
				case 4:
				return (
					<TagBlock
						setTagsString={this.setTagsString}
						getTags={this.getTags}
						tags={this.state.tags}
						includedTags={this.state.includedTags}
						excludedTags={this.state.excludedTags}
						tagsString={this.state.tagsString}
						includeTag={this.includeTag}
						excludeTag={this.excludeTag}>
					</TagBlock>
				)
				case 5:
				return (
					<DeviceBlock
						getDevices={this.getDevices}
						devices={this.state.devices}
						selectedDevices={this.state.selectedDevices}
						handleDeviceCheck={this.handleDeviceCheck}
						selectable={true}
						warnDevice={this.warnDevice}
						deviceWarning={this.state.deviceWarning}>
					</DeviceBlock>
				);

			}
		}.bind(this);
		var navTabs = tabs.map(function(tab, index) {
			var active = '';
			if (index + 1 == this.state.step) {
				active = ' active'
			}
			return(
				<li className={"tab" + active} key={index}><a onClick={() => this.switchTab(index+1)}>{tab}</a></li>
			);
		}.bind(this));
		var runActive = (this.state.selectedDevices.length > 0) ? ' ready' : '';
		var saveActive = (this.state.command == "cucumber") ? '' : ' ready'

		var favModal = this.state.favModalShown ? <AddFavourite
			command={this.state.command}
			runTests={this.runTests}
			features={this.state.selectedFeatures}
			scenarios={this.state.selectedScenarios}
			lineNums={this.state.lineNums}
			tags={this.state.tagsString}
			closeModal={this.closeModal}
			runAfterSave={this.runAfterSave}
			switchTab={this.switchTab}/> : <div />;
		return (
			<div>
				<div className="page-header">
					<h2>Run Tests</h2>
					<p>Select the tests that you want to run and the devices that you want to run them on.</p>
				</div>
				<ul className="tabbed-nav">
					{navTabs}
					<li className={"tab run-tests" + runActive}><a onClick={this.runTests}>Run Tests</a></li>
					<li className={"tab save-tests" + saveActive}><a onClick={this.saveRun}>Save & Run</a></li>
				</ul>
				{favModal}
				<div className="paginated">
					{getPage()}
				</div>
			</div>
		);
	}
});