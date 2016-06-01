var mongoose = require('mongoose');

module.exports = mongoose.model('Report', {
	date : Date,
	report : mongoose.Schema.Types.Mixed,
	device : mongoose.Schema.Types.Mixed,
	environment : String,
	run : String
})