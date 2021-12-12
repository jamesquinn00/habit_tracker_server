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
        const res = await request(api).get('/habits/Water');
        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toEqual(2);
        expect(res.body).toContain({
            userName: "test user 1",
            topStreak: 5
        });
    });

    it('should create a new habit for an existing user', async () => {
        const res = await request(api)
            .post('/habits/testUser1@email.com')
            .send({
                habitName: "Don't Smoke",
                frequency: 1,
                unit: null,
                amount: [{ expected: 1 }, { current: 0 }]
            });
        expect(res.statusCode).toEqual(201);
    
        const existingUserRes = await request(api).get('/users/testUser1@email.com');
        expect(existingUserRes.statusCode).toEqual(200);
        expect(existingUserRes.body.habits.length).toEqual(2);
    });

    it('should not allow creating a habit with the same name as a previously existing one', async () => {
        // Create a custom habit
        const res = await request(api)
            .post('/habits/testUser1@email.com')
            .send({
                habitName: "Don't Smoke",
                frequency: 1,
                unit: null,
                amount: [{ expected: 1 }, { current: 0 }]
            });
        expect(res.statusCode).toEqual(201);

        // Attempt to create another habit with the same name
        const duplicateRes = await request(api)
            .post('/habits/testUser1@email.com')
            .send({
                habitName: "Don't Smoke",
                frequency: 7,
                unit: null,
                amount: [{ expected: 1 }, { current: 0 }]
            });
        expect(res.statusCode).toEqual(405);
    });

    it("should allow editing a custom habit", async () => {
        // create a custom habit that will allow editing
        const customHabitRes = await request(api)
            .post('/habits/testUser1@email.com')
            .send({
                habitName: "Don't Smoke",
                frequency: 1,
                unit: null,
                expectedAmount: 1
            });
        expect(customHabitRes.statusCode).toEqual(201);

        // PUT request to edit habit
        const res = await request(api)
            .put("/habits/testUser1@email.com/Don't Smoke")
            .send({
                newHabitName: "No Smoking",
                frequency: 7,
                unit: "boolean",
            });
        expect(res.statusCode).toEqual(201);

        // GET request for Test User 1
        const updatedRes = await request(api).get('/users/testUser1@email.com');
        expect(updatedRes.statusCode).toEqual(200);
        expect(updatedRes.body.habits[1]).toHaveProperty("habitName", "No Smoking");
        expect(updatedRes.body.habits[1]).toHaveProperty("frequency", 7);
        expect(updatedRes.body.habits[1]).toHaveProperty("unit", "boolean");
    });

    it('should not allow editing a default habit', async () => {
        const res = await request(api)
            .put("/habits/testUser1@email.com/Water")
            .send({
                habitName: "Coke",
                frequency: 1,
                unit: "cups",
                amount: [{ expected: 5 }]
            });
        expect(res.statusCode).toEqual(405);
    });

    it("should increment the current streak for a habit", async () => {
        const res = await request(api)
            .put('/habits/testUser3email.com/Water/streak')
            .send({
                isDone: true
            });
        expect(res.statusCode).toEqual(201);
    });

    it('should delete a custom habit', async () => {
        // create a custom habit that will allow editing
        const customHabitRes = await request(api)
            .post('/habits/testUser1@email.com')
            .send({
                habitName: "Don't Smoke",
                frequency: 1,
                unit: null,
                amount: [{ expected: 1 }, { current: 0 }]
            });
        expect(customHabitRes.statusCode).toEqual(201);

        // attempt DELETE request
        const res = await request(api)
            .delete("/habits/testUser1@email.com/Don't Smoke");
        expect(res.statusCode).toEqual(204);
        
        const userRes = await request(api).get('/users/testUser1@email.com');
        expect(userRes.statusCode).toEqual(200);
        expect(userRes.body.habits.length).toEqual(1);
    });
})