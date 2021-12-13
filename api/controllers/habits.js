const Habit = require('../models/habit')

async function leaderboard(req, res) {
    try {
        
        res.status(200).json([]);
    } catch (err) {
        res.status(500).send(err);
    }
}

async function create(req, res) {
    try {
        const habit = await Habit.create(req.body);
        res.status(201).json(habit);
    } catch (err) {
        res.status(422).send(err);
    }
}

async function update(req, res) {
    try {
        res.status(200).json([]);
    } catch (err) {
        res.status(204).send(err);
    }
}

async function destroy(req, res) {
    try {
        res.status(204).json([]);
    } catch (err) {
        res.status(404).send(err);
    }
}

module.exports = { leaderboard, create, edit, incrementStreak, destroy}