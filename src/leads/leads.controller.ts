// src/leads/leads.controller.ts
import { Controller, Post, Body, HttpCode, HttpStatus, Options, Res } from '@nestjs/common';
import { Response } from 'express';
import { LeadsService } from './leads.service';
import { CreateLeadDto } from './dto/create-lead.dto'; // <--- Import DTO

@Controller('leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Options('register')
  @HttpCode(HttpStatus.NO_CONTENT)
  async handlePreflight(@Res() res: Response) {
    // Explicitly handle OPTIONS preflight request
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.send();
  }

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