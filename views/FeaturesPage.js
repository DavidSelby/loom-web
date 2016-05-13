import React from 'react'
import ReactDom from 'react-dom'
import FeatureBlock from './Features'
import DeviceBlock from './Devices'

export default React.createClass ({
	getFeatures: function() {
		this.serverRequest = $.get('/api/features', function (result) {
			this.setState({
	    		features: result[0].features
	    	});
	    }.bind(this));
	},
	getInitialState: function() {
		return {
			features: []
		}
	},
	render: function() {
		return (
			<FeatureBlock
				getFeatures={this.getFeatures}
				features={this.state.features}
				selectable={false}>
			</FeatureBlock>
		);
	}
});