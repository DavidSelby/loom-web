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

	// Get reports for one cuke command
	app.get('/api/:cuke_id/reports', function(req, res) {
		Report.find({cuke : req.params.cuke_id}, function(err, reports) {
			if (err)
				res.send(err)
			res.json(reports);
		});
	});

	// Create new report for cuke command
	app.post('/api/:cuke_id/reports', function(req, res) {
		Report.create({
			date : Date.now(),
			report : req.body.report,
			device : req.body.device,
			environment : req.body.environment,
			cuke : req.params.cuke_id
		}, function(err, report) {
			if(err)
				res.send(err)

			Report.find(function(err, reports) {
				if (err)
					res.send(err)
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

	// Delete all reports for cuke command cuke_id
	app.delete('/api/:cuke_id/reports', function(req, res) {
		Report.remove({
			cuke : req.params.cuke_id
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