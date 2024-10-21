import dotenv from 'dotenv';

const nodeEnv = process.env.NODE_ENV;

const dotenvPath = nodeEnv === 'test' ? '.env.test' : nodeEnv === 'staging' ? '.env.staging' : '.env.local';

export const envConfig = () => {
    dotenv.config({ path: dotenvPath });
};
