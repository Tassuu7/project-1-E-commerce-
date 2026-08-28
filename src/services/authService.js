/**
 * Authentication & Account Management Domain Service
 * OmniCommerce Enterprise
 */

const { userRepository } = require('../repositories');
const { generateToken } = require('../middleware/auth');
const { hashPassword } = require('../utils/helpers');
const Validator = require('../utils/validator');
const logger = require('../utils/logger');

class AuthService {
  static register(userData = {}) {
    const validation = Validator.validateRegistration(userData);
    if (!validation.valid) {
      const err = new Error('Registration validation failed.');
      err.statusCode = 400;
      err.errors = validation.errors;
      throw err;
    }

    const existingUser = userRepository.findOne(u => u.email === userData.email.toLowerCase().trim());
    if (existingUser) {
      const err = new Error('An account with this email address already exists.');
      err.statusCode = 409;
      throw err;
    }

    const newUser = userRepository.create(userData);
    logger.info(`New user registered: ${newUser.email}`);
    const token = generateToken(newUser);

    return {
      user: newUser.toJSON(),
      token
    };
  }

  static login(email, password) {
    if (!email || !password) {
      const err = new Error('Email and password are required.');
      err.statusCode = 400;
      throw err;
    }

    const user = userRepository.findOne(u => u.email === email.toLowerCase().trim());
    if (!user) {
      const err = new Error('Invalid email or password.');
      err.statusCode = 401;
      throw err;
    }

    const hashedInput = hashPassword(password);
    if (user.passwordHash !== hashedInput) {
      const err = new Error('Invalid email or password.');
      err.statusCode = 401;
      throw err;
    }

    const token = generateToken(user);
    logger.info(`User logged in successfully: ${user.email}`);

    return {
      user: user.toJSON(),
      token
    };
  }

  static getUserProfile(userId) {
    const user = userRepository.findById(userId);
    if (!user) {
      const err = new Error('User not found.');
      err.statusCode = 404;
      throw err;
    }
    return user.toJSON();
  }
}

module.exports = AuthService;
