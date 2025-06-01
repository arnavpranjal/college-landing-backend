// src/leads/leads.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { EmailService } from '../common/email.service';
import { GoogleSheetsService } from '../common/google-sheets.service';
import { Lead } from '@prisma/client';
import { CreateLeadDto } from './dto/create-lead.dto'; // <--- Import DTO

@Injectable()
export class LeadsService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
    private googleSheetsService: GoogleSheetsService,
  ) {}

  // Use the DTO as the type for the input data
  async createLead(data: CreateLeadDto): Promise<Lead> {
    try {
      const newLead = await this.prisma.lead.create({
        data: {
          fullName: data.fullName,
          email: data.email,
          mobilePhone: data.mobilePhone,
          collegeName: data.collegeName,
          ipAddress: data.ipAddress,
          consent: data.consent ?? true, // Default to true if not provided
        },
      });
      console.log('New lead created in DB:', newLead);

      // Send email notification asynchronously (fire and forget)
      this.emailService.sendLeadNotification({
        ...data,
        id: newLead.id,
        createdAt: newLead.createdAt,
      }).then(() => {
        console.log('Email notification sent for lead:', newLead.id);
      }).catch((emailError) => {
        console.error('Failed to send email notification for lead:', newLead.id, emailError);
      });

      // Add lead to Google Sheets asynchronously (fire and forget)
      this.googleSheetsService.addLead(newLead).then(() => {
        console.log('Lead added to Google Sheets:', newLead.id);
      }).catch((sheetsError) => {
        console.error('Failed to add lead to Google Sheets:', newLead.id, sheetsError);
      });

      return newLead;
    } catch (error) {
      console.error('Error creating lead:', error);
      throw error; // We'll refine error handling later
    }
  }
}