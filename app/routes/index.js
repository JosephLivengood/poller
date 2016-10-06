'use strict';

var mongo = require('mongodb').MongoClient
var url = 'mongodb://localhost:27017/test'

var path = process.cwd();

module.exports = function (app) {

	app.route('/')
		.get(function (req, res) {
			res.sendFile(path + '/public/index.html');
		});
	
	app.route('/poll/:pollid')
	    .get(function (req, res) {
	        //res.sendFile(path + '/public/poll.html')
	        mongo.connect(url,function(err,db) {
	            if (err) console.log(err)
                var collection=db.collection('polls')
                collection.find({
                    id: req.params.pollid
                }).toArray(function(err,documents){
                    if (err) console.log(err)
                    console.log(documents)
                    //res.send(documents[0].question)
                    //WE CAN SPLIT DATA HERE, OR ON PUG FILE....
                    //LETS DO IT HERE TO KEEP PUG CLEAN.
                    res.render(path + '/public/poll', {question: documents[0].question,
                    options: documents[0].options, asker: documents[0].posterid, date: documents[0].date})
                    db.close()
	            })
	        })
	    })
	 
	app.route('/api/:pollid')
		.get(function (req, res) {
			res.json("this isnt json, but im not reading from mongo yet");
		});

	app.route('/login')
		.get(function (req, res) {
			res.sendFile(path + '/public/login.html');
		});

	app.route('/logout')
		.get(function (req, res) {
			req.logout();
			res.redirect('/login');
		});
		
	app.route('/profile')
		.get(function (req, res) {
			res.sendFile(path + '/public/user.html');
		});

};
