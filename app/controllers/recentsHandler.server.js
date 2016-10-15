'use strict';

var mongo = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/test';
var ObjectId = require('mongodb').ObjectID;
var path = process.cwd();

function RecentsHandler () {
    
    this.justVoted = function(req, res) {
    
    };
    
    this.justCreated = function(req, res) {
        
    };
    
    /*
    *   getRecentPolls- Used by pollHandler.addPollPage in rendering /newpoll
    *   @RETURNS the most recent 7 polls created in an array of objects:
    *       [   {question, id},
    *           {question, id}, ... ]
    */
    this.getRecentPolls = function() {
        return [ {question: "This is a success?", id: "1234567890"},
                 {question: "IT IS!!!!!!!!!!!", id: "kjhfsjsjgfe"} ];
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