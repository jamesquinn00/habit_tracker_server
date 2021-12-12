const User = require('../../../models/user');
const Habit = require('../../../models/habit');

describe('User', () => {
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

    describe('findByEmail', () => {
        it('resolves with a user on successful db query', async () => {
            const user = await User.findByEmail("testUser1@email.com");
            expect(user).toBeInstanceOf(User);
        })

        it('resolves with an error when passed an invalid email', async () => {
            const result = await User.findByEmail("invalid@email.com");
            expect(result).toBe("Invalid user email");
        });
    });

    describe('update', () => {
        it('resolves with updated user on successful db query', async() => {
            const user = await User.update([
                { habitName: "Water", amount: 8 }
            ]);
            expect(user).toBeInstanceOf(User);
            expect(user.habits[0]).toEqual(objectContaining({
                "habitName": "Water",
                "frequency": 1,
                "unit": "cups",
                "amount": [{ "expected": 8 }, { "current": 8 }],
                "streak": [{ top: 5 }, { current: 4 }],
            }));
        });
    });
});