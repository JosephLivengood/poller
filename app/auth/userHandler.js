'use strict';

var mongo = require('mongodb').MongoClient;
var url = process.env.db;

function UserHandler () {
    
    this.sendToken = function(user, delivery, callback) {
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
                    console.log(user + ' - ' + doc.value.name);
                    callback(null, doc.value.name);
                }
            );
            db.close();
        });
    }; 
    
    
		        
}

module.exports = UserHandler;