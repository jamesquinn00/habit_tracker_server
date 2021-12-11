const db = connect("mongodb://localhost:27017/habits");

db.users.drop();

db.users.insertOne(
    { 
        userEmail: "initialUser@email.com",
        passwordDigest: "password",
        userName: "Initial User",
        habits: [
            {
                habitName: "Water",
                frequency: 1,
                amount: [{ expected: 3 }, { current: 0 }],
                streak: [{ top: 5 }, { current: 3 }],
                lastLog: "2021-12-11T11:31:21.988Z"
            }
        ]
    },
)