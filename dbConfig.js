const sql = require('mssql');
const { DefaultAzureCredential } = require('@azure/identity');

// Get credentials using DefaultAzureCredential (Managed Identity, Environment Variables, etc.)
const credential = new DefaultAzureCredential();

// Function to get an access token for Azure SQL
async function getToken() {
    const tokenResponse = await credential.getToken('https://database.windows.net/.default');
    return tokenResponse.token;
}

// SQL Configuration
const dbConfig = {
    server: 'tasmanclouddata.database.windows.net',
    database: 'runsheetdatabase',
    options: {
        encrypt: true,  // Required for Azure SQL
        trustServerCertificate: false,
    },
    authentication: {
        type: 'azure-active-directory-access-token',
        options: {
            token: null,  // Token will be added here after it's fetched
        }
    }
};

// Function to connect to the database and run a test query
async function connectToDatabase() {
    try {
        const token = await getToken();  // Get Azure AD token
        dbConfig.authentication.options.token = token;

        // Connect to Azure SQL Database
        await sql.connect(dbConfig);
        console.log('Connected to Azure SQL Database successfully!');

        // Test query to check if the connection is working
        const result = await sql.query('SELECT 1 AS test');
        console.log('Test query result:', result.recordset);

    } catch (err) {
        console.error('Error connecting to Azure SQL Database:', err);
    }
}

connectToDatabase();
