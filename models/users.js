/**
 * Created by Happy Vibes Co. for INFO30005 Sem1 2018
 */

var mongoose = require('mongoose');
var user_schema = mongoose.Schema(
    {
        "firstname":String,
        "lastname":String,
        "email":String,
        "password":String,
        "likes":Number
    }
);
mongoose.model('users', user_schema);