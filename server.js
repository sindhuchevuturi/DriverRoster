const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sql = require('mssql');

// Allow requests from your GitHub Pages domain
const corsOptions = {
    origin: 'https://<sindhuchevuturi.github.io>.github.io',
    optionsSuccessStatus: 200
};

const app = express();

app.use(cors(corsOptions));  // Enable CORS for your frontend
app.use(bodyParser.json());

// Your existing routes and database configuration...

app.listen(5000, () => {
    console.log('Backend server running on http://localhost:5000');
});
