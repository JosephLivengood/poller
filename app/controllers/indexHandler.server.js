'use strict';

var mongo = require('mongodb').MongoClient;
var url = process.env.db;
var ObjectId = require('mongodb').ObjectID;
var path = process.cwd();
var RecentsHandler = require(path + '/app/controllers/recentsHandler.server.js');

function IndexHandler () {
    
    var recentsHandler = new RecentsHandler();
    
    this.displayHome = function(req, res) {
        var isLoggedIn = Boolean(req.user);
        var loggedInAs = req.session.profile;
        switch (req.query.category) {
            case 'test':
                //@TODO: create new pug file to handle category view
                res.render(path + '/public/index', {loggedIn: Boolean(req.user), recents: [], loggedInAs: req.session.profile});
                break;
            default:
                recentsHandler.getRecentVotes(function(i) {
                    res.render(path + '/public/index', {loggedIn: Boolean(req.user),recents: i,loggedInAs: req.session.profile});
                });
        }
        
    };
    
}

module.exports = IndexHandler;