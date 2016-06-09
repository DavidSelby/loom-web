import React from 'react'
import ReactDom from 'react-dom'

var Setting = React.createClass({
	getValue: function(event) {
		if (this.props.selected[this.props.setting.name] == event.target.value) {
			$(event.target).removeClass("selected");
			var value = '';
		} else {
			$(event.target).addClass("selected");
			var value = event.target.value;
		}
		this.props.setSelected(this.props.setting.name, value);
	},
	render: function() {
		var options = [];
		if (this.props.setting.options.length == 0) {
			options = <input className="option-free" type="text" placeholder="value" onChange={this.getValue} />;
		} else {
			options = this.props.setting.options.map(function(option, index) {
				var selected = (this.props.selected[this.props.setting.name] == option) ? " selected" : "";
				return (
					<button className={"option-select btn btn-default" + selected} value={option} onClick={this.getValue} key={index}>{option}</button>
				);
			}.bind(this));
		}
		return (
			<div className="setting">
			<p className="setting-name">{this.props.setting.name}</p>
			{options}
			</div>
		);
	}
});

export default React.createClass({
	setSelected: function(setting, value) {
		var settingsHash = this.state.selected;
		if (value.length > 0) {
			console.log(value);
			settingsHash[setting] = value;
		} else {
			console.log("DELETING");
			delete settingsHash[setting];
		}
		this.sendAsString(settingsHash);
	},
	sendAsString: function(hash) {
		var selected = '';
		for (var setting in hash) {
			console.log("KEYS: " + Object.keys(hash));
			selected = selected + " " + setting + "=" + hash[setting];
		}
		selected = selected.trim();
		this.props.sendSettings(selected);
	},
	loadSettings: function() {
		$.get('/api/settings', function(result) {
			this.setState({
				settings: result
			});
		}.bind(this));
	},
	componentDidMount: function() {
		this.loadSettings();
	},
	getInitialState: function() {
		return {
			settings: [],
			selected: {}
		};
	},
	render: function() {
		var settings = this.state.settings.map(function(setting, index) {
			return (
				<Setting {...this.props} selected={this.state.selected} setSelected={this.setSelected} key={index} setting={setting}></Setting>
			);
		}.bind(this));
		return (
			<div className="settings-list">
			{settings}
			</div>
		);
	}
});