import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import type { Response } from 'express';
import type { z } from 'zod';
import { db } from '../../../../db/index.js';
import { userTable } from '../../../../db/schema.js';
import { PublicError } from '../../../../helpers/error.helpers.js';
import { logger } from '../../../../helpers/logger.helpers.js';
import { APP_CONFIG } from '../../../../lib/app.config.js';
import { googleOauthClient } from '../../../../lib/oauth.js';
import {
    type AccessTokenPayload,
    generateAccessToken,
    generatePasswordResetToken,
    generateRefreshToken,
    verifyPasswordResetToken,
    verifyRefreshToken
} from '../../../../lib/tokens.js';
import {
    CreatePasswordSchema,
    LoginSchema,
    RegisterSchema
} from './auth.schema.js';
import type { GoogleUser } from './auth.types.js';

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

export const generateAndSetUserTokens = async (
    tokenPayload: AccessTokenPayload,
    res: Response
) => {
    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken({
        userId: tokenPayload.userId
    });

    res.cookie(APP_CONFIG.refreshCookieName, refreshToken, {
        httpOnly: true,
        secure: APP_CONFIG.nodeEnv === 'production',
        sameSite: 'lax',
        maxAge: APP_CONFIG.refreshCookieExpiry,
        signed: true
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

export const sendPasswordResetEmail = async (email: string) => {
    const user = await db.query.userTable.findFirst({
        where: (table, { eq }) => eq(table.email, email)
    });

    if (user) {
        const resetToken = generatePasswordResetToken({ userId: user.id });
        //TODO: send email with reset token
    }
};

export const createNewPassword = async (
    payload: z.infer<typeof CreatePasswordSchema>
) => {
    const { resetToken, password } = payload;

    const tokenPayload = verifyPasswordResetToken(resetToken);

    if (!tokenPayload) {
        throw new PublicError(401, 'Invalid or expired reset token');
    }

    const user = await db.query.userTable.findFirst({
        where: (table, { eq }) => eq(table.id, tokenPayload.userId)
    });

    if (!user) {
        throw new PublicError(401, 'Invalid or expired reset token');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await db
        .update(userTable)
        .set({ passwordHash: hashedPassword })
        .where(eq(userTable.id, user.id));
};

export const loginGoogleUser = async (
    payload: {
        code: string;
        codeVerifier: string;
    },
    response: Response
) => {
    const { code, codeVerifier } = payload;
    try {
        const tokens = await googleOauthClient.validateAuthorizationCode(
            code,
            codeVerifier
        );

        const results = await fetch(
            'https://openidconnect.googleapis.com/v1/userinfo',
            {
                headers: {
                    Authorization: `Bearer ${tokens.accessToken}`
                }
            }
        );

        const googleUser: GoogleUser = await results.json();

        const existingAccount = await db.query.userTable.findFirst({
            where: (table, { eq }) => eq(table.email, googleUser.email)
        });

        if (!existingAccount) {
            const [newAccount] = await db
                .insert(userTable)
                .values({
                    email: googleUser.email,
                    googleId: googleUser.sub,
                    fullName:
                        googleUser.given_name + ' ' + googleUser.family_name,
                    isEmailVerified: true
                })
                .returning();

            const { accessToken } = await generateAndSetUserTokens(
                {
                    userId: newAccount.id,
                    issuedVia: 'login'
                },
                response
            );

            return { user: newAccount, accessToken };
        }

        if (!existingAccount.googleId) {
            await db
                .update(userTable)
                .set({ isEmailVerified: true, googleId: googleUser.sub })
                .where(eq(userTable.id, existingAccount.id));
        }

        const { accessToken } = await generateAndSetUserTokens(
            {
                userId: existingAccount.id,
                issuedVia: 'login'
            },
            response
        );

        return { user: existingAccount, accessToken };
    } catch (error) {
        logger.error(error);
        throw new PublicError(500, 'Unable to login with Google');
    }
};
