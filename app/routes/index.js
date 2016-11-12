'use strict';

var path = process.cwd();
var VoteHandler = require(path + '/app/controllers/voteHandler.server.js');
var PollHandler = require(path + '/app/controllers/pollHandler.server.js');
var ResultsHandler = require(path + '/app/controllers/resultsHandler.server.js');
var IndexHandler = require(path + '/app/controllers/indexHandler.server.js');
var passwordless = require('passwordless');

var users = [
    { id: 'Joseph Livengood', email: 'joeylivengood@gmail.com' },
    { id: 'Samantha Hernandez', email: 'gymnastics79@gmail.com' }
];

module.exports = function (app) {
	
	var voteHandler = new VoteHandler();
	var pollHandler = new PollHandler();
	var resultsHandler = new ResultsHandler();
	var indexHandler = new IndexHandler();

	app.route('/')
		.get(indexHandler.displayHome);
		
	app.route('/newpoll')
		.post(pollHandler.addPoll)
		.get(passwordless.restricted(), pollHandler.addPollPage);
	
	app.route('/poll/:pollid/results')
		.get(resultsHandler.sendArrayResults);
	
	app.route('/poll/:pollid')
		.post(voteHandler.addVote)
		.get(pollHandler.loadPoll);
		
	app.route('/logged_in', passwordless.acceptToken());
	    //.get(function(req, res) {res.render(path + '/public/index', {loggedIn: true,recents: [],loggedInAs: req.user });});

	app.route('/login')
		.get(function (req, res) { res.sendFile(path + '/public/login.html'); });
		
	app.route('/sendtoken')
		.post(passwordless.requestToken(
		        function(user, delivery, callback) {
		            for (var i = users.length - 1; i >= 0; i--) {
		                if(users[i].email === user.toLowerCase()) {
		                    return callback(null, users[i].id);
		                }
		            }
		            callback(null, null);
		        }),
		        function(req, res) {
		        res.sendFile(path + '/public/sent.html');
		        });
		        
	app.route('/logout')
		.get(passwordless.logout(), function (req, res) { res.redirect('/'); console.log('testing'); });
		
	app.route('/profile')
		.get(function (req, res) { res.sendFile(path + '/public/user.html'); });

};
