import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// @Routes                  POST api/auth/register
// @description              register new user
// @access                  public

router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
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
  } catch (err) {}
});

export default router;
