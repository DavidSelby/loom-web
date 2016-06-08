var Run = require('./../models/run');
var Cuke = require('./../models/cuke');

module.exports = function(app){

	// Get run
	app.get('/api/runs', function(req, res) {
		var offset = req.query.offset;
		var load = req.query.load;
		Run.find(function(err, runs) {
			if (err)
				res.send(err);
			res.json(runs);
		}).skip(offset).limit(load).sort({'_id': 'desc'});
	});

	app.get('/api/runs/count', function(req, res) {
		Run.count({}, function(err, count){
			if (err) {
				res.send(err);
				return;
			}
			res.json(count);
		});
	})

	// Create new run
	app.post('/api/runs', function(req, res) {
		Run.create({
			_id : req.body.runId,
			name : req.body.name
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
			}).sort({'_id': 'desc'});
		});
	});

	// Delete run
	app.delete('/api/runs/:run_id', function(req, res) {
		Run.remove({
			_id : req.params.run_id
		}, function(err, runs) {
			if (err)
				res.send(err);
			Cuke.remove({
				runId : req.params.run_id
			}, function(err, cukes) {
				if (err)
					res.send(err)
			});
			Run.find(function(err, runs) {
				if (err)
					res.send(err);
				res.json(runs);
			}).sort({'_id': 'desc'});
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
			}).sort({'_id': 'desc'});
		});
	});
}