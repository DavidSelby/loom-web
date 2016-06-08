var mongoose = require('mongoose');

module.exports = mongoose.model('Cuke', {
	_id : String,
	runId : String,
	command : String,
	status : String,
	device : mongoose.Schema.Types.Mixed
});