import React from 'react'
import ReactDom from 'react-dom'
import FeatureBlock from './Features'
import DeviceBlock from './Devices'

export default React.createClass ({
	render: function() {
		return (
			<div>
			<FeatureBlock selectable={true} collapsed={true}></FeatureBlock>
			<DeviceBlock selectable={true} collapsed={true}></DeviceBlock>
			</div>
		);
	}
});