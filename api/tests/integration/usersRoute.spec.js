const { request } = require("http");

describe('users endpoints', () => {
    let api;

    beforeEach(async () => {
        await resetTestDB();
    });

    beforeAll(async () => {
        api = app.listen(5000, () => console.log('Test server running on port 5000'));
    });

    afterAll(done => {
        console.log('Gracefully stopping test server');
        api.close(done);
    });

    it('should return data for a single user', async () => {
        const res = await request(api).get('/users/testUser1@email.com');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({ 
            userEmail: "testUser1@email.com",
            passwordDigest: "password",
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
        });
    });

    it("should increment the current streak for a user's habits in a batch", async () => {
        const res = await request(api)
            .put('/users/testUser3@email.com')
            .send([
                {
                    habitName: "Running",
                    amount: 3
                }
            ]);
        
        expect(res.statusCode).toEqual(201);
    });
});