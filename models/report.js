var mongoose = require('mongoose');

module.exports = mongoose.model('Report', {
	date : Date,
	report : String,
	device : mongoose.Schema.Types.Mixed,
	environment : String,
	run : String
})