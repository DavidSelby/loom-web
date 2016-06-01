var mongoose = require('mongoose');

module.exports = mongoose.model('Setting', {
	name : String,
	options : Array
});