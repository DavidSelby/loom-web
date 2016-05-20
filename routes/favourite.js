var Favourite = require('./../models/favourite');

module.exports = function(app){

	// Get favourites
	app.get('/api/favourites', function(req, res) {
		Favourite.find(function(err, favs) {
			if (err)
				res.send(err)
			res.json(favs);
		});
	});

	// Create new favourite
	app.post('/api/favourites', function(req, res) {
		Favourite.create({
			name : req.body.name,
			command : req.body.command,
			features : req.body.features,
			scenarios : req.body.scenarios,
			lineNums : req.body.lineNums,
			tags : req.body.tags
		}, function(err, fav) {
			if(err)
				res.send(err)

			Favourite.find(function(err, favs) {
				if (err)
					res.send(err)
				res.json(favs);
			});
		});
	});

	// Delete favourite
	app.delete('/api/favourites/:fav_id', function(req, res) {
		Favourite.remove({
			_id : req.params.fav_id
		}, function(err, favs) {
			if (err)
				res.send(err);
			Favourite.find(function(err, favs) {
				if (err)
					res.send(err);
				res.json(favs);
			});
		});
	});
}