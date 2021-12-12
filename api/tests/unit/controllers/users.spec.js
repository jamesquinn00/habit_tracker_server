const usersController = require('../../../controllers/users');
const User = require('../../../models/user');

const mockSend = jest.fn();
const mockJson = jest.fn();
const mockStatus = jest.fn(code => ({ send: mockSend, json: mockJson }));
const mockRes = { status: mockStatus }

const testUser = new User({ 
    userEmail: "testUser1@email.com",
    passwordDigest: "password",
    refreshTokens: [],
    userName: "test user 1",
    habits: [
        {
            habitName: "Water",
            frequency: 1,
            unit: "cups",
            amount: [{ expected: 8 }, { current: 0 }],
            streak: [{ top: 5 }, { current: 3 }],
            lastLog: "2021-12-11T11:31:21.988Z"
        }
    ]
})

describe('users controller', () => {
    beforeEach(() => jest.clearAllMocks());

    afterAll(() => jest.resetAllMocks());

    describe('show', () => {
        it('returns a user document with a 200 status code', async () => {
            jest.spyOn(User, 'findByEmail')
                .mockResolvedValue(testUser);
            
            const mockReq = { params: { userEmail: "testUser1@email.com" } }
            await usersController.show(mockReq, mockRes);
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith(testUser);
        });
    });

    describe('create', () => {
        it('creates a new user with a 201 status code', async () => {
            jest.spyOn(User, 'create')
                .mockResolvedValue(testUser);

            const mockReq = { body: {
                userEmail: "testUser1@email.com",
                password: "password",
                userName: "test user 1"
            }}

            await usersController.create(mockReq, mockRes);
            expect(mockStatus).toHaveBeenCalledWith(201);
            expect(mockJson).toHaveBeenCalledWith(testUser);
        });
    });

    describe('update', () => {
        it("updates a user's streaks (or currentAmount) in a batch with a 201 status code", async () => {
            let testUpdate = [
                {
                    habitName: "Water",
                    amount: 8
                }
            ];
            // edit test user to account for update
            testUser.habits[0].amount[1].current = 8;
            jest.spyOn(User, 'update')
                .mockResolvedValue(testUser);

            const mockReq = { params: { userEmail: "testUser1@email.com", body: testUpdate } }
            await usersController.update(mockReq, mockRes);
            expect(mockStatus).toHaveBeenCalledWith(201);
            expect(mockJson).toHaveBeenCalledWith(testUser);
        });
    });
});