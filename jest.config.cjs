const config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/__tests__'],
    detectOpenHandles: true,
    maxWorkers: 1
};

module.exports = config;
