const usersController = require('../../../controllers/users');
const User = require('../../../models/user');

const mockSend = jest.fn();
const mockJson = jest.fn();
const mockStatus = jest.fn(code => ({ send: mockSend, json: mockJson }));
const mockRes = { status: mockStatus }

const testUser = new User({ 
    id: 1,
    userEmail: "testUser1@email.com",
    passwordDigest: "password",
    refreshTokens: [],
    userName: "test user 1",
});
const testUserTwo = new User({ 
    id: 2,
    userEmail: "testUser2@email.com",
    passwordDigest: "password",
    refreshTokens: [],
    userName: "test user 2",
});

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

    describe('index', () => {
        it('returns all users with a 200 status code', async () => {
            jest.spyOn(User, 'all', 'get')
                .mockResolvedValue([testUser,testUserTwo]);
            await usersController.index(null, mockRes);
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith([testUser,testUserTwo]);
        })
    });
});