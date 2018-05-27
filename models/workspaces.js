/**
 * Created by Happy Vibes Co. for INFO30005 Sem1 2018
 */

var mongoose = require('mongoose');
var workspace_schema = mongoose.Schema(
    {
        "workspaceID":String,
        "workspace_name":String
    }
);

mongoose.model('workspaces', workspace_schema);