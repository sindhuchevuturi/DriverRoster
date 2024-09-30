const { DefaultAzureCredential } = require('@azure/identity');

// Get credentials using DefaultAzureCredential (Managed Identity, Environment Variables, etc.)
const credential = new DefaultAzureCredential();

// Function to get an access token for Azure SQL
async function getToken() {
    const tokenResponse = await credential.getToken('https://database.windows.net/.default');
    return tokenResponse.token;
}

// SQL Configuration
async function getDbConfig() {
    const token = await getToken();  // Get Azure AD token
    return {
        server: 'tasmanclouddata.database.windows.net',
        database: 'runsheetdatabase',
        options: {
            encrypt: true,  // Required for Azure SQL
            trustServerCertificate: false,
        },
        authentication: {
            type: 'azure-active-directory-access-token',
            options: {
                token: token  // Token is added here
            }
        }
    };
}

module.exports = { getDbConfig };  // Ensure this function is exported correctly
