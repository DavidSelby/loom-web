var mongoose = require('mongoose');

var Scenarios = new mongoose.Schema({
	scenarios : [Boolean]
});

module.exports = mongoose.model('Favourite', {
	name : String,
	command : String,
	features : [Boolean],
	scenarios : [Scenarios],
	lineNums : Array,
	tags : String
});