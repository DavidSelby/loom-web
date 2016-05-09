var mongoose = require('mongoose');

module.exports = mongoose.model('Fetch', {
	branch : mongoose.Schema.Types.ObjectId,
	status : String
})