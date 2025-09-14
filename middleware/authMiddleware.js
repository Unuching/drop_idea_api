import { jwtVerify } from 'jose';
import dotenv from 'dotenv';
dotenv.config();
import User from '../models/User.js';
import { JWT_SECRET } from './getJWTSecret.js';

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401);
      throw new Error('Not authorized, no token');
    }



    
  } catch (err) {}
};
