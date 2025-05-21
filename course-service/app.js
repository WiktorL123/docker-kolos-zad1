const express = require("express");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
app.use(express.json());

// Zmienne środowiskowe
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || "development";

// Połączenie do PostgreSQL
const pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST || "postgres", // fallback
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD, // tylko jeśli nie używasz secrets
    port: process.env.POSTGRES_PORT || 5432,
});


(async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS courses (
                id SERIAL PRIMARY KEY,
                title TEXT NOT NULL,
                description TEXT
            );
        `);
        console.log("[course-service] Tabela 'courses' gotowa ✅");
    } catch (err) {
        console.error("[course-service] Błąd przy tworzeniu tabeli:", err.message);
    }
})();



// Endpoint zdrowia
app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});

// GET /courses – pobierz wszystkie kursy
app.get("/courses", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM courses");
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT /courses/:id – edytuj kurs
app.put("/courses/:id", async (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;
    try {
        const result = await pool.query(
            "UPDATE courses SET title = $1, description = $2 WHERE id = $3 RETURNING *",
            [title, description, id]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Course not found" });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// POST /courses – dodaj nowy kurs
app.post("/courses", async (req, res) => {
    const { title, description } = req.body;
    try {
        const result = await pool.query(
            "INSERT INTO courses (title, description) VALUES ($1, $2) RETURNING *",
            [title, description]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE /courses/:id – usuń kurs
app.delete("/courses/:id", async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query("DELETE FROM courses WHERE id = $1", [id]);
        res.status(204).end();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`[course-service] started on port ${PORT} in ${NODE_ENV} mode`);
});
