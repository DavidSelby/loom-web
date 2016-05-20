var mongoose = require('mongoose');

module.exports = mongoose.model('Favourite', {
	name : String,
	command : String,
	features : Array,
	scenarios : Array,
	lineNums : Array,
	tags : String
});