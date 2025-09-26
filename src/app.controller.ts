import { Controller, Get, LoggerService } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private logger: LoggerService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
