'use strict';

var mongo = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/test';
var ObjectId = require('mongodb').ObjectID;
var path = process.cwd();

function RecentsHandler () {
    
    /*
    *   Inserts voted on QUESTION and ID in capped db collection. Max 50.
    *   Used by index to display trending polls being actively voted on.
    *   db.createCollection("recentvoted", { capped : true, size : 50000, max : 50 } )
    */
    this.justVoted = function(question, id) {
        mongo.connect(url,function(err,db) {
			if (err) console.log(err);
            var collection=db.collection('recentvoted');
            collection.insert({question: question, id: id}, function(err, result) {
                if (err) console.log(err);
                db.close();
            });
        });    
    };

    /*
    *   Inserts the new poll's QUESTION and ID in capped db collection. Max 10.
    *   Used by pollHandler.addPollPage to display most recently made polls.  
    *   db.createCollection("recentcreated", { capped : true, size : 50000, max : 10 } )
    */
    this.justCreated = function(question, id) {
        mongo.connect(url,function(err,db) {
			if (err) console.log(err);
            var collection=db.collection('recentcreated');
            collection.insert({question: question, id: id}, function(err, result) {
                if (err) console.log(err);
                db.close();
            });
        });
    };
    
    /*
    *   getRecentPolls- Used by pollHandler.addPollPage in rendering /newpoll
    *   @RETURNSTOTHECALLBACK the most recent 10 polls created in an array of objects:
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
                for (var i = 0; i < result.length; i++) {
                    results.push({"question": result[i].question, "id": result[i].id});
                }
                callback(results);
            });
        });
    };
    
    
    /*
    *   getRecentVotes- Used by (nonexistant controller) in index
    *   NOTE- No offset as by time user loads it, it could display overlapping results, refresh will work better.
    *   @RETURNSTOTHECALLBACK the most recently voted on 50 polls in an array of objects
    *       [   {question, id},
    *           {question, id}, ... ]
    */
    this.getRecentVotes = function() {
        mongo.connect(url,function(err,db) {
			if (err) console.log(err);
            var collection=db.collection('recentvoted');
            collection.find({}).toArray(function(err, result) {
                if (err) console.log(err);
                var results= [];
                for (var i = 0; i < result.length; i++) {
                    results.push({"question": result[i].question, "id": result[i].id});
                }
                //callback(results);
            });
        });
    };
    
}

module.exports = RecentsHandler;