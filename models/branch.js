var mongoose = require('mongoose');

module.exports = mongoose.model('Branch', {
	name : String,
	lastCommit : String,
	author : String,
	updated : Date
});