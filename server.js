// set up =======================
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

var database = require('./config/database');
mongoose.connect(database.url);

app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(methodOverride());

require('./routes/cuke')(app);
require('./routes/feature')(app);
require('./routes/report')(app);
require('./routes/device')(app);
require('./routes/branch')(app);
require('./routes/fetch')(app);

// Application
app.get('*', function(req, res) {
	res.sendfile('./public/index.html');
});

app.listen(process.env.PORT || 8080);
console.log("App listening on port 8080");
