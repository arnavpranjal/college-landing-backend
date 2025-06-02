import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import { Lead } from '@prisma/client';

@Injectable()
export class GoogleSheetsService {
  private sheets;
  
  // Configuration from environment variables
  private readonly SHEET_ID = process.env.GOOGLE_SHEET_ID || '1e31IyyPP30tYOLblvY04-5NbRObji5aSXeCWk40MROg';
  private readonly RANGE = 'Sheet1!A:G'; // A to G columns (matching actual sheet structure)

  constructor() {
    this.initializeSheets();
  }

  private async initializeSheets() {
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
        console.warn('Google Sheets credentials not fully configured. Google Sheets integration will be disabled.');
        return;
      }

      // Load service account credentials from environment variables
      const auth = new google.auth.GoogleAuth({
        credentials,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });

      // Initialize Google Sheets API
      this.sheets = google.sheets({ version: 'v4', auth });
      
      console.log('Google Sheets service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Google Sheets service:', error);
    }
  }

  async addLead(leadData: Lead): Promise<void> {
    try {
      if (!this.sheets) {
        console.error('Google Sheets service not initialized');
        return;
      }

      // Helper function to format date as DD-MM-YYYY
      const formatDate = (date: Date): string => {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // getMonth() is 0-based
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
      };

      // Prepare data for Google Sheets (matching actual sheet structure)
      // Columns: Full Name, Email, Mobile Phone, College Name, IP Address, Created At
      const rowData = [
        leadData.fullName,
        leadData.email,
        leadData.mobilePhone,
        leadData.collegeName,
        leadData.ipAddress || '', // Handle null IP address
        formatDate(leadData.createdAt), // Format date as DD-MM-YYYY
      ];

      // Append data to the sheet
      const response = await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.SHEET_ID,
        range: this.RANGE,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [rowData],
        },
      });

      console.log('Lead successfully added to Google Sheet:', {
        leadId: leadData.id,
        updatedCells: response.data.updates?.updatedCells,
        updatedRange: response.data.updates?.updatedRange,
      });

    } catch (error) {
      console.error('Failed to add lead to Google Sheets:', {
        leadId: leadData.id,
        error: error.message,
      });
      // Don't throw the error - we want lead creation to continue even if Google Sheets fails
    }
  }
} 