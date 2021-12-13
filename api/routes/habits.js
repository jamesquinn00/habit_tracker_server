const express = require('express');
const router = express.Router();
const habitsController = require('../controllers/habits');

router.get('/:habitName', habitsController.leaderboard);
router.post('/:userEmail', habitsController.create);
router.put('/:userEmail/:habitName', habitsController.edit);
router.put('/:userEmail/:habitName/streak', habitsController.incrementStreak);
router.delete('/:userEmail/:habitName', habitsController.destroy);

module.exports = router;