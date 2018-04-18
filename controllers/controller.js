const soonInformation = require("../models/comingSoonInfo.js");

module.exports.comingSoon = function(req, res){
    //res.send("Happy Vibes Co.");
    res.render("comingSoonInforTemp", {info: soonInformation[0]});
};

module.exports.login = function(req, res){
    //res.send("Happy Vibes Co.");
    res.render('./pages/login');
};

module.exports.sayGoodbye = function(req, res) {
    res.send("Goodbye");
};

