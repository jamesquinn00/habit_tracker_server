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

    it("should return data for all users", async () => {
        const res = await request(api).get('/users')
        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toEqual(3);
    });

    it('should return data for a single user', async () => {
        const res = await request(api).get('/users/testUser1@email.com');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({ 
            id: 1,
            userEmail: "testUser1@email.com",
            passwordDigest: "password",
            refreshTokens: ['Bearer 123'],
            userName: "test user 1",
        });
    });

    it('should return an error for a user that does not exist', async () => {
        const res = await request(api).get('/users/dontexist@fake.com');
        expect(res.statusCode).toEqual(404);
        expect(res.body).toEqual(err);
    })
});