'use strict';

var mongo = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/test';
var ObjectId = require('mongodb').ObjectID;
var path = process.cwd();
var RecentsHandler = require(path + '/app/controllers/recentsHandler.server.js');

function VoteHandler () {
    
    var recentsHandler = new RecentsHandler();
    
    this.addVote = function(req, res) {
        mongo.connect(url, function(err, db) {
            if (err) console.log(err);
            var collection=db.collection('polls');
            collection.findAndModify(
                {_id: new ObjectId(req.params.pollid)},
                [['_id','asc']], //Not needed with a unique id
                {$push: {responses:{ "responderid": "1", "response": req.body.option}}},
                {},
                function(err, object) {
                    if (err) console.log(err);
                    collection.find({
                        _id: new ObjectId(req.params.pollid)
                    },{question:1}).toArray(function(err,documents){
                        if (err) console.log(err);
                        recentsHandler.justVoted(documents[0].question, req.params.pollid);
                    });
                }
            );
        });
        res.redirect('/poll/'+req.params.pollid+'/results');
    };
    
}

module.exports = VoteHandler;
