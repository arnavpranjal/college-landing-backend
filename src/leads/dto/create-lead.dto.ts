// src/leads/dto/create-lead.dto.ts
import { IsString, IsEmail, IsNotEmpty, IsBoolean, Matches, MinLength, MaxLength, IsOptional, IsIP } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateLeadDto {
  @IsNotEmpty({ message: 'Full name is required.' })
  @IsString({ message: 'Full name must be a string.' })
  @MinLength(2, { message: 'Full name must be at least 2 characters long.' })
  @MaxLength(100, { message: 'Full name must be at most 100 characters long.' })
  fullName: string;

  @IsNotEmpty({ message: 'Email address is required.' })
  @IsEmail({}, { message: 'Please provide a valid email address.' })
  @MaxLength(255, { message: 'Email address must be at most 255 characters long.' })
  email: string;

  @IsNotEmpty({ message: 'Mobile phone number is required.' })
  @IsString({ message: 'Mobile phone number must be a string.' })
  // Basic regex for international phone numbers: starts with +, then digits.
  // FR002.1: "Validated for country code + number format"
  // This regex is a basic example. Production might need a more robust library for phone number validation.
  @Matches(/^\+[1-9]\d{1,14}$/, {
    message: 'Mobile phone number must be in a valid international format (e.g., +1234567890).',
  })
  @MinLength(8, { message: 'Mobile phone number seems too short.'}) // e.g. +1234567
  @MaxLength(20, { message: 'Mobile phone number seems too long.'})
  mobilePhone: string;

  @IsNotEmpty({ message: 'College name is required.' })
  @IsString({ message: 'College name must be a string.' })
  @MinLength(2, { message: 'College name must be at least 2 characters long.' })
  @MaxLength(100, { message: 'College name must be at most 100 characters long.' })
  collegeName: string;

  @IsOptional()
  @IsIP(undefined, { message: 'IP address must be a valid IPv4 or IPv6 address.' })
  ipAddress?: string;

  @IsOptional()
  @IsBoolean({ message: 'Consent must be a boolean value (true or false).' })
  consent?: boolean;
}