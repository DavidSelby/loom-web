var Fetch = require('./../models/fetch.js');

module.exports = function(app){

	// Get all fetch objects
	app.get('/api/fetch', function(req, res) {
		Fetch.find(function(err, fetches) {
			if (err) {
				res.send(err);
			}
			res.json(fetches);
		});
	});

	// Create new fetch command
	app.post('/api/fetch', function(req, res) {
		Fetch.create({
			branch : req.body.branch,
			status : req.body.status
		},
		function(err, fetches) {
			if (err) {
				res.send(err);
				console.log(err);
			} else {
				Fetch.find(function(err, fetches) {
					if (err) {
						res.send(err);
					}
					res.json(fetches);
				});
			}
		});
	});

	// Update the status off an existing fetch command
	app.post('api/featch/:fetch_id/:status', function(req, res) {
		Fetch.findByIdAndUpdate(req.params.featch_id, {
			$set: {
				status : req.params.status
			}
		}, function(err, fetches) {
			if (err) {
				res.send(err);
				console.log(err);
			} else {
				Fetch.find(function(err, fetches) {
					if (err)
						res.send(err);
					res.json(fetches);
				});
			}
		});
	});

	// Delete fetch command by ID
	app.delete('/api/fetch/:fetch_id', function(req, res) {
		Fetch.remove({
			_id : req.params.fetch_id
		}, function(err, fetches) {
			if (err)
				res.send(err);
			Fetch.find(function(err, Fetches) {
				if (err)
					res.send(err);
				res.json(fetches);
			});
		});
	});
}