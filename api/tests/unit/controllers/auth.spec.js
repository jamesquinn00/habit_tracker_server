const authController = require('../../../controllers/auth');
const User = require('../../../models/user');

const mockSend = jest.fn();
const mockJson = jest.fn();
const mockStatus = jest.fn(code => ({ send: mockSend, json: mockJson }));
const mockRes = { status: mockStatus }

describe('auth controller', () => {
    beforeEach(() => jest.clearAllMocks());

    afterAll(() => jest.resetAllMocks());

    describe('login', () => {
        it('returns a token, success status, and status code 200', async () => {
            const testToken = {
                token: `Bearer ${process.env.TEST_TOKEN_SECRET}`
            }
            const spy = jest.spyOn(User, 'findByEmail');

            const mockReq = { body: { userEmail: "testUser1@email.com", password: "password" } }
            await authController.login(mockReq, mockRes);
            expect(spy).toHaveBeenCalled();
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith(testToken);
        });
    });

    describe('register', () => {
        it('returns a message and status code 201', async () => {
            const spy = jest.spyOn(User, 'create');

            const mockReq = { body: { userEmail: "testUser1@email.com", password: "password" } }
            await authController.register(mockReq, mockRes);
            expect(spy).toHaveBeenCalled();
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith({ msg: 'User created'});
        });
    });

    describe('token', () => {
        it('returns a new access token and status code 200', async() => {
            const spy = jest.spyOn(User, 'findByEmail');

            const mockReq = { body: {
                token: `Bearer ${process.env.TEST_TOKEN_SECRET}`
            }}
            
            await authController.token(mockReq, mockRes);
            expect(spy).toHaveBeenCalled();
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalled();
        });
    });

    describe('logout', () => {
        it('logs out the user and clears their refresh tokens', async () => {
            jest.spyOn(User, 'clearRefreshTokens')
                .mockResolvedValue([]);

            const mockReq = { body: {
                token: `Bearer ${process.env.TEST_TOKEN_SECRET}`
            }}

            await authController.logout(mockReq, mockRes);
            expect(mockStatus).toHaveBeenCalledWith(204);
        });
    });
});