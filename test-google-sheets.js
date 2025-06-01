const { google } = require('googleapis');

async function testGoogleSheetsConnection() {
  try {
    console.log('Testing Google Sheets connection...');
    
    // Load service account credentials
    const auth = new google.auth.GoogleAuth({
      keyFile: './config/college-landing-integration-d468e35b8ace.json',
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    // Initialize Google Sheets API
    const sheets = google.sheets({ version: 'v4', auth });
    
    console.log('✅ Google Sheets API initialized successfully');

    // Test reading from the sheet to verify access
    const sheetId = '1e31IyyPP30tYOLblvY04-5NbRObji5aSXeCWk40MROg';
    
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
      new Date().toISOString(),
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