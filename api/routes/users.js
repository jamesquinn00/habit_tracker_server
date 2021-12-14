const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users');

router.get('/:userEmail', usersController.show);
router.get('/', usersController.index);

module.exports = router;