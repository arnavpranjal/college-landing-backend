import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { LeadsModule } from './leads/leads.module';

@Module({
  imports: [LeadsModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
//