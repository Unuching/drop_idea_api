import express from 'express';
import User from '../models/User.js';
import { jwtVerify } from 'jose';
import { JWT_SECRET } from '../utils/getJwtSecret.js';
import { generateToken } from '../utils/generateToken.js';

const router = express.Router();

// @Routes                  POST api/auth/register
// @description              register new user
// @access                  public

router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) {
      res.status(400);
      throw new Error('All fields are required.');
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400);
      throw new Error('User already exists.');
    }

    const user = await User.create({ name, email, password });

    // create tokens
    const payload = { useId: user._id.toString() };
    const accessToken = await generateToken(payload, '1m');
    const refreshToken = await generateToken(payload, '30d');

    // set refresh token in http only cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.status(201).json({
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.log(err);

    next(err);
  }
});
// @Routes                  POST api/auth/login
// @description             authenticate user
// @access                  public
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      res.status(400);
      throw new Error('Email and password required');
    }
    // find user
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401);
      throw new Error('Invalid credentials.');
    }

    //check if pasword matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      res.status(401);
      throw new Error('Invalid credentials.');
    }
    // create tokens
    const payload = { useId: user._id.toString() };
    const accessToken = await generateToken(payload, '1m');
    const refreshToken = await generateToken(payload, '30d');

    // set refresh token in http only cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.status(201).json({
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.log(err);

    next(err);
  }
});

// @Routes                  POST api/auth/logout
// @description             logout user and clear refresh token
// @access                  private

router.post('/logout', (req, res) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'none',
  });
  res.status(200).json({ message: 'Loggout out successfully' });
});

// @Routes                  POST api/auth/refresh
// @description             Generate new access token from refresh token
// @access                  public (need valid refresh token in cookie)

router.post('/refresh', async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken;
    console.log('Refreshing token ....');

    if (!token) {
      res.status(401);
      throw new Error('No refresh token.');
    }
    const { payload } = await jwtVerify(token, JWT_SECRET);

    const user = await User.findById(payload.useId);
    if (!user) {
      res.status(401);
      throw new Error('No user.');
    }

    const newAccessToken = await generateToken(
      { useId: user._id.toString() },
      '1m'
    );

    res.json({
      accessToken: newAccessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(401);
    next(err);
  }
});

export default router;
