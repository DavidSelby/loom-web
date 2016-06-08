var mongoose = require('mongoose');

module.exports = mongoose.model('Report', {
	date : Date,
	result : String,
	report : mongoose.Schema.Types.Mixed,
	device : mongoose.Schema.Types.Mixed,
	environment : String,
	cuke : String
})