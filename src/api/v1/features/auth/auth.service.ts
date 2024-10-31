import { db } from '@/db/index.js';
import { userTable } from '@/db/schema.js';
import { PublicError } from '@/helpers/error.helpers.js';
import { APP_CONFIG } from '@/lib/app.config.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken, type AccessTokenPayload } from '@/lib/tokens.js';
import bcrypt from 'bcryptjs';
import type { Response } from 'express';
import type { z } from 'zod';
import { LoginSchema, RegisterSchema } from './auth.schema.js';

export const login = async (payload: z.infer<typeof LoginSchema>) => {
    const { email, password } = payload;
    const user = await db.query.userTable.findFirst({
        where: (table, { eq }) => eq(table.email, email)
    });

    if (!user || !user.passwordHash) {
        throw new PublicError(401, 'Incorrect email or password');
    }

    const isPasswordCorrect = bcrypt.compare(password, user.passwordHash);
    if (!isPasswordCorrect) {
        throw new PublicError(401, 'Incorrect email or password');
    }

    return { user };
};

export const generateAndSetUserTokens = async (tokenPayload: AccessTokenPayload, res: Response) => {
    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken({ userId: tokenPayload.userId });

    res.cookie(APP_CONFIG.refreshCookieName, refreshToken, {
        httpOnly: true,
        secure: APP_CONFIG.nodeEnv === 'production',
        sameSite: 'lax',
        maxAge: APP_CONFIG.refreshCookieExpiry
    });

    return { accessToken };
};

export const validateRefreshToken = async (refreshToken?: string) => {
    if (!refreshToken) {
        throw new PublicError(401, 'Refresh token not found');
    }

    const refreshTokenPayload = verifyRefreshToken(refreshToken);

    if (!refreshTokenPayload) {
        throw new PublicError(401, 'Invalid refresh token');
    }

    const user = await db.query.userTable.findFirst({
        where: (table, { eq }) => eq(table.id, refreshTokenPayload.userId)
    });

    if (!user) {
        throw new PublicError(401, 'Invalid refresh token');
    }

    return { user };
};

export const register = async (payload: z.infer<typeof RegisterSchema>) => {
    const { email, fullName, password } = payload;
    const existingUser = await db.query.userTable.findFirst({
        where: (table, { eq }) => eq(table.email, email)
    });

    if (existingUser) {
        throw new PublicError(409, 'This email is already registered');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const [user] = await db
        .insert(userTable)
        .values({
            email,
            fullName,
            passwordHash: hashedPassword,
            isEmailVerified: false
        })
        .returning();

    return { user };
};
