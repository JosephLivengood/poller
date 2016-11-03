'use strict';

var mongo = require('mongodb').MongoClient;
var url = 'mongodb://admin:pass@ds141937.mlab.com:41937/poller'; //'mongodb://localhost:27017/test';
var ObjectId = require('mongodb').ObjectID;
var path = process.cwd();

function RecentsHandler () {
    
    /*
    *   Inserts voted on QUESTION and ID in capped db collection. Max 50.
    *   Used by vote controller to keep track of recent votes.
    *   db.createCollection("recentvoted", { capped : true, size : 50000, max : 50 } )
    */
    this.justVoted = function(question, id, category) {
        mongo.connect(url,function(err,db) {
			if (err) console.log(err);
            var collection=db.collection('recentvoted');
            collection.insert({question: question, id: id, category: category}, function(err, result) {
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
    *       [   {question, id, category, count},
    *           {question, id, category, count}, ... ]
    */
    this.getRecentVotes = function(callback) {
        mongo.connect(url,function(err,db) {
			if (err) console.log(err);
            var collection=db.collection('recentvoted');
            collection.find({}).toArray(function(err, result) {
                if (err) console.log(err);
                /*
                *   Puts most recent votes (50) in array 'results'
                *   Creates 'counts' array to count duplicates in 'results'
                *   Removed duplicates on this end in 'results'
                *   Attaches count of each result to result in 'results' to return to render.
                */
                var results= [];
                for (var i = 0; i < result.length; i++) {
                    results.push({"question": result[i].question, "id": result[i].id, "category": result[i].category});
                }
                var counts = {};
                results.forEach(function(x) {
                    counts[x.id] = (counts[x.id] || 0)+1; 
                });
                function removeDuplicates(originalArray, prop) {
                    var newArray = [];
                    var lookupObject  = {};
                    for(var i in originalArray) {
                        lookupObject[originalArray[i][prop]] = originalArray[i];
                    }
                    for(i in lookupObject) {
                        newArray.push(lookupObject[i]);
                    }
                    return newArray;
                }
                results = removeDuplicates(results, 'id');
                for (var i = 0; i < results.length; i++) {
                    results[i].count = counts[results[i].id];
                }
                callback(results);
            });
        });
    };
    
}

module.exports = RecentsHandler;