const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller');

router.get('/', controller.comingSoon);

router.get('/bye', controller.sayGoodbye);


module.exports = router;