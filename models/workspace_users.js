/**
 * Created by Happy Vibes Co. for INFO30005 Sem1 2018
 */

var mongoose = require('mongoose');
var workspace_users_schema = mongoose.Schema(
    {
        "workspaceID":String,
        "userID":String,
        "user_role":String
    }
);

mongoose.model('workspace_users', workspace_users_schema);
