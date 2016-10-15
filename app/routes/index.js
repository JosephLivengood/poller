'use strict';

var path = process.cwd();
var VoteHandler = require(path + '/app/controllers/voteHandler.server.js');
var PollHandler = require(path + '/app/controllers/pollHandler.server.js');
var ResultsHandler = require(path + '/app/controllers/resultsHandler.server.js');
var IndexHandler = require(path + '/app/controllers/indexHandler.server.js');

module.exports = function (app) {
	
	var voteHandler = new VoteHandler();
	var pollHandler = new PollHandler();
	var resultsHandler = new ResultsHandler();
	var indexHandler = new IndexHandler();

	app.route('/')
		.get(indexHandler.displayHome);
		
	app.route('/newpoll')
		.post(pollHandler.addPoll)
		.get(pollHandler.addPollPage);
	
	app.route('/poll/:pollid/results')
		.get(resultsHandler.sendArrayResults);
	
	app.route('/poll/:pollid')
		.post(voteHandler.addVote)
		.get(pollHandler.loadPoll);

	app.route('/login')
		.get(function (req, res) { res.sendFile(path + '/public/login.html'); });

	app.route('/logout')
		.get(function (req, res) { req.logout(); res.redirect('public/login.html'); });
		
	app.route('/profile')
		.get(function (req, res) { res.sendFile(path + '/public/user.html'); });

};
