/**
 * Created by Happy Vibes Co. for INFO30005 Sem1 2018
 */

const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller.js');

// login page
router.get('/', controller.login);

// signup page
router.get('/signup', controller.signup);

// board page
router.get('/board_page', controller.board_page);

// create new room page
router.get('/newroom', controller.create_room);

// submit user
router.post('/submit_user', controller.submit_user);

// submit workspaces
router.post('/submit_workspace', controller.submit_workspace);

// add user
router.post('/add_user', controller.add_user);

// submit log in
router.post('/log_in', controller.log_in);

// submit post it
router.post('/submit_post_it', controller.submit_post_it);

// submist events
router.post('/submit_event', controller.submit_event);

// get workspace id from database
router.get('/get_workspace_id/:workspaceID', controller.get_workspace_id);

// logout page
router.get('/logout', controller.logout);

// get posts from database
router.get('/get_post_its', controller.get_post_its);

// get events from database
router.get('/get_events', controller.get_events);

// welcome page
router.get('/welcome', controller.welcome);

// get workspaces from database
router.get('/get_workspaces', controller.get_workspaces);

// get user name from database
router.get('/get_user_name/:userID', controller.get_user_name);

// delete posts from database
router.post('/delete_post_it', controller.delete_post_it);

// change workspace cookie
router.post('/change_workspace_cookie', controller.change_workspace_cookie);

// submit likes to posts
router.post('/like_post', controller.like_post);

// get likes from database
router.get('/get_likes', controller.get_likes);

// get user id from database
router.get('/get_user_id', controller.get_user_id);

// delete events from database
router.post('/delete_event', controller.delete_event);

// server routes
module.exports = router;