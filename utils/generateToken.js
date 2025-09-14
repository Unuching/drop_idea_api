import { SignJWT } from 'jose';
import { JWT_SECRET } from './getJwtSecret.js';

// generates a JWT token
// @param {onject} payload -- Data to embed in token
// @param {string} expiresIn - Expiration time(ex - "15 min", '7d')

export const generateToken = async (payload, expiresIn = '15m') => {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(JWT_SECRET);
};
