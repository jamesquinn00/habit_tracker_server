const express = require('express');
const router = express.Router();
const habitsController = require('../controllers/habits');

router.get('/:userEmail', habitsController.findByEmail);
router.get('/:habitName', habitsController.leaderboard);
router.post('/:userEmail', habitsController.create);
router.put('/:userEmail/:id', habitsController.update);
router.delete('/:userEmail/:id', habitsController.destroy);

module.exports = router;