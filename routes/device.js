var Device = require('./../models/device');

module.exports = function(app){

	// Get devices
	app.get('/api/devices', function(req, res) {
		Device.find(function(err, devices) {
			if (err)
				res.send(err);
			res.json(devices);
		});
	});

	// Create new device
	app.post('/api/devices', function(req, res) {
		Device.create({
			platformName : req.body.platformName,
			deviceName : req.body.deviceName,
			udid : req.body.udid,
			platformVersion : req.body.platformVersion
		}, function(err, device) {
			if(err) {
				res.send(err);
				console.error(err);
				return;
			}
			Device.find(function(err, devices) {
				if (err)
					res.send(err);
				res.json(devices);
			});
		});
	});

	// Delete device
	app.delete('/api/devices/:device_id', function(req, res) {
		Device.remove({
			_id : req.params.device_id
		}, function(err, devices) {
			if (err)
				res.send(err);
			Device.find(function(err, devices) {
				if (err)
					res.send(err);
				res.json(devices);
			});
		});
	});
}