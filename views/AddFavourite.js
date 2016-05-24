import React from 'react'
import ReactDom from 'react-dom'

export default React.createClass({
	saveAndRun: function() {
		$.ajax({
			url: '/api/favourites',
			dataType: "json",
			type: 'POST',
			data: {
				"name" : this.state.name,
				"command" : this.props.command,
				"features" : this.props.features,
				"scenarios" : this.props.scenarios,
				"lineNums" : this.props.lineNums,
				"tags" : this.props.tags
			},
			success: function() {
				this.props.closeModal();
				this.props.runTests(this.state.name);
			}.bind(this)
		});
	},
	save: function() {
		$.ajax({
			url: '/api/favourites',
			dataType: "json",
			type: 'POST',
			data: {
				"name" : this.state.name,
				"command" : this.props.command,
				"features" : this.props.features,
				"scenarios" : this.props.scenarios,
				"lineNums" : this.props.lineNums,
				"tags" : this.props.tags
			},
			success: function() {
				this.props.closeModal();
			}.bind(this)
		});
	},
	getName: function(event) {
		this.setState({
			name: event.target.value
		});
	},
	getInitialState: function() {
		return {
			name: ''
		}
	},
	render: function() {
		return (
			<div className="favourite-overlay">
				<div className="fav-modal">
					<a className="close-modal" onClick={this.props.closeModal}>Close X</a>
					<p>Command: {this.props.command.replace(/\/\S*\//g, '')}</p>
					<h3>Please name your run:</h3>
					<input type="text" onChange={this.getName} />
					<a className="save-fav" onClick={this.save}>Save</a>
					<a className="save-fav save-run-fav" onClick={this.saveAndRun}>Save and Run</a>
				</div>
			</div>
		);
	}
});