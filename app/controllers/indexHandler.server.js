'use strict';

var mongo = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/test';
var ObjectId = require('mongodb').ObjectID;
var path = process.cwd();
var RecentsHandler = require(path + '/app/controllers/recentsHandler.server.js');

function IndexHandler () {
    
    var recentsHandler = new RecentsHandler();
    
    this.displayHome = function(req, res) {
        var isLoggedIn = false;
        var loggedInAs = "Joseph Livengood";//user.getUsername();
        recentsHandler.getRecentVotes(function(i) {
            res.render(path + '/public/index', {loggedIn: isLoggedIn,recents: i,loggedInAs: loggedInAs});
        });
    };
    
}

module.exports = IndexHandler;