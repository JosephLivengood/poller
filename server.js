'use strict';

var express = require('express');
var routes = require('./app/routes/index.js');

var app = express();

app.set('view engine', 'pug'); //Formerly JADE
app.use(express.static(__dirname + '/public'));

routes(app);

var port = process.env.PORT || 8080;
app.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...');
});