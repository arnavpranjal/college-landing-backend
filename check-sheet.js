const { google } = require('googleapis');

async function checkSheet() {
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: './config/college-landing-integration-d468e35b8ace.json',
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const sheetId = '1e31IyyPP30tYOLblvY04-5NbRObji5aSXeCWk40MROg';
    
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