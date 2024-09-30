const express = require('express');
const path = require('path');
const sql = require('mssql');  // Assuming you're using mssql

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
