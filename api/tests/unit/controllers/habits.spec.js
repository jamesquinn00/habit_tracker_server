const habitsController = require('../../../controllers/habits');
const Habit = require('../../../models/habit');

const mockSend = jest.fn();
const mockJson = jest.fn();
const mockStatus = jest.fn(code => ({ send: mockSend, json: mockJson }));
const mockRes = { status: mockStatus }

const testHabit = {
    id: 5,
    userEmail: "testUser3@email.com",
    userName: "test user 3",
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

    describe('findByEmail',() => {
        it('returns habit with appropriate email as well as a 200 success code',async()=>{
            const mockReq = { 
                params: { userEmail: "testUser1@email.com" },
            }
            
            jest.spyOn(Habit, 'findByEmail')
                .mockResolvedValue(testHabit);
            

            await habitsController.findByEmail(mockReq, mockRes);
            expect(mockJson).toHaveBeenCalledWith(testHabit);
            expect(mockStatus).toHaveBeenCalledWith(200);
        });
    });

    describe('leaderboard', () => {
        it('returns a list containing top streaks and user names with 200 status code', async () => {
            const leaderboard = [
                { userName: "test user 1", topStreak: 16 },
                { userName: "test user 2", topStreak: 11 },
                { userName: "test user 3", topStreak: 9 }
            ];
            
            jest.spyOn(Habit, 'leaderboard')
                .mockResolvedValue(leaderboard);

            const mockReq = { params: { habitName: "Water" } }
            await habitsController.leaderboard(mockReq, mockRes);
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith(leaderboard);
        });
    });

    describe('create', () => {
        it('returns a new habit for a user with a 201 status code',  async () => {
            jest.spyOn(Habit, 'create')
                .mockResolvedValue(expect.objectContaining(testHabit));

            const mockReq = { 
                body: {
                    userName: "test user 1",
                    habitName: "Read",
                    frequency: 1,
                    unit: "hour",
                    amount: 1
                },
                params: {
                    userEmail: "testUser1@email.com"
                }
            }
            await habitsController.create(mockReq, mockRes);
            expect(mockStatus).toHaveBeenCalledWith(201);
            expect(mockJson).toHaveBeenCalledWith(testHabit);
        });
    });

    describe('update', () => {
        it('returns an updated custom habit for a user with a 201 status code', async () => {
            const updatedHabit = {
                id: 5,
                habitName: "Reading",
                frequency: 1,
                unit: "minutes",
                amount: [{ expected: 30 }, { current: 0 }],
                streak: [{ top: 0 }, { current: 0 }],
                lastLog: "2021-12-11T11:31:21.988Z"
            }
            
            jest.spyOn(Habit, 'update')
                .mockResolvedValue(updatedHabit);
            
            const mockReq = { 
                params: { userEmail: "testUser1@email.com", id: 5 },
                body: { newHabitName: "Reading", unit: "minutes", expectedAmount: 30 }
            }
            await habitsController.update(mockReq, mockRes);
            expect(mockStatus).toHaveBeenCalledWith(201);
            expect(mockJson).toHaveBeenCalledWith(updatedHabit);
        });
    });

    describe('destroy', () => {
        it('returns a 204 status code on successful deletion', async () => {
            jest.spyOn(Habit, 'destroy')
                .mockResolvedValue('Habit 1 deleted');
            
            const mockReq = { params: { id: 1 } }
            await habitsController.destroy(mockReq, mockRes);
            expect(mockStatus).toHaveBeenCalledWith(204);
        });
    });
});