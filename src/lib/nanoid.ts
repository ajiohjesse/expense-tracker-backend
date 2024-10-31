import { customAlphabet } from 'nanoid';
const alphabets = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

export const generateDatabaseId = customAlphabet(alphabets, 10);
export const generateSessionId = customAlphabet(alphabets, 20);
