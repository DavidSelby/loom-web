import React from 'react'
import ReactDom from 'react-dom'

var Setting = React.createClass({
	render: function() {
		if (this.props.setting.options.length > 0) {
			var options = this.props.setting.options.join(', ');
		} else {
			var options = '-';
		}
		return(
			<div>
			<p className="setting-name">{this.props.setting.name}</p>
			<p className="setting-options">{options}</p>
			</div>
		);
	}

})
var Opt = React.createClass({
	updateOption: function(event) {
		this.props.updateOptions(this.props.index, event.target.value);
	},
	render: function() {
		return(
			<input type="text" placeholder="Setting option" value={this.props.option} onChange={this.updateOption} />
		);
	}
});

var AddSetting = React.createClass({
	updateOptions: function(index, opt) {
		var options = this.state.options;
		options[index] = opt;
		this.setState({
			options: options
		}, function() {
			console.log("OPTIONS: " + this.state.options);
		});
	},
	updateName: function(event) {
		this.setState({
			name: event.target.value
		});
	},
	submitSetting: function() {
		$.ajax({
			url: '/api/settings',
			dataType: "json",
			type: 'POST',
			data: {"name" : this.state.name, "options" : this.state.options},
			success: function() {
				console.log("SUCCESS");
				this.setState({
					name: '',
					options: []
				});
				this.props.loadSettings();
			}.bind(this)
		});
	},
	getInitialState: function() {
		return {
			name: '',
			options: []
		}
	},
	render: function() {
		var opts = [];
		for(var i = 0; i <= this.state.options.length; i++) {
			opts[i] = <Opt index={i} option={this.state.options[i] || ''} updateOptions={this.updateOptions} key={i+1}></Opt>;
		}
		return (
			<div>
			<input className="setting name" placeholder="Setting name" value={this.state.name} onChange={this.updateName} type="text"></input>
			{opts}
			<button onClick={this.submitSetting}>ADD</button>
			</div>
		);
	}
});

export default React.createClass({
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
			settings: []
		};
	},
	render: function() {
		var settings = this.state.settings.map(function(setting, index) {
			return (
				<Setting {...this.props} key={index} setting={setting}></Setting>
			);
		}.bind(this));
		return (
			<div>
				<div className="page-header">
					<h2>Settings</h2>
					<p>Add any settings that your tests require. These will be selectable on the Run page.</p>
				</div>
				<div className="page-content settings-page">
					<AddSetting {...this.props} loadSettings={this.loadSettings}></AddSetting>
					{settings}
				</div>
			</div>
		);
	}
});