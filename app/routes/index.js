'use strict';

var path = process.cwd();
var VoteHandler = require(path + '/app/controllers/voteHandler.server.js');
var PollHandler = require(path + '/app/controllers/pollHandler.server.js');
var ResultsHandler = require(path + '/app/controllers/resultsHandler.server.js');
var IndexHandler = require(path + '/app/controllers/indexHandler.server.js');
var UserHandler = require(path+ '/app/auth/userHandler.js');
var passwordless = require('passwordless');

module.exports = function (app) {
	
	var voteHandler = new VoteHandler();
	var pollHandler = new PollHandler();
	var resultsHandler = new ResultsHandler();
	var indexHandler = new IndexHandler();
	var userHandler = new UserHandler();

	app.route('/')
		.get(indexHandler.displayHome);
		
	app.route('/newpoll')
		.post(passwordless.restricted({failureRedirect: '/login'}), pollHandler.addPoll)
		.get(passwordless.restricted({failureRedirect: '/login'}), pollHandler.addPollPage);
	
	app.route('/poll/:pollid/results')
		.get(resultsHandler.sendArrayResults);
	
	app.route('/poll/:pollid')
		.post(passwordless.restricted({failureRedirect: '/login'}),voteHandler.addVote)
		.get(pollHandler.loadPoll);

	app.route('/login')
		.get(userHandler.loadLogin)
		.post(passwordless.requestToken(userHandler.sendToken,{failureRedirect: '/login'}), userHandler.tokenSent);

	app.route('/profile')
		.get(passwordless.restricted({failureRedirect: '/login'}), userHandler.showProfile)
		.post(passwordless.restricted({failureRedirect: '/login'}), userHandler.updateName);

	app.route('/logged_in', passwordless.acceptToken());
 
	app.route('/logout')
		.get(passwordless.logout(), function (req, res) { res.redirect('/login') });

};
