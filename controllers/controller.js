const soonInformation = require("../models/comingSoonInfo.js");

module.exports.comingSoon = function(req, res){
    res.send("Happy Vibes Co.");
    //res.render("ComingSoonPageView", {info: soonInformation[0]});
};

module.exports.sayGoodbye = function(req, res) {
    res.send("Goodbye");
};

