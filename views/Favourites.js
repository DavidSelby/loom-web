import React from 'react'
import ReactDom from 'react-dom'

var Favourite = React.createClass({
	selectFavourite: function() {
		console.log(this.props.tags);
		this.props.selectFavourite(this.props.fav.name, this.props.fav.features, this.props.fav.scenarios, this.props.fav.lineNums, this.props.fav.tags)
	},
	render: function() {
		return (
			<tr className="favourite">
				<td className="favourite-name">{this.props.fav.name}</td>
				<td className="favourite-command">{this.props.fav.command}</td>
				<td className="run-favourite"><button onClick={this.selectFavourite}>Select</button></td>
			</tr>
		);
	}
})

export default React.createClass({
	selectFavourite: function() {
		console.log(this.props.tags);
		this.props.selectFavourite(this.props.name, this.props.features, this.props.scenarios, this.props.lineNums, this.props.tags)
	},
	componentDidMount: function() {
		this.props.getFavourites();
	},
	render: function() {
		var favs = this.props.favourites.map(function(fav, index) {
			return (
				<Favourite {...this.props} fav={fav} key={index}></Favourite>
			);
		}.bind(this));
		return (
			<table>
				<tbody>
					{favs}
				</tbody>
			</table>
		);
	}
});