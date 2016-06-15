// set up =======================
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

var database = require('./config/database');
mongoose.connect(database.url);

var bodyParser = require('body-parser');
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));

app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(methodOverride());

require('./routes/cuke')(app);
require('./routes/run')(app);
require('./routes/feature')(app);
require('./routes/report')(app);
require('./routes/device')(app);
require('./routes/branch')(app);
require('./routes/fetch')(app);
require('./routes/favourite')(app);
require('./routes/setting')(app);

// Application
app.get('*', function(req, res) {
	res.sendfile('./public/index.html');
});

app.listen(process.env.PORT || 8080);
console.log("App listening on port 8080");
