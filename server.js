'use strict';

var express = require('express');
var routes = require('./app/routes/index.js');
var auth = require('./app/auth/passwordless.js');
var bodyParser = require('body-parser');
var passwordless = require('passwordless');
var MongoStore = require('passwordless-mongostore');
var email   = require("emailjs");
var expressSession = require('express-session');
var cookieParser = require('cookie-parser');
var app = express();

app.use(cookieParser());
app.use(expressSession({secret:'somesecrettokenhere'}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use('/controllers', express.static(process.cwd() + '/app/controllers'));
app.set('view engine', 'pug'); //Formerly JADE
app.use(express.static(__dirname + '/public'));

auth(app);
routes(app);

var port = process.env.PORT || 8080;
app.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...');
});