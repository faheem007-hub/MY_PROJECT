const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const bcrypt = require('bcrypt'); // Secure password handling
const conn = require('./db_connection'); // Your database connection file

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(session({
    secret: 'secret_key',
    resave: false,
    saveUninitialized: true
}));

// Login Endpoint
// Login Endpoint
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.json({ status: "error", message: "Email and password are required!" });
    }

    // SQL query to find user by email
    const sql = "SELECT id, name, role, password FROM users WHERE email = ?";
    conn.query(sql, [email], (err, results) => {
        if (err) {
            return res.json({ status: "error", message: "Database error!" });
        }

        if (results.length > 0) {
            const user = results[0];

            // Check if password matches (for production, use bcrypt)
            if (password === user.password) {
                req.session.user_id = user.id;
                req.session.user_name = user.name;
                req.session.user_role = user.role;

                return res.json({ status: "success", redirect: `${user.role}_dashboard.html` });
            } else {
                return res.json({ status: "error", message: "Incorrect password!" });
            }
        } else {
            return res.json({ status: "error", message: "User not found!" });
        }
    });
});

// GET endpoints
app.get('/admins', (req, res) => {
    conn.query("SELECT id, name, email, created_at FROM admins", (err, results) => {
        if (err) return res.json({ status: "error", message: "Database error!" });
        res.json({ status: "success", data: results });
    });
});

app.get('/managers', (req, res) => {
    conn.query("SELECT id, name, email, department, created_at FROM managers", (err, results) => {
        if (err) return res.json({ status: "error", message: "Database error!" });
        res.json({ status: "success", data: results });
    });
});

app.get('/drivers', (req, res) => {
    conn.query("SELECT id, name, email, license_number, assigned_vehicle, created_at FROM drivers", (err, results) => {
        if (err) return res.json({ status: "error", message: "Database error!" });
        res.json({ status: "success", data: results });
    });
});

// Start Server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}/`);
});
