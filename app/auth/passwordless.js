var passwordless = require('passwordless');
var MongoStore = require('passwordless-mongostore');
var email   = require("emailjs");

var smtpServer  = email.server.connect({
   user:    'poller.app.auth@gmail.com', 
   password: process.env.emp, 
   host:    'smtp.gmail.com', 
   ssl:     true
});

var pathToMongoDb = process.env.db;

module.exports = function (app) {
    passwordless.init(new MongoStore(pathToMongoDb));
    passwordless.addDelivery(
        function(tokenToSend, uidToSend, recipient, callback) {
            var host = 'https://poll-cloned-backup-livengood.c9users.io/logged_in';
            smtpServer.send({
                text:    'Hello!\nAccess your account here: http://' 
                + host + '?token=' + tokenToSend + '&uid=' 
                + encodeURIComponent(uidToSend) +'\n\nRemember, this is your single use individual link!', 
                from:    'poller.app.auth@gmail.com', 
                to:      recipient,
                subject: 'Token Login for Poller!'
            }, function(err, message) { 
                if(err) {
                    console.log(err);
                }
                callback(err);
            });
    }); 
    app.use(passwordless.sessionSupport());
    app.use(passwordless.acceptToken({ successRedirect: '/'}));
};