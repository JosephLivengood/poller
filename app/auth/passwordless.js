var passwordless = require('passwordless');
var MongoStore = require('passwordless-mongostore');
var email   = require("emailjs");

var smtpServer  = email.server.connect({
   user:    'poller.app.auth@gmail.com', 
   password: 'ev2jsg3i', 
   host:    'smtp.gmail.com', 
   ssl:     true
});

var pathToMongoDb = 'mongodb://admin:pass@ds141937.mlab.com:41937/poller';

module.exports = function (app) {
    console.log('testing');
   
    passwordless.init(new MongoStore(pathToMongoDb));
    
    passwordless.addDelivery(
        function(tokenToSend, uidToSend, recipient, callback) {
            var host = 'localhost:3000';
            smtpServer.send({
                text:    'Hello!\nAccess your account here: http://' 
                + host + '?token=' + tokenToSend + '&uid=' 
                + encodeURIComponent(uidToSend), 
                from:    'poller.app.auth@gmail.com', 
                to:      recipient,
                subject: 'Token for ' + host
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