import * as morgan from 'morgan';
import { Request } from 'express';

morgan.token('trace_id', (req: Request) => req['trace_id']);

export const loggerMiddleware = morgan(':trace_id :method :url :status :response-time ms');
