import { expect, describe, it } from 'vitest';
import request from 'supertest';
import { app } from '../src/server.js';

describe('Application', () => {
    it('should start with the proper test environment', async () => {
        expect(process.env.NODE_ENV).toBe('test');
    }, 10000);

    it('should return 200 on /check/health', async () => {
        const response = await request(app).get('/check/health');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ success: true, data: 'Server is running', message: 'Operation successful' });
    });

    it('should return 200 with correct test environment on /check/env', async () => {
        const response = await request(app).get('/check/env');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ success: true, message: 'Operation successful', data: { environment: 'test' } });
    });

    it('should return 404 for non-existent routes', async () => {
        const response = await request(app).get('/this/route/does/not/exists');

        expect(response.status).toBe(404);
        expect(response.body).toEqual({ success: false, message: 'Resource Not found', data: null });
    });
});
