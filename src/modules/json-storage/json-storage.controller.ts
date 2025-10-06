import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { JsonStorageService } from './json-storage.service';

@Controller('json-storage')
export class JsonStorageController {
    constructor(private readonly jsonStorageService: JsonStorageService) { }

    @Post()
    async addJsonDocument(@Body() payload: Record<string, any>) {
        const response = await this.jsonStorageService.addJsonDocument(payload);
        return response;
    }

    @Get(':id')
    async getJsonDocument(@Param('id') id: string) {
        const response = await this.jsonStorageService.getJsonDocument(id);
        return response;
    }
}