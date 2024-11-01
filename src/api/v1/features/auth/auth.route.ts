import { generateCodeVerifier, generateState } from 'arctic';
import { Router } from 'express';
import {
    validateRequestBody,
    validateRequestQuery
} from 'zod-express-middleware';
import {
    createErrorResponse,
    createSuccessResponse
} from '../../../../helpers/response.helpers.js';
import { APP_CONFIG } from '../../../../lib/app.config.js';
import { googleOauthClient } from '../../../../lib/oauth.js';
import {
    CreatePasswordSchema,
    GoogleOauthQuerySchema,
    LoginSchema,
    RegisterSchema,
    ResetPasswordSchema
} from './auth.schema.js';
import * as authService from './auth.service.js';

const router = Router();
export { router as authRoute };

router.post(
    '/login',
    validateRequestBody(LoginSchema),
    async (request, response) => {
        const { user } = await authService.login(request.body);

        const { accessToken } = await authService.generateAndSetUserTokens(
            { userId: user.id, issuedVia: 'login' },
            response
        );

        return response.status(200).json(
            createSuccessResponse(
                {
                    email: user.email,
                    name: user.fullName,
                    accessToken
                },
                'Login successful'
            )
        );
    }
);

router.get('/refresh', async (request, response) => {
    const refreshToken = request.signedCookies[APP_CONFIG.refreshCookieName];

    const { user } = await authService.validateRefreshToken(refreshToken);

    const { accessToken } = await authService.generateAndSetUserTokens(
        { userId: user.id, issuedVia: 'refresh' },
        response
    );

    return response
        .status(200)
        .json(createSuccessResponse({ accessToken }, 'Refresh successful'));
});

router.post(
    '/register',
    validateRequestBody(RegisterSchema),
    async (request, response) => {
        const { user } = await authService.register(request.body);

        const { accessToken } = await authService.generateAndSetUserTokens(
            { userId: user.id, issuedVia: 'login' },
            response
        );

        return response.status(201).json(
            createSuccessResponse(
                {
                    email: user.email,
                    name: user.fullName,
                    accessToken
                },
                'Registration successful'
            )
        );
    }
);

router.post(
    '/reset-password',
    validateRequestBody(ResetPasswordSchema),
    async (request, response) => {
        await authService.sendPasswordResetEmail(request.body.email);

        return response
            .status(200)
            .json(
                createSuccessResponse(
                    null,
                    'We will send an email to your inbox shortly if your email is registred'
                )
            );
    }
);

router.post(
    '/create-password',
    validateRequestBody(CreatePasswordSchema),
    async (request, response) => {
        await authService.createNewPassword(request.body);

        return response
            .clearCookie(APP_CONFIG.refreshCookieName)
            .status(201)
            .json(createSuccessResponse(null, 'Password updated successfully'));
    }
);

router.get('/google', async (_, response) => {
    const codeVerifier = generateCodeVerifier();
    const state = generateState();
    const url = googleOauthClient.createAuthorizationURL(state, codeVerifier, [
        'profile',
        'email'
    ]);

    response.cookie(APP_CONFIG.googleStateCookieName, state, {
        secure: APP_CONFIG.nodeEnv === 'production',
        path: '/',
        sameSite: 'lax',
        httpOnly: true,
        maxAge: APP_CONFIG.googleAuthCookieMaxAge,
        signed: true
    });

    response.redirect(url.toString());
});

router.get(
    '/google/callback',
    validateRequestQuery(GoogleOauthQuerySchema),
    async (request, response) => {
        const { state, code } = request.query;

        const storedState =
            request.signedCookies[APP_CONFIG.googleStateCookieName];
        const codeVerifier =
            request.signedCookies[APP_CONFIG.googleCodeVerifierCookieName];

        if (!storedState || !codeVerifier || state !== storedState) {
            return response
                .status(400)
                .json(createErrorResponse('Invalid request'));
        }

        const { user, accessToken } = await authService.loginGoogleUser(
            {
                code,
                codeVerifier
            },
            response
        );

        return response.status(200).json(
            createSuccessResponse(
                {
                    email: user.email,
                    name: user.fullName,
                    accessToken
                },
                'Login successful'
            )
        );
    }
);
