const { initDB } = require('../dbConfig');
const { ObjectId } = require('bson');
const defaultHabits = require('../data/defaultHabits');

module.exports = class Habit {
    constructor(data){
        this.id = data.id,
        this.userEmail = data.userEmail,
        this.habitName = data.habitName;
        this.frequency = data.frequency;
        this.unit = data.unit;
        this.amount = data.amount;
        this.streak = data.streak;
        this.lastLog = data.lastLog
    };

    /**
     * Get a list of habits for a single user.
     * 
     * @param {The email of the user to retrieve the habits for} userEmail 
     * @returns A list of habits for a single user.
     */
    static findByEmail(userEmail) {
        return new Promise(async (resolve, reject) => {
            try {
                const db = await initDB;
                const habitData = await db.collect('Habits').find({ userEmail }).toArray();
                const habit = habitData.map(data => {
                    new Habit({ ...data, id: data._id });
                });
                resolve(habit);
            } catch (err) {
                reject(`Habit couldn't be found for ${userEmail}`);
            }
        });
    }
    
    /**
     * Get the user names and top streaks in descending order for a given habit.
     * 
     * @param {The habit name for which to retrieve the leaderboard for} habitName 
     * @returns A list of objects containing { userName, topStreak } for the given habit.
     */
    static leaderboard(habitName){
        return new Promise (async (resolve, reject) => {
            try {
                const db = await initDB();
                const habitData = await db.collection("habits").aggregate(
                    { $match: { habitName } },
                    { $sort: { "streak.top": -1 } },
                    { $project: { userName: 1, "streak.top": 1, _id: 0 } }
                );
                // create a list from the data
                const leaderboard = habitData.rows.map(habitData => { 
                    return {
                        userName: habitData.userName,
                        topStreak: habitData.topStreak
                    }
                });
                resolve (leaderboard);
            } catch (err) {
                reject('Error getting leaderboard');
            }
        });
    };

    /**
     * Create a new habit in the database.
     * 
     * @param {The data from which to create a new habit, includes: 
     *         userEmail, habitName, frequency, unit, and amount} data 
     * @returns The created Habit object.
     */
    static create(data){
        return new Promise (async (resolve, reject) => {
            try {
                const { userEmail, habitName, frequency, unit, amount } = data;

                newHabit = {
                    userEmail: userEmail,
                    habitName: habitName,
                    frequency: frequency,
                    unit: unit,
                    amount: [{ expected: amount}, { current: 0 }],
                    streak: [{ top: 0 }, { current: 0 }],
                    lastLog: null
                }

                const db = await initDB();
                let habitData = await db.collection("users").insertOne({ ...newHabit });
                let habit = this.findById(habitData.insertedId);
                resolve (habit);
            } catch (err) {
                reject('Error creating habit');
            }
        });
    };

    /**
     * Find a habit of a given ID.
     * 
     * @param {The string id of the habit to find} id 
     * @returns The found Habit object.
     */
    static findById(id) {
        return new Promise (async (resolve, reject) => {
            try {
                const db = await initDB();
                const habitData = await db.collection('habits').find({ _id: ObjectId(id) }).toArray();
                const habit = new Habit({ ...habitData[0], id: habitData[0]._id.toString()});
                resolve(habit);
            } catch (err) {
                reject('Error finding habit by ID');
            }
        })
    }

    /**
     * Updates a habit with the attributes passed in. Can be used to 
     * increment the streak or to edit the habit's values.
     * 
     * @param {The new data to update the habit with} data 
     * @returns The updated Habit object.
     */
    static update(data) {
        return new Promise (async (resolve, reject) => {
            try {
                // throw error if new habit name is already a default habit
                if (defaultHabits.contains(data.newHabitName)) throw new Error("Cannot change name of a custom habit");
                
                const db = await initDB();
                const updatedHabitData = await db.collection('habits').findOneAndUpdate(
                    { _id: data.id, userEmail: data.userEmail },
                    { $set: { ...data } },
                    { returnDocument: 'after' }
                    );
                const updatedData = updatedHabitData.value;
                const updatedHabit = new Habit({ ...updatedData, id: ObjectId(updatedData.id) });
                resolve(updatedHabit);
            } catch (err) {
                reject('Error updating habit');
            }
        });
    }

    /**
     * Deletes the habit of the given id.
     * 
     * @param {The_id of the Habit to delete} data 
     * @returns An object containing the attributes "acknowledges" (bool) and "deletedCount" (int)
     */
    static destroy(id) {
        return new Promise(async (resolve, reject) => {
            try {
                const db = await initDB();
                const result = db.collection('habits').deleteOne({ _id: ObjectId(id) });
                resolve(result);
            } catch (err) {
                reject('Error deleting habit');
            }
        });
    }
}

module.exports = Habit;