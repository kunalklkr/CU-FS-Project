const User = require('../models/User');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/jwt');
const logger = require('../utils/logger');

const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const user = await User.create({
      email,
      password,
      name,
      role: 'Viewer' // Default role
    });

    logger.info('User registered', {
      correlationId: req.correlationId,
      userId: user._id,
      email: user.email
    });

    res.status(201).json({
      message: 'User registered successfully',
      user
    });
  } catch (error) {
    logger.error('Registration error', {
      error: error.message,
      correlationId: req.correlationId
    });
    res.status(500).json({ error: 'Registration failed' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);

    // Store refresh token
    user.refreshTokens.push({
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });
    await user.save();

    // Set httpOnly cookies
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000 // 15 minutes
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    logger.info('User logged in', {
      correlationId: req.correlationId,
      userId: user._id,
      email: user.email
    });

    res.json({
      message: 'Login successful',
      user,
      accessToken,
      refreshToken
    });
  } catch (error) {
    logger.error('Login error', {
      error: error.message,
      correlationId: req.correlationId
    });
    res.status(500).json({ error: 'Login failed' });
  }
};

const refresh = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token required' });
    }

    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    const user = await User.findById(decoded.userId);
    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Verify token exists in user's refresh tokens
    const tokenExists = user.refreshTokens.some(t => t.token === refreshToken);
    if (!tokenExists) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    const newAccessToken = generateAccessToken(user._id, user.role);

    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000
    });

    res.json({
      message: 'Token refreshed',
      accessToken: newAccessToken
    });
  } catch (error) {
    logger.error('Token refresh error', {
      error: error.message,
      correlationId: req.correlationId
    });
    res.status(500).json({ error: 'Token refresh failed' });
  }
};

const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (refreshToken && req.user) {
      const user = await User.findById(req.user.userId);
      if (user) {
        user.refreshTokens = user.refreshTokens.filter(t => t.token !== refreshToken);
        await user.save();
      }
    }

    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    logger.info('User logged out', {
      correlationId: req.correlationId,
      userId: req.user?.userId
    });

    res.json({ message: 'Logout successful' });
  } catch (error) {
    logger.error('Logout error', {
      error: error.message,
      correlationId: req.correlationId
    });
    res.status(500).json({ error: 'Logout failed' });
  }
};

const me = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    res.json({ user });
  } catch (error) {
    logger.error('Get current user error', {
      error: error.message,
      correlationId: req.correlationId
    });
    res.status(500).json({ error: 'Failed to get user' });
  }
};

module.exports = {
  register,
  login,
  refresh,
  logout,
  me
};
