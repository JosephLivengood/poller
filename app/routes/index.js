'use strict';

var mongo = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/test';
var ObjectId = require('mongodb').ObjectID;
var path = process.cwd();
var VoteHandler = require(path + '/app/controllers/voteHandler.server.js');
var PollHandler = require(path + '/app/controllers/pollHandler.server.js');

module.exports = function (app) {
	
	var voteHandler = new VoteHandler();
	var pollHandler = new PollHandler();

	app.route('/')
		.get(function (req, res) {
			res.render(path + '/public/index');
		});
		
	app.route('/newpoll')
		.get(function (req, res) {
			res.render(path + '/public/newpoll');
		});
	
	app.route('/API/registerpoll')
		.post(pollHandler.addPoll);
	
	app.route('/poll/:pollid/results')
		.get(function (req, res) {
			mongo.connect(url,function(err,db) {
				if (err) console.log(err);
                var collection=db.collection('polls');
                collection.find({
                    _id: new ObjectId(req.params.pollid)
                }).toArray(function(err,documents){
                	if (err) console.log(err);
                	res.send(documents[0].responses);
                });
			});
		});
	
	app.route('/poll/:pollid')
		.post(voteHandler.addVote)
		.get(pollHandler.loadPoll);

	app.route('/login')
		.get(function (req, res) {
			res.sendFile(path + '/public/login.html');
		});

	app.route('/logout')
		.get(function (req, res) {
			req.logout();
			res.redirect('/login');
		});
		
	app.route('/profile')
		.get(function (req, res) {
			res.sendFile(path + '/public/user.html');
		});

};
