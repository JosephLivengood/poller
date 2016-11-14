'use strict';

var mongo = require('mongodb').MongoClient;
var url = process.env.db;
var ObjectId = require('mongodb').ObjectID;
var path = process.cwd();
var RecentsHandler = require(path + '/app/controllers/recentsHandler.server.js');
var PollHandler = require(path + '/app/controllers/pollHandler.server.js');

function IndexHandler () {
    
    var recentsHandler = new RecentsHandler();
    var pollHandler = new PollHandler();
    
    this.displayHome = function(req, res) {
        switch (req.query.category) {
            case 'General':
            case 'Gaming':
            case 'Personal':
            case 'Politics':
            case 'Suggestions':
                pollHandler.loadCategory(req.query.category, req.query.page, function(i,x,y) {
                    res.render(path + '/public/categoryview', {polls: i, cate: y, page: x, loggedIn: Boolean(req.user), loggedInAs: req.session.profile});
                });
                break;
            case 'All':
                pollHandler.loadMostRecent(req.query.page, function(i,x) {
                    res.render(path + '/public/categoryview', {polls: i, cate: "All", page: x, loggedIn: Boolean(req.user), loggedInAs: req.session.profile});
                });
                break;
            default:
                recentsHandler.getRecentVotes(function(i) {
                    res.render(path + '/public/index', {loggedIn: Boolean(req.user),recents: i,loggedInAs: req.session.profile});
                });
        }
    };
    
}

module.exports = IndexHandler;