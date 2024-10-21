import type { Config } from 'jest';

const config: Config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/__tests__'],
    detectOpenHandles: true,
    maxWorkers: 1
};

export default config;
