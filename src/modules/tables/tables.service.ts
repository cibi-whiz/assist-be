import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TablesService {

    constructor(private prismaService: PrismaService) { }

    async getTables() {
        const response = await this.prismaService.$queryRaw<{ table_name: string, rowCount: number }[]>(
            Prisma.sql`
                SELECT table_name as name
                FROM information_schema.tables
                WHERE table_schema = 'public'
            `);

        console.log(response)

        return response;
    }

    async getTableSchema(table_name: string) {
        const response = await this.prismaService.$queryRaw<{ column_name: string, data_type: string }[]>(
            Prisma.sql`
                SELECT
                    c.column_name,
                    c.data_type,
                    c.udt_name,
                    c.is_nullable,
                    c.column_default,
                    tc.constraint_type
                FROM information_schema.columns c
                LEFT JOIN information_schema.key_column_usage kcu
                    ON c.table_name = kcu.table_name
                    AND c.column_name = kcu.column_name
                    AND c.table_schema = kcu.table_schema
                LEFT JOIN information_schema.table_constraints tc
                    ON tc.constraint_name = kcu.constraint_name
                    AND tc.constraint_type = 'PRIMARY KEY'
                    AND tc.table_name = c.table_name
                    AND tc.table_schema = c.table_schema
                WHERE c.table_name = ${table_name}
                    AND c.table_schema = 'public'
            `);

        console.log(response)
        return response;
    }

    async addEntryInTable(table_name: string, payload: Record<string, any>) {
        const columns = Object.keys(payload);
        const values = Object.values(payload);

        const valueExpressions = values.map(value => Prisma.sql`${value}`);

        const query = Prisma.sql`
            INSERT INTO ${Prisma.raw(table_name)} (
            ${Prisma.join(columns.map(col => Prisma.raw(col)))}
            ) VALUES (
            ${Prisma.join(valueExpressions)}
            )
            RETURNING *
        `;

        const response = await this.prismaService.$queryRaw(query);
        return response;
    }


    async getTableData(table_name: string, payload: Record<string, any>) {
        const {
            search,
            searchField,
            filters = {},
            limit = 10,
            offset = 0,
            sortBy,
            sortOrder,
        } = payload;

        const allowedSortOrder = ['ASC', 'DESC'];
        const safeSortOrder = allowedSortOrder.includes((sortOrder || '').toUpperCase())
            ? sortOrder.toUpperCase()
            : 'ASC';

        const filterConditions: string[] = [];

        for (const [field, value] of Object.entries(filters)) {
            if (field && value) filterConditions.push(`"${field}" = '${value}'`);
        }

        if (search && searchField) {
            filterConditions.push(`"${searchField}" ILIKE '%${search}%'`);
        }

        const whereClause = filterConditions.length
            ? `WHERE ${filterConditions.join(' AND ')}`
            : '';

        const sortClause = sortBy
            ? `ORDER BY "${sortBy}" ${safeSortOrder}`
            : '';

        const query = `
            SELECT * FROM "${table_name}"
            ${whereClause}
            ${sortClause}
            LIMIT ${limit}
            OFFSET ${offset}
        `;

        const countQuery = `
            SELECT COUNT(*) FROM "${table_name}"
            ${whereClause}
        `;

        const [count, data] = await Promise.all([
            this.prismaService.$queryRawUnsafe(countQuery),
            this.prismaService.$queryRawUnsafe(query)
        ])

        return {
            data,
            total_count: Number((count as any[])[0]['count']),
        };
    }



    async updateEntryInTable(table_name: string, payload: Record<string, any>) {
        const updateData = payload.updateData;
        const condition = payload.condition;

        const setClauses = Object.entries(updateData).map(([key, value]) =>
            Prisma.sql`${Prisma.raw(key)} = ${value}`
        );

        const whereClauses = Object.entries(condition).map(([key, value]) =>
            Prisma.sql`${Prisma.raw(key)} = ${value}`
        );

        const query = Prisma.sql`
            UPDATE ${Prisma.raw(table_name)}
            SET ${Prisma.join(setClauses)}
            WHERE ${Prisma.join(whereClauses, ` AND `)}
            RETURNING *
        `;

        const response = await this.prismaService.$queryRaw(query);
        return response;
    }



    async deleteEntryInTable(table_name: string, payload: Record<string, any>) {
        const whereCondition = payload.condition;

        const whereClauses = Object.entries(whereCondition).map(([key, value]) =>
            Prisma.sql`${Prisma.raw(key)} = ${value}`
        );

        const query = Prisma.sql`
            DELETE FROM ${Prisma.raw(table_name)}
            WHERE ${Prisma.join(whereClauses, ` AND `)}
        `;

        const response = await this.prismaService.$queryRaw(query);
        return response;
    }
}