'use strict';

var mongo = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/test';
var ObjectId = require('mongodb').ObjectID;
var path = process.cwd();
var RecentsHandler = require(path + '/app/controllers/recentsHandler.server.js');

function IndexHandler () {
    
    var recentsHandler = new RecentsHandler();
    
    this.displayHome = function(req, res) {
        var recents = recentsHandler.getRecentVotes();
        var isLoggedIn = false;
        res.render(path + '/public/index', {loggedIn: isLoggedIn,recents: recents});
    };
    
}

module.exports = IndexHandler;