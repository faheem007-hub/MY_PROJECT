const mysql = require('mysql');

// Create a MySQL connection
const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',       // Change this to your database user
    password: '',       // Change this to your database password
    database: 'truck_logs_db'  // Change this to your database name
});

// Connect to the database
conn.connect((err) => {
    if (err) {
        console.error('Database connection failed: ' + err.message);
        return;
    }
    console.log('Connected to the database!');
});

module.exports = conn;
