var mongoose = require('mongoose');

module.exports = mongoose.model('Report', {
	date : Date,
	report : String,
	device : String,
	environment : String,
	cuke : String
})