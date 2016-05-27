import React from 'react'
import ReactDom from 'react-dom'
import DeleteModal from './DeleteModal'

var Favourite = React.createClass({
	selectFavourite: function() {
		this.props.selectFavourite(this.props.fav.name, this.props.fav.features, this.props.fav.scenarios, this.props.fav.lineNums, this.props.fav.tags)
	},
	componentDidMount: function() {
		var tags = this.props.fav.tags
		var features = this.props.fav.command.replace('cucumber ', '').replace(/-t\s\S+/g, '').replace(/\/\S*\//g, '').trim().replace(/\s/g, ', ');
		this.setState({
			tags: tags,
			features: features
		});
		console.log(tags);
	},
	getInitialState: function() {
		return {
			features: [],
			tags: [],
			expanded: false
		}
	},
	expandCollapse: function(event) {
		var expanded = !this.state.expanded;
		this.setState({
			expanded: expanded
		});
	},
	render: function() {
		var expandCollapse = this.state.expanded ? 'expanded' : 'collapsed';
		return (
			<tr className={"favourite " + expandCollapse}>
				<td className="favourite-name"><div>{this.props.fav.name}</div></td>
				<td className="favourite-features"><div>{this.state.features || '-'}</div></td>
				<td className="favourite-tags"><div>{this.state.tags || '-'}</div></td>
				<td className="favourite-buttons">
					<a className="expandCollapse" onClick={this.expandCollapse}>+</a>
					<button className="btn btn-default favourite-button" onClick={this.selectFavourite}>Select</button>
					<button className="btn btn-default favourite-button" id={"del-" + this.props.fav._id} onClick={this.props.deleteFavourite}>Remove</button>
				</td>
			</tr>
		);
	}
})

export default React.createClass({
	selectFavourite: function() {
		console.log(this.props.tags);
		this.props.selectFavourite(this.props.name, this.props.features, this.props.scenarios, this.props.lineNums, this.props.tags)
	},
	deleteFavourite: function(event) {
		this.setState({
			deleteFav: event.target.id
		}, function() {
			console.log("DISPLAYED: " + this.state.deleteFav);
		});
	},
	confirmDelete: function(favId) {
		$.ajax({
			url: '/api/favourites/' + favId,
			type: 'DELETE',
			success: function() {
				this.props.getFavourites(this.isLoaded);
				this.setState({
					deleteFav: ''
				});
			}.bind(this)
		}.bind(this));
	},
	closeDeleteModal: function() {
		this.setState({
			deleteFav: ''
		});
	},
	getFavourites: function() {
		this.props.getFavourites(this.isLoaded);
	},
	isLoaded: function() {
		if (this.props.favourites.length > 0) {
			var loaded = 'loaded';
		} else {
			var loaded = 'not-found';
		}
		this.setState({
			loaded: loaded
		});
	},
	componentDidMount: function() {
		this.getFavourites();
	},
	getInitialState: function() {
		return {
			loaded: 'loading',
			deleteFav: ''
		}
	},
	render: function() {
		var favs = this.props.favourites.map(function(fav, index) {
			return (
				<Favourite {...this.props} deleteFavourite={this.deleteFavourite} getFavourites={this.getFavourites} fav={fav} key={index}></Favourite>
			);
		}.bind(this));
		var modal = (this.state.deleteFav.length > 0) ? <DeleteModal favourite={this.state.deleteFav} confirmDelete={this.confirmDelete} closeModal={this.closeDeleteModal}></DeleteModal> : <div />;
		switch(this.state.loaded) {
			case 'loading':
				return (
					<p>Loading...</p>
				);
			case 'not-found':
				return (
					<p>No Favourites found. Select features and/or tags then click Save to create a Favourite.</p>
				);
			default:
				return (
					<div>
						{modal}
						<table className="favourites-table">
							<tbody>
								<tr className="table-header">
									<th className="col-md-2">Name</th>
									<th className="col-md-6">Scenarios</th>
									<th className="col-md-6">Tags</th>
									<th className="col-md-3"> </th>
								</tr>
								{favs}
							</tbody>
						</table>
					</div>
				);
		}
	}
});
