const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller.js');

router.get('/', controller.login);

router.get('/forget_pwd', controller.forget_pwd);

router.get('/signup', controller.signup);

router.get('/board_page', controller.board_page);

router.get('/bye', controller.sayGoodbye);


module.exports = router;