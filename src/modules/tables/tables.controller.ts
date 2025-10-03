import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { TablesService } from './tables.service';

@Controller('tables')
export class TablesController {
    constructor(private readonly tableService: TablesService) { }

    @Get('')
    getTables() {
        return this.tableService.getTables();
    }

    @Get('/:table_name/schema')
    getTableSchema(@Param('table_name') table_name: string) {
        return this.tableService.getTableSchema(table_name);
    }

    @Post('/:table_name/create')
    addEntryInTable(@Param('table_name') table_name: string, @Body() payload: any) {
        return this.tableService.addEntryInTable(table_name, payload);
    }

    @Post('/:table_name/data')
    getTableDate(@Param('table_name') table_name: string, @Body() payload: any) {
        return this.tableService.getTableData(table_name, payload);
    }

    @Put('/:table_name/update')
    updateEntryInTable(@Param('table_name') table_name: string, @Body() payload: any) {
        return this.tableService.updateEntryInTable(table_name, payload);
    }

    @Delete('/:table_name/delete')
    deleteEntryInTable(@Param('table_name') table_name: string, @Body() payload: any) {
        return this.tableService.deleteEntryInTable(table_name, payload);
    }
}



