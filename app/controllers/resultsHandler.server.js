'use strict';

var mongo = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/test';
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
            	var aggdata = documents[0].options;
            	var poll = [documents[0].question,documents[0].category,documents[0].posterid,documents[0].responses.length];
            	for (var i = 0; i < aggdata.length; i++) {
            	    aggdata[i].result = 0;
            	}
            	for (var i = 0; i < documents[0].responses.length; i++) {
            	    aggdata[documents[0].responses[i].response].result++;
            	}
            	aggdata.sort(function(a, b) { return (b.result) - (a.result); });
            	
            	res.render(path + '/public/results',{results: aggdata, pollinfo: poll, date: documents[0].date});
            });
		});
    };
    
}

module.exports = ResultsHandler;
