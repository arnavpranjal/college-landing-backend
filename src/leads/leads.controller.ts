// src/leads/leads.controller.ts
import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { CreateLeadDto } from './dto/create-lead.dto'; // <--- Import DTO

@Controller('leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  // Use the DTO as the type for the request body
  async registerLead(@Body() createLeadDto: CreateLeadDto) {
    console.log('Received validated registration data in controller:', createLeadDto);
    // createLeadDto is now an instance of CreateLeadDto, with validated data
    const newLead = await this.leadsService.createLead(createLeadDto);
    return { message: 'Lead registered successfully!', lead: newLead };
    // Error handling for service call (e.g. unique constraint) will be improved later
  }
}