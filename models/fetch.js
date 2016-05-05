var mongoose = require('mongoose');

module.exports = mongoose.model('Fetch', {
	branch : String,
	status : String
})