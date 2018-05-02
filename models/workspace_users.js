var mongoose = require('mongoose');
var workspace_users_schema = mongoose.Schema(
    {
        "workspaceID":String,
        "userID":String,
        "user_role":String
    }
);

mongoose.model('workspaces', workspace_users_schema);
