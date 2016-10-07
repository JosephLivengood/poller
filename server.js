'use strict';

var express = require('express');
var routes = require('./app/routes/index.js');
var bodyParser = require('body-parser');

var app = express();

//To support posting of data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use('/controllers', express.static(process.cwd() + '/app/controllers'));
app.set('view engine', 'pug'); //Formerly JADE
app.use(express.static(__dirname + '/public'));

routes(app);

var port = process.env.PORT || 8080;
app.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...');
});