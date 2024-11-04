// Initialise dependencies
const express = require('express');
const app = express();
const mysql = require('mysql2');
const dotenv = require('dotenv');
const cors = require('cors'); // Add this line if using CORS

app.use(express.json());
app.use(cors());
dotenv.config();

// Connect to the database
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Check if the connection works
db.connect((err) => {
    if (err) {
        return console.log("Error connecting to the MySQL database:", err);
    }
    console.log("Connected to MySQL successfully as id", db.threadId);

    // Start the server after a successful connection
    app.listen(process.env.PORT || 3000, () => {
        console.log(`Server listening on port ${process.env.PORT || 3000}`);

        // Send message to the browser
        app.get('/', (req, res) => {
            res.send('Server started successfully! Start working!!!');
        });

        // Retrieve all patients
        app.get('/patients', (req, res) => {
            db.query('SELECT patient_id, first_name, last_name, date_of_birth FROM patients', (error, results) => {
                if (error) {
                    console.error(error);
                    return res.status(500).json({ error: 'Error retrieving patients' });
                }
                res.json(results);
            });
        });

        // Retrieve all providers
        app.get('/providers', (req, res) => {
            db.query('SELECT first_name, last_name, provider_specialty FROM providers', (error, results) => {
                if (error) {
                    console.error(error);
                    return res.status(500).json({ error: 'Error retrieving providers' });
                }
                res.json(results);
            });
        });
        
        // Filter patients by First Name
        app.get('/patients/search', (req, res) => {
            const { firstName } = req.query;
            db.query('SELECT patient_id, first_name, last_name, date_of_birth FROM patients WHERE first_name = ?', [firstName], (error, results) => {
                if (error) {
                    console.error(error);
                    return res.status(500).json({ error: 'Error filtering patients by first name' });
                }
                res.json(results);
            });
        });

        // Retrieve all providers by their specialty
        app.get('/providers/search', (req, res) => {
            const { specialty } = req.query;
            db.query('SELECT first_name, last_name, provider_specialty FROM providers WHERE provider_specialty = ?', [specialty], (error, results) => {
                if (error) {
                    console.error(error);
                    return res.status(500).json({ error: 'Error filtering providers by specialty' });
                }
                res.json(results);
            });
        });
    });
});
