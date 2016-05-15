import React from 'react'
import ReactDom from 'react-dom'

var Tag = React.createClass({
	render: function() {
		return (
			<a className={"tag" + this.props.included} onClick={() => this.props.handleClick(this.props.tag)}>{this.props.tag}</a>
		);
	}
});

var ExcludeTags = React.createClass({
	handleClick: function(tag) {
		this.props.excludeTag(tag);
	},
	render: function() {
		var tags = this.props.tags.map(function(tag, index) {
			var included = "";
			if (this.props.excludedTags.indexOf("~" + tag.tag) > -1) {
				included=" excluded";
			}
    		return (
				<Tag {...this.props}
					handleClick={this.handleClick}
					index={index}
					tag={"~" + tag.tag}
					key={tag._id}
					included={included}>
				</Tag>
			);
		}.bind(this));
		return (
			<div className="excluded-tags">
			<h4 className="tags-title">Excluded tags: </h4>
				<div className="tags-list">
					{tags}
				</div>
			</div>
		);
	}
});

var IncludeTags = React.createClass({
	handleClick: function(tag) {
		this.props.includeTag(tag);
	},
	render: function() {
		var tags = this.props.tags.map(function(tag, index) {
			var included = "";
			if (this.props.includedTags.indexOf(tag.tag) > -1) {
				included=" included";
			}
    		return (
				<Tag {...this.props}
					handleClick={this.handleClick}
					index={index}
					tag={tag.tag}
					key={tag._id}
					included={included}>
				</Tag>
			);
		}.bind(this));
		return (
			<div className="included-tags">
				<h4 className="tags-title">Included tags: </h4>
				<div className="tags-list">
					{tags}
				</div>
			</div>
		);
	}
});

export default React.createClass({
	componentDidMount: function() {
		if (this.props.tags.length < 1) {
			this.props.getTags();
		}
	},
	render: function() {
		return (
			<div className="container tag-block">
				<h2 className="page-subtitle tag-title">Tag List</h2>
				<IncludeTags {...this.props} ></IncludeTags>
				<ExcludeTags {...this.props} ></ExcludeTags>
				<input className="selected-tags" type="text" name="tags" onChange={this.props.setTagsString} value={this.props.tagsString} />
		    </div>
		);
	}
});