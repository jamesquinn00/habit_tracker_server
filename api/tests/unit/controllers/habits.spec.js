const habitsController = require('../../../controllers/habits');
const Habit = require('../../../models/habit');

const mockSend = jest.fn();
const mockJson = jest.fn();
const mockStatus = jest.fn(code => ({ send: mockSend, json: mockJson }));
const mockRes = { status: mockStatus }

const testHabit = {
    habitName: "Read",
    frequency: 1,
    unit: "hour",
    amount: [{ expected: 1 }, { current: 0 }],
    streak: [{ top: 0 }, { current: 0 }],
    lastLog: "2021-12-11T11:31:21.988Z"
}

describe('habits controller', () => {
    beforeEach(() => jest.clearAllMocks());

    afterAll(() => jest.resetAllMocks());

    describe('index', () => {
        it('returns a list containing top streaks and user names with 200 status code', async () => {
            const leaderboard = [
                { userName: "test user 1", topStreak: 16 },
                { userName: "test user 2", topStreak: 11 },
                { userName: "test user 3", topStreak: 9 }
            ];
            
            jest.spyOn(Habit, 'getLeaderboard')
                .mockResolvedValue(leaderboard);

            const mockReq = { params: { habitName: "Water" } }
            await habitsController.index(mockReq, mockRes);
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith(leaderboard);
        });
    });

    describe('create', () => {
        it('returns a new habit for a user with a 201 status code',  async () => {
            jest.spyOn(Habit, 'create')
                .mockResolvedValue(expect.objectContaining({
                    "habitName": "Read",
                    "frequency": 1,
                    "unit": "hour",
                    "amount": [{ "expected": 1 }, { "current": 0 }],
                    "streak": [{ "top": 0 }, { "current": 0 }]
                }));

            const mockReq = { body: {
                habitName: "Read",
                frequency: 1,
                unit: "hour",
                expectedAmount: 1
            }}
            await habitsController.createHabit(mockReq, mockRes);
            expect(mockStatus).toHaveBeenCalledWith(201);
            expect(mockJson).toHaveBeenCalledWith(expect.objectContaining({
                "habitName": "Read",
                "frequency": 1,
                "unit": "hour",
                "amount": [{ "expected": 1 }, { "current": 0 }],
                "streak": [{ "top": 0 }, { "current": 0 }]
            }));
        });
    });

    describe('edit', () => {
        it('returns an updated custom habit for a user with a 201 status code', async () => {
            const updatedHabit = {
                habitName: "Read",
                frequency: 1,
                unit: "minutes",
                amount: [{ expected: 30 }, { current: 0 }],
                streak: [{ top: 0 }, { current: 0 }],
                lastLog: "2021-12-11T11:31:21.988Z"
            }
            
            jest.spyOn(Habit, 'edit')
                .mockResolvedValue(updatedHabit);
            
            const mockReq = { 
                params: { userEmail: "testUser1@email.com", habitName: "Read" },
                body: { unit: "minutes", expectedAmount: 30 }
            }
            await habitsController.edit(mockReq, mockRes);
            expect(mockStatus).toHaveBeenCalledWith(201);
            expect(mockJson).toHaveBeenCalledWith(updatedHabit);
        });
    });

    describe('incrementStreak', () => {
        it('returns an updated habit with an altered "streak" value and status code 201', async () => {
            jest.spyOn(Habit, 'incrementStreak')
                .mockResolvedValue(expect.objectContaining({
                    "habitName": "Read",
                    "frequency": 1,
                    "unit": "hour",
                    "amount": [{ "expected": 1 }, { "current": 0 }],
                    "streak": [{ "top": 1 }, { "current": 1 }]
                }));

            const mockReq = { params: {
                userEmail: "testUser1@email.com",
                habitName: "Water"
            }}

            await habitsController.incrementStreak(mockReq, mockRes);
            expect(mockStatus).toHaveBeenCalledWith(201);
            expect(mockJson).toHaveBeenCalledWith(expect.objectContaining({
                "habitName": "Read",
                "frequency": 1,
                "unit": "hour",
                "amount": [{ "expected": 1 }, { "current": 0 }],
                "streak": [{ "top": 1 }, { "current": 1 }]
            }));
        });
    });

    describe('delete', () => {
        it('returns a 204 status code on successful deletion', async () => {
            jest.spyOn(Habit, 'delete')
                .mockResolvedValue('Deleted');
            
            const mockReq = { params: {
                userEmail: "testUser1@email.com",
                habitName: "Water"
            }}
            await habitsController.delete(mockReq, mockRes);
            expect(mockStatus).toHaveBeenCalledWith(204);
        });
    });
});