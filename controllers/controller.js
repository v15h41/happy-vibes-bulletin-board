const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

//import databases
const users_db = mongoose.model('users');
const workspace_db = mongoose.model('workspaces');
const workspace_users_db = mongoose.model('workspace_users');
const sessions_db = mongoose.model('sessions');
const post_its_db = mongoose.model('post_its');
const events_db = mongoose.model('events');


//render the log in page
module.exports.login = function(req, res){
    //check if user is signed in
    if (req.cookies.sessionID != undefined) {
        sessions_db.find({"_id":req.cookies.sessionID}, function(err, sessions_found) {
            //if user is signed in, render the board page otherwise render the log in page
            if (sessions_found.length) {
                res.redirect('/board_page');
            } else {
                res.render('./pages/login', { forget_pwd_link: "/forget_pwd",
                    signup_link: "/signup", newroom_link: "/newroom"});
            }
        });
    } else {
        res.render('./pages/login', { forget_pwd_link: "/forget_pwd",
            signup_link: "/signup", newroom_link: "/newroom"});
    }
};

//API for submitting a new user
module.exports.submit_user = function(req, res) {
    //check if any of the fields are empty
    for (key in req.body) {
        if (req.body[key] == "") {
            res.send("0Error: Please fill in all fields");
            return;
        }
    }

    //check if a user already exists
    users_db.find({"email":req.body.email}, function(err, user)  {
        //if user does not exist continue
        if (user.length == 0) {
            //hash the password with bcrypt and salt for 5 rounds
            var hash = bcrypt.hashSync(req.body.password, 5);

            var user = new users_db({
                "firstname":req.body.firstname,
                "lastname":req.body.lastname,
                "email":req.body.email,
                "password": hash, 
                "likes": 0
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

//API to get list of post its
module.exports.get_post_its = function(req, res) {
    //check if user is signed in
    sessions_db.find({"_id":req.cookies.sessionID}, function(err, sessions_found)   {
        if (sessions_found.length) {
            //match by workspace ID and project relevant fields
            post_its_db.aggregate([
                { "$match": {"workspaceID": mongoose.Types.ObjectId(req.cookies.workspaceID)}},
                { "$lookup":
                    {
                        "from": "users",
                        "localField": "userID",
                        "foreignField" : "_id",
                        "as": "user"
                    }},
                { "$project": {
                    "_id" : 1,
                    "anonymous" : 1,
                        "postItContent": 1,
                        "userID" : 1,
                        "workspaceID" : 1,
                        "user.firstname" : 1,
                        "user.lastname" : 1,
                        "timestamp" : 1,
                        "likes" : 1
                }
                }],function(err, post_its_found) {
                    res.send(post_its_found);
                }

            );
        }
    });


};

//API to get workspaces for user
module.exports.get_workspaces = function(req, res) {
    //get userID from session
    sessions_db.find({"_id":req.cookies.sessionID}, function(err, sessions_found) {
        if (sessions_found.length) {
            users_db.find({"_id":sessions_found[0].userID}, function(err, user_found) {
                //find workspaces that user is part of
                workspace_users_db.find({"userID":user_found[0]._id}, function(err, workspaces) {
                    //send workspaces when async functions are done
                    send_workspaces = [];
                    counter = 0;
                    var i;
                    for (i = 0; i < workspaces.length; i++) {
                        workspace_db.find({"_id":workspaces[i].workspaceID}, function(err, workspace) {
                            send_workspaces.push(workspace[0]);
                            counter++;
                            if (counter == workspaces.length) {
                                res.send(send_workspaces);
                            }
                        });
                    }


                });
            });

        }
    });
};

//API to set the workspace cookie
module.exports.change_workspace_cookie = function(req, res) {
    res.clearCookie("workspaceID");
    res.cookie('workspaceID', req.body.workspaceID);
    res.send();
};

//API to get the name of the user based on user ID
module.exports.get_user_name = function(req, res) {
    users_db.find({"_id":req.params.userID}, function(err, user_found) {
        res.send(user_found[0].firstname + ' ' + user_found[0].lastname);
    });
};

//API to delete posts
module.exports.delete_post_it = function(req, res) {
    post_its_db.remove({"_id":req.body.postitID}, function(err, obj) {});
    res.send("1");
};

//API to delete events
module.exports.delete_event = function(req, res) {
    events_db.remove({"_id":req.body.eventID}, function(err, obj) {});
    res.send("1");
};

//API to like posts
module.exports.like_post = function(req, res) {
    //get post by post ID and increment likes
    post_its_db.findOneAndUpdate({"_id":req.body.postitID}, {$inc : {"likes" : 1}}, function(err, post_it_found) {
        //get user who posted the post and increment likes
        users_db.findOneAndUpdate({"_id":post_it_found.userID}, {$inc : {"likes" : 1}}, function(err, found) {
            res.send("1");
        });
    });
};

//API to get likes for a user
module.exports.get_likes = function(req, res) {
    //get likes with the session ID
    sessions_db.find({"_id":req.cookies.sessionID}, function(err, sessions_found) {
        if (sessions_found != undefined && sessions_found.length) {
            users_db.find({"_id":sessions_found[0].userID}, function(err, user_found) {
                res.send("Likes: " + user_found[0].likes);
            });
        }        
    });
};

//API to submit a new post it
module.exports.submit_post_it = function(req, res) {
    //check if fields are not empty
    for (key in req.body) {
        if (req.body[key] == "") {
            res.send("0Error: Please fill in all fields");
            return;
        }
    }

    //find user ID from session
    sessions_db.find({"_id":req.cookies.sessionID}, function(err, sessions_found) {
        if (sessions_found.length) {
            var content = req.body.post_it_content;

            //check if message contains profanity
            if (content.includes("fuck")) {
                content = "Hope you're all having a lovely day!";
            }

            //save data with the workspace ID
            var post_it = post_its_db({
                "workspaceID":req.cookies.workspaceID,
                "userID":sessions_found[0].userID,
                "postItContent":content,
                "anonymous":req.body.anonymous,
                "hide": req.body.hide,
                "likes": 0,
                "timestamp":Date.now()
            });

            post_it.save(function (err, new_post_it) {
                if (!err) {
                    res.send("1" + new_post_it._id);
                } else {
                    res.send("0Error: Database error");
                }
            });

        } else {
            res.send("0Error: Database error");
        }
    });
};

//API to get events 
module.exports.get_events = function(req, res) {
    //find user ID from session
    sessions_db.find({"_id":req.cookies.sessionID}, function(err, sessions_found) {
        if (sessions_found.length) {
            //match by workspace ID and project relevant data
            events_db.aggregate([
                { "$match": {"workspaceID": mongoose.Types.ObjectId(req.cookies.workspaceID)}},
                { "$lookup":
                    {
                        "from": "users",
                        "localField": "userID",
                        "foreignField" : "_id",
                        "as": "user"
                    }},
                { "$project": {
                    "_id" : 1,
                    "eventName" : 1,
                        "location": 1,
                        "userID" : 1,
                        "workspaceID" : 1,
                        "date" : 1,
                        "startTime" : 1,
                        "endTime" : 1,
                        "user.firstname" : 1,
                        "user.lastname" : 1
                }
                }],function(err, events_found) {
                    res.send(events_found);
                }

            );

        }
    });
};

//API to submit an event 
module.exports.submit_event = function(req, res) {
    //get the user ID from the session
    sessions_db.find({"_id":req.cookies.sessionID}, function(err, sessions_found) {
        if (sessions_found.length) {
            //save event with the workspace ID 
            var event =  events_db({
                "workspaceID":req.cookies.workspaceID,
                "userID":sessions_found[0].userID,
                "eventName": req.body.eventName,
                "location": req.body.location,
                "date": req.body.date,
                "startTime": req.body.startTime,
                "endTime": req.body.endTime
            });

            event.save(function (err, new_event) {
                if (!err) {
                    res.send("1" + new_event._id);
                } else {
                    res.send("0Error: Database error");
                }
            });

        } else {
            res.send("0Error: Database error");
        }
    });
};

//API to submit a new workspace
module.exports.submit_workspace = function(req, res) {
    //check if any field is empty
    for (key in req.body) {
        if (req.body[key] == "") {
            res.send("0Error: Please fill in all fields");
            return;
        }
    }

    //check that the workspace ID contains no spaces
    if (req.body.workspaceID.indexOf(" ") != -1) {
        res.send("0Error: Workspace ID contains spaces");
        return;
    }

    //check if the workspace exists
    workspace_db.find({"workspaceID":req.body.workspaceID}, function(err, work) {
        if (work.length == 0) {
            var workspace = new workspace_db({
                "workspaceID":req.body.workspaceID,
                "workspace_name":req.body.workspace_name
            });

            //save the workspace
            workspace.save(function (err, new_workspace) {
                if (!err) {
                    res.send("1" + new_workspace._id);
                }  else {
                    res.send("0Error: Database error");
                }
            });
        } else {
            res.send("0Error: Workspace already exists");
        }
    });

};

//API to authenticate the user
module.exports.log_in = function(req, res) {
    //find the user by email
    users_db.find({"email":req.body.email}, function(err, user_found) {
        if (user_found.length) {
            //compare the attempted hash with the stored hash
            if (bcrypt.compareSync(req.body.password, user_found[0].password)) {
                //create a new session 
                var session = new sessions_db({"userID":user_found[0]._id});
                session.save(function (err, new_session) {
                    workspace_users_db.find({"userID":user_found[0]._id}, function(err, workspaceID_found) {
                        //store session and first workspace in the user's cookie
                        res.cookie('workspaceID', workspaceID_found[0].workspaceID);
                        res.cookie('sessionID', new_session._id).send("1" + user_found[0]._id);
                    });
                });
            } else {
                res.send("0Error: Incorrect password");
            }
        } else {
            res.send("0Error: Email does not exist");
        }
    });
};

//API to get the user ID based on the session
module.exports.get_user_id = function(req, res) {
    sessions_db.find({"_id":req.cookies.sessionID}, function(err, sessions_found) {
        if (sessions_found.length) {
            res.send(sessions_found[0].userID);
        }
    });
}


//API to add a user to the workspace
module.exports.add_user = function(req, res) {
    var workspace_user = new workspace_users_db({
        "workspaceID":req.body.workspaceID,
        "userID":req.body.userID,
        "user_role":req.body.user_role
    });

    //find the workspace
    workspace_db.find({"_id":req.body.workspaceID}, function(err, work) {
        //check if the workspace exists
        if (work != undefined && work.length) {
            //check if the user is already in the workspace
            workspace_users_db.find({"userID":req.body.userID, "workspaceID":req.body.workspaceID}, function(err, workspaceID_found) {
                //if the user is not in the workspace, save the user and workspace in workspace users
                if (workspaceID_found.length == 0) {
                    workspace_user.save(function (err, new_workspace_user) {
                        if (!err) {
                            res.send("1");
                        } else {
                            res.send("0Error: Database error");
                        }
                    });
                }
            });
        }           
    });
};

//API to get the mongoDB oid of a workspace with a workspace ID
module.exports.get_workspace_id = function(req, res) {
    //find workspace by workspace ID
    workspace_db.find({"workspaceID":req.params.workspaceID}, function(err, work) {
        if (work.length) {
            res.send("1" + work[0]._id);
        } else {
            res.send("0" + "Error: Workspace does not exist");
        }
    });
}

//render sign up page
module.exports.signup = function(req, res){
    //check if user is logged in
    if (req.cookies.sessionID != undefined) {
        sessions_db.find({"_id":req.cookies.sessionID}, function(err, sessions_found) {
            if (sessions_found.length) {
                res.redirect('/board_page');
            } else {
                res.render('./pages/signup', { link: "/"});
            }
        });
    } else {
        res.render('./pages/signup', { link: "/"});
    }
};

//render the board page
module.exports.board_page = function(req, res){
    var is_admin = "false";
    //check if the user is logged in
    if (req.cookies.sessionID != undefined) {
        sessions_db.find({"_id":req.cookies.sessionID}, function(err, sessions_found) {
            if (sessions_found.length) {
                //if the user is logged in, find the workspace that the user is logged in to
                workspace_users_db.find({"userID":sessions_found[0].userID, "workspaceID":req.cookies.workspaceID}, function(err, workspaceID_found) {
                    //check if user is an admin
                    if(workspaceID_found[0].user_role == "admin"){
                        is_admin = "true";
                    }

                    //find the workspace name
                    workspace_db.find({"_id":workspaceID_found[0].workspaceID}, function(err, workspace_found) {
                        //render the board page
                        res.render('./pages/board_page', { log_out_link: "/", workspace_name: workspace_found[0].workspace_name.toUpperCase(), isAdmin:is_admin});
                    });
                });
            } else {
                res.redirect('/');
            }
        });
    } else {
        res.redirect('/');
    }
};

//logout of the account
module.exports.logout = function(req, res) {
    //remove the session from the database
    sessions_db.remove({"_id":req.cookies.sessionID}, function(err) {
        if (!err) {
            //clear the cookies
            res.clearCookie("sessionID");
            res.clearCookie("workspaceID")
            res.redirect("/");
        }
    });
}

//render the new room page
module.exports.create_room = function(req, res) {
  res.render('./pages/newroom');
};

//render the welcome page
module.exports.welcome = function(req, res) {
    //check if the user is logged in
    if (req.cookies.sessionID != undefined) {
        //find the user ID from the session
        sessions_db.find({"_id":req.cookies.sessionID}, function(err, sessions_found) {
            if (sessions_found.length) {
                users_db.find({"_id":sessions_found[0].userID}, function(err, users_found) {
                    //send the workspaces found to the welcome page
                    workspace_users_db.find({"userID":users_found[0]._id}, function(err, workspaces_found) {
                        res.render('./pages/welcome_page', {firstname:users_found[0].firstname.toUpperCase(), workspaces:workspaces_found});
                    });
                });
            }
        });
    } else {
        res.render('./pages/login', { forget_pwd_link: "/forget_pwd",
            signup_link: "/signup", newroom_link: "/newroom"});
    }
};

