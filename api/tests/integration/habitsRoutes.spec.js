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

    // TODO: tests
    it('should return a list of all habits for a single user', async () => {
        const res = await request(api).get('/habits/testUser1@email.com');
        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toEqual(1);
    });

})