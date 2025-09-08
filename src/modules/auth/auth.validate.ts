import { z } from "zod";
import { createZodDto } from "nestjs-zod";

export const LoginSchema = z.object({
    email: z.email(),
    password: z.string().min(8),
});

export const RegisterSchema = z.object({
    email: z.email(),
    password: z.string().min(8),
    name: z.string(),
});

export class LoginDTO extends createZodDto(LoginSchema) { }
export class RegisterDTO extends createZodDto(RegisterSchema) { }