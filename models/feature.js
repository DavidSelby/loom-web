var mongoose = require('mongoose');

module.exports = mongoose.model('Feature', {
	path : String,
	feature : String,
	scenarios : [{
		scenario : String,
		lineNum : Number
	}],
	tags : [{
		tag : String,
		feature : Boolean
	}]
});