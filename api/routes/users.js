const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users');

router.get('/:email', usersController.show);
router.get('/', usersController.index);

module.exports = router;