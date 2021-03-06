'use strict';

var mongo = require('mongodb').MongoClient;
var url = process.env.db;
var ObjectId = require('mongodb').ObjectID;
var path = process.cwd();
var RecentsHandler = require(path + '/app/controllers/recentsHandler.server.js');

function PollHandler () {
	
	var recentsHandler = new RecentsHandler();
    
    this.loadPoll = function(req, res) {
        mongo.connect(url,function(err,db) {
            if (err) console.log(err);
            var collection=db.collection('polls');
            collection.find({
                _id: new ObjectId(req.params.pollid)
            }).toArray(function(err,documents){
                if (err) console.log(err);
                if (!documents[0]) {
					res.render(path + '/public/notfound', {loggedIn: Boolean(req.user), loggedInAs: req.session.profile});
                } else {
					console.log(documents[0].question);
					res.render(path + '/public/poll', {question: documents[0].question,
					options: documents[0].options, asker: documents[0].posterid, date: documents[0].date,
					loggedIn: Boolean(req.user), loggedInAs: req.session.profile});
                }
                db.close();
            });
        });
    };
    
    this.addPollPage = function(req, res) {
    	recentsHandler.getRecentPolls(function(i) {
    		res.render(path + '/public/newpoll', {recents: i, loggedIn: Boolean(req.user), loggedInAs: req.session.profile});
    	});
    };
    
    this.addPoll = function(req, res) {
        var options = req.body.options;
		var optionsarr = options.split(",");
		for (var i = 0; i < optionsarr.length; i++) {
			optionsarr[i] = optionsarr[i].trim();
			//needed for if the element is only spaces incase trim does not work on element so we can filter it out
			if (optionsarr[i].charAt(0) == " ") {
          		optionsarr[i] = "";
			}
        }
		optionsarr = optionsarr.filter(Boolean);
		var doc = {
			"question": req.body.question,
			"category": req.body.category,
			"options": [],
			"responses": [],
			"posterid": req.session.profile,
			"date": new Date()
		};
		for (var i = 0; i < optionsarr.length; i++) {
			doc.options[i] = {
				"id": i,
				"answer": optionsarr[i]
			};
		}
		mongo.connect(url, function(err, db) {
			if (err) console.log(err);
			var collection=db.collection('polls');
			collection.insert(doc, function(err, result) {
				if (err) console.log(err);
				recentsHandler.justCreated(doc.question, doc._id);
				res.statusCode = 302;
				res.setHeader("Location", "/poll/"+doc._id);
				res.end();
			});
		});
    };
    
    this.loadCategory = function(category, page, callback) {
        mongo.connect(url,function(err,db) {
			if (err) console.log(err);
            var collection=db.collection('polls');
            collection.find(
				{category: category},
				{ options: 0, responses: 0 },
				{sort: {date: -1}}
			).skip((page-1)*30).limit(30).toArray(function(err, result) {
                if (err) console.log(err);
				console.log(result);
                callback(result, page, category);
            });
        });
    };
    
    this.loadMostRecent = function(page, callback) {
        mongo.connect(url,function(err,db) {
			if (err) console.log(err);
            var collection=db.collection('polls');
            collection.find({},
				{ options: 0, responses: 0 },
				{sort: {date: -1}}
			).skip((page-1)*30).limit(30).toArray(function(err, result) {
                if (err) console.log(err);
				console.log(result);
                callback(result, page);
            });
        });
    };
    
    
}

module.exports = PollHandler;