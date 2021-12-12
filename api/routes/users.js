const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users');

router.get('/:userEmail', usersController.show);
router.put('/:userEmail', usersController.update);

module.exports = router;