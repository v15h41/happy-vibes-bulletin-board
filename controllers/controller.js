const mongoose = require('mongoose');
const users_db = mongoose.model('users');

module.exports.login = function(req, res){
    res.render('./pages/login', { forget_pwd_link: "/forget_pwd",
                                    signup_link: "/signup", newroom_link: "/newroom"});
};

module.exports.submit_user = function(req, res) {
    var error = false;
    for (key in req.body) {
        if (req.body[key] == "") {
            res.send("0Error: Please fill in all fields");
            error = true;
            break;
        }
    }

    if (!error) {
        var user = new users_db({
            "firstname":req.body.firstname,
            "lastname":req.body.lastname,
            "email":req.body.email,
            "password":req.body.password
        });

        user.save(function (err, newUser) {
           if (!err) {
               res.send("1");
           } else {
               res.send("0Error: Database error");
           }
        });
    }
}

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

