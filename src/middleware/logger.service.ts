import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import * as path from 'path';

export enum LogLevel {
    ERROR = 'ERROR',
    WARN = 'WARN',
    LOG = 'LOG',
    DEBUG = 'DEBUG',
    VERBOSE = 'VERBOSE',
}

interface LogContext {
    traceId?: string;
    userId?: string;
    requestId?: string;
    [key: string]: any;
}

@Injectable()
export class CustomLoggerService {
    private readonly colors = {
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

    private getColorForLevel(level: LogLevel): string {
        switch (level) {
            case LogLevel.ERROR:
                return this.colors.red;
            case LogLevel.WARN:
                return this.colors.yellow;
            case LogLevel.LOG:
                return this.colors.green;
            case LogLevel.DEBUG:
                return this.colors.blue;
            case LogLevel.VERBOSE:
                return this.colors.magenta;
            default:
                return this.colors.white;
        }
    }

    private getCallerInfo(): { file: string; line: number; function?: string } {
        const stack = new Error().stack;
        if (!stack) {
            return { file: 'unknown', line: 0 };
        }

        const lines = stack.split('\n');
        // Skip the first few lines (Error, getCallerInfo, and the log method)
        const callerLine = lines[4] || lines[3] || lines[2];

        if (!callerLine) {
            return { file: 'unknown', line: 0 };
        }

        // Parse stack trace line to extract file and line number
        const match = callerLine.match(/at\s+(?:.*\s+)?\(?(.+):(\d+):(\d+)\)?/);
        if (match) {
            const fullPath = match[1];
            const line = parseInt(match[2], 10);
            const file = path.basename(fullPath);
            return { file, line };
        }

        return { file: 'unknown', line: 0 };
    }

    private formatTimestamp(): string {
        return new Date().toISOString();
    }

    private formatLogMessage(
        level: LogLevel,
        message: string,
        context?: LogContext,
        trace?: string
    ): string {
        const timestamp = this.formatTimestamp();
        const caller = this.getCallerInfo();
        const levelColor = this.getColorForLevel(level);
        const resetColor = this.colors.reset;
        const dimColor = this.colors.dim;
        const brightColor = this.colors.bright;

        // Build the main log line
        let logLine = [
            `${brightColor}${this.colors.cyan}[${resetColor}`,
            `${levelColor}${level}${resetColor}`,
            `${brightColor}${this.colors.cyan}]${resetColor}`,
            `${dimColor}${timestamp}${resetColor}`,
            `${brightColor}${this.colors.cyan}|${resetColor}`,
            `${dimColor}${caller.file}:${caller.line}${resetColor}`,
        ];

        // Add trace ID if available
        if (context?.traceId) {
            logLine.push(
                `${brightColor}${this.colors.cyan}|${resetColor}`,
                `${dimColor}Trace: ${context.traceId}${resetColor}`
            );
        }

        // Add the message
        logLine.push(`${brightColor}${this.colors.white}${message}${resetColor}`);

        // Add additional context if provided
        if (context && Object.keys(context).length > 0) {
            const contextStr = JSON.stringify(context, null, 2);
            logLine.push(`\n${dimColor}Context: ${contextStr}${resetColor}`);
        }

        // Add stack trace for errors
        if (trace) {
            logLine.push(`\n${dimColor}Stack: ${trace}${resetColor}`);
        }

        return logLine.join(' ');
    }

    private logInternal(level: LogLevel, message: string, context?: LogContext, trace?: string): void {
        const formattedMessage = this.formatLogMessage(level, message, context, trace);
        console.log(formattedMessage);
    }

    log(message: string, context?: LogContext): void {
        this.logInternal(LogLevel.LOG, message, context);
    }

    error(message: string, trace?: string, context?: LogContext): void {
        this.logInternal(LogLevel.ERROR, message, context, trace);
    }

    warn(message: string, context?: LogContext): void {
        this.logInternal(LogLevel.WARN, message, context);
    }

    debug(message: string, context?: LogContext): void {
        this.logInternal(LogLevel.DEBUG, message, context);
    }

    verbose(message: string, context?: LogContext): void {
        this.logInternal(LogLevel.VERBOSE, message, context);
    }

    // Helper method to extract context from Express request
    getContextFromRequest(req?: Request): LogContext {
        if (!req) return {};

        return {
            traceId: req['trace_id'],
            userId: req['user']?.id,
            method: req.method,
            url: req.url,
            userAgent: req.get('User-Agent'),
            ip: req.ip,
        };
    }

    // Method to log with automatic context extraction from request
    logWithRequest(level: LogLevel, message: string, req?: Request, additionalContext?: LogContext): void {
        const requestContext = this.getContextFromRequest(req);
        const context = { ...requestContext, ...additionalContext };

        switch (level) {
            case LogLevel.ERROR:
                this.error(message, undefined, context);
                break;
            case LogLevel.WARN:
                this.warn(message, context);
                break;
            case LogLevel.DEBUG:
                this.debug(message, context);
                break;
            case LogLevel.VERBOSE:
                this.verbose(message, context);
                break;
            default:
                this.log(message, context);
        }
    }
}
