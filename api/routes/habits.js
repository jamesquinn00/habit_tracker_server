const express = require('express');
const router = express.Router();
const habitsController = require('../controllers/habits');
const { verifyToken } = require('../middleware/auth');

router.get('/:userEmail', verifyToken, habitsController.findByEmail);
router.get('/leaderboard/:habitName', verifyToken, habitsController.leaderboard);
router.post('/:userEmail', verifyToken, habitsController.create);
router.put('/:id', verifyToken, habitsController.update);
router.delete('/:id', verifyToken, habitsController.destroy);

module.exports = router;