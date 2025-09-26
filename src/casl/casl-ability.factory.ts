import {
    AbilityBuilder,
    AbilityClass,
    ExtractSubjectType,
    InferSubjects,
    PureAbility,
} from '@casl/ability';

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AssistUser } from '@prisma/client';

export enum Action {
    Manage = 'manage',
    Create = 'create',
    Read = 'read',
    Update = 'update',
    Delete = 'delete',
};

type Subject = string | 'all';

export type AppAbility = PureAbility<[Action, Subject]>


@Injectable()
export class CaslAbilityFactory {

    constructor(private prisma: PrismaService) { }

    async createForUser(user: AssistUser) {
        const { can, build } = new AbilityBuilder<AppAbility>(
            PureAbility as AbilityClass<AppAbility>
        );

        // const dbUser = await this.prisma.assistUser.findUnique({
        //     where: { id: user.id },
        //     include: {
        //         userRoles: {
        //             include: {
        //                 role: {
        //                     include: {
        //                         roleAccess: {
        //                             include: {
        //                                 permission: {
        //                                     include: {
        //                                         resourcePermissions: {
        //                                             include: { resource: { include: { module: true } } },
        //                                         },
        //                                     },
        //                                 },
        //                             },
        //                         },
        //                     },
        //                 },
        //             },
        //         },
        //     },
        // });

        // if (!dbUser) return build();

        // Basic permissions - you can expand this based on your business logic
        // For now, giving basic read permissions to all authenticated users
        // In production, you should implement proper role-based permissions

        can(Action.Read, 'AssistUser');
        can(Action.Read, 'AssistRole');
        can(Action.Read, 'AssistResource');
        can(Action.Read, 'AssistModule');
        can(Action.Read, 'AssistPermission');

        // Admin permissions (you can modify this based on your business logic)
        can(Action.Manage, 'all');

        return build();
    }

}