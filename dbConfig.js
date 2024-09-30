const dbConfig = {
    user: process.env.AZURE_SQL_USER || 'your-sql-admin-user',  // Replace with your Azure SQL username
    password: process.env.AZURE_SQL_PASSWORD || 'your-sql-password',  // Replace with your Azure SQL password
    server: 'tasmanclouddata.database.windows.net',  // Server name
    database: 'runsheetdatabase',  // Use runsheetdatabase
    options: {
        encrypt: true,  // Required by Azure SQL
        trustServerCertificate: false,  // Set this to false to avoid certificate issues
    }
};

module.exports = dbConfig;
