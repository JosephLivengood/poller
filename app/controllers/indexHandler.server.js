'use strict';

var mongo = require('mongodb').MongoClient;
var url = 'mongodb://admin:pass@ds141937.mlab.com:41937/poller'; //'mongodb://localhost:27017/test';
var ObjectId = require('mongodb').ObjectID;
var path = process.cwd();
var RecentsHandler = require(path + '/app/controllers/recentsHandler.server.js');

function IndexHandler () {
    
    var recentsHandler = new RecentsHandler();
    
    this.displayHome = function(req, res) {
        console.log('connected');
        var isLoggedIn = false;
        var loggedInAs = 'Joseph Livengood';//user.getUsername();
        switch (req.query.category) {
            case 'test':
                res.render(path + '/public/index', {loggedIn: true,recents: [],loggedInAs: loggedInAs});
                break;
            default:
                recentsHandler.getRecentVotes(function(i) {
                    res.render(path + '/public/index', {loggedIn: isLoggedIn,recents: i,loggedInAs: loggedInAs});
                });
        }
        
        
        /*
        if (req.query.category == 'test') {
            res.render(path + '/public/index', {loggedIn: true,recents: [],loggedInAs: loggedInAs});
        } else {
            recentsHandler.getRecentVotes(function(i) {
                res.render(path + '/public/index', {loggedIn: isLoggedIn,recents: i,loggedInAs: loggedInAs});
            });
        }
        */
    };
    
}

module.exports = IndexHandler;