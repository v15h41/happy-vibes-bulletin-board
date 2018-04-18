const soonInformation = require("../models/comingSoonInfo.js");

module.exports.comingSoon = function(req, res){
    //res.send("Happy Vibes Co.");
    res.render("comingSoonInforTemp", {info: soonInformation[0]});
};

module.exports.login = function(req, res){
    res.render('./pages/login', { forget_pwd_link: "https://secure-wildwood-41890.herokuapp.com/forget_pwd",
                                    signup_link: "https://secure-wildwood-41890.herokuapp.com/signup"});
};


module.exports.forget_pwd = function(req, res){
    res.render('./pages/forget_pwd', { link: "https://secure-wildwood-41890.herokuapp.com/"});
};

module.exports.signup = function(req, res){
    res.render('./pages/signup', { link: "https://secure-wildwood-41890.herokuapp.com/"});
};

module.exports.sayGoodbye = function(req, res) {
    res.send("Goodbye");
};

