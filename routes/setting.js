var Setting = require('./../models/setting.js');

module.exports = function(app) {

	// Get settings
	app.get('/api/settings', function(req, res) {
		Setting.find(function(err, settings) {
			if (err)
				res.send(err)
			res.json(settings);
		});
	});

	// Create new setting
	app.post('/api/settings', function(req, res) {
		Setting.create({
			name : req.body.name,
			options : req.body.options
		}, function(err, setting) {
			if(err)
				res.send(err)

			Setting.find(function(err, settings) {
				if (err)
					res.send(err)
				res.json(settings);
			});
		});
	});

	// Update setting
	app.post('/api/settings/:setting_id', function(req, res) {
		Setting.findByIdAndUpdate(req.params.setting_id, {
			$set: {
				name : req.body.name,
				options : req.body.options
			}
		}, function(err, settings) {
			if (err){
				res.send(err);
				return;
			}
			Setting.find(function(err, settings) {
				if (err) {
					res.send(err);
					return;
				}
				res.json(settings);
			});
		});
	});

	// Delete git setting
	app.delete('/api/settings/:setting_id', function(req, res) {
		Setting.remove({
			_id : req.params.setting_id
		}, function(err, settings) {
			if (err)
				res.send(err)
			Setting.find(function(err, settings) {
				if (err)
					res.send(err)
				res.json(settings);
			});
		});
	});
}