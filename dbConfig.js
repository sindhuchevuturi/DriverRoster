const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sql = require('mssql');  // Use mssql for Azure SQL

// Azure SQL Database Configuration
const dbConfig = {
    user: process.env.AZURE_SQL_USER,  // Azure SQL username from environment variable
    password: process.env.AZURE_SQL_PASSWORD,  // Azure SQL password from environment variable
    server: process.env.AZURE_SQL_SERVER,  // Azure SQL server from environment variable
    database: process.env.AZURE_SQL_DATABASE,  // Azure SQL database name
    options: {
        encrypt: true,  // Azure requires encryption
        trustServerCertificate: false,  // Disable self-signed cert validation
    }
};


// Connect to Azure SQL Database
sql.connect(dbConfig, (err) => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to Azure SQL Database successfully!');
});

// Initialize the Express app
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Basic route to check server status
app.get('/', (req, res) => {
    res.send('Driver Roster Backend is running');
});

// Route to save driver data
app.post('/save-driver', (req, res) => {
    const { name, onLeave, hasMSIC, hasWhiteCard } = req.body;

    const query = `
        INSERT INTO dbo.Drivers (Name, OnLeave, HasMSIC, HasWhiteCard)
        VALUES (@name, @onLeave, @hasMSIC, @hasWhiteCard)
    `;

    const request = new sql.Request();
    request.input('name', sql.VarChar, name);
    request.input('onLeave', sql.Bit, onLeave);
    request.input('hasMSIC', sql.Bit, hasMSIC);
    request.input('hasWhiteCard', sql.Bit, hasWhiteCard);

    request.query(query, (err) => {
        if (err) {
            console.error('Error saving driver:', err);
            res.status(500).send('Error saving driver');
        } else {
            res.status(201).send('Driver saved successfully');
        }
    });
});

// Route to save roster data
app.post('/save-roster', (req, res) => {
    const { gek, rego, trailerType, startTime, finishTime, service, wharfStatus, constructionSite, driver } = req.body;

    const query = `
        INSERT INTO dbo.Roster (GEK, REGO, TrailerType, StartTime, FinishTime, Service, WharfStatus, ConstructionSite, Driver)
        VALUES (@gek, @rego, @trailerType, @startTime, @finishTime, @service, @wharfStatus, @constructionSite, @driver)
    `;

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

    request.query(query, (err) => {
        if (err) {
            console.error('Error saving roster:', err);
            res.status(500).send('Error saving roster');
        } else {
            res.status(201).send('Roster saved successfully');
        }
    });
});

// Route to save job data
app.post('/save-job', (req, res) => {
    const { clientName, trailerType, jobCount } = req.body;

    const query = `
        INSERT INTO dbo.Jobs (ClientName, TrailerType, JobCount)
        VALUES (@clientName, @trailerType, @jobCount)
    `;
sindhu
    const request = new sql.Request();
    request.input('clientName', sql.VarChar, clientName);
    request.input('trailerType', sql.VarChar, trailerType);
    request.input('jobCount', sql.Int, jobCount);

    request.query(query, (err) => {
        if (err) {
            console.error('Error saving job:', err);
            res.status(500).send('Error saving job');
        } else {
            res.status(201).send('Job saved successfully');
        }
    });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Driver Roster Backend is running on http://localhost:${PORT}/`);
});
