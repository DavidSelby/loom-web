var Report = require('./../models/report');

module.exports = function(app){

	// Get reports
	app.get('/api/reports', function(req, res) {
		Report.find(function(err, reports) {
			if (err)
				res.send(err)
			res.json(reports);
		});
	});

	// Get reports for one run
	app.get('/api/:cuke_id/reports', function(req, res) {
		Report.find({cuke : req.params.cuke_id}, function(err, reports) {
			if (err) {
				res.send(err);
				return;
			}
			res.json(reports);
		});
	});

	// Create new report for run
	app.post('/api/:cuke_id/reports', function(req, res) {
		Report.create({
			date : Date.now(),
			report : req.body.report,
			device : req.body.device,
			environment : req.body.environment,
			cuke : req.params.cuke_id
		}, function(err, report) {
			if(err) {
				res.send(err);
				return;
			}
			Report.find(function(err, reports) {
				if (err) {
					res.send(err);
					return;
				}
				res.json(reports);
			});
		});
	});

	// Delete report
	app.delete('/api/reports/:report_id', function(req, res) {
		Report.remove({
			_id : req.params.report_id
		}, function(err, reports) {
			if (err)
				res.send(err)
			Report.find(function(err, reports) {
				if (err)
					res.send(err)
				res.json(reports);
			});
		});
	});

	// Delete all reports for run run_id
	app.delete('/api/:run_id/reports', function(req, res) {
		Report.remove({
			run : req.params.run_id
		}, function(err, reports) {
			if (err)
				res.send(err)
			Report.find(function(err, reports) {
				if (err)
					res.send(err)
				res.json(reports);
			});
		});
	});
}