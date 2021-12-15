const Habit = require('../models/habit')


async function findByEmail(req, res) {
    try {
        const habits = await Habit.findByEmail(req.params.userEmail);
        res.status(200).json(habits);
    } catch (err) {
        res.status(404).send(err);
    }
}

async function leaderboard(req, res) {
    try {
        const leaderboard = await Habit.leaderboard(req.params.habitName);
        res.status(200).json(leaderboard);
    } catch (err) {
        res.status(404).send(err);
    }
}

async function create(req, res) {
    try {
        const data = {
            userEmail: req.params.userEmail,
            ...req.body
        }
        const habit = await Habit.create(data);
        res.status(201).json(habit);
    } catch (err) {
        res.status(422).send(err);
    }
}

async function update(req, res) {
    try {
        const habit = await Habit.update(req.params.id, req.body);
        res.status(201).json(habit);
    } catch (err) {
        res.status(422).send(err);
    }
}

async function destroy(req, res) {
    try {
        const result = await Habit.destroy(req.params.id);
        res.status(204).json(result);
    } catch (err) {
        res.status(404).send(err);
    }
}

module.exports = { findByEmail, leaderboard, create, update, destroy,update}