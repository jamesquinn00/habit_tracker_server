const authController = require('../../../controllers/auth');

const mockSend = jest.fn();
const mockJson = jest.fn();
const mockStatus = jest.fn(code => ({ send: mockSend, json: mockJson }));
const mockRes = { status: mockStatus }

describe('auth controller', () => {
    beforeEach(() => jest.clearAllMocks());

    afterAll(() => jest.resetAllMocks());

    describe('login', () => {
        it('returns a token, success status, and status code 200', async () => {
            testToken = {
                success: true,
                token: "Bearer c4471869d40cad474e66dc88e5806e3dd454644ca24996dbbdb0350d007c4dfbcfbd35e83b3b4fbc5ebec8532f0a84a5ea414be82fa0b848162f9c718e932cf3"
            }
            jest.spyOn(User, 'findByEmail');

            const mockReq = { body: { userEmail: "testUser1@email.com", password: "password" } }
            await authController.login(mockReq, mockRes);
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith(testToken);
        });
    });

    describe('register', () => {
        it('returns a message and status code 201', async () => {
            jest.spyOn(User, 'create');

            const mockReq = { body: { userEmail: "testUser1@email.com", password: "password" } }
            await authController.register(mockReq, mockRes);
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith({ msg: 'User created'});
        });
    })
});