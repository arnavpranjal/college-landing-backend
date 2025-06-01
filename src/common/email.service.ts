import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { CreateLeadDto } from '../leads/dto/create-lead.dto';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  // Hardcoded array of email addresses
  private readonly emailRecipients = [
    'arnavpranjal365@gmail.com',
    // Add more email addresses here as needed
  ];

  // Hardcoded Gmail credentials
  private readonly gmailUser = 'arnavpranjal365@gmail.com';
  private readonly gmailPass = 'zzkx sszj gnjr gjvo';

  constructor() {
    this.createTransporter();
  }

  private async createTransporter() {
    try {
      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: this.gmailUser,
          pass: this.gmailPass, // App password, not regular password
        },
      });

      this.logger.log('Gmail SMTP transporter created successfully');
      this.logger.log(`Configured to send emails from: ${this.gmailUser}`);
    } catch (error) {
      this.logger.error('Failed to create email transporter:', error);
    }
  }

  async sendLeadNotification(leadData: CreateLeadDto & { id?: string; createdAt?: Date }) {
    try {
      const subject = 'New Lead Registration - College Landing Page';
      const htmlContent = this.generateLeadEmailTemplate(leadData);

      // Send email to all recipients in the hardcoded array
      for (const recipient of this.emailRecipients) {
        const mailOptions = {
          from: '"College Admission Team" <noreply@college-admission.com>',
          to: recipient,
          replyTo: 'noreply@college-admission.com',
          subject: subject,
          html: htmlContent,
          headers: {
            'X-Sender': 'College Admission System',
            'X-Mailer': 'College Landing Page Notification System',
          },
        };

        const info = await this.transporter.sendMail(mailOptions);
        this.logger.log(`Email sent to ${recipient}. Message ID: ${info.messageId}`);
      }

      return { success: true, recipientCount: this.emailRecipients.length };
    } catch (error) {
      this.logger.error('Failed to send lead notification email:', error);
      throw error;
    }
  }

  private generateLeadEmailTemplate(leadData: CreateLeadDto & { id?: string; createdAt?: Date }): string {
    const currentTime = leadData.createdAt ? leadData.createdAt.toLocaleString() : new Date().toLocaleString();
    
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Lead Registration</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
          }
          .container {
            background-color: #ffffff;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
          }
          .header {
            background-color: #2563eb;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 10px 10px 0 0;
            margin: -30px -30px 20px -30px;
          }
          .lead-details {
            background-color: #f8fafc;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
          }
          .detail-row {
            display: flex;
            justify-content: space-between;
            margin: 10px 0;
            padding: 8px 0;
            border-bottom: 1px solid #e2e8f0;
          }
          .detail-label {
            font-weight: bold;
            color: #475569;
            width: 40%;
          }
          .detail-value {
            color: #1e293b;
            width: 60%;
          }
          .timestamp {
            text-align: center;
            color: #64748b;
            font-size: 0.9em;
            margin-top: 20px;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
            color: #64748b;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎓 New Lead Registration</h1>
            <p>A new student has registered on the college landing page</p>
          </div>
          
          <div class="lead-details">
            <h2>Lead Information</h2>
            
            <div class="detail-row">
              <span class="detail-label">Full Name:</span>
              <span class="detail-value">${leadData.fullName}</span>
            </div>
            
            <div class="detail-row">
              <span class="detail-label">Email Address:</span>
              <span class="detail-value">${leadData.email}</span>
            </div>
            
            <div class="detail-row">
              <span class="detail-label">Mobile Phone:</span>
              <span class="detail-value">${leadData.mobilePhone}</span>
            </div>
            
            <div class="detail-row">
              <span class="detail-label">College Name:</span>
              <span class="detail-value">${leadData.collegeName}</span>
            </div>
            
            <div class="detail-row">
              <span class="detail-label">IP Address:</span>
              <span class="detail-value">${leadData.ipAddress || 'Not available'}</span>
            </div>
          </div>
          
          <div class="timestamp">
            <p>Registration Time: ${currentTime}</p>
          </div>
          
          <div class="footer">
            <p>This is an automated notification from the College Landing Page system.</p>
            <p>Please follow up with this lead as soon as possible.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Method to add more email recipients
  addEmailRecipient(email: string) {
    if (!this.emailRecipients.includes(email)) {
      this.emailRecipients.push(email);
      this.logger.log(`Added new email recipient: ${email}`);
    }
  }

  // Method to get current email recipients
  getEmailRecipients(): string[] {
    return [...this.emailRecipients];
  }
} 