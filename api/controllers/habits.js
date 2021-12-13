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
        res.status(200).json([]);
    } catch (err) {
        res.status(500).send(err);
    }
}

async function edit(req, res) {
    try {
        res.status(200).json([]);
    } catch (err) {
        res.status(500).send(err);
    }
}

async function incrementStreak(req, res) {
    try {
        res.status(200).json([]);
    } catch (err) {
        res.status(500).send(err);
    }
}

async function destroy(req, res) {
    try {
        res.status(200).json([]);
    } catch (err) {
        res.status(500).send(err);
    }
}

module.exports = { leaderboard, create, edit, incrementStreak, destroy}