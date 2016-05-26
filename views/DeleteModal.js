import React from 'react'
import ReactDom from 'react-dom'

export default React.createClass({
	render: function() {
		var favId = this.props.favourite.replace('del-', '');
		return (
			<div className="delete-overlay">
				<div className="delete-modal">
					<a className="close-modal" onClick={this.props.closeModal}>Close X</a>
					<h3>Are you sure you want to delete this favourite?</h3>
					<button className="btn btn-default delete no" onClick={this.props.closeModal}>No</button>
					<button className="btn btn-default delete yes" onClick={() => this.props.confirmDelete(favId)}>Yes</button>
				</div>
			</div>
		);
	}
});