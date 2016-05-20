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
		var command = this.buildCommand();
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
					var deviceCommand = command + " BROWSER=" + this.state.selectedDevices[i];
					deviceCommand = deviceCommand.replace(/\s+/, " ");
					$.ajax({
						url: '/api/cukes',
						dataType: "json",
						type: 'POST',
						data: {"runId" : runId, "command" : deviceCommand, "status" : "pending", "device" : this.state.selectedDevices[i]},
						success: function() {
							console.log("CUKE SENT: " + deviceCommand);
							this.context.router.push('/');
						}.bind(this)
					});
				}
			}.bind(this)
		});
	},
	selectFavourite: function(name, features, scenarios, lineNums, tags) {
		this.setState({
			runName: name,
			selectedScenarios: features,
			selectedScenarios: scenarios,
			lineNums: lineNums,
			tagsString: tags
		}, function() {
			console.log(this.state.tagsString);
			this.unstringTags();
			this.setState({
				step: 5
			});
		});
	},
	saveRun: function() {
		var command = this.buildCommand();
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
		this.setState({
			command: command
		});
	},
	getFavourites: function() {
		this.serverRequest = $.get('/api/favourites', function (result) {
			this.setState({
				favourites : result
			});
		}.bind(this));
	},
	// Gets features from the server and creates selectedScenarios, selectedFeatures and lineNums arrays with the correct number of values
	getFeatures: function(finished) {
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
	switchTab: function(index) {
		this.setState({
			step: index
		});
	},
	getInitialState: function() {
		return {
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
			selectedScenarios: [],
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
					<div className="paginated">
						<FavouriteBlock
							favourites={this.state.favourites}
							getFavourites={this.getFavourites}
							selectFavourite={this.selectFavourite} />
					</div>
				);
				case 2:
				return (
					<div className="paginated">
						<BranchBlock handleBranch={this.handleBranch} />
					</div>
				);
				case 3:
				return (
					<div className="paginated">
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
					</div>
				);
				case 4:
				return (
					<div className="paginated">
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
					</div>
				)
				case 5:
				return (
					<div className="paginated">
						<DeviceBlock
							getDevices={this.getDevices}
							devices={this.state.devices}
							selectedDevices={this.state.selectedDevices}
							handleDeviceCheck={this.handleDeviceCheck}
							selectable={true}>
						</DeviceBlock>
					</div>
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

		var favModal = this.state.favModalShown ? <AddFavourite
			command={this.state.command}
			runTests={this.runTests}
			features={this.state.selectedFeatures}
			scenarios={this.state.selectedScenarios}
			lineNums={this.state.lineNums}
			tags={this.state.tagsString}
			closeModal={this.closeModal}/> : <div />;
		return (
			<div>
				<div className="page-header">
					<h1>Run Tests</h1>
					<p>Select the tests that you want to run and the devices that you want to run them on.</p>
				</div>
				<ul className="tabbed-nav">
					{navTabs}
					<li className={"tab run-tests" + runActive}><a onClick={this.runTests}>Run Tests</a></li>
					<li className={"tab run-tests save" + runActive}><a onClick={this.saveRun}>Save & Run</a></li>
				</ul>
				{favModal}
				<div className="container paginated">
					{getPage()}
				</div>
			</div>
		);
	}
});