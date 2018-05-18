var mongoose = require('mongoose');
var events = mongoose.Schema(
    {
        "workspaceID":mongoose.Schema.Types.ObjectId,
        "userID":mongoose.Schema.Types.ObjectId,
        "eventName":String,
        "location":String,
        "date": String,
        "startTime": String,
        "endTime": String
    }
);
mongoose.model('events', events);