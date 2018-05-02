const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller.js');

router.get('/', controller.login);

router.get('/forget_pwd', controller.forget_pwd);

router.get('/signup', controller.signup);

router.get('/board_page', controller.board_page);

router.get('/newroom', controller.create_room);

router.get('/bye', controller.sayGoodbye);

router.post('/submit_user', controller.submit_user);


module.exports = router;