describe('habits endpoints', () => {
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

    it('should return a list containing top streaks and user names for a single habit', async () => {
        const res = await request(api).get('/habits/water');
        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toEqual(2);
        expect(res.body).toContain({
            userName: "test user 1",
            topStreak: 5
        });
    });
})