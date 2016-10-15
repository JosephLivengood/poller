'use strict';

var mongo = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/test';
var ObjectId = require('mongodb').ObjectID;

function VoteHandler () {
    
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
                    if (err){
                        console.warn(err.message);  // returns error if no matching object found
                    }else{
                        //console.dir(object);
                    }
                }
            );
        });
        res.redirect('/poll/'+req.params.pollid+'/results');
    };
    
}

module.exports = VoteHandler;
