var mongoose = require('mongoose');

module.exports = mongoose.model('Favourite', {
	name : String,
	command : String,
	features : [Boolean],
	scenarios : [Boolean],
	lineNums : Array,
	tags : String
});