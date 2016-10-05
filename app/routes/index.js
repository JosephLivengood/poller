'use strict';

var path = process.cwd();

module.exports = function (app) {

	app.route('/')
		.get(function (req, res) {
			res.sendFile(path + '/public/index.html');
		});
	
	app.route('/poll/:pollid')
	    .get(function (req, res) {
	        res.sendFile(path + '/public/poll.html')
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
