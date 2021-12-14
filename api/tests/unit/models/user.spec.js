const User = require('../../../models/user');
const { initConnection } = require('../../../dbConfig');
jest.mock('mongodb');

describe('User', () => {
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

    // beforeEach(() => jest.clearAllMocks())

    // afterAll(() => jest.resetAllMocks())

    // get test??
    describe('all', () => {
        it('should resolve with all users on successful db query', async () => {
            // ??
        })
    })

    describe('findByEmail', () => {
        it('should resolve with a user on successful db query', async () => {
            const userData = new User({ 
                id: 1,
                userEmail: "testUser1@email.com",
                passwordDigest: "password",
                refreshTokens: [],
                userName: "test user 1",
            });
            const user = await User.findByEmail("testUser1@email.com");
            expect(user).toEqual(userData);
            expect(user).toBeInstanceOf(User);
        });
    });

    describe('create', () => {
        it('resolves with a new user on successful db query', async () => {
            const data = {
                userEmail: "testUser4@email.com",
                password: "password",
                userName: "test user 4"
            }

            const user = await User.create(data);
            const users = await User.all;
            expect(user).toHaveProperty('id');
            expect(user).toHaveProperty('userEmail');
            expect(user).toHaveProperty('passwordDigest');
            expect(user).toHaveProperty('refreshTokens');
            expect(user).toHaveProperty('userName');
            expect(users.all.length).toEqual(4);
        });
    });

    describe('clearRefreshTokens', () => {
        it("resolves with expired refresh tokens being removed from a user's data", async () => {
            const result = await User.clearRefreshTokens("testUser1@email.com", 123);
            expect(result).toEqual(objectContaining({"refreshTokens": []}));
        });
    });

    describe('pushToken', () => {
        it('resolves with a new refresh token being pushed onto the array', async () => {
            const result = await User.pushToken("testUser1@email.com", `Bearer 456`);
            expect(result.modifiedCount).toEqual(1);
        });
    });
});
