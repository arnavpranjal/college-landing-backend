const { google } = require('googleapis');
require('dotenv').config(); // Load environment variables

async function checkSheet() {
  try {
    // Create credentials object from environment variables
    const credentials = {
      type: process.env.GOOGLE_SERVICE_ACCOUNT_TYPE || 'service_account',
      project_id: process.env.GOOGLE_PROJECT_ID,
      private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'), // Handle escaped newlines
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      client_id: process.env.GOOGLE_CLIENT_ID,
      auth_uri: process.env.GOOGLE_AUTH_URI || 'https://accounts.google.com/o/oauth2/auth',
      token_uri: process.env.GOOGLE_TOKEN_URI || 'https://oauth2.googleapis.com/token',
      auth_provider_x509_cert_url: process.env.GOOGLE_AUTH_PROVIDER_X509_CERT_URL || 'https://www.googleapis.com/oauth2/v1/certs',
      client_x509_cert_url: process.env.GOOGLE_CLIENT_X509_CERT_URL,
      universe_domain: process.env.GOOGLE_UNIVERSE_DOMAIN || 'googleapis.com'
    };

    // Check if all required environment variables are present
    if (!credentials.project_id || !credentials.private_key || !credentials.client_email) {
      throw new Error('Missing required Google Cloud credentials in environment variables. Please check your .env file.');
    }

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const sheetId = process.env.GOOGLE_SHEET_ID || '1e31IyyPP30tYOLblvY04-5NbRObji5aSXeCWk40MROg';
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: 'Sheet1!A:G',
    });
    
    console.log('Current Google Sheet contents:');
    console.log('============================');
    const values = response.data.values || [];
    
    values.forEach((row, index) => {
      console.log(`Row ${index + 1}:`, row.join(' | '));
    });
    
    console.log(`\nTotal rows: ${values.length}`);
    
  } catch (error) {
    console.error('Error reading sheet:', error.message);
  }
}

checkSheet(); 