/**
 * Created by Happy Vibes Co. for INFO30005 Sem1 2018
 */
var mongoose = require('mongoose');

mongoose.connect('mongodb://happyuser:happyvibes@ds159033.mlab.com:59033/happyvibes', function(err) {
    if (!err) {
        console.log('Connected');
    } else {
        console.log('Failed to connect');
    }
});

require('./users.js');
require('./workspaces.js');
require('./workspace_users.js');
require('./sessions.js');
require('./post_its.js');
require('./events.js');