'use strict';

var mongo = require('mongodb').MongoClient;
var url = process.env.db;
var path = process.cwd();

function UserHandler () {
    
    this.sendToken = function(user, delivery, callback, req, res) {
        mongo.connect(url,function(err,db) {
            if (err) console.log(err);
            var collection=db.collection('users');
            collection.findAndModify(
                {email:user.toLowerCase()},
                [['_id','asc']],
                {$setOnInsert:{email: user.toLowerCase(), name: 'Anonymous', verified: false, role: 'user'}},
                {upsert:true, new: true },
                function(err, doc) {
                    if (err) console.log(err), callback(null, null);
                    callback(null, doc.value.email);
                    req.session.profile = doc.value.name;
                }
            );
            db.close();
        });
    };
    
    this.loadLogin = function (req, res) {
        res.render(path + '/public/login', {tokenSent: false});
    };
    
    this.tokenSent = function (req, res) {
        res.render(path + '/public/login', {tokenSent: true});
    };
    
    this.showProfile = function(req, res) {
        res.render(path + '/public/profile', {nameSent: false, loggedIn: Boolean(req.user), loggedInAs: req.session.profile}); 
    };
    
    this.updateName = function(req, res) {
        var newuser = req.body.newuser;
        mongo.connect(url,function(err,db) {
            if (err) console.log(err);
            var collection=db.collection('users');
            collection.findAndModify(
                {email:req.user.toLowerCase()},
                [['_id','asc']],
                {$set: {name: newuser}},
                {new: true},
                function(err, doc) {
                    if (err) console.log(err);
                    req.session.profile = newuser;
                    res.render(path + '/public/profile', {nameSent: true, loggedIn: Boolean(req.user), loggedInAs: req.session.profile});
                }
            );
            db.close();
        });
    };

		        
}

module.exports = UserHandler;