import { Router } from 'express';
import { validateRequestBody } from 'zod-express-middleware';
import { createSuccessResponse } from '../../../../helpers/response.helpers.js';
import { APP_CONFIG } from '../../../../lib/app.config.js';
import { LoginSchema, RegisterSchema } from './auth.schema.js';
import * as authService from './auth.service.js';

const router = Router();
export { router as authRoute };

router.post('/login', validateRequestBody(LoginSchema), async (request, response) => {
    const { user } = await authService.login(request.body);

    const { accessToken } = await authService.generateAndSetUserTokens({ userId: user.id, issuedVia: 'login' }, response);

    return response.status(200).json(createSuccessResponse({ email: user.email, name: user.fullName, accessToken }, 'Login successful'));
});

router.get('/refresh', async (request, response) => {
    const refreshToken = request.signedCookies[APP_CONFIG.refreshCookieName];
    const { user } = await authService.validateRefreshToken(refreshToken);

    const { accessToken } = await authService.generateAndSetUserTokens({ userId: user.id, issuedVia: 'refresh' }, response);

    return response.status(200).json(createSuccessResponse({ accessToken }, 'Refresh successful'));
});

router.post('/register', validateRequestBody(RegisterSchema), async (request, response) => {
    const { user } = await authService.register(request.body);

    const { accessToken } = await authService.generateAndSetUserTokens({ userId: user.id, issuedVia: 'login' }, response);

    return response.status(201).json(createSuccessResponse({ email: user.email, name: user.fullName, accessToken }, 'Registration successful'));
});
