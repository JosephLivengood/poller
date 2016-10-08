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
            	res.send(documents[0].responses);
            });
		});
    };
    
}

module.exports = ResultsHandler;