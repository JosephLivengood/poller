'use strict';

function VoteHandler () {
    
    this.addVote = function(req, res) {
        console.log('YAY!');
        res.redirect('/poll/'+req.params.pollid+'/results');
    };
    
}

module.exports = VoteHandler;
