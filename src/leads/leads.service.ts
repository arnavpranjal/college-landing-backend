// src/leads/leads.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Lead } from 'generated/prisma';
import { CreateLeadDto } from './dto/create-lead.dto'; // <--- Import DTO

@Injectable()
export class LeadsService {
  constructor(private prisma: PrismaService) {}

  // Use the DTO as the type for the input data
  async createLead(data: CreateLeadDto): Promise<Lead> {
    try {
      const newLead = await this.prisma.lead.create({
        data: {
          fullName: data.fullName,
          email: data.email,
          mobilePhone: data.mobilePhone,
          consent: data.consent,
        },
      });
      console.log('New lead created in DB:', newLead);
      return newLead;
    } catch (error) {
      console.error('Error creating lead:', error);
      throw error; // We'll refine error handling later
    }
  }
}