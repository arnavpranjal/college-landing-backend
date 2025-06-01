import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import { Lead } from '@prisma/client';

@Injectable()
export class GoogleSheetsService {
  private sheets;
  
  // Hardcoded values - you can replace these with your actual values
  private readonly CREDENTIALS_PATH = './config/college-landing-integration-d468e35b8ace.json';
  private readonly SHEET_ID = '1e31IyyPP30tYOLblvY04-5NbRObji5aSXeCWk40MROg';
  private readonly RANGE = 'Sheet1!A:G'; // A to G columns (matching actual sheet structure)

  constructor() {
    this.initializeSheets();
  }

  private async initializeSheets() {
    try {
      // Load service account credentials
      const auth = new google.auth.GoogleAuth({
        keyFile: this.CREDENTIALS_PATH,
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

      // Prepare data for Google Sheets (matching actual sheet structure)
      // Columns: ID, Full Name, Email, Mobile Phone, College Name, IP Address, Created At
      const rowData = [
        leadData.id,
        leadData.fullName,
        leadData.email,
        leadData.mobilePhone,
        leadData.collegeName,
        leadData.ipAddress || '', // Handle null IP address
        leadData.createdAt.toISOString(), // Format date as ISO string
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