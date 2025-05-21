const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();
app.use(express.json());

const PORT = process.env.USER_SERVICE_PORT || 3002;
const MONGO_URI = process.env.MONGO_URI || "mongodb://mongo:27017";

let users;

MongoClient.connect(MONGO_URI)
    .then(client => {
        const db = client.db("usersdb");
        users = db.collection("users");
        console.log("[user-service] Połączono z MongoDB");
    })
    .catch(err => console.error("[user-service] Błąd połączenia z Mongo:", err));

// GET /health
app.get("/health", (req, res) => {
    res.json({ status: "ok" });
});

// GET /users
app.get("/users", async (req, res) => {
    const all = await users.find().toArray();
    res.json(all);
});


// PUT /users/:id – edytuj użytkownika
app.put("/users/:id", async (req, res) => {
    const { id } = req.params;
    const update = req.body;

    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid user ID format" });
    }

    try {
        const result = await users.updateOne(
            { _id: new ObjectId(id) },
            { $set: update }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        const updated = await users.findOne({ _id: new ObjectId(id) });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }

});



// POST /users
app.post("/users", async (req, res) => {
    const user = req.body;
    const result = await users.insertOne(user);
    res.status(201).json(result.ops?.[0] || user);
});

// DELETE /users/:id
app.delete("/users/:id", async (req, res) => {
    const { id } = req.params;
    await users.deleteOne({ _id: new ObjectId(id) });
    res.status(204).end();
});

app.listen(PORT, () => {
    console.log(`[user-service] Działa na porcie ${PORT}`);
});
