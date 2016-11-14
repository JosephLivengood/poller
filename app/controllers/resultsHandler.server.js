'use strict';

var mongo = require('mongodb').MongoClient;
var url = process.env.db;
var ObjectId = require('mongodb').ObjectID;
var path = process.cwd();

function ResultsHandler () {
    
    this.sendArrayResults = function(req, res) {
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
                        var aggdata = documents[0].options;
                        var poll = [documents[0].question,documents[0].category,documents[0].posterid,documents[0].responses.length];
                        for (var i = 0; i < aggdata.length; i++) {
                            aggdata[i].result = 0;
                        }
                        for (var i = 0; i < documents[0].responses.length; i++) {
                            aggdata[documents[0].responses[i].response].result++;
                        }
                        aggdata.sort(function(a, b) { return (b.result) - (a.result); });
                        var latestvotes = documents[0].responses.slice(Math.max(documents[0].responses.length - 20,0));
                        var latestarr = [];
                        for (var i = 0; i < latestvotes.length; i++) {
                            latestarr.push(latestvotes[i].response);
                        }
                        var latestuniquearr = latestarr.filter(function(item, i, ar){ return ar.indexOf(item) === i; });
                        res.render(path + '/public/results',{results: aggdata, pollinfo: poll, date: documents[0].date, latest: latestarr, latestunique: latestuniquearr, loggedIn: Boolean(req.user), loggedInAs: req.session.profile});
                    }
            });
		});
    };
    
}

module.exports = ResultsHandler;
