import { z } from 'zod';

export const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string()
});

export const RegisterSchema = z.object({
    email: z.string().email(),
    fullName: z.string(),
    password: z.string()
});

export const ResetPasswordSchema = z.object({
    email: z.string().email()
});

export const CreatePasswordSchema = z.object({
    resetToken: z.string(),
    password: z.string()
});

export const GoogleOauthQuerySchema = z.object({
    code: z.string(),
    state: z.string()
});
