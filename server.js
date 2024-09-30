const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const sql = require('mssql');  // Use mssql for Azure SQL
require('dotenv').config();

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

// Route to save driver data
app.post('/save-driver', async (req, res) => {
    const { name, onLeave, hasMSIC, hasWhiteCard } = req.body;

    const query = `
        INSERT INTO dbo.Drivers (Name, OnLeave, HasMSIC, HasWhiteCard)
        VALUES (@name, @onLeave, @hasMSIC, @hasWhiteCard)
    `;

    try {
        const request = new sql.Request();
        request.input('name', sql.VarChar, name);
        request.input('onLeave', sql.Bit, onLeave);
        request.input('hasMSIC', sql.Bit, hasMSIC);
        request.input('hasWhiteCard', sql.Bit, hasWhiteCard);

        await request.query(query);
        res.status(201).send('Driver saved successfully');
    } catch (err) {
        console.error('Error saving driver:', err);
        res.status(500).send('Error saving driver');
    }
});

// Route to save roster data
app.post('/save-roster', async (req, res) => {
    const { gek, rego, trailerType, startTime, finishTime, service, wharfStatus, constructionSite, driver } = req.body;

    const query = `
        INSERT INTO dbo.Roster (GEK, REGO, TrailerType, StartTime, FinishTime, Service, WharfStatus, ConstructionSite, Driver)
        VALUES (@gek, @rego, @trailerType, @startTime, @finishTime, @service, @wharfStatus, @constructionSite, @driver)
    `;

    try {
        const request = new sql.Request();
        request.input('gek', sql.VarChar, gek);
        request.input('rego', sql.VarChar, rego);
        request.input('trailerType', sql.VarChar, trailerType);
        request.input('startTime', sql.Time, startTime);
        request.input('finishTime', sql.Time, finishTime);
        request.input('service', sql.VarChar, service);
        request.input('wharfStatus', sql.Bit, wharfStatus);
        request.input('constructionSite', sql.Bit, constructionSite);
        request.input('driver', sql.VarChar, driver);

        await request.query(query);
        res.status(201).send('Roster saved successfully');
    } catch (err) {
        console.error('Error saving roster:', err);
        res.status(500).send('Error saving roster');
    }
});

// Route to save job data
app.post('/save-job', async (req, res) => {
    const { clientName, trailerType, jobCount } = req.body;

    const query = `
        INSERT INTO dbo.Jobs (ClientName, TrailerType, JobCount)
        VALUES (@clientName, @trailerType, @jobCount)
    `;

    try {
        const request = new sql.Request();
        request.input('clientName', sql.VarChar, clientName);
        request.input('trailerType', sql.VarChar, trailerType);
        request.input('jobCount', sql.Int, jobCount);

        await request.query(query);
        res.status(201).send('Job saved successfully');
    } catch (err) {
        console.error('Error saving job:', err);
        res.status(500).send('Error saving job');
    }
});

// Start the server on port 5001
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Driver Roster Backend is running on http://localhost:${PORT}/`);
});
