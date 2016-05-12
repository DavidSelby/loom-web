var mongoose = require('mongoose');

module.exports = mongoose.model('Feature', {
	features : [{
		path : String,
		feature : String,
		scenarios : [{
			scenario : String,
			lineNum : Number,
			steps : Array
		}],
	}],
	tags : [{
		tag : String,
		feature : Boolean
	}]
});