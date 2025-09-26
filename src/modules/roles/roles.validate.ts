import { z } from "zod";
import { createZodDto } from "nestjs-zod";

export const CreateRoleSchema = z.object({
    role_name: z.string().min(1, "Role name is required").max(100, "Role name too long"),
    created_by: z.number().int().positive().optional(),
});

export const UpdateRoleSchema = z.object({
    role_name: z.string().min(1, "Role name is required").max(100, "Role name too long").optional(),
});

export const AssignPermissionsToRoleSchema = z.object({
    permission_ids: z.array(z.number().int().positive()).min(1, "At least one permission is required"),
});

export const AssignRoleToUserSchema = z.object({
    user_id: z.number().int().positive(),
    role_id: z.number().int().positive(),
    assigned_by: z.number().int().positive().optional(),
});

export const RemoveRoleFromUserSchema = z.object({
    user_id: z.number().int().positive(),
    role_id: z.number().int().positive(),
});

export class CreateRoleDTO extends createZodDto(CreateRoleSchema) { }
export class UpdateRoleDTO extends createZodDto(UpdateRoleSchema) { }
export class AssignPermissionsToRoleDTO extends createZodDto(AssignPermissionsToRoleSchema) { }
export class AssignRoleToUserDTO extends createZodDto(AssignRoleToUserSchema) { }
export class RemoveRoleFromUserDTO extends createZodDto(RemoveRoleFromUserSchema) { }
