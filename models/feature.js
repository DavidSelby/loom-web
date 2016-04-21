var mongoose = require('mongoose');

module.exports = mongoose.model('Feature', {
	feature : String,
	content : String,
	tags : [{
		tag : String,
		feature : Boolean
	}]
});