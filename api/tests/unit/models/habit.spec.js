const Habit = require('../../../models/habit');
const User = require('../../../models/user');

describe('Habit', () => {
    let api;

    beforeEach(async () => {
        await resetTestDB();
    });

    beforeAll(async () => {
        api = app.listen(5000, () => console.log('Test server running on port 5000'));
    });

    afterAll(async () => {
        console.log('Gracefully stopping test server');
        api.close(done);
    });

    describe('index', () => {
        it('resolves with an ordered leaderboard of top streaks and user names upon successful db query', async () => {
            const leaderboard = await Habit.index('Water');
            expect(leaderboard).toEqual([
                { userName: "test user 2", topStreak: 7 },
                { userName: "test user 1", topStreak: 5 }
            ]);
        });

        it('resolves with an error message when an invalid habitName is passed in', async () => {
            const leaderboard = await Habit.index('InvalidHabit');
            expect(leaderboard).toEqual("Couldn't find habit");
        });
    });

    describe('create', () => {
        it('resolves with a new habit for an existing user', async () => {
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
                "amount": [{ "expected": 30 }, { "current": 0 }],
                "streak": [{ "top": 0 }, { "current": 0 }]
            })); 
        });
    });

    describe('edit', () => {
        it('resolves with an updated habit on successful db query', async () => {
            const data = {
                userEmail:  "testUser2@email.com",
                habitName: "Walk the Dog",
                newHabitName: "Walk Dog",
                unit: "minutes",
                expectedAmount: 60
            }

            const updatedHabit = await Habit.edit(data);
            expect(updatedHabit).toEqual(objectContaining({
                "habitName": "Walk Dog",
                "frequency": 1,
                "unit": "minutes",
                "amount": [{ "expected": 60 }, { "current": 1 }],
                "streak": [{ "top": 10 }, { "current": 10 }],
            }));
        });

        it('resolves with an error when trying to change habit name to one that already exists, or a default habit', async () => {
            const data = {
                userEmail:  "testUser2@email.com",
                habitName: "Walk the Dog",
                newHabitName: "Water",
                unit: "minutes",
                expectedAmount: 60
            }

            const updatedHabit = await Habit.edit(data);
            expect(updatedHabit).toEqual('Habit already exists');
        });
    });

    describe('incrementStreak', () => {
        it('resolves with an updated "streak" value on successful db query', async () => {
            const data = {
                userEmail: "testUser1@email.com",
                habitName: "Water"
            }
            await Habit.incrementStreak(userEmail, habitName);
            const updatedUser = await User.findByEmail(userEmail);
            expect(updatedUser.habits[0].streak[1]).toEqual(4);
        });

        it('resolves with updated streak.top & streak.current on successful db query', async () => {
            const data = {
                userEmail: "testUser2@email.com",
                habitName: "Walk the Dog"
            }
            await Habit.incrementStreak(userEmail, habitName);
            const updatedUser = await User.findByEmail(userEmail);
            expect(updatedUser.habits[0].streak[0]).toEqual(11);
            expect(updatedUser.habits[0].streak[1]).toEqual(11);
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
                "amount": [{ "expected": 30 }, { "current": 0 }],
                "streak": [{ "top": 0 }, { "current": 0 }]
            })); 
            
            data = {
                userEmail: "testUser1@email.com",
                habitName: "Read"
            }
            const result = await Habit.delete(data);
            expect(result).toBe('Habit "Read" for "testUser1@email.com" was deleted');
        });
    });
});