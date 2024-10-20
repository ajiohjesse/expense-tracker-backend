const config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/__tests__'],
    detectOpenHandles: true,
    maxWorkers: 1,
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1' // Map @/ to the src directory
    }
};

module.exports = config;
