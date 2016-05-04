import React from 'react'
import ReactDom from 'react-dom'
import FeatureBlock from './Features'

export default React.createClass ({
	render: function() {
		return (
			<FeatureBlock selectable={true} collapsed={true}></FeatureBlock>
		);
	}
});