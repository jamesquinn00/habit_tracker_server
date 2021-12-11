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

    it('should create a new habit on an existing user', async () => {
        const res = await request(api)
            .post('/users/testUser1@email.com/newHabit')
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
            .post('/users/testUser1@email.com/newHabit')
            .send({
                habitName: "Don't Smoke",
                frequency: 1,
                unit: null,
                amount: [{ expected: 1 }, { current: 0 }]
            });
        expect(res.statusCode).toEqual(201);

        // Attempt to create another habit with the same name
        const duplicateRes = await request(api)
            .post('/users/testUser1@email.com/newHabit')
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
            .post('/users/testUser1@email.com')
            .send({
                habitName: "Don't Smoke",
                frequency: 1,
                unit: null,
                amount: [{ expected: 1 }, { current: 0 }]
            });
        expect(customHabitRes.statusCode).toEqual(201);

        // PUT request to edit habit
        const res = await request(api)
            .put("/users/testUser1@email.com/Don't Smoke")
            .send({
                habitName: "No Smoking",
                frequency: 7,
                unit: "boolean",
            });
        expect(res.statusCode).toEqual(201);

        // GET request for Test User 1
        const updatedRes = await request(api).get('/users/testUser1@email.com');
        expect(updatedRes.statusCode).toEqual(200);
        expect(updatedRes.body.habits).toContain({
            habitName: "No Smoking",
            frequency: 7,
            unit: "boolean",
            amount: [{ expected: 1 }, { current: 0 }],
            streak: [{ top: 0 }, { current: 0 }],
            lastLog: "2021-12-11T11:31:21.988Z"
        });
    });

    it('should not allow editing a default habit', async () => {
        const res = await request(api)
            .put("/users/testUser1@email.com/Water")
            .send({
                habitName: "Coke",
                frequency: 1,
                unit: "cups",
                amount: [{ expected: 5 }]
            });
        expect(res.statusCode).toEqual(405);
    });

    it("should increment the current streak for a user's habits in a batch", async () => {
        const res = await request(api)
            .put('/users/testUser3@email.com/streak')
            .send([
                {
                    habitName: "Running",
                    isDone: true
                }
            ]);
        
        expect(res.statusCode).toEqual(201);
    });

    it('should delete a custom habit', async () => {
        // create a custom habit that will allow editing
        const customHabitRes = await request(api)
            .post('/users/testUser1@email.com')
            .send({
                habitName: "Don't Smoke",
                frequency: 1,
                unit: null,
                amount: [{ expected: 1 }, { current: 0 }]
            });
        expect(customHabitRes.statusCode).toEqual(201);

        // attempt DELETE request
        const res = await request(api)
            .delete("/users/testUser1@email.com/Don't Smoke");
        expect(res.statusCode).toEqual(204);
        
        const userRes = await request(api).get('/users/testUser1@email.com');
        expect(userRes.statusCode).toEqual(200);
        expect(userRes.body.habits.length).toEqual(1);
    });
})