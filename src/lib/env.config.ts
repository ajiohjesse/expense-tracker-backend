import dotenv from 'dotenv';

const nodeEnv = process.env.NODE_ENV;

const dotenvPath =
    nodeEnv === 'test'
        ? '.env.test'
        : nodeEnv === 'staging'
          ? '.env.staging'
          : nodeEnv === 'production'
            ? '.env.production'
            : undefined;

export const envConfig = () => {
    dotenv.config({ path: dotenvPath });
};
