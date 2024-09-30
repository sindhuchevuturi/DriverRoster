const express = require('express');
const path = require('path');
const sql = require('mssql');  // Declared once here
const { getDbConfig } = require('./dbConfig');  // Import the configuration

// Initialize the Express app
const app = express();

// Serve static files from the 'driver-roster-frontend' directory
app.use(express.static(path.join(__dirname, 'driver-roster-frontend')));

// Handle the root route, send index.html as response
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'driver-roster-frontend', 'index.html'));
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Driver Roster Backend is running on http://localhost:${PORT}/`);
});

// Function to connect to the database and run a query
async function connectToDatabase() {
    try {
        const dbConfig = await getDbConfig();  // Get the DB configuration with token

        // Connect to Azure SQL Database
        await sql.connect(dbConfig);
        console.log('Connected to Azure SQL Database successfully!');

        // Run a custom query (replace with your actual table name)
        const result = await sql.query('SELECT TOP 10 * FROM Drivers');  // Example query
        console.log('Query result:', result.recordset);

    } catch (err) {
        console.error('Error connecting to Azure SQL Database or running query:', err);
    }
}

connectToDatabase();
