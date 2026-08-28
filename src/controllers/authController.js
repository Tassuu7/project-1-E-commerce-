/**
 * Authentication REST API Controller
 * OmniCommerce Enterprise
 */

const AuthService = require('../services/authService');

class AuthController {
  static register(req, res, next) {
    try {
      const result = AuthService.register(req.body);
      res.status(201).json({
        success: true,
        message: 'User account created successfully.',
        data: result
      });
    } catch (err) {
      next(err);
    }
  }

  static login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = AuthService.login(email, password);
      res.status(200).json({
        success: true,
        message: 'Login successful.',
        data: result
      });
    } catch (err) {
      next(err);
    }
  }

  static getProfile(req, res, next) {
    try {
      const profile = AuthService.getUserProfile(req.user.id);
      res.status(200).json({
        success: true,
        data: profile
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = AuthController;
