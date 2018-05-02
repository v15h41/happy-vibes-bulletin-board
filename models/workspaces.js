var mongoose = require('mongoose');
var workspace_schema = mongoose.Schema(
    {
        "workspaceID":String,
        "workspaceName":String
    }
);

mongoose.model('workspaces_sch', workspace_schema);