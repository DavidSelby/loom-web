var mongoose = require('mongoose');

module.exports = mongoose.model('Device', {
	platformName : {type : String, required : true},
	deviceName : {type : String, required : true},
	udid : String,
	platformVersion : {type : String, required : true},
	status : String,
	cuke : String
});