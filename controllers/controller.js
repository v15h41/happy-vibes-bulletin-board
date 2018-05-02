const mongoose = require('mongoose');
const users_db = mongoose.model('users');
const workspace_db = mongoose.model('workspaces');
const workspace_users_db = mongoose.model('workspace_users')

module.exports.login = function(req, res){
    res.render('./pages/login', { forget_pwd_link: "/forget_pwd",
                                    signup_link: "/signup", newroom_link: "/newroom"});
};

module.exports.submit_user = function(req, res) {
    for (key in req.body) {
        if (req.body[key] == "") {
            res.send("0Error: Please fill in all fields");
            return;
        }
    }

    users_db.find({"email":req.body.email}, function(err, user)  {
        if (user.length == 0) {
            var user = new users_db({
                "firstname":req.body.firstname,
                "lastname":req.body.lastname,
                "email":req.body.email,
                "password":req.body.password
            });

            user.save(function (err, new_user) {
                if (!err) {
                    res.send("1" + new_user._id);
                } else {
                    res.send("0Error: Database error");
                }
            });
        } else {
            res.send("0Error: Email already exists");
        }
    });

};

module.exports.submit_workspace = function(req, res) {
    for (key in req.body) {
        if (req.body[key] == "") {
            res.send("0Error: Please fill in all fields");
            return;
        }
    }

    if (req.body.workspaceID.indexOf(" ") != -1) {
        res.send("0Error: Workspace ID contains spaces");
        return;
    }

    workspace_db.find({"workspaceID":req.body.workspaceID}, function(err, work) {
        if (work.length == 0) {
            var workspace = new workspace_db({
                "workspaceID":req.body.workspaceID,
                "workspace_name":req.body.workspace_name
            });

            workspace.save(function (err, new_workspace) {
                if (!err) {
                    res.send("1" + new_workspace._id);
                } else {
                    res.send("0Error: Database error");
                }
            });
        } else {
            res.send("0Error: Workspace already exists");
        }
    });

};

module.exports.log_in = function(req, res) {
    users_db.find({"email":req.body.email}, function(err, user_found) {
        if (user_found.length) {
            if (user_found[0].password == req.body.password) {
                res.send("1" + user_found[0]._id);
            } else {
                res.send("0Error: Incorrect password");
            }
        } else {
            res.send("0Error: Email does not exist");
        }
    })
};

module.exports.add_user = function(req, res) {
    var workspace_user = new workspace_users_db({
        "workspaceID":req.body.workspaceID,
        "userID":req.body.userID,
        "user_role":req.body.user_role
    });

    workspace_user.save(function (err, new_workspace_user) {
        if (!err) {
            res.send("1");
        } else {
            res.send("0Error: Database error");
        }
    });
};

module.exports.get_workspace_id = function(req, res) {
    workspace_db.find({"workspaceID":req.params.workspaceID}, function(err, work) {
        if (work.length) {
            res.send("1" + work[0]._id);
        } else {
            res.send("0" + "Error: Workspace does not exist");
        }
    });
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

