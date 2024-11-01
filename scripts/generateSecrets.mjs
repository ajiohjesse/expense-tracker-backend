import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

const secretLength = 32;
const secretFilePath = path.join(process.cwd(), '.secrets');

const generateSecret = () => {
    return crypto.randomBytes(secretLength).toString('hex');
};

const generateSecrets = () => {
    const secretsString = `ACCESS_TOKEN_SECRET=${generateSecret()}
REFRESH_TOKEN_SECRET=${generateSecret()}
COOKIE_SECRET=${generateSecret()}
PASSWORD_RESET_SECRET=${generateSecret()}
`;

    fs.writeFileSync(secretFilePath, secretsString);
};

generateSecrets();
console.log('Secrets generated successfully!');
process.exit(0);
