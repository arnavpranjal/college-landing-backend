// src/leads/leads.controller.ts
import { Controller, Post, Body, HttpCode, HttpStatus, Options, Res, Req, Get } from '@nestjs/common';
import { Request, Response } from 'express';
import { LeadsService } from './leads.service';
import { CreateLeadDto } from './dto/create-lead.dto'; // <--- Import DTO
import { EmailService } from '../common/email.service';

@Controller('leads')
export class LeadsController {
  constructor(
    private readonly leadsService: LeadsService,
    private readonly emailService: EmailService,
  ) {}

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
  async registerLead(@Body() createLeadDto: CreateLeadDto, @Req() req: Request) {
    // Extract IP address from request
    const clientIp = this.getClientIp(req);
    
    // Add IP address to the DTO
    createLeadDto.ipAddress = clientIp;
    
    console.log('Received validated registration data in controller:', createLeadDto);
    console.log('Client IP:', clientIp);
    
    // createLeadDto is now an instance of CreateLeadDto, with validated data
    const newLead = await this.leadsService.createLead(createLeadDto);
    console.log('Lead created and email notification processed');
    
    return { message: 'Lead registered successfully!', lead: newLead };
    // Error handling for service call (e.g. unique constraint) will be improved later
  }

  @Get('email-recipients')
  @HttpCode(HttpStatus.OK)
  async getEmailRecipients() {
    const recipients = this.emailService.getEmailRecipients();
    return { 
      message: 'Current email recipients for lead notifications',
      recipients: recipients,
      count: recipients.length
    };
  }

  private getClientIp(req: Request): string {
    // Try to get IP from various headers (for proxies, load balancers, etc.)
    const forwarded = req.headers['x-forwarded-for'];
    const realIp = req.headers['x-real-ip'];
    const clientIp = req.headers['x-client-ip'];
    
    if (forwarded) {
      // x-forwarded-for can contain multiple IPs, get the first one
      return Array.isArray(forwarded) ? forwarded[0] : forwarded.split(',')[0].trim();
    }
    
    if (realIp) {
      return Array.isArray(realIp) ? realIp[0] : realIp;
    }
    
    if (clientIp) {
      return Array.isArray(clientIp) ? clientIp[0] : clientIp;
    }
    
    // Fallback to connection remote address
    return req.connection?.remoteAddress || req.socket?.remoteAddress || 'unknown';
  }
}