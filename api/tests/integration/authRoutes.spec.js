describe('auth endpoints', () => {
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

    it('should create a new user in the database', async () => {
        const res = await request(api)
            .post('/auth/register')
            .send({
                userEmail: "testUser4@email.com",
                password: "Test Password",
                userName: "Test User 4"
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toEqual({ msg: "User created" });
    });

    it('should login a user into the website', async () => {
        const res = await request(api)
            .post('/auth/login')
            .send({
                userEmail: "testUser4@email.com",
                password: "Test Password"
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("accessToken");
        expect(res.body).toHaveProperty("refreshToken");
    });

    it('should retrieve a new access token', async () => {
        const res = await request(api)
            .post('/auth/token')
            .send({
                token: `Bearer ${process.env.TEST_REFRESH_TOKEN_SECRET}`
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty("accessToken");
    });

    it('should log the user out', async () => {
        const res = await request(api)
            .delete('/auth/logout')
            .send({
                token: `Bearer ${process.env.TEST_REFRESH_TOKEN_SECRET}`
            });
        
        expect(res.statusCode).toEqual(204);
    });
});