const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const conn = require('./db_connection'); // Your database connection file

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

app.post("/login", (req, res) => {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
        return res.json({ status: "error", message: "Email, password, and role are required!" });
    }

    let table = "";
    if (role === "admin") {
        table = "admins";
    } else if (role === "manager") {
        table = "managers";
    } else if (role === "driver") {
        table = "drivers";
    } else {
        return res.json({ status: "error", message: "Invalid role!" });
    }

    // SQL query to find user by email
    const sql = `SELECT id, name,role, password FROM ${table} WHERE email = ?`;
    conn.query(sql, [email], (err, results) => {
        if (err) {
            return res.json({ status: "error", message: "Database error!" });
        }

        if (results.length > 0) {
            const user = results[0];
          

            // Compare passwords directly (not recommended for production)
            if (password === user.password) {
                return res.json({
                    status: "success",
                    user: { id: user.id, name: user.name, role: user.role },
                    token: "sample-jwt-token", // Generate JWT in a real-world scenario
                });
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
    conn.query("SELECT id, name, email, licence_number, assigned_vehicle, created_at FROM drivers", (err, results) => {
        if (err) return res.json({ status: "error", message: "Database error!" });
        res.json({ status: "success", data: results });
    });
});

app.get('/trips', (req, res) => {
    conn.query("SELECT * FROM trips", (err, results) => {
        if (err) return res.json({ status: "error", message: "Database error!" });
        res.json({ status: "success", data: results });
    });
});

app.get("/trips/:driver_id", (req, res) => {
    const driverId = req.params.driver_id;
    const sql = "SELECT * FROM trips WHERE driver_id = ?";
    
    conn.query(sql, [driverId], (err, results) => {
        if (err) {
            return res.json({ status: "error", message: "Database error!", error: err });
        }

        if (results.length > 0) {
            return res.json({ status: "success", data: results });
        } else {
            return res.json({ status: "success", data: [] }); // Return an empty array if no trips found
        }
    });
});


app.post('/trips', (req, res) => {
    const { truck_id, driver_id, start_location, end_location, distance, start_time, end_time, status } = req.body;
    
    const sql = `INSERT INTO trips (truck_id, driver_id, start_location, end_location, distance, start_time, end_time, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    conn.query(sql, [truck_id, driver_id, start_location, end_location, distance, start_time, end_time, status], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error posting trip' });
        }
        res.status(201).json({ message: 'Trip posted successfully', trip_id: result.insertId });
    });
});

app.delete("/trips/:id", (req, res) => {
    const tripId = req.params.id;

    const sql = "DELETE FROM trips WHERE id = ?";
    conn.query(sql, [tripId], (err, result) => {
        if (err) {
            return res.status(500).json({ status: "error", message: "Database error!", error: err });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ status: "error", message: "Trip not found!" });
        }

        res.json({ status: "success", message: "Trip deleted successfully!" });
    });
});



// Start Server
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}/`);
});
