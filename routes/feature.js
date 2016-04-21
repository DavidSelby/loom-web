var Feature = require('./../models/feature');

module.exports = function(app){

	// Get feature files
	app.get('/api/features', function(req, res) {
		Feature.find(function(err, features) {
			if (err)
				res.send(err)
			res.json(features);
		});
	});

	// Create new feature file
	app.post('/api/features', function(req, res) {
		Feature.create({
			feature : req.body.feature,
			content : req.body.content,
			tags : req.body.tags
		}, function(err, feature) {
			if(err)
				res.send(err)

			Feature.find(function(err, features) {
				if (err)
					res.send(err)
				res.json(features);
			});
		});
	});

	// Delete feature file
	app.delete('/api/features/:feature_id', function(req, res) {
		Feature.remove({
			_id : req.params.feature_id
		}, function(err, features) {
			if (err)
				res.send(err)
			Feature.find(function(err, features) {
				if (err)
					res.send(err)
				res.json(features);
			});
		});
	});
}