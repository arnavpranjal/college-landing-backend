// src/common/filters/prisma-client-exception.filter.ts
import { ArgumentsHost, Catch, HttpStatus, ExceptionFilter } from '@nestjs/common';
import { Prisma } from '@prisma/client'; // Import Prisma namespace
import { Response } from 'express'; // If using Express

@Catch(Prisma.PrismaClientKnownRequestError) // Catch only Prisma known request errors
export class PrismaClientExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>(); // For logging if needed

    console.error(
      `Prisma Error Caught by Filter: Code - ${exception.code}, Meta - ${JSON.stringify(exception.meta)}, Path - ${request.url}`
    );


    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'An internal server error occurred while processing your request.';

    switch (exception.code) {
      case 'P2002': // Unique constraint failed
        status = HttpStatus.CONFLICT; // 409 Conflict
        // The 'meta.target' field often contains the field(s) that caused the unique constraint violation.
        // Example: meta: { target: ['email'] }
        const target = exception.meta?.target as string[] | undefined;
        if (target && target.length > 0) {
          // Make the message more specific if possible
          message = `The provided ${target.join(' and ')} is already in use. Please choose a different one.`;
        } else {
          message = 'A record with this identifier already exists. Please use a unique value.';
        }
        break;
      // You can add more Prisma error codes here as needed
      // case 'P2025': // Record to update/delete does not exist
      //   status = HttpStatus.NOT_FOUND;
      //   message = 'The requested resource was not found.';
      //   break;
      default:
        // For other Prisma errors not specifically handled, keep generic message or log more details.
        console.error(`Unhandled Prisma Error Code: ${exception.code}`, exception);
        break;
    }

    response.status(status).json({
      statusCode: status,
      message: message,
      timestamp: new Date().toISOString(),
      path: request.url, // Or use ctx.getRequest().url
    });
  }
}