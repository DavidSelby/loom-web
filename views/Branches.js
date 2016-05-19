import React from 'react'
import ReactDom from 'react-dom'

var BranchSelect = React.createClass({
	loadBranchesFromServer: function() {
		this.serverRequest = $.get('/api/branches', function (result) {
			this.setState({
				branches : result
			});
		}.bind(this));
	},
	getInitialState: function() {
		return {branches: []};
	},
	componentDidMount: function() {
		this.loadBranchesFromServer();
	},
	render: function() {
		var branches = this.state.branches.map(function(branch) {
    		return (
        		<li key={branch._id}>
        			<a href="#" onClick={this.props.handleBranch}>{branch.name}</a>
        		</li>
      		);
    	}.bind(this));
      	return (
			<div className="dropdown branches-dropdown">
				<a className="dropdown-toggle" type="button" data-toggle="dropdown">
					Branches
					<span className="caret"></span>
				</a>
				<ul className="dropdown-menu">
		    		{branches}
		    		<li role="separator" className="divider"></li>
		    		<li><a href="#">Refresh</a></li>
	  			</ul>
			</div>
		);
	}
});

export default React.createClass ({
	render: function() {
		return (
			<div className="branch-block">
				<h2 className="page-subtitle">Select Branch</h2>
		        <BranchSelect {...this.props}>
		        </BranchSelect>
		     </div>
		);
	}
});