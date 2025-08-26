import * as morgan from 'morgan';
import { Request } from 'express';

// ANSI color codes for better readability
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    dim: '\x1b[2m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    gray: '\x1b[90m',
};

const colorMethod = (method: string) => {
    switch (method) {
        case 'GET':
            return `${colors.green}${method}${colors.reset}`;
        case 'POST':
            return `${colors.blue}${method}${colors.reset}`;
        case 'PUT':
            return `${colors.yellow}${method}${colors.reset}`;
        case 'DELETE':
            return `${colors.red}${method}${colors.reset}`;
        case 'PATCH':
            return `${colors.magenta}${method}${colors.reset}`;
        default:
            return `${colors.gray}${method}${colors.reset}`;
    }
};

const colorStatus = (status: string) => {
    const statusNum = parseInt(status);
    if (statusNum >= 200 && statusNum < 300) {
        return `${colors.green}${status}${colors.reset}`;
    } else if (statusNum >= 300 && statusNum < 400) {
        return `${colors.blue}${status}${colors.reset}`;
    } else if (statusNum >= 400 && statusNum < 500) {
        return `${colors.yellow}${status}${colors.reset}`;
    } else if (statusNum >= 500) {
        return `${colors.red}${status}${colors.reset}`;
    }
    return `${colors.gray}${status}${colors.reset}`;
};

const colorResponseTime = (time: string) => {
    const timeNum = parseFloat(time);
    if (timeNum < 100) {
        return `${colors.green}${time}ms${colors.reset}`;
    } else if (timeNum < 500) {
        return `${colors.yellow}${time}ms${colors.reset}`;
    } else {
        return `${colors.red}${time}ms${colors.reset}`;
    }
};

morgan.token('trace_id', (req: Request) => req['trace_id']);
morgan.token('colored_method', (req: Request) => colorMethod(req.method));
morgan.token('colored_status', (req: Request, res: any) => colorStatus(res.statusCode?.toString() || '0'));
morgan.token('colored_response_time', (req: Request, res: any) => {
    const time = morgan['response-time'](req, res);
    return time ? colorResponseTime(time) : '0ms';
});

const customFormat = [
    `${colors.bright}${colors.cyan}[${colors.reset}`,
    ':colored_method',
    `${colors.bright}${colors.cyan}]${colors.reset}`,
    `${colors.bright}${colors.white}:url${colors.reset}`,
    `${colors.bright}${colors.cyan}|${colors.reset}`,
    ':colored_status',
    `${colors.bright}${colors.cyan}|${colors.reset}`,
    ':colored_response_time',
    `${colors.bright}${colors.cyan}|${colors.reset}`,
    `${colors.dim}${colors.gray}Trace: :trace_id${colors.reset}`,
].join(' ');

export const loggerMiddleware = morgan(customFormat);
