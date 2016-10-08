'use strict';

var mongo = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/test';
var ObjectId = require('mongodb').ObjectID;
var path = process.cwd();
var VoteHandler = require(path + '/app/controllers/voteHandler.server.js');

module.exports = function (app) {
	
	var voteHandler = new VoteHandler();

	app.route('/')
		.get(function (req, res) {
			res.render(path + '/public/index');
		});
		
	app.route('/newpoll')
		.get(function (req, res) {
			res.render(path + '/public/newpoll');
		});
	
	app.route('/API/registerpoll')
		.post(function (req, res) {
			var options = req.body.options;
			var optionsarr = options.split(",");
			var doc = {
				"question": req.body.question,
				"category": req.body.category,
				"options": [],
				"responses": [],
				"posterid": "Joseph Livengood",
				"date": new Date()
			};
			for (var i = 0; i < optionsarr.length; i++) {
				doc.options[i] = {
					"id": i,
					"answer": optionsarr[i].trim()
				};
			}
			mongo.connect(url, function(err, db) {
				if (err) console.log(err);
				var collection=db.collection('polls');
				collection.insert(doc, function(err, result) {
					if (err) console.log(err);
					console.log(doc._id);
					res.statusCode = 302;
					res.setHeader("Location", "/poll/"+doc._id);
					res.end();
				});
			});
			
		});
	
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
		.post(function(req, res) {
			voteHandler.addVote(req, res);
		})
	    .get(function (req, res) {
	        mongo.connect(url,function(err,db) {
	            if (err) console.log(err);
                var collection=db.collection('polls');
                collection.find({
                    _id: new ObjectId(req.params.pollid)
                }).toArray(function(err,documents){
                    if (err) console.log(err);
                    console.log(documents[0].question);
                    res.render(path + '/public/poll', {question: documents[0].question,
                    options: documents[0].options, asker: documents[0].posterid, date: documents[0].date});
                    db.close();
	            });
	        });
	    });

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
