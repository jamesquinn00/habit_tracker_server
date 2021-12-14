const Habit = require('../../../models/habit');
const { initConnection } = require('../../../dbConfig');
jest.mock('mongodb');

describe('Habit', () => {
    let connection;
    let db;

    beforeAll(async () => {
        connection = await initConnection();
        db = connection.db(process.env.DB_NAME);
    });

    afterAll(async () => {
        await connection.close();
    });

    beforeEach(async () => {
        await resetTestDB();
    });

    describe('findByEmail', () => {
        it('resolves with the habits for a given user upon successful db query', async () => {
            const habits = await Habit.findByEmail('testUser1@email.com');
            expect(habits[0]).toEqual(objectContaining({
                "userEmail": "testUser1@email.com",
                "habitName": "Water",
                "frequency": 1,
                "unit": "cups",
                "amount": { "expected": 8 ,  "current": 0 },
                "streak": { "top": 5, "current": 3 },
                "lastLog": "2021-12-11T11:31:21.988Z"
            }));  
            expect(habits[0]).toHaveProperty('id');
        });
    });

    describe('leaderboard', () => {
        it('resolves with an ordered leaderboard of top streaks and user names upon successful db query', async () => {
            const leaderboard = await Habit.leaderboard('Water');
            expect(leaderboard).toEqual([
                { userName: "test user 2", topStreak: 7 },
                { userName: "test user 1", topStreak: 5 }
            ]);
        });

        it('resolves with an error message when an invalid habitName is passed in', async () => {
            const leaderboard = await Habit.leaderboard('InvalidHabit');
            expect(leaderboard).toEqual("Error getting leaderboard");
        });
    });

    describe('create', () => {
        it('resolves with a new habit for an existing user', async () => {
            const data = {
                userEmail: "testUser1@email.com",
                habitName: "Read",
                frequency: 1,
                unit: "minutes",
                amount: 30
            }

            const newHabit = await Habit.create(data);
            expect(newHabit).toEqual(objectContaining({
                "userEmail": "testUser1@email.com",
                "habitName": "Read",
                "frequency": 1,
                "unit": "minutes",
                "amount": { "expected": 30, "current": 0 },
                "streak": { "top": 0, "current": 0 },
                "lastLog": null
            })); 
        });

        it('rejects if a habit with that name already exists for that user', async () => {
            const data = {
                userEmail: "testUser1@email.com",
                habitName: "Water",
                frequency: 1,
                unit: "cups",
                amount: 8
            }
            const result = await Habit.create(data);
            expect(result).toEqual('Habit already exists');
        });
    });

    describe('findById', () => {
        it('resolves with a habit on successful db query', async () => {
            const habit = await Habit.findById('1');
            expect(habit).toBeInstanceOf(Habit);
        });
    });

    describe('update', () => {
        it('resolves with an updated habit on successful db query', async () => {
            const data = {
                id: 2,
                userEmail:  "testUser2@email.com",
                habitName: "Walk the Dog",
                newHabitName: "Walk Dog",
                unit: "minutes",
                expectedAmount: 60
            }

            const updatedHabit = await Habit.update(data);
            expect(updatedHabit).toEqual(objectContaining({
                "habitName": "Walk Dog",
                "frequency": 1,
                "unit": "minutes",
                "amount": { "expected": 60, "current": 1 },
                "streak": { "top": 10 , "current": 10 },
            }));
        });

        it('resolves with an error when trying to change habit name to a default habit', async () => {
            const data = {
                userEmail:  "testUser2@email.com",
                habitName: "Walk the Dog",
                newHabitName: "Water",
                unit: "minutes",
                expectedAmount: 60
            }

            const updatedHabit = await Habit.edit(data);
            expect(updatedHabit).toEqual('Cannot change name of a custom habit');
        });
    });

    describe('delete', () => {
        it('resolves with a message on successful db query', async () => {
            // create a custom habit to delete
            const data = {
                userEmail: "testUser1@email.com",
                habitName: "Read",
                frequency: 1,
                unit: "minutes",
                expectedAmount: 30
            }

            const updatedHabit = await Habit.create(data);
            expect(updatedHabit).toEqual(objectContaining({
                "habitName": "Read",
                "frequency": 1,
                "unit": "minutes",
                "amount": { "expected": 30, "current": 0 },
                "streak": { "top": 0,  "current": 0 }
            })); 
            
            data = {
                userEmail: "testUser1@email.com",
                habitName: "Read"
            }
            const result = await Habit.delete(data);
            expect(result.deletedCount).toBe(1);
        });
    });
});