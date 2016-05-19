var Run = require('./../models/run');

module.exports = function(app){

	// Get run
	app.get('/api/runs', function(req, res) {
		Run.find(function(err, runs) {
			if (err)
				res.send(err);
			res.json(runs);
		});
	});

	// Create new run
	app.post('/api/runs', function(req, res) {
		Run.create({
			_id : req.body.runId
		}, function(err, run) {
			if(err) {
				res.send(err);
				console.error(err);
				return;
			}
			Run.find(function(err, runs) {
				if (err)
					res.send(err);
				res.json(runs);
			});
		});
	});

	// Delete run
	app.delete('/api/runs/:run_id', function(req, res) {
		Run.remove({
			_id : req.params.run_id
		}, function(err, runs) {
			if (err)
				res.send(err);
			Run.find(function(err, runs) {
				if (err)
					res.send(err);
				res.json(runs);
			});
		});
	});

	// Delete all runs
	app.delete('/api/runs', function(req, res) {
		Run.remove(function(err, runs) {
			if (err)
				res.send(err)
			Run.find(function(err, runs) {
				if (err)
					res.send(err)
				res.json(runs);
			});
		});
	});
}