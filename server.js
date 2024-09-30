const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const sql = require('mssql');  // Use mssql for Azure SQL
require('dotenv').config();  // Load environment variables from .env

// Azure SQL Database Configuration
const dbConfig = {
    user: process.env.AZURE_SQL_USER,  // Your Azure SQL username from .env
    password: process.env.AZURE_SQL_PASSWORD,  // Your Azure SQL password from .env
    server: process.env.AZURE_SQL_SERVER,  // Azure SQL Server name from .env
    database: process.env.AZURE_SQL_DATABASE,  // Your Azure SQL database name from .env
    options: {
        encrypt: true,  // Azure requires encryption
        trustServerCertificate: false,  // Disable self-signed cert validation
    }
};

// Connect to Azure SQL Database using async/await
async function connectToDatabase() {
    try {
        await sql.connect(dbConfig);
        console.log('Connected to Azure SQL Database successfully!');

        // Example query to test the connection
        const result = await sql.query('SELECT TOP 10 * FROM Drivers');  // Example query
        console.log('Query result:', result.recordset);

    } catch (err) {
        console.error('Database connection failed:', err);
        process.exit(1);  // Exit the process if the connection fails
    }
}
connectToDatabase();  // Call the function to connect to the database

// Initialize the Express app
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

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
