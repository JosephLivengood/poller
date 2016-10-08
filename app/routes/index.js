'use strict';

var path = process.cwd();
var VoteHandler = require(path + '/app/controllers/voteHandler.server.js');
var PollHandler = require(path + '/app/controllers/pollHandler.server.js');
var ResultsHandler = require(path + '/app/controllers/resultsHandler.server.js');

module.exports = function (app) {
	
	var voteHandler = new VoteHandler();
	var pollHandler = new PollHandler();
	var resultsHandler = new ResultsHandler();

	app.route('/')
		.get(function (req, res) { res.render(path + '/public/index'); });
		
	app.route('/newpoll')
		.post(pollHandler.addPoll)
		.get(function (req, res) { res.render(path + '/public/newpoll'); });
	
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
