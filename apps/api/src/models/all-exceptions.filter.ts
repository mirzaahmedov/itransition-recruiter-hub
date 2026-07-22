import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ZodValidationException } from 'nestjs-zod';
import type { Response } from 'express';
import { err } from '@/models/api';

const logger = new Logger('ExceptionFilter');

interface PrismaKnownError {
  code: string;
  meta?: Record<string, unknown>;
}

function isPrismaKnownError(error: unknown): error is PrismaKnownError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof (error as any).code === 'string' &&
    (error as any).code.startsWith('P')
  );
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof ZodValidationException) {
      status = HttpStatus.BAD_REQUEST;
      const zodError = exception.getZodError() as any;
      const issues = zodError?.issues ?? [];
      message = issues.map((issue: any) => ({
        path: issue.path?.join('.'),
        message: issue.message,
      }));
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exResponse = exception.getResponse();
      message =
        typeof exResponse === 'string'
          ? exResponse
          : ((exResponse as any).message ?? exception.message);
    } else if (isPrismaKnownError(exception)) {
      status = this.mapPrismaCode(exception.code);
      message = this.getPrismaMessage(exception);
    } else if (exception instanceof Error) {
      message = exception.message;
      logger.error(`Unhandled error: ${exception.message}`, exception.stack);
    }

    response.status(status).json(err(message));
  }

  private mapPrismaCode(code: string): number {
    switch (code) {
      case 'P2002':
        return HttpStatus.CONFLICT;
      case 'P2025':
        return HttpStatus.NOT_FOUND;
      case 'P2003':
        return HttpStatus.BAD_REQUEST;
      case 'P2014':
        return HttpStatus.BAD_REQUEST;
      default:
        return HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }

  private getPrismaMessage(error: PrismaKnownError): string {
    switch (error.code) {
      case 'P2002':
        return `Unique constraint violation on field: ${(error.meta?.target as string[])?.join(', ') ?? 'unknown'}`;
      case 'P2025':
        return 'Record not found';
      case 'P2003':
        return 'Foreign key constraint failed';
      case 'P2014':
        return 'Required relation violation';
      default:
        return `Database error: ${error.code}`;
    }
  }
}
