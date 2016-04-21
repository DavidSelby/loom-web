var Branch = require('./../models/branch');

module.exports = function(app){

	// Get git branches
	app.get('/api/branches', function(req, res) {
		Branch.find(function(err, branches) {
			if (err)
				res.send(err)
			res.json(branches);
		});
	});

	// Create new git branch
	app.post('/api/branches', function(req, res) {
		Branch.create({
			name : req.body.name,
			lastCommit : req.body.lastCommit,
			author : req.body.author,
			updated : req.body.updated
		}, function(err, branch) {
			if(err)
				res.send(err)

			Branch.find(function(err, branches) {
				if (err)
					res.send(err)
				res.json(branches);
			});
		});
	});

	// Delete git branch
	app.delete('/api/features/:branch_id', function(req, res) {
		Branch.remove({
			_id : req.params.branch_id
		}, function(err, branches) {
			if (err)
				res.send(err)
			Branch.find(function(err, branches) {
				if (err)
					res.send(err)
				res.json(branches);
			});
		});
	});
}