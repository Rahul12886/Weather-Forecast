import User from '../models/User.js';
import {
  compareMemoryPassword,
  createMemoryUser,
  findMemoryUserByEmail,
  isMemoryMode,
} from '../services/memoryStore.js';
import generateToken from '../utils/generateToken.js';

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
});

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    if (isMemoryMode()) {
      const user = await createMemoryUser({ name, email, password });

      if (!user) {
        return res.status(409).json({ message: 'Email is already registered' });
      }

      return res.status(201).json({
        user: sanitizeUser(user),
        token: generateToken(user._id),
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ message: 'Email is already registered' });
    }

    const user = await User.create({ name, email, password });

    res.status(201).json({
      user: sanitizeUser(user),
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    if (isMemoryMode()) {
      const user = findMemoryUserByEmail(email);

      if (!user || !(await compareMemoryPassword(password, user.password))) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      return res.json({
        user: sanitizeUser(user),
        token: generateToken(user._id),
      });
    }

    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      user: sanitizeUser(user),
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
};

export const getProfile = (req, res) => {
  res.json({ user: sanitizeUser(req.user) });
};
