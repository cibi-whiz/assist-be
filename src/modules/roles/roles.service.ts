import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
    CreateRoleDTO,
    UpdateRoleDTO,
    AssignPermissionsToRoleDTO,
    AssignRoleToUserDTO,
    RemoveRoleFromUserDTO
} from './roles.validate';

@Injectable()
export class RolesService {
    constructor(private readonly prisma: PrismaService) { }

    async createRole(payload: CreateRoleDTO) {
        const { role_name, created_by = 1 } = payload;

        const existingRole = await this.prisma.assistRole.findFirst({
            where: { role_name }
        });

        if (existingRole) {
            throw new ConflictException('Role with this name already exists');
        }

        return this.prisma.assistRole.create({
            data: {
                role_name,
                created_by,
            },
            include: {
                roleAccess: {
                    include: {
                        permission: true
                    }
                },
                userRoles: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true
                            }
                        }
                    }
                }
            }
        });
    }

    async getAllRoles() {
        return this.prisma.assistRole.findMany({
            include: {
                roleAccess: {
                    include: {
                        permission: true
                    }
                },
                userRoles: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                created_at: 'desc'
            }
        });
    }

    async getRoleById(id: number) {
        const role = await this.prisma.assistRole.findUnique({
            where: { id },
            include: {
                roleAccess: {
                    include: {
                        permission: true
                    }
                },
                userRoles: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true
                            }
                        }
                    }
                }
            }
        });

        if (!role) {
            throw new NotFoundException('Role not found');
        }

        return role;
    }

    async updateRole(id: number, payload: UpdateRoleDTO) {
        const role = await this.getRoleById(id);

        if (payload.role_name && payload.role_name !== role.role_name) {
            const existingRole = await this.prisma.assistRole.findFirst({
                where: {
                    role_name: payload.role_name,
                    id: { not: id }
                }
            });

            if (existingRole) {
                throw new ConflictException('Role with this name already exists');
            }
        }

        return this.prisma.assistRole.update({
            where: { id },
            data: payload,
            include: {
                roleAccess: {
                    include: {
                        permission: true
                    }
                },
                userRoles: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true
                            }
                        }
                    }
                }
            }
        });
    }

    async deleteRole(id: number) {
        await this.getRoleById(id);

        const userRoles = await this.prisma.assistUserRole.findMany({
            where: { role_id: id }
        });

        if (userRoles.length > 0) {
            throw new BadRequestException('Cannot delete role that is assigned to users');
        }

        await this.prisma.assistRoleAccess.deleteMany({
            where: { role_id: id }
        });

        return this.prisma.assistRole.delete({
            where: { id }
        });
    }

    // Permission Management for Roles
    async assignPermissionsToRole(roleId: number, payload: AssignPermissionsToRoleDTO) {
        await this.getRoleById(roleId);

        const { permission_ids } = payload;

        // Verify all permissions exist
        const permissions = await this.prisma.assistPermission.findMany({
            where: { id: { in: permission_ids } }
        });

        if (permissions.length !== permission_ids.length) {
            throw new BadRequestException('One or more permissions not found');
        }

        // Remove existing permissions for this role
        await this.prisma.assistRoleAccess.deleteMany({
            where: { role_id: roleId }
        });

        // Add new permissions
        const roleAccessData = permission_ids.map(permission_id => ({
            role_id: roleId,
            permission_id
        }));

        await this.prisma.assistRoleAccess.createMany({
            data: roleAccessData
        });

        return this.getRoleById(roleId);
    }

    async getRolePermissions(roleId: number) {
        await this.getRoleById(roleId);

        return this.prisma.assistRoleAccess.findMany({
            where: { role_id: roleId },
            include: {
                permission: true
            }
        });
    }

    // User Role Assignment
    async assignRoleToUser(payload: AssignRoleToUserDTO) {
        const { user_id, role_id, assigned_by = 1 } = payload;

        // Verify user exists
        const user = await this.prisma.assistUser.findUnique({
            where: { id: user_id }
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        // Verify role exists
        await this.getRoleById(role_id);

        // Check if user already has this role
        const existingUserRole = await this.prisma.assistUserRole.findFirst({
            where: { user_id, role_id }
        });

        if (existingUserRole) {
            throw new ConflictException('User already has this role');
        }

        return this.prisma.assistUserRole.create({
            data: {
                user_id,
                role_id,
                assigned_by
            },
            include: {
                role: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });
    }

    async removeRoleFromUser(payload: RemoveRoleFromUserDTO) {
        const { user_id, role_id } = payload;

        const userRole = await this.prisma.assistUserRole.findFirst({
            where: { user_id, role_id }
        });

        if (!userRole) {
            throw new NotFoundException('User role assignment not found');
        }

        return this.prisma.assistUserRole.delete({
            where: { id: userRole.id }
        });
    }

    async getUserRoles(userId: number) {
        const user = await this.prisma.assistUser.findUnique({
            where: { id: userId }
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return this.prisma.assistUserRole.findMany({
            where: { user_id: userId },
            include: {
                role: {
                    include: {
                        roleAccess: {
                            include: {
                                permission: true
                            }
                        }
                    }
                }
            }
        });
    }
}