const soonInformation = require("../models/comingSoonInfo.js");

module.exports.comingSoon = function(req, res){
    //res.send("Happy Vibes Co.");
    res.render("comingSoonInforTemp", {info: soonInformation[0]});
};

module.exports.login = function(req, res){
    res.render('./pages/login', { forget_pwd_link: "/forget_pwd",
                                    signup_link: "/signup", newroom_link: "/newroom"});
};


module.exports.forget_pwd = function(req, res){
    res.render('./pages/forget_pwd', { link: "/"});
};

module.exports.signup = function(req, res){
    res.render('./pages/signup', { link: "/"});
};

module.exports.board_page = function(req, res){
    res.render('./pages/board_page', { log_out_link: "/"});
};

module.exports.create_room = function(req, res) {
  res.render('./pages/newroom');
};

module.exports.sayGoodbye = function(req, res) {
    res.send("Goodbye");
};

