var mongoose = require('mongoose');
var post_its = mongoose.Schema(
    {
        "workspaceID":mongoose.Schema.Types.ObjectId,
        "userID":mongoose.Schema.Types.ObjectId,
        "postItContent":String,
        "anonymous":String,
        "timestamp":Number, 
        "likes":Number
    }
);
mongoose.model('post_its', post_its);