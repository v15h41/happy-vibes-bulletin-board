const users = require('../models/db');

module.exports.homePage = function(req, res){
    res.send("Happy Vibes Co.");
};
module.exports.sayGoodbye = function(req, res) {
    res.send("Goodbye");
};

