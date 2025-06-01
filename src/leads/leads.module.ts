import { Module } from '@nestjs/common';
import { LeadsController } from './leads.controller';
import { LeadsService } from './leads.service';
import { PrismaService } from '../prisma.service';
import { EmailService } from '../common/email.service';
import { GoogleSheetsService } from '../common/google-sheets.service';

@Module({
  controllers: [LeadsController],
  providers: [LeadsService, PrismaService, EmailService, GoogleSheetsService]
})
export class LeadsModule {}
