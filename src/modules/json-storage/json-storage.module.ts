import { Module } from '@nestjs/common';
import { JsonStorageService } from './json-storage.service';
import { JsonStorageController } from './json-storage.controller';

@Module({
    controllers: [JsonStorageController],
    providers: [JsonStorageService],
    exports: [JsonStorageService],
})
export class JsonStorageModule { }
