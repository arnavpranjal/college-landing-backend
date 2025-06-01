# Google Sheets Configuration

## Setup Instructions

1. **Place your Google Service Account JSON file here:**
   - Rename it to: `google-sheets-service-account.json`
   - This file should contain your downloaded service account credentials from Google Cloud Console

2. **Update the Google Sheets Service:**
   - Open `src/common/google-sheets.service.ts`
   - Replace `YOUR_SHEET_ID_HERE` with your actual Google Sheet ID
   - The Sheet ID is found in your Google Sheets URL: `https://docs.google.com/spreadsheets/d/[SHEET_ID]/edit`

3. **Google Sheet Column Headers:**
   Your Google Sheet should have these headers in row 1:
   - A1: "ID"
   - B1: "Full Name"
   - C1: "Email"
   - D1: "Mobile Phone"
   - E1: "College Name"
   - F1: "IP Address"
   - G1: "Created At"

## Security Notes

- The `google-sheets-service-account.json` file is excluded from version control
- Never commit your actual credentials to Git
- Make sure your Google Sheet is shared with the service account email with Editor permissions

## File Structure

```
config/
├── google-sheets-service-account.json     # Your actual credentials (not in Git)
├── google-sheets-service-account.json.example  # Example structure
└── README.md                              # This file
``` 