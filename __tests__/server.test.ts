import { shutdownServer } from '@/server.js';
import request from 'supertest';

const BASE_URL = process.env.BASE_URL || `http://localhost:8080`;

describe('Application', () => {
    // beforeAll(async () => {});

    afterAll((done) => {
        shutdownServer(done);
    });

    it('Starts with the proper test environment', async () => {
        expect(process.env.NODE_ENV).toBe('test');
    }, 10000);

    it('should return 200 on /check/health', async () => {
        const response = await request(BASE_URL).get('/check/health');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ success: true, data: 'Server is running', message: 'Operation successful' });
    });

    it('should return 200 with correct test environment on /check/env', async () => {
        const response = await request(BASE_URL).get('/check/env');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ success: true, message: 'Operation successful', data: { environment: 'test' } });
    });
});
