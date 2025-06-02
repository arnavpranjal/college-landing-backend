const { google } = require('googleapis');
require('dotenv').config(); // Load environment variables

async function testGoogleSheetsConnection() {
  try {
    console.log('Testing Google Sheets connection...');
    
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

    // Load service account credentials from environment variables
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    // Initialize Google Sheets API
    const sheets = google.sheets({ version: 'v4', auth });
    
    console.log('✅ Google Sheets API initialized successfully');

    // Test reading from the sheet to verify access
    const sheetId = process.env.GOOGLE_SHEET_ID || '1e31IyyPP30tYOLblvY04-5NbRObji5aSXeCWk40MROg';
    
    console.log('Testing sheet access...');
    const response = await sheets.spreadsheets.get({
      spreadsheetId: sheetId,
    });
    
    console.log('✅ Sheet access successful!');
    console.log('Sheet title:', response.data.properties.title);
    console.log('Sheet ID:', response.data.spreadsheetId);
    
    // Test reading values
    console.log('Testing read access...');
    const valuesResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: 'Sheet1!A1:G10',
    });
    
    console.log('✅ Read access successful!');
    console.log('Current values in sheet:');
    console.log(valuesResponse.data.values || 'No data found');
    
    // Test writing a sample row
    console.log('Testing write access...');
    const testData = [
      'test-id-' + Date.now(),
      'Test User',
      'test@example.com',
      '+1234567890',
      'Test College',
      '127.0.0.1',
      new Date().getDate(), // Extract only the day part of the date (1-31)
    ];
    
    const writeResponse = await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: 'Sheet1!A:G',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [testData],
      },
    });
    
    console.log('✅ Write access successful!');
    console.log('Updated range:', writeResponse.data.updates.updatedRange);
    console.log('Updated cells:', writeResponse.data.updates.updatedCells);
    
  } catch (error) {
    console.error('❌ Error testing Google Sheets:', error.message);
    if (error.code) {
      console.error('Error code:', error.code);
    }
    if (error.errors) {
      console.error('Error details:', error.errors);
    }
  }
}

testGoogleSheetsConnection(); 