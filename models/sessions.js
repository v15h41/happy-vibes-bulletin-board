/**
 * Created by Happy Vibes Co. for INFO30005 Sem1 2018
 */

var mongoose = require('mongoose');
var sessions = mongoose.Schema(
    {
        "userID":String
    }
);
mongoose.model('sessions', sessions);