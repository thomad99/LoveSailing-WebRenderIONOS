require("dotenv").config();
const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MariaDB
const pool = mysql.createPool({
    host: process.env.DB_HOST,        
    user: process.env.DB_USER,        
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,    
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test Database Connection
pool.getConnection()
    .then((conn) => {
        console.log("✅ Connected to MariaDB!");
        conn.release();
    })
    .catch((err) => console.error("❌ Database connection failed: ", err));

// API to add URLs
app.post("/add_url", async (req, res) => {
    const { url, email, phone } = req.body;
    try {
        const [result] = await pool.execute(
            "INSERT INTO monitored_pages (url, email, phone) VALUES (?, ?, ?)", 
            [url, email, phone]
        );
        res.status(201).json({ message: "URL added for monitoring" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Test Route
app.get("/", (req, res) => {
    res.send("Webpage Monitoring API (MariaDB) is running!");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
