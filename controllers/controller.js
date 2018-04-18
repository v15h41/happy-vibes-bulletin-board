const soonInformation = require("../models/comingSoonInfo.js");

module.exports.comingSoon = function(req, res){
    //res.send("Happy Vibes Co.");
    res.render("comingSoonInforTemp", {info: soonInformation[0]});
};

module.exports.login = function(req, res){
    //res.send("Happy Vibes Co.");
    res.render('./pages/login', { link: ".pages/forget_pwd"});
};


module.exports.forget_pwd = function(req, res){
    //res.send("Happy Vibes Co.");
    res.render('./pages/forget_pwd', { link: ".pages/login"});
};

module.exports.sayGoodbye = function(req, res) {
    res.send("Goodbye");
};

