const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller.js');

router.get('/', controller.login);

router.get('/bye', controller.sayGoodbye);


module.exports = router;