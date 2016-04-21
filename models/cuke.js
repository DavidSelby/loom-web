var mongoose = require('mongoose');

module.exports = mongoose.model('Cuke', {
	runId : String,
	command : String,
	status : String
});