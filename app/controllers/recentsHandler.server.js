'use strict';

var mongo = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/test';
var ObjectId = require('mongodb').ObjectID;
var path = process.cwd();

function RecentsHandler () {
    
    this.justVoted = function() {
    
    };
    
    this.justCreated = function(question, id) {
        mongo.connect(url,function(err,db) {
			if (err) console.log(err);
            var collection=db.collection('recentcreated');
            //db.createCollection("recentcreated", { capped : true, size : 50000, max : 10 } )
            collection.insert({question: question, id: id}, function(err, result) {
                if (err) console.log(err);
                db.close();
            });
        });
    };
    
    /*
    *   getRecentPolls- Used by pollHandler.addPollPage in rendering /newpoll
    *   @RETURNS the most recent 10 polls created in an array of objects:
    *       [   {question, id},
    *           {question, id}, ... ]
    */
    this.getRecentPolls = function(callback) {
        mongo.connect(url,function(err,db) {
			if (err) console.log(err);
            var collection=db.collection('recentcreated');
            collection.find({}).toArray(function(err, result) {
                if (err) console.log(err);
                var results= [];
                for (var i = 0; i < 10; i++) {
                    results.push({"question": result[i].question, "id": result[i].id});
                }
                callback(results);
            });
        });
    };
    
    
    /*
    *   getRecentVotes- Used by (nonexistant controller) in index
    *   NOTE- No offset as by time user loads it, it could display overlapping results, refresh will work better.
    *   @RETURNS the most recently voted on 16 polls in an array of objects
    *       [   {question, id},
    *           {question, id}, ... ]
    */
    this.getRecentVotes = function() {
        return [ {question: "This is a success?", id: "1234567890"},
                 {question: "IT IS!!!!!!!!!!!", id: "kjhfsjsjgfe"} ];
    };
    
}

module.exports = RecentsHandler;