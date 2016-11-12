'use strict';

var mongo = require('mongodb').MongoClient;
var url = process.env.db;
var ObjectId = require('mongodb').ObjectID;
var path = process.cwd();
var RecentsHandler = require(path + '/app/controllers/recentsHandler.server.js');

function IndexHandler () {
    
    var recentsHandler = new RecentsHandler();
    
    this.displayHome = function(req, res) {
        console.log('connected');
        var isLoggedIn = Boolean(req.user);
        var loggedInAs = req.user;
        switch (req.query.category) {
            case 'test':
                //@TODO: create new pug file to handle category view
                res.render(path + '/public/index', {loggedIn: isLoggedIn,recents: [],loggedInAs: loggedInAs});
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