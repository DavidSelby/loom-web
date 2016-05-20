var mongoose = require('mongoose');

module.exports = mongoose.model('Run', {
	_id : String,
	name : String
});